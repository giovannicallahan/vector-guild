/* Differential equations practice missions, file 7 of 8: concepts q31–q35, three practice missions each
   (q31b q31c q31d q32b q32c q32d q33b q33c q33d q34b q34c q34d q35b q35c q35d).
   Format and rules: docs/PACK-FORMAT.md, "Practice missions" (§10).
     b  kind 'setting'    the same skill in a new real-world setting
     c  kind 'applied'    a word problem with two or three steps (two or three guided steps)
     d  kind 'challenge'  harder numbers, or the skill combined with one earlier concept (optional `uses: 'qNN'`)
   A practice mission supplies only: id, parent, kind, title, brief, prompt, answer, labels, tolerance, hints,
   solution, guidance (and `uses` for a challenge). Everything else comes from its parent, the learn mission:
   topic, tier, xp, sector, lesson, teaching, sources, the concept bench and the review drill. Do not write those.
   Each mission is registered together with its generator by add(mission, generator); build(canonical) must
   reproduce the authored prompt, hints, solution and guidance exactly. Oracles: qa/realms/ode/oracle-p7.js. */
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
/* Signed terms: expr([[3, 's'], [−1, 'y'], [4, '']]) is '3s − y + 4' (zero terms dropped, coefficient 1 not written);
   tail(...) is the same with a leading sign: ' + 3s − y + 4'. */
const sgn = v => v < 0 ? '−' : '+';
const one = (v, x) => `${sgn(v)} ${Math.abs(v) === 1 && x ? '' : n(Math.abs(v))}${x}`;
const tail = terms => terms.filter(([v]) => v !== 0).map(([v, x]) => ' ' + one(v, x)).join('');
const expr = terms => { const t = tail(terms).trim(); return t.startsWith('+ ') ? t.slice(2) : t.startsWith('− ') ? '−' + t.slice(2) : t; };
/* (s − 3), (s + 2); e^(3t), e^(−t), e^t; a term c e^(kt). */
const fac = (r, v = 's') => r > 0 ? `(${v} − ${n(r)})` : `(${v} + ${n(-r)})`;
const ex = k => k === 1 ? 'e^t' : k === -1 ? 'e^(−t)' : `e^(${n(k)}t)`;
const eTerm = (c, k, first) => { const body = `${Math.abs(c) === 1 ? '' : n(Math.abs(c))}${ex(k)}`; return first ? (c < 0 ? '−' : '') + body : ` ${sgn(c)} ${body}`; };
const es = a => a === 1 ? 'e^(−s)' : `e^(−${n(a)}s)`;
/* Fixed decimals with a real minus sign. */
const fx = (x, d) => (x < 0 ? '−' : '') + Math.abs(x).toFixed(d);
const r3 = x => Math.round(x * 1000) / 1000;
/* True when x sits close to a rounding tie at d decimals, so the last digit would hang on float noise. */
const nearTie = (x, d) => { const f = (Math.abs(x) * Math.pow(10, d)) % 1; return Math.abs(f - 0.5) < 0.02; };
/* At most 1000 tries, then the canonical parameters. */
const tries = (make, ok, fallback) => { for (let i = 0; i < 1000; i++) { const p = make(); if (ok(p)) return p; } return Object.assign({}, fallback); };
const co = x => x === 1 ? '' : n(x);
const same = (p, c) => Object.keys(c).every(k => p[k] === c[k]);

/* ---- q31 Inverse transforms with partial fractions [6.1] ---- */

mk({
 id: 'q31b', parent: 'q31', kind: 'setting', title: 'The bench sensor trace',
 brief: 'A sensor on the calibration bench reports its output only as a transform, with the bottom multiplied out, and the crew needs the trace itself.',
 labels: ['larger root r₁', 'A', 'B'], tolerance: 0.01,
 gl: [['r₁'], ['A'], ['B']]
}, {
 /* F(s) = (αs + β) ÷ (s² + ps + q) built from A ÷ (s − a) + B ÷ (s − b), a > b, both non-zero, A + B ≠ 0, so the bottom factors over the whole numbers.
    Not the parent's numbers (a = 3, b = −2, A = 4, B = −1) nor its worked example (a = 1, b = −1, A = 2, B = 3). */
 canonical: { a: 2, b: -3, A: 3, B: -2 },
 draw: R => tries(() => ({ a: R.nz(-4, 5), b: R.nz(-5, 4), A: R.nz(-5, 5), B: R.nz(-5, 5) }),
  p => p.a > p.b && p.A + p.B !== 0 && !(p.a === 1 && p.b === -1 && p.A === 2 && p.B === 3) && !(p.a === 3 && p.b === -2 && p.A === 4 && p.B === -1), { a: 2, b: -3, A: 3, B: -2 }),
 build: ({ a, b, A, B }) => { const al = A + B, be = -(A * b + B * a), top = expr([[al, 's'], [be, '']]), bot = expr([[1, 's²'], [-(a + b), 's'], [a * b, '']]),
  Na = al * a + be, Nb = al * b + be; return {
  prompt: `A sensor on the signal shop’s calibration bench reports its output as the transform F(s) = (${top}) ÷ (${bot}). The bottom factors into two different linear factors (s − r₁)(s − r₂) with r₁ > r₂, and the signal itself is f(t) = A e^(r₁t) + B e^(r₂t). Enter r₁, then A, then B.`,
  answer: [a, A, B],
  hints: ['To factor a bottom s² + ps + q, look for two numbers r₁ and r₂ that add up to −p and multiply to q. They are the roots, and the factors are (s − r₁) and (s − r₂).',
   'Split F(s) into A ÷ (s − r₁) + B ÷ (s − r₂). Cover up one factor at a time and put its root into what is left to find A and B. Each piece A ÷ (s − r) is the transform of A e^(rt).'],
  solution: `The roots of the bottom add up to ${n(a + b)} and multiply to ${n(a * b)}, so they are ${n(a)} and ${n(b)}: the bottom is ${fac(a)}${fac(b)} and r₁ = ${n(a)}. Write F(s) = A ÷ ${fac(a)} + B ÷ ${fac(b)}. Covering up ${fac(a)} and putting s = ${n(a)} into the rest gives A = ${par(Na)} ÷ ${par(a - b)} = ${n(A)}. Covering up ${fac(b)} and putting s = ${n(b)} gives B = ${par(Nb)} ÷ ${par(b - a)} = ${n(B)}. So f(t) = ${eTerm(A, a, true)}${eTerm(B, b, false)}.`,
  guidance: [
   { prompt: `The bottom is ${bot}. Find two numbers that add up to ${n(a + b)} and multiply to ${n(a * b)}. What is the larger one, r₁?`, answer: [a], explanation: `${n(a)} and ${n(b)} add up to ${n(a + b)} and multiply to ${n(a * b)}, so the bottom is ${fac(a)}${fac(b)} and the larger root is ${n(a)}.` },
   { prompt: `Cover up ${fac(a)} in F(s) = (${top}) ÷ (${fac(a)}${fac(b)}) and put s = ${n(a)} into what is left. What is A?`, answer: [A], explanation: `What is left is (${top}) ÷ ${fac(b)}. At s = ${n(a)} the top is ${n(Na)} and the bottom is ${n(a - b)}, so A = ${par(Na)} ÷ ${par(a - b)} = ${n(A)}.` },
   { prompt: `Now cover up ${fac(b)} and put s = ${n(b)} into what is left. What is B?`, answer: [B], explanation: `What is left is (${top}) ÷ ${fac(a)}. At s = ${n(b)} the top is ${n(Nb)} and the bottom is ${n(b - a)}, so B = ${par(Nb)} ÷ ${par(b - a)} = ${n(B)}.` }
  ] }; }
});

mk({
 id: 'q31c', parent: 'q31', kind: 'applied', title: 'The dying fault current',
 brief: 'A relay on the test bench is switched off after a fault, and the crew needs to know how much current is still flowing a moment later.',
 labels: ['A', 'B', 'current at the time asked (A)'], tolerance: 0.0005,
 gl: [['A'], ['B'], ['current (A)']]
}, {
 /* F(s) = (αs + β) ÷ ((s − a)(s − b)) with a > b both negative (the current dies away), A, B non-zero, A + B ≠ 0.
    f(T) = A e^(aT) + B e^(bT): at least 0.05 in size and not near a rounding tie at 3 decimals. */
 canonical: { a: -1, b: -3, A: 5, B: -2, T: 1 },
 draw: R => tries(() => { const a = R.int(-4, -1); return { a, b: R.int(-6, a - 1), A: R.nz(-6, 6), B: R.nz(-6, 6), T: R.pick([0.5, 1, 1.5]) }; },
  p => { const v = p.A * Math.exp(p.a * p.T) + p.B * Math.exp(p.b * p.T); return p.A + p.B !== 0 && Math.abs(v) >= 0.05 && !nearTie(v, 3); }, { a: -1, b: -3, A: 5, B: -2, T: 1 }),
 build: ({ a, b, A, B, T }) => { const al = A + B, be = -(A * b + B * a), top = expr([[al, 's'], [be, '']]), F = `(${top}) ÷ (${fac(a)}${fac(b)})`,
  Na = al * a + be, Nb = al * b + be, e1 = Math.exp(a * T), e2 = Math.exp(b * T), v = A * e1 + B * e2; return {
  prompt: `After a fault, the current f(t) in a relay on the signal shop’s test bench, in amperes, dies away as t seconds pass since the switch-off. Its Laplace transform is F(s) = ${F}, and the current has the form f(t) = A ${ex(a)} + B ${ex(b)}. Enter A, then B, then the current f(${n(T)}) to 3 decimal places.`,
  answer: [A, B, r3(v)],
  hints: ['Split F(s) into partial fractions, one piece for each factor of the bottom. Cover up one factor at a time and put its root into what is left to find A and B.',
   'Once you have A and B, put the time into the two exponentials with a calculator. Round only at the end, not the exponentials.'],
  solution: `Write F(s) = A ÷ ${fac(a)} + B ÷ ${fac(b)}. Covering up ${fac(a)} and putting s = ${n(a)} into the rest gives A = ${par(Na)} ÷ ${par(a - b)} = ${n(A)}. Covering up ${fac(b)} and putting s = ${n(b)} gives B = ${par(Nb)} ÷ ${par(b - a)} = ${n(B)}. So f(t) = ${eTerm(A, a, true)}${eTerm(B, b, false)}, and f(${n(T)}) = ${n(A)} × e^(${n(a * T)}) ${sgn(B)} ${n(Math.abs(B))} × e^(${n(b * T)}) ≈ ${fx(v, 4)}, which is ${fx(r3(v), 3)} to 3 decimal places.`,
  guidance: [
   { prompt: `Cover up ${fac(a)} in F(s) = ${F} and put s = ${n(a)} into what is left. What is A?`, answer: [A], explanation: `What is left is (${top}) ÷ ${fac(b)}. At s = ${n(a)} the top is ${n(Na)} and the bottom is ${n(a - b)}, so A = ${par(Na)} ÷ ${par(a - b)} = ${n(A)}.` },
   { prompt: `Now cover up ${fac(b)} and put s = ${n(b)} into what is left. What is B?`, answer: [B], explanation: `What is left is (${top}) ÷ ${fac(a)}. At s = ${n(b)} the top is ${n(Nb)} and the bottom is ${n(b - a)}, so B = ${par(Nb)} ÷ ${par(b - a)} = ${n(B)}.` },
   { prompt: `So f(t) = ${eTerm(A, a, true)}${eTerm(B, b, false)}. What is f(${n(T)}), to 3 decimal places?`, answer: [r3(v)], explanation: `f(${n(T)}) = ${n(A)} × ${n(e1)} ${sgn(B)} ${n(Math.abs(B))} × ${n(e2)} ≈ ${fx(v, 4)}, which is ${fx(r3(v), 3)} to 3 decimal places.` }
  ] }; }
});

