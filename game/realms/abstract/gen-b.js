/* Abstract algebra: patterns of moves mission generators, file b: q11–q20. Shape and helpers: docs/PACK-FORMAT.md §3 and game/gen-core.js.
   build(canonical) must reproduce the authored text in missions-b.js exactly. */
(function(){
'use strict';
const G = window.Gen, { n } = G;
/* Small helpers. Every draw loop is bounded (1000 tries, then the canonical parameters). */
const gcd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a; };
const lcm = (a, b) => a / gcd(a, b) * b;
const mod = (a, m) => ((a % m) + m) % m;
const SUP = '⁰¹²³⁴⁵⁶⁷⁸⁹', SUB = '₀₁₂₃₄₅₆₇₈₉';
const sup = k => String(k).split('').map(d => SUP[+d]).join('');
const sub = k => String(k).split('').map(d => SUB[+d]).join('');
const Z = m => 'Z' + sub(m);
const pl = (k, one, many) => `${n(k)} ${k === 1 ? one : (many || one + 's')}`;
const and = list => list.length < 2 ? list.join('') : list.slice(0, -1).join(', ') + ' and ' + list[list.length - 1];
const bounded = (R, canonical, make, ok) => { for (let i = 0; i < 1000; i++) { const p = make(R); if (ok(p)) return p; } return canonical; };
/* Permutations are lists p with p[i − 1] = where symbol i goes. */
const shuffle = (R, m) => { const p = Array.from({ length: m }, (_, i) => i + 1); for (let i = m - 1; i > 0; i--) { const j = R.int(0, i); [p[i], p[j]] = [p[j], p[i]]; } return p; };
const arrows = p => p.map((v, i) => `${i + 1} → ${v}`).join(', ');
const cyclesOf = p => { const seen = new Set(), out = []; for (let s = 1; s <= p.length; s++) { if (seen.has(s)) continue; const c = []; let x = s; while (!seen.has(x)) { seen.add(x); c.push(x); x = p[x - 1]; } out.push(c); } return out; };
const cyc = c => '(' + c.join(' ') + ')';
const cycText = cs => cs.map(cyc).join('');
const same = (p, q) => p.length === q.length && p.every((v, i) => v === q[i]);
const isId = p => p.every((v, i) => v === i + 1);
/* Powers a¹, a², … mod m up to the first 1. */
const powers = (a, m) => { const out = []; let x = 1; for (let k = 1; k <= m; k++) { x = x * a % m; out.push(x); if (x === 1) break; } return out; };
const remText = (x, m) => x < m ? `${n(x)}, which is already less than ${n(m)}` : `${n(x)} = ${n(Math.floor(x / m))} × ${n(m)} + ${n(x % m)}`;
/* {0, d, 2d, …, m − d} written out in full when short. */
const multiples = (d, m) => { const k = m / d; if (k <= 5) return '{' + Array.from({ length: k }, (_, i) => n(i * d)).join(', ') + '}'; return `{0, ${n(d)}, ${n(2 * d)}, …, ${n(m - d)}}`; };
const divisors = m => { const out = []; for (let d = 1; d <= m; d++) if (m % d === 0) out.push(d); return out; };
const fact = k => k <= 1 ? 1 : k * fact(k - 1);
/* q16, q17: a turn by r steps sends mark p to p + r, the flip sends p to −p (mod m). */
const stepText = r => `turn by ${pl(r, 'step')}`;
const ROUTINES = {
 FTF: { moves: (r, s) => [['F'], ['T', r], ['F']], det: 1 },
 FTFT: { moves: (r, s) => [['F'], ['T', r], ['F'], ['T', s]], det: 1 },
 TFT: { moves: (r, s) => [['T', r], ['F'], ['T', s]], det: -1 },
 FT: { moves: (r, s) => [['F'], ['T', r]], det: -1 }
};
const routine = ({ m, type, r, s, v }) => { const R = ROUTINES[type], moves = R.moves(r, s), path = [v]; let x = v;
 for (const mv of moves) { x = mv[0] === 'F' ? mod(-x, m) : mod(x + mv[1], m); path.push(x); }
 const shift = mod(R.det === 1 ? (type === 'FTF' ? -r : s - r) : 0, m);
 const ord = R.det === 1 ? m / gcd(shift, m) : 2;
 const words = moves.map(mv => mv[0] === 'F' ? 'flip' : stepText(mv[1]));
 return { moves, path, end: x, det: R.det, shift, ord, words, flips: moves.filter(mv => mv[0] === 'F').length }; };
window.MISSION_GEN = window.MISSION_GEN || {};
Object.assign(window.MISSION_GEN, {
 /* Order of a in U(m) and its inverse a^(k − 1). Order 3 to 10 (a short list of powers, and the inverse is never a
    itself). Not the worked example (3 in U(11)). */
 q11: {
  canonical: { m: 13, a: 5 },
  draw: R => bounded(R, { m: 13, a: 5 }, R => { const m = R.pick([9, 10, 11, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 25, 26, 27, 28]); return { m, a: R.int(2, m - 2) }; },
   p => gcd(p.a, p.m) === 1 && powers(p.a, p.m).length >= 3 && powers(p.a, p.m).length <= 10 && !(p.m === 11 && p.a === 3)),
  build: ({ m, a }) => { const pw = powers(a, m), k = pw.length, inv = pw[k - 2], sq = a * a % m, prod = a * inv; return {
   prompt: `A pulse beacon keeps a number from U(${n(m)}): the whole numbers from 1 to ${n(m - 1)} that share no factor with ${n(m)} except 1, combined by multiplying mod ${n(m)}. The stored number starts at 1. On every beat the timer multiplies it by ${n(a)} and keeps the remainder mod ${n(m)}, and the beacon flashes whenever the stored number is back at 1. Enter the order of ${n(a)} in U(${n(m)}), which is the number of beats from one flash to the next, then the inverse of ${n(a)} in U(${n(m)}).`,
   answer: [k, inv],
   hints: ['The order is the smallest power k with aᵏ mod n = 1. Multiply by the number again and again, taking the remainder each time, until you reach 1.', 'If aᵏ = 1, then a × aᵏ⁻¹ = 1. So the power just before the first 1 is the inverse.'],
   solution: `Multiplying by ${n(a)} each time and keeping the remainder mod ${n(m)}, the powers ${n(a)}¹, ${n(a)}², … are ${pw.map(n).join(', ')}. The first 1 is ${n(a)}${sup(k)}, so the order of ${n(a)} in U(${n(m)}) is ${n(k)}. Then ${n(a)} × ${n(a)}${sup(k - 1)} = ${n(a)}${sup(k)} = 1, so the inverse of ${n(a)} is ${n(a)}${sup(k - 1)} mod ${n(m)} = ${n(inv)}. Check: ${n(a)} × ${n(inv)} = ${n(prod)} = ${n(Math.floor(prod / m))} × ${n(m)} + 1.`,
   guidance: [
    { prompt: `Start the list of powers. What is ${n(a)}² mod ${n(m)}?`, answer: [sq], explanation: `${n(a)} × ${n(a)} = ${remText(a * a, m)}, so ${n(a)}² mod ${n(m)} = ${n(sq)}.` },
    { prompt: `Keep multiplying by ${n(a)} and taking the remainder mod ${n(m)} until you reach 1. What is the order of ${n(a)}?`, answer: [k], explanation: `The powers are ${pw.map(n).join(', ')}. The first 1 is power number ${n(k)}, so the order is ${n(k)}.` },
    { prompt: `The inverse is the power just before the first 1, ${n(a)}${sup(k - 1)}. What is it mod ${n(m)}?`, answer: [inv], explanation: `${n(a)}${sup(k - 1)} mod ${n(m)} = ${n(inv)}, and ${n(a)} × ${n(inv)} = ${n(prod)}, which leaves remainder 1 when divided by ${n(m)}.` }
   ] }; }
 },
 /* (σ ∘ τ)(i) = σ(τ(i)) for two sockets. Each asked socket moves under τ, and doing σ first would give a different
    socket for both, so the order mistake is always caught. 5 or 6 sockets; the worked example has 4. */
 q12: {
  canonical: { s: [3, 6, 4, 1, 2, 5], t: [2, 4, 5, 6, 1, 3], i: 1, j: 4 },
  draw: R => bounded(R, { s: [3, 6, 4, 1, 2, 5], t: [2, 4, 5, 6, 1, 3], i: 1, j: 4 }, R => { const m = R.int(5, 6), i = R.int(1, m); return { s: shuffle(R, m), t: shuffle(R, m), i, j: R.except(1, m, [i]) }; },
   p => !isId(p.s) && !isId(p.t) && !same(p.s, p.t) && [p.i, p.j].every(x => p.t[x - 1] !== x && p.s[p.t[x - 1] - 1] !== p.t[p.s[x - 1] - 1])),
  build: ({ s, t, i, j }) => { const m = s.length, ti = t[i - 1], tj = t[j - 1], ri = s[ti - 1], rj = s[tj - 1], wrong = t[s[i - 1] - 1]; return {
   prompt: `A hatch lock has ${n(m)} bolt sockets numbered 1 to ${n(m)}. Each move lifts every bolt and drops it into a socket again, one bolt per socket, so a move is a permutation of the socket numbers. An arrow 2 → 5 means the bolt in socket 2 drops into socket 5. Move σ is ${arrows(s)}. Move τ is ${arrows(t)}. The crew runs the composition σ ∘ τ, which means τ first, then σ. Enter (σ ∘ τ)(${n(i)}), then (σ ∘ τ)(${n(j)}): the sockets where the bolts that started in sockets ${n(i)} and ${n(j)} end up.`,
   answer: [ri, rj],
   hints: ['σ ∘ τ means τ first, then σ: (σ ∘ τ)(i) = σ(τ(i)). Find τ(i) in τ’s list first.', 'Then look up that socket in σ’s list: that is where the bolt ends.'],
   solution: `τ(${n(i)}) = ${n(ti)} and σ(${n(ti)}) = ${n(ri)}, so (σ ∘ τ)(${n(i)}) = ${n(ri)}. τ(${n(j)}) = ${n(tj)} and σ(${n(tj)}) = ${n(rj)}, so (σ ∘ τ)(${n(j)}) = ${n(rj)}. Running σ first would send the bolt from socket ${n(i)} to τ(σ(${n(i)})) = ${n(wrong)} instead, so the order of the moves matters.`,
   guidance: [
    { prompt: `τ goes first. Where does τ send the bolt in socket ${n(i)}?`, answer: [ti], explanation: `τ’s list has ${n(i)} → ${n(ti)}, so τ(${n(i)}) = ${n(ti)}.` },
    { prompt: `Now σ moves that bolt. What is σ(${n(ti)}), which is (σ ∘ τ)(${n(i)})?`, answer: [ri], explanation: `σ’s list has ${n(ti)} → ${n(ri)}, so (σ ∘ τ)(${n(i)}) = σ(τ(${n(i)})) = ${n(ri)}.` },
    { prompt: `The same for the bolt in socket ${n(j)}. What is τ(${n(j)})?`, answer: [tj], explanation: `τ’s list has ${n(j)} → ${n(tj)}, so τ(${n(j)}) = ${n(tj)}.` },
    { prompt: `What is σ(${n(tj)}), which is (σ ∘ τ)(${n(j)})?`, answer: [rj], explanation: `σ’s list has ${n(tj)} → ${n(rj)}, so (σ ∘ τ)(${n(j)}) = ${n(rj)}.` }
   ] }; }
 },
 /* Number of cycles (fixed points count as cycles of length 1) and the order, the lcm of the cycle lengths.
    6 to 9 sockets, at least two cycles longer than 1, so the lcm is always needed. Not the worked example. */
 q13: {
  canonical: { p: [4, 8, 3, 7, 6, 2, 1, 5] },
  draw: R => bounded(R, { p: [4, 8, 3, 7, 6, 2, 1, 5] }, R => ({ p: shuffle(R, R.int(6, 9)) }),
   q => cyclesOf(q.p).filter(c => c.length > 1).length >= 2 && !same(q.p, [2, 3, 1, 5, 4, 6])),
  build: ({ p }) => { const m = p.length, cs = cyclesOf(p), lens = cs.map(c => c.length), ord = lens.reduce(lcm, 1), c1 = cs[0], trace = [...c1, c1[0]].join(' → '); return {
   prompt: `A hatch has ${n(m)} bolt sockets, and one of its moves is the permutation ${arrows(p)}. Write the move in cycle notation, counting each fixed point (a socket whose bolt stays put) as a cycle of length 1. Enter the number of cycles, then the order of the move: the smallest number of times it must be repeated to bring every bolt back to its own socket.`,
   answer: [cs.length, ord],
   hints: ['Start at 1 and follow the arrows until you come back to 1: that is one cycle. Then start again from the smallest socket not used yet.', 'A cycle of length L brings its bolts home after L, 2L, 3L, … repeats. All the bolts are home together for the first time at the lcm of the cycle lengths.'],
   solution: `Following the arrows gives ${cycText(cs)}: ${pl(cs.length, 'cycle')}, of lengths ${and(lens.map(n))}. A cycle of length L is home after every multiple of L, so every bolt is home at once first after lcm(${lens.map(n).join(', ')}) = ${n(ord)} repeats. The order of the move is ${n(ord)}.`,
   guidance: [
    { prompt: 'Start at 1 and follow the arrows back to 1. How long is the cycle that contains 1?', answer: [c1.length], explanation: c1.length === 1 ? 'The bolt in socket 1 stays put, so 1 is a fixed point: a cycle of length 1.' : `${trace}, so the cycle ${cyc(c1)} has length ${n(c1.length)}.` },
    { prompt: 'Keep going from the smallest socket not used yet until every socket is in a cycle. How many cycles are there, fixed points included?', answer: [cs.length], explanation: `The move is ${cycText(cs)}, which has ${pl(cs.length, 'cycle')}.` },
    { prompt: `The cycle lengths are ${and(lens.map(n))}. What is their lcm, the order of the move?`, answer: [ord], explanation: `${n(ord)} is the smallest number that every cycle length divides exactly, so lcm(${lens.map(n).join(', ')}) = ${n(ord)}.` }
   ] }; }
 },
 /* Transpositions from the cycle rule (sockets minus cycles) and the sign. 6 to 9 sockets, never the identity;
    not the worked example. */
 q14: {
  canonical: { p: [3, 5, 6, 7, 1, 2, 4] },
  draw: R => bounded(R, { p: [3, 5, 6, 7, 1, 2, 4] }, R => ({ p: shuffle(R, R.int(6, 9)) }),
   q => !isId(q.p) && !same(q.p, [4, 1, 5, 2, 3, 6])),
  build: ({ p }) => { const m = p.length, cs = cyclesOf(p), c = cs.length, T = m - c, sign = T % 2 ? -1 : 1, word = T % 2 ? 'odd' : 'even',
   long = cs.reduce((x, y) => y.length > x.length ? y : x), split = long.slice(1).reverse().map(x => `(${long[0]} ${x})`).join(''); return {
   prompt: `A hatch has ${n(m)} bolt sockets, and one of its moves is the permutation ${arrows(p)}. The crew’s robot can only swap the bolts in two sockets at a time. Write the move in cycle notation, counting each fixed point as a cycle of length 1, then write each cycle of length L as L − 1 transpositions. Enter the number of transpositions this gives, then the sign of the move: 1 if it is an even permutation, −1 if it is odd.`,
   answer: [T, sign],
   hints: ['A cycle of length L is L − 1 transpositions and a fixed point needs none, so the total is the number of sockets minus the number of cycles.', 'An even number of transpositions makes an even permutation, with sign 1; an odd number makes an odd permutation, with sign −1.'],
   solution: `In cycle notation the move is ${cycText(cs)}: ${pl(c, 'cycle')} on ${n(m)} sockets. A cycle of length L needs L − 1 transpositions, so the total is ${cs.map(x => n(x.length - 1)).join(' + ')} = ${n(T)}, which is ${n(m)} − ${n(c)}. ${long.length > 2 ? `For instance ${cyc(long)} = ${split}, read from right to left. ` : ''}${n(T)} is ${word}, so the move is an ${word} permutation and its sign is ${n(sign)}.`,
   guidance: [
    { prompt: 'Write the move in cycle notation. How many cycles are there, fixed points included?', answer: [c], explanation: `The move is ${cycText(cs)}, which has ${pl(c, 'cycle')}.` },
    { prompt: 'Each cycle of length L needs L − 1 transpositions. How many transpositions is that in all?', answer: [T], explanation: `${cs.map(x => n(x.length - 1)).join(' + ')} = ${n(T)}, the same as ${n(m)} sockets minus ${pl(c, 'cycle')}.` },
    { prompt: `${n(T)} transpositions: is that even or odd? Enter the sign, 1 for even or −1 for odd.`, answer: [sign], explanation: `${n(T)} is ${word}, so the move is an ${word} permutation with sign ${n(sign)}.` }
   ] }; }
 },
 /* |Sₖ| = k!, |Aₖ| = k! ÷ 2 and k(k − 1) ÷ 2 transpositions for the k = N − w free bolts. k is 3, 5, 6 or 7: the
    worked example has 4. */
 q15: {
  canonical: { N: 9, w: 4 },
  draw: R => bounded(R, { N: 9, w: 4 }, R => { const N = R.int(5, 16); return { N, w: R.int(1, N - 3) }; }, p => [3, 5, 6, 7].includes(p.N - p.w)),
  build: ({ N, w }) => { const k = N - w, f = fact(k), half = f / 2, tr = k * (k - 1) / 2, chain = Array.from({ length: k }, (_, i) => n(k - i)).join(' × '); return {
   prompt: `A hatch has ${n(N)} bolt sockets, but ${w === 1 ? 'one bolt is' : n(w) + ' of the bolts are'} welded in place. The other ${n(k)} bolts can be lifted and dropped back into their own ${n(k)} sockets in any order, one bolt per socket, and each such rearrangement is a permutation of those ${n(k)} sockets. Enter how many rearrangements there are (the one that moves nothing counts), then how many of them are even permutations, then how many of them are transpositions. Type each number without commas.`,
   answer: [f, half, tr],
   hints: ['The first free bolt has n sockets to choose from, the next n − 1, and so on: n! = n × (n − 1) × … × 1 rearrangements of n bolts.', 'Exactly half the permutations of n ≥ 2 symbols are even. A transposition is fixed by the pair of sockets it swaps: n(n − 1) ÷ 2 pairs.'],
   solution: `Only the ${n(k)} free bolts move, so the rearrangements form the symmetric group S${sub(k)}, with ${n(k)}! = ${chain} = ${n(f)} elements. Half of them are even, so the alternating group A${sub(k)} has ${n(f)} ÷ 2 = ${n(half)} elements. A transposition swaps 2 of the ${n(k)} sockets: ${n(k)} × ${n(k - 1)} ÷ 2 = ${n(tr)} pairs.`,
   guidance: [
    { prompt: `How many rearrangements of the ${n(k)} free bolts are there? Work out ${n(k)}!.`, answer: [f], explanation: `${n(k)}! = ${chain} = ${n(f)}. ${w === 1 ? 'The welded bolt adds nothing: it never moves.' : `The ${n(w)} welded bolts add nothing: they never move.`}` },
    { prompt: `Exactly half of these are even permutations. How many is that?`, answer: [half], explanation: `${n(f)} ÷ 2 = ${n(half)}, the size of the alternating group A${sub(k)}.` },
    { prompt: `A transposition swaps one pair of the ${n(k)} sockets. How many pairs are there?`, answer: [tr], explanation: `The first socket of the pair can be any of ${n(k)} and the second any of the other ${n(k - 1)}, but that counts each pair twice: ${n(k)} × ${n(k - 1)} ÷ 2 = ${n(tr)}.` }
   ] }; }
 },
 /* |Dₘ| = 2m and the mark −(v + r) mod m after a turn by r then the flip. The corner never ends where it started
    (that would hide a skipped step). Not the worked example (m = 5, v = 1, r = 2). */
 q16: {
  canonical: { m: 6, v: 4, r: 3 },
  draw: R => bounded(R, { m: 6, v: 4, r: 3 }, R => { const m = R.int(5, 12); return { m, v: R.int(1, m - 1), r: R.int(1, m - 1) }; },
   p => mod(-(p.v + p.r), p.m) !== p.v && !(p.m === 5 && p.v === 1 && p.r === 2)),
  build: ({ m, v, r }) => { const t = mod(v + r, m), f = mod(-t, m); return {
   prompt: `A hatch is a regular polygon with ${n(m)} corners. Marks 0 to ${n(m - 1)} are painted on the frame at the corner positions, going anticlockwise, and they never move. A turn by r steps moves every corner r marks anticlockwise, so the corner at mark p goes to mark (p + r) mod ${n(m)}. The flip turns the hatch over across the line through the centre and mark 0, so the corner at mark p goes to mark (−p) mod ${n(m)}, which is ${n(m)} − p, while mark 0 stays put. Enter the number of symmetries in the dihedral group D${sub(m)} (all the turns, the turn by 0 included, and all the flips), then the mark where the corner that starts at mark ${n(v)} ends up after a turn by ${pl(r, 'step')} followed by the flip.`,
   answer: [2 * m, f],
   hints: ['Dₙ has n turns, counting the turn by 0, and n flips.', 'Do the turn first: add r and take the remainder mod n. Then flip: subtract that mark from n, unless it is 0.'],
   solution: `D${sub(m)} has ${n(m)} turns and ${n(m)} flips, so |D${sub(m)}| = 2 × ${n(m)} = ${n(2 * m)}. The turn takes mark ${n(v)} to (${n(v)} + ${n(r)}) mod ${n(m)} = ${n(t)}. ${t === 0 ? 'The flip leaves mark 0 where it is, so the corner ends at mark 0.' : `The flip then takes mark ${n(t)} to ${n(m)} − ${n(t)} = ${n(f)}.`}`,
   guidance: [
    { prompt: `How many symmetries does D${sub(m)} have, turns and flips together?`, answer: [2 * m], explanation: `${n(m)} turns (by 0, 1, …, ${n(m - 1)} steps) and ${n(m)} flips make ${n(2 * m)} symmetries.` },
    { prompt: `After the turn by ${pl(r, 'step')}, at which mark is the corner that started at mark ${n(v)}?`, answer: [t], explanation: v + r < m ? `${n(v)} + ${n(r)} = ${n(v + r)}, which is less than ${n(m)}, so it is at mark ${n(t)}.` : `${n(v)} + ${n(r)} = ${n(v + r)} = 1 × ${n(m)} + ${n(t)}, so it is at mark ${n(t)}.` },
    { prompt: `Now the flip. Where does it send the corner at mark ${n(t)}?`, answer: [f], explanation: t === 0 ? 'Mark 0 lies on the flip line, so the corner stays at mark 0.' : `The flip sends mark ${n(t)} to ${n(m)} − ${n(t)} = ${n(f)}.` }
   ] }; }
 },
 /* A routine of turns and flips on an m-cornered hatch: where one corner ends, the determinant (−1)^(flips) and the
    order (2 for a flip, m ÷ gcd(shift, m) for a turn by shift ≠ 0 steps). Not the worked example (m = 6, FTF, r = 2, v = 1). */
 q17: {
  canonical: { m: 10, type: 'FTF', r: 4, s: 0, v: 3 },
  draw: R => bounded(R, { m: 10, type: 'FTF', r: 4, s: 0, v: 3 }, R => { const m = R.int(5, 12), type = R.pick(['FTF', 'FTFT', 'TFT', 'FT']), r = R.int(1, m - 1);
   return { m, type, r, s: type === 'FTFT' || type === 'TFT' ? R.except(1, m - 1, [r]) : 0, v: R.int(1, m - 1) }; },
   p => !(p.m === 6 && p.type === 'FTF' && p.r === 2 && p.v === 1) && (ROUTINES[p.type].det === -1 || routine(p).shift !== 0) && routine(p).end !== p.v),
  build: P => { const { m, v } = P, X = routine(P), seq = X.words.join(', then '), hops = X.path.map(n).join(' → '), dets = X.moves.map(mv => mv[0] === 'F' ? '(−1)' : '1').join(' × '); return {
   prompt: `A hatch is a regular polygon with ${n(m)} corners, and marks 0 to ${n(m - 1)} are painted anticlockwise on the frame at the corner positions. A turn by r steps sends the corner at mark p to mark (p + r) mod ${n(m)}; the flip across the line through the centre and mark 0 sends it to mark (−p) mod ${n(m)}. A locking routine does these moves in order: ${seq}. Enter the mark where the corner that starts at mark ${n(v)} ends up, then the determinant of the 2 × 2 matrix of the whole routine (1 or −1), then the order of the routine: the smallest number of times it must be repeated to bring every corner back to its own mark.`,
   answer: [X.end, X.det, X.ord],
   hints: ['Follow the one corner through the moves in order, taking the remainder mod n after each one.', 'A turn’s matrix has determinant 1 and the flip’s has −1, and determinants multiply. A routine with determinant −1 is a flip, of order 2; one with determinant 1 is a turn by some number of steps t, of order n ÷ gcd(t, n).'],
   solution: `The corner goes ${hops}, so it ends at mark ${n(X.end)}. The determinant is ${dets} = ${n(X.det)}. ${X.det === -1 ? `So the routine is a flip: doing it twice puts every corner back, and doing it once does not, so its order is 2.` : `So the routine is a turn. It sends every mark p to p ${P.type === 'FTF' ? `− ${n(P.r)}` : `− ${n(P.r)} + ${n(P.s)}`}, a turn by ${pl(X.shift, 'step')} (mod ${n(m)}), and its order is ${n(m)} ÷ gcd(${n(X.shift)}, ${n(m)}) = ${n(m)} ÷ ${n(gcd(X.shift, m))} = ${n(X.ord)}.`}`,
   guidance: [
    { prompt: `Follow the corner that starts at mark ${n(v)} through the moves. At which mark does it end?`, answer: [X.end], explanation: `Move by move: ${hops}.` },
    { prompt: `The routine has ${pl(X.flips, 'flip')}. Each flip has determinant −1, each turn 1, and determinants multiply. What is the determinant of the routine?`, answer: [X.det], explanation: `${dets} = ${n(X.det)}.` },
    X.det === -1
     ? { prompt: 'A routine with determinant −1 is a flip. What is its order?', answer: [2], explanation: 'A flip done twice puts every corner back on its own mark, and done once it does not, so its order is 2.' }
     : { prompt: `A routine with determinant 1 is a turn; this one is a turn by ${pl(X.shift, 'step')}. What is its order, ${n(m)} ÷ gcd(${n(X.shift)}, ${n(m)})?`, answer: [X.ord], explanation: `gcd(${n(X.shift)}, ${n(m)}) = ${n(gcd(X.shift, m))}, so the order is ${n(m)} ÷ ${n(gcd(X.shift, m))} = ${n(X.ord)}.` }
   ] }; }
 },
 /* Number of subgroups of Zₘ (its divisors) and |⟨a⟩| = m ÷ gcd(a, m). m has at least 4 divisors; gcd(a, m) is
    usually above 1. Not the worked example (m = 20, a = 8). */
 q18: {
  canonical: { m: 36, a: 15 },
  draw: R => bounded(R, { m: 36, a: 15 }, R => { const m = R.int(12, 60); return { m, a: R.int(2, m - 1), keep: R.int(0, 3) }; },
   p => divisors(p.m).length >= 4 && (gcd(p.a, p.m) > 1 || p.keep === 0) && !(p.m === 20 && p.a === 8)),
  build: ({ m, a }) => { const ds = divisors(m), g = gcd(a, m), size = m / g; return {
   prompt: `A sorting wheel at the depot has ${n(m)} slots numbered 0 to ${n(m - 1)}, and turning it on by k slots is adding k mod ${n(m)}, so its moves form the group ${Z(m)}. A subgroup is a set of these moves that is a group by itself under the same addition. Enter the number of subgroups of ${Z(m)}, then the size of ⟨${n(a)}⟩, the subgroup made by adding ${n(a)} again and again.`,
   answer: [ds.length, size],
   hints: ['Zₙ has exactly one subgroup for each divisor d of n, the one with d elements. So count the divisors of n, 1 and n included.', 'Adding a again and again lands on the multiples of gcd(a, n), so ⟨a⟩ has n ÷ gcd(a, n) elements.'],
   solution: `The divisors of ${n(m)} are ${and(ds.map(n))}, so ${Z(m)} has ${n(ds.length)} subgroups, one of each of those sizes. gcd(${n(a)}, ${n(m)}) = ${n(g)}, so ⟨${n(a)}⟩ = ${g === a ? '' : `⟨${n(g)}⟩ = `}${multiples(g, m)}, which has ${n(m)} ÷ ${n(g)} = ${n(size)} elements.`,
   guidance: [
    { prompt: `List the divisors of ${n(m)}, 1 and ${n(m)} included. How many are there?`, answer: [ds.length], explanation: `${and(ds.map(n))}: ${n(ds.length)} divisors, so ${n(ds.length)} subgroups.` },
    { prompt: `What is gcd(${n(a)}, ${n(m)})?`, answer: [g], explanation: `${n(g)} is the largest number that divides both ${n(a)} and ${n(m)}.` },
    { prompt: `What is the size of ⟨${n(a)}⟩, which is ${n(m)} ÷ gcd(${n(a)}, ${n(m)})?`, answer: [size], explanation: `${n(m)} ÷ ${n(g)} = ${n(size)}: ⟨${n(a)}⟩ is ${multiples(g, m)}.` }
   ] }; }
 },
 /* The d cosets of ⟨d⟩ in Zₘ (d divides m) and the smallest element of a + ⟨d⟩, which is a mod d. a > d and a mod d is
    not 0. Not the worked example (m = 12, d = 4, a = 9). */
 q19: {
  canonical: { m: 24, d: 6, a: 17 },
  draw: R => bounded(R, { m: 24, d: 6, a: 17 }, R => { const m = R.pick([12, 15, 16, 18, 20, 21, 24, 27, 28, 30, 32, 35, 36, 40, 42, 44, 45, 48, 50, 54, 56, 60]), ds = divisors(m).filter(x => x > 1 && x < m);
   const d = R.pick(ds); return { m, d, a: R.int(1, m - 1) }; },
   p => p.a > p.d && p.a % p.d !== 0 && p.m / p.d >= 2 && !(p.m === 12 && p.d === 4 && p.a === 9)),
  build: ({ m, d, a }) => { const k = m / d, r = a % d, q = Math.floor(a / d); return {
   prompt: `The depot labels its parts 0 to ${n(m - 1)} and adds labels mod ${n(m)}, so the labels form the group ${Z(m)}. Rack H holds the subgroup ⟨${n(d)}⟩ = ${multiples(d, m)}. For a label a, the coset a + H is the set made by adding a to every element of H, mod ${n(m)}, and each coset fills one rack. Enter the number of different cosets of H in ${Z(m)}, then the smallest label in the coset ${n(a)} + H.`,
   answer: [d, r],
   hints: ['Two cosets are either the same set or share nothing, and each has as many elements as H. So the number of cosets is the size of the whole group divided by the size of H.', 'Every element of a + H differs from a by a multiple of d. Take away d again and again, staying at 0 or above: the smallest element is the remainder of a ÷ d.'],
   solution: `H = ⟨${n(d)}⟩ has ${n(m)} ÷ ${n(d)} = ${n(k)} elements. The cosets do not overlap and each has ${n(k)} elements, so there are ${n(m)} ÷ ${n(k)} = ${n(d)} of them: ${d <= 4 ? and(Array.from({ length: d }, (_, i) => `${i} + H`)) : `0 + H, 1 + H, …, ${n(d - 1)} + H`}. ${n(a)} = ${n(q)} × ${n(d)} + ${n(r)}, so the smallest label in ${n(a)} + H is ${n(r)}.`,
   guidance: [
    { prompt: `How many elements does H = ⟨${n(d)}⟩ have?`, answer: [k], explanation: `The multiples of ${n(d)} below ${n(m)}: ${n(m)} ÷ ${n(d)} = ${n(k)} of them.` },
    { prompt: `The cosets split ${Z(m)} into racks of ${n(k)} labels each, with no overlap. How many cosets are there?`, answer: [d], explanation: `${n(m)} labels in racks of ${n(k)}: ${n(m)} ÷ ${n(k)} = ${n(d)} cosets.` },
    { prompt: `Take ${n(d)} away from ${n(a)} as often as you can without going below 0. What is the smallest label in ${n(a)} + H?`, answer: [r], explanation: `${n(a)} = ${n(q)} × ${n(d)} + ${n(r)}, so the smallest label in ${n(a)} + H is ${n(r)}.` }
   ] }; }
 },
 /* Index |G| ÷ |H| and 1 or 0 for "Lagrange allows a subgroup of size k" (k divides |G|). k is neither 1, |G| nor |H|,
    and divides |G| in about half the draws. Not the worked example (|G| = 24, |H| = 6). */
 q20: {
  canonical: { N: 60, M: 12, k: 8 },
  draw: R => bounded(R, { N: 60, M: 12, k: 8 }, R => { const N = R.pick([12, 16, 18, 20, 24, 28, 30, 32, 36, 40, 42, 45, 48, 50, 54, 56, 60, 63, 64, 72, 80, 84, 90, 96]), ds = divisors(N).filter(x => x > 1 && x < N);
   const M = R.pick(ds), yes = R.bool(), k = yes ? R.pick(ds) : R.int(2, Math.floor(N / 2)); return { N, M, k }; },
   p => p.k !== p.M && !(p.N === 24 && p.M === 6)),
  build: ({ N, M, k }) => { const idx = N / M, rem = N % k, ok = rem === 0 ? 1 : 0; return {
   prompt: `A sorting robot’s moves form a group G with ${n(N)} moves, and the moves that keep a crate upright form a subgroup H with ${n(M)} moves. Enter the index [G : H], the number of cosets of H in G, then 1 if Lagrange’s theorem allows G to have a subgroup with ${n(k)} moves, or 0 if the theorem rules one out. (Allowed is not the same as certain: the theorem can only rule sizes out.)`,
   answer: [idx, ok],
   hints: ['The cosets of H split G into equal batches of |H| moves, so the index [G : H] is |G| ÷ |H|.', 'Lagrange’s theorem: the size of every subgroup divides the size of the group. A size that does not divide |G| is ruled out.'],
   solution: `The cosets of H split the ${n(N)} moves into batches of ${n(M)}, so [G : H] = ${n(N)} ÷ ${n(M)} = ${n(idx)}. ${ok ? `${n(N)} = ${n(N / k)} × ${n(k)}, so ${n(k)} divides ${n(N)} and Lagrange’s theorem allows a subgroup of ${n(k)} moves.` : `${n(N)} = ${n(Math.floor(N / k))} × ${n(k)} + ${n(rem)}, so ${n(k)} does not divide ${n(N)} and Lagrange’s theorem rules out a subgroup of ${n(k)} moves.`}`,
   guidance: [
    { prompt: `What is the index [G : H] = |G| ÷ |H|?`, answer: [idx], explanation: `${n(N)} ÷ ${n(M)} = ${n(idx)}: G splits into ${n(idx)} cosets of H.` },
    { prompt: `What is the remainder when ${n(N)} is divided by ${n(k)}?`, answer: [rem], explanation: ok ? `${n(N)} = ${n(N / k)} × ${n(k)}, so the remainder is 0.` : `${n(N)} = ${n(Math.floor(N / k))} × ${n(k)} + ${n(rem)}, so the remainder is ${n(rem)}.` },
    { prompt: `Does Lagrange’s theorem allow a subgroup with ${n(k)} moves? Enter 1 for allowed or 0 for ruled out.`, answer: [ok], explanation: ok ? `${n(k)} divides ${n(N)}, so the theorem does not rule it out: 1.` : `${n(k)} does not divide ${n(N)}, so no subgroup of G can have ${n(k)} moves: 0.` }
   ] }; }
 }
});
})();
