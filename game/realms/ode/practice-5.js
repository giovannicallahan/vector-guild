/* Differential equations practice missions, file 5 of 8: concepts q21–q25, three practice missions each
   (q21b q21c q21d q22b q22c q22d q23b q23c q23d q24b q24c q24d q25b q25c q25d).
   Format and rules: docs/PACK-FORMAT.md, "Practice missions" (§10).
     b  kind 'setting'    the same skill in a new real-world setting
     c  kind 'applied'    a word problem with two or three steps (two or three guided steps)
     d  kind 'challenge'  harder numbers, or the skill combined with one earlier concept (optional `uses: 'qNN'`)
   A practice mission supplies only: id, parent, kind, title, brief, prompt, answer, labels, tolerance, hints,
   solution, guidance (and `uses` for a challenge). Everything else comes from its parent, the learn mission:
   topic, tier, xp, sector, lesson, teaching, sources, the concept bench and the review drill. Do not write those.
   Each mission is registered together with its generator by add(mission, generator); build(canonical) must
   reproduce the authored prompt, hints, solution and guidance exactly. Oracles: qa/realms/ode/oracle-p5.js. */
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
const sgn = v => v < 0 ? '−' : '+';
const cf = (v, x) => `${v === 1 ? '' : v === -1 ? '−' : n(v)}${x}`;
/* Signed terms after a first term: tail([[3, 'y′'], [0, 'y'], [−1, 'x']]) is ' + 3y′ − x'; a zero term is left out. */
const tail = ts => ts.filter(([c]) => c !== 0).map(([c, x]) => ` ${sgn(c)} ${Math.abs(c) === 1 ? '' : n(Math.abs(c))}${x}`).join('');
/* e^(rt) as text: e^t, e^(−t), e^(3t). */
const ex = r => r === 1 ? 'e^t' : r === -1 ? 'e^(−t)' : `e^(${n(r)}t)`;
const rows = M => { const v = M.map(r => G.vec(r)); return `rows ${v.slice(0, -1).join(', ')} and ${v[v.length - 1]}`; };
/* Bounded retry: at most 1000 tries, then the canonical parameters (docs/plans/AUTHOR-BRIEF.md, wave 2). */
const tryDraw = (make, ok, fallback) => { for (let i = 0; i < 1000; i++) { const p = make(); if (ok(p)) return p; } return fallback; };
const det3 = M => M[0][0] * (M[1][1] * M[2][2] - M[1][2] * M[2][1]) - M[0][1] * (M[1][0] * M[2][2] - M[1][2] * M[2][0]) + M[0][2] * (M[1][0] * M[2][1] - M[1][1] * M[2][0]);
const r3 = x => Math.round(x * 1000) / 1000;
/* True when x is not within 0.05 of a rounding tie at 3 decimal places. */
const safe3 = x => Math.abs((x * 1000) % 1 - 0.5) > 0.05 && Math.abs(Math.abs((x * 1000) % 1) - 0.5) > 0.05;
const mm = m => m === 1 ? '' : n(m);
const bt = w => w === 1 ? 't' : `${n(w)}t`;

/* ---- q21 Resonance and practical resonance [2.6] ---- */

/* (p, j, h) with p² + j² = h²: with c = 2jm and k = (p² + 2j²)m the practical resonance frequency is p, and the root
   under the square sign at ω = p is 2jhm, a whole number. */
const res21 = (m, [p, j, h], A) => { const c = 2 * j * m, k = (p * p + 2 * j * j) * m, D = 2 * j * h * m, F = G.tidy(D * A), w2 = p * p;
 return { p, c, k, D, F, w2, km: k / m, cc: c * c / (2 * m * m), u: k - m * w2, cw: c * p }; };
/* The line of working shared by the three q21 missions: the peak frequency and the largest amplitude. */
const peak21 = (m, r, A) => `The slope of (k − mu)² + c²u is −2m(k − mu) + c², which is zero at u = k/m − c²/(2m²) = ${n(r.km)} − ${n(r.cc)} = ${n(r.w2)}. So ω = √${n(r.w2)} = ${n(r.p)} rad/s. There k − mω² = ${n(r.k)} − ${n(m * r.w2)} = ${n(r.u)} and cω = ${n(r.c)} × ${n(r.p)} = ${n(r.cw)}, so the root is √(${n(r.u * r.u)} + ${n(r.cw * r.cw)}) = √${n(r.D * r.D)} = ${n(r.D)}. The largest amplitude is ${n(r.F)} ÷ ${n(r.D)} = ${n(A)} m.`;
/* The physical numbers of a q21 draw (damping c, stiffness k, push F), added to the parameters so the oracle works from them. */
const phys21 = (p, list) => { const r = res21(p.m, list[p.i], p.A); return { ...p, c: r.c, k: r.k, F: r.F }; };
const HINT21 = ['Only the quantity under the square root changes with ω, and the amplitude is largest where that quantity is smallest. Write u = ω² and find where (k − mu)² + c²u has slope zero.', 'That slope is −2m(k − mu) + c², so the best u is k/m − c²/(2m²). Take the positive square root for ω, then put it back into C(ω). This works only when c² < 2mk.'];

/* Pump on a bracket: m, mass; pair index; A, the largest amplitude. Not the parent's m = 2, p = 4, A = 0.2. */
const P21B = [[3, 4, 5], [6, 8, 10], [12, 5, 13], [5, 12, 13], [4, 3, 5]];
mk({
 id: 'q21b', parent: 'q21', kind: 'setting', title: 'The pump bracket sweep',
 brief: 'A coolant pump on a spring bracket can run at many speeds, and the crew wants to know which speed shakes the bracket hardest.',
 labels: ['practical resonance frequency (rad/s)', 'largest amplitude (m)'], tolerance: 0.01,
 gl: [['ω²'], ['practical resonance frequency (rad/s)'], ['root at the peak'], ['largest amplitude (m)']]
}, {
 canonical: phys21({ m: 3, i: 0, A: 0.3 }, P21B),
 draw: R => phys21(tryDraw(() => ({ m: R.int(1, 5), i: R.int(0, P21B.length - 1), A: R.pick([0.1, 0.2, 0.3, 0.4, 0.5]) }),
  p => !(p.m === 2 && p.i === 4 && p.A === 0.2), { m: 3, i: 0, A: 0.3 }), P21B),
 build: ({ m, i, A }) => { const r = res21(m, P21B[i], A); return {
  prompt: `A coolant pump sits on a spring bracket in the Engine Room. The pump has mass ${n(m)} kg, the bracket has damping ${n(r.c)} N·s/m and stiffness ${n(r.k)} N/m, and the pump pushes the bracket with a force of ${n(r.F)} cos(ωt) newtons, where the angular frequency ω (in rad/s) is set by the pump's speed. The steady swing has amplitude C(ω) = F₀ ÷ √((k − mω²)² + (cω)²) metres, where F₀ = ${n(r.F)} N is the size of the push, m the mass, c the damping and k the stiffness. Enter the pump speed ω that shakes the bracket most (the practical resonance frequency), then the largest amplitude in metres.`,
  answer: [r.p, A],
  hints: HINT21,
  solution: peak21(m, r, A),
  guidance: [
   { prompt: `What is k/m − c²/(2m²) for this bracket? That is the best value of ω².`, answer: [r.w2], explanation: `k/m = ${n(r.k)} ÷ ${n(m)} = ${n(r.km)} and c²/(2m²) = ${n(r.c * r.c)} ÷ ${n(2 * m * m)} = ${n(r.cc)}, so ω² = ${n(r.km)} − ${n(r.cc)} = ${n(r.w2)}.` },
   { prompt: `What is the pump speed ω in rad/s, the positive square root of ${n(r.w2)}?`, answer: [r.p], explanation: `ω = √${n(r.w2)} = ${n(r.p)} rad/s.` },
   { prompt: `At that speed, what is √((k − mω²)² + (cω)²)?`, answer: [r.D], explanation: `k − mω² = ${n(r.k)} − ${n(m * r.w2)} = ${n(r.u)} and cω = ${n(r.cw)}. Then ${n(r.u * r.u)} + ${n(r.cw * r.cw)} = ${n(r.D * r.D)}, whose square root is ${n(r.D)}.` },
   { prompt: `What is the largest amplitude, ${n(r.F)} ÷ ${n(r.D)}, in metres?`, answer: [A], explanation: `${n(r.F)} ÷ ${n(r.D)} = ${n(A)} m.` }
  ] }; }
});