mk({
 id: 'q31d', parent: 'q31', kind: 'challenge', uses: 'q30', title: 'The ramp on the relay',
 brief: 'A calibration run adds a steadily rising ramp to a relay’s signal, and the crew has the combined transform to unpack.',
 labels: ['A', 'B', 'signal at the time asked'], tolerance: 0.0005,
 gl: [['A'], ['B'], ['signal']]
}, {
 /* F(s) = (αs + β) ÷ ((s − a)(s − b)) + m ÷ s², so f(t) = A e^(at) + B e^(bt) + m t. a > b, non-zero, A + B ≠ 0, m ≥ 2.
    |f(T)| at least 0.05 and below 500, not near a rounding tie at 3 decimals. Not the parent's numbers. */
 canonical: { a: 2, b: -4, A: 3, B: -5, m: 6, T: 1.5 },
 draw: R => tries(() => ({ a: R.nz(-4, 4), b: R.nz(-5, 4), A: R.nz(-7, 7), B: R.nz(-7, 7), m: R.int(2, 9), T: R.pick([0.5, 1, 1.5]) }),
  p => { if (!(p.a > p.b) || p.A + p.B === 0 || (p.a === 3 && p.b === -2 && p.A === 4 && p.B === -1)) return false;
   const v = p.A * Math.exp(p.a * p.T) + p.B * Math.exp(p.b * p.T) + p.m * p.T; return Math.abs(v) >= 0.05 && Math.abs(v) < 500 && !nearTie(v, 3); }, { a: 2, b: -4, A: 3, B: -5, m: 6, T: 1.5 }),
 build: ({ a, b, A, B, m, T }) => { const al = A + B, be = -(A * b + B * a), top = expr([[al, 's'], [be, '']]), F = `(${top}) ÷ (${fac(a)}${fac(b)}) + ${n(m)} ÷ s²`,
  Na = al * a + be, Nb = al * b + be, e1 = Math.exp(a * T), e2 = Math.exp(b * T), v = A * e1 + B * e2 + m * T, f = `${eTerm(A, a, true)}${eTerm(B, b, false)} + ${n(m)}t`; return {
  prompt: `A calibration run in the signal shop adds a steadily rising ramp to a relay’s signal. The combined signal has Laplace transform F(s) = ${F}. From the transform table, 1 ÷ s² is the transform of t, so the second piece is already known. The signal has the form f(t) = A ${ex(a)} + B ${ex(b)} + ${n(m)}t. Enter A, then B, then f(${n(T)}) to 3 decimal places.`,
  answer: [A, B, r3(v)],
  hints: ['Only the first fraction needs partial fractions: write it as A ÷ (s − a) + B ÷ (s − b) and cover up one factor at a time. The piece with s² on the bottom is already a table entry.',
   'The inverse transform is linear, so the signal is the sum of the signals of the pieces: A e^(at) from the first piece, B e^(bt) from the second, and the ramp from the third. Round only at the end.'],
  solution: `The piece ${n(m)} ÷ s² is the transform of ${n(m)}t. For the first fraction, write A ÷ ${fac(a)} + B ÷ ${fac(b)}. Covering up ${fac(a)} and putting s = ${n(a)} into the rest gives A = ${par(Na)} ÷ ${par(a - b)} = ${n(A)}. Covering up ${fac(b)} and putting s = ${n(b)} gives B = ${par(Nb)} ÷ ${par(b - a)} = ${n(B)}. So f(t) = ${f}, and f(${n(T)}) = ${n(A)} × e^(${n(a * T)}) ${sgn(B)} ${n(Math.abs(B))} × e^(${n(b * T)}) + ${n(m)} × ${n(T)} ≈ ${fx(v, 4)}, which is ${fx(r3(v), 3)} to 3 decimal places.`,
  guidance: [
   { prompt: `Cover up ${fac(a)} in the first fraction, (${top}) ÷ (${fac(a)}${fac(b)}), and put s = ${n(a)} into what is left. What is A?`, answer: [A], explanation: `What is left is (${top}) ÷ ${fac(b)}. At s = ${n(a)} the top is ${n(Na)} and the bottom is ${n(a - b)}, so A = ${par(Na)} ÷ ${par(a - b)} = ${n(A)}.` },
   { prompt: `Now cover up ${fac(b)} and put s = ${n(b)} into what is left. What is B?`, answer: [B], explanation: `What is left is (${top}) ÷ ${fac(a)}. At s = ${n(b)} the top is ${n(Nb)} and the bottom is ${n(b - a)}, so B = ${par(Nb)} ÷ ${par(b - a)} = ${n(B)}.` },
   { prompt: `So f(t) = ${f}. What is f(${n(T)}), to 3 decimal places?`, answer: [r3(v)], explanation: `f(${n(T)}) = ${n(A)} × ${n(e1)} ${sgn(B)} ${n(Math.abs(B))} × ${n(e2)} + ${n(m * T)} ≈ ${fx(v, 4)}, which is ${fx(r3(v), 3)} to 3 decimal places.` }
  ] }; }
});

/* ---- q32 Solving an initial value problem with the transform [6.2] ---- */

mk({
 id: 'q32b', parent: 'q32', kind: 'setting', title: 'The tapped relay arm',
 brief: 'A relay arm sits at rest until a tap sets it moving, and the crew wants to know where it is a moment later.',
 labels: ['A', 'position at the time asked (mm)'], tolerance: 0.0005,
 gl: [['c'], ['A'], ['position (mm)']]
}, {
 /* y″ + py′ + qy = 0 with roots r1 > r2 (both non-zero), y(0) = 0 and y′(0) = v0 = A(r1 − r2), so y = A(e^(r1 t) − e^(r2 t)) and the bottom of Y is a plain number v0.
    |y(T)| at least 0.05 and below 500, not near a rounding tie at 3 decimals. */
 canonical: { r1: -1, r2: -4, A: 2, T: 1 },
 draw: R => tries(() => { const r1 = R.nz(-4, 3); return { r1, r2: R.int(-5, r1 - 1), A: R.nz(-4, 4), T: R.pick([0.5, 1, 1.5, 2]) }; },
  p => { if (p.r2 === 0) return false; const v = p.A * (Math.exp(p.r1 * p.T) - Math.exp(p.r2 * p.T)); return Math.abs(v) >= 0.05 && Math.abs(v) < 500 && !nearTie(v, 3); }, { r1: -1, r2: -4, A: 2, T: 1 }),
 build: ({ r1, r2, A, T }) => { const p = -(r1 + r2), q = r1 * r2, v0 = A * (r1 - r2), B = -A, eq = `${expr([[1, 'y″'], [p, 'y′'], [q, 'y']])} = 0`, bottom = expr([[1, 's²'], [p, 's'], [q, '']]),
  e1 = Math.exp(r1 * T), e2 = Math.exp(r2 * T), v = A * e1 + B * e2; return {
  prompt: `A relay arm in the signal shop rests at y = 0 when a tap gives it a speed. Its position y, in millimetres, t seconds after the tap obeys ${eq}, with y(0) = 0 and y′(0) = ${n(v0)}. Solve it with the Laplace transform. The transform Y(s) splits into partial fractions A ÷ (s − r₁) + B ÷ (s − r₂), where r₁ > r₂ are the two roots of its bottom. Enter A, then y(${n(T)}) to 3 decimal places.`,
  answer: [A, r3(v)],
  hints: ['With y(0) = 0, the transform of y″ is s²Y − y′(0) and the transform of y′ is just sY. Collect the Y terms on the left: the right side is then a plain number.',
   'Factor the bottom of Y(s), then cover up one factor at a time to find A and B. Because y(0) = 0, the two constants must add up to 0, which checks your work. Then put the time into y(t) = A e^(r₁t) + B e^(r₂t).'],
  solution: `Transforming with y(0) = 0, ℒ{y″} = s²Y${tail([[-v0, '']])} and ℒ{y′} = sY. Collecting the Y terms gives (${bottom})Y = ${n(v0)}, so Y(s) = ${n(v0)} ÷ (${fac(r1)}${fac(r2)}). Covering up ${fac(r1)} and putting s = ${n(r1)} gives A = ${n(v0)} ÷ ${par(r1 - r2)} = ${n(A)}; covering up ${fac(r2)} and putting s = ${n(r2)} gives B = ${n(v0)} ÷ ${par(r2 - r1)} = ${n(B)}. So y(t) = ${eTerm(A, r1, true)}${eTerm(B, r2, false)}, and y(${n(T)}) = ${n(A)} × e^(${n(r1 * T)}) ${sgn(B)} ${n(Math.abs(B))} × e^(${n(r2 * T)}) ≈ ${fx(v, 4)}, which is ${fx(r3(v), 3)} to 3 decimal places.`,
  guidance: [
   { prompt: `Transform ${eq} with y(0) = 0 and y′(0) = ${n(v0)}, and collect the Y terms: (${bottom})Y = c. What is the constant c?`, answer: [v0], explanation: `ℒ{y″} = s²Y${tail([[-v0, '']])} and the other terms keep their Y. Moving the number to the right leaves c = ${n(v0)}.` },
   { prompt: `The bottom factors as ${fac(r1)}${fac(r2)}. Cover up ${fac(r1)} and put s = ${n(r1)} into what is left of Y(s) = ${n(v0)} ÷ (${fac(r1)}${fac(r2)}). What is A?`, answer: [A], explanation: `What is left is ${n(v0)} ÷ ${fac(r2)}. At s = ${n(r1)} the bottom is ${n(r1 - r2)}, so A = ${n(v0)} ÷ ${par(r1 - r2)} = ${n(A)}.` },
   { prompt: `With B = ${n(B)}, y(t) = ${eTerm(A, r1, true)}${eTerm(B, r2, false)}. What is y(${n(T)}), to 3 decimal places?`, answer: [r3(v)], explanation: `y(${n(T)}) = ${n(A)} × ${n(e1)} ${sgn(B)} ${n(Math.abs(B))} × ${n(e2)} ≈ ${fx(v, 4)}, which is ${fx(r3(v), 3)} to 3 decimal places.` }
  ] }; }
});

