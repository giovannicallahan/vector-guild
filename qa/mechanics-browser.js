/* Real DOM regression checks for Vector Guild flight, restoration, chapter, contract and review mechanics.
 * Requires Playwright. Set CHROMIUM_PATH to use a specific Chromium binary; otherwise Playwright's own is used. */
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const { chromium } = require('playwright');

const game = path.resolve(__dirname, '../game');
const key = 'vector-guild-save-v1';
const sourceWindow = {};
for (const file of ['curriculum.js', 'extra-quests.js', 'chapters.js']) {
  vm.runInNewContext(fs.readFileSync(path.join(game, file), 'utf8'), { window: sourceWindow });
}
const missions = sourceWindow.QUESTS;
const missionById = new Map(missions.map(q => [q.id, q]));
const server = http.createServer((req, res) => {
  const relative = decodeURIComponent(new URL(req.url, 'http://localhost').pathname).replace(/^\/+/, '');
  const file = path.resolve(game, relative || 'realm.html');
  if (file !== game && !file.startsWith(game + path.sep)) { res.writeHead(403).end(); return; }
  fs.readFile(file, (error, data) => {
    if (error) { res.writeHead(404).end(); return; }
    const type = file.endsWith('.js') ? 'text/javascript' : file.endsWith('.css') ? 'text/css' :
      file.endsWith('.jpg') ? 'image/jpeg' : 'text/html';
    res.setHeader('Content-Type', type); res.end(data);
  });
});

async function openMission(page, id) {
  await page.locator(`[data-quest="${id}"]`).click();
  await page.locator('#ready').click();
}
async function fillAnswers(page, values) {
  for (let i = 0; i < values.length; i++) await page.locator(`#answer-${i}`).fill(String(values[i]));
}
async function submitAndWait(page, message = 'Mission complete!') {
  await page.locator('#submit-answer').click();
  await page.waitForFunction(text => document.querySelector('.feedback')?.textContent.includes(text), message, { timeout: 6000 });
}
async function closeMission(page) {
  await page.locator('#dialog .close').click();
  await page.waitForFunction(() => !document.querySelector('#dialog').open);
  await page.waitForFunction(k => {
    const save = JSON.parse(localStorage.getItem(k) || '{}').realms?.la || {};
    const expected = ['q01','q02','q06'].filter(id => (save.solved || []).includes(id)).length;
    return document.querySelector('.vg-contracts [role="progressbar"]')?.getAttribute('aria-valuenow') === String(expected);
  }, 'vector-guild-save-v2');
}
async function solvedState(page) {
  return page.evaluate(k => JSON.parse(localStorage.getItem(k) || '{}').realms?.la || {}, 'vector-guild-save-v2');
}
async function seedPage(page, exceptId) {
  const solved = missions.map(q => q.id).filter(id => id !== exceptId);
  await page.addInitScript((data) => localStorage.setItem(data.key, JSON.stringify({ solved: data.solved, tools: [] })), { key, solved });
}

