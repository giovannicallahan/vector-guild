/* Abstract algebra: patterns of moves concept-bench experiments, file b: q11–q20. Model shape: docs/PACK-FORMAT.md §4.
   t is an integer slider value in [-10, 10]; values[0] is the target. The drill statements in variants-b.js describe the same numbers. */
(function(){
'use strict';
const n = x => window.Gen.n(x), par = x => window.Gen.par(x);
const T = t => Math.max(-10, Math.min(10, Math.round(Number(t) || 0)));
const E = (prompt, formula, values) => ({ prompt, formula, values, target: values[0][1] });
/* Shared with variants-b.js through the formulas below: keep the two files in step. */
/* Small helpers, the same rules as gen-b.js. */
const gcd = (a, b) => { while (b) [a, b] = [b, a % b]; return a; };
const mod = (a, m) => ((a % m) + m) % m;
const cyclesOf = p => { const seen = new Set(), out = []; for (let s = 1; s <= p.length; s++) { if (seen.has(s)) continue; const c = []; let x = s; while (!seen.has(x)) { seen.add(x); c.push(x); x = p[x - 1]; } out.push(c); } return out; };
const cycText = p => cyclesOf(p).map(c => '(' + c.join(' ') + ')').join('');
const lcmAll = list => list.reduce((a, b) => a / gcd(a, b) * b, 1);
const fact = k => k <= 1 ? 1 : k * fact(k - 1);
/* q13, q14: eight-socket bolt moves, picked by the slider. Shared with variants-b.js (BENCH_MOVES there). */
const MOVES = [[2, 1, 4, 5, 3, 7, 8, 6], [3, 4, 1, 2, 6, 5, 8, 7], [2, 3, 4, 1, 6, 7, 5, 8], [5, 1, 2, 3, 4, 7, 6, 8], [2, 1, 3, 5, 6, 7, 8, 4], [4, 2, 6, 1, 3, 8, 5, 7], [1, 3, 2, 5, 6, 4, 8, 7]];
const SIGMA = [2, 5, 1, 6, 3, 4], TAU = [4, 1, 6, 2, 5, 3];
const SIZES = [2, 3, 4, 6, 8, 9, 12, 18, 24, 36];
window.EXPERIMENTS = window.EXPERIMENTS || {};
Object.assign(window.EXPERIMENTS, {
 /* U(13) with a from 2 to 12: the order of a and its inverse a^(k − 1). */
 q11: t => { t = T(t); const a = 2 + (t + 10) % 11, pw = []; let x = 1; do { x = x * a % 13; pw.push(x); } while (x !== 1); const k = pw.length, inv = k > 1 ? pw[k - 2] : 1;
  return E('Predict the order of a in U(13).', `Multiplying by ${n(a)} and keeping the remainder mod 13, the powers of ${n(a)} are ${pw.map(n).join(', ')}. The first 1 comes at power ${n(k)}, so the order is ${n(k)}, and the power before it, ${n(inv)}, is the inverse.`, [['Order', k], ['Inverse', inv]]); },
 /* Fixed σ and τ on 6 sockets; the socket i runs from 1 to 6. */
 q12: t => { t = T(t); const i = 1 + (t + 10) % 6, ti = TAU[i - 1], r = SIGMA[ti - 1], w = TAU[SIGMA[i - 1] - 1];
  return E('Predict (σ ∘ τ)(i): τ first, then σ.', `τ(${n(i)}) = ${n(ti)} and σ(${n(ti)}) = ${n(r)}, so (σ ∘ τ)(${n(i)}) = ${n(r)}. The other order gives (τ ∘ σ)(${n(i)}) = ${n(w)}.`, [['(σ ∘ τ)(i)', r], ['τ(i)', ti], ['(τ ∘ σ)(i)', w]]); },
 /* One of seven eight-socket moves: the order is the lcm of the cycle lengths. */
 q13: t => { t = T(t); const p = MOVES[(t + 10) % 7], cs = cyclesOf(p), lens = cs.map(c => c.length), ord = lcmAll(lens);
  return E('Predict the order of the move: the lcm of its cycle lengths.', `In cycle notation the move is ${cycText(p)}, with cycle lengths ${lens.map(n).join(', ')}. lcm(${lens.map(n).join(', ')}) = ${n(ord)}.`, [['Order', ord], ['Number of cycles', cs.length]]); },
 /* The same seven moves: transpositions = 8 − cycles, and the sign. */
 q14: t => { t = T(t); const p = MOVES[(t + 10) % 7], c = cyclesOf(p).length, tr = 8 - c, sign = tr % 2 ? -1 : 1;
  return E('Predict how many transpositions the cycle rule gives: the sockets minus the cycles.', `In cycle notation the move is ${cycText(p)}: ${n(c)} cycles on 8 sockets, so 8 − ${n(c)} = ${n(tr)} transpositions, and the sign is ${n(sign)}.`, [['Transpositions', tr], ['Sign', sign], ['Number of cycles', c]]); },
 /* k free bolts, k from 3 to 7: |A_k| = k! ÷ 2. */
 q15: t => { t = T(t); const k = 3 + (t + 10) % 5, f = fact(k);
  return E('Predict how many of the rearrangements are even permutations.', `${n(k)}! = ${n(f)} rearrangements, and exactly half are even: ${n(f)} ÷ 2 = ${n(f / 2)}. There are also ${n(k)} × ${n(k - 1)} ÷ 2 = ${n(k * (k - 1) / 2)} transpositions.`, [['Even rearrangements', f / 2], ['All rearrangements', f], ['Transpositions', k * (k - 1) / 2]]); },
 /* An 8-cornered hatch, the corner at mark 2, a turn by r = 1 to 7 steps then the flip. */
 q16: t => { t = T(t); const r = 1 + (t + 10) % 7, a = mod(2 + r, 8), f = mod(-a, 8);
  return E('Predict the mark where the corner ends.', `The turn takes mark 2 to (2 + ${n(r)}) mod 8 = ${n(a)}. The flip takes mark ${n(a)} to ${a === 0 ? 'itself, 0' : `8 − ${n(a)} = ${n(f)}`}.`, [['Final mark', f], ['Mark after the turn', a]]); },
 /* A 12-cornered hatch: flip, turn by r = 1 to 11 steps, flip; a turn by 12 − r steps. */
 q17: t => { t = T(t); const r = 1 + (t + 10) % 11, sh = 12 - r, g = gcd(sh, 12);
  return E('Predict the order of the routine.', `Two flips give determinant (−1) × 1 × (−1) = 1, so the routine is a turn: p goes to p − ${n(r)}, a turn by ${n(sh)} steps. Its order is 12 ÷ gcd(${n(sh)}, 12) = 12 ÷ ${n(g)} = ${n(12 / g)}.`, [['Order', 12 / g], ['Determinant', 1], ['Turn in steps', sh]]); },
 /* Z₆₀ and a from 4 to 44 in steps of 2: |⟨a⟩| = 60 ÷ gcd(a, 60). */
 q18: t => { t = T(t); const a = 24 + 2 * t, g = gcd(a, 60);
  return E('Predict the size of ⟨a⟩ in Z₆₀.', `gcd(${n(a)}, 60) = ${n(g)}, so ⟨${n(a)}⟩ = ⟨${n(g)}⟩ has 60 ÷ ${n(g)} = ${n(60 / g)} elements.`, [['Size of ⟨a⟩', 60 / g], ['gcd(a, 60)', g]]); },
 /* Z₄₈ with H = ⟨8⟩ and a from 11 to 31: the smallest element of a + H is a mod 8. */
 q19: t => { t = T(t); const a = 21 + t, r = a % 8;
  return E('Predict the smallest element of the coset a + H.', `H = ⟨8⟩ has 48 ÷ 8 = 6 elements, so there are 8 cosets. ${n(a)} = ${n(Math.floor(a / 8))} × 8 + ${n(r)}, so the smallest element of ${n(a)} + H is ${n(r)}.`, [['Smallest element', r], ['Number of cosets', 8]]); },
 /* |G| = 72 and a subgroup size from the divisors 2 to 36: the index 72 ÷ |H|. */
 q20: t => { t = T(t); const M = SIZES[(t + 10) % 10];
  return E('Predict the index [G : H].', `The cosets of H split the 72 elements into batches of ${n(M)}, so [G : H] = 72 ÷ ${n(M)} = ${n(72 / M)}.`, [['Index', 72 / M], ['Size of H', M]]); },
});
})();
