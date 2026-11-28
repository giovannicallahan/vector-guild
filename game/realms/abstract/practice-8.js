/* Abstract algebra: patterns of moves practice missions, file 8 of 8: concepts q36–q40, three practice missions each
   (q36b q36c q36d q37b q37c q37d q38b q38c q38d q39b q39c q39d q40b q40c q40d).
   Format and rules: docs/PACK-FORMAT.md, "Practice missions" (§10).
     b  kind 'setting'    the same skill in a new real-world setting
     c  kind 'applied'    a word problem with two or three steps (two or three guided steps)
     d  kind 'challenge'  harder numbers, or the skill combined with one earlier concept (optional `uses: 'qNN'`)
   A practice mission supplies only: id, parent, kind, title, brief, prompt, answer, labels, tolerance, hints,
   solution, guidance (and `uses` for a challenge). Everything else comes from its parent, the learn mission:
   topic, tier, xp, sector, lesson, teaching, sources, the concept bench and the review drill. Do not write those.
   Each mission is registered together with its generator by add(mission, generator); build(canonical) must
   reproduce the authored prompt, hints, solution and guidance exactly. Oracles: qa/realms/abstract/oracle-p8.js. */
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
/* Small number helpers. */
const gcd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a; };
const mod = (a, m) => ((a % m) + m) % m;
const inv = (a, p) => { for (let x = 1; x < p; x++) if (mod(a * x, p) === 1) return x; return 0; };
const phi = m => { let c = 0; for (let i = 1; i <= m; i++) if (gcd(i, m) === 1) c++; return c; };
const primesOf = m => { const out = []; let x = m; for (let p = 2; p * p <= x; p++) if (x % p === 0) { let e = 0; while (x % p === 0) { x /= p; e++; } out.push([p, e]); } if (x > 1) out.push([x, 1]); return out; };
const SUP = '⁰¹²³⁴⁵⁶⁷⁸⁹', SUB = '₀₁₂₃₄₅₆₇₈₉';
const sup = k => String(k).split('').map(d => SUP[+d]).join('');
const Z = m => 'Z' + String(m).split('').map(d => SUB[+d]).join('');
const pw = (p, e) => `${n(p)}${sup(e)}`;
const pl = (k, one, many) => `${n(k)} ${k === 1 ? one : (many || one + 's')}`;
const list = xs => xs.length === 1 ? xs[0] : xs.slice(0, -1).join(', ') + ' and ' + xs[xs.length - 1];
/* A monic polynomial from its lower coefficients (x^(d−1) down to the constant): poly([3, 1]) is "x² + 3x + 1". */
const poly = cs => { const d = cs.length; let s = `x${sup(d)}`.replace(/x¹$/, 'x');
 cs.forEach((c, i) => { const e = d - 1 - i; if (!c) return; s += ` + ${e === 0 ? n(c) : `${c === 1 ? '' : n(c)}x${e === 1 ? '' : sup(e)}`}`; }); return s; };
const pval = (cs, x) => { let v = 1; for (const c of cs) v = v * x + c; return v; };
const valsOf = (cs, p) => { const v = []; for (let r = 0; r < p; r++) v.push(mod(pval(cs, r), p)); return v; };
const rootsOf = vals => vals.map((v, r) => v === 0 ? r : -1).filter(r => r >= 0);
const euclid = (a, b) => { const steps = []; let x = Math.max(a, b), y = Math.min(a, b); while (y) { const q = Math.floor(x / y), r = x % y; steps.push(`${n(x)} = ${n(q)} × ${n(y)} + ${n(r)}`); [x, y] = [y, r]; } return { steps, g: x }; };
const GF = []; for (const p of [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47]) for (let k = 2; Math.pow(p, k) < 2500; k++) if (!(p === 2 && k === 3)) GF.push({ p, k });
/* A difference written out and reduced: redu(−2, 11) is "−2, which is 9 mod 11"; a value already in range is left alone. */
const redu = (x, p) => x >= 0 && x < p ? n(x) : `${n(x)}, which is ${n(mod(x, p))} mod ${n(p)}`;
const PR = [5, 7, 11, 13, 17, 19, 23, 29, 31];

/* ---- q36 Fields: dividing in Z_p [16.4] ---- */

/* q36b: a keypad scrambles a key number m into (am + b) mod p; decode it. Not the worked example (p 7, 3, 2, reading 6). */
mk({ id: 'q36b', parent: 'q36', kind: 'setting', title: 'Decoding the keypad',
 brief: 'The vault keypad scrambles every key number before it is shown, and the crew must work back from the readout to the key that was pressed.',
 labels: ['inverse of a', 'key number m'], tolerance: 0.01, gl: [['c − b mod p'], ['inverse of a'], ['key number m']] }, {
 canonical: { p: 13, a: 5, b: 4, m: 9 },
 draw: R => { for (let i = 0; i < 1000; i++) { const p = R.pick(PR), q = { p, a: R.int(2, p - 1), b: R.int(1, p - 1), m: R.int(0, p - 1) }; if (!(p === 7 && q.a === 3 && q.b === 2 && mod(3 * q.m + 2, 7) === 6)) return q; } return { p: 13, a: 5, b: 4, m: 9 }; },
 build: ({ p, a, b, m }) => { const c = mod(a * m + b, p), d = mod(c - b, p), ia = inv(a, p); return {
  prompt: `A keypad in the Cipher Vault works in the field ${Z(p)}. It scrambles each key number m, a whole number from 0 to ${n(p - 1)}, into (${n(a)}m + ${n(b)}) mod ${n(p)} before showing it, and today the readout is ${n(c)}. Enter the inverse of ${n(a)} in ${Z(p)}, then the key number m that was pressed.`,
  answer: [ia, m],
  hints: ['Undo the scrambling in reverse order: take away the constant (mod p), then multiply by the inverse of the multiplier.', 'The inverse of a in Zₚ is the number y from 1 to p − 1 with a × y mod p = 1.'],
  solution: `Take away ${n(b)}: ${n(a)}m mod ${n(p)} = (${n(c)} − ${n(b)}) mod ${n(p)} = ${n(d)}. The inverse of ${n(a)} is ${n(ia)}, since ${n(a)} × ${n(ia)} = ${n(a * ia)}, which is 1 mod ${n(p)}. So m = ${n(d)} × ${n(ia)} mod ${n(p)} = ${n(d * ia)} mod ${n(p)} = ${n(m)}. Check: ${n(a)} × ${n(m)} + ${n(b)} = ${n(a * m + b)}, which is ${n(c)} mod ${n(p)}.`,
  guidance: [
   { prompt: `Take ${n(b)} away from the readout ${n(c)}. What is (${n(c)} − ${n(b)}) mod ${n(p)}?`, answer: [d], explanation: `${n(c)} − ${n(b)} = ${redu(c - b, p)}. So ${n(a)}m mod ${n(p)} = ${n(d)}.` },
   { prompt: `Which y from 1 to ${n(p - 1)} has ${n(a)} × y mod ${n(p)} = 1?`, answer: [ia], explanation: `${n(a)} × ${n(ia)} = ${n(a * ia)}, which is 1 more than a multiple of ${n(p)}, so the inverse of ${n(a)} is ${n(ia)}.` },
   { prompt: `Multiply ${n(d)} by the inverse ${n(ia)} and reduce mod ${n(p)}. What is the key number m?`, answer: [m], explanation: `${n(d)} × ${n(ia)} = ${n(d * ia)}, which is ${n(m)} mod ${n(p)}.` }
  ] }; }
});

