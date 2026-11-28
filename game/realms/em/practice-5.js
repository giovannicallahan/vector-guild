/* Electricity and magnetism: fields practice missions, file 5 of 8: concepts q21–q25, three practice missions each
   (q21b q21c q21d q22b q22c q22d q23b q23c q23d q24b q24c q24d q25b q25c q25d).
   Format and rules: docs/PACK-FORMAT.md, "Practice missions" (§10).
     b  kind 'setting'    the same skill in a new real-world setting
     c  kind 'applied'    a word problem with two or three steps (two or three guided steps)
     d  kind 'challenge'  harder numbers, or the skill combined with one earlier concept (optional `uses: 'qNN'`)
   A practice mission supplies only: id, parent, kind, title, brief, prompt, answer, labels, tolerance, hints,
   solution, guidance (and `uses` for a challenge). Everything else comes from its parent, the learn mission:
   topic, tier, xp, sector, lesson, teaching, sources, the concept bench and the review drill. Do not write those.
   Each mission is registered together with its generator by add(mission, generator); build(canonical) must
   reproduce the authored prompt, hints, solution and guidance exactly. Oracles: qa/realms/em/oracle-p5.js. */
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
/* v6 removes float noise. fits(x, d): x has at most d decimal places. roundable(x, k): x is far from a rounding tie at k places
   and is not already a k-place number, so "which rounds to" never prints the same number twice. */
const v6 = x => Math.round(x * 1e6) / 1e6;
const fits = (x, d) => { const s = x * Math.pow(10, d); return Math.abs(s - Math.round(s)) < 1e-7; };
const roundable = (x, k) => { const s = Math.abs(x) * Math.pow(10, k), f = s - Math.floor(s); return f > 0.05 && f < 0.95 && Math.abs(f - 0.5) > 0.05; };
const rk = (x, k) => Math.round(x * Math.pow(10, k) + 1e-9) / Math.pow(10, k);
/* At most 1000 tries, then the canonical parameters. */
const drawWith = (make, ok, canon) => { for (let i = 0; i < 1000; i++) { const p = make(); if (ok(p)) return p; } return { ...canon }; };
const SUP = { 2: '²', 3: '³' };
/* A polynomial from its coefficients, highest power first: poly([1, 2, 3, 0], 't') is 't³ + 2t² + 3t'. A coefficient 1 is not written out. */
const poly = (cs, v) => { const deg = cs.length - 1; let out = '';
 cs.forEach((c, i) => { const p = deg - i; if (c === 0) return; const a = Math.abs(c), body = p === 0 ? n(a) : (a === 1 ? '' : n(a)) + v + (p > 1 ? SUP[p] : '');
  out += out ? (c < 0 ? ' − ' : ' + ') + body : (c < 0 ? '−' : '') + body; });
 return out || '0'; };
/* c × x as worked text, with a coefficient 1 left out. */
const tm = (c, x) => c === 1 ? n(x) : `${n(c)} × ${n(x)}`;
/* Resistivities of Table 9.1 in OpenStax 9.3 (units of 10⁻⁸ Ω·m). The parameter r is the printed value; the name is looked up from it. */
const METAL = { 1.59: 'silver', 1.68: 'copper', 2.44: 'gold', 2.65: 'aluminium', 9.71: 'iron' };
const RS = [1.59, 1.68, 2.44, 2.65, 9.71];
const NAMES = ['A', 'B', 'C', 'D'];
/* Three-capacitor bank of q23: lay 0 is B and C in parallel with that pair in series with A; lay 1 is B and C in series with that pair in parallel with A. */
const bank3 = (lay, A, B, C) => { const pair = lay === 0 ? B + C : B * C / (B + C); return { pair: v6(pair), tot: v6(lay === 0 ? A * pair / (A + pair) : A + pair) }; };
const pairWork = (lay, B, C, pair) => lay === 0 ? `${n(B)} + ${n(C)} = ${n(pair)} μF` : `${n(B)} × ${n(C)} ÷ (${n(B)} + ${n(C)}) = ${n(pair)} μF`;
const totWork = (lay, A, pair, tot) => lay === 0 ? `${n(A)} × ${n(pair)} ÷ (${n(A)} + ${n(pair)}) = ${n(tot)} μF` : `${n(A)} + ${n(pair)} = ${n(tot)} μF`;

/* ---- q21 Dielectrics: κ raises the capacitance [8.4] ---- */

mk({
 id: 'q21b', parent: 'q21', kind: 'setting', title: 'The ceramic sheet in the beacon capacitor',
 brief: 'A spare capacitor from the survey beacon is about to get a ceramic sheet in its gap, and Mira wants to know what that does to its voltage and its energy.',
 labels: ['voltage across the plates (V)', 'change in stored energy (mJ)'], tolerance: 0.0005,
 gl: [['new capacitance (μF)'], ['voltage across the plates (V)'], ['change in stored energy (mJ)']]
}, {
 /* kept = 1: the supply stays connected (voltage fixed); kept = 0: it is disconnected first (charge fixed). The energies are exact
    decimals with at most 3 places, and the change is under 1000 mJ in size. Not the q21 worked example (5 μF, 100 V, κ = 2, connected). */
 canonical: { C0: 6, V0: 40, k: 5, kept: 0 },
 draw: R => drawWith(() => ({ C0: R.int(2, 20), V0: R.pick([10, 20, 30, 40, 50, 60, 80, 100, 120, 150, 200]), k: R.pick([2, 4, 5, 8, 10]), kept: R.int(0, 1) }),
  p => { const U0 = p.C0 * p.V0 * p.V0 / 2000, Vn = p.kept ? p.V0 : p.V0 / p.k, Un = p.k * p.C0 * Vn * Vn / 2000, d = Un - U0;
   return fits(Vn, 3) && fits(U0, 3) && fits(Un, 3) && Math.abs(d) < 1000 && !(p.C0 === 5 && p.V0 === 100 && p.k === 2); }, { C0: 6, V0: 40, k: 5, kept: 0 }),
 build: ({ C0, V0, k, kept }) => { const C = k * C0, Vn = v6(kept ? V0 : V0 / k), UJ0 = v6(C0 * V0 * V0 / 2), UJn = v6(C * Vn * Vn / 2), U0 = v6(UJ0 / 1000), Un = v6(UJn / 1000), dU = v6(Un - U0), Q = C0 * V0; return {
  prompt: `A spare capacitor from the survey beacon in the Battery Vault has a capacitance of ${n(C0)} μF with air between its plates, and it is charged from a ${n(V0)} V supply. ${kept ? 'The supply stays connected, so it holds the voltage across the plates fixed.' : 'The supply is then disconnected, so no charge can reach or leave the plates.'} A sheet of ceramic with dielectric constant κ = ${n(k)} is then slid in so that it fills the gap. Treat air as κ = 1. Enter the voltage across the plates after the sheet is in, in volts, then the change in the stored energy (the energy after minus the energy before) in mJ, with a minus sign if it falls (1 mJ = 1000 μJ). Both are exact decimals.`,
  answer: [Vn, dU],
  hints: ['A sheet that fills the gap multiplies the capacitance by its dielectric constant. Then decide what stays fixed: with the supply connected the voltage stays the same; with the supply disconnected the charge Q = C₀V₀ stays the same, and the voltage becomes Q ÷ C for the new capacitance C.', 'The stored energy is U = ½CV² (μF times volts squared gives μJ; divide by 1000 for mJ). Work it out before and after, each time with the capacitance and voltage that apply then, and subtract: after minus before.'],
  solution: kept
   ? `The new capacitance is C = κC₀ = ${n(k)} × ${n(C0)} = ${n(C)} μF. The supply holds the voltage at ${n(V0)} V, so the voltage across the plates is still ${n(Vn)} V. Before: ½ × ${n(C0)} × ${n(V0 * V0)} = ${n(UJ0)} μJ = ${n(U0)} mJ. After: ½ × ${n(C)} × ${n(V0 * V0)} = ${n(UJn)} μJ = ${n(Un)} mJ. The change is ${n(Un)} − ${n(U0)} = ${n(dU)} mJ: the supply pushed in extra charge and the energy with it.`
   : `The new capacitance is C = κC₀ = ${n(k)} × ${n(C0)} = ${n(C)} μF. The charge cannot change, so it stays Q = C₀V₀ = ${n(C0)} × ${n(V0)} = ${n(Q)} μC, and the voltage becomes Q ÷ C = ${n(Q)} ÷ ${n(C)} = ${n(Vn)} V. Before: ½ × ${n(C0)} × ${n(V0 * V0)} = ${n(UJ0)} μJ = ${n(U0)} mJ. After: ½ × ${n(C)} × ${n(v6(Vn * Vn))} = ${n(UJn)} μJ = ${n(Un)} mJ. The change is ${n(Un)} − ${n(U0)} = ${n(dU)} mJ: the field pulled the sheet in, and the lost energy went into that work.`,
  guidance: [
   { prompt: `The sheet has κ = ${n(k)} and fills the gap of the ${n(C0)} μF capacitor. What is the new capacitance (μF)?`, answer: [C], explanation: `C = κC₀ = ${n(k)} × ${n(C0)} = ${n(C)} μF.` },
   { prompt: kept ? `The supply stays connected and holds the voltage fixed. What is the voltage across the plates now (V)?` : `The supply was disconnected, so the charge keeps the value Q = C₀V₀ = ${n(Q)} μC. The capacitance is now ${n(C)} μF. What is the voltage V = Q ÷ C (V)?`,
     answer: [Vn], explanation: kept ? `The supply holds the voltage at ${n(V0)} V, so it does not change.` : `V = ${n(Q)} ÷ ${n(C)} = ${n(Vn)} V.` },
   { prompt: `The energy before was ½C₀V₀² = ${n(U0)} mJ. With ${n(C)} μF and ${n(Vn)} V across it, what is the change in the stored energy, after minus before (mJ)?`, answer: [dU], explanation: `After: ½ × ${n(C)} × ${n(v6(Vn * Vn))} = ${n(UJn)} μJ = ${n(Un)} mJ, so the change is ${n(Un)} − ${n(U0)} = ${n(dU)} mJ.` }
  ] }; }
});

