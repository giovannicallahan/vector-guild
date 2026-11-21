/* Mira's spoken briefings, one per learn mission, exactly as the game builds them (Outpost.narration).
   node tools/voice-lines.js <pack> <out.json>   writes {id: text} for the recording script.
   node tools/voice-lines.js --index             rewrites game/voice/index.js from the recorded files.
   node tools/voice-lines.js --check             fails if a recording is missing, stale (the text changed since it
                                                 was recorded) or not listed in game/voice/index.js.
   The recordings are made outside this repo with the open-source Kokoro voice model; see docs/VOICE.md. */
const fs = require('fs'), vm = require('vm'), path = require('path'), crypto = require('crypto');
const game = path.join(__dirname, '..', 'game');
const SKIP = /handson|experiments|experiment-|lab3d|graph-lab|concept-lab|docking|contracts|board|skip|glossary|variants|reading/;
function lines(pack) {
  const window = {}, packs = {};
  vm.runInNewContext(fs.readFileSync(path.join(game, 'realms/packs.js'), 'utf8'), { window: packs });
  const doc = { createElement: () => ({ style: {}, appendChild() {}, setAttribute() {} }), addEventListener() {}, querySelector: () => null, querySelectorAll: () => [], documentElement: { style: {} } };
  for (const f of packs.VG_PACKS[pack].scripts) { if (SKIP.test(f)) continue; vm.runInNewContext(fs.readFileSync(path.join(game, f), 'utf8'), { window, Math, console, document: doc }); }
  const out = {}; for (const q of window.QUESTS) if (!q.parent) out[q.id] = window.Outpost.narration(q); return out;
}
const stamp = text => crypto.createHash('sha1').update(text).digest('hex').slice(0, 10);
const PACKS = ['found', 'la'];
function index() {
  const all = {};
  for (const p of PACKS) { const m = path.join(game, 'voice', p, 'manifest.json'); all[p] = {}; if (fs.existsSync(m)) for (const id of Object.keys(JSON.parse(fs.readFileSync(m, 'utf8'))).sort()) if (fs.existsSync(path.join(game, 'voice', p, id + '.m4a'))) all[p][id] = 1; }
  return '/* Recorded briefings by Mira: which missions have a clip at voice/<pack>/<id>.m4a. Written by tools/voice-lines.js --index. */\nwindow.VG_VOICE = ' + JSON.stringify(all) + ';\n';
}
if (require.main === module) {
  const a = process.argv.slice(2);
  if (a[0] === '--index') { fs.writeFileSync(path.join(game, 'voice', 'index.js'), index()); console.log('wrote game/voice/index.js'); }
  else if (a[0] === '--check') {
    let bad = 0, n = 0;
    for (const p of PACKS) { const man = JSON.parse(fs.readFileSync(path.join(game, 'voice', p, 'manifest.json'), 'utf8'));
      for (const [id, text] of Object.entries(lines(p))) { n++; const f = path.join(game, 'voice', p, id + '.m4a');
        if (!fs.existsSync(f) || fs.statSync(f).size < 20000) { bad++; console.log('MISSING', p, id); } else if (man[id] !== stamp(text)) { bad++; console.log('STALE', p, id); } } }
    if (fs.readFileSync(path.join(game, 'voice', 'index.js'), 'utf8') !== index()) { bad++; console.log('game/voice/index.js is out of date'); }
    console.log(bad ? `FAIL: ${bad} problem(s)` : `PASS: ${n} recorded briefings match the game text.`); process.exit(bad ? 1 : 0);
  } else { fs.writeFileSync(a[1], JSON.stringify(lines(a[0]), null, 1)); }
}
module.exports = { lines, stamp };
