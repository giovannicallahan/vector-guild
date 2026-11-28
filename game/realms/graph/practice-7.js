/* Graph theory: networks practice missions, file 7 of 8: concepts q31–q35, three practice missions each
   (q31b q31c q31d q32b q32c q32d q33b q33c q33d q34b q34c q34d q35b q35c q35d).
   Format and rules: docs/PACK-FORMAT.md, "Practice missions" (§10).
     b  kind 'setting'    the same skill in a new real-world setting
     c  kind 'applied'    a word problem with two or three steps (two or three guided steps)
     d  kind 'challenge'  harder numbers, or the skill combined with one earlier concept (optional `uses: 'qNN'`)
   A practice mission supplies only: id, parent, kind, title, brief, prompt, answer, labels, tolerance, hints,
   solution, guidance (and `uses` for a challenge). Everything else comes from its parent, the learn mission:
   topic, tier, xp, sector, lesson, teaching, sources, the concept bench and the review drill. Do not write those.
   Each mission is registered together with its generator by add(mission, generator); build(canonical) must
   reproduce the authored prompt, hints, solution and guidance exactly. Oracles: qa/realms/graph/oracle-p7.js. */
(function(){
'use strict';
const G = window.Gen, { n, plus, par } = G;
const PRACTICE = window.PRACTICE = window.PRACTICE || [];
const GEN = window.MISSION_GEN = window.MISSION_GEN || {};
/* Registers one practice mission and its generator {canonical, draw(R), build(p)}. */
const add = (mission, generator) => { PRACTICE.push(mission); GEN[mission.id] = generator; };

/* Helpers. practice(meta, stepLabels, generator) registers a mission through add(): its prompt, answers, hints,
   solution and guided steps are build(canonical) itself (cleaned as the engine cleans them), so the authored text
   and the generator cannot drift apart. `meta` holds id, parent, kind, title, brief, labels, tolerance (and uses);
   `stepLabels` holds the answer labels of each guided step, in order. The canonical parameters are the first draw of
   a fixed seed, so they always satisfy the generator's own filters. To read a mission as the player sees it:
   node qa/show-mission.js <id> --realm graph */
const practice = (meta, stepLabels, generator) => {
 generator.canonical = generator.draw(G.rng(7, meta.id, 1));
 const b = generator.build(generator.canonical), c = G.clean, t = G.tidy, { id, parent, kind, title, brief, labels, tolerance, uses } = meta;
 add({ id, parent, kind, title, brief, prompt: c(b.prompt), answer: b.answer.map(t), labels, tolerance,
  hints: b.hints.map(c), solution: c(b.solution),
  guidance: b.guidance.map((s, i) => ({ prompt: c(s.prompt), answer: s.answer.map(t), labels: stepLabels[i], explanation: c(s.explanation) })),
  ...(uses ? { uses } : {}) }, generator);
};
/* "3, 2, 4 and 1". */
const and = list => list.length < 2 ? list.join('') : list.slice(0, -1).join(', ') + ' and ' + list[list.length - 1];
const set = list => '{' + list.join(', ') + '}';
const sup = k => String(k).split('').map(c => '⁰¹²³⁴⁵⁶⁷⁸⁹'[c]).join('');
const WORD = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten'];
const Cap = s => s[0].toUpperCase() + s.slice(1);
const pickSome = (R, lo, hi, k) => { const pool = []; for (let i = lo; i <= hi; i++) pool.push(i); const out = [];
 while (out.length < k) out.push(pool.splice(R.int(0, pool.length - 1), 1)[0]); return out.sort((a, b) => a - b); };
/* Every non-empty subset of 0..m−1 as a list of indices, smallest sets first, then in order. */
const subsets = m => { const out = []; for (let mask = 1; mask < (1 << m); mask++) { const s = []; for (let i = 0; i < m; i++) if (mask & (1 << i)) s.push(i); out.push(s); }
 return out.sort((a, b) => a.length - b.length || a.join().localeCompare(b.join())); };

/* ---- q31 Hall's condition [KT14.2] ---- */

/* lists[i] are the jobs (1..m) of worker i. */
const NAMES = ['Ash', 'Bo', 'Cy', 'Di', 'Eve', 'Fay'];
const jobsOf = (lists, S) => [...new Set(S.flatMap(i => lists[i]))].sort((a, b) => a - b);
const allMatches = lists => { const out = [], used = new Set(), got = [];
 const go = i => { if (i === lists.length) { out.push(got.slice()); return; } for (const j of lists[i]) if (!used.has(j)) { used.add(j); got[i] = j; go(i + 1); used.delete(j); } };
 go(0); return out; };
const violator = lists => subsets(lists.length).find(S => jobsOf(lists, S).length < S.length) || null;
const drawLists = (R, m, lo, hi) => { const lists = []; for (let i = 0; i < m; i++) lists.push(pickSome(R, 1, m, R.pick([1, 2, 2, 2, 3]))); return lists; };
/* Text pieces shared by q31b and q31d. T = { names, thing, who, verb, only }. */
const tm = (T, k) => k === 1 ? T.thing : T.thing + 's';
const certText = (lists, T) => lists.map((l, i) => `${T.names[i]}: ${tm(T, l.length)} ${and(l)}`).join('; ');
const hallParts = (lists, S, T) => {
 const nm = S.map(i => T.names[i]), js = jobsOf(lists, S), ns = js.length, ms = allMatches(lists), match = ms[0] || null, bad = match ? null : violator(lists);
 const sLine = `S = ${set(nm)} ${T.verb} ${tm(T, ns)} ${and(js)}: that is ${n(ns)} ${tm(T, ns)} for ${n(S.length)} ${T.who}s`;
 const sFails = ns < S.length, sNote = sFails ? ', fewer than its members, so S fails Hall’s test.' : ', at least as many as its members, so S passes Hall’s test.';
 let verdict;
 if (match) verdict = `A perfect matching exists: ${and(match.map((j, i) => `${T.names[i]} takes ${T.thing} ${j}`))}. Since it exists, every set of ${T.who}s meets Hall’s condition.`;
 else { const bn = bad.map(i => T.names[i]), bj = jobsOf(lists, bad);
  verdict = sFails ? 'Hall’s condition fails for S itself, so no perfect matching exists.'
   : `But the set ${set(bn)} of ${n(bad.length)} ${T.who}s ${T.only} ${tm(T, bj.length)} ${and(bj)}, which is ${n(bj.length)} ${tm(T, bj.length)}, fewer than ${n(bad.length)}. Hall’s condition fails, so no perfect matching exists.`; }
 return { nm, js, ns, ms, match, bad, sLine, sNote, verdict, pm: match ? 1 : 0 };
};

const ROV = { names: NAMES, thing: 'bay', who: 'rover', verb: 'fits', only: 'fits only' };
practice({ id: 'q31b', parent: 'q31', kind: 'setting', title: 'Bays for the night rovers',
 brief: 'The pump house’s service rovers must all be parked for the night, one to a bay, and the depot clerk wants to know whether the bays they fit make that possible.',
 labels: ['bays S fits', 'perfect matching (1 yes, 0 no)'], tolerance: 0.01 },
 [['bays S fits'], ['perfect matching (1 yes, 0 no)']], {
 /* Four or five rovers, as many bays, each rover fits one to three bays. Half the draws have a perfect matching. S has
    two to m − 1 rovers. Never the worked example (three technicians). */
 draw: R => { const m = R.pick([4, 4, 5]), want = R.bool(); let p;
  do { p = { lists: drawLists(R, m), S: pickSome(R, 0, m - 1, R.int(2, m - 1)) }; } while ((allMatches(p.lists).length > 0) !== want);
  return p; },
 build: ({ lists, S }) => { const m = lists.length, w = WORD[m], h = hallParts(lists, S, ROV);
  return {
  prompt: `${Cap(w)} service rovers must park for the night in the pump house’s ${w} bays, numbered 1 to ${n(m)}, one rover to a bay, and each rover can only use a bay it fits. Fits: ${certText(lists, ROV)}. Take the set S = ${set(h.nm)}. Enter the number of bays that at least one rover in S fits. Then enter 1 if all ${w} rovers can be given different bays that they fit (a perfect matching), or 0 if they cannot.`,
  answer: [h.ns, h.pm],
  hints: ['Join the fit lists of the rovers in S and count each bay once, even when several rovers in S fit it.',
   'Hall’s condition: a perfect matching exists exactly when every set of rovers fits, between them, at least as many bays as the set has members. To show yes, find the matching; to show no, find one set that falls short.'],
  solution: `${h.sLine}${h.sNote} ${h.verdict}`,
  guidance: [
   { prompt: `Join the fit lists of ${and(h.nm)} and count each bay once. How many different bays is that?`, answer: [h.ns], explanation: `${h.sLine}.` },
   { prompt: `Now look at all ${w} rovers. Start with those that fit the fewest bays and try to give every rover a different bay. Can it be done? Enter 1 for yes, 0 for no.`, answer: [h.pm], explanation: h.verdict }
  ] }; }
});

const TECH = { names: NAMES, thing: 'job', who: 'technician', verb: 'is certified for', only: 'is certified only for' };
practice({ id: 'q31c', parent: 'q31', kind: 'applied', title: 'The certificate course',
 brief: 'One technician is about to take a course that adds a certificate, and the rota office wants to know whether that is enough to fill every pump job.',
 labels: ['jobs S can do now', 'jobs S can do after the course', 'perfect matching after (1 yes, 0 no)'], tolerance: 0.01 },
 [['jobs S can do now'], ['jobs S can do after the course'], ['perfect matching after (1 yes, 0 no)']], {
 /* Four or five technicians with no perfect matching today. S is a smallest set that fails Hall’s condition (two or more
    technicians). One member of S gains one job they could not do before; the new matching may or may not exist. */
 draw: R => { const m = R.pick([4, 4, 5]); let p;
  for (;;) { const lists = drawLists(R, m); if (allMatches(lists).length) continue;
   const S = violator(lists), x = R.pick(S), rest = []; for (let j = 1; j <= m; j++) if (!lists[x].includes(j)) rest.push(j);
   if (!rest.length) continue; p = { lists, S, x, j: R.pick(rest) }; break; }
  return p; },
 build: ({ lists, S, x, j }) => { const m = lists.length, w = WORD[m], nm = S.map(i => TECH.names[i]);
  const after = lists.map((l, i) => i === x ? [...l, j].sort((a, b) => a - b) : l), js1 = jobsOf(lists, S), js2 = jobsOf(after, S);
  const ms = allMatches(after), match = ms[0] || null, bad = match ? null : violator(after), pm = match ? 1 : 0;
  const jc = (list) => `${tm(TECH, list.length)} ${and(list)}`;
  const verdict = match ? `A perfect matching exists: ${and(match.map((jb, i) => `${TECH.names[i]} takes job ${jb}`))}. Since it exists, every set of technicians meets Hall’s condition.`
   : `The set ${set(bad.map(i => TECH.names[i]))} of ${n(bad.length)} technicians is certified only for ${jc(jobsOf(after, bad))}, which is ${n(jobsOf(after, bad).length)} ${tm(TECH, jobsOf(after, bad).length)}, fewer than ${n(bad.length)}. Hall’s condition still fails, so no perfect matching exists.`;
  const now = `S = ${set(nm)} is certified for ${jc(js1)} now: that is ${n(js1.length)} ${tm(TECH, js1.length)} for ${n(S.length)} technicians`;
  const then = js2.length === js1.length ? `Job ${j} is already one of them, so S is still certified for ${jc(js2)}: ${n(js2.length)} ${tm(TECH, js2.length)}.` : `After the course S is certified for ${jc(js2)}: ${n(js2.length)} ${tm(TECH, js2.length)}.`;
  return {
  prompt: `${Cap(w)} pump jobs, numbered 1 to ${n(m)}, each need one technician, and each of the ${w} technicians must take exactly one job that they are certified for. Certificates today: ${certText(lists, TECH)}. Before the shift ${TECH.names[x]} will pass a course and become certified for job ${j} as well, keeping the old certificates. Take the set S = ${set(nm)}. Enter the number of jobs that at least one technician in S is certified for today, then the number after the course. Then enter 1 if, after the course, all ${w} technicians can be given different jobs they are certified for (a perfect matching), or 0 if they cannot.`,
  answer: [js1.length, js2.length, pm],
  hints: ['Join the certificate lists of the technicians in S and count each job once. After the course, add the new job to the list of the technician who gained it, and count again.',
   'Hall’s condition: a perfect matching exists exactly when every set of technicians is certified, between them, for at least as many jobs as the set has members. To show yes, find the matching; to show no, find one set that falls short.'],
  solution: `${now}, fewer than its members. ${then} ${verdict}`,
  guidance: [
   { prompt: `Join the certificates of ${and(nm)} as they are today and count each job once. How many different jobs is that?`, answer: [js1.length], explanation: `${now}.` },
   { prompt: `${TECH.names[x]} also becomes certified for job ${j}. Join the certificates of ${and(nm)} again and count each job once. How many different jobs is that now?`, answer: [js2.length], explanation: then },
   { prompt: `Now look at all ${w} technicians with the new certificate. Start with those who have the fewest jobs and try to give everyone a different one. Can it be done? Enter 1 for yes, 0 for no.`, answer: [pm], explanation: verdict }
  ] }; }
});

const SIX = { names: NAMES, thing: 'job', who: 'technician', verb: 'is certified for', only: 'is certified only for' };
practice({ id: 'q31d', parent: 'q31', kind: 'challenge', title: 'Six jobs, six technicians',
 brief: 'The night shift is a full crew of six, and the rota office wants every pump job covered and a count of the different ways to do it.',
 labels: ['jobs S can do', 'ways to give out the jobs'], tolerance: 0.01 },
 [['jobs S can do'], ['ways to give out the jobs']], {
 /* Six technicians and six jobs, one to three certificates each. S has two to four technicians. Either no way at all or
    from one to six ways, so every way can be listed in the solution. */
 draw: R => { const want0 = R.next() < 0.4; let p;
  for (;;) { const lists = drawLists(R, 6), c = allMatches(lists).length; if (want0 ? c !== 0 : (c < 1 || c > 6)) continue;
   p = { lists, S: pickSome(R, 0, 5, R.int(2, 4)) }; break; }
  return p; },
 build: ({ lists, S }) => { const h = hallParts(lists, S, SIX), c = h.ms.length, nm = h.nm;
  const sSay = `${h.sLine}.`;
  const ways = c === 0 ? `The set ${set(h.bad.map(i => NAMES[i]))} of ${n(h.bad.length)} technicians is certified only for ${tm(SIX, jobsOf(lists, h.bad).length)} ${and(jobsOf(lists, h.bad))}, which is ${n(jobsOf(lists, h.bad).length)} ${tm(SIX, jobsOf(lists, h.bad).length)}, fewer than ${n(h.bad.length)}. Hall’s condition fails, so there are 0 ways.`
   : `Writing each way as the jobs taken by ${and(NAMES)} in that order, the ways are ${and(h.ms.map(m => `(${m.join(', ')})`))}: ${n(c)} ${c === 1 ? 'way' : 'ways'} in all.`;
  return {
  prompt: `Six pump jobs, numbered 1 to 6, each need one technician. Each of the six technicians takes exactly one job that they are certified for, and every job is taken by someone. Certificates: ${certText(lists, SIX)}. Take the set S = ${set(nm)}. Enter the number of jobs that at least one technician in S is certified for. Then enter the number of different ways to give the six technicians six different jobs that they are certified for; two ways differ when some technician gets a different job. Enter 0 if there is no way.`,
  answer: [h.ns, c],
  hints: ['Join the certificate lists of the technicians in S and count each job once, however many of them share it.',
   'Start with the technician who has the fewest certificates. For each of their jobs, cross it off and see what is left for the others, and keep going; count each complete way once. If some set of technicians is certified, between them, for fewer jobs than the set has members, there is no way at all.'],
  solution: `${sSay} ${ways}`,
  guidance: [
   { prompt: `Join the certificates of ${and(nm)} and count each job once. How many different jobs is that?`, answer: [h.ns], explanation: sSay },
   { prompt: 'Now look at all six technicians. Work through the technicians with the fewest certificates first, trying each of their jobs in turn. How many different ways give every technician a different job? Enter 0 if there is none.', answer: [c], explanation: ways }
  ] }; }
});

/* ---- q32 Directed graphs: counting routes [KT12.2] ---- */

/* Junctions 1..N; every arc goes from a smaller number to a larger one. P[j] is the number of directed paths from 1 to j. */
const routes = (N, arcs) => { const P = Array(N + 1).fill(0); P[1] = 1; for (let j = 2; j <= N; j++) for (const [a, b] of arcs) if (b === j) P[j] += P[a]; return P; };
const into = (arcs, j) => arcs.filter(([, b]) => b === j).map(([a]) => a).sort((x, y) => x - y);
const arcText = arcs => arcs.map(([a, b]) => `${a}→${b}`).join(', ');
const sortArcs = arcs => [...new Map(arcs.map(x => [x.join('-'), x])).values()].sort((x, y) => x[0] - y[0] || x[1] - y[1]);
/* Random arcs between junctions at most `gap` apart, every junction after 1 with an arc in and every junction before N with an arc out, never 1→N. */
const dag = (R, N, gap, dens) => { const arcs = [];
 for (let a = 1; a < N; a++) for (let b = a + 1; b <= Math.min(N, a + gap); b++) if (!(a === 1 && b === N) && R.next() < dens) arcs.push([a, b]);
 for (let j = 2; j <= N; j++) if (!arcs.some(([, b]) => b === j)) arcs.push([Math.max(1, j - R.int(1, 2)), j]);
 for (let j = 1; j < N; j++) if (!arcs.some(([a]) => a === j)) arcs.push([j, Math.min(N, j + R.int(1, 2))]);
 return sortArcs(arcs).filter(([a, b]) => !(a === 1 && b === N)); };
/* "junction 4 gets 1 + 2 = 3 (from junctions 2 and 3)". */
const getsText = (P, arcs, j, word) => { const from = into(arcs, j);
 if (!from.length) return `${word} ${j} gets 0 (no pipe points into it)`;
 return `${word} ${j} gets ${from.map(a => n(P[a])).join(' + ')}${from.length > 1 ? ` = ${n(P[j])}` : ''} (from ${from.length > 1 ? word + 's' : word} ${and(from)})`; };
const linesText = (P, arcs, N, word) => { const out = []; for (let j = 2; j <= N; j++) out.push(getsText(P, arcs, j, word)); return out.join('; '); };

practice({ id: 'q32b', parent: 'q32', kind: 'setting', title: 'Through the filter stages',
 brief: 'Water at the pump house passes through stages of filters, and the engineers want to know how many different ways it can reach one filter and the last.',
 labels: ['paths to the first filter asked', 'paths to the last filter'], tolerance: 0.01 },
 [['paths to the first filter asked'], ['paths to the last filter']], {
 /* Filters 1 to N in stages of sizes 1, then 2, 2 and 3 in some order, then 1. Hoses only join one stage to the next, every filter has a hose in and a hose out.
    The filter asked is in the second or third middle stage and has at least two hoses in; 4 to 40 directed paths reach N. Never the worked example (four junctions). */
 draw: R => { let p;
  for (;;) { const mid = R.pick([[2, 2, 3], [2, 3, 2], [3, 2, 2]]), sizes = [1, ...mid, 1], layers = []; let c = 1;
   for (const s of sizes) { layers.push(Array.from({ length: s }, (_, i) => c + i)); c += s; }
   const N = c - 1, arcs = [];
   for (let k = 0; k + 1 < layers.length; k++) { const A = layers[k], B = layers[k + 1];
    for (const x of A) for (const y of B) if (R.next() < 0.55) arcs.push([x, y]);
    for (const x of A) if (!arcs.some(([a, b]) => a === x && B.includes(b))) arcs.push([x, R.pick(B)]);
    for (const y of B) if (!arcs.some(([a, b]) => b === y && A.includes(a))) arcs.push([R.pick(A), y]); }
   const list = sortArcs(arcs), P = routes(N, list), cand = [];
   for (const L of [layers[2], layers[3]]) for (const j of L) if (into(list, j).length >= 2 && P[j] >= 2) cand.push(j);
   if (list.length > 20 || P[N] < 4 || P[N] > 40 || !cand.length) continue;
   p = { N, arcs: list, v: R.pick(cand) }; break; }
  return p; },
 build: ({ N, arcs, v }) => { const P = routes(N, arcs);
  return {
  prompt: `Water at the pump house passes through stages of filters, numbered 1 to ${N}. A hose joins a filter to a filter in the next stage, and water can only run along a hose in the direction of its arrow. The hoses are ${arcText(arcs)}. A directed path follows hoses only in their direction. Enter the number of directed paths from filter 1 to filter ${v}, then the number from filter 1 to filter ${N}.`,
  answer: [P[v], P[N]],
  hints: ['Work through the filters in order of their numbers. The directed paths into a filter are the sum of the directed paths into each filter that has a hose pointing to it.',
   'Start with 1 at filter 1, for the path that has not moved yet, and write each count beside its filter before you go on to the next.'],
  solution: `Count in order, starting with 1 at filter 1: ${linesText(P, arcs, N, 'filter')}. So ${n(P[v])} directed paths reach filter ${v} and ${n(P[N])} reach filter ${N}.`,
  guidance: [
   { prompt: `Hoses point into filter ${v} from ${and(into(arcs, v))}. Count the directed paths from 1 to each of those first, then add. How many directed paths go from 1 to ${v}?`, answer: [P[v]], explanation: `${Cap(getsText(P, arcs, v, 'filter'))}.` },
   { prompt: `Hoses point into filter ${N} from ${and(into(arcs, N))}. How many directed paths go from 1 to ${N}?`, answer: [P[N]], explanation: `${Cap(getsText(P, arcs, N, 'filter'))}. Each directed path to ${N} arrives along exactly one of these hoses, so nothing is counted twice.` }
  ] }; }
});

practice({ id: 'q32c', parent: 'q32', kind: 'applied', title: 'A pipe shut for repair',
 brief: 'One pipe in the pumping station has to be shut for repair, and the engineers want to know how many of the water’s routes survive.',
 labels: ['paths with every pipe open', 'paths with the pipe shut', 'paths lost'], tolerance: 0.01 },
 [['paths with every pipe open'], ['paths with the pipe shut'], ['paths lost']], {
 /* Junctions 1..N (N from 6 to 8), arcs at most three apart. 6 to 40 directed paths reach N. The shut pipe is on at least one of them and not on all of them. Never the worked example (four junctions). */
 draw: R => { let p;
  for (;;) { const N = R.int(6, 8), arcs = dag(R, N, 3, 0.45), P = routes(N, arcs);
   if (arcs.length > 14 || P[N] < 6 || P[N] > 40) continue;
   const e = R.pick(arcs), rest = arcs.filter(x => x !== e), Q = routes(N, rest);
   if (Q[N] < 1 || Q[N] === P[N]) continue;
   p = { N, arcs, a: e[0], b: e[1] }; break; }
  return p; },
 build: ({ N, arcs, a, b }) => { const P = routes(N, arcs), rest = arcs.filter(([x, y]) => !(x === a && y === b)), Q = routes(N, rest), lost = P[N] - Q[N];
  return {
  prompt: `The pumping station’s one-way pipes join junctions 1 to ${N}. Each pipe is an arc: water can only run along it in the direction of its arrow. The arcs are ${arcText(arcs)}. A directed path follows arcs only in their direction. Pipe ${a}→${b} must be shut for repair, so no water can use it. Enter the number of directed paths from junction 1 to junction ${N} with every pipe open, then the number that remain with pipe ${a}→${b} shut, then the number of paths lost.`,
  answer: [P[N], Q[N], lost],
  hints: ['Work through the junctions in order. The directed paths into a junction are the sum of the directed paths into each junction that has an arc pointing to it. Start with 1 at junction 1.',
   'A shut pipe is simply left out of the list of arcs, so count again from junction 1 without it; the junction it pointed into, and every junction reached from there, may now have fewer paths.',
   'The paths lost are the paths with every pipe open take away the paths that remain.'],
  solution: `With every pipe open, count in order: ${linesText(P, arcs, N, 'junction')}. That gives ${n(P[N])} directed paths. With ${a}→${b} shut, count again without it: ${linesText(Q, rest, N, 'junction')}. That gives ${n(Q[N])}, so ${n(P[N])} − ${n(Q[N])} = ${n(lost)} path${lost === 1 ? ' is' : 's are'} lost.`,
  guidance: [
   { prompt: `With every pipe open, count the directed paths into each junction in order, starting with 1 at junction 1. How many directed paths go from 1 to ${N}?`, answer: [P[N]], explanation: `${Cap(linesText(P, arcs, N, 'junction'))}. That gives ${n(P[N])}.` },
   { prompt: `Now leave out ${a}→${b} and count again from junction 1. How many directed paths go from 1 to ${N}?`, answer: [Q[N]], explanation: `${Cap(linesText(Q, rest, N, 'junction'))}. That gives ${n(Q[N])}.` },
   { prompt: 'How many directed paths were lost: the number with every pipe open take away the number with the pipe shut?', answer: [lost], explanation: `${n(P[N])} − ${n(Q[N])} = ${n(lost)}.` }
  ] }; }
});

practice({ id: 'q32d', parent: 'q32', kind: 'challenge', title: 'The long pipe network',
 brief: 'The station’s oldest network has grown to nine or ten junctions, and the engineers want the number of ways in at three of them.',
 labels: ['paths to the first junction asked', 'paths to the second junction asked', 'paths to the last junction'], tolerance: 0.01 },
 [['paths to the first junction asked'], ['paths to the second junction asked'], ['paths to the last junction']], {
 /* Junctions 1..N (N 9 or 10), arcs at most three apart, at most 22 arcs. The two junctions asked are inner, each has at least two arcs in and at least three paths; 30 to 400 paths reach N. */
 draw: R => { let p;
  for (;;) { const N = R.int(9, 10), arcs = dag(R, N, 3, 0.5), P = routes(N, arcs), cand = [];
   for (let j = 4; j < N; j++) if (into(arcs, j).length >= 2 && P[j] >= 3) cand.push(j);
   if (arcs.length > 22 || P[N] < 30 || P[N] > 400 || cand.length < 2) continue;
   const v = R.pick(cand), w = R.pick(cand.filter(j => j !== v));
   p = { N, arcs, v: Math.min(v, w), w: Math.max(v, w) }; break; }
  return p; },
 build: ({ N, arcs, v, w }) => { const P = routes(N, arcs);
  return {
  prompt: `The pumping station’s oldest one-way pipes join junctions 1 to ${N}. Each pipe is an arc: water can only run along it in the direction of its arrow. The arcs are ${arcText(arcs)}. A directed path follows arcs only in their direction. Enter the number of directed paths from junction 1 to junction ${v}, then the number to junction ${w}, then the number to junction ${N}.`,
  answer: [P[v], P[w], P[N]],
  hints: ['Every arc goes from a smaller number to a larger one, so work through the junctions in order, writing each count beside its junction. Start with 1 at junction 1.',
   'The directed paths into a junction are the sum of the counts beside the junctions that have an arc pointing to it. A junction with no arc from a counted junction gets nothing from it.'],
  solution: `Count in order, starting with 1 at junction 1: ${linesText(P, arcs, N, 'junction')}. So ${n(P[v])} directed paths reach junction ${v}, ${n(P[w])} reach junction ${w} and ${n(P[N])} reach junction ${N}.`,
  guidance: [
   { prompt: `Arcs point into junction ${v} from ${and(into(arcs, v))}. Count the directed paths from 1 to each of those first, then add. How many directed paths go from 1 to ${v}?`, answer: [P[v]], explanation: `${Cap(getsText(P, arcs, v, 'junction'))}.` },
   { prompt: `Arcs point into junction ${w} from ${and(into(arcs, w))}. How many directed paths go from 1 to ${w}?`, answer: [P[w]], explanation: `${Cap(getsText(P, arcs, w, 'junction'))}.` },
   { prompt: `Arcs point into junction ${N} from ${and(into(arcs, N))}. How many directed paths go from 1 to ${N}?`, answer: [P[N]], explanation: `${Cap(getsText(P, arcs, N, 'junction'))}. Each directed path to ${N} arrives along exactly one of these arcs, so nothing is counted twice.` }
  ] }; }
});

/* ---- q33 Flows and cuts [KT13.2] ---- */

/* A flow network: vertices 1..V, source 1, sink V, arcs, and routes from 1 to V that build a flow with conservation at every inner vertex. */
const NET5 = { V: 5, arcs: [[1, 2], [1, 3], [2, 3], [2, 4], [3, 4], [3, 5], [4, 5]], routes: [[1, 2, 4, 5], [1, 3, 5], [1, 2, 3, 5], [1, 3, 4, 5]] };
const NET5B = { V: 5, arcs: [[1, 2], [1, 3], [1, 4], [2, 3], [2, 5], [3, 4], [3, 5], [4, 5]] };
const NET6 = { V: 6, arcs: [[1, 2], [1, 3], [2, 3], [2, 4], [3, 4], [3, 5], [4, 6], [5, 6]], routes: [[1, 2, 4, 6], [1, 3, 4, 6], [1, 3, 5, 6], [1, 2, 3, 5, 6]] };
const NET6X = { V: 6, arcs: [[1, 2], [1, 3], [2, 3], [2, 4], [2, 5], [3, 4], [3, 5], [4, 6], [5, 6]] };
const flowOf = (net, amt) => net.arcs.map(([a, b]) => net.routes.reduce((s, r, k) => s + (r.some((v, i) => v === a && r[i + 1] === b) ? amt[k] : 0), 0));
/* Every source side: vertex 1 with any set of inner vertices, smallest first. */
const sidesOf = V => { const out = []; for (let m = 0; m < (1 << (V - 2)); m++) { const L = [1]; for (let i = 0; i < V - 2; i++) if (m & (1 << i)) L.push(i + 2); out.push(L); }
 return out.sort((x, y) => x.length - y.length || x.join().localeCompare(y.join())); };
const crossArcs = (net, L) => net.arcs.map(([a, b], i) => ({ a, b, i, fwd: L.includes(a) && !L.includes(b), back: !L.includes(a) && L.includes(b) }));
const cutCap = (net, L, caps) => crossArcs(net, L).filter(x => x.fwd).reduce((s, x) => s + caps[x.i], 0);
const sinkOf = (net, L) => Array.from({ length: net.V }, (_, i) => i + 1).filter(v => !L.includes(v));
const lit = k => k === 1 ? "litre" : "litres";
const lps = k => `${n(k)} ${lit(k)} per second`;
const aname = ([a, b]) => `${a}→${b}`;
const drawAmt = R => { let a; do { a = [0, 0, 0, 0].map(() => R.int(0, 5)); } while (a.reduce((s, x) => s + x, 0) < 4 || a.filter(x => x > 0).length < 3); return a; };
/* "1→3 and 2→3 carry 3 + 1 = 4" or "3→4 carries 2". */
const carry = (net, f, idx) => idx.length === 1 ? `${aname(net.arcs[idx[0]])} carries ${n(f[idx[0]])}` : `${and(idx.map(i => aname(net.arcs[i])))} carry ${idx.map(i => n(f[i])).join(' + ')} = ${n(idx.reduce((s, i) => s + f[i], 0))}`;
const arcsFrom = (net, v) => net.arcs.map((x, i) => x[0] === v ? i : -1).filter(i => i >= 0);
const arcsInto = (net, v) => net.arcs.map((x, i) => x[1] === v ? i : -1).filter(i => i >= 0);
/* The facts of a flow and a cut. */
const flowParts = (net, amt, slack, L) => { const f = flowOf(net, amt), caps = f.map((x, i) => Math.max(1, x + slack[i])), V = net.V;
 const src = arcsFrom(net, 1), snk = arcsInto(net, V), value = src.reduce((s, i) => s + f[i], 0), cap = cutCap(net, L, caps), cr = crossArcs(net, L), fwd = cr.filter(x => x.fwd), back = cr.filter(x => x.back);
 const fwdText = and(fwd.map(x => `${aname(net.arcs[x.i])} (${n(caps[x.i])})`)), fwdSum = fwd.length > 1 ? `${fwd.map(x => n(caps[x.i])).join(" + ")} = ${n(cap)}` : n(cap);
 const backText = back.length ? ` ${and(back.map(x => aname(net.arcs[x.i])))} ${back.length > 1 ? 'point' : 'points'} back from the sink side and ${back.length > 1 ? 'are' : 'is'} not counted.` : '';
 return { f, caps, src, snk, value, cap, fwd, back, fwdText, fwdSum, backText, U: sinkOf(net, L),
  list: net.arcs.map((x, i) => `${aname(x)} carries ${n(f[i])} of ${n(caps[i])}`).join('; '),
  srcSum: `${src.map(i => n(f[i])).join(' + ')} = ${n(value)}`, snkSum: snk.map(i => n(f[i])).join(' + ') }; };

practice({ id: 'q33b', parent: 'q33', kind: 'setting', title: 'Coolant on the gauges',
 brief: 'The pump house’s cooling loop has a gauge on every line, and the technician wants the coolant delivered and the most that one group of lines could ever pass.',
 labels: ['value of the flow', 'capacity of the cut'], tolerance: 0.01 },
 [['into point 3', 'out of point 3'], ['value of the flow'], ['capacity of the cut']], {
 /* Six points, eight lines. The flow is built from four routes (0 to 5 litres each), each capacity is the flow plus 0 to 4 and at least 1. The cut is one of the 14 that are not {1} or {1..5}. Never the worked example (four junctions). */
 draw: R => { const amt = drawAmt(R), slack = []; for (let i = 0; i < 8; i++) slack.push(R.int(0, 4));
  return { amt, slack, L: R.pick(sidesOf(6).slice(1, -1)) }; },
 build: ({ amt, slack, L }) => { const q = flowParts(NET6, amt, slack, L), f = q.f, ins = arcsInto(NET6, 3), outs = arcsFrom(NET6, 3), inS = ins.reduce((s, i) => s + f[i], 0), outS = outs.reduce((s, i) => s + f[i], 0);
  return {
  prompt: `The pump house’s cooling loop sends coolant from the pump, point 1, to the radiator, point 6, through one-way lines. For each line the flow now running and its capacity are given in litres per second: ${q.list}. Enter the value of this flow, then the capacity of the cut that puts points ${and(L)} on the source side and ${and(q.U)} on the sink side.`,
  answer: [q.value, q.cap],
  hints: ['The value of a flow is the total leaving the source. Nothing flows into point 1 here, so add the flows on the lines that leave it.',
   'For the cut, add the capacities, not the flows, of the lines that start on the source side and end on the sink side. A line pointing back from the sink side to the source side is not counted.'],
  solution: `Nothing flows into point 1, so the value is what leaves it: ${q.srcSum} ${lit(q.value)} per second, the same as the ${q.snkSum} arriving at point 6. The arcs from the source side to the sink side are ${q.fwdText}, so the cut’s capacity is ${q.fwdSum} ${lit(q.cap)} per second.${q.backText} The flow’s value, ${n(q.value)}, is no more than the cut’s capacity, as it must be for every cut.`,
  guidance: [
   { prompt: 'Water in equals water out at every point other than the source and the sink. How much flows into point 3, and how much flows out of it?', answer: [inS, outS], explanation: `In: ${carry(NET6, f, ins)}. Out: ${carry(NET6, f, outs)}. The two balance.` },
   { prompt: 'What is the total flow leaving point 1, the source?', answer: [q.value], explanation: `${carry(NET6, f, q.src)}, so ${lps(q.value)} leave the source. That is the value of the flow.` },
   { prompt: `Which lines go from ${set(L)} to ${set(q.U)}? Add their capacities.`, answer: [q.cap], explanation: `The forward arcs are ${q.fwdText}: ${q.fwdSum}.${q.backText}` }
  ] }; }
});

practice({ id: 'q33c', parent: 'q33', kind: 'applied', title: 'Spare room on the cut',
 brief: 'The greenhouse irrigation branch is running, and the station chief wants to know how much more water one group of pipes could still take.',
 labels: ['value of the flow', 'capacity of the cut', 'spare room of the cut'], tolerance: 0.01 },
 [['value of the flow'], ['capacity of the cut'], ['spare room of the cut']], {
 /* The five-junction network with seven pipes. The flow is built from four routes (0 to 5 litres each); each capacity is the flow plus 0 to 4 and at least 1. The cut is one of the six that are not {1} or {1, 2, 3, 4}. Never the worked example (four junctions). */
 draw: R => { const amt = drawAmt(R), slack = []; for (let i = 0; i < 7; i++) slack.push(R.int(0, 4));
  return { amt, slack, L: R.pick(sidesOf(5).slice(1, 7)) }; },
 build: ({ amt, slack, L }) => { const q = flowParts(NET5, amt, slack, L), spare = q.cap - q.value;
  return {
  prompt: `The greenhouse irrigation branch carries water from the main valve, junction 1, to the tank, junction 5, through one-way pipes. For each pipe the flow now running and its capacity are given in litres per second: ${q.list}. Enter the value of this flow, then the capacity of the cut that puts junctions ${and(L)} on the source side and ${and(q.U)} on the sink side. Then enter the spare room of that cut, which is its capacity minus the value of the flow.`,
  answer: [q.value, q.cap, spare],
  hints: ['The value of a flow is the total leaving the source. Nothing flows into junction 1 here, so add the flows on the pipes that leave it.',
   'For the cut, add the capacities, not the flows, of the pipes that start on the source side and end on the sink side. A pipe pointing back from the sink side to the source side is not counted.',
   'The spare room is the capacity of the cut take away the value of the flow. It is never negative, because no flow is worth more than any cut.'],
  solution: `Nothing flows into junction 1, so the value is what leaves it: ${q.srcSum} ${lit(q.value)} per second, the same as the ${q.snkSum} arriving at junction 5. The arcs from the source side to the sink side are ${q.fwdText}, so the cut’s capacity is ${q.fwdSum} ${lit(q.cap)} per second.${q.backText} The spare room is ${n(q.cap)} − ${n(q.value)} = ${lps(spare)}.`,
  guidance: [
   { prompt: 'What is the total flow leaving junction 1, the source? That is the value of the flow.', answer: [q.value], explanation: `${carry(NET5, q.f, q.src)}, so ${lps(q.value)} leave the source.` },
   { prompt: `Which pipes go from ${set(L)} to ${set(q.U)}? Add their capacities.`, answer: [q.cap], explanation: `The forward arcs are ${q.fwdText}: ${q.fwdSum}.${q.backText}` },
   { prompt: 'Take the value of the flow away from the capacity of the cut. What is the spare room?', answer: [spare], explanation: `${n(q.cap)} − ${n(q.value)} = ${n(spare)}.` }
  ] }; }
});

practice({ id: 'q33d', parent: 'q33', kind: 'challenge', title: 'The broken gauge',
 brief: 'One gauge in the cooling loop has failed, so its flow must be worked out from the others before the loop’s delivery and ceiling can be reported.',
 labels: ['flow on the broken line', 'value of the flow', 'capacity of the cut'], tolerance: 0.01 },
 [['flow on the broken line'], ['value of the flow'], ['capacity of the cut']], {
 /* Six points, eight lines; the flow is built from four routes. One line (flow at least 1) has a broken gauge. Every line has an inner point at one end, so its flow follows from conservation there. The cut is one of the 14 that are not {1} or {1..5}. */
 draw: R => { let p;
  do { const amt = drawAmt(R), slack = []; for (let i = 0; i < 8; i++) slack.push(R.int(0, 4)); p = { amt, slack, L: R.pick(sidesOf(6).slice(1, -1)), h: R.int(0, 7) }; } while (flowOf(NET6, p.amt)[p.h] < 1);
  return p; },
 build: ({ amt, slack, L, h }) => { const q = flowParts(NET6, amt, slack, L), f = q.f, [a, b] = NET6.arcs[h], w = a !== 1 ? a : b, ins = arcsInto(NET6, w), outs = arcsFrom(NET6, w);
  const hin = ins.includes(h), known = (hin ? ins : outs).filter(i => i !== h).reduce((s, i) => s + f[i], 0), whole = (hin ? outs : ins).reduce((s, i) => s + f[i], 0);
  const side = idx => idx.map(i => i === h ? '?' : n(f[i])).join(' + ');
  const calc = known > 0 ? `${n(whole)} − ${n(known)} = ${n(f[h])}` : n(f[h]);
  const bal = `At point ${w} the flow in equals the flow out. In: ${side(ins)}. Out: ${side(outs)}, where ? is the flow on the broken line ${aname(NET6.arcs[h])}. So ? = ${calc}.`;
  const list = NET6.arcs.map((x, i) => i === h ? null : `${aname(x)} carries ${n(f[i])} of ${n(q.caps[i])}`).filter(Boolean).join('; ');
  return {
  prompt: `The pump house’s cooling loop sends coolant from the pump, point 1, to the radiator, point 6, through one-way lines. For each line the flow now running and its capacity are given in litres per second: ${list}. The gauge on line ${aname([a, b])} has failed, so its flow is not known, but its capacity is ${n(q.caps[h])}. At every point other than 1 and 6 the flow in equals the flow out. Enter the flow on line ${aname([a, b])}, then the value of the flow, then the capacity of the cut that puts points ${and(L)} on the source side and ${and(q.U)} on the sink side.`,
  answer: [f[h], q.value, q.cap],
  hints: ['At every point other than the source and the sink the flow in equals the flow out. Find a point at one end of the broken line, add the flows you know on each side, and the broken line makes up the difference.',
   'The value of a flow is the total leaving the source, so use the flow you found if the broken line leaves point 1. For the cut, add the capacities, not the flows, of the lines that start on the source side and end on the sink side; lines pointing back are not counted.'],
  solution: `${bal} The value is what leaves point 1: ${q.srcSum} ${lit(q.value)} per second. The arcs from the source side to the sink side are ${q.fwdText}, so the cut’s capacity is ${q.fwdSum} ${lit(q.cap)} per second.${q.backText}`,
  guidance: [
   { prompt: `At point ${w} the flow in must equal the flow out. Use this to find the flow on the broken line ${aname([a, b])}.`, answer: [f[h]], explanation: bal },
   { prompt: 'What is the total flow leaving point 1, the source? That is the value of the flow.', answer: [q.value], explanation: `${carry(NET6, f, q.src)}, so ${lps(q.value)} leave the source.` },
   { prompt: `Which lines go from ${set(L)} to ${set(q.U)}? Add their capacities.`, answer: [q.cap], explanation: `The forward arcs are ${q.fwdText}: ${q.fwdSum}.${q.backText}` }
  ] }; }
});

/* ---- q34 Maximum flow equals minimum cut [KT13.2] ---- */

const capsOf = (net, c) => sidesOf(net.V).map(L => cutCap(net, L, c));
const allCuts = (net, c) => sidesOf(net.V).map((L, i) => `${set(L)} ${n(capsOf(net, c)[i])}`).join('; ');
const arcList = (net, c) => net.arcs.map((x, i) => `${aname(x)} (${n(c[i])})`).join(', ');
/* The smallest cut capacity is unique and smaller than the cuts around the source and the sink (the first and last source sides). */
const drawCaps = (R, net) => { let c, caps; const k = net.arcs.length;
 do { c = []; for (let i = 0; i < k; i++) c.push(R.int(2, 12)); caps = capsOf(net, c); } while (!(() => { const m = Math.min(...caps); return caps.filter(x => x === m).length === 1 && m < caps[0] && m < caps[caps.length - 1]; })());
 return c; };

practice({ id: 'q34b', parent: 'q34', kind: 'setting', title: 'The cooled racks',
 brief: 'The pump hall’s cooling water must reach the drain at the highest rate the lines allow, and the technician wants the figure and how many cuts pin it down.',
 labels: ['cut around the sink', 'maximum flow', 'cuts with that capacity'], tolerance: 0.01 },
 [['cut around the sink'], ['smallest cut capacity'], ['cuts with that capacity']], {
 /* Five points, eight lines, capacities 2 to 12. The smallest cut is smaller than the cuts around the source and the sink; it may be reached by more than one of the eight cuts. */
 draw: R => { let c, caps;
  do { c = []; for (let i = 0; i < 8; i++) c.push(R.int(2, 12)); caps = capsOf(NET5B, c); } while (!(Math.min(...caps) < caps[0] && Math.min(...caps) < caps[7]));
  return { c }; },
 build: ({ c }) => { const caps = capsOf(NET5B, c), sides = sidesOf(5), min = Math.min(...caps), at = sides.filter((L, i) => caps[i] === min), k = at.length, all = allCuts(NET5B, c);
  const out = NET5B.arcs.map((x, i) => x[1] === 5 ? n(c[i]) : null).filter(Boolean).join(' + ');
  const best = k === 1 ? `The smallest is ${set(at[0])} with ${n(min)}.` : `The smallest capacity is ${n(min)}, reached by ${n(k)} cuts: ${and(at.map(set))}.`;
  return {
  prompt: `The pump hall’s cooling water runs from the main pump, point 1, to the drain, point 5, along one-way lines whose capacities in litres per second are ${arcList(NET5B, c)}. Points 2, 3 and 4 can each sit on the source side or the sink side, which makes eight cuts. Enter the capacity of the cut with only point 5 on the sink side, then the maximum flow from 1 to 5 in litres per second, then how many of the eight cuts have exactly that capacity.`,
  answer: [caps[7], min, k],
  hints: ['Every flow’s value is at most every cut’s capacity, and the max-flow min-cut theorem says the largest flow equals the smallest cut capacity.',
   'Work out all eight capacities, counting only lines from the source side to the sink side and leaving out lines that point back. Then see how many of them equal the smallest.'],
  solution: `Around the sink: ${out} = ${n(caps[7])}. All eight cuts, by their source side: ${all}. ${best} By the max-flow min-cut theorem the maximum flow equals the smallest cut capacity, so it is ${lps(min)}, and ${n(k)} of the eight cuts ${k === 1 ? 'has' : 'have'} that capacity.`,
  guidance: [
   { prompt: 'Only point 5 on the sink side: which lines cross, and what is the total of their capacities?', answer: [caps[7]], explanation: `${and(NET5B.arcs.map((x, i) => x[1] === 5 ? aname(x) : null).filter(Boolean))} cross: ${out} = ${n(caps[7])}.` },
   { prompt: 'Now work out all eight cuts. What is the smallest capacity of them all?', answer: [min], explanation: `By source side: ${all}. ${best} No flow can beat ${n(min)}, and the theorem says ${n(min)} can be reached.` },
   { prompt: `How many of the eight cuts have a capacity of exactly ${n(min)}?`, answer: [k], explanation: `${n(k)} of them: ${and(at.map(set))}.` }
  ] }; }
});

practice({ id: 'q34c', parent: 'q34', kind: 'applied', title: 'Widening one pipe',
 brief: 'The engineers can widen one pipe at the pumping station, and they want to know how much more water that really lets through.',
 labels: ['maximum flow now', 'maximum flow after widening', 'gain'], tolerance: 0.01 },
 [['maximum flow now'], ['maximum flow after widening'], ['gain']], {
 /* The five-junction network with seven pipes, capacities 2 to 12, one smallest cut. The pipe widened is one that crosses forwards in that smallest cut, by 1 to 6 litres per second. Never the worked example (four junctions). */
 draw: R => { const c = drawCaps(R, NET5), caps = capsOf(NET5, c), L = sidesOf(5)[caps.indexOf(Math.min(...caps))], fw = crossArcs(NET5, L).filter(x => x.fwd), e = R.pick(fw);
  return { c, e: e.i, w: R.int(1, 6) }; },
 build: ({ c, e, w }) => { const c2 = c.map((x, i) => i === e ? x + w : x), caps = capsOf(NET5, c), caps2 = capsOf(NET5, c2), min = Math.min(...caps), min2 = Math.min(...caps2), gain = min2 - min, nm = aname(NET5.arcs[e]);
  const sides = sidesOf(5), at = sides[caps.indexOf(min)], at2 = sides.filter((L, i) => caps2[i] === min2);
  return {
  prompt: `The pumping station sends water from the source, junction 1, to the sink, junction 5. The one-way pipes and their capacities in litres per second are ${arcList(NET5, c)}. Junctions 2, 3 and 4 can each sit on the source side or the sink side, which makes eight cuts. The engineers can widen pipe ${nm} so that its capacity rises by ${lps(w)}. Enter the maximum flow from 1 to 5 now, then the maximum flow after the widening, then how many litres per second the widening gains.`,
  answer: [min, min2, gain],
  hints: ['The maximum flow equals the smallest cut capacity. Work out all eight capacities, counting only pipes from the source side to the sink side.',
   'Widening a pipe adds to the capacity of every cut where that pipe goes from the source side to the sink side, and to no other cut. Work out the eight capacities again and take the smallest.',
   'The gain is the new maximum flow take away the old one. It can be less than the widening, because another cut may now be the smallest.'],
  solution: `Now, by source side: ${allCuts(NET5, c)}. The smallest is ${set(at)} with ${n(min)}, so the maximum flow is ${n(min)}. With ${nm} at ${n(c2[e])}, the eight cuts are ${allCuts(NET5, c2)}. The smallest is ${n(min2)}${at2.length > 1 ? `, reached by ${and(at2.map(set))}` : `, from ${set(at2[0])}`}, so the maximum flow is now ${n(min2)}. The widening gains ${n(min2)} − ${n(min)} = ${lps(gain)}.`,
  guidance: [
   { prompt: 'Work out all eight cuts, counting only pipes from the source side to the sink side. What is the smallest capacity, that is, the maximum flow now?', answer: [min], explanation: `By source side: ${allCuts(NET5, c)}. The smallest is ${set(at)}, ${n(min)}.` },
   { prompt: `Pipe ${nm} now has capacity ${n(c2[e])}. Work out the eight cuts again. What is the smallest capacity now?`, answer: [min2], explanation: `By source side: ${allCuts(NET5, c2)}. The smallest is ${n(min2)}.` },
   { prompt: 'How many litres per second does the maximum flow rise by?', answer: [gain], explanation: `${n(min2)} − ${n(min)} = ${n(gain)}.` }
  ] }; }
});

practice({ id: 'q34d', parent: 'q34', kind: 'challenge', title: 'The six-point bottleneck',
 brief: 'The oldest part of the cooling system has six points and nine lines, and the technician wants its true limit before the loop is run at full speed.',
 labels: ['cut around the source', 'cut around the sink', 'maximum flow'], tolerance: 0.01 },
 [['cut around the source'], ['cut around the sink'], ['smallest cut capacity']], {
 /* Six points, nine lines, capacities 2 to 12, sixteen cuts. The smallest is unique and smaller than the cut around the source and the cut around the sink. */
 draw: R => ({ c: drawCaps(R, NET6X) }),
 build: ({ c }) => { const caps = capsOf(NET6X, c), sides = sidesOf(6), last = caps.length - 1, min = Math.min(...caps), at = sides[caps.indexOf(min)], all = allCuts(NET6X, c);
  const outS = arcsFrom(NET6X, 1).map(i => n(c[i])).join(' + '), inK = arcsInto(NET6X, 6).map(i => n(c[i])).join(' + ');
  return {
  prompt: `The oldest cooling lines send water from the source, point 1, to the sink, point 6. The one-way lines and their capacities in litres per second are ${arcList(NET6X, c)}. Points 2, 3, 4 and 5 can each sit on the source side or the sink side, which makes sixteen cuts. Enter the capacity of the cut with only point 1 on the source side, then the capacity of the cut with only point 6 on the sink side, then the maximum flow from 1 to 6 in litres per second.`,
  answer: [caps[0], caps[last], min],
  hints: ['Every flow’s value is at most every cut’s capacity, and the max-flow min-cut theorem says the largest flow equals the smallest cut capacity.',
   'Work through all sixteen cuts one at a time, counting only lines from the source side to the sink side. Keep a note of the smallest capacity so far.'],
  solution: `Around the source: ${outS} = ${n(caps[0])}. Around the sink: ${inK} = ${n(caps[last])}. All sixteen cuts, by their source side: ${all}. The smallest is ${set(at)} with ${n(min)}. By the max-flow min-cut theorem the maximum flow equals the smallest cut capacity, so it is ${lps(min)}.`,
  guidance: [
   { prompt: 'Only point 1 on the source side: which lines cross, and what is the total of their capacities?', answer: [caps[0]], explanation: `${and(arcsFrom(NET6X, 1).map(i => aname(NET6X.arcs[i])))} cross: ${outS} = ${n(caps[0])}.` },
   { prompt: 'Only point 6 on the sink side: which lines cross, and what is the total of their capacities?', answer: [caps[last]], explanation: `${and(arcsInto(NET6X, 6).map(i => aname(NET6X.arcs[i])))} cross: ${inK} = ${n(caps[last])}.` },
   { prompt: 'Now work out the other fourteen cuts as well. What is the smallest capacity of all sixteen?', answer: [min], explanation: `By source side: ${all}. The smallest is ${set(at)}, ${n(min)}, so no flow can beat ${n(min)}, and the theorem says ${n(min)} can be reached.` }
  ] }; }
});

/* ---- q35 Labelled trees: Cayley's formula [KT5.6] ---- */

practice({ id: 'q35b', parent: 'q35', kind: 'setting', title: 'Testing the relay masts',
 brief: 'The archive’s roof carries numbered relay masts, and the survey team wants to test every possible tree of cables between them.',
 labels: ['cables in each plan', 'labelled trees', 'plans still to test'], tolerance: 0.01 },
 [['cables in each plan'], ['labelled trees'], ['plans still to test']], {
 /* n from 5 to 7 (4 is the worked example; 8⁶ would pass 100000). t plans already tested, from 2 to n^(n−2) − 1. */
 draw: R => { const k = R.pick([5, 6, 6, 7, 7]), total = Math.pow(k, k - 2); return { n: k, t: R.int(2, total - 1) }; },
 build: ({ n: k, t }) => { const e = k - 2, total = Math.pow(k, e), left = total - t, times = Array(e).fill(n(k)).join(' × ');
  return {
  prompt: `The archive’s roof carries ${n(k)} numbered relay masts, and the survey team will test every possible way of linking them with cables as a tree: every mast reachable from every other, and no loop of cables. Two plans count as different when some pair of masts is joined in one plan and not in the other. ${n(t)} different plans have been tested already. Enter the number of cables in each plan, then the number of labelled trees on ${n(k)} vertices, then the number of plans still to test. Type numbers without commas.`,
  answer: [k - 1, total, left],
  hints: ['A tree on n vertices always has n − 1 edges.',
   'Cayley’s formula: the number of labelled trees on n vertices is n to the power n − 2, that is, n multiplied by itself n − 2 times.',
   'The plans still to test are the labelled trees that have not been tested yet: take the ones tested away from the total.'],
  solution: `Each plan is a tree on ${n(k)} masts, so it has ${n(k)} − 1 = ${n(k - 1)} cables. With n = ${n(k)}, n − 2 = ${n(e)}, so Cayley’s formula gives ${n(k)}${sup(e)} = ${times} = ${n(total)} labelled trees. ${n(total)} − ${n(t)} = ${n(left)} plan${left === 1 ? ' is' : 's are'} still to test.`,
  guidance: [
   { prompt: `A plan is a tree on ${n(k)} masts. How many cables does each plan use?`, answer: [k - 1], explanation: `A tree on ${n(k)} vertices has ${n(k)} − 1 = ${n(k - 1)} edges.` },
   { prompt: `For ${n(k)} vertices the power n − 2 in Cayley’s formula is ${n(e)}. Multiply ${n(k)} by itself ${n(e)} times. How many labelled trees are there on ${n(k)} vertices?`, answer: [total], explanation: `${n(k)}${sup(e)} = ${times} = ${n(total)}.` },
   { prompt: `${n(t)} plans are tested already. How many are still to test?`, answer: [left], explanation: `${n(total)} − ${n(t)} = ${n(left)}.` }
  ] }; }
});

practice({ id: 'q35c', parent: 'q35', kind: 'applied', title: 'Filling the plan drawers',
 brief: 'The archive keeps one printed copy of every cable plan, and the clerk needs to know how many drawers of a set size they will fill.',
 labels: ['labelled trees', 'full drawers', 'copies left over'], tolerance: 0.01 },
 [['labelled trees'], ['full drawers'], ['copies left over']], {
 /* n from 5 to 7 (4 is the worked example). Each drawer holds d plans, from 7 to 60, with at least two full drawers and some plans left over. */
 draw: R => { let p;
  do { const k = R.pick([5, 6, 6, 7, 7]), total = Math.pow(k, k - 2), d = R.int(7, 60); p = { n: k, d }; } while (Math.pow(p.n, p.n - 2) % p.d === 0 || Math.floor(Math.pow(p.n, p.n - 2) / p.d) < 2);
  return p; },
 build: ({ n: k, d }) => { const e = k - 2, total = Math.pow(k, e), full = Math.floor(total / d), left = total - full * d, times = Array(e).fill(n(k)).join(' × ');
  return {
  prompt: `The archive keeps one printed copy of every possible cable plan that links ${n(k)} numbered domes as a tree: every dome reachable from every other, and no loop of cables. Two plans count as different when some pair of domes is joined in one plan and not in the other. A drawer holds exactly ${n(d)} copies. Enter the number of labelled trees on ${n(k)} vertices, then the number of drawers that will be completely full, then the number of copies left over for the last drawer. Type numbers without commas.`,
  answer: [total, full, left],
  hints: ['Cayley’s formula: the number of labelled trees on n vertices is n to the power n − 2, that is, n multiplied by itself n − 2 times.',
   'The full drawers are the whole number of times the drawer size fits into the total. Multiply the drawer size by that whole number and see how much is left of the total.'],
  solution: `With n = ${n(k)}, n − 2 = ${n(e)}, so Cayley’s formula gives ${n(k)}${sup(e)} = ${times} = ${n(total)} labelled trees. ${n(d)} × ${n(full)} = ${n(d * full)} fits in ${n(total)}, but ${n(d)} × ${n(full + 1)} = ${n(d * (full + 1))} does not, so ${n(full)} drawers are full. ${n(total)} − ${n(d * full)} = ${n(left)} ${left === 1 ? "copy is" : "copies are"} left over.`,
  guidance: [
   { prompt: `For ${n(k)} vertices the power n − 2 in Cayley’s formula is ${n(e)}. Multiply ${n(k)} by itself ${n(e)} times. How many labelled trees are there on ${n(k)} vertices?`, answer: [total], explanation: `${n(k)}${sup(e)} = ${times} = ${n(total)}.` },
   { prompt: `A drawer holds ${n(d)} copies. How many whole drawers can be filled from ${n(total)} copies?`, answer: [full], explanation: `${n(d)} × ${n(full)} = ${n(d * full)} fits in ${n(total)}, but ${n(d)} × ${n(full + 1)} = ${n(d * (full + 1))} does not, so ${n(full)} drawers are full.` },
   { prompt: `How many copies are left over once ${n(full)} drawers of ${n(d)} are full?`, answer: [left], explanation: `${n(total)} − ${n(d * full)} = ${n(left)}.` }
  ] }; }
});

practice({ id: 'q35d', parent: 'q35', kind: 'challenge', uses: 'q14', title: 'The fully linked domes',
 brief: 'Every pair of domes in the archive already has a cable between them, and the clerk wants to know how many cable plans could be cut from that tangle.',
 labels: ['cables left out of each plan', 'spanning trees', 'plans that are not stars', 'not-star plans still unfiled'], tolerance: 0.01 },
 [['cables left out of each plan'], ['spanning trees'], ['plans that are not stars'], ['not-star plans still unfiled']], {
 /* n from 5 to 7 (4 is the worked example). s of the plans that are not stars are filed already, from 1 to that number minus 1. */
 draw: R => { const k = R.pick([5, 6, 6, 7, 7]), ns = Math.pow(k, k - 2) - k; return { n: k, s: R.int(1, ns - 1) }; },
 build: ({ n: k, s }) => { const e = k - 2, E = k * (k - 1) / 2, total = Math.pow(k, e), out = E - (k - 1), non = total - k, left = non - s, times = Array(e).fill(n(k)).join(' × ');
  return {
  prompt: `The archive’s ${n(k)} domes are numbered 1 to ${n(k)}, and a cable has been laid between every pair of them: ${n(E)} cables in all. A cable plan keeps ${n(k - 1)} of these cables so that every dome can still be reached from every other and there is no loop (a spanning tree). Two plans count as different when some pair of domes is joined in one plan and not in the other. A star plan is one in which a single dome is joined directly to all the others. Enter the number of cables left out of each plan, then the number of different plans, then the number of plans that are not stars. Then enter how many plans that are not stars are still unfiled when ${n(s)} of them are filed already. Type numbers without commas.`,
  answer: [out, total, non, left],
  hints: ['Leaving out cables to keep a spanning tree: the cables left out are the cables laid minus the n − 1 a tree keeps. Because every pair of domes has a cable, every tree on the numbered domes is a possible plan, so Cayley’s formula counts them: n to the power n − 2.',
   'A star plan is decided by which dome is its centre, and different centres give different stars, so there is one star for each dome. Take the stars away from all the plans.',
   'To count the unfiled plans that are not stars, take the not-star plans already filed away from all the not-star plans.'],
  solution: `A plan keeps ${n(k)} − 1 = ${n(k - 1)} cables, so ${n(E)} − ${n(k - 1)} = ${n(out)} cables are left out. Every pair of domes has a cable, so every labelled tree on the ${n(k)} domes is a possible plan: ${n(k)}${sup(e)} = ${times} = ${n(total)} plans. A star is decided by its centre, one for each of the ${n(k)} domes, so ${n(total)} − ${n(k)} = ${n(non)} plans are not stars. ${n(non)} − ${n(s)} = ${n(left)} of them are still unfiled.`,
  guidance: [
   { prompt: `Each plan keeps ${n(k - 1)} of the ${n(E)} cables. How many cables does it leave out?`, answer: [out], explanation: `${n(E)} − ${n(k - 1)} = ${n(out)}.` },
   { prompt: `Every tree on the ${n(k)} numbered domes is a possible plan. Cayley’s formula uses the power n − 2, which is ${n(e)} here. How many plans are there?`, answer: [total], explanation: `${n(k)}${sup(e)} = ${times} = ${n(total)}.` },
   { prompt: `There is one star plan for each choice of the dome in the middle. How many plans are not stars?`, answer: [non], explanation: `${n(total)} − ${n(k)} = ${n(non)}.` },
   { prompt: `${n(s)} of the plans that are not stars are filed already. How many of them are still unfiled?`, answer: [left], explanation: `${n(non)} − ${n(s)} = ${n(left)}.` }
  ] }; }
});

})();
