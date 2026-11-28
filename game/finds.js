/* Small surprises (2.8): now and then a solve turns up a find for the collection, a rare variant of an artifact or a
   small detail for the outpost. Purely cosmetic: a find pays no stardust, gives no perk and changes no progress.
   The rules
     chance   CHANCE (12%) per solve, decided by a seeded draw from the save's seed and the number of missions solved
              so far, so the same save and the same solve always give the same answer (and tests can check it).
     never    on the first solve after the page opens (a session), and never on two solves in a row.
     list     each find comes once; when every find is found, there are no more.
   State: meta.finds = { got: [findId], last: <solve number of the last find>, n: <first-time solves counted> } in
   the v2 save (optional; a save without it has found nothing; a save without n gets it at its next first-time solve, see counted). collection/core.js calls onSolve from settle() after a solve made on the page; the
   collection's Figures tab lists the finds (collection/ui.js calls drawInto).
   Classic script, no modules, no network. Safe to load where there is no document (qa/finds.test.js).

   window.VGFinds
     LIST, CHANCE                  the finds and the chance per solve
     draw(seed, n)                 the seeded number in [0, 1) for solve number n
     decide(state, seed, n, first) the find id for solve number n, or null. state: meta.finds; first: first solve of the session
     onSolve(m, total, k)          applies k first-time solves to the collection m (changes m.finds) and returns [event] or []
     owned(m)                      the finds in m, in list order, as LIST entries
     drawInto(box, m)              the "Finds" section of the collection's Figures tab */
