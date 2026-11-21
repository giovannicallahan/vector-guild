/* Print a mission as authored, and optionally as generated.
   Usage: node qa/show-mission.js q12            authored fields (including lesson and worked example)
          node qa/show-mission.js q12 --draw 3   authored prompt plus three generated versions
          node qa/show-mission.js q01 --realm found   a mission of another pack (default la) */
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const game = path.resolve(__dirname, '../game');
const window = {};
const load = file => vm.runInNewContext(fs.readFileSync(path.join(game, file), 'utf8'), { window, Math, console });
const packs = {}; vm.runInNewContext(fs.readFileSync(path.join(game, 'realms/packs.js'), 'utf8'), { window: packs });
const realmAt = process.argv.indexOf('--realm'), realm = realmAt >= 0 ? process.argv[realmAt + 1] : 'la';
if (!Object.prototype.hasOwnProperty.call(packs.VG_PACKS, realm)) { console.error('unknown realm ' + realm); process.exit(1); }
for (const file of packs.VG_PACKS[realm].scripts) if (file !== 'handson.js') load(file);
const id = process.argv[2];
const q = window.QUESTS.find(x => x.id === id);
if (!q) { console.error('unknown mission ' + id); process.exit(1); }
const drawAt = process.argv.indexOf('--draw');
const pick = m => ({ prompt: m.prompt, answer: m.answer, hints: m.hints, solution: m.solution, guidance: m.guidance });
if (drawAt < 0) {
  console.log(JSON.stringify({ id: q.id, topic: q.topic, title: q.title, tier: q.tier, labels: q.labels, tolerance: q.tolerance, brief: q.brief, lesson: q.lesson, ...pick(q), teaching: q.teaching }, null, 1));
} else {
  console.log('AUTHORED', JSON.stringify(pick(q), null, 1));
  const count = Number(process.argv[drawAt + 1]) || 3;
  for (let roll = 1; roll <= count; roll++) {
    const m = window.Gen.instance(q, 777, roll);
    console.log(`\nDRAW ${roll}`, m === q ? 'FAILED VALIDATION (fell back to authored)' : JSON.stringify({ params: m.params, labels: q.labels, ...pick(m) }, null, 1));
  }
}
