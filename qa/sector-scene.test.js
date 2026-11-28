/* Sector payoff (game/sector-scene.js, shown by game/app.js).
   Run: node qa/sector-scene.test.js
   What it guarantees:
     - the scene is built from the pack's own data (sector name and purpose, the topics learned there, the chapter and
       landmark when the same solve finishes a chapter, the next sector that needs work) and reads well for every
       sector of every pack: no "undefined", no empty purpose, British plain words, a last-sector line at the end
     - solving the last learn mission of a sector shows it once, inside the payoff; solving it again, or another mission
       of a sector already online, does not; a sector finished before 2.8 is not shown on its own
     - which scenes were shown is kept in meta.sectorScenes per realm, is checked on read and travels with a backup
     - the campaign page lists every online sector with a button that replays its scene
     - a page without sector-scene.js is unchanged */
'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const SC = require('../game/sector-scene.js');
const vm = require('node:vm'), game = path.resolve(__dirname, '../game');
/* A pack as the page has it (REALM, missions, chapters), without the full harness. */
const packsWindow = {}; vm.runInNewContext(fs.readFileSync(path.join(game, 'realms/packs.js'), 'utf8'), { window: packsWindow });
function loadPack(id) {
  const w = { VG_SEED: 0 };
  for (const f of packsWindow.VG_PACKS[id].scripts) { if (f === 'handson.js') continue; try { vm.runInNewContext(fs.readFileSync(path.join(game, f), 'utf8'), { window: w, Math }); } catch (e) { /* a page-only module */ } }
  return { REALM: w.REALM, quests: w.QUESTS || [], chapters: w.CHAPTERS || [] };
}

let count = 0;
function test(name, fn) { try { fn(); count++; console.log('ok   ' + name); } catch (e) { console.error('FAIL ' + name); throw e; } }
function harness(realm) {
  const file = path.resolve(__dirname, 'harness.js'), argv = process.argv, log = console.log;
  delete require.cache[file];
  process.argv = [argv[0], file, '--realm', realm]; console.log = () => {};
  try { return require(file); } finally { process.argv = argv; console.log = log; }
}
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const KEY = 'vector-guild-save-v2';
const saveWith = (realm, solved, meta) => new Map([[KEY, JSON.stringify({ v: 2, seed: 0, intro: true, realms: { [realm]: { solved, xp: 0, points: 0, tools: [] } }, ...(meta ? { meta } : {}) })]]);

