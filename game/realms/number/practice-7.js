/* Number theory: the hidden life of whole numbers practice missions, file 7 of 8: concepts q31–q35, three practice missions each
   (q31b q31c q31d q32b q32c q32d q33b q33c q33d q34b q34c q34d q35b q35c q35d).
   Format and rules: docs/PACK-FORMAT.md, "Practice missions" (§10).
     b  kind 'setting'    the same skill in a new real-world setting
     c  kind 'applied'    a word problem with two or three steps (two or three guided steps)
     d  kind 'challenge'  harder numbers, or the skill combined with one earlier concept (optional `uses: 'qNN'`)
   A practice mission supplies only: id, parent, kind, title, brief, prompt, answer, labels, tolerance, hints,
   solution, guidance (and `uses` for a challenge). Everything else comes from its parent, the learn mission:
   topic, tier, xp, sector, lesson, teaching, sources, the concept bench and the review drill. Do not write those.
   Each mission is registered together with its generator by add(mission, generator); build(canonical) must
   reproduce the authored prompt, hints, solution and guidance exactly. Oracles: qa/realms/number/oracle-p7.js. */
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
/* Shared helpers. Every number stays below 10⁷ before reduction, so plain Number arithmetic is exact. */
const SUP = { 0: '⁰', 1: '¹', 2: '²', 3: '³', 4: '⁴', 5: '⁵', 6: '⁶', 7: '⁷', 8: '⁸', 9: '⁹' };
const sup = k => String(k).split('').map(c => SUP[c]).join('');
const mod = (a, m) => ((a % m) + m) % m;
const pow = (a, k, m) => { let r = 1, b = mod(a, m); while (k > 0) { if (k & 1) r = r * b % m; b = b * b % m; k = Math.floor(k / 2); } return r; };
const isPrime = x => { if (x < 2) return false; for (let d = 2; d * d <= x; d++) if (x % d === 0) return false; return true; };
const primesIn = (lo, hi) => { const out = []; for (let x = lo; x <= hi; x++) if (isPrime(x)) out.push(x); return out; };
/* Prime factorisation as [prime, exponent] pairs, and as text such as 2² × 3 × 5. */
const factor = x => { const out = []; for (let d = 2; d * d <= x; d++) { let e = 0; while (x % d === 0) { x /= d; e++; } if (e) out.push([d, e]); } if (x > 1) out.push([x, 1]); return out; };
const factText = x => factor(x).map(([p, e]) => e > 1 ? `${n(p)}${sup(e)}` : n(p)).join(' × ');
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
/* Non-zero squares mod an odd prime p, in increasing order, and the Legendre symbol by Euler's criterion. */
const squaresMod = p => { const s = new Set(); for (let x = 1; x <= (p - 1) / 2; x++) s.add(x * x % p); return [...s].sort((u, w) => u - w); };
const legendre = (a, p) => pow(a, (p - 1) / 2, p) === 1 ? 1 : -1;
const listText = list => list.length === 1 ? list[0] : list.length === 2 ? `${list[0]} and ${list[1]}` : `${list.slice(0, -1).join(', ')} and ${list[list.length - 1]}`;
/* Ways to write x = a² + b² with 0 ≤ a ≤ b. */
const twoSquares = x => { const w = []; for (let a = 0; 2 * a * a <= x; a++) { const b = Math.round(Math.sqrt(x - a * a)); if (b * b === x - a * a) w.push([a, b]); } return w; };
/* "1 slab", "3 slabs". */
const pl = (k, w) => k === 1 ? `1 ${w}` : `${n(k)} ${w}s`;
const SMALL_PRIMES = [11, 13, 17, 19, 23, 29], BIG_PRIMES = [31, 37, 41, 43, 47, 53, 59, 61];
const REC_SMALL = [3, 5, 7, 11, 13], REC_BIG = primesIn(17, 97);

/* ---- q31 Legendre symbol and Euler's criterion [R5.5] ---- */

mk({
 id: 'q31b', parent: 'q31', kind: 'setting', title: 'Marker stamps on the boundary line',
 brief: 'The boundary markers carry stamps, and the surveyor needs to know which stamp can sit on the square survey grid.',
 labels: ['exponent (p − 1) ÷ 2', 'power mod p', 'Legendre symbol (a/p)'], tolerance: 0.01,
 gl: [['exponent'], ['a² mod p', 'a⁴ mod p'], ['power mod p'], ['(a/p)']]
}, {
 /* A prime p from 11 to 29 and a stamp a from 2 to p − 2, so the power is never 0 and never trivially 1. */
 canonical: { p: 17, a: 6 },
 draw: R => { const p = R.pick(SMALL_PRIMES); return { p, a: R.int(2, p - 2) }; },
 build: ({ p, a }) => { const k = (p - 1) / 2, s2 = a * a % p, s4 = s2 * s2 % p, c = chain(a, k, p), r = c.r, sym = r === 1 ? 1 : -1; return {
  prompt: `Boundary markers along the Survey Field are stamped with the remainder of their distance in paces on division by the prime ${n(p)}. A marker can be set on the square survey grid only if its stamp is a quadratic residue mod ${n(p)}: the remainder of some whole number squared. The marker stamped ${n(a)} is waiting. Use Euler’s criterion. Enter the exponent (${n(p)} − 1) ÷ 2, then ${n(a)}${sup(k)} mod ${n(p)} as a least residue (0 to ${n(p - 1)}), then the Legendre symbol (${n(a)}/${n(p)}), typed 1 or −1.`,
  answer: [k, r, sym],
  hints: ['Euler’s criterion needs the exponent (p − 1) ÷ 2, half of one less than the prime. Raise the stamp to that power by repeated squaring, reducing mod p after every multiplication.', 'The result is always 1 or p − 1. A result of 1 gives the symbol 1, a quadratic residue. A result of p − 1 stands for −1 and gives the symbol −1, not a quadratic residue.'],
  solution: `The exponent is (${n(p)} − 1) ÷ 2 = ${n(k)}. ${c.text} ${r === 1 ? `The remainder is 1, so (${n(a)}/${n(p)}) = 1: the marker can be set on the grid.` : `The remainder is ${n(p - 1)}, which is −1 mod ${n(p)}, so (${n(a)}/${n(p)}) = −1: the marker cannot be set on the grid.`}`,
  guidance: [
   { prompt: `What is the exponent (p − 1) ÷ 2 for p = ${n(p)}?`, answer: [k], explanation: `(${n(p)} − 1) ÷ 2 = ${n(k)}.` },
   { prompt: `Square the stamp repeatedly, reducing mod ${n(p)} each time. What are ${n(a)}² mod ${n(p)} and ${n(a)}⁴ mod ${n(p)}?`, answer: [s2, s4], explanation: `${n(a)}² = ${red(a * a, p)}, and ${n(a)}⁴ ≡ ${n(s2)}² = ${red(s2 * s2, p)} (mod ${n(p)}).` },
   { prompt: `Combine the squares. What is ${n(a)}${sup(k)} mod ${n(p)}?`, answer: [r], explanation: c.text },
   { prompt: `The remainder is ${n(r)}. What is the Legendre symbol (${n(a)}/${n(p)}), as 1 or −1?`, answer: [sym], explanation: r === 1 ? `A remainder of 1 means (${n(a)}/${n(p)}) = 1.` : `A remainder of ${n(p - 1)} is −1 mod ${n(p)}, so (${n(a)}/${n(p)}) = −1.` }
  ] }; }
});

