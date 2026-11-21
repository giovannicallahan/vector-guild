/* Content checks for the Calculus 1 pack that only this pack needs. This file registers no oracle.
   The rules every new pack shares (tolerance against the answer's precision, "+ 0", a written-out coefficient 1,
   "1 seconds", "without commas", hints that state an answer, drills that accept a neighbour, ranks) are in
   qa/pack-checks.js, which qa/generators.js runs for this pack as well. Add a rule here when a review finds a defect
   in one mission that the shared rules cannot see; name the defect. Any failure throws, which fails
   `node qa/generators.js --realm calc1`. */
(function(){ 'use strict';
const { Gen, QUESTS, MISSION_GEN } = window;
const problems = [], fail = text => { if (problems.length < 20 && !problems.includes(text)) problems.push(text); };
const SEED = 4242, DRAWS = 300;
for (const q of QUESTS) {
  if (!MISSION_GEN[q.id]) continue;
  for (let roll = 1; roll <= DRAWS; roll++) {
    const m = Gen.instance(q, SEED, roll); if (m === q) continue;
    const p = m.params, where = `${q.id} params ${JSON.stringify(p)}`;
    /* q01, q01b: the lesson divides by a change in time of at least 2, and the rate asked for is a whole number. */
    if ((q.id === 'q01' || q.id === 'q01b') && (p.t2 - p.t1 < 2 || !Number.isInteger(m.answer[1]))) fail(`${where}: the interval is shorter than 2, or the average rate is not a whole number`);
    /* q01: the worked example above the mission uses the interval from 1 to 3. */
    if (q.id === 'q01' && p.t1 === 1 && p.t2 === 3) fail(`${where}: repeats the interval of the q01 worked example`);
  }
}
if (problems.length) throw new Error(`Calculus 1 pack checks failed (qa/realms/calc1/oracle-pack-checks.js):\n  - ${problems.join('\n  - ')}`);
})();