mk({
 id: 'q32c', parent: 'q32', kind: 'applied', title: 'The needle’s speed',
 brief: 'A flicked needle swings back to rest, and the alarm board needs to know how fast it is moving at one instant.',
 labels: ['A', 'B', 'velocity at the time asked (mm/s)'], tolerance: 0.0005,
 gl: [['c'], ['A'], ['velocity (mm/s)']]
}, {
 /* y″ + py′ + qy = 0 with roots r1 > r2 (both non-zero), y = A e^(r1 t) + B e^(r2 t); y′(T) = A r1 e^(r1 T) + B r2 e^(r2 T).
    |y′(T)| at least 0.05 and below 500, not near a rounding tie at 3 decimals; y(0) ≠ 0 so the right side keeps its s term. */
 canonical: { r1: -2, r2: -5, A: 3, B: -1, T: 0.5 },
 draw: R => tries(() => { const r1 = R.nz(-4, 2); return { r1, r2: R.int(-6, r1 - 1), A: R.nz(-4, 4), B: R.nz(-4, 4), T: R.pick([0.5, 1, 1.5]) }; },
  p => { if (p.r2 === 0 || p.A + p.B === 0) return false; const v = p.A * p.r1 * Math.exp(p.r1 * p.T) + p.B * p.r2 * Math.exp(p.r2 * p.T);
   return Math.abs(v) >= 0.05 && Math.abs(v) < 500 && !nearTie(v, 3) && !(p.r1 === -1 && p.r2 === -2 && p.A === 3 && p.B === -1); }, { r1: -2, r2: -5, A: 3, B: -1, T: 0.5 }),
 build: ({ r1, r2, A, B, T }) => { const p = -(r1 + r2), q = r1 * r2, y0 = A + B, y1 = A * r1 + B * r2, cc = y1 + p * y0,
  eq = `${expr([[1, 'y″'], [p, 'y′'], [q, 'y']])} = 0`, bottom = expr([[1, 's²'], [p, 's'], [q, '']]), top = expr([[y0, 's'], [cc, '']]),
  N1 = y0 * r1 + cc, N2 = y0 * r2 + cc, e1 = Math.exp(r1 * T), e2 = Math.exp(r2 * T), v = A * r1 * e1 + B * r2 * e2; return {
  prompt: `A flicked meter needle in the signal shop swings back to rest. Its deflection y, in millimetres, t seconds after release obeys ${eq}, with y(0) = ${n(y0)} and y′(0) = ${n(y1)}. Solve it with the Laplace transform, so that y(t) = A e^(r₁t) + B e^(r₂t), where r₁ > r₂ are the two roots of the bottom of Y(s). The alarm board needs the needle’s velocity y′ in millimetres per second (a negative velocity means y is falling). Enter A, then B, then y′(${n(T)}) to 3 decimal places.`,
  answer: [A, B, r3(v)],
  hints: ['Use ℒ{y′} = sY − y(0) and ℒ{y″} = s²Y − s·y(0) − y′(0). Collect the Y terms on one side, factor the bottom, and cover up one factor at a time to find A and B.',
   'Differentiate y(t) = A e^(r₁t) + B e^(r₂t) term by term: the derivative of e^(rt) is r e^(rt). Then put in the time with a calculator and round only at the end.'],
  solution: `Transforming term by term, ℒ{y″} = s²Y${tail([[-y0, 's'], [-y1, '']])} and ℒ{y′} = sY${tail([[-y0, '']])}. Collecting the Y terms gives (${bottom})Y = ${top}, so Y(s) = (${top}) ÷ (${fac(r1)}${fac(r2)}). Covering up ${fac(r1)} and putting s = ${n(r1)} gives A = ${par(N1)} ÷ ${par(r1 - r2)} = ${n(A)}; covering up ${fac(r2)} and putting s = ${n(r2)} gives B = ${par(N2)} ÷ ${par(r2 - r1)} = ${n(B)}. So y(t) = ${eTerm(A, r1, true)}${eTerm(B, r2, false)} and y′(t) = ${eTerm(A * r1, r1, true)}${eTerm(B * r2, r2, false)}. At t = ${n(T)}, y′ = ${n(A * r1)} × e^(${n(r1 * T)}) ${sgn(B * r2)} ${n(Math.abs(B * r2))} × e^(${n(r2 * T)}) ≈ ${fx(v, 4)}, which is ${fx(r3(v), 3)} to 3 decimal places.`,
  guidance: [
   { prompt: `Transform ${eq} with y(0) = ${n(y0)} and y′(0) = ${n(y1)}, and collect the Y terms: (${bottom})Y = ${expr([[y0, 's']])} + c. What is the constant c?`, answer: [cc], explanation: `ℒ{y″} = s²Y${tail([[-y0, 's'], [-y1, '']])}${p !== 0 ? ` and ${n(p)} × ℒ{y′} = ${n(p)}(sY${tail([[-y0, '']])})` : ''}. Moving every term without Y to the right leaves ${top}, so c = ${n(cc)}.` },
   { prompt: `The bottom factors as ${fac(r1)}${fac(r2)}. Cover up ${fac(r1)} and put s = ${n(r1)} into what is left of Y(s). What is A?`, answer: [A], explanation: `At s = ${n(r1)} the top is ${n(N1)} and the other factor is ${n(r1 - r2)}, so A = ${par(N1)} ÷ ${par(r1 - r2)} = ${n(A)}.` },
   { prompt: `Covering up ${fac(r2)} gives B = ${n(B)}, so y(t) = ${eTerm(A, r1, true)}${eTerm(B, r2, false)} and y′(t) = ${eTerm(A * r1, r1, true)}${eTerm(B * r2, r2, false)}. What is y′(${n(T)}), to 3 decimal places?`, answer: [r3(v)], explanation: `y′(${n(T)}) = ${n(A * r1)} × ${n(e1)} ${sgn(B * r2)} ${n(Math.abs(B * r2))} × ${n(e2)} ≈ ${fx(v, 4)}, which is ${fx(r3(v), 3)} to 3 decimal places.` }
  ] }; }
});