/* q36c: two linked dials; solve for dial A, then read dial B. */
mk({ id: 'q36c', parent: 'q36', kind: 'applied', title: 'Two linked dials',
 brief: 'Two dials on the vault door are geared together, and the crew knows only the rule that fixes the first.',
 labels: ['inverse of a', 'x', 'y'], tolerance: 0.01, gl: [['inverse of a'], ['x'], ['reading y']] }, {
 canonical: { p: 13, a: 5, b: 4, x: 8, d: 6 },
 draw: R => { const p = R.pick(PR); return { p, a: R.int(2, p - 1), b: R.int(1, p - 1), x: R.int(1, p - 1), d: R.int(2, p - 1) }; },
 build: ({ p, a, b, x, d }) => { const c = mod(a * x + b, p), e = mod(c - b, p), ia = inv(a, p), y = mod(d * x, p); return {
  prompt: `Two dials in the field ${Z(p)} are geared together. Dial A is set at x, a whole number from 0 to ${n(p - 1)}, and obeys (${n(a)}x + ${n(b)}) mod ${n(p)} = ${n(c)}. Dial B is geared to dial A so that it reads y = (${n(d)} × x) mod ${n(p)}. Enter the inverse of ${n(a)} in ${Z(p)}, then x, then the reading y of dial B.`,
  answer: [ia, x, y],
  hints: ['Find x as in any field: take away the constant (mod p), then multiply by the inverse of the coefficient.', 'Once x is known, dial B is just a product, reduced mod p.'],
  solution: `Take away ${n(b)}: ${n(a)}x mod ${n(p)} = (${n(c)} − ${n(b)}) mod ${n(p)} = ${n(e)}. The inverse of ${n(a)} is ${n(ia)}, since ${n(a)} × ${n(ia)} = ${n(a * ia)}, which is 1 mod ${n(p)}. So x = ${n(e)} × ${n(ia)} mod ${n(p)} = ${n(e * ia)} mod ${n(p)} = ${n(x)}. Then y = ${n(d)} × ${n(x)} mod ${n(p)} = ${n(d * x)} mod ${n(p)} = ${n(y)}.`,
  guidance: [
   { prompt: `Which number c from 1 to ${n(p - 1)} has ${n(a)} × c mod ${n(p)} = 1?`, answer: [ia], explanation: `${n(a)} × ${n(ia)} = ${n(a * ia)}, which is 1 more than a multiple of ${n(p)}, so the inverse of ${n(a)} is ${n(ia)}.` },
   { prompt: `Taking ${n(b)} away leaves ${n(a)}x mod ${n(p)} = ${n(e)}. Multiply ${n(e)} by the inverse ${n(ia)} and reduce mod ${n(p)}. What is x?`, answer: [x], explanation: `${n(e)} × ${n(ia)} = ${n(e * ia)}, which is ${n(x)} mod ${n(p)}.` },
   { prompt: `Dial B reads (${n(d)} × x) mod ${n(p)}. What does it read?`, answer: [y], explanation: `${n(d)} × ${n(x)} = ${n(d * x)}, which is ${n(y)} mod ${n(p)}.` }
  ] }; }
});

/* q36d: both sides carry x; a larger prime. */
mk({ id: 'q36d', parent: 'q36', kind: 'challenge', title: 'Dials that must agree',
 brief: 'Two locks on the strongest vault door must show the same reading, and the crew needs the one shared setting that does it.',
 labels: ['(a − d) mod p', 'x'], tolerance: 0.01, gl: [['(a − d) mod p'], ['inverse of (a − d)'], ['x']] }, {
 canonical: { p: 37, a: 25, d: 11, b: 8, e: 30 },
 draw: R => { for (let i = 0; i < 1000; i++) { const p = R.pick([37, 41, 43, 47, 53, 59, 61]), a = R.int(2, p - 1), d = R.int(2, p - 1), b = R.int(1, p - 1), e = R.int(1, p - 1); if (mod(a - d, p) >= 2 && b !== e) return { p, a, d, b, e }; } return { p: 37, a: 25, d: 11, b: 8, e: 30 }; },
 build: ({ p, a, d, b, e }) => { const u = mod(a - d, p), v = mod(e - b, p), iu = inv(u, p), x = mod(v * iu, p); return {
  prompt: `Two locks in the field ${Z(p)} must give the same reading. Lock one reads (${n(a)}x + ${n(b)}) mod ${n(p)} and lock two reads (${n(d)}x + ${n(e)}) mod ${n(p)}, where x is the shared setting, a whole number from 0 to ${n(p - 1)}. The locks agree when ${n(a)}x + ${n(b)} = ${n(d)}x + ${n(e)} in ${Z(p)}; taking ${n(d)}x and ${n(b)} away from both sides leaves (${n(a)} − ${n(d)}) × x = ${n(e)} − ${n(b)}. Enter the number (${n(a)} − ${n(d)}) mod ${n(p)}, then the setting x at which the locks agree.`,
  answer: [u, x],
  hints: ['Reduce the coefficient and the right-hand side mod p first, then solve as in any field: multiply by the inverse of the coefficient.', 'To find an inverse in a larger field, list the numbers 1, p + 1, 2p + 1, … and stop at the first one that the coefficient divides exactly; the quotient is the inverse.'],
  solution: `(${n(a)} − ${n(d)}) mod ${n(p)} = ${n(u)}, and (${n(e)} − ${n(b)}) mod ${n(p)} = ${n(v)}. So ${n(u)}x mod ${n(p)} = ${n(v)}. The inverse of ${n(u)} is ${n(iu)}, since ${n(u)} × ${n(iu)} = ${n(u * iu)}, which is 1 mod ${n(p)}. So x = ${n(v)} × ${n(iu)} mod ${n(p)} = ${n(v * iu)} mod ${n(p)} = ${n(x)}. Check: ${n(a)} × ${n(x)} + ${n(b)} = ${n(a * x + b)} and ${n(d)} × ${n(x)} + ${n(e)} = ${n(d * x + e)}, both ${n(mod(a * x + b, p))} mod ${n(p)}.`,
  guidance: [
   { prompt: `What is (${n(a)} − ${n(d)}) mod ${n(p)}?`, answer: [u], explanation: `${n(a)} − ${n(d)} = ${redu(a - d, p)}. The right-hand side, ${n(e)} − ${n(b)}, is ${n(v)} mod ${n(p)}.` },
   { prompt: `Which y from 1 to ${n(p - 1)} has ${n(u)} × y mod ${n(p)} = 1?`, answer: [iu], explanation: `${n(u)} × ${n(iu)} = ${n(u * iu)}, which is 1 more than a multiple of ${n(p)}, so the inverse of ${n(u)} is ${n(iu)}.` },
   { prompt: `Now ${n(u)}x mod ${n(p)} = ${n(v)}. Multiply ${n(v)} by the inverse ${n(iu)} and reduce mod ${n(p)}. What is x?`, answer: [x], explanation: `${n(v)} × ${n(iu)} = ${n(v * iu)}, which is ${n(x)} mod ${n(p)}.` }
  ] }; }
});

