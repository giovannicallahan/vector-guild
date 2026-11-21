# Save format 2 and the VGSave API (contract for engine and shell)

localStorage key `vector-guild-save-v2`. The 1.x key `vector-guild-save-v1` is never deleted or rewritten.

```
{ v: 2,
  seed: <int >= 0>,          // global; 0 = authored numbers (legacy saves)
  seeds: { <packId>: <int >= 0> },  // optional: a realm's own seed, used instead of `seed` for that realm only
  intro: <bool>,             // wormhole already shown
  realms: { <packId>: <slice> } }
```
`<slice>` is exactly the 1.4.1 save object without `seed`, using the pack's LOCAL mission ids:
`{solved, xp, points, tools, clean, revealed, landmarks, contracts, reviews, errors, rolls}`.

Rules
- First run with no v2 key: if a v1 save parses, `realms.la` = that object (seed moved to the top level, `seed` missing -> 0), `intro:false`. Otherwise a fresh save with a random non-zero seed and no realms.
- A slice whose pack is not loaded on the current page is NEVER normalised, recomputed or dropped. Only the realm page that loaded that pack validates its own slice.
- Total XP = sum of `realms[*].xp`.
- Generator numbers depend on (seed, local mission id, roll) exactly as in 1.4.1, where seed is `seeds[packId]` when present and valid, otherwise the global `seed`. Invalid `seeds` entries are ignored; an empty `seeds` is not stored.
- Importing a 1.x backup into an existing save replaces `realms.la` and sets `seeds.la` to the backup's seed (missing -> 0), so linear algebra keeps the backup's numbers while the global seed, and so every other realm's numbers, stay as they are. If the backup's seed equals the global seed no override is stored. `reset('la')` removes the override.
- A v2 backup is restored only when every realm slice is an object whose `solved` and `tools` are lists of strings; otherwise nothing is changed. The stored save itself is read leniently (any object slice), so slices of unknown packs are never rejected.
- A realm page that is open while its slice or seed is replaced in storage (restore or reset in another tab, or the page coming back from the back/forward cache) reloads instead of writing its old copy (`game/app.js`, `pageshow` and `storage` listeners).

`window.VGSave` (classic script `game/save-store.js`, no dependencies, safe when localStorage throws):
- `load()` -> whole v2 object (migrating if needed; never throws)
- `realm(id)` -> slice or null
- `putRealm(id, slice)` -> writes that slice only, leaves others untouched
- `seed(id?)` -> the seed for realm `id` (its override, else the global seed); without `id`, the global seed
- `totalXp()` / `introSeen()` / `setIntroSeen()`
- `exportAll()` -> v2 object for the backup file
- `importAny(obj)` -> accepts a v2 object or a 1.x object (becomes realms.la); returns {ok, error, kind}. `ok` is false, and nothing is changed, when the file is not a (complete) save or when the device could not store it (`error` says which)
- `reset(id)` -> removes one realm's slice; `resetAll()`
