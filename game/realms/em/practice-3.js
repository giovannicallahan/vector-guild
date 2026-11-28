/* Electricity and magnetism: fields practice missions, file 3 of 8: concepts q11–q15, three practice missions each
   (q11b q11c q11d q12b q12c q12d q13b q13c q13d q14b q14c q14d q15b q15c q15d).
   Format and rules: docs/PACK-FORMAT.md, "Practice missions" (§10).
     b  kind 'setting'    the same skill in a new real-world setting
     c  kind 'applied'    a word problem with two or three steps (two or three guided steps)
     d  kind 'challenge'  harder numbers, or the skill combined with one earlier concept (optional `uses: 'qNN'`)
   A practice mission supplies only: id, parent, kind, title, brief, prompt, answer, labels, tolerance, hints,
   solution, guidance (and `uses` for a challenge). Everything else comes from its parent, the learn mission:
   topic, tier, xp, sector, lesson, teaching, sources, the concept bench and the review drill. Do not write those.
   Each mission is registered together with its generator by add(mission, generator); build(canonical) must
   reproduce the authored prompt, hints, solution and guidance exactly. Oracles: qa/realms/em/oracle-p3.js. */
(function(){
'use strict';
const G = window.Gen, { n, plus, par } = G;
const PRACTICE = window.PRACTICE = window.PRACTICE || [];
const GEN = window.MISSION_GEN = window.MISSION_GEN || {};
/* Registers one practice mission and its generator {canonical, draw(R), build(p)}. */
const add = (mission, generator) => { PRACTICE.push(mission); GEN[mission.id] = generator; };

/* Builds the authored mission from build(canonical), so the authored text and the generator cannot drift apart.
   meta: id, parent, kind, title, brief, labels, tolerance, gl (labels of each guided step), uses (optional). */
const mk = (meta, gen) => {
 const b = gen.build(gen.canonical), { gl, ...m } = meta;
 add({ ...m, prompt: b.prompt, answer: b.answer, hints: b.hints, solution: b.solution,
  guidance: b.guidance.map((g, i) => ({ prompt: g.prompt, answer: g.answer, labels: gl[i], explanation: g.explanation })) }, gen);
};
/* Constants as the prompts print them. */
const EPS = 8.85e-12, K = 8.99e9, QE = 1.6e-19, MP = 1.67e-27, MHE = 6.64e-27, ME = 9.11e-31;
/* Round to 2 decimal places; tie2 is true when x sits on (or near) a rounding tie at the 2nd place. */
const rd2 = x => Math.round(x * 100 + (x >= 0 ? 1e-9 : -1e-9)) / 100;
const tie2 = x => Math.abs(Math.abs(x * 100) % 1 - 0.5) < 1e-3;
/* A bounded retry: at most 1000 tries, then the canonical parameters. */
const tries = (make, ok, fallback) => { for (let i = 0; i < 1000; i++) { const p = make(); if (ok(p)) return p; } return { ...fallback }; };
/* Polynomial terms: trm(−9, 'x²') is '− 9x²', trm(2, 'x³', true) is '2x³'; a coefficient of 1 is not written out. */
const trm = (v, x, first) => { const a = Math.abs(v), c = a === 1 ? '' : n(a); return first ? `${v < 0 ? '−' : ''}${c}${x}` : `${v < 0 ? '−' : '+'} ${c}${x}`; };
const cst = v => `${v < 0 ? '−' : '+'} ${n(Math.abs(v))}`;
/* Direction words for a radial field. */
const way = (E, axis) => E > 0 ? `away from the ${axis ? 'axis' : 'centre'}` : `towards the ${axis ? 'axis' : 'centre'}`;
const rr = x => Math.round(x * 1e6) / 1e6;

/* ---- q11 Chapter review: choose the Gaussian surface [6.2, 6.3] ---- */

/* A sealed capsule: bead q1 (nC) at the centre, a thin wall of radius R (tenths of a metre) carrying an unknown charge; the probe at r (tenths,
   outside the wall) reads a radial field E (N/C, signed). Enclosed charge E·4πε₀r², wall charge = enclosed − bead. Not the parent's rig (bead 4 nC, shell 0.5 m, probe at 0.2 and 0.8). */
mk({
 id: 'q11b', parent: 'q11', kind: 'setting', title: 'Reading the sealed capsule',
 brief: 'A sealed capsule is going into the dome, and its label has lost the charge on the wall, so the crew will work it out from one probe reading.',
 labels: ['charge inside (nC)', 'wall charge (nC)'], tolerance: 0.005,
 gl: [['charge inside (nC)'], ['wall charge (nC)']]
}, {
 canonical: { q1: 3, R: 4, r: 7, E: -60 },
 draw: R => tries(() => { const Rr = R.int(3, 6); return { q1: R.nz(-9, 9), R: Rr, r: R.int(Rr + 1, 10), E: (R.bool() ? 1 : -1) * R.int(15, 300) }; },
  p => { const Q = p.E * 4 * Math.PI * EPS * (p.r / 10) ** 2 * 1e9; return !tie2(Q) && Math.abs(Q - p.q1) > 0.5 && !(p.q1 === 3 && p.R === 4 && p.r === 7 && p.E === -60); },
  { q1: 3, R: 4, r: 7, E: -60 }),
 build: ({ q1, R, r, E }) => { const rm = r / 10, Q = E * 4 * Math.PI * EPS * rm * rm * 1e9, Qn = rd2(Q), wall = rd2(Q - q1);
  return {
   prompt: `A sealed spherical capsule in the Shield Dome holds a small charged bead of ${n(q1)} nC at its centre. Its thin metal wall, of radius ${n(R / 10)} m, carries an unknown charge spread evenly over it. A probe ${n(rm)} m from the centre reads a radial field of ${n(E)} N/C (a negative reading means the field points towards the centre). Use ε₀ = 8.85 × 10⁻¹² C²/(N·m²). Enter the total charge inside a Gaussian sphere through the probe, then the charge on the wall, both in nC to 2 decimal places (a negative charge is a negative number).`,
   answer: [Qn, wall],
   hints: ['Draw a Gaussian sphere through the probe with the same centre as the bead. The field is the same size all over it and straight out or in, so the flux is E × 4πr², and Gauss’s law makes that Q_enc ÷ ε₀. So Q_enc = E × 4πε₀r².', 'The probe is outside the wall, so the sphere encloses the bead and the wall together. What the bead does not account for is the wall’s charge. Remember 1 nC = 10⁻⁹ C.'],
   solution: `The probe is outside the wall, so a Gaussian sphere through it encloses the bead and the wall. Gauss's law gives Q_enc = E × 4πε₀r² = ${par(E)} × 4π × 8.85 × 10⁻¹² × ${n(rm * rm)} C, which is ${n(Qn)} nC to 2 decimal places. The wall holds the rest: ${n(Qn)} − ${par(q1)} = ${n(wall)} nC.`,
   guidance: [
    { prompt: `The field on the Gaussian sphere of radius ${n(rm)} m is ${n(E)} N/C, straight out or in. Use Q_enc = E × 4πε₀r². How much charge is inside the sphere, in nC to 2 decimal places?`, answer: [Qn], explanation: `${par(E)} × 4π × 8.85 × 10⁻¹² × ${n(rm * rm)} C is ${n(Qn)} nC to 2 decimal places.` },
    { prompt: `The bead carries ${n(q1)} nC and the wall is the only other charge inside the sphere. How much charge is on the wall, in nC?`, answer: [wall], explanation: `${n(Qn)} − ${par(q1)} = ${n(wall)} nC.` }
   ] }; }
});

/* A coaxial cable: wire l1 and sleeve l2 (nC per metre, signed), sleeve radius a (tenths of a metre), grain at r (tenths, outside the sleeve)
   carrying qg (nC, |qg| ≥ 2 so that the force box never equals the field box). E = λ_enc ÷ (2πε₀r); F = qg·E in nN, from the unrounded E. */
mk({
 id: 'q11c', parent: 'q11', kind: 'applied', title: 'The coaxial cable probe',
 brief: 'A dust grain has drifted next to the coaxial cable of the Power Hall, and the crew wants the push on it before the cable is switched on.',
 labels: ['enclosed (nC per metre)', 'field (N/C)', 'force (nN)'], tolerance: 0.005,
 gl: [['enclosed (nC per metre)'], ['field (N/C)'], ['force (nN)']]
}, {
 canonical: { l1: 6, l2: -2, a: 3, r: 9, qg: 4 },
 draw: R => tries(() => { const a = R.int(2, 5); return { l1: R.nz(-9, 9), l2: R.nz(-9, 9), a, r: R.int(a + 2, 12), qg: R.nz(-9, 9) }; },
  p => { const E = (p.l1 + p.l2) * 1e-9 / (2 * Math.PI * EPS * p.r / 10); return p.l1 + p.l2 !== 0 && Math.abs(p.qg) >= 2 && !tie2(E) && !tie2(E * p.qg) && !(p.l1 === 5 && p.l2 === -8); },
  { l1: 6, l2: -2, a: 3, r: 9, qg: 4 }),
 build: ({ l1, l2, a, r, qg }) => { const rm = r / 10, L = l1 + l2, E = L * 1e-9 / (2 * Math.PI * EPS * rm), E2 = rd2(E), F = rd2(E * qg);
  return {
   prompt: `A long coaxial cable in the Power Hall has a straight inner wire carrying ${n(l1)} nC per metre and, around it, a thin metal sleeve of radius ${n(a / 10)} m carrying ${n(l2)} nC per metre spread evenly over it. Treat the cable as infinitely long and use ε₀ = 8.85 × 10⁻¹² C²/(N·m²). A dust grain carrying ${n(qg)} nC sits ${n(rm)} m from the axis, outside the sleeve. Enter the charge per metre enclosed by a Gaussian cylinder through the grain, in nC per metre. Then enter the radial component of the field at the grain in N/C, and the radial component of the force on the grain in nN (1 nN = 10⁻⁹ N, and use the unrounded field), both to 2 decimal places (type them without commas). A positive value points away from the axis and a negative value points towards it.`,
   answer: [L, E2, F],
   hints: ['A Gaussian cylinder around the axis, through the grain, is wider than the sleeve, so it encloses the wire and the sleeve together. Add their charges per metre, keeping the signs.', 'Over the curved side of a cylinder of radius r, E = λ_enc ÷ (2πε₀r). The force on a charge in a field is F = qE, with the sign of q kept; a charge in nC and a field in N/C give a force in nN.'],
   solution: `A Gaussian cylinder of radius ${n(rm)} m is outside the sleeve, so it encloses the wire and the sleeve: ${n(l1)} + ${par(l2)} = ${n(L)} nC per metre. Then E = λ_enc ÷ (2πε₀r) = ${n(L)} × 10⁻⁹ ÷ (2π × 8.85 × 10⁻¹² × ${n(rm)}), which is ${n(E2)} N/C to 2 decimal places, pointing ${way(E, true)}. The force is F = qE = ${par(qg)} nC × ${par(E)} N/C, which is ${n(F)} nN to 2 decimal places, ${F > 0 ? 'pointing away from the axis' : 'pointing towards the axis'}.`,
   guidance: [
    { prompt: `The wire carries ${n(l1)} nC per metre and the sleeve ${n(l2)} nC per metre, and both lie inside the Gaussian cylinder. How much charge per metre does it enclose, in nC per metre?`, answer: [L], explanation: `${n(l1)} + ${par(l2)} = ${n(L)} nC per metre.` },
    { prompt: `Use E = λ_enc ÷ (2πε₀r) with r = ${n(rm)} m. What is the radial field at the grain, in N/C to 2 decimal places?`, answer: [E2], explanation: `${n(L)} × 10⁻⁹ ÷ (2π × 8.85 × 10⁻¹² × ${n(rm)}) gives ${n(E2)} N/C to 2 decimal places. The sign says it points ${way(E, true)}.` },
    { prompt: `Use F = qE with q = ${n(qg)} nC and the unrounded field. What is the radial force on the grain, in nN to 2 decimal places?`, answer: [F], explanation: `${par(qg)} × ${par(E)} gives ${n(F)} nN to 2 decimal places.` }
   ] }; }
});

/* Three nested spherical parts: bead q1, thin shell of radius a (tenths) carrying q2, thin shell of radius b carrying q3, all in nC.
   r1 lies between the shells (a < r1 < b), r2 outside both (r2 > b). The enclosed charges q1+q2 and q1+q2+q3 are never 0. */
mk({
 id: 'q11d', parent: 'q11', kind: 'challenge', uses: 'q08', title: 'Three layers in the test rig',
 brief: 'The test rig now nests a bead inside two shells, and the crew wants the field in the gap and both the flux and the field out beyond the rig.',
 labels: ['field in the gap (N/C)', 'flux out (N·m²/C)', 'field outside (N/C)'], tolerance: 0.005,
 gl: [['field in the gap (N/C)'], ['flux out (N·m²/C)'], ['field outside (N/C)']]
}, {
 canonical: { q1: 5, q2: -3, q3: 6, a: 3, b: 6, r1: 4, r2: 9 },
 draw: R => tries(() => { const a = R.int(2, 4), b = R.int(a + 3, 8); return { q1: R.nz(-9, 9), q2: R.nz(-9, 9), q3: R.nz(-9, 9), a, b, r1: R.int(a + 1, b - 1), r2: R.int(b + 1, 12) }; },
  p => { const Q = p.q1 + p.q2 + p.q3, Eg = (p.q1 + p.q2) * 1e-9 / (4 * Math.PI * EPS * (p.r1 / 10) ** 2), fl = Q * 1e-9 / EPS, Eo = fl / (4 * Math.PI * (p.r2 / 10) ** 2);
   return p.q1 + p.q2 !== 0 && Q !== 0 && !tie2(Eg) && !tie2(fl) && !tie2(Eo) && p.q1 !== p.q3; },
  { q1: 5, q2: -3, q3: 6, a: 3, b: 6, r1: 4, r2: 9 }),
 build: ({ q1, q2, q3, a, b, r1, r2 }) => { const x1 = r1 / 10, x2 = r2 / 10, Qg = q1 + q2, Q = q1 + q2 + q3,
   Eg = Qg * 1e-9 / (4 * Math.PI * EPS * x1 * x1), fl = Q * 1e-9 / EPS, Eo = fl / (4 * Math.PI * x2 * x2), Eg2 = rd2(Eg), fl2 = rd2(fl), Eo2 = rd2(Eo);
  return {
   prompt: `Three charged parts of a test rig in the Shield Dome share one centre: a small bead carrying ${n(q1)} nC, a thin spherical shell of radius ${n(a / 10)} m carrying ${n(q2)} nC and a thin spherical shell of radius ${n(b / 10)} m carrying ${n(q3)} nC, each spread evenly over its shell. Use ε₀ = 8.85 × 10⁻¹² C²/(N·m²). Enter the radial component of the field ${n(x1)} m from the centre, in N/C. Then, for a Gaussian sphere of radius ${n(x2)} m about the same centre, enter the net flux out of it in N·m²/C, and then the radial component of the field on it in N/C (use the unrounded flux). Give all three to 2 decimal places and type them without commas. A positive field points away from the centre and a negative field points towards it; a negative flux means more flux goes in than out.`,
   answer: [Eg2, fl2, Eo2],
   hints: ['Between the two shells a Gaussian sphere encloses the bead and the inner shell only; the outer shell is outside it and adds nothing. Use E = Q_enc ÷ (4πε₀r²) with 1 nC = 10⁻⁹ C.', 'Gauss’s law says the net flux out of a closed surface is Q_enc ÷ ε₀. On a sphere the field is the same size everywhere and straight out or in, so flux = E × 4πr², and E = flux ÷ (4πr²).'],
   solution: `Between the shells a Gaussian sphere of radius ${n(x1)} m encloses the bead and the inner shell: ${n(q1)} + ${par(q2)} = ${n(Qg)} nC. So E = ${n(Qg)} × 10⁻⁹ ÷ (4π × 8.85 × 10⁻¹² × ${n(x1 * x1)}), which is ${n(Eg2)} N/C to 2 decimal places, pointing ${way(Eg)}. A Gaussian sphere of radius ${n(x2)} m encloses all three: ${n(q1)} + ${par(q2)} + ${par(q3)} = ${n(Q)} nC. The net flux out is Q_enc ÷ ε₀ = ${n(Q)} × 10⁻⁹ ÷ (8.85 × 10⁻¹²), which is ${n(fl2)} N·m²/C to 2 decimal places. The field on that sphere is flux ÷ (4πr²) = ${n(fl)} ÷ (4π × ${n(x2 * x2)}), which is ${n(Eo2)} N/C to 2 decimal places, pointing ${way(Eo)}.`,
   guidance: [
    { prompt: `A Gaussian sphere of radius ${n(x1)} m lies between the shells, so it encloses the bead and the inner shell. Use E = Q_enc ÷ (4πε₀r²). What is the radial field there, in N/C to 2 decimal places?`, answer: [Eg2], explanation: `Q_enc = ${n(q1)} + ${par(q2)} = ${n(Qg)} nC, so E = ${n(Qg)} × 10⁻⁹ ÷ (4π × 8.85 × 10⁻¹² × ${n(x1 * x1)}) = ${n(Eg2)} N/C to 2 decimal places.` },
    { prompt: `A Gaussian sphere of radius ${n(x2)} m lies outside both shells, so it encloses all three charges. What is the net flux out of it, in N·m²/C to 2 decimal places?`, answer: [fl2], explanation: `The enclosed charge is ${n(Q)} nC, and flux = Q_enc ÷ ε₀ = ${n(Q)} × 10⁻⁹ ÷ (8.85 × 10⁻¹²) = ${n(fl2)} N·m²/C to 2 decimal places.` },
    { prompt: `The flux through that sphere is E × 4πr². Use the unrounded flux. What is the radial field on the sphere of radius ${n(x2)} m, in N/C to 2 decimal places?`, answer: [Eo2], explanation: `E = flux ÷ (4πr²) = ${n(fl)} ÷ (4π × ${n(x2 * x2)}) = ${n(Eo2)} N/C to 2 decimal places.` }
   ] }; }
});

/* ---- q12 Electric potential energy of two charges [7.1] ---- */

/* Separations r (cm) from a list; the pair's charges: q1 (μC, signed) and U (mJ, signed integer) are given and the other charge is found:
   q2 = U·r ÷ (8.99·q1) (r in m). Second answer: pulling the pair slowly apart to very far is W = 0 − U. Not the parent's grain and clip. */
const RC = [10, 15, 20, 25, 30, 40, 50];
/* q12c: separations (m) for which 8.99·q1·q2 ÷ r has at most 2 decimals. u12: the three pair energies (mJ) of three beads at 0, a and b cm. */
const D12 = [0.1, 0.2, 0.25, 0.5];
const u12 = ({ q1, q2, q3, a, b }) => { const U12 = 8.99 * q1 * q2 / (a / 100), U13 = 8.99 * q1 * q3 / (b / 100), U23 = 8.99 * q2 * q3 / ((b - a) / 100); return { U12, T: U12 + U13 + U23 }; };
mk({
 id: 'q12b', parent: 'q12', kind: 'setting', title: 'The unknown steel ball',
 brief: 'Two steel balls in the ore sorter have been charged, only one of their charges is on the log sheet, and the crew wants the other one and the cost of pulling them apart.',
 labels: ['other charge (μC)', 'work to separate (mJ)'], tolerance: 0.005,
 gl: [['other charge (μC)'], ['work to separate (mJ)']]
}, {
 canonical: { q1: 4, U: -300, r: 25 },
 draw: R => tries(() => ({ q1: R.nz(-9, 9), U: (R.bool() ? 1 : -1) * 10 * R.int(5, 90), r: R.pick(RC) }),
  p => { const q2 = p.U * p.r / 100 / (8.99 * p.q1); return Math.abs(q2) >= 0.5 && Math.abs(q2) <= 25 && !tie2(q2) && !(p.q1 === 4 && p.U === -300 && p.r === 25); },
  { q1: 4, U: -300, r: 25 }),
 build: ({ q1, U, r }) => { const rm = r / 100, q2 = U * rm / (8.99 * q1), q2r = rd2(q2), W = -U;
  return {
   prompt: `Two charged steel balls in the ore sorter are held ${n(rm)} m apart. One carries ${n(q1)} μC. Together the pair stores an electric potential energy of ${n(U)} mJ (1 mJ = 0.001 J), counting 0 when the balls are very far apart. Use k = 8.99 × 10⁹ N·m²/C². Enter the charge on the other ball in μC to 2 decimal places (it may be negative). Then enter the work in mJ that an outside force must do to pull the two balls slowly apart until they are very far apart.`,
   answer: [q2r, W],
   hints: ['Potential energy is U = kq₁q₂ ÷ r. With the charges in μC and r in metres, U = 8.99 × q₁ × q₂ ÷ r in mJ, so q₂ = U × r ÷ (8.99 × q₁).', 'When the balls are very far apart their potential energy is 0. Moving slowly, the outside force’s work is U at the end minus U at the start.'],
   solution: `With the charges in μC, U = 8.99 × q₁ × q₂ ÷ r in mJ, so q₂ = U × r ÷ (8.99 × q₁) = ${par(U)} × ${n(rm)} ÷ (8.99 × ${par(q1)}), which is ${n(q2r)} μC to 2 decimal places. Very far apart, the potential energy is 0. The outside force’s work is U at the end minus U at the start: 0 − ${par(U)} = ${n(W)} mJ.`,
   guidance: [
    { prompt: `Rearrange U = 8.99 × q₁ × q₂ ÷ r (charges in μC, r in metres, U in mJ) for q₂, with U = ${n(U)} mJ, q₁ = ${n(q1)} μC and r = ${n(rm)} m. What is q₂, in μC to 2 decimal places?`, answer: [q2r], explanation: `q₂ = U × r ÷ (8.99 × q₁) = ${par(U)} × ${n(rm)} ÷ (8.99 × ${par(q1)}) = ${n(q2r)} μC to 2 decimal places.` },
    { prompt: `The potential energy is 0 when the balls are very far apart. The outside force’s work is U at the end minus U at the start. What is it, in mJ?`, answer: [W], explanation: `0 − ${par(U)} = ${n(W)} mJ.` }
   ] }; }
});

/* Two positive charges q1, q2 (μC); grain of mass m (mg) released from rest at r (m, from D so U has at most 2 decimals) from the fixed clip.
   U = 8.99·q1·q2 ÷ r mJ; at very far away all of it is kinetic: v = √(2U ÷ m) with U in J and m in kg, i.e. √(2000·U ÷ m) m/s. */
mk({
 id: 'q12c', parent: 'q12', kind: 'applied', title: 'Let go of the grain',
 brief: 'A charged dust grain is held beside a fixed charged clip, and the crew wants to know how fast it flies off when the holder lets go.',
 labels: ['potential energy (mJ)', 'speed far away (m/s)'], tolerance: 0.005,
 gl: [['potential energy (mJ)'], ['speed far away (m/s)']]
}, {
 canonical: { q1: 3, q2: 4, i: 3, m: 5 },
 draw: R => tries(() => ({ q1: R.int(1, 9), q2: R.int(1, 9), i: R.int(0, 3), m: R.int(1, 9) }),
  p => { const U = 8.99 * p.q1 * p.q2 / D12[p.i]; return p.q1 !== p.q2 && !tie2(Math.sqrt(2000 * U / p.m)) && !(p.q1 === 3 && p.q2 === 4 && p.i === 3 && p.m === 5); },
  { q1: 3, q2: 4, i: 3, m: 5 }),
 build: ({ q1, q2, i, m }) => { const r = D12[i], U = rr(8.99 * q1 * q2 / r), v = rd2(Math.sqrt(2000 * 8.99 * q1 * q2 / r / m));
  return {
   prompt: `A dust grain of mass ${n(m)} mg (1 mg = 10⁻⁶ kg) carrying ${n(q1)} μC is held ${n(r)} m from a fixed clip carrying ${n(q2)} μC; both charges are positive. Use k = 8.99 × 10⁹ N·m²/C², and take the potential energy to be 0 when the charges are very far apart. The holder lets go, the clip does not move and nothing else acts on the grain, so it is pushed away. Enter the electric potential energy of the pair at the moment of release, in mJ (1 mJ = 0.001 J). Then enter the speed the grain reaches when it is very far away, in m/s to 2 decimal places (type it without commas).`,
   answer: [U, v],
   hints: ['The potential energy of two point charges is U = kq₁q₂ ÷ r. With the charges in μC and r in metres, U = 8.99 × q₁ × q₂ ÷ r in mJ; like charges give a positive U.', 'Very far away the potential energy is 0, so by conservation of energy all of U has become kinetic energy ½mv². Turn mJ into joules and mg into kilograms before solving for v.'],
   solution: `With the charges in μC, U = 8.99 × q₁ × q₂ ÷ r in mJ: 8.99 × ${n(q1)} × ${n(q2)} ÷ ${n(r)} = ${n(U)} mJ, which is ${n(U)} × 10⁻³ J. Far away the potential energy is 0, so all of it has become kinetic energy: ½mv² = ${n(U)} × 10⁻³ J, with m = ${n(m)} × 10⁻⁶ kg. Then v = √(2 × ${n(U)} × 10⁻³ ÷ (${n(m)} × 10⁻⁶)), which is ${n(v)} m/s to 2 decimal places.`,
   guidance: [
    { prompt: `Put the charges and the separation ${n(r)} m into U = 8.99 × q₁ × q₂ ÷ r (charges in μC, U in mJ). What is U, in mJ?`, answer: [U], explanation: `8.99 × ${n(q1)} × ${n(q2)} ÷ ${n(r)} = ${n(U)} mJ.` },
    { prompt: `All of ${n(U)} mJ (${n(U)} × 10⁻³ J) becomes kinetic energy ½mv² of a grain of mass ${n(m)} × 10⁻⁶ kg. What is v, in m/s to 2 decimal places?`, answer: [v], explanation: `v = √(2 × ${n(U)} × 10⁻³ ÷ (${n(m)} × 10⁻⁶)) = ${n(v)} m/s to 2 decimal places.` }
   ] }; }
});

/* Three beads on a rail at x = 0, a and b (cm): U_total = Σ over pairs of 8.99·qi·qj ÷ r (mJ). W = U12 − U_total = −(U13 + U23): the work to pull bead 3
   far away. Distances are in whole tens of cm, so each pair term has at most 3 decimals; both answers are rounded to 2 places and never sit on a tie. */
mk({
 id: 'q12d', parent: 'q12', kind: 'challenge', uses: 'q03', title: 'Three beads on the rail',
 brief: 'Three charged beads are fixed on a rail, and the crew wants the energy of the whole group and the cost of pulling one of them away.',
 labels: ['energy of the group (mJ)', 'work to remove bead 3 (mJ)'], tolerance: 0.005,
 gl: [['energy of bead pair 1 and 2 (mJ)'], ['energy of the group (mJ)'], ['work to remove bead 3 (mJ)']]
}, {
 canonical: { q1: 4, q2: -3, q3: 2, a: 20, b: 50 },
 draw: R => tries(() => { const a = 10 * R.int(1, 4); return { q1: R.nz(-6, 6), q2: R.nz(-6, 6), q3: R.nz(-6, 6), a, b: a + 10 * R.int(1, 4) }; },
  p => { const t = u12(p), W = t.U12 - t.T; return !tie2(t.U12) && !tie2(t.T) && !tie2(W) && Math.abs(t.T) > 0.5 && Math.abs(W) > 0.5; },
  { q1: 4, q2: -3, q3: 2, a: 20, b: 50 }),
 build: p => { const { q1, q2, q3, a, b } = p, t = u12(p), x = a / 100, y = b / 100, W = rd2(t.U12 - t.T), T = rd2(t.T), U12 = rd2(t.U12);
  return {
   prompt: `Three charged beads are fixed on a straight rail in the Accelerator Bay: ${n(q1)} μC at x = 0, ${n(q2)} μC at x = ${n(x)} m and ${n(q3)} μC at x = ${n(y)} m. Use k = 8.99 × 10⁹ N·m²/C², and take the potential energy to be 0 when all three are very far apart. The electric potential energy of a group of point charges is the sum of kq_iq_j ÷ r_ij over every pair, each pair counted once. Enter the potential energy of the group, then the work an outside force must do to pull the third bead (the one at x = ${n(y)} m) slowly away to a very great distance, leaving the other two where they are. Both are in mJ to 2 decimal places, may be negative, and are typed without commas.`,
   answer: [T, W],
   hints: ['List the three pairs: beads 1 and 2, beads 1 and 3, beads 2 and 3. Each pair has U = kq_iq_j ÷ r with its own distance (never negative) and the signs of both charges; with the charges in μC and r in metres, U = 8.99 × q_i × q_j ÷ r in mJ.', 'The outside force’s work is U at the end minus U at the start. When bead 3 is very far away, only the pair of beads 1 and 2 still has any potential energy.'],
   solution: `The distances are ${n(x)} m (beads 1 and 2), ${n(y)} m (beads 1 and 3) and ${n(rr(y - x))} m (beads 2 and 3). The pair energies are 8.99 × ${par(q1)} × ${par(q2)} ÷ ${n(x)} = ${n(rr(8.99 * q1 * q2 / x))} mJ, 8.99 × ${par(q1)} × ${par(q3)} ÷ ${n(y)} = ${n(rr(8.99 * q1 * q3 / y))} mJ and 8.99 × ${par(q2)} × ${par(q3)} ÷ ${n(rr(y - x))} = ${n(rr(8.99 * q2 * q3 / (y - x)))} mJ. Their sum is ${n(T)} mJ to 2 decimal places. With bead 3 far away only the first pair is left, with ${n(rr(t.U12))} mJ, so the work is that minus the total: ${n(rr(t.U12))} − ${par(rr(t.T))} = ${n(W)} mJ to 2 decimal places.`,
   guidance: [
    { prompt: `Start with beads 1 and 2, ${n(x)} m apart. What is their pair energy 8.99 × q₁ × q₂ ÷ r, in mJ to 2 decimal places?`, answer: [U12], explanation: `8.99 × ${par(q1)} × ${par(q2)} ÷ ${n(x)} = ${n(U12)} mJ to 2 decimal places.` },
    { prompt: `Beads 1 and 3 are ${n(y)} m apart and beads 2 and 3 are ${n(rr(y - x))} m apart. Add the energies of all three pairs, using the unrounded values. What is the energy of the group, in mJ to 2 decimal places?`, answer: [T], explanation: `${n(rr(8.99 * q1 * q2 / x))} + ${par(rr(8.99 * q1 * q3 / y))} + ${par(rr(8.99 * q2 * q3 / (y - x)))} = ${n(T)} mJ to 2 decimal places.` },
    { prompt: `With bead 3 very far away, only beads 1 and 2 still store energy. The outside force’s work is the energy then minus the energy of the group now, using the unrounded values. What is it, in mJ to 2 decimal places?`, answer: [W], explanation: `${n(rr(t.U12))} − ${par(rr(t.T))} = ${n(W)} mJ to 2 decimal places.` }
   ] }; }
});

/* ---- q13 Potential difference, the volt and the electron-volt [7.2] ---- */

/* An electron gun: electrons (charge e, mass 9.11 × 10⁻³¹ kg) must leave at v km/s; the energy is ½mv² and the potential difference is that over e.
   v is a multiple of 500 km/s up to 30000 km/s (about a tenth of the speed of light, so relativity is ignored). */
mk({
 id: 'q13b', parent: 'q13', kind: 'setting', title: 'Setting the electron gun',
 brief: 'The ore scanner needs its electrons to leave the gun at a set speed, and the crew has to dial in the voltage that gives it.',
 labels: ['energy (× 10⁻¹⁷ J)', 'potential difference (V)'], tolerance: 0.005,
 gl: [['energy (× 10⁻¹⁷ J)'], ['potential difference (V)']]
}, {
 canonical: { v: 18000 },
 draw: R => tries(() => ({ v: 500 * R.int(16, 60) }), p => { const K0 = 0.5 * ME * (p.v * 1000) ** 2; return !tie2(K0 / 1e-17) && !tie2(K0 / QE) && p.v !== 18000; }, { v: 18000 }),
 build: ({ v }) => { const K0 = 0.5 * ME * (v * 1000) ** 2, E17 = rd2(K0 / 1e-17), V = rd2(K0 / QE);
  return {
   prompt: `The electron gun of the ore scanner releases electrons (charge e, mass 9.11 × 10⁻³¹ kg) from rest and accelerates them through a potential difference between the cathode and the anode. The scanner needs the electrons to leave at a speed of ${n(v)} km/s. Use e = 1.60 × 10⁻¹⁹ C and ignore relativity. Enter the kinetic energy each electron must gain, as the number that multiplies 10⁻¹⁷ J, then the size of the potential difference needed, in V. Both are to 2 decimal places; type them without commas.`,
   answer: [E17, V],
   hints: ['Turn km/s into m/s (multiply by 1000), then the kinetic energy gained from rest is ½mv² in joules. Write it as a number times 10⁻¹⁷ J.', 'A charge e falling through a potential difference ΔV gains eΔV, so ΔV = energy ÷ e. Use the unrounded energy in joules and e = 1.60 × 10⁻¹⁹ C.'],
   solution: `The speed is ${n(v * 1000)} m/s, so the electron gains ½mv² = ½ × 9.11 × 10⁻³¹ × (${n(v * 1000)})², which is ${n(E17)} × 10⁻¹⁷ J to 2 decimal places. A charge e gains eΔV, so ΔV = energy ÷ e = ${n(rr(K0 / 1e-17))} × 10⁻¹⁷ ÷ (1.60 × 10⁻¹⁹) V, which is ${n(V)} V to 2 decimal places.`,
   guidance: [
    { prompt: `With v = ${n(v * 1000)} m/s and m = 9.11 × 10⁻³¹ kg, work out ½mv². What number multiplies 10⁻¹⁷ J, to 2 decimal places?`, answer: [E17], explanation: `½ × 9.11 × 10⁻³¹ × (${n(v * 1000)})² = ${n(E17)} × 10⁻¹⁷ J to 2 decimal places.` },
    { prompt: `The energy gained is eΔV. Use the unrounded energy and e = 1.60 × 10⁻¹⁹ C. What is ΔV, in V to 2 decimal places?`, answer: [V], explanation: `ΔV = energy ÷ e = ${n(rr(K0 / 1e-17))} × 10⁻¹⁷ ÷ (1.60 × 10⁻¹⁹) = ${n(V)} V to 2 decimal places.` }
   ] }; }
});

/* An ion crosses two stages: z elementary charges, V1 volts down then V2 volts up (V1 − V2 ≥ 200 so the ion keeps moving); the speed
   follows from the energy left at the target. */
mk({
 id: 'q13c', parent: 'q13', kind: 'applied', title: 'Through the retarding stage',
 brief: 'The ion gun now ends in a retarding stage that slows each ion before the target, and the crew wants the energy and speed it arrives with.',
 labels: ['energy after stage 1 (eV)', 'energy at the target (eV)', 'speed at the target (km/s)'], tolerance: 0.005,
 gl: [['energy after stage 1 (eV)'], ['energy at the target (eV)'], ['speed at the target (km/s)']]
}, {
 canonical: { z: 1, V1: 2600, V2: 900 },
 draw: R => tries(() => ({ z: R.int(1, 2), V1: 100 * R.int(6, 40), V2: 100 * R.int(1, 30) }),
  p => { const m = p.z === 1 ? MP : MHE; return p.V1 - p.V2 >= 200 && !tie2(Math.sqrt(2 * p.z * (p.V1 - p.V2) * QE / m) / 1000); },
  { z: 1, V1: 2600, V2: 900 }),
 build: ({ z, V1, V2 }) => { const m = z === 1 ? MP : MHE, ms = z === 1 ? '1.67 × 10⁻²⁷' : '6.64 × 10⁻²⁷', E1 = z * V1, E2 = z * (V1 - V2), J = E2 * 0.016, v = rd2(Math.sqrt(2 * E2 * QE / m) / 1000);
  const who = z === 1 ? 'proton (charge e, mass 1.67 × 10⁻²⁷ kg)' : 'helium nucleus (charge 2e, mass 6.64 × 10⁻²⁷ kg)';
  return {
   prompt: `In the Accelerator Bay a ${who} is released from rest and accelerated through ${n(V1)} V, from high potential to low potential. It then enters a retarding stage, where it climbs through a potential rise of ${n(V2)} V (from low potential to high potential) before it reaches the target. Use e = 1.60 × 10⁻¹⁹ C. Enter the kinetic energy it has after the first stage in eV, then its kinetic energy at the target in eV, then its speed at the target in km/s to 2 decimal places (type the answers without commas).`,
   answer: [E1, E2, v],
   hints: ['A charge that falls through a potential difference ΔV gains kinetic energy qΔV, and one that climbs through a potential rise loses qΔV. In electron-volts this is the number of elementary charges times the number of volts.', 'The energy at the target is the energy after the first stage minus the energy lost in the retarding stage. Then turn eV into joules (1 eV = 1.60 × 10⁻¹⁹ J), set ½mv² equal to it and solve for v; divide m/s by 1000 for km/s.'],
   solution: `The ${z === 1 ? 'proton' : 'nucleus'} carries ${z === 1 ? 'one elementary charge' : 'two elementary charges'}, so the first stage gives it ${n(z)} × ${n(V1)} = ${n(E1)} eV. The retarding stage takes away ${n(z)} × ${n(V2)} = ${n(z * V2)} eV, leaving ${n(E1)} − ${n(z * V2)} = ${n(E2)} eV at the target. In joules that is ${n(E2)} × 1.60 × 10⁻¹⁹ = ${n(rr(J))} × 10⁻¹⁷ J, so v = √(2 × ${n(rr(J))} × 10⁻¹⁷ ÷ (${ms})) m/s, which is ${n(v)} km/s to 2 decimal places.`,
   guidance: [
    { prompt: `The ${z === 1 ? 'charge is e' : 'charge is 2e'} and the first stage is ${n(V1)} V downhill. How much kinetic energy does it have after it, in eV?`, answer: [E1], explanation: `${n(z)} × ${n(V1)} = ${n(E1)} eV.` },
    { prompt: `The retarding stage is a rise of ${n(V2)} V, which takes away ${n(z)} × ${n(V2)} = ${n(z * V2)} eV. How much kinetic energy is left at the target, in eV?`, answer: [E2], explanation: `${n(E1)} − ${n(z * V2)} = ${n(E2)} eV.` },
    { prompt: `Turn ${n(E2)} eV into joules and set ½mv² equal to it with m = ${ms} kg. What is v, in km/s to 2 decimal places?`, answer: [v], explanation: `${n(E2)} eV is ${n(rr(J))} × 10⁻¹⁷ J, and v = √(2 × ${n(rr(J))} × 10⁻¹⁷ ÷ (${ms})) m/s, which is ${n(v)} km/s to 2 decimal places.` }
   ] }; }
});

/* A proton accelerated through V MV (a multiple of 0.5) is fired head-on at a fixed nucleus of charge Ze (Z from 10 to 40).
   K = e·V in 10⁻¹³ J is 1.6·V; closest approach r = k·e·(Ze) ÷ K in fm, i.e. 1.4384·Z ÷ V. */
mk({
 id: 'q13d', parent: 'q13', kind: 'challenge', uses: 'q12', title: 'How close the proton gets',
 brief: 'A proton is fired at a heavy nucleus in the target, and the crew wants to know how much energy it gets and how near it comes before it turns back.',
 labels: ['energy (× 10⁻¹³ J)', 'closest approach (fm)'], tolerance: 0.005,
 gl: [['energy (× 10⁻¹³ J)'], ['closest approach (fm)']]
}, {
 canonical: { vh: 5, Z: 26 },
 draw: R => tries(() => ({ vh: R.int(2, 10), Z: R.int(10, 40) }), p => !tie2(1.4384 * p.Z / (p.vh / 2)), { vh: 5, Z: 26 }),
 build: ({ vh, Z }) => { const V = vh / 2, E13 = rd2(1.6 * V), d = K * QE * Z * QE / (QE * V * 1e6) * 1e15, dr = rd2(d);
  return {
   prompt: `A proton is accelerated from rest through ${n(V)} MV (1 MV = 10⁶ V) and fired head-on at a fixed nucleus of charge ${n(Z)}e in the target of the Accelerator Bay. The nucleus does not move and nothing but the electric force acts. Far from the nucleus the potential energy of the pair is 0, and at the closest approach the proton stops for an instant, so all its kinetic energy has become electric potential energy. Use k = 8.99 × 10⁹ N·m²/C², e = 1.60 × 10⁻¹⁹ C and ignore relativity. Enter the kinetic energy the proton gains, as the number that multiplies 10⁻¹³ J. Then enter the closest approach distance in femtometres (1 fm = 10⁻¹⁵ m). Both are to 2 decimal places.`,
   answer: [E13, dr],
   hints: ['One elementary charge through a potential difference of ΔV gains eΔV, which is ΔV electron-volts. Turn that into joules with 1 eV = 1.60 × 10⁻¹⁹ J.', 'At the closest approach the potential energy of the pair is U = kq₁q₂ ÷ r with q₁ = e and q₂ = Ze. Set U equal to the kinetic energy and solve for r, which is in metres until you divide by 10⁻¹⁵.'],
   solution: `The proton gains ${n(V)} × 10⁶ eV, and in joules that is ${n(V)} × 10⁶ × 1.60 × 10⁻¹⁹ = ${n(E13)} × 10⁻¹³ J. At the closest approach U = k × e × ${n(Z)}e ÷ r equals that energy, so r = 8.99 × 10⁹ × 1.60 × 10⁻¹⁹ × ${n(Z)} × 1.60 × 10⁻¹⁹ ÷ (${n(E13)} × 10⁻¹³) m, which is ${n(dr)} fm to 2 decimal places.`,
   guidance: [
    { prompt: `The proton has charge e and falls through ${n(V)} MV. How much energy does it gain? Give the number that multiplies 10⁻¹³ J, to 2 decimal places.`, answer: [E13], explanation: `${n(V)} × 10⁶ eV × 1.60 × 10⁻¹⁹ J per eV = ${n(E13)} × 10⁻¹³ J.` },
    { prompt: `Set k × e × ${n(Z)}e ÷ r equal to ${n(E13)} × 10⁻¹³ J and solve for r. What is the closest approach, in fm to 2 decimal places?`, answer: [dr], explanation: `r = 8.99 × 10⁹ × 1.60 × 10⁻¹⁹ × ${n(Z)} × 1.60 × 10⁻¹⁹ ÷ (${n(E13)} × 10⁻¹³) m, which is ${n(dr)} fm to 2 decimal places.` }
   ] }; }
});

/* ---- q14 Potential of several point charges (adding scalars) [7.3] ---- */

/* v14: potentials (kV) at the empty corner D and at the centre for three posts of q1, q2, q3 (μC) at A, B, C of a rectangle 0.3s by 0.4s. */
const v14 = ({ s, q1, q2, q3 }) => ({ VD: 8.99 * (q1 / (0.4 * s) + q2 / (0.5 * s) + q3 / (0.3 * s)), VC: 8.99 * (q1 + q2 + q3) / (0.25 * s) });
/* Three posts at the corners A, B, C of a w × h rectangle (w = 0.3s, h = 0.4s, diagonal 0.5s); the probe at the empty corner D, and the centre
   of the rectangle (half a diagonal, 0.25s, from each post). D is h from A, w from C and a diagonal from B. */
mk({
 id: 'q14b', parent: 'q14', kind: 'setting', title: 'Corners of the solar field',
 brief: 'Charged posts stand at three corners of a rectangular solar field, and the crew wants the voltage a probe will read at the fourth corner and at the middle.',
 labels: ['potential at corner D (kV)', 'potential at the centre (kV)'], tolerance: 0.005,
 gl: [['distance to B (m)'], ['potential at corner D (kV)'], ['potential at the centre (kV)']]
}, {
 canonical: { s: 2, q1: 4, q2: -3, q3: 5 },
 draw: R => tries(() => ({ s: R.int(1, 3), q1: R.nz(-9, 9), q2: R.nz(-9, 9), q3: R.nz(-9, 9) }),
  p => { const t = v14(p); return p.q1 + p.q2 + p.q3 !== 0 && !tie2(t.VD) && !tie2(t.VC); },
  { s: 2, q1: 4, q2: -3, q3: 5 }),
 build: p => { const { s, q1, q2, q3 } = p, t = v14(p), w = 3 * s / 10, h = 4 * s / 10, dg = 5 * s / 10, hd = 25 * s / 100, VD = rd2(t.VD), VC = rd2(t.VC);
  return {
   prompt: `Three charged posts mark corners of a rectangular solar field in the Accelerator Bay: ${n(q1)} μC at corner A, ${n(q2)} μC at corner B and ${n(q3)} μC at corner C, where A, B, C and D go round the rectangle in order. Side AB is ${n(w)} m long and side BC is ${n(h)} m long, and corner D is empty. Use k = 8.99 × 10⁹ N·m²/C², and take the potential to be 0 very far away. Enter the electric potential at corner D in kV, then the electric potential at the centre of the rectangle in kV, both to 2 decimal places (type them without commas).`,
   answer: [VD, VC],
   hints: ['Potential has no direction, so the posts’ potentials simply add: each gives 8.99 × q ÷ r in kV, with q in μC and r in metres, and keeps the sign of its charge.', 'Corner D is a side length from A, a side length from C, and a whole diagonal from B; the diagonal of a rectangle comes from Pythagoras. The centre is half a diagonal from every corner.'],
   solution: `Corner D is ${n(h)} m from A (the length of BC), ${n(w)} m from C (the length of AB) and ${n(dg)} m from B (the diagonal, √(${n(rr(w * w))} + ${n(rr(h * h))})). Adding 8.99 × q ÷ r for each post: 8.99 × ${par(q1)} ÷ ${n(h)} + 8.99 × ${par(q2)} ÷ ${n(dg)} + 8.99 × ${par(q3)} ÷ ${n(w)} = ${n(VD)} kV to 2 decimal places. The centre is half a diagonal, ${n(hd)} m, from each of the three posts, so V = 8.99 × (${n(q1)} + ${par(q2)} + ${par(q3)}) ÷ ${n(hd)} = ${n(VC)} kV to 2 decimal places.`,
   guidance: [
    { prompt: `Corner D is opposite corner B. The sides are ${n(w)} m and ${n(h)} m long, so the distance DB is the diagonal √(${n(rr(w * w))} + ${n(rr(h * h))}). What is it, in m?`, answer: [dg], explanation: `√(${n(rr(w * w))} + ${n(rr(h * h))}) = √${n(rr(dg * dg))} = ${n(dg)} m.` },
    { prompt: `D is ${n(h)} m from A, ${n(dg)} m from B and ${n(w)} m from C. Add 8.99 × q ÷ r for the three posts. What is the potential at D, in kV to 2 decimal places?`, answer: [VD], explanation: `8.99 × ${par(q1)} ÷ ${n(h)} + 8.99 × ${par(q2)} ÷ ${n(dg)} + 8.99 × ${par(q3)} ÷ ${n(w)} = ${n(VD)} kV to 2 decimal places.` },
    { prompt: `The centre is half a diagonal, ${n(hd)} m, from each of the three posts. What is the potential there, in kV to 2 decimal places?`, answer: [VC], explanation: `All three distances are equal, so V = 8.99 × (${n(q1)} + ${par(q2)} + ${par(q3)}) ÷ ${n(hd)} = ${n(VC)} kV to 2 decimal places.` }
   ] }; }
});

/* Two fixed posts: qa at x = 0 and qb at x = D (cm, a multiple of 10). The grain (qt μC, m mg) is released at xa and slides to xb, both strictly
   between the posts (multiples of 10 cm). The draw keeps V(xa) above V(xb) and every V between them at or below V(xa), so the grain really does reach xb.
   v = √(2000·qt·ΔV ÷ m) m/s with ΔV in kV, qt in μC and m in mg. */
const v14c = ({ qa, qb, D }, x) => 8.99 * (qa / x + qb / (D / 100 - x));
const ok14c = p => {
 const xa = p.xa / 100, xb = p.xb / 100, VA = v14c(p, xa), VB = v14c(p, xb), dV = VA - VB;
 if (dV < 5) return false;
 for (let i = 0; i <= 100; i++) if (v14c(p, xa + (xb - xa) * i / 100) > VA + 1e-9) return false;
 const v = Math.sqrt(2000 * p.qt * dV / p.m);
 return !tie2(VA) && !tie2(VB) && !tie2(v) && v < 20000;
};
mk({
 id: 'q14c', parent: 'q14', kind: 'applied', title: 'A grain between two posts',
 brief: 'A charged grain is let go between two charged posts in the Power Hall, and the crew wants the potential at each end of its run and how fast it is going at the far end.',
 labels: ['potential at the start (kV)', 'potential at the end (kV)', 'speed at the end (m/s)'], tolerance: 0.005,
 gl: [['potential at the start (kV)'], ['potential at the end (kV)'], ['speed at the end (m/s)']]
}, {
 canonical: { qa: 6, qb: -2, D: 120, xa: 30, xb: 100, qt: 3, m: 4 },
 draw: R => tries(() => { const D = 10 * R.int(8, 15), a = 10 * R.int(1, D / 10 - 1), b = 10 * R.int(1, D / 10 - 1); return { qa: R.nz(-9, 9), qb: R.nz(-9, 9), D, xa: a, xb: b, qt: R.int(2, 6), m: R.int(1, 6) }; },
  p => p.xa !== p.xb && ok14c(p), { qa: 6, qb: -2, D: 120, xa: 30, xb: 100, qt: 3, m: 4 }),
 build: p => { const { qa, qb, D, xa, xb, qt, m } = p, A = xa / 100, B = xb / 100, d = D / 100, VA = v14c(p, A), VB = v14c(p, B), dV = VA - VB, v = Math.sqrt(2000 * qt * dV / m), VA2 = rd2(VA), VB2 = rd2(VB), v2 = rd2(v);
  return {
   prompt: `Two fixed charged posts stand on a straight rail in the Power Hall: ${n(qa)} μC at x = 0 and ${n(qb)} μC at x = ${n(d)} m. A dust grain of mass ${n(m)} mg (1 mg = 10⁻⁶ kg) and charge +${n(qt)} μC is released from rest at x = ${n(A)} m and slides along the rail, with no friction, to x = ${n(B)} m. The posts do not move and only the electric force acts on the grain. Use k = 8.99 × 10⁹ N·m²/C², and take the potential to be 0 very far away. Enter the potential at the release point in kV, then the potential at x = ${n(B)} m in kV, then the speed of the grain at x = ${n(B)} m in m/s. All three are to 2 decimal places and typed without commas.`,
   answer: [VA2, VB2, v2],
   hints: ['Each post gives a potential 8.99 × q ÷ r in kV (q in μC, r in metres, with the sign of q), and the two simply add. The distances to a post are never negative.', 'A charge q that moves through a potential difference loses potential energy q × (V at the start − V at the end) and gains the same kinetic energy. With q in μC and V in kV that is in mJ; then use ½mv² with joules and kilograms, using the unrounded potentials.'],
   solution: `At x = ${n(A)} m the posts are ${n(A)} m and ${n(rr(d - A))} m away: V = 8.99 × ${par(qa)} ÷ ${n(A)} + 8.99 × ${par(qb)} ÷ ${n(rr(d - A))} = ${n(VA2)} kV to 2 decimal places. At x = ${n(B)} m they are ${n(B)} m and ${n(rr(d - B))} m away: V = 8.99 × ${par(qa)} ÷ ${n(B)} + 8.99 × ${par(qb)} ÷ ${n(rr(d - B))} = ${n(VB2)} kV to 2 decimal places. The grain gains kinetic energy qΔV = ${n(qt)} × ${n(rr(dV))} = ${n(rr(qt * dV))} mJ, which is ${n(rr(qt * dV))} × 10⁻³ J. Then ½mv² = ${n(rr(qt * dV))} × 10⁻³ J gives v = √(2 × ${n(rr(qt * dV))} × 10⁻³ ÷ (${n(m)} × 10⁻⁶)) = ${n(v2)} m/s to 2 decimal places.`,
   guidance: [
    { prompt: `At the release point the posts are ${n(A)} m and ${n(rr(d - A))} m away. Add 8.99 × q ÷ r for each. What is the potential there, in kV to 2 decimal places?`, answer: [VA2], explanation: `8.99 × ${par(qa)} ÷ ${n(A)} + 8.99 × ${par(qb)} ÷ ${n(rr(d - A))} = ${n(VA2)} kV to 2 decimal places.` },
    { prompt: `At x = ${n(B)} m the posts are ${n(B)} m and ${n(rr(d - B))} m away. What is the potential there, in kV to 2 decimal places?`, answer: [VB2], explanation: `8.99 × ${par(qa)} ÷ ${n(B)} + 8.99 × ${par(qb)} ÷ ${n(rr(d - B))} = ${n(VB2)} kV to 2 decimal places.` },
    { prompt: `The grain gains kinetic energy ${n(qt)} μC × (V at the start − V at the end), using the unrounded potentials. Set that equal to ½mv² with m = ${n(m)} × 10⁻⁶ kg. What is v, in m/s to 2 decimal places?`, answer: [v2], explanation: `The energy is ${n(rr(qt * dV))} mJ, which is ${n(rr(qt * dV))} × 10⁻³ J, and v = √(2 × ${n(rr(qt * dV))} × 10⁻³ ÷ (${n(m)} × 10⁻⁶)) = ${n(v2)} m/s to 2 decimal places.` }
   ] }; }
});

/* Posts Qa at x = 0 and Qb at x = d (opposite signs, different sizes). With A = |Qa| and B = |Qb|: V = 0 between the posts at x = A·d ÷ (A + B) and
   outside the pair at x = A·d ÷ (A − B) (beyond Qb when A > B, which is x > d; beyond Qa when A < B, which is x < 0). Midpoint potential 8.99(Qa + Qb) ÷ (d ÷ 2) kV. */
const z14 = ({ qa, qb, dt }) => { const A = Math.abs(qa), B = Math.abs(qb), d = dt / 10; return { x1: A * d / (A + B), x2: A * d / (A - B), Vm: 8.99 * (qa + qb) / (d / 2) }; };
mk({
 id: 'q14d', parent: 'q14', kind: 'challenge', title: 'Where the rail reads zero',
 brief: 'Two unlike posts stand on the rail, and the crew wants the points where a probe would read exactly zero volts and the reading halfway between.',
 labels: ['potential at the midpoint (kV)', 'zero between the posts (m)', 'zero outside the posts (m)'], tolerance: 0.005,
 gl: [['potential at the midpoint (kV)'], ['zero between the posts (m)'], ['zero outside the posts (m)']]
}, {
 canonical: { qa: 6, qb: -2, dt: 12 },
 draw: R => tries(() => { const a = R.int(1, 9), b = R.int(1, 9), s = R.bool() ? 1 : -1; return { qa: s * a, qb: -s * b, dt: R.int(8, 30) }; },
  p => { const t = z14(p); return Math.abs(p.qa) !== Math.abs(p.qb) && !tie2(t.x1) && !tie2(t.x2) && !tie2(t.Vm); },
  { qa: 6, qb: -2, dt: 12 }),
 build: p => { const { qa, qb, dt } = p, t = z14(p), d = dt / 10, A = Math.abs(qa), B = Math.abs(qb), x1 = rd2(t.x1), x2 = rd2(t.x2), Vm = rd2(t.Vm), far = A > B;
  return {
   prompt: `Two charged posts stand on a straight rail in the Power Hall: ${n(qa)} μC at x = 0 and ${n(qb)} μC at x = ${n(d)} m. They have opposite signs and different sizes. Use k = 8.99 × 10⁹ N·m²/C², and take the potential to be 0 very far away. Enter the potential at the midpoint between the posts, in kV. There are exactly two places on the rail where the potential is exactly 0. Enter the x position of the one between the posts, then the x position of the other one, which lies outside the pair beyond the smaller charge (it may be negative), both in m. All three answers are to 2 decimal places and typed without commas.`,
   answer: [Vm, x1, x2],
   hints: ['A post’s potential at distance r is 8.99 × q ÷ r in kV (q in μC, r in metres), with the sign of q. The two add, so the total is 0 where the positive and negative terms are equal in size: |q₁| ÷ r₁ = |q₂| ÷ r₂.', 'Write r₁ and r₂ in terms of the position x: between the posts they are x and d − x; outside the pair, beyond the smaller charge, they differ by exactly d. Solve the equation for x, and check the answer lies in the right place.'],
   solution: `The midpoint is ${n(d / 2)} m from each post, so V = 8.99 × (${n(qa)} + ${par(qb)}) ÷ ${n(d / 2)} = ${n(Vm)} kV to 2 decimal places. The potential is 0 where ${n(A)} ÷ r₁ = ${n(B)} ÷ r₂. Between the posts r₁ = x and r₂ = ${n(d)} − x, so ${n(A)} × (${n(d)} − x) = ${n(B)} × x and x = ${n(A)} × ${n(d)} ÷ (${n(A)} + ${n(B)}) = ${n(x1)} m to 2 decimal places. Outside the pair, ${far ? `beyond the post at x = ${n(d)} m, r₁ = x and r₂ = x − ${n(d)}, so ${n(A)} × (x − ${n(d)}) = ${n(B)} × x` : `beyond the post at x = 0, r₁ = −x and r₂ = ${n(d)} − x, so ${n(A)} × (${n(d)} − x) = ${n(B)} × (−x)`}, which gives x = ${n(A)} × ${n(d)} ÷ (${n(A)} − ${par(B)}) = ${n(x2)} m to 2 decimal places.`,
   guidance: [
    { prompt: `The midpoint is ${n(d / 2)} m from each post. Add 8.99 × q ÷ r for the two posts. What is the potential there, in kV to 2 decimal places?`, answer: [Vm], explanation: `8.99 × ${par(qa)} ÷ ${n(d / 2)} + 8.99 × ${par(qb)} ÷ ${n(d / 2)} = ${n(Vm)} kV to 2 decimal places.` },
    { prompt: `Between the posts the distances are x and ${n(d)} − x, and the potential is 0 when ${n(A)} ÷ x = ${n(B)} ÷ (${n(d)} − x). What is x, in m to 2 decimal places?`, answer: [x1], explanation: `${n(A)} × (${n(d)} − x) = ${n(B)} × x gives x = ${n(A)} × ${n(d)} ÷ (${n(A)} + ${n(B)}) = ${n(x1)} m to 2 decimal places.` },
    { prompt: `Outside the pair the distances are ${far ? `x and x − ${n(d)}` : `−x and ${n(d)} − x`}, and the potential is 0 when ${n(A)} ÷ ${far ? 'x' : '(−x)'} = ${n(B)} ÷ ${far ? `(x − ${n(d)})` : `(${n(d)} − x)`}. What is x, in m to 2 decimal places?`, answer: [x2], explanation: `${far ? `${n(A)} × (x − ${n(d)}) = ${n(B)} × x` : `${n(A)} × (${n(d)} − x) = ${n(B)} × (−x)`} gives x = ${n(A)} × ${n(d)} ÷ (${n(A)} − ${par(B)}) = ${n(x2)} m to 2 decimal places.` }
   ] }; }
});

/* ---- q15 Field from potential: E = −dV/dx [7.4] ---- */

/* V(x) = a(x − h)² + c written out as A x² + B x + C with A = a, B = −2ah, C = ah² + c (|a| ≥ 2, h ≠ 0, so |B| ≥ 4 and no coefficient is 1).
   E_x(x0) = −(2A·x0 + B); the field is 0 at x = h. C is never 0. Not the parent's cubic. */
mk({
 id: 'q15b', parent: 'q15', kind: 'setting', title: 'The ion trap well',
 brief: 'The ion trap holds its ions in a dip in the voltage, and the crew wants the push on an ion at one point and the spot where the push vanishes.',
 labels: ['field E_x (V/m)', 'zero-field position (m)'], tolerance: 0.005,
 gl: [['dV/dx (V/m)'], ['field E_x (V/m)'], ['zero-field position (m)']]
}, {
 canonical: { a: 4, h: -1, c: 30, x0: 2 },
 draw: R => tries(() => ({ a: (R.bool() ? 1 : -1) * R.int(2, 5), h: R.nz(-3, 4), c: 10 * R.int(1, 9), x0: R.int(-3, 5) }),
  p => p.x0 !== p.h && p.a * p.h * p.h + p.c !== 0 && Math.abs(p.x0 - p.h) >= 2, { a: 4, h: -1, c: 30, x0: 2 }),
 build: ({ a, h, c, x0 }) => { const A = a, B = -2 * a * h, C = a * h * h + c, s = 2 * A * x0 + B, E = -s, Vx = `${trm(A, 'x²', true)} ${trm(B, 'x')} ${cst(C)}`, dV = `${trm(2 * A, 'x', true)} ${cst(B)}`;
  return {
   prompt: `Along the axis of the ion trap in the Accelerator Bay the potential is V(x) = ${Vx} volts, where x is the position in metres. Enter the x-component of the electric field at x = ${n(x0)} m, E_x, in V/m (it may be negative). Then enter the position in metres where the electric field along the axis is zero.`,
   answer: [E, h],
   hints: ['The field is minus the rate of change of the potential with position: E_x = −dV/dx. Differentiate term by term: axⁿ gives naxⁿ⁻¹, and a constant gives 0.', 'The field is zero where dV/dx is zero. Put the derivative equal to 0 and solve for x.'],
   solution: `Differentiating, dV/dx = ${dV}, so at x = ${n(x0)} it is ${n(2 * A)} × ${par(x0)} ${cst(B)} = ${n(s)} V/m. The field is E_x = −dV/dx = ${n(E)} V/m. The field is zero where ${dV} = 0, which is x = ${par(-B)} ÷ ${par(2 * A)} = ${n(h)} m.`,
   guidance: [
    { prompt: `The derivative is dV/dx = ${dV}. What is it at x = ${n(x0)}, in V/m?`, answer: [s], explanation: `${n(2 * A)} × ${par(x0)} ${cst(B)} = ${n(s)} V/m.` },
    { prompt: `E_x = −dV/dx. What is E_x at x = ${n(x0)}, in V/m?`, answer: [E], explanation: `Change the sign: E_x = ${n(E)} V/m.` },
    { prompt: `The field is zero where dV/dx = ${dV} equals 0. At what position x, in m, does that happen?`, answer: [h], explanation: `${dV} = 0 gives ${trm(2 * A, 'x', true)} = ${n(-B)}, so x = ${par(-B)} ÷ ${par(2 * A)} = ${n(h)} m.` }
   ] }; }
});

/* V(x) = a x³ + b x² + c x volts; dV/dx = 3a x² + 2b x + c at a nonzero whole x0, with dV/dx ≠ 0. The grain's charge q (μC, |q| ≥ 2 so that the
   force never equals the field): F = qE in μN. */
mk({
 id: 'q15c', parent: 'q15', kind: 'applied', title: 'The push on a grain at the plate',
 brief: 'A steering plate has shaped the voltage along the beam pipe, and the crew wants the push it gives a charged grain drifting past one station.',
 labels: ['dV/dx (V/m)', 'field E_x (V/m)', 'force on the grain (μN)'], tolerance: 0.005,
 gl: [['dV/dx (V/m)'], ['field E_x (V/m)'], ['force on the grain (μN)']]
}, {
 canonical: { a: 2, b: -3, c: 5, x0: 3, q: 4 },
 draw: R => tries(() => ({ a: R.nz(-3, 3), b: R.nz(-6, 6), c: R.nz(-20, 20), x0: R.nz(-3, 3), q: R.nz(-9, 9) }),
  p => 3 * p.a * p.x0 * p.x0 + 2 * p.b * p.x0 + p.c !== 0 && Math.abs(p.q) >= 2 && Math.abs(p.c) >= 2 && Math.abs(p.b) >= 1, { a: 2, b: -3, c: 5, x0: 3, q: 4 }),
 build: ({ a, b, c, x0, q }) => { const s = 3 * a * x0 * x0 + 2 * b * x0 + c, E = -s, F = q * E, Vx = `${trm(a, 'x³', true)} ${trm(b, 'x²')} ${trm(c, 'x')}`, dV = `${trm(3 * a, 'x²', true)} ${trm(2 * b, 'x')} ${cst(c)}`;
  return {
   prompt: `A steering plate in the Accelerator Bay shapes the potential along the beam pipe as V(x) = ${Vx} volts, where x is the position in metres. A charged grain carrying ${n(q)} μC (1 μC = 10⁻⁶ C) passes the point x = ${n(x0)} m. Enter dV/dx at that point in V/m, then the x-component of the electric field there, E_x, in V/m, then the x-component of the force on the grain in μN (1 μN = 10⁻⁶ N). Each may be negative.`,
   answer: [s, E, F],
   hints: ['Differentiate V(x) term by term: axⁿ gives naxⁿ⁻¹, and the field is minus the rate of change of the potential, E_x = −dV/dx.', 'The force on a charge q in a field E is F = qE, keeping the sign of q. A charge in μC and a field in V/m (the same as N/C) give a force in μN.'],
   solution: `Differentiating, dV/dx = ${dV}, so at x = ${n(x0)} it is ${n(3 * a)} × ${n(x0 * x0)} ${cst(2 * b * x0)} ${cst(c)} = ${n(s)} V/m. The field is E_x = −dV/dx = ${n(E)} V/m. The force is F = qE = ${par(q)} × ${par(E)} = ${n(F)} μN.`,
   guidance: [
    { prompt: `The derivative is dV/dx = ${dV}. What is it at x = ${n(x0)}, in V/m?`, answer: [s], explanation: `${n(3 * a)} × ${n(x0 * x0)} ${cst(2 * b * x0)} ${cst(c)} = ${n(s)} V/m.` },
    { prompt: `E_x = −dV/dx. What is E_x at x = ${n(x0)}, in V/m?`, answer: [E], explanation: `Change the sign: E_x = ${n(E)} V/m.` },
    { prompt: `The grain carries ${n(q)} μC. Use F = qE. What is the x-component of the force on it, in μN?`, answer: [F], explanation: `${par(q)} × ${par(E)} = ${n(F)} μN.` }
   ] }; }
});

/* V(x) = a x³ + b x + c volts; a proton is released from rest at x1 and runs to x2 (whole numbers from −3 to 4). The draw keeps dV/dx of one sign and
   non-zero over the whole stretch and V(x1) > V(x2) + 20, so the proton does run from x1 to x2; v = √(2eΔV ÷ m). */
const mono15 = p => { let lo = Infinity, hi = -Infinity; for (let i = 0; i <= 60; i++) { const x = p.x1 + (p.x2 - p.x1) * i / 60, d = 3 * p.a * x * x + p.b; lo = Math.min(lo, d); hi = Math.max(hi, d); } return lo > 0 || hi < 0; };
const V15 = (p, x) => p.a * x ** 3 + p.b * x + p.c;
mk({
 id: 'q15d', parent: 'q15', kind: 'challenge', uses: 'q13', title: 'The proton guide run',
 brief: 'A proton is let go at one station of the proton guide, and the crew wants the push on it there and the speed it has at the next station.',
 labels: ['field E_x (V/m)', 'speed at the end (km/s)'], tolerance: 0.005,
 gl: [['field E_x (V/m)'], ['potential drop (V)'], ['speed at the end (km/s)']]
}, {
 canonical: { a: 2, b: -24, c: 50, x1: -1, x2: 1 },
 draw: R => tries(() => ({ a: R.nz(-3, 3), b: R.nz(-60, 60), c: 10 * R.int(1, 9), x1: R.int(-3, 4), x2: R.int(-3, 4) }),
  p => { if (p.x1 === p.x2 || !mono15(p)) return false; const dV = V15(p, p.x1) - V15(p, p.x2); return dV >= 20 && !tie2(Math.sqrt(2 * QE * dV / MP) / 1000); },
  { a: 2, b: -24, c: 50, x1: -1, x2: 1 }),
 build: p => { const { a, b, c, x1, x2 } = p, E = -(3 * a * x1 * x1 + b), V1 = V15(p, x1), V2 = V15(p, x2), dV = V1 - V2, v = rd2(Math.sqrt(2 * QE * dV / MP) / 1000), Vx = `${trm(a, 'x³', true)} ${trm(b, 'x')} ${cst(c)}`, dVx = `${trm(3 * a, 'x²', true)} ${cst(b)}`;
  return {
   prompt: `Along the proton guide of the Accelerator Bay the potential is V(x) = ${Vx} volts, where x is the position in metres. A proton (charge e, mass 1.67 × 10⁻²⁷ kg) is released from rest at x = ${n(x1)} m and runs along the guide to x = ${n(x2)} m, with only the electric force acting on it. Use e = 1.60 × 10⁻¹⁹ C. Enter the x-component of the electric field at the release point, in V/m (it may be negative). Then enter the speed of the proton at x = ${n(x2)} m, in km/s to 2 decimal places (type it without commas).`,
   answer: [E, v],
   hints: ['The field is minus the rate of change of the potential with position, E_x = −dV/dx: differentiate V(x) term by term and put in the release position.', 'A charge e that moves through a potential drop ΔV = V(start) − V(end) gains kinetic energy eΔV. Set ½mv² equal to it in joules and solve for v; divide m/s by 1000 for km/s.'],
   solution: `Differentiating, dV/dx = ${dVx}, so at x = ${n(x1)} it is ${n(3 * a)} × ${n(x1 * x1)} ${cst(b)} = ${n(-E)} V/m, and E_x = −dV/dx = ${n(E)} V/m. The potential at x = ${n(x1)} m is ${n(V1)} V and at x = ${n(x2)} m it is ${n(V2)} V, so the drop is ${n(V1)} − ${par(V2)} = ${n(dV)} V. The proton gains ${n(dV)} eV, which is ${n(rr(dV * 0.016))} × 10⁻¹⁷ J, so v = √(2 × ${n(rr(dV * 0.016))} × 10⁻¹⁷ ÷ (1.67 × 10⁻²⁷)) m/s, which is ${n(v)} km/s to 2 decimal places.`,
   guidance: [
    { prompt: `Differentiate V(x) and put in x = ${n(x1)}, then change the sign. What is E_x at the release point, in V/m?`, answer: [E], explanation: `dV/dx = ${dVx}, which is ${n(-E)} V/m at x = ${n(x1)}, so E_x = ${n(E)} V/m.` },
    { prompt: `Put x = ${n(x1)} and then x = ${n(x2)} into V(x). What is the potential drop V(start) − V(end), in V?`, answer: [dV], explanation: `${n(V1)} − ${par(V2)} = ${n(dV)} V.` },
    { prompt: `The proton gains eΔV, which is ${n(dV)} eV, so ½mv² = ${n(rr(dV * 0.016))} × 10⁻¹⁷ J with m = 1.67 × 10⁻²⁷ kg. What is v, in km/s to 2 decimal places?`, answer: [v], explanation: `v = √(2 × ${n(rr(dV * 0.016))} × 10⁻¹⁷ ÷ (1.67 × 10⁻²⁷)) m/s, which is ${n(v)} km/s to 2 decimal places.` }
   ] }; }
});

})();
