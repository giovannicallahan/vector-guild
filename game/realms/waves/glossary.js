/* Waves: sound and light glossary: the words this pack teaches, shown as tap-to-define buttons in its lessons, prompts, hints and
   solutions. game/glossary.js (loaded right after this file) merges them; docs/PACK-SPEC.md, "Glossary".
   required  the words the pack must define: qa/glossary.test.js fails while one is missing
   terms     one row per word: [term, taught, means, example, also?, avoid?]
               term     the word as shown at the top of the definition (keyed in lower case)
               taught   the learn mission that teaches it (q01–q40); once that mission is written, its text must use the word
               means    one plain sentence, 20 to 190 characters, ending with a full stop
               example  one tiny example, 8 to 150 characters
               also     other spellings of the same word (plurals are added automatically)
               avoid    a pattern: where the text around a match fits it, the word has another sense there and is left alone
   Minus signs are − (U+2212). Add the row for a word in the same change as the mission that teaches it, under the
   section of that mission's file. Once all 40 learn missions are written the pack needs at least 40 words. */
(function(){
'use strict';
const P = window.VG_GLOSSARY_PACKS = window.VG_GLOSSARY_PACKS || {};
P['waves'] = {
 required: ['oscillation', 'frequency', 'amplitude', 'wavelength', 'interference', 'standing wave', 'harmonic', 'decibel', 'Doppler effect', 'refraction', 'total internal reflection', 'focal length', 'diffraction', 'grating'],
 terms: [
  /* q01–q10 (missions-a.js) */
  /* q11–q20 (missions-b.js) */
  /* q21–q30 (missions-c.js) */
  /* q31–q40 (missions-d.js) */
 ]
};
})();
