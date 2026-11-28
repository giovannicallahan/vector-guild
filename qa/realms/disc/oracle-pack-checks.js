/* Content checks for the Discrete mathematics pack that only this pack needs. This file registers no oracle.
   The rules every pack after Foundations shares (tolerance against the answer's precision, "+ 0", a written-out
   coefficient 1, "1 seconds", "without commas", hints that state an answer, drills that accept a neighbour, ranks)
   are in qa/pack-checks.js, which qa/generators.js runs for this pack as well. Add a rule here when a review finds a
   defect in one mission that the shared rules cannot see; name the defect. Any failure throws, which fails
   `node qa/generators.js --realm disc`. */
(function(){ 'use strict';
const { Gen, QUESTS, MISSION_GEN } = window;
const problems = [], fail = text => { if (problems.length < 20 && !problems.includes(text)) problems.push(text); };
const SEED = 4242, DRAWS = 300;
for (const q of QUESTS) {
  if (!MISSION_GEN[q.id]) continue;
  for (let roll = 1; roll <= DRAWS; roll++) {
    const m = Gen.instance(q, SEED, roll); if (m === q) continue;
    /* const p = m.params, where = `${q.id} params ${JSON.stringify(p)}`;
       if (q.id === 'q01' && <defect>) fail(`${where}: <what is wrong>`); */
  }
}
if (problems.length) throw new Error(`Discrete mathematics pack checks failed (qa/realms/disc/oracle-pack-checks.js):\n  - ${problems.join('\n  - ')}`);
})();
