/* Abstract algebra: patterns of moves mission generators, file c: q21–q30. Shape and helpers: docs/PACK-FORMAT.md §3 and game/gen-core.js.
   build(canonical) must reproduce the authored text in missions-c.js exactly. */
(function(){
'use strict';
const G = window.Gen, { n } = G;
/* Small number helpers. Parameter names avoid `n`, which is the number-to-text helper. */
const gcd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a; };
const lcm = (a, b) => a / gcd(a, b) * b;
const coprimes = m => { const out = []; for (let x = 1; x < m; x++) if (gcd(x, m) === 1) out.push(x); return out; };
const isPrime = m => m > 1 && coprimes(m).length === m - 1;
const SUP = '⁰¹²³⁴⁵⁶⁷⁸⁹', SUB = '₀₁₂₃₄₅₆₇₈₉';
const sup = k => String(k).split('').map(d => SUP[d]).join('');
const Z = m => 'Z' + String(m).split('').map(d => SUB[d]).join('');
const list = xs => xs.map(n).join(', ');
/* A set written out in full when short, otherwise its first three members, "…" and the last. */
const set = xs => xs.length <= 8 ? `{${list(xs)}}` : `{${list(xs.slice(0, 3))}, …, ${n(xs[xs.length - 1])}}`;
const multiples = (step, below) => { const out = []; for (let x = 0; x < below; x += step) out.push(x); return out; };
/* A permutation of slots 1 … 5 is the list of where slots 1, 2, … are sent. */
const perm = (name, p) => `${name}: ${p.map((v, i) => `${i + 1} → ${v}`).join(', ')}`;
const shuffle = (R, k) => { const p = []; for (let i = 1; i <= k; i++) p.push(i); for (let i = k - 1; i > 0; i--) { const j = R.int(0, i); [p[i], p[j]] = [p[j], p[i]]; } return p; };
const isId = p => p.every((v, i) => v === i + 1);
/* q22: the subgroup H of the second part. Cases 0–2 are the swaps of two slots in S₃ (not normal), 3 the three turns of
   S₃ (normal), 4 a subgroup ⟨d⟩ of Z_m (normal: adding does not depend on order). The case number only picks a text. */
const PAIRS = [[1, 2], [1, 3], [2, 3]];
const CYC = [0, 2, 3, 1];   // the move 1 → 2, 2 → 3, 3 → 1, indexed by slot
const normalCase = (c, m, d) => {
 if (c < 3) { const [x, y] = PAIRS[c], u = CYC[x], v = CYC[y], lo = Math.min(u, v), hi = Math.max(u, v);
  return { what: `take S₃, the group of all six rearrangements of three slots, and its subgroup H = {identity, the swap of slots ${x} and ${y}}`,
   short: `H = {identity, the swap of slots ${x} and ${y}} in S₃`, yes: 0,
   why: `For H in S₃, take g = the move 1 → 2, 2 → 3, 3 → 1. Conjugating relabels the slots, so g h g⁻¹ swaps g(${x}) = ${u} and g(${y}) = ${v}: the swap of slots ${lo} and ${hi}, which is not in H. So H is not normal: enter 0.` }; }
 if (c === 3) return { what: 'take S₃, the group of all six rearrangements of three slots, and its subgroup H of the three turns: the identity, the move 1 → 2, 2 → 3, 3 → 1 and the move 1 → 3, 3 → 2, 2 → 1',
  short: 'H = the three turns of three slots in S₃', yes: 1,
  why: 'For H in S₃: a turn moves every slot, and g h g⁻¹ does the same move on relabelled slots, so it moves every slot too. The only rearrangements of three slots that move all three are the two turns, which are in H, and a conjugate of the identity is the identity. Every conjugate stays in H, so H is normal: enter 1.' };
 const H = multiples(d, m);
 return { what: `take ${Z(m)}, the dial readings 0 to ${n(m - 1)} added mod ${n(m)}, and its subgroup H = ⟨${n(d)}⟩ = ${set(H)}`,
  short: `H = ⟨${n(d)}⟩ in ${Z(m)}`, yes: 1,
  why: `For H in ${Z(m)}: adding does not depend on order, so g + h − g = h for every g and every h in H. Every conjugate of h is h itself, so H is normal: enter 1.` };
};
/* q30: the smallest turn r >= 1 that brings a ring colouring back to itself. */
const period = s => { for (let r = 1; r <= s.length; r++) if (s.slice(r) + s.slice(0, r) === s) return r; return s.length; };
const tiles = s => s.split('').join(' ');
/* "a 6-position dial", "an 8-position dial", "an 11-position dial". */
const an = x => /^(8|11|18|8\d)$/.test(String(x)) ? 'an' : 'a';
/* "by 0 and 1 slots" or "by 0 to 3 slots". */
const upTo = p => p === 2 ? 'by 0 and 1 slots' : `by 0 to ${n(p - 1)} slots`;
window.MISSION_GEN = window.MISSION_GEN || {};
Object.assign(window.MISSION_GEN, {
 /* aᵏ mod m with a coprime to m, k from 1000 to 9999. φ(m) is at most 24 so the last step stays short, and the
    remainder r of k ÷ φ(m) is at least 2. Not the worked example (2¹⁰⁰³ mod 15): m = 15 is never drawn. */
 q21: {
  canonical: { a: 3, k: 1000, m: 34 },
  draw: R => { const mods = []; for (let m = 7; m <= 50; m++) { const f = coprimes(m).length; if (m !== 15 && f >= 4 && f <= 24) mods.push(m); }
   for (let i = 0; i < 1000; i++) { const m = R.pick(mods), cs = coprimes(m).filter(x => x > 1 && x < m - 1), a = R.pick(cs), k = R.int(1000, 9999);
    if (k % coprimes(m).length >= 2) return { a, k, m }; }
   return { a: 3, k: 1000, m: 34 }; },
  build: ({ a, k, m }) => { const cs = coprimes(m), f = cs.length, q = Math.floor(k / f), r = k % f, pw = []; let v = 1;
   for (let i = 0; i < r; i++) { v = v * a % m; pw.push(v); }
   const fermat = isPrime(m) ? ` Because ${n(m)} is prime, φ(${n(m)}) = ${n(m)} − 1, and this is Fermat’s little theorem.` : '';
   return {
   prompt: `A depot lock is set by a code wheel that multiplies by ${n(a)} mod ${n(m)}, and today’s setting is ${n(a)}${sup(k)} mod ${n(m)}: ${n(a)} to the power ${n(k)}, divided by ${n(m)}, keeping only the remainder. ${n(a)} and ${n(m)} are coprime. Enter φ(${n(m)}), the number of whole numbers from 1 to ${n(m - 1)} that are coprime to ${n(m)}; then the remainder when ${n(k)} is divided by φ(${n(m)}); then ${n(a)}${sup(k)} mod ${n(m)}.`,
   answer: [f, r, v],
   hints: ['Euler’s theorem: when a and n are coprime, a to the power φ(n) leaves remainder 1 on division by n. So every full block of φ(n) in the power can be dropped.', 'Write the power as a multiple of φ(n) plus a remainder r. Only r matters: the answer is a to the power r, mod n, which you reach by multiplying by a step by step and keeping the remainder each time.'],
   solution: `The numbers from 1 to ${n(m - 1)} that are coprime to ${n(m)} are ${list(cs)}, so φ(${n(m)}) = ${n(f)}. ${n(k)} = ${n(f)} × ${n(q)} + ${n(r)}, so the remainder is ${n(r)}. By Euler’s theorem ${n(a)}${sup(f)} mod ${n(m)} = 1, so each of the ${n(q)} blocks of ${n(f)} in the power gives a factor that leaves 1, and ${n(a)}${sup(k)} mod ${n(m)} = ${n(a)}${sup(r)} mod ${n(m)}. The powers of ${n(a)} mod ${n(m)} go ${list(pw)}, so the answer is ${n(v)}.${fermat}`,
   guidance: [
    { prompt: `List the numbers from 1 to ${n(m - 1)} that are coprime to ${n(m)}. How many are there? That count is φ(${n(m)}).`, answer: [f], explanation: `They are ${list(cs)}: ${n(f)} numbers, so φ(${n(m)}) = ${n(f)}.` },
    { prompt: `Divide the power ${n(k)} by φ(${n(m)}) = ${n(f)}. What is the remainder?`, answer: [r], explanation: `${n(f)} × ${n(q)} = ${n(f * q)}, and ${n(k)} − ${n(f * q)} = ${n(r)}. So ${n(k)} = ${n(f)} × ${n(q)} + ${n(r)}.` },
    { prompt: `By Euler’s theorem ${n(a)}${sup(f)} mod ${n(m)} = 1, so only the remainder ${n(r)} of the power matters. What is ${n(a)}${sup(r)} mod ${n(m)}?`, answer: [v], explanation: `Multiply by ${n(a)} and keep the remainder mod ${n(m)} each time: ${list(pw)}. So ${n(a)}${sup(r)} mod ${n(m)} = ${n(v)}, and that is also ${n(a)}${sup(k)} mod ${n(m)}.` }
   ] }; }
 },
 /* σ and τ are random rearrangements of five slots, neither the identity; i is a slot. c picks the subgroup of the second
    part (an index into normalCase's texts); m and d are used only when c is 4. */
 q22: {
  canonical: { s: [3, 5, 4, 1, 2], t: [2, 1, 4, 5, 3], i: 4, c: 0, m: 12, d: 3 },
  draw: R => { let s = shuffle(R, 5), t = shuffle(R, 5);
   for (let g = 0; g < 1000 && (isId(s) || isId(t)); g++) { s = shuffle(R, 5); t = shuffle(R, 5); }
   if (isId(s) || isId(t)) { s = [3, 5, 4, 1, 2]; t = [2, 1, 4, 5, 3]; }
   const m = R.pick([6, 8, 9, 10, 12, 14, 15, 16, 18, 20]), ds = []; for (let d = 2; d < m; d++) if (m % d === 0) ds.push(d);
   return { s, t, i: R.int(1, 5), c: R.int(0, 4), m, d: R.pick(ds) }; },
  build: ({ s, t, i, c, m, d }) => { const j = t.indexOf(i) + 1, k = s[j - 1], v = t[k - 1], N = normalCase(c, m, d); return {
   prompt: `A depot robot rearranges the bins in five slots, numbered 1 to 5. Each move is written as where it sends each slot’s bin: ${perm('σ', s)}; ${perm('τ', t)}. Moves are combined right to left, so τ ∘ σ means σ first, then τ, and τ⁻¹ is the move that undoes τ. Enter (τ ∘ σ ∘ τ⁻¹)(${n(i)}), the slot that τ⁻¹, then σ, then τ send slot ${n(i)} to. Then ${N.what}. Enter 1 if H is a normal subgroup and 0 if it is not.`,
   answer: [v, N.yes],
   hints: ['Work from the right. τ⁻¹ sends a slot back to the slot that τ sends there. Then apply σ, then τ.', 'H is normal when g h g⁻¹ is in H for every g in the group and every h in H. One g that takes some h outside H is enough to show H is not normal.'],
   solution: `τ sends ${n(j)} to ${n(i)}, so τ⁻¹(${n(i)}) = ${n(j)}. Then σ(${n(j)}) = ${n(k)} and τ(${n(k)}) = ${n(v)}, so (τ ∘ σ ∘ τ⁻¹)(${n(i)}) = ${n(v)}. ${N.why}`,
   guidance: [
    { prompt: `Start on the right with τ⁻¹. Which slot does τ send to slot ${n(i)}? That slot is τ⁻¹(${n(i)}).`, answer: [j], explanation: `τ sends ${n(j)} to ${n(i)}, so τ⁻¹ sends ${n(i)} back to ${n(j)}.` },
    { prompt: `Next apply σ. What is σ(${n(j)})?`, answer: [k], explanation: `σ sends ${n(j)} to ${n(k)}.` },
    { prompt: `Last apply τ. What is τ(${n(k)})? That is (τ ∘ σ ∘ τ⁻¹)(${n(i)}).`, answer: [v], explanation: `τ sends ${n(k)} to ${n(v)}, so (τ ∘ σ ∘ τ⁻¹)(${n(i)}) = ${n(v)}.` },
    { prompt: `Now the subgroup: ${N.short}. Is H normal? Enter 1 for yes, 0 for no.`, answer: [N.yes], explanation: N.why }
   ] }; }
 },
 /* ⟨a⟩ in Z_m with g = gcd(a, m) at least 2 and a not equal to g, so ⟨a⟩ = ⟨g⟩ has to be seen; the coset b + ⟨a⟩ is
    not ⟨a⟩ itself and b is larger than g, so its smallest element is not b. Not the worked example (⟨6⟩ in Z₂₀). */
 q23: {
  canonical: { m: 36, a: 8, b: 23 },
  draw: R => { for (let i = 0; i < 1000; i++) { const m = R.int(12, 60), a = R.int(2, m - 1), g = gcd(a, m), b = R.int(1, m - 1);
    if (m !== 20 && g >= 2 && a !== g && m / g >= 3 && b % g !== 0 && b > g) return { m, a, b }; }
   return { m: 36, a: 8, b: 23 }; },
  build: ({ m, a, b }) => { const g = gcd(a, m), h = m / g, rep = b % g; return {
   prompt: `The Sorting Depot labels its parts 0 to ${n(m - 1)} and adds labels mod ${n(m)}: the group ${Z(m)}. One batch is the subgroup ⟨${n(a)}⟩, everything reached by adding ${n(a)} again and again. Enter the number of elements of ⟨${n(a)}⟩, then its index in ${Z(m)} (the number of cosets), then the smallest element of the coset ${n(b)} + ⟨${n(a)}⟩.`,
   answer: [h, g, rep],
   hints: ['The multiples of a mod n are exactly the multiples of gcd(a, n), so ⟨a⟩ = ⟨gcd(a, n)⟩, with n ÷ gcd(a, n) elements.', 'By Lagrange’s theorem the index is |G| ÷ |H|. The coset b + ⟨g⟩ holds the numbers that leave the same remainder as b on division by g.'],
   solution: `gcd(${n(a)}, ${n(m)}) = ${n(g)}, so ⟨${n(a)}⟩ = ⟨${n(g)}⟩ = ${set(multiples(g, m))}, with ${n(m)} ÷ ${n(g)} = ${n(h)} elements. By Lagrange’s theorem the index is ${n(m)} ÷ ${n(h)} = ${n(g)}. ${n(b)} leaves remainder ${n(rep)} on division by ${n(g)}, so the coset ${n(b)} + ⟨${n(a)}⟩ holds ${n(rep)}, ${n(rep + g)}, ${n(rep + 2 * g)} and so on, and its smallest element is ${n(rep)}.`,
   guidance: [
    { prompt: `What is gcd(${n(a)}, ${n(m)}), the largest whole number that divides both?`, answer: [g], explanation: `${n(g)} divides ${n(a)} and ${n(m)}, and no larger number divides both. So ⟨${n(a)}⟩ = ⟨${n(g)}⟩, and its number of cosets, the index, is ${n(g)}.` },
    { prompt: `⟨${n(a)}⟩ = ⟨${n(g)}⟩ holds 0, ${n(g)}, ${n(2 * g)} and so on below ${n(m)}. How many elements is that?`, answer: [h], explanation: `${n(m)} ÷ ${n(g)} = ${n(h)}. Check with Lagrange: ${n(h)} × ${n(g)} = ${n(m)}.` },
    { prompt: `The coset ${n(b)} + ⟨${n(a)}⟩ holds the labels that leave the same remainder as ${n(b)} on division by ${n(g)}. What is its smallest element?`, answer: [rep], explanation: `${n(b)} = ${n(g)} × ${n(Math.floor(b / g))} + ${n(rep)}, so the coset is ${n(rep)}, ${n(rep + g)}, ${n(rep + 2 * g)} and so on, starting at ${n(rep)}.` }
   ] }; }
 },
 /* φ(x) = kx mod t from Z_m to Z_t, asked at a, b and at a + b worked out in Z_m (a + b >= m, so it wraps round).
    Half the draws are well defined (t divides km) and half are not. Not the worked example (Z₄ to Z₈ and Z₆). */
 q24: {
  canonical: { m: 6, t: 9, k: 3, a: 4, b: 5 },
  draw: R => { const want = R.bool();
   for (let i = 0; i < 1000; i++) { const m = R.int(4, 12), t = R.int(4, 15), k = R.int(2, t - 1), a = R.int(1, m - 1), b = R.int(1, m - 1);
    if (m !== 4 && t !== m && a !== b && a + b >= m && ((k * m) % t === 0) === want) return { m, t, k, a, b }; }
   return { m: 6, t: 9, k: 3, a: 4, b: 5 }; },
  build: ({ m, t, k, a, b }) => { const fa = k * a % t, fb = k * b % t, s = (a + b) % m, fs = k * s % t, sum = (fa + fb) % t, km = k * m, wd = km % t === 0 ? 1 : 0;
   const end = wd
    ? `That matches φ(${n(a)}) + φ(${n(b)}) = ${n(fa)} + ${n(fb)}, which is ${n(sum)} mod ${n(t)}. ${n(k)} × ${n(m)} = ${n(km)} is a multiple of ${n(t)}, so adding ${n(m)} to a reading never changes the output: φ is well defined, and it is a homomorphism. Enter 1.`
    : `But φ(${n(a)}) + φ(${n(b)}) = ${n(fa)} + ${n(fb)}, which is ${n(sum)} mod ${n(t)}: the wrap-around at ${n(m)} changed the output. ${n(k)} × ${n(m)} = ${n(km)} is not a multiple of ${n(t)}, so φ is not well defined. Enter 0.`;
   return {
   prompt: `A relay passes readings from ${an(m)} ${n(m)}-position dial, ${Z(m)}, to ${an(t)} ${n(t)}-position dial, ${Z(t)}, by the rule φ(x) = ${n(k)}x mod ${n(t)}, used on the reading x from 0 to ${n(m - 1)}. Enter φ(${n(a)}), then φ(${n(b)}), then φ of the sum ${n(a)} + ${n(b)} worked out in ${Z(m)}. Then enter 1 if φ is well defined (the readings x and x + ${n(m)}, which are the same position of the first dial, always give the same output), so that it is a homomorphism, and 0 if it is not.`,
   answer: [fa, fb, fs, wd],
   hints: ['A homomorphism keeps the pattern: φ(x + y) equals φ(x) + φ(y), the sum on the left worked out in the first dial and the sum on the right in the second.', 'A reading x of the first dial is the same position as x + m. The rule is well defined exactly when k × m is a multiple of the size of the second dial, so that adding m to x never changes kx mod that size.'],
   solution: `φ(${n(a)}) = ${n(k * a)} mod ${n(t)} = ${n(fa)} and φ(${n(b)}) = ${n(k * b)} mod ${n(t)} = ${n(fb)}. In ${Z(m)}, ${n(a)} + ${n(b)} = ${n(a + b)} − ${n(m)} = ${n(s)}, and φ(${n(s)}) = ${n(k * s)} mod ${n(t)} = ${n(fs)}. ${end}`,
   guidance: [
    { prompt: `What is φ(${n(a)}) = ${n(k)} × ${n(a)} mod ${n(t)}?`, answer: [fa], explanation: `${n(k)} × ${n(a)} = ${n(k * a)}, which leaves ${n(fa)} on division by ${n(t)}.` },
    { prompt: `What is φ(${n(b)}) = ${n(k)} × ${n(b)} mod ${n(t)}?`, answer: [fb], explanation: `${n(k)} × ${n(b)} = ${n(k * b)}, which leaves ${n(fb)} on division by ${n(t)}.` },
    { prompt: `Add on the first dial: what is ${n(a)} + ${n(b)} in ${Z(m)}?`, answer: [s], explanation: `${n(a)} + ${n(b)} = ${n(a + b)}, which is ${n(s)} mod ${n(m)}.` },
    { prompt: `What is φ(${n(s)}) = ${n(k)} × ${n(s)} mod ${n(t)}?`, answer: [fs], explanation: `${n(k)} × ${n(s)} = ${n(k * s)}, which leaves ${n(fs)} on division by ${n(t)}. Compare it with φ(${n(a)}) + φ(${n(b)}) = ${n(fa + fb)}, which is ${n(sum)} mod ${n(t)}.` },
    { prompt: `Is ${n(k)} × ${n(m)} a multiple of ${n(t)}? Enter 1 if φ is well defined and 0 if it is not.`, answer: [wd], explanation: end }
   ] }; }
 },
 /* x ↦ kx mod m on Z_m with g = gcd(k, m) from 2 to m ÷ 2, so the kernel and the image both have at least 2
    elements. Not the worked example (8x on Z₁₂). */
 q25: {
  canonical: { m: 30, k: 12 },
  draw: R => { for (let i = 0; i < 1000; i++) { const m = R.int(8, 40), k = R.int(2, m - 1), g = gcd(k, m);
    if (!(m === 12 && k === 8) && g >= 2 && 2 * g <= m) return { m, k }; }
   return { m: 30, k: 12 }; },
  build: ({ m, k }) => { const g = gcd(k, m), st = m / g, ker = multiples(st, m), img = multiples(g, m); return {
   prompt: `A relay maps the ${n(m)}-position dial ${Z(m)} to itself by φ(x) = ${n(k)}x mod ${n(m)}, a homomorphism. Enter the number of elements of the kernel of φ (the readings it sends to 0), then the number of elements of the image of φ (the different outputs).`,
   answer: [g, st],
   hints: ['kx mod n is 0 exactly when x is a multiple of n ÷ gcd(k, n). Count those multiples from 0 to n − 1.', 'The outputs are exactly the multiples of gcd(k, n) below n. As a check, the kernel size times the image size is n.'],
   solution: `gcd(${n(k)}, ${n(m)}) = ${n(g)}. ${n(k)}x mod ${n(m)} is 0 exactly when x is a multiple of ${n(m)} ÷ ${n(g)} = ${n(st)}, so the kernel is ${set(ker)}, with ${n(g)} elements. The outputs are the multiples of ${n(g)}: the image is ${set(img)}, with ${n(st)} elements. And ${n(g)} × ${n(st)} = ${n(m)}.`,
   guidance: [
    { prompt: `What is the smallest reading x, 1 or more, with ${n(k)}x mod ${n(m)} = 0?`, answer: [st], explanation: `gcd(${n(k)}, ${n(m)}) = ${n(g)}, and ${n(k)} × ${n(st)} = ${n(k * st)} is a multiple of ${n(m)}, while no smaller x works. That smallest x is ${n(m)} ÷ ${n(g)} = ${n(st)}.` },
    { prompt: `The kernel is every multiple of ${n(st)} from 0 to ${n(m - 1)}. How many elements does it have?`, answer: [g], explanation: `The kernel is ${set(ker)}: ${n(m)} ÷ ${n(st)} = ${n(g)} elements.` },
    { prompt: `The image is every multiple of ${n(g)} from 0 to ${n(m - 1)}. How many elements does it have?`, answer: [st], explanation: `The image is ${set(img)}: ${n(m)} ÷ ${n(g)} = ${n(st)} elements, and ${n(g)} × ${n(st)} = ${n(m)}.` }
   ] }; }
 },
 /* Z_a × Z_b with 2 <= a < b <= 12; half the draws coprime. Not the worked examples (Z₂ × Z₃, Z₂ × Z₂). */
 q26: {
  canonical: { a: 4, b: 6 },
  draw: R => { const want = R.bool();
   for (let i = 0; i < 1000; i++) { const a = R.int(2, 11), b = R.int(a + 1, 12);
    if (!(a === 2 && b === 3) && (gcd(a, b) === 1) === want) return { a, b }; }
   return { a: 4, b: 6 }; },
  build: ({ a, b }) => { const size = a * b, g = gcd(a, b), L = lcm(a, b), iso = g === 1 ? 1 : 0;
   const end = iso
    ? `gcd(${n(a)}, ${n(b)}) = 1, so the largest order is ${n(a)} × ${n(b)} = ${n(size)}: the pair (1, 1) passes through all ${n(size)} states before it comes home, just as 1 does on ${an(size)} ${n(size)}-position dial. Matching k(1, 1) with k in ${Z(size)} is an isomorphism, so enter 1.`
    : `gcd(${n(a)}, ${n(b)}) = ${n(g)}, so the largest order is ${n(L)}, less than ${n(size)}. ${Z(size)} has an element of order ${n(size)} (the reading 1), and an isomorphism keeps every order, so the two are not isomorphic: enter 0.`;
   return {
   prompt: `Two dials, ${Z(a)} and ${Z(b)}, are coupled into one relay whose states are the pairs (x, y): the direct product ${Z(a)} × ${Z(b)}. Enter the number of states, then the largest order of any state, then 1 if the coupled relay is isomorphic to one dial with as many positions as it has states, and 0 if it is not.`,
   answer: [size, L, iso],
   hints: ['The order of a pair is the lcm of the orders of its two parts: the first time both dials are home together. The largest order is the lcm of the two dial sizes.', 'An isomorphism keeps every order, and a one-dial relay with N positions has a state of order N. So the product is a copy of one dial exactly when its largest order equals its number of states.'],
   solution: `There are ${n(a)} × ${n(b)} = ${n(size)} pairs. The order of a pair (x, y) is the lcm of the order of x, which divides ${n(a)}, and the order of y, which divides ${n(b)}, so no pair beats (1, 1), whose order is lcm(${n(a)}, ${n(b)}) = ${n(size)} ÷ ${n(g)} = ${n(L)}. ${end}`,
   guidance: [
    { prompt: `How many pairs (x, y) are there, with x from 0 to ${n(a - 1)} and y from 0 to ${n(b - 1)}?`, answer: [size], explanation: `${n(a)} choices of x times ${n(b)} choices of y: ${n(size)} states.` },
    { prompt: `What is gcd(${n(a)}, ${n(b)})?`, answer: [g], explanation: `${n(g)} is the largest whole number that divides both ${n(a)} and ${n(b)}.` },
    { prompt: `What is the order of (1, 1): lcm(${n(a)}, ${n(b)}) = ${n(a)} × ${n(b)} ÷ gcd?`, answer: [L], explanation: `${n(size)} ÷ ${n(g)} = ${n(L)}: after ${n(L)} steps both dials are home together for the first time. No state has a larger order.` },
    { prompt: `Is ${Z(a)} × ${Z(b)} isomorphic to ${Z(size)}? Enter 1 for yes, 0 for no.`, answer: [iso], explanation: end }
   ] }; }
 },
 /* (x, y) in Z_a × Z_b with a, b coprime, 3 <= a <= 9, 4 <= b <= 11, ab <= 90; x and y not 0.
    Not the worked example (Z₂ × Z₅). */
 q27: {
  canonical: { a: 4, b: 9, x: 2, y: 5 },
  draw: R => { for (let i = 0; i < 1000; i++) { const a = R.int(3, 9), b = R.int(4, 11);
    if (a !== b && gcd(a, b) === 1 && a * b <= 90) return { a, b, x: R.int(1, a - 1), y: R.int(1, b - 1) }; }
   return { a: 4, b: 9, x: 2, y: 5 }; },
  build: ({ a, b, x, y }) => { const ox = a / gcd(x, a), oy = b / gcd(y, b), o = lcm(ox, oy), N = a * b, cands = [];
   for (let z = y; z < N; z += b) cands.push(z); const w = cands.find(z => z % a === x); return {
   prompt: `The relay pairs the dials ${Z(a)} and ${Z(b)}; ${n(a)} and ${n(b)} are coprime, so ${Z(a)} × ${Z(b)} ≅ ${Z(N)}, with the reading w of the ${n(N)}-position dial matched to the pair (w mod ${n(a)}, w mod ${n(b)}). Enter the order of the state (${n(x)}, ${n(y)}) in ${Z(a)} × ${Z(b)}, then the reading w from 0 to ${n(N - 1)} that is matched to it.`,
   answer: [o, w],
   hints: ['The order of x in Zₙ is n ÷ gcd(x, n). The order of a pair is the lcm of the orders of its two parts.', 'For w, list the numbers below the size of the big dial that leave the right remainder on division by the second dial size, and pick the one that also leaves the right remainder on division by the first.'],
   solution: `The order of ${n(x)} in ${Z(a)} is ${n(a)} ÷ gcd(${n(x)}, ${n(a)}) = ${n(ox)}, and the order of ${n(y)} in ${Z(b)} is ${n(b)} ÷ gcd(${n(y)}, ${n(b)}) = ${n(oy)}. So (${n(x)}, ${n(y)}) has order lcm(${n(ox)}, ${n(oy)}) = ${n(o)}. The numbers below ${n(N)} that leave ${n(y)} on division by ${n(b)} are ${list(cands)}; of these only ${n(w)} leaves ${n(x)} on division by ${n(a)}, so w = ${n(w)}.`,
   guidance: [
    { prompt: `What is the order of ${n(x)} in ${Z(a)}?`, answer: [ox], explanation: `${n(a)} ÷ gcd(${n(x)}, ${n(a)}) = ${n(ox)}: that many steps of ${n(x)} first bring the dial back to 0.` },
    { prompt: `What is the order of ${n(y)} in ${Z(b)}?`, answer: [oy], explanation: `${n(b)} ÷ gcd(${n(y)}, ${n(b)}) = ${n(oy)}.` },
    { prompt: `What is the order of the pair (${n(x)}, ${n(y)}), the lcm of ${n(ox)} and ${n(oy)}?`, answer: [o], explanation: `lcm(${n(ox)}, ${n(oy)}) = ${n(o)}: the first number of steps after which both parts are home together.` },
    { prompt: `The numbers below ${n(N)} that leave ${n(y)} on division by ${n(b)} are ${list(cands)}. Which one leaves ${n(x)} on division by ${n(a)}?`, answer: [w], explanation: `${n(w)} = ${n(a)} × ${n(Math.floor(w / a))} + ${n(x)}, so w mod ${n(a)} = ${n(x)} and w mod ${n(b)} = ${n(y)}. The pair (${n(x)}, ${n(y)}) is matched to ${n(w)}.` }
   ] }; }
 },
 /* Z_m / ⟨d⟩ with d a divisor of m, 2 <= d <= m ÷ 2; x is not in ⟨d⟩. Not the worked example (Z₁₈ / ⟨6⟩). */
 q28: {
  canonical: { m: 24, d: 8, x: 6 },
  /* Half the draws have gcd(x, d) above 1, so the order of x + H is less than the number of cosets. */
  draw: R => { const low = R.bool(); for (let i = 0; i < 1000; i++) { const m = R.int(12, 48), d = R.int(2, Math.floor(m / 2)), x = R.int(1, m - 1);
    if (m % d === 0 && x % d !== 0 && (gcd(x, d) > 1) === low && !(m === 18 && d === 6)) return { m, d, x }; }
   return { m: 24, d: 8, x: 6 }; },
  build: ({ m, d, x }) => { const sz = m / d, g = gcd(x, d), o = d / g, H = multiples(d, m), steps = [];
   for (let j = 1; j <= o; j++) steps.push(j * x); return {
   prompt: `The relay groups the readings of ${Z(m)} into the cosets of its subgroup H = ⟨${n(d)}⟩ = ${set(H)}. Each coset is one element of the quotient group ${Z(m)}/H, and cosets are added by adding any one reading from each. Enter the number of elements of ${Z(m)}/H, then the order of the coset ${n(x)} + H in it.`,
   answer: [d, o],
   hints: ['The cosets of H split all the readings into equal batches the size of H, so the number of cosets is the size of the group divided by the size of H.', 'Adding the coset x + H to itself k times gives kx + H. That is H itself, the identity of the quotient group, exactly when kx is in H.'],
   solution: `H = ⟨${n(d)}⟩ has ${n(m)} ÷ ${n(d)} = ${n(sz)} elements, so the ${n(m)} readings split into ${n(m)} ÷ ${n(sz)} = ${n(d)} cosets: ${Z(m)}/H has ${n(d)} elements. Adding ${n(x)} + H to itself k times gives k × ${n(x)} + H, which is H when k × ${n(x)} is a multiple of ${n(d)}. The multiples of ${n(x)} go ${list(steps)}, and ${n(o * x)} is the first that is a multiple of ${n(d)}, so the order of ${n(x)} + H is ${n(o)}. That is ${n(d)} ÷ gcd(${n(x)}, ${n(d)}) = ${n(d)} ÷ ${n(g)}.`,
   guidance: [
    { prompt: `How many elements does H = ⟨${n(d)}⟩ have in ${Z(m)}?`, answer: [sz], explanation: `H = ${set(H)}: ${n(m)} ÷ ${n(d)} = ${n(sz)} elements.` },
    { prompt: `The cosets of H are batches of ${n(sz)} readings that never overlap and cover all ${n(m)}. How many cosets are there?`, answer: [d], explanation: `${n(m)} ÷ ${n(sz)} = ${n(d)}, so ${Z(m)}/H has ${n(d)} elements, the cosets 0 + H to ${n(d - 1)} + H.` },
    { prompt: `What is the smallest k, 1 or more, for which ${n(x)} × k is a multiple of ${n(d)}? That k is the order of ${n(x)} + H.`, answer: [o], explanation: `The multiples of ${n(x)} go ${list(steps)}, and ${n(o * x)} is the first that is a multiple of ${n(d)}. So k = ${n(o)}.` }
   ] }; }
 },
 /* φ(x) = kx mod M from Z_N to Z_M with N = (M ÷ gcd(k, M)) × u, u >= 2, so M divides kN; N <= 40 and N ≠ M.
    Then (x, y) in Z_p × Z_q, x and y not 0. Not the worked example (Z₁₂ to Z₈). */
 q29: {
  canonical: { N: 20, M: 12, k: 9, p: 6, q: 4, x: 4, y: 2 },
  draw: R => { for (let i = 0; i < 1000; i++) { const M = R.int(4, 20), k = R.int(2, M - 1), s = M / gcd(k, M), u = R.int(2, 8), N = s * u;
    if (N <= 40 && N !== M && !(N === 12 && M === 8)) { const p = R.int(2, 12), q = R.int(2, 12); return { N, M, k, p, q, x: R.int(1, p - 1), y: R.int(1, q - 1) }; } }
   return { N: 20, M: 12, k: 9, p: 6, q: 4, x: 4, y: 2 }; },
  build: ({ N, M, k, p, q, x, y }) => { const g = gcd(k, M), s = M / g, ker = multiples(s, N), K = ker.length, im = N / K,
   ox = p / gcd(x, p), oy = q / gcd(y, q), o = lcm(ox, oy); return {
   prompt: `The relay sends ${Z(N)} to ${Z(M)} by φ(x) = ${n(k)}x mod ${n(M)}. It is a homomorphism, because ${n(k)} × ${n(N)} = ${n(k * N)} is a multiple of ${n(M)}. Enter the number of elements of the kernel of φ, then the number of elements of its image. A second relay works on the pairs of ${Z(p)} × ${Z(q)}: enter the order of (${n(x)}, ${n(y)}).`,
   answer: [K, im, o],
   hints: ['The kernel holds the x from 0 to N − 1 with kx mod M = 0, which are the multiples of M ÷ gcd(k, M).', 'The first isomorphism theorem says G / kernel ≅ image, so the image has |G| ÷ |kernel| elements. The order of a pair is the lcm of the orders of its parts.'],
   solution: `gcd(${n(k)}, ${n(M)}) = ${n(g)}, so ${n(k)}x mod ${n(M)} = 0 exactly when x is a multiple of ${n(M)} ÷ ${n(g)} = ${n(s)}. From 0 to ${n(N - 1)} these are ${list(ker)}: the kernel has ${n(K)} elements. By the first isomorphism theorem the image has ${n(N)} ÷ ${n(K)} = ${n(im)} elements. In the second relay, ${n(x)} has order ${n(p)} ÷ gcd(${n(x)}, ${n(p)}) = ${n(ox)} in ${Z(p)} and ${n(y)} has order ${n(q)} ÷ gcd(${n(y)}, ${n(q)}) = ${n(oy)} in ${Z(q)}, so (${n(x)}, ${n(y)}) has order lcm(${n(ox)}, ${n(oy)}) = ${n(o)}.`,
   guidance: [
    { prompt: `What is the smallest x, 1 or more, with ${n(k)}x mod ${n(M)} = 0?`, answer: [s], explanation: `gcd(${n(k)}, ${n(M)}) = ${n(g)}, and the smallest such x is ${n(M)} ÷ ${n(g)} = ${n(s)}: ${n(k)} × ${n(s)} = ${n(k * s)}, a multiple of ${n(M)}.` },
    { prompt: `The kernel is the multiples of ${n(s)} from 0 to ${n(N - 1)}. How many are there?`, answer: [K], explanation: `They are ${list(ker)}: ${n(K)} elements.` },
    { prompt: `By the first isomorphism theorem, how many elements does the image have?`, answer: [im], explanation: `|image| = |G| ÷ |kernel| = ${n(N)} ÷ ${n(K)} = ${n(im)}. As a check, the image is the multiples of ${n(g)} in ${Z(M)}: ${set(multiples(g, M))}.` },
    { prompt: `What is the order of (${n(x)}, ${n(y)}) in ${Z(p)} × ${Z(q)}?`, answer: [o], explanation: `${n(x)} has order ${n(ox)} and ${n(y)} has order ${n(oy)}, so the pair has order lcm(${n(ox)}, ${n(oy)}) = ${n(o)}.` }
   ] }; }
 },
 /* A ring of r slots, 4 <= r <= 12, coloured by repeating a block of length p (p divides r, p >= 2) whose own smallest
    repeat is p, in two or three colours. Not the worked example (R B R B R B). */
 q30: {
  canonical: { pat: 'RBBYRBBY' },
  draw: R => { for (let i = 0; i < 1000; i++) { const r = R.int(4, 12), ps = []; for (let p = 2; p <= r; p++) if (r % p === 0) ps.push(p);
    const p = R.pick(ps), cols = R.bool() ? 'RB' : 'RBY'; let block = ''; for (let j = 0; j < p; j++) block += R.pick(cols.split(''));
    const pat = block.repeat(r / p); if (period(block) === p && pat !== 'RBRBRB') return { pat }; }
   return { pat: 'RBBYRBBY' }; },
  build: ({ pat }) => { const r = pat.length, p = period(pat), fix = r / p, fixed = multiples(p, r);
   const back = p === r ? `only comes back after a full turn of ${n(r)} slots` : `first comes back after a turn of ${n(p)} slots`;
   return {
   prompt: `A dome ring has ${n(r)} tile slots, numbered clockwise. Reading clockwise from slot 1, its tiles are ${tiles(pat)} (R red, B blue, Y yellow). The ${n(r)} turns of the ring, by 0, 1, 2 and so on up to ${n(r - 1)} slots, act on its colourings. Enter the size of the orbit of this colouring (how many different colourings the turns make from it), then how many of the ${n(r)} turns leave it unchanged.`,
   answer: [p, fix],
   hints: ['Turn the ring one slot at a time and watch for the first turn that brings back exactly the starting colours. The colourings seen before that turn are all different.', 'If the first turn that brings the colouring back is by p slots, the turns that leave it unchanged are 0, p, 2p and so on, and the orbit holds p colourings.'],
   solution: `Turning the ring slot by slot, the colouring ${back}. So the turns ${upTo(p)} give ${n(p)} different colourings, and every other turn repeats one of them: the orbit has ${n(p)} colourings. The turns that leave it unchanged are by ${list(fixed)} slots: ${n(fix)} of the ${n(r)}. And ${n(p)} × ${n(fix)} = ${n(r)}.`,
   guidance: [
    { prompt: `What is the smallest turn, by 1 slot or more, that brings back the same colour in every slot? That number is the size of the orbit.`, answer: [p], explanation: `The pattern ${tiles(pat)} ${back}, so the turns ${upTo(p)} make ${n(p)} different colourings: the orbit.` },
    { prompt: `The turns that leave the colouring unchanged are the multiples of ${n(p)} below ${n(r)}, starting with the turn by 0. How many are there?`, answer: [fix], explanation: `They are the turns by ${list(fixed)} slots: ${n(fix)} of them, and ${n(p)} × ${n(fix)} = ${n(r)}.` }
   ] }; }
 }
});
})();
