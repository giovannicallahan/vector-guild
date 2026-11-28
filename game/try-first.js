/* Try it first (2.8). On opening a learn mission the player chooses: "Try it first" goes straight to the problem,
   "Learn it first" is the lesson-then-problem flow of earlier releases. After a miss in try-first mode app.js opens
   the lesson beside the problem. The last choice is remembered and drawn as the main button next time.
   Nothing here touches the page; app.js draws the markup and passes the save store in (qa/try-first.test.js).

   The choice is kept in the collection part of the save, which every realm shares and which travels with a backup:
     meta.tryFirst = 'try' | 'learn'
   A save without it (every save before 2.8) means 'learn', so the first mission opens as it always did. */
(function (root) {
  'use strict';
  const MODES = ['try', 'learn'], DEFAULT = 'learn';
  const ok = s => !!s && typeof s.meta === 'function' && typeof s.putMeta === 'function';
  function get(store) { try { const m = ok(store) && store.meta(); return m && MODES.includes(m.tryFirst) ? m.tryFirst : DEFAULT; } catch (e) { return DEFAULT; } }
  /* Writes the choice; returns whether it was stored. An unknown mode changes nothing. */
  function set(store, mode) { if (!MODES.includes(mode) || !ok(store)) return false; try { const m = store.meta(); if (m.tryFirst === mode) return true; m.tryFirst = mode; return store.putMeta(m) === true; } catch (e) { return false; } }
  /* The two buttons. The remembered one is the main (primary) button and comes first; both keep their ids:
     #ready-top goes to the problem, #learn-first goes to the lesson below. */
  function html(mode) {
    const tryB = `<button type="button" class="${mode === 'try' ? 'primary' : 'secondary'}" id="ready-top" aria-describedby="start-choice-note">Try it first ↓</button>`;
    const learnB = `<button type="button" class="${mode === 'try' ? 'secondary' : 'primary'}" id="learn-first" aria-describedby="start-choice-note">Learn it first</button>`;
    return `<div class="start-choice" role="group" aria-labelledby="start-choice-label"><p id="start-choice-label"><b>How do you want to start?</b></p><div class="start-choice-buttons">${mode === 'try' ? tryB + learnB : learnB + tryB}</div><p class="start-choice-note" id="start-choice-note">Try it first: go straight to the problem, and the lesson opens beside it if you miss. Learn it first: read the lesson, then try. Either way the reward is the same.</p></div>`;
  }
  /* The extra sentence in the feedback after a miss in try-first mode. */
  const MISS = 'The lesson is open next to the problem now.';
  const api = { MODES, DEFAULT, get, set, html, MISS };
  root.VGTryFirst = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof window !== 'undefined' ? window : globalThis);
