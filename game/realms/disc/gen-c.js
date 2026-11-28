/* Discrete mathematics mission generators, file c: q21–q30. Shape and helpers: docs/PACK-FORMAT.md §3 and game/gen-core.js.
   build(canonical) must reproduce the authored text in missions-c.js exactly. */
(function(){
'use strict';
const G = window.Gen, { n, plus, par } = G;
/* Small counting helpers. C(a, b) is "a choose b"; fact(a) is a!. */
const fact = a => { let f = 1; for (let i = 2; i <= a; i++) f *= i; return f; };
const C = (a, b) => (b < 0 || b > a) ? 0 : Math.round(fact(a) / (fact(b) * fact(a - b)));
/* Unicode subscripts and superscripts for indices and powers: sub(12) is '₁₂', sup(5) is '⁵'. */
const sub = k => String(k).replace(/\d/g, d => '₀₁₂₃₄₅₆₇₈₉'[d]);
const sup = k => String(k).replace(/\d/g, d => '⁰¹²³⁴⁵⁶⁷⁸⁹'[d]);
/* A signed letter term after another term: trm(3, 'n') is '+ 3n', trm(−1, 'n') is '− n'; cst(−4) is '− 4'. */
const sgn = v => v < 0 ? '−' : '+';
const trm = (v, x) => `${sgn(v)} ${Math.abs(v) === 1 ? '' : n(Math.abs(v))}${x}`;
const cst = v => `${sgn(v)} ${n(Math.abs(v))}`;
/* Leading coefficient: lead(1, 'n²') is 'n²', lead(3, 'n²') is '3n²'. */
const lead = (v, x) => `${v === 1 ? '' : n(v)}${x}`;
/* A polynomial c3 n³ + c2 n² + c1 n + c0 written out, skipping zero terms. */
const poly = (cs) => { const parts = [], vars = ['n³', 'n²', 'n', ''];
 cs.forEach((v, i) => { if (!v) return; const x = vars[i];
  if (!parts.length) parts.push(x ? (v === -1 ? '−' + x : lead(v, x)) : n(v)); else parts.push(x ? trm(v, x) : cst(v)); });
 return parts.join(' '); };
/* An alternating sum written out: alt([96, 3]) is '96 − 3'. */
const alt = vals => vals.map((v, i) => i === 0 ? n(v) : `${i % 2 ? '−' : '+'} ${n(v)}`).join(' ');
/* q22: the labelled objects that go back into their bins. */
const ITEMS = [['crate', 'crates'], ['canister', 'canisters'], ['tool chest', 'tool chests'], ['fuel drum', 'fuel drums']];
const crews = m => m === 1 ? 'crew' : 'crews', ways = v => v === 1 ? 'way' : 'ways';
/* q21: the terms C(k, i)(k − i)ⁿ of inclusion–exclusion, i = 1 … k − 1. */
const ontoTerms = (N, k) => { const out = []; for (let i = 1; i < k; i++) out.push({ i, c: C(k, i), b: k - i, v: Math.pow(k - i, N) }); return out; };
/* q23: one named group of i domes over the limit L: give each L + 1 first, share the rest freely. */
const capTerms = (N, k, L) => { const out = []; for (let i = 1; i <= k; i++) { const r = N - i * (L + 1); if (r < 0) break; out.push({ i, c: C(k, i), r, w: C(r + k - 1, k - 1) }); } return out; };
/* q27: the rows of differences of a list, down to (and including) the first constant row. */
const diffRows = list => { const rows = [list]; for (;;) { const last = rows[rows.length - 1], d = []; for (let i = 1; i < last.length; i++) d.push(last[i] - last[i - 1]); rows.push(d); if (d.every(x => x === d[0])) return rows; } };
/* q28: one step of aₙ = c·aₙ₋₁ + d·aₙ₋₂ written out. */
const fmt = x => typeof x === 'string' ? x : n(x);
const recStep = (c, d, p, pp) => `${c === 1 ? fmt(p) : `${n(c)} × ${fmt(p)}`} + ${d === 1 ? fmt(pp) : `${n(d)} × ${fmt(pp)}`}`;
const recRule = (c, d) => `aₙ = ${lead(c, 'aₙ₋₁')} + ${lead(d, 'aₙ₋₂')}`;
const recRun = ({ c, d, a0, a1 }) => { const a = [a0, a1]; for (let k = 2; k <= 8; k++) a.push(c * a[k - 1] + d * a[k - 2]); return a; };

window.MISSION_GEN = window.MISSION_GEN || {};
Object.assign(window.MISSION_GEN, {
 /* n distinct jobs to k crews, every crew at least one. Not the worked example (4 jobs, 3 crews). */
 q21: {
  canonical: { N: 5, k: 3 },
  draw: R => { const [N, k] = R.pick([[3, 2], [4, 2], [5, 2], [6, 2], [5, 3], [6, 3], [4, 4], [5, 4], [6, 4]]); return { N, k }; },
  build: ({ N, k }) => { const total = Math.pow(k, N), ts = ontoTerms(N, k), miss = ts.reduce((s, t, j) => s + (j % 2 ? -1 : 1) * t.c * t.v, 0), onto = total - miss, one = ts[0];
   const levels = ts.map(t => t.i === 1
    ? `If one named crew gets nothing, each job has ${n(t.b)} ${crews(t.b)} left, so |Aᵢ| = ${n(t.b)}${sup(N)} = ${n(t.v)}, and there are ${n(t.c)} such sets.`
    : `If ${['', '', 'two', 'three'][t.i]} named crews get nothing, each job has ${n(t.b)} ${crews(t.b)} left: ${n(t.b)}${sup(N)} = ${n(t.v)} ${ways(t.v)}, for each of the C(${n(k)}, ${n(t.i)}) = ${n(t.c)} choices of crews.`).join(' ');
   const sum = ts.map((t, j) => `${j ? (j % 2 ? '− ' : '+ ') : ''}${n(t.c)} × ${n(t.v)}`).join(' ');
   return {
   prompt: `The Packing Floor has ${n(N)} different jobs to hand out to ${n(k)} crews. Every job goes to exactly one crew, and a crew may take several jobs, so an assignment is a function from the jobs to the crews. Mira wants every crew to get at least one job: the function must be onto. Enter the number of ways to assign the jobs with no condition, then the number of ways that leave at least one crew with no job, then the number of onto assignments. Type each count without commas.`,
   answer: [total, miss, onto],
   hints: [`Each of the ${n(N)} jobs has ${n(k)} crews to choose from, one job after another: that is the multiplicative principle.`, `For the middle count, let Aᵢ be the assignments in which crew i gets no job, and use inclusion–exclusion on these ${n(k)} sets. With one named crew left out, every job has ${n(one.b)} ${crews(one.b)} to go to.`],
   solution: `With no condition each of the ${n(N)} jobs can go to any of the ${n(k)} crews, so there are ${n(k)}${sup(N)} = ${n(total)} assignments. Let Aᵢ be the assignments in which crew i gets no job. ${levels} ${k === 2 ? 'Both crews' : `All ${n(k)} crews`} cannot be empty at once. By inclusion–exclusion, ${sum} = ${n(miss)} assignments leave at least one crew with no job. The rest are onto: ${n(total)} − ${n(miss)} = ${n(onto)}.`,
   guidance: [
    { prompt: `How many ways are there to assign the ${n(N)} jobs to the ${n(k)} crews with no condition?`, answer: [total], explanation: `Each job has ${n(k)} choices, and there are ${n(N)} jobs, so the multiplicative principle gives ${n(k)}${sup(N)} = ${n(total)}.` },
    { prompt: `Pick one crew and give it no job. How many assignments leave that one crew with nothing?`, answer: [one.v], explanation: one.b === 1 ? `Every job must then go to the other crew, so there is ${n(one.b)}${sup(N)} = ${n(one.v)} such assignment.` : `Every job must then go to one of the other ${n(one.b)} crews, so there are ${n(one.b)}${sup(N)} = ${n(one.v)} such assignments.` },
    { prompt: `Use inclusion–exclusion over the ${n(k)} crews. How many assignments leave at least one crew with no job?`, answer: [miss], explanation: `Add the one-crew sets, subtract the two-crew overlaps, and so on: ${sum} = ${n(miss)}.` },
    { prompt: `How many assignments are onto, giving every crew at least one job?`, answer: [onto], explanation: `Take the bad assignments away from all of them: ${n(total)} − ${n(miss)} = ${n(onto)}.` }
   ] }; }
 },
 /* Derangements of n crates. Not the worked example (4 crates, 9 derangements). */
 q22: {
  canonical: { N: 5, w: 0 },
  draw: R => ({ N: R.pick([3, 5, 6, 7]), w: R.int(0, ITEMS.length - 1) }),
  build: ({ N, w }) => { const [one, many] = ITEMS[w], f = fact(N), parts = []; for (let j = 1; j <= N; j++) parts.push(f / fact(j));
   const home = parts.reduce((s, v, j) => s + (j % 2 ? -1 : 1) * v, 0), D = f - home, two = fact(N - 2);
   const listed = parts.map((v, j) => `${n(N)}! ÷ ${n(j + 1)}! = ${n(v)}`).join(', ');
   return {
   prompt: `${n(N)} labelled ${many} were lifted out of their bins for a stock check, and each ${one} has its own bin with the same label. A new packer puts them back, one ${one} to a bin, without reading the labels. Enter the number of ways to put the ${n(N)} ${many} back one to a bin, then the number of ways in which no ${one} ends up in its own bin. Type each count without commas.`,
   answer: [f, D],
   hints: [`Putting the ${many} back one to a bin is an ordering of the ${n(N)} ${many}, so count it with a factorial.`, `Let Aᵢ be the ways in which ${one} i is back in its own bin. When j named ${many} are home, the other ${many} can go in any order. Use inclusion–exclusion to count the ways with at least one ${one} home, then take that away from all the ways.`],
   solution: `There are ${n(N)}! = ${n(f)} ways to put the ${many} back. Let Aᵢ be the ways with ${one} i in its own bin. Fixing j named ${many} leaves (${n(N)} − j)! orders of the rest, and there are C(${n(N)}, j) ways to name them, so level j of inclusion–exclusion is C(${n(N)}, j) × (${n(N)} − j)! = ${n(N)}! ÷ j!: ${listed}. The ways with at least one ${one} home number ${alt(parts)} = ${n(home)}. The derangements are the rest: ${n(f)} − ${n(home)} = ${n(D)}.`,
   guidance: [
    { prompt: `In how many ways can the ${n(N)} ${many} go back one to a bin, with no condition?`, answer: [f], explanation: `The first bin can take any of ${n(N)} ${many}, the next any of the ${n(N - 1)} left, and so on: ${n(N)}! = ${n(f)}.` },
    { prompt: `${many[0].toUpperCase() + many.slice(1)} 1 and 2 are both in their own bins. In how many ways can the other ${N - 2 === 1 ? one : `${n(N - 2)} ${many}`} go back?`, answer: [two], explanation: `${N - 2 === 1 ? `The last ${one} has only the last bin left` : `The other ${n(N - 2)} ${many} fill the other bins in any order`}: ${n(N - 2)}! = ${n(two)}. There are C(${n(N)}, 2) = ${n(C(N, 2))} such pairs, giving ${n(C(N, 2) * two)} = ${n(N)}! ÷ 2! at level 2.` },
    { prompt: `By inclusion–exclusion, in how many ways is at least one ${one} back in its own bin?`, answer: [home], explanation: `Level j gives ${n(N)}! ÷ j!, with signs taking turns: ${alt(parts)} = ${n(home)}.` },
    { prompt: `In how many ways is no ${one} in its own bin?`, answer: [D], explanation: `All the ways minus those with a ${one} at home: ${n(f)} − ${n(home)} = ${n(D)}.` }
   ] }; }
 },
 /* N identical crates to k domes, each at most L. Not the worked example (10 crates, 3 domes, at most 4). */
 q23: {
  canonical: { N: 12, k: 4, L: 5 },
  draw: R => { let p; do { const k = R.pick([3, 4]), L = R.int(3, 6); p = { N: R.int(L + 2, k * L - 1), k, L }; }
   while (C(p.N + p.k - 1, p.k - 1) >= 1000 || (p.N === 10 && p.k === 3 && p.L === 4)); return p; },
  build: ({ N, k, L }) => { const total = C(N + k - 1, k - 1), ts = capTerms(N, k, L), over = ts.reduce((s, t, j) => s + (j % 2 ? -1 : 1) * t.c * t.w, 0), ok = total - over, one = ts[0];
   const levels = ts.map(t => t.i === 1
    ? `One named dome over the limit: give it ${n(L + 1)} first and share the other ${n(t.r)} freely, C(${n(t.r + k - 1)}, ${n(k - 1)}) = ${n(t.w)} ways, for each of the ${n(k)} domes.`
    : `${['', '', 'Two', 'Three', 'Four'][t.i]} named domes over the limit: give each ${n(L + 1)} first and share the other ${n(t.r)}, C(${n(t.r + k - 1)}, ${n(k - 1)}) = ${n(t.w)} ${ways(t.w)}, for each of the C(${n(k)}, ${n(t.i)}) = ${n(t.c)} choices.`).join(' ');
   const next = ts.length + 1, stop = next <= k ? ` ${['', '', 'Two', 'Three', 'Four'][next]} domes cannot ${next === 2 ? 'both' : 'all'} be over the limit, because that needs ${n(next * (L + 1))} crates.` : '';
   const sum = ts.map((t, j) => `${j ? (j % 2 ? '− ' : '+ ') : ''}${n(t.c)} × ${n(t.w)}`).join(' ');
   return {
   prompt: `Mira has ${n(N)} identical crates to share among ${n(k)} domes, and a dome may get none. Each dome’s store holds at most ${n(L)} crates. Enter the number of ways to share the crates with no limit, then the number of ways in which at least one dome gets more than ${n(L)}, then the number of ways in which every dome gets at most ${n(L)}.`,
   answer: [total, over, ok],
   hints: [`With no limit this is stars and bars: ${n(N)} stars and ${n(k - 1)} bars in a row of ${n(N + k - 1)} places.`, `A dome that gets more than ${n(L)} gets at least ${n(L + 1)}: hand it ${n(L + 1)} crates first, then share the rest with no limit. Do this for one dome, two domes and so on, and combine with inclusion–exclusion.`],
   solution: `With no limit there are C(${n(N + k - 1)}, ${n(k - 1)}) = ${n(total)} ways. ${levels}${stop} By inclusion–exclusion, ${sum} = ${n(over)} ways give some dome more than ${n(L)}. So ${n(total)} − ${n(over)} = ${n(ok)} ways keep every dome at most ${n(L)}.`,
   guidance: [
    { prompt: `With no limit, in how many ways can the ${n(N)} crates be shared among the ${n(k)} domes?`, answer: [total], explanation: `Stars and bars: choose the places of the ${n(k - 1)} bars among ${n(N + k - 1)}, C(${n(N + k - 1)}, ${n(k - 1)}) = ${n(total)}.` },
    { prompt: `Give one named dome ${n(L + 1)} crates first and share the remaining ${n(one.r)} with no limit. In how many ways can that be done?`, answer: [one.w], explanation: `${n(one.r)} stars and ${n(k - 1)} bars: C(${n(one.r + k - 1)}, ${n(k - 1)}) = ${n(one.w)}.` },
    { prompt: `By inclusion–exclusion over the ${n(k)} domes, in how many ways does at least one dome get more than ${n(L)}?`, answer: [over], explanation: `${sum} = ${n(over)}.` },
    { prompt: `In how many ways does every dome get at most ${n(L)}?`, answer: [ok], explanation: `All the ways minus those over the limit: ${n(total)} − ${n(over)} = ${n(ok)}.` }
   ] }; }
 },
 /* a₁ = s, aₙ = c·aₙ₋₁ + d (recursive), bₙ = p n² + q n (closed). Not the worked example (a₁ = 2, aₙ = 3aₙ₋₁ − 2; bₙ = 2n² − n). */
 q24: {
  canonical: { s: 4, c: 2, d: -1, p: 1, q: 3 },
  draw: R => { let p; do { p = { s: R.int(2, 6), c: R.int(2, 3), d: R.except(-3, 4, [0]), p: R.int(1, 3), q: R.except(-5, 9, [-1, 0, 1]) }; }
   while ((p.s === 2 && p.c === 3 && p.d === -2)); return p; },
  build: ({ s, c, d, p, q }) => { const a = [0, s]; for (let k = 2; k <= 5; k++) a.push(c * a[k - 1] + d); const b10 = 100 * p + 10 * q;
   const step = k => `a${sub(k)} = ${n(c)} × ${n(a[k - 1])} ${cst(d)} = ${n(a[k])}`;
   const bWork = `${p === 1 ? '10²' : `${n(p)} × 10²`} ${sgn(q)} ${n(Math.abs(q))} × 10 = ${n(100 * p)} ${cst(10 * q)} = ${n(b10)}`;
   return {
   prompt: `Two stock rules are pinned up in the Stock Yard. Stack A has a recursive definition: a₁ = ${n(s)} and aₙ = ${n(c)}aₙ₋₁ ${cst(d)} for n ≥ 2, so each week’s count comes from the week before. Stack B has a closed formula: bₙ = ${poly([0, p, q, 0])}, so any week’s count comes straight from the week number n. Enter a₅, then b₁₀.`,
   answer: [a[5], b10],
   hints: [`Start from a₁ = ${n(s)} and use the rule once for each later week: a₂ = ${n(c)} × ${n(s)} ${cst(d)}, then a₃ from a₂, and so on up to a₅.`, 'For b₁₀ put n = 10 into the formula for bₙ. No earlier terms are needed.'],
   solution: `${step(2)}, ${step(3)}, ${step(4)} and ${step(5)}. For stack B, b₁₀ = ${bWork}.`,
   guidance: [
    { prompt: `Use the rule aₙ = ${n(c)}aₙ₋₁ ${cst(d)} twice, starting from a₁ = ${n(s)}. What are a₂ and a₃?`, answer: [a[2], a[3]], explanation: `${step(2)} and ${step(3)}.` },
    { prompt: 'Keep going. What are a₄ and a₅?', answer: [a[4], a[5]], explanation: `${step(4)} and ${step(5)}.` },
    { prompt: `Put n = 10 into bₙ = ${poly([0, p, q, 0])}. What is b₁₀?`, answer: [b10], explanation: `b₁₀ = ${bWork}. The closed formula needs no earlier terms.` }
   ] }; }
 },
 /* Arithmetic: first term a, common difference d, N weeks. Not the worked example (5, 3, 10 terms). */
 q25: {
  canonical: { a: 14, d: 6, N: 12 },
  draw: R => { let p; do { p = { a: R.int(3, 25), d: R.int(2, 9), N: R.int(8, 16) }; } while (p.a === 5 && p.d === 3 && p.N === 10); return p; },
  build: ({ a, d, N }) => { const last = a + (N - 1) * d, pair = a + last, S = N * pair / 2; return {
   prompt: `In week 1 the Stock Yard receives ${n(a)} pipes, and each week’s delivery is ${n(d)} pipes more than the week before. Enter the delivery in week ${n(N)}, then the total number of pipes delivered over the first ${n(N)} weeks (type it without commas).`,
   answer: [last, S],
   hints: [`Week ${n(N)} is ${n(N - 1)} steps of ${n(d)} after week 1: aₙ = a₁ + (n − 1)d.`, 'For the total, add the first and the last delivery, multiply by the number of weeks and halve.'],
   solution: `The deliveries form an arithmetic sequence with a₁ = ${n(a)} and common difference ${n(d)}, so a${sub(N)} = ${n(a)} + ${n(N - 1)} × ${n(d)} = ${n(a)} + ${n((N - 1) * d)} = ${n(last)} pipes. The partial sum of the first ${n(N)} terms is ${n(N)} × (${n(a)} + ${n(last)}) ÷ 2 = ${n(N)} × ${n(pair)} ÷ 2 = ${n(S)} pipes.`,
   guidance: [
    { prompt: `How many steps of ${n(d)} lie between week 1 and week ${n(N)}, and what is the week ${n(N)} delivery?`, answer: [N - 1, last], explanation: `From week 1 to week ${n(N)} there are ${n(N - 1)} steps, so the delivery is ${n(a)} + ${n(N - 1)} × ${n(d)} = ${n(last)}.` },
    { prompt: `What is the first delivery plus the last, ${n(a)} + ${n(last)}?`, answer: [pair], explanation: `${n(a)} + ${n(last)} = ${n(pair)}. The second plus the second-to-last gives the same, and so does every such pair.` },
    { prompt: `Multiply by the number of weeks and halve: ${n(N)} × ${n(pair)} ÷ 2. What is the total?`, answer: [S], explanation: `${n(N)} × ${n(pair)} = ${n(N * pair)}, and half of that is ${n(S)} pipes.` }
   ] }; }
 },
 /* Geometric: first term a, common ratio r, N weeks. Not the worked example (5, 3, 4 terms). */
 q26: {
  canonical: { a: 3, r: 2, N: 8 },
  draw: R => { let p; do { p = { a: R.int(2, 6), r: R.int(2, 4), N: R.int(5, 8) }; } while (p.a * (Math.pow(p.r, p.N) - 1) / (p.r - 1) > 30000 || (p.a === 5 && p.r === 3)); return p; },
  build: ({ a, r, N }) => { const pw = Math.pow(r, N - 1), last = a * pw, top = Math.pow(r, N) - 1, S = a * top / (r - 1); return {
   prompt: `In week 1 the yard orders ${n(a)} air filters, and each week’s order is ${n(r)} times the week before. Enter the order in week ${n(N)}, then the total number of filters ordered over the first ${n(N)} weeks. Type each count without commas.`,
   answer: [last, S],
   hints: [`Week ${n(N)} is ${n(N - 1)} multiplications by ${n(r)} after week 1: aₙ = a₁ × rⁿ⁻¹.`, 'For the total use the sum formula a₁ × (rⁿ − 1) ÷ (r − 1), where n is the number of weeks.'],
   solution: `The orders form a geometric sequence with a₁ = ${n(a)} and common ratio ${n(r)}, so a${sub(N)} = ${n(a)} × ${n(r)}${sup(N - 1)} = ${n(a)} × ${n(pw)} = ${n(last)} filters. The partial sum of the first ${n(N)} terms is ${n(a)} × (${n(r)}${sup(N)} − 1) ÷ (${n(r)} − 1) = ${n(a)} × ${n(top)} ÷ ${n(r - 1)} = ${n(S)} filters.`,
   guidance: [
    { prompt: `What is ${n(r)}${sup(N - 1)}, and what is the week ${n(N)} order?`, answer: [pw, last], explanation: `${n(r)}${sup(N - 1)} = ${n(pw)}, so the order is ${n(a)} × ${n(pw)} = ${n(last)}.` },
    { prompt: `What is ${n(r)}${sup(N)} − 1?`, answer: [top], explanation: `${n(r)}${sup(N)} = ${n(top + 1)}, and one less is ${n(top)}.` },
    { prompt: `What is the total, ${n(a)} × ${n(top)} ÷ (${n(r)} − 1)?`, answer: [S], explanation: `${n(a)} × ${n(top)} = ${n(a * top)}, divided by ${n(r - 1)} is ${n(S)} filters.` }
   ] }; }
 },
 /* Six counts from a polynomial of degree 2 or 3 in the week number; the next count. Not the worked example (n³ + 1). */
 q27: {
  canonical: { c3: 0, c2: 2, c1: 1, c0: 3 },
  draw: R => { let p; do { p = R.bool() ? { c3: 0, c2: R.int(1, 3), c1: R.int(-4, 6), c0: R.int(-3, 9) } : { c3: R.int(1, 2), c2: R.int(-3, 3), c1: R.int(-4, 6), c0: R.int(-3, 9) }; }
   while ([1, 2, 3, 4, 5, 6].some(k => p.c3 * k * k * k + p.c2 * k * k + p.c1 * k + p.c0 <= 0) || (p.c3 === 1 && !p.c2 && !p.c1 && p.c0 === 1)); return p; },
  build: ({ c3, c2, c1, c0 }) => { const f = k => c3 * k * k * k + c2 * k * k + c1 * k + c0, list = [1, 2, 3, 4, 5, 6].map(f), next = f(7);
   const rows = diffRows(list), deg = rows.length - 1, cons = rows[deg][0];
   const names = ['', 'First', 'Second', 'Third'];
   const shown = rows.slice(1, deg + 1).map((r, i) => `${names[i + 1]} differences: ${r.map(n).join(', ')}.`).join(' ');
   /* Extending: the constant row gets one more copy, and each row above adds its new entry to its last one. */
   const ext = []; let add = cons; for (let lv = deg - 1; lv >= 1; lv--) { const last = rows[lv][rows[lv].length - 1], nv = last + add; ext.push({ lv, last, add, nv }); add = nv; }
   const extText = ext.map(e => `the next ${names[e.lv].toLowerCase()} difference is ${n(e.last)} ${cst(e.add)} = ${n(e.nv)}`).join(', ');
   return {
   prompt: `The weekly counts of one crate line over six weeks are ${list.map(n).join(', ')}. Mira believes a polynomial in the week number lies behind them. Use finite differences: enter the degree of the polynomial, which is the level at which the differences become constant, then the count to expect in week 7.`,
   answer: [deg, next],
   hints: ['Subtract each count from the next to get the first differences. Do the same to those differences, and keep going until one row is constant.', 'To get the next count, add one more copy of the constant at the bottom row, then add your way back up: each row’s new entry is its last entry plus the new entry of the row below.'],
   solution: `${shown} The ${names[deg].toLowerCase()} differences are constant, so the counts come from a polynomial of degree ${n(deg)}. Extending the rows, ${extText}, so week 7 has ${n(list[5])} ${cst(add)} = ${n(next)}.`,
   guidance: [
    { prompt: `What are the first two first differences, ${n(list[1])} − ${par(list[0])} and ${n(list[2])} − ${par(list[1])}?`, answer: [rows[1][0], rows[1][1]], explanation: `${n(list[1])} − ${par(list[0])} = ${n(rows[1][0])} and ${n(list[2])} − ${par(list[1])} = ${n(rows[1][1])}.` },
    { prompt: 'Keep taking differences of differences. At which level do they become constant, and what is the constant?', answer: [deg, cons], explanation: `${shown} The row at level ${n(deg)} is constant, at ${n(cons)}, so the degree is ${n(deg)}.` },
    { prompt: 'Extend every row by one entry, from the constant row up. What is the count for week 7?', answer: [next], explanation: `Extending the rows, ${extText}, so week 7 has ${n(list[5])} ${cst(add)} = ${n(next)}.` }
   ] }; }
 },
 /* aₙ = c·aₙ₋₁ + d·aₙ₋₂ with a₀, a₁; a₄ and a₈. Not the worked example (Fibonacci: 0, 1). */
 q28: {
  canonical: { c: 1, d: 2, a0: 3, a1: 1 },
  draw: R => { let p; do { p = { c: R.int(1, 3), d: R.int(1, 3), a0: R.int(0, 5), a1: R.int(1, 5) }; } while (recRun(p)[8] >= 1000 || (p.c === 1 && p.d === 1 && p.a0 === 0 && p.a1 === 1)); return p; },
  build: ({ c, d, a0, a1 }) => { const a = recRun({ c, d, a0, a1 }), step = k => `a${sub(k)} = ${recStep(c, d, a[k - 1], a[k - 2])} = ${n(a[k])}`; return {
   prompt: `The yard’s count of spare valves follows the recurrence relation ${recRule(c, d)} for n ≥ 2, with initial conditions a₀ = ${n(a0)} and a₁ = ${n(a1)}, where aₙ is the count n weeks from now. Enter a₄, then a₈.`,
   answer: [a[4], a[8]],
   hints: [`Each new term needs the two terms just before it: a₂ = ${recStep(c, d, 'a₁', 'a₀')}.`, 'Write the terms in a row from a₀ and keep going one term at a time, up to a₈.'],
   solution: `${[2, 3, 4, 5, 6, 7].map(step).join(', ')} and ${step(8)}.`,
   guidance: [
    { prompt: `Use the rule ${recRule(c, d)} with a₀ = ${n(a0)} and a₁ = ${n(a1)}. What are a₂ and a₃?`, answer: [a[2], a[3]], explanation: `${step(2)} and ${step(3)}.` },
    { prompt: 'Keep going. What are a₄ and a₅?', answer: [a[4], a[5]], explanation: `${step(4)} and ${step(5)}.` },
    { prompt: 'What are a₆ and a₇?', answer: [a[6], a[7]], explanation: `${step(6)} and ${step(7)}.` },
    { prompt: 'What is a₈?', answer: [a[8]], explanation: `${step(8)}.` }
   ] }; }
 },
 /* Three lines: arithmetic (a, d), geometric (g, r) over 6 weeks, quadratic (c2, c1, c0) over 5 weeks. */
 q29: {
  canonical: { a: 17, d: 6, g: 2, r: 3, c2: 1, c1: 1, c0: 1 },
  draw: R => { let p; do { p = { a: R.int(5, 30), d: R.int(2, 9), g: R.int(1, 5), r: R.int(2, 3), c2: R.int(1, 3), c1: R.int(-2, 5), c0: R.int(0, 6) }; }
   while ([1, 2, 3, 4, 5].some(k => p.c2 * k * k + p.c1 * k + p.c0 <= 0)); return p; },
  build: ({ a, d, g, r, c2, c1, c0 }) => { const A = [0, 1, 2, 3].map(i => a + i * d), A10 = a + 9 * d, B = [0, 1, 2, 3].map(i => g * Math.pow(r, i)), top = Math.pow(r, 6) - 1, S = g * top / (r - 1);
   const f = k => c2 * k * k + c1 * k + c0, Cl = [1, 2, 3, 4, 5].map(f), d1 = [1, 2, 3, 4].map(i => Cl[i] - Cl[i - 1]), dd = 2 * c2, nd = d1[3] + dd, C6 = Cl[4] + nd;
   return {
   prompt: `Mira forecasts three stock lines. Line A: ${A.map(n).join(', ')}, … (the same amount is added each week). Line B: ${B.map(n).join(', ')}, … (each week is the same multiple of the week before). Line C: ${Cl.map(n).join(', ')}, … (a polynomial in the week number). Enter line A’s count in week 10, then line B’s total over its first 6 weeks, then line C’s count in week 6. Type each count without commas.`,
   answer: [A10, S, C6],
   hints: ['Line A is an arithmetic sequence and line B a geometric one: find the common difference and the common ratio first.', 'For line C take differences until a row is constant, then extend every row by one entry.'],
   solution: `Line A has common difference ${n(d)}, so a₁₀ = ${n(a)} + 9 × ${n(d)} = ${n(A10)}. Line B has common ratio ${n(r)}, so the sum of its first 6 terms is ${n(g)} × (${n(r)}⁶ − 1) ÷ (${n(r)} − 1) = ${n(g)} × ${n(top)} ÷ ${n(r - 1)} = ${n(S)}. Line C has first differences ${d1.map(n).join(', ')} and second differences ${n(dd)}, ${n(dd)}, ${n(dd)}, so the next first difference is ${n(d1[3])} + ${n(dd)} = ${n(nd)} and week 6 has ${n(Cl[4])} ${cst(nd)} = ${n(C6)}.`,
   guidance: [
    { prompt: 'What is line A’s common difference, and what is its count in week 10?', answer: [d, A10], explanation: `Each week adds ${n(A[1])} − ${n(A[0])} = ${n(d)}. Week 10 is 9 steps after week 1: ${n(a)} + 9 × ${n(d)} = ${n(A10)}.` },
    { prompt: 'What is line B’s common ratio, and what is its total over the first 6 weeks?', answer: [r, S], explanation: `Each week is ${n(r)} times the one before, so the total is ${n(g)} × (${n(r)}⁶ − 1) ÷ (${n(r)} − 1) = ${n(g)} × ${n(top)} ÷ ${n(r - 1)} = ${n(S)}.` },
    { prompt: 'What is line C’s next first difference, and its count in week 6?', answer: [nd, C6], explanation: `The first differences ${d1.map(n).join(', ')} grow by ${n(dd)} each time, so the next is ${n(nd)}, and week 6 has ${n(Cl[4])} ${cst(nd)} = ${n(C6)}.` }
   ] }; }
 },
 /* aₙ = aₙ₋₁ + pn + q, a₀ given; a₃ and a_N. Not the worked example (a₀ = 2, aₙ = aₙ₋₁ + 4n − 1, n = 10). */
 q30: {
  canonical: { a0: 5, p: 2, q: 3, N: 20 },
  draw: R => ({ a0: R.int(1, 9), p: R.int(1, 4), q: R.int(1, 6), N: R.pick([12, 15, 20, 25, 30]) }),
  build: ({ a0, p, q, N }) => { const g = k => p * k + q, a = [a0]; for (let k = 1; k <= 3; k++) a.push(a[k - 1] + g(k));
   const first = g(1), last = g(N), sum = N * (first + last) / 2, aN = a0 + sum, rule = `${lead(p, 'n')} + ${n(q)}`; return {
   prompt: `The Tiling Works tile store follows the recurrence relation aₙ = aₙ₋₁ + ${rule} for n ≥ 1, with a₀ = ${n(a0)}: in week n the store gains ${rule} tiles. Enter a₃, then a${sub(N)} (type it without commas).`,
   answer: [a[3], aN],
   hints: [`Iterate: a₁ = a₀ + (${p === 1 ? '1' : `${n(p)} × 1`} + ${n(q)}), a₂ = a₁ + (${p === 1 ? '2' : `${n(p)} × 2`} + ${n(q)}), and so on, each step adding one more amount.`, `Unrolled all the way down, a${sub(N)} is a₀ plus the ${n(N)} amounts gained in weeks 1 to ${n(N)}. Those amounts form an arithmetic sequence, so add them as the number of terms × (first + last) ÷ 2.`],
   solution: `a₁ = ${n(a0)} + ${n(g(1))} = ${n(a[1])}, a₂ = ${n(a[1])} + ${n(g(2))} = ${n(a[2])} and a₃ = ${n(a[2])} + ${n(g(3))} = ${n(a[3])}. By iteration, a${sub(N)} = a₀ + (${n(first)} + ${n(g(2))} + … + ${n(last)}). The ${n(N)} amounts form an arithmetic sequence from ${n(first)} to ${n(last)}, with sum ${n(N)} × (${n(first)} + ${n(last)}) ÷ 2 = ${n(sum)}. So a${sub(N)} = ${n(a0)} + ${n(sum)} = ${n(aN)}.`,
   guidance: [
    { prompt: `Apply the rule three times from a₀ = ${n(a0)}. What are a₁, a₂ and a₃?`, answer: [a[1], a[2], a[3]], explanation: `Week 1 adds ${n(g(1))}, week 2 adds ${n(g(2))} and week 3 adds ${n(g(3))}: ${n(a[1])}, ${n(a[2])}, ${n(a[3])}.` },
    { prompt: `What are the amounts gained in week 1 and in week ${n(N)}?`, answer: [first, last], explanation: `Put n = 1 and n = ${n(N)} into ${rule}: ${n(first)} and ${n(last)}.` },
    { prompt: `What is the sum of the ${n(N)} amounts, and what is a${sub(N)}?`, answer: [sum, aN], explanation: `${n(N)} × (${n(first)} + ${n(last)}) ÷ 2 = ${n(sum)}, and a${sub(N)} = ${n(a0)} + ${n(sum)} = ${n(aN)}.` }
   ] }; }
 },
});
})();
