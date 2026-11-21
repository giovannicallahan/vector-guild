# Collection core API (`window.VGCollection`)

Contract for the interface code (overlay, shell button, realm chip, `app.js` hooks). Rules are in
`docs/COLLECTION.md`; the save shape is in `docs/SAVE-V2.md`. Tests: `node qa/collection.test.js`.

## Loading

Classic scripts, any order among themselves, all before the code that calls them:

```
save-store.js                 window.VGSave            (required)
realms/registry.js            window.VG_REALMS         (mission counts; load it on the realm page too)
collection/figures.js         window.VG_FIGURES
collection/achievements.js    window.VG_ACHIEVEMENTS
collection/core.js            window.VGCollection
```

- The core has no DOM code and keeps no state of its own. Every call reads the save again, so the
  star map and a realm page open at once stay in step. Read `dust()` etc. again after any call
  that changes something; do not cache.
- Without `registry.js` a realm page only knows its own mission count, so "Foundations finished" /
  "Linear algebra finished" for the *other* realm wait until the star map is opened.
- Nothing throws. Missing data (`VG_FIGURES`, `VG_ACHIEVEMENTS`, even `VGSave`) gives empty results.
- The core never touches realm slices, XP, answers or hints.

## Where to call what

| Moment | Call |
|---|---|
| Star map loaded | `settle()` — pays missions and stars not yet paid (past work of a 2.0 player), checks achievements |
| Realm page loaded (after `app.js` has loaded its state) | `settle()` — also pays finished chapters of this realm |
| After a first solve (`award()` in `app.js`, after `save()`) | `settle(undefined, {perks: true})` — the only call that turns the perks on |
| After a landmark is built, a save is imported, a realm is reset | `settle()` (cheap; returns `[]` when nothing is new) |
| A review drill is passed on its first check | `onDrillDone()` — once per drill. Only on a pass, so wrong answers earn nothing |
| First wrong check of a mission, no help used yet | `if (VGCollection.useSecondLook(realmId, q.id))` keep the star (do not set `assisted`) |

`settle()` on a realm page finds the realm by itself from `window.REALM`, `window.CHAPTERS` and
`window.QUESTS`. The realm slice must be saved (`VGSave.putRealm`) before `settle()` is called,
because the core reads solved missions and stars from the save, not from the page.

Show what was earned with the returned events (`describe(events)` gives one line for a toast).

## Events

Every award function returns a list of events. Each has `type` and `dust` (stardust added, a whole number).

```
{ type: 'solve',       realm: 'la', qid: 'q07', dust: 10 }            // 11 with the stardust perk
{ type: 'star',        realm: 'la', qid: 'q07', dust: 5 }             // 6 with the stardust perk
{ type: 'chapter',     realm: 'la', chapter: 0, name: 'Chapter name', dust: 25 }   // chapter is 0-based; 40 with the chapter perk
{ type: 'drill',       dust: 2 }                                      // 4 with the drill perk
{ type: 'achievement', id: 'solve-5', name: 'Finding your feet', text: 'Solve 5 missions.', dust: 20 }
```

Order in `settle()`: per realm, each mission's `solve` then its `star`; then that realm's `chapter`
events; achievements last. The first `settle()` of a 2.0 player can return a hundred events or more:
show a summary, not one toast each.

## Stardust

| Call | Returns |
|---|---|
| `settle(realmCtx?, opts?)` | `Event[]`. Pays every solved mission, first-try star and finished chapter not yet in `meta.paid`, then checks achievements. Idempotent. `[]` when nothing is new or the device could not store it. `realmCtx` is optional: `{id, chapters: [{index, name, ids}], missions?, ids?}`; left out, the realm on the page (if any). Chapters are only paid for the realm in `realmCtx`. `opts.perks === true` (only right after a solve the player has just made) applies the equipped figure's stardust perk, and its chapter perk to a chapter completed by a mission paid in this same call; without it everything is paid at the base rates, so past work never earns a perk bonus. |
| `onDrillDone()` | `Event[]`: one `drill` event, then any achievements. Counts one drill each call. `[]` if it could not be stored. |
| `dust()` | Stardust in hand. |
| `earned()` | Lifetime stardust (awards only; refunds from duplicates are not counted). |
| `summary(events)` | `{dust, solves, stars, chapters, drills, achievements: Event[]}`. |
| `describe(events)` | One short line, e.g. `+45 stardust · 2 missions solved, first-try star, achievement: Ten down`. `''` when there is nothing. |
| `pageRealm()` | The `realmCtx` built from `REALM` / `CHAPTERS` / `QUESTS`, or `null` on a page without them. |

## Summon

| Call | Returns |
|---|---|
| `cost()` | Price of the next summon: `0` while the first one is still free, then `60`. |
| `canPull()` | `true` when there are figures and the stardust covers `cost()`. |
| `odds()` | The chances of the next summon (show these to the player): `{common: 0.70, rare: 0.24, legendary: 0.06}`, or `{0, 0.8, 0.2}` when the rare guarantee is due, or `{0, 0, 1}` when the legendary one is. Built from the same helper as `rollRarity()`. |
| `baseOdds()` | The usual chances, `{common: 0.70, rare: 0.24, legendary: 0.06}`, whatever the counters say. |
| `guarantees()` | `{rareEvery: 5, legendEvery: 20, rareIn, legendIn}`. `rareIn` / `legendIn` = summons left until the guarantee applies at the latest (1 = the next one). |
| `pull(rng?, opts?)` | See below. `opts.expect`: the price the player was shown; if the real price differs, nothing is taken (`reason: 'price'`). `rng` is an optional function returning a number in `[0, 1)`; two numbers are used (rarity, then figure). Default: `crypto.getRandomValues`, else `Math.random`. |