/* ---- q37 Polynomials over Z_p [17.1, 17.2] ---- */

/* q37b: a relay's check polynomial. Same skill as q37; never x² + 1 over Z₅, the worked example. */
const draw37 = (R, ps, deg) => { for (let i = 0; i < 1000; i++) { const p = R.pick(ps), d = R.pick(deg), cs = []; for (let j = 0; j < d - 1; j++) cs.push(R.int(0, p - 1)); cs.push(R.int(1, p - 1)); if (!(p === 5 && d === 2 && cs[0] === 0 && cs[1] === 1)) return { p, cs }; } return { p: 7, cs: [1, 4] }; };
mk({ id: 'q37b', parent: 'q37', kind: 'setting', title: 'The relay check code',
 brief: 'Every message through the relay mast carries a check polynomial, and the crew must test it at one probe value and count the values it zeroes.',
 labels: ['remainder', 'roots'], tolerance: 0.01, gl: [['remainder'], ['roots']] }, {
 canonical: { p: 7, cs: [3, 1], a: 4 },
 draw: R => { const q = draw37(R, [3, 5, 7], [2, 3]); q.a = R.int(1, q.p - 1); return q; },
 build: ({ p, cs, a }) => { const f = poly(cs), vals = valsOf(cs, p), fa = pval(cs, a), rem = mod(fa, p), roots = rootsOf(vals); return {
  prompt: `Each message through the relay mast carries a check polynomial f(x) = ${f}, with coefficients in ${Z(p)} and all arithmetic done mod ${n(p)}. The mast divides f(x) by x − ${n(a)}, where ${n(a)} is a probe value from 0 to ${n(p - 1)}. Enter the remainder it gets, then how many roots f has in ${Z(p)}: the values r from 0 to ${n(p - 1)} that make f(r) mod ${n(p)} = 0.`,
  answer: [rem, roots.length],
  hints: ['If f(x) = (x − a) × q(x) + remainder, then putting x = a leaves only the remainder, so the remainder is f(a) reduced mod p.', 'The field is small, so try every r from 0 to p − 1 and count the zeros.'],
  solution: `The remainder is f(${n(a)}) = ${n(fa)}, which is ${n(rem)} mod ${n(p)}. For r = 0 to ${n(p - 1)}, f(r) mod ${n(p)} is ${list(vals.map(n))}. ${roots.length === 0 ? 'None of them is 0, so f has no roots' : `It is 0 at r = ${list(roots.map(n))}, so f has ${pl(roots.length, 'root')}`} in ${Z(p)}.`,
  guidance: [
   { prompt: `Work out f(${n(a)}) and reduce it mod ${n(p)}. What is the remainder on dividing by x − ${n(a)}?`, answer: [rem], explanation: `f(${n(a)}) = ${n(fa)}, and ${n(fa)} mod ${n(p)} = ${n(rem)}.` },
   { prompt: `The values of f(r) mod ${n(p)} for r = 0 to ${n(p - 1)} are ${list(vals.map(n))}. How many roots does f have in ${Z(p)}?`, answer: [roots.length], explanation: roots.length === 0 ? 'No value is 0, so there are no roots.' : `The value is 0 at r = ${list(roots.map(n))}: ${pl(roots.length, 'root')}.` }
  ] }; }
});

/* q37c: two code strands added; remainders add. */
mk({ id: 'q37c', parent: 'q37', kind: 'applied', title: 'Two code strands',
 brief: 'The vault tape carries two code strands that the checker adds together, and the crew must predict what the checker will see.',
 labels: ['remainder of f', 'remainder of g', 'remainder of f + g'], tolerance: 0.01, gl: [['remainder of f'], ['remainder of g'], ['remainder of f + g']] }, {
 canonical: { p: 7, f: [2, 5], g: [3, 4], a: 3 },
 draw: R => { for (let i = 0; i < 1000; i++) { const p = R.pick([5, 7]), df = R.int(2, 3), f = [], g = [R.int(0, p - 1), R.int(1, p - 1)]; for (let j = 0; j < df; j++) f.push(R.int(j === df - 1 ? 1 : 0, p - 1)); if (df === 2 && f[0] === g[0] && f[1] === g[1]) continue; return { p, f, g, a: R.int(1, p - 1) }; } return { p: 7, f: [2, 5], g: [3, 4], a: 3 }; },
 build: ({ p, f, g, a }) => { const rf = mod(pval(f, a), p), rg = mod(pval(g, a), p), rs = mod(rf + rg, p); return {
  prompt: `The vault tape carries two code strands with coefficients in ${Z(p)}, all arithmetic mod ${n(p)}: f(x) = ${poly(f)} and g(x) = ${poly(g)}. The checker adds the two strands coefficient by coefficient into f(x) + g(x) and divides the sum by x − ${n(a)}, where ${n(a)} is a number from 0 to ${n(p - 1)}. The remainder of the sum is the sum of the two separate remainders, reduced mod ${n(p)}. Enter the remainder of f(x) on division by x − ${n(a)}, the remainder of g(x), then the remainder the checker gets for f(x) + g(x).`,
  answer: [rf, rg, rs],
  hints: ['Dividing by x − a leaves f(a) reduced mod p, whatever the polynomial.', 'Add the two remainders and reduce mod p; there is no need to add the strands first.'],
  solution: `The remainder of f is f(${n(a)}) = ${n(pval(f, a))}, which is ${n(rf)} mod ${n(p)}. The remainder of g is g(${n(a)}) = ${n(pval(g, a))}, which is ${n(rg)} mod ${n(p)}. For the sum, ${n(rf)} + ${n(rg)} = ${n(rf + rg)}, which is ${n(rs)} mod ${n(p)}.`,
  guidance: [
   { prompt: `Work out f(${n(a)}) and reduce it mod ${n(p)}. What is the remainder of f on division by x − ${n(a)}?`, answer: [rf], explanation: `f(${n(a)}) = ${n(pval(f, a))}, and ${n(pval(f, a))} mod ${n(p)} = ${n(rf)}.` },
   { prompt: `Work out g(${n(a)}) and reduce it mod ${n(p)}. What is the remainder of g on division by x − ${n(a)}?`, answer: [rg], explanation: `g(${n(a)}) = ${n(pval(g, a))}, and ${n(pval(g, a))} mod ${n(p)} = ${n(rg)}.` },
   { prompt: `Add the two remainders ${n(rf)} and ${n(rg)} and reduce mod ${n(p)}. What remainder does the checker get for the sum?`, answer: [rs], explanation: `${n(rf)} + ${n(rg)} = ${n(rf + rg)}, which is ${n(rs)} mod ${n(p)}.` }
  ] }; }
});

