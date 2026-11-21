# Realm pack format (MathCosmos 2.2)

This is the contract for writing missions for a realm pack. It is written for the Foundations pack (`found`), but every pack follows it. Everything here is checked by `qa/harness.js` and `qa/generators.js`; if those pass, the game can play the mission.

## 1. How a pack is loaded

- `game/realm.html?realm=<pack id>` loads exactly one pack. The script list, in load order, is `window.VG_PACKS[<id>].scripts` in `game/realms/packs.js`; `realm.html` adds `app.js` last. An unknown id goes back to the star map (`index.html`).
- All files are plain classic scripts: no modules, no build step, no network, no libraries. Each file is wrapped in `(function(){ 'use strict'; ... })();` and adds to a shared global.
- Only one pack is loaded per page, so every pack uses **local ids** `q01`, `q02`, ... for its learn missions, one per concept, and `q01b`, `q01c`, `q01d` for the practice missions of a concept (§10). Progress is saved per realm (`docs/SAVE-V2.md`); a save lists solved ids, so ids never change.
- `realms/<id>/pack.js` sets `window.REALM` (chapters, sectors, ranks, copy). Content authors do not edit it, except to correct a chapter's mission list with the engine owner.

### Foundations files

| File | Holds | Global it adds to |
|---|---|---|
| `game/realms/found/missions-a.js` … `missions-d.js` | mission objects (§2) | `window.QUESTS` (push) |
| `game/realms/found/gen-a.js` … `gen-d.js` | generators (§3) | `window.MISSION_GEN` |
| `game/realms/found/experiments-a.js` … `experiments-d.js` | concept-bench models (§4) | `window.EXPERIMENTS` |
| `game/realms/found/variants-a.js` … `variants-d.js` | review-drill statements (§5) | `window.VARIANT_SETUP`, `window.VARIANT_POOL` |
| `game/realms/found/practice-1.js` … `practice-8.js` | practice missions **and** their generators (§10) | `window.PRACTICE` (push), `window.MISSION_GEN` |
| `qa/realms/found/oracle-<anything>.js` | independent answer oracles (§6); `oracle-p1.js` … `oracle-p8.js` hold the practice ones | `window.ORACLE` |

The letters are only containers: a mission, its generator, experiment and variant may go in any of the four files of each kind. Keep one author per file to avoid edit clashes. The stub files already contain the registration boilerplate; add entries inside the `push(...)` or `Object.assign(..., { ... })`.

Load order inside the Foundations pack: `pack.js`, `missions-*`, `gen-core.js`, `gen-*`, `gameplay.js`, `experiments-*`, `variants-*`, `practice-*`, `variants.js`, `concept-lab.js`, `chapters.js`. `chapters.js` must stay after the practice files: it is what turns their entries into missions. So a generator may use `window.Gen` only inside its functions (it is defined before `gen-*` load, so top-level `const G = window.Gen` is also fine), and `variants-*.js` must run before `game/variants.js` (they do).

The temporary `sample.js` and `oracle-sample.js` that proved this format were removed once all 40 missions were written; `missions-a.js` (q01) and `missions-b.js` (q16) now show the same patterns.

### Foundations ids, chapters, tiers, sectors

The id of each learn mission is fixed by `REALM.chapters` in `game/realms/found/pack.js` (practice missions take their chapter, tier, XP and sector from their learn mission, §10):

| Ch | Name | Ids | Tier, XP | Sector (mission `sector` field) |
|---|---|---|---|---|
| 1 | Number sense | q01–q06 | Basic, 100 | Supply Depot |
| 2 | Parts and ratios | q07–q12 | Basic, 100 | Ration Kitchen |
| 3 | Language of algebra | q13–q18 | Intermediate, 150 | Fuel Store |
| 4 | Lines and space | q19–q24 | Intermediate, 150 | Map Room |
| 5 | Systems and tables | q25–q29 | Intermediate, 150 | Logistics Office |
| 6 | Powers and polynomials | q30–q35 | Advanced, 200 | Fabrication Yard |
| 7 | Functions and angles | q36–q40 | Advanced, 200 | Signal Tower |

