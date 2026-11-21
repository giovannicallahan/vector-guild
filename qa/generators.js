/* Checks for mission generators and their independent oracles, for one realm pack.
   Usage: node qa/generators.js [id ...]      e.g. node qa/generators.js q01 q02 q01b
   Options: --realm ID (or a bare pack id; default la)  --draws N (default 300)
            --strict (text differences at canonical parameters fail)
   The pack's scripts come from game/realms/packs.js. Oracles: qa/realms/<id>/oracle-*.js; the 68 linear algebra
   learn missions keep theirs in qa/oracle-a.js ... oracle-d.js. A mission without a generator or an oracle fails.
   Practice missions (q01b ..., docs/PACK-FORMAT.md "Practice missions") are missions like any other here: each
   needs its own generator and its own oracle (qa/realms/found/oracle-p1.js ... oracle-p8.js,
   qa/realms/la/oracle-p1.js ... oracle-p14.js).
   Exit code 0 only if every checked mission passes. */
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const game = path.resolve(__dirname, '../game');
const args = process.argv.slice(2);
const strict = args.includes('--strict');
const drawsAt = args.indexOf('--draws');
const draws = drawsAt >= 0 ? Number(args[drawsAt + 1]) : 300;
const only = args.filter((a, i) => /^q\d+[a-z]?$/.test(a) && (drawsAt < 0 || i !== drawsAt + 1));

const window = {};
const load = file => vm.runInNewContext(fs.readFileSync(file, 'utf8'), { window, Math, console });
const packs = {}; vm.runInNewContext(fs.readFileSync(path.join(game, 'realms/packs.js'), 'utf8'), { window: packs });
const own = id => Object.prototype.hasOwnProperty.call(packs.VG_PACKS, id);
const realmAt = args.indexOf('--realm');
const realm = realmAt >= 0 ? args[realmAt + 1] : (args.find(a => !a.startsWith('--') && own(a)) || 'la');
if (!own(realm)) { console.error(`unknown realm "${realm}"; packs: ${Object.keys(packs.VG_PACKS).join(', ')}`); process.exit(1); }
/* The whole pack loads, as on the page, except a script that needs a real browser page. */
for (const file of packs.VG_PACKS[realm].scripts) if (file !== 'handson.js') load(path.join(game, file));
window.ORACLE = {};
/* Linear algebra: its 68 learn oracles are qa/oracle-a.js ... oracle-d.js (as in 1.4.1); its practice oracles are
   qa/realms/la/oracle-p1.js ... oracle-p14.js. Any other pack: every qa/realms/<id>/oracle-*.js. */
const oracleDir = path.join(__dirname, 'realms', realm);
const oracleDirs = realm === 'la' ? [[__dirname, /^oracle-[a-z]\.js$/], [oracleDir, /^oracle-.+\.js$/]] : [[oracleDir, /^oracle-.+\.js$/]];
for (const [dir, name] of oracleDirs) if (fs.existsSync(dir)) for (const file of fs.readdirSync(dir).filter(f => name.test(f)).sort()) load(path.join(dir, file));