/* q37d: a cubic over a larger field, two probes and the roots. */
mk({ id: 'q37d', parent: 'q37', kind: 'challenge', title: 'The long code check',
 brief: 'The strongest vault code is a cubic over a bigger dial, and the crew probes it twice before screening every setting for roots.',
 labels: ['first remainder', 'second remainder', 'roots'], tolerance: 0.01, gl: [['first remainder'], ['second remainder'], ['roots']] }, {
 canonical: { p: 11, cs: [3, 0, 5], a: 2, b: 9 },
 draw: R => { const p = R.pick([11, 13]), cs = [R.int(0, p - 1), R.int(0, p - 1), R.int(1, p - 1)], a = R.int(1, p - 1); return { p, cs, a, b: R.except(1, p - 1, [a]) }; },
 build: ({ p, cs, a, b }) => { const f = poly(cs), vals = valsOf(cs, p), ra = mod(pval(cs, a), p), rb = mod(pval(cs, b), p), roots = rootsOf(vals); return {
  prompt: `The vault’s long code is the cubic f(x) = ${f} over ${Z(p)}, with all arithmetic mod ${n(p)}. The crew probes it by dividing by x − ${n(a)} and then by x − ${n(b)}, and then screens it for roots. Enter the remainder on dividing by x − ${n(a)}, the remainder on dividing by x − ${n(b)}, then how many roots f has in ${Z(p)}: the values r from 0 to ${n(p - 1)} that make f(r) mod ${n(p)} = 0.`,
  answer: [ra, rb, roots.length],
  hints: ['The remainder on dividing by x − a is f(a) reduced mod p. Reduce each power as you go, so that the numbers stay small.', 'A cubic over a field has at most 3 roots. Work out f(r) mod p for every r from 0 to p − 1 and count the zeros.'],
  solution: `The first remainder is f(${n(a)}) = ${n(pval(cs, a))}, which is ${n(ra)} mod ${n(p)}. The second is f(${n(b)}) = ${n(pval(cs, b))}, which is ${n(rb)} mod ${n(p)}. For r = 0 to ${n(p - 1)}, f(r) mod ${n(p)} is ${list(vals.map(n))}. ${roots.length === 0 ? 'None of them is 0, so f has no roots' : `It is 0 at r = ${list(roots.map(n))}, so f has ${pl(roots.length, 'root')}`} in ${Z(p)}.`,
  guidance: [
   { prompt: `Work out f(${n(a)}) and reduce it mod ${n(p)}. What is the remainder on dividing by x − ${n(a)}?`, answer: [ra], explanation: `f(${n(a)}) = ${n(pval(cs, a))}, and ${n(pval(cs, a))} mod ${n(p)} = ${n(ra)}.` },
   { prompt: `Work out f(${n(b)}) and reduce it mod ${n(p)}. What is the remainder on dividing by x − ${n(b)}?`, answer: [rb], explanation: `f(${n(b)}) = ${n(pval(cs, b))}, and ${n(pval(cs, b))} mod ${n(p)} = ${n(rb)}.` },
   { prompt: `The values of f(r) mod ${n(p)} for r = 0 to ${n(p - 1)} are ${list(vals.map(n))}. How many roots does f have in ${Z(p)}?`, answer: [roots.length], explanation: roots.length === 0 ? 'No value is 0, so there are no roots.' : `The value is 0 at r = ${list(roots.map(n))}: ${pl(roots.length, 'root')}.` }
  ] }; }
});

/* ---- q38 Ideals in the integers [16.5] ---- */

/* q38b: a change machine; the generator and how many of 1..N it can make. Not 12 and 18, the worked example. */
mk({ id: 'q38b', parent: 'q38', kind: 'setting', title: 'The change machine',
 brief: 'The vault’s change machine pays out and takes back chips of two values, and the crew wants to know which amounts it can make.',
 labels: ['smallest net amount', 'amounts from 1 to N'], tolerance: 0.01, gl: [['gcd'], ['amounts it can make']] }, {
 canonical: { a: 20, b: 30, N: 85 },
 draw: R => { for (let i = 0; i < 1000; i++) { const a = R.int(6, 90), b = R.int(6, 90), g = gcd(a, b); if (a === b || g < 2 || a % b === 0 || b % a === 0 || (a === 12 && b === 18) || (a === 18 && b === 12)) continue; return { a, b, N: R.int(40, 300) }; } return { a: 20, b: 30, N: 85 }; },
 build: ({ a, b, N }) => { const e = euclid(a, b), g = e.g, q = Math.floor(N / g), r = N % g; return {
  prompt: `A change machine at the Cipher Vault pays out chips worth ${n(a)} credits and ${n(b)} credits, and it takes chips back as well. A net amount c is possible when c = ${n(a)}x + ${n(b)}y for some whole numbers x and y, which may be negative. These amounts form an ideal of the integers. Enter the smallest positive net amount the machine can make, then how many of the whole amounts from 1 to ${n(N)} credits it can make.`,
  answer: [g, q],
  hints: ['Every ideal of the integers is all the multiples of its smallest positive member, and for the ideal made by a and b that member is gcd(a, b). Euclid’s algorithm finds it.', 'The amounts it can make are the multiples of that number, so count the multiples from 1 up to the limit: divide the limit by it and drop any remainder.'],
  solution: `Euclid’s algorithm: ${e.steps.join('; ')}. So gcd(${n(a)}, ${n(b)}) = ${n(g)}, and the smallest positive net amount is ${n(g)}. Every amount the machine can make is a multiple of ${n(g)}, and every multiple of ${n(g)} can be made. The multiples of ${n(g)} from 1 to ${n(N)} are ${n(g)} × 1 up to ${n(g)} × ${n(q)}: ${n(N)} ÷ ${n(g)} is ${n(q)} with ${n(r)} left over, so there are ${n(q)}.`,
  guidance: [
   { prompt: `Use Euclid’s algorithm on ${n(a)} and ${n(b)}. What is their gcd?`, answer: [g], explanation: `${e.steps.join('; ')}. The last non-zero remainder is ${n(g)}.` },
   { prompt: `The machine makes exactly the multiples of ${n(g)}. How many of them lie from 1 to ${n(N)}?`, answer: [q], explanation: `${n(N)} ÷ ${n(g)} is ${n(q)} with ${n(r)} left over, so the multiples are ${n(g)} × 1 up to ${n(g)} × ${n(q)}: ${n(q)} of them.` }
  ] }; }
});