Topics in order are listed in the brief and in the chapter blurbs (e.g. q01 place value, q02 adding and subtracting, … q24 three-dimensional coordinates and adding signed displacements component by component). The campaign order is chapter order, then the order of `ids` in each chapter.

## 2. Mission object

Every field below is required unless marked optional. Text is plain Unicode (no HTML; it is escaped). Use `−` (U+2212) for minus signs in text, `×` and `÷` for operations, and never write a number with thousands separators (§7).

```js
{
  id: 'q07',                       // fixed by the chapter table; /^q\d{2}$/ (a practice mission, §10, adds a letter: q07b)
  title: 'Splitting the ration bars',  // mission name
  topic: 'What a fraction means',  // concept name, shown on cards and in the field guide
  tier: 'Basic',                   // the chapter's tier (table above)
  sector: 'Ration Kitchen',        // the chapter's sector (table above), exactly
  brief: 'One sentence: what the outpost needs.',  // read by Mira; must not repeat the intuition
  lesson: 'One-sentence summary of the idea.',     // shown above the lesson unless equal to teaching.intuition
  prompt: 'The problem, with its numbers. Say what to enter and in which order.',
  answer: [3, 4],                  // finite numbers; one per answer box
  labels: ['numerator', 'denominator'],  // one per answer, same length as answer
  tolerance: 0.01,                 // > 0; absolute: |typed − answer| <= tolerance
  hints: ['First hint.', 'Second hint.'],  // >= 1; generators must produce the same count
  solution: 'Full worked solution for these numbers.',
  xp: 100,                         // 100 Basic, 150 Intermediate, 200 Advanced
  prereqs: ['q06'],                // ids that must be solved first; may be []
  artifact: { name: '...', description: '...' },  // optional collectible
  sources: [ /* §2.2, at least one OpenStax section */ ],
  teaching: {
    intuition: 'At least 40 characters. The idea in plain words, taught from zero.',
    steps: ['>= 3 steps of the method', '...', '...'],
    example: {                     // worked example with DIFFERENT numbers from the prompt
      prompt: 'The example problem.',
      steps: ['>= 2 steps', '...'],
      answer: 'The example result, as text.'
    },
    pitfalls: ['>= 2 common mistakes', '...']   // the player may tag one after a miss
  },
  guidance: [                      // >= 2 guided steps, shown after two misses or on "Guide me"
    { prompt: 'A smaller question.', answer: [3], labels: ['parts taken'], explanation: 'Why.' },
    { prompt: '...', answer: [4], labels: ['equal parts'], explanation: '...' }
  ]
}
```

### 2.1 What the harness requires of every mission (`node qa/harness.js --realm found`)