mk({
 id: 'q32d', parent: 'q32', kind: 'challenge', uses: 'q13', title: 'The heavy meter needle',
 brief: 'A heavier meter needle in the signal shop has a number in front of its y″ term, and the crew needs its swing back to rest.',
 labels: ['A', 'B', 'y at the time asked'], tolerance: 0.0005,
 gl: [['K'], ['A'], ['B'], ['y']]
}, {
 /* m y″ + c y′ + k y = 0 with c = −m(r1 + r2), k = m r1 r2, roots r1 > r2 (both non-zero), y = A e^(r1 t) + B e^(r2 t), y(0) = A + B ≠ 0.
    The right side of (m s² + c s + k)Y is m·y(0)s + K with K = m y′(0) + c y(0). |y(T)| at least 0.05 and below 500, not near a tie at 3 decimals. */
 canonical: { m: 2, r1: 1, r2: -2, A: 3, B: -1, T: 1 },
 draw: R => tries(() => { const r1 = R.nz(-3, 3); return { m: R.pick([2, 3, 4]), r1, r2: R.int(-4, r1 - 1), A: R.nz(-4, 4), B: R.nz(-4, 4), T: R.pick([0.5, 1, 1.5]) }; },
  p => { if (p.r2 === 0 || p.A + p.B === 0) return false; const v = p.A * Math.exp(p.r1 * p.T) + p.B * Math.exp(p.r2 * p.T); return Math.abs(v) >= 0.05 && Math.abs(v) < 500 && !nearTie(v, 3); }, { m: 2, r1: 1, r2: -2, A: 3, B: -1, T: 1 }),
 build: ({ m, r1, r2, A, B, T }) => { const c = -m * (r1 + r2), k = m * r1 * r2, y0 = A + B, y1 = A * r1 + B * r2, K = m * y1 + c * y0,
  eq = `${expr([[m, 'y″'], [c, 'y′'], [k, 'y']])} = 0`, bottom = expr([[m, 's²'], [c, 's'], [k, '']]), top = expr([[m * y0, 's'], [K, '']]),
  N1 = m * y0 * r1 + K, N2 = m * y0 * r2 + K, e1 = Math.exp(r1 * T), e2 = Math.exp(r2 * T), v = A * e1 + B * e2; return {
  prompt: `A heavy meter needle in the signal shop obeys ${eq}, where y is its deflection in millimetres and t is in seconds, with y(0) = ${n(y0)} and y′(0) = ${n(y1)}. Solve it with the Laplace transform. The bottom of Y(s) is ${n(m)} times (s − r₁)(s − r₂), where r₁ > r₂ are the roots of ${expr([[m, 'r²'], [c, 'r'], [k, '']])} = 0, and Y(s) splits into partial fractions A ÷ (s − r₁) + B ÷ (s − r₂). Enter A, then B, then y(${n(T)}) to 3 decimal places.`,
  answer: [A, B, r3(v)],
  hints: ['Transform every term, including the number in front of y″ and y′. Collect the Y terms on the left; the right side is a number times s plus a constant.',
   'The bottom is the number in front of s² times (s − r₁)(s − r₂). When you cover up one factor and put its root into the rest, that number stays in the bottom. Then y(t) = A e^(r₁t) + B e^(r₂t).'],
  solution: `Transforming, ${n(m)}ℒ{y″} = ${n(m)}(s²Y${tail([[-y0, 's'], [-y1, '']])})${c !== 0 ? ` and ${n(c)}ℒ{y′} = ${n(c)}(sY${tail([[-y0, '']])})` : ''}. Collecting the Y terms gives (${bottom})Y = ${top}. The roots of ${expr([[m, 'r²'], [c, 'r'], [k, '']])} = 0 are ${n(r1)} and ${n(r2)}, so Y(s) = (${top}) ÷ (${n(m)}${fac(r1)}${fac(r2)}). Covering up ${fac(r1)} and putting s = ${n(r1)} gives A = ${par(N1)} ÷ (${n(m)} × ${par(r1 - r2)}) = ${n(A)}; covering up ${fac(r2)} and putting s = ${n(r2)} gives B = ${par(N2)} ÷ (${n(m)} × ${par(r2 - r1)}) = ${n(B)}. So y(t) = ${eTerm(A, r1, true)}${eTerm(B, r2, false)}, and y(${n(T)}) = ${n(A)} × e^(${n(r1 * T)}) ${sgn(B)} ${n(Math.abs(B))} × e^(${n(r2 * T)}) ≈ ${fx(v, 4)}, which is ${fx(r3(v), 3)} to 3 decimal places.`,
  guidance: [
   { prompt: `Transform ${eq} with y(0) = ${n(y0)} and y′(0) = ${n(y1)}, and collect the Y terms: (${bottom})Y = ${expr([[m * y0, 's']])} + K. What is the constant K?`, answer: [K], explanation: `${n(m)}ℒ{y″} = ${n(m)}(s²Y${tail([[-y0, 's'], [-y1, '']])})${c !== 0 ? ` and ${n(c)}ℒ{y′} = ${n(c)}(sY${tail([[-y0, '']])})` : ''}. Moving every term without Y to the right leaves ${top}, so K = ${n(K)}.` },
   { prompt: `Y(s) = (${top}) ÷ (${n(m)}${fac(r1)}${fac(r2)}). Cover up ${fac(r1)} and put s = ${n(r1)} into what is left, keeping the ${n(m)} in the bottom. What is A?`, answer: [A], explanation: `At s = ${n(r1)} the top is ${n(N1)} and the bottom is ${n(m)} × ${par(r1 - r2)} = ${n(m * (r1 - r2))}, so A = ${par(N1)} ÷ ${par(m * (r1 - r2))} = ${n(A)}.` },
   { prompt: `Now cover up ${fac(r2)} and put s = ${n(r2)} into what is left, again keeping the ${n(m)}. What is B?`, answer: [B], explanation: `At s = ${n(r2)} the top is ${n(N2)} and the bottom is ${n(m)} × ${par(r2 - r1)} = ${n(m * (r2 - r1))}, so B = ${par(N2)} ÷ ${par(m * (r2 - r1))} = ${n(B)}.` },
   { prompt: `So y(t) = ${eTerm(A, r1, true)}${eTerm(B, r2, false)}. What is y(${n(T)}), to 3 decimal places?`, answer: [r3(v)], explanation: `y(${n(T)}) = ${n(A)} × ${n(e1)} ${sgn(B)} ${n(Math.abs(B))} × ${n(e2)} ≈ ${fx(v, 4)}, which is ${fx(r3(v), 3)} to 3 decimal places.` }
  ] }; }
});

/* ---- q33 Switch-ons: the Heaviside function [6.2] ---- */

mk({
 id: 'q33b', parent: 'q33', kind: 'setting', title: 'The heated test bath',
 brief: 'A heater at the bottom of a test bath is switched on some minutes after the shop opens, and the crew wants the water temperature a little later.',
 labels: ['long-run rise (°C)', 'rise at the time asked (°C)'], tolerance: 0.0005,
 gl: [['P'], ['rise (°C)']]
}, {
 /* w′ = k·m·u(t − a) − k·w, w(0) = 0: w = m(1 − e^(−k(t − a))) after the switch, so the long-run rise is m.
    Not the parent's numbers (k = 2, m = 3, a = 3, d = 1) nor its worked example (k = 1, m = 4, a = 2). Value at least 0.05, not near a tie at 3 decimals. */
 canonical: { k: 3, m: 4, a: 1, d: 1 },
 draw: R => tries(() => ({ k: R.int(1, 5), m: R.int(2, 9), a: R.int(1, 5), d: R.pick([0.5, 1, 1.5, 2]) }),
  p => !nearTie(p.m * (1 - Math.exp(-p.k * p.d)), 3) && !(p.k === 1 && p.m === 4 && p.a === 2) && !(p.k === 2 && p.m === 3 && p.a === 3 && p.d === 1), { k: 3, m: 4, a: 1, d: 1 }),
 build: ({ k, m, a, d }) => { const F = k * m, t1 = a + d, v = m * (1 - Math.exp(-k * d)), kk = co(k),
  eq = `w′ = ${n(F)}u(t − ${n(a)}) − ${kk}w`, shape = `${n(m)}(1 − e^(−${kk}(t − ${n(a)})))`; return {
  prompt: `A heater at the bottom of a test bath in the signal shop is switched on at t = ${n(a)}, with t in minutes since the shop opened. The water’s temperature rise w, in °C above room temperature, obeys ${eq} with w(0) = 0: the heater adds heat, and the bath loses it. Enter the rise the bath settles to in the long run, then w(${n(t1)}) to 3 decimal places.`,
  answer: [m, r3(v)],
  hints: ['Move the loss term to the left so the equation reads w′ + kw = F u(t − a). Then use ℒ{u(t − a)} = e^(−as) ÷ s, transform both sides and split the part without e^(−as) into partial fractions.',
   'The shift rule: if g(t) has transform G(s), then e^(−as)G(s) is the transform of g(t − a)u(t − a). So find g first, then replace t by t − a and switch it on at t = a.'],
  solution: `Moving the loss term across gives w′ + ${kk}w = ${n(F)}u(t − ${n(a)}). Transforming with w(0) = 0 gives (s + ${n(k)})W = ${n(F)}${es(a)} ÷ s, so W(s) = ${es(a)} × ${n(F)} ÷ (s(s + ${n(k)})). In partial fractions, ${n(F)} ÷ (s(s + ${n(k)})) = ${n(m)} ÷ s − ${n(m)} ÷ (s + ${n(k)}), the transform of g(t) = ${n(m)}(1 − e^(−${kk}t)). By the shift rule, w(t) = ${shape} × u(t − ${n(a)}): 0 before the heater is on, then rising towards ${n(m)} °C, the long-run value. At t = ${n(t1)}, w = ${n(m)}(1 − e^(−${n(k * d)})) ≈ ${fx(v, 4)}, which is ${fx(r3(v), 3)} to 3 decimal places.`,
  guidance: [
   { prompt: `Written as w′ + ${kk}w = ${n(F)}u(t − ${n(a)}), the part ${n(F)} ÷ (s(s + ${n(k)})) splits as P ÷ s − P ÷ (s + ${n(k)}). What is P?`, answer: [m], explanation: `Cover up s and put s = 0 into ${n(F)} ÷ (s + ${n(k)}): P = ${n(F)} ÷ ${n(k)} = ${n(m)}. So the part is the transform of ${n(m)}(1 − e^(−${kk}t)), which settles at ${n(m)} °C.` },
   { prompt: `By the shift rule, w(t) = ${shape} for t ≥ ${n(a)}. What is w(${n(t1)}), to 3 decimal places?`, answer: [r3(v)], explanation: `t − ${n(a)} = ${n(d)}, so w = ${n(m)}(1 − e^(−${n(k * d)})) ≈ ${fx(v, 4)}, which is ${fx(r3(v), 3)} to 3 decimal places.` }
  ] }; }
});

