/* Discrete mathematics mission generators, file a: q01–q10. Shape and helpers: docs/PACK-FORMAT.md §3 and game/gen-core.js.
   build(canonical) must reproduce the authored text in missions-a.js exactly. */
(function(){
'use strict';
const G = window.Gen, { n, plus, par } = G;
/* Set and list text: S([2, 5]) is '{2, 5}'; and(['a', 'b', 'c']) is 'a, b and c'. */
const S = list => `{${list.map(n).join(', ')}}`;
const and = items => items.length === 1 ? items[0] : `${items.slice(0, -1).join(', ')} and ${items[items.length - 1]}`;
const sorted = list => list.slice().sort((x, y) => x - y);
const upto = k => Array.from({ length: k }, (_, i) => i + 1);
/* k different whole numbers from lo to hi, none of them in `avoid`. */
const distinct = (R, k, lo, hi, avoid = []) => { const out = []; while (out.length < k) { const v = R.int(lo, hi); if (!out.includes(v) && !avoid.includes(v)) out.push(v); } return out; };
const arrows = f => f.map((v, i) => `${i + 1} → ${n(v)}`).join(', ');
/* q10: the four rules for the two digits. first/second name the digit filled first and second; x and y are its choices. */
const RULES = [
 { rule: 'the first digit is not 0, and the two digits are different', first: 'the first digit', second: 'the last digit', x: 9, y: 9,
   why: 'The first digit can be 1 to 9: 9 choices. The last digit can be any digit except the first: 10 − 1 = 9 choices' },
 { rule: 'the last digit is even, and the two digits are different', first: 'the last digit', second: 'the first digit', x: 5, y: 9,
   why: 'Fill the last digit first: 0, 2, 4, 6 or 8, so 5 choices. The first digit can be any digit except that one: 10 − 1 = 9 choices' },
 { rule: 'the first digit is odd, and the last digit is not 0', first: 'the first digit', second: 'the last digit', x: 5, y: 9,
   why: 'The first digit is 1, 3, 5, 7 or 9: 5 choices. The last digit is 1 to 9: 9 choices' },
 { rule: 'neither digit is 0, and the two digits are different', first: 'the first digit', second: 'the last digit', x: 9, y: 8,
   why: 'The first digit is 1 to 9: 9 choices. The last digit is 1 to 9 but not the first: 9 − 1 = 8 choices' }
];
window.MISSION_GEN = window.MISSION_GEN || {};
Object.assign(window.MISSION_GEN, {
 /* A listed bin with one code written twice, and the multiples of k from a to b. Not the worked example (multiples
    of 3 from 5 to 20). Between 3 and 14 multiples. */
 q01: {
  canonical: { list: [12, 7, 30, 18, 7, 25], k: 4, a: 10, b: 50 },
  draw: R => { let p; do {
   const m = R.int(4, 7), d = distinct(R, m, 2, 60), at = R.int(1, m), list = d.slice(); list.splice(at, 0, d[R.int(0, at - 1)]);
   const k = R.int(3, 9), a = R.int(5, 30); p = { list, k, a, b: a + R.int(3, 13) * k + R.int(0, k - 1) };
  } while ((p.k === 3 && p.a === 5) || Math.floor(p.b / p.k) - Math.ceil(p.a / p.k) + 1 < 3); return p; },
  build: ({ list, k, a, b }) => { const set = sorted([...new Set(list)]), dup = list.find((v, i) => list.indexOf(v) !== i), m = set.length,
   first = Math.ceil(a / k) * k, last = Math.floor(b / k) * k, cnt = (last - first) / k + 1, mult = upto(cnt).map(i => first + (i - 1) * k); return {
   prompt: `The clerk stock-takes bin A on rack 1 and writes down the crate codes as A = ${S(list)}. Set B is the set of all multiples of ${n(k)} from ${n(a)} to ${n(b)}, including both ends. Enter |A|, the number of elements of A, then |B|.`,
   answer: [m, cnt],
   hints: ['A set never counts the same element twice: if a code appears twice in the list, it is still one element.', `List B: start at the first multiple of ${n(k)} that is ${n(a)} or more, and keep adding ${n(k)} until the next one would pass ${n(b)}.`],
   solution: `The clerk’s list has ${n(list.length)} entries, but ${n(dup)} appears twice and counts once, so A = ${S(set)} and |A| = ${n(m)}. The multiples of ${n(k)} from ${n(a)} to ${n(b)} are ${and(mult.map(n))}: from ${n(first)} to ${n(last)} in steps of ${n(k)} is (${n(last)} − ${n(first)}) ÷ ${n(k)} + 1 = ${n(cnt)} numbers, so |B| = ${n(cnt)}.`,
   guidance: [
    { prompt: `The clerk’s list for A is ${S(list)}. Which code appears twice, and how many different codes are there?`, answer: [dup, m], explanation: `${n(dup)} is written twice but is one element, so A = ${S(set)}, with ${n(m)} different codes.` },
    { prompt: `For B, what are the smallest and the largest multiples of ${n(k)} from ${n(a)} to ${n(b)}?`, answer: [first, last], explanation: `${n(first)} = ${n(k)} × ${n(first / k)} is the first multiple of ${n(k)} that is ${n(a)} or more, and ${n(last)} = ${n(k)} × ${n(last / k)} is the last one that is ${n(b)} or less.` },
    { prompt: `How many numbers are there from ${n(first)} to ${n(last)} in steps of ${n(k)}? Count them, or work out (${n(last)} − ${n(first)}) ÷ ${n(k)} + 1.`, answer: [cnt], explanation: `(${n(last)} − ${n(first)}) ÷ ${n(k)} = ${n(cnt - 1)} steps, and the + 1 counts the starting number too: ${n(cnt)} numbers, so |B| = ${n(cnt)}.` }
   ] }; }
 },
 /* B has 6 to 9 crates; list A has 2 to 4, all in B or with one or more outside it. The count left in B is at least 2. */
 q02: {
  canonical: { A: [8, 21, 33], B: [3, 8, 14, 21, 26, 33, 40] },
  draw: R => { const B = sorted(distinct(R, R.int(6, 9), 2, 45)), k = R.int(2, 4), idx = distinct(R, k, 0, B.length - 1), A = idx.map(i => B[i]);
   if (R.bool()) A[R.int(0, k - 1)] = distinct(R, 1, 2, 45, B)[0];
   return { A: sorted(A), B }; },
  build: ({ A, B }) => { const common = A.filter(v => B.includes(v)), out = A.filter(v => !B.includes(v)), sub = out.length ? 0 : 1,
   rest = B.filter(v => !A.includes(v)), r = rest.length; return {
   prompt: `Bin B holds the crates numbered ${S(B)}. A packing list from the dome crews asks for the crates A = ${S(A)}. Enter 1 if A ⊆ B, that is, every crate on the list is in the bin, or 0 if not. Then enter how many crates in bin B are not on list A.`,
   answer: [sub, r],
   hints: ['Check the elements of A one at a time: each one must appear in B for A to be a subset of B.', 'For the second answer, go through B and cross out every crate that is also on list A. Count what is left.'],
   solution: `${sub ? `Every element of A is in B, so A ⊆ B: enter 1.` : `${and(out.map(n))} ${out.length === 1 ? 'is' : 'are'} on list A but not in B, so A is not a subset of B: enter 0.`} Crossing the crates of list A out of B (${and(common.map(n))}) leaves ${S(rest)}, which is ${n(r)} crates.`,
   guidance: [
    { prompt: `List A is ${S(A)}. How many of its crates are in bin B?`, answer: [common.length], explanation: `${and(common.map(n))} ${common.length === 1 ? 'is' : 'are'} in B${out.length ? `, but ${and(out.map(n))} ${out.length === 1 ? 'is' : 'are'} not` : ''}.` },
    { prompt: `List A has ${n(A.length)} crates. Enter 1 if all of them are in B, or 0 if at least one is missing.`, answer: [sub], explanation: sub ? 'All of them are in B, so A ⊆ B.' : 'One missing crate is enough: A is not a subset of B.' },
    { prompt: `Bin B has ${n(B.length)} crates. Cross out those that are on list A. How many are left?`, answer: [r], explanation: `Crossing out ${and(common.map(n))} leaves ${S(rest)}: ${n(r)} crates.` }
   ] }; }
 },
 /* Two sorted lists sharing 1 to 4 numbers, each with 2 to 5 of its own, from 1 to 40. */
 q03: {
  canonical: { A: [2, 5, 9, 14, 20, 27], B: [5, 11, 14, 20, 31] },
  draw: R => { const s = R.int(1, 4), a = R.int(2, 5), b = R.int(2, 5), all = distinct(R, s + a + b, 1, 40);
   return { A: sorted(all.slice(0, s + a)), B: sorted([...all.slice(0, s), ...all.slice(s + a)]) }; },
  build: ({ A, B }) => { const inter = A.filter(v => B.includes(v)), newB = B.filter(v => !A.includes(v)), uni = sorted([...A, ...newB]),
   ni = inter.length, nu = uni.length; return {
   prompt: `The morning delivery list A logged the crates ${S(A)}, and the afternoon list B logged ${S(B)}. Some crates were logged on both lists. Enter |A ∪ B|, the number of different crates on either list, then |A ∩ B|, the number of crates on both.`,
   answer: [nu, ni],
   hints: ['For the intersection, go through A and keep each number that also appears in B.', 'For the union, write out all of A, then add each number of B that is not already there. Do not write a shared number twice.'],
   solution: `${ni === 1 ? `The only crate on both lists is ${n(inter[0])}` : `The crates on both lists are ${and(inter.map(n))}`}, so A ∩ B = ${S(inter)} and |A ∩ B| = ${n(ni)}. The union is A with the numbers of B that A does not have (${and(newB.map(n))}) added: A ∪ B = ${S(uni)}, so |A ∪ B| = ${n(nu)}.`,
   guidance: [
    { prompt: 'Which crates are on both lists? Enter how many there are.', answer: [ni], explanation: `${and(inter.map(n))} ${ni === 1 ? 'is' : 'are'} on both lists, so |A ∩ B| = ${n(ni)}.` },
    { prompt: 'How many crates on list B are not on list A?', answer: [newB.length], explanation: `${and(newB.map(n))} are on B only.` },
    { prompt: `List A has ${n(A.length)} crates. Add the ${n(newB.length)} crates of B that A does not have. What is |A ∪ B|?`, answer: [nu], explanation: `${n(A.length)} + ${n(newB.length)} = ${n(nu)}. The shared crates are already in A, so they are not added again.` }
   ] }; }
 },
 /* Totals for the universal set U, F, H and F ∩ H. Not the worked example (40, 18, 15, 6). */
 q04: {
  canonical: { U: 60, A: 25, B: 30, AB: 12 },
  draw: R => { let p; do { const AB = R.int(2, 15), A = AB + R.int(3, 20), B = AB + R.int(3, 20); p = { U: A + B - AB + R.int(2, 25), A, B, AB }; } while (p.U === 40 && p.A === 18); return p; },
  build: ({ U, A, B, AB }) => { const un = A + B - AB, ne = U - un, am = A - AB; return {
   prompt: `The store rooms hold ${n(U)} crates, and they are the universal set U for this count. ${n(A)} crates are fragile (set F), ${n(B)} are heavy (set H), and ${n(AB)} are both fragile and heavy. Enter the number of crates that are neither fragile nor heavy, |(F ∪ H)ᶜ|, then |F \\ H|, the number of fragile crates that are not heavy.`,
   answer: [ne, am],
   hints: [`First find |F ∪ H| = |F| + |H| − |F ∩ H|: the ${n(AB)} crates that are both were counted once in F and again in H.`, 'The complement of F ∪ H is everything in U outside it, so take |F ∪ H| away from |U|. For F \\ H, take the shared crates away from F.'],
   solution: `|F ∪ H| = ${n(A)} + ${n(B)} − ${n(AB)} = ${n(un)}. The crates that are neither are the complement of F ∪ H: ${n(U)} − ${n(un)} = ${n(ne)}. The fragile crates that are not heavy are the set difference F \\ H: ${n(A)} − ${n(AB)} = ${n(am)}.`,
   guidance: [
    { prompt: 'How many crates are fragile or heavy or both? Use |F ∪ H| = |F| + |H| − |F ∩ H|.', answer: [un], explanation: `${n(A)} + ${n(B)} = ${n(A + B)} counts the ${n(AB)} shared crates twice, so |F ∪ H| = ${n(A + B)} − ${n(AB)} = ${n(un)}.` },
    { prompt: `How many of the ${n(U)} crates are outside F ∪ H?`, answer: [ne], explanation: `${n(U)} − ${n(un)} = ${n(ne)} crates are in neither circle of the Venn diagram.` },
    { prompt: `How many of the ${n(A)} fragile crates are not among the ${n(AB)} that are also heavy?`, answer: [am], explanation: `|F \\ H| = ${n(A)} − ${n(AB)} = ${n(am)}.` }
   ] }; }
 },
 /* Seven Venn regions and the outside, given as totals. Every region holds at least 1 crate, the centre at least 2. */
 q05: {
  canonical: { oF: 14, oC: 9, oH: 11, FC: 5, FH: 6, CH: 4, FCH: 3, none: 8 },
  draw: R => ({ oF: R.int(3, 20), oC: R.int(3, 20), oH: R.int(3, 20), FC: R.int(1, 9), FH: R.int(1, 9), CH: R.int(1, 9), FCH: R.int(2, 6), none: R.int(2, 15) }),
  build: ({ oF, oC, oH, FC, FH, CH, FCH, none }) => {
   const tF = oF + FC + FH + FCH, tC = oC + FC + CH + FCH, tH = oH + FH + CH + FCH, pFC = FC + FCH, pFH = FH + FCH, pCH = CH + FCH,
    seven = oF + oC + oH + FC + FH + CH + FCH, N = seven + none, one = oF + oC + oH; return {
   prompt: `A survey of the ${n(N)} crates in store room 3 finds ${n(tF)} fragile (set F), ${n(tC)} cold-stored (set C) and ${n(tH)} heavy (set H). Of these, ${n(pFC)} are fragile and cold, ${n(pFH)} are fragile and heavy, ${n(pCH)} are cold and heavy, and ${n(FCH)} are all three. Enter the number of crates in exactly one of the three sets, then the number in none of them.`,
   answer: [one, none],
   hints: ['Fill the Venn diagram from the middle outwards: first the centre (all three), then each “exactly two” region, which is a pair total minus the centre.', 'Each “only” region is the set total minus the three other regions inside that circle. Add the three “only” regions for the first answer.'],
   solution: `Centre: ${n(FCH)}. Exactly two: F and C only ${n(pFC)} − ${n(FCH)} = ${n(FC)}, F and H only ${n(pFH)} − ${n(FCH)} = ${n(FH)}, C and H only ${n(pCH)} − ${n(FCH)} = ${n(CH)}. Only F: ${n(tF)} − ${n(FC)} − ${n(FH)} − ${n(FCH)} = ${n(oF)}; only C: ${n(tC)} − ${n(FC)} − ${n(CH)} − ${n(FCH)} = ${n(oC)}; only H: ${n(tH)} − ${n(FH)} − ${n(CH)} − ${n(FCH)} = ${n(oH)}. Exactly one set: ${n(oF)} + ${n(oC)} + ${n(oH)} = ${n(one)}. The seven regions hold ${n(seven)} crates, so ${n(N)} − ${n(seven)} = ${n(none)} are in none.`,
   guidance: [
    { prompt: `The centre holds the ${n(FCH)} crates in all three sets. How many crates are in F and C but not H, in F and H but not C, and in C and H but not F?`, answer: [FC, FH, CH], explanation: `Each pair total includes the centre, so take ${n(FCH)} away: ${n(pFC)} − ${n(FCH)} = ${n(FC)}, ${n(pFH)} − ${n(FCH)} = ${n(FH)} and ${n(pCH)} − ${n(FCH)} = ${n(CH)}.` },
    { prompt: 'How many crates are in F only, in C only, and in H only?', answer: [oF, oC, oH], explanation: `Take the three inner regions away from each total: ${n(tF)} − (${n(FC)} + ${n(FH)} + ${n(FCH)}) = ${n(oF)}, ${n(tC)} − (${n(FC)} + ${n(CH)} + ${n(FCH)}) = ${n(oC)} and ${n(tH)} − (${n(FH)} + ${n(CH)} + ${n(FCH)}) = ${n(oH)}.` },
    { prompt: `Add the three “only” regions, then take all seven regions away from the ${n(N)} crates. How many are in exactly one set, and how many in none?`, answer: [one, none], explanation: `${n(oF)} + ${n(oC)} + ${n(oH)} = ${n(one)}. The seven regions add up to ${n(seven)}, and ${n(N)} − ${n(seven)} = ${n(none)}.` }
   ] }; }
 },
 /* A has 3 to 6 masses, B 3 to 5, from 1 to 12 kg; the target is a sum that at least 2 pairs make. */
 q06: {
  canonical: { A: [2, 3, 5, 8], B: [1, 4, 6], T: 9 },
  draw: R => { for (;;) { const A = sorted(distinct(R, R.int(3, 6), 1, 12)), B = sorted(distinct(R, R.int(3, 5), 1, 12)), count = {};
   for (const a of A) for (const b of B) count[a + b] = (count[a + b] || 0) + 1;
   const good = Object.keys(count).map(Number).filter(s => count[s] >= 2);
   if (good.length) return { A, B, T: R.pick(good) }; } },
  build: ({ A, B, T }) => { const nA = A.length, nB = B.length, prod = nA * nB, pairs = A.filter(a => B.includes(T - a)).map(a => `(${n(a)}, ${n(T - a)})`), c = pairs.length; return {
   prompt: `The cargo lift takes one box from shelf A and then one box from shelf B. Each box on shelf A has a different mass, in kilograms: A = ${S(A)}. So does each box on shelf B: B = ${S(B)}. A load is written as the ordered pair (a, b) of the two masses. Enter |A × B|, the number of possible loads, then the number of loads (a, b) with a + b = ${n(T)}, the mass the lift runs best with.`,
   answer: [prod, c],
   hints: ['Each box of shelf A can be paired with each box of shelf B: picture a grid with a row for each element of A and a column for each element of B.', `For the second answer, take each a in A in turn and check whether ${n(T)} − a is in B.`],
   solution: `A has ${n(nA)} elements and B has ${n(nB)}, so |A × B| = ${n(nA)} × ${n(nB)} = ${n(prod)}. The pairs with a + b = ${n(T)} are ${and(pairs)}, so there are ${n(c)} such loads.`,
   guidance: [
    { prompt: 'How many elements do A and B have?', answer: [nA, nB], explanation: `A = ${S(A)} has ${n(nA)} elements and B = ${S(B)} has ${n(nB)}.` },
    { prompt: 'How many ordered pairs (a, b) are there in all?', answer: [prod], explanation: `${n(nA)} rows times ${n(nB)} columns: ${n(nA)} × ${n(nB)} = ${n(prod)} pairs.` },
    { prompt: `For each a in A, work out ${n(T)} − a and look for it in B. How many pairs add up to ${n(T)}?`, answer: [c], explanation: `${A.map(a => `${n(T)} − ${n(a)} = ${n(T - a)}${B.includes(T - a) ? ' is in B' : ' is not'}`).join('; ')}. That gives ${and(pairs)}: ${n(c)} pairs.` }
   ] }; }
 },
 /* f from crates {1, …, m} to bins {1, …, k}: m 5 to 8, k 4 to 7, a range of at least 2 that is smaller than the codomain. */
 q07: {
  canonical: { m: 6, k: 5, f: [3, 1, 4, 3, 1, 4], a: 2, b: 4 },
  draw: R => { for (;;) { const m = R.int(5, 8), k = R.int(4, 7), f = upto(m).map(() => R.int(1, k)), r = new Set(f).size;
   if (r >= 2 && r < k) { const [a, b] = sorted(distinct(R, 2, 1, m)); return { m, k, f, a, b }; } } },
  build: ({ m, k, f, a, b }) => { const range = sorted([...new Set(f)]), r = range.length, fa = f[a - 1], fb = f[b - 1]; return {
   prompt: `The labelling bay sends each crate to a bin. The crates are A = ${S(upto(m))} and the bins are B = ${S(upto(k))}. The function f: A → B is given by the arrow table ${arrows(f)}. Enter f(${n(a)}), then f(${n(b)}), then the size of the range of f: the number of bins that receive at least one crate.`,
   answer: [fa, fb, r],
   hints: [`f(${n(a)}) is the bin at the end of the arrow that starts at crate ${n(a)}.`, 'The range is the set of all outputs. List the bin at the end of every arrow, then cross out repeats.'],
   solution: `The arrow from ${n(a)} ends at bin ${n(fa)}, so f(${n(a)}) = ${n(fa)}; the arrow from ${n(b)} ends at bin ${n(fb)}, so f(${n(b)}) = ${n(fb)}. The arrows end at ${f.map(n).join(', ')}, so the range is ${S(range)}, with ${n(r)} elements, although the codomain B has ${n(k)}.`,
   guidance: [
    { prompt: 'How many elements does the domain A have, and how many does the codomain B have?', answer: [m, k], explanation: `A = ${S(upto(m))} has ${n(m)} crates and B = ${S(upto(k))} has ${n(k)} bins.` },
    { prompt: `Follow the arrows from crates ${n(a)} and ${n(b)}. Where do they end?`, answer: [fa, fb], explanation: `${n(a)} → ${n(fa)} and ${n(b)} → ${n(fb)}, so f(${n(a)}) = ${n(fa)} and f(${n(b)}) = ${n(fb)}.` },
    { prompt: `List the bins at the ends of all ${n(m)} arrows and cross out repeats. How many different bins are left?`, answer: [r], explanation: `The ends are ${f.map(n).join(', ')}. Without repeats that is ${S(range)}: ${n(r)} bins.` }
   ] }; }
 },
 /* f from crates {1, …, m} to tags {1, …, k}: one-to-one with tags to spare, not one-to-one, or a bijection. */
 q08: {
  canonical: { m: 5, k: 7, f: [6, 2, 7, 4, 1] },
  draw: R => { const kind = R.int(0, 2), m = R.int(4, 6);
   if (kind === 0) { const k = R.int(m + 1, 8); return { m, k, f: distinct(R, m, 1, k) }; }
   if (kind === 2) return { m, k: m, f: distinct(R, m, 1, m) };
   for (;;) { const k = R.int(4, 7), f = upto(m).map(() => R.int(1, k)); if (new Set(f).size < m) return { m, k, f }; } },
  build: ({ m, k, f }) => { const used = sorted([...new Set(f)]), r = used.length, inj = r === m ? 1 : 0, missed = upto(k).filter(v => !used.includes(v)), u = missed.length,
   rep = f.find((v, i) => f.indexOf(v) !== i); return {
   prompt: `The tag printer gives each crate of A = ${S(upto(m))} one tag from T = ${S(upto(k))}. The tagging f: A → T is ${arrows(f)}. Enter 1 if f is one-to-one, that is, no two crates get the same tag, or 0 if not. Then enter the number of tags in T that no crate gets.`,
   answer: [inj, u],
   hints: ['Look at the tags at the ends of the arrows: f is one-to-one exactly when none of them appears twice.', 'f is onto when every tag is used. Count the tags of T that are missing from the list of arrow ends.'],
   solution: `The arrow ends are ${f.map(n).join(', ')}. ${inj ? 'No tag appears twice, so f is one-to-one: enter 1.' : `Tag ${n(rep)} appears more than once, so f is not one-to-one: enter 0.`} The tags used are ${S(used)}. ${u ? `The tags no crate gets are ${and(missed.map(n))}, so the count is ${n(u)} and f is not onto.` : `That is every tag in T, so f is onto and the count is 0.${inj ? ' Being one-to-one and onto, f is a bijection.' : ''}`}`,
   guidance: [
    { prompt: `List the tag at the end of each arrow. Enter 1 if no tag appears twice, or 0 if one does.`, answer: [inj], explanation: inj ? `The ends ${f.map(n).join(', ')} are all different, so f is one-to-one.` : `In ${f.map(n).join(', ')} the tag ${n(rep)} appears more than once, so f is not one-to-one.` },
    { prompt: 'How many different tags are used?', answer: [r], explanation: `The tags used are ${S(used)}: ${n(r)} of them.` },
    { prompt: `T has ${n(k)} tags and ${n(r)} are used. How many are never used?`, answer: [u], explanation: `${n(k)} − ${n(r)} = ${n(u)}.${u ? '' : ' Every tag is used, so f is onto.'}` }
   ] }; }
 },
 /* Three disjoint shelves, then two overlapping ratings. Not the worked example (4, 6, 3 and 8, 5, 2). */
 q09: {
  canonical: { a: 7, b: 5, c: 9, d: 12, e: 10, f: 4 },
  draw: R => { let p; do { const f = R.int(2, 8); p = { a: R.int(3, 15), b: R.int(3, 15), c: R.int(3, 15), d: f + R.int(3, 15), e: f + R.int(3, 15), f }; } while (p.a === 4 && p.b === 6); return p; },
  build: ({ a, b, c, d, e, f }) => { const s = a + b + c, t = d + e - f; return {
   prompt: `The spare-parts shelves hold ${n(a)} different filters, ${n(b)} different valves and ${n(c)} different seals, and no part is on two shelves. A repair needs one spare part of any kind: enter the number of ways to choose it. Then, on the hose rack, ${n(d)} hoses are rated for cold and ${n(e)} are rated for heat, and ${n(f)} of them are rated for both. Enter the number of ways to choose one hose that is rated for cold or for heat.`,
   answer: [s, t],
   hints: ['The three shelves have nothing in common, so the numbers of choices add up.', 'The cold-rated and heat-rated hoses overlap. Adding the two counts takes the hoses rated for both twice, so take them away once.'],
   solution: `The filters, valves and seals are disjoint sets, so by the additive principle there are ${n(a)} + ${n(b)} + ${n(c)} = ${n(s)} ways. The hose ratings overlap, so the count is |C ∪ H| = ${n(d)} + ${n(e)} − ${n(f)} = ${n(t)}.`,
   guidance: [
    { prompt: `One part from three shelves that share nothing: what is ${n(a)} + ${n(b)} + ${n(c)}?`, answer: [s], explanation: `${n(a)} + ${n(b)} + ${n(c)} = ${n(s)}. No part is counted twice, because no part is on two shelves.` },
    { prompt: `If you simply added the ${n(d)} cold-rated and the ${n(e)} heat-rated hoses, how many would you count?`, answer: [d + e], explanation: `${n(d)} + ${n(e)} = ${n(d + e)}, but the ${n(f)} hoses rated for both are in that count twice.` },
    { prompt: `Take away the ${n(f)} hoses that were counted twice. How many hoses are rated for cold or for heat?`, answer: [t], explanation: `${n(d + e)} − ${n(f)} = ${n(t)}, which is |C ∪ H| = |C| + |H| − |C ∩ H|.` }
   ] }; }
 },
 /* One letter from L, then two digits under one of four rules. Not the worked example (5 letters). */
 q10: {
  canonical: { L: 8, rule: 1 },
  draw: R => ({ L: R.except(4, 12, [5]), rule: R.int(0, 3) }),
  build: ({ L, rule }) => { const P = RULES[rule], free = L * 100, res = L * P.x * P.y; return {
   prompt: `Crate codes in the labelling bay are one letter and then two digits, such as B47. The depot uses only ${n(L)} letters. Enter how many codes there are with no other rule (type it without commas). Then the rule changes: ${P.rule}. Enter how many codes follow the new rule.`,
   answer: [free, res],
   hints: [`Each place is a stage: ${n(L)} letters, then 10 digits, then 10 digits. Multiply the numbers of choices.`, 'Under the new rule, fill the most restricted digit first and count its choices, then count the choices left for the other digit.'],
   solution: `With no rule there are ${n(L)} × 10 × 10 = ${n(free)} codes. Under the new rule the letter still has ${n(L)} choices. ${P.why}. By the multiplicative principle there are ${n(L)} × ${n(P.x)} × ${n(P.y)} = ${n(res)} codes.`,
   guidance: [
    { prompt: 'With no rule, how many choices are there for the letter, and how many for each digit?', answer: [L, 10], explanation: `${n(L)} letters, and 10 digits (0 to 9) for each place, so ${n(L)} × 10 × 10 = ${n(free)} codes.` },
    { prompt: `Under the new rule (${P.rule}), start with ${P.first}. How many choices does it have, and then how many are left for ${P.second}?`, answer: [P.x, P.y], explanation: `${P.why}.` },
    { prompt: `Multiply the three stages. What is ${n(L)} × ${n(P.x)} × ${n(P.y)}?`, answer: [res], explanation: `${n(L)} × ${n(P.x)} = ${n(L * P.x)}, and ${n(L * P.x)} × ${n(P.y)} = ${n(res)} codes.` }
   ] }; }
 },
});
})();