(async () => {
  await new Promise(resolve => server.listen(8771, '127.0.0.1', resolve));
  const browser = await chromium.launch({ headless: true, ...(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {}), args: ['--no-sandbox'] });
  // Seed 0 pins every mission to its authored numbers so the scripted answers stay valid; VG_TEST
  // makes the page publish the mission it is showing, which the practice and re-roll checks read.
  const newContext = async options => { const c = await browser.newContext(options); await c.addInitScript(() => { window.VG_SEED = 0; window.VG_TEST = {}; }); return c; };
  try {
    // Fresh profile: axis-by-axis near miss, pause/resume, observation-only replay,
    // corrected first solve, persisted reward, practice replay, then cargo restoration.
    const ctx = await newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
    const page = await ctx.newPage(); const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto('http://127.0.0.1:8771/realm.html');
    await openMission(page, 'q01');
    await fillAnswers(page, [2, 3.02, 2]);
    await page.locator('#submit-answer').click();
    assert.equal(await page.locator('#answer-0').isDisabled(), true, 'answer freezes during flight test');
    await page.locator('.flight-pause').click();
    assert.match(await page.locator('.flight-status').innerText(), /paused/i);
    await page.waitForTimeout(2000);
    assert.equal(await page.locator('#submit-answer').isDisabled(), true, 'paused trial does not time out');
    assert.equal((await solvedState(page)).xp || 0, 0, 'paused/incomplete test has no reward');
    await page.locator('.flight-pause').click();
    await page.locator('.flight-status').waitFor({ state: 'visible' });
    await page.waitForFunction(() => document.querySelector('.flight-status')?.textContent.includes('Trial complete.'));
    assert.match(await page.locator('.flight-mira').innerText(), /Y overshoots/);
    assert.doesNotMatch(await page.locator('.flight-mira').innerText(), /\d/, 'feedback gives direction only');
    assert.doesNotMatch(await page.locator('.flight-trial').innerText(), /\(2,\s*3,\s*2\)/, 'trial never prints the dock coordinates');
    const axes = await page.locator('.flight-axis > div').allInnerTexts();
    assert.match(axes[0], /X[\s\S]*2[\s\S]*on target/);
    assert.match(axes[1], /Y[\s\S]*3\.02[\s\S]*too high/);
    assert.match(axes[2], /Z[\s\S]*2[\s\S]*on target/);
    assert.equal((await solvedState(page)).solved?.includes('q01') || false, false, 'near-miss did not solve');
    await page.locator('.flight-replay').click();
    await page.waitForFunction(() => document.querySelector('.flight-status')?.textContent.includes('Trial complete.'));
    assert.equal((await solvedState(page)).xp || 0, 0, 'replay does not award XP');
    await page.locator('.flight-revise').click();
    assert.equal(await page.locator('#answer-0').isDisabled(), false, 'revise restores answer controls');
    await fillAnswers(page, [2, 3, 2]);
    await submitAndWait(page);
    const first = await solvedState(page);
    assert.ok(first.solved.includes('q01')); assert.equal(first.xp, missionById.get('q01').xp); assert.equal(first.points, 1);
    await closeMission(page);
    assert.match(await page.locator('.vg-contracts').innerText(), /1 \/ 3 systems restored/);
    await page.reload();
    assert.equal(await page.locator('#xp').innerText(), String(missionById.get('q01').xp), 'XP survives reload');
    await openMission(page, 'q01');
    assert.match(await page.locator('#mission-stage').innerText(), /Practice mode/);
    const practiceMission = await page.evaluate(() => ({ prompt: window.VG_TEST.mission.prompt, answer: window.VG_TEST.mission.answer, generated: window.VG_TEST.mission.generated }));
    assert.equal(practiceMission.generated, true, 'practice uses generated numbers');
    assert.ok((await page.locator('#mission-stage').innerText()).includes(practiceMission.prompt), 'the generated prompt is the one on screen');
    await fillAnswers(page, practiceMission.answer);
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await submitAndWait(page, 'Correct! Practice complete.');
    assert.equal((await solvedState(page)).xp, first.xp, 'practice replay gives no duplicate reward');
    await closeMission(page);

    // Linked restoration routes the q06 cargo job to its required q03 preparation,
    // then delivers cargo only after all three systems are installed.
    await page.locator('[data-ct-mission="q02"]').click();
    await page.locator('#ready').click(); await fillAnswers(page, missionById.get('q02').answer); await submitAndWait(page); await closeMission(page);
    assert.match(await page.locator('.vg-contracts').innerText(), /2 \/ 3 systems restored/);
    await page.locator('[data-ct-mission="q03"]').click();
    await page.locator('#ready').click(); await fillAnswers(page, missionById.get('q03').answer); await submitAndWait(page); await closeMission(page);
    await page.locator('[data-ct-mission="q06"]').click();
    await page.locator('#ready').click(); await fillAnswers(page, missionById.get('q06').answer); await submitAndWait(page); await closeMission(page);
    assert.match(await page.locator('.ct-scene').getAttribute('aria-label'), /3 of 3 systems restored\. Shuttle docked and cargo delivered/);
    assert.match(await page.locator('.ct-delivery').innerText(), /Cargo delivered/);
    const restored = await solvedState(page);
    assert.equal(restored.xp, ['q01','q02','q03','q06'].reduce((sum,id) => sum + missionById.get(id).xp, 0), 'cargo delivery adds no separate XP');
    assert.equal(restored.points, 4, 'cargo delivery adds no skill points');
    assert.deepEqual(errors, []);
    await ctx.close();

    // q07: Mira’s example completes before the student test; the demo alone
    // does not solve the mission or change rewards.
    const q07ctx = await newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, reducedMotion: 'reduce' });
    const q07page = await q07ctx.newPage(); await seedPage(q07page, 'q07');
    await q07page.goto('http://127.0.0.1:8771/realm.html');
    const q07Before = await solvedState(q07page);
    await openMission(q07page, 'q07');
    assert.match(await q07page.locator('.flight-status').innerText(), /Now you have the controls/);
    assert.equal((await solvedState(q07page)).xp, q07Before.xp, 'demonstration alone does not award progress');
    await fillAnswers(q07page, missionById.get('q07').answer); await submitAndWait(q07page);
    assert.ok((await solvedState(q07page)).solved.includes('q07'), 'student prediction completes q07');
    await q07ctx.close();

    // q48: transfer sequence remains optional and the homogeneous coordinate is tested.
    const q48ctx = await newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, reducedMotion: 'reduce' });
    const q48page = await q48ctx.newPage(); await seedPage(q48page, 'q48');
    await q48page.goto('http://127.0.0.1:8771/realm.html'); await openMission(q48page, 'q48');
    assert.equal(await q48page.locator('.flight-help[open]').count(), 0, 'Mira strategy starts optional and collapsed');
    await fillAnswers(q48page, missionById.get('q48').answer); await submitAndWait(q48page);
    const q48Axes = await q48page.locator('.flight-axis > div').allInnerTexts();
    assert.equal(q48Axes.length, 3, 'homogeneous frame uses X, Y and W coordinates');
    assert.match(q48Axes[2], /W[\s\S]*1[\s\S]*your W: on target/);
    assert.ok((await solvedState(q48page)).solved.includes('q48'));
    await q48ctx.close();

    // q29 unlocks optional allocation practice after its mission, which changes
    // no save rewards; feasibility, best-effort retention, and optimal effort work.
    const q29ctx = await newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, reducedMotion: 'reduce' });
    const q29page = await q29ctx.newPage(); await seedPage(q29page, 'q29');
    await q29page.goto('http://127.0.0.1:8771/realm.html');
    assert.match(await q29page.locator('.ct-allocation-locked').innerText(), /Complete q29/);
    await openMission(q29page, 'q29'); await fillAnswers(q29page, missionById.get('q29').answer); await submitAndWait(q29page);
    const rewardState = await solvedState(q29page);
    const challenge = q29page.locator('#dialog .vg-allocation');
    assert.equal(await challenge.count(), 1, 'optional challenge appears after q29 is completed');
    await challenge.locator('[data-ct-x]').fill('2'); await challenge.locator('[data-ct-y]').fill('3');
    await challenge.locator('[data-ct-allocation-form] button[type="submit"]').click();
    assert.match(await challenge.locator('[data-ct-feedback]').innerText(), /miss demand 10/);
    assert.equal(await challenge.locator('[data-ct-best]').innerText(), '—', 'infeasible trial leaves best unset');
    await challenge.locator('[data-ct-x]').fill('10'); await challenge.locator('[data-ct-y]').fill('0');
    await challenge.locator('[data-ct-allocation-form] button[type="submit"]').click();
    for (let i = 0; i < 10; i++) await challenge.locator('[data-ct-transfer]').click();
    assert.equal(await challenge.locator('[data-ct-x]').inputValue(), '5');
    assert.equal(await challenge.locator('[data-ct-y]').inputValue(), '5');
    assert.equal(await challenge.locator('[data-ct-effort]').innerText(), '50');
    assert.match(await challenge.locator('[data-ct-feedback]').innerText(), /unique minimum/);
    await challenge.locator('[data-ct-x]').fill('8'); await challenge.locator('[data-ct-y]').fill('2');
    await challenge.locator('[data-ct-allocation-form] button[type="submit"]').click();
    assert.equal(await challenge.locator('[data-ct-best]').innerText(), '50', 'worse design preserves the best effort');
    assert.equal((await solvedState(q29page)).xp, rewardState.xp, 'optional optimization adds no XP');
    assert.equal((await solvedState(q29page)).points, rewardState.points, 'optional optimization adds no skill points');
    assert.equal(await q29page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true, 'mobile layout has no horizontal overflow');
    await q29ctx.close();

    // Chapters, navigation, focus, review drill, contract board, landmarks and Back handling.
    const lateCtx = await newContext({ viewport: { width: 360, height: 740 }, isMobile: true, hasTouch: true, reducedMotion: 'reduce' });
    const late = await lateCtx.newPage(); const lateErrors = [];
    late.on('pageerror', error => lateErrors.push(error.message));
    late.on('console', message => { if (message.type() === 'error') lateErrors.push(message.text()); });
    const firstChapter = missions.filter(q => q.chapter === 0).map(q => q.id);
    const seeded = [...firstChapter, 'q10', 'q11', 'q43', 'q12', 'q13', 'q15', 'q18', 'q20'];
    await late.addInitScript(data => { if (!localStorage.getItem(data.key)) localStorage.setItem(data.key, JSON.stringify({ solved: data.solved, tools: [] })); }, { key, solved: seeded });
    await late.goto('http://127.0.0.1:8771/realm.html');
    assert.equal(await late.locator('details.chapter').count(), 8, 'eight chapters');
    assert.equal(await late.locator('details.chapter[open]').count(), 1, 'only the current chapter is open');
    assert.match(await late.locator('details.chapter[open] h3').innerText(), /Systems and spaces/);
    const navBoxes = await late.locator('nav .nav').evaluateAll(els => els.map(e => { const b = e.getBoundingClientRect(); return b.left >= 0 && b.right <= innerWidth && b.height >= 44; }));
    assert.deepEqual(navBoxes, Array(6).fill(true), 'all six sections are on screen and tappable at 360 px');
    assert.ok(await late.locator('#begin').evaluate(e => e.getBoundingClientRect().top + scrollY) < 740, 'the next-mission button is on the first screen');
    assert.equal(await late.locator('.outpost-status li').count(), 8, 'sector status is readable as text on a phone');
    // Focus returns to the card that opened a mission, and an untouched dialog does not rebuild the page.
    await late.locator('[data-quest="q14"]').click(); await late.locator('#dialog .close').click();
    assert.equal(await late.evaluate(() => document.activeElement?.dataset?.quest), 'q14', 'focus returns to the opening card');
    // The lesson paragraph is not printed twice, and Mira's briefing does not repeat it.
    await late.locator('[data-quest="q14"]').click();
    const lessonTexts = await late.locator('#mission-stage .teaching > p').allInnerTexts();
    assert.equal(new Set(lessonTexts).size, lessonTexts.length, 'no duplicated lesson paragraph');
    assert.ok(!(await late.locator('#mira-brief').innerText()).includes(missionById.get('q14').teaching.intuition), 'briefing does not repeat the lesson');
    await late.locator('#ready-top').click(); assert.equal(await late.locator('#answer-0').count(), 1, 'skip link opens the problem');
    // The in-mission labs open on practice numbers.
    await late.locator('#dialog .close').click();
    await late.locator('details.chapter').first().locator('summary').click(); // finished chapters start collapsed
    await late.locator('[data-quest="q01"]').click(); await late.locator('.mission-visual > summary').click();
    assert.doesNotMatch(await late.locator('.mission-visual .space-output').innerText(), /A\+B = \(2, 3, 2\)/, 'the 3D bench does not preload the q01 answer');
    await late.locator('#dialog .close').click();
    // Fractions are accepted, a miss lands in the notebook with its pitfall, and reveal re-rolls the numbers.
    await late.locator('[data-quest="q14"]').click(); await late.locator('#ready-top').click();
    const authored14 = missionById.get('q14').answer;
    await fillAnswers(late, [authored14[0], authored14[1], 5]); await late.locator('#submit-answer').click();
    assert.equal(await late.locator('.pit-chip').count(), missionById.get('q14').teaching.pitfalls.length, 'pitfall chips appear after a miss');
    await late.locator('.pit-chip').first().click();
    assert.equal(await late.locator('.pit-chip').first().getAttribute('aria-pressed'), 'true');
    await late.locator('#solution-btn').click();
    await late.locator('#dialog .close').click();
    const logged = await solvedState(late);
    assert.deepEqual([logged.errors.q14.n, logged.errors.q14.pit['0'], logged.rolls.q14], [1, 1, 1]);
    await late.locator('[data-quest="q14"]').click(); await late.locator('#ready-top').click();
    const rerolled = await late.evaluate(() => ({ prompt: window.VG_TEST.mission.prompt, answer: window.VG_TEST.mission.answer }));
    assert.notEqual(rerolled.prompt, missionById.get('q14').prompt, 'after a reveal the mission returns with new numbers');
    assert.equal(await late.locator('#answer-0').getAttribute('inputmode'), 'decimal');
    await late.locator('#fraction-keys').click();
    assert.equal(await late.locator('#answer-0').getAttribute('inputmode'), 'text', 'the / key can be switched on');
    const asFraction = x => Number.isInteger(x) ? `${x * 2}/2` : String(x);
    await fillAnswers(late, rerolled.answer.map(asFraction)); await submitAndWait(late);
    assert.ok((await solvedState(late)).solved.includes('q14'), 'a fraction answer on the new numbers solves the mission');
    await late.locator('#dialog .close').click();
    await late.locator('[data-view="guide"]').click();
    assert.match(await late.locator('.nb-entry').first().innerText(), /Q14[\s\S]*Missed 1 time[\s\S]*×1/);
    await late.locator('[data-drill="q14"]').click();
    assert.match(await late.locator('#dialog .eyebrow').innerText(), /Q14[\s\S]*YOUR CHOICE/);
    await late.locator('#dialog .close').click(); await late.locator('[data-view="campaign"]').click();
    // The hands-on widget is offered on its missions and nowhere else.
    await late.locator('details.chapter').nth(2).locator('summary').click(); // q18 lives in chapter 3, which starts collapsed
    await late.locator('[data-quest="q18"]').click(); await late.locator('#ready-top').click();
    assert.equal(await late.locator('#dialog .hands-on').count(), 1, 'q18 has a hands-on widget');
    await late.locator('#dialog [data-slider="s"]').focus(); await late.keyboard.press('ArrowRight');
    assert.match(await late.locator('#dialog .hands-on [role="status"]').innerText(), /P = /, 'the widget responds to its slider');
    await late.locator('#dialog .close').click();

    // Review drill: correct fresh-numbers answer is recorded once, with no XP.
    const before = await solvedState(late);
    await late.locator('#review').click();
    const drillText = await late.locator('#dialog .mission-panel').innerText();
    await late.locator('#review-check').click(); assert.match(await late.locator('#review-feedback').innerText(), /Enter a number/);
    await late.locator('#review-answer').fill('123456'); await late.locator('#review-check').click();
    assert.match(await late.locator('#review-feedback').innerText(), /Not quite/, drillText);
    await late.locator('#dialog .close').click();
    const afterMiss = await solvedState(late);
    assert.equal(afterMiss.xp, before.xp, 'a failed drill pays nothing');
    const missed = Object.keys(afterMiss.reviews).find(id => afterMiss.reviews[id].n === 0);
    assert.ok(missed && afterMiss.errors[missed].n >= 1, 'a failed drill is scheduled for tomorrow and logged in the notebook');
    // Contract board: c1 needs q13, q18, q20, all seeded, so its commissioning problem is open.
    assert.match(await late.locator('.board-card.is-open h3').innerText(), /Survey calibration/);
    await late.locator('[data-board-check="c1"]').click(); assert.match(await late.locator('[data-board-feedback="c1"]').innerText(), /Enter a number/);
    await late.locator('#board-c1-0').fill('6'); await late.locator('#board-c1-1').fill('1'); await late.locator('#board-c1-2').fill('1');
    await late.locator('[data-board-check="c1"]').click(); assert.match(await late.locator('[data-board-feedback="c1"]').innerText(), /residual/);
    await late.locator('#board-c1-1').fill('0'); await late.locator('[data-board-check="c1"]').click();
    const paid = await solvedState(late);
    assert.deepEqual(paid.contracts, ['c1']); assert.equal(paid.points, seeded.length + 1 + 3, 'a commissioned contract pays three skill points once');
    assert.equal(await late.locator('[data-board-check="c1"]').count(), 0);
    assert.match(await late.locator('.board-card').nth(1).innerText(), /0 \/ 3 MISSIONS/);
    // Landmark: chapter 1 is finished, so its blueprint can be bought for six points.
    await late.locator('[data-view="skills"]').click();
    await late.locator('[data-landmark="0"]').click();
    const built = await solvedState(late);
    assert.deepEqual(built.landmarks, [0]); assert.equal(built.points, paid.points - 6);
    assert.equal(await late.locator('[data-landmark="1"]').isDisabled(), true, 'unfinished chapters keep their landmark locked');
    // Android Back contract: dialog first, then campaign, then let the host exit.
    await late.locator('#help').click();
    assert.equal(await late.evaluate(() => window.VectorGuildBack()), true); assert.equal(await late.evaluate(() => document.querySelector('#dialog').open), false);
    assert.equal(await late.evaluate(() => window.VectorGuildBack()), true); assert.equal(await late.locator('#top-view').innerText(), 'CAMPAIGN');
    assert.equal(await late.evaluate(() => window.VectorGuildBack()), false);
    assert.match(await late.locator('.outpost-scene').first().getAttribute('aria-label'), /landmarks built: Beacon mast/);
    await late.locator('[data-view="visual"]').click(); await late.locator('.brand').click();
    assert.equal(await late.locator('#top-view').innerText(), 'CAMPAIGN', 'brand link returns to the campaign');
    assert.equal(await late.evaluate(() => location.hash), '', 'brand link adds no history entry');
    // Everything bought survives a reload through save normalization.
    await late.reload(); const reloaded = await solvedState(late);
    assert.deepEqual([reloaded.contracts, reloaded.landmarks, reloaded.points], [['c1'], [0], built.points]);
    for (const view of ['campaign', 'skills', 'workshop', 'artifacts', 'guide', 'visual']) {
      await late.locator(`[data-view="${view}"]`).click();
      assert.equal(await late.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 2), true, view + ': no horizontal overflow at 360 px');
    }
    assert.deepEqual(lateErrors, [], 'no console or page errors');
    await lateCtx.close();

    console.log('PASS: chapters, phone navigation, focus return, practice-number labs, review drill, contract board, landmarks, Back handling and reload.');
    console.log('PASS: q01 per-axis miss, pause/resume, no-reward replay, revise/correct first solve, persisted XP, practice replay, and 1→2→3 cargo restoration via q03 prerequisite; q07 example-to-student control; q48 optional strategy and homogeneous W; q29 gated optional optimization, infeasible rejection, transfer convergence, retained best, and no extra rewards.');
  } finally {
    await browser.close(); server.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
