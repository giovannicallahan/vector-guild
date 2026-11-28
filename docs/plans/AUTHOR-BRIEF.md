# Briefs for pack authors

Repo root: the `vector-guild` folder. Many agents write different packs and files at the same time. **Edit only the files you were assigned. Never edit a shared file (list in `docs/PACK-SPEC.md` §1). Never commit, never run git commands that change the tree (no checkout, stash, reset).** If a check fails because of someone else's unfinished file, report it and carry on with your own missions.

Read before writing: `docs/PACK-FORMAT.md` (all of it; read "found"/"calc1" as your pack id), `docs/PACK-SPEC.md` §1 and the glossary section, your pack's `docs/plans/<ID>-PLAN.md`, `game/realms/<id>/pack.js`, and the Calculus 1 worked samples named below.

The player is an adult with no maths beyond the packs the plan lists as finished. Every new word and symbol is taught in the mission that first uses it. Plain English, British spelling, short sentences, the Kepler outpost setting from the plan, Mira as mentor. Answers are numbers only. Missions are original: never copy a textbook problem. Never invent a fact or a source: a mission's `source` is the section the plan gives for it, with its URL.

## A. Learn author (one letter: a = q01–q10, b = q11–q20, c = q21–q30, d = q31–q40)

Your files: `game/realms/<id>/missions-<L>.js`, `gen-<L>.js`, `experiments-<L>.js`, `variants-<L>.js`, and your letter's section of `game/realms/<id>/glossary.js` (other letters edit other sections of that file at the same time: change only your own section, with small exact edits, never a rewrite of the file).
Samples: `game/realms/calc1/missions-a.js`, `gen-a.js`, `experiments-a.js`, `variants-a.js` (q01 and two more missions of your choice).
For each of your 10 concepts write the mission (§2), its generator (§3), its concept-bench experiment (§4), its review-drill variant (§5) and its glossary words. Follow the plan's "Asked:" line and prerequisites. Do NOT write oracles and do not read `qa/realms/<id>/`: an independent writer does them from your mission text.
Checks, after every few missions and at the end (all must pass for your ids, apart from "no oracle" notes):
`node qa/harness.js --realm <id>` · `node qa/generators.js --realm <id> --draws 1000 qNN` for each of your ids (without `--strict` while the oracle is missing) · `node qa/show-mission.js qNN --realm <id> --draw 3` and read the output as the player would · `node qa/glossary.test.js`.
Report: ids written, check results (last lines), any plan concept you changed and why.

## B. Learn oracle writer (one letter)

Your file: `qa/realms/<id>/oracle-<L>.js`. Sample: `qa/realms/calc1/oracle-a.js`, format in PACK-FORMAT §6.
For each of the letter's 10 missions, read the mission's text with `node qa/show-mission.js qNN --realm <id> --draw 3` and its entry in `missions-<L>.js`. **Do not open `gen-<L>.js` before your oracle for that mission is written**: the oracle must compute the answer independently, from the parameters and the question as stated. Then run `node qa/generators.js --realm <id> --strict --draws 1000 qNN`. When the oracle and the generator disagree, work out by hand which is right, fix your oracle if it is wrong, and otherwise report the generator bug (id, parameters, both answers, the correct one) without editing the generator.
Report: ids covered, pass/fail per id, every disagreement found and who was right.

## C. Practice author (one file N: concepts q(5N−4)…q(5N), 15 missions)

Your file: `game/realms/<id>/practice-<N>.js`. Samples: `game/realms/calc1/practice-1.js` and PACK-FORMAT §10 (all of it).
For each of your 5 concepts write `qNNb` (new setting), `qNNc` (applied problem) and `qNNd` (challenge), each with its generator, after reading the learn mission it practises. Do NOT write oracles.
Checks: `node qa/harness.js --realm <id>` · `node qa/generators.js --realm <id> --draws 1000 qNNb` (and c, d) · `node qa/show-mission.js qNNb --realm <id> --draw 3`.
Report: ids written, check results, anything in the learn mission that looked wrong.

## D. Practice oracle writer (one file N)

Your file: `qa/realms/<id>/oracle-p<N>.js`. Sample: `qa/realms/calc1/oracle-p1.js`. Same rule as B: write each oracle from the mission text before opening the generator, then run `node qa/generators.js --realm <id> --strict --draws 1000 qNNb` (c, d) and report disagreements with the correct answer worked by hand.

## E. Repair author (one pack)

You get a list of failures and disagreements. Fix the generator or mission at fault in the pack's own files, never the oracle to match a wrong generator, and never a shared file. Finish with `node qa/harness.js --realm <id> --complete --complete-practice`, `node qa/generators.js --realm <id> --strict --draws 1000` and `node qa/glossary.test.js` all passing, and paste their last lines.