mk({
 id: 'q31c', parent: 'q31', kind: 'applied', title: 'Pegs for the square grids',
 brief: 'Each plot is staked out with a number of pegs that depends on its remainder, and the store clerk needs the peg total for two plots.',
 labels: ['symbol (a/p)', 'symbol (b/p)', 'total pegs'], tolerance: 0.01,
 gl: [['a^((p − 1) ÷ 2) mod p', 'symbol (a/p)'], ['b^((p − 1) ÷ 2) mod p', 'symbol (b/p)'], ['total pegs']]
}, {
 /* A prime p from 11 to 29 and two different remainders a and b from 2 to p − 2. A residue plot takes 4 pegs, any other 7. */
 canonical: { p: 19, a: 5, b: 12 },
 draw: R => { const p = R.pick(SMALL_PRIMES), a = R.int(2, p - 2); return { p, a, b: R.except(2, p - 2, [a]) }; },
 build: ({ p, a, b }) => { const k = (p - 1) / 2, ca = chain(a, k, p), cb = chain(b, k, p), sa = ca.r === 1 ? 1 : -1, sb = cb.r === 1 ? 1 : -1, total = (sa === 1 ? 4 : 7) + (sb === 1 ? 4 : 7);
  const say = (x, c, s) => s === 1 ? `${n(x)}${sup(k)} ≡ 1, so (${n(x)}/${n(p)}) = 1: a residue plot, 4 pegs` : `${n(x)}${sup(k)} ≡ ${n(p - 1)}, which is −1 mod ${n(p)}, so (${n(x)}/${n(p)}) = −1: not a residue, 7 pegs`; return {
  prompt: `Each plot on the Survey Field is staked out with pegs, and the number depends on the remainder of the plot’s area on division by the prime ${n(p)}. A plot whose remainder is a quadratic residue mod ${n(p)} (the remainder of some whole number squared) takes 4 pegs. Any other plot takes 7 pegs. Two plots have remainders ${n(a)} and ${n(b)}. Use Euler’s criterion on each. Enter the Legendre symbol (${n(a)}/${n(p)}), then (${n(b)}/${n(p)}), each typed 1 or −1, then the total number of pegs for the two plots.`,
  answer: [sa, sb, total],
  hints: ['Euler’s criterion: for each plot on its own, work out the remainder to the power (p − 1) ÷ 2 mod p by repeated squaring. A result of 1 means a quadratic residue; a result of p − 1 means it is not.', 'Count 4 pegs for every plot whose symbol is 1 and 7 pegs for every plot whose symbol is −1, then add the two plots.'],
  solution: `The exponent is (${n(p)} − 1) ÷ 2 = ${n(k)}. For ${n(a)}: ${ca.text} So ${say(a, ca, sa)}. For ${n(b)}: ${cb.text} So ${say(b, cb, sb)}. The total is ${n(sa === 1 ? 4 : 7)} + ${n(sb === 1 ? 4 : 7)} = ${n(total)} pegs.`,
  guidance: [
   { prompt: `Use Euler’s criterion on the remainder ${n(a)}. What are ${n(a)}${sup(k)} mod ${n(p)} and the symbol (${n(a)}/${n(p)})?`, answer: [ca.r, sa], explanation: `${ca.text} So (${n(a)}/${n(p)}) = ${n(sa)}.` },
   { prompt: `Do the same for the remainder ${n(b)}. What are ${n(b)}${sup(k)} mod ${n(p)} and the symbol (${n(b)}/${n(p)})?`, answer: [cb.r, sb], explanation: `${cb.text} So (${n(b)}/${n(p)}) = ${n(sb)}.` },
   { prompt: `A plot with symbol 1 takes 4 pegs and a plot with symbol −1 takes 7. With the symbols ${n(sa)} and ${n(sb)}, how many pegs do the two plots take in all?`, answer: [total], explanation: `${n(sa === 1 ? 4 : 7)} + ${n(sb === 1 ? 4 : 7)} = ${n(total)} pegs.` }
  ] }; }
});

mk({
 id: 'q31d', parent: 'q31', kind: 'challenge', uses: 'q30', title: 'The deep stamp register',
 brief: 'The deep register files plots under a larger prime, and Mira wants to know not only whether a stamp is a square but which square it comes from.',
 labels: ['power mod p', 'Legendre symbol (a/p)', 'square root x'], tolerance: 0.01,
 gl: [['power mod p', 'symbol (a/p)'], ['square root x']]
}, {
 /* A prime p from 31 to 61 (exponent 15 to 30, so up to four squarings) and a from 2 to p − 2. The root x is the one from 1 to
    (p − 1) ÷ 2, found by trying the squares as in q30; the other root is p − x. */
 canonical: { p: 41, a: 10 },
 draw: R => { const p = R.pick(BIG_PRIMES); return { p, a: R.int(2, p - 2) }; },
 build: ({ p, a }) => { const k = (p - 1) / 2, c = chain(a, k, p), r = c.r, sym = r === 1 ? 1 : -1; let x = 0; if (sym === 1) for (let t = 1; t <= k; t++) if (t * t % p === a) { x = t; break; }
  return {
  prompt: `The deep register of the Survey Field files plots under remainders on division by the larger prime ${n(p)}. A plot with remainder ${n(a)} is waiting to be filed. Use Euler’s criterion to find ${n(a)}${sup(k)} mod ${n(p)} as a least residue (0 to ${n(p - 1)}), and then the Legendre symbol (${n(a)}/${n(p)}), typed 1 or −1. If ${n(a)} is a quadratic residue, the register also records its square root: the whole number x from 1 to ${n(k)} whose square leaves remainder ${n(a)} on division by ${n(p)}. Enter that x, or 0 if ${n(a)} is not a quadratic residue.`,
  answer: [r, sym, x],
  hints: ['Euler’s criterion: raise the stamp to the power (p − 1) ÷ 2 by repeated squaring, reducing mod p after every multiplication. A result of 1 means a quadratic residue and a result of p − 1 means it is not.', 'If the symbol is 1, try x = 1, 2, 3, … in turn and work out x² mod p until one leaves the remainder you are filing. The other root is p minus that x, so the root up to (p − 1) ÷ 2 is the one to enter.'],
  solution: `The exponent is (${n(p)} − 1) ÷ 2 = ${n(k)}. ${c.text} ${sym === 1 ? `The remainder is 1, so (${n(a)}/${n(p)}) = 1: ${n(a)} is a quadratic residue. Trying x = 1, 2, 3, …: ${n(x)}² = ${n(x * x)} = ${n((x * x - a) / p)} × ${n(p)} + ${n(a)}, so x = ${n(x)} (the other root is ${n(p)} − ${n(x)} = ${n(p - x)}).` : `The remainder is ${n(p - 1)}, which is −1 mod ${n(p)}, so (${n(a)}/${n(p)}) = −1: ${n(a)} is not a quadratic residue, and there is no square root to enter: 0.`}`,
  guidance: [
   { prompt: `Use Euler’s criterion on ${n(a)}. What are ${n(a)}${sup(k)} mod ${n(p)} and the symbol (${n(a)}/${n(p)})?`, answer: [r, sym], explanation: `${c.text} So (${n(a)}/${n(p)}) = ${n(sym)}.` },
   { prompt: sym === 1 ? `The symbol is 1, so ${n(a)} is a square mod ${n(p)}. Find the whole number x from 1 to ${n(k)} with x² leaving remainder ${n(a)} on division by ${n(p)}.` : `The symbol is −1, so ${n(a)} is not a square mod ${n(p)}. What do you enter for the square root x?`, answer: [x], explanation: sym === 1 ? `${n(x)}² = ${n(x * x)} = ${n((x * x - a) / p)} × ${n(p)} + ${n(a)}, so x = ${n(x)}. The other root, ${n(p - x)}, is larger than ${n(k)}.` : 'There is no square root, so you enter 0.' }
  ] }; }
});

