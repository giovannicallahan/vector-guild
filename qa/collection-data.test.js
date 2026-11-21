/* Tests for the figure roster in game/collection/figures.js. Plain Node, no dependencies.
   Usage: node qa/collection-data.test.js */
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const assert = require('node:assert/strict');
const source = fs.readFileSync(path.resolve(__dirname, '../game/collection/figures.js'), 'utf8');
const window = {};
vm.runInNewContext(source, { window });
const figures = window.VG_FIGURES;

const TEXT = ['id', 'name', 'born', 'died', 'place', 'field', 'knownFor', 'bio', 'idea', 'rarity', 'perk', 'emblem'];
const KEYS = [...TEXT, 'sources'];
const LIMITS = { knownFor: 60, bio: 320, idea: 200 };
const RARITIES = ['common', 'rare', 'legendary'];
const PERKS = ['stardust', 'chapter', 'secondlook', 'drill'];
const TAGS = ['path', 'circle', 'ellipse', 'line', 'polyline', 'polygon', 'rect', 'g', 'text'];
const isText = s => typeof s === 'string' && s.trim().length > 0;

let count = 0;
const test = (name, fn) => { fn(); count++; console.log('ok   ' + name); };
const each = fn => { for (const f of figures) fn(f, 'figure ' + (f && f.id)); };

test('figures.js is a classic script that sets window.VG_FIGURES to an array', () => {
  assert.ok(Array.isArray(figures), 'window.VG_FIGURES is an array');
  assert.ok(!/^\s*(import|export)\s/m.test(source), 'no module syntax');
  assert.ok(source.includes('2026-11-21'), 'the header gives the date the facts were checked');
});

test('at least 36 figures, at least 6 legendary', () => {
  assert.ok(figures.length >= 36, 'found ' + figures.length + ' figures');
  const legendary = figures.filter(f => f.rarity === 'legendary').length;
  assert.ok(legendary >= 6, 'found ' + legendary + ' legendary');
});

test('ids are unique lowercase slugs', () => {
  const seen = new Set();
  each((f, who) => {
    assert.match(String(f.id), /^[a-z0-9]+(-[a-z0-9]+)*$/, who + ': id is a lowercase slug');
    assert.ok(!seen.has(f.id), who + ': id is used twice');
    seen.add(f.id);
  });
});

test('no person appears twice', () => {
  const seen = new Set();
  each((f, who) => { const n = String(f.name).toLowerCase(); assert.ok(!seen.has(n), who + ': name is used twice'); seen.add(n); });
});

test('every required field is a non-empty string within its length limit, and no field is unknown', () => {
  each((f, who) => {
    for (const k of TEXT) assert.ok(isText(f[k]), who + ': ' + k + ' is a non-empty string');
    for (const k in LIMITS) assert.ok(f[k].length <= LIMITS[k], who + ': ' + k + ' is ' + f[k].length + ' characters, limit ' + LIMITS[k]);
    for (const k of Object.keys(f)) assert.ok(KEYS.includes(k), who + ': unknown field ' + k);
  });
});

test('rarity and perk are from the allowed sets', () => {
  each((f, who) => {
    assert.ok(RARITIES.includes(f.rarity), who + ': rarity ' + f.rarity);
    assert.ok(PERKS.includes(f.perk), who + ': perk ' + f.perk);
  });
});

test('each figure has at least one https source, and every source is a string', () => {
  each((f, who) => {
    assert.ok(Array.isArray(f.sources) && f.sources.length > 0, who + ': sources is a non-empty array');
    for (const s of f.sources) assert.ok(isText(s), who + ': a source is not a string');
    assert.ok(f.sources.some(s => /^https:\/\/[^\s/]+\.[^\s/]+/.test(s)), who + ': no https source');
  });
});

test('emblems use only the allowed tags and no script, href, style or on* attributes', () => {
  each((f, who) => {
    const e = f.emblem;
    assert.ok(!/script/i.test(e), who + ': emblem mentions script');
    assert.ok(!/<!|<\?|&/.test(e), who + ': emblem has a comment, declaration or entity');
    let depth = 0, drawn = 0;
    for (const m of e.matchAll(/<[^>]*>?/g)) {
      const tag = /^<(\/?)([A-Za-z][A-Za-z0-9:-]*)((?:\s+[A-Za-z][A-Za-z0-9:-]*="[^"<>]*")*)\s*(\/?)>$/.exec(m[0]);
      assert.ok(tag, who + ': emblem tag cannot be read: ' + m[0].slice(0, 40));
      const [, close, name, attrs, selfClose] = tag;
      assert.ok(TAGS.includes(name), who + ': emblem tag <' + name + '> is not allowed');
      if (close) { assert.ok(!attrs && !selfClose, who + ': bad closing tag'); depth--; assert.ok(depth >= 0, who + ': emblem closes a tag it did not open'); continue; }
      for (const a of attrs.matchAll(/\s+([A-Za-z][A-Za-z0-9:-]*)="([^"]*)"/g)) {
        const attr = a[1].toLowerCase();
        assert.ok(attr !== 'style' && !attr.endsWith('href') && !attr.startsWith('on'), who + ': emblem attribute ' + a[1] + ' is not allowed');
        assert.ok(!/url\s*\(|javascript:/i.test(a[2]), who + ': emblem attribute ' + a[1] + ' points outside the drawing');
      }
      if (name !== 'g') drawn++;
      if (!selfClose) depth++;
    }
    assert.equal(depth, 0, who + ': emblem tags are not balanced');
    assert.ok(drawn > 0, who + ': emblem draws nothing');
  });
});

test('the list is sorted by rarity, then by name', () => {
  for (let i = 1; i < figures.length; i++) {
    const a = figures[i - 1], b = figures[i], d = RARITIES.indexOf(a.rarity) - RARITIES.indexOf(b.rarity);
    assert.ok(d < 0 || (d === 0 && a.name.localeCompare(b.name, 'en') < 0), a.id + ' should not come before ' + b.id);
  }
});

test('rarity is about half common, a third rare, 6 to 8 legendary; perks are spread evenly', () => {
  const n = figures.length, by = k => v => figures.filter(f => f[k] === v).length;
  const common = by('rarity')('common'), rare = by('rarity')('rare'), legendary = by('rarity')('legendary');
  assert.ok(Math.abs(common - n / 2) <= n * 0.08, 'common: ' + common + ' of ' + n);
  assert.ok(Math.abs(rare - n / 3) <= n * 0.08, 'rare: ' + rare + ' of ' + n);
  assert.ok(legendary >= 6 && legendary <= 8, 'legendary: ' + legendary);
  const counts = PERKS.map(by('perk'));
  assert.ok(Math.max(...counts) - Math.min(...counts) <= 2, 'perk counts: ' + counts.join(', '));
});

console.log('\n' + count + ' tests passed, ' + figures.length + ' figures checked');
