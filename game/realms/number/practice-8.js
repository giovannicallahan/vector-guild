/* Number theory: the hidden life of whole numbers practice missions, file 8 of 8: concepts q36–q40, three practice missions each
   (q36b q36c q36d q37b q37c q37d q38b q38c q38d q39b q39c q39d q40b q40c q40d).
   Format and rules: docs/PACK-FORMAT.md, "Practice missions" (§10).
     b  kind 'setting'    the same skill in a new real-world setting
     c  kind 'applied'    a word problem with two or three steps (two or three guided steps)
     d  kind 'challenge'  harder numbers, or the skill combined with one earlier concept (optional `uses: 'qNN'`)
   A practice mission supplies only: id, parent, kind, title, brief, prompt, answer, labels, tolerance, hints,
   solution, guidance (and `uses` for a challenge). Everything else comes from its parent, the learn mission:
   topic, tier, xp, sector, lesson, teaching, sources, the concept bench and the review drill. Do not write those.
   Each mission is registered together with its generator by add(mission, generator); build(canonical) must
   reproduce the authored prompt, hints, solution and guidance exactly. Oracles: qa/realms/number/oracle-p8.js. */
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


/* ---- helpers ---- */
/* A retry loop that can never run away: at most 1000 tries, then the canonical parameters. */
const tries = (gen, ok, canon) => { for (let i = 0; i < 1000; i++) { const p = gen(); if (ok(p)) return p; } return canon; };
const SUP = '⁰¹²³⁴⁵⁶⁷⁸⁹';
const sup = e => String(e).split('').map(d => SUP[d]).join('');
const mod = (a, m) => ((a % m) + m) % m;
const pow = (a, k, m) => { let r = 1, b = mod(a, m); while (k > 0) { if (k & 1) r = r * b % m; b = b * b % m; k = Math.floor(k / 2); } return r; };
const gcd = (a, b) => { while (b) [a, b] = [b, a % b]; return a; };
const isPrime = x => { if (x < 2) return false; for (let d = 2; d * d <= x; d++) if (x % d === 0) return false; return true; };
const inverse = (e, m) => { for (let d = 1; d < m; d++) if (e * d % m === 1) return d; return 0; };
/* Every division a = q × b + r of Euclid's algorithm, down to remainder 0. */
const euclid = (a, b) => { const rows = []; while (b) { const q = Math.floor(a / b), r = a % b; rows.push({ a, b, q, r }); [a, b] = [b, r]; } return rows; };
const eLine = r => `${n(r.a)} = ${n(r.q)} × ${n(r.b)} + ${n(r.r)}`;
/* Convergents p/q of [a0; a1, a2, …] by pₖ = aₖ × pₖ₋₁ + pₖ₋₂ and qₖ = aₖ × qₖ₋₁ + qₖ₋₂. */
const convs = a => { let p0 = 1, q0 = 0, p1 = a[0], q1 = 1; const out = [[p1, q1]]; for (let i = 1; i < a.length; i++) { const p2 = a[i] * p1 + p0, q2 = a[i] * q1 + q0; out.push([p2, q2]); [p0, q0, p1, q1] = [p1, q1, p2, q2]; } return out; };
const cfText = a => `[${n(a[0])}; ${a.slice(1).map(n).join(', ')}]`;
const same = (a, b) => a.length === b.length && a.every((x, i) => x === b[i]);
/* t, reduced mod m when it is m or more: "100 ≡ 9" or just "4". */
const red = (t, m) => t >= m ? `${n(t)} ≡ ${n(t % m)}` : n(t);
/* Repeated squaring of a mod m up to the exponent k, as text, with the result. */
const chain = (a, k, m) => {
 const pw = [], vals = {}; let v = mod(a, m);
 for (let e = 1; e <= k; e *= 2) { vals[e] = v; pw.push(`${n(a)}${sup(e)} ≡ ${n(v)}`); v = v * v % m; }
 const parts = []; for (let e = 1, r = k; r > 0; e *= 2, r = Math.floor(r / 2)) if (r & 1) parts.unshift(e);
 let text = `Repeated squaring mod ${n(m)}: ${pw.join(', ')}.`, r = vals[parts[0]];
 if (parts.length === 1) text += ` So ${n(a)}${sup(k)} ≡ ${n(r)}.`;
 else {
  const steps = [];
  for (const e of parts.slice(1)) { const t = r * vals[e]; steps.push(`${n(r)} × ${n(vals[e])} = ${red(t, m)}`); r = t % m; }
  text += ` ${n(k)} = ${parts.map(n).join(' + ')}, so ${n(a)}${sup(k)} ≡ ${parts.map(e => n(vals[e])).join(' × ')}: ${steps.join(', ')}.`;
 }
 return { text, r };
};
const factor = x => { const out = []; for (let d = 2; d * d <= x; d++) { let e = 0; while (x % d === 0) { x /= d; e++; } if (e) out.push([d, e]); } if (x > 1) out.push([x, 1]); return out; };
const factText = x => factor(x).map(([p, e]) => e > 1 ? `${n(p)}${sup(e)}` : n(p)).join(' × ');
const primesIn = (lo, hi) => { const out = []; for (let x = lo; x <= hi; x++) if (isPrime(x)) out.push(x); return out; };
/* The true value P/Q written as a whole number of 1/scale, rounded; null when it lands exactly on a rounding tie. */
const reading = (P, Q, scale) => { const t = 2 * P * scale + Q; return t % (2 * Q) === 0 ? null : Math.floor(t / (2 * Q)); };
/* The partial quotients a₁, a₂, … that a reading N/scale gives, and the first quotient after the ones expected. */
const readingCf = (N, scale) => euclid(scale, N).map(r => r.q);
/* The fraction [0; a₁, …, aₖ] as [P, Q]. */
const fromQuot = a => convs([0, ...a])[a.length];
/* Draws a rounded reading whose expansion is [0; a₁ … aₖ, big …] with big ≥ 100 and Q in the given range. */
const drawReading = (R, k, scale, aMax, lastMin, qLo, qHi, bad, canon) => tries(() => {
 const a = []; for (let i = 0; i < k; i++) a.push(R.int(i === k - 1 ? lastMin : 1, aMax));
 const [P, Q] = fromQuot(a), N = reading(P, Q, scale); return { a, P, Q, N };
}, p => { if (p.Q < qLo || p.Q > qHi || p.N === null || p.N % 10 === 0) return false; const c = readingCf(p.N, scale); return same(c.slice(0, k), p.a) && c[k] >= 100 && !bad(p.a); }, canon);

/* ---- q36 Convergents [R6.2] ---- */
/* Not the q36 example [3; 4, 2, 5] or its worked example [1; 2, 3, 4]. */
const isParent36 = a => same(a, [3, 4, 2, 5]) || same(a, [1, 2, 3, 4]);
const draw4 = (R, hi) => tries(() => ({ a0: R.int(1, 6), a1: R.int(1, hi), a2: R.int(1, hi), a3: R.int(2, hi) }), p => !isParent36([p.a0, p.a1, p.a2, p.a3]), { a0: 2, a1: 5, a2: 3, a3: 2 });

