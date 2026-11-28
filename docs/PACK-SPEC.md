# Pack spec and adding a pack

A new realm pack is made from one JSON file, `tools/packs/<id>.json`, by `node tools/new-pack.js tools/packs/<id>.json`. The scaffolder writes every file the pack needs and registers it, so the people who then write its missions never edit a shared file and sixteen packs can be written at once. The mission format itself is `docs/PACK-FORMAT.md` (§1–§11): this document is only about the spec, the scaffold and the rules around them.

## 1. Adding a pack

**Step 1, once, by the engine owner: scaffold.** Two shared files change (`game/realms/packs.js` and `game/realms/registry.js`), so scaffolding is done by one person on one branch, for every new pack at once, before anyone starts writing. Authors start from that commit.

```sh
cp tools/packs/calc1.example.json tools/packs/calc2.json    # then edit every value (§2); keep the id the registry has
node tools/new-pack.js --print tools/packs/calc2.json       # look at the pack.js it gives; writes nothing
node tools/new-pack.js tools/packs/calc2.json               # writes the pack (§3) and registers it
node qa/harness.js --realm calc2                            # passes; the 40 learn and 120 practice missions are NOTEs
node qa/generators.js --realm calc2 --strict --draws 1000   # passes: "No missions were checked."
node tools/build-sw.js                                      # the new files join the offline list
```

Then run every check (§7) and commit the specs, the scaffolds, `packs.js`, `registry.js` and `game/sw.js` together.

**Step 2, by the authors: fill the stubs.** Each file has one author, exactly as for Calculus 1 (`docs/PACK-FORMAT.md` §11, "Files"): `missions-a.js` … `-d.js` with their `gen-`, `experiments-`, `variants-` and `oracle-` files of the same letter (a: q01–q10, b: q11–q20, c: q21–q30, d: q31–q40), `practice-N.js` with `oracle-pN.js` (q(5N−4)–q(5N)), and the pack's `glossary.js`, in which each letter has its own section. Every stub names, at its top, the missions it holds with their chapter, tier, XP and sector. While writing:

```sh
node qa/harness.js --realm <id>                              # after every change; unwritten missions are NOTEs
node qa/generators.js --realm <id> --strict --draws 1000     # every written mission: generator, text, oracle, shared rules
node qa/generators.js --realm <id> --strict --draws 1000 q07 q07b   # only your ids: other missions' pack-check failures are one NOTE
node qa/glossary.test.js                                     # the pack's words are used where they are taught
```

**Step 3, at the end of a pack:** `node qa/harness.js --realm <id> --complete --complete-practice`, every `qa/*.test.js`, `node tools/build-sw.js && node tools/build-sw.js --check`, and the voice step of `docs/VOICE.md` (until `game/voice/<id>/manifest.json` exists, `node tools/voice-lines.js --check` prints a NOTE for the pack and the game uses the device voice).

**Removing a scaffold that nobody has written into:** `node tools/new-pack.js --remove tools/packs/<id>.json` deletes the files, the `VG_PACKS` entry and the registry change (a part flipped to ready goes back to `status: 'coming'`; a part the spec added with `registry.node` is removed). It refuses, and removes nothing, while any of the pack's files holds anything other than its stub.

### Files an author never edits