mk({
 id: 'q21c', parent: 'q21', kind: 'applied', title: 'Slab in, charger out, slab out',
 brief: 'A technician slides a slab into a backup capacitor, unplugs the charger and pulls the slab out again, and the log needs the voltage and energy that are left.',
 labels: ['final voltage (V)', 'final energy (mJ)'], tolerance: 0.0005,
 gl: [['charge on the plates (μC)'], ['final voltage (V)'], ['final energy (mJ)']]
}, {
 /* Stage 1: the charger stays connected, so V0 is fixed and Q = κC₀V₀. Stage 2: no charge can leave, the slab comes out and C returns to C₀,
    so V = κV₀ and U = ½C₀V² = κ² U₀. The energy at the end is an exact decimal with at most 3 places, under 1000 mJ. */
 canonical: { C0: 4, V0: 30, k: 3 },
 draw: R => drawWith(() => ({ C0: R.int(2, 12), V0: R.pick([10, 15, 20, 25, 30, 40, 50]), k: R.pick([2, 3, 4, 5]) }),
  p => { const U = p.C0 * Math.pow(p.k * p.V0, 2) / 2000, U0 = p.C0 * p.V0 * p.V0 / 2000; return fits(U, 3) && fits(U0, 3) && U < 1000; }, { C0: 4, V0: 30, k: 3 }),
 build: ({ C0, V0, k }) => { const Q = k * C0 * V0, V = k * V0, UJ = v6(C0 * V * V / 2), U = v6(UJ / 1000), U0 = v6(C0 * V0 * V0 / 2000); return {
  prompt: `A backup capacitor in the Battery Vault has a capacitance of ${n(C0)} μF with air between its plates. With the ${n(V0)} V charger still connected, a technician slides in a ceramic slab of dielectric constant κ = ${n(k)} that fills the gap. She then unplugs the charger, so no charge can reach or leave the plates, and pulls the slab out again, leaving only air (κ = 1). Enter the voltage across the plates at the end in volts, then the energy stored at the end in mJ (1 mJ = 1000 μJ). Both are exact decimals.`,
  answer: [V, U],
  hints: ['Take it in two stages. With the charger connected the voltage is fixed, and the charge is Q = CV with the capacitance the slab gives. After the charger is unplugged the charge is fixed, and the capacitance goes back to its air value.', 'The final voltage is V = Q ÷ C with the capacitance at that moment. Then the energy is U = ½CV² (μF times volts squared gives μJ; divide by 1000 for mJ).'],
  solution: `With the slab in and the charger connected, C = κC₀ = ${n(k)} × ${n(C0)} = ${n(k * C0)} μF and the voltage is ${n(V0)} V, so the charge is Q = CV = ${n(k * C0)} × ${n(V0)} = ${n(Q)} μC. The charger is then unplugged, so this charge stays on the plates when the slab comes out and the capacitance falls back to ${n(C0)} μF. The voltage becomes V = Q ÷ C₀ = ${n(Q)} ÷ ${n(C0)} = ${n(V)} V. The energy is U = ½C₀V² = ½ × ${n(C0)} × ${n(V * V)} = ${n(UJ)} μJ = ${n(U)} mJ, which is κ² = ${n(k * k)} times the ${n(U0)} mJ stored in the air capacitor at the start.`,
  guidance: [
   { prompt: `With the slab in and the charger connected, the capacitance is κ × ${n(C0)} μF and the voltage is ${n(V0)} V. What is the charge on the plates (μC)?`, answer: [Q], explanation: `C = ${n(k)} × ${n(C0)} = ${n(k * C0)} μF, and Q = CV = ${n(k * C0)} × ${n(V0)} = ${n(Q)} μC.` },
   { prompt: `The charger is unplugged and the slab comes out, so the ${n(Q)} μC stays on the plates while the capacitance returns to ${n(C0)} μF. What is the voltage V = Q ÷ C (V)?`, answer: [V], explanation: `V = ${n(Q)} ÷ ${n(C0)} = ${n(V)} V.` },
   { prompt: `The capacitance is ${n(C0)} μF and the voltage is ${n(V)} V. What is the stored energy U = ½CV² (mJ)?`, answer: [U], explanation: `U = ½ × ${n(C0)} × ${n(V * V)} = ${n(UJ)} μJ = ${n(U)} mJ.` }
  ] }; }
});

mk({
 id: 'q21d', parent: 'q21', kind: 'challenge', uses: 'q19', title: 'One slab in a two-capacitor chain',
 brief: 'Two capacitors are wired in a chain across the supply and only one of them gets a slab, so Mira needs the charge on the chain and the voltage the slab capacitor now carries.',
 labels: ['charge on capacitor B (μC)', 'voltage across capacitor B (V)'], tolerance: 0.0005,
 gl: [['capacitor B with the slab (μF)'], ['equivalent capacitance (μF)'], ['charge on each capacitor (μC)']]
}, {
 /* A (C1) in series with B (C2 when empty), supply V stays connected; the slab goes in B, so C2 becomes κC2. Q = C_eq V is on both,
    and V_B = Q ÷ (κC2). The equivalent capacitance, the charge and both voltages are exact decimals with at most 3 places. */
 canonical: { C1: 6, C2: 4, k: 3, V: 24 },
 draw: R => drawWith(() => ({ C1: R.int(2, 12), C2: R.int(2, 12), k: R.pick([2, 3, 4, 5]), V: R.pick([12, 18, 20, 24, 30, 36, 48, 60]) }),
  p => { const C2n = p.k * p.C2, Ce = p.C1 * C2n / (p.C1 + C2n), Q = Ce * p.V; return fits(Ce, 2) && fits(Q, 2) && fits(Q / C2n, 3) && fits(Q / p.C1, 3); }, { C1: 6, C2: 4, k: 3, V: 24 }),
 build: ({ C1, C2, k, V }) => { const C2n = k * C2, Ce = v6(C1 * C2n / (C1 + C2n)), Q = v6(Ce * V), VB = v6(Q / C2n), VA = v6(Q / C1); return {
  prompt: `Two capacitors in the Battery Vault are joined in series: capacitor A has ${n(C1)} μF, and capacitor B has ${n(C2)} μF when its gap holds only air. The pair is connected across a ${n(V)} V supply, which stays connected. Capacitor B’s gap is then completely filled with a slab of dielectric constant κ = ${n(k)} (treat air as κ = 1). Remember that two capacitors in series carry the same charge, and that their voltages add up to the supply voltage. Enter the charge on capacitor B after the slab is in, in μC, then the voltage across capacitor B, in volts. Both are exact decimals.`,
  answer: [Q, VB],
  hints: ['The slab changes only capacitor B: its capacitance becomes κ times its empty value. Then reduce the pair to one equivalent capacitor, using 1 ÷ C = 1 ÷ C₁ + 1 ÷ C₂ for capacitors in series.', 'The supply sees that one equivalent capacitor, so the total charge is Q = CV, and the same charge sits on B. The voltage across B alone is that charge divided by B’s own capacitance.'],
  solution: `With the slab, capacitor B has κ × ${n(C2)} = ${n(k)} × ${n(C2)} = ${n(C2n)} μF. In series with A: ${n(C1)} × ${n(C2n)} ÷ (${n(C1)} + ${n(C2n)}) = ${n(Ce)} μF. The supply is still connected, so the charge is Q = CV = ${n(Ce)} × ${n(V)} = ${n(Q)} μC, and it is the same on B. The voltage across B is Q ÷ C = ${n(Q)} ÷ ${n(C2n)} = ${n(VB)} V. Check: A has ${n(Q)} ÷ ${n(C1)} = ${n(VA)} V, and ${n(VA)} + ${n(VB)} = ${n(v6(VA + VB))} V, the supply voltage.`,
  guidance: [
   { prompt: `Capacitor B is ${n(C2)} μF when empty and its gap is filled with a slab of κ = ${n(k)}. What is its capacitance now (μF)?`, answer: [C2n], explanation: `C = κC₀ = ${n(k)} × ${n(C2)} = ${n(C2n)} μF.` },
   { prompt: `A (${n(C1)} μF) and B (${n(C2n)} μF) are in series. What is their equivalent capacitance (μF)?`, answer: [Ce], explanation: `In series, C = C₁C₂ ÷ (C₁ + C₂) = ${n(C1 * C2n)} ÷ ${n(C1 + C2n)} = ${n(Ce)} μF.` },
   { prompt: `The pair acts as one ${n(Ce)} μF capacitor across ${n(V)} V, and the charge on it is the charge on each capacitor of the chain. What is that charge (μC)?`, answer: [Q], explanation: `Q = CV = ${n(Ce)} × ${n(V)} = ${n(Q)} μC.` }
  ] }; }
});