/* Generator mount with a safe limit L: L = 1.25 × the peak (safe, code 1) or 0.8 × the peak (not safe, code 0). */
const P21C = [[3, 4, 5], [4, 3, 5], [6, 8, 10], [8, 6, 10], [12, 5, 13]];
/* q21c parameters with the physical numbers and the printed limit L. */
const lim21 = p => ({ ...phys21(p, P21C), L: G.tidy(p.A * (p.ok ? 1.25 : 0.8)) });
mk({
 id: 'q21c', parent: 'q21', kind: 'applied', title: 'The generator mount limit',
 brief: 'A generator on a rubber mount can run at any governor setting, and the housing has a swing it must never exceed.',
 labels: ['practical resonance frequency (rad/s)', 'largest amplitude (m)', 'safe (1 yes, 0 no)'], tolerance: 0.01,
 gl: [['practical resonance frequency (rad/s)'], ['largest amplitude (m)'], ['safe (1 yes, 0 no)']]
}, {
 canonical: lim21({ m: 4, i: 2, A: 0.4, ok: false }),
 draw: R => lim21({ m: R.int(1, 4), i: R.int(0, P21C.length - 1), A: R.pick([0.1, 0.2, 0.3, 0.4, 0.5]), ok: R.bool() }),
 build: ({ m, i, A, ok }) => { const r = res21(m, P21C[i], A), L = G.tidy(A * (ok ? 1.25 : 0.8)), code = ok ? 1 : 0; return {
  prompt: `A generator on a rubber mount in the Engine Room has mass ${n(m)} kg, mount damping ${n(r.c)} N·s/m and stiffness ${n(r.k)} N/m. Its governor can set any angular frequency ω (in rad/s), and at each setting the generator pushes the mount with ${n(r.F)} cos(ωt) newtons. The steady swing has amplitude C(ω) = ${n(r.F)} ÷ √((${n(r.k)} − ${mm(m)}ω²)² + (${n(r.c)}ω)²) metres. The housing can take a swing of at most ${n(L)} m. Enter the practical resonance frequency, then the largest amplitude the mount can reach, then 1 if that largest amplitude is at most ${n(L)} m (so the housing is safe at every setting) or 0 if it is more.`,
  answer: [r.p, A, code],
  hints: HINT21,
  solution: `${peak21(m, r, A)} The limit is ${n(L)} m, and ${n(A)} is ${ok ? 'at most' : 'more than'} ${n(L)}, so ${ok ? 'the housing is safe at every setting: the answer is 1' : 'the housing is not safe at the worst setting: the answer is 0'}.`,
  guidance: [
   { prompt: `What is ω = √(k/m − c²/(2m²)) for this mount, in rad/s?`, answer: [r.p], explanation: `k/m = ${n(r.km)} and c²/(2m²) = ${n(r.cc)}, so ω² = ${n(r.w2)} and ω = ${n(r.p)} rad/s.` },
   { prompt: `At ω = ${n(r.p)}, k − mω² = ${n(r.u)} and cω = ${n(r.cw)}. What is the largest amplitude, ${n(r.F)} ÷ √(${n(r.u)}² + ${n(r.cw)}²), in metres?`, answer: [A], explanation: `√(${n(r.u * r.u)} + ${n(r.cw * r.cw)}) = ${n(r.D)}, and ${n(r.F)} ÷ ${n(r.D)} = ${n(A)} m.` },
   { prompt: `The largest amplitude is ${n(A)} m and the limit is ${n(L)} m. Enter 1 if the largest amplitude is at most the limit, 0 if not.`, answer: [code], explanation: ok ? `${n(A)} ≤ ${n(L)}, so no setting can overload the housing.` : `${n(A)} > ${n(L)}, so one setting overloads the housing.` }
  ] }; }
});

/* Challenge: the peak, then the steady amplitude at a running speed wr (q20), to 3 decimal places. */
const P21D = [[6, 8, 10], [8, 6, 10], [12, 5, 13], [5, 12, 13], [9, 12, 15], [12, 9, 15]];
const run21 = (m, pr, A, wr) => { const r = res21(m, pr, A), u2 = r.k - m * wr * wr, cw2 = r.c * wr, Dr2 = u2 * u2 + cw2 * cw2; return { r, u2, cw2, Dr2, Aw: r3(r.F / Math.sqrt(Dr2)) }; };
mk({
 id: 'q21d', parent: 'q21', kind: 'challenge', uses: 'q20', title: 'The flywheel run-up',
 brief: 'A flywheel will run at one fixed speed, and the crew wants to compare its swing there with the worst swing the mount could ever have.',
 labels: ['practical resonance frequency (rad/s)', 'largest amplitude (m)', 'amplitude at the running speed (m)'], tolerance: 0.0005,
 gl: [['practical resonance frequency (rad/s)'], ['largest amplitude (m)'], ['(k − mω²)² + (cω)² at the running speed'], ['amplitude at the running speed (m)']]
}, {
 canonical: phys21({ m: 1, i: 0, A: 0.4, wr: 9 }, P21D),
 draw: R => phys21(tryDraw(() => ({ m: R.int(1, 3), i: R.int(0, P21D.length - 1), A: R.pick([0.2, 0.3, 0.4, 0.5, 0.6]), wr: R.int(1, 16) }),
  p => { const pr = P21D[p.i]; if (p.wr === pr[0]) return false; const v = run21(p.m, pr, p.A, p.wr); return v.Dr2 < 99999 && safe3(v.r.F / Math.sqrt(v.Dr2)); }, { m: 1, i: 0, A: 0.4, wr: 9 }), P21D),
 build: ({ m, i, A, wr }) => { const { r, u2, cw2, Dr2, Aw } = run21(m, P21D[i], A, wr); return {
  prompt: `A flywheel on a damped spring mount in the Engine Room has mass ${n(m)} kg, damping ${n(r.c)} N·s/m and stiffness ${n(r.k)} N/m, and its imbalance pushes the mount with ${n(r.F)} cos(ωt) newtons. The steady swing has amplitude C(ω) = ${n(r.F)} ÷ √((${n(r.k)} − ${mm(m)}ω²)² + (${n(r.c)}ω)²) metres. Enter the practical resonance frequency in rad/s, then the largest amplitude the mount can reach in metres. The flywheel will actually run at ω = ${n(wr)} rad/s: enter the steady amplitude at that speed in metres, to 3 decimal places.`,
  answer: [r.p, A, Aw],
  hints: [...HINT21, 'For the running speed, put the given ω straight into C(ω). Work out k − mω² and cω first, then the root, and divide F₀ by it. Round only at the end.'],
  solution: `${peak21(m, r, A)} At the running speed ω = ${n(wr)}: k − mω² = ${n(r.k)} − ${n(m * wr * wr)} = ${n(u2)} and cω = ${n(r.c)} × ${n(wr)} = ${n(cw2)}, so the root is √(${n(u2 * u2)} + ${n(cw2 * cw2)}) = √${n(Dr2)}. The steady amplitude there is ${n(r.F)} ÷ √${n(Dr2)} ≈ ${n(Aw)} m, a little less than the peak.`,
  guidance: [
   { prompt: `What is ω = √(k/m − c²/(2m²)), the practical resonance frequency, in rad/s?`, answer: [r.p], explanation: `k/m = ${n(r.km)} and c²/(2m²) = ${n(r.cc)}, so ω² = ${n(r.w2)} and ω = ${n(r.p)} rad/s.` },
   { prompt: `At that frequency, k − mω² = ${n(r.u)} and cω = ${n(r.cw)}. What is the largest amplitude in metres?`, answer: [A], explanation: `The root is √(${n(r.u * r.u)} + ${n(r.cw * r.cw)}) = ${n(r.D)}, and ${n(r.F)} ÷ ${n(r.D)} = ${n(A)} m.` },
   { prompt: `At the running speed ω = ${n(wr)}, what is (k − mω²)² + (cω)²? Write it without commas.`, answer: [Dr2], explanation: `k − mω² = ${n(r.k)} − ${n(m * wr * wr)} = ${n(u2)} and cω = ${n(cw2)}, so the sum is ${n(u2 * u2)} + ${n(cw2 * cw2)} = ${n(Dr2)}.` },
   { prompt: `What is ${n(r.F)} ÷ √${n(Dr2)}, the steady amplitude at the running speed, to 3 decimal places?`, answer: [Aw], explanation: `√${n(Dr2)} ≈ ${n(r3(Math.sqrt(Dr2)))}, so the amplitude is about ${n(Aw)} m.` }
  ] }; }
});

/* ---- q22 Higher-order equations and the Wronskian [2.3] ---- */

/* Columns (value, first and second derivative at t = 0) of e^(rt) and of t e^(rt); the matrix has one column per function. */
const colE = r => [1, r, r * r], colT = r => [0, 1, 2 * r];
const mat3 = (a, b, c) => [0, 1, 2].map(i => [a[i], b[i], c[i]]);
const comb = (al, a, be, b) => [0, 1, 2].map(i => al * a[i] + be * b[i]);
/* y‴ − s1y″ + s2y′ − s3y = 0 from the three roots, with zero terms left out. */
const ode3 = (r, v = 'y') => { const s1 = r[0] + r[1] + r[2], s2 = r[0] * r[1] + r[0] * r[2] + r[1] * r[2], s3 = r[0] * r[1] * r[2];
 return `${v}‴${tail([[-s1, `${v}″`], [s2, `${v}′`], [-s3, v]])} = 0`; };
