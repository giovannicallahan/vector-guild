/* Probability practice missions, file 2 of 8: concepts q06–q10, three practice missions each
   (q06b q06c q06d q07b q07c q07d q08b q08c q08d q09b q09c q09d q10b q10c q10d).
   Format and rules: docs/PACK-FORMAT.md, "Practice missions" (§10).
     b  kind 'setting'    the same skill in a new real-world setting
     c  kind 'applied'    a word problem with two or three steps (two or three guided steps)
     d  kind 'challenge'  harder numbers, or the skill combined with one earlier concept (optional `uses: 'qNN'`)
   A practice mission supplies only: id, parent, kind, title, brief, prompt, answer, labels, tolerance, hints,
   solution, guidance (and `uses` for a challenge). Everything else comes from its parent, the learn mission:
   topic, tier, xp, sector, lesson, teaching, sources, the concept bench and the review drill. Do not write those.
   Each mission is registered together with its generator by add(mission, generator); build(canonical) must
   reproduce the authored prompt, hints, solution and guidance exactly. Oracles: qa/realms/prob/oracle-p2.js. */
(function(){
'use strict';
const G = window.Gen, { n, plus, par } = G;
const PRACTICE = window.PRACTICE = window.PRACTICE || [];
const GEN = window.MISSION_GEN = window.MISSION_GEN || {};
/* Registers one practice mission and its generator {canonical, draw(R), build(p)}. */
const add = (mission, generator) => { PRACTICE.push(mission); GEN[mission.id] = generator; };
/* The authored text of each mission is build(canonical), so the two cannot drift apart. meta = id, parent, kind, title, brief, labels, tolerance (and uses). */
const P = (meta, gen) => { const b = gen.build(gen.canonical); add({ ...meta, prompt: b.prompt, answer: b.answer, hints: b.hints, solution: b.solution, guidance: b.guidance }, gen); };
const gcd = (a, b) => b ? gcd(b, a % b) : Math.abs(a);
/* Decimals are kept as whole hundredths (h) or ten-thousandths (q4) and divided only for display; f is a fraction. */
const h = x => x / 100, q4 = x => x / 10000, f = (a, b) => `${n(a)}/${n(b)}`;

/* ---- q06 The addition rule [IS 3.3, CM 7.8] ---- */

/* b: crosswind, low cloud and both, in hundredths; then the complement. The "or" probability stays at most 0.9. */
P({ id: 'q06b', parent: 'q06', kind: 'setting', title: 'The launch window', labels: ['P(crosswind or cloud)', 'P(window open)'], tolerance: 0.005,
 brief: 'The dispatch hut can launch a supply shuttle only in a clear window, and the board needs the chance that a window stays open.' }, {
 canonical: { A: 30, B: 25, AB: 10 },
 draw: R => { let p; do { p = { A: R.int(20, 55), B: R.int(15, 45) }; p.AB = R.int(3, Math.min(p.A, p.B) - 3); } while (p.A + p.B - p.AB > 90 || p.A === p.B || (p.A === 40 && p.B === 30) || (p.A === 35 && p.B === 20)); return p; },
 build: ({ A, B, AB }) => { const s = A + B, o = s - AB, open = 100 - o; return {
  prompt: `The launch board in the dispatch hut shows that a launch window is closed by crosswind with probability ${n(h(A))}, by low cloud with probability ${n(h(B))}, and by both at once with probability ${n(h(AB))}. Enter P(crosswind or cloud), the probability that the window is closed by at least one of the two, then P(window open), the probability that neither closes it. Both are decimals.`,
  answer: [h(o), h(open)],
  hints: ['Add the two probabilities, then take the overlap off once: the windows closed by both are counted in each of the two.', 'The window is open exactly when it is not closed by at least one of the two. Take P(closed by at least one) away from 1.'],
  solution: `P(crosswind or cloud) = ${n(h(A))} + ${n(h(B))} − ${n(h(AB))} = ${n(h(s))} − ${n(h(AB))} = ${n(h(o))}. The window is open when neither closes it, which is the complement of “closed by at least one”: P(open) = 1 − ${n(h(o))} = ${n(h(open))}.`,
  guidance: [
   { prompt: `Add the two probabilities. What is ${n(h(A))} + ${n(h(B))}?`, answer: [h(s)], labels: ['P(crosswind) + P(cloud)'], explanation: `${n(h(A))} + ${n(h(B))} = ${n(h(s))}. The windows closed by both are counted twice in this.` },
   { prompt: `Take the overlap off once. What is ${n(h(s))} − ${n(h(AB))}?`, answer: [h(o)], labels: ['P(crosswind or cloud)'], explanation: `${n(h(s))} − ${n(h(AB))} = ${n(h(o))}, the chance that at least one of the two closes the window.` },
   { prompt: `The window is open when it is not closed by either. What is 1 − ${n(h(o))}?`, answer: [h(open)], labels: ['P(window open)'], explanation: `1 − ${n(h(o))} = ${n(h(open))}. An event and its complement together make up every outcome, so their probabilities add to 1.` }
  ] }; }
});

/* c: counts from a season log, the addition rule on counts, the share, and a forecast. The share has at most two decimals and the forecast is a whole number. */
P({ id: 'q06c', parent: 'q06', kind: 'applied', title: 'Trouble on the season log', labels: ['P(late or damaged)', 'expected runs'], tolerance: 0.005,
 brief: 'The season log counts late runs and damaged runs separately, and Mira wants one forecast of how many future runs will have trouble.' }, {
 canonical: { N: 50, x: 18, y: 14, z: 6, M: 300 },
 draw: R => { let p; do { const N = R.pick([20, 25, 50, 100]); p = { N, x: R.int(Math.round(0.2 * N), Math.round(0.5 * N)), y: R.int(Math.round(0.2 * N), Math.round(0.5 * N)), M: R.pick([200, 300, 400, 500, 600, 800, 1000]) }; p.z = R.int(2, Math.max(2, Math.min(p.x, p.y) - 2)); } while (p.z > Math.min(p.x, p.y) - 2 || p.x + p.y - p.z > 0.8 * p.N || p.x + p.y - p.z < 0.25 * p.N || (p.N === 50 && p.x === 18 && p.y === 14)); return p; },
 build: ({ N, x, y, z, M }) => { const c = x + y - z, pr = c / N, e = M * c / N; return {
  prompt: `Mira’s dispatch log for the season lists ${n(N)} supply runs. ${n(x)} of them arrived late, ${n(y)} arrived with damaged cargo, and ${n(z)} were both late and damaged. A run is picked from the log at random. Enter P(late or damaged) as a decimal, then the number of the next ${n(M)} runs you expect to be late or damaged if the log is a fair guide.`,
  answer: [pr, e],
  hints: ['Count the runs that are late or damaged. Adding the late runs and the damaged runs counts the ones that are both twice.', 'Divide that count by the number of runs in the log to get the probability. Then multiply the probability by the number of runs still to come.'],
  solution: `The runs that are late or damaged number ${n(x)} + ${n(y)} − ${n(z)} = ${n(c)}, because the ${n(z)} that are both were counted twice. So P(late or damaged) = ${n(c)} ÷ ${n(N)} = ${n(pr)}. If the log is a fair guide, the next ${n(M)} runs should have about ${n(M)} × ${n(pr)} = ${n(e)} late or damaged runs.`,
  guidance: [
   { prompt: `How many runs in the log are late or damaged? Add ${n(x)} and ${n(y)}, then take off the ${n(z)} that were counted twice.`, answer: [c], labels: ['late or damaged runs'], explanation: `${n(x)} + ${n(y)} − ${n(z)} = ${n(c)} runs.` },
   { prompt: `Divide by the number of runs in the log. What is ${n(c)} ÷ ${n(N)}?`, answer: [pr], labels: ['P(late or damaged)'], explanation: `${n(c)} ÷ ${n(N)} = ${n(pr)}, so ${n(100 * pr)} runs in every 100 had trouble.` },
   { prompt: `Use ${n(pr)} as the chance for each of the next ${n(M)} runs. What is ${n(M)} × ${n(pr)}?`, answer: [e], labels: ['expected runs'], explanation: `${n(M)} × ${n(pr)} = ${n(e)}. The real count will land close to this, not exactly on it.` }
  ] }; }
});

/* d: works backwards with the addition rule and the complement: P(neither) is given, P(fault) is wanted. */
P({ id: 'q06d', parent: 'q06', kind: 'challenge', uses: 'q03', title: 'The missing fault figure', labels: ['P(dust or fault)', 'P(fault)'], tolerance: 0.005,
 brief: 'The odds board has lost its engine-fault figure, but it still shows the chance of a clean run, and Mira wants the missing number rebuilt.' }, {
 canonical: { A: 30, B: 24, AB: 7 },
 draw: R => { let p; do { p = { A: R.int(20, 50), B: R.int(12, 45) }; p.AB = R.int(3, Math.min(p.A, p.B) - 3); } while (p.A + p.B - p.AB > 90 || p.A === p.B || (p.A === 30 && p.B === 24)); return p; },
 build: ({ A, B, AB }) => { const o = A + B - AB, no = 100 - o, d = o - A; return {
  prompt: `The odds board has lost one figure. It shows that a supply run goes through with no hold-up at all with probability ${n(h(no))}, that dust holds a run up with probability ${n(h(A))}, and that dust and an engine fault together hold one up with probability ${n(h(AB))}. Enter P(dust or fault), then P(fault), both as decimals.`,
  answer: [h(o), h(B)],
  hints: ['“No hold-up at all” is the complement of “held up by dust or a fault”, so the two probabilities add to 1.', 'Write the addition rule with the unknown in it: P(dust or fault) = P(dust) + P(fault) − P(dust and fault). You know every figure in it except P(fault), so work that one out.'],
  solution: `P(dust or fault) = 1 − ${n(h(no))} = ${n(h(o))}. The addition rule says ${n(h(o))} = ${n(h(A))} + P(fault) − ${n(h(AB))}. So P(fault) = ${n(h(o))} − ${n(h(A))} + ${n(h(AB))} = ${n(h(B))}.`,
  guidance: [
   { prompt: `Use the complement. What is 1 − ${n(h(no))}?`, answer: [h(o)], labels: ['P(dust or fault)'], explanation: `1 − ${n(h(no))} = ${n(h(o))}. A run is either held up by at least one cause or not held up at all.` },
   { prompt: `Start from P(fault) = P(dust or fault) − P(dust) + P(dust and fault). First, what is ${n(h(o))} − ${n(h(A))}?`, answer: [h(d)], labels: ['P(dust or fault) − P(dust)'], explanation: `${n(h(o))} − ${n(h(A))} = ${n(h(d))}. This is the part of the “or” that dust does not cover.` },
   { prompt: `Now add back the overlap. What is ${n(h(d))} + ${n(h(AB))}?`, answer: [h(B)], labels: ['P(fault)'], explanation: `${n(h(d))} + ${n(h(AB))} = ${n(h(B))}. The overlap was taken off once in the rule, so it goes back on.` }
  ] }; }
});

/* ---- q07 Conditional probability from a two-way table [IS 3.4] ---- */

/* b: the condition is a column (a loose strap), not a row. The fraction reduces and differs from the overall share of the South lane. */
P({ id: 'q07b', parent: 'q07', kind: 'setting', title: 'Loose straps by lane', labels: ['numerator', 'denominator'], tolerance: 0.01,
 brief: 'Parcels with loose straps have turned up in the shed, and Mira wants to know which delivery lane to suspect.' }, {
 canonical: { ns: 31, nl: 12, ss: 22, sl: 8 },
 draw: R => { let p; do { p = { ns: R.int(15, 50), nl: R.int(3, 20), ss: R.int(10, 45), sl: R.int(3, 20) }; } while (gcd(p.sl, p.nl + p.sl) < 2 || p.sl * (p.ns + p.nl + p.ss + p.sl) === (p.ss + p.sl) * (p.nl + p.sl)); return p; },
 build: ({ ns, nl, ss, sl }) => { const lo = nl + sl, d = gcd(sl, lo), all = ns + nl + ss + sl, so = ss + sl; return {
  prompt: `The sorting shed’s tally counts today’s parcels by delivery lane and by how the strap holds. North lane: ${n(ns)} tight, ${n(nl)} loose. South lane: ${n(ss)} tight, ${n(sl)} loose. A parcel is picked at random from all of them, and you are told that its strap is loose. Enter P(South lane | loose), the probability that it came from the South lane given that its strap is loose, as a fraction in lowest terms: numerator, then denominator.`,
  answer: [sl / d, lo / d],
  hints: ['“Given loose” means you look only at the loose column of the tally. The tight parcels are no longer possible outcomes.', 'Divide the loose parcels in the South lane by the total of the loose column, then reduce the fraction.'],
  solution: `Given that the strap is loose, the sample space shrinks to the loose column: ${n(nl)} + ${n(sl)} = ${n(lo)} parcels. ${n(sl)} of them are in the South lane, so P(South | loose) = ${f(sl, lo)} = ${f(sl / d, lo / d)}. The South lane carries ${n(so)} of the ${n(all)} parcels overall, a different share: knowing the strap is loose changes the chance.`,
  guidance: [
   { prompt: 'Keep only the loose column. How many parcels have a loose strap, in both lanes together?', answer: [lo], labels: ['loose parcels'], explanation: `${n(nl)} + ${n(sl)} = ${n(lo)} parcels. These are the only outcomes left once you know the strap is loose.` },
   { prompt: `${n(sl)} of those ${n(lo)} parcels are in the South lane. Write ${f(sl, lo)} in lowest terms.`, answer: [sl / d, lo / d], labels: ['numerator', 'denominator'], explanation: `${n(sl)} and ${n(lo)} both divide by ${n(d)}, so P(South | loose) = ${f(sl / d, lo / d)}.` }
  ] }; }
});

/* c: a three-supplier ledger; only the Vesta row matters. The row total is 20, 25 or 50 and M is a multiple of 100, so the share has at most two decimals and the forecast is a whole number. */
P({ id: 'q07c', parent: 'q07', kind: 'applied', title: 'The next Vesta delivery', labels: ['P(cracked | Vesta)', 'expected cracked crates'], tolerance: 0.005,
 brief: 'Vesta Yard has a delivery on the way, and Mira wants to know how many cracked crates the shed should expect from it.' }, {
 canonical: { ri: 40, rc: 10, ti: 33, tc: 12, T: 50, vc: 14, M: 400 },
 draw: R => { let p; do { const T = R.pick([20, 25, 50]); p = { ri: R.int(20, 60), rc: R.int(3, 15), ti: R.int(20, 50), tc: R.int(3, 15), T, vc: R.int(3, T - 5), M: R.pick([200, 300, 400, 500, 600, 800, 1000]) }; } while (p.T === 50 && p.vc === 14 && p.M === 400); return p; },
 build: ({ ri, rc, ti, tc, T, vc, M }) => { const vi = T - vc, pr = vc / T, e = M * vc / T; return {
  prompt: `The shed ledger for the month counts crates by supplier and condition. Rhea Depot: ${n(ri)} intact, ${n(rc)} cracked. Tycho Works: ${n(ti)} intact, ${n(tc)} cracked. Vesta Yard: ${n(vi)} intact, ${n(vc)} cracked. Vesta Yard is about to deliver ${n(M)} more crates. Take the chance that a crate is cracked, given that it came from Vesta, as the chance for each new crate. Enter P(cracked | Vesta) as a decimal, then the number of the ${n(M)} new crates you expect to be cracked.`,
  answer: [pr, e],
  hints: ['“Given Vesta” means you look only at the Vesta Yard row of the ledger. The other two suppliers are not part of this question.', 'Divide the cracked crates in that row by the row’s total. Then multiply that chance by the number of new crates.'],
  solution: `Given Vesta Yard, the sample space is its row: ${n(vi)} + ${n(vc)} = ${n(T)} crates. ${n(vc)} of them are cracked, so P(cracked | Vesta) = ${n(vc)} ÷ ${n(T)} = ${n(pr)}. Of ${n(M)} new crates, you expect ${n(M)} × ${n(pr)} = ${n(e)} to be cracked.`,
  guidance: [
   { prompt: 'Keep only the Vesta Yard row. How many crates did Vesta Yard send this month?', answer: [T], labels: ['Vesta crates'], explanation: `${n(vi)} + ${n(vc)} = ${n(T)} crates.` },
   { prompt: `${n(vc)} of those ${n(T)} crates are cracked. What is ${n(vc)} ÷ ${n(T)}?`, answer: [pr], labels: ['P(cracked | Vesta)'], explanation: `${n(vc)} ÷ ${n(T)} = ${n(pr)}, so ${n(100 * pr)} Vesta crates in every 100 are cracked.` },
   { prompt: `Use ${n(pr)} for each new crate. What is ${n(M)} × ${n(pr)}?`, answer: [e], labels: ['expected cracked crates'], explanation: `${n(M)} × ${n(pr)} = ${n(e)}. The real count will land close to this, not exactly on it.` }
  ] }; }
});

/* d: three suppliers; the condition is the cracked column and the event is "Tycho or Vesta", two events that cannot both happen (mutually exclusive), so their cells add. */
P({ id: 'q07d', parent: 'q07', kind: 'challenge', uses: 'q06', title: 'Cracked, and not from Rhea', labels: ['numerator', 'denominator'], tolerance: 0.01,
 brief: 'A cracked crate has turned up unlabelled, and Mira wants the chance that it came from one of the two suppliers she is chasing.' }, {
 canonical: { ri: 38, rc: 9, ti: 41, tc: 14, vi: 29, vc: 7 },
 draw: R => { let p; do { p = { ri: R.int(20, 50), rc: R.int(5, 16), ti: R.int(20, 50), tc: R.int(5, 16), vi: R.int(20, 50), vc: R.int(5, 16) }; } while (gcd(p.tc + p.vc, p.rc + p.tc + p.vc) < 2 || (p.rc === 9 && p.tc === 14 && p.vc === 7)); return p; },
 build: ({ ri, rc, ti, tc, vi, vc }) => { const cr = rc + tc + vc, tv = tc + vc, d = gcd(tv, cr); return {
  prompt: `The shed ledger counts crates by supplier and condition. Rhea Depot: ${n(ri)} intact, ${n(rc)} cracked. Tycho Works: ${n(ti)} intact, ${n(tc)} cracked. Vesta Yard: ${n(vi)} intact, ${n(vc)} cracked. A crate is picked at random from the whole shed, and you are told that it is cracked. A crate has only one supplier, so “from Tycho” and “from Vesta” cannot both be true of it. Enter P(Tycho or Vesta | cracked) as a fraction in lowest terms: numerator, then denominator.`,
  answer: [tv / d, cr / d],
  hints: ['“Given cracked” means you look only at the cracked column. All three suppliers have a cell in it.', 'Tycho and Vesta cannot both be the supplier, so “Tycho or Vesta” has no overlap: add their two cracked cells, then divide by the total of the column and reduce.'],
  solution: `Given that the crate is cracked, the sample space is the cracked column: ${n(rc)} + ${n(tc)} + ${n(vc)} = ${n(cr)} crates. Tycho and Vesta have no crate in common, so the crates from Tycho or Vesta number ${n(tc)} + ${n(vc)} = ${n(tv)}. So P(Tycho or Vesta | cracked) = ${f(tv, cr)} = ${f(tv / d, cr / d)}.`,
  guidance: [
   { prompt: 'Keep only the cracked column. How many cracked crates are there, from all three suppliers?', answer: [cr], labels: ['cracked crates'], explanation: `${n(rc)} + ${n(tc)} + ${n(vc)} = ${n(cr)} crates.` },
   { prompt: 'How many of the cracked crates came from Tycho or from Vesta? There is no overlap to take off.', answer: [tv], labels: ['cracked from Tycho or Vesta'], explanation: `${n(tc)} + ${n(vc)} = ${n(tv)}. No crate is from both suppliers, so the two cells simply add.` },
   { prompt: `Write ${f(tv, cr)} in lowest terms.`, answer: [tv / d, cr / d], labels: ['numerator', 'denominator'], explanation: `${n(tv)} and ${n(cr)} both divide by ${n(d)}, so the answer is ${f(tv / d, cr / d)}.` }
  ] }; }
});

/* ---- q08 The multiplication rule: drawing without replacement [IS 3.3, CM 7.9] ---- */

/* b: first tag red, second not red. The top f(N − f) and bottom N(N − 1) always share a factor of at least 2 here. */
P({ id: 'q08b', parent: 'q08', kind: 'setting', title: 'Tags from the drawer', labels: ['numerator', 'denominator'], tolerance: 0.01,
 brief: 'The packers draw handling tags from a drawer, and Mira wants the chance of a red tag followed by a plain one.' }, {
 canonical: { N: 11, f: 4 },
 draw: R => { let p; do { p = { N: R.int(7, 16) }; p.f = R.int(2, p.N - 3); } while (gcd(p.f * (p.N - p.f), p.N * (p.N - 1)) < 2); return p; },
 build: ({ N, f: r }) => { const top = r * (N - r), bot = N * (N - 1), d = gcd(top, bot); return {
  prompt: `A drawer in the sorting shed holds ${n(N)} handling tags, and ${n(r)} of them are red for “fragile”. A packer takes one tag at random and keeps it, then takes a second at random from the tags left in the drawer. Enter P(the first tag is red and the second tag is not red) as a fraction in lowest terms: numerator, then denominator.`,
  answer: [top / d, bot / d],
  hints: [`The first tag is red with probability ${f(r, N)}.`, 'If the first tag was red, the drawer now holds one tag fewer. Work out the chance that the second tag is not red from the tags left, multiply the two chances, then reduce.'],
  solution: `P(first red) = ${f(r, N)}. The red tag is kept, so the drawer holds ${n(N - 1)} tags, still ${n(N - r)} of them not red: P(second not red | first red) = ${f(N - r, N - 1)}. By the multiplication rule, P(red then not red) = ${f(r, N)} × ${f(N - r, N - 1)} = ${f(top, bot)} = ${f(top / d, bot / d)}.`,
  guidance: [
   { prompt: 'For the first pick: how many tags are red, and how many tags are in the drawer?', answer: [r, N], labels: ['red tags', 'tags'], explanation: `${n(r)} of ${n(N)} tags are red, so P(first red) = ${f(r, N)}.` },
   { prompt: 'Now suppose a red tag has been taken and kept. How many tags that are not red are left, and how many tags in all?', answer: [N - r, N - 1], labels: ['tags not red', 'tags left'], explanation: `No tag that is not red has gone: ${n(N - r)} of the ${n(N - 1)} tags left, so P(second not red | first red) = ${f(N - r, N - 1)}.` },
   { prompt: `Multiply ${f(r, N)} × ${f(N - r, N - 1)}: tops together, bottoms together. What are the new top and bottom, before reducing?`, answer: [top, bot], labels: ['numerator before reducing', 'denominator before reducing'], explanation: `${n(r)} × ${n(N - r)} = ${n(top)} and ${n(N)} × ${n(N - 1)} = ${n(bot)}, so the chance is ${f(top, bot)}, which reduces to ${f(top / d, bot / d)}.` }
  ] }; }
});

/* c: two crates, neither faulty, then the complement written over the same denominator. */
P({ id: 'q08c', parent: 'q08', kind: 'applied', title: 'Will the stack be held?', labels: ['P(neither) numerator', 'P(neither) denominator', 'P(at least one) numerator'], tolerance: 0.01,
 brief: 'A stack is held back for a full check if an inspector finds a faulty seal in the first two crates, and Mira wants the odds of that.' }, {
 canonical: { N: 9, f: 3 },
 draw: R => { let p; do { p = { N: R.int(7, 14) }; p.f = R.int(2, p.N - 3); } while (p.N === 9 && p.f === 3); return p; },
 build: ({ N, f: r }) => { const s = N - r, top = s * (s - 1), bot = N * (N - 1), d = gcd(top, bot), nu = top / d, de = bot / d; return {
  prompt: `A stack in the sorting shed holds ${n(N)} crates, and ${n(r)} of them have a faulty seal. An inspector pulls two crates at random, one after the other, without putting the first back. The stack is held back if at least one of the two is faulty. Enter P(neither crate is faulty) as a fraction in lowest terms: numerator, then denominator. Then enter the numerator of P(at least one crate is faulty), written over that same denominator.`,
  answer: [nu, de, de - nu],
  hints: [`The first crate has no faulty seal with probability ${f(s, N)}. For the second, remember the first crate is not back in the stack.`, 'Multiply the two chances and reduce. “At least one faulty” is the complement of “neither faulty”, so the two probabilities add to 1.'],
  solution: `P(first sound) = ${f(s, N)}. If it was sound, ${n(N - 1)} crates are left and ${n(s - 1)} of them are sound, so P(second sound | first sound) = ${f(s - 1, N - 1)}. P(neither faulty) = ${f(s, N)} × ${f(s - 1, N - 1)} = ${f(top, bot)} = ${f(nu, de)}. The complement is P(at least one faulty) = 1 − ${f(nu, de)} = ${f(de - nu, de)}, so the numerator is ${n(de - nu)}.`,
  guidance: [
   { prompt: 'For the first pick: how many crates have no faulty seal, and how many crates are in the stack?', answer: [s, N], labels: ['sound crates', 'crates'], explanation: `${n(N)} − ${n(r)} = ${n(s)} sound crates out of ${n(N)}, so P(first sound) = ${f(s, N)}.` },
   { prompt: `If the first crate was sound, ${n(s - 1)} sound crates remain among ${n(N - 1)}. Multiply ${f(s, N)} × ${f(s - 1, N - 1)} and write the result in lowest terms.`, answer: [nu, de], labels: ['P(neither) numerator', 'P(neither) denominator'], explanation: `${n(s)} × ${n(s - 1)} = ${n(top)} and ${n(N)} × ${n(N - 1)} = ${n(bot)}, so ${f(top, bot)}, which reduces to ${f(nu, de)}.` },
   { prompt: `“At least one faulty” is the complement of “neither faulty”. Written over ${n(de)}, what is the numerator of 1 − ${f(nu, de)}?`, answer: [de - nu], labels: ['P(at least one) numerator'], explanation: `1 = ${f(de, de)}, so 1 − ${f(nu, de)} = ${f(de - nu, de)}. The numerator is ${n(de - nu)}.` }
  ] }; }
});

/* d: three crates without replacement. f(f − 1)(f − 2) and N(N − 1)(N − 2) are each a multiple of 6, so the fraction always reduces. */
P({ id: 'q08d', parent: 'q08', kind: 'challenge', uses: 'q03', title: 'Three crates in a row', labels: ['P(all three) numerator', 'P(all three) denominator', 'P(at least one sound) numerator'], tolerance: 0.01,
 brief: 'Inspectors now pull three crates from a stack, and Mira wants the chance that all three are faulty.' }, {
 canonical: { N: 12, f: 5 },
 draw: R => { let p; do { p = { N: R.int(8, 16) }; p.f = R.int(3, p.N - 3); } while (p.N === 12 && p.f === 5); return p; },
 build: ({ N, f: r }) => { const top = r * (r - 1) * (r - 2), bot = N * (N - 1) * (N - 2), d = gcd(top, bot), nu = top / d, de = bot / d; return {
  prompt: `A stack in the sorting shed holds ${n(N)} crates, and ${n(r)} of them have a faulty seal. An inspector pulls three crates at random, one after another, and none of them goes back. Enter P(all three crates are faulty) as a fraction in lowest terms: numerator, then denominator. Then enter the numerator of P(at least one of the three is sound), written over that same denominator.`,
  answer: [nu, de, de - nu],
  hints: ['Extend the multiplication rule to a third pick: P(all three) = P(first) × P(second | first) × P(third | first two). Each pick takes one crate off the top and the bottom.', '“At least one sound” is the complement of “all three faulty”, so the two probabilities add to 1.'],
  solution: `P(first faulty) = ${f(r, N)}. Then ${n(N - 1)} crates are left with ${n(r - 1)} faulty: ${f(r - 1, N - 1)}. Then ${n(N - 2)} are left with ${n(r - 2)} faulty: ${f(r - 2, N - 2)}. P(all three faulty) = ${f(r, N)} × ${f(r - 1, N - 1)} × ${f(r - 2, N - 2)} = ${f(top, bot)} = ${f(nu, de)}. The complement is P(at least one sound) = 1 − ${f(nu, de)} = ${f(de - nu, de)}, so the numerator is ${n(de - nu)}.`,
  guidance: [
   { prompt: `If the first crate was faulty and has been set aside, how many faulty crates are left, and how many crates in all?`, answer: [r - 1, N - 1], labels: ['faulty crates left', 'crates left'], explanation: `${n(r - 1)} faulty ${r - 1 === 1 ? 'crate' : 'crates'} among ${n(N - 1)}, so P(second faulty | first faulty) = ${f(r - 1, N - 1)}.` },
   { prompt: `If the second crate was faulty too, how many faulty crates are left now, and how many crates in all?`, answer: [r - 2, N - 2], labels: ['faulty crates left', 'crates left'], explanation: `${n(r - 2)} faulty ${r - 2 === 1 ? 'crate' : 'crates'} among ${n(N - 2)}, so P(third faulty | first two faulty) = ${f(r - 2, N - 2)}.` },
   { prompt: `Multiply ${f(r, N)} × ${f(r - 1, N - 1)} × ${f(r - 2, N - 2)} and write the result in lowest terms.`, answer: [nu, de], labels: ['P(all three) numerator', 'P(all three) denominator'], explanation: `${n(r)} × ${n(r - 1)} × ${n(r - 2)} = ${n(top)} and ${n(N)} × ${n(N - 1)} × ${n(N - 2)} = ${n(bot)}, so ${f(top, bot)}, which reduces to ${f(nu, de)}.` }
  ] }; }
});

/* ---- q09 Independent events [IS 3.2] ---- */

/* b: P(red tag) and P(heavy) in tenths; P(both) in hundredths is the product (independent) or off by 0.01 to 0.04. */
P({ id: 'q09b', parent: 'q09', kind: 'setting', title: 'Red tags and heavy parcels', labels: ['P(red tag) × P(heavy)', 'independent (1) or not (0)'], tolerance: 0.005,
 brief: 'The packers think red-tagged parcels are usually the heavy ones, and Mira wants the tally checked before anyone rearranges the shelves.' }, {
 canonical: { a: 3, b: 8, g: 24 },
 draw: R => { let p; do { p = { a: R.int(2, 8), b: R.int(2, 8) }; const pr = p.a * p.b; p.g = R.bool() ? pr : pr + R.pick([-1, 1]) * R.int(1, 4); } while (p.g < 4 || p.g >= 10 * Math.min(p.a, p.b) || (p.a === 5 && p.b === 4) || (p.a === 4 && p.b === 5) || (p.a === 6 && p.b === 3) || (p.a === 3 && p.b === 8 && p.g !== 24)); return p; },
 build: ({ a, b, g }) => { const pr = a * b, ind = pr === g ? 1 : 0; return {
  prompt: `The shed tally says that a parcel carries a red tag with probability ${n(a / 10)}, that a parcel is heavy with probability ${n(b / 10)}, and that a parcel is red-tagged and heavy with probability ${n(h(g))}. Enter P(red tag) × P(heavy), then 1 if the events “red tag” and “heavy” are independent or 0 if they are not.`,
  answer: [h(pr), ind],
  hints: ['Multiply the two single probabilities, P(red tag) and P(heavy).', 'Two events are independent exactly when P(A and B) = P(A) × P(B). Compare your product with the tallied chance of “red tag and heavy”.'],
  solution: `P(red tag) × P(heavy) = ${n(a / 10)} × ${n(b / 10)} = ${n(h(pr))}. The tally gives P(red tag and heavy) = ${n(h(g))}, which ${ind ? 'is the same, so the events are independent: knowing a parcel is red-tagged does not change the chance that it is heavy. Enter 1.' : `is not ${n(h(pr))}, so the events are not independent: knowing a parcel is red-tagged changes the chance that it is heavy. Enter 0.`}`,
  guidance: [
   { prompt: `What is ${n(a / 10)} × ${n(b / 10)}?`, answer: [h(pr)], labels: ['P(red tag) × P(heavy)'], explanation: `${n(a / 10)} × ${n(b / 10)} = ${n(h(pr))}. If the events were independent, this would be the chance of both.` },
   { prompt: `The tallied chance of both is ${n(h(g))}. Is it equal to ${n(h(pr))}? Enter 1 for yes (independent) or 0 for no.`, answer: [ind], labels: ['independent (1) or not (0)'], explanation: ind ? `${n(h(g))} = ${n(h(pr))}, so the events are independent.` : `${n(h(g))} is not ${n(h(pr))}, so the events are not independent.` }
  ] }; }
});

/* c: two independent scanners with chances in multiples of 5 hundredths; P(both) = ab has at most four decimals. */
P({ id: 'q09c', parent: 'q09', kind: 'applied', title: 'Two scanners on the belt', labels: ['P(both catch it)', 'P(at least one catches it)'], tolerance: 0.00005,
 brief: 'Two crack scanners watch the same belt, and Mira wants to know how likely a cracked crate is to get past both of them.' }, {
 canonical: { a: 70, b: 65 },
 draw: R => { let p; do { p = { a: 5 * R.int(10, 19), b: 5 * R.int(10, 19) }; } while (p.a === p.b || (p.a === 70 && p.b === 65)); return p; },
 build: ({ a, b }) => { const both = a * b, s = a + b, o = 10000 * s / 100 - both; return {
  prompt: `Two scanners check every crate on the belt for cracks, and they work independently of each other. Scanner A catches a cracked crate with probability ${n(h(a))}, and scanner B catches it with probability ${n(h(b))}. A cracked crate goes down the belt. Enter P(both scanners catch it), then P(at least one scanner catches it), both to 4 decimal places.`,
  answer: [q4(both), q4(o)],
  hints: ['The scanners are independent, so the chance that both catch the crate is the product of their two chances.', 'For “at least one”, use the addition rule: add the two chances, then take off the chance that both catch it, which you already have.'],
  solution: `Because the scanners are independent, P(both catch it) = ${n(h(a))} × ${n(h(b))} = ${n(q4(both))}. By the addition rule, P(at least one catches it) = ${n(h(a))} + ${n(h(b))} − ${n(q4(both))} = ${n(h(s))} − ${n(q4(both))} = ${n(q4(o))}.`,
  guidance: [
   { prompt: `The scanners are independent. What is ${n(h(a))} × ${n(h(b))}?`, answer: [q4(both)], labels: ['P(both catch it)'], explanation: `${n(h(a))} × ${n(h(b))} = ${n(q4(both))}. For independent events, P(A and B) = P(A) × P(B).` },
   { prompt: `Start the addition rule. What is ${n(h(a))} + ${n(h(b))}?`, answer: [h(s)], labels: ['P(A) + P(B)'], explanation: `${n(h(a))} + ${n(h(b))} = ${n(h(s))}. This counts the crates caught by both scanners twice.` },
   { prompt: `Take off the overlap once. What is ${n(h(s))} − ${n(q4(both))}?`, answer: [q4(o)], labels: ['P(at least one catches it)'], explanation: `${n(h(s))} − ${n(q4(both))} = ${n(q4(o))}, the chance that scanner A, scanner B or both catch the crate.` }
  ] }; }
});

/* d: the same two draws with and without putting the first crate back. Independent with replacement, dependent without. */
P({ id: 'q09d', parent: 'q09', kind: 'challenge', uses: 'q08', title: 'Put it back or set it aside', labels: ['P(both faulty), crate put back', 'P(both faulty), crate set aside'], tolerance: 0.00005,
 brief: 'The inspectors cannot agree whether to put the first crate back before drawing the second, and Mira wants to see what the choice does to the odds.' }, {
 canonical: { N: 15, f: 6 },
 draw: R => { let p; do { p = { N: R.int(12, 30) }; p.f = R.int(3, p.N - 4); } while (p.N === 15 && p.f === 6); return p; },
 build: ({ N, f: r }) => { const w = r * r / (N * N), wo = r * (r - 1) / (N * (N - 1)), W = Math.round(w * 1e4) / 1e4, WO = Math.round(wo * 1e4) / 1e4; return {
  prompt: `A stack in the sorting shed holds ${n(N)} crates, and ${n(r)} of them have a faulty seal. Two crates are drawn at random, one after the other. In plan one, the first crate is put back in the stack before the second is drawn. In plan two, the first crate is set aside. Enter P(both crates are faulty) under plan one, then under plan two, both to 4 decimal places.`,
  answer: [W, WO],
  hints: ['In plan one the stack is the same for both draws, so the two draws are independent and their chances multiply as they are.', 'In plan two the second chance depends on the first draw: one faulty crate and one crate in all have left the stack. Work out each product as a fraction, then divide to get the decimal.'],
  solution: `Plan one: the draws are independent, so P(both faulty) = ${f(r, N)} × ${f(r, N)} = ${f(r * r, N * N)} ${Math.abs(r * r / (N * N) - W) < 1e-12 ? '=' : '≈'} ${n(W)}. Plan two: P(both faulty) = ${f(r, N)} × ${f(r - 1, N - 1)} = ${f(r * (r - 1), N * (N - 1))} ${Math.abs(r * (r - 1) / (N * (N - 1)) - WO) < 1e-12 ? '=' : '≈'} ${n(WO)}. Setting the first crate aside makes the second draw depend on the first, and lowers the chance.`,
  guidance: [
   { prompt: `Plan one: the crate is put back, so each draw is ${f(r, N)}. Multiply ${f(r, N)} × ${f(r, N)}. What are the new top and bottom?`, answer: [r * r, N * N], labels: ['numerator', 'denominator'], explanation: `${n(r)} × ${n(r)} = ${n(r * r)} and ${n(N)} × ${n(N)} = ${n(N * N)}, so the chance is ${f(r * r, N * N)}.` },
   { prompt: `Plan two: the second draw is ${f(r - 1, N - 1)} if the first crate was faulty. Multiply ${f(r, N)} × ${f(r - 1, N - 1)}. What are the new top and bottom?`, answer: [r * (r - 1), N * (N - 1)], labels: ['numerator', 'denominator'], explanation: `${n(r)} × ${n(r - 1)} = ${n(r * (r - 1))} and ${n(N)} × ${n(N - 1)} = ${n(N * (N - 1))}, so the chance is ${f(r * (r - 1), N * (N - 1))}.` },
   { prompt: `Divide each fraction to 4 decimal places: ${f(r * r, N * N)} for plan one, then ${f(r * (r - 1), N * (N - 1))} for plan two.`, answer: [W, WO], labels: ['plan one', 'plan two'], explanation: `${f(r * r, N * N)} is ${n(W)} and ${f(r * (r - 1), N * (N - 1))} is ${n(WO)}, to 4 decimal places.` }
  ] }; }
});

/* ---- q10 Tree diagrams and the total probability of an outcome [IS 3.5] ---- */

/* b: two branches; the complement gives the accepted trays. Shares and rejection rates in hundredths, so each path has at most four decimals. */
P({ id: 'q10b', parent: 'q10', kind: 'setting', title: 'Seed trays from two greenhouses', labels: ['P(rejected)', 'P(accepted)'], tolerance: 0.00005,
 brief: 'Seed trays reach the shed from two greenhouses, and Mira wants the chance that the next tray is turned away.' }, {
 canonical: { s: 60, r1: 8, r2: 15 },
 draw: R => { let p; do { p = { s: R.int(25, 75), r1: R.int(3, 20), r2: R.int(3, 20) }; } while (p.r1 === p.r2 || (p.s === 70 && p.r1 === 10 && p.r2 === 20)); return p; },
 build: ({ s, r1, r2 }) => { const t = 100 - s, p1 = s * r1, p2 = t * r2, tot = p1 + p2; return {
  prompt: `A seed tray in the sorting shed came from the North greenhouse with probability ${n(h(s))} and from the South greenhouse otherwise. A North tray is rejected with probability ${n(h(r1))}, and a South tray with probability ${n(h(r2))}. Enter P(rejected), the probability that a tray picked at random from the shed is rejected, then P(accepted), both to 4 decimal places.`,
  answer: [q4(tot), q4(10000 - tot)],
  hints: ['Draw a tree diagram: a branch for each greenhouse, then “rejected” and “accepted” branches from each. Multiply along each path that ends in “rejected”.', 'Add the two path probabilities for P(rejected). A tray is either rejected or accepted, so P(accepted) is the complement of P(rejected): 1 minus it.'],
  solution: `The South share is 1 − ${n(h(s))} = ${n(h(t))}. Along the North path, ${n(h(s))} × ${n(h(r1))} = ${n(q4(p1))}; along the South path, ${n(h(t))} × ${n(h(r2))} = ${n(q4(p2))}. So P(rejected) = ${n(q4(p1))} + ${n(q4(p2))} = ${n(q4(tot))}, and P(accepted) = 1 − ${n(q4(tot))} = ${n(q4(10000 - tot))}.`,
  guidance: [
   { prompt: `Multiply along each path that ends in “rejected”: the North share ${n(h(s))} × ${n(h(r1))}, and the South share ${n(h(t))} × ${n(h(r2))}. What are the two path probabilities?`, answer: [q4(p1), q4(p2)], labels: ['North path', 'South path'], explanation: `${n(h(s))} × ${n(h(r1))} = ${n(q4(p1))} and ${n(h(t))} × ${n(h(r2))} = ${n(q4(p2))}. Each is P(greenhouse and rejected).` },
   { prompt: `Add the two paths. What is ${n(q4(p1))} + ${n(q4(p2))}?`, answer: [q4(tot)], labels: ['P(rejected)'], explanation: `${n(q4(p1))} + ${n(q4(p2))} = ${n(q4(tot))}. A rejected tray came from exactly one greenhouse, so the paths simply add.` },
   { prompt: `A tray is accepted exactly when it is not rejected. What is 1 − ${n(q4(tot))}?`, answer: [q4(10000 - tot)], labels: ['P(accepted)'], explanation: `1 − ${n(q4(tot))} = ${n(q4(10000 - tot))}, the complement.` }
  ] }; }
});

/* c: two suppliers, then a forecast for a delivery of M crates (M is a multiple of 1000, so the forecast has at most one decimal). */
P({ id: 'q10c', parent: 'q10', kind: 'applied', title: 'Damage in the next delivery', labels: ['P(damaged)', 'expected damaged crates'], tolerance: 0.00005,
 brief: 'A big delivery from two suppliers is due, and Mira wants to know how many damaged crates to plan for.' }, {
 canonical: { s: 55, r1: 3, r2: 8, M: 3000 },
 draw: R => { let p; do { p = { s: R.int(25, 75), r1: R.int(2, 12), r2: R.int(2, 12), M: R.pick([1000, 2000, 3000, 4000, 5000]) }; } while (p.r1 === p.r2 || (p.s === 55 && p.r1 === 3 && p.r2 === 8)); return p; },
 build: ({ s, r1, r2, M }) => { const t = 100 - s, p1 = s * r1, p2 = t * r2, tot = p1 + p2, e = M * tot / 10000; return {
  prompt: `Of the crates in a delivery, a share of ${n(h(s))} come from Rhea Depot and the rest from Vesta Yard. A Rhea crate is damaged with probability ${n(h(r1))}, and a Vesta crate with probability ${n(h(r2))}. A delivery of ${n(M)} crates is due. Enter P(damaged), the probability that a crate picked at random from it is damaged, to 4 decimal places, then the number of damaged crates you expect among the ${n(M)}.`,
  answer: [q4(tot), e],
  hints: ['Draw a tree diagram: a branch for each supplier, then “damaged” and “undamaged”. Multiply along each path that ends in “damaged” and add them.', 'The expected number of damaged crates is the number of crates times the chance that one crate is damaged.'],
  solution: `The Vesta share is 1 − ${n(h(s))} = ${n(h(t))}. Along the Rhea path, ${n(h(s))} × ${n(h(r1))} = ${n(q4(p1))}; along the Vesta path, ${n(h(t))} × ${n(h(r2))} = ${n(q4(p2))}. So P(damaged) = ${n(q4(p1))} + ${n(q4(p2))} = ${n(q4(tot))}. Among ${n(M)} crates you expect ${n(M)} × ${n(q4(tot))} = ${n(e)} damaged.`,
  guidance: [
   { prompt: `Multiply along each path that ends in “damaged”: the Rhea share ${n(h(s))} × ${n(h(r1))}, and the Vesta share ${n(h(t))} × ${n(h(r2))}. What are the two path probabilities?`, answer: [q4(p1), q4(p2)], labels: ['Rhea path', 'Vesta path'], explanation: `${n(h(s))} × ${n(h(r1))} = ${n(q4(p1))} and ${n(h(t))} × ${n(h(r2))} = ${n(q4(p2))}.` },
   { prompt: `Add the two paths. What is ${n(q4(p1))} + ${n(q4(p2))}?`, answer: [q4(tot)], labels: ['P(damaged)'], explanation: `${n(q4(p1))} + ${n(q4(p2))} = ${n(q4(tot))}.` },
   { prompt: `Use ${n(q4(tot))} as the chance for each crate. What is ${n(M)} × ${n(q4(tot))}?`, answer: [e], labels: ['expected damaged crates'], explanation: `${n(M)} × ${n(q4(tot))} = ${n(e)}. The real count will land close to this, not exactly on it.` }
  ] }; }
});

/* d: two crates from a stack without replacement as a tree. gcd(f, N) >= 2, so P(second faulty) = f/N visibly reduces. */
P({ id: 'q10d', parent: 'q10', kind: 'challenge', uses: 'q08', title: 'The second crate off the stack', labels: ['P(exactly one) numerator', 'P(exactly one) denominator', 'P(second faulty) numerator', 'P(second faulty) denominator'], tolerance: 0.01,
 brief: 'Mira wants to know whether it matters that the faulty crate comes first or second off the stack, so she asks for the tree.' }, {
 canonical: { N: 12, f: 4 },
 draw: R => { let p; do { p = { N: R.int(8, 20) }; p.f = R.int(2, p.N - 3); } while (gcd(p.f, p.N) < 2 || (p.N === 12 && p.f === 4)); return p; },
 build: ({ N, f: r }) => { const bot = N * (N - 1), ff = r * (r - 1), sf = (N - r) * r, sec = ff + sf, one = 2 * r * (N - r), d1 = gcd(one, bot), d2 = gcd(sec, bot); return {
  prompt: `A stack in the sorting shed holds ${n(N)} crates, and ${n(r)} of them have a faulty seal. Two crates are taken at random, one after the other, and the first is not put back. Draw the tree: first crate faulty or sound, then second crate faulty or sound given the first. Enter P(exactly one of the two crates is faulty) as a fraction in lowest terms: numerator, then denominator. Then enter P(the second crate is faulty) as a fraction in lowest terms: numerator, then denominator.`,
  answer: [one / d1, bot / d1, sec / d2, bot / d2],
  hints: ['The second crate is faulty on two paths of the tree: faulty then faulty, and sound then faulty. Multiply along each path and add them. Every path has the denominator of the same two picks.', '“Exactly one faulty” also takes two paths: faulty then sound, and sound then faulty. Add those two products and reduce.'],
  solution: `The paths use ${n(N)} × ${n(N - 1)} = ${n(bot)} as their bottom. Faulty then faulty: ${n(r)} × ${n(r - 1)} = ${n(ff)}. Sound then faulty: ${n(N - r)} × ${n(r)} = ${n(sf)}. So P(second faulty) = ${f(ff, bot)} + ${f(sf, bot)} = ${f(sec, bot)} = ${f(sec / d2, bot / d2)}, the same as the chance for the first crate, ${f(r, N)}. Faulty then sound: ${n(r)} × ${n(N - r)} = ${n(r * (N - r))}, and sound then faulty is the same ${n(sf)}, so P(exactly one faulty) = ${f(one, bot)} = ${f(one / d1, bot / d1)}.`,
  guidance: [
   { prompt: `Two paths end with the second crate faulty. Over a bottom of ${n(N)} × ${n(N - 1)}, what are the tops of faulty then faulty, and of sound then faulty? Then enter the bottom.`, answer: [ff, sf, bot], labels: ['faulty then faulty (top)', 'sound then faulty (top)', 'bottom'], explanation: `Faulty then faulty: ${n(r)} × ${n(r - 1)} = ${n(ff)}. Sound then faulty: ${n(N - r)} × ${n(r)} = ${n(sf)}. The bottom is ${n(N)} × ${n(N - 1)} = ${n(bot)}.` },
   { prompt: `Add the two paths over the bottom ${n(bot)}, then write P(second faulty) in lowest terms.`, answer: [sec / d2, bot / d2], labels: ['numerator', 'denominator'], explanation: `${n(ff)} + ${n(sf)} = ${n(sec)}, so ${f(sec, bot)}, which reduces to ${f(sec / d2, bot / d2)}.` },
   { prompt: `“Exactly one faulty” is faulty then sound, plus sound then faulty. Both have the top ${n(r)} × ${n(N - r)}. Add them over ${n(bot)} and write the result in lowest terms.`, answer: [one / d1, bot / d1], labels: ['numerator', 'denominator'], explanation: `${n(r * (N - r))} + ${n(r * (N - r))} = ${n(one)}, so ${f(one, bot)}, which reduces to ${f(one / d1, bot / d1)}.` }
  ] }; }
});

})();
