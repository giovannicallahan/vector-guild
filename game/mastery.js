/* Visible mastery (2.8): each concept shows bronze, silver or gold from its practice missions.
   The rule, the same everywhere (and said in the interface by RULE_TEXT):
     bronze  the learn mission is solved
     silver  the learn mission and at least two of its practice missions are solved
     gold    the learn mission and every one of its practice missions (b, c and d) are solved
   A concept whose learn mission is not solved has no medal. Practice solved without the learn mission (only possible
   in an old or edited save) does not count until the learn mission is solved.
   Nothing here changes progress, XP or stardust; it only reads the save. Classic script, no modules, no network.
   Safe to load where there is no document (qa/mastery.test.js).

   window.VGMastery
     level(learned, done, total)   'gold' | 'silver' | 'bronze' | null. done: practice missions solved, total: how many it has.
     NAMES, RULE_TEXT              the words the interface uses.
     fromQuests(quests, solved)    realm page: { gold, silver, bronze, concepts, by: {learnId: level} } from the pack's missions.
     fromSlice(slice, perConcept)  home page, no pack loaded: the same counts from a slice alone. perConcept: practice
                                   missions per concept (from the registry), 3 when unknown. Practice ids are the
                                   learn id and a letter (q07 -> q07b, q07c, q07d), as docs/PACK-FORMAT.md says.
     perConcept(part)              practice missions per concept for a registry part ({missions, learn}).
     countText(c)                  "2 gold · 1 silver · 4 bronze", or '' when nothing is learned.
     badgeHtml(level)              the badge for a mission card (text, not colour alone).
     cardBadge(q, solved, practice) the badge for a learn mission card on the realm page: q the mission, solved the list
                                   of solved ids, practice its practice missions. '' for practice missions and unlearned ones. */
