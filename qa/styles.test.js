/* Static checks on the engine stylesheets (no browser needed).
 * Run: node qa/styles.test.js
 * Guards the legibility and touch-target floors: 12 px text, 44 px controls; and the colour and life layer
 * (life.css, life.js): the palette exists and passes WCAG AA on the dark panels, motion can be switched off.
 * It reads the cascade in pack order (game/realms/packs.js): styles, docking, update, handson; then life.css,
 * which realm.html loads last. */
'use strict';
const fs = require('fs');
const path = require('path');
const game = path.resolve(__dirname, '../game');
const FILES = ['styles.css', 'docking.css', 'update.css', 'handson.css', 'life.css'];
const FLOOR = 12;

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

/* 1. Text floor. Every selector that declares a font size anywhere must end at 12 px or more
      once the whole cascade is applied (FLOOR, 12 px). Sizes in SVG user units are listed with the scale
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
    check(size * scale >= FLOOR - 0.05,
      `${sel}${media ? ' in ' + media : ''}: ${size}px renders at ${(size * scale).toFixed(1)}px (floor ${FLOOR})`);
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

/* 4. Text size: the page's base text is 16 to 17 px. */
const bodyPx = last('body', fontPx);
check(bodyPx >= 16 && bodyPx <= 17, `body text is ${bodyPx}px (16 to 17)`);

/* 5. Colour (life.css). Eight chapter colours, three tiers, three practice kinds and three counters, each a
      CSS variable on :root, each at least 4.5:1 (WCAG AA) as text on the dark panels they sit on. */
const root = {};
rules.filter(r => r.file === 'life.css' && !r.media && r.selectors.includes(':root')).forEach(r => Object.assign(root, r.decls));
const lum = hex => { const c = [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16) / 255).map(v => v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)); return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]; };
const contrast = (a, b) => { const x = lum(a), y = lum(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); };
const PANELS = ['#172428', '#19262a', '#1d2c30', '#1b292b'];   // sector, card, raised panel, dialog
const PALETTE = [1, 2, 3, 4, 5, 6, 7, 8].map(n => '--ch-' + n).concat(
  ['basic', 'intermediate', 'advanced'].map(t => '--tier-' + t), ['setting', 'applied', 'challenge'].map(k => '--kind-' + k), ['--xp', '--sp', '--dust']);
