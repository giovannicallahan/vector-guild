/* Install from the website (docs/INSTALL.md): the manifest and icons, the service worker (network first, cache as the
   offline fallback, all-or-nothing install, one cache per release, precache list that matches the files in game/), and install.js (nothing on file://, the install
   button, the iPhone line, hidden once installed). Runs sw.js and install.js in a vm with small fakes; no browser.
   Run: node qa/install.test.js (VERBOSE=1 lists each group). */
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const assert = require('node:assert/strict');
const game = path.resolve(__dirname, '../game');
const build = require('../tools/build-sw.js');
const read = f => fs.readFileSync(path.join(game, f), 'utf8');
let checks = 0;
const check = async (fn, label) => { await fn(); checks++; if (process.env.VERBOSE) console.log('ok -', label); };
const tick = () => new Promise(r => setImmediate(r));

const swSrc = read('sw.js'), installSrc = read('install.js');
const indexHtml = read('index.html'), realmHtml = read('realm.html');

/* ---------- fakes for the service worker ---------- */
function makeSw(opts) {
  opts = opts || {};
  const stores = new Map(Object.entries(opts.caches || {}).map(([k, v]) => [k, new Map(Object.entries(v))]));
  /* missing: the server answers 404; dropped: the connection fails for that one file. */
  const net = { online: true, log: [], missing: new Set(opts.missing || []), dropped: new Set(opts.dropped || []) };
  const response = (url, body) => ({ ok: true, type: 'basic', url, body, clone() { return response(url, body); } });
  const cacheApi = name => ({
    put: async (key, res) => { net.puts.push(name); if (stores.has(name)) stores.get(name).set(typeof key === 'string' ? key : key.url, res); },
    match: async key => (stores.get(name) || new Map()).get(typeof key === 'string' ? key : key.url),
  });
  net.puts = [];
  const handlers = {}, state = { skipped: false, claimed: false };
  const self = {
    location: { href: 'https://site.example/vector-guild/sw.js', origin: 'https://site.example' },
    addEventListener: (t, f) => { handlers[t] = f; },
    skipWaiting: async () => { state.skipped = true; },
    clients: { claim: async () => { state.claimed = true; } },
  };
  const sandbox = {
    self, URL, Promise,
    Request: function (url, init) { this.url = url; this.method = 'GET'; Object.assign(this, init); },
    Response: function (body) { this.ok = true; this.body = body; },
    caches: {
      open: async name => { if (!stores.has(name)) stores.set(name, new Map()); return cacheApi(name); },
      has: async name => stores.has(name),
      keys: async () => [...stores.keys()],
      delete: async name => stores.delete(name),
    },
    fetch: async req => {
      const url = typeof req === 'string' ? req : req.url;
      net.log.push({ url, cache: req.cache });
      if (!net.online || net.dropped.has(url)) throw new TypeError('offline');
      if (net.missing.has(url)) return { ok: false, status: 404, type: 'basic', clone() { return this; } };
      return response(url, 'net:' + url);
    },
  };
  vm.runInNewContext(swSrc, sandbox);
  const lifecycle = async type => { const waits = []; handlers[type]({ waitUntil: p => waits.push(p) }); await Promise.all(waits); };
  const request = async (url, init) => {
    const waits = []; let answer;
    handlers.fetch({ request: Object.assign({ url, method: 'GET', mode: 'no-cors' }, init), respondWith: p => { answer = p; }, waitUntil: p => waits.push(p) });
    if (answer === undefined) return { handled: false };
    let res, err;
    try { res = await answer; } catch (e) { err = e; }
    await Promise.all(waits);
    return { handled: true, res, err };
  };
  return { stores, net, state, sandbox, lifecycle, request };
}
const BASE = 'https://site.example/vector-guild/';

