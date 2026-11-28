/* The pack scaffolder (tools/new-pack.js, docs/PACK-SPEC.md) and the registration of every pack.
   Run: node qa/new-pack.test.js
     - tools/packs/calc1.example.json gives a pack.js whose window.REALM equals game/realms/calc1/pack.js in every
       field (functions compared by their output, the source rule by its pattern and flags)
     - the scaffolder writes every file into a scratch copy of the repository, is idempotent, never overwrites a file
       with content, refuses a clashing shared entry, and --remove puts packs.js and registry.js back byte for byte
     - a bad spec is refused with a message naming the field
     - the landmark glyphs are plain SVG shapes in the outpost palette and size
     - the real game: every ready registry part has a pack, counts and achievement names; every pack added after 2.5
       has exactly the standard script list (so nobody hand-edited it) and its own glossary file */
'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const vm = require('node:vm');
const repo = path.resolve(__dirname, '..');
const NP = require('../tools/new-pack.js');
const { BASE, readyParts } = require('./pack-list.js');
const read = f => fs.readFileSync(path.join(repo, f), 'utf8');
const realmOf = text => { const w = {}; vm.runInNewContext(text, { window: w }); return w.REALM; };
let checks = 0;
const check = (name, fn) => { fn(); checks++; if (process.env.VERBOSE) console.log('ok   ' + name); };

/* Two REALM objects are the same pack when every value is equal; a function is compared by what it returns. */
function compare(a, b, where) {
  if (typeof a === 'function' || typeof b === 'function') {
    assert.equal(typeof a, typeof b, where + ': both functions');
    const q = { id: 'q07', title: 'A “quoted” title', brief: 'The brief.', topic: 'Some Topic', solution: 'The solution.', sector: 'Some Sector' };
    for (const purpose of ['keep the pumps running', '']) assert.equal(a(q, purpose), b(q, purpose), where + ': same output');
    return;
  }
  if (a instanceof Object && typeof a.test === 'function' && 'source' in a) { assert.equal(String(a.source), String(b.source), where + ': pattern'); assert.equal(a.flags, b.flags, where + ': flags'); return; }
  if (a && typeof a === 'object') {
    assert.ok(b && typeof b === 'object', where + ': both objects');
    assert.deepEqual(Object.keys(a), Object.keys(b), where + ': the same fields, in the same order');
    for (const k of Object.keys(a)) compare(a[k], b[k], where + '.' + k);
    return;
  }
  assert.equal(a, b, where);
}

check('calc1.example.json reproduces game/realms/calc1/pack.js', () => {
  const spec = JSON.parse(read('tools/packs/calc1.example.json'));
  const made = realmOf(NP.renderPack(NP.normalize(spec))), real = realmOf(read('game/realms/calc1/pack.js'));
  compare(made, real, 'REALM');
  /* and the text differs only in comments */
  const strip = t => t.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\s+/g, ' ').trim();
  assert.equal(strip(NP.renderPack(NP.normalize(spec))), strip(read('game/realms/calc1/pack.js')), 'outside comments, the same text');
});

check('docs/PACK-SPEC.md shows tools/packs/calc1.example.json as it is', () => {
  const doc = read('docs/PACK-SPEC.md'), block = doc.slice(doc.lastIndexOf('```json\n') + 8, doc.lastIndexOf('\n```'));
  assert.equal(block + '\n', read('tools/packs/calc1.example.json'));
  for (const key of Object.keys(NP.GLYPHS)) assert.ok(doc.includes('`' + key + '`'), 'PACK-SPEC lists the glyph ' + key);
});

