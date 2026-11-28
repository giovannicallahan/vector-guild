/* Next up (2.8). On the realm page, instead of one continue button, a strip of up to three missions the player can
   start now: unsolved, with their prerequisites met. Where both kinds are open it mixes at least one learn mission and
   one practice mission. The first is always the next step on the main path (the old continue button, id="begin").
   Kept free of the page so it can be tested directly (qa/next-up.test.js); app.js draws the strip.

   VGNextUp.pick(o) -> up to `o.limit` (3) missions, in the order shown
     o.quests     every mission of the pack, in pack order
     o.solved     the solved ids, in the order they were solved (the save keeps that order)
     o.available  q -> whether its prerequisites are met
     o.next       the next step on the main path (a learn mission while any is open, else practice), or null
   Practice comes first for the concept solved most recently, so it is fresh. A second learn mission is a different
   concept from the first (another branch of the skill tree), when there is one.
   VGNextUp.html(list, o) -> the strip's markup; o.esc escapes text, o.kind(q) names a practice mission's kind. */
(function (root) {
  'use strict';
  function pick(o) {
    const quests = Array.from(o.quests || []), done = new Set(o.solved || []), limit = Number.isInteger(o.limit) && o.limit > 0 ? o.limit : 3;
    const open = quests.filter(q => !done.has(q.id) && o.available(q));
    if (!open.length) return [];
    const learn = open.filter(q => !q.parent), recent = new Map(Array.from(o.solved || []).map((id, i) => [id, i]));
    /* Practice for the concept solved last comes first; ties keep pack order (b, c, d). */
    const practice = open.filter(q => q.parent).map((q, i) => [q, recent.has(q.parent) ? recent.get(q.parent) : -1, i]).sort((a, b) => b[1] - a[1] || a[2] - b[2]).map(x => x[0]);
    const out = [], add = q => { if (q && !out.includes(q) && out.length < limit) out.push(q); };
    add(o.next && open.includes(o.next) ? o.next : learn[0] || practice[0]);
    /* At least one of each kind where both are open. */
    if (out[0].parent) add(learn[0]); else add(practice[0]);
    /* Then another learn mission, then more practice (a different concept first). */
    add(learn.find(q => !out.includes(q)));
    add(practice.find(q => !out.includes(q) && !out.some(x => x.parent && x.parent === q.parent)));
    for (const q of practice) add(q);
    return out;
  }
  function html(list, o) {
    const esc = o.esc, kind = o.kind || (() => 'Practice');
    if (!list.length) return '';
    const item = (q, i) => {
      const k = q.parent ? kind(q) : 'New concept', meta = q.parent ? `Practice for ${q.topic}` : `${q.topic} · ${q.sector}`;
      const attrs = i === 0 ? 'id="begin"' : `data-quest="${esc(q.id)}"`;
      return `<li><button type="button" class="next-up-item ${i === 0 ? 'is-main' : ''} ${q.parent ? 'is-practice' : 'is-learn'}" ${attrs}><span class="nu-kind">${esc(k)}${i === 0 ? ' · on your path' : ''}</span><span class="nu-title">${esc(q.title)}</span><span class="nu-meta">${esc(meta)}</span><span class="nu-go" aria-hidden="true">↗</span></button></li>`;
    };
    return `<section class="next-up" aria-labelledby="next-up-title"><div class="eyebrow" id="next-up-title">NEXT UP · YOUR CHOICE</div><p class="next-up-note">${list.length === 1 ? 'This mission is open now.' : `These ${list.length} missions are open now. Pick any of them.`}</p><ul class="next-up-list">${list.map(item).join('')}</ul></section>`;
  }
  const api = { pick, html };
  root.VGNextUp = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof window !== 'undefined' ? window : globalThis);
