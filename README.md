# MathCosmos for Android

**Current: version 2.9.0, 2,512 missions in fifteen realms** — Linear algebra 272 (68 concepts, each with one learn and three practice missions), and 160 each for Foundations, Calculus 1, Calculus 2, Calculus 3, Probability, Data and inference, Logic and proof, Discrete mathematics, Number theory, Graph theory, Abstract algebra, Differential equations, Real analysis, and Complex analysis. Sections further down describe each version in turn; "68 missions" there means versions up to 1.4.1.

Offline Android WebView app. Game files live in `game/` and are copied into the APK on each build. JavaScript progress is stored on the device; Save & settings includes JSON backup import and export using Android's file picker.

Build with JDK 17 or 21, Android SDK Platform 37, Android build tools, Gradle 9.6.0, and Android Gradle Plugin 9.5.1:

```sh
gradle assembleDebug
```

The APK is written to `app/build/outputs/apk/debug/app-debug.apk`. The debug APK is signed with the local Android debug key. No network permission is requested. The stylesheets contain no online font import; the font names fall back to system fonts.

For a direct build without Gradle, run `build-apk.sh` with `ANDROID_PLATFORM_JAR` and `ANDROID_BUILD_TOOLS` pointing to an installed Android SDK platform and build-tools, and `SIGNING_KEYSTORE`, `SIGNING_ALIAS`, and `SIGNING_PASSWORD` set. Use your own development keystore to build the source. Installing an update over an existing APK requires the same signing key as that APK.

## Version 1.2

Version 1.2 adds interactive docking trials in selected missions and linked engineering contracts, while retaining existing progress and the offline 68-mission curriculum. Run `node qa/harness.js` for the content and gameplay checks. Additional browser checks are in `qa/mechanics-browser.js` and require its documented local Chrome/Playwright environment. The APK is built with API 37 and minSdk 23. No Android device or emulator test was available for this release.

## Version 1.3

Version 1.3 is a review patch on 1.2. Saves from 1.1 and 1.2 load unchanged.

- **Fixes:** the QA harness finds the game folder relative to itself; the contract shuttle's flame draws; contract buttons are labelled per job; the brand link returns to the campaign; lessons are no longer printed twice; closing a dialog keeps focus and open panels; formula text has tidy numbers; Android Back returns to the campaign before leaving; fold and split-screen changes no longer restart the page; all controls are at least 44 px; the six sections fit a phone without scrolling the menu.
- **No preloaded answers:** docking trials report direction only, the in-mission labs open on practice numbers, the actuator trial uses its own demand, and after "Reveal solution" the reward needs one check with fresh numbers (`game/variants.js`).
- **Chapters:** missions follow one recommended order in eight chapters (`game/chapters.js`). A finished chapter unlocks an outpost landmark.
- **Economy:** three more workshop tools, eight landmarks at 6 skill points, a rank step about every ten missions, and a first-try star for unassisted solves.
- **Contract board:** three contracts, each needing missions from different chapters and one commissioning problem; each pays 3 skill points (`game/board.js`).
- **Review drill:** one fresh-numbers question from a solved mission, favouring the least-reviewed.
- **Concept bench:** the working and the other outputs appear only after the prediction is checked.

Checks: `node qa/harness.js`, and `node qa/mechanics-browser.js` (needs Playwright; set `CHROMIUM_PATH` to use a specific Chromium). The Java and manifest changes were not compiled or run on a device for this patch.

## Version 1.4

Version 1.4 adds generated numbers, dated review, hands-on widgets, fraction input and an error notebook. Saves from 1.1 to 1.3 load unchanged and keep the authored numbers for missions they have not solved yet.

- **Generated missions (`game/gen-core.js`, `game/gen-a.js` to `gen-d.js`):** every mission has a generator with three parts: `canonical` (the authored parameters), `draw` (new parameters from a seeded source) and `build` (prompt, answer, hints, solution and guided steps for those parameters). A new save gets a random seed, so its numbers differ from other saves but stay the same between visits. Revealing a solution gives that mission new numbers on the next visit. Solved missions use new numbers on every practice visit.
- **Dated review:** a passed drill returns after 1, 3, 7, 16, 35 and then 90 days; a miss returns the next day. Drills are chosen in this order: due, open notebook entries, never reviewed, next due.
- **Hands-on widgets (`game/handson.js`):** drag-to-explore views for projection (q18), least squares (q21) and eigenvectors (q24). They never fill in answers or write progress.
- **Fractions:** answers accept `7/6`, `-3/4`, `1 1/2` and decimal commas. A link under the answer boxes switches the keyboard so the `/` key is available.
- **Error notebook:** each missed check is logged per mission, with the pitfall the player marks. It is shown at the top of the field guide, and open entries are drilled first.

