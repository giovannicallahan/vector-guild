/* Tap-to-define words (game/glossary.js).
   Run: node qa/glossary.test.js
   Checks the data (window.VG_GLOSSARY) and the matching (VGGlossary.find) for every pack in game/realms/packs.js
   (qa/pack-list.js), without a page:
     - at least 40 terms per pack; every entry has a one-sentence meaning, an example and a learn mission that teaches it
       (a pack added later, with its words in game/realms/<id>/glossary.js, needs the 40 once all its learn missions
       are written, and its own `required` words always; until then a short list is a NOTE)
     - every term is really used in the pack's lesson, prompt, hint or solution text
     - matching takes whole words, the longest term first, each term once per block, and leaves a word alone where it has another sense
     - mission text is never changed, and the file is a classic script that needs no page to load
     - an opened definition is put into a polite live region that exists beforehand, so a screen reader reads it
   The look and the placing of the buttons and the pop-up are page code: they are checked in a browser (see the release notes). */
'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.join(__dirname, '..', 'game'), read = f => fs.readFileSync(path.join(root, f), 'utf8');
const PACK_IDS = require('./pack-list.js').ids();
const PAGE_ONLY = new Set(['lab3d.js', 'graph-lab.js', 'docking.js', 'handson.js', 'contracts.js', 'board.js', 'concept-lab.js', 'experiment-low.js', 'experiment-high.js', 'collection/ui.js']);

function load(realm) {
  const w = { VG_SEED: 0 };
  vm.runInNewContext(read('realms/packs.js'), { window: w });
  for (const f of [...w.VG_REALM_SHARED.before, ...w.VG_PACKS[realm].scripts]) if (!PAGE_ONLY.has(f)) vm.runInNewContext(read(f), { window: w, Math });
  return w;
}
/* Every piece of text a player can read in a lesson, a problem, a hint or a solution. */
function texts(q) {
  const t = q.teaching, out = [q.prompt, q.solution, ...(q.hints || [])];
  if (!q.parent) { out.push(q.lesson); if (t) out.push(t.intuition, ...t.steps, t.example.prompt, ...t.example.steps, t.example.answer, ...t.pitfalls); }
  return out.filter(x => typeof x === 'string' && x);
}