/* A sum of c·f terms, f being a function written as text ('1' for the constant 1). */
const lin = ts => ts.map(([c, f], k) => { const a = Math.abs(c), body = f === '1' ? n(a) : (a === 1 ? '' : n(a)) + f; return k === 0 ? (c < 0 ? '−' : '') + body : ` ${sgn(c)} ${body}`; }).join('');
const fE = r => r === 0 ? '1' : ex(r), fT = r => `t${ex(r)}`;
const same3 = (a, b) => [...a].sort((p, q) => p - q).join() === [...b].sort((p, q) => p - q).join();

/* Turbine shaft: roots may include 0 (the constant 1). Not the parent's roots 1, −2, 3. */
mk({
 id: 'q22b', parent: 'q22', kind: 'setting', title: 'The turbine shaft check',
 brief: 'A turbine shaft needs a third-order equation, and before the crew trusts their three solutions they must check that none repeats another.',
 labels: ['Wronskian at t = 0', 'independent (1 yes, 0 no)'], tolerance: 0.01,
 gl: [['y₃″(0)'], ['Wronskian at t = 0'], ['independent (1 yes, 0 no)']]
}, {
 canonical: { r: [-1, 0, 3], dep: false, al: 0, be: 0 },
 draw: R => tryDraw(() => { const r = []; while (r.length < 3) { const v = R.int(-4, 4); if (!r.includes(v)) r.push(v); }
  const dep = R.bool(); return { r, dep, al: dep ? R.nz(-3, 3) : 0, be: dep ? R.nz(-3, 3) : 0 }; },
  p => !same3(p.r, [1, -2, 3]), { r: [-1, 0, 3], dep: false, al: 0, be: 0 }),
 build: ({ r, dep, al, be }) => { const c1 = colE(r[0]), c2 = colE(r[1]), c3 = dep ? comb(al, c1, be, c2) : colE(r[2]), M = mat3(c1, c2, c3), W = det3(M), code = W !== 0 ? 1 : 0,
  y3 = dep ? lin([[al, fE(r[0])], [be, fE(r[1])]]) : fE(r[2]), zero = r[0] === 0 || r[1] === 0 || (!dep && r[2] === 0),
  d3 = dep ? `y₃ = ${y3} has value ${n(c3[0])}, first derivative ${n(c3[1])} and second derivative ${n(c3[2])}` : `y₃ = ${y3} has value 1, first derivative ${n(c3[1])} and second derivative ${n(c3[2])}`; return {
  prompt: `A turbine shaft in the Engine Room obeys the third-order equation ${ode3(r)}, where y is its twist angle in radians and t is time in seconds. The crew has three solutions: y₁ = ${fE(r[0])}, y₂ = ${fE(r[1])} and y₃ = ${y3}. ${zero ? 'Here 1 is the constant function, which is e^(0t). ' : ''}Enter their Wronskian W at t = 0, then 1 if the three solutions are linearly independent, 0 if not.`,
  answer: [W, code],
  hints: ['For e^(rt) the value, first derivative and second derivative at t = 0 are 1, r and r². The constant 1 has r = 0. For a sum of two functions, add the matching entries of their columns, each times its constant.', 'The Wronskian is the determinant of the 3 × 3 matrix with one column per solution: values in the first row, first derivatives in the second, second derivatives in the third. For solutions of one linear equation, a non-zero determinant means independent and zero means dependent.'],
  solution: `At t = 0, ${d3}. The matrix has ${rows(M)}, and its determinant is W(0) = ${n(W)}. ${code ? 'The Wronskian is not zero, so the three solutions are linearly independent.' : `The Wronskian is zero, so the solutions are linearly dependent: y₃ = ${lin([[al, 'y₁'], [be, 'y₂']])} adds nothing new.`}`,
  guidance: [
   { prompt: `What is the second derivative of y₃ = ${y3} at t = 0?`, answer: [c3[2]], explanation: dep ? `Each e^(rt) has second derivative r² at t = 0, so the combination has ${n(al)} × ${n(r[0] * r[0])} ${sgn(be)} ${n(Math.abs(be))} × ${n(r[1] * r[1])} = ${n(c3[2])}.` : `The second derivative of e^(rt) at t = 0 is r² = ${n(c3[2])}.` },
   { prompt: `The matrix at t = 0 has ${rows(M)}. What is its determinant, W(0)?`, answer: [W], explanation: `Expanding along the first row gives W(0) = ${n(W)}.` },
   { prompt: `W(0) = ${n(W)}. Enter 1 if the three solutions are linearly independent, 0 if not.`, answer: [code], explanation: code ? 'A non-zero Wronskian means no solution is a combination of the others.' : 'A zero Wronskian for solutions of one linear equation means one is a combination of the others.' }
  ] }; }
});

/* Flywheel stack: independent solutions with non-zero roots, start values b = M·C with C whole; Cramer's rule gives C1.
   Not the parent's roots 1, −2, 3. */
mk({
 id: 'q22c', parent: 'q22', kind: 'applied', title: 'The flywheel stack start',
 brief: 'A stack of flywheels must start from a given twist, speed and acceleration, and the crew needs the first constant of its general solution.',
 labels: ['Wronskian at t = 0', 'C₁'], tolerance: 0.01,
 gl: [['Wronskian at t = 0'], ['det(M₁)'], ['C₁']]
}, {
 canonical: { r: [2, -1, -2], C: [2, -1, 3] },
 draw: R => tryDraw(() => { const r = []; while (r.length < 3) { const v = R.nz(-3, 3); if (!r.includes(v)) r.push(v); } return { r, C: [R.nz(-3, 3), R.nz(-3, 3), R.nz(-3, 3)] }; },
  p => !same3(p.r, [1, -2, 3]), { r: [2, -1, -2], C: [2, -1, 3] }),
 build: ({ r, C }) => { const M = mat3(colE(r[0]), colE(r[1]), colE(r[2])), W = det3(M), b = M.map(row => row[0] * C[0] + row[1] * C[1] + row[2] * C[2]),
  M1 = M.map((row, k) => [b[k], row[1], row[2]]), d1 = det3(M1), C1 = d1 / W; return {
  prompt: `A stack of flywheels in the Engine Room obeys ${ode3(r)}, where y is the twist of the top flywheel in radians and t is time in seconds. Three solutions are y₁ = ${ex(r[0])}, y₂ = ${ex(r[1])} and y₃ = ${ex(r[2])}. Let M be the 3 × 3 table with the values of y₁, y₂, y₃ at t = 0 in its first row, their first derivatives in its second row and their second derivatives in its third row; its determinant is the Wronskian W at t = 0. The stack starts with y(0) = ${n(b[0])}, y′(0) = ${n(b[1])} and y″(0) = ${n(b[2])}. Writing y = C₁y₁ + C₂y₂ + C₃y₃, Cramer's rule gives C₁ = det(M₁) ÷ W, where M₁ is M with its first column replaced by the starting values y(0), y′(0), y″(0), top to bottom. Enter W, then C₁.`,
  answer: [W, C1],
  hints: ['Each e^(rt) has value 1, first derivative r and second derivative r² at t = 0. Put each solution in its own column of M.', 'To build M₁, keep the second and third columns of M and write the three starting values down the first column. Then C₁ is the determinant of M₁ divided by W. The division works because W is not zero.'],
  solution: `At t = 0, M has ${rows(M)}, so W = ${n(W)}. Replacing the first column by the starting values ${G.vec(b)} gives M₁ with ${rows(M1)}, and det(M₁) = ${n(d1)}. So C₁ = ${n(d1)} ÷ ${par(W)} = ${n(C1)}.`,
  guidance: [
   { prompt: `M has ${rows(M)}. What is its determinant, the Wronskian W at t = 0?`, answer: [W], explanation: `Expanding along the first row gives W = ${n(W)}. It is not zero, so Cramer's rule can be used.` },
   { prompt: `M₁ has ${rows(M1)}. What is det(M₁)?`, answer: [d1], explanation: `Expanding along the first row gives det(M₁) = ${n(d1)}.` },
   { prompt: `What is C₁ = det(M₁) ÷ W = ${n(d1)} ÷ ${par(W)}?`, answer: [C1], explanation: `${n(d1)} ÷ ${par(W)} = ${n(C1)}.` }
  ] }; }
});

/* Challenge: a repeated root r and a simple root s, solutions e^(rt), t e^(rt) and e^(st), or a third solution that is
   a combination of the first two. Independent case: W(0) = (s − r)². Not the parent's. */