/* ---- q32 Quadratic reciprocity [R5.6] ---- */

/* Pairs (p, q): a small odd prime p and an odd prime q from 17 to 97. The pairs of the worked example, (3, 43), and of the learn mission, (7, 59), are left out. */
const REC_PAIRS = []; for (const p of REC_SMALL) for (const q of REC_BIG) if (!(p === 3 && q === 43) && !(p === 7 && q === 59)) REC_PAIRS.push({ p, q });
/* Pairs (p, q) for the challenge: p from 17 to 31, q a prime from 37 to 97 that leaves a remainder of at least 2. */
const WIDE_PAIRS = []; for (const p of [17, 19, 23, 29, 31]) for (const q of primesIn(37, 97)) if (q % p >= 2) WIDE_PAIRS.push({ p, q });
/* Everything the three reciprocity missions say about the symbol (p/q): reduce q mod p, settle (q/p) from the squares, turn back. */
const recParts = (p, q) => { const r = q % p, m = (q - r) / p, rs = legendre(r, p), both = p % 4 === 3 && q % 4 === 3, s = both ? -1 : 1, pq = s * rs, sq = squaresMod(p);
 const turn = both ? `Both leave 3, so turning the symbol over changes its sign: (${n(p)}/${n(q)}) = −(${n(q)}/${n(p)}).` : `They do not both leave 3, so the symbol keeps its value when it is turned over: (${n(p)}/${n(q)}) = (${n(q)}/${n(p)}).`;
 const reduce = `${n(q)} = ${n(m)} × ${n(p)} + ${n(r)}, so (${n(q)}/${n(p)}) = (${n(r)}/${n(p)}).`;
 const squares = `${sq.length === 1 ? `The only non-zero square mod ${n(p)} is ${n(sq[0])}` : `The non-zero squares mod ${n(p)} are ${listText(sq.map(n))}`}, so ${n(r)} ${rs === 1 ? 'is' : 'is not'} a quadratic residue and (${n(q)}/${n(p)}) = ${n(rs)}.`;
 return { r, m, rs, both, s, pq, sq, turn, reduce, squares, mods: `${n(p)} leaves ${n(p % 4)} and ${n(q)} leaves ${n(q % 4)} on division by 4.` }; };

mk({
 id: 'q32b', parent: 'q32', kind: 'setting', title: 'Pole spacing across the gap',
 brief: 'Two lines of survey poles are numbered with prime numbers, and the surveyor wants to swap a slow question for a quick one.',
 labels: ['q mod p', 'sign factor s', 'symbol (p/q)'], tolerance: 0.01,
 gl: [['p mod 4', 'q mod 4', 'sign factor s'], ['q mod p', 'symbol (q/p)'], ['symbol (p/q)']]
}, {
 /* A small odd prime p (3 to 13) and an odd prime q from 17 to 97. The sign factor s is −1 when both leave remainder 3 on division by 4. */
 canonical: { p: 5, q: 83 },
 draw: R => R.pick(REC_PAIRS),
 build: ({ p, q }) => { const t = recParts(p, q); return {
  prompt: `Survey poles along two lines of the Survey Field are numbered with the odd primes ${n(p)} and ${n(q)}. The surveyor needs the Legendre symbol (${n(p)}/${n(q)}), which says whether ${n(p)} is a square mod ${n(q)}. Turn the symbol over with quadratic reciprocity. Enter the remainder of ${n(q)} on division by ${n(p)}, then the sign factor s (s = −1 if turning the symbol over changes its sign, and s = 1 if it keeps its value), then the symbol (${n(p)}/${n(q)}), typed 1 or −1.`,
  answer: [t.r, t.s, t.pq],
  hints: ['Quadratic reciprocity: for two different odd primes p and q, the symbols (p/q) and (q/p) are equal unless both primes leave remainder 3 on division by 4; then they are opposite.', 'The symbol (q/p) depends only on the remainder of q on division by p. Find that remainder, look for it among the non-zero squares mod p, and then apply the sign factor.'],
  solution: `On division by 4, ${t.mods} ${t.turn} So s = ${n(t.s)}. Now reduce: ${t.reduce} ${t.squares} Therefore (${n(p)}/${n(q)}) = ${n(t.s)} × ${n(t.rs)} = ${n(t.pq)}.`,
  guidance: [
   { prompt: `What remainders do ${n(p)} and ${n(q)} leave on division by 4, and what is the sign factor s?`, answer: [p % 4, q % 4, t.s], explanation: `${t.mods} ${t.turn} So s = ${n(t.s)}.` },
   { prompt: `Reduce the turned symbol (${n(q)}/${n(p)}). What is the remainder of ${n(q)} on division by ${n(p)}, and what is the symbol (${n(q)}/${n(p)}), as 1 or −1? ${t.sq.length === 1 ? `The only non-zero square mod ${n(p)} is ${n(t.sq[0])}` : `The non-zero squares mod ${n(p)} are ${listText(t.sq.map(n))}`}.`, answer: [t.r, t.rs], explanation: `${t.reduce} ${t.squares}` },
   { prompt: `Now turn back, using the sign factor ${n(t.s)}. What is (${n(p)}/${n(q)})?`, answer: [t.pq], explanation: `(${n(p)}/${n(q)}) = ${n(t.s)} × (${n(q)}/${n(p)}) = ${n(t.s)} × ${n(t.rs)} = ${n(t.pq)}.` }
  ] }; }
});

