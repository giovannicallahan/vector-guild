/* The collection interface on a page (game/collection/ui.js over the real core and save store), run in Node
   with a small stand-in for the page. Usage: node qa/collection-ui.test.js
   It checks what only the page code can get wrong:
     - a toast shown inside one of the page's own dialogs moves out when that dialog closes
     - a toast takes no presses, so the control under it gets the tap
     - the Summon button never charges a price it did not show (two pages, one save)
     - the Chances block shows the chances of the next summon, also when a guarantee is due
     - the chip has a word, a spoken name and a tooltip
     - the phone top bar and the plain wording that the 2.1 review asked for
   The figures are a small fixture, so this test does not depend on game/collection/figures.js. */
'use strict';
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const assert = require('node:assert/strict');
const read = f => fs.readFileSync(path.resolve(__dirname, '..', f), 'utf8');
const SRC = ['game/save-store.js', 'game/realms/registry.js', 'game/collection/achievements.js', 'game/collection/core.js', 'game/collection/ui.js'].map(read);
const V2 = 'vector-guild-save-v2';
const FIGURES = Array.from({ length: 12 }, (_, i) => ({ id: 'f' + i, name: 'Figure ' + i, born: 1700, died: 1780, place: 'Somewhere', field: i % 2 ? 'Physics' : 'Mathematics',
  knownFor: 'Something', bio: 'A life.', idea: 'An idea.', rarity: i < 7 ? 'common' : i < 10 ? 'rare' : 'legendary', perk: 'drill', sources: [], emblem: '<circle cx="32" cy="32" r="20"/>' }));

/* ---------- a very small page ---------- */
function makePage(storage = new Map()) {
  const doc = { activeElement: null };
  class Node {
    constructor(tag) { this.tagName = String(tag).toUpperCase(); this.nodeType = 1; this.children = []; this.parentNode = null; this.attrs = {}; this.listeners = {}; this.style = {}; this.className = ''; this._text = ''; this.id = ''; this.hidden = false; this.disabled = false; this.tabIndex = 0; this.open = false; this.modal = false; this.title = '';
      const self = this; this.classList = { add: c => { if (!self.classList.contains(c)) self.className = (self.className + ' ' + c).trim(); }, remove: c => { self.className = self.className.split(/\s+/).filter(x => x && x !== c).join(' '); }, contains: c => self.className.split(/\s+/).includes(c), toggle: (c, on) => { if (on) self.classList.add(c); else self.classList.remove(c); } }; }
    get childNodes() { return this.children; }
    get firstChild() { return this.children[0] || null; }
    get textContent() { return this._text + this.children.map(c => c.textContent).join(''); }
    set textContent(v) { for (const c of this.children) c.parentNode = null; this.children = []; this._text = v == null ? '' : String(v); }
    set innerHTML(v) { this.textContent = ''; this.html = String(v); }
    appendChild(c) { if (c.parentNode) c.parentNode.removeChild(c); this.children.push(c); c.parentNode = this; return c; }
    removeChild(c) { const i = this.children.indexOf(c); assert.ok(i >= 0, 'removeChild: not a child'); this.children.splice(i, 1); c.parentNode = null; return c; }
    replaceChild(n, o) { const i = this.children.indexOf(o); assert.ok(i >= 0, 'replaceChild: not a child'); if (n.parentNode) n.parentNode.removeChild(n); this.children[i] = n; n.parentNode = this; o.parentNode = null; return o; }
    setAttribute(k, v) { this.attrs[k] = String(v); if (k === 'open') this.open = true; }
    getAttribute(k) { return Object.prototype.hasOwnProperty.call(this.attrs, k) ? this.attrs[k] : null; }
    removeAttribute(k) { delete this.attrs[k]; if (k === 'open') this.open = false; }
    addEventListener(type, fn) { (this.listeners[type] || (this.listeners[type] = [])).push(fn); }
    emit(type, e = {}) { for (const fn of (this.listeners[type] || []).slice()) fn(Object.assign({ target: this, preventDefault() {}, stopPropagation() {} }, e)); }
    click() { if (!this.disabled) this.emit('click'); }
    focus() { doc.activeElement = this; }
    contains(n) { for (let x = n; x; x = x.parentNode) if (x === this) return true; return false; }
    get isConnected() { return doc.body.contains(this); }
    walk(out = []) { for (const c of this.children) if (c.nodeType === 1) { out.push(c); c.walk(out); } return out; }
    querySelectorAll(sel) { return sel === '[data-figure]' ? this.walk().filter(n => n.getAttribute('data-figure') !== null) : []; }
    matches(sel) { return sel === ':modal' ? this.modal : false; }
    showModal() { this.open = true; this.modal = true; }
    close() { if (!this.open) return; this.open = false; this.modal = false; this.emit('close'); }
    getClientRects() { return [1]; }
  }
  doc.createElement = tag => new Node(tag);
  doc.createTextNode = text => ({ nodeType: 3, textContent: String(text), parentNode: null });
  doc.documentElement = new Node('html'); doc.body = new Node('body'); doc.documentElement.appendChild(doc.body);
  doc.getElementById = id => doc.body.walk().find(n => n.id === id) || null;
  doc.querySelectorAll = sel => sel === 'dialog[open]' ? doc.body.walk().filter(n => n.tagName === 'DIALOG' && n.open) : [];
  const timers = [], winListeners = {};
  const win = { document: doc, Math, JSON, Date, VG_SEED: 1, VG_FIGURES: FIGURES, HTMLDialogElement: function () {},
    localStorage: { getItem: k => storage.has(k) ? storage.get(k) : null, setItem: (k, v) => storage.set(k, String(v)), removeItem: k => storage.delete(k) },
    setTimeout: (fn, ms) => { timers.push({ fn, ms }); return timers.length; },
    addEventListener: (type, fn) => { (winListeners[type] || (winListeners[type] = [])).push(fn); } };
  win.window = win;
  vm.createContext(win);
  for (const src of SRC) vm.runInContext(src, win);
  const text = id => { const n = doc.getElementById(id); return n ? n.textContent : null; };
  return { win, doc, storage, UI: win.VGCollectionUI, C: win.VGCollection, S: win.VGSave, Node, text,
    runTimers: (max = Infinity) => { for (const t of timers.splice(0)) if (t.ms <= max) t.fn(); else timers.push(t); },
    storageEvent: () => (winListeners.storage || []).forEach(fn => fn({ key: V2 })),
    hostDialog: () => { const d = doc.createElement('dialog'); d.id = 'dialog'; doc.body.appendChild(d); d.showModal(); return d; },
    toastBox: () => doc.documentElement.walk().find(n => n.classList.contains('vgc-toasts')) || null };
}
const give = (S, dust) => { const m = S.meta(); m.dust = dust; S.putMeta(m); };
let count = 0;
const test = (name, fn) => { fn(); count++; console.log('ok   ' + name); };