mk({
 id: 'q22d', parent: 'q22', kind: 'challenge', uses: 'q14', title: 'The double-root coupling',
 brief: 'A coupling shaft has a repeated root in its characteristic equation, and the crew must check that their three solutions still stand apart.',
 labels: ['Wronskian at t = 0', 'independent (1 yes, 0 no)'], tolerance: 0.01,
 gl: [['y₂″(0)'], ['Wronskian at t = 0'], ['independent (1 yes, 0 no)']]
}, {
 canonical: { r: -1, s: 2, dep: false, al: 0, be: 0 },
 draw: R => tryDraw(() => { const dep = R.bool(); return { r: R.nz(-3, 3), s: R.nz(-3, 3), dep, al: dep ? R.nz(-3, 3) : 0, be: dep ? R.nz(-3, 3) : 0 }; },
  p => p.r !== p.s, { r: -1, s: 2, dep: false, al: 0, be: 0 }),
 build: ({ r, s, dep, al, be }) => { const c1 = colE(r), c2 = colT(r), c3 = dep ? comb(al, c1, be, c2) : colE(s), M = mat3(c1, c2, c3), W = det3(M), code = W !== 0 ? 1 : 0,
  y3 = dep ? lin([[al, ex(r)], [be, fT(r)]]) : ex(s), d3 = dep ? `y₃ = ${y3} has value ${n(c3[0])}, first derivative ${n(c3[1])} and second derivative ${n(c3[2])}` : `y₃ = ${y3} has value 1, first derivative ${n(s)} and second derivative ${n(s * s)}`; return {
  prompt: `A coupling shaft in the Engine Room obeys ${ode3([r, r, s])}, where y is its twist angle in radians and t is time in seconds. Its characteristic equation has the repeated root ${n(r)} and the root ${n(s)}. The crew has three solutions: y₁ = ${ex(r)}, y₂ = ${fT(r)} and y₃ = ${y3}. Here te^(rt) means t multiplied by e^(rt). Enter their Wronskian W at t = 0, then 1 if the three solutions are linearly independent, 0 if not.`,
  answer: [W, code],
  hints: ['By the product rule, te^(rt) has first derivative (1 + rt)e^(rt) and second derivative (2r + r²t)e^(rt). Put t = 0 to get its column, and use 1, r, r² for each e^(rt).', 'The Wronskian is the determinant of the 3 × 3 matrix with one column per solution: values in the first row, first derivatives in the second, second derivatives in the third. Non-zero means independent; zero means one solution is a combination of the others.'],
  solution: `At t = 0, y₁ = ${ex(r)} has value 1, first derivative ${n(r)} and second derivative ${n(r * r)}. y₂ = ${fT(r)} has value 0, first derivative 1 and second derivative ${n(2 * r)}. Finally, ${d3}. The matrix has ${rows(M)}, and its determinant is W(0) = ${n(W)}. ${code ? 'The Wronskian is not zero, so the three solutions are linearly independent.' : `The Wronskian is zero, so the solutions are linearly dependent: y₃ = ${lin([[al, 'y₁'], [be, 'y₂']])}.`}`,
  guidance: [
   { prompt: `What is the second derivative of y₂ = ${fT(r)} at t = 0?`, answer: [2 * r], explanation: `y₂′ = (1${tail([[r, 't']])})${ex(r)} and y₂″ = (${n(2 * r)}${tail([[r * r, 't']])})${ex(r)}, so y₂″(0) = ${n(2 * r)}.` },
   { prompt: `The matrix at t = 0 has ${rows(M)}. What is its determinant, W(0)?`, answer: [W], explanation: `Expanding along the first row gives W(0) = ${n(W)}.` },
   { prompt: `W(0) = ${n(W)}. Enter 1 if the three solutions are linearly independent, 0 if not.`, answer: [code], explanation: code ? 'A non-zero Wronskian means none of the solutions is a combination of the others.' : 'A zero Wronskian for solutions of one linear equation means one is a combination of the others.' }
  ] }; }
});

/* ---- q23 Chapter review: the engine mount [2.3, 2.5, 2.6] ---- */

/* m x″ + c x′ + k x = F cos(ωt) with k − mω² = ±a·s and cω = b·s for a triple (a, b, h), so the amplitude is h·s·C-scaled:
   with the amplitude C = h·j ÷ 10 and F = D·C (D = h·s), A = ±a·j ÷ 10 and B = b·j ÷ 10, each with one decimal. */
const sw23 = ({ m, w, i, neg, s, j }, list) => { const [a0, b, h] = list[i], a = neg ? -a0 : a0, c = b * s / w, u = a * s, k = u + m * w * w, cw = b * s, D = h * s, C = G.tidy(h * j / 10), F = G.tidy(D * C), D2 = D * D,
 A = G.tidy(a * j / 10), B = G.tidy(b * j / 10); return { c, u, k, cw, D, C, F, D2, A, B }; };
const ok23 = (p, list) => { const [a0, b, h] = list[p.i], c = b * p.s / p.w, u = (p.neg ? -a0 : a0) * p.s; return Number.isInteger(c) && c >= 2 && u + p.m * p.w * p.w > 0; };
const eq23 = (m, r, w) => `${mm(m)}x″ + ${n(r.c)}x′${tail([[r.k, 'x']])} = ${n(r.F)} cos(${bt(w)})`;
const match23 = ['Put x = A cos(ωt) + B sin(ωt) into the equation and match the cos terms and the sin terms: (k − mω²)A + cωB = F₀ and −cωA + (k − mω²)B = 0.', 'Solving that pair gives A = F₀(k − mω²) ÷ D² and B = F₀cω ÷ D², with D² = (k − mω²)² + (cω)². The two parts are a quarter-turn apart, so the amplitude is √(A² + B²).'];
const sol23 = (m, w, r) => `Here k − mω² = ${n(r.k)} − ${n(m * w * w)} = ${n(r.u)} and cω = ${n(r.c)} × ${n(w)} = ${n(r.cw)}, so D² = ${n(r.u * r.u)} + ${n(r.cw * r.cw)} = ${n(r.D2)}. Then A = ${n(r.F)} × ${par(r.u)} ÷ ${n(r.D2)} = ${n(r.A)} and B = ${n(r.F)} × ${n(r.cw)} ÷ ${n(r.D2)} = ${n(r.B)}, and the amplitude is √(${n(r.A * r.A)} + ${n(r.B * r.B)})`;

const T23B = [[3, 4, 5], [4, 3, 5], [6, 8, 10], [8, 6, 10]];
mk({
 id: 'q23b', parent: 'q23', kind: 'setting', title: 'The pump housing swing',
 brief: 'A pump housing is pushed by its motor at a fixed speed, and the crew wants the full steady swing before they fit the cover.',
 labels: ['A (m)', 'B (m)', 'amplitude (m)'], tolerance: 0.01,
 gl: [['D²'], ['A (m)'], ['B (m)'], ['amplitude (m)']]
}, {
 canonical: { m: 2, w: 3, i: 0, neg: true, s: 3, j: 4 },
 draw: R => tryDraw(() => ({ m: R.int(1, 4), w: R.int(1, 5), i: R.int(0, T23B.length - 1), neg: R.bool(), s: R.int(1, 4), j: R.int(1, 9) }), p => ok23(p, T23B), { m: 2, w: 3, i: 0, neg: true, s: 3, j: 4 }),
 build: p => { const { m, w } = p, r = sw23(p, T23B); return {
  prompt: `A pump housing in the Engine Room has mass ${n(m)} kg, damping ${n(r.c)} N·s/m and stiffness ${n(r.k)} N/m. Its motor pushes it with ${n(r.F)} cos(${bt(w)}) newtons, so its displacement x (in metres, with t in seconds) obeys ${eq23(m, r, w)}. Once the start-up swings have died away, x = A cos(${bt(w)}) + B sin(${bt(w)}). Enter A, then B, then the amplitude √(A² + B²) in metres.`,
  answer: [r.A, r.B, r.C],
  hints: match23,
  solution: `${sol23(m, w, r)} = ${n(r.C)} m, which is also ${n(r.F)} ÷ √${n(r.D2)}.`,
  guidance: [
   { prompt: `With k − mω² = ${n(r.u)} and cω = ${n(r.cw)}, what is D² = (k − mω²)² + (cω)²?`, answer: [r.D2], explanation: `${n(r.u * r.u)} + ${n(r.cw * r.cw)} = ${n(r.D2)}.` },
   { prompt: `What is A = F₀(k − mω²) ÷ D²?`, answer: [r.A], explanation: `${n(r.F)} × ${par(r.u)} ÷ ${n(r.D2)} = ${n(r.A)}.` },
   { prompt: `What is B = F₀cω ÷ D²?`, answer: [r.B], explanation: `${n(r.F)} × ${n(r.cw)} ÷ ${n(r.D2)} = ${n(r.B)}.` },
   { prompt: `What is the amplitude √(A² + B²) in metres?`, answer: [r.C], explanation: `√(${n(r.A * r.A)} + ${n(r.B * r.B)}) = √${n(G.tidy(r.C * r.C))} = ${n(r.C)} m.` }
  ] }; }
});

