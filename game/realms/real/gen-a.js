/* Real analysis mission generators, file a: q01–q10. Shape and helpers: docs/PACK-FORMAT.md §3 and game/gen-core.js.
   build(canonical) must reproduce the authored text in missions-a.js exactly. */
(function(){
'use strict';
const G = window.Gen, { n, plus, par } = G;
/* Retry a draw at most 1000 times, then fall back to the canonical parameters. */
const retry = (make, ok, fallback) => { for (let i = 0; i < 1000; i++) { const p = make(); if (ok(p)) return p; } return { ...fallback }; };
/* "(x − 3)²", "(x + 2)²" or "x²". */
const sq = h => h === 0 ? 'x²' : `(x ${h > 0 ? '−' : '+'} ${n(Math.abs(h))})²`;
/* A number with "…" when its decimals go on past the four that n() shows. */
const dots = (top, bottom) => n(top / bottom) + ((top * 10000) % bottom === 0 ? '' : '…');
/* Triangular numbers: tri(m) = 1 + 2 + … + m. */
const tri = m => m * (m + 1) / 2;
/* "5 + 6 ÷ n", or "6 ÷ n" when the level is 0. */
const lev = (v, c) => v === 0 ? `${n(c)} ÷ n` : `${n(v)} + ${n(c)} ÷ n`;
/* "1 + 2 + 3", "1 + 2 + 3 + 4" or "1 + 2 + … + m" for m >= 3. */
const upTo = m => m <= 4 ? Array.from({ length: m }, (_, i) => i + 1).join(' + ') : `1 + 2 + … + ${m}`;
window.MISSION_GEN = window.MISSION_GEN || {};
Object.assign(window.MISSION_GEN, {
 /* form 0: S = {a − b/n}, rising to a, never reaching it (sup a, no maximum).
    form 1: S = {a + b/n}, falling from a + b at n = 1 (sup a + b, a maximum). Never the worked example {5 − 2/n}. */
 q01: {
  canonical: { form: 0, a: 4, b: 3 },
  draw: R => retry(() => ({ form: R.int(0, 1), a: R.int(2, 12), b: R.int(2, 9) }), p => !(p.form === 0 && p.a === 5 && p.b === 2), { form: 0, a: 4, b: 3 }),
  build: ({ form, a, b }) => { const up = form === 0, e = up ? `${n(a)} − ${n(b)}/n` : `${n(a)} + ${n(b)}/n`, s = up ? -1 : 1,
   r1 = a + s * b, r2 = a + s * b / 2, r4 = a + s * b / 4, sup = up ? a : a + b, max = up ? 0 : 1; return {
   prompt: `A calibration rod is tested once for each n = 1, 2, 3, …, and test n gives the reading ${e}. The readings form the set S = {${e} : n ∈ ℕ}. Enter the supremum sup S, then 1 if S has a maximum (sup S is itself one of the readings) or 0 if it does not.`,
   answer: [sup, max],
   hints: ['Write out the readings for n = 1, 2, 4 and 10, and see which way they move as n grows.', 'An upper bound sits at or above every reading, and the supremum is the smallest number that does. Then ask whether some single reading equals it.'],
   solution: up
    ? `For n = 1, 2 and 4 the readings are ${n(r1)}, ${n(r2)} and ${n(r4)}: they rise as n grows, because ${n(b)}/n shrinks. Every reading is below ${n(a)}, since ${n(b)}/n is positive, so ${n(a)} is an upper bound. No smaller number u is one: ${n(b)}/n becomes smaller than the gap ${n(a)} − u once n is large enough, and then that reading lies above u. So sup S = ${n(a)}. No reading equals ${n(a)}, because that would need ${n(b)}/n = 0, so S has no maximum: enter 0.`
    : `For n = 1, 2 and 4 the readings are ${n(r1)}, ${n(r2)} and ${n(r4)}: they fall as n grows, because ${n(b)}/n shrinks. So the first reading, ${n(r1)}, is the largest; it is an upper bound, and no smaller number is one, because that number would sit below the reading ${n(r1)}. So sup S = ${n(sup)}, and it is itself a reading, the maximum of S: enter 1.`,
   guidance: [
    { prompt: `What does the rod read in the first test, n = 1?`, answer: [r1], explanation: `Put n = 1 into ${e}: ${n(a)} ${up ? '−' : '+'} ${n(b)} = ${n(r1)}.` },
    { prompt: `What is the smallest number that sits at or above every reading?`, answer: [sup], explanation: up
     ? `The readings rise towards ${n(a)} and get as close to it as you like, but never pass it. So ${n(a)} is an upper bound and nothing smaller is: sup S = ${n(a)}.`
     : `The readings fall after the first one, so the first, ${n(r1)}, is above all the others. Nothing smaller than it can be an upper bound: sup S = ${n(sup)}.` },
    { prompt: `Is sup S one of the readings? Enter 1 for yes, 0 for no.`, answer: [max], explanation: up
     ? `A reading equal to ${n(a)} would need ${n(b)}/n = 0, which no n gives. So S has no maximum: 0.`
     : `The reading at n = 1 equals sup S, so S has a maximum: 1.` }
   ] }; }
 },
 /* form 0: {a + b/n}, inf a not attained; form 1: {a − b/n}, inf a − b attained at n = 1;
    form 2: [a, b), inf a attained; form 3: (a, b], inf a not attained. Never the worked example {3 + 4/n}. */
 q02: {
  canonical: { form: 0, a: 2, b: 5 },
  draw: R => retry(() => { const form = R.int(0, 3); if (form < 2) return { form, a: R.int(-3, 9), b: R.int(2, 9) }; const a = R.int(-6, 6); return { form, a, b: a + R.int(1, 8) }; },
   p => !(p.form === 0 && p.a === 3 && p.b === 4), { form: 0, a: 2, b: 5 }),
  build: ({ form, a, b }) => { const set = form < 2, e = form === 0 ? `${n(a)} + ${n(b)}/n` : `${n(a)} − ${n(b)}/n`,
   iv = form === 2 ? `[${n(a)}, ${n(b)})` : `(${n(a)}, ${n(b)}]`, cond = form === 2 ? `${n(a)} ≤ x < ${n(b)}` : `${n(a)} < x ≤ ${n(b)}`,
   inf = form === 1 ? a - b : a, att = form === 1 || form === 2 ? 1 : 0;
   const lead = set ? `A pressure gauge is tested once for each n = 1, 2, 3, …, and test n settles at the reading ${e}, so its readings form the set S = {${e} : n ∈ ℕ}.`
    : `A thermostat accepts every setting x with ${cond}, so the accepted settings form the interval S = ${iv}.`;
   const why = [
    `The readings ${n(a + b)}, ${n(a + b / 2)}, ${n(a + b / 4)}, … (n = 1, 2, 4) fall as n grows, because ${n(b)}/n shrinks, and every one is above ${n(a)}, since ${n(b)}/n is positive. So ${n(a)} is a lower bound. No larger number v is one: once n is large enough, ${n(b)}/n is smaller than the gap v − ${par(a)}, and that reading lies below v. So inf S = ${n(a)}. No reading equals ${n(a)}, because that would need ${n(b)}/n = 0, so the infimum is not attained: enter 0.`,
    `The readings ${n(a - b)}, ${n(a - b / 2)}, ${n(a - b / 4)}, … (n = 1, 2, 4) rise as n grows, because ${n(b)}/n shrinks. So the first reading, ${n(a - b)}, is below all the others: it is a lower bound, and no larger number is one, because that number would sit above the reading ${n(a - b)}. So inf S = ${n(a - b)}, and it is attained at n = 1: enter 1.`,
    `Every x in S has x ≥ ${n(a)}, so ${n(a)} is a lower bound; any larger number v is not one, because the settings just above ${n(a)} and below v are in S. So inf S = ${n(a)}. The square bracket says x = ${n(a)} itself is accepted, so the infimum is attained (it is the minimum of S): enter 1.`,
    `Every x in S has x > ${n(a)}, so ${n(a)} is a lower bound; any larger number v is not one, because the settings just above ${n(a)} and below v are in S. So inf S = ${n(a)}. The round bracket says x = ${n(a)} itself is left out, so the infimum is not attained: enter 0.`
   ][form];
   return {
   prompt: `${lead} Enter the infimum inf S, then 1 if the infimum is attained (it is itself in S, so S has a minimum) or 0 if it is not.`,
   answer: [inf, att],
   hints: ['A lower bound sits at or below every member of S, and the infimum is the largest number that does.', 'A square bracket means the end point is included and a round bracket means it is left out. For a set of readings, check whether one single reading equals the infimum.'],
   solution: why,
   guidance: [
    { prompt: `Every member of S is at least some number, and no larger number has that property. What is that number, inf S?`, answer: [inf], explanation: why.split(' So inf S')[0] + ` So inf S = ${n(inf)}.` },
    { prompt: `Is inf S itself a member of S? Enter 1 for yes, 0 for no.`, answer: [att], explanation: att ? `${n(inf)} is in S, so the infimum is attained and S has a minimum: 1.` : `${n(inf)} is not in S, so the infimum is not attained and S has no minimum: 0.` }
   ] }; }
 },
 /* ε = k/1000 and rods of X/100 metres covering Y metres. Both answers are "the next whole number above"
    1 ÷ ε and Y ÷ x, exactly: when the quotient is whole, that quotient itself fails the strict inequality.
    Never the worked example (ε = 0.04 with rods of 0.25 m over 6 m). */
 q03: {
  canonical: { k: 30, X: 35, Y: 9 },
  draw: R => retry(() => ({ k: R.pick([2, 3, 4, 5, 6, 7, 8, 9, 12, 15, 16, 20, 24, 25, 30, 40, 50, 60, 75, 80]), X: R.int(12, 95), Y: R.int(2, 20) }),
   p => !(p.k === 40 && p.X === 25 && p.Y === 6), { k: 30, X: 35, Y: 9 }),
  build: ({ k, X, Y }) => { const eps = k / 1000, x = X / 100, w1 = Math.floor(1000 / k), n1 = w1 + 1, w2 = Math.floor(100 * Y / X), n2 = w2 + 1,
   tie1 = 1000 % k === 0, tie2 = (100 * Y) % X === 0;
   const s1 = tie1 ? `1 ÷ ${n(eps)} = ${n(w1)} exactly, and n = ${n(w1)} fails, because 1/${n(w1)} equals ε instead of being smaller. So the smallest n is ${n(n1)}.`
    : `1 ÷ ${n(eps)} = ${dots(1000, k)}, and the smallest whole number above it is ${n(n1)}.`;
   const s2 = tie2 ? `${n(Y)} ÷ ${n(x)} = ${n(w2)} exactly, and ${n(w2)} rods only reach ${n(Y)} metres without passing it. So the smallest number of rods is ${n(n2)}.`
    : `${n(Y)} ÷ ${n(x)} = ${dots(100 * Y, X)}, and the smallest whole number above it is ${n(n2)}.`;
   return {
   prompt: `Mira wants two certificates that rest on the Archimedean property. First, a step of 1/n millimetres counts as negligible when it is smaller than the tolerance ε = ${n(eps)}: enter the smallest n ∈ ℕ with 1/n < ${n(eps)}. Second, a test track ${n(Y)} metres long is to be passed by laying identical calibration rods ${n(x)} metres long end to end: enter the smallest number of rods n with n × ${n(x)} > ${n(Y)}.`,
   answer: [n1, n2],
   hints: ['1/n < ε is the same as n > 1 ÷ ε, because both sides are positive. Work out 1 ÷ ε and take the next whole number above it.', 'For the rods, n × x > y is the same as n > y ÷ x. If y ÷ x is a whole number, that many rods only just reach y and do not pass it.'],
   solution: `1/n < ${n(eps)} means n > 1 ÷ ${n(eps)}. ${s1} For the rods, n × ${n(x)} > ${n(Y)} means n > ${n(Y)} ÷ ${n(x)}. ${s2}`,
   guidance: [
    { prompt: `What is the whole-number part of 1 ÷ ${n(eps)}? (Drop any decimals.)`, answer: [w1], explanation: `1 ÷ ${n(eps)} = ${dots(1000, k)}, whose whole-number part is ${n(w1)}.` },
    { prompt: `What is the smallest n ∈ ℕ with n > 1 ÷ ${n(eps)}, so that 1/n < ${n(eps)}?`, answer: [n1], explanation: s1 },
    { prompt: `What is the whole-number part of ${n(Y)} ÷ ${n(x)}?`, answer: [w2], explanation: `${n(Y)} ÷ ${n(x)} = ${dots(100 * Y, X)}, whose whole-number part is ${n(w2)}.` },
    { prompt: `What is the smallest number of rods n with n × ${n(x)} > ${n(Y)}?`, answer: [n2], explanation: s2 }
   ] }; }
 },
 /* |e₁| ≤ A/10, |e₂| ≤ B/10 mm: the largest |e₁ + e₂| is (A + B)/10. |x − c| < r/10 gives the open interval
    (c − r/10, c + r/10). The worked example uses 0.2, 0.6, 80 and 0.5. */
 q04: {
  canonical: { A: 3, B: 5, c: 250, r: 4 },
  draw: R => ({ A: R.int(1, 9), B: R.int(1, 9), c: R.int(100, 500), r: R.int(1, 9) }),
  build: ({ A, B, c, r }) => { const a = A / 10, b = B / 10, s = (A + B) / 10, d = r / 10, lo = (10 * c - r) / 10, hi = (10 * c + r) / 10; return {
   prompt: `Two instruments each add an error to a rod reading. The first error e₁ satisfies |e₁| ≤ ${n(a)} mm and the second error e₂ satisfies |e₂| ≤ ${n(b)} mm, and each may be positive or negative. Enter the largest value the total error |e₁ + e₂| can take, in millimetres. Then the rod's certificate accepts every length x with |x − ${n(c)}| < ${n(d)} mm: enter the left end, then the right end, of the interval of accepted lengths.`,
   answer: [s, lo, hi],
   hints: ['The triangle inequality says |e₁ + e₂| ≤ |e₁| + |e₂|. Then ask whether both errors can be at their largest size with the same sign at once.', '|x − c| is the distance from x to c on the number line, so |x − c| < r says x lies less than r away from c, on either side.'],
   solution: `By the triangle inequality, |e₁ + e₂| ≤ |e₁| + |e₂| ≤ ${n(a)} + ${n(b)} = ${n(s)}. The bound is reached when e₁ = ${n(a)} and e₂ = ${n(b)} (or both are negative), so the largest possible total error is ${n(s)} mm. Next, |x − ${n(c)}| < ${n(d)} says x is less than ${n(d)} away from ${n(c)}, so ${n(c)} − ${n(d)} < x < ${n(c)} + ${n(d)}: the open interval (${n(lo)}, ${n(hi)}). Its left end is ${n(lo)} and its right end ${n(hi)}; the end points themselves are not accepted.`,
   guidance: [
    { prompt: `What is the largest possible value of |e₁ + e₂| when |e₁| ≤ ${n(a)} and |e₂| ≤ ${n(b)}?`, answer: [s], explanation: `The triangle inequality caps it at ${n(a)} + ${n(b)} = ${n(s)}, and e₁ = ${n(a)}, e₂ = ${n(b)} reaches the cap.` },
    { prompt: `|x − ${n(c)}| < ${n(d)} puts x less than ${n(d)} from ${n(c)}. What is the left end of the interval?`, answer: [lo], explanation: `${n(c)} − ${n(d)} = ${n(lo)}.` },
    { prompt: `What is the right end of the interval?`, answer: [hi], explanation: `${n(c)} + ${n(d)} = ${n(hi)}. So the accepted lengths are the open interval (${n(lo)}, ${n(hi)}).` }
   ] }; }
 },
 /* f(x) = s(x − h)² + k on the open interval (p, q), h never an end point and k never 0. The extreme
    values come from the two end values (approached, not attained) and from the vertex when p < h < q.
    Never the worked example ((x − 1)² + 2 on (−1, 2)). */
 q05: {
  canonical: { s: 1, h: 3, k: 2, p: 1, q: 6 },
  draw: R => retry(() => { const p = R.int(-3, 3), q = p + R.int(2, 5); return { s: R.pick([1, -1]), h: R.int(p - 2, q + 2), k: R.nz(-6, 9), p, q }; },
   o => o.h !== o.p && o.h !== o.q && !(o.s === 1 && o.h === 1 && o.k === 2 && o.p === -1 && o.q === 2), { s: 1, h: 3, k: 2, p: 1, q: 6 }),
  build: ({ s, h, k, p, q }) => { const f = x => s * (x - h) * (x - h) + k, fp = f(p), fq = f(q), inside = p < h && h < q,
   F = s === 1 ? `${sq(h)} ${k < 0 ? '−' : '+'} ${n(Math.abs(k))}` : `${n(k)} − ${sq(h)}`;
   const sup = s === 1 ? Math.max(fp, fq) : (inside ? k : Math.max(fp, fq)), inf = s === 1 ? (inside ? k : Math.min(fp, fq)) : Math.min(fp, fq);
   const shape = s === 1 ? `The square ${sq(h)} is never negative and is 0 only at x = ${n(h)}, so f is smallest at x = ${n(h)} and grows as x moves away from ${n(h)} in either direction.`
    : `The square ${sq(h)} is never negative and is 0 only at x = ${n(h)}, so f is largest at x = ${n(h)} and falls as x moves away from ${n(h)} in either direction.`;
   const vert = inside ? `x = ${n(h)} lies inside the interval, where f(${n(h)}) = ${n(k)} is attained.` : `x = ${n(h)} lies outside the interval, so on it f only rises or only falls.`;
   const ends = `At the end points f would be f(${n(p)}) = ${n(fp)} and f(${n(q)}) = ${n(fq)}; these values are approached as x moves towards the ends, but the ends themselves are not in the interval.`;
   return {
   prompt: `A gauge's response at dial setting x is f(x) = ${F}. It is certified only on the open interval (${n(p)}, ${n(q)}), the settings with ${n(p)} < x < ${n(q)}; the end points are not included. Enter sup f and then inf f over this interval: the supremum and the infimum of the set of values f takes there.`,
   answer: [sup, inf],
   hints: ['A square is never negative, so (x − h)² is 0 at x = h and grows as x moves away from h. Decide whether that point lies inside the interval.', 'On an open interval the values near the end points still count: a supremum or infimum can be a value f approaches at an end point without reaching it.'],
   solution: `${shape} ${vert} ${ends} So sup f = ${n(sup)} and inf f = ${n(inf)}.`,
   guidance: [
    { prompt: `What value does f approach as x moves towards the left end, x = ${n(p)}?`, answer: [fp], explanation: `f(${n(p)}) = ${n(fp)}. The setting ${n(p)} is not in the interval, but values of f come as close to ${n(fp)} as you like.` },
    { prompt: `What value does f approach as x moves towards the right end, x = ${n(q)}?`, answer: [fq], explanation: `f(${n(q)}) = ${n(fq)}.` },
    { prompt: `What is sup f over the interval?`, answer: [sup], explanation: `${shape} ${vert} The smallest number at or above every value is ${n(sup)}.` },
    { prompt: `What is inf f over the interval?`, answer: [inf], explanation: `The largest number at or below every value is ${n(inf)}.` }
   ] }; }
 },
 /* Diagonal listing of ℕ × ℕ by sum, then by first entry: (a, b) sits at tri(a + b − 2) + a. The pair at
    position P is on the first diagonal s with tri(s − 1) ≥ P. (a, b) is never among the six pairs the prompt
    prints, and neither is the pair at P. Never the worked example ((2, 3) and position 12). */
 q06: {
  canonical: { a: 3, b: 4, P: 20 },
  draw: R => retry(() => ({ a: R.int(1, 9), b: R.int(1, 9), P: R.int(7, 80) }), p => p.a + p.b >= 5 && !(p.a === 2 && p.b === 3) && p.P !== 12 && p.P !== tri(p.a + p.b - 2) + p.a, { a: 3, b: 4, P: 20 }),
  build: ({ a, b, P }) => { const s = a + b, before = tri(s - 2), pos = before + a; let s2 = 2; while (tri(s2 - 1) < P) s2++;
   const before2 = tri(s2 - 2), a2 = P - before2, b2 = s2 - a2; return {
   prompt: `The lab gives every pair (a, b) of natural numbers a place in one list, which shows that the set ℕ × ℕ of all such pairs is countable. The list runs along diagonals: first the pair whose entries add to 2, then the pairs adding to 3, then 4, and so on; inside each diagonal the first entry goes up. So the list starts (1, 1), (1, 2), (2, 1), (1, 3), (2, 2), (3, 1), …, with (1, 1) in position 1. Enter the position of the pair (${n(a)}, ${n(b)}). Then enter the pair in position ${n(P)}: its first entry, then its second.`,
   answer: [pos, a2, b2],
   hints: ['The diagonal with entries adding to s holds s − 1 pairs, so the diagonals before it hold 1 + 2 + … + (s − 2) pairs between them. Inside its diagonal, a pair with first entry a is the a-th one.', 'To go back from a position to a pair, add 1 + 2 + 3 + … until the total first reaches the position. That tells you the diagonal; how far into it the position falls tells you the first entry.'],
   solution: `(${n(a)}, ${n(b)}) lies on the diagonal with sum ${n(s)}. The diagonals before it, with sums 2 to ${n(s - 1)}, hold ${upTo(s - 2)} = ${n(before)} pairs, and (${n(a)}, ${n(b)}) is pair number ${n(a)} of its own diagonal, so its position is ${n(before)} + ${n(a)} = ${n(pos)}. For position ${n(P)}: the diagonals up to sum ${n(s2 - 1)} hold ${n(before2)} pairs and those up to sum ${n(s2)} hold ${n(tri(s2 - 1))}, so position ${n(P)} is on the diagonal with sum ${n(s2)}, at place ${n(P)} − ${n(before2)} = ${n(a2)} in it. Its first entry is ${n(a2)} and its second is ${n(s2)} − ${n(a2)} = ${n(b2)}: the pair (${n(a2)}, ${n(b2)}).`,
   guidance: [
    { prompt: `(${n(a)}, ${n(b)}) is on the diagonal with sum ${n(s)}. How many pairs come before that diagonal?`, answer: [before], explanation: `The diagonals with sums 2 to ${n(s - 1)} hold ${upTo(s - 2)} = ${n(before)} pairs.` },
    { prompt: `What is the position of (${n(a)}, ${n(b)})?`, answer: [pos], explanation: `It is pair number ${n(a)} of its diagonal, so its position is ${n(before)} + ${n(a)} = ${n(pos)}.` },
    { prompt: `Which diagonal sum does position ${n(P)} fall on?`, answer: [s2], explanation: `The diagonals up to sum ${n(s2 - 1)} hold ${n(before2)} pairs and those up to sum ${n(s2)} hold ${n(tri(s2 - 1))}, so position ${n(P)} is on the diagonal with sum ${n(s2)}.` },
    { prompt: `What is the first entry of the pair in position ${n(P)}?`, answer: [a2], explanation: `It is place ${n(P)} − ${n(before2)} = ${n(a2)} in its diagonal, and the first entry counts the places: ${n(a2)}.` },
    { prompt: `What is its second entry?`, answer: [b2], explanation: `The entries add to ${n(s2)}, so the second is ${n(s2)} − ${n(a2)} = ${n(b2)}.` }
   ] }; }
 },
 /* xₙ = (an + b) ÷ (cn + d) with c in {2, 4, 5}, so the limit a ÷ c is a short decimal. |xₙ − a/c| =
    D ÷ (c(cn + d)), D = |bc − ad| > 0, which falls with n; N is found by exact whole-number comparison,
    never by rounding, and is at least 2. ε = e/1000. The worked example has c = 1. */
 q07: {
  canonical: { a: 3, b: 1, c: 2, d: 5, e: 10 },
  draw: R => retry(() => ({ a: R.int(2, 9), b: R.int(1, 9), c: R.pick([2, 4, 5]), d: R.int(1, 9), e: R.pick([1, 2, 4, 5, 10, 20, 25, 50]) }),
   p => p.b * p.c !== p.a * p.d && p.e * p.c * (p.c + p.d) <= 1000 * Math.abs(p.b * p.c - p.a * p.d), { a: 3, b: 1, c: 2, d: 5, e: 10 }),
  build: ({ a, b, c, d, e }) => { const eps = e / 1000, L = a / c, D = Math.abs(b * c - a * d); let N = 1; while (e * c * (c * N + d) <= 1000 * D) N++;
   const lhs = m => c * (c * m + d); return {
   prompt: `A signal log records xₙ = (${n(a)}n + ${n(b)}) ÷ (${n(c)}n + ${n(d)}) as its nth reading. Enter the limit L of the sequence, then the smallest N such that |xₙ − L| < ${n(eps)} for every n ≥ N (type it without commas).`,
   answer: [L, N],
   hints: ['Divide the top and the bottom by n to see the limit: the parts with 1/n die away.', 'Write xₙ − L as one fraction. Its top is a fixed number and its bottom grows with n, so once it drops below ε it stays below. Find the first n where it does.'],
   solution: `Dividing the top and the bottom by n, xₙ = (${n(a)} + ${n(b)}/n) ÷ (${n(c)} + ${n(d)}/n), which tends to ${n(a)} ÷ ${n(c)} = ${n(L)}. Then xₙ − ${n(L)} = (${n(b)} × ${n(c)} − ${n(a)} × ${n(d)}) ÷ (${n(c)}(${n(c)}n + ${n(d)})), so |xₙ − ${n(L)}| = ${n(D)} ÷ (${n(c * c)}n + ${n(c * d)}), which shrinks as n grows. It is below ${n(eps)} exactly when ${n(c * c)}n + ${n(c * d)} > ${n(D)} ÷ ${n(eps)} = ${dots(1000 * D, e)}. At n = ${n(N - 1)} the left side is ${n(lhs(N - 1))}, which is not above it; at n = ${n(N)} it is ${n(lhs(N))}, which is. So N = ${n(N)}.`,
   guidance: [
    { prompt: `What is the limit L of xₙ = (${n(a)}n + ${n(b)}) ÷ (${n(c)}n + ${n(d)})?`, answer: [L], explanation: `Divide the top and the bottom by n: (${n(a)} + ${n(b)}/n) ÷ (${n(c)} + ${n(d)}/n) tends to ${n(a)} ÷ ${n(c)} = ${n(L)}.` },
    { prompt: `xₙ − L is one fraction with bottom ${n(c)}(${n(c)}n + ${n(d)}) and top ${n(b)} × ${n(c)} − ${n(a)} × ${n(d)}. What is the size of that top?`, answer: [D], explanation: `${n(b)} × ${n(c)} − ${n(a)} × ${n(d)} = ${n(b * c - a * d)}, whose size is ${n(D)}. So |xₙ − L| = ${n(D)} ÷ (${n(c * c)}n + ${n(c * d)}).` },
    { prompt: `What is the smallest N with ${n(D)} ÷ (${n(c * c)}n + ${n(c * d)}) < ${n(eps)} for every n ≥ N?`, answer: [N], explanation: `The bound is below ${n(eps)} when ${n(c * c)}n + ${n(c * d)} > ${dots(1000 * D, e)}. At n = ${n(N - 1)} the left side is ${n(lhs(N - 1))}; at n = ${n(N)} it is ${n(lhs(N))}. So N = ${n(N)}.` }
   ] }; }
 },
 /* x₁ = a, xₙ₊₁ = (xₙ + (d − 1)m) ÷ d with d in {2, 4, 5}: xₙ₊₁ − m = (xₙ − m) ÷ d, so the sequence is
    monotone, bounded by m and tends to m. x₃ has at most four decimals. Never the worked example (x₁ = 1, (xₙ + 6) ÷ 2). */
 q08: {
  canonical: { a: 2, d: 4, m: 10 },
  draw: R => retry(() => ({ a: R.int(0, 20), d: R.pick([2, 4, 5]), m: R.int(2, 12) }), p => p.a !== p.m && !(p.a === 1 && p.d === 2 && p.m === 6), { a: 2, d: 4, m: 10 }),
  build: ({ a, d, m }) => { const b = (d - 1) * m, x2 = (a + b) / d, x3 = (x2 + b) / d, up = a < m; return {
   prompt: `A thermostat's control loop starts at the setting x₁ = ${n(a)} and then uses the rule xₙ₊₁ = (xₙ + ${n(b)}) ÷ ${n(d)}: each new setting is worked out from the one before. Enter x₃ (as a decimal or a fraction), then the limit of the sequence.`,
   answer: [x3, m],
   hints: ['Put x₁ into the rule to get x₂, then put x₂ in to get x₃.', 'Check that the settings move one way and never pass some number, so they converge. If the limit is L, then xₙ₊₁ tends to L as well, so L satisfies the rule with L on both sides. Solve that equation.'],
   solution: `x₂ = (${n(a)} + ${n(b)}) ÷ ${n(d)} = ${n(x2)} and x₃ = (${n(x2)} + ${n(b)}) ÷ ${n(d)} = ${n(x3)}. Subtracting ${n(m)} from both sides of the rule gives xₙ₊₁ − ${n(m)} = (xₙ − ${n(m)}) ÷ ${n(d)}: each step keeps the setting on the same side of ${n(m)} and cuts its distance from ${n(m)} by a factor of ${n(d)}. The sequence starts ${up ? 'below' : 'above'} ${n(m)}, so it is ${up ? 'increasing and bounded above' : 'decreasing and bounded below'} by ${n(m)}, and a monotone bounded sequence converges. Call its limit L. Then xₙ₊₁ tends to L too, so L = (L + ${n(b)}) ÷ ${n(d)}, that is ${n(d)}L = L + ${n(b)}, ${d === 2 ? '' : `${n(d - 1)}L = ${n(b)} and `}L = ${n(m)}.`,
   guidance: [
    { prompt: `What is x₂ = (${n(a)} + ${n(b)}) ÷ ${n(d)}?`, answer: [x2], explanation: `${n(a + b)} ÷ ${n(d)} = ${n(x2)}.` },
    { prompt: `What is x₃ = (x₂ + ${n(b)}) ÷ ${n(d)}?`, answer: [x3], explanation: `(${n(x2)} + ${n(b)}) ÷ ${n(d)} = ${n(x2 + b)} ÷ ${n(d)} = ${n(x3)}.` },
    { prompt: `The sequence is monotone and bounded, so it has a limit L, and L = (L + ${n(b)}) ÷ ${n(d)}. What is L?`, answer: [m], explanation: `Multiply by ${n(d)}: ${n(d)}L = L + ${n(b)}, so ${d === 2 ? '' : `${n(d - 1)}L = ${n(b)} and `}L = ${n(m)}.` }
   ] }; }
 },
 /* xₙ = L + k sin(n) ÷ nᵖ (p = 1 or 2, by form), squeezed by L ± k ÷ nᵖ. ε = e/1000 with e dividing 1000,
    so Q = k ÷ ε is a whole number and N (the first n with nᵖ > Q) is found exactly. The worked example uses cos. */
 q09: {
  canonical: { L: 7, k: 4, form: 0, e: 20 },
  draw: R => ({ L: R.nz(-9, 9), k: R.int(2, 9), form: R.int(0, 1), e: R.pick([10, 20, 25, 40, 50, 100, 200]) }),
  build: ({ L, k, form, e }) => { const eps = e / 1000, Q = 1000 * k / e, pw = form === 0 ? 'n' : 'n²', pow = m => form === 0 ? m : m * m;
   let N = 1; while (pow(N) <= Q) N++;
   const last = form === 0 ? `n must be greater than ${n(Q)}: at n = ${n(Q)} the bound equals ε rather than being below it. So N = ${n(N)}.`
    : `${n(N - 1)}² = ${n(pow(N - 1))} is not above ${n(Q)}, but ${n(N)}² = ${n(pow(N))} is. So N = ${n(N)}.`;
   return {
   prompt: `A signal log reads xₙ = ${n(L)} + ${n(k)} sin(n) ÷ ${pw} on its nth sample, with n read in radians. Enter the limit of xₙ, then the smallest N for which the squeeze bound ${n(k)} ÷ ${pw} is below ε = ${n(eps)} at n = N (and so for every n ≥ N).`,
   answer: [L, N],
   hints: ['−1 ≤ sin(n) ≤ 1 traps every term between two simpler sequences with the same limit; the squeeze lemma then gives the limit of xₙ.', 'The distance from xₙ to its limit is at most the sin term with sin(n) replaced by 1. Find the first n where that bound is smaller than ε.'],
   solution: `Since −1 ≤ sin(n) ≤ 1, ${n(L)} − ${n(k)} ÷ ${pw} ≤ xₙ ≤ ${n(L)} + ${n(k)} ÷ ${pw}. Both outer sequences tend to ${n(L)}, because ${n(k)} ÷ ${pw} tends to 0, so by the squeeze lemma xₙ tends to ${n(L)}. The same bounds give |xₙ − ${par(L)}| ≤ ${n(k)} ÷ ${pw}. Now ${n(k)} ÷ ${pw} < ${n(eps)} means ${pw} > ${n(k)} ÷ ${n(eps)} = ${n(Q)}. ${last}`,
   guidance: [
    { prompt: `What is the limit of xₙ = ${n(L)} + ${n(k)} sin(n) ÷ ${pw}?`, answer: [L], explanation: `xₙ is trapped between ${n(L)} − ${n(k)} ÷ ${pw} and ${n(L)} + ${n(k)} ÷ ${pw}, which both tend to ${n(L)}. By the squeeze lemma the limit is ${n(L)}.` },
    { prompt: `${n(k)} ÷ ${pw} < ${n(eps)} is the same as ${pw} > ${n(k)} ÷ ${n(eps)}. What is ${n(k)} ÷ ${n(eps)}?`, answer: [Q], explanation: `${n(k)} ÷ ${n(eps)} = ${n(Q)}.` },
    { prompt: `What is the smallest whole number N with ${form === 0 ? 'N' : 'N²'} > ${n(Q)}?`, answer: [N], explanation: last }
   ] }; }
 },
 /* form 0: xₙ = a + b(−1)ⁿ + c ÷ n (c even, so c ÷ 2 is whole): limsup a + b, liminf a − b.
    form 1: xₙ = rₙ + c ÷ n, rₙ cycling with n mod 3 (c in {6, 12}, so c ÷ 2 and c ÷ 3 are whole).
    c > 0, so each subsequence falls and its first term is its largest. The worked example is (−1)ⁿ + 4 ÷ n. */
 q10: {
  canonical: { form: 0, a: 3, b: 2, c: 6, r0: 0, r1: 0, r2: 0 },
  draw: R => retry(() => R.bool() ? { form: 0, a: R.nz(-5, 8), b: R.int(2, 6), c: R.pick([2, 4, 6, 8, 10, 12]), r0: 0, r1: 0, r2: 0 }
   : { form: 1, a: 0, b: 0, c: R.pick([6, 12]), r0: R.int(-5, 9), r1: R.int(-5, 9), r2: R.int(-5, 9) },
   p => p.form === 0 || (p.r0 !== p.r1 && p.r1 !== p.r2 && p.r0 !== p.r2), { form: 0, a: 3, b: 2, c: 6, r0: 0, r1: 0, r2: 0 }),
  build: ({ form, a, b, c, r0, r1, r2 }) => {
   if (form === 0) { const hi = a + b, lo = a - b, e2 = hi + c / 2, o1 = lo + c, sup = Math.max(e2, o1); return {
    prompt: `A signal swings from side to side as it settles: its nth sample is xₙ = ${n(a)} + ${n(b)}(−1)ⁿ + ${n(c)} ÷ n. Enter the supremum of the set of all the samples, then limsup xₙ, then liminf xₙ.`,
    answer: [sup, hi, lo],
    hints: ['Split the samples into subsequences that each settle on one value. The limsup is the largest of these limits and the liminf the smallest.', 'The supremum of all the samples looks at every term, early ones included; the limsup looks only at the far tail. The part c ÷ n falls as n grows, so the largest term of each subsequence is its first.'],
    solution: `For even n, (−1)ⁿ = 1 and xₙ = ${lev(hi, c)}, a subsequence falling towards ${n(hi)}. For odd n, (−1)ⁿ = −1 and xₙ = ${lev(lo, c)}, falling towards ${n(lo)}. Every tail contains terms of both, and each term lies above its own subsequence's limit. So the sup of the tail from term n on comes down towards ${n(hi)} as n grows, while the inf of every tail is ${n(lo)} itself, approached but never reached: limsup xₙ = ${n(hi)} and liminf xₙ = ${n(lo)}. The largest even-numbered sample is x₂ = ${n(e2)} and the largest odd-numbered one is x₁ = ${n(o1)}, so the supremum of all the samples is ${n(sup)}.`,
    guidance: [
     { prompt: `The even-numbered samples x₂, x₄, x₆, … form a subsequence. What is its limit?`, answer: [hi], explanation: `For even n, xₙ = ${n(a)} + ${n(b)} + ${n(c)} ÷ n, which tends to ${n(hi)}. It is the largest subsequence limit, so limsup xₙ = ${n(hi)}.` },
     { prompt: `What is the limit of the odd-numbered samples x₁, x₃, x₅, …?`, answer: [lo], explanation: `For odd n, xₙ = ${n(a)} − ${n(b)} + ${n(c)} ÷ n, which tends to ${n(lo)}. It is the smallest subsequence limit, so liminf xₙ = ${n(lo)}.` },
     { prompt: `What is the largest of all the samples, the supremum of the set?`, answer: [sup], explanation: `Each subsequence falls, so compare their first terms: x₂ = ${n(e2)} and x₁ = ${n(o1)}. The larger is ${n(sup)}.` }
    ] }; }
   const firsts = [[r1, 1, r1 + c], [r2, 2, r2 + c / 2], [r0, 3, r0 + c / 3]], hi = Math.max(r0, r1, r2), lo = Math.min(r0, r1, r2), sup = Math.max(...firsts.map(f => f[2]));
   return {
    prompt: `A relay cycles through three levels as it settles: its nth sample is xₙ = rₙ + ${n(c)} ÷ n, where rₙ is ${n(r1)} when n is 1 more than a multiple of 3 (n = 1, 4, 7, …), ${n(r2)} when n is 2 more than a multiple of 3 (n = 2, 5, 8, …) and ${n(r0)} when n is a multiple of 3 (n = 3, 6, 9, …). Enter the supremum of the set of all the samples, then limsup xₙ, then liminf xₙ.`,
    answer: [sup, hi, lo],
    hints: ['Split the samples into subsequences that each settle on one value. The limsup is the largest of these limits and the liminf the smallest.', 'The supremum of all the samples looks at every term, early ones included; the limsup looks only at the far tail. The part c ÷ n falls as n grows, so the largest term of each subsequence is its first.'],
    solution: `The three subsequences n = 1, 4, 7, …; n = 2, 5, 8, …; and n = 3, 6, 9, … are ${lev(r1, c)}, ${lev(r2, c)} and ${lev(r0, c)}, falling towards ${n(r1)}, ${n(r2)} and ${n(r0)}. Every tail contains terms of all three, so the sups of the tails tend to the largest of these limits and the infs to the smallest: limsup xₙ = ${n(hi)} and liminf xₙ = ${n(lo)}. The first terms are x₁ = ${n(r1 + c)}, x₂ = ${n(r2 + c / 2)} and x₃ = ${n(r0 + c / 3)}, and each subsequence falls after its first term, so the supremum of all the samples is ${n(sup)}.`,
    guidance: [
     { prompt: `Each of the three subsequences settles on its level. What is the largest of the three limits?`, answer: [hi], explanation: `The limits are ${n(r1)}, ${n(r2)} and ${n(r0)}; the largest is ${n(hi)}, so limsup xₙ = ${n(hi)}.` },
     { prompt: `What is the smallest of the three limits?`, answer: [lo], explanation: `The smallest is ${n(lo)}, so liminf xₙ = ${n(lo)}.` },
     { prompt: `What is the largest of all the samples, the supremum of the set?`, answer: [sup], explanation: `Each subsequence falls, so compare their first terms: x₁ = ${n(r1 + c)}, x₂ = ${n(r2 + c / 2)} and x₃ = ${n(r0 + c / 3)}. The largest is ${n(sup)}.` }
    ] }; }
 }
});
})();