Checks: `node qa/harness.js`, `node qa/generators.js` (generators against the authored missions and against the independent answer oracles in `qa/oracle-*.js`), `node qa/mechanics-browser.js` and `node qa/handson-browser.js` (both need Playwright). `node qa/show-mission.js q12 --draw 3` prints generated versions of one mission.

## Version 1.4.1

A correction release from an outside review of 1.4.

- **Workshop accuracy:** the 3 × 3 solver, the 2 × 2 solver, the line fitter and the eigen analyzer judged "zero" with fixed cut-offs, so they rejected solvable systems with small entries, rejected distinct points spaced closely, and reported small distinct eigenvalues as one. Every such test is now relative to the size of the numbers entered, and two different eigenvalues are never printed as the same text. The arithmetic is in one function, `toolResult` in `game/app.js`, and is tested in `qa/harness.js`.
- **q16 wording:** the prompt now asks for the allowed vector with the given z, then for the dimension of the whole intersection, counted before z is fixed.
- **Levels:** one level per 300 XP, shown beside the rank and on the campaign strip, and announced when crossed.
- **Mira's spoken briefing** includes the concept explanation again. The written card stays short because the lesson is printed below it.

## Version 2.0 (engine)

Version 2.0 turns the game into realms. Linear algebra is now one realm pack and plays exactly as 1.4.1 (same text, layout and numbers for the same seed); Foundations is a second pack of 40 missions. This section covers the engine; the star map is described with the shell.

- **One pack per page:** `game/realm.html?realm=<id>` (default `la`) loads the scripts listed for that pack in `game/realms/packs.js`, then `app.js`. An unknown pack returns to the star map (`index.html`). The brand link and Android Back step outwards: dialog, campaign, star map. A "Star map" control sits beside the brand.
- **Pack config:** `game/realms/<id>/pack.js` sets `window.REALM`: chapters, sectors, landmarks and their cost, ranks, tiers, source rule, features, mentor and page text. `app.js`, `gameplay.js`, `chapters.js` and `variants.js` read it. Tools a pack does not use (workshop, contracts, board, docking, hands-on widgets, 3D and 2D labs) are not loaded or called.
- **Save format 2 (`game/save-store.js`, `docs/SAVE-V2.md`):** one save holds every realm, each with its own slice; the seed is shared. A 1.x save is migrated into the linear algebra slice on first run and the 1.x entry is never changed. Export writes every realm; import takes a 2.0 or a 1.x backup; reset clears the current realm only.
- **Foundations (`game/realms/found/`):** 7 chapters and 40 missions (q01–q40), each with a generator, an independent oracle (`qa/realms/found/`), a concept-bench experiment and a review drill; OpenStax sources; no workshop or contracts. The format for content authors is in `docs/PACK-FORMAT.md`.

Checks: `node qa/harness.js` and `node qa/generators.js --strict --draws 1000` (linear algebra, as before); `node qa/harness.js --realm found` and `node qa/generators.js --realm found --strict --draws 1000`; `node qa/save-store.test.js`; `node qa/shell.test.js`. `node qa/harness.js --realm found --complete` also fails if a declared mission is missing. `qa/generators.js` now fails when a mission has no generator or no oracle. The Playwright scripts were updated for `realm.html` and the 2.0 save but were not run (they do not run on this Mac). The Android app files are unchanged and no APK was built.

## Version 2.2

Version 2.2 adds practice missions to Foundations, drop-down chapters, the home page after the wormhole and a brighter realm page. Saves from 2.1 and earlier load unchanged; save keys, the app id and the linear algebra numbers are the same.