/* q38c: three pallet sizes; the ideal made by three numbers, built by two gcds. */
mk({ id: 'q38c', parent: 'q38', kind: 'applied', title: 'The pallet crane',
 brief: 'The depot crane lifts pallets of three sizes, adding and removing them, and the crew must find which net loads are possible.',
 labels: ['gcd of the first two', 'generator', 'possible (1 or 0)'], tolerance: 0.01, gl: [['gcd of the first two'], ['generator'], ['possible (1 or 0)']] }, {
 canonical: { a: 24, b: 36, c: 50, t: 90 },
 draw: R => { for (let i = 0; i < 1000; i++) { const g = R.pick([2, 3, 4, 5, 6, 7]), k = R.pick([2, 3, 4]), g1 = g * k, s1 = R.int(1, 5), s2 = R.int(1, 5), m = R.int(2, 15); if (s1 === s2 || gcd(s1, s2) !== 1 || gcd(m, k) !== 1) continue; const t = R.bool() ? g * R.int(Math.ceil(20 / g), Math.floor(300 / g)) : g * R.int(Math.ceil(20 / g), Math.floor(300 / g) - 1) + R.int(1, g - 1); return { a: g1 * s1, b: g1 * s2, c: g * m, t }; } return { a: 24, b: 36, c: 50, t: 90 }; },
 build: ({ a, b, c, t }) => { const e1 = euclid(a, b), g1 = e1.g, e2 = euclid(g1, c), g = e2.g, inI = t % g === 0 ? 1 : 0, q = Math.floor(t / g), r = t % g; return {
  prompt: `The Sorting Depot’s crane lifts pallets of three sizes: ${n(a)} kg, ${n(b)} kg and ${n(c)} kg. In one load it may add or take off any whole number of pallets of each size, so a net load of w kg is possible when w = ${n(a)}x + ${n(b)}y + ${n(c)}z for some whole numbers x, y and z, which may be negative. These loads form an ideal of the integers, generated by the gcd of all three sizes. Find it in two steps: the gcd of the first two sizes, then the gcd of that number and the third size. Enter the gcd of the first two sizes, then the number that generates the ideal, then 1 if a net load of ${n(t)} kg is possible and 0 if it is not.`,
  answer: [g1, g, inI],
  hints: ['The gcd of three numbers is the gcd of (the gcd of the first two) and the third. Euclid’s algorithm does each step.', 'A net load is possible exactly when it is a multiple of the generator.'],
  solution: `First two sizes: ${e1.steps.join('; ')}, so their gcd is ${n(g1)}. Then ${e2.steps.join('; ')}, so gcd(${n(g1)}, ${n(c)}) = ${n(g)}, and the ideal is all the multiples of ${n(g)}. ${inI ? `${n(t)} = ${n(q)} × ${n(g)}, a multiple of ${n(g)}, so the load is possible: 1.` : `${n(t)} ÷ ${n(g)} leaves ${n(r)}, so ${n(t)} is not a multiple of ${n(g)} and the load is not possible: 0.`}`,
  guidance: [
   { prompt: `Use Euclid’s algorithm on ${n(a)} and ${n(b)}. What is their gcd?`, answer: [g1], explanation: `${e1.steps.join('; ')}. The last non-zero remainder is ${n(g1)}.` },
   { prompt: `Now find gcd(${n(g1)}, ${n(c)}). What number generates the ideal of all three sizes?`, answer: [g], explanation: `${e2.steps.join('; ')}. The last non-zero remainder is ${n(g)}.` },
   { prompt: `The possible loads are the multiples of ${n(g)}. Is ${n(t)} kg one of them? Enter 1 for yes, 0 for no.`, answer: [inI], explanation: inI ? `${n(t)} = ${n(q)} × ${n(g)}, so yes: 1.` : `${n(t)} = ${n(q)} × ${n(g)} + ${n(r)}, so it is not a multiple of ${n(g)}: 0.` }
  ] }; }
});

/* q38d (uses q07): the ideal made by a and the dial size m; the order of a in Z_m is counted in presses. */
mk({ id: 'q38d', parent: 'q38', kind: 'challenge', uses: 'q07', title: 'Presses before the dial returns',
 brief: 'A vault dial turns by a fixed step on every key press, and the crew needs both the clicks it can reach and how long it takes to come home.',
 labels: ['generator', 'presses'], tolerance: 0.01, gl: [['gcd'], ['presses']] }, {
 canonical: { m: 84, a: 30 },
 draw: R => { for (let i = 0; i < 1000; i++) { const m = R.int(24, 180), a = R.int(6, m - 1), g = gcd(a, m); if (g >= 2 && g < a) return { m, a }; } return { m: 84, a: 30 }; },
 build: ({ m, a }) => { const e = euclid(m, a), g = e.g, k = m / g; return {
  prompt: `The dial of a Cipher Vault door has ${n(m)} clicks, numbered 0 to ${n(m - 1)} round the rim. Each press of the key turns it forward ${n(a)} clicks, and after ${n(m - 1)} it wraps round to 0. The numbers ${n(a)}x + ${n(m)}y, with x and y whole numbers that may be negative, form an ideal of the integers. Enter the positive number that generates this ideal, then how many presses, starting from 0, it takes for the dial to land back on 0 for the first time (the order of ${n(a)} in ${Z(m)}).`,
  answer: [g, k],
  hints: ['The ideal made by a and m is all the multiples of gcd(a, m). Euclid’s algorithm finds it.', 'After k presses the dial shows k × a mod m, so it is back at 0 when m divides k × a. The first such k is m ÷ gcd(a, m).'],
  solution: `Euclid’s algorithm: ${e.steps.join('; ')}. So the ideal is generated by gcd(${n(a)}, ${n(m)}) = ${n(g)}. After k presses the dial shows k × ${n(a)} mod ${n(m)}, which is 0 when ${n(m)} divides k × ${n(a)}. The first such k is ${n(m)} ÷ ${n(g)} = ${n(k)}: ${n(k)} × ${n(a)} = ${n(k * a)} = ${n(k * a / m)} × ${n(m)}.`,
  guidance: [
   { prompt: `Use Euclid’s algorithm on ${n(m)} and ${n(a)}. What is their gcd?`, answer: [g], explanation: `${e.steps.join('; ')}. The last non-zero remainder is ${n(g)}.` },
   { prompt: `The generator is ${n(g)}. The dial is first back at 0 after ${n(m)} ÷ ${n(g)} presses. How many presses is that?`, answer: [k], explanation: `${n(m)} ÷ ${n(g)} = ${n(k)}, and ${n(k)} × ${n(a)} = ${n(k * a)} is a multiple of ${n(m)}, so ${n(k)} presses bring the dial home.` }
  ] }; }
});

/* ---- q39 Irreducible polynomials [17.3] ---- */