mk({
 id: 'q33c', parent: 'q33', kind: 'applied', title: 'The test rig power check',
 brief: 'The test rig will only start once its power line has nearly reached its working voltage, and the crew has to decide whether it can start yet.',
 labels: ['long-run voltage (V)', 'voltage at the time asked (V)', 'ready (1 yes, 0 no)'], tolerance: 0.0005,
 gl: [['P'], ['voltage (V)'], ['ready (1 or 0)']]
}, {
 /* v′ + kv = k·m·u(t − a), v(0) = 0: v(t1) = m(1 − e^(−kd)), ready when v ≥ 0.9m, that is e^(−kd) ≤ 0.1, kd ≥ ln 10 ≈ 2.3026.
    kd stays more than 0.15 from ln 10, so the decision is clear. Not near a tie at 3 decimals. */
 canonical: { k: 2, m: 5, a: 3, d: 1.5 },
 draw: R => tries(() => ({ k: R.int(1, 4), m: R.int(2, 9), a: R.int(1, 5), d: R.pick([0.5, 1, 1.5, 2]) }),
  p => !nearTie(p.m * (1 - Math.exp(-p.k * p.d)), 3) && Math.abs(p.k * p.d - Math.LN10) > 0.15, { k: 2, m: 5, a: 3, d: 1.5 }),
 build: ({ k, m, a, d }) => { const F = k * m, t1 = a + d, v = m * (1 - Math.exp(-k * d)), kk = co(k), thr = 0.9 * m, ready = v >= thr ? 1 : 0,
  eq = `v′ + ${kk}v = ${n(F)}u(t − ${n(a)})`, shape = `${n(m)}(1 − e^(−${kk}(t − ${n(a)})))`; return {
  prompt: `The signal shop’s test rig runs from a power line whose voltage v, in volts, t seconds after the shop opens obeys ${eq} with v(0) = 0: the supply is switched on at t = ${n(a)}. The rig can start once v reaches at least 90 % of the voltage the line settles to. Enter that long-run voltage, then v(${n(t1)}) to 3 decimal places, then 1 if the rig can start at t = ${n(t1)} or 0 if not. Decide with the unrounded voltage.`,
  answer: [m, r3(v), ready],
  hints: ['ℒ{u(t − a)} = e^(−as) ÷ s. Transform both sides, split the part without e^(−as) into partial fractions, and use the shift rule: e^(−as)G(s) is the transform of g(t − a)u(t − a).',
   'The long-run voltage is the value the rise settles to. Take 90 % of it, find v at the time asked, and compare the two numbers before rounding anything.'],
  solution: `Transforming with v(0) = 0 gives (s + ${n(k)})V = ${n(F)}${es(a)} ÷ s, so V(s) = ${es(a)} × ${n(F)} ÷ (s(s + ${n(k)})). In partial fractions, ${n(F)} ÷ (s(s + ${n(k)})) = ${n(m)} ÷ s − ${n(m)} ÷ (s + ${n(k)}), the transform of ${n(m)}(1 − e^(−${kk}t)). By the shift rule, v(t) = ${shape} for t ≥ ${n(a)}, which settles at ${n(m)} V. At t = ${n(t1)}, v = ${n(m)}(1 − e^(−${n(k * d)})) ≈ ${fx(v, 4)}, which is ${fx(r3(v), 3)} to 3 decimal places. 90 % of ${n(m)} V is ${n(thr)} V, and ${fx(v, 4)} is ${ready ? 'at least' : 'below'} ${n(thr)}, so the answer is ${ready}.`,
  guidance: [
   { prompt: `The part ${n(F)} ÷ (s(s + ${n(k)})) splits as P ÷ s − P ÷ (s + ${n(k)}). What is P?`, answer: [m], explanation: `Cover up s and put s = 0 into ${n(F)} ÷ (s + ${n(k)}): P = ${n(F)} ÷ ${n(k)} = ${n(m)}. So the line settles at ${n(m)} V.` },
   { prompt: `By the shift rule, v(t) = ${shape} for t ≥ ${n(a)}. What is v(${n(t1)}), to 3 decimal places?`, answer: [r3(v)], explanation: `t − ${n(a)} = ${n(d)}, so v = ${n(m)}(1 − e^(−${n(k * d)})) ≈ ${fx(v, 4)}, which is ${fx(r3(v), 3)} to 3 decimal places.` },
   { prompt: `90 % of the long-run voltage is ${n(thr)} V, and v(${n(t1)}) ≈ ${fx(v, 4)} V. Enter 1 if v(${n(t1)}) is at least ${n(thr)} V, or 0 if it is below.`, answer: [ready], explanation: `${fx(v, 4)} is ${ready ? 'at least' : 'below'} ${n(thr)}, so the answer is ${ready}.` }
  ] }; }
});

mk({
 id: 'q33d', parent: 'q33', kind: 'challenge', title: 'Two switches on one line',
 brief: 'A charging line gets a second switch-on a little after the first, and the crew needs its voltage once both are in.',
 labels: ['long-run voltage (V)', 'v at the second switch (V)', 'v at the time asked (V)'], tolerance: 0.0005,
 gl: [['long-run voltage (V)'], ['v at the second switch (V)'], ['v (V)']]
}, {
 /* v′ + kv = k·m1·u(t − a) + k·m2·u(t − b), v(0) = 0, a < b < t1: v = m1(1 − e^(−k(t − a))) + m2(1 − e^(−k(t − b))).
    m2 may be negative (a load joins), m1 + m2 ≥ 1. v(b) and v(t1) not near a rounding tie at 3 decimals. */
 canonical: { k: 2, m1: 5, m2: -2, a: 1, g: 1, d: 1 },
 draw: R => tries(() => ({ k: R.int(1, 3), m1: R.int(3, 9), m2: R.nz(-6, 8), a: R.int(1, 3), g: R.pick([1, 2]), d: R.pick([0.5, 1, 1.5]) }),
  p => { if (p.m1 + p.m2 < 1 || Math.abs(p.m2) < 2) return false; const vb = p.m1 * (1 - Math.exp(-p.k * p.g)), v = vb + p.m2 * (1 - Math.exp(-p.k * p.d)) + p.m1 * (Math.exp(-p.k * p.g) - Math.exp(-p.k * (p.g + p.d)));
   return !nearTie(vb, 3) && !nearTie(v, 3); }, { k: 2, m1: 5, m2: -2, a: 1, g: 1, d: 1 }),
 build: ({ k, m1, m2, a, g, d }) => { const kk = co(k), b = a + g, t1 = b + d, F1 = k * m1, F2 = k * m2, vb = m1 * (1 - Math.exp(-k * g)),
  v = m1 * (1 - Math.exp(-k * (g + d))) + m2 * (1 - Math.exp(-k * d)), M = m1 + m2,
  eq = `v′ + ${kk}v = ${n(F1)}u(t − ${n(a)}) ${sgn(F2)} ${co(Math.abs(F2))}u(t − ${n(b)})`, g1 = `${n(m1)}(1 − e^(−${kk}(t − ${n(a)})))`, g2 = `${n(Math.abs(m2))}(1 − e^(−${kk}(t − ${n(b)})))`, sg = sgn(m2); return {
  prompt: `A charging line in the signal shop holds a voltage v, in volts, t seconds after the shop opens. It obeys ${eq} with v(0) = 0: a supply is switched on at t = ${n(a)}, and a second push starts at t = ${n(b)} (a minus sign means a load joins the line). Enter the voltage the line settles to in the long run, then v(${n(b)}) and v(${n(t1)}), both to 3 decimal places.`,
  answer: [M, r3(vb), r3(v)],
  hints: ['Transform both sides: each switch-on F u(t − c) becomes F e^(−cs) ÷ s. Split F ÷ (s(s + k)) into partial fractions for each switch, and use the shift rule on each part separately.',
   'Before the second switch, only the first term acts. After it, the voltage is the sum of the two shifted rises. The long-run voltage is the sum of what each switch tries to reach.'],
  solution: `Transforming with v(0) = 0 gives (s + ${n(k)})V = ${n(F1)}${es(a)} ÷ s ${sgn(F2)} ${n(Math.abs(F2))}${es(b)} ÷ s. Each switch’s part F ÷ (s(s + ${n(k)})) splits in partial fractions as m ÷ s − m ÷ (s + ${n(k)}) with m = F ÷ ${n(k)}: m = ${n(m1)} for the first switch and m = ${n(m2)} for the second. By the shift rule, v(t) = ${g1} for ${n(a)} ≤ t < ${n(b)}, and v(t) = ${g1} ${sg} ${g2} from t = ${n(b)} on. The long-run voltage is ${n(m1)} ${sg} ${n(Math.abs(m2))} = ${n(M)}. At t = ${n(b)}, v = ${n(m1)}(1 − e^(−${n(k * g)})) ≈ ${fx(vb, 4)}, which is ${fx(r3(vb), 3)} to 3 decimal places. At t = ${n(t1)}, v = ${n(m1)}(1 − e^(−${n(k * (g + d))})) ${sg} ${n(Math.abs(m2))}(1 − e^(−${n(k * d)})) ≈ ${fx(v, 4)}, which is ${fx(r3(v), 3)} to 3 decimal places.`,
  guidance: [
   { prompt: `Each switch-on pushes the line towards its own level: the first towards ${n(m1)} V and the second by ${n(m2)} V. What is the long-run voltage?`, answer: [M], explanation: `Each part F ÷ (s(s + ${n(k)})) settles at F ÷ ${n(k)}, which is ${n(m1)} and ${n(m2)}. They add: ${n(m1)} ${sg} ${n(Math.abs(m2))} = ${n(M)} V.` },
   { prompt: `Before t = ${n(b)} only the first switch acts, so v(t) = ${g1}. What is v(${n(b)}), to 3 decimal places?`, answer: [r3(vb)], explanation: `t − ${n(a)} = ${n(g)}, so v = ${n(m1)}(1 − e^(−${n(k * g)})) ≈ ${fx(vb, 4)}, which is ${fx(r3(vb), 3)} to 3 decimal places.` },
   { prompt: `From t = ${n(b)} on, v(t) = ${g1} ${sg} ${g2}. What is v(${n(t1)}), to 3 decimal places?`, answer: [r3(v)], explanation: `At t = ${n(t1)}, t − ${n(a)} = ${n(g + d)} and t − ${n(b)} = ${n(d)}, so v = ${n(m1)}(1 − e^(−${n(k * (g + d))})) ${sg} ${n(Math.abs(m2))}(1 − e^(−${n(k * d)})) ≈ ${fx(v, 4)}, which is ${fx(r3(v), 3)} to 3 decimal places.` }
  ] }; }
});

/* ---- q34 Impulses and convolution [6.3, 6.4] ---- */