- **Practice missions (`game/realms/found/practice-1.js` to `practice-8.js`):** each of the 40 concepts has three optional practice missions (`q01b` a new setting, `q01c` an applied word problem, `q01d` a challenge), 120 in all, so Foundations has 160 missions. Each has its own generator and its own oracle (`qa/realms/found/oracle-p1.js` to `oracle-p8.js`). A practice mission unlocks when its concept is learned and inherits its lesson, bench and tier. A chapter is complete on its learn missions alone and mastered when its practice is solved too. The format is in `docs/PACK-FORMAT.md`, section 10.
- **Ranks:** Foundations ranks count every solved mission and the top rank needs all 160. A rank below the top is also held by concepts learned alone (`learnAt`), so a 2.1 save keeps its rank up to the second-highest rank. Linear algebra ranks are unchanged.
- **Drop-downs:** campaign, skill tree, field guide and artifacts show one drop-down per chapter, in both realms.
- **Home page (`game/shell/home.js`):** the wormhole ends on a home page with one card per realm, a Collection button, Replay intro and save backup. The soft-lock note on a realm follows the learn missions of the realm it builds on, not its optional practice.
- **Look (`game/life.css`, `game/life.js`):** chapter colours, larger text (12px floor, 16px body), a short burst and counting numbers on a solve; all motion is off under reduced motion.
- **Collection:** one new achievement, "Bedrock" (every Foundations mission, practice included). "Solid ground" keeps its 2.1 meaning: every concept learned.

Checks: the 2.0 commands, plus `node qa/harness.js --realm found --complete --complete-practice` (fails if any of the 120 practice missions is missing), `node qa/styles.test.js`, `node qa/collection.test.js`, `node qa/realm-collection.test.js`, `node qa/collection-data.test.js` and `node qa/home.test.js`. The Playwright scripts were not run. The Android version is 2.2 (versionCode 9); no APK was built.

## Version 2.3

Version 2.3 adds practice missions to linear algebra, a skip-ahead check, tap-to-define words, a daily review and install from the website. Saves from 2.2 and earlier load unchanged; save keys and the app id are the same, and the 68 linear algebra learn missions give the same numbers and text as 1.4.1.

- **Linear algebra practice (`game/realms/la/practice-1.js` to `practice-14.js`):** each of the 68 concepts has three optional practice missions (`q01b` a new setting, `q01c` an applied problem, `q01d` a challenge), 204 in all, so linear algebra has 272 missions. Each has its own generator and its own oracle (`qa/realms/la/oracle-p1.js` to `oracle-p14.js`). The format is in `docs/PACK-FORMAT.md`, section 10.6.
- **Ranks:** linear algebra ranks count every solved mission. The 1.4.1 steps are kept as `learnAt`, so the learn missions alone climb the old ladder and no save is demoted. One new top rank, GUILD LUMINARY, needs all 272.
- **Skip-ahead check (`game/skip.js`):** a chapter that is not complete offers a check with one fresh problem from each of its learn missions, with no hints. Passing marks those missions solved (XP, skill points and stardust once, no first-try stars). Failing changes nothing except a short list of lessons to study; a new try needs one of them opened, or a new day.
- **Tap-to-define words (`game/glossary.js`):** 61 Foundations and 67 linear algebra terms are underlined in lessons, prompts, hints and solutions. A tap shows a one-sentence meaning, a small example and the mission that teaches the word. Mission text is not changed.
- **Daily review (`game/daily.js`):** once per day, a card on the home page and on each realm page asks three fresh problems from missions already solved. Finishing pays stardust once for that day and counts a day streak. It unlocks after three solved missions.
- **Install from the website (`game/install.js`, `game/sw.js`, `game/manifest.webmanifest`, `docs/INSTALL.md`):** on https the game can be installed and then plays offline. Nothing of this runs in the Android app (`file://`). Run `node tools/build-sw.js` after any change under `game/`.
- **Collection:** one new achievement, "Full span" (every linear algebra mission, practice included). "Master of arrows" keeps its meaning: every concept learned.

Checks: the 2.2 commands, plus `node qa/harness.js --complete --complete-practice` (fails if any of the 204 practice missions is missing), `node qa/skip.test.js`, `node qa/glossary.test.js`, `node qa/daily.test.js` and `node qa/install.test.js`. The Playwright scripts were not run. The Android version is 2.3 (versionCode 10); no APK was built.

## Version 2.4
- **Mira's recorded voice:** the 108 learn briefings of Foundations and linear algebra are recorded with a local open-source voice (Kokoro, `af_heart`). See `docs/VOICE.md`.