mk({
 id: 'q36b', parent: 'q36', kind: 'setting', title: 'The winch gear ratio',
 brief: 'The ridge winch has a gear ratio written as a continued fraction, and the engineer needs it as one ordinary fraction.',
 labels: ['numerator of C₃', 'denominator of C₃'], tolerance: 0.01,
 gl: [['p₁', 'q₁'], ['p₂', 'q₂'], ['numerator of C₃', 'denominator of C₃']]
}, {
 canonical: { a0: 2, a1: 5, a2: 3, a3: 2 },
 draw: R => draw4(R, 9),
 build: ({ a0, a1, a2, a3 }) => { const [[p0, q0], [p1, q1], [p2, q2], [p3, q3]] = convs([a0, a1, a2, a3]); return {
  prompt: `The winch on the ridge road has a gear ratio written as the continued fraction [${n(a0)}; ${n(a1)}, ${n(a2)}, ${n(a3)}]. Cutting it off early gives the convergents C₀ = [${n(a0)}], C₁ = [${n(a0)}; ${n(a1)}], C₂ = [${n(a0)}; ${n(a1)}, ${n(a2)}] and C₃, which is the whole fraction. The engineer wants the ratio as one ordinary fraction. Enter the numerator, then the denominator, of C₃ in lowest terms. Type answers of 1000 or more without commas.`,
  answer: [p3, q3],
  hints: ['Start with p₋₁ = 1, q₋₁ = 0, p₀ = a₀ and q₀ = 1, and then work along the partial quotients one at a time.', 'Each new numerator is the partial quotient times the numerator before it, plus the numerator before that: pₖ = aₖ × pₖ₋₁ + pₖ₋₂. The denominators follow the same rule. The last convergent is the whole fraction, already in lowest terms.'],
  solution: `p₀ = ${n(p0)} and q₀ = 1. Then p₁ = ${n(a1)} × ${n(p0)} + 1 = ${n(p1)} and q₁ = ${n(a1)} × 1 + 0 = ${n(q1)}. Then p₂ = ${n(a2)} × ${n(p1)} + ${n(p0)} = ${n(p2)} and q₂ = ${n(a2)} × ${n(q1)} + 1 = ${n(q2)}. Then p₃ = ${n(a3)} × ${n(p2)} + ${n(p1)} = ${n(p3)} and q₃ = ${n(a3)} × ${n(q2)} + ${n(q1)} = ${n(q3)}. So C₃ = ${n(p3)}/${n(q3)}.`,
  guidance: [
   { prompt: `With p₀ = ${n(p0)} and q₀ = 1, use a₁ = ${n(a1)} to find the numerator p₁ and denominator q₁ of C₁.`, answer: [p1, q1], explanation: `p₁ = ${n(a1)} × ${n(p0)} + 1 = ${n(p1)} and q₁ = ${n(a1)} × 1 + 0 = ${n(q1)}.` },
   { prompt: `Use a₂ = ${n(a2)} with the two convergents before it. What are p₂ and q₂?`, answer: [p2, q2], explanation: `p₂ = ${n(a2)} × ${n(p1)} + ${n(p0)} = ${n(p2)} and q₂ = ${n(a2)} × ${n(q1)} + 1 = ${n(q2)}.` },
   { prompt: `Use a₃ = ${n(a3)} with C₁ and C₂. What are the numerator and denominator of C₃?`, answer: [p3, q3], explanation: `p₃ = ${n(a3)} × ${n(p2)} + ${n(p1)} = ${n(p3)} and q₃ = ${n(a3)} × ${n(q2)} + ${n(q1)} = ${n(q3)}.` }
  ] }; }
});

/* A ratio P/Q given as a fraction (four partial quotients, the last at least 2); C₂ asked. */
mk({
 id: 'q36c', parent: 'q36', kind: 'applied', title: 'A simpler gear pair',
 brief: 'The gear-cutter cannot make the exact tooth ratio, so Mira needs a simpler pair of gears that comes close to it.',
 labels: ['numerator of C₂', 'denominator of C₂'], tolerance: 0.01,
 gl: [['a₀', 'a₁', 'a₂', 'a₃'], ['p₁', 'q₁'], ['numerator of C₂', 'denominator of C₂']]
}, {
 canonical: { a0: 2, a1: 6, a2: 4, a3: 3 },
 draw: R => draw4(R, 8),
 build: ({ a0, a1, a2, a3 }) => { const cv = convs([a0, a1, a2, a3]), [P, Q] = cv[3], [p1, q1] = cv[1], [p2, q2] = cv[2], rows = euclid(P, Q), ln = rows.map(eLine).join(', '); return {
  prompt: `The gear-cutter in the workshop can only make gears with at most a few dozen teeth, but the exact tooth ratio the winch needs is ${n(P)}/${n(Q)}. To choose a simpler gear pair, Mira writes ${n(P)} ÷ ${n(Q)} as a continued fraction [a₀; a₁, a₂, a₃] with Euclid’s algorithm, then cuts it off after a₂ to get the convergent C₂ = [a₀; a₁, a₂]. Enter the numerator, then the denominator, of C₂ in lowest terms.`,
  answer: [p2, q2],
  hints: ['Divide the numerator by the denominator: the quotient is a₀. Then divide each divisor by the remainder it left, and keep every quotient. The quotients in order are the partial quotients.', 'Build the convergents from the partial quotients with pₖ = aₖ × pₖ₋₁ + pₖ₋₂ and qₖ = aₖ × qₖ₋₁ + qₖ₋₂, starting from p₋₁ = 1, q₋₁ = 0, p₀ = a₀ and q₀ = 1. Stop at C₂: the last partial quotient is not used.'],
  solution: `Euclid’s algorithm: ${ln}. The quotients give ${n(P)}/${n(Q)} = ${cfText([a0, a1, a2, a3])}. Then p₀ = ${n(a0)} and q₀ = 1, p₁ = ${n(a1)} × ${n(a0)} + 1 = ${n(p1)} and q₁ = ${n(a1)} × 1 + 0 = ${n(q1)}, and p₂ = ${n(a2)} × ${n(p1)} + ${n(a0)} = ${n(p2)} and q₂ = ${n(a2)} × ${n(q1)} + 1 = ${n(q2)}. So C₂ = ${n(p2)}/${n(q2)}.`,
  guidance: [
   { prompt: `Run Euclid’s algorithm on ${n(P)} and ${n(Q)}, dividing each divisor by the remainder it left until a remainder is 0. What are the four quotients a₀, a₁, a₂ and a₃?`, answer: [a0, a1, a2, a3], explanation: `${ln}. The quotients are ${n(a0)}, ${n(a1)}, ${n(a2)} and ${n(a3)}.` },
   { prompt: `With p₀ = ${n(a0)} and q₀ = 1, use a₁ = ${n(a1)} to find the numerator p₁ and denominator q₁ of C₁.`, answer: [p1, q1], explanation: `p₁ = ${n(a1)} × ${n(a0)} + 1 = ${n(p1)} and q₁ = ${n(a1)} × 1 + 0 = ${n(q1)}.` },
   { prompt: `Use a₂ = ${n(a2)} with the two convergents before it. What are the numerator and denominator of C₂?`, answer: [p2, q2], explanation: `p₂ = ${n(a2)} × ${n(p1)} + ${n(a0)} = ${n(p2)} and q₂ = ${n(a2)} × ${n(q1)} + 1 = ${n(q2)}.` }
  ] }; }
});