mk({
 id: 'q32c', parent: 'q32', kind: 'applied', title: 'Fair markers on the long ring',
 brief: 'A ring of posts takes only the markers whose spacing is a square mod the ring’s prime, and the crew has two markers to test.',
 labels: ['symbol (p₁/q)', 'symbol (p₂/q)', 'fair markers'], tolerance: 0.01,
 gl: [['symbol (q/p₁)', 'symbol (p₁/q)'], ['symbol (q/p₂)', 'symbol (p₂/q)'], ['fair markers']]
}, {
 /* Two different small odd primes p1 < p2 (3 to 13) and an odd prime q from 17 to 97. A marker is fair when its symbol is 1. */
 canonical: { p1: 5, p2: 11, q: 71 },
 draw: R => { const p1 = R.pick(REC_SMALL.slice(0, 4)), p2 = R.pick(REC_SMALL.filter(x => x > p1)); return { p1, p2, q: R.pick(REC_BIG) }; },
 build: ({ p1, p2, q }) => { const A = recParts(p1, q), B = recParts(p2, q), fair = (A.pq === 1 ? 1 : 0) + (B.pq === 1 ? 1 : 0), one = (p, t) => `${n(p)}: ${t.reduce} ${t.squares} ${t.mods} ${t.turn} So (${n(p)}/${n(q)}) = ${n(t.pq)}.`; return {
  prompt: `A ring of ${n(q)} posts stands on the Survey Field, where ${n(q)} is a prime. A marker whose spacing is an odd prime p is fair on the ring if p is a quadratic residue mod ${n(q)}, that is, if the Legendre symbol (p/${n(q)}) is 1. Mira has two markers, with spacings ${n(p1)} and ${n(p2)}. Use quadratic reciprocity on each: turn the symbol over, reduce, and settle it from the squares mod the small prime. Enter (${n(p1)}/${n(q)}), then (${n(p2)}/${n(q)}), each typed 1 or −1, then how many of the two markers are fair.`,
  answer: [A.pq, B.pq, fair],
  hints: ['Quadratic reciprocity: for two different odd primes p and q, the symbols (p/q) and (q/p) are equal unless both primes leave remainder 3 on division by 4; then they are opposite. Work on each marker separately.', 'The symbol (q/p) depends only on the remainder of q on division by p, so reduce first and compare with the non-zero squares mod p. A marker is fair exactly when its symbol (p/q) is 1.'],
  solution: `Marker ${one(p1, A)} Marker ${one(p2, B)} A marker is fair when its symbol is 1, so ${fair === 0 ? 'neither marker is fair' : fair === 2 ? 'both markers are fair' : `only the marker ${n(A.pq === 1 ? p1 : p2)} is fair`}: ${n(fair)}.`,
  guidance: [
   { prompt: `Take the marker ${n(p1)}. Reduce ${n(q)} mod ${n(p1)} and settle (${n(q)}/${n(p1)}) from the squares mod ${n(p1)}, then turn back. What are (${n(q)}/${n(p1)}) and (${n(p1)}/${n(q)})?`, answer: [A.rs, A.pq], explanation: `${A.reduce} ${A.squares} ${A.mods} ${A.turn} So (${n(p1)}/${n(q)}) = ${n(A.pq)}.` },
   { prompt: `Take the marker ${n(p2)}. Reduce ${n(q)} mod ${n(p2)} and settle (${n(q)}/${n(p2)}) from the squares mod ${n(p2)}, then turn back. What are (${n(q)}/${n(p2)}) and (${n(p2)}/${n(q)})?`, answer: [B.rs, B.pq], explanation: `${B.reduce} ${B.squares} ${B.mods} ${B.turn} So (${n(p2)}/${n(q)}) = ${n(B.pq)}.` },
   { prompt: `A marker is fair when its symbol is 1. With the symbols ${n(A.pq)} and ${n(B.pq)}, how many of the two markers are fair?`, answer: [fair], explanation: `${fair === 0 ? 'Neither symbol is 1' : fair === 2 ? 'Both symbols are 1' : 'Exactly one symbol is 1'}, so the number of fair markers is ${n(fair)}.` }
  ] }; }
});

mk({
 id: 'q32d', parent: 'q32', kind: 'challenge', uses: 'q31', title: 'Reciprocity on the wide ring',
 brief: 'On the wide ring both primes are large, so Mira turns the symbol over and then settles the small one with a single power.',
 labels: ['r = q mod p', 'power mod p', 'symbol (q/p)', 'symbol (p/q)'], tolerance: 0.01,
 gl: [['r = q mod p'], ['power mod p', 'symbol (q/p)'], ['symbol (p/q)']]
}, {
 /* A prime p from 17 to 31 and a prime q from 37 to 97, so q mod p = r is from 2 to p − 1 and the small symbol needs Euler's criterion
    (a list of squares mod p is long). Every pair is drawn from the list of such pairs. */
 canonical: { p: 23, q: 59 },
 draw: R => R.pick(WIDE_PAIRS),
 build: ({ p, q }) => { const k = (p - 1) / 2, t = recParts(p, q), c = chain(t.r, k, p); return {
  prompt: `The Survey Field’s wide ring is numbered by the odd primes ${n(p)} and ${n(q)}, and Mira needs the Legendre symbol (${n(p)}/${n(q)}). Mod ${n(q)} the list of squares is far too long, so she turns the symbol over with quadratic reciprocity, reduces it, and then settles the small symbol with Euler’s criterion instead of a list. Enter the remainder r of ${n(q)} on division by ${n(p)}, then r${sup(k)} mod ${n(p)} as a least residue, then the symbol (${n(q)}/${n(p)}), then (${n(p)}/${n(q)}), each symbol typed 1 or −1.`,
  answer: [t.r, c.r, t.rs, t.pq],
  hints: ['The symbol (q/p) depends only on the remainder r of q on division by p. Euler’s criterion for r needs r to the power (p − 1) ÷ 2 mod p, by repeated squaring: a result of 1 gives the symbol 1 and a result of p − 1 gives −1.', 'Quadratic reciprocity: (p/q) and (q/p) are equal unless both primes leave remainder 3 on division by 4; then they are opposite.'],
  solution: `${t.reduce} The exponent is (${n(p)} − 1) ÷ 2 = ${n(k)}. ${c.text} ${c.r === 1 ? 'The remainder is 1' : `The remainder is ${n(p - 1)}, which is −1 mod ${n(p)}`}, so (${n(q)}/${n(p)}) = ${n(t.rs)}. ${t.mods} ${t.turn} So (${n(p)}/${n(q)}) = ${n(t.pq)}.`,
  guidance: [
   { prompt: `What is the remainder r of ${n(q)} on division by ${n(p)}?`, answer: [t.r], explanation: `${t.reduce}` },
   { prompt: `Use Euler’s criterion on r = ${n(t.r)}. What are ${n(t.r)}${sup(k)} mod ${n(p)} and the symbol (${n(q)}/${n(p)})?`, answer: [c.r, t.rs], explanation: `${c.text} So (${n(q)}/${n(p)}) = (${n(t.r)}/${n(p)}) = ${n(t.rs)}.` },
   { prompt: `Now turn the symbol back. What is (${n(p)}/${n(q)}), as 1 or −1?`, answer: [t.pq], explanation: `${t.mods} ${t.turn} So (${n(p)}/${n(q)}) = ${n(t.pq)}.` }
  ] }; }
});

/* ---- q33 Sums of two squares [BC1.28] ---- */

/* Block sizes that are, and are not, a sum of two squares: from 100 to 500 for the setting, 501 to 2000 for the challenge.
   The worked example of the learn mission, 65, is never used. */
const range = (lo, hi) => { const out = []; for (let x = lo; x <= hi; x++) out.push(x); return out; };
const SOS_YES = range(100, 500).filter(x => twoSquares(x).length > 0), SOS_NO = range(100, 500).filter(x => twoSquares(x).length === 0);
const SOS_YES_BIG = range(501, 2000).filter(x => twoSquares(x).length > 0), SOS_NO_BIG = range(501, 2000).filter(x => twoSquares(x).length === 0);
/* Blocks from 50 to 800 that split into two real square plots (both sides at least 1) in at least two ways. */
const SOS_TWO = range(50, 800).filter(x => x !== 65 && twoSquares(x).filter(([a]) => a >= 1).length >= 2);
/* The factorisation story and the ways for a block x, as the learn mission tells it. */
const sosParts = x => { const f = factor(x), bad = f.filter(([p, e]) => p % 4 === 3 && e % 2 === 1), three = f.filter(([p]) => p % 4 === 3), w = twoSquares(x), yes = bad.length ? 0 : 1, top = Math.floor(Math.sqrt(x / 2));
 const threeText = three.length === 1 ? `Its only prime that leaves remainder 3 on division by 4 is ${n(three[0][0])} (exponent ${n(three[0][1])}).` : three.length ? `Its primes that leave remainder 3 on division by 4 are ${listText(three.map(([p, e]) => `${n(p)} (exponent ${n(e)})`))}.` : 'None of its primes leaves remainder 3 on division by 4.';
 const waysText = yes ? `Trying a = 0 to ${n(top)}: ${w.map(([a, b]) => `${n(x)} = ${n(a)}² + ${n(b)}²`).join(', ')}. That is ${w.length === 1 ? '1 way' : `${n(w.length)} ways`}.` : 'So there are 0 ways.';
 return { f, bad, w, yes, threeText, waysText,
  verdict: yes ? `No such prime has an odd exponent, so ${n(x)} is a sum of two squares.` : `${three.length === 1 ? 'That prime has' : bad.length === 1 ? 'One of them has' : 'Some of them have'} an odd exponent, so ${n(x)} is not a sum of two squares.` }; };