const { Gen, MISSION_GEN, ORACLE, QUESTS } = window;
const bad = /NaN|undefined|Infinity|[=(,:·]\s*null\b|\[object|[+−]\s*-|(?<![A-Za-z])-\d|\d\.\d{5,}|[+−]\s*[+−]\d|\(\s*\)/;
const close = (a, b) => Math.abs(a - b) <= 1e-6 * Math.max(1, Math.abs(a), Math.abs(b));
const sameList = (a, b) => a.length === b.length && a.every((x, i) => close(x, b[i]));
const texts = m => [m.prompt, ...m.hints, m.solution, ...m.guidance.flatMap(g => [g.prompt, g.explanation])];

let failed = 0, checked = 0, withOracle = 0;
const missing = [], noOracle = [];
for (const q of QUESTS) {
  if (only.length && !only.includes(q.id)) continue;
  const g = MISSION_GEN[q.id];
  if (!g) { missing.push(q.id); console.log(`FAIL ${q.id} ${q.topic}\n  - no generator in MISSION_GEN`); continue; }
  checked++;
  if (!ORACLE[q.id]) noOracle.push(q.id);
  const problems = [], notes = [];
  try {
    for (const key of ['canonical', 'draw', 'build']) if (!(key in g)) throw Error(`generator lacks ${key}`);
    // 1. Canonical parameters reproduce the authored mission.
    const c = Gen.instance(q, 0, 0);
    if (c === q) throw Error('build(canonical) failed validation (wrong answer shape or missing text)');
    if (!sameList(c.answer, q.answer)) problems.push(`canonical answer ${JSON.stringify(c.answer)} ≠ authored ${JSON.stringify(q.answer)}`);
    if (c.guidance.length !== q.guidance.length) problems.push(`canonical has ${c.guidance.length} guided steps, authored has ${q.guidance.length}`);
    c.guidance.forEach((step, i) => { if (q.guidance[i] && !sameList(step.answer, q.guidance[i].answer)) problems.push(`canonical guided step ${i + 1} answer ${JSON.stringify(step.answer)} ≠ authored ${JSON.stringify(q.guidance[i].answer)}`); });
    if (c.hints.length !== q.hints.length) problems.push(`canonical has ${c.hints.length} hints, authored has ${q.hints.length}`);
    const authored = texts(q).map(Gen.clean), built = texts(c);
    authored.forEach((text, i) => { if (built[i] !== undefined && built[i] !== text) (strict ? problems : notes).push(`text differs at canonical:\n      authored: ${text}\n      built:    ${built[i]}`); });
    // 2. Random draws: well-formed, tidy, varied, deterministic, and agreeing with the oracle.
    const prompts = new Set(), answers = new Set();
    for (let roll = 1; roll <= draws; roll++) {
      const m = Gen.instance(q, 12345, roll);
      if (m === q) { problems.push(`draw ${roll}: build failed validation (params ${JSON.stringify(g.draw(Gen.rng(12345, q.id, roll)))})`); break; }
      const again = Gen.instance(q, 12345, roll);
      if (JSON.stringify(again.answer) !== JSON.stringify(m.answer) || again.prompt !== m.prompt) { problems.push(`draw ${roll}: not deterministic`); break; }
      const where = `draw ${roll} params ${JSON.stringify(m.params)}`;
      if (m.answer.some(x => Math.abs(x) > 1e5)) { problems.push(`${where}: answer too large ${JSON.stringify(m.answer)}`); break; }
      const ugly = texts(m).find(t => bad.test(t));
      if (ugly) { problems.push(`${where}: untidy text "${ugly}"`); break; }
      const long = m.answer.find(x => !close(x, Math.round(x * 1e4) / 1e4));
      if (long !== undefined && !(q.answer.some(x => !close(x, Math.round(x * 1e4) / 1e4)))) notes.push(`${where}: answer ${long} is not a short decimal although the authored answers are`);
      if (ORACLE[q.id]) {
        let expected;
        try { expected = ORACLE[q.id](JSON.parse(JSON.stringify(m.params))); } catch (e) { problems.push(`${where}: oracle threw ${e.message}`); break; }
        if (!Array.isArray(expected) || !sameList(Array.from(expected), m.answer)) { problems.push(`${where}: generator answer ${JSON.stringify(m.answer)} ≠ oracle ${JSON.stringify(expected)}`); break; }
      }
      prompts.add(m.prompt); answers.add(JSON.stringify(m.answer));
    }
    if (prompts.size < Math.min(8, draws / 4)) problems.push(`only ${prompts.size} distinct prompts in ${draws} draws`);
    if (answers.size < 3) notes.push(`only ${answers.size} distinct answers in ${draws} draws`);
    if (ORACLE[q.id]) {
      withOracle++;
      const expected = ORACLE[q.id](JSON.parse(JSON.stringify(g.canonical)));
      if (!sameList(Array.from(expected), q.answer)) problems.push(`oracle(canonical) ${JSON.stringify(expected)} ≠ authored ${JSON.stringify(q.answer)}`);
    }
    else problems.push(`no oracle: add ORACLE.${q.id} to ${path.relative(path.resolve(__dirname, '..'), oracleDir) || '.'}/oracle-*.js`);
  } catch (error) { problems.push(error.message); }
  const uniqueNotes = [...new Set(notes)].slice(0, 6);
  if (problems.length) { failed++; console.log(`FAIL ${q.id} ${q.topic}\n  - ${problems.join('\n  - ')}`); }
  else console.log(`ok   ${q.id} ${q.topic}${ORACLE[q.id] ? ' [oracle agrees]' : ''}${uniqueNotes.length ? ` (${uniqueNotes.length} note${uniqueNotes.length > 1 ? 's' : ''})` : ''}`);
  if (uniqueNotes.length) console.log('  note: ' + uniqueNotes.join('\n  note: '));
}
const practiceCount = QUESTS.filter(q => q.parent && (!only.length || only.includes(q.id))).length;
if (only.length && only.some(id => !QUESTS.some(q => q.id === id))) { console.log(`FAIL unknown mission id: ${only.filter(id => !QUESTS.some(q => q.id === id)).join(' ')}`); failed++; }
console.log(`\n${realm}: ${checked - failed} of ${checked} generators pass${practiceCount ? ` (${practiceCount} of them practice missions)` : ''}; ${withOracle} checked against an independent oracle; ${missing.length} missions have no generator${missing.length ? ': ' + missing.join(' ') : ''}; ${noOracle.length} have no oracle${noOracle.length ? ': ' + noOracle.join(' ') : ''}.`);
if (!checked && !missing.length) console.log('No missions were checked.');
process.exitCode = failed || missing.length ? 1 : 0;