/* Five partial quotients, the fraction written unreduced as g times P/Q, C₃ asked. Mixes in Euclid's algorithm (q06) and expansion (q35). */
mk({
 id: 'q36d', parent: 'q36', kind: 'challenge', uses: 'q35', title: 'The unreduced gear count',
 brief: 'A tooth count was logged before it was reduced, and Mira must recover the ratio and then a close convergent from it.',
 labels: ['gcd', 'numerator of C₃', 'denominator of C₃'], tolerance: 0.01,
 gl: [['gcd'], ['a₀', 'a₁', 'a₂', 'a₃'], ['numerator of C₃', 'denominator of C₃']]
}, {
 canonical: { g: 7, a0: 2, a1: 3, a2: 4, a3: 2, a4: 5 },
 draw: R => tries(() => ({ g: R.int(2, 15), a0: R.int(1, 5), a1: R.int(1, 8), a2: R.int(1, 8), a3: R.int(1, 8), a4: R.int(2, 8) }),
  p => convs([p.a0, p.a1, p.a2, p.a3, p.a4])[4][0] * p.g < 100000 && !(p.a0 === 3 && p.a1 === 4 && p.a2 === 2 && p.a3 === 5), { g: 7, a0: 2, a1: 3, a2: 4, a3: 2, a4: 5 }),
 build: ({ g, a0, a1, a2, a3, a4 }) => { const cv = convs([a0, a1, a2, a3, a4]), [P, Q] = cv[4], A = g * P, B = g * Q, rows = euclid(A, B), ln = rows.map(eLine).join(', '), [p2, q2] = cv[2], [p3, q3] = cv[3]; return {
  prompt: `The workshop log gives a gear ratio as ${n(A)}/${n(B)}, but it was written down before being reduced. Run Euclid’s algorithm on ${n(A)} and ${n(B)}: the last remainder that is not 0 is their gcd, the common factor to remove. The quotients, in order, are the partial quotients of the ratio, which has five of them. Enter the gcd, then the numerator and denominator, in lowest terms, of the convergent C₃ that stops after the fourth partial quotient a₃. Type answers of 1000 or more without commas.`,
  answer: [g, p3, q3],
  hints: ['Divide the larger number by the smaller, then each divisor by the remainder it left, keeping every quotient. The last remainder that is not 0 is the gcd, and the quotients are the partial quotients.', 'Build the convergents with pₖ = aₖ × pₖ₋₁ + pₖ₋₂ and qₖ = aₖ × qₖ₋₁ + qₖ₋₂, starting from p₋₁ = 1, q₋₁ = 0, p₀ = a₀ and q₀ = 1. Stop at C₃: the fifth partial quotient is not used.'],
  solution: `Euclid’s algorithm: ${ln}. The last remainder that is not 0 is ${n(g)}, so the gcd is ${n(g)}. The quotients give ${cfText([a0, a1, a2, a3, a4])}. Then C₀ = ${n(a0)}/1, C₁ = ${n(cv[1][0])}/${n(cv[1][1])}, C₂ = ${n(p2)}/${n(q2)} (p₂ = ${n(a2)} × ${n(cv[1][0])} + ${n(a0)}, q₂ = ${n(a2)} × ${n(cv[1][1])} + 1) and p₃ = ${n(a3)} × ${n(p2)} + ${n(cv[1][0])} = ${n(p3)}, q₃ = ${n(a3)} × ${n(q2)} + ${n(cv[1][1])} = ${n(q3)}. So C₃ = ${n(p3)}/${n(q3)}.`,
  guidance: [
   { prompt: `Run Euclid’s algorithm on ${n(A)} and ${n(B)} until a remainder is 0. What is the gcd, the last remainder that is not 0?`, answer: [g], explanation: `${ln}. The last remainder that is not 0 is ${n(g)}.` },
   { prompt: 'The quotients from the same divisions are the partial quotients. What are the first four, a₀, a₁, a₂ and a₃?', answer: [a0, a1, a2, a3], explanation: `The quotients, in order, are ${n(a0)}, ${n(a1)}, ${n(a2)}, ${n(a3)} and ${n(a4)}, so the ratio is ${cfText([a0, a1, a2, a3, a4])}.` },
   { prompt: `Build the convergents up to C₃ from ${n(a0)}, ${n(a1)}, ${n(a2)} and ${n(a3)}. What are the numerator and denominator of C₃?`, answer: [p3, q3], explanation: `C₁ = ${n(cv[1][0])}/${n(cv[1][1])}, C₂ = ${n(p2)}/${n(q2)}, and p₃ = ${n(a3)} × ${n(p2)} + ${n(cv[1][0])} = ${n(p3)}, q₃ = ${n(a3)} × ${n(q2)} + ${n(cv[1][1])} = ${n(q3)}.` }
  ] }; }
});

/* ---- q37 Recovering a fraction from a decimal [R6.4] ---- */
/* Shared: build a reading problem's Euclid text. rows = Euclid on scale and N; a = [a₁ …]. */
const readText = (N, scale, a) => { const rows = euclid(scale, N), k = a.length, big = rows[k].q, lines = rows.slice(0, k).map(eLine).join(', ');
 return { rows, big, eu: `Euclid’s algorithm: ${lines}, and then ${n(rows[k].a)} ÷ ${n(rows[k].b)} has quotient ${n(big)}`, text: `Euclid’s algorithm: ${lines}, and then ${n(rows[k].a)} ÷ ${n(rows[k].b)} has quotient ${n(big)}. So the reading is [0; ${a.map(n).join(', ')}, ${n(big)}, …]. The partial quotient ${n(big)} is huge, so cut before it: [0; ${a.map(n).join(', ')}].` }; };
const convText = (a) => { const cv = convs([0, ...a]); return `Convergents: ${cv.slice(1).map(([p, q], i) => `C${['₁', '₂', '₃', '₄'][i]} = ${n(p)}/${n(q)}`).join(', ')}.`; };
const drawMill = (R, bad, canon) => drawReading(R, 3, 1e6, 6, 2, 1, 99, a => bad(a), canon);
const bad37 = a => same(a, [2, 3, 5]);

mk({
 id: 'q37b', parent: 'q37', kind: 'setting', title: 'The tape reader step',
 brief: 'A tape reader advances the punched tape by a fixed step, and a damaged log kept only a rounded figure for that step.',
 labels: ['numerator', 'denominator'], tolerance: 0.01,
 gl: [['a₁', 'a₂', 'a₃'], ['numerator of C₃', 'denominator of C₃']]
}, {
 canonical: { a1: 3, a2: 2, a3: 4 },
 draw: R => { const d = drawMill(R, bad37, null); return d ? { a1: d.a[0], a2: d.a[1], a3: d.a[2] } : { a1: 3, a2: 2, a3: 4 }; },
 build: ({ a1, a2, a3 }) => { const a = [a1, a2, a3], [P, Q] = fromQuot(a), N = reading(P, Q, 1e6), rt = readText(N, 1e6, a); return {
  prompt: `The tape reader in the Cipher Room moves the punched tape forward by the same distance on every pulse. A damaged log shows that distance as ${n(N)} millionths of a metre: the true distance rounded to six decimal places, written as a whole number of millionths. The true distance is a fraction of a metre whose denominator is under 100. Enter the numerator, then the denominator, of that fraction in lowest terms.`,
  answer: [P, Q],
  hints: ['A reading in millionths is a fraction over 1000000. Expand it with Euclid’s algorithm, keeping every quotient; the whole-number part is 0.', 'The rounding appears as one very large quotient. Keep only the partial quotients before it, and build that convergent with pₖ = aₖ × pₖ₋₁ + pₖ₋₂ and qₖ = aₖ × qₖ₋₁ + qₖ₋₂.'],
  solution: `The reading is ${n(N)}/1000000. ${rt.text} ${convText(a)} So the distance is ${n(P)}/${n(Q)} of a metre.`,
  guidance: [
   { prompt: `Expand ${n(N)}/1000000 with Euclid’s algorithm. a₀ = 0; what are the next three partial quotients a₁, a₂ and a₃, before the huge one?`, answer: [a1, a2, a3], explanation: `${rt.eu}. The huge quotient ${n(rt.big)} is where the rounding hides.` },
   { prompt: `Build the convergent that stops before the huge quotient, [0; ${n(a1)}, ${n(a2)}, ${n(a3)}]. What are its numerator and denominator?`, answer: [P, Q], explanation: `${convText(a)} The fraction is ${n(P)}/${n(Q)}.` }
  ] }; }
});

