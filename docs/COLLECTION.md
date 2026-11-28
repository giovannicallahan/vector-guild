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
  drills: 0,            // review drills completed (counted once each)
  daily: { ... }        // the daily review (2.3), see "Daily review"; absent in older saves
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

About 29, defined in `game/collection/achievements.js`, each `{id, name, text, reward, test(ctx)}`
where `ctx` is built only from the save (all realm slices, `meta`, the realm registry and the figure
list). Cover: first solve; 5, 10, 25, 50 and 100 missions; first first-try star; 10 and 25 stars; one
chapter; three chapters; every Foundations concept learned (its 40 learn missions); every Foundations
mission solved, practice included (160); linear algebra finished; missions solved in two
realms; first drill; 10 drills; first pull; 5, 15 and 30 different figures; a legendary; a figure at
5 stars; a figure equipped; every figure of one field; a landmark bought; every landmark of a realm.
Rewards run from 15 to 150 stardust. Names are plain and friendly; no jargon.
The two per realm (`<id>-done`, every concept learned, and `<id>-master`, every mission) are made from each ready
registry part's `ach` entry (`game/realms/registry.js`), so a pack added by `tools/new-pack.js` brings its own pair
(`docs/PACK-SPEC.md`); about 29 plus two per pack added after Calculus 1.

## Daily review (2.3)

Once per local calendar day the home page and each realm page show a "Daily review" card: three short
problems with fresh numbers, drawn from missions the player has already solved, answered in the card.

- **Where the problems come from.** The same problem models, number reading and check as a review drill
  (`Variants.make` / `Variants.check`). A realm page uses that realm only. The home page uses every realm with
  solved missions; it loads no pack itself, so when the player starts, each realm's pack scripts are loaded into
  a hidden same-origin frame (packs reuse mission ids, so they cannot share a page).
- **Which missions.** One entry per solved concept (a practice mission `q07b` counts for `q07`). The draw is
  weighted: `1 + days since it was last practised (0 to 60; 60 when never) + (30 + 5 per notebook miss, up to
  6, while its notebook entry is open)`. "Practised" means a review drill (`reviews[id].last`) or an earlier
  daily review (`meta.daily.seen`); the save keeps no time for the solve itself. Three different concepts when
  there are three; with fewer, they come round again with new numbers.
- **A miss.** The card shows the answer and the working, then gives the same concept once more with new
  numbers. After a second miss it moves on ("This one will come back another day"). Finishing means having
  worked through all three, so a review can always be finished.
- **Unlock.** Three solved missions (in that realm, on a realm page). Until then the card says so.
- **Pay.** Finishing pays 15 stardust once per day. A day streak counts days in a row; streaks of 3, 7, 14 and
  30 days pay 20, 40, 80 and 150 once each, ever. Since 2.8 the streak forgives: one missed day is a rest day
  and the streak carries on over it, at most once in any seven days (`daily.rests` lists the missed days used).
  Two missed days in a row, or a second rest within seven days, set the streak back to 0 and take nothing away
  (stardust, figures and the best streak stay); the card says so without blame.
- **Days played this week** (2.8, home card only): seven dots, Monday to Sunday. A day counts when the player
  solved a mission, finished a drill, a daily review or a five-minute run. `meta.played` holds those local day
  numbers for the last 14 days (absent in older saves; the last daily review day also counts).
- **Never twice.** `VGCollection.onDailyDone(day)` is the only place that pays. `day` is the local calendar day
  as whole days since 1970. It pays only when `day` is later than `meta.daily.day`, so a reload, a second tab,
  a re-import of the same backup, or a device clock set back pays nothing. With the clock set back, the card
  says the next review opens once the date has passed the last paid day.
- **Not changed by it.** Realm slices: XP, solved missions, the spaced review schedule and the error notebook
  are untouched (the realm page keeps its slice in memory, so the card must not write it).

```
meta.daily: {             // absent until the player first makes progress; older saves load unchanged
  day: <n> | null,        // last day paid
  streak: 0,              // days in a row ending on `day`
  best: 0,                // longest streak
  paid: [3, 7],           // streak milestones already paid
  rests: [20400],         // since 2.8, only once used: missed days the streak rested over
  at: { day, n },         // problems done on a day not finished yet (dropped when the day is paid)
  seen: { "<realm>:<qid>": <day> }   // when a concept was last passed in a daily review (at most 400)
}
```

Export and import carry it with the rest of `meta`; a 1.x import and `reset(realm)` leave it; `resetAll`
clears it. The date source is injectable: `VGDaily.setClock(() => Date)`, or `window.VG_DAILY_NOW` set before
`daily.js` loads. Files: `game/daily.js`, `game/daily.css` (loaded on the home page by `index.html` and on
realm pages through `VG_REALM_SHARED`); the home page has one slot for the card (`.vgh-daily`, `shell/home.js`);
on a realm page the card puts itself after the review-drill bar. Checks: `qa/daily.test.js`.

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
