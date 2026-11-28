/* Graph theory: networks mission generators, file d: q31–q40. Shape and helpers: docs/PACK-FORMAT.md §3 and game/gen-core.js.
   build(canonical) must reproduce the authored text in missions-d.js exactly. */
(function(){
'use strict';
const G = window.Gen, { n, plus, par } = G;
/* "3, 2, 4 and 1". */
const and = list => list.length < 2 ? list.join('') : list.slice(0, -1).join(', ') + ' and ' + list[list.length - 1];
/* A set written with braces: set([1, 3]) is '{1, 3}'. */
const set = list => '{' + list.join(', ') + '}';
const C = (a, b) => { if (b < 0 || b > a) return 0; let r = 1; for (let i = 1; i <= b; i++) r = r * (a - b + i) / i; return Math.round(r); };
const sup = k => String(k).split('').map(c => '⁰¹²³⁴⁵⁶⁷⁸⁹'[c]).join('');
const sub = k => String(k).split('').map(c => '₀₁₂₃₄₅₆₇₈₉'[c]).join('');
const WORD = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten'];
const Cap = s => s[0].toUpperCase() + s.slice(1);
/* Random distinct sorted picks of k numbers from lo..hi. */
const pickSome = (R, lo, hi, k) => { const pool = []; for (let i = lo; i <= hi; i++) pool.push(i); const out = [];
 while (out.length < k) out.push(pool.splice(R.int(0, pool.length - 1), 1)[0]); return out.sort((a, b) => a - b); };
/* Every subset of 0..m−1 as a list of indices, smallest sets first, then in order. */
const subsets = m => { const out = []; for (let mask = 1; mask < (1 << m); mask++) { const s = []; for (let i = 0; i < m; i++) if (mask & (1 << i)) s.push(i); out.push(s); }
 return out.sort((a, b) => a.length - b.length || a.join() .localeCompare(b.join())); };

/* q31: technicians and pump jobs. lists[i] are the jobs (1..m) technician i is certified for. */
const TECH = ['Ash', 'Bo', 'Cy', 'Di', 'Eve'];
const jobsOf = (lists, S) => [...new Set(S.flatMap(i => lists[i]))].sort((a, b) => a - b);
const matchAll = lists => { const m = lists.length, used = new Set(), got = [];
 const go = i => { if (i === m) return true; for (const j of lists[i]) if (!used.has(j)) { used.add(j); got[i] = j; if (go(i + 1)) return true; used.delete(j); } return false; };
 return go(0) ? got.slice() : null; };
const violator = lists => subsets(lists.length).find(S => jobsOf(lists, S).length < S.length) || null;
const certText = lists => lists.map((l, i) => `${TECH[i]}: ${l.length > 1 ? 'jobs' : 'job'} ${and(l)}`).join('; ');
const jobCount = k => `${n(k)} ${k === 1 ? 'job' : 'jobs'}`;

/* q32: a one-way network on junctions 1..N, every arc from a smaller number to a larger one. */
const routes = (N, arcs) => { const P = Array(N + 1).fill(0); P[1] = 1; for (let j = 2; j <= N; j++) for (const [a, b] of arcs) if (b === j) P[j] += P[a]; return P; };
const into = (arcs, j) => arcs.filter(([, b]) => b === j).map(([a]) => a).sort((x, y) => x - y);
const arcText = arcs => arcs.map(([a, b]) => `${a}→${b}`).join(', ');

/* q33 and q34: the network with source 1, sink 5 and these seven arcs, in this order. */
const ARCS = [[1, 2], [1, 3], [2, 3], [2, 4], [3, 4], [3, 5], [4, 5]];
const SIDES = [[1], [1, 2], [1, 3], [1, 4], [1, 2, 3], [1, 2, 4], [1, 3, 4], [1, 2, 3, 4]];
const crossing = L => ARCS.map(([a, b], i) => ({ a, b, i, fwd: L.includes(a) && !L.includes(b), back: !L.includes(a) && L.includes(b) }));
const cutCap = (L, caps) => crossing(L).filter(x => x.fwd).reduce((s, x) => s + caps[x.i], 0);
const sinkSide = L => [1, 2, 3, 4, 5].filter(v => !L.includes(v));

/* q37: graphs on vertices 1..v as [i, j] pairs with i < j. */
const linked = edges => { const s = new Set(edges.map(([a, b]) => a + '-' + b)); return (a, b) => s.has(Math.min(a, b) + '-' + Math.max(a, b)); };
const largest = (v, edges, wantLinked) => { const L = linked(edges); let best = [];
 for (const S of subsets(v)) { const T = S.map(i => i + 1); let ok = true;
  for (let i = 0; i < T.length && ok; i++) for (let j = i + 1; j < T.length && ok; j++) if (L(T[i], T[j]) !== wantLinked) ok = false;
  if (ok && T.length > best.length) best = T; }
 return best; };
const edgeText = edges => edges.map(([a, b]) => `${a}–${b}`).join(', ');

window.MISSION_GEN = window.MISSION_GEN || {};
Object.assign(window.MISSION_GEN, {
 /* Four or five technicians, as many jobs, each technician certified for one to three jobs. Half the draws have a
    perfect matching. S has two to m − 1 technicians, so it is never the whole crew; in a "no" draw S may or may not be
    the set that fails Hall’s condition. Never the worked example (three technicians). */
 q31: {
  canonical: { lists: [[1, 3], [2, 4], [1], [1, 3]], S: [0, 1] },
  draw: R => { const m = R.pick([4, 4, 5]), want = R.bool(); let p;
   do { const lists = []; for (let i = 0; i < m; i++) lists.push(pickSome(R, 1, m, R.pick([1, 2, 2, 2, 3])));
    p = { lists, S: pickSome(R, 0, m - 1, R.int(2, m - 1)) }; } while (!!matchAll(p.lists) !== want);
   return p; },
  build: ({ lists, S }) => { const m = lists.length, w = WORD[m], names = S.map(i => TECH[i]), js = jobsOf(lists, S), ns = js.length,
   match = matchAll(lists), bad = match ? null : violator(lists), pm = match ? 1 : 0;
   const sLine = `S = ${set(names)} is certified for ${js.length > 1 ? 'jobs' : 'job'} ${and(js)}: that is ${jobCount(ns)} for ${n(S.length)} technicians`;
   const sFails = ns < S.length;
   let verdict;
   if (match) verdict = `A perfect matching exists: ${and(match.map((j, i) => `${TECH[i]} takes job ${j}`))}. Since it exists, every set of technicians meets Hall’s condition.`;
   else { const bn = bad.map(i => TECH[i]), bj = jobsOf(lists, bad);
    verdict = sFails ? `Hall’s condition fails for S itself, so no perfect matching exists.`
     : `But the set ${set(bn)} of ${n(bad.length)} technicians is certified only for ${bj.length > 1 ? 'jobs' : 'job'} ${and(bj)}, which is ${jobCount(bj.length)}, fewer than ${n(bad.length)}. Hall’s condition fails, so no perfect matching exists.`; }
   const sNote = sFails ? `, fewer than its members, so S fails Hall’s test.` : `, at least as many as its members, so S passes Hall’s test.`;
   return {
   prompt: `${Cap(w)} pump jobs, numbered 1 to ${n(m)}, each need one technician, and each of the ${w} technicians must take exactly one job that they are certified for. Certificates: ${certText(lists)}. Take the set S = ${set(names)}. Enter the number of jobs that at least one technician in S is certified for. Then enter 1 if all ${w} technicians can be given different jobs they are certified for (a perfect matching), or 0 if they cannot.`,
   answer: [ns, pm],
   hints: ['Join the certificate lists of the technicians in S and count each job once, however many of them share it.',
    'Hall’s condition: a perfect matching exists exactly when every set of technicians is certified, between them, for at least as many jobs as the set has members. To show yes, find the matching; to show no, find one set that falls short.'],
   solution: `${sLine}${sNote} ${verdict}`,
   guidance: [
    { prompt: `Join the certificates of ${and(names)} and count each job once. How many different jobs is that?`, answer: [ns], explanation: `${sLine}.` },
    { prompt: `Now look at all ${w} technicians. Start with those who have the fewest jobs and try to give everyone a different one. Can it be done? Enter 1 for yes, 0 for no.`, answer: [pm], explanation: verdict }
   ] }; }
 },
 /* Junctions 1..N (N from 6 to 8), arcs only from a smaller to a larger number and at most three apart, never 1→N.
    Every inner junction has an arc in and an arc out. Between 4 and 40 directed paths reach N; the inner junction asked
    has at least two arcs in. Never the worked example (four junctions). */
 q32: {
  canonical: { N: 7, arcs: [[1, 2], [1, 3], [2, 3], [2, 4], [2, 5], [3, 5], [3, 6], [4, 5], [4, 6], [5, 7], [6, 7]], v: 5 },
  draw: R => { let p;
   for (;;) { const N = R.int(6, 8), arcs = [];
    for (let a = 1; a < N; a++) for (let b = a + 1; b <= Math.min(N, a + 3); b++) if (!(a === 1 && b === N) && R.next() < 0.45) arcs.push([a, b]);
    for (let j = 2; j < N; j++) { if (!arcs.some(([, b]) => b === j)) arcs.push([Math.max(1, j - R.int(1, 2)), j]); if (!arcs.some(([a]) => a === j)) arcs.push([j, Math.min(N, j + R.int(1, 2))]); }
    const uniq = [...new Map(arcs.map(x => [x.join('-'), x])).values()].filter(([a, b]) => !(a === 1 && b === N)).sort((x, y) => x[0] - y[0] || x[1] - y[1]);
    const P = routes(N, uniq), cand = [];
    for (let j = 3; j < N; j++) if (into(uniq, j).length >= 2 && P[j] >= 2) cand.push(j);
    if (uniq.length > 14 || P[N] < 4 || P[N] > 40 || !cand.length || into(uniq, N).length < 2) continue;
    if ([...Array(N - 1).keys()].some(k => { const j = k + 2; return j < N && (!uniq.some(([, b]) => b === j) || !uniq.some(([a]) => a === j)); })) continue;
    p = { N, arcs: uniq, v: R.pick(cand) }; break; }
   return p; },
  build: ({ N, arcs, v }) => { const P = routes(N, arcs);
   const sum = j => { const from = into(arcs, j); return `${from.map(a => n(P[a])).join(' + ')}${from.length > 1 ? ` = ${n(P[j])}` : ''} (from ${from.length > 1 ? 'junctions' : 'junction'} ${and(from)})`; };
   const lines = []; for (let j = 2; j <= N; j++) lines.push(`junction ${j} gets ${sum(j)}`);
   return {
   prompt: `The pumping station’s one-way pipes join junctions 1 to ${N}. Each pipe is an arc: water can only run along it in the direction of its arrow. The arcs are ${arcText(arcs)}. Enter the number of directed paths from junction 1 to junction ${v}, then the number from junction 1 to junction ${N}.`,
   answer: [P[v], P[N]],
   hints: ['Every arc here goes from a smaller number to a larger one, so work through the junctions in order. The directed paths into a junction are the sum of the directed paths into each junction that has an arc pointing to it.',
    'Start with 1 at junction 1, for the path that has not moved yet, and write each count beside its junction before you go on to the next.'],
   solution: `Count in order, starting with 1 at junction 1: ${lines.join('; ')}. So ${n(P[v])} directed paths reach junction ${v} and ${n(P[N])} reach junction ${N}.`,
   guidance: [
    { prompt: `Arcs point into junction ${v} from ${and(into(arcs, v))}. Count the directed paths from 1 to each of those first, then add. How many directed paths go from 1 to ${v}?`, answer: [P[v]], explanation: `Junction ${v} gets ${sum(v)}.` },
    { prompt: `Arcs point into junction ${N} from ${and(into(arcs, N))}. How many directed paths go from 1 to ${N}?`, answer: [P[N]], explanation: `Junction ${N} gets ${sum(N)}. Each directed path to ${N} arrives along exactly one of these arcs, so nothing is counted twice.` }
   ] }; }
 },
 /* The fixed network ARCS. The flow is built from four routes (1→2→4→5, 1→3→5, 1→2→3→5, 1→3→4→5) with 0 to 5 litres
    each, so it always obeys the conservation rule; each capacity is the flow plus 0 to 4 and at least 1. The cut is one
    of the six that are not {1} or {1, 2, 3, 4}. Never the worked example (four junctions). */
 q33: {
  canonical: { a: [2, 3, 1, 2], slack: [2, 1, 2, 0, 3, 2, 1], L: [1, 3] },
  draw: R => { let a; do { a = [0, 0, 0, 0].map(() => R.int(0, 5)); } while (a.reduce((s, x) => s + x, 0) < 4 || a.filter(x => x > 0).length < 3);
   const slack = []; for (let i = 0; i < 7; i++) slack.push(R.int(0, 4));
   return { a, slack, L: R.pick(SIDES.slice(1, 7)) }; },
  build: ({ a, slack, L }) => { const f = [a[0] + a[2], a[1] + a[3], a[2], a[0], a[3], a[1] + a[2], a[0] + a[3]];
   const caps = f.map((x, i) => Math.max(1, x + slack[i])), value = f[0] + f[1], U = sinkSide(L), cr = crossing(L), fwd = cr.filter(x => x.fwd), back = cr.filter(x => x.back);
   const cap = cutCap(L, caps), arcName = x => `${x.a}→${x.b}`;
   const list = ARCS.map(([p, q], i) => `${p}→${q} carries ${n(f[i])} of ${n(caps[i])}`).join('; ');
   const fwdText = `${and(fwd.map(x => `${arcName(x)} (${n(caps[x.i])})`))}`, fwdSum = `${fwd.map(x => n(caps[x.i])).join(' + ')} = ${n(cap)}`;
   const backText = back.length ? ` ${and(back.map(arcName))} ${back.length > 1 ? 'point' : 'points'} back from the sink side and ${back.length > 1 ? 'are' : 'is'} not counted.` : '';
   return {
   prompt: `Water runs from the source, junction 1, to the sink, the reservoir at junction 5, through one-way pipes. For each arc the flow now running and its capacity are given in litres per second: ${list}. Enter the value of this flow, then the capacity of the cut that puts junctions ${and(L)} on the source side and ${and(U)} on the sink side.`,
   answer: [value, cap],
   hints: ['The value of a flow is the total leaving the source. Nothing flows into the source here, so add the flows on the arcs that leave it.',
    'For the cut, add the capacities, not the flows, of the arcs that start on the source side and end on the sink side. An arc pointing back from the sink side to the source side is not counted.'],
   solution: `Nothing flows into junction 1, so the value is what leaves it: ${n(f[0])} + ${n(f[1])} = ${n(value)} litres per second, the same as the ${n(f[5])} + ${n(f[6])} arriving at junction 5. The arcs from the source side to the sink side are ${fwdText}, so the cut’s capacity is ${fwdSum} litres per second.${backText} The flow’s value, ${n(value)}, is no more than the cut’s capacity, as it must be for every cut.`,
   guidance: [
    { prompt: 'Water in equals water out at every junction other than the source and the sink. How much flows into junction 2, and how much flows out of it?', answer: [f[0], f[2] + f[3]], explanation: `In: 1→2 carries ${n(f[0])}. Out: 2→3 and 2→4 carry ${n(f[2])} + ${n(f[3])} = ${n(f[2] + f[3])}. The two balance.` },
    { prompt: 'What is the total flow leaving junction 1, the source?', answer: [value], explanation: `1→2 carries ${n(f[0])} and 1→3 carries ${n(f[1])}, so ${n(value)} litres per second leave the source. That is the value of the flow.` },
    { prompt: `Which arcs go from ${set(L)} to ${set(U)}? Add their capacities.`, answer: [cap], explanation: `The forward arcs are ${fwdText}: ${fwdSum}.${backText}` }
   ] }; }
 },
 /* The fixed network ARCS with capacities 2 to 12. The smallest of the eight cuts is unique and smaller than both the
    cut around the source and the cut around the sink, so the answer never comes from an obvious cut. Never the worked
    example (four junctions). */
 q34: {
  canonical: { c: [9, 7, 3, 4, 2, 5, 8] },
  draw: R => { let c, caps;
   do { c = []; for (let i = 0; i < 7; i++) c.push(R.int(2, 12)); caps = SIDES.map(L => cutCap(L, c)); }
   while (!(() => { const m = Math.min(...caps); return caps.filter(x => x === m).length === 1 && m < caps[0] && m < caps[7]; })());
   return { c }; },
  build: ({ c }) => { const caps = SIDES.map(L => cutCap(L, c)), min = Math.min(...caps), at = caps.indexOf(min);
   const list = ARCS.map(([p, q], i) => `${p}→${q} (${n(c[i])})`).join(', ');
   const all = SIDES.map((L, i) => `${set(L)} ${n(caps[i])}`).join('; ');
   return {
   prompt: `The pumping station sends water from the source, junction 1, to the sink, junction 5. The one-way pipes and their capacities in litres per second are ${list}. Enter the capacity of the cut with only junction 1 on the source side, then the capacity of the cut with only junction 5 on the sink side, then the maximum flow from 1 to 5 in litres per second.`,
   answer: [caps[0], caps[7], min],
   hints: ['Every flow’s value is at most every cut’s capacity, and the max-flow min-cut theorem says the largest flow equals the smallest cut capacity.',
    'Junctions 2, 3 and 4 can each sit on the source side or the sink side, so there are 2 × 2 × 2 = 8 cuts. Work out all eight capacities, counting only arcs from the source side to the sink side.'],
   solution: `Around the source: ${n(c[0])} + ${n(c[1])} = ${n(caps[0])}. Around the sink: ${n(c[5])} + ${n(c[6])} = ${n(caps[7])}. All eight cuts, by their source side: ${all}. The smallest is ${set(SIDES[at])} with ${n(min)}. By the max-flow min-cut theorem the maximum flow equals the smallest cut capacity, so it is ${n(min)} litres per second.`,
   guidance: [
    { prompt: 'Only junction 1 on the source side: which arcs cross, and what is the total of their capacities?', answer: [caps[0]], explanation: `1→2 and 1→3 cross: ${n(c[0])} + ${n(c[1])} = ${n(caps[0])}.` },
    { prompt: 'Only junction 5 on the sink side: which arcs cross, and what is the total of their capacities?', answer: [caps[7]], explanation: `3→5 and 4→5 cross: ${n(c[5])} + ${n(c[6])} = ${n(caps[7])}.` },
    { prompt: 'Now work out the other six cuts as well. What is the smallest capacity of all eight?', answer: [min], explanation: `By source side: ${all}. The smallest is ${set(SIDES[at])}, ${n(min)}, so no flow can beat ${n(min)}, and the theorem says ${n(min)} can be reached.` }
   ] }; }
 },
 /* n from 5 to 7 (8⁶ would pass 100000; 4 is the worked example; at 3 the power would be 1). s plans already filed, from 2 (no "1 plans") to n^(n−2) − 1. */
 q35: {
  canonical: { n: 6, s: 250 },
  draw: R => { const k = R.pick([5, 6, 6, 7, 7]), total = Math.pow(k, k - 2); return { n: k, s: R.int(2, total - 1) }; },
  build: ({ n: k, s }) => { const e = k - 2, total = Math.pow(k, e), left = total - s, times = Array(e).fill(n(k)).join(' × ');
   return {
   prompt: `The archive is filing every possible cable plan that links ${n(k)} numbered domes as a tree: ${n(k - 1)} cables, every dome reachable from every other, and no loop of cables. Two plans count as different when some pair of domes is joined in one plan and not in the other. It has already filed ${n(s)} different plans. Enter the number of labelled trees on ${n(k)} vertices, then the number of plans still missing. Type numbers without commas.`,
   answer: [total, left],
   hints: ['Cayley’s formula: the number of labelled trees on n vertices is n to the power n − 2, that is, n multiplied by itself n − 2 times.',
    'The plans still missing are the labelled trees that have not been filed yet: take the ones filed away from the total.'],
   solution: `With n = ${n(k)}, n − 2 = ${n(e)}, so Cayley’s formula gives ${n(k)}${sup(e)} = ${e > 1 ? `${times} = ` : ''}${n(total)} labelled trees. ${n(total)} − ${n(s)} = ${n(left)} plans are still missing.`,
   guidance: [
    { prompt: `For ${n(k)} vertices, what is the power n − 2 in Cayley’s formula?`, answer: [e], explanation: `${n(k)} − 2 = ${n(e)}.` },
    { prompt: `Multiply ${n(k)} by itself ${n(e)} ${e > 1 ? 'times' : 'time'}. How many labelled trees are there on ${n(k)} vertices?`, answer: [total], explanation: `${n(k)}${sup(e)} = ${e > 1 ? `${times} = ` : ''}${n(total)}.` },
    { prompt: `${n(s)} plans are filed already. How many are still missing?`, answer: [left], explanation: `${n(total)} − ${n(s)} = ${n(left)}.` }
   ] }; }
 },
 /* A code of length n − 2 (n from 6 to 9) with entries 1..n. Usually the dome asked appears in the code. Never the worked
    example (five vertices). */
 q36: {
  canonical: { code: [3, 6, 3, 1, 6], v: 3 },
  draw: R => { const k = R.int(6, 9), code = []; for (let i = 0; i < k - 2; i++) code.push(R.int(1, k));
   const inCode = [...new Set(code)], v = R.next() < 0.8 ? R.pick(inCode) : R.int(1, k); return { code, v }; },
  build: ({ code, v }) => { const k = code.length + 2, times = code.filter(x => x === v).length, deg = times + 1;
   const missing = []; for (let i = 1; i <= k; i++) if (!code.includes(i)) missing.push(i);
   const timesText = times === 0 ? 'never appears' : times === 1 ? 'appears once' : times === 2 ? 'appears twice' : `appears ${n(times)} times`;
   return {
   prompt: `A tree plan for ${n(k)} domes, numbered 1 to ${n(k)}, is filed in the archive as its Prüfer code (${code.join(', ')}). Enter the degree of dome ${v} (its number of cables), then the number of leaves (domes with exactly one cable), then the number of the first leaf that was removed when the code was made.`,
   answer: [deg, missing.length, missing[0]],
   hints: ['Each vertex is written in the Prüfer code one time fewer than its degree.',
    'A leaf is never written in the code, so the leaves are exactly the numbers that do not appear in it. The code is made by always removing the smallest-numbered leaf.'],
   solution: `Dome ${v} ${timesText} in the code, so its degree is ${n(times)} + 1 = ${n(deg)}. The numbers from 1 to ${n(k)} that never appear are ${and(missing)}: those are the leaves, so there ${missing.length > 1 ? 'are' : 'is'} ${n(missing.length)}. The first leaf removed is the smallest of them, ${missing[0]}.`,
   guidance: [
    { prompt: `How many times does ${v} appear in the code (${code.join(', ')})?`, answer: [times], explanation: `Dome ${v} ${timesText}.` },
    { prompt: `Each vertex appears one time fewer than its degree. What is the degree of dome ${v}?`, answer: [deg], explanation: `${n(times)} + 1 = ${n(deg)}.` },
    { prompt: `Which numbers from 1 to ${n(k)} never appear in the code? Enter how many there are, then the smallest.`, answer: [missing.length, missing[0]], explanation: `${Cap(and(missing.map(String)))} never ${missing.length > 1 ? 'appear' : 'appears'}, so there ${missing.length > 1 ? 'are' : 'is'} ${n(missing.length)} ${missing.length > 1 ? 'leaves' : 'leaf'}, and the smallest, ${missing[0]}, was removed first.` }
   ] }; }
 },
 /* Either a ring C_N (N from 5 to 15, not 6: the worked example) or a listed graph on 6 or 7 servers with clique number
    3 or 4 and independence number at least 2. */
 q37: {
  canonical: { kind: 'graph', v: 7, edges: [[1, 2], [1, 3], [1, 7], [2, 3], [2, 4], [3, 4], [4, 5], [5, 6], [5, 7], [6, 7]] },
  draw: R => { if (R.next() < 0.35) return { kind: 'ring', N: R.except(5, 15, [6]) };
   for (;;) { const v = R.pick([6, 7]), edges = [];
    for (let a = 1; a <= v; a++) for (let b = a + 1; b <= v; b++) if (R.next() < 0.45) edges.push([a, b]);
    const w = largest(v, edges, true).length, al = largest(v, edges, false).length;
    if (edges.length >= 7 && edges.length <= 13 && w >= 3 && w <= 4 && al >= 2) return { kind: 'graph', v, edges }; } },
  build: p => {
   if (p.kind === 'ring') { const N = p.N, al = Math.floor(N / 2), take = []; for (let i = 1; i <= N - 1 && take.length < al; i += 2) take.push(i);
    return {
    prompt: `${n(N)} archive servers, numbered 1 to ${n(N)}, are linked in a ring, the cycle C${sub(N)}: each server is linked to the next, and server ${n(N)} is linked back to server 1. Enter the clique number ω, the size of the largest set of servers that are all linked to each other, then the independence number α, the size of the largest set of servers no two of which are linked.`,
    answer: [2, al],
    hints: ['A clique is a set of vertices every two of which are joined by an edge. Look for three vertices that are all joined, then check whether a fourth joins all three.',
     'For an independent set, pick a vertex, cross out its neighbours, pick another vertex that is left, and repeat. Try different starting vertices and keep the largest set you find.'],
    solution: `Each server is linked only to the two beside it, and those two are not linked to each other, so no three servers are all linked: ω = 2, from any single link. Taking every second server, ${and(take)}, gives ${n(al)} servers with no link between them, and ${n(al + 1)} servers would have to include two neighbours, so α = ${n(al)}.`,
    guidance: [
     { prompt: 'Can three servers of the ring all be linked to each other? Enter the size of the largest set of servers that are all linked.', answer: [2], explanation: 'The two servers beside any server are not linked to each other, so no three servers are all linked. A single link gives a clique of 2.' },
     { prompt: 'Take every second server round the ring. How many servers with no link between them can you get, at most?', answer: [al], explanation: `${Cap(and(take.map(String)))} have no link between them: ${n(al)} servers. Any ${n(al + 1)} servers of the ring include two that sit side by side.` }
    ] }; }
   const { v, edges } = p, cl = largest(v, edges, true), ind = largest(v, edges, false);
   return {
   prompt: `${Cap(WORD[v])} archive servers, numbered 1 to ${n(v)}, have direct links ${edgeText(edges)}. Enter the clique number ω, the size of the largest set of servers that are all linked to each other, then the independence number α, the size of the largest set of servers no two of which are linked.`,
   answer: [cl.length, ind.length],
   hints: ['A clique is a set of vertices every two of which are joined by an edge. Look for three vertices that are all joined, then check whether a fourth joins all three.',
    'For an independent set, pick a vertex, cross out its neighbours, pick another vertex that is left, and repeat. Try different starting vertices and keep the largest set you find.'],
   solution: `Servers ${and(cl)} are all linked to each other, and no ${n(cl.length + 1)} servers are, so ω = ${n(cl.length)}. Servers ${and(ind)} have no link between any two of them, and no ${n(ind.length + 1)} servers are like that, so α = ${n(ind.length)}.`,
   guidance: [
    { prompt: 'Find a largest set of servers that are all linked to each other. How many servers are in it?', answer: [cl.length], explanation: `Servers ${and(cl)} are all linked to each other, and no larger set is, so ω = ${n(cl.length)}.` },
    { prompt: 'Find a largest set of servers with no link between any two of them. How many servers are in it?', answer: [ind.length], explanation: `Servers ${and(ind)} have no link between them, and no larger set is free of links, so α = ${n(ind.length)}.` }
   ] }; }
 },
 /* K_n with n from 6 to 20, not 7 (the lesson quotes the 35 triangles of K₇), and cliques of k = 4, 5 or 6 vertices (k at most n − 2). The largest answer is
    C(20, 6) = 38760. Never the worked example (n = 5). */
 q38: {
  canonical: { n: 9, k: 4 },
  draw: R => { const m = R.except(6, 20, [7]); return { n: m, k: R.int(4, Math.min(6, m - 2)) }; },
  build: ({ n: m, k }) => { const t = C(m, 3), q = C(m, k), fall = j => Array.from({ length: j }, (_, i) => n(m - i)).join(' × '), fact = j => Array.from({ length: j }, (_, i) => n(j - i)).join(' × ');
   return {
   prompt: `The archive plans a fully linked group of ${n(m)} domes, with a tunnel between every pair: the complete graph K${sub(m)}. Enter the number of triangles, the sets of 3 domes all joined to each other, then the number of ${k}-cliques, the sets of ${k} domes all joined to each other. Type numbers without commas.`,
   answer: [t, q],
   hints: ['In a complete graph every set of 3 vertices is a triangle, so the triangles are the ways to choose 3 of the vertices, C(n, 3).',
    'In the same way every choice of k vertices is a k-clique: C(n, k) = n × (n − 1) × … with k factors on top, divided by k × (k − 1) × … × 1.'],
   solution: `Every 3 of the ${n(m)} domes form a triangle, so there are C(${n(m)}, 3) = (${fall(3)}) ÷ (3 × 2 × 1) = ${n(t)}. Every ${k} of them form a ${k}-clique, so there are C(${n(m)}, ${k}) = (${fall(k)}) ÷ (${fact(k)}) = ${n(q)}.`,
   guidance: [
    { prompt: `How many ways are there to choose 3 of the ${n(m)} domes?`, answer: [t], explanation: `C(${n(m)}, 3) = (${fall(3)}) ÷ (3 × 2 × 1) = ${n(t)}, and each choice is a triangle.` },
    { prompt: `How many ways are there to choose ${k} of the ${n(m)} domes?`, answer: [q], explanation: `C(${n(m)}, ${k}) = (${fall(k)}) ÷ (${fact(k)}) = ${n(q)}, and each choice is a ${k}-clique.` }
   ] }; }
 },
 /* K_n with n from 4 to 30 (not 7, the worked example), about a third of the draws at 4 or 5 where no one-kind
    triangle is forced. The dome asked is any of the n; the answer does not depend on it. */
 q39: {
  canonical: { n: 9, v: 4 },
  draw: R => { const m = R.next() < 0.3 ? R.pick([4, 5]) : R.except(6, 30, [7]); return { n: m, v: R.int(1, m) }; },
  build: ({ n: m, v }) => { const deg = m - 1, big = Math.ceil(deg / 2), small = deg - big, yes = m >= 6 ? 1 : 0;
   const why = yes ? `${n(m)} is at least R(3, 3) = 6, so a one-kind triangle is guaranteed: pick any 6 of the domes and the argument for six applies to them.`
    : `${n(m)} is less than R(3, 3) = 6, so it is not guaranteed: ${m === 5 ? 'make the ring 1–2–3–4–5–1 cables and the other five links radio beams' : 'make the ring 1–2–3–4–1 cables and the two cross links radio beams'}, and no three domes are joined by one kind only.`;
   return {
   prompt: `In an archive plan for ${n(m)} domes, every pair of domes is joined by exactly one link, and each link is either a cable or a radio beam: a two-colour K${sub(m)}. Enter the largest number that is guaranteed however the links are chosen: at least this many links of one kind meet at dome ${v}. Then enter 1 if every such plan must contain three domes joined to each other by links of one kind only, a one-kind triangle, or 0 if some choice of links avoids one.`,
   answer: [big, yes],
   hints: ['Pigeonhole principle: when a number of links is split into two kinds, one kind gets at least half of them, rounded up.',
    'A one-kind triangle is guaranteed exactly when the plan has at least R(3, 3) domes.'],
   solution: `Dome ${v} is joined to the other ${n(deg)} domes, so ${n(deg)} links meet there. If each kind had ${n(big - 1)} or fewer, there would be at most ${n(2 * (big - 1))} links, fewer than ${n(deg)}, so one kind has at least ${n(big)}; and a split of ${n(big)} and ${n(small)} shows no larger number is certain. ${why}`,
   guidance: [
    { prompt: `How many links meet at dome ${v}?`, answer: [deg], explanation: `Dome ${v} is joined once to each of the other ${n(deg)} domes.` },
    { prompt: `Split ${n(deg)} links into two kinds as evenly as you can. How many does the bigger kind get?`, answer: [big], explanation: `${n(deg)} = ${n(big)} + ${n(small)}, so the bigger share is ${n(big)}, and no split does better than that for both kinds.` },
    { prompt: `Is a one-kind triangle guaranteed for ${n(m)} domes? Enter 1 for yes, 0 for no.`, answer: [yes], explanation: why }
   ] }; }
 },
 /* An m × n grid on the torus, m and n from 3 to 12 (at 2 some crossings would be joined twice). Never the worked example
    (3 × 5 or 5 × 3). */
 q40: {
  canonical: { m: 4, n: 6 },
  draw: R => { let p; do { p = { m: R.int(3, 12), n: R.int(3, 12) }; } while ((p.m === 3 && p.n === 5) || (p.m === 5 && p.n === 3)); return p; },
  build: ({ m, n: k }) => { const V = m * k, E = 2 * V, F = V;
   return {
   prompt: `Mira’s last plan is for a ring-shaped habitat on a torus, the surface of a ring doughnut. Its corridors form a grid that wraps all the way round: ${n(m)} corridors circle the tube, ${n(k)} corridors circle the ring, and each corridor of one kind crosses each corridor of the other kind exactly once. Take each crossing as a vertex, each stretch of corridor between two neighbouring crossings as an edge, and each block enclosed by four stretches as a face. Enter V, then E, then F, then V − E + F.`,
   answer: [V, E, F, V - E + F],
   hints: ['Every corridor of one kind meets every corridor of the other kind once, so the crossings are the product of the two counts. Four stretches meet at every crossing, and each stretch has two ends.',
    'Every block has four sides, and on the torus every stretch is a side of exactly two blocks.'],
   solution: `V = ${n(m)} × ${n(k)} = ${n(V)} crossings. Four stretches meet at each crossing and each stretch has two ends, so E = 4 × ${n(V)} ÷ 2 = ${n(E)}. Each block has four sides and each stretch borders two blocks, so F = 2 × ${n(E)} ÷ 4 = ${n(F)}. V − E + F = ${n(V)} − ${n(E)} + ${n(F)} = 0, not the 2 of Euler’s formula in the plane: the number belongs to the surface the network is drawn on.`,
   guidance: [
    { prompt: `${n(m)} corridors round the tube each cross ${n(k)} corridors round the ring once. How many crossings are there?`, answer: [V], explanation: `${n(m)} × ${n(k)} = ${n(V)} crossings, so V = ${n(V)}.` },
    { prompt: 'Four stretches meet at each crossing, and each stretch has two ends. How many stretches are there?', answer: [E], explanation: `4 × ${n(V)} = ${n(4 * V)} ends, two per stretch, so E = ${n(E)}.` },
    { prompt: 'Each block has four sides, and each stretch borders two blocks. Enter F, then V − E + F.', answer: [F, V - E + F], explanation: `2 × ${n(E)} = ${n(2 * E)} sides, four per block, so F = ${n(F)}, and ${n(V)} − ${n(E)} + ${n(F)} = 0.` }
   ] }; }
 },
});
})();
