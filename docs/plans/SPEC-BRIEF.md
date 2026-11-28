# Brief: turn a plan into a pack spec

Given a pack id `<id>`: read `docs/plans/<ID>-PLAN.md`, `docs/PACK-SPEC.md` (all of §2 and the example) and `tools/packs/calc1.example.json`, then write `tools/packs/<id>.json`.

- Take every value from the plan: name, description, the 7 chapters (name, blurb, sector name and purpose, landmark name), the 9 rank titles, the two achievement names, the copy lines (home title, first visit, first button, all done), the must-have glossary terms (`glossaryRequired`), the 40 concept titles (`concepts`) and the source rule (publisher word or words; when the plan cites two publishers the pattern must accept both, e.g. `OpenStax|Levin`).
- Where the spec needs a value the plan does not give (mentor lines, help text, `short`, a glyph key per landmark, remaining copy strings), write it in the style of the calc1 example, adapted to this subject. Mira stays the mentor. Pick a landmark glyph from the list in PACK-SPEC that suits each landmark name.
- British spelling, plain words, no jargon.
- Check: `node tools/new-pack.js --print tools/packs/<id>.json` must print a pack.js with no error. Do NOT run the scaffolder without `--print`. Edit no other file. Do not commit.

Report: the path, the `short` name, the source pattern, and any value you had to invent.