/* The true value P/Q in whole turns per click, a number of clicks T, the whole turns made. */
mk({
 id: 'q37c', parent: 'q37', kind: 'applied', title: 'Turns of the sorting drum',
 brief: 'The sorting drum turns by a fixed part of a turn at each click, and the log only holds a rounded figure for it.',
 labels: ['numerator', 'denominator', 'whole turns'], tolerance: 0.01,
 gl: [['a₁', 'a₂', 'a₃'], ['numerator', 'denominator'], ['whole turns']]
}, {
 canonical: { a1: 4, a2: 3, a3: 2, T: 1000 },
 draw: R => { const d = drawMill(R, bad37, null); return d ? { a1: d.a[0], a2: d.a[1], a3: d.a[2], T: R.int(300, 4000) } : { a1: 4, a2: 3, a3: 2, T: 1000 }; },
 build: ({ a1, a2, a3, T }) => { const a = [a1, a2, a3], [P, Q] = fromQuot(a), N = reading(P, Q, 1e6), rt = readText(N, 1e6, a), prod = T * P, turns = Math.floor(prod / Q); return {
  prompt: `The sorting drum in the Cipher Room turns by the same part of a full turn at every click. The log shows that part as ${n(N)} millionths of a turn: the true value rounded to six decimal places, written as a whole number of millionths. The true value is a fraction whose denominator is under 100. Find that fraction, then use the exact fraction, not the rounded reading, to work out how many whole turns the drum has completed after ${n(T)} clicks. Enter the numerator, the denominator in lowest terms, then the number of whole turns. Type answers of 1000 or more without commas.`,
  answer: [P, Q, turns],
  hints: ['A reading in millionths is a fraction over 1000000. Expand it with Euclid’s algorithm and cut the continued fraction just before the one huge partial quotient, which is where the rounding hides. Build that convergent with pₖ = aₖ × pₖ₋₁ + pₖ₋₂ and qₖ = aₖ × qₖ₋₁ + qₖ₋₂.', 'After a number of clicks, the turns made are that number times the fraction. Multiply by the numerator, divide by the denominator, and keep only the whole part: the quotient, ignoring the remainder.'],
  solution: `The reading is ${n(N)}/1000000. ${rt.text} ${convText(a)} So the drum turns ${n(P)}/${n(Q)} of a turn per click. After ${n(T)} clicks it has turned ${n(T)} × ${n(P)} ÷ ${n(Q)} = ${n(prod)} ÷ ${n(Q)} turns, and ${n(prod)} = ${n(turns)} × ${n(Q)} + ${n(prod % Q)}, so it has completed ${n(turns)} whole turns.`,
  guidance: [
   { prompt: `Expand ${n(N)}/1000000 with Euclid’s algorithm. a₀ = 0; what are the next three partial quotients a₁, a₂ and a₃, before the huge one?`, answer: [a1, a2, a3], explanation: `${rt.eu}. The huge quotient ${n(rt.big)} is where the rounding hides.` },
   { prompt: `Cut before the huge quotient. What are the numerator and denominator of [0; ${n(a1)}, ${n(a2)}, ${n(a3)}]?`, answer: [P, Q], explanation: `${convText(a)} The fraction is ${n(P)}/${n(Q)}.` },
   { prompt: `Each click is ${n(P)}/${n(Q)} of a turn. How many whole turns after ${n(T)} clicks?`, answer: [turns], explanation: `${n(T)} × ${n(P)} = ${n(prod)}, and ${n(prod)} ÷ ${n(Q)} has quotient ${n(turns)} and remainder ${n(prod % Q)}, so ${n(turns)} whole turns.` }
  ] }; }
});

/* Harder: the reading is in billionths, four partial quotients before the huge one, denominator from 100 to 999. */
mk({
 id: 'q37d', parent: 'q37', kind: 'challenge', title: 'The fine-pitch worm gear',
 brief: 'A fine-pitch gear logged its step to nine decimal places, and Mira needs the exact fraction from it.',
 labels: ['numerator', 'denominator'], tolerance: 0.01,
 gl: [['a₁', 'a₂', 'a₃', 'a₄'], ['numerator of C₃', 'denominator of C₃'], ['numerator', 'denominator']]
}, {
 canonical: { a1: 2, a2: 3, a3: 4, a4: 2 },
 draw: R => { const d = drawReading(R, 4, 1e9, 6, 2, 100, 999, () => false, null); return d ? { a1: d.a[0], a2: d.a[1], a3: d.a[2], a4: d.a[3] } : { a1: 2, a2: 3, a3: 4, a4: 2 }; },
 build: ({ a1, a2, a3, a4 }) => { const a = [a1, a2, a3, a4], cv = convs([0, ...a]), [P, Q] = cv[4], [p3, q3] = cv[3], N = reading(P, Q, 1e9), rt = readText(N, 1e9, a); return {
  prompt: `The worm gear in the Cipher Room advances by the same part of a turn at every pulse. A log shows that part as ${n(N)} billionths of a turn: the true value rounded to nine decimal places, written as a whole number of billionths. The true value is a fraction whose denominator is under 1000. Enter its numerator, then its denominator, in lowest terms.`,
  answer: [P, Q],
  hints: ['A reading in billionths is a fraction over 1000000000. Expand it with Euclid’s algorithm, keeping every quotient; the whole-number part is 0, so a₀ = 0.', 'The rounding shows up as one very large partial quotient, so there may be more partial quotients before it than in a six-place reading. Cut just before it, and build that convergent with pₖ = aₖ × pₖ₋₁ + pₖ₋₂ and qₖ = aₖ × qₖ₋₁ + qₖ₋₂.'],
  solution: `The reading is ${n(N)}/1000000000. ${rt.text} ${convText(a)} So the fraction is ${n(P)}/${n(Q)}.`,
  guidance: [
   { prompt: `Expand ${n(N)}/1000000000 with Euclid’s algorithm. a₀ = 0; what are the next four partial quotients a₁, a₂, a₃ and a₄, before the huge one?`, answer: [a1, a2, a3, a4], explanation: `${rt.eu}. The huge quotient ${n(rt.big)} is where the rounding hides.` },
   { prompt: `Build the convergents of [0; ${n(a1)}, ${n(a2)}, ${n(a3)}, ${n(a4)}] step by step. What are the numerator and denominator of C₃, the one before the last?`, answer: [p3, q3], explanation: `${convText(a)} So C₃ = ${n(p3)}/${n(q3)}.` },
   { prompt: `Now use a₄ = ${n(a4)} with C₂ and C₃. What are the numerator and denominator of the fraction, C₄?`, answer: [P, Q], explanation: `p₄ = ${n(a4)} × ${n(p3)} + ${n(cv[2][0])} = ${n(P)} and q₄ = ${n(a4)} × ${n(q3)} + ${n(cv[2][1])} = ${n(Q)}.` }
  ] }; }
});

/* ---- q38 RSA: encrypting [BC1.27, R8.1] ---- */
/* Not the q38 example (13 × 37, e = 5, m = 123). */
const rsaDraw = (R, primes, nLo, nHi, es, mLo, extra, canon) => tries(() => { const p = R.pick(primes), q = R.pick(primes), e = R.pick(es), N = p * q; return { p, q, e, m: R.int(mLo, Math.max(mLo, N - 2)), N }; },
 x => { const { p, q, e, m, N } = x, phi = (p - 1) * (q - 1); return p < q && N >= nLo && N < nHi && m < N - 1 && gcd(e, phi) === 1 && gcd(m, N) === 1 && pow(m, e, N) !== m && !(p === 13 && q === 37 && e === 5 && m === 123) && (!extra || extra(x)); }, canon);