| File | Who changes it |
|---|---|
| `game/realms/packs.js`, `game/realms/registry.js` | only `tools/new-pack.js` |
| `game/realms/<id>/pack.js` | written once by `tools/new-pack.js`; afterwards only the engine owner (a chapter's mission list) |
| `game/glossary.js`, `game/collection/achievements.js` | the engine owner; a pack's words and achievement names come from its own files and its spec |
| every other `game/*.js` and `game/*.css` (app.js, chapters.js, gen-core.js, gameplay.js, variants.js, concept-lab.js, skip.js …), `game/shell/`, `game/collection/`, `app/` | the engine owner |
| `qa/*.js` (harness, generators, pack-checks, pack-list, every test) and `tools/*.js` | the engine owner |
| `game/sw.js` and `game/voice/index.js` | written by `node tools/build-sw.js` and `node tools/voice-lines.js --index` when branches are merged; an author runs build-sw locally to test but does not commit `game/sw.js` (every branch would change the same line) |
| `docs/PACK-FORMAT.md`, `docs/PACK-SPEC.md` | the engine owner |
| another pack's `game/realms/<other>/` and `qa/realms/<other>/` | that pack's authors |

An author edits only the stub files assigned to them in `game/realms/<id>/` and `qa/realms/<id>/`, and may add `qa/realms/<id>/oracle-<name>.js` files (every `oracle-*.js` there is loaded) and a plan document `docs/<ID>-PLAN.md`. Nothing else is needed: every check finds a new pack by itself (`qa/pack-list.js` reads `VG_PACKS` and the registry).

## 2. The spec: `tools/packs/<id>.json`

Plain JSON. "Text" means a non-empty string. Everything not marked optional is required.

| Field | Type | Rule |
|---|---|---|
| `id` | text | 2–12 lowercase letters and digits, first a letter. The registry's part id (`calc2`, `prob`, `abstract` …). It is the URL (`realm.html?realm=<id>`), the folder name and the save key, so it **never changes**. Not `la`, `found` or `calc1`. |
| `saveId` | text, optional | The slice of the save the pack's progress lives in. Default: the id. Never change it once players have saves; never reuse another pack's. |
| `name` | text | The realm's name: `REALM.name`, the `VG_PACKS` title and the star-map part name (it replaces the name the registry had for a coming part; the scaffolder says so). |
| `short` | text, ≤ 17 characters | The short name in the achievement texts: "Learn every concept in `<short>`." and "Solve every mission in `<short>`, practice included." (60 characters at most). |
| `pageTitle` | text, optional | Default `MathCosmos — <name>`. |
| `description` | text | One sentence, `REALM.description`. |
| `about` | text, optional | The opening comment of `pack.js` (`\n` for new lines). |
| `registry` | object or `false`, optional | `{ "part": <id> }` (the default): the part with that id is flipped from `status: 'coming'` to `'ready', missions: 160, learn: 40` with `ach` (below). Add `"node": "<node id>"` only for a part the registry does not have yet; it is added at the end of that node's parts. `false`: no star-map part and no achievements (the pack opens by URL only; for tests). |
| `achievements` | object | `{ "done": text ≤ 28, "master": text ≤ 28, "doneReward": 15–150, optional, default 150 }`. The names of `<id>-done` (every concept learned) and `<id>-master` (all 160 missions). Written into the registry part as `ach: { short, done, master }`; `game/collection/achievements.js` makes the two achievements from it. Their ids are fixed by the pack id. |
| `chapters` | list of exactly 7 objects | In campaign order. Each: |
| `chapters[i].name`, `.blurb` | text | The chapter's title and one-line blurb. |
| `chapters[i].tier` | optional | `Basic`, `Intermediate` or `Advanced`; default Basic, Basic, Intermediate ×3, Advanced ×2. Never goes down. XP is fixed by tier (100, 150, 200). |
| `chapters[i].size` or `.ids` | optional | 5 or 6 learn missions; default 6, 5, 6, 6, 6, 5, 6. The ids are always q01 … q40 in order, so `ids` may only spell them out. The seven sizes add up to 40. |
| `chapters[i].sector` | object | `{ "name": text, "purpose": text }`: the place in the outpost where the chapter's missions happen (every mission's `sector` field is this name) and what it is for. The purpose completes "we have to …" and "so we can …". Names differ between chapters. |
| `chapters[i].landmark` | object | `{ "name": text, "glyph": key, optional, "art": SVG, optional, "at": [x, y], optional }`. The drawing is `glyph` from the library (§5), or your own `art` (shapes only: no script, handler, text or id); default glyphs differ per chapter. `at` defaults to the place every pack uses for that chapter. |
| `landmarkCost` | whole number, optional | Skill points per landmark. Default 4. |
| `ranks` | list of 9 texts | Rank titles, lowest first, all different. Their steps are fixed (§4). |
| `source` | object | The source rule: `{ "pattern": text, "flags": optional, "label": text, "book": optional, "url": optional, "example": optional }`. Every mission needs at least one source whose `title` matches `new RegExp(pattern, flags)`; `qa/harness.js` reads the rule from the pack (`REALM.sourceRule`). `label` names the source in messages. `book`, `url` and `example` go into the comments of the stubs; `example`, if given, must match the pattern. Examples below. |
| `mentor` | object | `{ "name", "role", "cardEyebrow", "opening", "closing" }`, all text. `opening` is the mentor's first line of every briefing, with placeholders `{purpose}` (the sector's purpose), `{title}`, `{brief}`, `{topic}` and `{topic.lower}`; no other `{…}`. |
| `copy` | object | The page text: `sceneLabel`, `homeEyebrow`, `homeTitle` (may hold `<br>` and `<em>`), `firstVisit`, `allDone`, `beginFirst`, `missionNoun`, `chaptersNote`, `guideNoun`, and `skills` and `visual`, each `{ "eyebrow", "title", "text" }`. |
| `help` | text or object | The help dialog: the whole HTML (as Calculus 1 has it), or `{ "eyebrow", "title", "intro", "answers": optional }`, which gives the standard help (how the outpost works, answers, rewards, chapters, drills, practice) with your title and introduction; `answers` is one more sentence for item 02 (radians, rounding, units …). No scripts or handlers. |
| `glossaryRequired` | list of texts, optional | The words the pack must define. Written into the pack's `glossary.js` as `required`, where the authors keep the list from then on. |
| `concepts` | object, optional | `{ "q01": "topic [section]", … }`: the concept plan. Shown next to each id in the stub comments; nothing else reads it. |