let checks = 0;
const notes = [];
for (const realm of PACK_IDS) {
  const w = load(realm), G = w.VG_GLOSSARY, V = w.VGGlossary, pack = G[realm] || {}, keys = Object.keys(pack);
  const learn = new Map(w.QUESTS.filter(q => !q.parent).map(q => [q.id, q])), before = JSON.stringify(w.QUESTS);
  /* A pack that is still being written (Calculus 1) declares its learn missions in REALM.chapters before they exist:
     a word may be given to a declared mission, and must be used in the text once that mission is written. */
  const declared = new Set((w.REALM.chapters || []).flatMap(c => Array.from(c.ids)));
  assert.ok(V && typeof V.wrap === 'function' && typeof V.find === 'function' && typeof V.close === 'function', 'VGGlossary');
  /* A pack added after Calculus 1 ships its words in game/realms/<id>/glossary.js; the three 2.5 packs keep theirs in game/glossary.js. */
  const own = (w.VG_GLOSSARY_PACKS || {})[realm];
  if (['found', 'la', 'calc1'].includes(realm)) assert.ok(!own, realm + ': its words stay in game/glossary.js');
  else {
    assert.ok(own && Array.isArray(own.terms) && Array.isArray(own.required), `${realm}: game/realms/${realm}/glossary.js registers { required, terms } (docs/PACK-SPEC.md, "Glossary")`);
    assert.ok(w.VG_PACKS[realm].scripts.indexOf(`realms/${realm}/glossary.js`) === w.VG_PACKS[realm].scripts.indexOf('glossary.js') - 1, `${realm}: its glossary loads just before game/glossary.js`);
    assert.equal(own.terms.length, keys.length, `${realm}: one row per term, no term twice`);
  }
  const allWritten = (w.REALM.chapters || []).every(c => c.ids.every(id => learn.has(id)));
  if (allWritten) assert.ok(keys.length >= 40, `${realm}: ${keys.length} terms (needs 40)`);
  else if (keys.length < 40) notes.push(`${realm} has ${keys.length} glossary terms; it needs 40 once all its learn missions are written.`);
  const used = new Set();
  for (const q of w.QUESTS) for (const text of texts(q)) { let rest = text; for (;;) { const hit = V.find(rest, realm, new Set())[0]; if (!hit) break; used.add(hit.key); rest = rest.slice(hit.index + hit.text.length); } }
  for (const key of keys) {
    const e = pack[key], where = `${realm} "${key}"`;
    assert.equal(key, e.term.toLowerCase(), where + ': keyed by its term');
    assert.ok(e.means.length >= 20 && e.means.length <= 190 && /[.”]$/.test(e.means), where + ': a short meaning that ends with a full stop');
    assert.ok(!/[.!?]\s+\p{Lu}/u.test(e.means.replace(/\b[A-Z]\s/g, 'x ')), where + ': the meaning is one sentence');
    assert.ok(e.example.length >= 8 && e.example.length <= 150, where + ': a tiny example');
    for (const text of [e.means, e.example]) { assert.ok(!/(?<![A-Za-z–-])-(?=[\d(a-z])/.test(text), where + ': minus signs are U+2212'); assert.ok(!/\s{2}|\s$|^\s/.test(text), where + ': tidy spacing'); }
    assert.ok(learn.has(e.taught) || declared.has(e.taught), where + `: taught in a learn mission (${e.taught})`);
    assert.ok(Array.isArray(e.also), where + ': also');
    if (learn.has(e.taught)) assert.ok(used.has(key), where + ': the word is used in the pack\'s text');
    checks++;
  }
  /* matching */
  const hit = (text, taken) => Array.from(V.find(text, realm, taken), h => h.key + '@' + h.text); // a plain array, out of the vm realm
  if (realm === 'found') {
    assert.deepEqual(hit('The denominator is the bottom. A common denominator is shared; denominators differ.'), ['denominator@denominator', 'common denominator@common denominator'], 'longest term first, each term once');
    assert.deepEqual(hit('Take the square root of that sum.'), ['square root@square root', 'sum@sum']);
    assert.deepEqual(hit('A rate of change is not a unit rate. The rate is steady.'), ['rate of change@rate of change', 'unit rate@unit rate', 'rate@rate']);
    assert.deepEqual(hit('7 cases of power cells and a powerful summary of fractional factory rows'), ['row@rows'], 'whole words only; "power cells" is not a power');
    assert.deepEqual(hit('Fractions and Matrices; Σ a(2, j)'), ['fraction@Fractions', 'matrix@Matrices', 'σ@Σ'], 'plurals and capitals');
    assert.deepEqual(hit('Use Pythagoras’ rule here.'), ['pythagoras’ rule@Pythagoras’ rule']);
    const taken = new Set(); hit('A fraction.', taken); assert.deepEqual(hit('The fraction and its numerator.', taken), ['numerator@numerator'], 'a term already used in the block is skipped');
  } else if (realm === 'calc1') {
    assert.deepEqual(hit('The average rate of change is a rate of change over an interval; intervals shrink.'), ['average rate of change@average rate of change', 'rate of change@rate of change', 'interval@interval'], 'longest term first, each term once');
    assert.deepEqual(hit('We write Δ for a change. The slope of the secant line tends to that of the tangent line.'), ['δ@Δ', 'secant line@secant line', 'tangent line@tangent line']);
    assert.deepEqual(hit('Keep to the speed limit. The tangent of the angle is 1.'), [], 'everyday and trigonometric senses are left alone');
    assert.deepEqual(hit('The limit exists; the definite integral is an integral. Concave up, then L’Hôpital’s rule.'), ['limit@limit', 'definite integral@definite integral', 'integral@integral', 'concave@Concave up', 'l’hôpital’s rule@L’Hôpital’s rule']);
    for (const term of ['limit', 'derivative', 'tangent line', 'secant line', 'rate of change', 'continuous', 'asymptote', 'critical point', 'concave', 'antiderivative', 'integral', 'riemann sum']) assert.ok(pack[term], 'calc1 defines "' + term + '"');
  } else if (realm === 'la') {
    assert.deepEqual(hit('The dot product of unit vectors; each vector has a norm.'), ['dot product@dot product', 'unit vector@unit vectors', 'vector@vector', 'norm@norm']);
    assert.deepEqual(hit('Use the inverse cosine, then the inverse of A.'), ['inverse@inverse'], 'the first "inverse" has another sense and is left alone');
    assert.deepEqual(hit('The pseudoinverse and off-diagonal entries; the first principal component.'), ['pseudoinverse@pseudoinverse'], 'no match inside a longer word or in another sense');
    assert.deepEqual(hit('Gram–Schmidt gives orthonormal eigenvectors.'), ['gram–schmidt@Gram–Schmidt', 'orthonormal@orthonormal', 'eigenvector@eigenvectors']);
  } else {
    /* Any later pack: the words it says it must define (its own `required` list), each found by its own spelling. */
    for (const term of own.required) { assert.ok(pack[term.toLowerCase()], `${realm} defines "${term}" (required in game/realms/${realm}/glossary.js)`); assert.deepEqual(hit(pack[term.toLowerCase()].term), [term.toLowerCase() + '@' + pack[term.toLowerCase()].term], `${realm}: "${term}" is matched as written`); }
    for (const key of keys) assert.ok(!/[A-Z]/.test(key), `${realm} "${key}": keyed in lower case`);
  }
  assert.equal(V.find('', realm).length, 0); assert.equal(V.find('no maths words here', 'nope').length, 0);
  assert.equal(V.wrap({ querySelectorAll: () => [] }, realm), 0, 'without a page, wrap does nothing');
  assert.equal(V.close(), false); assert.equal(JSON.stringify(w.QUESTS), before, 'mission text is never changed');
  /* the generators give the same text with the glossary loaded as without it */
  const bare = { VG_SEED: 0 }; vm.runInNewContext(read('realms/packs.js'), { window: bare });
  for (const f of [...bare.VG_REALM_SHARED.before, ...bare.VG_PACKS[realm].scripts]) if (!PAGE_ONLY.has(f) && f !== 'glossary.js') vm.runInNewContext(read(f), { window: bare, Math });
  for (const q of w.QUESTS.slice(0, 30)) assert.equal(JSON.stringify(w.Gen.instance(q, 5, 3)), JSON.stringify(bare.Gen.instance(bare.QUESTS.find(x => x.id === q.id), 5, 3)));
  checks += 6;
}
/* The definition is announced. A very small stand-in for the page: enough for wrap() to add its listeners and for
   one press on a word. The live region must be there, empty, before the text goes in, and inside the open dialog. */
{
  const timers = [], handlers = {};
  const el = tag => {
    const e = { tagName: String(tag).toUpperCase(), children: [], attrs: {}, style: {}, className: '', id: '', parent: null, isConnected: true, _text: null,
      setAttribute(k, v) { e.attrs[k] = String(v); }, getAttribute: k => (k in e.attrs ? e.attrs[k] : null), removeAttribute(k) { delete e.attrs[k]; },
      appendChild(c) { c.parent = e; e.children.push(c); return c; }, remove() { const i = e.parent.children.indexOf(e); if (i >= 0) e.parent.children.splice(i, 1); },
      getBoundingClientRect: () => ({ left: 0, top: 0, right: 0, bottom: 0, width: 100, height: 40 }), focus() {}, closest: () => null,
      get textContent() { return e._text !== null ? e._text : e.children.map(c => c.textContent).join(''); }, set textContent(v) { e._text = String(v); e.children = []; } };
    return e;
  };
  const dialog = el('dialog'), body = el('body'), dc = el('div'); dialog.appendChild(dc);
  const document = { body, documentElement: { clientWidth: 375, clientHeight: 812 }, createElement: el, createTextNode: t => ({ textContent: String(t) }), createTreeWalker() { return { nextNode: () => null }; },
    createDocumentFragment: () => el('fragment'), addEventListener: (t, fn) => { handlers[t] = fn; } };
  const w = { document, innerHeight: 812, setTimeout: fn => { timers.push(fn); }, addEventListener() {} };
  vm.runInNewContext(read('glossary.js'), { window: w });
  const V = w.VGGlossary, key = 'dot product', entry = w.VG_GLOSSARY.la[key];
  assert.equal(V.wrap({ querySelectorAll: () => [], closest: () => dialog }, 'la'), 0);
  const word = el('button'); word.setAttribute('data-gloss', key); word.setAttribute('data-gloss-pack', 'la');
  word.closest = sel => sel === 'button.gloss' ? word : sel === 'dialog[open]' ? dialog : null;
  const press = () => handlers.click({ target: word, preventDefault() {}, stopPropagation() {} });
  press();
  const live = dialog.children.find(n => n.className === 'gloss-live'), pop = dialog.children.find(n => n.className === 'gloss-pop');
  assert.ok(live && pop, 'the live region and the definition are inside the open dialog');
  assert.equal(live.attrs['aria-live'], 'polite'); assert.equal(live.attrs['aria-atomic'], 'true');
  assert.match(live.style.cssText, /position:absolute;width:1px;height:1px/, 'the region is not visible; the pop-up is');
  assert.equal(live.textContent, '', 'the region is there, empty, before the definition is put in');
  assert.equal(timers.length, 1); timers.shift()();
  assert.equal(live.textContent, `Dot product: ${entry.means} Example: ${entry.example} Taught in: ${entry.taught.toUpperCase()}`);
  assert.equal(pop.attrs.role, 'note'); assert.equal(word.attrs['aria-describedby'], pop.id); assert.equal(word.attrs['aria-expanded'], 'true');
  assert.equal(V.close(), true); assert.equal(live.textContent, '', 'closing empties the region'); assert.equal(word.attrs['aria-expanded'], 'false');
  /* opened again: the same region, said again; a definition closed before its turn is not said afterwards */
  press(); timers.shift()(); assert.ok(live.textContent.startsWith('Dot product: '));
  assert.equal(dialog.children.filter(n => n.className === 'gloss-live').length, 1, 'one region per dialog');
  press(); /* the same word again closes it */ assert.equal(V.isOpen(), false); assert.equal(live.textContent, '');
  press(); V.close(); timers.splice(0).forEach(fn => fn()); assert.equal(live.textContent, '');
  /* outside a dialog the region is on the page */
  word.closest = sel => sel === 'button.gloss' ? word : null; press(); timers.splice(0).forEach(fn => fn());
  assert.ok(body.children.find(n => n.className === 'gloss-live').textContent.startsWith('Dot product: '));
  checks += 12;
}
const src = read('glossary.js'), app = read('app.js'), packs = read('realms/packs.js'), css = read('update.css');
assert.ok(!/\bfetch\(|\bimport\s|type="module"|innerHTML/.test(src), 'glossary.js: a classic script; the pop-up is built from text nodes, never from HTML strings');
{ const w = { }; vm.runInNewContext(packs, { window: w }); assert.ok(PACK_IDS.length >= 3 && PACK_IDS.every(id => w.VG_PACKS[id].scripts[w.VG_PACKS[id].scripts.length - 1] === 'glossary.js'), 'every pack loads glossary.js, last'); }
assert.ok((app.match(/gloss\(/g) || []).length >= 5 && /VGGlossary\?\.close\?\.\(\)\)return true/.test(app), 'app.js wraps lesson, prompt, hint and solution text, and Back closes a definition first');
assert.ok(/button\.gloss\{[^}]*padding:15px 3px[^}]*text-decoration:underline dotted/.test(css) && /button\.gloss::after\{[^}]*width:max\(100%,44px\)/.test(css), 'the word has a dotted underline and a 44 px tap area');
assert.ok(/prefers-reduced-motion:reduce\)\{\.gloss-pop\{animation:none\}\}/.test(css), 'the pop-up honours reduced motion');
checks += 5;
for (const note of notes) console.log('NOTE: ' + note);
const later = PACK_IDS.filter(id => !['found', 'la', 'calc1'].includes(id));
if (later.length) console.log(`and ${later.map(id => `${id} (${Object.keys(load(id).VG_GLOSSARY[id] || {}).length} terms)`).join(', ')}.`);
console.log(`PASS: glossary, ${checks} checks: ${Object.keys(load('found').VG_GLOSSARY.found).length} Foundations terms, ${Object.keys(load('la').VG_GLOSSARY.la).length} linear algebra terms and ${Object.keys(load('calc1').VG_GLOSSARY.calc1).length} Calculus 1 terms, matching rules, unchanged mission text.`);