/* ---- q22 Current: charge per second, and charge from I(t) by integration [9.1] ---- */

mk({
 id: 'q22b', parent: 'q22', kind: 'setting', title: 'The trickle charger interval',
 brief: 'A trickle charger tops up the reserve cell, and the log needs the charge it moved in the middle of its run and the average current over that stretch.',
 labels: ['charge (C)', 'average current (A)'], tolerance: 0.005,
 gl: [['charge from the steady part (C)'], ['charge from the growing part (C)'], ['average current (A)']]
}, {
 /* I(t) = a + bt, taken from t1 to t2 (not from 0). The charge is a whole number of coulombs (b(t2² − t1²) is even);
    the average current a + b(t1 + t2) ÷ 2 has at most 1 decimal. Not the q22 worked example (1 + 4t over 0 to 2 s). */
 canonical: { a: 4, b: 3, t1: 2, t2: 6 },
 draw: R => drawWith(() => { const t1 = R.int(1, 4); return { a: R.int(2, 9), b: R.int(2, 8), t1, t2: t1 + R.int(2, 5) }; },
  p => Number.isInteger(p.a * (p.t2 - p.t1) + p.b * (p.t2 * p.t2 - p.t1 * p.t1) / 2), { a: 4, b: 3, t1: 2, t2: 6 }),
 build: ({ a, b, t1, t2 }) => { const D = t2 - t1, s = a * D, g = v6(b * (t2 * t2 - t1 * t1) / 2), Q = s + g, avg = v6(Q / D); return {
  prompt: `A trickle charger tops up the reserve cell of the Battery Vault. Its current rises as I(t) = ${n(a)} + ${n(b)}t amperes, where t is the number of seconds since the charger was switched on. Enter the charge that flows through the charger between t = ${n(t1)} s and t = ${n(t2)} s, in coulombs, then the average current over those ${n(D)} seconds, in amperes (the average current is the charge divided by the time it took). Both are exact decimals.`,
  answer: [Q, avg],
  hints: ['The charge is the area under the graph of current against time between the two times: integrate I(t) from the first time to the second, which is F(t₂) − F(t₁) for an antiderivative F. The charge does not start from t = 0 here.', 'Treat the steady part and the growing part separately, then add. The average current is the total charge divided by the length of the interval, t₂ − t₁.'],
  solution: `Q is the integral of ${n(a)} + ${n(b)}t from t = ${n(t1)} to t = ${n(t2)}. An antiderivative is ${n(a)}t + ${n(b)}t² ÷ 2, so Q = ${n(a)} × (${n(t2)} − ${n(t1)}) + ${n(b)} × (${n(t2 * t2)} − ${n(t1 * t1)}) ÷ 2 = ${n(s)} + ${n(g)} = ${n(Q)} C. The interval lasts ${n(t2)} − ${n(t1)} = ${n(D)} s, so the average current is ${n(Q)} ÷ ${n(D)} = ${n(avg)} A.`,
  guidance: [
   { prompt: `The steady part of the current, ${n(a)} A, flows for the whole ${n(D)} s between t = ${n(t1)} s and t = ${n(t2)} s. How much charge does that part carry (C)?`, answer: [s], explanation: `A steady current carries current × time: ${n(a)} × ${n(D)} = ${n(s)} C.` },
   { prompt: `The growing part, ${n(b)}t amperes, carries the integral of ${n(b)}t from t = ${n(t1)} to t = ${n(t2)}, which is ${n(b)} × (${n(t2)}² − ${n(t1)}²) ÷ 2. What is that charge (C)?`, answer: [g], explanation: `${n(b)} × (${n(t2 * t2)} − ${n(t1 * t1)}) ÷ 2 = ${n(g)} C.` },
   { prompt: `The total charge is ${n(s)} + ${n(g)} = ${n(Q)} C, and it passed in ${n(D)} s. What is the average current (A)?`, answer: [avg], explanation: `${n(Q)} ÷ ${n(D)} = ${n(avg)} A.` }
  ] }; }
});

mk({
 id: 'q22c', parent: 'q22', kind: 'applied', title: 'A gentle start, then a held current',
 brief: 'The reserve charger starts gently and then holds its current steady, and the log needs the whole charge it delivered and the average current of the run.',
 labels: ['total charge (C)', 'average current (A)'], tolerance: 0.005,
 gl: [['charge in the first stage (C)'], ['charge in the second stage (C)'], ['average current (A)']]
}, {
 /* Stage 1: I = a + bt for 0 to T1 (the charge is a whole number). Stage 2: the current is held at I1 = a + bT1 for T2 seconds.
    The average current Q ÷ (T1 + T2) is an exact decimal with at most 2 places. */
 canonical: { a: 2, b: 3, T1: 4, T2: 6 },
 draw: R => drawWith(() => ({ a: R.int(1, 8), b: R.int(2, 6), T1: R.int(2, 6), T2: R.int(2, 8) }),
  p => { const Q1 = p.a * p.T1 + p.b * p.T1 * p.T1 / 2, Q = Q1 + (p.a + p.b * p.T1) * p.T2; return Number.isInteger(Q1) && fits(Q / (p.T1 + p.T2), 2); }, { a: 2, b: 3, T1: 4, T2: 6 }),
 build: ({ a, b, T1, T2 }) => { const s1 = a * T1, g1 = b * T1 * T1 / 2, Q1 = s1 + g1, I1 = a + b * T1, Q2 = I1 * T2, Q = Q1 + Q2, T = T1 + T2, avg = v6(Q / T); return {
  prompt: `The charger for the vault’s reserve bank starts gently. For the first ${n(T1)} s its current rises as I(t) = ${n(a)} + ${n(b)}t amperes, with t in seconds since switch-on. At t = ${n(T1)} s the control board holds the current steady at the value it has reached by then, and the current stays at that value for another ${n(T2)} s. Enter the total charge delivered over the whole ${n(T)} s, in coulombs, then the average current over the whole ${n(T)} s, in amperes (the total charge divided by the total time). Both are exact decimals.`,
  answer: [Q, avg],
  hints: ['Split the run into two stages. While the current is changing, the charge is the integral of I(t); once it is held steady, the charge is current × time.', 'The steady value is the current at the end of the first stage. The average current is the total charge divided by the total time of both stages.'],
  solution: `Stage 1: Q₁ is the integral of ${n(a)} + ${n(b)}t from 0 to ${n(T1)}, which is ${n(a)} × ${n(T1)} + ${n(b)} × ${n(T1 * T1)} ÷ 2 = ${n(s1)} + ${n(g1)} = ${n(Q1)} C. At t = ${n(T1)} the current is ${n(a)} + ${n(b)} × ${n(T1)} = ${n(I1)} A, and it is held there for ${n(T2)} s, so stage 2 carries ${n(I1)} × ${n(T2)} = ${n(Q2)} C. The total charge is ${n(Q1)} + ${n(Q2)} = ${n(Q)} C, over ${n(T1)} + ${n(T2)} = ${n(T)} s, so the average current is ${n(Q)} ÷ ${n(T)} = ${n(avg)} A.`,
  guidance: [
   { prompt: `In the first ${n(T1)} s the charge is the integral of ${n(a)} + ${n(b)}t from t = 0 to t = ${n(T1)}, which is ${n(a)} × ${n(T1)} + ${n(b)} × ${n(T1)}² ÷ 2. What is that charge (C)?`, answer: [Q1], explanation: `${n(a)} × ${n(T1)} + ${n(b)} × ${n(T1 * T1)} ÷ 2 = ${n(s1)} + ${n(g1)} = ${n(Q1)} C.` },
   { prompt: `The held current is the value I(t) has reached at t = ${n(T1)} s, and it flows for another ${n(T2)} s. How much charge does it carry in that time (C)?`, answer: [Q2], explanation: `I(${n(T1)}) = ${n(a)} + ${n(b)} × ${n(T1)} = ${n(I1)} A, and ${n(I1)} × ${n(T2)} = ${n(Q2)} C.` },
   { prompt: `The two stages together carry ${n(Q)} C in ${n(T)} s. What is the average current (A)?`, answer: [avg], explanation: `${n(Q)} ÷ ${n(T)} = ${n(avg)} A.` }
  ] }; }
});

