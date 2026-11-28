/* Feedback that names the likely slip (2.8). A pure function over the numbers typed and the numbers wanted, so it
   works for every pack with no per-mission data. Kept free of the page so it can be tested directly (qa/slips.test.js).
   app.js calls it after a wrong check and shows each field's sentence next to that field; nothing here touches
   the page or the save. A sentence never gives the answer: it names the kind of check to make, never how the typed
   number relates to the wanted one (twice, the opposite sign, upside down), since that would give the answer away.

   VGSlips.check(typed, wanted, tolerance) -> one entry per field:
     { ok: true }                                 the field is right
     { ok: false, kind, text }                    kind is one of the KINDS below, or 'general' when none fits
   VGSlips.summary(results) -> one sentence for the whole answer ('' when every field is right)

   A field is right when it is within `tolerance` of the wanted value (the same rule as the mission check).
   The slips are tried in this order, and the first that fits is named:
     swap      two answers typed in each other's boxes
     box       the right number, but for a different box
     sign      the right size with the opposite sign
     off1      one too many or one too few (whole numbers only)
     flip      a fraction turned upside down
     scale10 / scale100   ten or a hundred times too big or too small
     double / half
     round     rounded too early, or to the wrong number of places */
(function (root) {
  'use strict';
  const GENERAL = 'Not this one yet. Have another look at this step.';
  const TEXT = {
    swap: 'Check which box each answer goes in.',
    box: 'Check which box this number belongs in.',
    sign: 'Check the sign: plus or minus.',
    off1: 'Check the count: go through it again, one by one.',
    flip: 'Check which way up the fraction goes.',
    scale10big: 'Check where the decimal point sits.',
    scale10small: 'Check where the decimal point sits.',
    scale100big: 'Check where the decimal point sits, and how any percentage was written.',
    scale100small: 'Check where the decimal point sits, and how any percentage was written.',
    double: 'Check whether a step was counted twice or only half done.',
    half: 'Check whether a step was counted twice or only half done.',
    round: 'Check the rounding: keep every digit until the last step, then round as the question asks.'
  };
  const KIND = { scale10big: 'scale10', scale10small: 'scale10', scale100big: 'scale100', scale100small: 'scale100' };
  const num = x => typeof x === 'number' && Number.isFinite(x);
  const whole = x => num(x) && Math.abs(x - Math.round(x)) < 1e-9;

  /* The slip for one wrong field, looked at on its own (no other box), or null. */
  function alone(x, t, tol) {
    const near = (a, b) => Math.abs(a - b) <= tol;
    if (!num(x) || !num(t) || near(x, t)) return null;
    /* What the typed number would be after each slip. A slip is named only when the typed number matches it and it can be
       told apart from the wanted value and from 0 (a wanted 0 has no sign and no size to compare with). */
    const is = c => num(c) && Math.abs(c) > 2 * tol && !near(c, t) && near(x, c);
    if (is(-t)) return 'sign';
    if (whole(t) && whole(x) && Math.abs(x - t) === 1) return 'off1';
    if (t !== 0 && Math.abs(Math.abs(t) - 1) > tol && is(1 / t)) return 'flip';
    for (const [k, big, small] of [[100, 'scale100big', 'scale100small'], [10, 'scale10big', 'scale10small'], [2, 'double', 'half']]) {
      if (is(t * k)) return big;
      if (is(t / k)) return small;
    }
    /* Rounded to fewer places than needed (3.1 for 3.14159 when 3.142 is wanted), or close enough to be a rounding slip. */
    for (let d = 0; d <= 4; d++) { const p = 10 ** d, r = Math.round(t * p) / p, down = Math.trunc(t * p) / p; if ((Math.abs(x - r) < 1e-9 || Math.abs(x - down) < 1e-9) && !whole(t)) return 'round'; }
    if (Math.abs(t) > tol && Math.abs(x - t) <= Math.max(3 * tol, 0.02 * Math.abs(t)) && !(whole(t) && whole(x))) return 'round';
    return null;
  }

  function check(typed, wanted, tolerance) {
    const tol = num(tolerance) && tolerance >= 0 ? tolerance : 0.01;
    const xs = Array.from(typed || [], Number), ts = Array.from(wanted || [], Number);
    const near = (a, b) => num(a) && num(b) && Math.abs(a - b) <= tol;
    const ok = ts.map((t, i) => near(xs[i], t));
    return ts.map((t, i) => {
      if (ok[i]) return { ok: true };
      const x = xs[i];
      /* Another box that is also wrong and holds this box's number: the two were swapped. */
      const swapped = ts.some((u, j) => j !== i && !ok[j] && near(x, u) && near(xs[j], t) && !near(u, t));
      if (swapped) return { ok: false, kind: 'swap', text: TEXT.swap };
      if (ts.some((u, j) => j !== i && near(x, u) && !near(u, t))) return { ok: false, kind: 'box', text: TEXT.box };
      const k = alone(x, t, tol);
      return k ? { ok: false, kind: KIND[k] || k, text: TEXT[k] } : { ok: false, kind: 'general', text: GENERAL };
    });
  }

  /* One sentence for the feedback line: the slip, when one field names one, else ''. Two different slips: the first. */
  function summary(results) {
    const named = (results || []).filter(r => r && !r.ok && r.kind !== 'general');
    if (!named.length) return '';
    return named[0].text;
  }

  const api = { check, summary, GENERAL, TEXT };
  root.VGSlips = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof window !== 'undefined' ? window : globalThis);
