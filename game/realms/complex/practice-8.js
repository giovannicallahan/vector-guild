/* Complex analysis: the plane of numbers practice missions, file 8 of 8: concepts q36–q40, three practice missions each
   (q36b q36c q36d q37b q37c q37d q38b q38c q38d q39b q39c q39d q40b q40c q40d).
   Format and rules: docs/PACK-FORMAT.md, "Practice missions" (§10).
     b  kind 'setting'    the same skill in a new real-world setting
     c  kind 'applied'    a word problem with two or three steps (two or three guided steps)
     d  kind 'challenge'  harder numbers, or the skill combined with one earlier concept (optional `uses: 'qNN'`)
   A practice mission supplies only: id, parent, kind, title, brief, prompt, answer, labels, tolerance, hints,
   solution, guidance (and `uses` for a challenge). Everything else comes from its parent, the learn mission:
   topic, tier, xp, sector, lesson, teaching, sources, the concept bench and the review drill. Do not write those.
   Each mission is registered together with its generator by add(mission, generator); build(canonical) must
   reproduce the authored prompt, hints, solution and guidance exactly. Oracles: qa/realms/complex/oracle-p8.js. */
(function(){
'use strict';
const G = window.Gen, { n, plus, par } = G;
const PRACTICE = window.PRACTICE = window.PRACTICE || [];
const GEN = window.MISSION_GEN = window.MISSION_GEN || {};
/* Registers one practice mission and its generator {canonical, draw(R), build(p)}. */
const add = (mission, generator) => { PRACTICE.push(mission); GEN[mission.id] = generator; };

/* Builds the authored mission from build(canonical), so the authored text and the generator can never drift apart.
   meta: id, parent, kind, title, brief, labels, tolerance, gl (the labels of each guided step, one box each), uses (optional). */
const mk = (meta, gen) => {
 const b = gen.build(gen.canonical), { gl, ...m } = meta;
 add({ ...m, prompt: b.prompt, answer: b.answer, hints: b.hints, solution: b.solution,
  guidance: b.guidance.map((g, i) => ({ prompt: g.prompt, answer: g.answer, labels: gl[i], explanation: g.explanation })) }, gen);
};
const SUP = { '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹', '-': '⁻' };
const sup = k => k === 1 ? '' : String(k).split('').map(ch => SUP[ch]).join('');
const sgn = v => v < 0 ? '−' : '+';
const ab = v => n(Math.abs(v));
/* A term with its sign for the middle of a sum: trm(−1, 'z') is '− z', trm(3, 'z²') is '+ 3z²'. */
const trm = (v, x) => `${sgn(v)} ${Math.abs(v) === 1 ? '' : n(Math.abs(v))}${x}`;
const cst = v => `${sgn(v)} ${n(Math.abs(v))}`;
/* A leading term: lead(−1, 'z') is '−z', lead(3, 'z') is '3z'. */
const lead = (v, x) => `${v < 0 ? '−' : ''}${Math.abs(v) === 1 ? '' : n(Math.abs(v))}${x}`;
/* A sum of terms [[coefficient, power of z], …], highest first, zero terms left out: poly([[1, 3], [−2, 2], [5, 0]]) is 'z³ − 2z² + 5'. */
const zpow = k => k === 0 ? '' : k === 1 ? 'z' : `z${sup(k)}`;
const poly = terms => { const t = terms.filter(([c]) => c !== 0); if (!t.length) return '0';
 return t.map(([c, k], i) => k === 0 ? (i ? cst(c) : n(c)) : (i ? trm(c, zpow(k)) : lead(c, zpow(k)))).join(' '); };
const imag = y => y === 1 ? 'i' : y === -1 ? '−i' : `${n(y)}i`;
/* Complex numbers as points [x, y]: cx([3, −4]) is '3 − 4i', cx([0, 1]) is 'i', cx([−2, 0]) is '−2'. */
const cx = ([x, y]) => y === 0 ? n(x) : x === 0 ? imag(y) : `${n(x)} ${sgn(y)} ${Math.abs(y) === 1 ? '' : n(Math.abs(y))}i`;
const mod = ([x, y]) => Math.sqrt(x * x + y * y);
/* The factor z − p: fac([2, 0]) is 'z − 2', fac([0, −4]) is 'z + 4i', fac([3, 4]) is 'z − 3 − 4i', fac([0, 0]) is 'z'. */
const fac = p => { const [x, y] = p; if (x === 0 && y === 0) return 'z';
 if (y === 0) return `z ${x > 0 ? '−' : '+'} ${n(Math.abs(x))}`;
 if (x === 0) return `z ${y > 0 ? '−' : '+'} ${imag(Math.abs(y))}`;
 return `z ${x > 0 ? '−' : '+'} ${n(Math.abs(x))} ${y > 0 ? '−' : '+'} ${Math.abs(y) === 1 ? '' : n(Math.abs(y))}i`; };
/* (z − p) to the power k: pw([2, 0], 3) is '(z − 2)³', pw([0, 0], 2) is 'z²', pw([1, 0], 1) is '(z − 1)', pw([0, 0], 1) is 'z'. */
const pw = (p, k) => p[0] === 0 && p[1] === 0 ? `z${sup(k)}` : `(${fac(p)})${sup(k)}`;
/* The same for a real point x. */
const rp = (x, k) => pw([x, 0], k);
const same = (p, q) => p[0] === q[0] && p[1] === q[1];
const kpi = k => k === 0 ? '0' : `${kp(k)}i`;
const times = m => m === 1 ? 'once' : m === 2 ? 'twice' : `${n(m)} times`;
const turns = m => times(Math.abs(m)) + (m > 0 ? ' anticlockwise' : ' clockwise');
/* The circle |z − c| = r for a real centre c. */
const circ = (c, r) => c === 0 ? `|z| = ${n(r)}` : `|${fac([c, 0])}| = ${n(r)}`;
/* Bounded retry: at most 1000 tries, then the canonical parameters. */
const tries = (make, ok, fallback) => { for (let i = 0; i < 1000; i++) { const p = make(); if (ok(p)) return p; } return fallback; };
/* Points with whole-number moduli: ±m and ±mi for m = 1 … 6, and the four 3 ± 4i, −3 ± 4i (modulus 5). */
const POINTS = [];
for (let m = 1; m <= 6; m++) POINTS.push([m, 0], [-m, 0], [0, m], [0, -m]);
POINTS.push([3, 4], [3, -4], [-3, 4], [-3, -4]);
/* Points x + yi with x and y between −4 and 4, neither 0: moduli √(x² + y²), compared with R through x² + y² and R². */
const SKEW = [];
for (let x = -4; x <= 4; x++) for (let y = -4; y <= 4; y++) if (x !== 0 && y !== 0) SKEW.push([x, y]);
/* a² − b² = s² with 0 < b < a: [a, b, s]. */
const TRIPLES = [[5, 3, 4], [5, 4, 3], [10, 6, 8], [10, 8, 6], [13, 5, 12], [13, 12, 5], [17, 8, 15], [17, 15, 8], [25, 7, 24], [25, 24, 7], [15, 9, 12], [15, 12, 9], [20, 12, 16], [20, 16, 12]];
const BIG = [[13, 5, 12], [13, 12, 5], [17, 8, 15], [17, 15, 8], [25, 7, 24], [25, 24, 7], [26, 10, 24], [29, 20, 21], [29, 21, 20], [34, 16, 30], [37, 12, 35], [41, 9, 40], [41, 40, 9], [37, 35, 12]];
/* '3π', and just 'π' for 1. */
const kp = k => k === 1 ? 'π' : `${n(k)}π`;
const r2 = x => Math.round(x * 100) / 100;

/* ---- q36 Residues at higher-order poles [9.4] ---- */

mk({
 id: 'q36b', parent: 'q36', kind: 'setting', title: 'Dampers in the pump hall',
 brief: 'Two damper circuits in the pump hall each have a repeated pole, and the engineer needs the residue of each.',
 labels: ['residue of f', 'residue of h'], tolerance: 0.01,
 gl: [['g′ at the pole'], ['j″ at the pole'], ['residue of h']]
}, {
 /* Circuit A: f = g ÷ (z − a)², g cubic with leading coefficient 1, residue g′(a) = 3a² + 2pa + q.
    Circuit B: h = j ÷ (z − b)³, j cubic u z³ + t z² + v z + w, residue j″(b) ÷ 2 = 3ub + t. Both tops are non-zero at their poles. */
 canonical: { a: -1, p: 2, q: -3, r: 4, b: 2, u: 2, t: -5, v: 1, w: 3 },
 draw: R => tries(() => ({ a: R.int(-3, 3), p: R.int(-5, 5), q: R.int(-5, 5), r: R.int(-5, 5), b: R.int(-3, 3), u: R.nz(-3, 3), t: R.int(-5, 5), v: R.int(-5, 5), w: R.int(-5, 5) }),
  ({ a, p, q, r, b, u, t, v, w }) => a * a * a + p * a * a + q * a + r !== 0 && 3 * a * a + 2 * p * a + q !== 0 && u * b * b * b + t * b * b + v * b + w !== 0 && 3 * u * b + t !== 0,
  { a: -1, p: 2, q: -3, r: 4, b: 2, u: 2, t: -5, v: 1, w: 3 }),
 build: ({ a, p, q, r, b, u, t, v, w }) => { const g = poly([[1, 3], [p, 2], [q, 1], [r, 0]]), g1 = poly([[3, 2], [2 * p, 1], [q, 0]]), ra = 3 * a * a + 2 * p * a + q,
  j = poly([[u, 3], [t, 2], [v, 1], [w, 0]]), j1 = poly([[3 * u, 2], [2 * t, 1], [v, 0]]), j2 = poly([[6 * u, 1], [2 * t, 0]]), j2b = 6 * u * b + 2 * t, rb = 3 * u * b + t; return {
  prompt: `A pump hall has two damper circuits. Circuit A has top g(z) = ${g} and f(z) = g(z) ÷ ${rp(a, 2)}, a pole of order 2 at z = ${n(a)}. Circuit B has top j(z) = ${j} and h(z) = j(z) ÷ ${rp(b, 3)}, a pole of order 3 at z = ${n(b)}. Each top is not 0 at its pole. Enter the residue of f at z = ${n(a)}, then the residue of h at z = ${n(b)}.`,
  answer: [ra, rb],
  hints: ['At a pole of order k, write the function as g(z) ÷ (z − a)ᵏ with g analytic at a. The residue is the (k − 1)th derivative of g at a, divided by (k − 1)!.', 'Circuit A needs one derivative of its top. Circuit B needs two derivatives of its top, and then the result is divided by 2! = 2.'],
  solution: `Circuit A has order 2, so the residue is g′(${n(a)}) ÷ 1!. Here g′(z) = ${g1}, so g′(${n(a)}) = ${n(ra)}, and the residue of f is ${n(ra)}. Circuit B has order 3, so the residue is j″(${n(b)}) ÷ 2!. Here j′(z) = ${j1} and j″(z) = ${j2}, so j″(${n(b)}) = ${n(j2b)} and the residue of h is ${n(j2b)} ÷ 2 = ${n(rb)}.`,
  guidance: [
   { prompt: `The top of circuit A is g(z) = ${g}. What is g′(${n(a)})?`, answer: [ra], explanation: `g′(z) = ${g1}, so g′(${n(a)}) = ${n(ra)}. For a pole of order 2 that is the residue, since 1! = 1.` },
   { prompt: `The top of circuit B is j(z) = ${j}. What is j″(${n(b)})?`, answer: [j2b], explanation: `j′(z) = ${j1} and j″(z) = ${j2}, so j″(${n(b)}) = ${n(j2b)}.` },
   { prompt: `Circuit B has a pole of order 3. Divide j″ at the pole by 2!: what is the residue of h?`, answer: [rb], explanation: `${n(j2b)} ÷ 2 = ${n(rb)}.` }
  ] }; }
});

mk({
 id: 'q36c', parent: 'q36', kind: 'applied', title: 'The three-filter mixer',
 brief: 'A mixer adds three weighted filter outputs that share one top, and the engineer needs the residue of the whole mix.',
 labels: ['residue of the order 3 term', 'residue of f'], tolerance: 0.01,
 gl: [['residue of the order 2 term'], ['residue of the order 3 term'], ['residue of f']]
}, {
 /* f = w1 g ÷ (z − a) + w2 g ÷ (z − a)² + w3 g ÷ (z − a)³, g = z³ + pz² + qz + r. Residues w1 g(a), w2 g′(a), w3 (3a + p). */
 canonical: { a: 1, p: -2, q: 3, r: 2, w1: 2, w2: -3, w3: 4 },
 draw: R => tries(() => ({ a: R.int(-3, 3), p: R.int(-5, 5), q: R.int(-5, 5), r: R.int(-5, 5), w1: R.except(-3, 3, [0]), w2: R.except(-3, 3, [0]), w3: R.except(-3, 3, [0]) }),
  ({ a, p, q, r, w1, w2, w3 }) => { const ga = a * a * a + p * a * a + q * a + r, g1 = 3 * a * a + 2 * p * a + q, g2 = 3 * a + p;
   return ga !== 0 && g1 !== 0 && g2 !== 0 && w1 * ga + w2 * g1 + w3 * g2 !== 0 && !(a === 1 && p === 0 && q === 1 && r === 0); },
  { a: 1, p: -2, q: 3, r: 2, w1: 2, w2: -3, w3: 4 }),
 build: ({ a, p, q, r, w1, w2, w3 }) => { const g = poly([[1, 3], [p, 2], [q, 1], [r, 0]]), g1 = poly([[3, 2], [2 * p, 1], [q, 0]]), g2 = poly([[6, 1], [2 * p, 0]]),
  ga = a * a * a + p * a * a + q * a + r, g1a = 3 * a * a + 2 * p * a + q, g2a = 6 * a + 2 * p, h3 = g2a / 2,
  t1 = w1 * ga, t2 = w2 * g1a, t3 = w3 * h3, tot = t1 + t2 + t3,
  f = `${lead(w1, 'g(z)')} ÷ ${rp(a, 1)} ${trm(w2, 'g(z)')} ÷ ${rp(a, 2)} ${trm(w3, 'g(z)')} ÷ ${rp(a, 3)}`; return {
  prompt: `A mixer in the control room adds three weighted filter outputs, so f(z) = ${f}, where g(z) = ${g} and g(${n(a)}) is not 0. The residue of a sum is the sum of the residues, and a weight multiplies a residue. Enter the residue at z = ${n(a)} of the third term alone (the one with the pole of order 3, with its weight), then the residue of f at z = ${n(a)}.`,
  answer: [t3, tot],
  hints: ['A term w × g(z) ÷ (z − a)ᵏ has residue w × g⁽ᵏ⁻¹⁾(a) ÷ (k − 1)!. For k = 1 that is just w × g(a).', 'Find the residue of each of the three terms separately, then add them: the residue of the whole sum is the sum of the three.'],
  solution: `The first term has order 1, so its residue is ${n(w1)} × g(${n(a)}) = ${n(w1)} × ${par(ga)} = ${n(t1)}. The second has order 2: g′(z) = ${g1}, so g′(${n(a)}) = ${n(g1a)} and the residue is ${n(w2)} × ${par(g1a)} = ${n(t2)}. The third has order 3: g″(z) = ${g2}, so g″(${n(a)}) = ${n(g2a)}, and the residue is ${n(w3)} × ${par(g2a)} ÷ 2 = ${n(t3)}. The residue of f is ${n(t1)} ${cst(t2)} ${cst(t3)} = ${n(tot)}.`,
  guidance: [
   { prompt: `What is the residue at z = ${n(a)} of the second term, ${lead(w2, 'g(z)')} ÷ ${rp(a, 2)}? (For a pole of order 2 it is the weight times g′ at the pole.)`, answer: [t2], explanation: `g′(z) = ${g1}, so g′(${n(a)}) = ${n(g1a)}, and the residue is ${n(w2)} × ${par(g1a)} = ${n(t2)}.` },
   { prompt: `What is the residue at z = ${n(a)} of the third term, ${lead(w3, 'g(z)')} ÷ ${rp(a, 3)}? (For a pole of order 3 it is the weight times g″ at the pole, divided by 2!.)`, answer: [t3], explanation: `g″(z) = ${g2}, so g″(${n(a)}) = ${n(g2a)}, and the residue is ${n(w3)} × ${par(g2a)} ÷ 2 = ${n(t3)}.` },
   { prompt: `The first term, ${lead(w1, 'g(z)')} ÷ ${rp(a, 1)}, has a simple pole, with residue the weight times g at the pole. Add the three residues: what is the residue of f?`, answer: [tot], explanation: `The first residue is ${n(w1)} × ${par(ga)} = ${n(t1)}. The sum is ${n(t1)} ${cst(t2)} ${cst(t3)} = ${n(tot)}.` }
  ] }; }
});

mk({
 id: 'q36d', parent: 'q36', kind: 'challenge', uses: 'q35', title: 'A double pole beside a single one',
 brief: 'A filter has one repeated pole and one single pole side by side, and both residues are needed.',
 labels: ['residue at the double pole', 'residue at the simple pole'], tolerance: 0.01,
 gl: [['top of G′ at the pole'], ['residue at the double pole'], ['residue at the simple pole']]
}, {
 /* f = g ÷ ((z − a)²(z − b)), g = pz² + qz + r, d = a − b in {±1, ±2}. G = g ÷ (z − b); res_a = G′(a) = (g′(a)d − g(a)) ÷ d²; res_b = g(b) ÷ d².
    Both residues are whole numbers and both tops are non-zero. */
 canonical: { a: 2, d: -1, p: 1, q: -3, r: 5 },
 draw: R => tries(() => ({ a: R.int(-3, 3), d: R.pick([-2, -1, 1, 2]), p: R.except(-3, 3, [0]), q: R.int(-5, 5), r: R.int(-5, 5) }),
  ({ a, d, p, q, r }) => { const b = a - d, ga = p * a * a + q * a + r, g1a = 2 * p * a + q, gb = p * b * b + q * b + r, top = g1a * d - ga;
   return ga !== 0 && gb !== 0 && top % (d * d) === 0 && gb % (d * d) === 0 && top !== 0; },
  { a: 2, d: -1, p: 1, q: -3, r: 5 }),
 build: ({ a, d, p, q, r }) => { const b = a - d, g = poly([[p, 2], [q, 1], [r, 0]]), g1 = poly([[2 * p, 1], [q, 0]]),
  ga = p * a * a + q * a + r, g1a = 2 * p * a + q, gb = p * b * b + q * b + r, top = g1a * d - ga, ra = top / (d * d), rb = gb / (d * d),
  den = `${rp(a, 2)}${b === 0 ? 'z' : `(${fac([b, 0])})`}`; return {
  prompt: `A control-room filter has f(z) = g(z) ÷ (${den}), where g(z) = ${g} is not 0 at either pole. So f has a pole of order 2 at z = ${n(a)} and a simple pole at z = ${n(b)}. Enter the residue of f at z = ${n(a)}, then the residue of f at z = ${n(b)}. Both are whole numbers.`,
  answer: [ra, rb],
  hints: ['Near the double pole a, write f(z) = G(z) ÷ (z − a)² with G(z) = g(z) ÷ (z − b), which is analytic at a. The residue is G′(a), and the quotient rule gives G′(z) = (g′(z)(z − b) − g(z)) ÷ (z − b)².', 'At the simple pole b, remove the factor (z − b) from the bottom and put z = b in what is left: the residue is g(b) ÷ (b − a)².'],
  solution: `Near z = ${n(a)}, f(z) = G(z) ÷ ${rp(a, 2)} with G(z) = g(z) ÷ (${fac([b, 0])}). By the quotient rule G′(z) = (g′(z)(${fac([b, 0])}) − g(z)) ÷ (${fac([b, 0])})². Here g′(z) = ${g1}, so g(${n(a)}) = ${n(ga)} and g′(${n(a)}) = ${n(g1a)}. The top of G′(${n(a)}) is ${n(g1a)} × ${par(d)} − ${par(ga)} = ${n(top)}, and the bottom is ${par(d)}² = ${n(d * d)}, so the residue at ${n(a)} is ${n(ra)}. At z = ${n(b)}, f(z) = (g(z) ÷ ${rp(a, 2)}) ÷ (${fac([b, 0])}), so the residue is g(${n(b)}) ÷ (${n(b)} − ${par(a)})² = ${n(gb)} ÷ ${n(d * d)} = ${n(rb)}.`,
  guidance: [
   { prompt: `With G(z) = g(z) ÷ (${fac([b, 0])}), the quotient rule gives G′(${n(a)}) = (g′(${n(a)}) × (${n(a)} − ${par(b)}) − g(${n(a)})) ÷ (${n(a)} − ${par(b)})². What is the top, g′(${n(a)}) × (${n(a)} − ${par(b)}) − g(${n(a)})?`, answer: [top], explanation: `g′(${n(a)}) = ${n(g1a)}, g(${n(a)}) = ${n(ga)} and ${n(a)} − ${par(b)} = ${n(d)}, so the top is ${n(g1a)} × ${par(d)} − ${par(ga)} = ${n(top)}.` },
   { prompt: `Divide that top by (${n(a)} − ${par(b)})². What is the residue of f at z = ${n(a)}?`, answer: [ra], explanation: `(${n(a)} − ${par(b)})² = ${n(d * d)}, so the residue is ${n(top)} ÷ ${n(d * d)} = ${n(ra)}.` },
   { prompt: `At the simple pole z = ${n(b)}, the residue is g(${n(b)}) ÷ (${n(b)} − ${par(a)})². What is it?`, answer: [rb], explanation: `g(${n(b)}) = ${n(gb)} and (${n(b)} − ${par(a)})² = ${n(d * d)}, so the residue is ${n(rb)}.` }
  ] }; }
});

/* ---- q37 The residue theorem [9.5] ---- */

mk({
 id: 'q37b', parent: 'q37', kind: 'setting', title: 'Currents round the field coil',
 brief: 'A coil feeder has three simple poles and a loop centred off the origin, and the engineer wants the loop integral from the residues inside.',
 labels: ['poles inside', 'k'], tolerance: 0.01,
 gl: [['residue at the first pole'], ['poles inside'], ['sum of residues inside']]
}, {
 /* f = A ÷ (z − a) + B ÷ (z − b) + C ÷ (z − d) written over one bottom: top αz² + βz + γ. Residues A, B, C (non-zero).
    Circle |z − c| = r, real centre c; a pole is inside when |x − c| < r, never equal; one or two inside. */
 canonical: { a: 1, b: -2, d: 4, A: 3, B: -1, C: 2, c: -1, r: 3 },
 draw: R => tries(() => ({ a: R.int(-6, 6), b: R.int(-6, 6), d: R.int(-6, 6), A: R.except(-4, 4, [0]), B: R.except(-4, 4, [0]), C: R.except(-4, 4, [0]), c: R.int(-4, 4), r: R.int(1, 6) }),
  p => { const D = [p.a, p.b, p.d].map(x => Math.abs(x - p.c)), N = D.filter(v => v < p.r).length;
   return p.a !== p.b && p.a !== p.d && p.b !== p.d && D.every(v => v !== p.r) && N >= 1 && N <= 2; },
  { a: 1, b: -2, d: 4, A: 3, B: -1, C: 2, c: -1, r: 3 }),
 build: ({ a, b, d, A, B, C, c, r }) => { const X = [a, b, d], res = [A, B, C], al = A + B + C, be = -(A * (b + d) + B * (a + d) + C * (a + b)), ga = A * b * d + B * a * d + C * a * b,
  top = poly([[al, 2], [be, 1], [ga, 0]]), bot = X.map(x => x === 0 ? 'z' : `(${fac([x, 0])})`).join(''),
  dist = X.map(x => Math.abs(x - c)), ins = dist.map(v => v < r), N = ins.filter(Boolean).length, S = res.reduce((s, v, i) => s + (ins[i] ? v : 0), 0), k = 2 * S,
  qd = i => X.filter((_, j) => j !== i).reduce((m, x) => m * (X[i] - x), 1), pv = x => al * x * x + be * x + ga,
  where = i => `${n(X[i])}, distance ${n(dist[i])} from the centre, ${ins[i] ? 'inside' : 'outside'}`,
  insideList = [0, 1, 2].filter(i => ins[i]).map(i => `${n(res[i])} at ${n(X[i])}`).join(' and '),
  resTxt = i => `At z = ${n(X[i])}: p(${n(X[i])}) = ${n(pv(X[i]))} and q′(${n(X[i])}) = ${n(qd(i))}, so the residue is ${n(res[i])}.`; return {
  prompt: `A feeder current in the field coil has f(z) = (${top}) ÷ (${bot}), with a simple pole at each of z = ${n(a)}, ${n(b)} and ${n(d)}. The control room integrates round the circle ${circ(c, r)}, which has radius ${n(r)} and centre ${n(c)}, once anticlockwise. A point is inside when its distance from the centre is less than the radius. Enter how many of the three poles lie inside the circle, then the number k with ∮ f(z) dz = kπi.`,
  answer: [N, k],
  hints: ['Once anticlockwise round a closed curve, ∮ f(z) dz is 2πi times the sum of the residues of f at the poles inside the curve. A pole x is inside when its distance from the centre, |x − c|, is less than the radius.', 'At a simple pole of p(z) ÷ q(z), the residue is p(z) ÷ q′(z) at that pole. With q(z) = (z − r₁)(z − r₂)(z − r₃), q′ at r₁ is (r₁ − r₂)(r₁ − r₃).'],
  solution: `Here p(z) = ${top} and q(z) = ${bot}. The poles are at ${where(0)}; ${where(1)}; and ${where(2)}. So ${n(N)} of them lie inside. ${resTxt(0)} ${resTxt(1)} ${resTxt(2)} The residues inside are ${insideList}, with sum ${n(S)}. By the residue theorem, ∮ f(z) dz = 2πi × ${par(S)} = ${kpi(k)}, so k = ${n(k)}.`,
  guidance: [
   { prompt: `At the pole z = ${n(a)}, the residue is p(${n(a)}) ÷ q′(${n(a)}), where p(z) = ${top} and q′(${n(a)}) = (${n(a)} − ${par(b)})(${n(a)} − ${par(d)}). What is the residue?`, answer: [A], explanation: `${resTxt(0)}` },
   { prompt: `How many of the three poles are inside the circle ${circ(c, r)}? A pole is inside when its distance from the centre ${n(c)} is less than ${n(r)}.`, answer: [N], explanation: `The distances from ${n(c)} are ${n(dist[0])}, ${n(dist[1])} and ${n(dist[2])}, so ${n(N)} of them are less than ${n(r)}.` },
   { prompt: `The other two residues are found the same way. What is the sum of the residues at the poles inside the circle?`, answer: [S], explanation: `The residues inside are ${insideList}, so the sum is ${n(S)}, and ∮ f(z) dz = 2πi × ${par(S)} = ${kpi(k)}.` }
  ] }; }
});

mk({
 id: 'q37c', parent: 'q37', kind: 'applied', title: 'The ring-road meter',
 brief: 'A meter on the ring road integrates a field with one repeated pole and one single pole, and the engineer wants the reading without a long calculation.',
 labels: ['residue at the double pole', 'k'], tolerance: 0.01,
 gl: [['residue at the double pole'], ['poles inside'], ['sum of residues inside']]
}, {
 /* f = g ÷ (z − a)² + A ÷ (z − b), g = pz² + qz + r with g(a) ≠ 0. Real poles a ≠ b, circle |z| = R, at least one pole inside, never on the circle.
    Residues: g′(a) = 2pa + q at a, A at b. k = 2 × (sum of the residues inside). */
 canonical: { a: 2, b: -4, p: 1, q: -3, r: 2, A: 3, R: 3 },
 draw: R => tries(() => ({ a: R.int(-6, 6), b: R.int(-6, 6), p: R.except(-3, 3, [0]), q: R.int(-6, 6), r: R.int(-6, 6), A: R.except(-5, 5, [0]), R: R.int(2, 7) }),
  p => p.a !== p.b && Math.abs(p.a) !== p.R && Math.abs(p.b) !== p.R && (Math.abs(p.a) < p.R || Math.abs(p.b) < p.R) && p.p * p.a * p.a + p.q * p.a + p.r !== 0 && 2 * p.p * p.a + p.q !== 0,
  { a: 2, b: -4, p: 1, q: -3, r: 2, A: 3, R: 3 }),
 build: ({ a, b, p, q, r, A, R }) => { const g = poly([[p, 2], [q, 1], [r, 0]]), g1 = poly([[2 * p, 1], [q, 0]]), ga = p * a * a + q * a + r, ra = 2 * p * a + q,
  insA = Math.abs(a) < R, insB = Math.abs(b) < R, N = (insA ? 1 : 0) + (insB ? 1 : 0), S = (insA ? ra : 0) + (insB ? A : 0), k = 2 * S,
  bf = b === 0 ? 'z' : `(${fac([b, 0])})`,
  list = [insA ? `${n(ra)} at ${n(a)}` : '', insB ? `${n(A)} at ${n(b)}` : ''].filter(Boolean).join(' and '); return {
  prompt: `A meter on the ring road reads ∮ f(z) dz once anticlockwise round the circle |z| = ${n(R)}, where f(z) = g(z) ÷ ${rp(a, 2)} ${sgn(A)} ${ab(A)} ÷ ${bf} and g(z) = ${g}. Since g(${n(a)}) is not 0, f has a pole of order 2 at z = ${n(a)} and a simple pole at z = ${n(b)}. Enter the residue of f at z = ${n(a)}, then the number k with ∮ f(z) dz = kπi.`,
  answer: [ra, k],
  hints: ['If f(z) = g(z) ÷ (z − a)² with g analytic at a, the residue at a is g′(a). A term A ÷ (z − b) has residue A at b. A pole is inside |z| = R when its modulus is less than R.', 'Add the residues of the poles inside the circle only. Then ∮ f(z) dz = 2πi times that sum, so k is twice the sum.'],
  solution: `Here g′(z) = ${g1}, so the residue at the double pole z = ${n(a)} is g′(${n(a)}) = ${n(ra)}. The second term has residue ${n(A)} at z = ${n(b)}. The moduli are ${n(Math.abs(a))} and ${n(Math.abs(b))}, and the circle has radius ${n(R)}, so ${N === 2 ? 'both poles are inside' : insA ? 'only the pole at ' + n(a) + ' is inside' : 'only the pole at ' + n(b) + ' is inside'}. The residues inside are ${list}, with sum ${n(S)}. So ∮ f(z) dz = 2πi × ${par(S)} = ${kpi(k)}, and k = ${n(k)}.`,
  guidance: [
   { prompt: `For a pole of order 2 the residue is g′ at the pole, where g(z) = ${g}. What is the residue of f at z = ${n(a)}?`, answer: [ra], explanation: `g′(z) = ${g1}, so g′(${n(a)}) = ${n(ra)}. The other term is analytic at ${n(a)}, so it adds nothing.` },
   { prompt: `A pole is inside |z| = ${n(R)} when its modulus is less than ${n(R)}. How many of the two poles, z = ${n(a)} and z = ${n(b)}, are inside?`, answer: [N], explanation: `The moduli are ${n(Math.abs(a))} and ${n(Math.abs(b))}, so ${n(N)} of them are less than ${n(R)}.` },
   { prompt: `What is the sum of the residues at the poles inside the circle?`, answer: [S], explanation: `The residues inside are ${list}, so the sum is ${n(S)}, and ∮ f(z) dz = 2πi × ${par(S)} = ${kpi(k)}.` }
  ] }; }
});

mk({
 id: 'q37d', parent: 'q37', kind: 'challenge', uses: 'q22', title: 'The cable wound round the loop',
 brief: 'A cable is wound several times round the control-room loop, so every pole inside is counted once for each turn.',
 labels: ['sum of residues inside', 'k'], tolerance: 0.01,
 gl: [['residue at the double pole'], ['sum of residues inside'], ['k']]
}, {
 /* f = A ÷ (z − p₁) + B ÷ (z − p₂) + (Dz + E) ÷ (z − p₃)², residues A, B, D. Curve: m turns round |z| = R, m in {±1, ±2, ±3} (negative is clockwise).
    The winding number round every point inside is m, so ∮ f dz = 2πi × m × S. Moduli whole, no pole on the circle, one or two inside, S ≠ 0. */
 canonical: { A: 2, x1: 1, y1: 0, B: -3, x2: 0, y2: 4, D: 4, E: 5, x3: -2, y3: 0, R: 3, m: 2 },
 draw: Rr => tries(() => { const P = [Rr.pick(POINTS), Rr.pick(POINTS), Rr.pick(POINTS)]; return { A: Rr.except(-5, 5, [0]), x1: P[0][0], y1: P[0][1], B: Rr.except(-5, 5, [0]), x2: P[1][0], y2: P[1][1], D: Rr.except(-5, 5, [0]), E: Rr.int(-6, 6), x3: P[2][0], y3: P[2][1], R: Rr.int(2, 6), m: Rr.pick([-3, -2, -1, 2, 3]) }; },
  p => { const P = [[p.x1, p.y1], [p.x2, p.y2], [p.x3, p.y3]], M = P.map(mod), ins = M.map(v => v < p.R), N = ins.filter(Boolean).length, S = (ins[0] ? p.A : 0) + (ins[1] ? p.B : 0) + (ins[2] ? p.D : 0);
   return !same(P[0], P[1]) && !same(P[0], P[2]) && !same(P[1], P[2]) && M.every(v => v !== p.R) && N >= 1 && N <= 2 && S !== 0 && (p.x3 * p.D + p.E !== 0 || p.y3 !== 0); },
  { A: 2, x1: 1, y1: 0, B: -3, x2: 0, y2: 4, D: 4, E: 5, x3: -2, y3: 0, R: 3, m: 2 }),
 build: ({ A, x1, y1, B, x2, y2, D, E, x3, y3, R, m }) => { const P = [[x1, y1], [x2, y2], [x3, y3]], M = P.map(mod), ins = M.map(v => v < R), res = [A, B, D],
  S = res.reduce((s, v, i) => s + (ins[i] ? v : 0), 0), k = 2 * m * S, N = ins.filter(Boolean).length,
  term = (c, body) => ` ${sgn(c)} ${ab(c)} ÷ ${body}`, dtop = poly([[D, 1], [E, 0]]),
  f = `${n(A)} ÷ (${fac(P[0])})${term(B, `(${fac(P[1])})`)} + (${dtop}) ÷ (${fac(P[2])})²`,
  where = i => `${cx(P[i])}, modulus ${n(M[i])}, ${ins[i] ? 'inside' : 'outside'}`,
  insideList = [0, 1, 2].filter(i => ins[i]).map(i => `${n(res[i])} at ${cx(P[i])}`).join(' and '); return {
  prompt: `A cable follows a loop that goes ${turns(m)} round the circle |z| = ${n(R)}, so it winds ${n(Math.abs(m))} ${Math.abs(m) === 1 ? 'time' : 'times'} round every point inside the circle (the winding number is ${n(m)}, negative for clockwise), and each residue inside counts once for every turn, with its sign. The control room needs ∮ f(z) dz along this loop, where f(z) = ${f}. Enter the sum of the residues of f at the poles inside the circle, then the number k with ∮ f(z) dz = kπi.`,
  answer: [S, k],
  hints: ['For a loop with winding number m round every pole inside it, ∮ f(z) dz = 2πi × m × (sum of the residues at the poles inside). Poles outside add nothing. A pole is inside |z| = R when its modulus is less than R.', 'A term A ÷ (z − p) has residue A at p. A term (Dz + E) ÷ (z − p)² has residue D at p: write Dz + E = D(z − p) + (Dp + E) and keep the (z − p)⁻¹ part.'],
  solution: `The poles are at ${where(0)}; ${where(1)}; and ${where(2)}. The residues are ${n(A)} at ${cx(P[0])} and ${n(B)} at ${cx(P[1])}. At the double pole ${cx(P[2])}, writing ${dtop} = ${n(D)}(${fac(P[2])}) + a constant, the part with (z − p)⁻¹ has coefficient ${n(D)}, so the residue is ${n(D)}. The residues inside are ${insideList}, with sum ${n(S)}. With winding number ${n(m)}, ∮ f(z) dz = 2πi × ${par(m)} × ${par(S)} = ${kpi(k)}, so k = ${n(k)}.`,
  guidance: [
   { prompt: `What is the residue of f at its double pole, z = ${cx(P[2])}? (Write ${dtop} as ${n(D)}(${fac(P[2])}) plus a constant, and divide by (${fac(P[2])})².)`, answer: [D], explanation: `${dtop} = ${n(D)}(${fac(P[2])}) + a constant, so the term splits into ${n(D)} ÷ (${fac(P[2])}) plus a constant ÷ (${fac(P[2])})². Only the first has a (z − p)⁻¹ part, so the residue is ${n(D)}.` },
   { prompt: `A pole is inside |z| = ${n(R)} when its modulus is less than ${n(R)}. What is the sum of the residues at the poles inside the circle?`, answer: [S], explanation: `The moduli are ${n(M[0])}, ${n(M[1])} and ${n(M[2])}. The residues inside are ${insideList}, with sum ${n(S)}.` },
   { prompt: `The winding number of the loop is ${n(m)}. Multiply: ∮ f(z) dz = 2πi × ${par(m)} × (sum of residues inside) = kπi. What is k?`, answer: [k], explanation: `k = 2 × ${par(m)} × ${par(S)} = ${n(k)}.` }
  ] }; }
});

/* ---- q38 Real integrals along the whole line [10.1] ---- */

mk({
 id: 'q38b', parent: 'q38', kind: 'setting', title: 'Spectrometer peaks',
 brief: 'A spectrometer records a peak that is not centred on zero, and a second channel with a squared top, and the engineer wants both areas exactly.',
 labels: ['k₁', 'k₂'], tolerance: 0.01,
 gl: [['Im of the residue'], ['poles in the upper half-plane'], ['k₂']]
}, {
 /* I₁ = ∫ ja dx ÷ ((x − h)² + a²) = jπ (pole h + ai above). I₂ = ∫ J(p + q) x² dx ÷ ((x² + p²)(x² + q²)) = Jπ, p < q
    (the two residues above add to 1 ÷ (2i(p + q))). */
 canonical: { h: -2, a: 3, j: 3, p: 2, q: 3, J: 2 },
 draw: R => tries(() => { const p = R.int(1, 5); return { h: R.except(-4, 4, [0]), a: R.int(1, 5), j: R.int(1, 4), p, q: R.int(p + 1, 6), J: R.int(1, 3) }; },
  v => !(v.p === 1 && v.q === 2 && v.J === 1), { h: -2, a: 3, j: 3, p: 2, q: 3, J: 2 }),
 build: ({ h, a, j, p, q, J }) => { const c = j * a, C = J * (p + q), s = p + q, up = [h, a], imRes = -j / 2,
  sh = `(x ${h > 0 ? '−' : '+'} ${ab(h)})²`; return {
  prompt: `A spectrometer records one peak, and the area under it from −∞ to ∞ is I₁ = ∫ ${n(c)} dx ÷ (${sh} + ${n(a * a)}). Its second channel gives I₂ = ∫ ${n(C)}x² dx ÷ ((x² + ${n(p * p)})(x² + ${n(q * q)})), also from −∞ to ∞. Each area is a whole number times π. Enter k₁ with I₁ = k₁π, then k₂ with I₂ = k₂π.`,
  answer: [j, J],
  hints: ['Close the real line with a large semicircle in the upper half-plane. When the integrand shrinks like 1 ÷ |z|² or faster, the arc adds nothing in the limit, so the integral is 2πi times the sum of the residues in the upper half-plane.', 'A bottom (x − h)² + a² with a > 0 is 0 at h + ai and h − ai, so only h + ai is above the real line. At a simple pole the residue is top ÷ (derivative of the bottom). For x² + p² the poles are ±pi.'],
  solution: `Close the real line with a large semicircle in the upper half-plane. Both integrands shrink like 1 ÷ |z|² or faster, so the arc adds nothing in the limit, and each area is 2πi times the sum of the residues above the real line. For I₁ the bottom is (${fac([h, a])})(${fac([h, -a])}), so the only pole above the real line is z = ${cx(up)}. There the residue is ${n(c)} ÷ (2 × ${imag(a)}) = ${n(c)} ÷ (${n(2 * a)}i), and I₁ = 2πi × ${n(c)} ÷ (${n(2 * a)}i) = ${kp(c)} ÷ ${n(a)} = ${kp(j)}. For I₂ the poles above are ${imag(p)} and ${imag(q)}. The residues of ${n(C)}z² ÷ ((z² + ${n(p * p)})(z² + ${n(q * q)})) are −${n(C * p)} ÷ (${n(2)}i × ${n(q * q - p * p)}) at ${imag(p)} and ${n(C * q)} ÷ (${n(2)}i × ${n(q * q - p * p)}) at ${imag(q)}. Their sum is ${n(C)}(${n(q)} − ${n(p)}) ÷ (2i × ${n(q * q - p * p)}) = ${n(C)} ÷ (2i × ${n(s)}), and I₂ = 2πi × ${n(C)} ÷ (2i × ${n(s)}) = ${kp(C)} ÷ ${n(s)} = ${kp(J)}.`,
  guidance: [
   { prompt: `The residue of I₁'s integrand at its pole above the real line, z = ${cx(up)}, is ${n(c)} ÷ (${n(2 * a)}i). Since 1 ÷ i = −i, what is its imaginary part?`, answer: [imRes], explanation: `${n(c)} ÷ (${n(2 * a)}i) = −(${n(c)} ÷ ${n(2 * a)})i, with imaginary part ${n(imRes)}. Multiplying by 2πi gives 2π × ${n(c / (2 * a))} = ${kp(j)}.` },
   { prompt: `The bottom of I₂ is 0 at ±${imag(p)} and ±${imag(q)}. How many of these poles lie in the upper half-plane?`, answer: [2], explanation: `${imag(p)} and ${imag(q)} have positive imaginary parts; their opposites are in the lower half-plane.` },
   { prompt: `The two residues above the real line add up to ${n(C)} ÷ (2i × ${n(s)}). Multiply by 2πi: what is k₂ with I₂ = k₂π?`, answer: [J], explanation: `2πi × ${n(C)} ÷ (2i × ${n(s)}) = ${kp(C)} ÷ ${n(s)} = ${kp(J)}.` }
  ] }; }
});

mk({
 id: 'q38c', parent: 'q38', kind: 'applied', title: 'Two lines on one detector',
 brief: 'A detector sees two spectral lines at once, and the engineer wants the area under each line and under the whole signal.',
 labels: ['k₁', 'k total'], tolerance: 0.01,
 gl: [['constant on top of line 2'], ['k₂'], ['k total']]
}, {
 /* Line i is Hᵢaᵢ² ÷ (x² + aᵢ²): height Hᵢ at x = 0. Area = Hᵢaᵢπ. */
 canonical: { H1: 2, a1: 3, H2: 1, a2: 4 },
 draw: R => tries(() => ({ H1: R.int(1, 6), a1: R.int(1, 5), H2: R.int(1, 6), a2: R.int(1, 5) }), v => v.a1 !== v.a2 && !(v.H1 === 1 && v.a1 === 2), { H1: 2, a1: 3, H2: 1, a2: 4 }),
 build: ({ H1, a1, H2, a2 }) => { const c1 = H1 * a1 * a1, c2 = H2 * a2 * a2, k1 = H1 * a1, k2 = H2 * a2, tot = k1 + k2; return {
  prompt: `A detector sees two spectral lines. Line 1 has the shape ${n(c1)} ÷ (x² + ${n(a1 * a1)}) and line 2 has the shape H a² ÷ (x² + a²) with height H = ${n(H2)} at x = 0 and a = ${n(a2)}. The signal is the sum of the two lines. Each area from −∞ to ∞ is a whole number times π. Enter k₁ with (area under line 1) = k₁π, then the whole number k with (area under the whole signal) = kπ.`,
  answer: [k1, tot],
  hints: ['Close the real line with a large semicircle in the upper half-plane; the integrand shrinks like 1 ÷ |z|², so the arc adds nothing. For c ÷ (x² + a²) with a > 0 the only pole above the real line is ai, with residue c ÷ (2ai), so the area is 2πi × c ÷ (2ai) = (c ÷ a)π.', 'Find the area under each line separately and add them: the area under a sum is the sum of the areas.'],
  solution: `Line 2 is H a² ÷ (x² + a²) = ${n(H2)} × ${n(a2 * a2)} ÷ (x² + ${n(a2 * a2)}) = ${n(c2)} ÷ (x² + ${n(a2 * a2)}). For c ÷ (x² + a²), the only pole above the real line is z = ai, with residue c ÷ (2ai), and the area is 2πi × c ÷ (2ai) = (c ÷ a)π. Line 1: c = ${n(c1)} and a = ${n(a1)}, so its area is ${kp(c1)} ÷ ${n(a1)} = ${kp(k1)}. Line 2: c = ${n(c2)} and a = ${n(a2)}, so its area is ${kp(c2)} ÷ ${n(a2)} = ${kp(k2)}. The whole signal has area (${n(k1)} + ${n(k2)})π = ${kp(tot)}.`,
  guidance: [
   { prompt: `Line 2 is H a² ÷ (x² + a²) with H = ${n(H2)} and a = ${n(a2)}. What is the constant on top, H a²?`, answer: [c2], explanation: `${n(H2)} × ${n(a2)}² = ${n(H2)} × ${n(a2 * a2)} = ${n(c2)}.` },
   { prompt: `For c ÷ (x² + a²) the area is (c ÷ a)π. With c = ${n(c2)} and a = ${n(a2)}, what is k₂, the area under line 2 divided by π?`, answer: [k2], explanation: `${n(c2)} ÷ ${n(a2)} = ${n(k2)}.` },
   { prompt: `Line 1 has area k₁π, which you found with the same rule, and line 2 has area k₂π. What is k, the area under the whole signal divided by π?`, answer: [tot], explanation: `Line 1 gives ${n(k1)} and line 2 gives ${n(k2)}, so k = ${n(tot)}.` }
  ] }; }
});

mk({
 id: 'q38d', parent: 'q38', kind: 'challenge', uses: 'q36', title: 'Sharper line shapes',
 brief: 'A sharper spectral line has a squared bottom, so each real integral hides a double pole above the real line.',
 labels: ['k₁', 'k₂'], tolerance: 0.01,
 gl: [['order of the pole'], ['Im of the residue of I₁'], ['Im of the residue of I₂']]
}, {
 /* I₁ = ∫ 2a³J₁ dx ÷ (x² + a²)² = J₁π; I₂ = ∫ 2aJ₂ x² dx ÷ (x² + a²)² = J₂π. Double pole ai above the real line. */
 canonical: { a: 2, J1: 3, J2: 2 },
 draw: R => ({ a: R.int(1, 4), J1: R.int(1, 3), J2: R.int(1, 3) }),
 build: ({ a, J1, J2 }) => { const c1 = 2 * a * a * a * J1, c2 = 2 * a * J2, ai = imag(a), im1 = -J1 / 2, im2 = -J2 / 2; return {
  prompt: `A sharper spectral line has a squared bottom. The control room needs I₁ = ∫ ${n(c1)} dx ÷ (x² + ${n(a * a)})² and I₂ = ∫ ${n(c2)}x² dx ÷ (x² + ${n(a * a)})², both from −∞ to ∞. Both integrands shrink like 1 ÷ |z|² or faster, so the large semicircle in the upper half-plane adds nothing in the limit. Each integral is a whole number times π. Enter k₁ with I₁ = k₁π, then k₂ with I₂ = k₂π.`,
  answer: [J1, J2],
  hints: ['The integral is 2πi times the sum of the residues above the real line. Since x² + a² = (x − ai)(x + ai), the bottom (x² + a²)² has a pole of order 2 at ai, the only pole above the real line.', 'Write the integrand as g(z) ÷ (z − ai)² with g(z) = top ÷ (z + ai)². The residue at the pole of order 2 is g′(ai). Remember 1 ÷ i = −i.'],
  solution: `The only pole above the real line is z = ${ai}, of order 2. For I₁, g(z) = ${n(c1)} ÷ (z + ${ai})² and g′(z) = −${n(2 * c1)} ÷ (z + ${ai})³, so g′(${ai}) = −${n(2 * c1)} ÷ (${n(2 * a)}i)³ = ${n(c1)} ÷ (${n(4 * a * a * a)}i), since i³ = −i. Then I₁ = 2πi × ${n(c1)} ÷ (${n(4 * a * a * a)}i) = ${kp(c1)} ÷ ${n(2 * a * a * a)} = ${kp(J1)}. For I₂, g(z) = ${n(c2)}z² ÷ (z + ${ai})², and g′(${ai}) = −${n(c2)}i ÷ ${n(4 * a)}. Then I₂ = 2πi × (−${n(c2)}i ÷ ${n(4 * a)}) = ${kp(c2)} ÷ ${n(2 * a)} = ${kp(J2)}.`,
  guidance: [
   { prompt: `The bottom (x² + ${n(a * a)})² = (x − ${ai})²(x + ${ai})². What is the order of the pole at z = ${ai}?`, answer: [2], explanation: `The factor (z − ${ai}) appears squared, so the pole has order 2.` },
   { prompt: `The residue of I₁'s integrand at z = ${ai} is ${n(c1)} ÷ (${n(4 * a * a * a)}i). Since 1 ÷ i = −i, what is its imaginary part?`, answer: [im1], explanation: `${n(c1)} ÷ (${n(4 * a * a * a)}i) = −(${n(c1)} ÷ ${n(4 * a * a * a)})i, with imaginary part ${n(im1)}. Multiplying by 2πi gives 2π × ${n(-im1)} = ${kp(J1)}.` },
   { prompt: `The residue of I₂'s integrand at z = ${ai} is −${n(c2)}i ÷ ${n(4 * a)}. What is its imaginary part?`, answer: [im2], explanation: `The imaginary part is −${n(c2)} ÷ ${n(4 * a)} = ${n(im2)}. Multiplying the residue by 2πi gives 2π × ${n(-im2)} = ${kp(J2)}.` }
  ] }; }
});

/* ---- q39 Trigonometric integrals [10.3] ---- */

mk({
 id: 'q39b', parent: 'q39', kind: 'setting', title: 'The tilt sensor over one turn',
 brief: 'A tilt sensor on the rotor follows a sine instead of a cosine, and the engineer wants its total over one full turn.',
 labels: ['√(a² − b²)', 'k'], tolerance: 0.01,
 gl: [['√(a² − b²)'], ['roots inside'], ['k']]
}, {
 /* I = ∫ c dθ ÷ (a + b sin θ) over 0 to 2π = 2πc ÷ s, s = √(a² − b²) from TRIPLES, c = ks ÷ 2 whole. t is only an index into TRIPLES; neg = 1 makes b negative.
    Shifting θ by a quarter turn turns sin into cos over a full period. */
 canonical: { t: 4, neg: 0, k: 2 },
 draw: R => tries(() => ({ t: R.int(0, TRIPLES.length - 1), neg: R.int(0, 1), k: R.int(1, 6) }), v => (v.k * TRIPLES[v.t][2]) % 2 === 0, { t: 4, neg: 0, k: 2 }),
 build: ({ t, neg, k }) => { const [a, b0, s] = TRIPLES[t], b = neg ? -b0 : b0, c = k * s / 2, sg = b < 0 ? '−' : '+',
  den = `${n(a)} ${sg} ${n(b0)} sin θ`, denC = `${n(a)} ${sg} ${n(b0)} cos φ`, quad = poly([[b, 2], [2 * a, 1], [b, 0]]); return {
  prompt: `A tilt sensor on the rotor reads c ÷ (${n(a)} ${sg} ${n(b0)} sin θ) at angle θ, with c = ${n(c)} and θ in radians. Its total over one full turn is I = ∫ from 0 to 2π of ${n(c)} dθ ÷ (${den}). Enter √(${n(a)}² − ${n(b0)}²), then the whole number k with I = kπ.`,
  answer: [s, k],
  hints: ['Over a full turn, shifting the angle by a quarter turn does not change the integral, and sin θ = cos(θ − π ÷ 2). So the integral is the same as the one with cos in place of sin.', 'Then put z = e^(iφ): cos φ = (z + 1 ÷ z) ÷ 2 and dφ = dz ÷ (iz). The new bottom is a quadratic whose two roots multiply to 1, so exactly one root is inside the unit circle. Find the residue there and multiply by 2πi.'],
  solution: `Over one full turn a shift of the angle by a quarter turn changes nothing, and sin θ = cos(θ − π ÷ 2), so I = ∫ from 0 to 2π of ${n(c)} dφ ÷ (${denC}). Put z = e^(iφ), so cos φ = (z + 1 ÷ z) ÷ 2 and dφ = dz ÷ (iz). Then ${denC} = (${quad}) ÷ (2z), and I = ∮ ${n(2 * c)} dz ÷ (i(${quad})) round |z| = 1. The roots of ${quad} are z = (−${n(a)} ± s) ÷ ${par(b)} with s = √(${n(a)}² − ${n(b0)}²) = √${n(s * s)} = ${n(s)}. They multiply to 1, so exactly one is inside the circle: z₀ = (${n(s)} − ${n(a)}) ÷ ${par(b)}. The derivative of the bottom there is i(${n(2 * b)}z₀ + ${n(2 * a)}) = ${n(2 * s)}i, so the residue is ${n(2 * c)} ÷ (${n(2 * s)}i), and I = 2πi × ${n(2 * c)} ÷ (${n(2 * s)}i) = ${n(2 * c)}π ÷ ${n(s)} = ${kp(k)}.`,
  guidance: [
   { prompt: `What is √(${n(a)}² − ${n(b0)}²)?`, answer: [s], explanation: `${n(a * a)} − ${n(b0 * b0)} = ${n(s * s)}, and √${n(s * s)} = ${n(s)}.` },
   { prompt: `After the quarter-turn shift and z = e^(iφ), the bottom is ${quad}, whose two roots multiply to 1. How many of them lie inside |z| = 1?`, answer: [1], explanation: `Two roots whose product is 1 and that are not on the circle: one has modulus less than 1 and the other more than 1. So one root is inside.` },
   { prompt: `The residue at the root inside is ${n(2 * c)} ÷ (${n(2 * s)}i). Multiply it by 2πi: what is k with I = kπ?`, answer: [k], explanation: `2πi × ${n(2 * c)} ÷ (${n(2 * s)}i) = ${n(2 * c)}π ÷ ${n(s)} = ${kp(k)}.` }
  ] }; }
});

mk({
 id: 'q39c', parent: 'q39', kind: 'applied', title: 'Mean strain over one turn',
 brief: 'A strain gauge on the rotor reads a changing value, and the engineer wants both its total over a turn and its mean reading.',
 labels: ['k', 'mean reading'], tolerance: 0.01,
 gl: [['√(a² − b²)'], ['k'], ['mean reading']]
}, {
 /* P(θ) = c ÷ (a + b cos θ); I = 2πc ÷ s = kπ with c = ks ÷ 2; mean = I ÷ 2π = k ÷ 2. */
 canonical: { t: 6, neg: 0, k: 2 },
 draw: R => tries(() => ({ t: R.int(0, TRIPLES.length - 1), neg: R.int(0, 1), k: R.int(1, 7) }), v => (v.k * TRIPLES[v.t][2]) % 2 === 0, { t: 6, neg: 0, k: 2 }),
 build: ({ t, neg, k }) => { const [a, b0, s] = TRIPLES[t], b = neg ? -b0 : b0, c = k * s / 2, den = `${n(a)} ${b < 0 ? '−' : '+'} ${n(b0)} cos θ`, quad = poly([[b, 2], [2 * a, 1], [b, 0]]), mean = k / 2; return {
  prompt: `A strain gauge on the rotor reads P(θ) = ${n(c)} ÷ (${den}) at angle θ, in radians. The total over one full turn is I = ∫ from 0 to 2π of P(θ) dθ, and the mean reading over the turn is I ÷ (2π). Enter the whole number k with I = kπ, then the mean reading as a decimal if it is not whole.`,
  answer: [k, mean],
  hints: ['Put z = e^(iθ). Then θ from 0 to 2π takes z once anticlockwise round |z| = 1, cos θ = (z + 1 ÷ z) ÷ 2 and dθ = dz ÷ (iz). The new bottom is a quadratic in z whose two roots multiply to 1, so exactly one root lies inside the unit circle.', 'Find the residue at that root and multiply by 2πi to get I. The mean reading is I divided by 2π, so if I = kπ it is k ÷ 2.'],
  solution: `Put z = e^(iθ), so cos θ = (z + 1 ÷ z) ÷ 2 and dθ = dz ÷ (iz). Then ${den} = (${quad}) ÷ (2z), and I = ∮ ${n(2 * c)} dz ÷ (i(${quad})) round |z| = 1. The roots of ${quad} are z = (−${n(a)} ± s) ÷ ${par(b)} with s = √(${n(a)}² − ${n(b0)}²) = ${n(s)}. They multiply to 1, so exactly one is inside the circle. The derivative of the bottom there is ${n(2 * s)}i, so the residue is ${n(2 * c)} ÷ (${n(2 * s)}i), and I = 2πi × ${n(2 * c)} ÷ (${n(2 * s)}i) = ${n(2 * c)}π ÷ ${n(s)} = ${kp(k)}. The mean reading is ${kp(k)} ÷ (2π) = ${n(mean)}.`,
  guidance: [
   { prompt: `What is √(${n(a)}² − ${n(b0)}²)?`, answer: [s], explanation: `${n(a * a)} − ${n(b0 * b0)} = ${n(s * s)}, and √${n(s * s)} = ${n(s)}.` },
   { prompt: `After z = e^(iθ) the residue at the root inside is ${n(2 * c)} ÷ (${n(2 * s)}i). Multiply it by 2πi: what is k with I = kπ?`, answer: [k], explanation: `2πi × ${n(2 * c)} ÷ (${n(2 * s)}i) = ${n(2 * c)}π ÷ ${n(s)} = ${kp(k)}.` },
   { prompt: `The mean reading is I ÷ (2π). With I = ${kp(k)}, what is the mean?`, answer: [mean], explanation: `${kp(k)} ÷ (2π) = ${n(mean)}.` }
  ] }; }
});

mk({
 id: 'q39d', parent: 'q39', kind: 'challenge', title: 'Offset sensor, bigger numbers',
 brief: 'A rotor sensor has a much larger offset, so the root inside the unit circle sits very close to the centre.',
 labels: ['√(a² − b²)', 'modulus of the root inside', 'k'], tolerance: 0.005,
 gl: [['√(a² − b²)'], ['modulus of the root inside'], ['k']]
}, {
 /* a² − b² = s² from BIG, c = ks ÷ 2 whole. Roots of bz² + 2az + b are (−a ± s) ÷ b; the one inside has modulus (a − s) ÷ |b|, given to 2 decimal places.
    t is only an index into BIG; neg = 1 makes b negative. */
 canonical: { t: 4, neg: 0, k: 3 },
 draw: R => tries(() => ({ t: R.int(0, BIG.length - 1), neg: R.int(0, 1), k: R.int(1, 6) }),
  v => { const [a, b, s] = BIG[v.t], m = (a - s) / b * 1000, tie = Math.abs(m - Math.round(m)) < 1e-6 && Math.round(m) % 10 === 5; return (v.k * s) % 2 === 0 && !tie; },
  { t: 4, neg: 0, k: 3 }),
 build: ({ t, neg, k }) => { const [a, b0, s] = BIG[t], b = neg ? -b0 : b0, c = k * s / 2, den = `${n(a)} ${b < 0 ? '−' : '+'} ${n(b0)} cos θ`, quad = poly([[b, 2], [2 * a, 1], [b, 0]]),
  mx = (a - s) / b0, m2 = r2(mx); return {
  prompt: `A rotor sensor with a large offset gives I = ∫ from 0 to 2π of ${n(c)} dθ ÷ (${den}), with θ in radians. After z = e^(iθ), the bottom of the new integrand is a multiple of ${quad}, whose two roots multiply to 1. Enter √(${n(a)}² − ${n(b0)}²), then the modulus of the root that lies inside the unit circle (to 2 decimal places), then the whole number k with I = kπ.`,
  answer: [s, m2, k],
  hints: ['The roots of bz² + 2az + b are z = (−a ± s) ÷ b with s = √(a² − b²). The one inside the unit circle is the one with the smaller modulus, and its modulus is the smaller of |−a + s| ÷ |b| and |−a − s| ÷ |b|.', 'With z = e^(iθ), cos θ = (z + 1 ÷ z) ÷ 2 and dθ = dz ÷ (iz). The residue at the root inside, times 2πi, gives I; the root itself cancels out of the result.'],
  solution: `Put z = e^(iθ), so ${den} = (${quad}) ÷ (2z) and I = ∮ ${n(2 * c)} dz ÷ (i(${quad})) round |z| = 1. Here s = √(${n(a)}² − ${n(b0)}²) = √${n(s * s)} = ${n(s)}. The roots are z = (−${n(a)} ± ${n(s)}) ÷ ${par(b)}, with moduli ${n(a - s)} ÷ ${n(b0)} and ${n(a + s)} ÷ ${n(b0)}. The first is the smaller, ${n(a - s)} ÷ ${n(b0)} = ${n(m2)} to 2 decimal places, so that root is inside the circle. The derivative of the bottom at it is ${n(2 * s)}i, so the residue is ${n(2 * c)} ÷ (${n(2 * s)}i), and I = 2πi × ${n(2 * c)} ÷ (${n(2 * s)}i) = ${n(2 * c)}π ÷ ${n(s)} = ${kp(k)}.`,
  guidance: [
   { prompt: `What is √(${n(a)}² − ${n(b0)}²)?`, answer: [s], explanation: `${n(a * a)} − ${n(b0 * b0)} = ${n(s * s)}, and √${n(s * s)} = ${n(s)}.` },
   { prompt: `The roots are (−${n(a)} + ${n(s)}) ÷ ${par(b)} and (−${n(a)} − ${n(s)}) ÷ ${par(b)}. What is the modulus of the one inside the unit circle, to 2 decimal places?`, answer: [m2], explanation: `The moduli are ${n(a - s)} ÷ ${n(b0)} and ${n(a + s)} ÷ ${n(b0)}, and the smaller one is ${n(a - s)} ÷ ${n(b0)} = ${n(m2)} to 2 decimal places.` },
   { prompt: `The residue at the root inside is ${n(2 * c)} ÷ (${n(2 * s)}i). Multiply it by 2πi: what is k with I = kπ?`, answer: [k], explanation: `2πi × ${n(2 * c)} ÷ (${n(2 * s)}i) = ${n(2 * c)}π ÷ ${n(s)} = ${kp(k)}.` }
  ] }; }
});

/* ---- q40 Realm review and bridge to Waves [12.1] ---- */

mk({
 id: 'q40b', parent: 'q40', kind: 'setting', title: 'Delay line on an offset loop',
 brief: 'A delay-line filter is checked on a loop that is not centred on the origin, counting its zeros and poles inside.',
 labels: ['zeros inside Z', 'poles inside P', 'k'], tolerance: 0.01,
 gl: [['zeros inside Z'], ['poles inside P'], ['k']]
}, {
 /* f = (z − x₁)^m₁ (z − x₂)^m₂ (z − x₃)^m₃ ÷ (z − w)^n, four distinct real points, circle |z − c| = r with real centre c, a point is inside when |x − c| < r.
    At least one point inside and one outside. ∮ f′ ÷ f dz = 2πi(Z − P) = kπi. */
 canonical: { x1: 1, m1: 2, x2: -2, m2: 1, x3: 4, m3: 1, w: 3, n: 2, c: 2, r: 3 },
 draw: R => tries(() => ({ x1: R.int(-6, 6), m1: R.int(1, 3), x2: R.int(-6, 6), m2: R.int(1, 3), x3: R.int(-6, 6), m3: R.int(1, 2), w: R.int(-6, 6), n: R.int(1, 3), c: R.int(-4, 4), r: R.int(1, 6) }),
  p => { const X = [p.x1, p.x2, p.x3, p.w], D = X.map(x => Math.abs(x - p.c)), N = D.filter(v => v < p.r).length;
   return new Set(X).size === 4 && D.every(v => v !== p.r) && N >= 1 && N <= 3; },
  { x1: 1, m1: 2, x2: -2, m2: 1, x3: 4, m3: 1, w: 3, n: 2, c: 2, r: 3 }),
 build: ({ x1, m1, x2, m2, x3, m3, w, n: nn, c, r }) => { const Zs = [[x1, m1], [x2, m2], [x3, m3]], dist = x => Math.abs(x - c),
  Z = Zs.filter(([x]) => dist(x) < r).reduce((s, [, m]) => s + m, 0), P = dist(w) < r ? nn : 0, k = 2 * (Z - P),
  say = ([x, m]) => `${n(x)} (power ${n(m)}, distance ${n(dist(x))} from the centre, ${dist(x) < r ? 'inside' : 'outside'})`; return {
  prompt: `A delay-line filter has f(z) = ${Zs.map(([x, m]) => rp(x, m)).join('')} ÷ ${rp(w, nn)}. The control room checks it on the circle ${circ(c, r)}, with centre ${n(c)} and radius ${n(r)}, traced once anticlockwise. A point is inside when its distance from the centre is less than the radius, and each zero and each pole counts as many times as the power of its factor. Enter the number Z of zeros of f inside the circle, then the number P of poles inside, then the number k with ∮ f′(z) ÷ f(z) dz = kπi.`,
  answer: [Z, P, k],
  hints: ['A point x is inside the circle |z − c| = r when |x − c| is less than r. A factor (z − a) raised to the power m counts m times.', 'The argument principle: (1 ÷ 2πi) ∮ f′(z) ÷ f(z) dz = Z − P, so ∮ f′ ÷ f dz = 2πi(Z − P), which is kπi with k = 2(Z − P).'],
  solution: `The zeros are at ${say(Zs[0])}, ${say(Zs[1])} and ${say(Zs[2])}, so Z = ${n(Z)}. The pole is at ${say([w, nn])}, so P = ${n(P)}. By the argument principle, ∮ f′(z) ÷ f(z) dz = 2πi(Z − P) = 2πi × ${par(Z - P)} = ${kpi(k)}, so k = ${n(k)}.`,
  guidance: [
   { prompt: `Which of the zeros ${n(x1)}, ${n(x2)} and ${n(x3)} are inside the circle ${circ(c, r)}? Add up their powers: what is Z?`, answer: [Z], explanation: `The distances from ${n(c)} are ${n(dist(x1))}, ${n(dist(x2))} and ${n(dist(x3))}, and the radius is ${n(r)}, so Z = ${n(Z)}.` },
   { prompt: `Is the pole ${n(w)} inside the circle? Count it as many times as its power: what is P?`, answer: [P], explanation: `The distance from ${n(c)} to ${n(w)} is ${n(dist(w))}, and the radius is ${n(r)}, so P = ${n(P)}.` },
   { prompt: `By the argument principle, ∮ f′(z) ÷ f(z) dz = 2πi(Z − P) = kπi. What is k?`, answer: [k], explanation: `k = 2 × (${n(Z)} − ${n(P)}) = ${n(k)}.` }
  ] }; }
});

mk({
 id: 'q40c', parent: 'q40', kind: 'applied', title: 'Two units in a chain',
 brief: 'Two units are chained in the signal path, and the engineer needs the winding number of each one and of the whole chain.',
 labels: ['winding number of H', 'winding number of FH'], tolerance: 0.01,
 gl: [['winding number of F'], ['winding number of H'], ['winding number of FH']]
}, {
 /* F = (z − z₁)^m₁ ÷ (z − w₁)^n₁, H = (z − z₂)^m₂ ÷ (z − w₂)^n₂; four distinct points with whole moduli, none on |z| = R.
    Winding number of an image curve is Z − P; for the product the turns add. Not both of F and H zero, and the chain is not zero. */
 canonical: { z1x: 1, z1y: 0, m1: 2, w1x: 0, w1y: 4, n1: 1, z2x: -2, z2y: 0, m2: 1, w2x: 5, w2y: 0, n2: 2, R: 3 },
 draw: Rr => tries(() => { const P = [0, 1, 2, 3].map(() => Rr.pick(POINTS)); return { z1x: P[0][0], z1y: P[0][1], m1: Rr.int(1, 3), w1x: P[1][0], w1y: P[1][1], n1: Rr.int(1, 3), z2x: P[2][0], z2y: P[2][1], m2: Rr.int(1, 3), w2x: P[3][0], w2y: P[3][1], n2: Rr.int(1, 3), R: Rr.int(2, 6) }; },
  p => { const P = [[p.z1x, p.z1y], [p.w1x, p.w1y], [p.z2x, p.z2y], [p.w2x, p.w2y]], M = P.map(mod);
   for (let i = 0; i < 4; i++) for (let j = i + 1; j < 4; j++) if (same(P[i], P[j])) return false;
   const wF = (M[0] < p.R ? p.m1 : 0) - (M[1] < p.R ? p.n1 : 0), wH = (M[2] < p.R ? p.m2 : 0) - (M[3] < p.R ? p.n2 : 0);
   return M.every(v => v !== p.R) && wH !== 0 && wF !== 0 && wF + wH !== 0; },
  { z1x: 1, z1y: 0, m1: 2, w1x: 0, w1y: 4, n1: 1, z2x: -2, z2y: 0, m2: 1, w2x: 5, w2y: 0, n2: 2, R: 3 }),
 build: ({ z1x, z1y, m1, w1x, w1y, n1, z2x, z2y, m2, w2x, w2y, n2, R }) => { const z1 = [z1x, z1y], w1 = [w1x, w1y], z2 = [z2x, z2y], w2 = [w2x, w2y],
  ins = p => mod(p) < R, ZF = ins(z1) ? m1 : 0, PF = ins(w1) ? n1 : 0, ZH = ins(z2) ? m2 : 0, PH = ins(w2) ? n2 : 0, WF = ZF - PF, WH = ZH - PH, W = WF + WH,
  say = (p, k) => `${cx(p)} (power ${n(k)}, modulus ${n(mod(p))}, ${ins(p) ? 'inside' : 'outside'})`; return {
  prompt: `Two units sit in a signal chain. Unit F has response F(z) = ${pw(z1, m1)} ÷ ${pw(w1, n1)} and unit H has response H(z) = ${pw(z2, m2)} ÷ ${pw(w2, n2)}, so the chain has response F(z)H(z). Take z once anticlockwise round |z| = ${n(R)}. A point is inside when its modulus is less than ${n(R)}, and each zero and pole counts as many times as the power of its factor. The winding number of an image curve round 0 is the zeros inside minus the poles inside, and the image curve of the chain turns round 0 as often as the two units' curves together, because the turns of a product add. Enter the winding number round 0 of the image curve of H(z), then of the image curve of F(z)H(z).`,
  answer: [WH, W],
  hints: ['A point is inside |z| = R when its modulus is less than R. For one unit, the winding number round 0 is (zeros inside) − (poles inside), each counted as many times as the power of its factor.', 'The turns of a product add: the winding number of F(z)H(z) is the winding number of F plus that of H.'],
  solution: `Unit F has a zero at ${say(z1, m1)} and a pole at ${say(w1, n1)}, so its winding number is ${n(ZF)} − ${n(PF)} = ${n(WF)}. Unit H has a zero at ${say(z2, m2)} and a pole at ${say(w2, n2)}, so its winding number is ${n(ZH)} − ${n(PH)} = ${n(WH)}. The turns of a product add, so the chain F(z)H(z) has winding number ${n(WF)} + ${par(WH)} = ${n(W)}.`,
  guidance: [
   { prompt: `For unit F, the zero is ${cx(z1)} (power ${n(m1)}) and the pole is ${cx(w1)} (power ${n(n1)}). Counting only those with modulus less than ${n(R)}, what is the winding number of F round 0?`, answer: [WF], explanation: `The moduli are ${n(mod(z1))} and ${n(mod(w1))}, so zeros inside minus poles inside is ${n(ZF)} − ${n(PF)} = ${n(WF)}.` },
   { prompt: `For unit H, the zero is ${cx(z2)} (power ${n(m2)}) and the pole is ${cx(w2)} (power ${n(n2)}). What is the winding number of H round 0?`, answer: [WH], explanation: `The moduli are ${n(mod(z2))} and ${n(mod(w2))}, so zeros inside minus poles inside is ${n(ZH)} − ${n(PH)} = ${n(WH)}.` },
   { prompt: `The turns of a product add. What is the winding number of F(z)H(z) round 0?`, answer: [W], explanation: `${n(WF)} + ${par(WH)} = ${n(W)}.` }
  ] }; }
});

mk({
 id: 'q40d', parent: 'q40', kind: 'challenge', uses: 'q03', title: 'The clockwise check',
 brief: 'A last filter has points that are not on the axes and a loop traced clockwise, so the moduli and the direction both matter.',
 labels: ['zeros inside Z', 'poles inside P', 'winding number'], tolerance: 0.01,
 gl: [['zeros inside Z'], ['poles inside P'], ['winding number']]
}, {
 /* f = (z − z₁)^m₁ (z − z₂)^m₂ ÷ ((z − w₁)^n₁ (z − w₂)^n₂), points x + yi with x, y non-zero, powers 1 to 4. A point is inside |z| = R when x² + y² < R²; never equal.
    Traced clockwise: the image curve's winding number is −(Z − P) = P − Z. Z ≠ P, at least one point inside and one outside. */
 canonical: { z1: 1, z1y: 2, m1: 2, z2: -3, z2y: 3, m2: 1, w1: 2, w1y: -1, n1: 3, w2: -4, w2y: 2, n2: 1, R: 4 },
 draw: Rr => tries(() => { const P = [0, 1, 2, 3].map(() => Rr.pick(SKEW)); return { z1: P[0][0], z1y: P[0][1], m1: Rr.int(1, 4), z2: P[1][0], z2y: P[1][1], m2: Rr.int(1, 3), w1: P[2][0], w1y: P[2][1], n1: Rr.int(1, 4), w2: P[3][0], w2y: P[3][1], n2: Rr.int(1, 3), R: Rr.int(2, 7) }; },
  p => { const P = [[p.z1, p.z1y], [p.z2, p.z2y], [p.w1, p.w1y], [p.w2, p.w2y]], Q = P.map(([x, y]) => x * x + y * y), ok = Q.map(v => v < p.R * p.R);
   for (let i = 0; i < 4; i++) for (let j = i + 1; j < 4; j++) if (same(P[i], P[j])) return false;
   const Z = (ok[0] ? p.m1 : 0) + (ok[1] ? p.m2 : 0), PP = (ok[2] ? p.n1 : 0) + (ok[3] ? p.n2 : 0), cnt = ok.filter(Boolean).length;
   return Q.every(v => v !== p.R * p.R) && cnt >= 1 && cnt <= 3 && Z !== PP; },
  { z1: 1, z1y: 2, m1: 2, z2: -3, z2y: 3, m2: 1, w1: 2, w1y: -1, n1: 3, w2: -4, w2y: 2, n2: 1, R: 4 }),
 build: ({ z1, z1y, m1, z2, z2y, m2, w1, w1y, n1, w2, w2y, n2, R }) => { const Zs = [[[z1, z1y], m1], [[z2, z2y], m2]], Ps = [[[w1, w1y], n1], [[w2, w2y], n2]],
  sq = p => p[0] * p[0] + p[1] * p[1], ins = p => sq(p) < R * R, count = list => list.filter(([p]) => ins(p)).reduce((s, [, k]) => s + k, 0),
  Z = count(Zs), P = count(Ps), W = P - Z,
  say = ([p, k]) => `${cx(p)} (power ${n(k)}, ${n(Math.abs(p[0]))}² + ${n(Math.abs(p[1]))}² = ${n(sq(p))}, ${ins(p) ? 'inside' : 'outside'})`; return {
  prompt: `A last filter has f(z) = ${Zs.map(([p, k]) => pw(p, k)).join('')} ÷ (${Ps.map(([p, k]) => pw(p, k)).join('')}). It is checked on the circle |z| = ${n(R)}, traced once clockwise. A point x + yi is inside when its modulus √(x² + y²) is less than ${n(R)}. Count each zero and each pole as many times as the power of its factor. Enter the number Z of zeros of f inside the circle, then the number P of poles inside, then the winding number round 0 of the image curve f(z), counting anticlockwise turns as positive.`,
  answer: [Z, P, W],
  hints: ['A point x + yi is inside |z| = R when x² + y² is less than R², since the modulus is √(x² + y²). A factor raised to the power m counts m times.', 'Traced once anticlockwise, the winding number of f(z) round 0 is Z − P. Traced clockwise, every turn goes the other way, so the winding number changes sign.'],
  solution: `The zeros are at ${say(Zs[0])} and ${say(Zs[1])}, so Z = ${n(Z)}. The poles are at ${say(Ps[0])} and ${say(Ps[1])}, so P = ${n(P)}. Traced anticlockwise the winding number would be Z − P = ${n(Z - P)}; traced clockwise it is the opposite, ${n(W)}${W < 0 ? ', so the image curve goes round 0 clockwise' : ''}.`,
  guidance: [
   { prompt: `Which zeros of f, ${cx(Zs[0][0])} and ${cx(Zs[1][0])}, have x² + y² less than ${n(R * R)}? Add up their powers: what is Z?`, answer: [Z], explanation: `The values of x² + y² are ${n(sq(Zs[0][0]))} and ${n(sq(Zs[1][0]))}, and ${n(R)}² = ${n(R * R)}, so Z = ${n(Z)}.` },
   { prompt: `Do the same for the poles, ${cx(Ps[0][0])} and ${cx(Ps[1][0])}: what is P?`, answer: [P], explanation: `The values of x² + y² are ${n(sq(Ps[0][0]))} and ${n(sq(Ps[1][0]))}, so P = ${n(P)}.` },
   { prompt: `Traced anticlockwise the winding number is Z − P. The circle is traced clockwise, so the sign is reversed. What is the winding number?`, answer: [W], explanation: `−(Z − P) = −(${n(Z)} − ${n(P)}) = ${n(W)}.` }
  ] }; }
});

})();