mk({
 id: 'q22d', parent: 'q22', kind: 'challenge', uses: 'q01', title: 'Counting the electrons in a surge',
 brief: 'A fault test sends a surge down the main cable, and Mira wants the charge between two moments and how many electrons carried it.',
 labels: ['charge (C)', 'electrons (units of 10¹⁸)'], tolerance: 0.005,
 gl: [['F at the end time'], ['F at the start time'], ['electrons (units of 10¹⁸)']]
}, {
 /* I(t) = a + bt + ct² with b even and c a multiple of 3, so F(t) = at + (b ÷ 2)t² + (c ÷ 3)t³ has whole coefficients and the charge is a whole
    number of coulombs. The electron count in units of 10¹⁸ is 6.25 × Q. Not the q22 worked example. */
 canonical: { a: 2, b: 4, c: 3, t1: 1, t2: 4 },
 draw: R => { const t1 = R.int(1, 3); return { a: R.int(1, 9), b: R.pick([2, 4, 6, 8]), c: R.pick([3, 6, 9]), t1, t2: t1 + R.int(2, 3) }; },
 build: ({ a, b, c, t1, t2 }) => { const A = a, B = b / 2, C = c / 3, F = t => A * t + B * t * t + C * t * t * t, F1 = F(t1), F2 = F(t2), Q = F2 - F1, N = v6(Q * 6.25),
  Ft = poly([C, B, A, 0], 't'), ev = t => `${tm(A, t)} + ${tm(B, t * t)} + ${tm(C, t * t * t)} = ${n(F(t))}`; return {
  prompt: `A fault test on the vault’s main cable pushes a surge through it: the current is I(t) = ${poly([c, b, a], 't')} amperes, where t is the number of seconds since the test began. Enter the charge that passes along the cable between t = ${n(t1)} s and t = ${n(t2)} s, in coulombs, then the number of electrons that carry it, in units of 10¹⁸ (enter N for N × 10¹⁸ electrons; type it without commas). Each electron carries a charge of size e = 1.60 × 10⁻¹⁹ C, and charge comes only in whole numbers of electrons, so the count is the charge divided by e. The electron count is an exact decimal in these units.`,
  answer: [Q, N],
  hints: ['Reverse the power rule on each of the three terms of I(t): raise the exponent by 1 and divide by the new exponent. The charge between the two times is F(t₂) − F(t₁) for your antiderivative F.', 'The number of electrons is the charge divided by 1.60 × 10⁻¹⁹ C, which is the charge times 6.25 × 10¹⁸. In units of 10¹⁸ that is 6.25 times the charge in coulombs.'],
  solution: `An antiderivative of I(t) = ${poly([c, b, a], 't')} is F(t) = ${Ft}. F(${n(t2)}) = ${ev(t2)} and F(${n(t1)}) = ${ev(t1)}, so the charge is ${n(F2)} − ${n(F1)} = ${n(Q)} C. The number of electrons is ${n(Q)} ÷ (1.60 × 10⁻¹⁹) = ${n(Q)} × 6.25 × 10¹⁸ = ${n(N)} × 10¹⁸.`,
  guidance: [
   { prompt: `An antiderivative of ${poly([c, b, a], 't')} is F(t) = ${Ft}. What is F(${n(t2)})?`, answer: [F2], explanation: `F(${n(t2)}) = ${ev(t2)}.` },
   { prompt: `With F(t) = ${Ft}, what is F(${n(t1)})?`, answer: [F1], explanation: `F(${n(t1)}) = ${ev(t1)}.` },
   { prompt: `The charge is F(${n(t2)}) − F(${n(t1)}) = ${n(F2)} − ${n(F1)} = ${n(Q)} C. How many electrons is that, in units of 10¹⁸?`, answer: [N], explanation: `${n(Q)} ÷ (1.60 × 10⁻¹⁹) = ${n(Q)} × 6.25 × 10¹⁸ = ${n(N)} × 10¹⁸ electrons.` }
  ] }; }
});

/* ---- q23 Chapter review: a capacitor bank [8.2, 8.3] ---- */

mk({
 id: 'q23b', parent: 'q23', kind: 'setting', title: 'The lamp reserve bank',
 brief: 'The dome lamps run from a small reserve bank with one slab-filled capacitor in it, and the log needs the bank’s capacitance and the energy it holds.',
 labels: ['equivalent capacitance (μF)', 'total energy (mJ)'], tolerance: 0.0005,
 gl: [['capacitor with the slab (μF)'], ['B and C together (μF)'], ['whole bank (μF)']]
}, {
 /* A is the single capacitor and B, C the pair (lay 0: B and C in parallel, that pair in series with A; lay 1: B and C in series, that pair in
    parallel with A). The slab goes in capacitor number s (a parameter: 0 = A, 1 = B, 2 = C). The bank capacitance has at most 2 decimals and the
    energy at most 3, under 1000 mJ. Not the q23 worked example (6, 3 and 1 μF, κ = 3, 10 V) or q23's own layout of values. */
 canonical: { A: 6, B: 3, C: 5, s: 1, k: 3, V: 20, lay: 0 },
 draw: R => drawWith(() => ({ A: R.int(2, 12), B: R.int(2, 12), C: R.int(2, 12), s: R.int(0, 2), k: R.pick([2, 3, 4, 5]), V: R.pick([10, 12, 15, 20, 24, 30, 40]), lay: R.int(0, 1) }),
  p => { const v = [p.A, p.B, p.C]; v[p.s] *= p.k; const t = bank3(p.lay, v[0], v[1], v[2]).tot, U = t * p.V * p.V / 2000; return fits(t, 2) && fits(U, 3) && U < 1000; }, { A: 6, B: 3, C: 5, s: 1, k: 3, V: 20, lay: 0 }),
 build: ({ A, B, C, s, k, V, lay }) => { const v = [A, B, C], e = v[s], nm = NAMES[s]; v[s] = k * e; const [a, b, c] = v, { pair, tot } = bank3(lay, a, b, c), UJ = v6(tot * V * V / 2), U = v6(UJ / 1000),
  pairTxt = lay === 0 ? 'in parallel' : 'in series', joinTxt = lay === 0 ? 'in series with' : 'in parallel with'; return {
  prompt: `The Battery Vault keeps a small reserve bank for the dome lamps, wired like this: capacitors B (${n(B)} μF) and C (${n(C)} μF) are ${lay === 0 ? 'side by side in parallel, and that pair is in series with' : 'in series with each other, and that pair is in parallel with'} capacitor A (${n(A)} μF). These are the values with air between the plates. Capacitor ${nm} is then filled with a slab of dielectric constant κ = ${n(k)}. The whole bank is connected across a ${n(V)} V supply. Enter the equivalent capacitance of the whole bank in μF, then the total energy stored in the bank in mJ (1 mJ = 1000 μJ). Both are exact decimals.`,
  answer: [tot, U],
  hints: ['A capacitor with a slab has κ times its empty capacitance, so change that one value first. Then reduce the bank one step at a time: capacitors in parallel add, C = C₁ + C₂, and for capacitors in series the reciprocals add, 1 ÷ C = 1 ÷ C₁ + 1 ÷ C₂.', 'The supply sees one equivalent capacitor, so the total energy is U = ½CV² (μF times volts squared gives μJ; divide by 1000 for mJ).'],
  solution: `With the slab, capacitor ${nm} has κ × ${n(e)} = ${n(k)} × ${n(e)} = ${n(k * e)} μF. B and C ${pairTxt}: ${pairWork(lay, b, c, pair)}. ${lay === 0 ? 'In series with A' : 'In parallel with A'}: ${totWork(lay, a, pair, tot)}. The energy is U = ½CV² = ½ × ${n(tot)} × ${n(V * V)} = ${n(UJ)} μJ = ${n(U)} mJ.`,
  guidance: [
   { prompt: `Capacitor ${nm} is ${n(e)} μF when empty and is filled with a slab of κ = ${n(k)}. What is its capacitance now (μF)?`, answer: [k * e], explanation: `C = κC₀ = ${n(k)} × ${n(e)} = ${n(k * e)} μF.` },
   { prompt: `With the slab in, B is ${n(b)} μF and C is ${n(c)} μF, and they are ${pairTxt}. What is their equivalent capacitance (μF)?`, answer: [pair], explanation: `${lay === 0 ? 'In parallel the capacitances add' : 'For two in series, C = C₁C₂ ÷ (C₁ + C₂)'}: ${pairWork(lay, b, c, pair)}.` },
   { prompt: `That ${n(pair)} μF pair is ${joinTxt} A (${n(a)} μF). What is the capacitance of the whole bank (μF)?`, answer: [tot], explanation: `${lay === 0 ? 'In series' : 'In parallel'}: ${totWork(lay, a, pair, tot)}.` }
  ] }; }
});