test('the stand-in page loads the interface', () => {
  const p = makePage();
  for (const name of ['open', 'close', 'toast', 'chip', 'refresh', 'isOpen', 'back']) assert.equal(typeof p.UI[name], 'function', name);
  assert.equal(p.UI.toast('Hello'), true); assert.equal(p.toastBox().parentNode, p.doc.body);
});

test('a toast inside one of the page\'s dialogs moves to the page when that dialog closes', () => {
  /* Settings -> Import save on a realm page: the stardust message is shown while the settings dialog is open. */
  const p = makePage(), host = p.hostDialog();
  assert.equal(p.UI.toast('+600 stardust'), true);
  const box = p.toastBox(); assert.equal(box.parentNode, host, 'inside the open dialog, where it can be seen');
  host.close();
  assert.equal(box.parentNode, p.doc.body, 'after the dialog closes the toast is on the page');
  assert.equal(box.childNodes.length, 1); assert.match(box.textContent, /\+600 stardust/);
  /* A second dialog on top: closing the top one moves the toasts to the one below. */
  const lower = p.hostDialog(); const upper = p.doc.createElement('dialog'); p.doc.body.appendChild(upper); upper.showModal();
  p.UI.toast('+10 stardust'); assert.equal(box.parentNode, upper);
  upper.close(); assert.equal(box.parentNode, lower); lower.close(); assert.equal(box.parentNode, p.doc.body);
  /* The watcher is added once per dialog, however many toasts it has shown. */
  const again = p.hostDialog(); for (let i = 0; i < 5; i++) p.UI.toast('+' + i + ' stardust');
  assert.equal((again.listeners.close || []).length, 1, 'one close watcher per dialog');
  /* An empty box is taken out instead of being moved. */
  p.runTimers(); assert.equal(box.childNodes.length, 0); assert.equal(box.parentNode, again);
  again.close(); assert.equal(box.parentNode, null);
  assert.equal(p.UI.toast('+1 stardust'), true); assert.equal(box.parentNode, p.doc.body);
  /* The collection's own overlay still looks after its toasts itself. */
  p.UI.open(); p.UI.toast('+2 stardust'); assert.equal(box.parentNode.classList.contains('vgc-dialog'), true);
  p.UI.close(); assert.equal(box.parentNode, p.doc.body);
});