test('every sector of every pack has a scene that reads well', () => {
  let n = 0;
  for (const realm of Object.keys(packsWindow.VG_PACKS)) {
    const H = loadPack(realm), R = H.REALM, learn = H.quests.filter(q => !q.parent);
    R.sectors.forEach((s, i) => {
      if (!learn.some(q => q.sector === s.name)) return;
      const solvedHere = learn.filter(q => q.sector === s.name).map(q => q.id);
      const sc = SC.build({ sectors: R.sectors, quests: H.quests, solved: solvedHere, index: i, mentor: R.mentor.name, chapter: { name: H.chapters[0].name, landmark: R.landmarks[0].name } });
      const text = [sc.title, sc.mira, ...sc.topics, sc.chapterLine, sc.nextLine].join(' ');
      assert.ok(!/undefined|null|NaN|\[object/.test(text), realm + ' ' + s.name + ': ' + text);
      assert.equal(sc.title, `The ${s.name} is running`);
      assert.ok(sc.mira.startsWith(R.mentor.name + ': “Every part of the ' + s.name + ' is in place. From today we can ' + s.purpose.replace(/\.$/, '') + '. You built that.”'), sc.mira);
      assert.ok(sc.topics.length >= 1 && sc.topics.length <= 4 && sc.more === Math.max(0, solvedHere.length - 4));
      assert.match(sc.nextLine, /^Mira: “Next, the .+ needs us, so we can .+\.”$/, 'another sector is still to build: ' + sc.nextLine);
      const page = SC.html(sc, { esc, art: '<svg></svg>' });
      assert.match(page, new RegExp(`^<section class="sector-scene" aria-labelledby="sector-scene-${i}"><div class="eyebrow">SECTOR ONLINE / `));
      assert.ok(page.includes(`<h3 id="sector-scene-${i}" tabindex="-1">`) && page.includes('<svg></svg>'));
      n++;
    });
    const all = learn.map(q => q.id), last = SC.build({ sectors: R.sectors, quests: H.quests, solved: all, index: 0, mentor: 'Mira', chapter: null });
    assert.equal(last.nextLine, 'Mira: “That was the last sector. The whole outpost is running. Well done.”');
    assert.equal(last.chapterLine, '');
  }
  assert.ok(n >= 70, n + ' sectors');
  assert.equal(SC.build({ sectors: [], quests: [], solved: [], index: 0 }), null);
  assert.equal(SC.html(null, { esc }), '');
});

test('the shown list is checked on read, kept per realm, and travels with a backup', () => {
  const H = harness('found'), p = H.boot();
  assert.deepEqual(SC.seen(p.store, 'found'), []);
  assert.equal(SC.mark(p.store, 'found', 2), true); assert.equal(SC.mark(p.store, 'found', 0), true); assert.equal(SC.mark(p.store, 'found', 2), true);
  assert.deepEqual(SC.seen(p.store, 'found'), [0, 2]); assert.deepEqual(SC.seen(p.store, 'la'), []);
  assert.equal(SC.mark(p.store, '__proto__', 1), false); assert.equal(SC.mark(p.store, 'found', -1), false); assert.equal(SC.mark(null, 'found', 1), false);
  const backup = p.store.exportAll(); assert.deepEqual(backup.meta.sectorScenes, { found: [0, 2] });
  const q = H.boot(); q.store.importAny(JSON.parse(JSON.stringify(backup))); assert.deepEqual(SC.seen(q.store, 'found'), [0, 2]);
  const bad = H.boot(saveWith('found', [], { sectorScenes: { found: [1, 'x', 1.5, -2, 1], la: 'no' } }));
  assert.deepEqual(SC.seen(bad.store, 'found'), [1]); assert.deepEqual(SC.seen(bad.store, 'la'), []);
});

for (const realm of ['found', 'la']) {
  const H = harness(realm), R = H.REALM, learn = H.quests.filter(q => !q.parent);
  /* The first sector, and the learn mission of it that comes last in an order that respects prerequisites. */
  const sector = R.sectors.find(s => learn.some(q => q.sector === s.name)), index = R.sectors.indexOf(sector);
  const inSector = learn.filter(q => q.sector === sector.name);
  const solveOrder = []; { const done = new Set(); let moved = true; while (moved) { moved = false; for (const q of learn) if (!done.has(q.id) && (q.prereqs || []).every(id => done.has(id))) { done.add(q.id); solveOrder.push(q); moved = true; } } }
  const lastOne = solveOrder.filter(q => q.sector === sector.name).pop(), before = solveOrder.slice(0, solveOrder.indexOf(lastOne)).map(q => q.id);
  const solve = p => { p.qa.mission(lastOne.id); p.el('#ready').onclick(); p.qa.getMain().forEach((x, i) => x.value = String(p.qa.current().answer[i])); p.el('#submit-answer').onclick(); return p.el('.feedback')._html; };
  test(realm + ': the last learn mission of a sector shows the scene once, inside the payoff', () => {
    const storage = saveWith(R.saveId, before), p = H.boot(storage, { VGSectorScene: SC });
    const html = solve(p);
    assert.match(p.el('.feedback').textContent, /Mission complete/);
    assert.ok(html.includes(`<section class="sector-scene" aria-labelledby="sector-scene-${index}"><div class="eyebrow">SECTOR ONLINE / ${esc(sector.name.toUpperCase())}</div>`), 'the scene is in the payoff');
    assert.ok(html.indexOf('class="build-payoff"') < html.indexOf('class="sector-scene"'), 'after the usual payoff');
    assert.ok(html.includes(esc(`From today we can ${sector.purpose}`)));
    assert.deepEqual(SC.seen(p.store, R.saveId), [index], 'marked as shown');
    const again = H.boot(storage, { VGSectorScene: SC }); const reopen = (() => { again.qa.mission(lastOne.id); again.el('#ready').onclick(); again.qa.getMain().forEach((x, i) => x.value = String(again.qa.current().answer[i])); again.el('#submit-answer').onclick(); return again.el('.feedback')._html; })();
    assert.doesNotMatch(reopen, /class="sector-scene"/, 'a solved mission solved again shows no scene');
    const camp = again.qa.show('campaign');
    assert.ok(camp.includes(`data-scene="${index}"`), 'the campaign page can replay it');
    assert.match(camp, /<section class="sector-scenes" aria-label="Replay a sector scene">/);
  });
  test(realm + ': no scene before the sector is online, none for an old finish, none without sector-scene.js', () => {
    if (inSector.length > 1) {
      const early = solveOrder.filter(q => q.sector === sector.name)[0], p = H.boot(saveWith(R.saveId, solveOrder.slice(0, solveOrder.indexOf(early)).map(q => q.id)), { VGSectorScene: SC });
      p.qa.mission(early.id); p.el('#ready').onclick(); p.qa.getMain().forEach((x, i) => x.value = String(p.qa.current().answer[i])); p.el('#submit-answer').onclick();
      assert.doesNotMatch(p.el('.feedback')._html, /class="sector-scene"/);
      assert.doesNotMatch(p.qa.show('campaign'), /data-scene=/, 'nothing to replay yet');
    }
    const old = H.boot(saveWith(R.saveId, solveOrder.map(q => q.id)), { VGSectorScene: SC });
    assert.deepEqual(SC.seen(old.store, R.saveId), [], 'loading a save with finished sectors shows nothing');
    assert.ok(old.qa.show('campaign').includes(`data-scene="${index}"`), 'but they can be replayed');
    const plain = H.boot(saveWith(R.saveId, before)), html = solve(plain);
    assert.match(html, /build-payoff/); assert.doesNotMatch(html, /sector-scene/); assert.doesNotMatch(plain.qa.show('campaign'), /sector-scenes/);
  });
}

test('realm.html loads sector-scene.js; engage.css styles the scene and respects reduced motion', () => {
  const html = fs.readFileSync(path.join(game, 'realm.html'), 'utf8'), css = fs.readFileSync(path.join(game, 'engage.css'), 'utf8');
  assert.ok(html.includes('<script src="sector-scene.js"></script>') && html.indexOf('src="sector-scene.js"') < html.indexOf('shared.before'));
  assert.match(css, /\.sector-scene\{/);
  assert.match(css, /@media\(prefers-reduced-motion:reduce\)\{[^}]*\.sector-scene\{animation:none/);
});

console.log(`sector-scene: ${count} checks passed`);