const T23C = [[3, 4, 5], [4, 3, 5], [6, 8, 10], [8, 6, 10]];
/* q23c parameters with the physical numbers (damping c, stiffness k, push F) and the printed limit L, for the oracle. */
const lim23 = p => { const r = sw23(p, T23C); return { ...p, c: r.c, k: r.k, F: r.F, L: G.tidy(r.C * (p.ok ? 1.25 : 0.8)) }; };
mk({
 id: 'q23c', parent: 'q23', kind: 'applied', title: 'The compressor housing limit',
 brief: 'A compressor housing can survive only a certain swing, and the crew must know whether its motor will break that limit.',
 labels: ['A (m)', 'B (m)', 'within limit (1 yes, 0 no)'], tolerance: 0.01,
 gl: [['A (m)'], ['B (m)'], ['within limit (1 yes, 0 no)']]
}, {
 canonical: lim23({ m: 3, w: 2, i: 1, neg: false, s: 2, j: 6, ok: true }),
 draw: R => lim23(tryDraw(() => ({ m: R.int(1, 4), w: R.int(1, 4), i: R.int(0, T23C.length - 1), neg: R.bool(), s: R.int(1, 4), j: R.int(2, 9), ok: R.bool() }), p => ok23(p, T23C), { m: 3, w: 2, i: 1, neg: false, s: 2, j: 6, ok: true })),
 build: p => { const { m, w, ok } = p, r = sw23(p, T23C), L = G.tidy(r.C * (ok ? 1.25 : 0.8)), code = ok ? 1 : 0; return {
  prompt: `A compressor in the Engine Room is bolted to a housing of mass ${n(m)} kg with damping ${n(r.c)} N·s/m and stiffness ${n(r.k)} N/m. The compressor pushes the housing with ${n(r.F)} cos(${bt(w)}) newtons, so the displacement x (in metres, with t in seconds) obeys ${eq23(m, r, w)}. After the start-up swings die away, x = A cos(${bt(w)}) + B sin(${bt(w)}). The housing can take a steady swing of at most ${n(L)} m. Enter A, then B, then 1 if the amplitude √(A² + B²) is at most ${n(L)} m, or 0 if it is more.`,
  answer: [r.A, r.B, code],
  hints: match23,
  solution: `${sol23(m, w, r)} = ${n(r.C)} m. The limit is ${n(L)} m, and ${n(r.C)} is ${ok ? 'at most' : 'more than'} ${n(L)}, so the answer is ${code}.`,
  guidance: [
   { prompt: `With k − mω² = ${n(r.u)} and cω = ${n(r.cw)}, what is A = F₀(k − mω²) ÷ ((k − mω²)² + (cω)²)?`, answer: [r.A], explanation: `D² = ${n(r.u * r.u)} + ${n(r.cw * r.cw)} = ${n(r.D2)}, and A = ${n(r.F)} × ${par(r.u)} ÷ ${n(r.D2)} = ${n(r.A)}.` },
   { prompt: `What is B = F₀cω ÷ ((k − mω²)² + (cω)²)?`, answer: [r.B], explanation: `${n(r.F)} × ${n(r.cw)} ÷ ${n(r.D2)} = ${n(r.B)}.` },
   { prompt: `A = ${n(r.A)} and B = ${n(r.B)}, so the amplitude √(A² + B²) is ${n(r.C)} m. Enter 1 if that is at most the limit of ${n(L)} m, 0 if not.`, answer: [code], explanation: ok ? `${n(r.C)} ≤ ${n(L)}, so the housing stays within its limit.` : `${n(r.C)} > ${n(L)}, so the swing breaks the limit.` }
  ] }; }
});

/* Challenge: A and B at a running speed, then the practical resonance frequency to 3 decimal places (q21); m is 1 or 2
   so that k/m − c²/(2m²) has at most three decimals. */
const T23D = [[5, 12, 13], [12, 5, 13], [8, 15, 17], [15, 8, 17]];
const wp23 = (p, r) => Math.sqrt(r.k / p.m - r.c * r.c / (2 * p.m * p.m));
mk({
 id: 'q23d', parent: 'q23', kind: 'challenge', uses: 'q21', title: 'The motor frame at speed',
 brief: 'A motor frame runs at one set speed, and the crew wants its steady swing there and the speed that would shake it hardest.',
 labels: ['A (m)', 'B (m)', 'practical resonance frequency (rad/s)'], tolerance: 0.0005,
 gl: [['D²'], ['A (m)'], ['B (m)'], ['ω² at the peak'], ['practical resonance frequency (rad/s)']]
}, {
 canonical: { m: 1, w: 3, i: 0, neg: false, s: 1, j: 5 },
 draw: R => tryDraw(() => ({ m: R.int(1, 2), w: R.int(1, 5), i: R.int(0, T23D.length - 1), neg: R.bool(), s: R.int(1, 3), j: R.int(1, 9) }),
  p => { if (!ok23(p, T23D)) return false; const r = sw23(p, T23D), q = r.k / p.m - r.c * r.c / (2 * p.m * p.m); return q > 0.5 && safe3(Math.sqrt(q)); }, { m: 1, w: 3, i: 0, neg: false, s: 1, j: 5 }),
 build: p => { const { m, w } = p, r = sw23(p, T23D), q = r.k / m - r.c * r.c / (2 * m * m), W = r3(Math.sqrt(q)); return {
  prompt: `A motor frame in the Engine Room has mass ${n(m)} kg, damping ${n(r.c)} N·s/m and stiffness ${n(r.k)} N/m. Its motor pushes it with ${n(r.F)} cos(ωt) newtons at an angular frequency ω in rad/s. At the running speed ω = ${n(w)} the steady swing is x = A cos(${bt(w)}) + B sin(${bt(w)}): enter A, then B, both in metres. Then enter the practical resonance frequency, the ω that makes the steady amplitude largest, which is ω = √(k/m − c²/(2m²)), in rad/s to 3 decimal places.`,
  answer: [r.A, r.B, W],
  hints: [...match23, 'For the last answer, work out k/m − c²/(2m²) from the mass, damping and stiffness, then take the positive square root. Round only at the end.'],
  solution: `${sol23(m, w, r)} = ${n(r.C)} m. For the practical resonance frequency, ω² = k/m − c²/(2m²) = ${n(r.k / m)} − ${n(r.c * r.c / (2 * m * m))} = ${n(q)}, so ω = √${n(q)} ≈ ${n(W)} rad/s.`,
  guidance: [
   { prompt: `At the running speed, k − mω² = ${n(r.u)} and cω = ${n(r.cw)}. What is D² = (k − mω²)² + (cω)²? Write it without commas.`, answer: [r.D2], explanation: `${n(r.u * r.u)} + ${n(r.cw * r.cw)} = ${n(r.D2)}.` },
   { prompt: `What is A = F₀(k − mω²) ÷ D²?`, answer: [r.A], explanation: `${n(r.F)} × ${par(r.u)} ÷ ${n(r.D2)} = ${n(r.A)}.` },
   { prompt: `What is B = F₀cω ÷ D²?`, answer: [r.B], explanation: `${n(r.F)} × ${n(r.cw)} ÷ ${n(r.D2)} = ${n(r.B)}.` },
   { prompt: `What is k/m − c²/(2m²), the best value of ω²?`, answer: [q], explanation: `k/m = ${n(r.k / m)} and c²/(2m²) = ${n(r.c * r.c / (2 * m * m))}, so ω² = ${n(q)}.` },
   { prompt: `What is the practical resonance frequency, the positive square root of ${n(q)}, to 3 decimal places?`, answer: [W], explanation: `√${n(q)} ≈ ${n(W)} rad/s.` }
  ] }; }
});

/* ---- q24 Turning an equation into a first-order system; Euler for systems [3.1] ---- */

const HINT24 = ['For the top row of A, differentiate x₁ = x and write the result using the new names x₁ and x₂. For the bottom row, divide the whole equation by the number in front of x″, move the other terms across, and write x₁ and x₂ in place of x and x′.', 'Euler’s method moves each unknown forward by h times its rate: new value = old value + h × (its rate worked out at the old values). Use the old values for both unknowns.'];