mk({
 id: 'q23c', parent: 'q23', kind: 'applied', title: 'Two branches into the lamps',
 brief: 'The night bank has two branches side by side, and Mira wants the energy it stores and the power it gives the lamps when it is emptied quickly.',
 labels: ['stored energy (mJ)', 'average power (W)'], tolerance: 0.0005,
 gl: [['branch 1 (μF)'], ['whole bank (μF)'], ['stored energy (mJ)']]
}, {
 /* Branch 1 is A in series with B (slab, κB); branch 2 is C in series with D; the branches are in parallel. The slab capacitor gets κ·B, and
    A with κ·B and C with D are drawn from a list of pairs whose series value is a whole number. The energy has at most 3 decimals, under
    1000 mJ, and the power at most 3. Not the q23 worked example. */
 canonical: { Ca: 6, Cb: 4, k: 3, Cc: 10, Cd: 15, V: 30, t: 2 },
 draw: R => { const T = [[3, 6], [4, 12], [6, 12], [2, 2], [5, 20], [10, 15], [6, 3], [12, 4], [8, 8], [4, 4], [6, 6], [10, 10], [15, 10], [12, 6], [20, 5], [12, 12], [8, 24], [9, 18]];
  return drawWith(() => { const k = R.pick([2, 3, 4, 5]), r1 = R.pick(T), r2 = R.pick(T); return { Ca: r1[0], Cb: r1[1] / k, k, Cc: r2[0], Cd: r2[1], V: R.pick([10, 12, 15, 20, 24, 30, 40]), t: R.pick([2, 4, 5, 10, 20, 25]) }; },
   p => { const s1 = p.Ca * p.k * p.Cb / (p.Ca + p.k * p.Cb), s2 = p.Cc * p.Cd / (p.Cc + p.Cd), U = (s1 + s2) * p.V * p.V / 2000; return Number.isInteger(p.Cb) && Number.isInteger(s1) && Number.isInteger(s2) && fits(U, 3) && fits(U / p.t, 3) && U < 1000; },
   { Ca: 6, Cb: 4, k: 3, Cc: 10, Cd: 15, V: 30, t: 2 }); },
 build: ({ Ca, Cb, k, Cc, Cd, V, t }) => { const Cbn = k * Cb, s1 = v6(Ca * Cbn / (Ca + Cbn)), s2 = v6(Cc * Cd / (Cc + Cd)), tot = v6(s1 + s2), UJ = v6(tot * V * V / 2), U = v6(UJ / 1000), P = v6(U / t); return {
  prompt: `The Battery Vault’s night bank has two branches side by side in parallel. Branch 1 is capacitor A (${n(Ca)} μF) in series with capacitor B (${n(Cb)} μF when empty); branch 2 is capacitor C (${n(Cc)} μF) in series with capacitor D (${n(Cd)} μF). Capacitor B is filled with a slab of dielectric constant κ = ${n(k)}. The bank is connected across a ${n(V)} V supply until it is fully charged, and is then emptied through the lamps, which releases all its stored energy in ${n(t)} ms. Enter the energy stored in the bank in mJ, then the average power during the discharge in watts (1 mJ ÷ 1 ms = 1 W). Both are exact decimals.`,
  answer: [U, P],
  hints: ['Give capacitor B its value with the slab, κ times the empty one. Each branch is two capacitors in series, so reduce each branch first; then the two branches are in parallel and their capacitances add.', 'The whole bank acts as one capacitor, so the stored energy is U = ½CV² (μF times volts squared gives μJ; divide by 1000 for mJ). The average power is the energy divided by the time it is released in.'],
  solution: `With the slab, B has ${n(k)} × ${n(Cb)} = ${n(Cbn)} μF. Branch 1: ${n(Ca)} × ${n(Cbn)} ÷ (${n(Ca)} + ${n(Cbn)}) = ${n(s1)} μF. Branch 2: ${n(Cc)} × ${n(Cd)} ÷ (${n(Cc)} + ${n(Cd)}) = ${n(s2)} μF. The branches are in parallel, so the bank is ${n(s1)} + ${n(s2)} = ${n(tot)} μF. The energy is U = ½CV² = ½ × ${n(tot)} × ${n(V * V)} = ${n(UJ)} μJ = ${n(U)} mJ. Released in ${n(t)} ms, the average power is ${n(U)} ÷ ${n(t)} = ${n(P)} W.`,
  guidance: [
   { prompt: `B is ${n(Cb)} μF when empty and has a slab of κ = ${n(k)}. Branch 1 is A (${n(Ca)} μF) in series with B. What is the equivalent capacitance of branch 1 (μF)?`, answer: [s1], explanation: `B with the slab is ${n(k)} × ${n(Cb)} = ${n(Cbn)} μF. In series: ${n(Ca)} × ${n(Cbn)} ÷ (${n(Ca)} + ${n(Cbn)}) = ${n(s1)} μF.` },
   { prompt: `Branch 2 is C (${n(Cc)} μF) in series with D (${n(Cd)} μF). It is in parallel with branch 1, which is ${n(s1)} μF. What is the capacitance of the whole bank (μF)?`, answer: [tot], explanation: `Branch 2: ${n(Cc)} × ${n(Cd)} ÷ (${n(Cc)} + ${n(Cd)}) = ${n(s2)} μF. In parallel the capacitances add: ${n(s1)} + ${n(s2)} = ${n(tot)} μF.` },
   { prompt: `The bank acts as one ${n(tot)} μF capacitor across ${n(V)} V. What is the stored energy U = ½CV² (mJ)?`, answer: [U], explanation: `U = ½ × ${n(tot)} × ${n(V * V)} = ${n(UJ)} μJ = ${n(U)} mJ.` }
  ] }; }
});

mk({
 id: 'q23d', parent: 'q23', kind: 'challenge', uses: 'q22', title: 'Charging the bank from empty',
 brief: 'A charger with a rising current fills the night bank from empty for a set time, and Mira needs the voltage it reaches and the energy it holds.',
 labels: ['voltage across the bank (V)', 'energy stored (mJ)'], tolerance: 0.0005,
 gl: [['charge delivered (μC)'], ['whole bank (μF)'], ['voltage across the bank (V)']]
}, {
 /* A is the single capacitor and B, C the pair as in q23; the slab goes in C (lay 0: B and C in parallel, that pair in series with A; lay 1: B and C in series,
    that pair in parallel with A). The charger gives I(t) = a + bt microamperes for T seconds, so Q = aT + bT² ÷ 2 microcoulombs (a whole number).
    The bank capacitance has at most 2 decimals; V has at most 3 and the energy at most 3, under 1000 mJ. */
 canonical: { A: 4, B: 6, C: 3, k: 4, lay: 1, a: 20, b: 6, T: 10 },
 draw: R => drawWith(() => ({ A: R.int(2, 12), B: R.int(2, 12), C: R.int(2, 12), k: R.pick([2, 3, 4, 5]), lay: R.int(0, 1), a: 5 * R.int(1, 8), b: R.int(2, 8), T: R.int(4, 12) }),
  p => { const Q = p.a * p.T + p.b * p.T * p.T / 2, t = bank3(p.lay, p.A, p.B, p.k * p.C).tot, V = Q / t, U = Q * V / 2000; return Number.isInteger(Q) && fits(t, 2) && fits(V, 3) && fits(U, 3) && U < 1000; }, { A: 4, B: 6, C: 3, k: 4, lay: 1, a: 20, b: 6, T: 10 }),
 build: ({ A, B, C, k, lay, a, b, T }) => { const Cn = k * C, { pair, tot } = bank3(lay, A, B, Cn), s = a * T, g = b * T * T / 2, Q = s + g, V = v6(Q / tot), UJ = v6(Q * V / 2), U = v6(UJ / 1000),
  pairTxt = lay === 0 ? 'in parallel' : 'in series'; return {
  prompt: `The Battery Vault’s night bank is wired like this: capacitors B (${n(B)} μF) and C (${n(C)} μF when empty) are ${lay === 0 ? 'side by side in parallel, and that pair is in series with' : 'in series with each other, and that pair is in parallel with'} capacitor A (${n(A)} μF). Capacitor C is filled with a slab of dielectric constant κ = ${n(k)}. The bank starts empty. A charger then feeds it a current that rises as I(t) = ${n(a)} + ${n(b)}t microamperes (μA), where t is the number of seconds since switch-on, and the charger is switched off at t = ${n(T)} s. Enter the voltage across the whole bank at that moment in volts, then the energy stored in the bank in mJ (1 μA × 1 s = 1 μC, and 1 mJ = 1000 μJ). Both are exact decimals.`,
  answer: [V, U],
  hints: ['The charge delivered is the integral of the current from t = 0 to the switch-off time (microamperes times seconds gives microcoulombs). All of it ends up on the bank.', 'Give capacitor C its value with the slab, then reduce the network to one equivalent capacitance. The voltage is V = Q ÷ C, and the energy is U = ½CV² (μF times volts squared gives μJ; divide by 1000 for mJ).'],
  solution: `The charge delivered is the integral of ${n(a)} + ${n(b)}t from 0 to ${n(T)}, which is ${n(a)} × ${n(T)} + ${n(b)} × ${n(T * T)} ÷ 2 = ${n(s)} + ${n(g)} = ${n(Q)} μC. With the slab, C has ${n(k)} × ${n(C)} = ${n(Cn)} μF. B and C ${pairTxt}: ${pairWork(lay, B, Cn, pair)}. ${lay === 0 ? 'In series with A' : 'In parallel with A'}: ${totWork(lay, A, pair, tot)}. The voltage is V = Q ÷ C = ${n(Q)} ÷ ${n(tot)} = ${n(V)} V, and the energy is U = ½CV² = ½ × ${n(tot)} × ${n(v6(V * V))} = ${n(UJ)} μJ = ${n(U)} mJ.`,
  guidance: [
   { prompt: `The current ${n(a)} + ${n(b)}t microamperes flows from t = 0 to t = ${n(T)} s. The charge is ${n(a)} × ${n(T)} + ${n(b)} × ${n(T)}² ÷ 2. What is the charge delivered (μC)?`, answer: [Q], explanation: `${n(a)} × ${n(T)} + ${n(b)} × ${n(T * T)} ÷ 2 = ${n(s)} + ${n(g)} = ${n(Q)} μC.` },
   { prompt: `Capacitor C (${n(C)} μF when empty) has a slab of κ = ${n(k)}. B is ${n(B)} μF and A is ${n(A)} μF, in the layout of the problem. What is the equivalent capacitance of the whole bank (μF)?`, answer: [tot], explanation: `C with the slab is ${n(k)} × ${n(C)} = ${n(Cn)} μF. B and C ${pairTxt}: ${pairWork(lay, B, Cn, pair)}. ${lay === 0 ? 'In series with A' : 'In parallel with A'}: ${totWork(lay, A, pair, tot)}.` },
   { prompt: `The bank holds ${n(Q)} μC and its capacitance is ${n(tot)} μF. What is the voltage across it, V = Q ÷ C (V)?`, answer: [V], explanation: `V = ${n(Q)} ÷ ${n(tot)} = ${n(V)} V.` }
  ] }; }
});