const sosGuidance = (x, t) => [
 { prompt: `Factorise ${n(x)} into primes. How many of its primes that leave remainder 3 on division by 4 have an odd exponent?`, answer: [t.bad.length], explanation: `${n(x)} = ${factText(x)}. ${t.threeText}` },
 { prompt: `So is ${n(x)} a sum of two squares? Enter 1 for yes, 0 for no.`, answer: [t.yes], explanation: t.yes ? 'Every prime that leaves remainder 3 on division by 4 has an even exponent, so it is.' : 'A prime that leaves remainder 3 on division by 4 has an odd exponent, so it is not.' },
 { prompt: `In how many ways is ${n(x)} = a² + b² with 0 ≤ a ≤ b?`, answer: [t.w.length], explanation: t.waysText }
];

mk({
 id: 'q33b', parent: 'q33', kind: 'setting', title: 'Two slabs for the courtyard',
 brief: 'The courtyard must be covered with two square slabs of whole-metre sides, and the paving crew wants to know whether it can be and how.',
 labels: ['sum of two squares (1 or 0)', 'number of ways'], tolerance: 0.01,
 gl: [['such primes with odd exponent'], ['sum of two squares (1 or 0)'], ['number of ways']]
}, {
 /* A courtyard of 100 to 500 square metres, half the draws a sum of two squares and half not. */
 canonical: { x: 250 },
 draw: R => ({ x: R.bool() ? R.pick(SOS_YES) : R.pick(SOS_NO) }),
 build: ({ x }) => { const t = sosParts(x); return {
  prompt: `The courtyard of the Survey Field’s control post measures ${n(x)} square metres, and the crew wants to cover it exactly with two square slabs whose sides are whole numbers of metres, a and b with a ≤ b (a side of 0 means one single square slab covers it all). Enter 1 if the courtyard can be covered this way and 0 if it cannot, then the number of pairs a ≤ b with a² + b² = ${n(x)}.`,
  answer: [t.yes, t.w.length],
  hints: ['Sort the primes of the factorisation by their remainder on division by 4. If a prime that leaves remainder 3 has an odd exponent, the number is not a sum of two squares; otherwise it is.', 'To count the ways, try each a from 0 upwards while 2a² is at most the area, and check whether the area minus a² is a perfect square.'],
  solution: `${n(x)} = ${factText(x)}. ${t.threeText} ${t.verdict} ${t.waysText}`,
  guidance: sosGuidance(x, t) }; }
});

mk({
 id: 'q33c', parent: 'q33', kind: 'applied', title: 'Fencing two square paddocks',
 brief: 'A block is to be split into two square paddocks, and the crew needs the fencing for the most even split.',
 labels: ['number of splits', 'side a (m)', 'side b (m)', 'fencing (m)'], tolerance: 0.01,
 gl: [['number of splits'], ['side a (m)', 'side b (m)'], ['fencing (m)']]
}, {
 /* A block from 50 to 800 square metres with at least two splits into two real square paddocks (a at least 1). The most even split has the largest a.
    The block 65 of the learn mission is never used. */
 canonical: { x: 125 },
 draw: R => ({ x: R.pick(SOS_TWO) }),
 build: ({ x }) => { const w = twoSquares(x).filter(([a]) => a >= 1), [a, b] = w[w.length - 1], fence = 4 * a + 4 * b, top = Math.floor(Math.sqrt(x / 2)),
  list = w.map(([u, v]) => `${n(x)} = ${n(u)}² + ${n(v)}²`).join(', '); return {
  prompt: `A block of ${n(x)} square metres on the Survey Field is to be divided into exactly two square paddocks whose sides are whole numbers of metres, a and b with 1 ≤ a ≤ b. There can be several ways to choose the sides. The crew takes the most even split: the one with the largest a. Each paddock is fenced all the way round its own four sides, and no fence is shared. Enter the number of possible splits, then the sides a and b of the most even split, then the total length of fencing, all in metres.`,
  answer: [w.length, a, b, fence],
  hints: ['Try a = 1, 2, 3, … while 2a² is at most the area, and check whether the area minus a² is a perfect square b². Each success is one split.', 'The most even split has the largest a. A square with side s has a perimeter of 4 × s, and the two paddocks are fenced separately, so add the two perimeters.'],
  solution: `Trying a = 1 to ${n(top)} and checking whether ${n(x)} − a² is a perfect square: ${list}. That is ${n(w.length)} splits. The most even one has the largest a, so a = ${n(a)} and b = ${n(b)}. The fencing is 4 × ${n(a)} + 4 × ${n(b)} = ${n(4 * a)} + ${n(4 * b)} = ${n(fence)} metres.`,
  guidance: [
   { prompt: `Try a = 1, 2, 3, … while 2a² is at most ${n(x)}. In how many ways is ${n(x)} = a² + b² with 1 ≤ a ≤ b?`, answer: [w.length], explanation: `${list}. That is ${n(w.length)} splits.` },
   { prompt: 'The most even split has the largest a. What are a and b for that split?', answer: [a, b], explanation: `The largest a in the list is ${n(a)}, with ${n(x)} = ${n(a)}² + ${n(b)}², so b = ${n(b)}.` },
   { prompt: `Each paddock is fenced all the way round. What is the total length of fencing for the paddocks with sides ${n(a)} and ${n(b)}?`, answer: [fence], explanation: `4 × ${n(a)} + 4 × ${n(b)} = ${n(4 * a)} + ${n(4 * b)} = ${n(fence)} metres.` }
  ] }; }
});

mk({
 id: 'q33d', parent: 'q33', kind: 'challenge', title: 'The big estate blocks',
 brief: 'The estate blocks on the far side of the field are much larger, and each one still has to be checked for a two-square split.',
 labels: ['sum of two squares (1 or 0)', 'number of ways'], tolerance: 0.01,
 gl: [['such primes with odd exponent'], ['sum of two squares (1 or 0)'], ['number of ways']]
}, {
 /* A block of 501 to 2000 square metres, so that a runs up to 31: half the draws a sum of two squares and half not. */
 canonical: { x: 1105 },
 draw: R => ({ x: R.bool() ? R.pick(SOS_YES_BIG) : R.pick(SOS_NO_BIG) }),
 build: ({ x }) => { const t = sosParts(x); return {
  prompt: `An estate block on the far side of the Survey Field covers ${n(x)} square metres, and the surveyor wants to know whether it splits into two square plots whose sides are whole numbers of metres, a and b with a ≤ b (a side of 0 means one single square plot). Enter 1 if the block splits this way and 0 if it does not, then the number of pairs a ≤ b with a² + b² = ${n(x)}. Type the numbers without commas.`,
  answer: [t.yes, t.w.length],
  hints: ['A whole number is a sum of two squares exactly when every prime in its factorisation that leaves remainder 3 on division by 4 has an even exponent.', 'Try each a from 0 upwards while 2a² is at most the number, and count the values of a for which the number minus a² is a perfect square.'],
  solution: `${n(x)} = ${factText(x)}. ${t.threeText} ${t.verdict} ${t.waysText}`,
  guidance: sosGuidance(x, t) }; }
});

/* ---- q34 Fermat test and pseudoprimes [BC1.25] ---- */

/* Odd numbers from 101 to 599 (for b and c) and from 601 to 1999 (for d), sorted by what the base-2 test does with them:
   primes, composites that fail, and the pseudoprimes to base 2 (341 and 561; 645, 1105, 1387, 1729 and 1905). */