/* ---------- fakes for install.js ---------- */
function makeEl(tag) {
  const el = {
    tagName: String(tag).toUpperCase(), children: [], parentNode: null, attrs: {}, style: {}, className: '', id: '', textContent: '', listeners: {},
    get childNodes() { return el.children; },
    appendChild(c) { if (c.parentNode) c.parentNode.removeChild(c); c.parentNode = el; el.children.push(c); el.changed(); return c; },
    removeChild(c) { const i = el.children.indexOf(c); if (i >= 0) el.children.splice(i, 1); c.parentNode = null; el.changed(); return c; },
    setAttribute(k, v) { el.attrs[k] = String(v); }, getAttribute(k) { return k in el.attrs ? el.attrs[k] : null; },
    addEventListener(t, f) { (el.listeners[t] = el.listeners[t] || []).push(f); },
    contains(o) { for (let n = o; n; n = n.parentNode) if (n === el) return true; return false; },
    all() { return el.children.reduce((a, c) => a.concat(c, c.all()), []); },
    querySelector(sel) {
      const m = /^\.([\w-]+)$/.exec(sel);
      return (m ? el.all().find(n => n.className.split(/\s+/).includes(m[1])) : null) || null;
    },
    changed() { for (let n = el; n; n = n.parentNode) if (n.onChange) n.onChange(); },
  };
  return el;
}
function makePage(o) {
  o = Object.assign({ protocol: 'https:', hostname: 'site.example', ua: 'Mozilla/5.0 (Linux; Android 14) Chrome/130 Mobile Safari/537.36', home: true, foot: true, standalone: false, sw: true }, o);
  const head = makeEl('head'), home = o.home ? makeEl('div') : null, winListeners = {}, registered = [], mqs = [];
  let page = null, observers = 0;
  const document = {
    readyState: 'complete', head,
    getElementById: id => (id === 'vg-home' ? home : null),
    createElement: makeEl,
    querySelector: sel => (/apple-touch-icon/.test(sel) ? head.children.find(n => n.rel === 'apple-touch-icon') || null : null),
  };
  const navigator = { userAgent: o.ua, platform: o.platform || 'Linux armv8l', maxTouchPoints: o.touch || 0 };
  if (o.navStandalone) navigator.standalone = true;
  if (o.sw) navigator.serviceWorker = { register: f => { registered.push(f); return Promise.resolve({}); } };
  const window = {
    document, navigator, location: { protocol: o.protocol, hostname: o.hostname },
    addEventListener: (t, f) => { (winListeners[t] = winListeners[t] || []).push(f); },
    matchMedia: q => { const m = { media: q, matches: /standalone/.test(q) && o.standalone, addEventListener() {} }; mqs.push(m); return m; },
    MutationObserver: function (cb) { this.observe = target => { observers++; let queued = false; target.onChange = () => { if (queued) return; queued = true; Promise.resolve().then(() => { queued = false; cb(); }); }; }; },
  };
  window.window = window;
  const mountHome = () => { /* what shell/home.js builds: .vgh-page with (maybe) a footer of actions */
    if (page) home.removeChild(page);
    page = makeEl('div'); page.className = 'vgh-page';
    if (o.foot) { const f = makeEl('footer'); f.className = 'vgh-foot'; const b = makeEl('button'); b.textContent = 'Replay intro'; f.appendChild(b); page.appendChild(f); }
    home.appendChild(page);
  };
  const run = () => vm.runInNewContext(installSrc, { window, document, navigator, location: window.location });
  const fire = (t, e) => (winListeners[t] || []).forEach(f => f(e));
  const find = () => (home ? home.all().find(n => n.id === 'vg-install') || null : null);
  return { window, head, home, registered, winListeners, mountHome, run, fire, find, o, get observers() { return observers; } };
}
const promptEvent = outcome => { const e = { prevented: false, prompted: 0, preventDefault() { e.prevented = true; }, prompt() { e.prompted++; }, userChoice: Promise.resolve({ outcome }) }; return e; };
const IPHONE = 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1';