## Version 2.5
- **Calculus 1: change (`game/realms/calc1/`):** a third playable realm. 40 concepts in 7 chapters, from average rate of change and limits, through derivatives and their uses, to antiderivatives and the Fundamental Theorem of Calculus; each concept has a learn mission and three practice missions, 160 in all. Sources are OpenStax Calculus Volume 1. The plan is `docs/CALC1-PLAN.md`; the format is `docs/PACK-FORMAT.md`, section 11.
- Every mission has a generator and an independent oracle (`qa/realms/calc1/`); shared content rules moved to `qa/pack-checks.js`.
- 75 calculus terms in the tap-to-define glossary; two new achievements; Mira's 40 calculus briefings are recorded.
- MathCosmos now has 592 missions in three realms.

## Version 2.9.0

- Four new realms, each with 40 learn missions and 120 practice missions: Abstract algebra (patterns of moves), Differential equations, Real analysis, Complex analysis (the plane of numbers).
- Every new mission draws fresh numbers each time and is checked against an independently written answer checker.
- Every cited textbook page was re-opened and matched to its mission. Each realm was reviewed by an outside model (Codex) and its confirmed findings fixed. Antigravity was not used for this release.
- Mira's 160 new briefings are recorded.
- Achievements for the first three realms keep their places in the list when a new realm joins their galaxy.
- MathCosmos now has 2,512 missions in fifteen realms.

## Version 2.8.0

Eight changes to how the game keeps you going. No missions were added or changed.

- Try it first: a learn mission lets you choose to read the lesson or go straight to the problem. After a miss, the lesson opens next to the problem.
- Slip feedback: a wrong answer names the kind of check to make (the sign, the decimal point, which box, a step counted twice), without giving the answer away.
- Next up: Mira's card lists up to three missions that are open now, mixing new concepts and practice.
- Sector scenes: finishing a sector's learn missions plays a short scene about what you learned and what comes next. Each can be replayed.
- Mastery: each concept shows bronze (learn mission solved), silver (two practice missions) or gold (all practice).
- Five-minute run: three to five quick problems mixed from every realm you have played. The first run each day pays 10 stardust.
- Forgiving streak: one rest day in any seven does not break the streak. The home page shows the days played this week.
- Finds: now and then a solve turns up a small cosmetic find for the collection.
- Reviewed by an outside model (Codex); its seven confirmed findings are fixed. Antigravity was unavailable for this release.

## Version 2.7.0

- Four new realms, each with 40 learn missions and 120 practice missions: Calculus 3 (many variables), Data and inference, Number theory, Graph theory.
- Every new mission draws fresh numbers each time and is checked against an independently written answer checker.
- Every cited textbook page was re-opened and matched to its mission; where a section does not state a fact, the mission now says it works the fact out itself. Each realm was reviewed by an outside model (Codex) and its confirmed findings fixed. Antigravity was unavailable for this release.
- Mira's 160 new briefings are recorded.
- MathCosmos now has 1,872 missions in eleven realms.

## Version 2.6.0

- Four new realms, each with 40 learn missions and 120 practice missions: Calculus 2 (accumulation), Probability, Logic and proof, Discrete mathematics.
- Every new mission draws fresh numbers each time and is checked against an independently written answer checker.
- Every cited textbook page was re-opened and matched to its mission. Each realm was reviewed by two outside models (Codex and Antigravity) and their confirmed findings fixed.
- Mira's 160 new briefings are recorded.
- MathCosmos now has 1,232 missions in seven realms.

## Version 2.5.5

- Star map: every realm has its own place, well apart from the others. On a phone each realm has a row to itself and its label sits beside its shape.

## Version 2.5.4

- The home page has a "3D star map" button: every realm as a shape in space, picked by tapping it. "Home" (or Back) returns.
- The wormhole intro plays once each time the app is opened, instead of once ever. "Skip intro" is still there.
- Phones: a concept's three practice missions sit on one line as B, C, D buttons, so an open chapter is about half as long.

## Version 2.5.3

A question whose facts end in a number ("loose rivets, 1.") no longer runs into the instruction on the same line, where it read like a numbered list: the question starts a new paragraph after such a sentence, in every realm. Glossary words still work in both parts.

## Version 2.5.2

On phones, a lesson's explanation paragraph shows its first five lines with **Read more** / **Show less**. Desktop is unchanged.

## Version 2.5.1
- **Shorter mission screen on phones:** the lesson steps, worked example, common mistakes and sources are drop-downs under the explanation, and Mira's briefing shows four lines with "Read the full briefing" on narrow screens.
