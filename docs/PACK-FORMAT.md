# Realm pack format (Vector Guild 2.0)

This is the contract for writing missions for a realm pack. It is written for the Foundations pack (`found`), but every pack follows it. Everything here is checked by `qa/harness.js` and `qa/generators.js`; if those pass, the game can play the mission.

## 1. How a pack is loaded

- `game/realm.html?realm=<pack id>` loads exactly one pack. The script list, in load order, is `window.VG_PACKS[<id>].scripts` in `game/realms/packs.js`; `realm.html` adds `app.js` last. An unknown id goes back to the star map (`index.html`).
- All files are plain classic scripts: no modules, no build step, no network, no libraries. Each file is wrapped in `(function(){ 'use strict'; ... })();` and adds to a shared global.
- Only one pack is loaded per page, so every pack uses **local ids** `q01`, `q02`, ... Progress is saved per realm (`docs/SAVE-V2.md`).
- `realms/<id>/pack.js` sets `window.REALM` (chapters, sectors, ranks, copy). Content authors do not edit it, except to correct a chapter's mission list with the engine owner.

### Foundations files

| File | Holds | Global it adds to |
|---|---|---|
| `game/realms/found/missions-a.js` … `missions-d.js` | mission objects (§2) | `window.QUESTS` (push) |
| `game/realms/found/gen-a.js` … `gen-d.js` | generators (§3) | `window.MISSION_GEN` |
| `game/realms/found/experiments-a.js` … `experiments-d.js` | concept-bench models (§4) | `window.EXPERIMENTS` |
| `game/realms/found/variants-a.js` … `variants-d.js` | review-drill statements (§5) | `window.VARIANT_SETUP`, `window.VARIANT_POOL` |
| `qa/realms/found/oracle-<anything>.js` | independent answer oracles (§6) | `window.ORACLE` |

The letters are only containers: a mission, its generator, experiment and variant may go in any of the four files of each kind. Keep one author per file to avoid edit clashes. The stub files already contain the registration boilerplate; add entries inside the `push(...)` or `Object.assign(..., { ... })`.

Load order inside the Foundations pack: `pack.js`, `missions-*`, `gen-core.js`, `gen-*`, `gameplay.js`, `experiments-*`, `variants-*`, `variants.js`, `concept-lab.js`, `chapters.js`. So a generator may use `window.Gen` only inside its functions (it is defined before `gen-*` load, so top-level `const G = window.Gen` is also fine), and `variants-*.js` must run before `game/variants.js` (they do).

The temporary `sample.js` and `oracle-sample.js` that proved this format were removed once all 40 missions were written; `missions-a.js` (q01) and `missions-b.js` (q16) now show the same patterns.

### Foundations ids, chapters, tiers, sectors

The id of each mission is fixed by `REALM.chapters` in `game/realms/found/pack.js`:

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
  id: 'q07',                       // fixed by the chapter table; /^q\d{2}$/
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

A review drill (and the reward check after "Reveal solution") shows `VARIANT_SETUP[id](t)` and the experiment's `prompt`, and accepts an answer within 2% (at least 0.02) of the experiment's `target`; the answer box is labelled `values[0][0]`. The statement must describe the same numbers the experiment uses for that `t`, must be at least 8 characters, and must be tidy (same rules as §4). Use `VARIANT_POOL` to keep drills away from degenerate `t` values. Choose numbers so that a typical mistake is more than 2% away from the target. `game/variants.js` merges these tables; linear algebra's built-in table applies only to the `la` pack.

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

- Answers are numbers. The answer box accepts `12`, `-3`, `2.5`, `2,5` (a comma is a **decimal point**), `7/6`, `-3/4` and `1 1/2`. So never ask for or print `6,038`: a player typing it gets 6.038. Write large numbers without separators and say "type it without commas" where it matters.
- When the reduced form of a fraction is the point, ask for the numerator and the denominator in two separate answer boxes (and say "in lowest terms"); a single box would accept any equal value.
- `tolerance` is absolute. Use 0.01 for exact answers; for rounded answers say how to round and size the tolerance to it.

## 8. Running the checks

From the repository root:

```sh
node qa/generators.js --realm found --strict --draws 1000 q07   # one mission: generator, text, oracle
node qa/generators.js --realm found --strict --draws 1000       # every mission in the pack
node qa/show-mission.js q07 --realm found --draw 3              # print the mission and three generated versions
node qa/harness.js --realm found                                # schema, teaching, chapters, experiments, variants, play-through
node qa/harness.js --realm found --complete                     # also require all 40 declared missions (use at the end)
node qa/save-store.test.js                                      # save format tests (engine; not content)
```

`qa/harness.js` checks the whole pack at once and stops at the first failure, printing the mission id and the rule. Without `--complete` it lists the declared missions not written yet as a NOTE. Linear algebra is checked with `node qa/harness.js` and `node qa/generators.js --strict --draws 1000`; both must keep passing.

To play a mission: serve the game folder (`python3 -m http.server 8801 --directory game`) and open `http://localhost:8801/realm.html?realm=found`. The browser pane is the way to check pages on this Mac; the Playwright scripts in `qa/` do not run here.

## 9. Pack config (`window.REALM`), for reference

`id`, `name`, `saveId`, `pageTitle`, `description`; `chapters` (list of `{name, blurb, tier, ids}`) or `null` with `computedChapters` (linear algebra only); `sectors` (`{name, purpose}`, one per chapter); `landmarks` (`{name, at:[x, y], art}`, one per chapter, SVG drawn on the outpost ridge); `landmarkCost`; `ranks` (`{at, title}` rising from 0, the last with `top: true`, reached at the mission count); `tiers`; `tierXp` (optional); `sourceRule` `{publisherPattern, label}`; `features` `{workshop, contracts, board, docking, handson, labs}` (a script whose feature is off is not in `VG_PACKS` and is never called); `mentor` `{name, role, cardEyebrow, opening(q, purpose), closing}`; `copy` (outpost and page text); `help` (HTML of the help dialog).