const oddRange = (lo, hi) => { const out = []; for (let x = lo; x <= hi; x += 2) out.push(x); return out; };
const fermatLists = (lo, hi) => { const odd = oddRange(lo, hi); return { prime: odd.filter(isPrime), pseudo: odd.filter(x => !isPrime(x) && pow(2, x - 1, x) === 1), fail: odd.filter(x => !isPrime(x) && pow(2, x - 1, x) !== 1) }; };
const F_SMALL = fermatLists(101, 599), F_BIG = fermatLists(601, 1999);
/* A sixth of the draws a pseudoprime, a third a prime, half a composite that fails. */
const drawFermat = (R, L) => { const kind = R.int(0, 5); return kind === 0 ? R.pick(L.pseudo) : kind <= 2 ? R.pick(L.prime) : R.pick(L.fail); };
/* The test to base 2 on x: the chain, the least residue, and the verdict in words. */
const fermatParts = x => { const c = chain(2, x - 1, x), r = c.r, pass = r === 1 ? 1 : 0, prime = isPrime(x);
 return { c, r, pass, proven: 1 - pass, prime, verdict: pass ? (prime ? `${n(x)} passes the test, and in fact ${n(x)} is prime.` : `${n(x)} passes the test, yet ${n(x)} = ${factText(x)} is composite, so the working above shows that it is a pseudoprime to base 2.`) : `${n(x)} fails the test, so it is certainly composite: ${n(x)} = ${factText(x)}.` }; };

mk({
 id: 'q34b', parent: 'q34', kind: 'setting', title: 'The permit number check',
 brief: 'The permit desk files every serial number that looks prime, and it wants a check that can only prove a serial composite.',
 labels: ['2ⁿ⁻¹ mod n', 'proved composite (1 or 0)'], tolerance: 0.01,
 gl: [['n − 1'], ['2ⁿ⁻¹ mod n'], ['proved composite (1 or 0)']]
}, {
 /* An odd serial from 101 to 599: a sixth of the draws a pseudoprime, a third a prime, half a composite that fails. */
 canonical: { x: 341 },
 draw: R => ({ x: drawFermat(R, F_SMALL) }),
 build: ({ x }) => { const t = fermatParts(x); return {
  prompt: `Plot permits on the Survey Field carry odd serial numbers, and the permit desk runs a quick check on a serial n before it files the serial as a prime. For n = ${n(x)}, enter 2ⁿ⁻¹ mod n, that is 2${sup(x - 1)} mod ${n(x)}, as a least residue, then 1 if the Fermat test proves that ${n(x)} is composite and 0 if it does not.`,
  answer: [t.r, t.proven],
  hints: ['Use repeated squaring: write n − 1 as a sum of powers of 2, square 2 again and again mod n, and multiply the squares you need, reducing mod n after every step.', 'A remainder other than 1 proves that n is composite. A remainder of 1 proves nothing: n is then either prime or a pseudoprime.'],
  solution: `${t.c.text} ${t.pass ? `The remainder is 1, so the test proves nothing about ${n(x)}. ${t.verdict}` : `The remainder is not 1, so the test proves that ${n(x)} is composite. ${t.verdict}`}`,
  guidance: [
   { prompt: `The test raises 2 to the power n − 1. What is that power for n = ${n(x)}?`, answer: [x - 1], explanation: `${n(x)} − 1 = ${n(x - 1)}.` },
   { prompt: `With repeated squaring, what is 2${sup(x - 1)} mod ${n(x)}?`, answer: [t.r], explanation: t.c.text },
   { prompt: `The remainder is ${n(t.r)}. Does the test prove that ${n(x)} is composite? Enter 1 for yes, 0 for no.`, answer: [t.proven], explanation: t.pass ? `A remainder of 1 proves nothing, so the answer is 0. ${t.verdict}` : `A remainder other than 1 proves that ${n(x)} is composite, so the answer is 1.` }
  ] }; }
});

mk({
 id: 'q34c', parent: 'q34', kind: 'applied', title: 'Two permits at the desk',
 brief: 'Two permit serials are waiting at the desk, and the clerk needs to know how many of them the quick check proves composite.',
 labels: ['2ⁿ⁻¹ mod n (first serial)', '2ⁿ⁻¹ mod n (second serial)', 'serials proved composite'], tolerance: 0.01,
 gl: [['2ⁿ⁻¹ mod n'], ['2ⁿ⁻¹ mod n'], ['serials proved composite']]
}, {
 /* Two different odd serials from 101 to 599, each drawn as in q34b. The second is redrawn at most 1000 times if it repeats the first, then replaced. */
 canonical: { x: 221, y: 561 },
 draw: R => { const x = drawFermat(R, F_SMALL); let y = x; for (let t = 0; t < 1000 && y === x; t++) y = drawFermat(R, F_SMALL); if (y === x) y = x === 101 ? 103 : 101; return { x, y }; },
 build: ({ x, y }) => { const A = fermatParts(x), B = fermatParts(y), count = A.proven + B.proven; return {
  prompt: `Two permit serials, ${n(x)} and ${n(y)}, are waiting at the Survey Field’s permit desk. Run the Fermat test to base 2 on each. A serial that fails is proved composite; a serial that passes is not proved anything. Enter 2ⁿ⁻¹ mod n for n = ${n(x)}, then for n = ${n(y)}, both as least residues, then how many of the two serials the test proves composite.`,
  answer: [A.r, B.r, count],
  hints: ['For each serial on its own, use repeated squaring: square 2 again and again mod n, multiply the squares that make up n − 1, and reduce mod n after every step.', 'A remainder other than 1 proves that the serial is composite. A remainder of 1 proves nothing. Count only the serials with a remainder other than 1.'],
  solution: `For n = ${n(x)}: ${A.c.text} ${A.pass ? 'The remainder is 1, so nothing is proved.' : 'The remainder is not 1, so the serial is proved composite.'} For n = ${n(y)}: ${B.c.text} ${B.pass ? 'The remainder is 1, so nothing is proved.' : 'The remainder is not 1, so the serial is proved composite.'} The test proves ${n(count)} of the two serials composite.`,
  guidance: [
   { prompt: `What is 2${sup(x - 1)} mod ${n(x)}?`, answer: [A.r], explanation: A.c.text },
   { prompt: `What is 2${sup(y - 1)} mod ${n(y)}?`, answer: [B.r], explanation: B.c.text },
   { prompt: `The remainders are ${n(A.r)} and ${n(B.r)}. A remainder other than 1 proves the serial composite. How many of the two serials does the test prove composite?`, answer: [count], explanation: `${n(x)} ${A.pass ? 'leaves 1, so nothing is proved' : 'does not leave 1, so it is proved composite'}, and ${n(y)} ${B.pass ? 'leaves 1, so nothing is proved' : 'does not leave 1, so it is proved composite'}: ${n(count)} in all.` }
  ] }; }
});