test('a toast takes no presses and leaves by itself', () => {
  const p = makePage(); p.UI.toast('+15 stardust');
  const t = p.toastBox().childNodes[0];
  assert.deepEqual(Object.keys(t.listeners), [], 'no press handler: the tap goes to the control underneath');
  const css = read('game/collection/collection.css');
  assert.match(css, /\.vgc-toasts\{[^}]*pointer-events:none/, 'the toast area takes no presses');
  assert.doesNotMatch(css, /\.vgc-toast[^{}]*\{[^}]*pointer-events:auto/, 'and no toast takes them back');
  p.runTimers(6000); assert.equal(p.toastBox().childNodes.length, 1); p.runTimers(); assert.equal(p.toastBox().childNodes.length, 0, 'gone after 6.5 s');
});

test('"Summon for free" never charges: a stale button takes nothing and then shows the real price', () => {
  const storage = new Map(), a = makePage(storage), b = makePage(storage);
  give(a.S, 100);
  a.UI.open('summon'); const go = a.doc.getElementById('vgc-pull');
  assert.equal(go.textContent, 'Summon for free'); go.focus();
  /* The other tab uses the free summon. This tab hears nothing (no storage event yet) and the player presses. */
  assert.equal(b.C.pull(() => 0.99).free, true);
  const dust = a.C.dust(), pulls = a.S.meta().pulls;
  go.click();
  assert.equal(a.C.dust(), dust, 'no stardust was taken'); assert.equal(a.S.meta().pulls, pulls, 'and nothing was summoned');
  assert.equal(a.text('vgc-pull'), 'Summon for 60 stardust', 'the button now shows the real price');
  assert.match(a.text('vgc-pull-note'), /The cost changed\. Nothing was used\./);
  assert.equal(a.doc.getElementById('vgc-reveal'), null);
  /* Pressing the button that shows 60 does summon for 60. */
  a.doc.getElementById('vgc-pull').click();
  assert.equal(a.S.meta().pulls, pulls + 1); assert.ok(a.doc.getElementById('vgc-reveal'), 'the figure is shown');
});

test('the Summon button is brought up to date in place when the save changes elsewhere', () => {
  const storage = new Map(), a = makePage(storage), b = makePage(storage);
  give(a.S, 100);
  a.UI.open('summon'); const go = a.doc.getElementById('vgc-pull'), rules = a.doc.getElementById('vgc-rules'); go.focus();
  b.C.pull(() => 0.99); a.storageEvent();
  assert.equal(a.doc.getElementById('vgc-pull'), go, 'the button under the focus is not rebuilt'); assert.equal(a.doc.activeElement, go);
  assert.equal(go.textContent, 'Summon for 60 stardust'); assert.equal(go.disabled, false);
  assert.match(a.text('vgc-pull-note'), /^You have \d+ stardust\. One summon uses 60\.$/);
  assert.notEqual(a.doc.getElementById('vgc-rules'), rules, 'chances and guarantees are redrawn');
  assert.match(a.text('vgc-rules'), /One is certain within your next 4 summons/);
  const before = a.S.meta().pulls; go.click(); assert.equal(a.S.meta().pulls, before + 1, 'and the press is charged what the button says');
  /* Stardust spent elsewhere: the button goes off and the focus moves to the tab, not into nowhere. */
  const again = a.doc.getElementById('vgc-pull'); again.focus(); give(b.S, 3); a.storageEvent();
  assert.equal(again.disabled, true); assert.match(a.text('vgc-pull-note'), /You need 57 more stardust/);
  assert.equal(a.doc.activeElement.id, 'vgc-tab-summon');
});

