# Save format 2 and the VGSave API (contract for engine and shell)

localStorage key `vector-guild-save-v2`. The 1.x key `vector-guild-save-v1` is never deleted or rewritten.

```
{ v: 2,
  seed: <int >= 0>,          // global; 0 = authored numbers (legacy saves)
  intro: <bool>,             // wormhole already shown
  realms: { <packId>: <slice> } }
```
`<slice>` is exactly the 1.4.1 save object without `seed`, using the pack's LOCAL mission ids:
`{solved, xp, points, tools, clean, revealed, landmarks, contracts, reviews, errors, rolls}`.

Rules
- First run with no v2 key: if a v1 save parses, `realms.la` = that object (seed moved to the top level, `seed` missing -> 0), `intro:false`. Otherwise a fresh save with a random non-zero seed and no realms.
- A slice whose pack is not loaded on the current page is NEVER normalised, recomputed or dropped. Only the realm page that loaded that pack validates its own slice.
- Total XP = sum of `realms[*].xp`.
- Generator numbers depend on (seed, local mission id, roll) exactly as in 1.4.1.

`window.VGSave` (classic script `game/save-store.js`, no dependencies, safe when localStorage throws):
- `load()` -> whole v2 object (migrating if needed; never throws)
- `realm(id)` -> slice or null
- `putRealm(id, slice)` -> writes that slice only, leaves others untouched
- `seed()` / `totalXp()` / `introSeen()` / `setIntroSeen()`
- `exportAll()` -> v2 object for the backup file
- `importAny(obj)` -> accepts a v2 object or a 1.x object (becomes realms.la); returns {ok, error}
- `reset(id)` -> removes one realm's slice; `resetAll()`