/* Camera mast: terms in the other order (k x + c x′ + m x″ = 0), m in {1, 3, 4, 5}, h in {0.1, 0.25, 0.5}. Not the parent's. */
mk({
 id: 'q24b', parent: 'q24', kind: 'setting', title: 'The camera mast',
 brief: 'A camera mast on the Control Room roof sways in the wind, and the control computer can only step first-order equations.',
 labels: ['A21', 'A22', 'x₁ after one step', 'x₂ after one step'], tolerance: 0.0005,
 gl: [['A21'], ['A22'], ['x₁ after one step'], ['x₂ after one step']]
}, {
 canonical: { m: 3, al: 4, be: 2, x0: 1, v0: -2, h: 0.25 },
 draw: R => ({ m: R.pick([1, 3, 4, 5]), al: R.int(2, 12), be: R.int(1, 6), x0: R.nz(-4, 4), v0: R.int(-4, 4), h: R.pick([0.1, 0.25, 0.5]) }),
 build: ({ m, al, be, x0, v0, h }) => { const c = m * be, k = m * al, x1 = G.tidy(x0 + h * v0), acc = -al * x0 - be * v0, x2 = G.tidy(v0 + h * acc); return {
  prompt: `A camera mast on the Control Room roof sways according to ${n(k)}x${tail([[c, 'x′'], [m, 'x″']])} = 0, where x is the offset of its tip in metres and t is time in seconds. Write it as a first-order system with x₁ = x and x₂ = x′, so that (x₁, x₂)′ = A(x₁, x₂). Enter the two entries of the bottom row of A, then take one Euler step of size h = ${n(h)} from x(0) = ${n(x0)} and x′(0) = ${n(v0)}, and enter the estimates of x₁ and x₂ at t = ${n(h)}.`,
  answer: [-al, -be, x1, x2],
  hints: HINT24,
  solution: `Since x₁ = x, x₁′ = x′ = x₂, so the top row of A is (0, 1). ${m === 1 ? 'The coefficient of x″ is already 1, so' : `Dividing the equation by ${n(m)} gives`} x″ = ${cf(-al, 'x')}${tail([[-be, 'x′']])}, so x₂′ = ${cf(-al, 'x₁')}${tail([[-be, 'x₂']])} and the bottom row is (${n(-al)}, ${n(-be)}). At t = 0 the rates are x₁′ = ${n(v0)} and x₂′ = ${n(-al)} × ${par(x0)} ${sgn(-be)} ${n(be)} × ${par(v0)} = ${n(acc)}. One step gives x₁ ≈ ${n(x0)} + ${n(h)} × ${par(v0)} = ${n(x1)} and x₂ ≈ ${n(v0)} + ${n(h)} × ${par(acc)} = ${n(x2)}.`,
  guidance: [
   { prompt: `Solve the equation for x″. What number multiplies x₁ in x₂′?`, answer: [-al], explanation: `x″ = −(${n(k)} ÷ ${n(m)})x − (${n(c)} ÷ ${n(m)})x′, so x₁ is multiplied by ${n(-al)}.` },
   { prompt: `What number multiplies x₂ in x₂′?`, answer: [-be], explanation: `−(${n(c)} ÷ ${n(m)}) = ${n(-be)}.` },
   { prompt: `x₁′ = x₂ = ${n(v0)} at t = 0. What is the Euler estimate x₁ ≈ ${n(x0)} + ${n(h)} × ${par(v0)}?`, answer: [x1], explanation: `${n(x0)} + ${par(G.tidy(h * v0))} = ${n(x1)}.` },
   { prompt: `x₂′ = ${cf(-al, 'x₁')}${tail([[-be, 'x₂']])} is ${n(acc)} at t = 0. What is the Euler estimate of x₂?`, answer: [x2], explanation: `${n(v0)} + ${n(h)} × ${par(acc)} = ${n(x2)}.` }
  ] }; }
});

/* Two Euler steps; every value has at most two decimals (h in {0.1, 0.2, 0.5}). */
const two24 = ({ m, al, be, x0, v0, h }) => { const a0 = -al * x0 - be * v0, v1 = G.tidy(v0 + h * a0), x1 = G.tidy(x0 + h * v0), a1 = G.tidy(-al * x1 - be * v1), x2 = G.tidy(x1 + h * v1), v2 = G.tidy(v1 + h * a1);
 return { a0, v1, x1, a1, x2, v2 }; };
mk({
 id: 'q24c', parent: 'q24', kind: 'applied', title: 'The stabiliser fin steps',
 brief: 'A stabiliser fin has to be simulated two steps ahead, so the crew needs its first-order system and both Euler steps.',
 labels: ['x₁ after two steps', 'x₂ after two steps'], tolerance: 0.0005,
 gl: [['x₂′ at t = 0'], ['x₂ after the first step'], ['x₁ after the second step']]
}, {
 canonical: { m: 2, al: 3, be: 2, x0: 2, v0: 1, h: 0.2 },
 draw: R => ({ m: R.pick([1, 2, 4, 5]), al: R.int(2, 8), be: R.int(1, 5), x0: R.nz(-3, 3), v0: R.int(-3, 3), h: R.pick([0.1, 0.2, 0.5]) }),
 build: p => { const { m, al, be, x0, v0, h } = p, c = m * be, k = m * al, t = two24(p); return {
  prompt: `A stabiliser fin on the rover obeys ${mm(m)}x″${tail([[c, 'x′'], [k, 'x']])} = 0, where x is its angle in radians and t is time in seconds. The flight computer writes it as a first-order system with x₁ = x and x₂ = x′, and steps it with Euler's method. Starting from x(0) = ${n(x0)} and x′(0) = ${n(v0)}, take two Euler steps of size h = ${n(h)}: the second step starts from the estimates the first step gave, and uses the rates worked out there. Enter the estimates of x₁ and x₂ at t = ${n(2 * h)}.`,
  answer: [t.x2, t.v2],
  hints: ['Write x₁′ = x₂ and x₂′ = −(k/m)x₁ − (c/m)x₂, dividing by the number in front of x″. Each Euler step gives new value = old value + h × rate, with both rates worked out at the old values.', 'For the second step, work out the new rates at the first step’s estimates: x₁′ = x₂ there, and x₂′ from the same formula. Do not reuse the rates from t = 0.'],
  solution: `${m === 1 ? 'The coefficient of x″ is already 1, so' : `Dividing by ${n(m)} gives`} x₁′ = x₂ and x₂′ = ${cf(-al, 'x₁')}${tail([[-be, 'x₂']])}. At t = 0 the rates are x₁′ = ${n(v0)} and x₂′ = ${n(-al)} × ${par(x0)} ${sgn(-be)} ${n(be)} × ${par(v0)} = ${n(t.a0)}. Step one: x₁ ≈ ${n(x0)} + ${n(h)} × ${par(v0)} = ${n(t.x1)} and x₂ ≈ ${n(v0)} + ${n(h)} × ${par(t.a0)} = ${n(t.v1)}. At those values x₁′ = ${n(t.v1)} and x₂′ = ${n(-al)} × ${par(t.x1)} ${sgn(-be)} ${n(be)} × ${par(t.v1)} = ${n(t.a1)}. Step two: x₁ ≈ ${n(t.x1)} + ${n(h)} × ${par(t.v1)} = ${n(t.x2)} and x₂ ≈ ${n(t.v1)} + ${n(h)} × ${par(t.a1)} = ${n(t.v2)}.`,
  guidance: [
   { prompt: `What is x₂′ = ${cf(-al, 'x₁')}${tail([[-be, 'x₂']])} at t = 0, with x₁ = ${n(x0)} and x₂ = ${n(v0)}?`, answer: [t.a0], explanation: `${n(-al)} × ${par(x0)} ${sgn(-be)} ${n(be)} × ${par(v0)} = ${n(t.a0)}.` },
   { prompt: `What is the Euler estimate of x₂ after the first step, ${n(v0)} + ${n(h)} × ${par(t.a0)}?`, answer: [t.v1], explanation: `${n(v0)} + ${par(G.tidy(h * t.a0))} = ${n(t.v1)}. The first step also gives x₁ ≈ ${n(t.x1)}.` },
   { prompt: `The first step gave x₁ ≈ ${n(t.x1)} and x₂ ≈ ${n(t.v1)}. What is the Euler estimate of x₁ after the second step, ${n(t.x1)} + ${n(h)} × ${par(t.v1)}?`, answer: [t.x2], explanation: `${n(t.x1)} + ${par(G.tidy(h * t.v1))} = ${n(t.x2)}. For x₂, the new rate is x₂′ = ${n(t.a1)}, so x₂ ≈ ${n(t.v1)} + ${n(h)} × ${par(t.a1)} = ${n(t.v2)}.` }
  ] }; }
});