test('Chances shows the chances of the next summon, also when a guarantee is due', () => {
  const rows = p => p.doc.getElementById('vgc-rules').walk().filter(n => n.tagName === 'LI' && /^is-/.test(n.className)).map(n => n.textContent);
  const usual = makePage(); usual.UI.open('summon');
  assert.deepEqual(rows(usual), ['Common70%', 'Rare24%', 'Legendary6%']);
  assert.equal(usual.doc.getElementById('vgc-rules').childNodes[0].textContent, 'Chances'); assert.doesNotMatch(usual.text('vgc-rules'), /Usual chances/);
  for (const [sinceRare, sinceLegend, want] of [[4, 4, ['Common0%', 'Rare80%', 'Legendary20%']], [2, 19, ['Common0%', 'Rare0%', 'Legendary100%']]]) {
    const p = makePage(), m = p.S.meta(); Object.assign(m, { pulls: 20, dust: 200, sinceRare, sinceLegend }); p.S.putMeta(m);
    p.UI.open('summon');
    assert.deepEqual(rows(p), want); assert.equal(p.doc.getElementById('vgc-rules').childNodes[0].textContent, 'Chances for your next summon');
    assert.match(p.text('vgc-rules'), /A guarantee is due\. Usual chances: common 70%, rare 24%, legendary 6%\./);
    assert.match(p.text('vgc-rules'), /Your next summon is one for sure\./);
    /* What is shown is what is drawn. */
    const r = p.C.pull(() => 0.999); assert.notEqual(r.rarity, 'common');
  }
});

test('the chip: a word, the number, a spoken name and a tooltip', () => {
  const p = makePage(); give(p.S, 3740);
  const realm = p.doc.createElement('button'); p.doc.body.appendChild(realm); p.UI.chip(realm, { label: 'Stardust', name: 'Collection' });
  const word = realm.walk().find(n => n.classList.contains('vgc-chip-label'));
  assert.equal(word.textContent, 'Stardust', 'the number has its unit beside it'); assert.equal(realm.walk().find(n => n.classList.contains('vgc-chip-dust')).textContent, '3740');
  assert.equal(realm.getAttribute('aria-label'), 'Collection: 3740 stardust'); assert.equal(realm.title, 'Collection: 3740 stardust');
  const shell = p.doc.createElement('button'); p.doc.body.appendChild(shell); p.UI.chip(shell, { label: 'Collection' });
  assert.equal(shell.getAttribute('aria-label'), 'Collection: 3740 stardust'); assert.equal(shell.title, 'Collection: 3740 stardust');
  give(p.S, 3800); p.UI.refresh(); assert.equal(realm.title, 'Collection: 3800 stardust', 'the tooltip follows the count');
  /* On a phone the word is hidden and the chip keeps to emblem and number. */
  const css = read('game/update.css');
  assert.match(css, /@media\(max-width:650px\)\{[^@]*\.collection-chip \.vgc-chip-label\{display:none\}/);
});

test('the realm top bar on a phone: the status words give way, the view name stays, then the stats alone', () => {
  const html = read('game/realm.html'), css = read('game/update.css');
  assert.match(html, /<header class="topbar"><div><span class="online-dot"><\/span> <span class="top-sys">SYSTEM ONLINE<\/span> <span class="slash">\/<\/span> <span id="top-view">CAMPAIGN<\/span><\/div>/);
  assert.match(css, /@media\(max-width:650px\)\{[^@]*\.topbar \.online-dot,\.topbar \.top-sys,\.topbar \.slash\{display:none\}/, 'under 650px only the view name is left');
  assert.match(css, /@media\(max-width:420px\)\{[^@]*\.topbar>div:first-child\{display:none\}[^@]*\.topbar\{justify-content:flex-end\}/, 'under 420px the bar is the stats alone');
  assert.match(css, /\.collection-chip\{min-height:44px;min-width:44px/, 'the chip stays a 44 px target');
  assert.match(css, /\.help-btn\{width:44px;height:44px/);
});

test('plain wording: rarity is called by its names, and the "equipped" task uses the button\'s word', () => {
  const p = makePage(); p.UI.open('summon');
  assert.match(p.text('vgc-rules'), /Every common figure is equally likely\. The same goes for rare and for legendary\./);
  assert.doesNotMatch(read('game/collection/ui.js'), /same kind/);
  const a = p.win.VG_ACHIEVEMENTS.find(x => x.id === 'equipped');
  assert.equal(a.name, 'Travelling companion'); assert.match(a.text, /^Equip a figure/, 'the task names the Equip button');
  assert.equal(p.UI.logic.failText('price'), 'The cost changed. Nothing was used. Check it and try again.');
});

console.log(`PASS: ${count} collection interface tests.`);