`pull()` success:

```
{ ok: true,
  figure,            // the VG_FIGURES entry
  rarity,            // 'common' | 'rare' | 'legendary'
  duplicate,         // true when it was already owned
  refund,            // 0, or 20 / 35 / 60 for a duplicate (already added to the stardust)
  free,              // true for the first summon ever
  cost,              // what was taken: 0 or 60
  count, stars,      // copies now owned; stars = min(count, 5)
  dust,              // stardust in hand afterwards
  events }           // achievement events earned by this summon (their dust is already in `dust`)
```

`pull()` failure, nothing changed: `{ok: false, reason}` with `reason` =
`'dust'` (also `cost`, `dust`), `'price'` (the price is not the one in `opts.expect`; also `cost`, `dust`),
`'empty'` (no figure list) or `'storage'` (device could not store it).

Guarantees: after 4 commons in a row the next is rare or better (legendary with chance 6 in 30);
after 19 summons without a legendary the next is legendary. Within a rarity every figure is equally likely.

## Figures, equipping, perks

A figure row: `{figure, id, rarity, perk, owned, count, stars, equipped}` where `figure` is the
`VG_FIGURES` entry, `perk` is `{id, name, text}` or `null`, `count` is copies owned (0 when not found
yet), `stars` is `min(count, 5)`.

| Call | Returns |
|---|---|
| `figures()` | A row for every figure, in data order (use for the Figures grid; `owned: false` = "Not found yet"). |
| `owned()` | Rows of owned figures only. |
| `figure(id)` | The `VG_FIGURES` entry or `null`. |
| `counts()` | `{owned, total, copies, byRarity: {common: {owned, total}, rare: {...}, legendary: {...}}}`. |
| `equip(id)` | `{ok, events}`; `equip(null)` takes the figure off. Failure: `{ok: false, reason: 'not-owned' | 'unknown' | 'storage', events: []}`. `events` may hold the "figure equipped" achievement. |
| `equipped()` | The equipped figure's row, or `null`. |
| `perk()` | Perk id in effect: `'stardust' | 'chapter' | 'secondlook' | 'drill'`, or `null`. The data's legacy id `'xp'` is reported as `'chapter'`. |
| `perkInfo(perkId)` | `{id, name, text}` in plain words for any perk id (accepts `'xp'`), or `null`. Also `PERKS`. |
| `secondLookAvailable(realmId, qid)` | `true` when the second-look perk is equipped and not yet used on that mission. Does not use it. |
| `useSecondLook(realmId, qid)` | Uses it. `true` = keep the first-try star for this wrong check; `false` = no perk, already used, or not stored. Kept in the save (`meta.looks`), so it stays used after a reload. |

The stardust, chapter and drill perks are applied inside `settle(…, {perks: true})` / `onDrillDone()`; the
interface does nothing for them beyond passing `{perks: true}` after a solve. Only `secondlook` needs the hook in `app.js`.

## Achievements

| Call | Returns |
|---|---|
| `achievements()` | `[{id, name, text, reward, earned, progress}]`, earned ones first, each group in list order. `progress` is `{have, need}` where it can be counted, else `null`. |
| `context()` | The achievement context (below), for debugging and tests. |

Achievements are awarded inside `settle()`, `onDrillDone()`, `pull()` and `equip()`; each is paid once.

### Achievement context

Built from the save only (realm slices, `meta`), plus the registry's mission counts and the figure list:

```
{ solved, stars, chapters, landmarks,     // totals over every realm
  realmsWithSolves,                       // realms with at least one solved mission
  practice,                               // practice missions solved (ids like q01b); part of `solved`
  realms: { <id>: { solved, stars, chapters, landmarks, missions, finished, learn, learned, complete } },
  landmarkRealm,                          // one realm with every concept learned has as many landmarks as chapters
  drills, pulls,
  figures, copiesMax, legendary, equipped,
  fieldBest: {have, need}, fieldDone }
```

- `chapters` counts chapters already paid (`meta.paid[realm].chapters`), so it grows on realm pages.
- `missions` comes from `VG_REALMS` (or the realm page) and counts learn and practice missions; `finished` = solved count reaches it.
- `learn` is the number of learn missions (the registry part's `learn`, or the realm page's count; equal to `missions` for a realm without practice); `learned` counts solved ids that are not practice ids (`q01b`); `complete` = `learned` reaches `learn`. Chapters and landmarks depend on learn missions only (docs/PACK-FORMAT.md §10).
- `fieldBest` is the field closest to complete. Fields with a single figure are ignored when a larger field exists.

## Other

| Member | Meaning |
|---|---|
| `RULES` | The numbers: `solve, star, chapter, drill, cost, rates, rareEvery, legendEvery, refund, maxStars, perkStardust, perkChapter, perkDrill`. Frozen. |
| `RARITIES` | `['common', 'rare', 'legendary']`. |
| `state()` | A copy of `meta` (same as `VGSave.meta()`). |
| `stored()` | `false` when the last change could not reach the device's storage. |
| `rollRarity(x, sinceRare, sinceLegend)` | The rarity for one random number `x`; used by the tests. |

## Storage that fails

- The device reads the save but cannot write it (full): award calls return `[]`, `pull()` / `equip()`
  return `reason: 'storage'`, nothing changes, `stored()` is `false`.
- Storage is blocked altogether: the page keeps the collection in memory (as it already does for
  realm progress), calls succeed, `stored()` is `false`. It is gone on the next page.