/* Challenge: a third-order equation m x‴ + m a x″ + m b x′ + m c x = 0 as a system of three; one Euler step (q22). */
mk({
 id: 'q24d', parent: 'q24', kind: 'challenge', uses: 'q22', title: 'The three-stage stabiliser',
 brief: 'A three-stage stabiliser is governed by a third-order equation, and the control computer needs it as a first-order system before it can step it.',
 labels: ['A31', 'A32', 'A33', 'x₁ after one step', 'x₂ after one step', 'x₃ after one step'], tolerance: 0.0005,
 gl: [['A31'], ['x₃′ at t = 0'], ['x₂ after one step'], ['x₃ after one step']]
}, {
 canonical: { m: 2, a: 3, b: 2, c: 5, p0: 1, p1: -2, p2: 3, h: 0.1 },
 draw: R => ({ m: R.pick([1, 2]), a: R.int(1, 6), b: R.int(1, 8), c: R.int(1, 9), p0: R.nz(-3, 3), p1: R.int(-3, 3), p2: R.int(-3, 3), h: R.pick([0.1, 0.2, 0.5]) }),
 build: ({ m, a, b, c, p0, p1, p2, h }) => { const acc = -c * p0 - b * p1 - a * p2, x1 = G.tidy(p0 + h * p1), x2 = G.tidy(p1 + h * p2), x3 = G.tidy(p2 + h * acc); return {
  prompt: `A three-stage stabiliser in the Control Room obeys ${mm(m)}x‴${tail([[m * a, 'x″'], [m * b, 'x′'], [m * c, 'x']])} = 0, where x is its angle in radians and t is time in seconds. Here x‴ is the third derivative of x, the derivative of x″. The same idea as for a second-order equation works with one more unknown: put x₁ = x, x₂ = x′ and x₃ = x″, so that x₁′ = x₂, x₂′ = x₃, and the equation solved for x‴ gives x₃′ in terms of x₁, x₂ and x₃. This makes (x₁, x₂, x₃)′ = A(x₁, x₂, x₃) with a 3 × 3 matrix A. Enter the three entries of the bottom row of A, then take one Euler step of size h = ${n(h)} from x(0) = ${n(p0)}, x′(0) = ${n(p1)} and x″(0) = ${n(p2)}, and enter the estimates of x₁, x₂ and x₃ at t = ${n(h)}.`,
  answer: [-c, -b, -a, x1, x2, x3],
  hints: ['The first two rows of A are fixed by x₁′ = x₂ and x₂′ = x₃. For the bottom row, divide the whole equation by the number in front of x‴, move the other terms across, and read off the numbers that multiply x₁, x₂ and x₃.', 'Euler’s method moves every unknown forward by h times its rate, with all three rates worked out at the old values: x₁′ = x₂, x₂′ = x₃ and x₃′ from the bottom row.'],
  solution: `${m === 1 ? 'The coefficient of x‴ is already 1, so' : `Dividing by ${n(m)} gives`} x‴ = ${cf(-c, 'x')}${tail([[-b, 'x′'], [-a, 'x″']])}, so x₃′ = ${cf(-c, 'x₁')}${tail([[-b, 'x₂'], [-a, 'x₃']])} and the bottom row of A is (${n(-c)}, ${n(-b)}, ${n(-a)}). At t = 0 the rates are x₁′ = ${n(p1)}, x₂′ = ${n(p2)} and x₃′ = ${n(-c)} × ${par(p0)} ${sgn(-b)} ${n(b)} × ${par(p1)} ${sgn(-a)} ${n(a)} × ${par(p2)} = ${n(acc)}. One step gives x₁ ≈ ${n(p0)} + ${n(h)} × ${par(p1)} = ${n(x1)}, x₂ ≈ ${n(p1)} + ${n(h)} × ${par(p2)} = ${n(x2)} and x₃ ≈ ${n(p2)} + ${n(h)} × ${par(acc)} = ${n(x3)}.`,
  guidance: [
   { prompt: `Solve the equation for x‴. What number multiplies x₁ in x₃′?`, answer: [-c], explanation: `x‴ = −(${n(m * c)} ÷ ${n(m)})x − (${n(m * b)} ÷ ${n(m)})x′ − (${n(m * a)} ÷ ${n(m)})x″, so x₁ is multiplied by ${n(-c)}. The other two entries of the bottom row are ${n(-b)} and ${n(-a)}.` },
   { prompt: `What is x₃′ = ${cf(-c, 'x₁')}${tail([[-b, 'x₂'], [-a, 'x₃']])} at t = 0, with x₁ = ${n(p0)}, x₂ = ${n(p1)} and x₃ = ${n(p2)}?`, answer: [acc], explanation: `${n(-c)} × ${par(p0)} ${sgn(-b)} ${n(b)} × ${par(p1)} ${sgn(-a)} ${n(a)} × ${par(p2)} = ${n(acc)}.` },
   { prompt: `x₂′ = x₃ = ${n(p2)} at t = 0. What is the Euler estimate of x₂, ${n(p1)} + ${n(h)} × ${par(p2)}?`, answer: [x2], explanation: `${n(p1)} + ${par(G.tidy(h * p2))} = ${n(x2)}. Also x₁ ≈ ${n(x1)}.` },
   { prompt: `What is the Euler estimate of x₃, ${n(p2)} + ${n(h)} × ${par(acc)}?`, answer: [x3], explanation: `${n(p2)} + ${par(G.tidy(h * acc))} = ${n(x3)}.` }
  ] }; }
});

/* ---- q25 Linear systems x′ = Ax [3.3] ---- */

const fromReal = (l1, l2, m) => [[l1 * (m + 1) - l2 * m, l2 - l1], [m * (m + 1) * (l1 - l2), (m + 1) * l2 - m * l1]];
const big = M => M.some(r => r.some(v => Math.abs(v) > 12));
const HINT25 = ['x′ = Ax means x₁′ = (first row of A) · x and x₂′ = (second row of A) · x: multiply each row by the point and add.', 'For x(t) = e^(μt)v, the left side is μe^(μt)v and the right side is e^(μt)Av. It is a solution exactly when Av = μv in both components.'];

/* A = (l − qb, q; b(l − s), s) has the eigenvector (1, b) for l. The candidate e^(lt)(1, bb) is a solution when bb = b
   and not when bb = b + d. Not the parent's. */
mk({
 id: 'q25b', parent: 'q25', kind: 'setting', title: 'The coolant pump pair',
 brief: 'Two coolant pumps push on each other through one matrix, and Mira wants a proposed motion tested before it reaches the controller.',
 labels: ['x₁′', 'x₂′', 'solution (1 yes, 0 no)'], tolerance: 0.01,
 gl: [['x₁′'], ['x₂′'], ['first component of Av'], ['solution (1 yes, 0 no)']]
}, {
 canonical: { l: 2, b: -1, q: 1, s: -2, ok: false, d: -1, p1: 2, p2: -1 },
 draw: R => tryDraw(() => ({ l: R.nz(-3, 3), b: R.nz(-2, 2), q: R.nz(-2, 2), s: R.int(-3, 3), ok: R.bool(), d: R.pick([-1, 1]), p1: R.nz(-3, 3), p2: R.nz(-3, 3) }),
  p => { const A = [[p.l - p.q * p.b, p.q], [p.b * (p.l - p.s), p.s]], bb = p.ok ? p.b : p.b + p.d; return bb !== 0 && !big(A) && A.every(r => r.every(v => v !== 0)); },
  { l: 2, b: -1, q: 1, s: -2, ok: false, d: -1, p1: 2, p2: -1 }),
 build: ({ l, b, q, s, ok, d, p1, p2 }) => { const A = [[l - q * b, q], [b * (l - s), s]], bb = ok ? b : b + d, y1 = A[0][0] * p1 + A[0][1] * p2, y2 = A[1][0] * p1 + A[1][1] * p2,
  Av = [A[0][0] + A[0][1] * bb, A[1][0] + A[1][1] * bb], code = Av[0] === l && Av[1] === l * bb ? 1 : 0; return {
  prompt: `Two coolant pumps in the Control Room obey x′ = Ax, where x = (x₁, x₂) holds their speeds and A is the matrix with ${rows(A)}. Enter x₁′ and x₂′ when the pumps are at x = ${G.vec([p1, p2])}. Then enter 1 if x(t) = (${ex(l)}, ${cf(bb, ex(l))}) is a solution of the system, 0 if not.`,
  answer: [y1, y2, code],
  hints: HINT25,
  solution: `x₁′ = ${n(A[0][0])} × ${par(p1)} + ${par(A[0][1])} × ${par(p2)} = ${n(y1)} and x₂′ = ${n(A[1][0])} × ${par(p1)} + ${par(A[1][1])} × ${par(p2)} = ${n(y2)}. For the candidate, v = ${G.vec([1, bb])} and μ = ${n(l)}. Av = ${G.vec(Av)} and μv = ${G.vec([l, l * bb])}. ${code ? 'They agree, so x′ = Ax holds at every t: it is a solution, and the answer is 1.' : 'They differ, so x′ and Ax are different functions: it is not a solution, and the answer is 0.'}`,
  guidance: [
   { prompt: `What is x₁′ = ${cf(A[0][0], 'x₁')}${tail([[A[0][1], 'x₂']])} at x = ${G.vec([p1, p2])}?`, answer: [y1], explanation: `${n(A[0][0])} × ${par(p1)} + ${par(A[0][1])} × ${par(p2)} = ${n(y1)}.` },
   { prompt: `What is x₂′ = ${cf(A[1][0], 'x₁')}${tail([[A[1][1], 'x₂']])} at the same point?`, answer: [y2], explanation: `${n(A[1][0])} × ${par(p1)} + ${par(A[1][1])} × ${par(p2)} = ${n(y2)}.` },
   { prompt: `The candidate is ${ex(l)} times v = ${G.vec([1, bb])}. What is the first component of Av?`, answer: [Av[0]], explanation: `${n(A[0][0])} × 1 + ${par(A[0][1])} × ${par(bb)} = ${n(Av[0])}. The first component of μv is ${n(l)} × 1 = ${n(l)}.` },
   { prompt: `Enter 1 if Av = μv in both components (so the candidate is a solution), 0 if not.`, answer: [code], explanation: code ? 'Both components agree, so x′ = Ax for every t.' : 'The components differ, so x′ ≠ Ax and the candidate is not a solution.' }
  ] }; }
});