mk({
 id: 'q34b', parent: 'q34', kind: 'setting', title: 'The pulse mixer and the capacitor',
 brief: 'The signal shop is testing a mixer that blends a steady signal with a ramp, and a capacitor that takes one sudden kick.',
 labels: ['(f ∗ g) at the time asked', 'charge at the time asked'], tolerance: 0.0005,
 gl: [['(f ∗ g)(T)'], ['charge']]
}, {
 /* f(t) = p, g(t) = q·t: (f ∗ g)(T) = ∫ from 0 to T of p·q(T − τ) dτ = pqT² ÷ 2, a whole number (pqT² even).
    y′ = −ky + cδ(t − a), y(0) = 0: y = c e^(−k(t − a)) after t = a. Value at least 0.05, not near a tie at 3 decimals. Not the parent's numbers. */
 canonical: { p: 3, q: 2, T: 5, k: 2, c: 7, a: 1, d: 1 },
 draw: R => tries(() => ({ p: R.int(2, 6), q: R.int(2, 5), T: R.int(2, 6), k: R.int(1, 4), c: R.int(2, 9), a: R.int(1, 4), d: R.pick([0.5, 1, 1.5, 2]) }),
  p => (p.p * p.q * p.T * p.T) % 2 === 0 && !nearTie(p.c * Math.exp(-p.k * p.d), 3) && p.c * Math.exp(-p.k * p.d) >= 0.05 && !(p.p === 1 && p.q === 4 && p.T === 3), { p: 3, q: 2, T: 5, k: 2, c: 7, a: 1, d: 1 }),
 build: ({ p, q, T, k, c, a, d }) => { const pq = p * q, conv = pq * T * T / 2, t1 = a + d, y = c * Math.exp(-k * d), kk = co(k); return {
  prompt: `Two checks on the signal shop’s bench. First, a mixer blends a steady signal f(t) = ${n(p)} with a ramp g(t) = ${n(q)}t by convolution: enter (f ∗ g)(${n(T)}). Second, the charge y on a capacitor obeys y′ = −${kk}y + ${n(c)}δ(t − ${n(a)}) with y(0) = 0: a sudden kick of size ${n(c)} at t = ${n(a)}. Enter y(${n(t1)}) to 3 decimal places.`,
  answer: [conv, r3(y)],
  hints: ['The convolution is (f ∗ g)(t) = ∫ from 0 to t of f(τ)g(t − τ) dτ. To get g(t − τ), put t − τ in place of t in the formula for g, then integrate in τ.',
   'Move the −ky term to the left, then ℒ{δ(t − a)} = e^(−as). The shift rule turns e^(−as) ÷ (s + k) into e^(−k(t − a)) switched on at t = a: the kick makes y jump by its size, and then y decays.'],
  solution: `Here g(T − τ) = ${n(q)}(${n(T)} − τ), so (f ∗ g)(${n(T)}) = ∫ from 0 to ${n(T)} of ${n(p)} × ${n(q)}(${n(T)} − τ) dτ = ${n(pq)} × (${n(T)}τ − τ² ÷ 2) from 0 to ${n(T)} = ${n(pq)} × ${n(T * T)} ÷ 2 = ${n(conv)}. For the capacitor, y′ + ${kk}y = ${n(c)}δ(t − ${n(a)}), so (s + ${n(k)})Y = ${n(c)}${es(a)} and Y(s) = ${n(c)}${es(a)} ÷ (s + ${n(k)}). By the shift rule y(t) = ${n(c)}e^(−${kk}(t − ${n(a)})) × u(t − ${n(a)}): 0 before the kick, ${n(c)} just after it, then decaying. At t = ${n(t1)}, y = ${n(c)}e^(−${n(k * d)}) ≈ ${fx(y, 4)}, which is ${fx(r3(y), 3)} to 3 decimal places.`,
  guidance: [
   { prompt: `In the convolution, f(τ)g(${n(T)} − τ) = ${n(p)} × ${n(q)}(${n(T)} − τ) = ${n(pq)}(${n(T)} − τ). What is its integral from τ = 0 to τ = ${n(T)}?`, answer: [conv], explanation: `An antiderivative of ${n(pq)}(${n(T)} − τ) is ${n(pq)}(${n(T)}τ − τ² ÷ 2), so the integral is ${n(pq)} × ${n(T * T)} ÷ 2 = ${n(conv)}.` },
   { prompt: `After the kick, y(t) = ${n(c)}e^(−${kk}(t − ${n(a)})). What is y(${n(t1)}), to 3 decimal places?`, answer: [r3(y)], explanation: `t − ${n(a)} = ${n(d)}, so y = ${n(c)}e^(−${n(k * d)}) ≈ ${fx(y, 4)}, which is ${fx(r3(y), 3)} to 3 decimal places.` }
  ] }; }
});

mk({
 id: 'q34c', parent: 'q34', kind: 'applied', title: 'Two kicks on the coil',
 brief: 'A coil on the bench is struck twice in a row, and the crew wants the current just before and just after the second strike.',
 labels: ['current just before the second kick', 'current just after the second kick', 'current at the time asked'], tolerance: 0.0005,
 gl: [['just before'], ['just after'], ['current']]
}, {
 /* y′ + ky = c1·δ(t − a1) + c2·δ(t − a2), y(0) = 0, a2 = a1 + g: before = c1 e^(−kg); after = before + c2; y(t1) = after·e^(−kd), t1 = a2 + d.
    Neither the value before nor y(t1) is near a rounding tie at 3 decimals, and each is at least 0.05. */
 canonical: { k: 2, c1: 8, c2: 3, a1: 1, g: 0.5, d: 1 },
 draw: R => tries(() => ({ k: R.int(1, 3), c1: R.int(2, 9), c2: R.int(2, 9), a1: R.int(1, 3), g: R.pick([0.5, 1, 1.5]), d: R.pick([0.5, 1, 1.5]) }),
  p => { const before = p.c1 * Math.exp(-p.k * p.g), fin = (before + p.c2) * Math.exp(-p.k * p.d); return before >= 0.05 && fin >= 0.05 && !nearTie(before, 3) && !nearTie(fin, 3); }, { k: 2, c1: 8, c2: 3, a1: 1, g: 0.5, d: 1 }),
 build: ({ k, c1, c2, a1, g, d }) => { const kk = co(k), a2 = a1 + g, t1 = a2 + d, before = c1 * Math.exp(-k * g), after = before + c2, fin = after * Math.exp(-k * d); return {
  prompt: `A coil on the signal shop’s bench is struck by two kicks. Its current y obeys y′ + ${kk}y = ${n(c1)}δ(t − ${n(a1)}) + ${n(c2)}δ(t − ${n(a2)}) with y(0) = 0: a kick of size ${n(c1)} at t = ${n(a1)} and a kick of size ${n(c2)} at t = ${n(a2)}. The equation is linear, so the current is the response to the first kick plus the response to the second. Enter the current just before the second kick, then just after it, then y(${n(t1)}), all to 3 decimal places.`,
  answer: [r3(before), r3(after), r3(fin)],
  hints: ['ℒ{δ(t − a)} = e^(−as). By the shift rule, a kick of size c at time a gives the response c e^(−k(t − a)) from t = a on, and 0 before it. The two responses add.',
   'Just before the second kick only the first response is there, so it has decayed for the time between the kicks. At the second kick y jumps up by its size, and from then on everything decays together.'],
  solution: `Each kick gives its own response: ${n(c1)}e^(−${kk}(t − ${n(a1)})) from t = ${n(a1)} on, and ${n(c2)}e^(−${kk}(t − ${n(a2)})) from t = ${n(a2)} on. Just before the second kick, ${n(g)} after the first, y = ${n(c1)}e^(−${n(k * g)}) ≈ ${fx(before, 4)}, which is ${fx(r3(before), 3)} to 3 decimal places. The second kick adds ${n(c2)}, so just after it y = ${fx(before, 4)} + ${n(c2)} = ${fx(after, 4)}, which is ${fx(r3(after), 3)} to 3 decimal places. From there both responses decay by the same factor, and ${n(d)} later y = ${fx(after, 4)} × e^(−${n(k * d)}) ≈ ${fx(fin, 4)}, which is ${fx(r3(fin), 3)} to 3 decimal places.`,
  guidance: [
   { prompt: `Just before t = ${n(a2)} only the first kick’s response ${n(c1)}e^(−${kk}(t − ${n(a1)})) is there. What is y just before the second kick, to 3 decimal places?`, answer: [r3(before)], explanation: `The time since the first kick is ${n(g)}, so y = ${n(c1)}e^(−${n(k * g)}) ≈ ${fx(before, 4)}, which is ${fx(r3(before), 3)} to 3 decimal places.` },
   { prompt: `The second kick makes y jump up by its size, ${n(c2)}. What is y just after it, to 3 decimal places?`, answer: [r3(after)], explanation: `${fx(before, 4)} + ${n(c2)} = ${fx(after, 4)}, which is ${fx(r3(after), 3)} to 3 decimal places.` },
   { prompt: `After the second kick, y decays by the factor e^(−${kk}t) over the time ${n(d)} until t = ${n(t1)}. What is y(${n(t1)}), to 3 decimal places?`, answer: [r3(fin)], explanation: `y = ${fx(after, 4)} × e^(−${n(k * d)}) ≈ ${fx(fin, 4)}, which is ${fx(r3(fin), 3)} to 3 decimal places.` }
  ] }; }
});

