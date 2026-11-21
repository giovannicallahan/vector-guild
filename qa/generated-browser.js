/* Real-browser check of generated missions under several seeds: the three docking trials follow the
 * generated numbers, a fresh seeded save plays straight through, and the hands-on widgets mount.
 * Usage: node qa/generated-browser.js [screenshot-folder]   (needs Playwright) */
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');
const vm = require('vm');

(async () => {
  const root = path.resolve(__dirname, '../game');
  const shots = process.argv[2] || null;
  const w = {};
  for (const f of ['curriculum.js', 'extra-quests.js', 'chapters.js']) vm.runInNewContext(fs.readFileSync(root + '/' + f, 'utf8'), { window: w });
  const all = w.QUESTS.map(q => q.id);
  const b = await chromium.launch();
  const errs = [];
  const mk = async (seed, save) => {
    const c = await b.newContext({ viewport: { width: 360, height: 740 }, hasTouch: true, isMobile: true, reducedMotion: 'reduce' });
    await c.addInitScript(data => {
      window.VG_SEED = data.seed; window.VG_TEST = {};
      if (data.save && !localStorage.getItem('vector-guild-save-v1')) localStorage.setItem('vector-guild-save-v1', data.save);
    }, { seed, save: save ? JSON.stringify(save) : null });
    const p = await c.newPage();
    p.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
    p.on('pageerror', e => errs.push(e.message));
    await p.goto('file://' + root + '/index.html');
    await p.waitForTimeout(250);
    return p;
  };
  const openChapterOf = async (p, id) => {
    await p.evaluate(qid => { const d = document.querySelector(`[data-quest="${qid}"]`).closest('details'); d.open = true; }, id);
  };
  const solve = async (p, id, shot) => {
    await openChapterOf(p, id);
    await p.click(`[data-quest="${id}"]`);
    await p.click('#ready-top');
    const m = await p.evaluate(() => ({ prompt: window.VG_TEST.mission.prompt, answer: window.VG_TEST.mission.answer, generated: window.VG_TEST.mission.generated, params: window.VG_TEST.mission.params }));
    if (shot) { await p.evaluate(() => document.querySelector('#objective-heading').scrollIntoView()); if (shots) await p.screenshot({ path: `${shots}/${shot}.png` }); }
    for (let i = 0; i < m.answer.length; i++) await p.fill('#answer-' + i, String(m.answer[i]));
    await p.click('#submit-answer');
    await p.waitForFunction(() => /Mission complete|Practice complete/.test(document.querySelector('#mission-stage .feedback')?.textContent || ''), null, { timeout: 8000 });
    const text = await p.textContent('#mission-stage .feedback');
    const trial = await p.evaluate(() => document.querySelector('.flight-status')?.textContent || '');
    await p.evaluate(() => document.querySelector('#dialog .close').click());
    await p.waitForTimeout(150);
    return { id, generated: m.generated, params: m.params, prompt: m.prompt.slice(0, 90), answer: m.answer, result: text.slice(0, 40), trial };
  };

  // Three different seeds, each with every mission except the docking ones already solved.
  for (const seed of [31337, 2024, 7]) {
    for (const id of ['q01', 'q07', 'q48']) {
      const p = await mk(seed, { solved: all.filter(x => x !== id), tools: [], seed });
      const r = await solve(p, id, seed === 31337 ? 'gen-' + id : null);
      console.log(seed, JSON.stringify(r));
      if (!/Target reached/.test(r.trial)) throw Error(`docking trial did not hit for ${id} seed ${seed}: ${r.trial}`);
    }
  }
  // A fresh save with a random seed: play the first six missions straight through.
  let p = await mk(555);
  for (const id of ['q01', 'q02', 'q03', 'q04', 'q05', 'q06']) console.log('fresh', JSON.stringify(await solve(p, id)));
  console.log('state', await p.evaluate(() => { const s = JSON.parse(localStorage.getItem('vector-guild-save-v1')); return JSON.stringify({ solved: s.solved.length, xp: s.xp, clean: s.clean.length, seed: s.seed }); }));

  // Widgets in missions, and the notebook.
  p = await mk(555, { solved: all.slice(0, 40), tools: [], seed: 555, errors: { q18: { n: 3, last: Date.now() - 2 * 86400000, pit: { 0: 2, 1: 1 } }, q21: { n: 1, last: Date.now(), pit: {} } }, reviews: { q18: { n: 2, last: Date.now() - 86400000 }, q02: { n: 1, last: Date.now() - 3 * 86400000 } } });
  for (const id of ['q18', 'q21', 'q24']) {
    await openChapterOf(p, id);
    await p.click(`[data-quest="${id}"]`);
    await p.click('#ready-top');
    await p.evaluate(() => document.querySelector('#dialog .hands-on').scrollIntoView());
    await p.waitForTimeout(100);
    if (shots) await p.screenshot({ path: `${shots}/widget-${id}.png` });
    console.log(id, 'widget status:', (await p.textContent('#dialog .hands-on [role="status"]')).slice(0, 110));
    console.log(id, 'dialog overflow:', await p.evaluate(() => { const d = document.querySelector('dialog'); return d.scrollWidth > d.clientWidth + 1; }));
    await p.evaluate(() => document.querySelector('#dialog .close').click());
  }
  await p.evaluate(() => document.querySelector('.review-bar').scrollIntoView());
  if (shots) await p.screenshot({ path: `${shots}/review-bar.png` });
  await p.click('[data-view=guide]');
  if (shots) await p.screenshot({ path: `${shots}/notebook.png` });
  if (errs.length) throw Error('page errors: ' + errs.join(' | '));
  console.log('PASS: generated docking trials under three seeds, a seeded fresh save, hands-on widgets and the notebook.');
  await b.close();
})().catch(e => { console.error('FAIL', e.message); process.exitCode = 1; });