(async () => {
  await check(() => {
    const m = JSON.parse(read('manifest.webmanifest'));
    assert.equal(m.name, 'MathCosmos');
    assert.equal(m.start_url, './index.html');
    assert.equal(m.scope, './');
    assert.equal(m.display, 'standalone');
    /* Dark colours that match the game: --void in shell/shell.css and the home page theme-color. */
    const voidColor = /--void:(#[0-9a-f]{6})/.exec(read('shell/shell.css'))[1];
    assert.equal(m.background_color, voidColor);
    assert.equal(m.theme_color, voidColor);
    assert.ok(indexHtml.includes('<meta name="theme-color" content="' + voidColor + '">'));
    const sizeOf = f => { const b = fs.readFileSync(path.join(game, f)); assert.equal(b.subarray(1, 4).toString('latin1'), 'PNG', f); return b.readUInt32BE(16) + 'x' + b.readUInt32BE(20); };
    for (const i of m.icons) { assert.ok(!/^(\/|[a-z]+:)/i.test(i.src), 'relative icon path'); assert.equal(i.type, 'image/png'); assert.equal(sizeOf(i.src), i.sizes, i.src); }
    const has = (size, purpose) => m.icons.some(i => i.sizes === size && i.purpose === purpose);
    assert.ok(has('192x192', 'any') && has('512x512', 'any') && has('512x512', 'maskable'));
    assert.equal(sizeOf('icons/icon-180.png'), '180x180');
  }, 'manifest: name, relative start and scope, standalone, dark colours, icons that exist at the stated size');

  await check(() => {
    for (const [name, html] of [['index.html', indexHtml], ['realm.html', realmHtml]]) {
      assert.equal((html.match(/<link rel="manifest" href="manifest\.webmanifest">/g) || []).length, 1, name + ' manifest link');
      assert.equal((html.match(/rel="manifest"/g) || []).length, 1, name);
      assert.equal((html.match(/<meta name="theme-color"/g) || []).length, 1, name + ' theme-color');
      assert.equal((html.match(/<script src="install\.js"><\/script>/g) || []).length, 1, name + ' script');
      assert.ok(html.indexOf('<script src="install.js">') > html.lastIndexOf('</dialog>'), name + ': install.js loads at the end of the body');
      assert.ok(!/type="module"/.test(html), name);
    }
    for (const [name, src] of [['sw.js', swSrc], ['install.js', installSrc]]) {
      assert.ok(!/^\s*(import|export)\s/m.test(src), name + ' is a classic script');
      new vm.Script(src, { filename: name });
    }
    assert.ok(!/\bfetch\s*\(/.test(installSrc) && !/XMLHttpRequest/.test(installSrc), 'install.js makes no requests of its own');
  }, 'pages: one manifest link, one theme-color and one classic install.js tag each');

  await check(() => {
    const want = build.expected(swSrc);
    assert.ok(swSrc === want.src, 'game/sw.js is stale (a file under game/ was added, removed or changed). Run: node tools/build-sw.js');
    const sw = makeSw(), files = [...sw.sandbox.FILES];
    assert.deepEqual(files, build.listFiles(), 'precache list = the files in game/');
    assert.equal(sw.sandbox.VERSION, want.version);
    assert.equal(sw.sandbox.CACHE, 'mathcosmos-' + want.version);
    assert.ok(/^[0-9a-f]{12}$/.test(want.version));
    for (const f of files) assert.ok(fs.statSync(path.join(game, f)).isFile(), f);
    for (const gone of ['home-preview.html', 'collection/preview.html', 'sw.js']) assert.ok(!files.includes(gone), gone + ' is not precached');
    for (const need of ['index.html', 'realm.html', 'install.js', 'manifest.webmanifest', 'icons/icon-192.png', 'app.js', 'save-store.js', 'realms/packs.js', 'shell/home.js', 'shell/vendor/three.min.js']) assert.ok(files.includes(need), need + ' is precached');
    assert.ok(files.every(f => !f.startsWith('/') && !f.includes('..') && !/(^|\/)\./.test(f)), 'relative paths, no dot files');
    /* Every script and stylesheet a pack can ask for is in the list. */
    const win = {}; vm.runInNewContext(read('realms/packs.js'), { window: win });
    const wanted = [];
    for (const id of Object.keys(win.VG_PACKS)) { const p = win.VG_PACKS[id]; wanted.push(...(p.scripts || []), ...(p.styles || [])); }
    const shared = win.VG_REALM_SHARED || {};
    wanted.push(...(shared.styles || []), ...(shared.before || []), ...(shared.after || []));
    assert.ok(wanted.length > 20);
    for (const f of wanted) assert.ok(files.includes(f), f + ' (asked for by a pack) is precached');
  }, 'precache list and cache version match the files in game/ today');

  const DONE = BASE + 'precache-complete';
  const rejects = async (p, label) => { let failed = false; try { await p; } catch (e) { failed = true; } assert.ok(failed, label); };

  await check(async () => {
    const old = () => ({ 'mathcosmos-old': { [BASE + 'index.html']: { body: 'old' }, [DONE]: { body: 'old' } }, 'someone-else': {} });
    const sw = makeSw({ caches: old() });
    const cacheName = sw.sandbox.CACHE, files = sw.sandbox.FILES;
    await sw.lifecycle('install');
    const store = sw.stores.get(cacheName);
    assert.equal(store.size, files.length + 1, 'every file, and the entry that marks the cache complete');
    for (const f of files) assert.ok(store.has(BASE + f), f);
    assert.equal(store.get(DONE).body, sw.sandbox.VERSION);
    assert.equal([...store.keys()].pop(), DONE, 'the complete mark is written last');
    assert.ok(sw.net.log.every(r => r.cache === 'reload'), 'precache skips the browser cache');
    assert.ok(sw.stores.has('mathcosmos-old'), 'installing deletes nothing');
    assert.equal(sw.state.skipped, false, 'no skipWaiting: an open page keeps the release it was loaded with');
    assert.ok(!/skipWaiting/.test(swSrc.replace(/\/\*[\s\S]*?\*\//g, '')));
    await sw.lifecycle('activate');
    assert.equal(sw.state.claimed, true);
    assert.deepEqual([...sw.stores.keys()].sort(), [cacheName, 'someone-else'].sort(), 'old MathCosmos caches go, others stay');

    /* One file fails (a 404, or the connection drops): the install fails, the half-filled cache goes, the old one stays. */
    for (const o of [{ missing: [BASE + 'realms/la/practice-1.js'] }, { dropped: [BASE + 'mira.jpg'] }]) {
      const bad = makeSw(Object.assign({ caches: old() }, o));
      await rejects(bad.lifecycle('install'), 'the install is rejected');
      assert.deepEqual([...bad.stores.keys()].sort(), ['mathcosmos-old', 'someone-else'], 'no incomplete cache is left behind');
      assert.equal(bad.stores.get('mathcosmos-old').get(BASE + 'index.html').body, 'old');
      /* Even if such a worker were activated, it deletes nothing and serves nothing from a cache that is not complete. */
      await bad.lifecycle('activate');
      assert.ok(bad.stores.has('mathcosmos-old'), 'activate without a complete cache keeps the old one');
      bad.stores.set(bad.sandbox.CACHE, new Map([[BASE + 'app.js', { body: 'partial' }]]));
      await bad.lifecycle('activate');
      assert.ok(bad.stores.has('mathcosmos-old'));
      bad.net.online = false;
      const r = await bad.request(BASE + 'app.js');
      assert.ok(r.err instanceof TypeError && !r.res, 'an incomplete cache never answers');
    }
    /* The same release installed again (only sw.js changed) and failing: the complete cache in use is kept. */
    const same = makeSw({ missing: [BASE + 'app.js'] });
    same.stores.set(same.sandbox.CACHE, new Map([[BASE + 'app.js', { body: 'good' }], [DONE, { body: 'x' }]]));
    await rejects(same.lifecycle('install'), 'rejected');
    assert.equal(same.stores.get(same.sandbox.CACHE).get(BASE + 'app.js').body, 'good');
  }, 'service worker install is all or nothing; activate deletes old caches only when the new one is complete');

  await check(async () => {
    const sw = makeSw();
    await sw.lifecycle('install'); await sw.lifecycle('activate');
    const store = sw.stores.get(sw.sandbox.CACHE), frozen = () => JSON.stringify([...store].map(([k, v]) => [k, v.body]));
    /* Online: the network answer is used even though a cached copy exists, and the cache is not written. */
    store.set(BASE + 'app.js', { url: BASE + 'app.js', body: 'release copy' });
    const before = frozen(); sw.net.log.length = 0; sw.net.puts.length = 0;
    let r = await sw.request(BASE + 'app.js');
    assert.equal(r.res.body, 'net:' + BASE + 'app.js');
    assert.equal(sw.net.log.length, 1);
    r = await sw.request(BASE + 'realm.html?realm=found', { mode: 'navigate' });
    assert.equal(r.res.body, 'net:' + BASE + 'realm.html?realm=found');
    /* A file of a newer release that this cache never held is passed on and not kept. */
    r = await sw.request(BASE + 'realms/la/practice-99.js');
    assert.equal(r.res.body, 'net:' + BASE + 'realms/la/practice-99.js');
    /* Not ours: other sites, and anything that is not a GET. */
    assert.equal((await sw.request('https://other.example/x.js')).handled, false);
    assert.equal((await sw.request(BASE + 'app.js', { method: 'POST' })).handled, false);
    assert.equal((await sw.request('not a url')).handled, false);
    /* A failed answer (404) is still the server's answer: passed on, for pages too, never swapped for a cached copy. */
    sw.net.missing.add(BASE + 'nope.js'); sw.net.missing.add(BASE + 'index.html');
    r = await sw.request(BASE + 'nope.js');
    assert.equal(r.res.ok, false);
    r = await sw.request(BASE + 'index.html', { mode: 'navigate' });
    assert.equal(r.res.status, 404, 'a page the server answered is never replaced by the cache');
    assert.equal(frozen(), before, 'nothing is written into the cache while the game runs');
    assert.deepEqual(sw.net.puts, []);
    assert.deepEqual([...sw.stores.keys()], [sw.sandbox.CACHE]);
    /* Offline: the cache answers, with the files of its own release. */
    sw.net.online = false;
    r = await sw.request(BASE + 'app.js');
    assert.equal(r.res.body, 'release copy');
    r = await sw.request(BASE + 'realm.html?realm=la', { mode: 'navigate' });
    assert.equal(r.res.url, BASE + 'realm.html', 'realm.html from the cache for any realm: the query is not part of the key');
    r = await sw.request(BASE, { mode: 'navigate' });
    assert.equal(r.res.url, BASE + 'index.html', 'the folder address falls back to the home page');
    r = await sw.request(BASE + 'realms/la/practice-99.js');
    assert.ok(r.handled && r.err instanceof TypeError && !r.res, 'not in this release: the network error is passed on');
    r = await sw.request(DONE);
    assert.ok(r.err instanceof TypeError, 'the complete mark is not a file');
    /* The browser threw the cache away: the page gets the plain network error, as without a worker. */
    sw.stores.clear();
    r = await sw.request(BASE + 'app.js');
    assert.ok(r.err instanceof TypeError && !r.res);
    assert.equal(sw.stores.size, 0, 'looking does not create a cache');
  }, 'service worker fetch: network first, cache read only when the network fails, never written at run time');

  await check(async () => {
    /* file:// (the Android app): nothing registered, no listeners, no DOM changes, no throw. */
    for (const o of [{ protocol: 'file:', hostname: '' }, { protocol: 'http:', hostname: 'site.example' }, { protocol: 'content:', hostname: '' }]) {
      const p = makePage(o); p.mountHome(); const before = p.home.all().length;
      p.run(); await tick();
      assert.deepEqual(p.registered, [], o.protocol);
      assert.deepEqual(Object.keys(p.winListeners), [], o.protocol);
      assert.equal(p.observers, 0);
      assert.equal(p.home.all().length, before);
      assert.equal(p.head.children.length, 0);
    }
    /* A bare window with almost nothing on it must not throw either. */
    vm.runInNewContext(installSrc, { window: {}, document: {} });
    vm.runInNewContext(installSrc, { window: { location: { protocol: 'file:' }, navigator: {} }, document: {} });
    vm.runInNewContext(installSrc, { window: { location: { protocol: 'https:', hostname: 'a.b' }, navigator: {}, addEventListener() {} }, document: { getElementById: () => null } });
  }, 'install.js does nothing on file:// and never throws');

  await check(async () => {
    for (const o of [{}, { protocol: 'http:', hostname: 'localhost' }, { protocol: 'http:', hostname: 'mc.localhost' }, { protocol: 'http:', hostname: '127.0.0.1' }]) {
      const p = makePage(o); p.mountHome(); p.run(); await tick();
      assert.deepEqual(p.registered, ['sw.js'], JSON.stringify(o));
    }
    /* realm.html has no home page: the worker is registered, nothing else happens. */
    const realm = makePage({ home: false }); realm.run();
    assert.deepEqual(realm.registered, ['sw.js']);
    assert.ok(!realm.winListeners.beforeinstallprompt);
    /* No service worker support: still no throw, and the button can still appear. */
    const none = makePage({ sw: false }); none.mountHome(); none.run();
    assert.deepEqual(none.registered, []);
    assert.ok(none.winListeners.beforeinstallprompt);
  }, 'service worker registered on https and localhost only');

  await check(async () => {
    const p = makePage(); p.mountHome(); p.run(); await tick();
    assert.equal(p.find(), null, 'no button until the browser offers an install');
    const ev = promptEvent('dismissed');
    p.fire('beforeinstallprompt', ev); await tick();
    assert.equal(ev.prevented, true);
    let b = p.find();
    assert.ok(b && b.tagName === 'BUTTON' && b.type === 'button');
    assert.equal(b.textContent, 'Install MathCosmos');
    assert.deepEqual(b.className.split(' '), ['vg-ghost', 'vgh-action'], 'styled like the other home actions (44px, 12px text)');
    assert.equal(b.parentNode.className, 'vgh-foot');
    assert.equal(b.parentNode.children.length, 2, 'added to the existing footer actions');
    /* The home page is rebuilt (Replay intro, coming back from a realm): the button comes back, once. */
    p.mountHome(); await tick(); await tick();
    assert.equal(p.home.all().filter(n => n.id === 'vg-install').length, 1);
    b = p.find();
    /* Tap: the prompt is shown once; dismissed means the button goes until the browser offers again. */
    b.listeners.click[0](); await tick();
    assert.equal(ev.prompted, 1);
    assert.equal(p.find(), null);
    const ev2 = promptEvent('accepted');
    p.fire('beforeinstallprompt', ev2); await tick();
    p.find().listeners.click[0](); await tick();
    assert.equal(ev2.prompted, 1);
    assert.equal(p.find(), null);
    p.fire('beforeinstallprompt', promptEvent('accepted')); await tick();
    assert.equal(p.find(), null, 'installed: stays hidden');

    /* appinstalled hides it too. */
    const q = makePage(); q.mountHome(); q.run();
    q.fire('beforeinstallprompt', promptEvent('accepted')); await tick();
    assert.ok(q.find());
    q.fire('appinstalled', {}); await tick();
    assert.equal(q.find(), null);

    /* A home page without footer actions gets a footer for the button, and loses it again with the button. */
    const bare = makePage({ foot: false }); bare.mountHome(); bare.run();
    bare.fire('beforeinstallprompt', promptEvent('dismissed')); await tick();
    assert.equal(bare.find().parentNode.className, 'vgh-foot');
    bare.find().listeners.click[0](); await tick();
    assert.equal(bare.home.querySelector('.vgh-foot'), null);

    /* install.js runs before the home page is mounted (the wormhole intro plays first). */
    const late = makePage(); late.run();
    late.fire('beforeinstallprompt', promptEvent('dismissed')); await tick();
    assert.equal(late.find(), null);
    late.mountHome(); await tick(); await tick();
    assert.ok(late.find());
  }, 'install button: shown on the prompt event, kept across home rebuilds, hidden after install');

  await check(async () => {
    const p = makePage({ standalone: true }); p.mountHome(); p.run();
    p.fire('beforeinstallprompt', promptEvent('accepted')); await tick();
    assert.equal(p.find(), null, 'already installed (display-mode: standalone)');
    const ios = makePage({ ua: IPHONE, platform: 'iPhone', navStandalone: true }); ios.mountHome(); ios.run(); await tick();
    assert.equal(ios.find(), null, 'already on the iPhone home screen');
  }, 'hidden when already installed');

  await check(async () => {
    const p = makePage({ ua: IPHONE, platform: 'iPhone', touch: 5 }); p.mountHome(); p.run(); await tick();
    const line = p.find();
    assert.ok(line && line.tagName === 'P');
    assert.equal(line.textContent, 'To install: Share, then Add to Home Screen');
    assert.ok(parseInt(/font-size:(\d+)px/.exec(line.style.cssText)[1], 10) >= 12);
    assert.equal(p.home.all().filter(n => n.id === 'vg-install').length, 1, 'one line');
    assert.equal(p.head.children.filter(n => n.rel === 'apple-touch-icon').length, 1);
    assert.equal(p.head.children[0].href, 'icons/icon-180.png');
    /* iPad that reports itself as a Mac. */
    const pad = makePage({ ua: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Safari/605.1.15', platform: 'MacIntel', touch: 5 });
    pad.mountHome(); pad.run(); await tick();
    assert.ok(pad.find());
    /* Not shown on a desktop Mac, on Android, or in another browser on iPhone. */
    for (const o of [{ ua: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Safari/605.1.15', platform: 'MacIntel', touch: 0 }, {}, { ua: IPHONE.replace('Version/18.0', 'CriOS/130.0'), platform: 'iPhone', touch: 5 }]) {
      const q = makePage(o); q.mountHome(); q.run(); await tick();
      assert.equal(q.find(), null, o.ua || 'android');
    }
  }, 'iPhone and iPad Safari: one line of instructions');

  console.log('install.test.js: ' + checks + ' groups passed');
})().catch(e => { console.error(e); process.exit(1); });
