/* Browser check for the hands-on widgets (game/handson.js). Requires Playwright.
 * Run: node qa/handson-browser.js
 * Optional: HANDSON_SHOTS=<dir> to choose where screenshots go. */
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const assert = require('node:assert/strict');
const { chromium } = require('playwright');

const game = path.resolve(__dirname, '../game');
const read = file => fs.readFileSync(path.join(game, file), 'utf8');
const shots = process.env.HANDSON_SHOTS ||
  path.resolve(__dirname, '../../../shots-handson');
let shotDir = shots;
try { fs.mkdirSync(shotDir, { recursive: true }); } catch (e) { shotDir = fs.mkdtempSync(path.join(os.tmpdir(), 'handson-')); }

const pageHtml = `<!doctype html><html><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<style>${read('styles.css')}</style><style>${read('handson.css')}</style>
<style>body{padding:16px}</style></head>
<body><main id="root"></main><script>${read('handson.js').replace(/<\/script/g, '<\\/script')}</script></body></html>`;

const fmt = (n, d = 2) => { const x = Number(n.toFixed(d)); return String(x === 0 ? 0 : x); };
const vec = v => '(' + v.map(x => fmt(x)).join(', ') + ')';

/* Each case: the params, the strings that would give the answer away, and how to solve it. */
const cases = [];
for (const [label, params] of [['default', undefined], ['other', { v: [-3, 5], u: [2, -1] }]]) {
  const { v, u } = params || { v: [4, 2], u: [1, 1] };
  const s = (v[0] * u[0] + v[1] * u[1]) / (u[0] * u[0] + u[1] * u[1]);
  const foot = [s * u[0], s * u[1]];
  cases.push({
    id: 'q18', label, params,
    secrets: [vec(foot), 'Perpendicular:'],
    solve: { s },
    expect: text => {
      assert.match(text, /Perpendicular: P is the projection of v/);
      assert.ok(text.includes('P = ' + vec(foot)), `status should show the foot ${vec(foot)}: ${text}`);
    }
  });
}
for (const [label, params] of [['default', undefined], ['other', { ys: [-2, 4, 1] }]]) {
  const { ys } = params || { ys: [1, 2, 2] };
  const b = (ys[2] - ys[0]) / 2;
  const a = (ys[0] + ys[1] + ys[2]) / 3 - b;
  const min = ys.reduce((sum, y, t) => sum + (y - a - b * t) ** 2, 0);
  cases.push({
    id: 'q21', label, params,
    secrets: [a.toFixed(3), min.toFixed(3), `y = ${fmt(a)} + ${fmt(b)}`],
    solve: { a, b },
    expect: text => {
      const m = /Sum of squared residuals: (-?\d+(?:\.\d+)?)\. Smallest so far: (-?\d+(?:\.\d+)?)/.exec(text);
      assert.ok(m, 'status should report the squared error: ' + text);
      assert.ok(Math.abs(Number(m[1]) - min) <= 0.01, `error ${m[1]} should be within 0.01 of ${min}`);
      assert.ok(Math.abs(Number(m[2]) - min) <= 0.01, `smallest so far ${m[2]} should be within 0.01 of ${min}`);
    }
  });
}
for (const [label, params] of [['default', undefined], ['other', { m: [2, 0, 1, -3], lam: 2 }]]) {
  const { m, lam } = params || { m: [3, 1, 0, 2], lam: 2 };
  // Eigenvector for lam from (A - lam I) v = 0, using whichever row is not zero.
  const r1 = [m[0] - lam, m[1]];
  const r2 = [m[2], m[3] - lam];
  const row = Math.hypot(...r1) > 1e-9 ? r1 : r2;
  const ev = [-row[1], row[0]];
  const theta = ((Math.round(Math.atan2(ev[1], ev[0]) * 180 / Math.PI) % 360) + 360) % 360;
  cases.push({
    id: 'q24', label, params,
    secrets: ['Eigen-direction', 'factor', 'lam', 'eigenvalue', 'eigenvector'],
    solve: { theta },
    expect: text => {
      const hit = /Eigen-direction found: A stretches this direction by a factor of about (-?\d+(?:\.\d+)?)/.exec(text);
      assert.ok(hit, 'status should report an eigen-direction: ' + text);
      assert.ok(Math.abs(Number(hit[1]) - lam) <= 0.1, `factor ${hit[1]} should be about ${lam}`);
    }
  });
}

