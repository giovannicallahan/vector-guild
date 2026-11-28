/* Realm packs: the scripts realm.html loads for each playable realm, in order.
   realm.html?realm=<id> writes these <link> and <script> tags, then app.js last. Only one pack is
   loaded per page, so packs may reuse local mission ids (q01 ...); saves are kept per realm (save-store.js).
   A feature that is off in a pack's REALM config has no script here, so its module is never loaded.
   A pack's practice files (practice-N.js) need gen-core.js before them and chapters.js after them.
   skip.js (the skip-ahead check) and glossary.js (tap-to-define words) are engine files that every pack lists last.
   title   the realm's display name (the star map registry, realms/registry.js, has the card text)
   styles  stylesheets, in cascade order
   scripts classic scripts, in load order, without app.js
   VG_REALM_SHARED is loaded on every realm page, whatever the pack: the collection (docs/COLLECTION.md) and the
   daily review card (daily.js, daily.css).
   styles  after the pack's stylesheets
   before  classic scripts before the pack's scripts (data and logic, no page code; save-store.js is already loaded)
   after   classic scripts after the pack's scripts and before app.js (page code) */
window.VG_REALM_SHARED = {
 styles: ['collection/collection.css', 'daily.css'],
 before: ['voice/index.js', 'realms/registry.js', 'collection/figures.js', 'collection/achievements.js', 'collection/core.js'],
 after: ['collection/ui.js', 'daily.js']
};
window.VG_PACKS = {
 la: {
  title: 'Linear algebra',
  styles: ['styles.css', 'docking.css', 'update.css', 'handson.css'],
  scripts: ['realms/la/pack.js', 'curriculum.js', 'extra-quests.js', 'gen-core.js', 'gen-a.js', 'gen-b.js', 'gen-c.js', 'gen-d.js', 'realms/la/practice-1.js', 'realms/la/practice-2.js', 'realms/la/practice-3.js', 'realms/la/practice-4.js', 'realms/la/practice-5.js', 'realms/la/practice-6.js', 'realms/la/practice-7.js', 'realms/la/practice-8.js', 'realms/la/practice-9.js', 'realms/la/practice-10.js', 'realms/la/practice-11.js', 'realms/la/practice-12.js', 'realms/la/practice-13.js', 'realms/la/practice-14.js', 'chapters.js', 'reading-links.js', 'gameplay.js', 'lab3d.js', 'graph-lab.js', 'experiment-low.js', 'experiment-high.js', 'variants.js', 'concept-lab.js', 'docking.js', 'handson.js', 'contracts.js', 'board.js', 'skip.js', 'glossary.js']
 },
 found: {
  title: 'Foundations',
  styles: ['styles.css', 'update.css'],
  scripts: ['realms/found/pack.js', 'realms/found/missions-a.js', 'realms/found/missions-b.js', 'realms/found/missions-c.js', 'realms/found/missions-d.js', 'gen-core.js', 'realms/found/gen-a.js', 'realms/found/gen-b.js', 'realms/found/gen-c.js', 'realms/found/gen-d.js', 'gameplay.js', 'realms/found/experiments-a.js', 'realms/found/experiments-b.js', 'realms/found/experiments-c.js', 'realms/found/experiments-d.js', 'realms/found/variants-a.js', 'realms/found/variants-b.js', 'realms/found/variants-c.js', 'realms/found/variants-d.js', 'realms/found/practice-1.js', 'realms/found/practice-2.js', 'realms/found/practice-3.js', 'realms/found/practice-4.js', 'realms/found/practice-5.js', 'realms/found/practice-6.js', 'realms/found/practice-7.js', 'realms/found/practice-8.js', 'variants.js', 'concept-lab.js', 'chapters.js', 'skip.js', 'glossary.js']
 },
 calc1: {
  title: 'Calculus 1: change',
  styles: ['styles.css', 'update.css'],
  scripts: ['realms/calc1/pack.js', 'realms/calc1/missions-a.js', 'realms/calc1/missions-b.js', 'realms/calc1/missions-c.js', 'realms/calc1/missions-d.js', 'gen-core.js', 'realms/calc1/gen-a.js', 'realms/calc1/gen-b.js', 'realms/calc1/gen-c.js', 'realms/calc1/gen-d.js', 'gameplay.js', 'realms/calc1/experiments-a.js', 'realms/calc1/experiments-b.js', 'realms/calc1/experiments-c.js', 'realms/calc1/experiments-d.js', 'realms/calc1/variants-a.js', 'realms/calc1/variants-b.js', 'realms/calc1/variants-c.js', 'realms/calc1/variants-d.js', 'realms/calc1/practice-1.js', 'realms/calc1/practice-2.js', 'realms/calc1/practice-3.js', 'realms/calc1/practice-4.js', 'realms/calc1/practice-5.js', 'realms/calc1/practice-6.js', 'realms/calc1/practice-7.js', 'realms/calc1/practice-8.js', 'variants.js', 'concept-lab.js', 'chapters.js', 'skip.js', 'glossary.js']
 },
 calc2: {
  title: 'Calculus 2: accumulation',
  styles: ['styles.css', 'update.css'],
  scripts: ['realms/calc2/pack.js', 'realms/calc2/missions-a.js', 'realms/calc2/missions-b.js', 'realms/calc2/missions-c.js', 'realms/calc2/missions-d.js', 'gen-core.js', 'realms/calc2/gen-a.js', 'realms/calc2/gen-b.js', 'realms/calc2/gen-c.js', 'realms/calc2/gen-d.js', 'gameplay.js', 'realms/calc2/experiments-a.js', 'realms/calc2/experiments-b.js', 'realms/calc2/experiments-c.js', 'realms/calc2/experiments-d.js', 'realms/calc2/variants-a.js', 'realms/calc2/variants-b.js', 'realms/calc2/variants-c.js', 'realms/calc2/variants-d.js', 'realms/calc2/practice-1.js', 'realms/calc2/practice-2.js', 'realms/calc2/practice-3.js', 'realms/calc2/practice-4.js', 'realms/calc2/practice-5.js', 'realms/calc2/practice-6.js', 'realms/calc2/practice-7.js', 'realms/calc2/practice-8.js', 'variants.js', 'concept-lab.js', 'chapters.js', 'skip.js', 'realms/calc2/glossary.js', 'glossary.js']
 },
 prob: {
  title: 'Probability',
  styles: ['styles.css', 'update.css'],
  scripts: ['realms/prob/pack.js', 'realms/prob/missions-a.js', 'realms/prob/missions-b.js', 'realms/prob/missions-c.js', 'realms/prob/missions-d.js', 'gen-core.js', 'realms/prob/gen-a.js', 'realms/prob/gen-b.js', 'realms/prob/gen-c.js', 'realms/prob/gen-d.js', 'gameplay.js', 'realms/prob/experiments-a.js', 'realms/prob/experiments-b.js', 'realms/prob/experiments-c.js', 'realms/prob/experiments-d.js', 'realms/prob/variants-a.js', 'realms/prob/variants-b.js', 'realms/prob/variants-c.js', 'realms/prob/variants-d.js', 'realms/prob/practice-1.js', 'realms/prob/practice-2.js', 'realms/prob/practice-3.js', 'realms/prob/practice-4.js', 'realms/prob/practice-5.js', 'realms/prob/practice-6.js', 'realms/prob/practice-7.js', 'realms/prob/practice-8.js', 'variants.js', 'concept-lab.js', 'chapters.js', 'skip.js', 'realms/prob/glossary.js', 'glossary.js']
 },
 logic: {
  title: 'Logic and proof',
  styles: ['styles.css', 'update.css'],
  scripts: ['realms/logic/pack.js', 'realms/logic/missions-a.js', 'realms/logic/missions-b.js', 'realms/logic/missions-c.js', 'realms/logic/missions-d.js', 'gen-core.js', 'realms/logic/gen-a.js', 'realms/logic/gen-b.js', 'realms/logic/gen-c.js', 'realms/logic/gen-d.js', 'gameplay.js', 'realms/logic/experiments-a.js', 'realms/logic/experiments-b.js', 'realms/logic/experiments-c.js', 'realms/logic/experiments-d.js', 'realms/logic/variants-a.js', 'realms/logic/variants-b.js', 'realms/logic/variants-c.js', 'realms/logic/variants-d.js', 'realms/logic/practice-1.js', 'realms/logic/practice-2.js', 'realms/logic/practice-3.js', 'realms/logic/practice-4.js', 'realms/logic/practice-5.js', 'realms/logic/practice-6.js', 'realms/logic/practice-7.js', 'realms/logic/practice-8.js', 'variants.js', 'concept-lab.js', 'chapters.js', 'skip.js', 'realms/logic/glossary.js', 'glossary.js']
 },
 disc: {
  title: 'Discrete mathematics',
  styles: ['styles.css', 'update.css'],
  scripts: ['realms/disc/pack.js', 'realms/disc/missions-a.js', 'realms/disc/missions-b.js', 'realms/disc/missions-c.js', 'realms/disc/missions-d.js', 'gen-core.js', 'realms/disc/gen-a.js', 'realms/disc/gen-b.js', 'realms/disc/gen-c.js', 'realms/disc/gen-d.js', 'gameplay.js', 'realms/disc/experiments-a.js', 'realms/disc/experiments-b.js', 'realms/disc/experiments-c.js', 'realms/disc/experiments-d.js', 'realms/disc/variants-a.js', 'realms/disc/variants-b.js', 'realms/disc/variants-c.js', 'realms/disc/variants-d.js', 'realms/disc/practice-1.js', 'realms/disc/practice-2.js', 'realms/disc/practice-3.js', 'realms/disc/practice-4.js', 'realms/disc/practice-5.js', 'realms/disc/practice-6.js', 'realms/disc/practice-7.js', 'realms/disc/practice-8.js', 'variants.js', 'concept-lab.js', 'chapters.js', 'skip.js', 'realms/disc/glossary.js', 'glossary.js']
 },
 calc3: {
  title: 'Calculus 3: many variables',
  styles: ['styles.css', 'update.css'],
  scripts: ['realms/calc3/pack.js', 'realms/calc3/missions-a.js', 'realms/calc3/missions-b.js', 'realms/calc3/missions-c.js', 'realms/calc3/missions-d.js', 'gen-core.js', 'realms/calc3/gen-a.js', 'realms/calc3/gen-b.js', 'realms/calc3/gen-c.js', 'realms/calc3/gen-d.js', 'gameplay.js', 'realms/calc3/experiments-a.js', 'realms/calc3/experiments-b.js', 'realms/calc3/experiments-c.js', 'realms/calc3/experiments-d.js', 'realms/calc3/variants-a.js', 'realms/calc3/variants-b.js', 'realms/calc3/variants-c.js', 'realms/calc3/variants-d.js', 'realms/calc3/practice-1.js', 'realms/calc3/practice-2.js', 'realms/calc3/practice-3.js', 'realms/calc3/practice-4.js', 'realms/calc3/practice-5.js', 'realms/calc3/practice-6.js', 'realms/calc3/practice-7.js', 'realms/calc3/practice-8.js', 'variants.js', 'concept-lab.js', 'chapters.js', 'skip.js', 'realms/calc3/glossary.js', 'glossary.js']
 },
 stats: {
  title: 'Data and inference',
  styles: ['styles.css', 'update.css'],
  scripts: ['realms/stats/pack.js', 'realms/stats/missions-a.js', 'realms/stats/missions-b.js', 'realms/stats/missions-c.js', 'realms/stats/missions-d.js', 'gen-core.js', 'realms/stats/gen-a.js', 'realms/stats/gen-b.js', 'realms/stats/gen-c.js', 'realms/stats/gen-d.js', 'gameplay.js', 'realms/stats/experiments-a.js', 'realms/stats/experiments-b.js', 'realms/stats/experiments-c.js', 'realms/stats/experiments-d.js', 'realms/stats/variants-a.js', 'realms/stats/variants-b.js', 'realms/stats/variants-c.js', 'realms/stats/variants-d.js', 'realms/stats/practice-1.js', 'realms/stats/practice-2.js', 'realms/stats/practice-3.js', 'realms/stats/practice-4.js', 'realms/stats/practice-5.js', 'realms/stats/practice-6.js', 'realms/stats/practice-7.js', 'realms/stats/practice-8.js', 'variants.js', 'concept-lab.js', 'chapters.js', 'skip.js', 'realms/stats/glossary.js', 'glossary.js']
 },
 number: {
  title: 'Number theory: the hidden life of whole numbers',
  styles: ['styles.css', 'update.css'],
  scripts: ['realms/number/pack.js', 'realms/number/missions-a.js', 'realms/number/missions-b.js', 'realms/number/missions-c.js', 'realms/number/missions-d.js', 'gen-core.js', 'realms/number/gen-a.js', 'realms/number/gen-b.js', 'realms/number/gen-c.js', 'realms/number/gen-d.js', 'gameplay.js', 'realms/number/experiments-a.js', 'realms/number/experiments-b.js', 'realms/number/experiments-c.js', 'realms/number/experiments-d.js', 'realms/number/variants-a.js', 'realms/number/variants-b.js', 'realms/number/variants-c.js', 'realms/number/variants-d.js', 'realms/number/practice-1.js', 'realms/number/practice-2.js', 'realms/number/practice-3.js', 'realms/number/practice-4.js', 'realms/number/practice-5.js', 'realms/number/practice-6.js', 'realms/number/practice-7.js', 'realms/number/practice-8.js', 'variants.js', 'concept-lab.js', 'chapters.js', 'skip.js', 'realms/number/glossary.js', 'glossary.js']
 },
 graph: {
  title: 'Graph theory: networks',
  styles: ['styles.css', 'update.css'],
  scripts: ['realms/graph/pack.js', 'realms/graph/missions-a.js', 'realms/graph/missions-b.js', 'realms/graph/missions-c.js', 'realms/graph/missions-d.js', 'gen-core.js', 'realms/graph/gen-a.js', 'realms/graph/gen-b.js', 'realms/graph/gen-c.js', 'realms/graph/gen-d.js', 'gameplay.js', 'realms/graph/experiments-a.js', 'realms/graph/experiments-b.js', 'realms/graph/experiments-c.js', 'realms/graph/experiments-d.js', 'realms/graph/variants-a.js', 'realms/graph/variants-b.js', 'realms/graph/variants-c.js', 'realms/graph/variants-d.js', 'realms/graph/practice-1.js', 'realms/graph/practice-2.js', 'realms/graph/practice-3.js', 'realms/graph/practice-4.js', 'realms/graph/practice-5.js', 'realms/graph/practice-6.js', 'realms/graph/practice-7.js', 'realms/graph/practice-8.js', 'variants.js', 'concept-lab.js', 'chapters.js', 'skip.js', 'realms/graph/glossary.js', 'glossary.js']
 },
 abstract: {
  title: 'Abstract algebra: patterns of moves',
  styles: ['styles.css', 'update.css'],
  scripts: ['realms/abstract/pack.js', 'realms/abstract/missions-a.js', 'realms/abstract/missions-b.js', 'realms/abstract/missions-c.js', 'realms/abstract/missions-d.js', 'gen-core.js', 'realms/abstract/gen-a.js', 'realms/abstract/gen-b.js', 'realms/abstract/gen-c.js', 'realms/abstract/gen-d.js', 'gameplay.js', 'realms/abstract/experiments-a.js', 'realms/abstract/experiments-b.js', 'realms/abstract/experiments-c.js', 'realms/abstract/experiments-d.js', 'realms/abstract/variants-a.js', 'realms/abstract/variants-b.js', 'realms/abstract/variants-c.js', 'realms/abstract/variants-d.js', 'realms/abstract/practice-1.js', 'realms/abstract/practice-2.js', 'realms/abstract/practice-3.js', 'realms/abstract/practice-4.js', 'realms/abstract/practice-5.js', 'realms/abstract/practice-6.js', 'realms/abstract/practice-7.js', 'realms/abstract/practice-8.js', 'variants.js', 'concept-lab.js', 'chapters.js', 'skip.js', 'realms/abstract/glossary.js', 'glossary.js']
 },
 ode: {
  title: 'Differential equations',
  styles: ['styles.css', 'update.css'],
  scripts: ['realms/ode/pack.js', 'realms/ode/missions-a.js', 'realms/ode/missions-b.js', 'realms/ode/missions-c.js', 'realms/ode/missions-d.js', 'gen-core.js', 'realms/ode/gen-a.js', 'realms/ode/gen-b.js', 'realms/ode/gen-c.js', 'realms/ode/gen-d.js', 'gameplay.js', 'realms/ode/experiments-a.js', 'realms/ode/experiments-b.js', 'realms/ode/experiments-c.js', 'realms/ode/experiments-d.js', 'realms/ode/variants-a.js', 'realms/ode/variants-b.js', 'realms/ode/variants-c.js', 'realms/ode/variants-d.js', 'realms/ode/practice-1.js', 'realms/ode/practice-2.js', 'realms/ode/practice-3.js', 'realms/ode/practice-4.js', 'realms/ode/practice-5.js', 'realms/ode/practice-6.js', 'realms/ode/practice-7.js', 'realms/ode/practice-8.js', 'variants.js', 'concept-lab.js', 'chapters.js', 'skip.js', 'realms/ode/glossary.js', 'glossary.js']
 },
 real: {
  title: 'Real analysis',
  styles: ['styles.css', 'update.css'],
  scripts: ['realms/real/pack.js', 'realms/real/missions-a.js', 'realms/real/missions-b.js', 'realms/real/missions-c.js', 'realms/real/missions-d.js', 'gen-core.js', 'realms/real/gen-a.js', 'realms/real/gen-b.js', 'realms/real/gen-c.js', 'realms/real/gen-d.js', 'gameplay.js', 'realms/real/experiments-a.js', 'realms/real/experiments-b.js', 'realms/real/experiments-c.js', 'realms/real/experiments-d.js', 'realms/real/variants-a.js', 'realms/real/variants-b.js', 'realms/real/variants-c.js', 'realms/real/variants-d.js', 'realms/real/practice-1.js', 'realms/real/practice-2.js', 'realms/real/practice-3.js', 'realms/real/practice-4.js', 'realms/real/practice-5.js', 'realms/real/practice-6.js', 'realms/real/practice-7.js', 'realms/real/practice-8.js', 'variants.js', 'concept-lab.js', 'chapters.js', 'skip.js', 'realms/real/glossary.js', 'glossary.js']
 },
 complex: {
  title: 'Complex analysis: the plane of numbers',
  styles: ['styles.css', 'update.css'],
  scripts: ['realms/complex/pack.js', 'realms/complex/missions-a.js', 'realms/complex/missions-b.js', 'realms/complex/missions-c.js', 'realms/complex/missions-d.js', 'gen-core.js', 'realms/complex/gen-a.js', 'realms/complex/gen-b.js', 'realms/complex/gen-c.js', 'realms/complex/gen-d.js', 'gameplay.js', 'realms/complex/experiments-a.js', 'realms/complex/experiments-b.js', 'realms/complex/experiments-c.js', 'realms/complex/experiments-d.js', 'realms/complex/variants-a.js', 'realms/complex/variants-b.js', 'realms/complex/variants-c.js', 'realms/complex/variants-d.js', 'realms/complex/practice-1.js', 'realms/complex/practice-2.js', 'realms/complex/practice-3.js', 'realms/complex/practice-4.js', 'realms/complex/practice-5.js', 'realms/complex/practice-6.js', 'realms/complex/practice-7.js', 'realms/complex/practice-8.js', 'variants.js', 'concept-lab.js', 'chapters.js', 'skip.js', 'realms/complex/glossary.js', 'glossary.js']
 },
 topo: {
  title: 'Topology: shape without size',
  styles: ['styles.css', 'update.css'],
  scripts: ['realms/topo/pack.js', 'realms/topo/missions-a.js', 'realms/topo/missions-b.js', 'realms/topo/missions-c.js', 'realms/topo/missions-d.js', 'gen-core.js', 'realms/topo/gen-a.js', 'realms/topo/gen-b.js', 'realms/topo/gen-c.js', 'realms/topo/gen-d.js', 'gameplay.js', 'realms/topo/experiments-a.js', 'realms/topo/experiments-b.js', 'realms/topo/experiments-c.js', 'realms/topo/experiments-d.js', 'realms/topo/variants-a.js', 'realms/topo/variants-b.js', 'realms/topo/variants-c.js', 'realms/topo/variants-d.js', 'realms/topo/practice-1.js', 'realms/topo/practice-2.js', 'realms/topo/practice-3.js', 'realms/topo/practice-4.js', 'realms/topo/practice-5.js', 'realms/topo/practice-6.js', 'realms/topo/practice-7.js', 'realms/topo/practice-8.js', 'variants.js', 'concept-lab.js', 'chapters.js', 'skip.js', 'realms/topo/glossary.js', 'glossary.js']
 },
 mech: {
  title: 'Mechanics: motion and force',
  styles: ['styles.css', 'update.css'],
  scripts: ['realms/mech/pack.js', 'realms/mech/missions-a.js', 'realms/mech/missions-b.js', 'realms/mech/missions-c.js', 'realms/mech/missions-d.js', 'gen-core.js', 'realms/mech/gen-a.js', 'realms/mech/gen-b.js', 'realms/mech/gen-c.js', 'realms/mech/gen-d.js', 'gameplay.js', 'realms/mech/experiments-a.js', 'realms/mech/experiments-b.js', 'realms/mech/experiments-c.js', 'realms/mech/experiments-d.js', 'realms/mech/variants-a.js', 'realms/mech/variants-b.js', 'realms/mech/variants-c.js', 'realms/mech/variants-d.js', 'realms/mech/practice-1.js', 'realms/mech/practice-2.js', 'realms/mech/practice-3.js', 'realms/mech/practice-4.js', 'realms/mech/practice-5.js', 'realms/mech/practice-6.js', 'realms/mech/practice-7.js', 'realms/mech/practice-8.js', 'variants.js', 'concept-lab.js', 'chapters.js', 'skip.js', 'realms/mech/glossary.js', 'glossary.js']
 },
 em: {
  title: 'Electricity and magnetism: fields',
  styles: ['styles.css', 'update.css'],
  scripts: ['realms/em/pack.js', 'realms/em/missions-a.js', 'realms/em/missions-b.js', 'realms/em/missions-c.js', 'realms/em/missions-d.js', 'gen-core.js', 'realms/em/gen-a.js', 'realms/em/gen-b.js', 'realms/em/gen-c.js', 'realms/em/gen-d.js', 'gameplay.js', 'realms/em/experiments-a.js', 'realms/em/experiments-b.js', 'realms/em/experiments-c.js', 'realms/em/experiments-d.js', 'realms/em/variants-a.js', 'realms/em/variants-b.js', 'realms/em/variants-c.js', 'realms/em/variants-d.js', 'realms/em/practice-1.js', 'realms/em/practice-2.js', 'realms/em/practice-3.js', 'realms/em/practice-4.js', 'realms/em/practice-5.js', 'realms/em/practice-6.js', 'realms/em/practice-7.js', 'realms/em/practice-8.js', 'variants.js', 'concept-lab.js', 'chapters.js', 'skip.js', 'realms/em/glossary.js', 'glossary.js']
 },
 waves: {
  title: 'Waves: sound and light',
  styles: ['styles.css', 'update.css'],
  scripts: ['realms/waves/pack.js', 'realms/waves/missions-a.js', 'realms/waves/missions-b.js', 'realms/waves/missions-c.js', 'realms/waves/missions-d.js', 'gen-core.js', 'realms/waves/gen-a.js', 'realms/waves/gen-b.js', 'realms/waves/gen-c.js', 'realms/waves/gen-d.js', 'gameplay.js', 'realms/waves/experiments-a.js', 'realms/waves/experiments-b.js', 'realms/waves/experiments-c.js', 'realms/waves/experiments-d.js', 'realms/waves/variants-a.js', 'realms/waves/variants-b.js', 'realms/waves/variants-c.js', 'realms/waves/variants-d.js', 'realms/waves/practice-1.js', 'realms/waves/practice-2.js', 'realms/waves/practice-3.js', 'realms/waves/practice-4.js', 'realms/waves/practice-5.js', 'realms/waves/practice-6.js', 'realms/waves/practice-7.js', 'realms/waves/practice-8.js', 'variants.js', 'concept-lab.js', 'chapters.js', 'skip.js', 'realms/waves/glossary.js', 'glossary.js']
 }
};