/* ---- q24 Resistivity and resistance of a cable, R = ρL/A [9.3] ---- */

mk({
 id: 'q24b', parent: 'q24', kind: 'setting', title: 'The copper bus bar',
 brief: 'A solid bus bar carries power between two panels at the Cable Works, and the log needs its cross-section and its resistance in milliohms.',
 labels: ['area (mm²)', 'resistance (mΩ)'], tolerance: 0.005,
 gl: [['area (mm²)'], ['resistance (mΩ)']]
}, {
 /* A rectangular bar w × h (the area is exact, at most 2 decimals). R in mΩ is 10 × r × L ÷ A, because ρ = r × 10⁻⁸ Ω·m and 1 mm² = 10⁻⁶ m².
    r is the printed resistivity; the name is looked up from it. The resistance is far from a rounding tie at 2 places. */
 canonical: { r: 1.68, L: 12, w: 25, h: 4 },
 draw: R => drawWith(() => ({ r: R.pick(RS), L: R.int(5, 40), w: R.pick([10, 12, 15, 20, 25, 30, 40, 50]), h: R.pick([2, 2.5, 3, 4, 5, 6, 8]) }),
  p => roundable(10 * p.r * p.L / (p.w * p.h), 2) && !(p.r === 2.65 && p.L === 100), { r: 1.68, L: 12, w: 25, h: 4 }),
 build: ({ r, L, w, h }) => { const m = METAL[r], A = v6(w * h), Rm = 10 * r * L / A, Rr = rk(Rm, 2), Rx = n(+Rm.toFixed(4)); return {
  prompt: `A bus bar in the Cable Works carries power between two panels, with the current flowing along its length. It is a solid ${m} bar ${n(L)} m long with a rectangular cross-section ${n(w)} mm wide and ${n(h)} mm thick, and ${m} has resistivity ρ = ${n(r)} × 10⁻⁸ Ω·m. Enter the cross-sectional area of the bar in mm², then the resistance of the whole bar in milliohms (mΩ; 1 Ω = 1000 mΩ), rounded to 2 decimal places.`,
  answer: [A, Rr],
  hints: ['The cross-section of a rectangular bar is its width times its thickness. To change mm² to m², multiply by 10⁻⁶.', 'Resistance grows with length and falls with area: R = ρL ÷ A, with ρ in Ω·m, L in m and A in m². The result is in ohms; multiply by 1000 for milliohms.'],
  solution: `The area is ${n(w)} × ${n(h)} = ${n(A)} mm², which is ${n(A)} × 10⁻⁶ m². Then R = ρL ÷ A = (${n(r)} × 10⁻⁸ × ${n(L)}) ÷ (${n(A)} × 10⁻⁶) ≈ ${Rx} × 10⁻³ Ω = ${Rx} mΩ, which rounds to ${n(Rr)} mΩ.`,
  guidance: [
   { prompt: `The bar is ${n(w)} mm wide and ${n(h)} mm thick. What is the area of its rectangular cross-section (mm²)?`, answer: [A], explanation: `A = width × thickness = ${n(w)} × ${n(h)} = ${n(A)} mm².` },
   { prompt: `With ρ = ${n(r)} × 10⁻⁸ Ω·m, L = ${n(L)} m and A = ${n(A)} × 10⁻⁶ m², what is R = ρL ÷ A in milliohms, to 2 decimal places?`, answer: [Rr], explanation: `R = (${n(r)} × 10⁻⁸ × ${n(L)}) ÷ (${n(A)} × 10⁻⁶) ≈ ${Rx} × 10⁻³ Ω = ${Rx} mΩ, which rounds to ${n(Rr)} mΩ.` }
  ] }; }
});

