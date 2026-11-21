# Save format 2 and the VGSave API (contract for engine and shell)

localStorage key `vector-guild-save-v2`. The 1.x key `vector-guild-save-v1` is never deleted or rewritten.

```
{ v: 2,
  seed: <int >= 0>,          // global; 0 = authored numbers (legacy saves)
  seeds: { <packId>: <int >= 0> },  // optional: a realm's own seed, used instead of `seed` for that realm only
  intro: <bool>,             // wormhole already shown
  realms: { <packId>: <slice> },
  meta: <collection> }       // optional, since 2.1: stardust, figures, achievements (global, see below)
```
`<slice>` is exactly the 1.4.1 save object without `seed`, using the pack's LOCAL mission ids:
`{solved, xp, points, tools, clean, revealed, landmarks, contracts, reviews, errors, rolls}`.
Since 2.3 a slice may also hold `skips` (the skip-ahead check, `game/skip.js`): `{ "<chapter index>": { last, miss: [learn ids], seen, n } }`, one record per chapter whose check was failed and that is not complete yet. A save without `skips` loads as before; a damaged record is dropped; a mission passed by a check is stored exactly like a solved one.
Since 2.3 `meta` may also hold `daily` (the daily review, `game/daily.js`, rules in `docs/COLLECTION.md`): the last finished day, the day streak, the best streak, the streak rewards already paid and the missions recently asked. It is kept only when the save has one, is made safe on every read, and travels with the backup.

Rules
- First run with no v2 key: if a v1 save parses, `realms.la` = that object (seed moved to the top level, `seed` missing -> 0), `intro:false`. Otherwise a fresh save with a random non-zero seed and no realms.
- A slice whose pack is not loaded on the current page is NEVER normalised, recomputed or dropped. Only the realm page that loaded that pack validates its own slice.
- Total XP = sum of `realms[*].xp`.
- Generator numbers depend on (seed, local mission id, roll) exactly as in 1.4.1, where seed is `seeds[packId]` when present and valid, otherwise the global `seed`. Invalid `seeds` entries are ignored; an empty `seeds` is not stored. `rolls[id]` is still one integer per mission. "Reveal solution" raises it by at least one: the engine skips rolls that would draw the same problem again (same prompt, or the same answers where the mission has enough different answers), looking at most 24 rolls ahead.
- Importing a 1.x backup into an existing save replaces `realms.la` and sets `seeds.la` to the backup's seed (missing -> 0), so linear algebra keeps the backup's numbers while the global seed, and so every other realm's numbers, stay as they are. If the backup's seed equals the global seed no override is stored. `reset('la')` removes the override.
- A v2 backup is restored only when every realm slice is an object whose `solved` and `tools` are lists of strings; otherwise nothing is changed. The stored save itself is read leniently (any object slice), so slices of unknown packs are never rejected.
- A realm page that is open while its slice or seed is replaced in storage (restore or reset in another tab, or the page coming back from the back/forward cache) reloads instead of writing its old copy (`game/app.js`, `pageshow` and `storage` listeners).

The collection (`meta`, since 2.1; rules in `docs/COLLECTION.md`, logic in `game/collection/core.js`)

```
meta: { v: 1,
  dust, earned,                      // stardust in hand, lifetime stardust
  owned: { <figureId>: <count> },    // counts >= 1
  equipped: <figureId> | null,       // always an owned figure
  ach: [ <achievementId> ],
  pulls, sinceRare, sinceLegend,     // pull counters
  paid: { <realmId>: { solved: [qid], clean: [qid], chapters: [n] } },   // what stardust was already paid for
  drills,                            // review drills counted
  looks: { <realmId>: [qid] } }      // missions where the "second look" perk was already used
```
- A save without `meta` (2.0) loads unchanged and stays without `meta` until something is earned. `meta()` then returns an empty collection.
- `meta` is normalised whenever it is read or written: counts become whole numbers >= 0, lists lose duplicates and wrong types, `equipped` must be owned. Figure and achievement ids this build does not know are kept, and so are fields it does not know.
- `putRealm`, `reset(id)` and a 1.x import leave `meta` alone. `resetAll()` removes it.
- A v2 backup with `meta` replaces the collection. A v2 backup without `meta` (made by 2.0) keeps the collection already on the device.
- `meta.paid` is what makes stardust idempotent: a mission, star or chapter listed there is never paid again, also after a realm reset or a restore.

`window.VGSave` (classic script `game/save-store.js`, no dependencies, safe when localStorage throws):
- `load()` -> whole v2 object (migrating if needed; never throws)
- `realm(id)` -> slice or null
- `putRealm(id, slice)` -> writes that slice only, leaves others untouched
- `seed(id?)` -> the seed for realm `id` (its override, else the global seed); without `id`, the global seed
- `totalXp()` / `introSeen()` / `setIntroSeen()`
- `meta()` -> normalised copy of the collection (an empty one when the save has none)
- `putMeta(meta)` -> stores the collection only; returns false if nothing could be stored
- `exportAll()` -> v2 object for the backup file (with `meta` when there is one)
- `importAny(obj)` -> accepts a v2 object or a 1.x object (becomes realms.la); returns {ok, error, kind}. `ok` is false, and nothing is changed, when the file is not a (complete) save or when the device could not store it (`error` says which)
- `reset(id)` -> removes one realm's slice; `resetAll()`