mk({
 id: 'q38b', parent: 'q38', kind: 'setting', title: 'Locking a shipment number',
 brief: 'The store clerk pins a public key on the board so that shipment numbers can be sent in a form only the clerk can read.',
 labels: ['modulus n', 'ciphertext c'], tolerance: 0.01,
 gl: [['n'], ['m² mod n'], ['ciphertext c']]
}, {
 canonical: { p: 17, q: 29, e: 7, m: 88 },
 draw: R => { const x = rsaDraw(R, [7, 11, 13, 17, 19, 23, 29, 31], 100, 900, [3, 5, 7, 11], 10, null, null); return x ? { p: x.p, q: x.q, e: x.e, m: x.m } : { p: 17, q: 29, e: 7, m: 88 }; },
 build: ({ p, q, e, m }) => { const N = p * q, c = chain(m, e, N), m2 = m * m % N; return {
  prompt: `The store clerk keeps two primes secret, ${n(p)} and ${n(q)}, and pins only a pair of numbers on the notice board: the modulus n = ${n(p)} × ${n(q)} and the lock exponent e = ${n(e)}. A shipment is numbered m = ${n(m)}. Lock it with RSA by working out the ciphertext c = ${n(m)}${sup(e)} mod n as a least residue. Enter n, then c.`,
  answer: [N, c.r],
  hints: ['The modulus is the product of the two secret primes.', 'Do not work out the whole power. Square the shipment number again and again, reducing mod n each time, then multiply together the powers whose exponents add up to e.'],
  solution: `n = ${n(p)} × ${n(q)} = ${n(N)}. ${c.text} The ciphertext is c = ${n(c.r)}.`,
  guidance: [
   { prompt: `What is the modulus n = ${n(p)} × ${n(q)}?`, answer: [N], explanation: `${n(p)} × ${n(q)} = ${n(N)}.` },
   { prompt: `Square the shipment number. What is ${n(m)}² mod ${n(N)}?`, answer: [m2], explanation: `${n(m)}² = ${red(m * m, N)} (mod ${n(N)}).` },
   { prompt: `Combine the powers. What is the ciphertext ${n(m)}${sup(e)} mod ${n(N)}?`, answer: [c.r], explanation: c.text }
  ] }; }
});

/* The shipment code, then a lock exponent chosen by a gcd rule. The first of 3, 5, 7, 11 coprime to φ(n) is always 5 or more. */
mk({
 id: 'q38c', parent: 'q38', kind: 'applied', title: 'Choosing the lock exponent',
 brief: 'The depot has to choose a safe lock exponent for its key before it can lock a parcel code and post it.',
 labels: ['modulus n', 'exponent e', 'ciphertext c'], tolerance: 0.01,
 gl: [['n', 'φ(n)'], ['exponent e'], ['ciphertext c']]
}, {
 canonical: { p: 13, q: 31, m: 100 },
 draw: R => { const x = tries(() => { const p = R.pick([7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43]), q = R.pick([7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43]), N = p * q; return { p, q, m: R.int(10, Math.max(10, N - 2)), N }; },
  x => { const phi = (x.p - 1) * (x.q - 1), e = [3, 5, 7, 11].find(v => gcd(v, phi) === 1); return x.p < x.q && x.N < 1000 && x.m < x.N - 1 && e !== undefined && e >= 5 && gcd(x.m, x.N) === 1 && pow(x.m, e, x.N) !== x.m && !(x.p === 13 && x.q === 31 && x.m === 100); }, null);
  return x ? { p: x.p, q: x.q, m: x.m } : { p: 13, q: 31, m: 100 }; },
 build: ({ p, q, m }) => { const N = p * q, phi = (p - 1) * (q - 1), e = [3, 5, 7, 11].find(v => gcd(v, phi) === 1), c = chain(m, e, N), bad = [3, 5, 7, 11].filter(v => v < e); return {
  prompt: `The depot posts a parcel code to the outpost with RSA. Its two secret primes are ${n(p)} and ${n(q)}, so n = ${n(p)} × ${n(q)} and φ(n) = (${n(p)} − 1) × (${n(q)} − 1). The lock exponent e must share no factor with φ(n), meaning gcd(e, φ(n)) = 1, and the depot takes the smallest of 3, 5, 7 and 11 that works. The parcel code is m = ${n(m)}. Enter n, then the exponent e chosen, then the ciphertext c = ${n(m)}ᵉ mod n as a least residue.`,
  answer: [N, e, c.r],
  hints: ['The modulus is the product of the two primes, and φ(n) comes from the two numbers one less than each prime, multiplied together.', 'Test the candidates from the smallest: e works when no prime divides both e and φ(n). Then find mᵉ mod n by repeated squaring, reducing mod n each time and multiplying the powers whose exponents add up to e.'],
  solution: `n = ${n(p)} × ${n(q)} = ${n(N)} and φ(n) = ${n(p - 1)} × ${n(q - 1)} = ${n(phi)}. ${bad.map(v => `${n(v)} shares the factor ${n(gcd(v, phi))} with ${n(phi)}`).join('; ')}; ${n(e)} shares no factor with ${n(phi)}, so e = ${n(e)}. ${c.text} The ciphertext is c = ${n(c.r)}.`,
  guidance: [
   { prompt: `What are the modulus n = ${n(p)} × ${n(q)} and φ(n) = (${n(p)} − 1) × (${n(q)} − 1)?`, answer: [N, phi], explanation: `${n(p)} × ${n(q)} = ${n(N)} and ${n(p - 1)} × ${n(q - 1)} = ${n(phi)}.` },
   { prompt: `Which is the smallest of 3, 5, 7 and 11 that shares no factor with ${n(phi)}?`, answer: [e], explanation: `${bad.map(v => `${n(v)} shares the factor ${n(gcd(v, phi))} with ${n(phi)}`).join('; ')}; ${n(e)} shares no factor with ${n(phi)}, so e = ${n(e)}.` },
   { prompt: `Lock the code. What is ${n(m)}${sup(e)} mod ${n(N)}?`, answer: [c.r], explanation: c.text }
  ] }; }
});

/* Double lock: c₁ = mᵉ¹ mod n, then c₂ = c₁ᵉ² mod n. Larger primes. */
mk({
 id: 'q38d', parent: 'q38', kind: 'challenge', title: 'The double lock',
 brief: 'A very private message is to be locked twice with two different lock exponents under the same modulus.',
 labels: ['modulus n', 'first ciphertext c₁', 'second ciphertext c₂'], tolerance: 0.01,
 gl: [['n'], ['first ciphertext c₁'], ['second ciphertext c₂']]
}, {
 canonical: { p: 41, q: 53, e1: 7, e2: 11, m: 1234 },
 draw: R => { const x = tries(() => { const p = R.pick([31, 37, 41, 43, 47, 53, 59, 61, 67]), q = R.pick([31, 37, 41, 43, 47, 53, 59, 61, 67]), N = p * q; return { p, q, e1: R.pick([5, 7, 11, 13]), e2: R.pick([5, 7, 11, 13]), m: R.int(100, Math.max(100, N - 2)), N }; },
  x => { const phi = (x.p - 1) * (x.q - 1); return x.p < x.q && x.N < 4500 && x.e1 !== x.e2 && x.m < x.N - 1 && gcd(x.e1, phi) === 1 && gcd(x.e2, phi) === 1 && gcd(x.m, x.N) === 1 && pow(x.m, x.e1, x.N) !== x.m && pow(pow(x.m, x.e1, x.N), x.e2, x.N) !== x.m && !(x.p === 41 && x.q === 53 && x.e1 === 7 && x.e2 === 11 && x.m === 1234); }, null);
  return x ? { p: x.p, q: x.q, e1: x.e1, e2: x.e2, m: x.m } : { p: 41, q: 53, e1: 7, e2: 11, m: 1234 }; },
 build: ({ p, q, e1, e2, m }) => { const N = p * q, k1 = chain(m, e1, N), c1 = k1.r, k2 = chain(c1, e2, N); return {
  prompt: `A private order for the Cipher Room is locked twice, each time under the same modulus n = ${n(p)} × ${n(q)}. The first lock uses the exponent ${n(e1)}: c₁ = m${sup(e1)} mod n. The ciphertext c₁ then becomes the message for the second lock, which uses the exponent ${n(e2)}: c₂ = c₁${sup(e2)} mod n. The order is m = ${n(m)}. Enter n, then c₁ and c₂, each as a least residue mod n. Type answers of 1000 or more without commas.`,
  answer: [N, c1, k2.r],
  hints: ['The modulus is the product of the two primes. The numbers stay small if you reduce mod n after every multiplication.', 'Lock in two rounds: find the first ciphertext by repeated squaring, then treat it as the new message and repeat with the second exponent.'],
  solution: `n = ${n(p)} × ${n(q)} = ${n(N)}. First lock: ${k1.text} So c₁ = ${n(c1)}. Second lock: ${k2.text} So c₂ = ${n(k2.r)}.`,
  guidance: [
   { prompt: `What is the modulus n = ${n(p)} × ${n(q)}?`, answer: [N], explanation: `${n(p)} × ${n(q)} = ${n(N)}.` },
   { prompt: `First lock. What is c₁ = ${n(m)}${sup(e1)} mod ${n(N)}?`, answer: [c1], explanation: k1.text },
   { prompt: `Second lock. Using c₁ = ${n(c1)} as the message, what is c₂ = ${n(c1)}${sup(e2)} mod ${n(N)}?`, answer: [k2.r], explanation: k2.text }
  ] }; }
});

