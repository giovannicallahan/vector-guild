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
 }
};
