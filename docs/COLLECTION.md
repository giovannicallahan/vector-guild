# Achievements, stardust and the collection (MathCosmos 2.1)

Decided by Giovanni on 2026-11-21: achievements and earned tokens; tokens buy random pulls of
historical mathematicians, scientists and physicists; each figure is a drawn emblem avatar with a
short verified biography and one mild perk when equipped; no real money; nothing changes answers or
skips the maths. Everything below that he did not state is Claude's call.

## Rules that must hold

- Classic scripts only (the Android app loads `file://`): no ES modules, no `fetch`.
- Save keys, app id and website path do not change. Linear algebra numbers stay identical to 1.4.1.
- The collection is global (shared by all realms). It lives in the v2 save under `meta`.
- A 2.0 save with no `meta` loads without loss. Export and import carry `meta`. A 1.x import leaves
  `meta` alone. `reset(realm)` leaves `meta` alone. `resetAll` clears it.
- Token awards are idempotent: replaying, re-importing or reloading never pays twice.
- Odds are shown to the player. There is no purchase with real money anywhere.

## Save shape

```
meta: {
  v: 1,
  dust: 0,              // stardust in hand
  earned: 0,            // lifetime stardust
  owned: { <figureId>: <count> },
  equipped: <figureId> | null,
  ach: [ <achievementId>, ... ],
  pulls: 0,             // total pulls made
  sinceRare: 0,         // pulls since a rare or legendary
  sinceLegend: 0,       // pulls since a legendary
  paid: { <realmId>: { solved: [qid...], clean: [qid...], chapters: [n...] } },
  drills: 0             // review drills completed (counted once each)
}
```

`VGSave` gains `meta()` (returns a normalised copy) and `putMeta(meta)` (returns false if nothing
could be stored). Unknown figure or achievement ids in a save are kept, not dropped.

## Stardust

| Event | Stardust |
|---|---|
| First solve of a mission | 10 |
| That solve earned the first-try star | +5 |
| Chapter completed | 25 |
| Review drill completed | 2 |
| Achievement | its reward |

On load, any solved mission, star or finished chapter not yet in `meta.paid` is paid (so a 2.0 or
1.4.1 player gets stardust for past work). Drills completed before 2.1 are not paid.
Past work is always paid at the base rates in the table, whatever figure is equipped at the time: a perk
counts only for a mission solved now (and a chapter that solve completes). The star map does not know a
realm's chapters, so a finished chapter is paid when that realm is next opened.

## Pulls

- Cost 60 stardust. The first pull ever is free.
- Rates: common 70%, rare 24%, legendary 6%.
- Guarantees: a rare or better at least every 5th pull; a legendary at least every 20th pull.
- Within a rarity every figure is equally likely.
- The chances shown are those of the next summon: when a guarantee is due they show it (0 / 80 / 20, or
  legendary 100%), with the usual chances in one line beside them.
- The summon button states its price, and a summon never takes a different price from the one shown.
- A duplicate raises that figure's count (shown as stars, up to 5) and refunds 20 / 35 / 60 stardust
  for common / rare / legendary.
- Random numbers come from `crypto.getRandomValues` with a `Math.random` fallback; the function
  takes an injectable source so tests are deterministic.

## Perks (only the equipped figure's perk applies)

| Perk id | Effect |
|---|---|
| `stardust` | Mission stardust +10%, rounded up |
| `chapter` | +15 stardust for each chapter completed while equipped |
| `secondlook` | Once per mission, a wrong first check does not cost the first-try star |
| `drill` | Review drills give double stardust |

No perk changes XP, answers, hints shown or what counts as solved.

## Achievements

About 28, defined in `game/collection/achievements.js`, each `{id, name, text, reward, test(ctx)}`
where `ctx` is built only from the save (all realm slices, `meta`, the realm registry and the figure
list). Cover: first solve; 5, 10, 25, 50 and 100 missions; first first-try star; 10 and 25 stars; one
chapter; three chapters; Foundations finished; linear algebra finished; missions solved in two
realms; first drill; 10 drills; first pull; 5, 15 and 30 different figures; a legendary; a figure at
5 stars; a figure equipped; every figure of one field; a landmark bought; every landmark of a realm.
Rewards run from 15 to 150 stardust. Names are plain and friendly; no jargon.

## Files

- `game/collection/figures.js` — `window.VG_FIGURES` (written by the research workflow; do not edit).
- `game/collection/achievements.js` — `window.VG_ACHIEVEMENTS`.
- `game/collection/core.js` — `window.VGCollection`: pure logic over `VGSave` (settle awards, pull,
  equip, perk lookups, achievement checks). No DOM.
- `game/collection/ui.js` + `game/collection/collection.css` — the overlay (Summon, Figures,
  Achievements), toasts, and the small avatar chip. Used by both pages.
- Shell (`game/index.html`): a "Collection" button with the stardust count opens the overlay.
- Realm (`game/realm.html`, `game/app.js`): chip with equipped emblem and stardust in the top bar;
  awards settle after each solve, drill and chapter; a toast names what was earned.

## Interface

- Overlay tabs: Summon (cost, odds, guarantees, pull button, reveal), Figures (grid; unowned figures
  show a dim outline and "Not found yet"), Achievements (earned first, then the rest with progress
  where it is countable).
- Figure card: emblem, name, years, place, field, known for, biography, the idea in one sentence,
  perk in plain words, source links, Equip button.
- Text is at least 11px, controls at least 44px, works at 375px, honours reduced motion, fully
  usable by keyboard and screen reader (dialog semantics, focus returned on close).

## Checks

- `qa/collection.test.js`: award idempotency, retroactive payment, pull rates within tolerance over
  100,000 seeded pulls, both guarantees, duplicate refunds, perks, every achievement reachable and
  paid once, 2.0 save loads unchanged, export/import round trip, storage failure.
- `qa/collection-ui.test.js`: the interface on a stand-in page: toasts and the page's dialogs, the summon
  button's price, the chances shown, the chip's word and name, the phone top bar.
- `qa/realm-collection.test.js`: the collection on the realm page, for both packs.
- `qa/collection-data.test.js`: the figure data (written by the research workflow).
- All existing QA commands still pass.
