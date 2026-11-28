/* Sector payoff (2.8). When the last learn mission of a sector is solved, Mira says what that part of the outpost now
   does, from the pack's own data: the sector's name and purpose (REALM.sectors), the topics learned there, the chapter
   and landmark when the same solve finishes a chapter, and the next sector that needs work. No pack needs new data.
   Shown once per sector, inside the mission's payoff; every online sector can be replayed from the realm page.
   Kept free of the page so it can be tested directly (qa/sector-scene.test.js); app.js draws it and passes the store in.

   Which scenes were shown is kept in the collection part of the save (shared by every realm, kept in a backup):
     meta.sectorScenes = { <realm id>: [sector index, ...] }
   A save without it has shown none. A sector finished before 2.8 is not shown on its own; it can be replayed. */
(function (root) {
  'use strict';
  const learnOf = (quests, name) => Array.from(quests || []).filter(q => !q.parent && q.sector === name);
  /* A sector is online when it has learn missions and every one is solved. */
  function online(quests, solved, name) { const qs = learnOf(quests, name), done = solved instanceof Set ? solved : new Set(solved || []); return qs.length > 0 && qs.every(q => done.has(q.id)); }
  /* o: { sectors: REALM.sectors, quests, solved, index, mentor, chapter: { name, landmark } | null } */
  function build(o) {
    const sectors = Array.from(o.sectors || []), s = sectors[o.index];
    if (!s || !s.name) return null;
    const done = new Set(o.solved || []), topics = learnOf(o.quests, s.name).map(q => q.topic).filter(Boolean), M = o.mentor || 'Mira';
    const shown = topics.slice(0, 4), more = topics.length - shown.length;
    const purpose = String(s.purpose || '').trim().replace(/\.$/, '');
    const later = sectors.map((x, i) => [x, i]).filter(([x, i]) => i !== o.index && x && x.name && learnOf(o.quests, x.name).length && !online(o.quests, done, x.name));
    const nxt = later.find(([, i]) => i > o.index) || later[0] || null;
    const ch = o.chapter && o.chapter.name ? o.chapter : null;
    return {
      index: o.index, name: s.name,
      title: `The ${s.name} is running`,
      mira: `${M}: “Every part of the ${s.name} is in place. ${purpose ? `From today we can ${purpose}.` : 'It is ready for work.'} You built that.”`,
      topics: shown, more,
      chapterLine: ch ? `This also finishes the chapter “${ch.name}”.${ch.landmark ? ` The ${ch.landmark} blueprint is ready in the skill tree.` : ''}` : '',
      nextLine: nxt ? `${M}: “Next, the ${nxt[0].name} needs us${nxt[0].purpose ? `, so we can ${String(nxt[0].purpose).trim().replace(/\.$/, '')}` : ''}.”` : `${M}: “That was the last sector. The whole outpost is running. Well done.”`
    };
  }
  /* The scene's markup. o.esc escapes text; o.art is the outpost picture (already markup) or ''; o.heading is the heading level. */
  function html(sc, o) {
    if (!sc) return '';
    const esc = o.esc, h = o.heading || 'h3';
    return `<section class="sector-scene" aria-labelledby="sector-scene-${sc.index}"><div class="eyebrow">SECTOR ONLINE / ${esc(sc.name.toUpperCase())}</div><${h} id="sector-scene-${sc.index}" tabindex="-1">${esc(sc.title)} ✦</${h}><p class="sector-scene-mira">${esc(sc.mira)}</p><p>What you learned to build it:</p><ul class="sector-scene-topics">${sc.topics.map(t => `<li>${esc(t)}</li>`).join('')}${sc.more ? `<li>and ${sc.more} more</li>` : ''}</ul>${sc.chapterLine ? `<p>${esc(sc.chapterLine)}</p>` : ''}${o.art || ''}<p class="sector-scene-next">${esc(sc.nextLine)}</p></section>`;
  }
  const ok = s => !!s && typeof s.meta === 'function' && typeof s.putMeta === 'function';
  const list = (m, realm) => { const all = m && m.sectorScenes && typeof m.sectorScenes === 'object' && !Array.isArray(m.sectorScenes) ? m.sectorScenes : {}; const a = Object.prototype.hasOwnProperty.call(all, realm) ? all[realm] : null; return Array.isArray(a) ? [...new Set(a.filter(n => Number.isInteger(n) && n >= 0 && n < 100))] : []; };
  function seen(store, realm) { try { return ok(store) ? list(store.meta(), realm) : []; } catch (e) { return []; } }
  /* Records that a sector's scene was shown; returns whether it was stored. */
  function mark(store, realm, index) {
    if (!ok(store) || typeof realm !== 'string' || !realm || realm === '__proto__' || !Number.isInteger(index) || index < 0) return false;
    try { const m = store.meta(), a = list(m, realm); if (a.includes(index)) return true; const all = m.sectorScenes && typeof m.sectorScenes === 'object' && !Array.isArray(m.sectorScenes) ? m.sectorScenes : {}; all[realm] = a.concat(index).sort((x, y) => x - y); m.sectorScenes = all; return store.putMeta(m) === true; } catch (e) { return false; }
  }
  const api = { online, build, html, seen, mark };
  root.VGSectorScene = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof window !== 'undefined' ? window : globalThis);