/* q39b: a beacon pulse code; the reducible count. Not x² + 1 over Z₃, the worked example. */
mk({ id: 'q39b', parent: 'q39', kind: 'setting', title: 'The beacon pulse code',
 brief: 'A beacon’s pulse pattern is built from a quadratic, and it only works if the quadratic cannot be split into simpler pulses.',
 labels: ['irreducible (1 or 0)', 'reducible quadratics'], tolerance: 0.01, gl: [['irreducible (1 or 0)'], ['reducible quadratics']] }, {
 canonical: { p: 7, b: 2, c: 5 },
 draw: R => { const want = R.bool(); for (let i = 0; i < 1000; i++) { const p = R.pick([3, 5, 7, 11]), b = R.int(0, p - 1), c = R.int(1, p - 1); if (p === 3 && b === 0 && c === 1) continue; if ((rootsOf(valsOf([b, c], p)).length === 0) === want) return { p, b, c }; } return { p: 7, b: 2, c: 5 }; },
 build: ({ p, b, c }) => { const vals = valsOf([b, c], p), roots = rootsOf(vals), irr = roots.length ? 0 : 1, red = p * (p + 1) / 2; return {
  prompt: `A beacon at the Pulse Tower is set by the quadratic f(x) = ${poly([b, c])} over ${Z(p)}, with arithmetic mod ${n(p)}. It only works if f is irreducible: it cannot be written as a product of two polynomials of lower degree. Enter 1 if f is irreducible and 0 if it is not, then how many of the ${n(p * p)} monic quadratics x² + Bx + C (B and C each from 0 to ${n(p - 1)}) can be factored into two linear factors.`,
  answer: [irr, red],
  hints: ['A quadratic that factors has a factor x − r, so it has a root r in the field. A quadratic with no root there is irreducible.', 'The factorable monic quadratics are the products (x − r)(x − s). Count the pairs with r = s, and the pairs with r and s different, counting (x − r)(x − s) and (x − s)(x − r) once.'],
  solution: `For x = 0 to ${n(p - 1)}, f(x) mod ${n(p)} is ${list(vals.map(n))}. ${irr ? 'No value is 0, so f has no root and no factor x − r: it is irreducible, 1.' : `It is 0 at x = ${list(roots.map(n))}, so x − ${n(roots[0])} is a factor and f is not irreducible: 0.`} The factorable quadratics are (x − r)(x − s): ${n(p)} with r = s and ${n(p)} × ${n(p - 1)} ÷ 2 = ${n(p * (p - 1) / 2)} with r ≠ s, so ${n(red)} in all.`,
  guidance: [
   { prompt: `The values of f(x) mod ${n(p)} for x = 0 to ${n(p - 1)} are ${list(vals.map(n))}. Is f irreducible? Enter 1 for yes, 0 for no.`, answer: [irr], explanation: irr ? 'No value is 0, so there is no root and no linear factor: irreducible.' : `f(${n(roots[0])}) = 0, so x − ${n(roots[0])} divides f: not irreducible.` },
   { prompt: `How many monic quadratics (x − r)(x − s) are there with r and s from 0 to ${n(p - 1)}, counting (x − r)(x − s) and (x − s)(x − r) once?`, answer: [red], explanation: `${n(p)} with r = s, and ${n(p)} × ${n(p - 1)} ÷ 2 = ${n(p * (p - 1) / 2)} with r ≠ s: ${n(red)} in all.` }
  ] }; }
});

/* q39c: two cubic candidates; a cubic is irreducible exactly when it has no root. */
const cubic39 = (R, p) => [R.int(0, p - 1), R.int(0, p - 1), R.int(0, p - 1)];
mk({ id: 'q39c', parent: 'q39', kind: 'applied', title: 'Two candidate ciphers',
 brief: 'Two cubic cipher candidates are waiting at the vault, and only an irreducible one may be used.',
 labels: ['roots of f', 'roots of g', 'irreducible candidates'], tolerance: 0.01, gl: [['roots of f'], ['roots of g'], ['irreducible candidates']] }, {
 canonical: { p: 5, f: [0, 1, 1], g: [2, 0, 1] },
 draw: R => { const want = R.int(0, 2); for (let i = 0; i < 1000; i++) { const p = R.pick([3, 5, 7]), f = cubic39(R, p), g = cubic39(R, p); if (f.join() === g.join()) continue; const k = (rootsOf(valsOf(f, p)).length === 0 ? 1 : 0) + (rootsOf(valsOf(g, p)).length === 0 ? 1 : 0); if (k === want) return { p, f, g }; } return { p: 5, f: [0, 1, 1], g: [2, 0, 1] }; },
 build: ({ p, f, g }) => { const vf = valsOf(f, p), vg = valsOf(g, p), rf = rootsOf(vf), rg = rootsOf(vg), k = (rf.length === 0 ? 1 : 0) + (rg.length === 0 ? 1 : 0); return {
  prompt: `The Cipher Vault lets a candidate cipher through only if it is an irreducible cubic over ${Z(p)}, with arithmetic mod ${n(p)}. Two candidates wait: f(x) = ${poly(f)} and g(x) = ${poly(g)}. A cubic that factors must have a factor of degree 1, which gives it a root, so a cubic is irreducible exactly when it has no root in ${Z(p)}. Enter how many roots f has, how many roots g has, then how many of the two candidates are irreducible.`,
  answer: [rf.length, rg.length, k],
  hints: ['A root is a value r, from zero up to p minus one, that makes f(r) reduced mod p equal to zero. Work out the value for every r and count the zeros.', 'A cubic with a root has a linear factor, so it is not irreducible; a cubic with no root is irreducible.'],
  solution: `For r = 0 to ${n(p - 1)}, f(r) mod ${n(p)} is ${list(vf.map(n))}. ${rf.length === 0 ? 'None is 0, so f has no roots and is irreducible' : `It is 0 at r = ${list(rf.map(n))}, so f has ${pl(rf.length, 'root')} and is not irreducible`}. For g the values are ${list(vg.map(n))}. ${rg.length === 0 ? 'None is 0, so g has no roots and is irreducible' : `It is 0 at r = ${list(rg.map(n))}, so g has ${pl(rg.length, 'root')} and is not irreducible`}. So ${n(k)} of the two candidates ${k === 1 ? 'is' : 'are'} irreducible.`,
  guidance: [
   { prompt: `The values of f(r) mod ${n(p)} for r = 0 to ${n(p - 1)} are ${list(vf.map(n))}. How many roots does f have?`, answer: [rf.length], explanation: rf.length === 0 ? 'No value is 0, so there are no roots.' : `The value is 0 at r = ${list(rf.map(n))}: ${pl(rf.length, 'root')}.` },
   { prompt: `The values of g(r) mod ${n(p)} for r = 0 to ${n(p - 1)} are ${list(vg.map(n))}. How many roots does g have?`, answer: [rg.length], explanation: rg.length === 0 ? 'No value is 0, so there are no roots.' : `The value is 0 at r = ${list(rg.map(n))}: ${pl(rg.length, 'root')}.` },
   { prompt: `A cubic is irreducible exactly when it has no root. How many of f and g are irreducible?`, answer: [k], explanation: `f has ${pl(rf.length, 'root')} and g has ${pl(rg.length, 'root')}, so ${n(k)} of the two ${k === 1 ? 'has' : 'have'} none and ${k === 1 ? 'is' : 'are'} irreducible.` }
  ] }; }
});