/* ---- q39 RSA: the decryption key [BC1.27, R8.1] ---- */
const keyOk = (p, q, e, m, lo, hi) => { const N = p * q, phi = (p - 1) * (q - 1); return p < q && N >= lo && N < hi && N !== 55 && m < N - 1 && e < phi && gcd(e, phi) === 1 && inverse(e, phi) !== e && gcd(m, N) === 1 && pow(m, e, N) !== m; };

mk({
 id: 'q39b', parent: 'q39', kind: 'setting', title: 'The clerk’s reply',
 brief: 'The store clerk has posted a coded reply, and only the clerk, who knows the primes behind the public key, can build the key to open it.',
 labels: ['φ(n)', 'decryption exponent d', 'message m'], tolerance: 0.01,
 gl: [['φ(n)'], ['d'], ['message m']]
}, {
 canonical: { p: 13, q: 19, e: 5, m: 100 },
 draw: R => { const x = tries(() => { const p = R.pick([5, 7, 11, 13, 17, 19, 23, 29]), q = R.pick([5, 7, 11, 13, 17, 19, 23, 29]), e = R.pick([3, 5, 7, 11, 13]); return { p, q, e, m: R.int(2, Math.max(2, p * q - 2)) }; },
  x => keyOk(x.p, x.q, x.e, x.m, 60, 600) && !(x.p === 11 && x.q === 23 && x.e === 3 && x.m === 42), null);
  return x || { p: 13, q: 19, e: 5, m: 100 }; },
 build: ({ p, q, e, m }) => { const N = p * q, phi = (p - 1) * (q - 1), d = inverse(e, phi), c = pow(m, e, N), k = (e * d - 1) / phi, ch = chain(c, d, N), steps = euclid(phi, e).map(eLine).join(', '); return {
  prompt: `The store clerk’s public key is the modulus n = ${n(N)} and the lock exponent e = ${n(e)}, and the clerk alone knows that ${n(N)} = ${n(p)} × ${n(q)}. A coded reply came back as the ciphertext c = ${n(c)}. Open it: enter φ(n), then the unlock exponent d (the number from 1 to φ(n) − 1 that e must be multiplied by to leave remainder 1 on division by φ(n)), then the message m = cᵈ mod n as a least residue.`,
  answer: [phi, d, m],
  hints: ['For two different primes, φ is the product of the two numbers one less than each prime.', 'To find d, write out Euclid’s algorithm on φ(n) and e, then work backwards to get e × d = 1 + a multiple of φ(n); add or subtract φ(n) until d is between 1 and φ(n) − 1. Then use repeated squaring for cᵈ mod n.'],
  solution: `φ(${n(N)}) = (${n(p)} − 1) × (${n(q)} − 1) = ${n(phi)}. Euclid’s algorithm on ${n(phi)} and ${n(e)}: ${steps}. Working backwards gives d = ${n(d)}; check: ${n(e)} × ${n(d)} = ${n(e * d)} = ${n(k)} × ${n(phi)} + 1. ${ch.text} The message is m = ${n(m)}.`,
  guidance: [
   { prompt: `${n(N)} = ${n(p)} × ${n(q)}. What is φ(${n(N)})?`, answer: [phi], explanation: `φ(${n(N)}) = (${n(p)} − 1) × (${n(q)} − 1) = ${n(p - 1)} × ${n(q - 1)} = ${n(phi)}.` },
   { prompt: `Find d from 1 to ${n(phi - 1)} so that ${n(e)} × d leaves remainder 1 on division by ${n(phi)}.`, answer: [d], explanation: `${steps}. Working backwards gives d = ${n(d)}: ${n(e)} × ${n(d)} = ${n(e * d)} = ${n(k)} × ${n(phi)} + 1.` },
   { prompt: `Open the reply. What is ${n(c)}${sup(d)} mod ${n(N)}?`, answer: [m], explanation: ch.text }
  ] }; }
});

/* Two ciphertexts under one key: the key is built once, then used twice. */
mk({
 id: 'q39c', parent: 'q39', kind: 'applied', title: 'Two replies, one key',
 brief: 'Two coded replies have arrived under the same public key, so the unlock exponent only has to be built once.',
 labels: ['decryption exponent d', 'first message', 'second message'], tolerance: 0.01,
 gl: [['φ(n)'], ['d'], ['first message', 'second message']]
}, {
 canonical: { p: 11, q: 19, e: 7, m1: 50, m2: 45 },
 draw: R => { const x = tries(() => { const p = R.pick([5, 7, 11, 13, 17, 19, 23]), q = R.pick([5, 7, 11, 13, 17, 19, 23]), e = R.pick([3, 5, 7, 11, 13]), N = p * q; return { p, q, e, m1: R.int(2, Math.max(2, N - 2)), m2: R.int(2, Math.max(2, N - 2)) }; },
  x => keyOk(x.p, x.q, x.e, x.m1, 100, 400) && keyOk(x.p, x.q, x.e, x.m2, 100, 400) && x.m1 !== x.m2 && !(x.p === 11 && x.q === 19 && x.e === 7 && x.m1 === 50 && x.m2 === 45), null);
  return x || { p: 11, q: 19, e: 7, m1: 50, m2: 45 }; },
 build: ({ p, q, e, m1, m2 }) => { const N = p * q, phi = (p - 1) * (q - 1), d = inverse(e, phi), c1 = pow(m1, e, N), c2 = pow(m2, e, N), k = (e * d - 1) / phi, h1 = chain(c1, d, N), h2 = chain(c2, d, N), steps = euclid(phi, e).map(eLine).join(', '); return {
  prompt: `Two coded replies reached the Cipher Room in one morning, both locked with the same public key: n = ${n(N)} and e = ${n(e)}. The ciphertexts are c₁ = ${n(c1)} and c₂ = ${n(c2)}. Mira knows that ${n(N)} = ${n(p)} × ${n(q)}, so she builds the unlock exponent d once (the number from 1 to φ(n) − 1 that e must be multiplied by to leave remainder 1 on division by φ(n)) and uses it on both. Enter d, then the first message m₁ = c₁ᵈ mod n, then the second message m₂ = c₂ᵈ mod n.`,
  answer: [d, m1, m2],
  hints: ['For two different primes, φ is the product of the two numbers one less than each prime. The unlock exponent d is found from φ and e with Euclid’s algorithm worked backwards.', 'The same d opens every message locked with this key. Use repeated squaring separately for each ciphertext, reducing mod n at every step.'],
  solution: `φ(${n(N)}) = (${n(p)} − 1) × (${n(q)} − 1) = ${n(phi)}. Euclid’s algorithm on ${n(phi)} and ${n(e)}: ${steps}. Working backwards gives d = ${n(d)}; check: ${n(e)} × ${n(d)} = ${n(e * d)} = ${n(k)} × ${n(phi)} + 1. First reply: ${h1.text} So m₁ = ${n(m1)}. Second reply: ${h2.text} So m₂ = ${n(m2)}.`,
  guidance: [
   { prompt: `${n(N)} = ${n(p)} × ${n(q)}. What is φ(${n(N)})?`, answer: [phi], explanation: `φ(${n(N)}) = (${n(p)} − 1) × (${n(q)} − 1) = ${n(p - 1)} × ${n(q - 1)} = ${n(phi)}.` },
   { prompt: `Find d from 1 to ${n(phi - 1)} so that ${n(e)} × d leaves remainder 1 on division by ${n(phi)}.`, answer: [d], explanation: `${steps}. Working backwards gives d = ${n(d)}: ${n(e)} × ${n(d)} = ${n(e * d)} = ${n(k)} × ${n(phi)} + 1.` },
   { prompt: `Open both replies. What are ${n(c1)}${sup(d)} mod ${n(N)} and ${n(c2)}${sup(d)} mod ${n(N)}?`, answer: [m1, m2], explanation: `${h1.text} So the first is ${n(m1)}. ${h2.text} So the second is ${n(m2)}.` }
  ] }; }
});