/* Applied: A with eigenvectors (1, m) for l1 and (1, m + 1) for l2; x = α e^(l1 t)(1, m) + β e^(l2 t)(1, m + 1), whose
   derivative at 0 equals A x(0). Not the parent's. */
mk({
 id: 'q25c', parent: 'q25', kind: 'applied', title: 'The twin chamber launch',
 brief: 'Two linked chambers are started from a blend of two known motions, and the crew needs their starting state and how fast it changes.',
 labels: ['x₁(0)', 'x₂(0)', 'x₁′(0)', 'x₂′(0)'], tolerance: 0.01,
 gl: [['x₁(0)'], ['x₂(0)'], ['x₁′(0)']]
}, {
 canonical: { l1: -1, l2: 2, m: 1, al: 2, be: -1 },
 draw: R => tryDraw(() => { const a = R.nz(-3, 3), b = R.nz(-3, 3); return { l1: Math.min(a, b), l2: Math.max(a, b), m: R.pick([-3, -2, 1, 2]), al: R.nz(-3, 3), be: R.nz(-3, 3) }; },
  p => p.l1 !== p.l2 && !big(fromReal(p.l1, p.l2, p.m)), { l1: -1, l2: 2, m: 1, al: 2, be: -1 }),
 build: ({ l1, l2, m, al, be }) => { const A = fromReal(l1, l2, m), x0 = [al + be, al * m + be * (m + 1)], dx = [A[0][0] * x0[0] + A[0][1] * x0[1], A[1][0] * x0[0] + A[1][1] * x0[1]]; return {
  prompt: `The temperature offsets of two linked chambers in the Control Room obey x′ = Ax, where x = (x₁, x₂) and A has ${rows(A)}. Two known solutions are u(t) = ${ex(l1)}${G.vec([1, m])} and w(t) = ${ex(l2)}${G.vec([1, m + 1])}, meaning each vector is multiplied by the exponential. Constant multiples of solutions can be added to give another solution, so x(t) = α u(t) + β w(t) is a solution for any constants α and β. The chambers are started with α = ${n(al)} and β = ${n(be)}. Enter x₁(0) and x₂(0), then x₁′(0) and x₂′(0), using x′ = Ax at t = 0.`,
  answer: [x0[0], x0[1], dx[0], dx[1]],
  hints: ['At t = 0 every exponential is 1, so x(0) = α × (the vector of u) + β × (the vector of w), worked out component by component.', 'Once x(0) is known, x′(0) = Ax(0): multiply each row of A by x(0) and add.'],
  solution: `At t = 0 the exponentials are 1, so x(0) = ${par(al)}${G.vec([1, m])} + ${par(be)}${G.vec([1, m + 1])} = ${G.vec(x0)}. Then x′(0) = A x(0): x₁′ = ${n(A[0][0])} × ${par(x0[0])} + ${par(A[0][1])} × ${par(x0[1])} = ${n(dx[0])} and x₂′ = ${n(A[1][0])} × ${par(x0[0])} + ${par(A[1][1])} × ${par(x0[1])} = ${n(dx[1])}.`,
  guidance: [
   { prompt: `What is x₁(0) = α × 1 + β × 1, with α = ${n(al)} and β = ${n(be)}?`, answer: [x0[0]], explanation: `${par(al)} × 1 + ${par(be)} × 1 = ${n(x0[0])}.` },
   { prompt: `What is x₂(0) = α × ${n(m)} + β × ${n(m + 1)}?`, answer: [x0[1]], explanation: `${par(al)} × ${par(m)} + ${par(be)} × ${par(m + 1)} = ${n(x0[1])}.` },
   { prompt: `With x(0) = ${G.vec(x0)}, what is x₁′(0) = ${cf(A[0][0], 'x₁')}${tail([[A[0][1], 'x₂']])}?`, answer: [dx[0]], explanation: `${n(A[0][0])} × ${par(x0[0])} + ${par(A[0][1])} × ${par(x0[1])} = ${n(dx[0])}. The second rate is x₂′(0) = ${n(dx[1])}.` }
  ] }; }
});

/* Challenge: m x″ + mc x′ + mk x = 0 as a system, x′ at a point, and the candidate (e^(μt), μe^(μt)), which solves the
   system exactly when μ² + cμ + k = 0 (roots r1, r2). */
mk({
 id: 'q25d', parent: 'q25', kind: 'challenge', uses: 'q24', title: 'The pointing arm test',
 brief: 'A pointing arm has a second-order equation, and the crew must test a proposed motion against the system the controller actually runs.',
 labels: ['x₁′', 'x₂′', 'solution (1 yes, 0 no)'], tolerance: 0.01,
 gl: [['x₂′'], ['second component of Av'], ['solution (1 yes, 0 no)']]
}, {
 canonical: { m: 2, r1: -1, r2: -3, ok: true, mu: -3, p1: 2, p2: -1 },
 draw: R => tryDraw(() => { const r1 = R.nz(-4, 4), r2 = R.nz(-4, 4), ok = R.bool(); return { m: R.pick([1, 2, 3]), r1, r2, ok, mu: ok ? R.pick([r1, r2]) : r1 + R.pick([-2, -1, 1, 2]), p1: R.nz(-3, 3), p2: R.nz(-3, 3) }; },
  p => { const cc = -(p.r1 + p.r2), kk = p.r1 * p.r2, v = p.mu * p.mu + cc * p.mu + kk; return cc !== 0 && p.mu !== 0 && (p.ok ? v === 0 : v !== 0); },
  { m: 2, r1: -1, r2: -3, ok: true, mu: -3, p1: 2, p2: -1 }),
 build: ({ m, r1, r2, mu, p1, p2 }) => { const cc = -(r1 + r2), kk = r1 * r2, y1 = p2, y2 = -kk * p1 - cc * p2, Av2 = -kk - cc * mu, code = Av2 === mu * mu ? 1 : 0; return {
  prompt: `A pointing arm in the Control Room obeys ${mm(m)}x″${tail([[m * cc, 'x′'], [m * kk, 'x']])} = 0, where x is its angle in radians and t is time in seconds. Write it as a first-order system with x₁ = x and x₂ = x′, so that (x₁, x₂)′ = A(x₁, x₂). Enter x₁′ and x₂′ when (x₁, x₂) = ${G.vec([p1, p2])}. Then enter 1 if x(t) = (${ex(mu)}, ${cf(mu, ex(mu))}) is a solution of that system, 0 if not.`,
  answer: [y1, y2, code],
  hints: ['Divide the equation by the number in front of x″ to find the bottom row of A; the top row is (0, 1). Then x₁′ and x₂′ are the two rows of A multiplied by the point and added.', 'For x(t) = e^(μt)v, it is a solution exactly when Av = μv in both components. Here v = (1, μ), and the first component always agrees, so the second decides.'],
  solution: `${m === 1 ? 'The coefficient of x″ is already 1, so' : `Dividing by ${n(m)} gives`} x″ = ${cf(-kk, 'x')}${tail([[-cc, 'x′']])}, so A has ${rows([[0, 1], [-kk, -cc]])}. At ${G.vec([p1, p2])}, x₁′ = ${n(y1)} and x₂′ = ${n(-kk)} × ${par(p1)} ${sgn(-cc)} ${n(Math.abs(cc))} × ${par(p2)} = ${n(y2)}. For the candidate, v = ${G.vec([1, mu])} and the exponent is ${n(mu)}. Av = ${G.vec([mu, Av2])} and μv = ${G.vec([mu, mu * mu])}. ${code ? 'They agree, so it is a solution, and the answer is 1.' : 'The second components differ, so it is not a solution, and the answer is 0.'}`,
  guidance: [
   { prompt: `What is x₂′ = ${cf(-kk, 'x₁')}${tail([[-cc, 'x₂']])} at (x₁, x₂) = ${G.vec([p1, p2])}?`, answer: [y2], explanation: `${n(-kk)} × ${par(p1)} ${sgn(-cc)} ${n(Math.abs(cc))} × ${par(p2)} = ${n(y2)}. Also x₁′ = x₂ = ${n(y1)}.` },
   { prompt: `The candidate is ${ex(mu)} times v = ${G.vec([1, mu])}. What is the second component of Av, ${n(-kk)} × 1 ${sgn(-cc)} ${n(Math.abs(cc))} × ${par(mu)}?`, answer: [Av2], explanation: `The first component of Av is ${n(mu)}, the same as μ × 1. The second is ${n(-kk)} + ${par(-cc * mu)} = ${n(Av2)}, and the second component of μv is ${n(mu)} × ${par(mu)} = ${n(mu * mu)}.` },
   { prompt: `Enter 1 if Av = μv in both components (so the candidate is a solution), 0 if not.`, answer: [code], explanation: code ? 'Both components agree, so x′ = Ax for every t.' : 'The second components differ, so the candidate is not a solution.' }
  ] }; }
});

})();