mk({
 id: 'q34d', parent: 'q34', kind: 'challenge', title: 'A ramp through the impulse response',
 brief: 'A coil is pushed by a steadily growing voltage, and the crew builds its current from the coil’s response to a single kick.',
 labels: ['h at the time asked', 'y at the time asked'], tolerance: 0.0005,
 gl: [['h'], ['integral'], ['y']]
}, {
 /* y′ + ky = c·t, y(0) = 0. h(t) = e^(−kt). y(T) = ∫ from 0 to T of cτ·e^(−k(T − τ)) dτ = c(kT − 1 + e^(−kT)) ÷ k².
    I = ∫ from 0 to T of τ e^(kτ) dτ = ((kT − 1)e^(kT) + 1) ÷ k². h(T) at least 0.01; h, I and y not near a rounding tie at 3 decimals. */
 canonical: { k: 2, c: 3, T: 1.5 },
 draw: R => tries(() => ({ k: R.int(1, 3), c: R.int(2, 6), T: R.pick([1, 1.5, 2]) }),
  p => { const h = Math.exp(-p.k * p.T), I = ((p.k * p.T - 1) * Math.exp(p.k * p.T) + 1) / (p.k * p.k), y = p.c * h * I;
   return h >= 0.01 && !nearTie(h, 3) && !nearTie(I, 3) && !nearTie(y, 3); }, { k: 2, c: 3, T: 1.5 }),
 build: ({ k, c, T }) => { const kk = co(k), h = Math.exp(-k * T), E = Math.exp(k * T), I = ((k * T - 1) * E + 1) / (k * k), y = c * h * I; return {
  prompt: `A current y in a coil on the signal shop’s bench obeys y′ + ${kk}y = ${n(c)}t with y(0) = 0: a push that grows steadily with time. The coil’s response to a single unit kick δ(t) at t = 0 is h(t) = e^(−${kk}t). For any push g(t), the response is the convolution of the push with h: y(t) = ∫ from 0 to t of g(τ)h(t − τ) dτ. Enter h(${n(T)}) to 3 decimal places, then y(${n(T)}) to 3 decimal places.`,
  answer: [r3(h), r3(y)],
  hints: ['Here g(τ) = cτ and h(T − τ) = e^(−k(T − τ)). The factor e^(−kT) does not depend on τ, so take it outside the integral and keep ∫ from 0 to T of τ e^(kτ) dτ.',
   'Integrate by parts with u = τ and dv = e^(kτ) dτ, so that the integral of τ e^(kτ) is τe^(kτ) ÷ k − e^(kτ) ÷ k². Evaluate it from 0 to T, then multiply by c e^(−kT).'],
  solution: `h(${n(T)}) = e^(−${n(k * T)}) ≈ ${fx(h, 4)}, which is ${fx(r3(h), 3)} to 3 decimal places. For the current, y(${n(T)}) = ∫ from 0 to ${n(T)} of ${n(c)}τ e^(−${kk}(${n(T)} − τ)) dτ = ${n(c)}e^(−${n(k * T)}) × ∫ from 0 to ${n(T)} of τ e^(${kk}τ) dτ. By parts, the integral is [τe^(${kk}τ) ÷ ${n(k)} − e^(${kk}τ) ÷ ${n(k * k)}] from 0 to ${n(T)} = (${n(k * T)} − 1)e^(${n(k * T)}) ÷ ${n(k * k)} + 1 ÷ ${n(k * k)} ≈ ${fx(I, 4)}. So y(${n(T)}) = ${n(c)} × ${fx(h, 4)} × ${fx(I, 4)} ≈ ${fx(y, 4)}, which is ${fx(r3(y), 3)} to 3 decimal places.`,
  guidance: [
   { prompt: `The response to a single kick is h(t) = e^(−${kk}t). What is h(${n(T)}), to 3 decimal places?`, answer: [r3(h)], explanation: `h(${n(T)}) = e^(−${n(k * T)}) ≈ ${fx(h, 4)}, which is ${fx(r3(h), 3)} to 3 decimal places.` },
   { prompt: `Taking e^(−${n(k * T)}) outside the convolution leaves I = ∫ from 0 to ${n(T)} of τ e^(${kk}τ) dτ. By parts, I = [τe^(${kk}τ) ÷ ${n(k)} − e^(${kk}τ) ÷ ${n(k * k)}] from 0 to ${n(T)}. What is I, to 3 decimal places?`, answer: [r3(I)], explanation: `I = (${n(k * T)} − 1)e^(${n(k * T)}) ÷ ${n(k * k)} + 1 ÷ ${n(k * k)} ≈ ${fx(I, 4)}, which is ${fx(r3(I), 3)} to 3 decimal places.` },
   { prompt: `Now y(${n(T)}) = ${n(c)} × e^(−${n(k * T)}) × I, with I ≈ ${fx(I, 4)}. What is y(${n(T)}), to 3 decimal places?`, answer: [r3(y)], explanation: `y(${n(T)}) = ${n(c)} × ${fx(h, 4)} × ${fx(I, 4)} ≈ ${fx(y, 4)}, which is ${fx(r3(y), 3)} to 3 decimal places.` }
  ] }; }
});

/* ---- q35 Power series solutions [7.2] ---- */

mk({
 id: 'q35b', parent: 'q35', kind: 'setting', title: 'The sagging dome rib',
 brief: 'A support rib in the dome sags in a way no simple formula fits, and its equation is written with the second derivative on its own.',
 labels: ['a₂', 'a₃', 'a₄'], tolerance: 0.01,
 gl: [['a₂'], ['a₃'], ['a₄']]
}, {
 /* y″ = P·xy′ + Q·y with y = Σ aₙxⁿ: (n + 2)(n + 1)aₙ₊₂ = (Pn + Q)aₙ. a₂ = Q·a₀ ÷ 2, a₃ = (P + Q)a₁ ÷ 6, a₄ = (2P + Q)a₂ ÷ 12, all whole and non-zero. */
 canonical: { P: 3, Q: 2, a0: 3, a1: -12 },
 draw: R => tries(() => ({ P: R.nz(-3, 3), Q: R.nz(-4, 4), a0: R.nz(-12, 12), a1: R.nz(-12, 12) }),
  p => { const a2 = p.Q * p.a0 / 2, a3 = (p.P + p.Q) * p.a1 / 6, a4 = (2 * p.P + p.Q) * a2 / 12; return [a2, a3, a4].every(v => Number.isInteger(v) && v !== 0 && Math.abs(v) <= 99); }, { P: 3, Q: 2, a0: 3, a1: -12 }),
 build: ({ P, Q, a0, a1 }) => { const a2 = Q * a0 / 2, a3 = (P + Q) * a1 / 6, a4 = (2 * P + Q) * a2 / 12, eq = `y″ = ${expr([[P, 'xy′'], [Q, 'y']])}`; return {
  prompt: `A support rib in the ecology dome sags by y at distance x from its centre, and its sag obeys ${eq}, with y(0) = ${n(a0)} and y′(0) = ${n(a1)}. Look for a power series solution y = a₀ + a₁x + a₂x² + a₃x³ + a₄x⁴ + …, so a₀ = y(0) and a₁ = y′(0). Enter a₂, then a₃, then a₄.`,
  answer: [a2, a3, a4],
  hints: ['Put the series into the equation and match powers of x. On the left, y″ has coefficient (n + 2)(n + 1)aₙ₊₂ in front of xⁿ. On the right, xy′ gives n·aₙ and y gives aₙ.',
   'For y″ = Pxy′ + Qy this gives the recurrence relation aₙ₊₂ = (Pn + Q)aₙ ÷ ((n + 2)(n + 1)). Use n = 0, then 1, then 2.'],
  solution: `The coefficient of xⁿ gives (n + 2)(n + 1)aₙ₊₂ = (${expr([[P, 'n'], [Q, '']])})aₙ, so the recurrence relation is aₙ₊₂ = (${expr([[P, 'n'], [Q, '']])})aₙ ÷ ((n + 2)(n + 1)). With n = 0: a₂ = ${par(Q)} × ${par(a0)} ÷ 2 = ${n(a2)}. With n = 1: a₃ = ${par(P + Q)} × ${par(a1)} ÷ 6 = ${n(a3)}. With n = 2: a₄ = ${par(2 * P + Q)} × ${par(a2)} ÷ 12 = ${n(a4)}.`,
  guidance: [
   { prompt: `The recurrence relation for ${eq} is aₙ₊₂ = (${expr([[P, 'n'], [Q, '']])})aₙ ÷ ((n + 2)(n + 1)). Put n = 0 and a₀ = ${n(a0)}. What is a₂?`, answer: [a2], explanation: `a₂ = ${par(Q)} × ${par(a0)} ÷ (2 × 1) = ${n(a2)}.` },
   { prompt: `Put n = 1 and a₁ = ${n(a1)}. What is a₃?`, answer: [a3], explanation: `a₃ = (${n(P)} + ${par(Q)}) × ${par(a1)} ÷ (3 × 2) = ${par(P + Q)} × ${par(a1)} ÷ 6 = ${n(a3)}.` },
   { prompt: `Put n = 2 and a₂ = ${n(a2)}. What is a₄?`, answer: [a4], explanation: `a₄ = (${n(2 * P)} + ${par(Q)}) × ${par(a2)} ÷ (4 × 3) = ${par(2 * P + Q)} × ${par(a2)} ÷ 12 = ${n(a4)}.` }
  ] }; }
});