Source rules for books other than OpenStax (the pattern is matched against the source `title`, so write titles that start with the author or publisher):

```json
"source": { "pattern": "^Judson, Abstract Algebra", "label": "Judson, Abstract Algebra", "book": "Thomas W. Judson, Abstract Algebra: Theory and Applications", "url": "https://abstract.ups.edu/aata/<section>.html", "example": "Judson, Abstract Algebra — 3.1 Integer Equivalence Classes and Symmetries" }
"source": { "pattern": "^Lebl, Basic Analysis", "label": "Lebl, Basic Analysis", "book": "Jiří Lebl, Basic Analysis I", "example": "Lebl, Basic Analysis — 2.1 Sequences and limits" }
"source": { "pattern": "^Levin, Discrete Mathematics", "label": "Levin, Discrete Mathematics", "book": "Oscar Levin, Discrete Mathematics: An Open Introduction", "example": "Levin, Discrete Mathematics — 1.1 Additive and Multiplicative Principles" }
"source": { "pattern": "OpenStax", "label": "OpenStax", "book": "OpenStax Introductory Statistics 2e" }
```

The `url` and `example` above are illustrations of the form; open each section page yourself before you set `verified` on a mission (`docs/PACK-FORMAT.md` §2.2).

## 3. What the scaffolder writes

| Path | What |
|---|---|
| `game/realms/<id>/pack.js` | `window.REALM`, in the shape of `game/realms/calc1/pack.js`: every field of `docs/PACK-FORMAT.md` §9 |
| `game/realms/<id>/missions-a.js` … `-d.js` | an empty `source` table and `window.QUESTS.push(` `)`; the header lists the ten missions of the file |
| `game/realms/<id>/gen-a.js` … `-d.js` | `Object.assign(window.MISSION_GEN, { })` with `n`, `plus`, `par` |
| `game/realms/<id>/experiments-a.js` … `-d.js` | the helpers `T` and `E`, `Object.assign(window.EXPERIMENTS, { })` |
| `game/realms/<id>/variants-a.js` … `-d.js` | `VARIANT_SETUP` and `VARIANT_POOL` tables |
| `game/realms/<id>/practice-1.js` … `-8.js` | the `add(mission, generator)` helper and one section per concept |
| `game/realms/<id>/glossary.js` | the pack's words (§6) |
| `qa/realms/<id>/oracle-a.js` … `-d.js`, `oracle-p1.js` … `-p8.js` | `Object.assign(window.ORACLE, { })` |
| `qa/realms/<id>/oracle-pack-checks.js` | a place for rules only this pack needs (registers no oracle) |
| `game/realms/packs.js` | the `VG_PACKS` entry: the pack's 33 scripts in the Calculus 1 load order, with `realms/<id>/glossary.js` just before `glossary.js` |
| `game/realms/registry.js` | the part: `status: 'ready', missions: 160, learn: 40, ach: { short, done, master }` |

