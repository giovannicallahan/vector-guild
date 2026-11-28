/* The five-minute run (2.8): a button on the home page for a short mixed set of problems with fresh numbers, from
   missions the player has already solved in any realm. Unlimited runs; the first run finished on a local calendar
   day pays a little stardust. Separate from the daily review (daily.js), but built on the same parts: the same
   problem models (Variants.make / Variants.check, loaded per realm by VGDaily.lib), the same choice of concepts
   (VGDaily.logic.pool, weighted to the least recently practised and to notebook misses), the same number reading.
   One try per problem, so a run stays short. The end screen says how many were right and what to revisit.
   State: meta.run = { paid: <day of the last paid run> | null, runs: <runs finished> } in the v2 save (optional;
   a save without it simply has had no run). Nothing here changes progress or XP, and nothing is ever taken away.
   Classic script, no modules, no network. Safe to load where there is no document (qa/run.test.js).

   window.VGRun
     mount(host, opts)  draws the card into host (opts.heading: 'h2' | 'h3').
     refresh()          redraws the card from the save, unless a run is in progress.
     logic              pure helpers. */
(function (root) {
  'use strict';
  var RULES = { min: 3, max: 5, dust: 10, unlock: 3 };
  function isObject(o) { return !!o && typeof o === 'object' && !Array.isArray(o); }
  function D() { return root.VGDaily && root.VGDaily.logic ? root.VGDaily : null; }

  /* How many problems: five when there are five solved concepts or more, else three (concepts come round again). */
  function size(concepts) { return Math.max(RULES.min, Math.min(RULES.max, concepts | 0)); }
  /* A mixed set: concepts in weighted order (daily's pick), then taken one realm at a time, so two problems in a row
     come from different realms where the player has more than one. rng returns a number in [0, 1). */
  function choose(entries, rng) {
    var L = D() && D().logic, list = Array.isArray(entries) ? entries : [];
    if (!L || !list.length) return [];
    var n = size(list.length), order = L.pick(list, list.length, rng), out = [], byRealm = {}, realms = [];
    order.forEach(function (e) { if (!Object.prototype.hasOwnProperty.call(byRealm, e.realm)) { byRealm[e.realm] = []; realms.push(e.realm); } byRealm[e.realm].push(e); });
    while (out.length < Math.min(n, list.length)) realms.forEach(function (r) { if (out.length < n && byRealm[r].length) out.push(byRealm[r].shift()); });
    for (var k = 0, base = out.length; base && out.length < n; k++) out.push(out[k % base]);
    return out;
  }
  /* The card's state from meta.run: whether today's run bonus is still to be had. */
  function status(run, day, solved) {
    var r = isObject(run) ? run : {}, paid = Number.isInteger(r.paid) ? r.paid : null;
    return { locked: (solved | 0) < RULES.unlock, need: Math.max(0, RULES.unlock - (solved | 0)), bonus: paid === null || day > paid, runs: Number.isInteger(r.runs) && r.runs > 0 ? r.runs : 0 };
  }
  /* A finished run, applied to a copy of meta: counts it, and pays RULES.dust when no run was paid on `day` yet
     (a device clock set back pays nothing). Returns { meta, events }. */
  function settle(meta, day) {
    var m = isObject(meta) ? JSON.parse(JSON.stringify(meta)) : {}, r = isObject(m.run) ? m.run : {}, paid = Number.isInteger(r.paid) ? r.paid : null, events = [];
    m.run = { paid: paid, runs: (Number.isInteger(r.runs) && r.runs > 0 ? r.runs : 0) + 1 };
    Object.keys(r).forEach(function (k) { if (k !== 'paid' && k !== 'runs') m.run[k] = r[k]; });
    if (Number.isInteger(day) && day >= 0 && (paid === null || day > paid)) {
      m.run.paid = day; m.dust = (Number.isInteger(m.dust) ? m.dust : 0) + RULES.dust; m.earned = (Number.isInteger(m.earned) ? m.earned : 0) + RULES.dust;
      events.push({ type: 'run', day: day, dust: RULES.dust });
    }
    return { meta: m, events: events };
  }
  /* The end screen: how many right, and the concepts to revisit (each once, in the order asked). */
  function summary(results) {
    var list = Array.isArray(results) ? results : [], seen = {}, revisit = [];
    list.forEach(function (x) { if (x && !x.ok && !seen[x.key]) { seen[x.key] = 1; revisit.push(x); } });
    return { right: list.filter(function (x) { return x && x.ok; }).length, total: list.length, revisit: revisit };
  }
  function endLine(s) {
    if (!s.total) return '';
    if (s.right === s.total) return 'All ' + s.total + ' right. A clean run.';
    return s.right + ' of ' + s.total + ' right.' + (s.right ? ' Good work.' : ' Each one you look at again gets easier.');
  }
  var Logic = { RULES: RULES, size: size, choose: choose, status: status, settle: settle, summary: summary, endLine: endLine };
  var API = { logic: Logic, mount: function () {}, refresh: function () {} };
  root.VGRun = API;
  if (typeof document === 'undefined' || !document || typeof document.createElement !== 'function') return;

  /* ---------- the save ---------- */
  function store() { var S = root.VGSave; return S && !S.fallback && typeof S.meta === 'function' && typeof S.putMeta === 'function' ? S : null; }
  function metaNow() { try { var S = store(); return S ? S.meta() : null; } catch (e) { return null; } }
  function slices() { try { var S = store(), all = S && S.exportAll(); return all && isObject(all.realms) ? all.realms : {}; } catch (e) { return {}; } }
  function scope() {
    var all = slices(), L = D().logic, out = [];
    Object.keys(all).forEach(function (id) { if (/^[a-z0-9]+$/.test(id) && isObject(all[id]) && L.solvedIds(all[id]).length) out.push([id, all[id]]); });
    return out;
  }
  function solvedAll() { var L = D().logic; return scope().reduce(function (n, p) { return n + L.solvedIds(p[1]).length; }, 0); }
  /* Pays once per day, as one step: the save is read again just before the write, and if another tab wrote in
     between, the step starts again from the newer save. Returns the events actually stored ([] when none). */
  function finishRun(day) {
    var S = store(); if (!S) return [];
    for (var tries = 0; tries < 4; tries++) {
      var before = S.meta(), text = JSON.stringify(before), out = settle(before, day);
      try { var C = root.VGCollection; if (C && typeof C.markPlayed === 'function') C.markPlayed(out.meta, day); } catch (e) { /* the dots are optional */ }
      if (JSON.stringify(S.meta()) !== text) continue;
      var ok = false; try { ok = S.putMeta(out.meta) === true; } catch (e) { ok = false; }
      return ok ? out.events : [];
    }
    return [];
  }
  function realmName(id) {
    var name = id;
    (Array.isArray(root.VG_REALMS) ? root.VG_REALMS : []).forEach(function (node) { (node && Array.isArray(node.parts) ? node.parts : []).forEach(function (p) { if (p && p.id === id) name = String(p.name || node.name || id); }); });
    return name;
  }

  /* ---------- the card ---------- */
  var M = null;   /* { host, heading, session } */
  function el(tag, cls, text) { var e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; }
  function button(cls, text, onClick) { var b = el('button', cls, text); b.type = 'button'; b.addEventListener('click', onClick); return b; }
  function frame(stateName) {
    var card = el('section', 'vgd vgr'), head = el('div', 'vgd-head'), h = el(M.heading, 'vgd-title', 'Five-minute run');
    h.id = 'vgr-title'; card.setAttribute('aria-labelledby', 'vgr-title'); card.setAttribute('data-state', stateName);
    head.appendChild(h); card.appendChild(head);
    var body = el('div', 'vgd-body'); card.appendChild(body);
    M.host.textContent = ''; M.host.appendChild(card);
    return { card: card, head: head, body: body };
  }
  function bonusLine(st) { return st.bonus ? 'Your first run today gives ' + RULES.dust + ' stardust.' : 'Today’s run stardust is already yours. Runs are unlimited, so carry on for practice.'; }
  function drawIdle() {
    if (!M) return;
    M.session = null;
    if (!store() || !D() || typeof D().lib !== 'function') { M.host.textContent = ''; M.host.hidden = true; return; }
    M.host.hidden = false;
    var day = D().today(), m = metaNow() || {}, st = status(m.run, day, solvedAll()), f = frame(st.locked ? 'locked' : 'ready');
    if (st.locked) {
      f.body.appendChild(el('p', 'vgd-text', 'Up to five quick problems with fresh numbers, mixed from every realm you have played. It opens after three solved missions.'));
      f.body.appendChild(el('p', 'vgd-note', st.need === RULES.unlock ? 'Solve three missions to open it.' : 'Solve ' + D().logic.plural(st.need, 'more mission', 'more missions') + ' to open it.'));
      return;
    }
    f.body.appendChild(el('p', 'vgd-text', 'Up to five quick problems with fresh numbers, mixed from missions you have solved in any realm. One try each, then the next one.'));
    f.body.appendChild(el('p', 'vgd-note', bonusLine(st)));
    var row = el('div', 'vgd-actions');
    row.appendChild(button('vgd-btn vgd-primary', 'Start a run', start));
    f.body.appendChild(row);
  }
  function message(text) { var f = frame('loading'); var p = el('p', 'vgd-text', text); p.setAttribute('aria-live', 'polite'); f.body.appendChild(p); return f.body; }
  function start() {
    if (!M) return;
    var day = D().today(), daily = (metaNow() || {}).daily || null, pairs = scope(), left = pairs.length, all = [], libs = {}, session = M.session = { day: day, loading: true };
    if (!left) { drawIdle(); return; }
    message('Loading your run…');
    pairs.forEach(function (pair) {
      D().lib(pair[0], function (lib) {
        if (lib) { libs[pair[0]] = lib; try { all = all.concat(D().logic.pool(pair[0], pair[1], lib, daily, day)); } catch (e) { /* that realm is skipped */ } }
        if (--left || !M || M.session !== session) return;
        var items = choose(all, Math.random);
        if (!items.length) {
          M.session = null;
          var box = message(Object.keys(libs).length ? 'None of your solved missions has a short problem yet. Solve one more mission and come back.' : 'The problems could not be loaded here. Reload the page to try again.');
          var row = el('div', 'vgd-actions'); row.appendChild(button('vgd-btn', 'Back', drawIdle)); box.appendChild(row);
          return;
        }
        M.session = { day: day, items: items, libs: libs, i: 0, results: [] };
        drawProblem(true);
      });
    });
  }
  function drawProblem(focus) {
    var s = M.session, item = s.items[s.i], lib = s.libs[item.realm], v = null, L = D().logic;
    try { v = lib.make(item.id); } catch (e) { v = null; }
    if (!v || !Number.isFinite(v.target)) { s.items.splice(s.i, 1); if (s.i >= s.items.length) { end(); return; } drawProblem(focus); return; }
    var f = frame('problem'), body = f.body, inputId = 'vgr-answer';
    var bar = el('div', 'vgr-progress'); bar.setAttribute('aria-hidden', 'true');
    for (var k = 0; k < s.items.length; k++) { var r = s.results[k]; bar.appendChild(el('span', 'vgr-pip' + (k === s.i ? ' is-now' : r ? (r.ok ? ' is-right' : ' is-miss') : ''))); }
    f.head.appendChild(bar);
    body.appendChild(el('p', 'vgd-step', 'Problem ' + (s.i + 1) + ' of ' + s.items.length + ' · ' + realmName(item.realm) + (item.topic ? ' · ' + item.topic : '')));
    if (v.setup) body.appendChild(el('p', 'vgd-text', v.setup));
    var ask = el('p', 'vgd-text'); ask.appendChild(el('b', null, v.prompt)); ask.appendChild(document.createTextNode(' ' + (v.note || 'Answers within 2% are accepted.'))); body.appendChild(ask);
    var field = el('div', 'vgd-field'), label = el('label', 'vgd-label', v.label || 'ANSWER'), input = el('input', 'vgd-input');
    label.htmlFor = inputId; input.id = inputId; input.type = 'text'; input.setAttribute('inputmode', 'decimal'); input.autocomplete = 'off'; input.setAttribute('autocapitalize', 'off'); input.spellcheck = false;
    input.setAttribute('aria-describedby', 'vgr-feedback');
    field.appendChild(label); field.appendChild(input); body.appendChild(field);
    var row = el('div', 'vgd-actions'), out = el('p', 'vgd-feedback'); out.id = 'vgr-feedback'; out.setAttribute('aria-live', 'polite');
    var last = s.i === s.items.length - 1;
    var check = button('vgd-btn vgd-primary', 'Check', function () {
      var raw = L.readNumber(input.value, function (x) { return lib.check(v, x); });
      if (!Number.isFinite(raw)) { out.textContent = 'Enter a number first.'; return; }
      var ok = !!lib.check(v, raw);
      check.disabled = true; check.hidden = true; skip.hidden = true; input.readOnly = true; out.setAttribute('data-ok', ok ? 'yes' : 'no');
      s.results[s.i] = { ok: ok, key: item.key, realm: item.realm, id: item.id, title: item.title, topic: item.topic };
      out.textContent = ok ? 'Correct. ' + (v.formula || '') : 'Not this time: ' + (v.label || 'the answer') + ' = ' + lib.show(v.target) + '. ' + (v.formula || '');
      var next = button('vgd-btn vgd-primary', last ? 'See how it went' : 'Next problem', advance);
      row.appendChild(next); try { next.focus(); } catch (e) { /* ignore */ }
    });
    /* Not sure? Skip shows the answer and counts it as one to revisit, without a wrong answer typed. */
    var skip = button('vgd-btn', 'Show me', function () {
      s.results[s.i] = { ok: false, key: item.key, realm: item.realm, id: item.id, title: item.title, topic: item.topic };
      check.disabled = true; check.hidden = true; skip.hidden = true; input.readOnly = true; out.setAttribute('data-ok', 'no');
      out.textContent = (v.label || 'The answer') + ' = ' + lib.show(v.target) + '. ' + (v.formula || '');
      var next = button('vgd-btn vgd-primary', last ? 'See how it went' : 'Next problem', advance);
      row.appendChild(next); try { next.focus(); } catch (e) { /* ignore */ }
    });
    input.addEventListener('keydown', function (e) { if (e.key === 'Enter' && !check.disabled) { e.preventDefault(); check.click(); } });
    row.appendChild(check); row.appendChild(skip); body.appendChild(row); body.appendChild(out);
    body.appendChild(el('p', 'vgd-hint', 'Decimals or fractions are accepted, for example 1.5 or 7/6.'));
    if (focus) try { input.focus({ preventScroll: true }); } catch (e) { /* ignore */ }
  }
  function advance() {
    var s = M.session; if (!s || s.closing) return;
    s.i++;
    if (s.i < s.items.length) { drawProblem(true); return; }
    end();
  }
  function end() {
    var s = M.session; if (!s || s.closing) return; s.closing = true; /* a second press does nothing */
    var events = finishRun(s.day), sum = summary(s.results);
    M.session = null;
    var f = frame('done'), body = f.body, top = el('p', 'vgd-text', endLine(sum) || 'Run finished.');
    top.tabIndex = -1; body.appendChild(top);
    var paid = events.filter(function (e) { return e && e.type === 'run'; });
    if (paid.length) body.appendChild(el('p', 'vgd-note', '+' + paid[0].dust + ' stardust for today’s first run.'));
    if (sum.revisit.length) {
      body.appendChild(el('p', 'vgd-note', 'Worth another look:'));
      var ul = el('ul', 'vgr-list');
      sum.revisit.forEach(function (x) { var li = el('li', null, x.title + (x.topic && x.topic !== x.title ? ' (' + x.topic + ')' : '') + ' · ' + realmName(x.realm)); ul.appendChild(li); });
      body.appendChild(ul);
      body.appendChild(el('p', 'vgd-hint', 'Open the realm and use a review drill on it, or try another run.'));
    }
    var row = el('div', 'vgd-actions');
    row.appendChild(button('vgd-btn vgd-primary', 'Another run', start));
    row.appendChild(button('vgd-btn', 'Done', drawIdle));
    body.appendChild(row);
    try { top.focus({ preventScroll: true }); } catch (e) { /* ignore */ }
    if (paid.length) { var UI = root.VGCollectionUI; try { if (UI && typeof UI.toast === 'function') UI.toast('+' + paid[0].dust + ' stardust · five-minute run'); } catch (e) { /* ignore */ } }
  }
  function refresh() { if (M && !M.session) drawIdle(); }
  function mount(host, opts) {
    if (!host) return;
    opts = opts || {};
    M = { host: host, heading: opts.heading === 'h3' ? 'h3' : 'h2', session: null };
    host.classList.add('vgd-slot');
    drawIdle();
  }
  API.mount = mount; API.refresh = refresh; API._finish = finishRun;
  if (typeof root.addEventListener === 'function') {
    root.addEventListener('storage', function (e) { if (!e.key || /^vector-guild-save/.test(e.key)) refresh(); });
    root.addEventListener('pageshow', function (e) { if (e.persisted) refresh(); });
  }
})(typeof window !== 'undefined' ? window : this);