## Lessons from wave 1 (every author and repairer: these were the reviewers' most common findings)
- State every assumption the answer relies on (independence, "the pattern continues", "exactly these items", which range an angle lies in, a ≥ b before subtracting). If a careful reader could defend a second answer, the prompt is wrong.
- A mission may be reached with only its listed prerequisites: do not use a word, symbol or rule another mission teaches unless that mission is a prerequisite; otherwise state it in a sentence. A practice mission unlocks from its parent alone, even when it has `uses`.
- A source must cover the topic: open the page and find the idea on it before citing it. A matching section title is not enough.
- Say how to round, and never make the expected answer depend on rounding an intermediate value; filter draws where early rounding changes the last digit, and draws that land exactly on a rounding tie.
- Hints state the rule, never the draw's numbers or answer. Guided-step labels must name what that step asks for.
- Generated text: no "1 crates", "1n", "+ −4", "= 2.49, which rounds to 2.49"; answers of 1000 or more need "without commas" in the prompt.
- Each generator should give 30 or more distinct prompts in 300 draws, never draw its own worked example (or, for practice, its parent's), and never reject its own draws.
- Oracles compute from the stated maths (tables, search, numerical methods); a parameter that is only an index into a list of texts gets a one-line comment saying so.

## Lessons from wave 2 (every author and repairer)
- A practice mission's `uses` field does not gate unlocking; it only prints a line. If a practice mission needs a rule its parent did not teach, teach that rule in a sentence in the prompt. A learn mission may rely only on its declared `prereqs` (and theirs).
- Bound every retry loop in a draw: at most 1000 tries, then fall back to the canonical parameters. One unbounded loop hangs every check for the pack.
- Counts of things are whole numbers in every draw (no "312.5 seeds"). If a draw multiplies a share by a size, round the base first and build the story from the rounded count.
- When a lookup table is printed, vary which row holds the answer; never always the middle row.
- Never state as a general fact something that is only true of the draws (for example "equal counts mean the same shape"). Say "for these small cases" and say what the general truth is.
- If the prompt says how many there are of something, do not then ask for that number.
- State conventions the answer depends on: sign conventions, orientation, "net" against "total", whether whole numbers include negatives, which table to read a value from, and whether a decision uses the rounded or unrounded value.
- Ordinals and plurals come from helpers (1st, 2nd, 3rd, 11th; "1 metre"); never glue "th" or "s" on.
- A source row may credit a section only with what that section states. Anything else is "worked out in this mission". Never invent a citation.
- A guided step asks one thing and has one answer box. An applied (c) mission has two or three guided steps.

## Lessons from wave 3 (every author and repairer)

- Every number the prompt prints must be a parameter (or computed from parameters by a rule the prompt states). An oracle that has to rebuild a printed number from a hidden answer or from an index into your private table is circular and checks nothing.
- No answer box, and no guided step, may have the same answer in every draw (an identity that is always 1, a count that is always 8!, a code that is always 1). Two boxes that agree in most draws need draws where they differ.
- Keep the authored (canonical) numbers off rounding ties and off search ties (n = 118 against 119). Filter drawn ties too.
- Text written for one case must not be printed in another: a step that says "because it is inside" when the point is outside, a hint that names the logistic model in a cooling draw, "weaker brine" when it is stronger. Make the sentence depend on the draw or make it true for all of them.
- A decimal answer that is not short needs its rounding stated in the prompt ("to 3 decimal places"), or the draws restricted.
- A solution line must be a true statement: write "leaves the same remainder as", not "=", for remainders; keep bounds exact until the last step and then round.
- When a prompt says "divide by A and then by B", say whether B divides the original or the quotient.
- A lesson that uses a word or rule must define it there or name the mission that did (left and right cosets, lcm, "group").
- Scratch files go in your own folder under the scratchpad. Never run or edit another agent's script.
- This repo may be a worktree whose folder is not named `vector-guild`: use the path your prompt gives.

## Working rules for every agent (wave 2 on)
- Edit only the file or files your task names. Do not commit. Temporary files go in your own uniquely named subfolder of the session scratchpad given in your task, never `/tmp`.
- Other authors are writing other files of the same pack at the same time. A failure, NOTE or hang caused by a half-written file of theirs is not yours: re-run later, and judge your work by the lines for your own ids.
- Practice authors: pattern file `game/realms/calc2/practice-N.js` (local `mk(meta, gen)` helper so authored text is `build(canonical)`); read the parent learn missions and generators first; report anything wrong you notice in them.
- Oracle writers: work from the prompt text (`node qa/show-mission.js <id> --realm <id> --draw N`) by a different method from build(); if a generator looks wrong, report it, never bend the oracle; report any prompt whose wording does not match its expected answer.
- Final report: short. Ids written, the last line of each check, and a list of findings.