/* Decrypt, then lock the message again for the Map Room under the same modulus with its own exponent. Mixes in encrypting (q38). */
mk({
 id: 'q39d', parent: 'q39', kind: 'challenge', uses: 'q38', title: 'Forwarding to the Map Room',
 brief: 'A reply has to be opened and then locked again with the Map Room’s own key before it can be passed on.',
 labels: ['decryption exponent d', 'message m', 'forwarded ciphertext c₂'], tolerance: 0.01,
 gl: [['φ(n)', 'd'], ['message m'], ['ciphertext c₂']]
}, {
 canonical: { p: 17, q: 23, e: 5, e2: 7, m: 150 },
 draw: R => { const x = tries(() => { const p = R.pick([13, 17, 19, 23, 29, 31, 37]), q = R.pick([13, 17, 19, 23, 29, 31, 37]), e = R.pick([3, 5, 7, 11, 13, 17]), e2 = R.pick([5, 7, 11, 13]), N = p * q; return { p, q, e, e2, m: R.int(2, Math.max(2, N - 2)) }; },
  x => { const phi = (x.p - 1) * (x.q - 1), N = x.p * x.q; return keyOk(x.p, x.q, x.e, x.m, 200, 900) && x.e2 !== x.e && gcd(x.e2, phi) === 1 && pow(x.m, x.e2, N) !== x.m && !(x.p === 17 && x.q === 23 && x.e === 5 && x.e2 === 7 && x.m === 150); }, null);
  return x || { p: 17, q: 23, e: 5, e2: 7, m: 150 }; },
 build: ({ p, q, e, e2, m }) => { const N = p * q, phi = (p - 1) * (q - 1), d = inverse(e, phi), c = pow(m, e, N), k = (e * d - 1) / phi, h = chain(c, d, N), f = chain(m, e2, N), steps = euclid(phi, e).map(eLine).join(', '); return {
  prompt: `A reply for the outpost arrived locked with the public key n = ${n(N)} and e = ${n(e)}, as the ciphertext c = ${n(c)}. Mira knows that ${n(N)} = ${n(p)} × ${n(q)}. She opens the reply with the unlock exponent d (the number from 1 to φ(n) − 1 that e must be multiplied by to leave remainder 1 on division by φ(n)), getting the message m = cᵈ mod n. She then forwards m to the Map Room, locked with the Map Room’s public key: the same n and the exponent ${n(e2)}, so c₂ = m${sup(e2)} mod n. Enter d, then m, then c₂, each as a least residue.`,
  answer: [d, m, f.r],
  hints: ['φ is the product of the two numbers one less than each prime. Find d from φ and e with Euclid’s algorithm worked backwards, and open the reply with repeated squaring.', 'Locking the message again is encryption: raise the message m, not the old ciphertext, to the Map Room’s exponent mod n, with repeated squaring.'],
  solution: `φ(${n(N)}) = (${n(p)} − 1) × (${n(q)} − 1) = ${n(phi)}. Euclid’s algorithm on ${n(phi)} and ${n(e)}: ${steps}. Working backwards gives d = ${n(d)}; check: ${n(e)} × ${n(d)} = ${n(e * d)} = ${n(k)} × ${n(phi)} + 1. Opening the reply: ${h.text} So m = ${n(m)}. Locking it for the Map Room: ${f.text} So c₂ = ${n(f.r)}.`,
  guidance: [
   { prompt: `${n(N)} = ${n(p)} × ${n(q)}. What are φ(${n(N)}) and the unlock exponent d, from 1 to ${n(phi - 1)}, with ${n(e)} × d leaving remainder 1 on division by φ(${n(N)})?`, answer: [phi, d], explanation: `φ(${n(N)}) = ${n(p - 1)} × ${n(q - 1)} = ${n(phi)}. ${steps}. Working backwards gives d = ${n(d)}: ${n(e)} × ${n(d)} = ${n(e * d)} = ${n(k)} × ${n(phi)} + 1.` },
   { prompt: `Open the reply. What is ${n(c)}${sup(d)} mod ${n(N)}?`, answer: [m], explanation: h.text },
   { prompt: `Lock the message for the Map Room. What is ${n(m)}${sup(e2)} mod ${n(N)}?`, answer: [f.r], explanation: f.text }
  ] }; }
});

/* ---- q40 Realm review and bridge to Graph theory [R2.4, R3.5] ---- */
/* Links of the divisor network on 1 … N, counted from the smaller end: the quotient of N ÷ a, minus 1, for a up to N ÷ 2. */
const upCounts = N => { const out = []; for (let a = 1; a <= Math.floor(N / 2); a++) out.push(Math.floor(N / a) - 1); return out; };
const sum = l => l.reduce((s, v) => s + v, 0);
const ndiv = x => factor(x).reduce((t, [, e]) => t * (e + 1), 1);

mk({
 id: 'q40b', parent: 'q40', kind: 'setting', title: 'Ropes between the crates',
 brief: 'The store has numbered crates, and a rope joins any crate to a bigger one whose number is a multiple of it.',
 labels: ['number of ropes', 'gcd'], tolerance: 0.01,
 gl: [['ropes up from 1', 'ropes up from 2'], ['number of ropes'], ['gcd']]
}, {
 canonical: { N: 30, x: 18, y: 27 },
 draw: R => { const x = tries(() => { const N = R.int(20, 50), a = R.int(4, N - 1); return { N, x: a, y: R.int(a + 1, N) }; }, v => v.y % v.x !== 0 && gcd(v.x, v.y) >= 2 && !(v.N === 24 && v.x === 16 && v.y === 20), null); return x || { N: 30, x: 18, y: 27 }; },
 build: ({ N, x, y }) => { const counts = upCounts(N), links = sum(counts), half = Math.floor(N / 2), g = gcd(x, y); return {
  prompt: `The store keeps crates numbered 1 to ${n(N)}. A rope joins crate a to crate b whenever a < b and the number b is a multiple of a, and every such pair has exactly one rope. Mira wants to know how many ropes there are, and which is the largest crate number that divides both ${n(x)} and ${n(y)}. Enter the number of ropes, then gcd(${n(x)}, ${n(y)}).`,
  answer: [links, g],
  hints: ['Count each rope from its smaller crate a. The ropes going up from a lead to 2a, 3a, … as far as the last crate, so there are the quotient of the last crate number ÷ a, minus 1 (a itself is not a rope).', 'Add the counts for a = 1, 2, 3 and so on, and stop when a is more than half of the last crate number. For the gcd, take each shared prime to the smaller of its two exponents.'],
  solution: `Ropes going up from a = 1, 2, …, ${n(half)}: ${counts.map(n).join(' + ')} = ${n(links)}; a crate above ${n(half)} has no multiple up to ${n(N)}. So there are ${n(links)} ropes. ${n(x)} = ${factText(x)} and ${n(y)} = ${factText(y)}, so gcd(${n(x)}, ${n(y)}) = ${n(g)}.`,
  guidance: [
   { prompt: `How many ropes go up from crate 1 and from crate 2 when the crates run to ${n(N)}?`, answer: [N - 1, Math.floor(N / 2) - 1], explanation: `Crate 1 divides every number from 2 to ${n(N)}: ${n(N - 1)} ropes. The quotient of ${n(N)} ÷ 2 is ${n(Math.floor(N / 2))}, so crate 2 has ${n(Math.floor(N / 2) - 1)}.` },
   { prompt: `Add the counts for every crate a up to ${n(half)}. How many ropes are there in all?`, answer: [links], explanation: `${counts.map(n).join(' + ')} = ${n(links)}.` },
   { prompt: `What is gcd(${n(x)}, ${n(y)})?`, answer: [g], explanation: `${n(x)} = ${factText(x)} and ${n(y)} = ${factText(y)}; the shared part is ${factText(g) === n(g) ? n(g) : `${factText(g)} = ${n(g)}`}.` }
  ] }; }
});