mk({
 id: 'q34d', parent: 'q34', kind: 'challenge', uses: 'q03', title: 'Hunting the false pass',
 brief: 'Some serials slip through the check although they are composite, and Mira wants the smallest factor that gives each one away.',
 labels: ['2ⁿ⁻¹ mod n', 'passes (1 or 0)', 'smallest prime factor'], tolerance: 0.01,
 gl: [['2ⁿ⁻¹ mod n'], ['passes (1 or 0)'], ['smallest prime factor']]
}, {
 /* An odd serial from 601 to 1999: a sixth of the draws a pseudoprime (645, 1105, 1387, 1729, 1905), a third a prime, half a composite that fails.
    The answers can reach 1999 (the smallest prime factor of a prime is the number itself), so the prompt says "without commas". */
 canonical: { x: 1105 },
 draw: R => ({ x: drawFermat(R, F_BIG) }),
 build: ({ x }) => { const t = fermatParts(x), spf = factor(x)[0][0], f = factor(x); return {
  prompt: `A long serial turns up at the Survey Field’s permit desk. For the odd number n = ${n(x)}, enter 2ⁿ⁻¹ mod n, that is 2${sup(x - 1)} mod ${n(x)}, as a least residue, then 1 if ${n(x)} passes the Fermat test (the remainder is 1) and 0 if it fails, then the smallest prime that divides ${n(x)} (that is ${n(x)} itself when ${n(x)} is prime). Type the numbers without commas.`,
  answer: [t.r, t.pass, spf],
  hints: ['Use repeated squaring: write n − 1 as a sum of powers of 2, square 2 again and again mod n, and multiply the squares you need, reducing mod n after every step.', 'For the smallest prime factor, try dividing by 2, 3, 5, 7, … in turn, stopping at the square root of n. If nothing divides n, then n is prime and is its own smallest prime factor.'],
  solution: `${t.c.text} ${t.verdict} Trial division: ${f.length === 1 && f[0][1] === 1 ? `no prime up to the square root of ${n(x)} divides it, so the smallest prime that divides ${n(x)} is ${n(x)} itself.` : `the smallest prime that divides ${n(x)} is ${n(spf)}, since ${n(x)} = ${n(spf)} × ${n(x / spf)}.`}`,
  guidance: [
   { prompt: `With repeated squaring, what is 2${sup(x - 1)} mod ${n(x)}?`, answer: [t.r], explanation: t.c.text },
   { prompt: `The remainder is ${n(t.r)}. Does ${n(x)} pass the Fermat test? Enter 1 for yes, 0 for no.`, answer: [t.pass], explanation: t.verdict },
   { prompt: `What is the smallest prime that divides ${n(x)}? Try 2, 3, 5, 7, … in turn.`, answer: [spf], explanation: f.length === 1 && f[0][1] === 1 ? `No prime up to the square root of ${n(x)} divides it, so ${n(x)} is prime and the answer is ${n(x)} itself.` : `${n(spf)} divides ${n(x)}: ${n(x)} = ${n(spf)} × ${n(x / spf)}, and no smaller prime does.` }
  ] }; }
});

/* ---- q35 Continued fractions of a fraction [R6.1] ---- */

/* Quotients a₀ … a₃ (a₃ at least 2, so the expansion is the unique one with four partial quotients) built into P/Q, scaled by a common factor g. The
   remainders of Euclid's algorithm on P and Q are g × (r0, r1, 1). */
const cfParts = ({ g, a0, a1, a2, a3 }) => { const r1 = a3, r0 = a2 * a3 + 1, q = a1 * r0 + r1, p = a0 * q + r0; return { g, a0, a1, a2, a3, P: g * p, Q: g * q, R0: g * r0, R1: g * r1, R2: g, T: a0 + a1 + a2 + a3 }; };

mk({
 id: 'q35b', parent: 'q35', kind: 'setting', title: 'Turns of the tower winch',
 brief: 'The winch on the key tower is set by a ratio of two turn counts, and Mira needs the whole numbers hidden inside it.',
 labels: ['a₀', 'a₁', 'a₂', 'a₃'], tolerance: 0.01,
 gl: [['a₀', 'remainder'], ['a₁', 'remainder'], ['a₂', 'remainder'], ['a₃']]
}, {
 /* P/Q = [a₀; a₁, a₂, a₃] with a₃ at least 2 and P below 1000. Not the parent's (2; 3, 1, 4), whose fraction is 43/19. */
 canonical: { a0: 3, a1: 2, a2: 2, a3: 3 },
 draw: R => { const p = { a0: R.int(1, 4), a1: R.int(1, 6), a2: R.int(1, 6), a3: R.int(2, 6) }; return p.a0 === 2 && p.a1 === 3 && p.a2 === 1 && p.a3 === 4 ? { a0: 3, a1: 2, a2: 2, a3: 3 } : p; },
 build: ({ a0, a1, a2, a3 }) => { const t = cfParts({ g: 1, a0, a1, a2, a3 }); return {
  prompt: `The winch on the Cipher Room’s key tower turns ${n(t.P)} times for every ${n(t.Q)} turns of its drum, so its ratio is ${n(t.P)}/${n(t.Q)}. Mira writes ratios as continued fractions, and this one has exactly four partial quotients. Enter a₀, a₁, a₂ and a₃, where ${n(t.P)}/${n(t.Q)} = [a₀; a₁, a₂, a₃].`,
  answer: [a0, a1, a2, a3],
  hints: ['Divide with remainder: the quotient of the top by the bottom is the first partial quotient. Then divide the old bottom by the remainder, and keep going, exactly as in Euclid’s algorithm.', 'Write down only the quotients, in order. Stop at the division whose remainder is 0.'],
  solution: `${n(t.P)} = ${n(a0)} × ${n(t.Q)} + ${n(t.R0)}, ${n(t.Q)} = ${n(a1)} × ${n(t.R0)} + ${n(t.R1)}, ${n(t.R0)} = ${n(a2)} × ${n(t.R1)} + 1 and ${n(t.R1)} = ${n(a3)} × 1 + 0. The quotients are ${n(a0)}, ${n(a1)}, ${n(a2)} and ${n(a3)}, so ${n(t.P)}/${n(t.Q)} = [${n(a0)}; ${n(a1)}, ${n(a2)}, ${n(a3)}].`,
  guidance: [
   { prompt: `Divide ${n(t.P)} by ${n(t.Q)}. What are the quotient a₀ and the remainder?`, answer: [a0, t.R0], explanation: `${n(t.P)} = ${n(a0)} × ${n(t.Q)} + ${n(t.R0)}.` },
   { prompt: `Divide ${n(t.Q)} by the remainder ${n(t.R0)}. What are the quotient a₁ and the new remainder?`, answer: [a1, t.R1], explanation: `${n(t.Q)} = ${n(a1)} × ${n(t.R0)} + ${n(t.R1)}.` },
   { prompt: `Divide ${n(t.R0)} by ${n(t.R1)}. What are the quotient a₂ and the new remainder?`, answer: [a2, 1], explanation: `${n(t.R0)} = ${n(a2)} × ${n(t.R1)} + 1.` },
   { prompt: `Divide ${n(t.R1)} by 1. What is the quotient a₃?`, answer: [a3], explanation: `${n(t.R1)} = ${n(a3)} × 1 + 0. The remainder is 0, so the expansion stops: [${n(a0)}; ${n(a1)}, ${n(a2)}, ${n(a3)}].` }
  ] }; }
});