/* q39d (uses q37): a quadratic over a bigger field: the remainder on dividing by x − t, irreducibility, the count. */
mk({ id: 'q39d', parent: 'q39', kind: 'challenge', uses: 'q37', title: 'Vetting a long cipher',
 brief: 'A longer cipher over a bigger dial must be probed and tested before the vault will accept it.',
 labels: ['remainder', 'irreducible (1 or 0)', 'irreducible quadratics'], tolerance: 0.01, gl: [['remainder'], ['irreducible (1 or 0)'], ['factorable quadratics'], ['irreducible quadratics']] }, {
 canonical: { p: 11, b: 3, c: 7, t: 4 },
 draw: R => { const want = R.bool(); for (let i = 0; i < 1000; i++) { const p = R.pick([11, 13, 17, 19]), b = R.int(0, p - 1), c = R.int(1, p - 1); if ((rootsOf(valsOf([b, c], p)).length === 0) === want) return { p, b, c, t: R.int(1, p - 1) }; } return { p: 11, b: 3, c: 7, t: 4 }; },
 build: ({ p, b, c, t }) => { const vals = valsOf([b, c], p), roots = rootsOf(vals), irr = roots.length ? 0 : 1, ft = t * t + b * t + c, rem = mod(ft, p), red = p * (p + 1) / 2, count = p * p - red; return {
  prompt: `A long cipher for the vault is f(x) = ${poly([b, c])} over ${Z(p)}, with arithmetic mod ${n(p)}. The crew divides it by x − ${n(t)}, then tests whether it is irreducible, then counts the irreducible monic quadratics x² + Bx + C (B and C each from 0 to ${n(p - 1)}) the vault could have used instead. Enter the remainder on dividing f(x) by x − ${n(t)}, then 1 if f is irreducible over ${Z(p)} and 0 if it is not, then how many such quadratics are irreducible.`,
  answer: [rem, irr, count],
  hints: ['The remainder on dividing by x − t is f(t) reduced mod p.', 'A quadratic with no root in the field is irreducible. For the count, take the factorable monic quadratics (x − r)(x − s) away from all p² of them: p have r = s, and p(p − 1) ÷ 2 have r and s different.'],
  solution: `The remainder is f(${n(t)}) = ${n(ft)}, which is ${n(rem)} mod ${n(p)}. For x = 0 to ${n(p - 1)}, f(x) mod ${n(p)} is ${list(vals.map(n))}. ${irr ? 'No value is 0, so f has no root and is irreducible: 1.' : `It is 0 at x = ${list(roots.map(n))}, so x − ${n(roots[0])} is a factor and f is not irreducible: 0.`} There are ${n(p)}² = ${n(p * p)} monic quadratics, and the factorable ones number ${n(p)} + ${n(p)} × ${n(p - 1)} ÷ 2 = ${n(red)}. So ${n(p * p)} − ${n(red)} = ${n(count)} are irreducible.`,
  guidance: [
   { prompt: `Work out f(${n(t)}) and reduce it mod ${n(p)}. What is the remainder on dividing by x − ${n(t)}?`, answer: [rem], explanation: `f(${n(t)}) = ${n(ft)}, and ${n(ft)} mod ${n(p)} = ${n(rem)}.` },
   { prompt: `The values of f(x) mod ${n(p)} for x = 0 to ${n(p - 1)} are ${list(vals.map(n))}. Is f irreducible? Enter 1 for yes, 0 for no.`, answer: [irr], explanation: irr ? 'No value is 0, so there is no root and no linear factor: irreducible.' : `f(${n(roots[0])}) = 0, so x − ${n(roots[0])} divides f: not irreducible.` },
   { prompt: `How many monic quadratics (x − r)(x − s) can be made with r and s from 0 to ${n(p - 1)}, counting (x − r)(x − s) and (x − s)(x − r) once?`, answer: [red], explanation: `${n(p)} have r = s, and ${n(p)} × ${n(p - 1)} ÷ 2 = ${n(p * (p - 1) / 2)} have r and s different: ${n(red)} in all.` },
   { prompt: `There are ${n(p)}² = ${n(p * p)} monic quadratics x² + Bx + C. How many of them are irreducible?`, answer: [count], explanation: `${n(p * p)} − ${n(red)} = ${n(count)}.` }
  ] }; }
});

/* ---- q40 Finite fields; realm review and bridge to Number theory [22.1] ---- */

/* q40b: keypad codes; generators and non-generators. Any field of GF (below 2500, never GF(2³), the worked example), and never the
   canonical GF(5³). */
const GF40B = GF.filter(({ p, k }) => !(p === 5 && k === 3));
mk({ id: 'q40b', parent: 'q40', kind: 'setting', title: 'The keypad codes',
 brief: 'The vault keypad’s codes are the elements of a finite field, and the crew wants to know how many of them can stand in for all the rest.',
 labels: ['codes', 'generators', 'not generators'], tolerance: 0.01, gl: [['codes'], ['generators'], ['not generators']] }, {
 canonical: { p: 5, k: 3 },
 draw: R => R.pick(GF40B),
 build: ({ p, k }) => { const q = Math.pow(p, k), m = q - 1, ph = phi(m), non = m - ph, f = primesOf(m), fac = f.map(([r, e]) => e === 1 ? n(r) : pw(r, e)).join(' × '), terms = f.map(([r]) => `(1 − 1 ÷ ${n(r)})`).join(' × '), factxt = f.length === 1 && f[0][1] === 1 ? `${n(m)} is prime` : `${n(m)} = ${fac}`; return {
  prompt: `The codes on a Cipher Vault keypad are the elements of the finite field GF(${pw(p, k)}). Its non-zero codes form a cyclic group under multiplication, and a generator is a non-zero code whose powers give every non-zero code. Enter how many codes the field has, how many of the non-zero codes are generators, then how many non-zero codes are not${q >= 1000 ? '. Type the numbers without commas' : ''}.`,
  answer: [q, ph, non],
  hints: ['GF(pᵏ) has exactly pᵏ elements, and the non-zero ones are all but one of them.', 'A cyclic group of order m has one generator for each number from 1 to m that is coprime to m: m × (1 − 1 ÷ r) for each prime r dividing m.'],
  solution: `GF(${pw(p, k)}) has ${pw(p, k)} = ${n(q)} codes. Leaving out 0 there are ${n(q)} − 1 = ${n(m)} non-zero codes, and they form a cyclic group. ${factxt}, so ${n(m)} × ${terms} = ${n(ph)} of the numbers from 1 to ${n(m)} are coprime to ${n(m)}, and the group has ${n(ph)} generators. The other ${n(m)} − ${n(ph)} = ${n(non)} non-zero codes are not generators.`,
  guidance: [
   { prompt: `How many elements does GF(${pw(p, k)}) have?`, answer: [q], explanation: `${pw(p, k)} = ${n(q)}.` },
   { prompt: `There are ${n(m)} non-zero codes, and ${factxt}. How many numbers from 1 to ${n(m)} are coprime to ${n(m)}: how many generators does the cyclic group have?`, answer: [ph], explanation: `${n(m)} × ${terms} = ${n(ph)}. Each such number a makes gᵃ a generator, where g is any one generator.` },
   { prompt: `Of the ${n(m)} non-zero codes, ${n(ph)} are generators. How many are not?`, answer: [non], explanation: `${n(m)} − ${n(ph)} = ${n(non)}.` }
  ] }; }
});