mk({
 id: 'q35c', parent: 'q35', kind: 'applied', title: 'The cable sag estimate',
 brief: 'The crew wants a quick estimate of how far a planting cable sags at one point, using only the first few terms of its series.',
 labels: ['a₂', 'a₃', 'estimated sag (mm)'], tolerance: 0.0005,
 gl: [['a₂'], ['a₃'], ['sag (mm)']]
}, {
 /* y″ + bxy′ + cy = 0: a₂ = −c·a₀ ÷ 2, a₃ = −(b + c)a₁ ÷ 6, whole and non-zero. The estimate a₀ + a₁x + a₂x² + a₃x³ at x = 0.5, 1 or 1.5
    is exact to 3 decimal places. Not the parent's numbers (b = 1, c = 3, a₀ = 8, a₁ = −3) nor its worked example. */
 canonical: { b: 1, c: -3, a0: 4, a1: -6, x: 1.5 },
 draw: R => tries(() => ({ b: R.nz(-3, 3), c: R.nz(-4, 4), a0: R.nz(-12, 12), a1: R.nz(-12, 12), x: R.pick([0.5, 1, 1.5]) }),
  p => { const a2 = -p.c * p.a0 / 2, a3 = -(p.b + p.c) * p.a1 / 6; return [a2, a3].every(v => Number.isInteger(v) && v !== 0 && Math.abs(v) <= 99) && !(p.b === 1 && p.c === 3 && p.a0 === 8 && p.a1 === -3); }, { b: 1, c: -3, a0: 4, a1: -6, x: 1.5 }),
 build: ({ b, c, a0, a1, x }) => { const a2 = -c * a0 / 2, a3 = -(b + c) * a1 / 6, est = r3(a0 + a1 * x + a2 * x * x + a3 * x * x * x), eq = `${expr([[1, 'y″'], [b, 'xy′'], [c, 'y']])} = 0`; return {
  prompt: `A planting cable in the ecology dome sags by y millimetres at distance x metres from its middle post, and its sag obeys ${eq}, with y(0) = ${n(a0)} and y′(0) = ${n(a1)}. Use the power series y = a₀ + a₁x + a₂x² + a₃x³ + …, with a₀ = y(0) and a₁ = y′(0). Enter a₂, then a₃, then the estimate of y(${n(x)}) from the first four terms, a₀ + a₁x + a₂x² + a₃x³, to 3 decimal places.`,
  answer: [a2, a3, est],
  hints: ['Put the series into the equation. The coefficient of xⁿ in y″ is (n + 2)(n + 1)aₙ₊₂, in xy′ it is n·aₙ, and in y it is aₙ. Matching powers gives aₙ₊₂ = −(bn + c)aₙ ÷ ((n + 2)(n + 1)) when the equation is y″ + bxy′ + cy = 0.',
   'Use n = 0 for a₂ and n = 1 for a₃. Then put x into a₀ + a₁x + a₂x² + a₃x³, remembering that x², x³ are powers of the number x.'],
  solution: `The recurrence relation is aₙ₊₂ = −(${expr([[b, 'n'], [c, '']])})aₙ ÷ ((n + 2)(n + 1)). With n = 0: a₂ = −(${n(c)}) × ${par(a0)} ÷ 2 = ${n(a2)}. With n = 1: a₃ = −(${n(b + c)}) × ${par(a1)} ÷ 6 = ${n(a3)}. At x = ${n(x)}, the estimate is ${n(a0)} + ${par(a1)} × ${n(x)} + ${par(a2)} × ${n(x * x)} + ${par(a3)} × ${n(x * x * x)} = ${fx(est, 3)}.`,
  guidance: [
   { prompt: `The recurrence relation for ${eq} is aₙ₊₂ = −(${expr([[b, 'n'], [c, '']])})aₙ ÷ ((n + 2)(n + 1)). Put n = 0 and a₀ = ${n(a0)}. What is a₂?`, answer: [a2], explanation: `a₂ = −(${n(c)}) × ${par(a0)} ÷ (2 × 1) = ${n(a2)}.` },
   { prompt: `Put n = 1 and a₁ = ${n(a1)}. What is a₃?`, answer: [a3], explanation: `a₃ = −(${n(b)} + ${par(c)}) × ${par(a1)} ÷ (3 × 2) = −(${n(b + c)}) × ${par(a1)} ÷ 6 = ${n(a3)}.` },
   { prompt: `Now put x = ${n(x)} into ${expr([[a0, ''], [a1, 'x'], [a2, 'x²'], [a3, 'x³']])}. What is the estimate, to 3 decimal places?`, answer: [est], explanation: `${n(a0)} + ${par(a1)} × ${n(x)} + ${par(a2)} × ${n(x * x)} + ${par(a3)} × ${n(x * x * x)} = ${fx(est, 3)}.` }
  ] }; }
});

mk({
 id: 'q35d', parent: 'q35', kind: 'challenge', title: 'The long sag series',
 brief: 'The crew wants the series for a cable’s sag carried further than before, to the sixth power of x.',
 labels: ['a₄', 'a₅', 'a₆'], tolerance: 0.01,
 gl: [['a₄'], ['a₅'], ['a₆']]
}, {
 /* y″ + bxy′ + cy = 0: aₙ₊₂ = −(bn + c)aₙ ÷ ((n + 2)(n + 1)). Even coefficients come from a₀: a₂ = −c·a₀ ÷ 2, a₄ = −(2b + c)a₂ ÷ 12, a₆ = −(4b + c)a₄ ÷ 30.
    Odd ones come from a₁: a₃ = −(b + c)a₁ ÷ 6, a₅ = −(3b + c)a₃ ÷ 20. The draw takes the smallest a₀ and a₁ that keep every coefficient whole, times 1 or 2 (either sign),
    so a₂ to a₆ are whole and non-zero and at most 999 in size. */
 canonical: { b: -1, c: -4, a0: 15, a1: 24 },
 draw: R => tries(() => { const b = R.nz(-3, 3), c = R.nz(-5, 5), fs = [c, 2 * b + c, 4 * b + c, b + c, 3 * b + c]; if (fs.some(v => v === 0)) return null;
   const ev = a => { const a2 = -c * a / 2, a4 = -(2 * b + c) * a2 / 12, a6 = -(4 * b + c) * a4 / 30; return [a2, a4, a6]; }, od = a => { const a3 = -(b + c) * a / 6, a5 = -(3 * b + c) * a3 / 20; return [a3, a5]; };
   let m0 = 0, m1 = 0; for (let m = 1; m <= 60 && !m0; m++) if (ev(m).every(Number.isInteger)) m0 = m; for (let m = 1; m <= 60 && !m1; m++) if (od(m).every(Number.isInteger)) m1 = m;
   if (!m0 || !m1) return null; return { b, c, a0: m0 * R.pick([-2, -1, 1, 2]), a1: m1 * R.pick([-2, -1, 1, 2]) }; },
  p => { if (!p) return false; const a2 = -p.c * p.a0 / 2, a4 = -(2 * p.b + p.c) * a2 / 12, a6 = -(4 * p.b + p.c) * a4 / 30, a3 = -(p.b + p.c) * p.a1 / 6, a5 = -(3 * p.b + p.c) * a3 / 20;
   return [a2, a3, a4, a5, a6].every(v => Number.isInteger(v) && v !== 0 && Math.abs(v) <= 999) && !(p.b === -1 && p.c === 3 && p.a0 === 8 && p.a1 === 3); }, { b: -1, c: -4, a0: 15, a1: 24 }),
 build: ({ b, c, a0, a1 }) => { const a2 = -c * a0 / 2, a3 = -(b + c) * a1 / 6, a4 = -(2 * b + c) * a2 / 12, a5 = -(3 * b + c) * a3 / 20, a6 = -(4 * b + c) * a4 / 30,
  eq = `${expr([[1, 'y″'], [b, 'xy′'], [c, 'y']])} = 0`, rec = `aₙ₊₂ = −(${expr([[b, 'n'], [c, '']])})aₙ ÷ ((n + 2)(n + 1))`; return {
  prompt: `The sag y of a long cable in the ecology dome, at distance x from its middle post, obeys ${eq}, with y(0) = ${n(a0)} and y′(0) = ${n(a1)}. Look for a power series solution y = a₀ + a₁x + a₂x² + a₃x³ + a₄x⁴ + a₅x⁵ + a₆x⁶ + …, so a₀ = y(0) and a₁ = y′(0). Enter a₄, then a₅, then a₆.`,
  answer: [a4, a5, a6],
  hints: ['Put the series into the equation and match powers of x: y″ gives (n + 2)(n + 1)aₙ₊₂ in front of xⁿ, xy′ gives n·aₙ and y gives aₙ. That gives aₙ₊₂ = −(bn + c)aₙ ÷ ((n + 2)(n + 1)) when the equation is y″ + bxy′ + cy = 0.',
   'The recurrence links each coefficient to the one two places before it. Even coefficients come from a₀ (a₂, then a₄, then a₆) and odd ones from a₁ (a₃, then a₅). Work up in order, using n = 0, 1, 2, 3, 4.'],
  solution: `The recurrence relation is ${rec}. Even coefficients: n = 0 gives a₂ = −(${n(c)}) × ${par(a0)} ÷ 2 = ${n(a2)}; n = 2 gives a₄ = −(${n(2 * b + c)}) × ${par(a2)} ÷ 12 = ${n(a4)}; n = 4 gives a₆ = −(${n(4 * b + c)}) × ${par(a4)} ÷ 30 = ${n(a6)}. Odd coefficients: n = 1 gives a₃ = −(${n(b + c)}) × ${par(a1)} ÷ 6 = ${n(a3)}; n = 3 gives a₅ = −(${n(3 * b + c)}) × ${par(a3)} ÷ 20 = ${n(a5)}.`,
  guidance: [
   { prompt: `The recurrence relation for ${eq} is ${rec}. The first step, n = 0, gives a₂ = ${n(a2)}. Put n = 2 and a₂ = ${n(a2)}. What is a₄?`, answer: [a4], explanation: `a₄ = −(${n(2 * b)} + ${par(c)}) × ${par(a2)} ÷ (4 × 3) = −(${n(2 * b + c)}) × ${par(a2)} ÷ 12 = ${n(a4)}.` },
   { prompt: `The odd coefficients start from a₁: n = 1 gives a₃ = ${n(a3)}. Put n = 3 and a₃ = ${n(a3)}. What is a₅?`, answer: [a5], explanation: `a₅ = −(${n(3 * b)} + ${par(c)}) × ${par(a3)} ÷ (5 × 4) = −(${n(3 * b + c)}) × ${par(a3)} ÷ 20 = ${n(a5)}.` },
   { prompt: `Put n = 4 and a₄ = ${n(a4)}. What is a₆?`, answer: [a6], explanation: `a₆ = −(${n(4 * b)} + ${par(c)}) × ${par(a4)} ÷ (6 × 5) = −(${n(4 * b + c)}) × ${par(a4)} ÷ 30 = ${n(a6)}.` }
  ] }; }
});

})();
