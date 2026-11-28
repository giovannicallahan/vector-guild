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
