/* Static checks on the engine stylesheets (no browser needed).
 * Run: node qa/styles.test.js
 * Guards the legibility and touch-target floors: 11 px text, 44 px controls.
 * It reads the cascade in pack order (game/realms/packs.js): styles, docking, update, handson. */
'use strict';
const fs = require('fs');
const path = require('path');
const game = path.resolve(__dirname, '../game');
const FILES = ['styles.css', 'docking.css', 'update.css', 'handson.css'];

/* Minimal CSS reader: flat rules plus one level of @media. Returns [{file, media, selectors, decls}]. */
function parse(file) {
  const src = fs.readFileSync(path.join(game, file), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
  const rules = [];
  let i = 0, media = '';
  while (i < src.length) {
    const open = src.indexOf('{', i), close = src.indexOf('}', i);
    if (close !== -1 && (open === -1 || close < open)) { media = ''; i = close + 1; continue; }
    if (open === -1) break;
    const head = src.slice(i, open).trim();
    if (head.startsWith('@media')) { media = head.replace(/\s+/g, ''); i = open + 1; continue; }
    if (head.startsWith('@')) {            // @keyframes and friends: skip the whole block
      let depth = 1, j = open + 1;
      while (depth && j < src.length) { if (src[j] === '{') depth++; else if (src[j] === '}') depth--; j++; }
      i = j; continue;
    }
    const end = src.indexOf('}', open);
    const decls = {};
    src.slice(open + 1, end).split(';').forEach(d => {
      const k = d.indexOf(':');
      if (k > 0) decls[d.slice(0, k).trim()] = d.slice(k + 1).trim();
    });
    rules.push({ file, media, selectors: head.split(',').map(s => s.replace(/\s+/g, ' ').trim()), decls });
    i = end + 1;
  }
  return rules;
}
const rules = FILES.flatMap(parse);

function px(v) { const m = /(-?[\d.]+)px/.exec(v || ''); return m ? parseFloat(m[1]) : null; }
function fontPx(decls) {
  if (decls['font-size']) return px(decls['font-size']);
  if (decls.font) return px(decls.font.split('/')[0]);
  return null;
}
/* Last value in the cascade for an exact selector: rules outside media queries, plus rules
   inside the media query `media` when one is given (its text with whitespace removed). */
function last(selector, read, media) {
  let out = null;
  rules.forEach(r => {
    if (!r.selectors.includes(selector)) return;
    if (r.media && r.media !== media) return;
    const v = read(r.decls);
    if (v !== null && v !== undefined) out = v;
  });
  return out;
}

let failures = 0, checks = 0;
function check(ok, message) { checks++; if (!ok) { failures++; console.error('FAIL ' + message); } }

/* 1. Text floor. Every selector that declares a font size anywhere must end at 11 px or more
      once the whole cascade is applied. Sizes in SVG user units are listed with the scale
      they render at, so the floor is checked in rendered pixels. */
const SVG_SCALE = {
  // 320-unit pictures: up to 440 px wide on desktop, about 225 px inside the 375 px mission dialog.
  '.hands-on .hands-on-tick': { base: 440 / 320, phone: 225 / 320 },
  '.hands-on .hands-on-label': { base: 440 / 320, phone: 225 / 320 },
  // 720-unit outpost picture: shown only where it is at least about 610 px wide.
  '.outpost-scene .op-label text': { base: 610 / 720 },
  '.outpost-scene text.op-label': { base: 610 / 720 }
};
const sized = new Set();
rules.forEach(r => { if (fontPx(r.decls) !== null) r.selectors.forEach(s => sized.add(s)); });
const medias = ['', ...new Set(rules.map(r => r.media).filter(Boolean))];
sized.forEach(sel => {
  medias.forEach(media => {
    const size = last(sel, fontPx, media);
    if (size === null) return;
    const phone = /max-width:(650|700)px/.test(media);
    const scale = (SVG_SCALE[sel] || {})[phone ? 'phone' : 'base'] || 1;
    check(size * scale >= 11 - 0.05,
      `${sel}${media ? ' in ' + media : ''}: ${size}px renders at ${(size * scale).toFixed(1)}px (floor 11)`);
  });
});
['.quest-top', '.sector-heading .sector-count', '.guide-id', '.tree-legend', '.tree-node small',
  '.hands-on .hands-on-eyebrow', '.hands-on .hands-on-tick', '.hands-on .hands-on-label',
  '.outpost-scene .op-label text', '.outpost-scene text.op-label'
].forEach(sel => check(sized.has(sel), `${sel}: expected a font size in the engine stylesheets`));

/* 2. The outpost picture labels are hidden, and the status list shown, by the same media query. */
const hide = rules.filter(r => r.selectors.includes('.outpost-scene .op-label') && r.decls.display === 'none');
check(hide.length === 1 && hide[0].media.includes('max-width:760px') && hide[0].media.includes('min-width:951px'),
  'outpost labels: one hide rule covering <=760px and the 951-990px band');
check(hide.length === 1 && rules.some(r => r.media === hide[0].media && r.selectors.includes('.outpost-status') && r.decls.display === 'grid'),
  'outpost status list is shown wherever the picture labels are hidden');

/* 3. Touch targets: 44 px in both directions and no flex shrinking. */
const minH = d => px(d['min-height']);
['.vector-edit input', '.tool-form input', '.answer-grid input', '.operation-label select',
  'section.concept-lab select', 'select[data-gl-model]', 'select[data-gl-preset]',
  '.flight-help summary', '.guide-list summary', '.nav', '.secondary', '.primary'
].forEach(sel => check(last(sel, minH) >= 44, `${sel}: min-height ${last(sel, minH)}px (needs 44)`));
check(last('.help-btn', d => px(d.width)) >= 44 && last('.help-btn', d => px(d.height)) >= 44, '.help-btn is 44 x 44');
check(last('.help-btn', d => px(d['min-width'])) >= 44 && /^0 0 44px$/.test(last('.help-btn', d => d.flex) || ''),
  '.help-btn must not shrink inside the top bar (flex:0 0 44px; min-width:44px)');
check(last('.topbar>div:first-child', d => d['min-width']) === '0', 'top-bar status text can give way (min-width:0)');
check(last('.flight-help summary', d => d.display) === null, '.flight-help summary keeps its native disclosure marker (no display override)');

if (failures) { console.error(`styles: ${failures} of ${checks} checks failed`); process.exit(1); }
console.log(`styles: ${checks} checks passed`);