PALETTE.forEach(name => {
  const v = root[name];
  check(/^#[0-9a-f]{6}$/i.test(v || ''), `${name} is a six-digit colour on :root in life.css (got ${v})`);
  if (!/^#[0-9a-f]{6}$/i.test(v || '')) return;
  PANELS.forEach(bg => check(contrast(v, bg) >= 4.5, `${name} ${v} on ${bg}: contrast ${contrast(v, bg).toFixed(2)} (needs 4.5)`));
  /* The soft washes use the same colour as "r,g,b". */
  if (/^--(ch|tier|kind)-/.test(name)) check((root[name + '-rgb'] || '').replace(/\s/g, '') === [1, 3, 5].map(i => parseInt(v.slice(i, i + 2), 16)).join(','), `${name}-rgb matches ${name}`);
});
check(new Set([1, 2, 3, 4, 5, 6, 7, 8].map(n => root['--ch-' + n])).size === 8, 'the eight chapter colours are all different');
check(new Set(['basic', 'intermediate', 'advanced'].map(t => root['--tier-' + t])).size === 3, 'the three tier colours are different');
check(new Set(['setting', 'applied', 'challenge'].map(k => root['--kind-' + k])).size === 3, 'the three practice-kind colours are different');
for (let n = 1; n <= 8; n++) check(last(`[data-ch="${n}"]`, d => d['--ch']) === `var(--ch-${n})`, `[data-ch="${n}"] sets --ch`);
['basic', 'intermediate', 'advanced'].forEach(t => check(last(`.tier-badge[data-tier=${t}]`, d => d.color) === `var(--tier-${t})`, `tier badge ${t} has its colour`));
['setting', 'applied', 'challenge'].forEach(k => check(last(`.practice-chip[data-kind=${k}]`, d => d['--kind']) === `var(--kind-${k})`, `practice chip ${k} has its colour`));
/* The hooks those rules need are in the markup app.js writes. */
const app = fs.readFileSync(path.join(game, 'app.js'), 'utf8');
check(/class="sector dd[^"]*" data-ch="/.test(app), 'app.js: a drop-down carries data-ch');
check(/class="tier-badge" data-tier="/.test(app), 'app.js: the mission card has a tier badge');
check(/class="practice-chip \$\{st\}" data-quest="[^"]*" data-kind="/.test(app), 'app.js: a practice chip carries data-kind');
check((app.match(/window\.VGLife/g) || []).length >= 1 && /if\(window\.VGLife\)try\{/.test(app), 'app.js: every VGLife call is guarded');

/* 6. No thick stripe down one side of a box: a one-sided border is at most 2 px. */
rules.forEach(r => ['left', 'right', 'top', 'bottom'].forEach(side => {
  const w = px(r.decls['border-' + side]);
  check(w === null || w <= 2, `${r.file} ${r.selectors.join(',')}: border-${side} is ${w}px (at most 2)`);
}));

/* 7. Life: everything that moves is off under prefers-reduced-motion, the burst takes no taps, and nothing
      here moves or resizes a control when it is pressed. */
const lifeCss = fs.readFileSync(path.join(game, 'life.css'), 'utf8'), lifeJs = fs.readFileSync(path.join(game, 'life.js'), 'utf8');
const calm = rules.filter(r => r.file === 'life.css' && r.media === '@media(prefers-reduced-motion:reduce)');
const calmed = (sel, prop, value) => calm.some(r => r.selectors.includes(sel) && (r.decls[prop] || '').replace(/\s/g, '') === value);
['body::before', 'body::after', '.life-glow'].forEach(sel => check(calmed(sel, 'animation', 'none!important'), `${sel}: animation off under reduced motion`));
['.dd-bar i', '.quest', '.practice-chip'].forEach(sel => check(calmed(sel, 'transition', 'none!important'), `${sel}: transition off under reduced motion`));
check(calmed('.life-burst', 'display', 'none!important'), 'the burst is hidden under reduced motion');
check(last('.life-burst', d => d['pointer-events']) === 'none', 'the burst canvas takes no taps');
check(last('body::before', d => d['pointer-events']) === 'none' && last('body::before', d => d['z-index']) === '-1', 'the starfield sits behind the page and takes no taps');
rules.filter(r => r.file === 'life.css' && r.selectors.some(s => /:active/.test(s))).forEach(r =>
  ['transform', 'margin', 'padding', 'width', 'height', 'top', 'left', 'translate', 'scale'].forEach(prop =>
    check(!(prop in r.decls), `${r.selectors.join(',')}: a pressed control must not move or resize (${prop})`)));
(lifeCss.match(/animation:[^;}]*/g) || []).forEach(a => check(!/infinite/.test(a) || /life-(drift|twinkle)/.test(a), `only the starfield loops: ${a}`));
check(/window\.VGLife|W\.VGLife = api/.test(lifeJs) && /celebrate/.test(lifeJs) && /tick/.test(lifeJs), 'life.js exposes VGLife.celebrate and VGLife.tick');
check(/prefers-reduced-motion/.test(lifeJs), 'life.js reads prefers-reduced-motion');
check(!/\b(import|export)\s|fetch\(|XMLHttpRequest|localStorage/.test(lifeJs), 'life.js is a classic script with no network and no storage');
const burstLimit = /LIMIT = (\d+)/.exec(lifeJs);
check(burstLimit && Number(burstLimit[1]) + 60 < 1200, 'the burst ends in under 1.2 s');
const realmHtml = fs.readFileSync(path.join(game, 'realm.html'), 'utf8');
check(/<link rel="stylesheet" href="life\.css"><\/head>/.test(realmHtml), 'realm.html loads life.css last in the head');
check(/<script src="life\.js"><\/script><\/body>/.test(realmHtml), 'realm.html loads life.js last');

if (failures) { console.error(`styles: ${failures} of ${checks} checks failed`); process.exit(1); }
console.log(`styles: ${checks} checks passed`);