It is idempotent. A file that is missing or empty is written; a file that already holds exactly what the spec gives is left alone; a file with any other content is never overwritten and is listed as `kept`. The two shared entries must match the spec: if `VG_PACKS.<id>` or a ready registry part exists with other data, or the saveId is taken, the run fails and writes nothing at all. To change `pack.js` after the scaffold, compare with `--print` and edit it with the engine owner.

## 4. What is fixed for every new pack

- 40 learn missions q01–q40 in 7 chapters of 5 or 6, and three practice missions per concept (`b` setting, `c` applied, `d` challenge): 160 missions.
- Ranks: `at` 0, 8, 24, 44, 68, 96, 128, 144, 160 and `learnAt` –, 4, 10, 16, 22, 28, 34, 40, – (the last rank, `top: true`, needs every mission; the one below it all 40 concepts). Tiers Basic, Intermediate, Advanced at 100, 150 and 200 XP.
- Features: the concept bench only (`labs: ['concept']`; no workshop, contracts, board, docking or hands-on benches). Styles `styles.css`, `update.css`.
- The celebration after a first solve: "You learned: `<topic>` ✦" and "That is right. `<solution>` `<sector>` has a new part now, so we can `<purpose>`." (`qa/harness.js` checks this wording for every pack but linear algebra.)
- Every rule of `docs/PACK-FORMAT.md` and the shared content rules of `qa/pack-checks.js` (§11 there), which `qa/generators.js` runs for every pack after Foundations.

`node tools/new-pack.js --print tools/packs/calc1.example.json` gives Calculus 1's own `pack.js`: `diff` against `game/realms/calc1/pack.js` shows four comment lines and nothing else, and `qa/new-pack.test.js` checks that every field of the two `window.REALM` objects is equal (the mentor and celebration functions by their output, the source rule by its pattern and flags).

## 5. Landmark glyphs