(function (root) {
  'use strict';
  var NAMES = { gold: 'Gold', silver: 'Silver', bronze: 'Bronze' };
  var RULE_TEXT = 'Bronze: the learn mission is solved. Silver: two of its practice missions too. Gold: all of its practice missions.';
  var PRACTICE = /^(q\d+)([a-z])$/;
  function isObject(o) { return !!o && typeof o === 'object' && !Array.isArray(o); }
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }

  function level(learned, done, total) {
    if (!learned) return null;
    var t = Number.isInteger(total) && total > 0 ? total : 0, n = Math.max(0, Math.min(t, done | 0));
    if (!t) return 'bronze';
    if (n >= t) return 'gold';
    if (n >= Math.min(2, t - 1) && n >= 1) return 'silver';
    return 'bronze';
  }
  function empty() { return { gold: 0, silver: 0, bronze: 0, concepts: 0, by: {} }; }
  function add(c, id, lv) { c.by[id] = lv; if (lv) c[lv]++; }
  function solvedSet(list) { var s = {}; (Array.isArray(list) ? list : []).forEach(function (id) { if (typeof id === 'string') s[id] = 1; }); return s; }
  function own(o, k) { return Object.prototype.hasOwnProperty.call(o, k); }

  /* quests: the pack's QUESTS (a practice mission has parent: its learn mission's id). */
  function fromQuests(quests, solved) {
    var c = empty(), done = solvedSet(solved), kids = {};
    (Array.isArray(quests) ? quests : []).forEach(function (q) { if (q && typeof q.parent === 'string') (kids[q.parent] = kids[q.parent] || []).push(q.id); });
    (Array.isArray(quests) ? quests : []).forEach(function (q) {
      if (!q || typeof q.id !== 'string' || typeof q.parent === 'string') return;
      c.concepts++;
      var ps = own(kids, q.id) ? kids[q.id] : [];
      add(c, q.id, level(own(done, q.id), ps.filter(function (id) { return own(done, id); }).length, ps.length));
    });
    return c;
  }
  function fromSlice(slice, perConcept) {
    var c = empty(), solved = isObject(slice) && Array.isArray(slice.solved) ? slice.solved : [], done = solvedSet(solved), per = Number.isInteger(perConcept) && perConcept >= 0 ? perConcept : 3, practice = {};
    Object.keys(done).forEach(function (id) { var m = PRACTICE.exec(id); if (m) practice[m[1]] = (practice[m[1]] || 0) + 1; });
    Object.keys(done).forEach(function (id) { if (/^q\d+$/.test(id)) add(c, id, level(true, practice[id] || 0, per)); });
    c.concepts = Object.keys(c.by).length;
    return c;
  }
  function perConcept(part) {
    if (!isObject(part) || !Number.isInteger(part.missions) || !Number.isInteger(part.learn) || part.learn <= 0) return 3;
    return Math.max(0, Math.round((part.missions - part.learn) / part.learn));
  }
  function countText(c) {
    if (!c || !(c.gold + c.silver + c.bronze)) return '';
    return ['gold', 'silver', 'bronze'].map(function (k) { return c[k] + ' ' + k; }).join(' · ');
  }
  function badgeHtml(lv) {
    if (!own(NAMES, lv)) return '';
    return '<span class="mastery-badge" data-level="' + lv + '" title="' + esc(RULE_TEXT) + '"><i aria-hidden="true">●</i> ' + NAMES[lv] + '<span class="mastery-sr"> mastery</span></span>';
  }
  function cardBadge(q, solved, practice) {
    if (!q || typeof q.parent === 'string' || PRACTICE.test(String(q.id))) return '';
    var done = solvedSet(solved), ps = Array.isArray(practice) ? practice : [];
    var lv = level(own(done, q.id), ps.filter(function (p) { return own(done, p && typeof p === 'object' ? p.id : p); }).length, ps.length);
    return lv ? ' &nbsp; · &nbsp; ' + badgeHtml(lv) : '';
  }
  var API = { NAMES: NAMES, RULE_TEXT: RULE_TEXT, level: level, fromQuests: fromQuests, fromSlice: fromSlice, perConcept: perConcept, countText: countText, badgeHtml: badgeHtml, cardBadge: cardBadge };
  root.VGMastery = API;
  if (typeof document === 'undefined' || !document || typeof document.createElement !== 'function') return;

  /* ---------- realm page: a mastery line under the progress strip ----------
     app.js redraws #content on every change, so the line is put back after each redraw, from the saved slice. */
  function el(tag, cls, text) { var e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; }
  function realmLine() {
    var R = root.REALM, S = root.VGSave, id = isObject(R) ? (R.saveId || R.id) : null, slice = null;
    try { slice = S && typeof S.realm === 'function' && id ? S.realm(id) : null; } catch (e) { slice = null; }
    var c = fromQuests(root.QUESTS, slice && slice.solved), box = el('section', 'mastery-line');
    box.setAttribute('aria-label', 'Mastery in this realm');
    var head = el('p', 'mastery-count');
    head.appendChild(el('b', null, 'Mastery: '));
    head.appendChild(document.createTextNode(countText(c) ? countText(c) + ' of ' + c.concepts + ' concepts' : 'none yet. Solve a learn mission for bronze.'));
    box.appendChild(head);
    box.appendChild(el('p', 'mastery-rule', RULE_TEXT));
    return box;
  }
  function realmPage() {
    var content = document.getElementById('content');
    if (!content || !root.VG_PACK_ID || typeof root.MutationObserver !== 'function') return;
    var line = null, busy = false;
    var place = function () {
      if (busy) return;
      var strip = content.querySelector('.strip'); if (!strip || !strip.parentNode) return;
      if (line && content.contains(line) && line.previousSibling === strip) return;
      busy = true;
      try { if (line && line.parentNode) line.parentNode.removeChild(line); line = realmLine(); strip.parentNode.insertBefore(line, strip.nextSibling); } catch (e) { /* optional */ }
      busy = false;
    };
    new root.MutationObserver(place).observe(content, { childList: true });
    place();
  }
  var go = function () { try { realmPage(); } catch (e) { /* the line is optional */ } };
  if (document.readyState === 'loading' && typeof document.addEventListener === 'function') document.addEventListener('DOMContentLoaded', go); else go();
})(typeof window !== 'undefined' ? window : this);