async function setSlider(page, name, value) {
  await page.evaluate(([n, v]) => {
    const input = document.querySelector(`[data-slider="${n}"]`);
    input.value = String(v);
    input.dispatchEvent(new Event('input', { bubbles: true }));
  }, [name, value]);
}
const statusText = page => page.locator('.hands-on-status').textContent();

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 360, height: 740 }, hasTouch: true, isMobile: true, deviceScaleFactor: 2
  });
  let failed = 0;

  for (const c of cases) {
    const name = `${c.id} ${c.label}`;
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
    try {
      await page.setContent(pageHtml);
      const q = { id: c.id, params: c.params };

      // API shape, and the raw HTML string before anything is mounted.
      const raw = await page.evaluate(mission => {
        const H = window.HandsOn;
        return {
          supported: [H.supported(mission.id), H.supported('q01')],
          empty: H.html({ id: 'q01' }),
          nullMount: H.mount(document.body, { id: 'q01' }),
          html: H.html(mission),
          math: typeof H.math
        };
      }, q);
      assert.deepEqual(raw.supported, [true, false]);
      assert.equal(raw.empty, '');
      assert.equal(raw.nullMount, null);
      assert.equal(raw.math, 'object');
      assert.ok(raw.html.includes(`data-hands-on="${c.id}"`));
      assert.ok(!/\son[a-z]+\s*=/.test(raw.html), 'no inline event handlers');
      for (const secret of c.secrets) assert.ok(!raw.html.includes(secret), `initial HTML must not contain "${secret}"`);

      await page.evaluate(mission => {
        const root = document.getElementById('root');
        root.innerHTML = window.HandsOn.html(mission);
        window.controller = window.HandsOn.mount(root, mission);
      }, q);
      assert.equal(await page.evaluate(() => typeof window.controller.destroy), 'function');

      // Mounted start state: still no answer, readable status, labelled picture.
      const start = await page.evaluate(() => {
        const section = document.querySelector('.hands-on');
        const status = section.querySelector('[role="status"]');
        const svg = section.querySelector('svg');
        return {
          text: section.textContent, html: section.outerHTML, found: section.classList.contains('is-found'),
          live: status.getAttribute('aria-live'), status: status.textContent,
          svgRole: svg.getAttribute('role'), svgLabel: svg.getAttribute('aria-label')
        };
      });
      for (const secret of c.secrets) assert.ok(!start.html.includes(secret), `start state must not contain "${secret}"`);
      assert.equal(start.found, false, 'must not start at the answer');
      assert.equal(start.live, 'polite');
      assert.equal(start.svgRole, 'img');
      assert.equal(start.svgLabel, start.status, 'SVG label mirrors the status line');
      assert.match(start.text, /Explore here, then enter the exact values above/);

      // Layout: nothing wider than the phone, every control at least 44 px tall and labelled.
      const layout = await page.evaluate(() => {
        const section = document.querySelector('.hands-on');
        const controls = [...section.querySelectorAll('button, input')].map(el => ({
          tag: el.tagName + (el.dataset.slider || el.dataset.nudge || el.dataset.el || ''),
          h: el.getBoundingClientRect().height,
          right: el.getBoundingClientRect().right,
          labelled: !!(el.getAttribute('aria-label') || el.textContent.trim() ||
            (el.id && section.querySelector(`label[for="${el.id}"]`)))
        }));
        const handles = [...section.querySelectorAll('.hands-on-hit')].map(el => el.getBoundingClientRect().height);
        return {
          docWidth: document.documentElement.scrollWidth, winWidth: window.innerWidth,
          secScroll: section.scrollWidth, secClient: section.clientWidth,
          secRight: section.getBoundingClientRect().right, controls, handles,
          touchSvg: getComputedStyle(section.querySelector('svg')).touchAction,
          touchHandle: getComputedStyle(section.querySelector('.hands-on-handle')).touchAction
        };
      });
      assert.ok(layout.docWidth <= layout.winWidth, `page overflows: ${layout.docWidth} > ${layout.winWidth}`);
      assert.ok(layout.secScroll <= layout.secClient, 'section overflows horizontally');
      assert.ok(layout.secRight <= layout.winWidth);
      assert.ok(layout.controls.length >= 3);
      for (const k of layout.controls) {
        assert.ok(k.h >= 44, `${k.tag} is ${k.h}px tall`);
        assert.ok(k.right <= layout.winWidth, `${k.tag} sticks out`);
        assert.ok(k.labelled, `${k.tag} has no label`);
      }
      for (const h of layout.handles) assert.ok(h >= 44, `drag handle is ${h}px`);
      assert.equal(layout.touchHandle, 'none');
      assert.notEqual(layout.touchSvg, 'none', 'the picture itself must still let the page scroll');
      if (c.label === 'default') await page.locator('.hands-on').screenshot({ path: path.join(shotDir, `${c.id}-start.png`) });

      // Dragging a handle moves the matching slider.
      const firstSlider = Object.keys(c.solve)[0];
      const before = await page.locator(`[data-slider="${firstSlider}"]`).inputValue();
      const handle = page.locator('.hands-on-handle').first();
      await handle.scrollIntoViewIfNeeded();
      const box = await handle.boundingBox();
      const cx = box.x + box.width / 2;
      const cy = box.y + box.height / 2;
      await page.mouse.move(cx, cy);
      await page.mouse.down();
      await page.mouse.move(cx + 30, cy - 45, { steps: 4 });
      await page.mouse.up();
      const after = await page.locator(`[data-slider="${firstSlider}"]`).inputValue();
      assert.notEqual(after, before, 'dragging the handle should change the slider');

      // Nudge buttons step the slider by exactly one step.
      const stepInfo = await page.evaluate(n => {
        const input = document.querySelector(`[data-slider="${n}"]`);
        const v0 = parseFloat(input.value);
        document.querySelector(`[data-nudge="${n}"][data-dir="1"]`).click();
        return { v0, v1: parseFloat(input.value), step: parseFloat(input.step) };
      }, firstSlider);
      assert.ok(Math.abs(stepInfo.v1 - stepInfo.v0 - stepInfo.step) < 1e-6, 'nudge moves one step');

      // Drive the sliders to the right place and read the status line.
      for (const [slider, value] of Object.entries(c.solve)) await setSlider(page, slider, value);
      const solved = await statusText(page);
      c.expect(solved);
      if (c.id !== 'q21') {
        assert.ok(await page.evaluate(() => document.querySelector('.hands-on').classList.contains('is-found')));
      }
      await page.locator('.hands-on').screenshot({ path: path.join(shotDir, `${c.id}-${c.label}-solved.png`) });

      if (c.id === 'q21') {
        await page.locator('.hands-on-reset').click();
        const reset = await statusText(page);
        assert.ok(!reset.includes(solved.split('Smallest')[0]), 'Reset moves the line back');
      }

      // After destroy() the controls no longer drive the widget.
      await page.evaluate(() => window.controller.destroy());
      const frozen = await statusText(page);
      await setSlider(page, firstSlider, stepInfo.v0);
      assert.equal(await statusText(page), frozen, 'destroy() removes listeners');

      assert.deepEqual(errors, [], 'page errors');
      console.log(`PASS ${name}: ${solved}`);
    } catch (error) {
      failed++;
      console.error(`FAIL ${name}: ${error.message}`);
      if (errors.length) console.error('  page errors: ' + errors.join(' | '));
    }
    await page.close();
  }

  await browser.close();
  console.log(failed ? `${failed} check(s) failed` : `PASS all ${cases.length} hands-on checks. Screenshots: ${shotDir}`);
  process.exit(failed ? 1 : 0);
})().catch(error => { console.error(error); process.exit(1); });