`tools/pack-glyphs.js`. Every glyph is drawn around (0, 0) on the ridge line, about 20 units to each side and 40 up, in the outpost palette (#b4cead #93b6a0 #8cddd4 #82b8b2 #496866 #3f6a5a #607669 #73c6d2 #d4f36a #f3c37b #203a3d), with paths, rects, circles and ellipses only (`qa/new-pack.test.js` checks this).

- Used by Calculus 1: `tracking-dish`, `pump-house`, `speed-gate`, `lathe-hall`, `launch-tower`, `drafting-dome`, `reservoir-dam`
- Used by Foundations: `supply-crane`, `greenhouse`, `tank-farm`, `flag-line`, `cargo-rail`, `kiln`, `signal-mast`
- Used by linear algebra: `beacon`, `survey-tower`, `observatory`, `comms-dish`, `solar-field`, `relay-pylons`, `signal-spire`, `guild-banner`
- New: `dice-house`, `bar-chart`, `bell-curve`, `logic-gate`, `network`, `block-stack`, `spiral-tower`, `wave-mast`, `pendulum-frame`, `magnet-arch`, `coil-tower`, `torus-ring`, `knot-sculpture`, `lattice-frame`, `crystal-spire`, `balance-scales`, `lighthouse`, `wind-turbine`, `arch-bridge`, `telescope`, `archive-hall`, `clock-tower`, `obelisk`

Without `glyph` or `art`, chapter 1–7 get `beacon`, `survey-tower`, `observatory`, `comms-dish`, `solar-field`, `relay-pylons`, `signal-mast`.

## 6. Glossary

Foundations, linear algebra and Calculus 1 keep their words in `game/glossary.js`. A later pack keeps its own in `game/realms/<id>/glossary.js`, which `game/glossary.js` (loaded right after it) merges into `window.VG_GLOSSARY[<id>]`:

```js
window.VG_GLOSSARY_PACKS[<id>] = {
 required: ['group', 'subgroup', 'order'],          // words the pack must define
 terms: [                                          // [term, taught, means, example, also?, avoid?]
  ['group', 'q01', 'A set with an operation that is associative, has an identity and gives every element an inverse.', 'The integers under + form a group.'],
 ]
};
```

The row format and the rules are those of `game/glossary.js` (a one-sentence meaning of 20–190 characters ending with a full stop, an example of 8–150 characters, minus signs U+2212, `taught` a learn mission of the pack). `qa/glossary.test.js` checks every pack the same way it checks Calculus 1: a word whose `taught` mission is written must be used in that mission's text (lesson, prompt, hints, solution); every `required` word must be defined and the pack needs at least 40 words once all 40 learn missions are written; until then a missing required word, or fewer than 40, is a NOTE. Add a word in the same change as the mission that teaches it, in that mission's file section.

## 7. Checks while a pack fills up, and at the end

Every check finds the pack by itself through `qa/pack-list.js` (the packs of `game/realms/packs.js`, in registry order):

| Check | While the pack fills up | Once all 40 learn missions are written |
|---|---|---|
| `node qa/harness.js --realm <id>` | passes; unwritten learn and practice missions are NOTEs; with no mission at all it checks the configuration, chapters and ranks and says the play-throughs wait | everything; `--complete --complete-practice` at the very end |
| `node qa/generators.js --realm <id> --strict --draws 1000` | every written mission, its oracle and the shared rules of `qa/pack-checks.js` | the same |
| `qa/glossary.test.js` | the pack's words; a missing required word or under 40 words is a NOTE | every required word, at least 40 words |
| `qa/skip.test.js`, `qa/realm-collection.test.js`, `qa/daily.test.js` | NOTE: left out | the pack's chapters, skip-ahead check, collection payments and daily drills |
| `qa/collection.test.js` | the pack's two achievements are in the list and can be earned | the same |
| `qa/new-pack.test.js` | the pack's `VG_PACKS` entry is the standard one, its registry part has counts and achievement names | the same |
| `qa/home.test.js`, `qa/shell.test.js` | unaffected: they check the star map on the registry as 2.5 had it | the same |
| `node tools/voice-lines.js --check` | NOTE until `game/voice/<id>/manifest.json` exists | every learn mission needs its clip once the manifest exists |
| `node tools/build-sw.js --check`, `qa/install.test.js` | fail until `node tools/build-sw.js` is run after a change under `game/` | the same |

## 8. The complete example: `tools/packs/calc1.example.json`

Calculus 1's values, exactly. It is not used to build anything (the scaffolder refuses `la`, `found` and `calc1`); it is the model to copy and the proof that the spec covers a whole pack.

```json
{
 "id": "calc1",
 "name": "Calculus 1: change",
 "short": "Calculus 1",
 "description": "Rates of change, limits, derivatives and a first look at integrals, taught at the Kepler outpost.",
 "about": "Calculus 1 realm (\"Calculus 1: change\"): rates, limits, derivatives and the first step into integrals, for an\nadult who has finished Foundations and nothing more. Same Kepler outpost, now grown: things move and flow, and\nMira is still the mentor. The concept plan is docs/CALC1-PLAN.md.",
 "registry": {"part":"calc1"},
 "achievements": {"done":"Rate of climb","master":"Area under the curve"},
 "chapters": [
  {"name":"Rates and limits","blurb":"Average rates of change, closing in on an instant, and what a limit is.","tier":"Basic","size":6,"sector":{"name":"Tracking Station","purpose":"follow everything that moves around the outpost"},"landmark":{"name":"Tracking dish","glyph":"tracking-dish"}},
  {"name":"Continuity and infinity","blurb":"Continuous functions, limits at infinity, asymptotes and trapping a root.","tier":"Basic","size":5,"sector":{"name":"Flow Control","purpose":"keep the pumps and pipes running without a break"},"landmark":{"name":"Pump house","glyph":"pump-house"}},
  {"name":"The derivative","blurb":"The derivative as a limit, tangent lines, the power rule, velocity and acceleration.","tier":"Intermediate","size":6,"sector":{"name":"Test Track","purpose":"measure how fast a rover is going at any instant"},"landmark":{"name":"Speed gate","glyph":"speed-gate"}},
  {"name":"Rules of differentiation","blurb":"Product, quotient and chain rules; sine, cosine, exponentials and logarithms.","tier":"Intermediate","size":6,"sector":{"name":"Machine Shop","purpose":"take any formula apart and find how fast it changes"},"landmark":{"name":"Lathe hall","glyph":"lathe-hall"}},
  {"name":"Derivatives at work","blurb":"Implicit differentiation, related rates, linear approximation and the shape of a curve.","tier":"Intermediate","size":6,"sector":{"name":"Launch Gantry","purpose":"predict how a launch will go before we light the engines"},"landmark":{"name":"Launch tower","glyph":"launch-tower"}},
  {"name":"Best values and shortcuts","blurb":"Largest and smallest values, optimisation, the Mean Value Theorem, L’Hôpital’s rule and Newton’s method.","tier":"Advanced","size":5,"sector":{"name":"Design Studio","purpose":"find the best design instead of guessing at it"},"landmark":{"name":"Drafting dome","glyph":"drafting-dome"}},
  {"name":"From change to accumulation","blurb":"Antiderivatives, areas from rectangles, the definite integral and the Fundamental Theorem of Calculus.","tier":"Advanced","size":6,"sector":{"name":"Reservoir","purpose":"add up a changing flow into a total we can rely on"},"landmark":{"name":"Reservoir dam","glyph":"reservoir-dam"}}
 ],
 "landmarkCost": 4,
 "ranks": ["OBSERVER","TRACKER","FLOW CONTROLLER","TEST DRIVER","MACHINIST","LAUNCH ENGINEER","CHIEF DESIGNER","CHANGE ANALYST","MASTER OF CHANGE"],
 "source": {"pattern":"OpenStax","label":"OpenStax","book":"OpenStax Calculus Volume 1","url":"https://openstax.org/books/calculus-volume-1/pages/<section-slug>","example":"OpenStax Calculus Volume 1 — 2.1 A Preview of Calculus"},
 "mentor": {
  "name": "Mira",
  "role": "field engineer",
  "cardEyebrow": "MIRA / YOUR FIELD ENGINEER",
  "opening": "I’m Mira. Nothing here stands still any more, and we have to {purpose}. Your task is “{title}.” {brief} The idea we need: {topic}.",
  "closing": "You already have everything this needs from Foundations. I’ll go through the worked example with you, and the guided steps are there whenever you want them."
 },
 "copy": {
  "sceneLabel": "KEPLER OUTPOST / FLIGHT LINE",
  "homeEyebrow": "THE OUTPOST IS MOVING",
  "homeTitle": "Nothing here stands still.<br><em>Learn to measure change.</em>",
  "firstVisit": "Welcome back. The outpost has grown: rovers drive, shuttles climb and tanks fill, and nobody can yet say how fast. We will start by timing one shuttle; everything you need you learned in Foundations.",
  "allDone": "You did it. All seven stations are running, and you can say how fast anything here changes and how much it adds up to. Calculus 2 will pick up from the reservoir when it opens.",
  "beginFirst": "Time the first shuttle",
  "missionNoun": "calculus missions",
  "chaptersNote": "Seven chapters. Learn every concept in a chapter to unlock a landmark for the outpost. Practice missions are optional.",
  "skills": {"eyebrow":"YOUR DEVELOPMENT","title":"The skill tree","text":"Follow the prerequisite branches from average rates to integrals. Each mission you finish opens the ideas that are built on it."},
  "guideNoun": "calculus topics",
  "visual": {"eyebrow":"TRY IT YOURSELF","title":"The concept bench","text":"Pick any mission, change its numbers and predict the result before you check it. Nothing here affects your progress, and it all works offline."}
 },
 "help": "<div class=\"eyebrow\">WELCOME BACK</div><h2>The mathematics of change.</h2><p>Calculus 1 starts where Foundations ends: with slopes, functions and graphs. It teaches limits, derivatives and a first look at integrals. Every new word and symbol is explained before you are asked to use it, with a worked example first.</p><div class=\"mission-panel\"><h3>HOW THE OUTPOST WORKS</h3><p>01 / Read the lesson and the worked example, then choose “I’m ready to try.” You can open the lesson again at any time.<br>02 / Answers are numbers, never formulas: a slope, a value at a point, a coefficient. Type them without commas or spaces (1250, not 1,250). Decimals such as 2.5 and fractions such as 7/6 or 1 1/2 work. When an answer must be rounded, the mission says how. Angles are in radians unless a mission says otherwise.<br>03 / Hints and guided steps are free and still earn the full reward. Your first solve of a mission earns XP and one skill point; every 300 XP is a level. A solve on the first check with no help also earns a ★.<br>04 / Missions open when the missions they build on are done. A chapter is complete when every concept in it is learned; that unlocks a landmark for the outpost, bought with skill points.<br>05 / Review drills ask a solved idea again with new numbers, spaced further apart each time you pass. Misses go into the error notebook at the top of the field guide.<br>06 / Each concept has one learn mission and up to three practice missions, marked B, C and D: the same skill in a new setting, a word problem with two or three steps, and a challenge. Practice opens when you solve the learn mission. It is optional, and it earns XP, skill points and stardust like any mission.</p></div><p>Progress is saved in this browser only. Use settings to export a backup or import it on another device.</p>",
 "glossaryRequired": ["limit","derivative","tangent line","secant line","rate of change","continuous","asymptote","critical point","concave","antiderivative","integral","riemann sum"],
 "concepts": {
  "q01": "Average rate of change over an interval [2.1]",
  "q02": "Closing in on an instant: average rates over shrinking intervals [2.1]",
  "q03": "What a limit is, read from a table of values [2.2]",
  "q04": "Limit laws and direct substitution [2.3]",
  "q05": "Limits at a hole: factor and cancel [2.3]",
  "q06": "One-sided limits and jumps [2.2]",
  "q07": "Continuity at a point (choose the value that closes a gap) [2.4]",
  "q08": "Limits at infinity and horizontal asymptotes [4.6]",
  "q09": "Infinite limits and vertical asymptotes [2.2]",
  "q10": "Intermediate Value Theorem: trapping a root by halving [2.4]",
  "q11": "Chapter review: limits and continuity mixed [2.3, 2.4]",
  "q12": "The derivative at a point as a limit of difference quotients [3.1]",
  "q13": "Tangent line: slope and equation [3.1]",
  "q14": "The power rule [3.3]",
  "q15": "Constant multiple, sum and difference rules: polynomials [3.3]",
  "q16": "Velocity and acceleration: first and second derivatives [3.4]",
  "q17": "Chapter review: derivative of a polynomial model [3.2, 3.3]",
  "q18": "Product rule [3.3]",
  "q19": "Quotient rule [3.3]",
  "q20": "Chain rule [3.6]",
  "q21": "Derivatives of sine and cosine [3.5]",
  "q22": "Derivatives of e^x and ln x [3.9]",
  "q23": "Chapter review: choosing the rule [3.3, 3.6]",
  "q24": "Implicit differentiation [3.8]",
  "q25": "Related rates [4.1]",
  "q26": "Linear approximation and differentials [4.2]",
  "q27": "Critical points; increasing and decreasing [4.3, 4.5]",
  "q28": "Concavity and the second derivative test [4.5]",
  "q29": "Chapter review: describing a curve from its derivatives [4.5]",
  "q30": "Absolute maximum and minimum on a closed interval [4.3]",
  "q31": "Optimisation problems [4.7]",
  "q32": "Mean Value Theorem [4.4]",
  "q33": "L'Hôpital's rule [4.8]",
  "q34": "Newton's method [4.9]",
  "q35": "Antiderivatives [4.10]",
  "q36": "Initial value problems: position from velocity [4.10]",
  "q37": "Approximating area with rectangles (Riemann sums) [5.1]",
  "q38": "The definite integral as signed area [5.2]",
  "q39": "The Fundamental Theorem of Calculus: evaluating a definite integral [5.3]",
  "q40": "Net change; realm review and bridge to Calculus 2 [5.4]"
 }
}
```