mk({
 id: 'q35c', parent: 'q35', kind: 'applied', title: 'Slabs on the long floor',
 brief: 'The Cipher Room floor is to be covered with square slabs of the largest sizes that fit, and the fitter needs the slab count and the smallest size.',
 labels: ['total slabs', 'smallest side (dm)'], tolerance: 0.01,
 gl: [['slabs in round 1', 'strip left (dm)'], ['slabs in round 2', 'strip left (dm)'], ['total slabs', 'smallest side (dm)']]
}, {
 /* The rectangle P by Q is g times a rectangle p by q with p/q = [a₀; a₁, a₂, a₃], so the rounds of cutting are the four divisions of Euclid's algorithm:
    a₀ slabs of side Q, a₁ of side R0, a₂ of side R1 and a₃ of side g, which is the gcd. The total is a₀ + a₁ + a₂ + a₃. */
 canonical: { g: 3, a0: 2, a1: 2, a2: 3, a3: 2 },
 draw: R => ({ g: R.int(2, 6), a0: R.int(1, 5), a1: R.int(1, 6), a2: R.int(1, 6), a3: R.int(2, 6) }),
 build: p => { const t = cfParts(p), { g, a0, a1, a2, a3, P, Q, R0, R1, T } = t; return {
  prompt: `The Cipher Room floor is a rectangle ${n(P)} decimetres long and ${n(Q)} decimetres wide, and it is to be covered completely with square slabs whose sides are whole numbers of decimetres. The fitter works in rounds on the bare rectangle, starting with the whole floor. In each round the slabs have a side equal to the shorter side of the bare rectangle, as many as fit along its longer side are laid, and the bare strip left over becomes the new bare rectangle. The work stops when nothing is left bare. Enter the total number of slabs used, then the side of the smallest slab, in decimetres.`,
  answer: [T, g],
  hints: ['Each round is a division with remainder: the longer side divided by the shorter side. The quotient is the number of slabs laid in that round, and the remainder is the length of the bare strip that is left.', 'The next round uses slabs whose side is that remainder. Keep going until a division leaves remainder 0, add up the quotients, and look at the side of the slabs in the last round.'],
  solution: `Round 1: ${n(P)} = ${n(a0)} × ${n(Q)} + ${n(R0)}, so ${pl(a0, 'slab')} of side ${n(Q)} and a strip ${n(Q)} by ${n(R0)} is left. Round 2: ${n(Q)} = ${n(a1)} × ${n(R0)} + ${n(R1)}, so ${pl(a1, 'slab')} of side ${n(R0)}. Round 3: ${n(R0)} = ${n(a2)} × ${n(R1)} + ${n(g)}, so ${pl(a2, 'slab')} of side ${n(R1)}. Round 4: ${n(R1)} = ${n(a3)} × ${n(g)} + 0, so ${pl(a3, 'slab')} of side ${n(g)}, and nothing is left bare. The total is ${n(a0)} + ${n(a1)} + ${n(a2)} + ${n(a3)} = ${n(T)} slabs, and the smallest slab has side ${n(g)} decimetres.`,
  guidance: [
   { prompt: `Round 1 uses slabs of side ${n(Q)}, the shorter side. How many fit along the length ${n(P)}, and how long is the bare strip left over?`, answer: [a0, R0], explanation: `${n(P)} = ${n(a0)} × ${n(Q)} + ${n(R0)}: ${pl(a0, 'slab')}, and a strip ${n(Q)} by ${n(R0)} is left.` },
   { prompt: `The bare strip is ${n(Q)} by ${n(R0)}, so round 2 uses slabs of side ${n(R0)}. How many fit along the length ${n(Q)}, and how long is the strip left over?`, answer: [a1, R1], explanation: `${n(Q)} = ${n(a1)} × ${n(R0)} + ${n(R1)}: ${pl(a1, 'slab')}, and a strip ${n(R0)} by ${n(R1)} is left.` },
   { prompt: `Carry on in the same way until nothing is left bare. Counting every round, how many slabs are used in all, and what is the side of the smallest slab?`, answer: [T, g], explanation: `Round 3: ${n(R0)} = ${n(a2)} × ${n(R1)} + ${n(g)}, so ${pl(a2, 'slab')} of side ${n(R1)}. Round 4: ${n(R1)} = ${n(a3)} × ${n(g)} + 0, so ${pl(a3, 'slab')} of side ${n(g)}, and nothing is left. In all ${n(a0)} + ${n(a1)} + ${n(a2)} + ${n(a3)} = ${n(T)} slabs, and the smallest has side ${n(g)} decimetres.` }
  ] }; }
});

mk({
 id: 'q35d', parent: 'q35', kind: 'challenge', uses: 'q06', title: 'Euclid on the cable lengths',
 brief: 'Two cable lengths share a common measure, and Mira wants that measure and the whole numbers hidden in their ratio.',
 labels: ['gcd', 'a₀', 'a₁', 'a₂', 'a₃'], tolerance: 0.01,
 gl: [['a₀', 'remainder'], ['a₁', 'remainder'], ['a₂', 'remainder'], ['a₃', 'gcd']]
}, {
 /* P and Q have a common factor g from 2 to 9, so P/Q is not in lowest terms: Euclid's algorithm on P and Q gives the quotients of the reduced
    fraction and ends on the gcd g. P is at most 18801 and is not an answer. */
 canonical: { g: 4, a0: 2, a1: 3, a2: 2, a3: 3 },
 draw: R => ({ g: R.int(2, 9), a0: R.int(1, 9), a1: R.int(1, 6), a2: R.int(1, 6), a3: R.int(2, 6) }),
 build: p => { const t = cfParts(p), { g, a0, a1, a2, a3, P, Q, R0, R1 } = t; return {
  prompt: `Two cables in the Cipher Room are ${n(P)} and ${n(Q)} centimetres long, and Mira compares them as the fraction ${n(P)}/${n(Q)}, which is not in lowest terms. Run Euclid’s algorithm on ${n(P)} and ${n(Q)}. Enter the gcd of the two lengths, then a₀, a₁, a₂ and a₃, where ${n(P)}/${n(Q)} = [a₀; a₁, a₂, a₃] has exactly four partial quotients.`,
  answer: [g, a0, a1, a2, a3],
  hints: ['Divide with remainder, then divide the old bottom by the remainder, and keep going. The quotients, in order, are the partial quotients.', 'The last remainder that is not 0 is the gcd of the two lengths. The expansion stops at the division whose remainder is 0.'],
  solution: `${n(P)} = ${n(a0)} × ${n(Q)} + ${n(R0)}, ${n(Q)} = ${n(a1)} × ${n(R0)} + ${n(R1)}, ${n(R0)} = ${n(a2)} × ${n(R1)} + ${n(g)} and ${n(R1)} = ${n(a3)} × ${n(g)} + 0. The last remainder that is not 0 is ${n(g)}, so the gcd is ${n(g)}. The quotients are ${n(a0)}, ${n(a1)}, ${n(a2)} and ${n(a3)}, so ${n(P)}/${n(Q)} = [${n(a0)}; ${n(a1)}, ${n(a2)}, ${n(a3)}].`,
  guidance: [
   { prompt: `Divide ${n(P)} by ${n(Q)}. What are the quotient a₀ and the remainder?`, answer: [a0, R0], explanation: `${n(P)} = ${n(a0)} × ${n(Q)} + ${n(R0)}.` },
   { prompt: `Divide ${n(Q)} by the remainder ${n(R0)}. What are the quotient a₁ and the new remainder?`, answer: [a1, R1], explanation: `${n(Q)} = ${n(a1)} × ${n(R0)} + ${n(R1)}.` },
   { prompt: `Divide ${n(R0)} by ${n(R1)}. What are the quotient a₂ and the new remainder?`, answer: [a2, g], explanation: `${n(R0)} = ${n(a2)} × ${n(R1)} + ${n(g)}.` },
   { prompt: `Divide ${n(R1)} by ${n(g)}. What is the quotient a₃, and what is the gcd, the last remainder that is not 0?`, answer: [a3, g], explanation: `${n(R1)} = ${n(a3)} × ${n(g)} + 0. The remainder is 0, so the expansion stops at [${n(a0)}; ${n(a1)}, ${n(a2)}, ${n(a3)}], and the gcd is the last remainder that is not 0: ${n(g)}.` }
  ] }; }
});

})();