mk({
 id: 'q24c', parent: 'q24', kind: 'applied', title: 'Two lengths to the far dome',
 brief: 'The run to the far dome is two different wires joined end to end, and Mira needs the resistance of the first length and of the whole run.',
 labels: ['first length (Ω)', 'whole run (Ω)'], tolerance: 0.005,
 gl: [['first length (Ω)'], ['second length (Ω)'], ['whole run (Ω)']]
}, {
 /* Two round wires of different materials joined end to end (their resistances add: stated in the prompt). R = 0.04 × r × L ÷ (π d²) in ohms,
    with ρ = r × 10⁻⁸ Ω·m and d in mm. All three resistances are far from a rounding tie at 2 places, and rounding the two parts first does not
    change the rounded total. */
 canonical: { r1: 1.68, L1: 300, d1: 2.5, r2: 2.65, L2: 450, d2: 3.2 },
 draw: R => drawWith(() => ({ r1: R.pick(RS), L1: 50 * R.int(2, 18), d1: R.pick([1.5, 2, 2.5, 3, 3.2, 4, 5, 6]), r2: R.pick(RS), L2: 50 * R.int(2, 18), d2: R.pick([1.5, 2, 2.5, 3, 3.2, 4, 5, 6]) }),
  p => { const a = 0.04 * p.r1 * p.L1 / (Math.PI * p.d1 * p.d1), b = 0.04 * p.r2 * p.L2 / (Math.PI * p.d2 * p.d2), t = a + b;
   return p.r1 !== p.r2 && roundable(a, 2) && roundable(b, 2) && roundable(t, 2) && rk(a, 2) + rk(b, 2) - rk(t, 2) < 1e-9 && rk(a, 2) + rk(b, 2) - rk(t, 2) > -1e-9 && t < 100; },
  { r1: 1.68, L1: 300, d1: 2.5, r2: 2.65, L2: 450, d2: 3.2 }),
 build: ({ r1, L1, d1, r2, L2, d2 }) => { const m1 = METAL[r1], m2 = METAL[r2], A1 = Math.PI * d1 * d1 / 4, A2 = Math.PI * d2 * d2 / 4, R1 = 0.01 * r1 * L1 / A1, R2 = 0.01 * r2 * L2 / A2, Rt = R1 + R2,
  f4 = x => n(+x.toFixed(4)), Q1 = rk(R1, 2), Qt = rk(Rt, 2), h1 = d1 / 2, h2 = d2 / 2; return {
  prompt: `The run from the Cable Works to the far dome is made of two lengths of round wire joined end to end, so the same current passes through both and their resistances add. The first length is made of ${m1}: it is ${n(L1)} m long and ${n(d1)} mm across, and ${m1} has resistivity ρ = ${n(r1)} × 10⁻⁸ Ω·m. The second is made of ${m2}: it is ${n(L2)} m long and ${n(d2)} mm across, and ${m2} has resistivity ρ = ${n(r2)} × 10⁻⁸ Ω·m. Enter the resistance of the first length, then the resistance of the whole run, both in ohms, rounded to 2 decimal places. Work each resistance out from unrounded values, and add the unrounded resistances for the total.`,
  answer: [Q1, Qt],
  hints: ['Find the resistance of each length on its own, R = ρL ÷ A, with the radius half the diameter, A = πr², and 1 mm² = 10⁻⁶ m². The resistivity belongs to the material of that length.', 'Two lengths joined end to end carry the same current, and their resistances add. Add the unrounded values and round only at the end.'],
  solution: `First length: the radius is ${n(d1)} ÷ 2 = ${n(h1)} mm, so A = π × ${n(h1)}² ≈ ${f4(A1)} mm² = ${f4(A1)} × 10⁻⁶ m², and R = (${n(r1)} × 10⁻⁸ × ${n(L1)}) ÷ (${f4(A1)} × 10⁻⁶) ≈ ${f4(R1)} Ω. Second length: the radius is ${n(d2)} ÷ 2 = ${n(h2)} mm, so A = π × ${n(h2)}² ≈ ${f4(A2)} mm², and R = (${n(r2)} × 10⁻⁸ × ${n(L2)}) ÷ (${f4(A2)} × 10⁻⁶) ≈ ${f4(R2)} Ω. The resistances add: ${f4(R1)} + ${f4(R2)} ≈ ${f4(Rt)} Ω. To 2 decimal places the first length is ${n(Q1)} Ω and the whole run is ${n(Qt)} Ω.`,
  guidance: [
   { prompt: `The first length has radius ${n(h1)} mm, so its area is π × ${n(h1)}² ≈ ${f4(A1)} mm², which is ${f4(A1)} × 10⁻⁶ m². With ρ = ${n(r1)} × 10⁻⁸ Ω·m and L = ${n(L1)} m, what is its resistance ρL ÷ A in ohms, to 2 decimal places?`, answer: [Q1], explanation: `R = (${n(r1)} × 10⁻⁸ × ${n(L1)}) ÷ (${f4(A1)} × 10⁻⁶) ≈ ${f4(R1)} Ω, which rounds to ${n(Q1)} Ω.` },
   { prompt: `The second length has radius ${n(h2)} mm, so its area is π × ${n(h2)}² ≈ ${f4(A2)} mm². With ρ = ${n(r2)} × 10⁻⁸ Ω·m and L = ${n(L2)} m, what is its resistance in ohms, to 2 decimal places?`, answer: [rk(R2, 2)], explanation: `R = (${n(r2)} × 10⁻⁸ × ${n(L2)}) ÷ (${f4(A2)} × 10⁻⁶) ≈ ${f4(R2)} Ω, which rounds to ${n(rk(R2, 2))} Ω.` },
   { prompt: `The unrounded resistances are about ${f4(R1)} Ω and ${f4(R2)} Ω, and they add. What is the resistance of the whole run, to 2 decimal places (Ω)?`, answer: [Qt], explanation: `${f4(R1)} + ${f4(R2)} ≈ ${f4(Rt)} Ω, which rounds to ${n(Qt)} Ω.` }
  ] }; }
});

mk({
 id: 'q24d', parent: 'q24', kind: 'challenge', title: 'How thick must the feeder be?',
 brief: 'The main feeder to the far dome must not exceed a set resistance, and Mira needs the thinnest round wire that does the job.',
 labels: ['area needed (mm²)', 'diameter needed (mm)'], tolerance: 0.005,
 gl: [['area needed (mm²)'], ['diameter needed (mm)']]
}, {
 /* The question is turned round: given R, find A = 0.01 × r × L ÷ R (mm², with ρ = r × 10⁻⁸ Ω·m), then d = 2√(A ÷ π). The area is an exact decimal
    with at most 2 places, between 4 and 400 mm²; d is far from a rounding tie at 2 places. R is a multiple of 0.05 Ω. Not the q24 worked example. */
 canonical: { r: 1.68, L: 450, R: 0.28 },
 draw: R => drawWith(() => ({ r: R.pick(RS), L: 50 * R.int(2, 18), R: R.int(4, 40) / 20 }),
  p => { const A = 0.01 * p.r * p.L / p.R; return fits(A, 2) && A >= 4 && A <= 400 && roundable(2 * Math.sqrt(A / Math.PI), 2); }, { r: 1.68, L: 450, R: 0.28 }),
 build: ({ r, L, R: Rr }) => { const m = METAL[r], A = v6(0.01 * r * L / Rr), d = 2 * Math.sqrt(A / Math.PI), dr = rk(d, 2), f4 = x => n(+x.toFixed(4)); return {
  prompt: `The main feeder to the far dome is a solid round ${m} wire ${n(L)} m long, and ${m} has resistivity ρ = ${n(r)} × 10⁻⁸ Ω·m. To waste little power, its resistance must come to exactly ${n(Rr)} Ω. Enter the cross-sectional area the wire must have in mm² (an exact decimal), then the diameter of a round wire with that area, in mm, rounded to 2 decimal places. Work the diameter out from the unrounded area.`,
  answer: [A, dr],
  hints: ['Turn R = ρL ÷ A around: A = ρL ÷ R, with ρ in Ω·m and L in m, which gives m². Multiply by 10⁶ to change m² to mm².', 'For a round wire A = π(d ÷ 2)², so the radius is √(A ÷ π) and the diameter is twice that.'],
  solution: `A = ρL ÷ R = (${n(r)} × 10⁻⁸ × ${n(L)}) ÷ ${n(Rr)} = ${n(A)} × 10⁻⁶ m² = ${n(A)} mm². For a round wire A = π(d ÷ 2)², so the radius is √(${n(A)} ÷ π) ≈ ${f4(d / 2)} mm and the diameter is 2 × ${f4(d / 2)} ≈ ${f4(d)} mm, which rounds to ${n(dr)} mm.`,
  guidance: [
   { prompt: `The wire has ρ = ${n(r)} × 10⁻⁸ Ω·m and L = ${n(L)} m, and R must be ${n(Rr)} Ω. What area A = ρL ÷ R is needed, in mm²?`, answer: [A], explanation: `A = (${n(r)} × 10⁻⁸ × ${n(L)}) ÷ ${n(Rr)} = ${n(A)} × 10⁻⁶ m² = ${n(A)} mm².` },
   { prompt: `A round wire of area ${n(A)} mm² has A = π(d ÷ 2)². What is its diameter d in mm, to 2 decimal places?`, answer: [dr], explanation: `The radius is √(${n(A)} ÷ π) ≈ ${f4(d / 2)} mm, so d ≈ ${f4(d)} mm, which rounds to ${n(dr)} mm.` }
  ] }; }
});

/* ---- q25 Ohm's law and electrical power [9.4, 9.5] ---- */

mk({
 id: 'q25b', parent: 'q25', kind: 'setting', title: 'The rated work lamp',
 brief: 'A work lamp for the Cable Works is rated by its power and its supply voltage, and the electricians need its current and its resistance.',
 labels: ['current (A)', 'resistance (Ω)'], tolerance: 0.0005,
 gl: [['current (A)'], ['resistance (Ω)']]
}, {
 /* The prompt prints the rated power P and the supply voltage V, so the current I = P ÷ V and R = V ÷ I = V² ÷ P are the answers. Both are exact
    decimals (I at most 3 places, R at most 2). Not the q25 worked example (8 Ω across 24 V). */
 canonical: { V: 36, P: 90 },
 draw: R => drawWith(() => ({ V: R.pick([12, 24, 36, 48, 60, 110, 120, 230]), P: 10 * R.int(2, 150) }),
  p => { const I = p.P / p.V, Rs = p.V * p.V / p.P; return fits(I, 3) && fits(Rs, 2) && I >= 0.2 && I <= 40 && !(p.V === 24 && p.P === 72); }, { V: 36, P: 90 }),
 build: ({ V, P }) => { const I = v6(P / V), Rs = v6(V / I); return {
  prompt: `A work lamp for the Cable Works is rated at ${n(P)} W when it runs from a ${n(V)} V supply. Treat the lamp as an ohmic resistor (one that obeys Ohm’s law). Enter the current it draws in amperes, then its resistance in ohms. Both are exact decimals.`,
  answer: [I, Rs],
  hints: ['Power is current times voltage, P = IV, so the current is the power divided by the voltage.', 'Ohm’s law, V = IR, gives the resistance as the voltage divided by the current. As a check, R = V² ÷ P gives the same number.'],
  solution: `From P = IV, the current is I = P ÷ V = ${n(P)} ÷ ${n(V)} = ${n(I)} A. By Ohm’s law, R = V ÷ I = ${n(V)} ÷ ${n(I)} = ${n(Rs)} Ω. Check: V² ÷ P = ${n(V * V)} ÷ ${n(P)} = ${n(Rs)} Ω as well.`,
  guidance: [
   { prompt: `The lamp takes ${n(P)} W from ${n(V)} V, and P = IV. What current does it draw (A)?`, answer: [I], explanation: `I = P ÷ V = ${n(P)} ÷ ${n(V)} = ${n(I)} A.` },
   { prompt: `The lamp has ${n(V)} V across it and draws ${n(I)} A. What is its resistance R = V ÷ I (Ω)?`, answer: [Rs], explanation: `R = ${n(V)} ÷ ${n(I)} = ${n(Rs)} Ω.` }
  ] }; }
});