(function (root) {
  'use strict';
  var CHANCE = 0.12;
  var LIST = [
    { id: 'vane', kind: 'outpost', name: 'Brass weather vane', text: 'It turns on the outpost roof and always points into the wind.' },
    { id: 'lanterns', kind: 'outpost', name: 'Walkway lanterns', text: 'A row of small lamps that light the path between the modules at night.' },
    { id: 'moss', kind: 'outpost', name: 'Window box of moss', text: 'Mira says it is the only garden that survives out here.' },
    { id: 'chart', kind: 'outpost', name: 'Painted star chart', text: 'Someone mapped the nearby stars by hand on the mess-room wall.' },
    { id: 'chimes', kind: 'outpost', name: 'Wind chimes', text: 'Seven tubes cut to different lengths, so each one rings a different note.' },
    { id: 'flag', kind: 'outpost', name: 'Guild pennant', text: 'A small flag with the guild mark, flown when a sector is finished.' },
    { id: 'clock', kind: 'outpost', name: 'Sundial clock', text: 'It tells the time by the shadow of a thin rod, as long as there is a sun.' },
    { id: 'kettle', kind: 'outpost', name: 'Dented kettle', text: 'The field engineers swear the tea tastes better from this one.' },
    { id: 'compass', kind: 'artifact', name: 'Copper compass', text: 'A rare copper-cased version of the field compass. It works the same; it just shines.' },
    { id: 'ruler', kind: 'artifact', name: 'Ivory slide rule', text: 'A rare pale slide rule, the kind engineers once used to multiply in a second.' },
    { id: 'lens', kind: 'artifact', name: 'Blue-glass lens', text: 'A rare tinted lens. Everything looks the same size through it, only bluer.' },
    { id: 'protractor', kind: 'artifact', name: 'Silver protractor', text: 'A rare silver half-circle for measuring angles, engraved with tiny stars.' },
    { id: 'abacus', kind: 'artifact', name: 'Jade abacus', text: 'A rare counting frame with green beads. Each wire counts ten times the one before.' },
    { id: 'hourglass', kind: 'artifact', name: 'Twin hourglass', text: 'A rare pair of hourglasses joined at the waist. Both empty in exactly a minute.' }
  ];
  function isObject(o) { return !!o && typeof o === 'object' && !Array.isArray(o); }
  function has(o, k) { return Object.prototype.hasOwnProperty.call(o, k); }
  /* A small integer hash (mulberry32 step), so the draw depends only on the seed and the solve number. */
  function draw(seed, n) {
    var a = ((seed >>> 0) ^ Math.imul((n | 0) + 0x9E37, 0x85EBCA6B)) >>> 0;
    a = (a + 0x6D2B79F5) >>> 0; var t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }
  function tidy(state) {
    var s = isObject(state) ? state : {}, known = {}, got = [];
    LIST.forEach(function (f) { known[f.id] = 1; });
    (Array.isArray(s.got) ? s.got : []).forEach(function (id) { if (typeof id === 'string' && id && got.indexOf(id) < 0) got.push(id); });
    return { got: got, last: Number.isInteger(s.last) && s.last >= 0 ? s.last : null, known: known };
  }
  function decide(state, seed, n, first) {
    var s = tidy(state);
    if (first || !Number.isInteger(n) || n < 1) return null;
    if (s.last !== null && n - s.last <= 1) return null;          /* never two solves in a row */
    var left = LIST.filter(function (f) { return s.got.indexOf(f.id) < 0; });
    if (!left.length || draw(seed, n) >= CHANCE) return null;
    return left[Math.floor(draw(seed + 1, n) * left.length) % left.length].id;
  }
  var solvesThisSession = 0;
  /* The solve number after `k` more first-time solves: meta.finds.n counts them and only ever goes up, so resetting a
     realm never sets it back. A save from before the count (no n) starts it from `total`, the missions solved now in
     every realm counting these k (the number the draw used before), and never below the solve of the last find. */
  function counted(state, total, k) {
    var s = isObject(state) ? state : {};
    if (Number.isInteger(s.n) && s.n >= 0) return s.n + k;
    var last = Number.isInteger(s.last) && s.last >= 0 ? s.last : 0, t = Number.isInteger(total) ? total : 0;
    return Math.max(t - k, last, 0) + k;
  }
  /* total: missions solved in all, counting this call's; k: first-time solves paid in this call (1 when left out).
     Always stores the count (m.finds.n); adds the find to m.finds when something is found. */
  function onSolve(m, total, k) {
    if (!isObject(m)) return [];
    k = Number.isInteger(k) && k > 0 ? k : 1;
    var first = solvesThisSession === 0; solvesThisSession++;
    var seed = 0; try { var S = root.VGSave; seed = S && typeof S.seed === 'function' ? (S.seed() | 0) : 0; } catch (e) { seed = 0; }
    var n = counted(m.finds, total, k), keep = isObject(m.finds) ? m.finds : {};
    var id = decide(m.finds, seed, n, first);
    keep.n = n; m.finds = keep;
    if (!id) return [];
    var s = tidy(keep);
    s.got.push(id); keep.got = s.got; keep.last = n;
    var f = LIST.filter(function (x) { return x.id === id; })[0];
    return [{ type: 'find', id: id, kind: f.kind, name: f.name, dust: 0 }];
  }
  function owned(m) { var s = tidy(isObject(m) ? m.finds : null); return LIST.filter(function (f) { return s.got.indexOf(f.id) >= 0; }); }
  var API = { LIST: LIST, CHANCE: CHANCE, draw: draw, decide: decide, counted: counted, onSolve: onSolve, owned: owned, drawInto: function () {},
    _newSession: function () { solvesThisSession = 0; } };
  root.VGFinds = API;
  if (typeof document === 'undefined' || !document || typeof document.createElement !== 'function') return;

  function el(tag, cls, text) { var e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; }
  API.drawInto = function (box, m) {
    if (!box) return;
    var mine = owned(m), sec = el('section', 'vgc-finds');
    sec.setAttribute('aria-labelledby', 'vgc-finds-title');
    var h = el('h3', 'vgc-h', 'Finds'); h.id = 'vgc-finds-title'; sec.appendChild(h);
    sec.appendChild(el('p', 'vgc-text', 'Now and then a solved mission turns up something small for your outpost or a rare look for an artifact. Finds are just for fun: they change nothing else. ' + mine.length + ' of ' + LIST.length + ' found.'));
    if (mine.length) {
      var ul = el('ul', 'vgc-find-list');
      mine.forEach(function (f) {
        var li = el('li', 'vgc-find is-' + f.kind);
        li.appendChild(el('b', null, f.name)); li.appendChild(el('span', 'vgc-find-kind', f.kind === 'artifact' ? 'Rare artifact' : 'Outpost detail'));
        li.appendChild(el('span', 'vgc-find-text', f.text)); ul.appendChild(li);
      });
      sec.appendChild(ul);
    }
    box.appendChild(sec);
  };
})(typeof window !== 'undefined' ? window : this);