check('a spec with a source rule for another book', () => {
  const spec = JSON.parse(read('tools/packs/calc1.example.json'));
  Object.assign(spec, { id: 'abstract', registry: {}, name: 'Abstract algebra', short: 'Abstract algebra', source: { pattern: 'Judson', label: 'Judson, Abstract Algebra', example: 'Judson, Abstract Algebra — 3.1 Integer Equivalence Classes and Symmetries' } });
  const R = realmOf(NP.renderPack(NP.normalize(spec)));
  assert.ok(R.sourceRule.publisherPattern.test('Judson, Abstract Algebra — 3.1') && !R.sourceRule.publisherPattern.test('OpenStax Calculus'), 'the pattern comes from the spec');
  assert.equal(R.sourceRule.label, 'Judson, Abstract Algebra');
  spec.source = { pattern: 'Lebl/Basic Analysis', flags: 'i', label: 'Lebl' };
  const L = realmOf(NP.renderPack(NP.normalize(spec)));
  assert.ok(L.sourceRule.publisherPattern.test('LEBL/basic analysis') && L.sourceRule.publisherPattern.flags === 'i', 'a slash and flags survive');
  spec.mentor = Object.assign({}, spec.mentor, { opening: 'Hi `x` $5 \\ {topic.lower} — {purpose}.' });
  assert.equal(realmOf(NP.renderPack(NP.normalize(spec))).mentor.opening({ topic: 'Group Theory' }, 'p'), 'Hi `x` $5 \\ group theory — p.', 'template text is quoted, placeholders filled');
  delete spec.help; spec.help = { eyebrow: 'WELCOME', title: 'Groups.', intro: 'Symmetry first.', answers: 'Orders are whole numbers.' };
  assert.match(realmOf(NP.renderPack(NP.normalize(spec))).help, /^<div class="eyebrow">WELCOME<\/div><h2>Groups\.<\/h2><p>Symmetry first\.<\/p>.*the mission says how\. Orders are whole numbers\.<br>03 \//, 'the standard help from three lines');
});

check('a bad spec is refused, naming the field', () => {
  const good = JSON.parse(read('tools/packs/calc1.example.json'));
  const bad = (change, field) => { const s = JSON.parse(JSON.stringify(good)); change(s); assert.throws(() => NP.normalize(s), e => e instanceof NP.SpecError && e.message.startsWith(field), field); };
  bad(s => { s.id = 'Calc-2'; }, 'id');
  bad(s => { s.chapters.pop(); }, 'chapters');
  bad(s => { s.chapters[1].size = 7; }, 'chapters[1].size');
  bad(s => { s.chapters[6].size = 5; }, 'chapters: 40');
  bad(s => { s.chapters[2].landmark.glyph = 'castle'; }, 'chapters[2].landmark.glyph');
  bad(s => { s.chapters[2].landmark = { name: 'X', art: '<script>alert(1)</script>' }; }, 'chapters[2].landmark.art');
  bad(s => { s.chapters[3].sector.name = s.chapters[2].sector.name; }, 'chapters: every sector');
  bad(s => { s.ranks.pop(); }, 'ranks');
  bad(s => { s.source.pattern = '('; }, 'source.pattern');
  bad(s => { s.source.example = 'Some other book'; }, 'source.example');
  bad(s => { s.mentor.opening = 'Hi {name}'; }, 'mentor.opening');
  bad(s => { delete s.copy.allDone; }, 'copy.allDone');
  bad(s => { s.achievements.done = 'A name that is far too long for a card'; }, 'achievements');
  bad(s => { s.short = 'Electricity and magnetism'; }, 'short');
  bad(s => { s.help = '<p onclick="x()">Hi</p>'; }, 'help');
  bad(s => { s.registry = { part: 'other' }; }, 'registry.part');
  bad(s => { s.concepts.q01 = 'Rates */ alert(1) /*'; }, 'the spec contains');
  /* defaults: chapter sizes, tiers, landmark places and glyphs */
  const s = JSON.parse(JSON.stringify(good)); for (const c of s.chapters) { delete c.size; delete c.tier; delete c.landmark.glyph; }
  const n = NP.normalize(s);
  assert.deepEqual(n.chapters.map(c => c.ids.length), [6, 5, 6, 6, 6, 5, 6]);
  assert.deepEqual(n.chapters.map(c => c.tier), ['Basic', 'Basic', 'Intermediate', 'Intermediate', 'Intermediate', 'Advanced', 'Advanced']);
  assert.equal(new Set(n.chapters.map(c => c.landmark.art)).size, 7, 'seven different default glyphs');
});

check('the scaffolder in a scratch repository: writes, is idempotent, keeps work, refuses clashes, removes cleanly', () => {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'vg-new-pack-'));
  try {
    fs.mkdirSync(path.join(tmp, 'game/realms'), { recursive: true }); fs.mkdirSync(path.join(tmp, 'qa/realms'), { recursive: true });
    for (const f of ['game/realms/packs.js', 'game/realms/registry.js']) fs.copyFileSync(path.join(repo, f), path.join(tmp, f));
    const at = f => path.join(tmp, f), original = { packs: fs.readFileSync(at('game/realms/packs.js'), 'utf8'), registry: fs.readFileSync(at('game/realms/registry.js'), 'utf8') };
    const base = JSON.parse(read('tools/packs/calc1.example.json'));
    const specFor = (id, extra) => Object.assign(JSON.parse(JSON.stringify(base)), { id, registry: {}, name: 'Test ' + id, short: 'Test ' + id, achievements: { done: id + ' done', master: id + ' mastered' } }, extra || {});
    const quiet = r => r;
    /* The live registry changes as packs are scaffolded, so the part flipped here is the first 'coming' one without a pack. */
    const live = {}; vm.runInNewContext(original.packs, { window: live }); vm.runInNewContext(original.registry, { window: live });
    const coming = live.VG_REALMS.flatMap(n => n.parts).find(p => p.status === 'coming' && !live.VG_PACKS[p.id]);
    assert.ok(coming, 'the registry still has a coming part to flip'); const F = coming.id, FNAME = coming.name;
    /* 1. a part the registry has as 'coming' is flipped to ready */
    const flip = specFor(F, { name: FNAME });
    let r = quiet(NP.scaffold(flip, tmp));
    assert.deepEqual(r.conflicts, []); assert.equal(r.written.length, 39 + 2, 'pack.js, 37 stubs, the glossary and the two shared files'); assert.deepEqual(r.kept, []);
    for (const f of [`game/realms/${F}/pack.js`, `game/realms/${F}/missions-d.js`, `game/realms/${F}/practice-8.js`, `game/realms/${F}/glossary.js`, `qa/realms/${F}/oracle-p8.js`, `qa/realms/${F}/oracle-pack-checks.js`]) assert.ok(fs.existsSync(at(f)), f);
    const w = {}; vm.runInNewContext(fs.readFileSync(at('game/realms/packs.js'), 'utf8'), { window: w }); vm.runInNewContext(fs.readFileSync(at('game/realms/registry.js'), 'utf8'), { window: w });
    assert.deepEqual(Array.from(w.VG_PACKS[F].scripts), NP.packEntry(NP.normalize(flip)), 'the VG_PACKS entry');
    for (const id of ['la', 'found', 'calc1']) assert.deepEqual(JSON.parse(JSON.stringify(w.VG_PACKS[id])), JSON.parse(JSON.stringify((() => { const v = {}; vm.runInNewContext(original.packs, { window: v }); return v.VG_PACKS[id]; })())), id + ' is untouched');
    const part = w.VG_REALMS.flatMap(n => n.parts).find(p => p.id === `${F}`);
    assert.deepEqual(JSON.parse(JSON.stringify(part)), { id: `${F}`, name: FNAME, status: 'ready', missions: 160, learn: 40, ach: { short: `Test ${F}`, done: `${F} done`, master: `${F} mastered` } });
    /* every stub is a classic script that loads, and the pack loads in its order with the engine files */
    for (const f of NP.packEntry(NP.normalize(flip))) if (f.startsWith(`realms/${F}/`)) assert.doesNotThrow(() => new vm.Script(fs.readFileSync(at('game/' + f), 'utf8')), f);
    for (const f of fs.readdirSync(at(`qa/realms/${F}`))) assert.doesNotThrow(() => new vm.Script(fs.readFileSync(at(`qa/realms/${F}/` + f), 'utf8')), f);
    const page = { VG_SEED: 0 };
    for (const f of NP.packEntry(NP.normalize(flip))) vm.runInNewContext(fs.existsSync(at('game/' + f)) ? fs.readFileSync(at('game/' + f), 'utf8') : read('game/' + f), { window: page, Math });
    assert.equal(page.REALM.id, `${F}`); assert.equal(page.QUESTS.length, 0); assert.deepEqual(Object.keys(page.VG_GLOSSARY[F]), []); assert.equal(page.VGGlossary.find('a limit', `${F}`).length, 0, 'an empty glossary matches nothing');
    const oracles = { ORACLE: {} }; Object.assign(oracles, page); for (const f of fs.readdirSync(at(`qa/realms/${F}`))) vm.runInNewContext(fs.readFileSync(at(`qa/realms/${F}/` + f), 'utf8'), { window: oracles, Math });
    /* 2. idempotent */
    r = NP.scaffold(flip, tmp); assert.deepEqual(r.written, []); assert.equal(r.unchanged.length, 41); assert.deepEqual(r.conflicts, []);
    /* 3. a file with work in it is kept, never overwritten; an emptied one is written again */
    const work = '/* my missions */\n'; fs.writeFileSync(at(`game/realms/${F}/missions-a.js`), work); fs.writeFileSync(at(`game/realms/${F}/gen-b.js`), '  \n');
    r = NP.scaffold(flip, tmp); assert.deepEqual(r.kept, [`game/realms/${F}/missions-a.js`]); assert.deepEqual(r.written, [`game/realms/${F}/gen-b.js`]); assert.deepEqual(r.conflicts, []);
    assert.equal(fs.readFileSync(at(`game/realms/${F}/missions-a.js`), 'utf8'), work);
    /* 4. a clash in a shared file is refused: the same id with other data */
    r = NP.scaffold(Object.assign(specFor(`${F}`), { name: 'Another name' }), tmp);
    assert.ok(r.conflicts.some(c => c.includes(`packs.js: VG_PACKS.${F} exists`)) && r.conflicts.some(c => c.includes(`registry.js: the registry part ${F} is already ready`)), r.conflicts.join('; '));
    assert.throws(() => NP.normalize(specFor('zz', { registry: { part: `${F}` } })), NP.SpecError);
    assert.ok(NP.scaffold(specFor('calc1'), tmp).conflicts.length, 'calc1 itself is never scaffolded');
    assert.ok(NP.scaffold(specFor('qq', { saveId: 'calc1' }), tmp).conflicts.some(c => /saveId calc1/.test(c)), 'a saveId in use is refused');
    assert.ok(NP.scaffold(specFor('nopart'), tmp).conflicts.some(c => /no part nopart/.test(c)), 'a part the registry lacks needs registry.node');
    assert.ok(!fs.existsSync(at('game/realms/nopart')) && !fs.readFileSync(at('game/realms/packs.js'), 'utf8').includes('nopart'), 'and a refused scaffold writes nothing');
    /* 5. --remove refuses while a file holds work, then removes everything */
    r = NP.remove(flip, tmp); assert.ok(r.conflicts.length && fs.existsSync(at(`game/realms/${F}/pack.js`)), 'nothing removed while missions-a.js holds work');
    fs.writeFileSync(at(`game/realms/${F}/missions-a.js`), NP.stubs(NP.normalize(flip))[`game/realms/${F}/missions-a.js`]);
    /* 6. a second pack that adds a registry part of its own, and a pack the registry does not list */
    const qq = specFor('qq', { registry: { node: 'calc' } }), solo = specFor('solo', { registry: false });
    assert.deepEqual(NP.scaffold(qq, tmp).conflicts, []); assert.deepEqual(NP.scaffold(solo, tmp).conflicts, []);
    const w2 = {}; vm.runInNewContext(fs.readFileSync(at('game/realms/registry.js'), 'utf8'), { window: w2 }); vm.runInNewContext(fs.readFileSync(at('game/realms/packs.js'), 'utf8'), { window: w2 });
    const before = (() => { const v = {}; vm.runInNewContext(original.registry, { window: v }); return v.VG_REALMS.find(n => n.node === 'calc').parts.map(p => p.id); })();
    assert.deepEqual(Array.from(w2.VG_REALMS.find(n => n.node === 'calc').parts, p => p.id), [...before, 'qq'], 'the new part is added at the end of its node');
    assert.ok(!w2.VG_REALMS.flatMap(n => n.parts).some(p => p.id === 'solo') && w2.VG_PACKS.solo, 'registry: false gives a pack with no star-map part');
    for (const s of [solo, qq, flip]) { r = NP.remove(s, tmp); assert.deepEqual(r.conflicts, [], s.id + ': ' + r.conflicts.join('; ')); }
    assert.equal(fs.readFileSync(at('game/realms/packs.js'), 'utf8'), original.packs, 'packs.js is back, byte for byte');
    const back = fs.readFileSync(at('game/realms/registry.js'), 'utf8');
    assert.equal(back, original.registry, 'registry.js is back, byte for byte');
    assert.deepEqual(fs.readdirSync(at('game/realms')).sort(), ['packs.js', 'registry.js']); assert.deepEqual(fs.readdirSync(at('qa/realms')), []);
  } finally { fs.rmSync(tmp, { recursive: true, force: true }); }
});