/* Remove dot 1: the links left are the total minus N − 1. Then lcm of two numbers, both from the earlier lcm work (q05). */
mk({
 id: 'q40c', parent: 'q40', kind: 'applied', title: 'Trimming the network',
 brief: 'The Map Room asks for the network without its busiest dot, and for the day two watch crews next meet.',
 labels: ['links left', 'lcm'], tolerance: 0.01,
 gl: [['total links'], ['links left'], ['lcm']]
}, {
 canonical: { N: 36, x: 14, y: 21 },
 draw: R => { const x = tries(() => { const N = R.int(25, 50), a = R.int(6, N - 1); return { N, x: a, y: R.int(a + 1, N) }; }, v => v.y % v.x !== 0 && gcd(v.x, v.y) >= 2 && !(v.N === 36 && v.x === 14 && v.y === 21), null); return x || { N: 36, x: 14, y: 21 }; },
 build: ({ N, x, y }) => { const counts = upCounts(N), links = sum(counts), half = Math.floor(N / 2), left = links - (N - 1), g = gcd(x, y), L = x / g * y; return {
  prompt: `Mira draws the divisor network on the code numbers 1 to ${n(N)}: a link joins a to b whenever a < b and a divides b. The Map Room asks for the network without dot 1, which divides everything: dot 1 and every link that touches it are removed. Separately, two watch crews have the code numbers ${n(x)} and ${n(y)}: crew ${n(x)} reports every ${n(x)} days and crew ${n(y)} every ${n(y)} days, and both reported today. Enter the number of links left after dot 1 is removed, then the number of days until the two crews next report on the same day. Type answers of 1000 or more without commas.`,
  answer: [left, L],
  hints: ['Count the links going up from each a: the quotient of N ÷ a, minus 1, for a from 1 to half of N. The links that touch dot 1 are exactly the ones going up from 1.', 'The crews report together on common multiples, and the first is the lcm. For two numbers, take each prime to the larger of its two exponents, or divide their product by their gcd.'],
  solution: `Links going up from a = 1, 2, …, ${n(half)}: ${counts.map(n).join(' + ')} = ${n(links)}. Dot 1 has ${n(N - 1)} of them, so ${n(links)} − ${n(N - 1)} = ${n(left)} links are left. ${n(x)} = ${factText(x)} and ${n(y)} = ${factText(y)}, so gcd = ${n(g)} and lcm = ${n(x)} × ${n(y)} ÷ ${n(g)} = ${n(L)} days.`,
  guidance: [
   { prompt: `Add the links going up from every a from 1 to ${n(half)}, each being the quotient of ${n(N)} ÷ a minus 1. How many links does the whole network have?`, answer: [links], explanation: `${counts.map(n).join(' + ')} = ${n(links)}.` },
   { prompt: `Dot 1 links up to every number from 2 to ${n(N)}. How many links are left without dot 1?`, answer: [left], explanation: `Dot 1 has ${n(N - 1)} links, and ${n(links)} − ${n(N - 1)} = ${n(left)}.` },
   { prompt: `What is the lcm of ${n(x)} and ${n(y)}, the days until the crews report together again?`, answer: [L], explanation: `${n(x)} = ${factText(x)} and ${n(y)} = ${factText(y)}, so the gcd is ${n(g)} and the lcm is ${n(x)} × ${n(y)} ÷ ${n(g)} = ${n(L)}.` }
  ] }; }
});

/* N from 41 to 60; links into a chosen number b = divisors below b, from its factorisation (q09, stated in the prompt). */
mk({
 id: 'q40d', parent: 'q40', kind: 'challenge', uses: 'q09', title: 'Counting links from the top',
 brief: 'The Map Room wants the network counted two ways: all its links, and the links that end at one busy dot.',
 labels: ['total links', 'links ending at the dot'], tolerance: 0.01,
 gl: [['links ending at the dot'], ['links up from 1', 'links up from 2', 'links up from 3'], ['total links']]
}, {
 canonical: { N: 48, b: 42 },
 draw: R => { const x = tries(() => { const N = R.int(41, 60); return { N, b: R.int(24, N) }; }, v => ndiv(v.b) - 1 >= 5 && !(v.N === 48 && v.b === 42), null); return x || { N: 48, b: 42 }; },
 build: ({ N, b }) => { const counts = upCounts(N), links = sum(counts), half = Math.floor(N / 2), f = factor(b), td = ndiv(b), into = td - 1, tdText = f.map(([, e]) => `(${n(e)} + 1)`).join(' × '); return {
  prompt: `The divisor network has one dot for each code number from 1 to ${n(N)}, and a link between a and b whenever a < b and a divides b. Count its links in two ways. First, count all the links in the network. Second, count the links that end at dot ${n(b)} (those from a smaller number that divides ${n(b)}): a number whose prime factorisation has exponents e₁, e₂, … has (e₁ + 1) × (e₂ + 1) × … divisors in all, ${n(b)} itself included. Enter the total number of links in the network, then the number of links that end at dot ${n(b)}.`,
  answer: [links, into],
  hints: ['For the total, count each link from its smaller end a: the quotient of N ÷ a, minus 1, for a from 1 to half of N, and add them up.', 'For the links ending at one dot, write its prime factorisation, multiply (exponent + 1) over its primes to count its divisors, and take away the dot itself, which has no link to itself.'],
  solution: `Links going up from a = 1, 2, …, ${n(half)}: ${counts.map(n).join(' + ')} = ${n(links)}. For dot ${n(b)}: ${n(b)} = ${factText(b)}, so it has ${tdText} = ${n(td)} divisors, and without ${n(b)} itself ${n(into)} links end there.`,
  guidance: [
   { prompt: `Write ${n(b)} as a product of primes and count its divisors with the exponent rule. How many links end at dot ${n(b)}?`, answer: [into], explanation: `${n(b)} = ${factText(b)}, so it has ${tdText} = ${n(td)} divisors; without ${n(b)} itself ${n(into)} links end there.` },
   { prompt: `How many links go up from 1, from 2 and from 3 when the numbers run to ${n(N)}?`, answer: [N - 1, Math.floor(N / 2) - 1, Math.floor(N / 3) - 1], explanation: `1 divides every number from 2 to ${n(N)}: ${n(N - 1)} links. The quotient of ${n(N)} ÷ 2 is ${n(Math.floor(N / 2))}, so 2 has ${n(Math.floor(N / 2) - 1)}; the quotient of ${n(N)} ÷ 3 is ${n(Math.floor(N / 3))}, so 3 has ${n(Math.floor(N / 3) - 1)}.` },
   { prompt: `Add the counts for every a up to ${n(half)}. How many links are there in all?`, answer: [links], explanation: `${counts.map(n).join(' + ')} = ${n(links)}.` }
  ] }; }
});

})();