- `id` unique, of the form `q01`; it appears in exactly one declared chapter; `sector` equals that chapter's sector; `tier` equals the chapter's tier; `xp` equals the tier's XP.
- `id, title, topic, tier, sector, brief, lesson, prompt, solution` are non-empty strings; `hints` has at least one string; `answer` is a non-empty list of finite numbers; `answer.length === labels.length`; `tolerance > 0`; `xp > 0`.
- `teaching.intuition` at least 40 characters; `teaching.steps` at least 3; `teaching.pitfalls` at least 2; `teaching.example` has `prompt`, at least 2 `steps` and `answer`; the numbers in `example.prompt` are not the same list as the numbers in `prompt`.
- `guidance` has at least 2 steps; each has `prompt`, `explanation`, and `answer` (finite numbers) with `labels` of the same length.
- `sources`: every source has an `https://` `url`, a `title` and a truthy `verified`; at least one source's `title` matches the pack's `sourceRule` (`/OpenStax/`).
- Every id in `prereqs` exists, every mission is reachable, and every prerequisite comes **earlier in the campaign order** (an earlier chapter, or earlier in the same chapter's `ids`).
- An experiment exists (§4) and a variant statement exists (§5) for the mission.
- Mira's spoken briefing contains `teaching.intuition` and her written card does not (so `brief` must not contain the intuition text).

### 2.2 Source object

```js
{ title: 'OpenStax Prealgebra 2e — 1.1 Introduction to Whole Numbers',
  url: 'https://openstax.org/books/prealgebra-2e/pages/1-1-introduction-to-whole-numbers',
  description: 'What the section covers, in one line.',
  verified: '2026-11-21' }        // date you opened the link and saw that section
```

The title must contain `OpenStax`, then the book (Prealgebra 2e, Elementary Algebra 2e, Intermediate Algebra 2e, College Algebra 2e or Precalculus 2e) and the section number and name. Link to the section page itself. Open every link before you set `verified`; the game shows the link under "Study the source". Missions are original; the source supports further study and must not be copied.

### 2.3 Teaching rules for Foundations

The player is an adult with no mathematics. Every idea, word and symbol is taught in the intuition, steps or worked example before the problem uses it, or in an earlier mission (a prerequisite). Do not use a symbol (×, ÷, a letter for a number, a power) before the mission that introduces it. Settings are the Kepler outpost before the engineering starts: supplies, rations, fuel, maps and signals, with Mira.

## 3. Generator (`window.MISSION_GEN[id]`)

Every mission needs one. It rebuilds the mission with new numbers; each save sees its own numbers.

```js
q07: {
  canonical: { a: 3, b: 4 },                 // the parameters of the authored mission
  draw: R => ({ a: R.int(1, 5), b: R.int(6, 9) }),  // fresh, well-behaved parameters
  build: ({ a, b }) => ({                     // pure function of the parameters
    prompt: `...${n(a)}...`,
    answer: [a, b],                           // same length as the authored answer
    hints: [`...`, `...`],                    // same count as the authored hints
    solution: `...`,
    guidance: [                               // same count as the authored guidance
      { prompt: `...`, answer: [a], explanation: `...` },   // labels come from the authored step
      { prompt: `...`, answer: [b], explanation: `...` }
    ]
  })
}
```

- `build(canonical)` must reproduce the authored mission: the same answers, guidance answers, hint and guided-step counts, and (checked with `--strict`) **exactly the same text** for `prompt`, every hint, `solution`, and every guidance `prompt` and `explanation`. Write the authored mission by running your `build(canonical)`, or copy its text exactly.
- `labels`, `tolerance`, `lesson`, `teaching`, `sources`, `title` and the rest always come from the authored mission, so lesson text must not quote the problem's numbers.
- Answers must stay below 100000 in size. Prefer whole numbers or short decimals (at most 4 places).
- The random source in `draw` is `R` (deterministic for a save, mission and roll): `R.int(lo, hi)` integer in [lo, hi]; `R.nz(lo, hi)` non-zero integer; `R.pick(list)`; `R.bool()`; `R.except(lo, hi, [excluded])`; `R.next()` a number in [0, 1). Draw so that every case is solvable and tidy (no zero divisors, no fractions that do not reduce as the prompt says). The random numbers hash the **local** id, so never change an id once players have it.
- Helpers on `window.Gen` (take them with `const G = window.Gen, { n, plus, par, vec } = G;`): `n(x)` number to text with at most 4 decimals and `−`; `plus(x)` `"+3"` / `"−2"`; `par(x)` `"(−1)"` / `"4"`; `vec([..], sep)` `"(3, −1, 2)"`; `clean(text)`; `tidy(x)`. Always format numbers with `n`, `plus` or `par`, never by interpolating a raw negative number.
- The engine applies `Gen.clean` to all generated text (it turns `+-3` into `−3`, `-3` into `−3` after a non-letter, and rounds float noise). Your authored text must equal the cleaned build.

## 4. Experiment (`window.EXPERIMENTS[id]`) — the concept bench

```js
q07: t => { t = T(t); /* T clamps to an integer in [-10, 10] */
  return { prompt: 'Predict the ...',                 // what to predict
           formula: `The working for these numbers ...`,  // shown after the check
           values: [['Target label', 12], ['Other output', 3], ...],  // >= 2 rows of [label, finite number]
           target: 12 };                             // must equal values[0][1]
}
```

`t` is the slider value, an integer from −10 to 10 (the bench opens at 2). For every `t` the model must return finite numbers, a `prompt` and a `formula`, and `target === values[0][1]`. The target must take at least two different values over the range. Text must not contain `NaN`, `undefined`, `Infinity`, a hyphen-minus before a digit (`-3`, use `−3`), `+-`/`−-`, or a number with 7 or more decimals. Each `experiments-*.js` file defines the helpers `T` and `E(prompt, formula, values)` at its top; copy them into a new file.

## 5. Variant setup and pool — review drills

```js
window.VARIANT_SETUP.q07 = t => `The problem statement for slider value t, without its answer.`;
window.VARIANT_POOL.q07 = [1, 2, 3, 4, 5];   // optional; default [-6..6] without 0
```

A review drill (and the reward check after "Reveal solution") shows `VARIANT_SETUP[id](t)` and the experiment's `prompt`, and checks the typed answer against the experiment's `target` (rule below); the answer box is labelled `values[0][0]`. The statement must describe the same numbers the experiment uses for that `t`, must be at least 8 characters, and must be tidy (same rules as §4). Use `VARIANT_POOL` to keep drills away from degenerate `t` values. `game/variants.js` merges these tables; linear algebra's built-in table applies only to the `la` pack.

How close the answer must be (`Variants.accept(target, model)` / `Variants.tolerance(target, model)`, used by the drill, the reward check and the concept bench):
- An experiment model may return its own `tolerance` (a number > 0, absolute: `|typed − target| <= tolerance`). It wins in every pack.
- Linear algebra without one: within 2% of the target, at least 0.02 (the 1.4.1 rule, unchanged).
- Any other pack without one: a whole-number target, or a target with one to three decimal places, must be typed exactly (3507 does not accept 3570; 5.05 does not accept 5.15). Any other target (a repeating decimal, a root) is accepted within 2%, at least 0.02; for such a model choose numbers so that a typical mistake is more than 2% away, or give the model a `tolerance` and say in its `prompt` how to round.
- The line under the question says which rule applies ("Type the exact whole number." / "Type the exact value." / "Answers within 2% are accepted."). `qa/harness.js` checks that a neighbouring whole number or decimal is rejected.

## 6. Oracle (`qa/realms/found/oracle-*.js`)

Every mission needs an independent oracle; `qa/generators.js` fails without one.

```js
(function(){ 'use strict';
Object.assign(window.ORACLE, {
  q07: p => [ /* the answer list for generator parameters p, computed another way */ ],
});
})();
```

`qa/generators.js` sets `window.ORACLE = {}` and loads every `qa/realms/found/oracle-*.js` (any name after `oracle-`) after the whole pack. For each mission it calls `ORACLE[id](copy of params)` for `canonical` (must equal the authored `answer`) and for each of the N draws (seed 12345, rolls 1..N; must equal the generator's answer within a relative 1e-6). It must return an array of numbers of the answer's length. Work from what the prompt states, by a different method from `build` (for example search, repeated addition, digit reading, or a general solver), so a slip in `build` is caught. Do not import game files.

## 7. Answers and input

- Answers are numbers. The answer box accepts `12`, `-3`, `2.5`, `2,5` (a comma is a **decimal point**), `7/6`, `-3/4` and `1 1/2`. So never ask for or print `6,038`. Write large numbers without separators. A player who types a correct whole number with thousands commas anyway (`6,038` for 6038) is not marked wrong: when the decimal reading does not fit the wanted value and the grouped reading does, the engine takes the grouped one (`readNumber` in app.js; main answer, guided steps, review drills and the reward check). A decimal comma that fits always wins, so `1,432` is still right for 1.432.
- When the reduced form of a fraction is the point, ask for the numerator and the denominator in two separate answer boxes (and say "in lowest terms"); a single box would accept any equal value.
- `tolerance` is absolute. Use 0.01 for exact answers; for rounded answers say how to round and size the tolerance to it.

## 8. Running the checks

From the repository root:

```sh
node qa/generators.js --realm found --strict --draws 1000 q07   # one mission: generator, text, oracle
node qa/generators.js --realm found --strict --draws 1000       # every mission in the pack
node qa/show-mission.js q07 --realm found --draw 3              # print the mission and three generated versions
node qa/harness.js --realm found                                # schema, teaching, chapters, experiments, variants, play-through
node qa/harness.js --realm found --complete                     # also require all 40 declared learn missions
node qa/harness.js --realm found --complete --complete-practice # and all 120 practice missions (§10; use at the end)
node qa/save-store.test.js                                      # save format tests (engine; not content)
```

`qa/harness.js` checks the whole pack at once and stops at the first failure, printing the mission id and the rule. Without `--complete` it lists the declared missions not written yet as a NOTE. Linear algebra is checked with `node qa/harness.js` and `node qa/generators.js --strict --draws 1000`; both must keep passing.

To play a mission: serve the game folder (`python3 -m http.server 8801 --directory game`) and open `http://localhost:8801/realm.html?realm=found`. The browser pane is the way to check pages on this Mac; the Playwright scripts in `qa/` do not run here.

## 9. Pack config (`window.REALM`), for reference

`id`, `name`, `saveId`, `pageTitle`, `description`; `chapters` (list of `{name, blurb, tier, ids}`) or `null` with `computedChapters` (linear algebra only); `sectors` (`{name, purpose}`, one per chapter); `landmarks` (`{name, at:[x, y], art}`, one per chapter, SVG drawn on the outpost ridge); `landmarkCost`; `practice` (optional, `{kinds: {b: 'setting', c: 'applied', d: 'challenge'}}`: the practice letters and kinds, §10); `ranks` (`{at, title}` rising from 0, the last with `top: true`, reached at the full mission count, learn and planned practice together: 160 for Foundations; while fewer missions are written the engine scales the steps down to the missions that exist; a rank other than the top one may add `learnAt`, a number of concepts learned that also holds the rank, so a save from before practice existed keeps its rank; the campaign strip then shows whichever is nearer, "N NEW CONCEPTS TO <rank>" or "N MISSIONS TO <rank>", because practice does not move a count of concepts); `tiers`; `tierXp` (optional); `sourceRule` `{publisherPattern, label}`; `features` `{workshop, contracts, board, docking, handson, labs}` (a script whose feature is off is not in `VG_PACKS` and is never called); `mentor` `{name, role, cardEyebrow, opening(q, purpose), closing}`; `copy` (outpost and page text; two optional functions replace the celebration after a first solve when mission titles are not names of parts: `heading(q)`, by default "<title> module installed ✦", and `consequence(q, purpose)`, the mentor's line, by default "Design verified: <solution> We can now install the <title> module in <sector> and <purpose>."; Foundations sets both, linear algebra neither); `help` (HTML of the help dialog).

## 10. Practice missions

Every concept has one **learn** mission (`q01` … `q40`, §2, unchanged) and three **practice** missions for the same skill. A practice mission's id is the learn id and one lowercase letter:

| Letter | `kind` | What it is |
|---|---|---|
| `b` | `'setting'` | The same skill in a new real-world setting. Same difficulty as the learn mission. |
| `c` | `'applied'` | An applied word problem with two or three steps. It has two or three guided steps. |
| `d` | `'challenge'` | Harder numbers, or the skill combined with **one** earlier concept (name it in `uses`). |

The letters and kinds are declared in `REALM.practice.kinds` (`{ b: 'setting', c: 'applied', d: 'challenge' }`). The id pattern is `/^q\d{2}[a-z]?$/`: no letter is a learn mission, a letter is practice.

### 10.1 How practice behaves in the game

- A practice mission **unlocks when its parent is solved** (`q01b`, `q01c` and `q01d` all open when `q01` is solved). Nothing else locks or unlocks it.
- Practice is **optional depth**. The next concept's learn mission depends only on its own `prereqs`, exactly as before. A chapter is **complete** when all its learn missions are solved: that unlocks its landmark, pays the chapter stardust and opens the next chapter's drop-down, even if the player had closed it by hand earlier (they can close it again). The drop-down a mission was opened from stays open when its dialog closes, so the finished chapter does not shut over the mission just solved and its new practice. A chapter is **mastered** when every practice mission in it is solved as well; that is shown on the chapter and changes nothing else.
- A practice mission opens **straight on the problem**. The parent's lesson (summary, intuition, steps, worked example, pitfalls, sources) is collapsed above it behind "Review the lesson". There is no "I'm ready to try" step.
- Rewards are those of any mission: the XP of the tier (`REALM.tierXp`), one skill point, a first-try ★ for a solve on the first check with no help, 10 stardust (+5 with the ★). Solved practice counts in the mission total, the level and the rank; the top rank needs all 160 missions.
- A miss is logged in the error notebook under the **concept** (the parent's id), and review drills are per concept, so a practice mission adds no drill of its own.
- The "next mission" on the main path is always a learn mission. After a learn mission the player is offered "Practise this skill"; after a practice mission, the next practice mission of the same concept.

### 10.2 What a practice mission inherits, and what it supplies

**Inherited from the parent (do not write these; the harness fails if you do):** `topic`, `tier`, `xp`, `sector`, the chapter, `lesson`, `teaching` (intuition, steps, worked example, pitfalls), `sources`, the experiment (concept bench, §4) and the variant (review drill, §5). `prereqs` is set to `[parent]`. A practice mission has no `artifact`.

**Supplied by the practice mission (all required):**

| Field | Rule |
|---|---|
| `id` | parent id + letter: `'q01b'` |
| `parent` | the learn mission's id: `'q01'` (must equal the id without its letter) |
| `kind` | `'setting'` for `b`, `'applied'` for `c`, `'challenge'` for `d` |
| `title` | its own mission name; no two missions in the pack share a title |
| `brief` | one sentence, what the outpost needs; not the parent's brief |
| `prompt` | the problem with its numbers; say what to enter and in which order. It must differ from the parent's prompt (and from its sibling practice prompts) by more than its numbers: a new situation, not the same sentence with other digits |
| `answer`, `labels` | as in §2: finite numbers, one label each. The number of answers need not match the parent's |
| `tolerance` | as in §2 and §7 (0.01 for exact answers) |
| `hints` | at least 1. Hints must not hand over the answers: the harness fails a mission whose hints contain every asked-for answer in most builds |
| `solution` | full worked solution for these numbers |
| `guidance` | at least 2 guided steps, each `{prompt, answer, labels, explanation}`; exactly 2 or 3 for kind `'applied'` |
| `uses` | optional, kind `'challenge'` only: the id of the one earlier learn mission whose idea is mixed in (it must come before the parent in the campaign). The dialog then says "This one also uses …" |

No other field is allowed. The teaching rules of §2.3 apply to the **parent's** position: a practice mission of `q05` may use only what `q01`–`q05` taught (a challenge may use any concept up to its parent, never a later one). Settings stay in the parent's sector of the outpost.

Each practice mission also needs **its own generator** in `window.MISSION_GEN[id]` with the contract of §3 (`canonical`, `draw(R)`, `build(p)`; `build(canonical)` reproduces the authored text exactly) and **its own independent oracle** (§6).

### 10.3 Files and assignment

Practice missions live in eight files, one author each. File N covers concepts q(5N−4) … q(5N), three practice missions each (b, c, d): 15 missions per file, 120 in all.

| N | Missions and generators (`game/realms/found/`) | Oracles (`qa/realms/found/`) | Concepts | Practice ids |
|---|---|---|---|---|
| 1 | `practice-1.js` | `oracle-p1.js` | q01–q05 | q01b q01c q01d q02b q02c q02d q03b q03c q03d q04b q04c q04d q05b q05c q05d |
| 2 | `practice-2.js` | `oracle-p2.js` | q06–q10 | q06b q06c q06d q07b q07c q07d q08b q08c q08d q09b q09c q09d q10b q10c q10d |
| 3 | `practice-3.js` | `oracle-p3.js` | q11–q15 | q11b q11c q11d q12b q12c q12d q13b q13c q13d q14b q14c q14d q15b q15c q15d |
| 4 | `practice-4.js` | `oracle-p4.js` | q16–q20 | q16b q16c q16d q17b q17c q17d q18b q18c q18d q19b q19c q19d q20b q20c q20d |
| 5 | `practice-5.js` | `oracle-p5.js` | q21–q25 | q21b q21c q21d q22b q22c q22d q23b q23c q23d q24b q24c q24d q25b q25c q25d |
| 6 | `practice-6.js` | `oracle-p6.js` | q26–q30 | q26b q26c q26d q27b q27c q27d q28b q28c q28d q29b q29c q29d q30b q30c q30d |
| 7 | `practice-7.js` | `oracle-p7.js` | q31–q35 | q31b q31c q31d q32b q32c q32d q33b q33c q33d q34b q34c q34d q35b q35c q35d |
| 8 | `practice-8.js` | `oracle-p8.js` | q36–q40 | q36b q36c q36d q37b q37c q37d q38b q38c q38d q39b q39c q39d q40b q40c q40d |

Each `practice-N.js` registers its missions **and** their generators; each `oracle-pN.js` holds one oracle per practice id. Both stubs exist with the boilerplate ready; add entries inside them and nowhere else. `game/realms/packs.js` already lists the eight files (after `variants-d.js`, before `variants.js`), and `qa/generators.js` loads every `oracle-*.js`.

The boilerplate at the top of each `practice-N.js`:

```js
(function(){
'use strict';
const G = window.Gen, { n, plus, par } = G;          // §3 helpers
const PRACTICE = window.PRACTICE = window.PRACTICE || [];
const GEN = window.MISSION_GEN = window.MISSION_GEN || {};
/* Registers one practice mission and its generator {canonical, draw(R), build(p)}. */
const add = (mission, generator) => { PRACTICE.push(mission); GEN[mission.id] = generator; };

add({ /* mission */ }, { /* generator */ });
// ...
})();
```

`game/chapters.js` (loaded last) turns every entry of `window.PRACTICE` into a full mission in `window.QUESTS`: it copies the inherited fields from the parent, sets `prereqs: [parent]`, and places the practice missions right after their learn mission in the campaign order. `window.CHAPTERS[i].ids` stays the chapter's learn missions; `window.CHAPTERS[i].practice` lists its practice missions.

### 10.4 The worked sample: `q01b`

In `game/realms/found/practice-1.js` (parent `q01`, place value: rivets in crates, asking for the hundreds digit; the practice moves to the seed locker and asks for the tens digit):

```js
add({
 id: 'q01b', parent: 'q01', kind: 'setting',
 title: 'The seed locker count',
 brief: 'Seed stock for the greenhouse has arrived in sacks, trays and packets, and the locker label needs one number for all of it.',
 prompt: 'Seed locker count: sacks of 1000 seeds, 7; trays of 100, 0; packets of 10, 5; loose seeds, 3. Enter the total number of seeds (type it without commas). Then enter how many seeds the tens digit of your total stands for.',
 answer: [7053, 50], labels: ['total seeds', 'tens digit stands for'], tolerance: 0.01,
 hints: [
  'Write one digit for each place: thousands first, then hundreds, tens and ones. A place with nothing in it still needs a 0.',
  'The tens digit is the second digit from the right. Each ten is 10 seeds.'
 ],
 solution: 'Thousands 7, hundreds 0, tens 5, ones 3: written in that order the number is 7053. The tens digit is 5, so it stands for 5 tens, which is 50 seeds.',
 guidance: [
  { prompt: 'Write the digits in order: thousands 7, hundreds 0, tens 5, ones 3. What number do they make?', answer: [7053], labels: ['total seeds'], explanation: 'The digits 7, 0, 5, 3 in that order make 7053. Each digit sits in the place it counts.' },
  { prompt: 'The tens digit is 5, and each ten is 10 seeds. How many seeds does a tens digit of 5 stand for?', answer: [50], labels: ['seeds'], explanation: 'A tens digit of 5 means 5 tens, which is 50 seeds.' }
 ]
}, {
 /* Not the numbers of the q01 worked example (4, 0, 6, 1 → 4061), which is shown above this mission as "Review the lesson". */
 canonical: { a: 7, b: 0, c: 5, d: 3 },
 /* The tens digit is at least 2, so "6 tens" reads naturally and the second answer is never 0. A draw never repeats
    the thousands, hundreds and tens of the worked example. */
 draw: R => { let p; do { p = { a: R.int(1, 9), b: R.int(0, 9), c: R.int(2, 9), d: R.int(0, 9) }; } while (p.a === 4 && p.b === 0 && p.c === 6); return p; },
 build: ({ a, b, c, d }) => { const total = 1000 * a + 100 * b + 10 * c + d, tens = 10 * c; return {
  prompt: `Seed locker count: sacks of 1000 seeds, ${n(a)}; trays of 100, ${n(b)}; packets of 10, ${n(c)}; loose seeds, ${n(d)}. Enter the total number of seeds (type it without commas). Then enter how many seeds the tens digit of your total stands for.`,
  answer: [total, tens],
  hints: ['Write one digit for each place: thousands first, then hundreds, tens and ones. A place with nothing in it still needs a 0.', 'The tens digit is the second digit from the right. Each ten is 10 seeds.'],
  solution: `Thousands ${n(a)}, hundreds ${n(b)}, tens ${n(c)}, ones ${n(d)}: written in that order the number is ${n(total)}. The tens digit is ${n(c)}, so it stands for ${n(c)} tens, which is ${n(tens)} seeds.`,
  guidance: [
   { prompt: `Write the digits in order: thousands ${n(a)}, hundreds ${n(b)}, tens ${n(c)}, ones ${n(d)}. What number do they make?`, answer: [total], explanation: `The digits ${n(a)}, ${n(b)}, ${n(c)}, ${n(d)} in that order make ${n(total)}. Each digit sits in the place it counts.` },
   { prompt: `The tens digit is ${n(c)}, and each ten is 10 seeds. How many seeds does a tens digit of ${n(c)} stand for?`, answer: [tens], explanation: `A tens digit of ${n(c)} means ${n(c)} tens, which is ${n(tens)} seeds.` }
  ] }; }
});
```

Its oracle in `qa/realms/found/oracle-p1.js`:

```js
Object.assign(window.ORACLE, {
  /* Write the four counts side by side as text and read the number; count the packets' seeds ten at a time. */
  q01b: p => {
    const total = Number(String(p.a) + String(p.b) + String(p.c) + String(p.d));
    let inPackets = 0; for (let i = 0; i < p.c; i++) inPackets += 10;
    return [total, inPackets];
  },
});
```

Note what the sample does **not** contain: `topic`, `tier`, `sector`, `xp`, `lesson`, `teaching`, `sources`, `prereqs`, an experiment or a variant.

### 10.5 What the checks require

`node qa/harness.js --realm found` checks every practice mission that exists:

- schema: the id is `parent + letter`, the letter is in `REALM.practice.kinds` and `kind` matches it; every required field of §10.2 is present and no other field is;
- the parent exists and is a learn mission of the pack; no learn mission lists a practice mission in `prereqs`;
- inheritance: `topic`, `tier`, `sector`, `lesson`, `teaching`, `sources`, `xp` and the chapter are the parent's; `prereqs` is `[parent]`; there is no `artifact`, no experiment and no variant under the practice id;
- everything §2.1 requires of a mission that is not inherited (texts, numeric answers, labels, tolerance, at least two guided steps, the worked example's numbers differ from the prompt's);
- `title` is unique in the pack, `brief` is not the parent's, and the prompt with its numbers removed differs from the parent's and from each sibling's;
- `'applied'` has two or three guided steps; `uses` is only on a `'challenge'` and names an earlier learn mission;
- a generator exists, and over the canonical build and 40 draws the hints do not contain every asked-for answer (a number the prompt already states does not count);
- a play-through: locked before the parent is solved, then straight to the problem with "Review the lesson", XP by tier, the first-try ★, the miss logged under the concept, chapters complete on learn missions alone, the top rank only with every mission.

A planned practice mission that is not written yet is a **NOTE**, not a failure, so the realm stays shippable while the files fill up. `--complete-practice` turns the note into a failure; use it when all 120 are in.

`node qa/generators.js --realm found --strict --draws 1000` treats a practice mission like any other mission: it **fails** one without a generator or without an oracle, compares `build(canonical)` with the authored text, and checks every draw against the oracle. `qa/realms/found/oracle-pack-checks.js` (tolerance against the answer's precision, "+ 0", a written-out coefficient 1, a hint ending in "= answer.") also runs on practice missions.

```sh
node qa/generators.js --realm found --strict --draws 1000 q01b   # one practice mission
node qa/show-mission.js q01b --realm found --draw 3              # print it, and three generated versions
node qa/harness.js --realm found                                 # all checks; missing practice is a NOTE
node qa/harness.js --realm found --complete --complete-practice  # at the end: all 40 learn and all 120 practice
```