mk({
 id: 'q25c', parent: 'q25', kind: 'applied', title: 'Heat lost in the long cable',
 brief: 'A heater panel in a far dome is fed along a long cable, and the electricians want the heat the panel gives off and the heat the cable wastes.',
 labels: ['power in the heater (W)', 'power wasted in the cable (W)'], tolerance: 0.005,
 gl: [['total resistance (Ω)'], ['current (A)'], ['power in the heater (W)']]
}, {
 /* The supply V is across the cable (Rc) and the heater (Rh) in one line: I = V ÷ (Rh + Rc) is an exact decimal with at most 2 places, and both
    powers I²R are exact decimals with at most 2 places. Not the q25 worked example or its canonical values (48 Ω, 120 V). */
 canonical: { V: 150, Rh: 28, Rc: 2 },
 draw: R => drawWith(() => ({ V: R.pick([110, 120, 150, 200, 230, 240]), Rh: R.int(8, 60), Rc: R.int(1, 8) }),
  p => { const I = p.V / (p.Rh + p.Rc); return fits(I, 2) && fits(I * I * p.Rh, 2) && fits(I * I * p.Rc, 2) && !(p.V === 120 && p.Rh === 48); }, { V: 150, Rh: 28, Rc: 2 }),
 build: ({ V, Rh, Rc }) => { const Rt = Rh + Rc, I = v6(V / Rt), I2 = v6(I * I), Ph = v6(I2 * Rh), Pc = v6(I2 * Rc); return {
  prompt: `A heater panel of ${n(Rh)} Ω in a far dome is fed from a ${n(V)} V supply along a long cable whose resistance is ${n(Rc)} Ω. The cable and the heater are in one line, so the same current passes through both and their resistances add; the ${n(V)} V is across the cable and the heater together. Enter the power the heater turns into heat, then the power wasted as heat in the cable, both in watts (use P = I²R for each, and type them without commas). Both are exact decimals.`,
  answer: [Ph, Pc],
  hints: ['The current is set by the total resistance of the line, the cable plus the heater: I = V ÷ R, with V the supply voltage across both.', 'Each part uses only its own resistance in P = I²R, with the same current. As a check, the two powers add up to the supply’s power IV.'],
  solution: `The total resistance is ${n(Rh)} + ${n(Rc)} = ${n(Rt)} Ω, so the current is I = V ÷ R = ${n(V)} ÷ ${n(Rt)} = ${n(I)} A. The heater takes P = I²R = ${n(I2)} × ${n(Rh)} = ${n(Ph)} W, and the cable wastes ${n(I2)} × ${n(Rc)} = ${n(Pc)} W. Check: ${n(Ph)} + ${n(Pc)} = ${n(v6(Ph + Pc))} W, and IV = ${n(I)} × ${n(V)} = ${n(v6(I * V))} W.`,
  guidance: [
   { prompt: `The heater is ${n(Rh)} Ω and the cable is ${n(Rc)} Ω, in one line. What is the total resistance (Ω)?`, answer: [Rt], explanation: `The resistances add: ${n(Rh)} + ${n(Rc)} = ${n(Rt)} Ω.` },
   { prompt: `The ${n(V)} V supply is across a total resistance of ${n(Rt)} Ω. What current flows (A)?`, answer: [I], explanation: `I = V ÷ R = ${n(V)} ÷ ${n(Rt)} = ${n(I)} A.` },
   { prompt: `The current is ${n(I)} A and the heater is ${n(Rh)} Ω. What power does the heater turn into heat, P = I²R (W)?`, answer: [Ph], explanation: `P = ${n(I2)} × ${n(Rh)} = ${n(Ph)} W.` }
  ] }; }
});

mk({
 id: 'q25d', parent: 'q25', kind: 'challenge', uses: 'q24', title: 'What the feeder wastes',
 brief: 'A steady current runs down the main feeder, and Mira needs its resistance and the power the wire wastes as heat.',
 labels: ['resistance (Ω)', 'power wasted (W)'], tolerance: 0.005,
 gl: [['area (mm²)'], ['resistance (Ω)'], ['power wasted (W)']]
}, {
 /* R = 0.04 × r × L ÷ (π d²) in ohms (ρ = r × 10⁻⁸ Ω·m, d in mm), and the power wasted is I²R. R is far from a rounding tie at 2 places, the power far from
    one at 0 places, and using the rounded R gives the same rounded power. Not the q25 worked example. */
 canonical: { r: 1.68, L: 600, d: 2, I: 4 },
 draw: R => drawWith(() => ({ r: R.pick(RS), L: 50 * R.int(4, 18), d: R.pick([1.5, 2, 2.5, 3, 3.5, 4]), I: R.int(3, 6) }),
  p => { const Rs = 0.04 * p.r * p.L / (Math.PI * p.d * p.d), P = p.I * p.I * Rs; return roundable(Rs, 2) && roundable(P, 0) && roundable(Math.PI * p.d * p.d / 4, 2) && rk(P, 0) === rk(p.I * p.I * rk(Rs, 2), 0); }, { r: 1.68, L: 600, d: 2, I: 4 }),
 build: ({ r, L, d, I }) => { const m = METAL[r], h = d / 2, A = Math.PI * h * h, Rs = 0.01 * r * L / A, P = I * I * Rs, f4 = x => n(+x.toFixed(4)), Ar = rk(A, 2), Rr = rk(Rs, 2), Pr = rk(P, 0); return {
  prompt: `The main feeder to the far dome is a solid round ${m} wire ${n(L)} m long and ${n(d)} mm across, and ${m} has resistivity ρ = ${n(r)} × 10⁻⁸ Ω·m. A steady current of ${n(I)} A flows along it. Enter the resistance of the wire in ohms, rounded to 2 decimal places, then the power it wastes as heat in watts, rounded to the nearest whole number (type it without commas). Work both out from unrounded values.`,
  answer: [Rr, Pr],
  hints: ['First the wire’s resistance from its material and shape: the radius is half the diameter, A = πr², 1 mm² = 10⁻⁶ m², and R = ρL ÷ A.', 'The power a resistor turns into heat is P = I²R, with the current in amperes and the resistance of the wire in ohms.'],
  solution: `The radius is ${n(d)} ÷ 2 = ${n(h)} mm, so A = π × ${n(h)}² ≈ ${f4(A)} mm² = ${f4(A)} × 10⁻⁶ m². Then R = ρL ÷ A = (${n(r)} × 10⁻⁸ × ${n(L)}) ÷ (${f4(A)} × 10⁻⁶) ≈ ${f4(Rs)} Ω, which rounds to ${n(Rr)} Ω. The power wasted is P = I²R = ${n(I * I)} × ${f4(Rs)} ≈ ${f4(P)} W, which rounds to ${n(Pr)} W.`,
  guidance: [
   { prompt: `The wire is ${n(d)} mm across, so its radius is ${n(h)} mm. What is the area of its cross-section, π × ${n(h)}², in mm², to 2 decimal places?`, answer: [Ar], explanation: `π × ${n(v6(h * h))} ≈ ${f4(A)} mm², which rounds to ${n(Ar)} mm².` },
   { prompt: `With ρ = ${n(r)} × 10⁻⁸ Ω·m, L = ${n(L)} m and A = ${f4(A)} × 10⁻⁶ m², what is R = ρL ÷ A in ohms, to 2 decimal places?`, answer: [Rr], explanation: `R = (${n(r)} × 10⁻⁸ × ${n(L)}) ÷ (${f4(A)} × 10⁻⁶) ≈ ${f4(Rs)} Ω, which rounds to ${n(Rr)} Ω.` },
   { prompt: `The wire has a resistance of about ${f4(Rs)} Ω and carries ${n(I)} A. What power does it waste, P = I²R, to the nearest whole number of watts?`, answer: [Pr], explanation: `P = ${n(I * I)} × ${f4(Rs)} ≈ ${f4(P)} W, which rounds to ${n(Pr)} W.` }
  ] }; }
});

})();
