/* Probability mission generators, file a: q01–q10. Shape and helpers: docs/PACK-FORMAT.md §3 and game/gen-core.js.
   build(canonical) must reproduce the authored text in missions-a.js exactly. */
(function(){
'use strict';
const G = window.Gen, { n, plus, par } = G;
const gcd = (a, b) => b ? gcd(b, a % b) : Math.abs(a);
/* Decimals are kept as whole numbers of hundredths (h) or thousandths (k) and divided only for display, so no float noise. */
const h = x => x / 100, k = x => x / 1000, f = (a, b) => `${n(a)}/${n(b)}`;
window.MISSION_GEN = window.MISSION_GEN || {};
Object.assign(window.MISSION_GEN, {
 /* A bag of r red, g green and y yellow tokens. g/total always reduces (the common factor is at least 2), so "lowest terms" matters. */
 q01: {
  canonical: { r: 5, g: 6, y: 4 },
  draw: R => { let p; do { p = { r: R.int(2, 12), g: R.int(2, 12), y: R.int(2, 12) }; } while (p.r + p.g + p.y > 30 || gcd(p.g, p.r + p.g + p.y) < 2); return p; },
  build: ({ r, g, y }) => { const t = r + g + y, c = gcd(g, t); return {
   prompt: `Mira chooses tomorrow’s supply route by drawing one token from a bag without looking. The bag holds ${n(r)} red tokens, ${n(g)} green tokens and ${n(y)} yellow tokens, and every token is equally likely to be drawn. Enter the number of outcomes in the sample space, then P(green) as a fraction in lowest terms: its numerator, then its denominator.`,
   answer: [t, g / c, t / c],
   hints: ['Each token is one outcome, so the sample space has one outcome for every token in the bag.', 'P(green) is the number of green outcomes divided by the number of outcomes in all. Then divide the top and the bottom by the biggest whole number that goes into both.'],
   solution: `The sample space has ${n(r)} + ${n(g)} + ${n(y)} = ${n(t)} equally likely outcomes, one for each token. The event “green” is made of ${n(g)} of them, so P(green) = ${f(g, t)}. Both ${n(g)} and ${n(t)} divide by ${n(c)}, so in lowest terms P(green) = ${f(g / c, t / c)}.`,
   guidance: [
    { prompt: 'How many tokens are in the bag altogether? That is the number of outcomes in the sample space.', answer: [t], explanation: `${n(r)} + ${n(g)} + ${n(y)} = ${n(t)}. Each token is one equally likely outcome.` },
    { prompt: 'Write P(green) as the number of green outcomes over the number of all outcomes, before simplifying.', answer: [g, t], explanation: `${n(g)} of the ${n(t)} outcomes are green, so P(green) = ${f(g, t)}.` },
    { prompt: `Write ${f(g, t)} in lowest terms.`, answer: [g / c, t / c], explanation: `${n(g)} and ${n(t)} both divide by ${n(c)}: ${n(g)} ÷ ${n(c)} = ${n(g / c)} and ${n(t)} ÷ ${n(c)} = ${n(t / c)}, so ${f(g, t)} = ${f(g / c, t / c)}.` }
   ] }; }
 },
 /* k on-time runs out of L logged; k/L has at most two decimals and the next N runs give a whole expected count. */
 q02: {
  canonical: { L: 40, k: 34, N: 60 },
  draw: R => { let p; do { const L = R.pick([20, 25, 40, 50]); p = { L, k: R.int(Math.ceil(0.55 * L), L - 2), N: R.pick([20, 30, 40, 50, 60, 80, 100, 120, 150, 200]) }; } while ((100 * p.k) % p.L || (p.N * p.k) % p.L || p.N === p.L); return p; },
  build: ({ L, k, N }) => { const fr = h(100 * k / L), e = N * k / L; return {
   prompt: `The dispatch log covers the last ${n(L)} supply runs, and ${n(k)} of them arrived on time. Enter the relative frequency of on-time runs as a decimal, then the number of the next ${n(N)} runs you would expect to arrive on time if the pattern holds.`,
   answer: [fr, e],
   hints: [`A relative frequency is the number of times something happened divided by the number of times it could have happened: here ${n(k)} ÷ ${n(L)}.`, `Use the relative frequency as the probability of an on-time run, and multiply it by the number of runs to come, ${n(N)}.`],
   solution: `The relative frequency is ${n(k)} ÷ ${n(L)} = ${n(fr)}. Taken as the probability that a run arrives on time, it predicts ${n(N)} × ${n(fr)} = ${n(e)} on-time runs out of the next ${n(N)}. The real count will land a little either side, but over many runs the share settles close to ${n(fr)}.`,
   guidance: [
    { prompt: `Divide the number of on-time runs by the number of runs in the log. What is ${n(k)} ÷ ${n(L)}?`, answer: [fr], explanation: `${n(k)} ÷ ${n(L)} = ${n(fr)}, so ${n(100 * fr)}% of the logged runs were on time.` },
    { prompt: `If each run is on time with probability ${n(fr)}, how many of the next ${n(N)} runs do you expect on time? Work out ${n(N)} × ${n(fr)}.`, answer: [e], explanation: `${n(N)} × ${n(fr)} = ${n(e)}. That is the expected count; the real one will usually be close to it, not exactly on it.` }
   ] }; }
 },
 /* A deck of T equally likely route cards, k of them for the canyon route; P(A) = k/T has at most two decimals. */
 q03: {
  canonical: { T: 40, k: 14 },
  draw: R => { let p; do { const T = R.pick([20, 25, 40, 50]); p = { T, k: R.int(2, T - 2) }; } while ((100 * p.k) % p.T || p.k / p.T < 0.1 || p.k / p.T > 0.9 || (p.T === 20 && p.k === 3)); return p; },
  build: ({ T, k: c }) => { const pA = h(100 * c / T), pN = h(100 - 100 * c / T), m = T - c; return {
   prompt: `Each morning dispatch draws one card from a deck of ${n(T)} route cards, all equally likely. Let A be the event “the card names the canyon route”, and P(A) = ${n(pA)}. Enter P(A′), the probability that the card does not name the canyon route, as a decimal, then the number of cards in the deck that do not name the canyon route.`,
   answer: [pN, m],
   hints: ['A′ means “not A”. Every outcome is in A or in A′ and never in both, so P(A) + P(A′) = 1.', `The cards are equally likely, so a probability is a count of cards divided by ${n(T)}. Turn it back into a count by multiplying by ${n(T)}.`],
   solution: `P(A′) = 1 − P(A) = 1 − ${n(pA)} = ${n(pN)}. The cards are equally likely, so P(A′) is the number of cards that do not name the canyon divided by ${n(T)}, and that number is ${n(T)} × ${n(pN)} = ${n(m)}. Check: ${n(T)} × ${n(pA)} = ${n(c)} cards name the canyon, and ${n(c)} + ${n(m)} = ${n(T)}.`,
   guidance: [
    { prompt: `A′ is the complement of A: every outcome not in A. What is 1 − ${n(pA)}?`, answer: [pN], explanation: `1 − ${n(pA)} = ${n(pN)}. A and A′ share the whole sample space between them, so their probabilities add to 1.` },
    { prompt: `${n(pN)} of the ${n(T)} equally likely cards do not name the canyon. How many cards is that? Work out ${n(T)} × ${n(pN)}.`, answer: [m], explanation: `${n(T)} × ${n(pN)} = ${n(m)} cards.` }
   ] }; }
 },
 /* Spinners 1..a and 1..b, sum s; at least two cells give s and the fraction always reduces. */
 q04: {
  canonical: { a: 4, b: 6, s: 7 },
  draw: R => { let p, c; do { p = { a: R.int(3, 6), b: R.int(3, 6) }; p.s = R.int(3, p.a + p.b - 1); c = 0; for (let i = 1; i <= p.a; i++) if (p.s - i >= 1 && p.s - i <= p.b) c++; } while (c < 2 || gcd(c, p.a * p.b) < 2 || (p.a === 3 && p.b === 3 && p.s === 4)); return p; },
  build: ({ a, b, s }) => { const cells = a * b, pairs = []; for (let i = 1; i <= a; i++) if (s - i >= 1 && s - i <= b) pairs.push(`(${n(i)}, ${n(s - i)})`);
   const c = pairs.length, d = gcd(c, cells), list = pairs.join(', '); return {
   prompt: `New dispatchers practise on two fair spinners. The first has ${n(a)} equal sections numbered 1 to ${n(a)}, and the second has ${n(b)} equal sections numbered 1 to ${n(b)}. Both are spun once, and one spin does not affect the other. The two numbers are added. Enter the number of cells in the grid of all outcomes (first spinner down the side, second along the top), then P(sum = ${n(s)}) as a fraction in lowest terms: numerator, then denominator.`,
   answer: [cells, c / d, cells / d],
   hints: ['The grid has one row for each number on the first spinner and one column for each number on the second, so the number of cells is rows × columns.', `Go down the rows: in row 1 the second spinner must show ${n(s)} − 1, in row 2 it must show ${n(s)} − 2, and so on. Count the rows where that number is really on the second spinner.`],
   solution: `The grid has ${n(a)} rows and ${n(b)} columns, so it has ${n(a)} × ${n(b)} = ${n(cells)} equally likely cells. The cells with sum ${n(s)} are ${list}: ${n(c)} of them. So P(sum = ${n(s)}) = ${f(c, cells)}, which is ${f(c / d, cells / d)} in lowest terms.`,
   guidance: [
    { prompt: `The grid has a row for each of the ${n(a)} numbers on the first spinner and a column for each of the ${n(b)} on the second. How many cells does it have?`, answer: [cells], explanation: `${n(a)} × ${n(b)} = ${n(cells)} cells, one for each pair (first, second), and every cell is equally likely.` },
    { prompt: `List the pairs (first, second) whose numbers add to ${n(s)}. How many are there?`, answer: [c], explanation: `They are ${list}: ${n(c)} cells.` },
    { prompt: `Write ${f(c, cells)} in lowest terms.`, answer: [c / d, cells / d], explanation: `${n(c)} and ${n(cells)} both divide by ${n(d)}, so ${f(c, cells)} = ${f(c / d, cells / d)}.` }
   ] }; }
 },
 /* Venn diagram regions: a in F only, c in both, b in C only, d outside both. */
 q05: {
  canonical: { a: 7, c: 3, b: 5, d: 10 },
  draw: R => ({ a: R.int(3, 15), c: R.int(2, 9), b: R.int(3, 15), d: R.int(2, 15) }),
  build: ({ a, c, b, d }) => { const or = a + b + c, F = a + c, C = b + c; return {
   prompt: `A supply run has unloaded its crates, and Mira sorts them on a Venn diagram. Circle F holds the fragile crates and circle C holds the crates that must be kept cold. Circle F holds ${n(F)} crates in all, and ${n(a)} of them sit outside the overlap. ${n(b)} crates sit in C outside the overlap, and ${n(d)} sit outside both circles. Enter the number of crates in the event “F or C”, then the number in the event “F and C”.`,
   answer: [or, c],
   hints: ['“F or C” means in F, in C, or in both: every crate inside at least one circle. The crates outside both circles are not in it.', '“F and C” means in both circles at once: the overlap. Circle F is made of its crates outside the overlap and the overlap itself, so take the first from F’s total.'],
   solution: `Circle F holds ${n(F)} crates and ${n(a)} of them sit outside the overlap, so the overlap, “F and C”, holds ${n(F)} − ${n(a)} = ${n(c)} crates. “F or C” is everything inside the circles: ${n(a)} + ${n(c)} + ${n(b)} = ${n(or)} crates. The ${n(d)} crates outside both circles are in neither event. F and C are not mutually exclusive, because ${n(c)} crates are in both.`,
   guidance: [
    { prompt: `Circle F holds ${n(F)} crates, and ${n(a)} of them sit outside the overlap. How many crates are in both circles at once, the event “F and C”?`, answer: [c], explanation: `${n(F)} − ${n(a)} = ${n(c)}. The overlap is the only part of F that is inside C as well.` },
    { prompt: 'How many crates are in circle C altogether? Remember that the overlap is inside C too.', answer: [C], explanation: `C holds ${n(b)} + ${n(c)} = ${n(C)} crates.` },
    { prompt: `Adding ${n(F)} and ${n(C)} counts the overlap twice. How many crates are in “F or C”? Work out ${n(F)} + ${n(C)} − ${n(c)}.`, answer: [or], explanation: `${n(F)} + ${n(C)} − ${n(c)} = ${n(or)}, the same as adding the three regions inside the circles, ${n(a)} + ${n(c)} + ${n(b)}.` }
   ] }; }
 },
 /* P(dust), P(fault), P(both) in hundredths; the "or" probability stays at most 0.95. */
 q06: {
  canonical: { A: 35, B: 20, AB: 8 },
  draw: R => { let p; do { p = { A: R.int(15, 60), B: R.int(10, 50) }; p.AB = R.int(3, Math.min(p.A, p.B) - 3); } while (p.A + p.B - p.AB > 95 || p.A === p.B || (p.A === 40 && p.B === 30)); return p; },
  build: ({ A, B, AB }) => { const s = A + B, o = s - AB; return {
   prompt: `From the dispatch records, a supply run is held up by dust with probability ${n(h(A))}, by an engine fault with probability ${n(h(B))}, and by both with probability ${n(h(AB))}. Enter P(dust or fault), the probability that a run is held up by at least one of the two, as a decimal.`,
   answer: [h(o)],
   hints: ['Adding P(dust) and P(fault) counts the runs held up by both twice, once in each.', 'Subtract P(dust and fault) once, so the overlap is counted only once.'],
   solution: `By the addition rule, P(dust or fault) = P(dust) + P(fault) − P(dust and fault) = ${n(h(A))} + ${n(h(B))} − ${n(h(AB))} = ${n(h(s))} − ${n(h(AB))} = ${n(h(o))}.`,
   guidance: [
    { prompt: `Add P(dust) and P(fault). What is ${n(h(A))} + ${n(h(B))}?`, answer: [h(s)], explanation: `${n(h(A))} + ${n(h(B))} = ${n(h(s))}. This counts the runs held up by both twice.` },
    { prompt: `Take the overlap off once. What is ${n(h(s))} − ${n(h(AB))}?`, answer: [h(o)], explanation: `${n(h(s))} − ${n(h(AB))} = ${n(h(o))}, the chance that a run is held up by dust, by a fault, or by both.` }
   ] }; }
 },
 /* A two-way table: Rhea ri intact, rc cracked; Tycho ti intact, tc cracked. The Tycho fraction reduces and differs from the overall share. */
 q07: {
  canonical: { ri: 42, rc: 8, ti: 27, tc: 9 },
  draw: R => { let p; do { p = { ri: R.int(20, 60), rc: R.int(2, 15), ti: R.int(10, 50), tc: R.int(2, 15) }; } while (gcd(p.tc, p.ti + p.tc) < 2 || p.tc * (p.ri + p.rc) === p.rc * (p.ti + p.tc)); return p; },
  build: ({ ri, rc, ti, tc }) => { const tt = ti + tc, d = gcd(tc, tt), all = ri + rc + tt, cr = rc + tc; return {
   prompt: `The sorting shed’s two-way table counts this month’s crates by supplier and condition. Rhea Depot: ${n(ri)} intact, ${n(rc)} cracked. Tycho Works: ${n(ti)} intact, ${n(tc)} cracked. A crate is picked at random from the whole shed, and you are told it came from Tycho Works. Enter P(cracked | Tycho), the probability that it is cracked given that it came from Tycho Works, as a fraction in lowest terms: numerator, then denominator.`,
   answer: [tc / d, tt / d],
   hints: ['“Given Tycho” means you look only at the Tycho Works row of the table. Rhea’s crates are no longer possible outcomes.', 'Divide the cracked crates in that row by the total of that row, then reduce the fraction.'],
   solution: `Given that the crate came from Tycho Works, the sample space shrinks to that row: ${n(ti)} + ${n(tc)} = ${n(tt)} crates. ${n(tc)} of them are cracked, so P(cracked | Tycho) = ${f(tc, tt)} = ${f(tc / d, tt / d)}. Across the whole shed ${n(cr)} of ${n(all)} crates are cracked, a different share: knowing the supplier changes the chance.`,
   guidance: [
    { prompt: 'Keep only the Tycho Works row. How many crates came from Tycho Works?', answer: [tt], explanation: `${n(ti)} + ${n(tc)} = ${n(tt)} crates. These are the only outcomes left once you know the supplier.` },
    { prompt: `${n(tc)} of those ${n(tt)} crates are cracked. Write ${f(tc, tt)} in lowest terms.`, answer: [tc / d, tt / d], explanation: `${n(tc)} and ${n(tt)} both divide by ${n(d)}, so P(cracked | Tycho) = ${f(tc / d, tt / d)}.` }
   ] }; }
 },
 /* N crates, f faulty, two taken without replacement. f(f − 1) and N(N − 1) are both even, so the product always reduces. */
 q08: {
  canonical: { N: 10, f: 4 },
  draw: R => { let p; do { p = { N: R.int(6, 15) }; p.f = R.int(2, p.N - 3); } while (p.N === 6 && p.f === 2); return p; },
  build: ({ N, f: k2 }) => { const top = k2 * (k2 - 1), bot = N * (N - 1), d = gcd(top, bot); return {
   prompt: `A stack in the sorting shed holds ${n(N)} crates, and ${n(k2)} of them have a faulty seal. Mira takes one crate at random and sets it aside, then takes a second at random from the crates left. Enter P(both crates are faulty) as a fraction in lowest terms: numerator, then denominator.`,
   answer: [top / d, bot / d],
   hints: [`The first crate is faulty with probability ${f(k2, N)}.`, 'If the first crate was faulty, the stack now has one crate fewer and one faulty crate fewer. Multiply the two probabilities, then reduce.'],
   solution: `P(first faulty) = ${f(k2, N)}. The first crate is not put back, so if it was faulty the stack holds ${n(N - 1)} crates with ${n(k2 - 1)} faulty among them: P(second faulty | first faulty) = ${f(k2 - 1, N - 1)}. By the multiplication rule, P(both faulty) = ${f(k2, N)} × ${f(k2 - 1, N - 1)} = ${f(top, bot)} = ${f(top / d, bot / d)}.`,
   guidance: [
    { prompt: 'For the first pick: how many crates are faulty, and how many crates are in the stack?', answer: [k2, N], explanation: `${n(k2)} of ${n(N)} crates are faulty, so P(first faulty) = ${f(k2, N)}.` },
    { prompt: 'Now suppose the first crate was faulty and has been set aside. How many faulty crates are left, and how many crates?', answer: [k2 - 1, N - 1], explanation: `One faulty crate is gone: ${n(k2 - 1)} faulty out of ${n(N - 1)}, so P(second faulty | first faulty) = ${f(k2 - 1, N - 1)}.` },
    { prompt: `Multiply ${f(k2, N)} × ${f(k2 - 1, N - 1)}: tops together, bottoms together. What are the new top and bottom, before reducing?`, answer: [top, bot], explanation: `${n(k2)} × ${n(k2 - 1)} = ${n(top)} and ${n(N)} × ${n(N - 1)} = ${n(bot)}, so P(both faulty) = ${f(top, bot)}, which reduces to ${f(top / d, bot / d)}.` }
   ] }; }
 },
 /* P(morning) = a tenths, P(damp) = b twentieths; the recorded P(both) in thousandths is the product, or off by 0.02 to 0.06.
    P(both) stays above P(morning) + P(damp) − 1, so P(morning or damp) is below 1 and the three figures can all be true. */
 q09: {
  canonical: { a: 6, b: 6, g: 240 },
  draw: R => { let p; do { p = { a: R.int(2, 8), b: R.int(2, 18) }; const pr = 5 * p.a * p.b; p.g = R.bool() ? pr : pr + R.pick([-1, 1]) * 10 * R.int(2, 6); } while (p.g < 10 || p.g >= Math.min(100 * p.a, 50 * p.b) || p.g <= 100 * p.a + 50 * p.b - 1000 || (p.a === 5 && p.b === 8) || (p.a === 4 && p.b === 10)); return p; },
  build: ({ a, b, g }) => { const pr = 5 * a * b, ind = pr === g ? 1 : 0, A = n(a / 10), B = n(b / 20), P = n(k(pr)), Gv = n(k(g)); return {
   prompt: `The sorting shed’s records say that a crate came on the morning run with probability ${A}, that a crate is damp with probability ${B}, and that a crate came on the morning run and is damp with probability ${Gv}. Enter P(morning) × P(damp), then 1 if the events “morning run” and “damp” are independent or 0 if they are not.`,
   answer: [k(pr), ind],
   hints: ['Multiply the two single probabilities, P(morning) and P(damp).', 'Two events are independent exactly when P(A and B) = P(A) × P(B). Compare your product with the recorded chance of “morning run and damp”.'],
   solution: `P(morning) × P(damp) = ${A} × ${B} = ${P}. The records give P(morning and damp) = ${Gv}, which ${ind ? 'is the same, so the events are independent: knowing that a crate came on the morning run does not change the chance that it is damp. Enter 1.' : `is not ${P}, so the events are not independent: knowing that a crate came on the morning run changes the chance that it is damp. Enter 0.`}`,
   guidance: [
    { prompt: `What is ${A} × ${B}?`, answer: [k(pr)], explanation: `${A} × ${B} = ${P}. If the events were independent, this would be the chance of both.` },
    { prompt: `The recorded chance of both is ${Gv}. Is it equal to ${P}? Enter 1 for yes (independent) or 0 for no.`, answer: [ind], explanation: ind ? `${Gv} = ${P}, so the events are independent.` : `${Gv} is not ${P}, so the events are not independent.` }
   ] }; }
 },
 /* Shares s1, s2, s3 and damage rates r1, r2, r3 in hundredths; each path product has at most four decimals. */
 q10: {
  canonical: { s1: 45, s2: 35, r1: 4, r2: 6, r3: 9 },
  draw: R => { let p; do { p = { s1: R.int(20, 60), s2: R.int(15, 50), r1: R.int(2, 15), r2: R.int(2, 15), r3: R.int(2, 15) }; } while (100 - p.s1 - p.s2 < 10 || p.r1 === p.r2 || p.r2 === p.r3 || p.r1 === p.r3); return p; },
  build: ({ s1, s2, r1, r2, r3 }) => { const s3 = 100 - s1 - s2, q = x => x / 10000, p1 = s1 * r1, p2 = s2 * r2, p3 = s3 * r3, tot = p1 + p2 + p3; return {
   prompt: `A crate in the sorting shed came from Rhea Depot with probability ${n(h(s1))}, from Tycho Works with probability ${n(h(s2))} and from Vesta Yard with probability ${n(h(s3))}. A crate from Rhea is damaged with probability ${n(h(r1))}, one from Tycho with probability ${n(h(r2))} and one from Vesta with probability ${n(h(r3))}. Enter P(damaged), the probability that a crate picked at random from the shed is damaged, to 4 decimal places.`,
   answer: [q(tot)],
   hints: ['Draw a tree diagram: three branches for the suppliers, then from each a “damaged” and an “undamaged” branch. Multiply along each path that ends in “damaged”.', 'Add the three path probabilities. A damaged crate came from exactly one supplier, so the paths are mutually exclusive.'],
   solution: `Along the Rhea path, ${n(h(s1))} × ${n(h(r1))} = ${n(q(p1))}; along the Tycho path, ${n(h(s2))} × ${n(h(r2))} = ${n(q(p2))}; along the Vesta path, ${n(h(s3))} × ${n(h(r3))} = ${n(q(p3))}. These are the only ways to get a damaged crate, so P(damaged) = ${n(q(p1))} + ${n(q(p2))} + ${n(q(p3))} = ${n(q(tot))}.`,
   guidance: [
    { prompt: 'Multiply along each path that ends in “damaged”: supplier share × damage rate. What are the Rhea, Tycho and Vesta path probabilities?', answer: [q(p1), q(p2), q(p3)], explanation: `${n(h(s1))} × ${n(h(r1))} = ${n(q(p1))}, ${n(h(s2))} × ${n(h(r2))} = ${n(q(p2))} and ${n(h(s3))} × ${n(h(r3))} = ${n(q(p3))}. Each is P(supplier and damaged).` },
    { prompt: `Add the three paths. What is ${n(q(p1))} + ${n(q(p2))} + ${n(q(p3))}?`, answer: [q(tot)], explanation: `${n(q(p1))} + ${n(q(p2))} + ${n(q(p3))} = ${n(q(tot))}. About ${n(Math.round(tot / 10) / 10)} crates in every 100 arrive damaged.` }
   ] }; }
 },
});
})();