/* q40c: size the field for a number of non-zero codes. */
mk({ id: 'q40c', parent: 'q40', kind: 'applied', title: 'Sizing the door field',
 brief: 'A new door needs a fixed number of different non-zero codes, and the crew must pick the smallest field that supplies them.',
 labels: ['k', 'group order', 'generators'], tolerance: 0.01, gl: [['k'], ['group order'], ['generators']] }, {
 canonical: { p: 3, k: 4, N: 50 },
 draw: R => { const { p, k } = R.pick(GF.filter(({ p, k }) => p <= 7 && k >= 3)), lo = Math.pow(p, k - 1), hi = Math.pow(p, k) - 1; return { p, k, N: lo + R.int(0, hi - lo) }; },
 build: ({ p, k, N }) => { const q = Math.pow(p, k), m = q - 1, ph = phi(m), f = primesOf(m), fac = f.map(([r, e]) => e === 1 ? n(r) : pw(r, e)).join(' × '), terms = f.map(([r]) => `(1 − 1 ÷ ${n(r)})`).join(' × '), factxt = f.length === 1 && f[0][1] === 1 ? `${n(m)} is prime` : `${n(m)} = ${fac}`, many = m >= 1000; return {
  prompt: `A new door in the Cipher Vault needs at least ${n(N)} different non-zero codes. The crew builds codes as the elements of the field GF(${n(p)}ᵏ), and k is a whole number from 2 up. Enter the smallest k that gives at least ${n(N)} non-zero codes, then the order of the multiplication group of that field (its non-zero elements), then how many generators that cyclic group has${many ? '. Type the numbers without commas' : ''}.`,
  answer: [k, m, ph],
  hints: ['GF(pᵏ) has pᵏ elements, so pᵏ − 1 non-zero ones. Try k = 2, 3, 4, … until pᵏ − 1 is at least the number needed.', 'The non-zero elements form a cyclic group. It has one generator for each number from 1 to m that is coprime to m: m × (1 − 1 ÷ r) for each prime r dividing m.'],
  solution: `The field GF(${n(p)}ᵏ) has ${n(p)}ᵏ − 1 non-zero codes. ${pw(p, k - 1)} − 1 = ${n(Math.pow(p, k - 1) - 1)} is not enough for ${n(N)}, and ${pw(p, k)} − 1 = ${n(m)} is, so k = ${n(k)}. The multiplication group has order ${n(m)}, and ${factxt}, so ${n(m)} × ${terms} = ${n(ph)} of the numbers from 1 to ${n(m)} are coprime to ${n(m)}: the group has ${n(ph)} generators.`,
  guidance: [
   { prompt: `GF(${n(p)}ᵏ) has ${n(p)}ᵏ − 1 non-zero codes. Which is the smallest k, from 2 up, with ${n(p)}ᵏ − 1 at least ${n(N)}?`, answer: [k], explanation: `For k = ${n(k)} there are ${pw(p, k)} − 1 = ${n(m)} non-zero codes, enough for ${n(N)}; for k = ${n(k - 1)} there ${k === 2 ? 'would be only' : 'are only'} ${n(Math.pow(p, k - 1) - 1)}, ${k === 2 ? 'which is too few' : 'too few'}.` },
   { prompt: `What is the order of the multiplication group of GF(${pw(p, k)})?`, answer: [m], explanation: `${pw(p, k)} − 1 = ${n(m)}: every non-zero element has an inverse, so they form a group.` },
   { prompt: `${factxt}. How many numbers from 1 to ${n(m)} are coprime to ${n(m)}: how many generators does the cyclic group have?`, answer: [ph], explanation: `${n(m)} × ${terms} = ${n(ph)}. Each such number a makes gᵃ a generator, where g is any one generator.` }
  ] }; }
});

/* q40d (uses q07): the order of a power of a generator, and how many elements have that order. */
mk({ id: 'q40d', parent: 'q40', kind: 'challenge', uses: 'q07', title: 'A key’s power',
 brief: 'A vault key is a power of the field’s generator, and the crew wants its order and how many other codes share that order.',
 labels: ['group order', 'order of gˢ', 'elements of that order'], tolerance: 0.01, gl: [['group order'], ['order of gˢ'], ['elements of that order']] }, {
 canonical: { p: 5, k: 3, s: 30 },
 draw: R => { for (let i = 0; i < 1000; i++) { const { p, k } = R.pick(GF), m = Math.pow(p, k) - 1, s = R.int(2, m - 1); if (gcd(s, m) >= 2) return { p, k, s }; } return { p: 5, k: 3, s: 30 }; },
 build: ({ p, k, s }) => { const q = Math.pow(p, k), m = q - 1, g = gcd(s, m), d = m / g, cnt = phi(d), many = m >= 1000, cop = []; for (let i = 1; i <= d && d <= 40; i++) if (gcd(i, d) === 1) cop.push(i); return {
  prompt: `A vault key in the field GF(${pw(p, k)}) is the power g${sup(s)} of a generator g of the field’s multiplication group, the cyclic group of its non-zero elements. In a cyclic group of order m, the power gˢ has order m ÷ gcd(s, m), and the elements of any one order d are the generators of the one subgroup (a group inside the group) of size d, so there are as many of them as that subgroup has generators. Enter the order of the multiplication group, the order of g${sup(s)}, then how many elements of the group have exactly that order${many ? ' (type the numbers without commas)' : ''}.`,
  answer: [m, d, cnt],
  hints: ['The multiplication group has pᵏ − 1 elements, all the elements but 0.', 'The order of gˢ is m ÷ gcd(s, m). The number of elements of that order is the number of generators of a cyclic group of that size: the numbers from 1 up to it that are coprime to it.'],
  solution: `GF(${pw(p, k)}) has ${n(q)} elements, so the multiplication group has order ${n(q)} − 1 = ${n(m)}. gcd(${n(s)}, ${n(m)}) = ${n(g)}, so g${sup(s)} has order ${n(m)} ÷ ${n(g)} = ${n(d)}. The elements of order ${n(d)} are the generators of the subgroup of size ${n(d)}, so there are as many as the numbers from 1 to ${n(d)} that are coprime to ${n(d)}: ${cop.length ? `${list(cop.map(n))}, which is ${n(cnt)}` : n(cnt)}.`,
  guidance: [
   { prompt: `What is the order of the multiplication group of GF(${pw(p, k)})?`, answer: [m], explanation: `${pw(p, k)} − 1 = ${n(m)}: every non-zero element has an inverse, so they form a group.` },
   { prompt: `What is the order of g${sup(s)}, which is ${n(m)} ÷ gcd(${n(s)}, ${n(m)})?`, answer: [d], explanation: `gcd(${n(s)}, ${n(m)}) = ${n(g)}, and ${n(m)} ÷ ${n(g)} = ${n(d)}.` },
   { prompt: `How many numbers from 1 to ${n(d)} are coprime to ${n(d)}? That is how many elements of the group have order ${n(d)}.`, answer: [cnt], explanation: `${cop.length ? `They are ${list(cop.map(n))}: ` : ''}${n(cnt)} of them, so ${n(cnt)} elements have order ${n(d)}.` }
  ] }; }
});

})();