check('landmark glyphs: SVG shapes in the outpost palette and size', () => {
  const palette = new Set(['#b4cead', '#93b6a0', '#8cddd4', '#82b8b2', '#496866', '#3f6a5a', '#607669', '#73c6d2', '#d4f36a', '#f3c37b', '#203a3d']);
  assert.ok(Object.keys(NP.GLYPHS).length >= 40, Object.keys(NP.GLYPHS).length + ' glyphs');
  for (const [key, art] of Object.entries(NP.GLYPHS)) {
    assert.match(key, /^[a-z][a-z0-9-]*$/);
    assert.doesNotMatch(art, /<\s*(script|text|image|use|foreignObject)|\son\w+=|\sid=|href|style=|url\(/i, key + ': shapes only');
    for (const tag of art.match(/<(\w+)/g)) assert.ok(['<path', '<rect', '<circle', '<ellipse'].includes(tag), key + ': ' + tag);
    for (const c of art.match(/#[0-9a-f]{3,6}/gi) || []) assert.ok(palette.has(c.toLowerCase()), key + ': colour ' + c);
    const nums = (art.replace(/#[0-9a-f]{3,6}/gi, '').match(/-?\d+(\.\d+)?/g) || []).map(Number);
    assert.ok(nums.every(x => x >= -60 && x <= 60), key + ': within the landmark box');
  }
  /* the shipped landmarks are in the library as they are */
  for (const id of BASE) for (const l of realmOf(read(`game/realms/${id}/pack.js`)).landmarks) assert.ok(Object.values(NP.GLYPHS).includes(l.art), id + ': ' + l.name);
});

check('the real game: every ready part and every later pack is registered the standard way', () => {
  const w = {}; vm.runInNewContext(read('game/realms/packs.js'), { window: w });
  const parts = readyParts();
  assert.deepEqual(parts.slice(0, 3).map(p => p.id), ['found', 'la', 'calc1'], 'the 2.5 packs come first, in registry order');
  for (const p of parts) {
    assert.ok(w.VG_PACKS[p.id], p.id + ': a ready part has a pack in game/realms/packs.js');
    assert.ok(Number.isInteger(p.missions) && Number.isInteger(p.learn) && p.learn > 0 && p.missions >= p.learn, p.id + ': mission counts');
    assert.ok(p.ach && p.ach.short && p.ach.done && p.ach.master && p.ach.done.length <= 28 && p.ach.master.length <= 28, p.id + ': achievement names in `ach`');
  }
  for (const [id, pack] of Object.entries(w.VG_PACKS)) {
    if (BASE.includes(id)) continue;
    assert.deepEqual(Array.from(pack.scripts), NP.packEntry({ id }), id + ': exactly the standard script list (tools/new-pack.js)');
    assert.deepEqual(Array.from(pack.styles), ['styles.css', 'update.css'], id + ': styles');
    const R = realmOf(read(`game/realms/${id}/pack.js`));
    assert.equal(R.id, id); assert.ok(!BASE.includes(R.saveId) && R.saveId, id + ': its own save slice');
    assert.deepEqual(Array.from(R.ranks, r => r.at), NP.RANK_AT, id + ': the standard rank steps'); assert.deepEqual(Array.from(R.ranks, r => r.learnAt === undefined ? null : r.learnAt), NP.RANK_LEARN);
    assert.ok(fs.existsSync(path.join(repo, 'qa/realms', id, 'oracle-pack-checks.js')), id + ': its oracle directory');
    const part = parts.find(p => p.id === id); if (part) assert.ok(part.missions === 160 && part.learn === 40, id + ': 160 missions, 40 learn');
  }
});

console.log(`PASS: new-pack, ${checks} checks: calc1 spec reproduces calc1's pack.js, scaffold/idempotence/removal in a scratch copy, spec validation, ${Object.keys(NP.GLYPHS).length} glyphs, registry and VG_PACKS entries.`);
