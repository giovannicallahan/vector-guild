/* Data and inference practice missions, file 7 of 8: concepts q31–q35, three practice missions each
   (q31b q31c q31d q32b q32c q32d q33b q33c q33d q34b q34c q34d q35b q35c q35d).
   Format and rules: docs/PACK-FORMAT.md, "Practice missions" (§10).
     b  kind 'setting'    the same skill in a new real-world setting
     c  kind 'applied'    a word problem with two or three steps (two or three guided steps)
     d  kind 'challenge'  harder numbers, or the skill combined with one earlier concept (optional `uses: 'qNN'`)
   A practice mission supplies only: id, parent, kind, title, brief, prompt, answer, labels, tolerance, hints,
   solution, guidance (and `uses` for a challenge). Everything else comes from its parent, the learn mission:
   topic, tier, xp, sector, lesson, teaching, sources, the concept bench and the review drill. Do not write those.
   Each mission is registered together with its generator by add(mission, generator); build(canonical) must
   reproduce the authored prompt, hints, solution and guidance exactly. Oracles: qa/realms/stats/oracle-p7.js. */
(function(){
'use strict';
const G = window.Gen, { n, plus, par } = G;
const PRACTICE = window.PRACTICE = window.PRACTICE || [];
const GEN = window.MISSION_GEN = window.MISSION_GEN || {};
/* Registers one practice mission and its generator {canonical, draw(R), build(p)}. */
const add = (mission, generator) => { PRACTICE.push(mission); GEN[mission.id] = generator; };


/* Builds the authored mission from build(canonical), so the authored text and the generator can never drift apart.
   meta: id, parent, kind, title, brief, labels, tolerance, gl (labels of each guided step), uses (optional). */
const mk = (meta, gen) => {
 const b = gen.build(gen.canonical), { gl, ...m } = meta;
 add({ ...m, prompt: b.prompt, answer: b.answer, hints: b.hints, solution: b.solution,
  guidance: b.guidance.map((g, i) => ({ prompt: g.prompt, answer: g.answer, labels: gl[i], explanation: g.explanation })) }, gen);
};

/* Small helpers. list: "3, 6, 8"; sum; r2: round to 2 decimals; r1: round to 1 decimal; tie1: a value whose second decimal
   is exactly 5 once written to 2 places (a rounding tie at 1 decimal); shuffle; andList: "3, 6 and 8". */
const list = xs => xs.map(n).join(', ');
const sum = xs => xs.reduce((s, x) => s + x, 0);
const r2 = x => Math.round(x * 100 + (x >= 0 ? 1e-9 : -1e-9)) / 100;
const r1 = x => Math.round(x * 10 + (x >= 0 ? 1e-9 : -1e-9)) / 10;
const tie1 = x => Math.abs(Math.abs(x * 10) % 1 - 0.5) < 1e-6;
const shuffle = (R, xs) => { const a = xs.slice(); for (let i = a.length - 1; i > 0; i--) { const j = R.int(0, i); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const andList = xs => xs.length < 2 ? xs.map(n).join('') : xs.slice(0, -1).map(n).join(', ') + ' and ' + n(xs[xs.length - 1]);
/* The line "a + bx" written with the sign of b outside the number (b is never 1 or −1, so no "1x"). */
const lineTxt = (a, b) => `${n(a)} ${b < 0 ? '−' : '+'} ${n(Math.abs(b))}x`;
/* Least-squares fit through the points (xs, ys): means, deviations, products and sums; the slope and intercept are kept
   to 6 places so that float noise can never show. */
const fit = (xs, ys) => { const N = xs.length, sx = sum(xs), sy = sum(ys), xb = sx / N, yb = sy / N, dx = xs.map(x => x - xb), dy = ys.map(y => y - yb),
 pr = dx.map((d, i) => d * dy[i]), sq = dx.map(d => d * d), sxy = sum(pr), sxx = sum(sq), b = Math.round(sxy / sxx * 1e6) / 1e6, a = Math.round((yb - b * xb) * 1e6) / 1e6;
 return { N, sx, sy, xb, yb, dx, dy, pr, sq, sxy, sxx, b, a }; };
/* 95% critical values of the sample correlation coefficient r, df 4 to 13 (OpenStax Introductory Statistics 2e, 12.6). */
const RCRIT = { 4: 0.811, 5: 0.754, 6: 0.707, 7: 0.666, 8: 0.632, 9: 0.602, 10: 0.576, 11: 0.555, 12: 0.532, 13: 0.514 };
const rTable = `Table of 95% critical values of r: ${Object.keys(RCRIT).map(k => `df ${k}, ${n(RCRIT[k])}`).join('; ')}.`;

/* ---- q31 The least-squares line: slope and intercept [12.3] ---- */

/* Parent worked example: x = 2 to 6 hours, y = 5, 9, 10, 14, 17 (b = 2.9). Five mornings with x = c … c + 4, so
   Σ(x − x̄)² is always 10; the outputs add to a multiple of 5, so ȳ is whole and a has at most one decimal. The line
   falls (more crews, fewer minutes), the slope is never −1, the intercept is never 0, and every time is positive. */
mk({
 id: 'q31b', parent: 'q31', kind: 'setting', title: 'Crews against the dust',
 brief: 'Dust builds up on the array overnight, and the cleaning rota needs a rule for how many crews to send out.',
 labels: ['slope b', 'intercept a'], tolerance: 0.005,
 gl: [['x̄ (crews)', 'ȳ (minutes)'], ['Σ(x − x̄)(y − ȳ)', 'Σ(x − x̄)²'], ['slope b', 'intercept a']]
}, {
 canonical: { c: 3, y: [59, 53, 50, 47, 41] },
 draw: R => { for (;;) { const c = R.int(1, 6), b0 = R.int(-5, -2), a0 = R.int(55, 80), y = [0, 1, 2, 3, 4].map(i => a0 + b0 * (c + i) + R.int(-2, 2));
   y[2] += (5 - sum(y) % 5) % 5; const L = fit([0, 1, 2, 3, 4].map(i => c + i), y); if (L.b >= 0 || L.b === -1 || L.a === 0 || y.some(v => v < 5)) continue; return { c, y }; } },
 build: ({ c, y }) => { const xs = [0, 1, 2, 3, 4].map(i => c + i), L = fit(xs, y); return {
  prompt: `The farm sent cleaning crews to the array on five mornings. Crews sent x: ${list(xs)}. Minutes needed to clear the dust from the whole array y: ${list(y)}. Find the least-squares line ŷ = a + bx. Enter the slope b, then the intercept a. Both come out exact, with at most one decimal place.`,
  answer: [L.b, L.a],
  hints: ['Start with the two means, x̄ and ȳ. Then write each morning’s x − x̄ and y − ȳ side by side and multiply them.', 'The slope is b = Σ(x − x̄)(y − ȳ) ÷ Σ(x − x̄)². The intercept is a = ȳ − b × x̄. When y falls as x grows, the slope is negative: keep its minus sign when you work out a.'],
  solution: `x̄ = ${n(L.sx)} ÷ 5 = ${n(L.xb)} and ȳ = ${n(L.sy)} ÷ 5 = ${n(L.yb)}. The deviations x − x̄ are ${list(L.dx)}, and y − ȳ are ${list(L.dy)}. Their products are ${list(L.pr)}, so Σ(x − x̄)(y − ȳ) = ${n(L.sxy)}, and Σ(x − x̄)² = 4 + 1 + 0 + 1 + 4 = 10. The slope is b = ${n(L.sxy)} ÷ 10 = ${n(L.b)} minutes per crew: each extra crew saves ${n(-L.b)} minutes. The intercept is a = ${n(L.yb)} − ${par(L.b)} × ${n(L.xb)} = ${n(L.yb)} − ${par(L.b * L.xb)} = ${n(L.a)}. The line is ŷ = ${lineTxt(L.a, L.b)}.`,
  guidance: [
   { prompt: 'Add the crews and the minutes, and divide each total by 5. What are x̄ and ȳ?', answer: [L.xb, L.yb], explanation: `x̄ = ${n(L.sx)} ÷ 5 = ${n(L.xb)} and ȳ = ${n(L.sy)} ÷ 5 = ${n(L.yb)}.` },
   { prompt: `The deviations x − x̄ are ${list(L.dx)}, and y − ȳ are ${list(L.dy)}. What are Σ(x − x̄)(y − ȳ) and Σ(x − x̄)²?`, answer: [L.sxy, 10], explanation: `Multiply the deviations morning by morning: ${list(L.pr)}. They add to ${n(L.sxy)}. The squares of x − x̄ are 4, 1, 0, 1, 4, which add to 10.` },
   { prompt: 'Divide to get the slope b, then use a = ȳ − b × x̄. What are b and a?', answer: [L.b, L.a], explanation: `b = ${n(L.sxy)} ÷ 10 = ${n(L.b)} and a = ${n(L.yb)} − ${par(L.b)} × ${n(L.xb)} = ${n(L.a)}, so ŷ = ${lineTxt(L.a, L.b)}.` }
  ] }; }
});

/* Five days with x = c … c + 4 hours of sunlight, a rising line, then a prediction at x1 inside the five hours and its
   value at p credits a kWh. Not the parent's worked example (c = 2, y = 5, 9, 10, 14, 17). The slope is never 1, the
   intercept never 0, and the prediction is positive. */
mk({
 id: 'q31c', parent: 'q31', kind: 'applied', title: 'Pricing tomorrow’s sunlight',
 brief: 'The grid desk will quote a price for tomorrow’s power, and it needs a forecast built from the farm’s own records.',
 labels: ['slope b', 'intercept a', 'predicted output (kWh)', 'predicted payment (credits)'], tolerance: 0.005,
 gl: [['x̄ (hours)', 'ȳ (kWh)', 'Σ(x − x̄)(y − ȳ)'], ['slope b', 'intercept a'], ['predicted output (kWh)', 'payment (credits)']]
}, {
 canonical: { c: 4, y: [17, 19, 25, 28, 31], x1: 7, p: 4 },
 draw: R => { for (;;) { const c = R.int(3, 8), b0 = R.int(2, 5), a0 = R.int(0, 12), y = [0, 1, 2, 3, 4].map(i => a0 + b0 * (c + i) + R.int(-3, 3));
   y[2] += (5 - sum(y) % 5) % 5; const q = { c, y, x1: R.int(c, c + 4), p: R.pick([2, 3, 4, 5, 6, 8]) }, L = fit([0, 1, 2, 3, 4].map(i => c + i), y);
   if (L.b <= 0 || L.b === 1 || L.a === 0 || L.a + L.b * q.x1 <= 0) continue; return q; } },
 build: ({ c, y, x1, p }) => { const xs = [0, 1, 2, 3, 4].map(i => c + i), L = fit(xs, y), f = Math.round((L.a + L.b * x1) * 1e6) / 1e6, pay = Math.round(f * p * 1e6) / 1e6; return {
  prompt: `The grid desk pays the farm ${n(p)} credits for every kWh it delivers, and wants to price tomorrow’s power in advance. The farm’s records for five days give hours of sunlight x: ${list(xs)} and power output y in kWh: ${list(y)}. Find the least-squares line ŷ = a + bx, with a and b exact to at most one decimal place. Tomorrow’s forecast is ${n(x1)} hours of sunlight. Enter the slope b, then the intercept a, then the output in kWh that the line predicts for tomorrow, then the payment in credits for that predicted output.`,
  answer: [L.b, L.a, f, pay],
  hints: ['Find x̄ and ȳ, then the products (x − x̄)(y − ȳ). The slope is their sum divided by Σ(x − x̄)², and the intercept is a = ȳ − b × x̄.', 'To predict, put tomorrow’s hours into the line: ŷ = a + b × x. The payment is the predicted kWh times the price for one kWh.'],
  solution: `x̄ = ${n(L.sx)} ÷ 5 = ${n(L.xb)} and ȳ = ${n(L.sy)} ÷ 5 = ${n(L.yb)}. The deviations x − x̄ are ${list(L.dx)} and y − ȳ are ${list(L.dy)}, with products ${list(L.pr)}, so Σ(x − x̄)(y − ȳ) = ${n(L.sxy)} and Σ(x − x̄)² = 10. The slope is b = ${n(L.sxy)} ÷ 10 = ${n(L.b)} and the intercept is a = ${n(L.yb)} − ${n(L.b)} × ${n(L.xb)} = ${n(L.a)}, so ŷ = ${lineTxt(L.a, L.b)}. For ${n(x1)} hours the line predicts ŷ = ${n(L.a)} + ${n(L.b)} × ${n(x1)} = ${n(L.a)} + ${n(L.b * x1)} = ${n(f)} kWh. At ${n(p)} credits a kWh the payment is ${n(f)} × ${n(p)} = ${n(pay)} credits.`,
  guidance: [
   { prompt: `Add the hours and the outputs, divide each total by 5, and multiply the deviations. The deviations x − x̄ are ${list(L.dx)} and y − ȳ are ${list(L.dy)}. What are x̄, ȳ and Σ(x − x̄)(y − ȳ)?`, answer: [L.xb, L.yb, L.sxy], explanation: `x̄ = ${n(L.sx)} ÷ 5 = ${n(L.xb)} and ȳ = ${n(L.sy)} ÷ 5 = ${n(L.yb)}. The products are ${list(L.pr)}, which add to ${n(L.sxy)}.` },
   { prompt: 'Σ(x − x̄)² is 10, because the five hours are one apart. Find the slope b and the intercept a = ȳ − b × x̄.', answer: [L.b, L.a], explanation: `b = ${n(L.sxy)} ÷ 10 = ${n(L.b)} and a = ${n(L.yb)} − ${n(L.b)} × ${n(L.xb)} = ${n(L.a)}, so ŷ = ${lineTxt(L.a, L.b)}.` },
   { prompt: `Put x = ${n(x1)} into your line. What output does it predict, and what is that worth at ${n(p)} credits a kWh?`, answer: [f, pay], explanation: `ŷ = ${n(L.a)} + ${n(L.b)} × ${n(x1)} = ${n(f)} kWh, and ${n(f)} × ${n(p)} = ${n(pay)} credits.` }
  ] }; }
});

/* Six runs at uneven hours x (the hours add to a multiple of 6, so x̄ is whole), the outputs also add to a multiple of 6,
   and the slope divides out to at most two decimals, so a has at most two decimals as well. Found by trial from
   y = a0 + b0 x plus a little scatter. */
mk({
 id: 'q31d', parent: 'q31', kind: 'challenge', title: 'The uneven charging runs',
 brief: 'The battery hall ran six charging tests of different lengths, and Mira wants one rule for the energy stored.',
 labels: ['slope b', 'intercept a'], tolerance: 0.005,
 gl: [['x̄ (hours)', 'ȳ (kWh)'], ['Σ(x − x̄)(y − ȳ)', 'Σ(x − x̄)²'], ['slope b', 'intercept a']]
}, {
 canonical: { x: [3, 5, 6, 7, 9, 12], y: [20, 32, 37, 40, 54, 69] },
 draw: R => { for (;;) { const xs = []; while (xs.length < 6) { const v = R.int(2, 14); if (!xs.includes(v)) xs.push(v); } xs.sort((a, b) => a - b);
   const b0 = R.int(2, 6), a0 = R.int(0, 12), y = xs.map(x => a0 + b0 * x + R.int(-3, 3)); if (sum(xs) % 6 || sum(y) % 6) continue;
   const L = fit(xs, y); if ((100 * L.sxy) % L.sxx !== 0 || L.b <= 0 || L.b === 1 || L.a === 0) continue; return { x: xs, y }; } },
 build: ({ x, y }) => { const L = fit(x, y); return {
  prompt: `The battery hall ran six charging tests. Hours charged x: ${list(x)}. Energy stored y in kWh: ${list(y)}. Find the least-squares line ŷ = a + bx. The hours are not evenly spaced, so work out x − x̄ for every test. Enter the slope b, then the intercept a. Both come out exact, with at most two decimal places.`,
  answer: [L.b, L.a],
  hints: ['Find x̄ and ȳ first, then x − x̄ and y − ȳ for every test. This time Σ(x − x̄)² is not a fixed number: square the six deviations and add them.', 'Divide the sum of the products Σ(x − x̄)(y − ȳ) by Σ(x − x̄)² to get the slope, then use a = ȳ − b × x̄.'],
  solution: `x̄ = ${n(L.sx)} ÷ 6 = ${n(L.xb)} and ȳ = ${n(L.sy)} ÷ 6 = ${n(L.yb)}. The deviations x − x̄ are ${list(L.dx)}, and y − ȳ are ${list(L.dy)}. Their products are ${list(L.pr)}, so Σ(x − x̄)(y − ȳ) = ${n(L.sxy)}. The squares of x − x̄ are ${list(L.sq)}, so Σ(x − x̄)² = ${n(L.sxx)}. The slope is b = ${n(L.sxy)} ÷ ${n(L.sxx)} = ${n(L.b)} kWh per hour of charging. The intercept is a = ${n(L.yb)} − ${n(L.b)} × ${n(L.xb)} = ${n(L.yb)} − ${n(L.b * L.xb)} = ${n(L.a)}. The line is ŷ = ${lineTxt(L.a, L.b)}.`,
  guidance: [
   { prompt: 'Add the hours and the energies, and divide each total by 6. What are x̄ and ȳ?', answer: [L.xb, L.yb], explanation: `x̄ = ${n(L.sx)} ÷ 6 = ${n(L.xb)} and ȳ = ${n(L.sy)} ÷ 6 = ${n(L.yb)}.` },
   { prompt: `The deviations x − x̄ are ${list(L.dx)}, and y − ȳ are ${list(L.dy)}. What are Σ(x − x̄)(y − ȳ) and Σ(x − x̄)²?`, answer: [L.sxy, L.sxx], explanation: `The products are ${list(L.pr)}, which add to ${n(L.sxy)}. The squares of x − x̄ are ${list(L.sq)}, which add to ${n(L.sxx)}.` },
   { prompt: 'Divide to get the slope b, then use a = ȳ − b × x̄. What are b and a?', answer: [L.b, L.a], explanation: `b = ${n(L.sxy)} ÷ ${n(L.sxx)} = ${n(L.b)} and a = ${n(L.yb)} − ${n(L.b)} × ${n(L.xb)} = ${n(L.a)}, so ŷ = ${lineTxt(L.a, L.b)}.` }
  ] }; }
});

/* ---- q32 Prediction, residuals and extrapolation [12.3, 12.5] ---- */

/* Parent worked example: ŷ = 2 + 1.5x fitted to 2 to 8 hours (never drawn). The line is ŷ = a + bx with a to one decimal
   and b a multiple of 0.1 (never 1), x whole, so every prediction and residual has at most one decimal. The new day
   lies inside the fitted range or outside it (above or below), never on its edge; the recorded day's residual is never 0. */
mk({
 id: 'q32b', parent: 'q32', kind: 'setting', title: 'The dust-loss forecast',
 brief: 'The cleaning rota wants to know how much power a dusty array will lose, and whether one odd day was worse than the line expects.',
 labels: ['residual (kWh)', 'predicted loss (kWh)', '1 interpolation, 0 extrapolation'], tolerance: 0.005,
 gl: [['predicted loss (kWh)'], ['ŷ for the recorded day (kWh)', 'residual (kWh)'], ['1 inside, 0 outside']]
}, {
 canonical: { a: 3.4, b: 1.6, lo: 2, hi: 9, x1: 12, x2: 5, y2: 12.6 },
 draw: R => { let p; do { const lo = R.int(3, 5), hi = lo + R.int(6, 9), a = R.int(5, 95) / 10, b = R.except(5, 35, [10]) / 10;
   const x1 = R.bool() ? R.int(lo + 1, hi - 1) : R.bool() ? hi + R.int(1, 4) : R.int(2, lo - 1);
   let x2 = R.int(lo, hi); if (x2 === x1) x2 = x2 === hi ? lo : x2 + 1;
   p = { a, b, lo, hi, x1, x2, y2: Math.round((a + b * x2 + R.nz(-30, 30) / 10) * 10) / 10 }; } while (p.a === 2 && p.b === 1.5); return p; },
 build: ({ a, b, lo, hi, x1, x2, y2 }) => { const f = x => Math.round((a + b * x) * 10) / 10, y1 = f(x1), yh = f(x2), res = Math.round((y2 - yh) * 10) / 10, inside = x1 >= lo && x1 <= hi ? 1 : 0; return {
  prompt: `Dust cuts the farm’s power. The least-squares line ŷ = ${n(a)} + ${n(b)}x predicts the power lost to dust, in kWh, from x, the number of days since the panels were last cleaned. It was fitted to records from days ${n(lo)} to ${n(hi)} after a cleaning. A recorded day, ${n(x2)} days after a cleaning, lost ${n(y2)} kWh. Enter that day’s residual, then the loss the line predicts ${n(x1)} days after a cleaning, then 1 if that prediction is an interpolation (inside the fitted range) or 0 if it is an extrapolation (outside it).`,
  answer: [res, y1, inside],
  hints: ['To predict, put the number of days into the line: ŷ = a + b × x. A residual is the observed y minus the predicted ŷ at the same x, so use the recorded day’s own number of days.', 'A prediction is an interpolation when its x lies between the smallest and the largest x the line was fitted to, and an extrapolation when it lies outside that range.'],
  solution: `For the recorded day, ŷ = ${n(a)} + ${n(b)} × ${n(x2)} = ${n(a)} + ${n(b * x2)} = ${n(yh)} kWh, so the residual is ${n(y2)} − ${n(yh)} = ${n(res)} kWh: the day lost ${res > 0 ? 'more' : 'less'} than the line predicts. For the new prediction, ŷ = ${n(a)} + ${n(b)} × ${n(x1)} = ${n(a)} + ${n(b * x1)} = ${n(y1)} kWh. ${inside ? `${n(x1)} days lies inside the fitted range from ${n(lo)} to ${n(hi)} days, so the prediction is an interpolation: enter 1.` : `${n(x1)} days lies outside the fitted range from ${n(lo)} to ${n(hi)} days, so the prediction is an extrapolation: enter 0. Nobody has checked the line there, so trust it less.`}`,
  guidance: [
   { prompt: `Put x = ${n(x1)} into ŷ = ${n(a)} + ${n(b)}x. What loss does the line predict?`, answer: [y1], explanation: `${n(b)} × ${n(x1)} = ${n(b * x1)}, and ${n(a)} + ${n(b * x1)} = ${n(y1)} kWh.` },
   { prompt: `The recorded day had x = ${n(x2)} and y = ${n(y2)}. What is the predicted ŷ for that day, and the residual y − ŷ?`, answer: [yh, res], explanation: `ŷ = ${n(a)} + ${n(b)} × ${n(x2)} = ${n(yh)}, and the residual is observed minus predicted: ${n(y2)} − ${n(yh)} = ${n(res)}.` },
   { prompt: `The line was fitted to days ${n(lo)} to ${n(hi)} after a cleaning. Enter 1 if ${n(x1)} days is inside that range (interpolation), 0 if it is outside (extrapolation).`, answer: [inside], explanation: inside ? `${n(x1)} is between ${n(lo)} and ${n(hi)}, so this is an interpolation.` : `${n(x1)} is not between ${n(lo)} and ${n(hi)}, so this is an extrapolation.` }
  ] }; }
});

/* A forecast for two days that both lie inside the fitted range (so no extrapolation here), with the first day's real
   output, which differs from its forecast by a non-zero multiple of 0.1. The line is never the parent's example. */
mk({
 id: 'q32c', parent: 'q32', kind: 'applied', title: 'The grid desk’s two-day forecast',
 brief: 'The grid desk needs a forecast for the next two days, and a check on how far the first day’s real output was from it.',
 labels: ['forecast, day 1 (kWh)', 'forecast, day 2 (kWh)', 'forecast total (kWh)', 'residual, day 1 (kWh)'], tolerance: 0.005,
 gl: [['forecast, day 1 (kWh)', 'forecast, day 2 (kWh)'], ['forecast total (kWh)'], ['residual, day 1 (kWh)']]
}, {
 canonical: { a: 6.2, b: 2.7, lo: 4, hi: 11, x1: 6, x2: 9, y1: 21.5 },
 draw: R => { let p; do { const lo = R.int(3, 5), hi = lo + R.int(5, 8), a = R.int(5, 95) / 10, b = R.except(15, 45, [20, 30, 40]) / 10, x1 = R.int(lo, hi);
   let x2 = R.int(lo, hi); if (x2 === x1) x2 = x2 === hi ? lo : x2 + 1;
   p = { a, b, lo, hi, x1, x2, y1: Math.round((a + b * x1 + R.nz(-30, 30) / 10) * 10) / 10 }; } while (p.a === 2 && p.b === 1.5); return p; },
 build: ({ a, b, lo, hi, x1, x2, y1 }) => { const f = x => Math.round((a + b * x) * 10) / 10, f1 = f(x1), f2 = f(x2), tot = Math.round((f1 + f2) * 10) / 10, res = Math.round((y1 - f1) * 10) / 10; return {
  prompt: `The grid desk uses the farm’s least-squares line ŷ = ${n(a)} + ${n(b)}x, where x is the hours of sunlight in a day and ŷ is the predicted power output in kWh. The line was fitted to days with ${n(lo)} to ${n(hi)} hours of sunlight. The next two days are forecast to have ${n(x1)} hours and ${n(x2)} hours, both inside that range. The desk wants the forecast for each day and the forecast total. Later, the first day’s real output turned out to be ${n(y1)} kWh. Enter the forecast for day 1, the forecast for day 2, the forecast total for the two days, then the residual for day 1.`,
  answer: [f1, f2, tot, res],
  hints: ['Put each day’s hours into the line, one at a time: ŷ = a + b × x. The forecast total is the two forecasts added.', 'A residual is observed minus predicted, y − ŷ. The observed value is what the day really produced; the predicted value is the day’s forecast.'],
  solution: `Day 1: ŷ = ${n(a)} + ${n(b)} × ${n(x1)} = ${n(a)} + ${n(b * x1)} = ${n(f1)} kWh. Day 2: ŷ = ${n(a)} + ${n(b)} × ${n(x2)} = ${n(a)} + ${n(b * x2)} = ${n(f2)} kWh. The forecast total is ${n(f1)} + ${n(f2)} = ${n(tot)} kWh. Day 1 really produced ${n(y1)} kWh, so its residual is ${n(y1)} − ${n(f1)} = ${n(res)} kWh: the day produced ${res > 0 ? 'more' : 'less'} than forecast.`,
  guidance: [
   { prompt: `Put x = ${n(x1)} and then x = ${n(x2)} into ŷ = ${n(a)} + ${n(b)}x. What are the two forecasts?`, answer: [f1, f2], explanation: `${n(a)} + ${n(b)} × ${n(x1)} = ${n(f1)} and ${n(a)} + ${n(b)} × ${n(x2)} = ${n(f2)}.` },
   { prompt: `The forecasts are ${n(f1)} kWh and ${n(f2)} kWh. What is the forecast total for the two days?`, answer: [tot], explanation: `${n(f1)} + ${n(f2)} = ${n(tot)} kWh.` },
   { prompt: `Day 1 really produced ${n(y1)} kWh, and its forecast was ${n(f1)} kWh. What is the residual y − ŷ?`, answer: [res], explanation: `Observed minus predicted: ${n(y1)} − ${n(f1)} = ${n(res)} kWh.` }
  ] }; }
});

/* Mixes q31: five days with x = c … c + 4, fitted by hand (exact to one decimal as in q31), then a prediction at a day
   x1 that is inside the five x values half the time and outside (above or below) otherwise, the residual of the
   recorded day with xr hours (never 0), and the interpolation flag. The slope is never 1, the intercept never 0. */
mk({
 id: 'q32d', parent: 'q32', kind: 'challenge', uses: 'q31', title: 'Reaching past the battery trials',
 brief: 'The battery hall has five test days on record, and the planners want a line from them and a prediction for a day nobody tested.',
 labels: ['slope b', 'intercept a', 'predicted energy (kWh)', 'residual (kWh)', '1 interpolation, 0 extrapolation'], tolerance: 0.005,
 gl: [['x̄ (hours)', 'ȳ (kWh)', 'Σ(x − x̄)(y − ȳ)'], ['slope b', 'intercept a'], ['predicted energy (kWh)', 'residual (kWh)', '1 inside, 0 outside']]
}, {
 canonical: { c: 4, y: [20, 22, 28, 31, 34], x1: 11, xr: 5 },
 draw: R => { for (;;) { const c = R.int(4, 8), b0 = R.int(2, 5), a0 = R.int(0, 12), y = [0, 1, 2, 3, 4].map(i => a0 + b0 * (c + i) + R.int(-3, 3));
   y[2] += (5 - sum(y) % 5) % 5; const r = R.int(0, 3), x1 = r < 2 ? R.int(c + 1, c + 3) : r === 2 ? c + 4 + R.int(1, 3) : c - R.int(1, 2), q = { c, y, x1, xr: R.int(c, c + 4) }, L = fit([0, 1, 2, 3, 4].map(i => c + i), y);
   if (L.b <= 0 || L.b === 1 || L.a === 0 || Math.round((y[q.xr - c] - (L.a + L.b * q.xr)) * 10) === 0) continue; return q; } },
 build: ({ c, y, x1, xr }) => { const xs = [0, 1, 2, 3, 4].map(i => c + i), L = fit(xs, y), f = x => Math.round((L.a + L.b * x) * 10) / 10, pr = f(x1), yr = y[xr - c], hr = f(xr), res = Math.round((yr - hr) * 10) / 10, inside = x1 >= c && x1 <= c + 4 ? 1 : 0; return {
  prompt: `The battery hall tested its energy store on five days. Hours of charging x: ${list(xs)}. Energy stored y in kWh: ${list(y)}. Find the least-squares line ŷ = a + bx; a and b come out exact, with at most one decimal place. Then use your line: enter the slope b, the intercept a, the energy it predicts for a new day with ${n(x1)} hours of charging, the residual for the tested day with ${n(xr)} hours, then 1 if the new day’s prediction is an interpolation (inside the range of the five tested hours) or 0 if it is an extrapolation.`,
  answer: [L.b, L.a, pr, res, inside],
  hints: ['Build the line as before: x̄ and ȳ, the products (x − x̄)(y − ȳ), then b = Σ(x − x̄)(y − ȳ) ÷ Σ(x − x̄)² and a = ȳ − b × x̄.', 'Predict by putting the hours into your line. A residual is observed minus predicted at the same x. An x outside the range of the tested hours makes the prediction an extrapolation.'],
  solution: `x̄ = ${n(L.sx)} ÷ 5 = ${n(L.xb)} and ȳ = ${n(L.sy)} ÷ 5 = ${n(L.yb)}. The products of the deviations are ${list(L.pr)}, so Σ(x − x̄)(y − ȳ) = ${n(L.sxy)} and Σ(x − x̄)² = 10. The slope is b = ${n(L.sxy)} ÷ 10 = ${n(L.b)} and the intercept is a = ${n(L.yb)} − ${n(L.b)} × ${n(L.xb)} = ${n(L.a)}, so ŷ = ${lineTxt(L.a, L.b)}. For the new day, ŷ = ${n(L.a)} + ${n(L.b)} × ${n(x1)} = ${n(L.a)} + ${n(L.b * x1)} = ${n(pr)} kWh. For the tested day with ${n(xr)} hours, ŷ = ${n(L.a)} + ${n(L.b)} × ${n(xr)} = ${n(hr)} kWh, and it stored ${n(yr)} kWh, so the residual is ${n(yr)} − ${n(hr)} = ${n(res)} kWh. The tested hours run from ${n(c)} to ${n(c + 4)}, so ${n(x1)} hours is ${inside ? 'inside the range, an interpolation: enter 1.' : 'outside the range, an extrapolation: enter 0. The line has not been checked there.'}`,
  guidance: [
   { prompt: `Find x̄ and ȳ, then multiply the deviations. The deviations x − x̄ are ${list(L.dx)} and y − ȳ are ${list(L.dy)}. What are x̄, ȳ and Σ(x − x̄)(y − ȳ)?`, answer: [L.xb, L.yb, L.sxy], explanation: `x̄ = ${n(L.sx)} ÷ 5 = ${n(L.xb)} and ȳ = ${n(L.sy)} ÷ 5 = ${n(L.yb)}. The products are ${list(L.pr)}, which add to ${n(L.sxy)}.` },
   { prompt: 'Σ(x − x̄)² is 10, because the five hours are one apart. Find the slope b and the intercept a = ȳ − b × x̄.', answer: [L.b, L.a], explanation: `b = ${n(L.sxy)} ÷ 10 = ${n(L.b)} and a = ${n(L.yb)} − ${n(L.b)} × ${n(L.xb)} = ${n(L.a)}, so ŷ = ${lineTxt(L.a, L.b)}.` },
   { prompt: `Put x = ${n(x1)} into your line. Then find the residual for the tested day with x = ${n(xr)} and y = ${n(yr)}. Last, enter 1 if ${n(x1)} lies inside the tested hours ${n(c)} to ${n(c + 4)}, 0 if not. What are the predicted energy, the residual and the flag?`, answer: [pr, res, inside], explanation: `ŷ at ${n(x1)} hours is ${n(pr)} kWh. At ${n(xr)} hours the line gives ${n(hr)}, so the residual is ${n(yr)} − ${n(hr)} = ${n(res)}. ${n(x1)} is ${inside ? 'between' : 'not between'} ${n(c)} and ${n(c + 4)}, so the flag is ${inside}.` }
  ] }; }
});

/* ---- q33 r²: the share of variation explained [12.3] ---- */

/* r = r100 ÷ 100 with |r| from 0.30 to 0.98 (never 0.6, the parent's worked example). r100 never ends in 5, so the
   unexplained percentage never sits on a rounding tie at 1 decimal. r² is exact to 4 decimals. */
mk({
 id: 'q33b', parent: 'q33', kind: 'setting', title: 'What the cloud log explains',
 brief: 'The farm logs two numbers every day, and Mira wants to know how much of one the other can account for.',
 labels: ['r²', 'unexplained (%)'], tolerance: 0.00005,
 gl: [['r²'], ['explained (%)'], ['unexplained (%)']]
}, {
 canonical: { r100: -74 },
 draw: R => { let v; do { v = R.int(30, 98); } while (v % 10 === 5 || v === 60); return { r100: R.bool() ? v : -v }; },
 build: ({ r100 }) => { const r = r100 / 100, sq = r100 * r100 / 10000, pc = r100 * r100 / 100, rest = Math.round((100 - pc) * 100) / 100, u1 = Math.round(rest * 10) / 10,
  what = r > 0 ? { pair: 'afternoon temperature at the array and the energy the cooling pumps used that day', y: 'the pumps’ daily energy use' } : { pair: 'hours of heavy cloud in a day and the energy the farm’s batteries stored that day', y: 'the energy stored each day' }; return {
  prompt: `Over many days the farm recorded the ${what.pair} and found the correlation coefficient r = ${n(r)}. The best-fit straight line through these points explains part of the variation in ${what.y}. Enter r², written in full as a decimal, then the percentage of that variation which the line leaves unexplained, rounded to 1 decimal place.`,
  answer: [sq, u1],
  hints: ['Square r, which means multiplying it by itself. A negative r gives a positive r².', 'Turn r² into the percentage the line explains by multiplying by 100. The share it leaves unexplained is 100% minus that.'],
  solution: `r² = ${par(r)}² = ${n(sq)}, so the line explains ${n(pc)}% of the variation. The rest, 100 − ${n(pc)} = ${n(rest)}%, is left unexplained, which is ${(u1).toFixed(1)}% to 1 decimal place.`,
  guidance: [
   { prompt: `What is r² for r = ${n(r)}? Give it in full.`, answer: [sq], explanation: `${par(r)} × ${par(r)} = ${n(sq)}. Squaring removes the minus sign, if there is one.` },
   { prompt: `Multiply r² by 100. What percentage of the variation does the line explain?`, answer: [pc], explanation: `${n(sq)} × 100 = ${n(pc)}%.` },
   { prompt: 'What percentage of the variation is left unexplained, rounded to 1 decimal place?', answer: [u1], explanation: `100 − ${n(pc)} = ${n(rest)}%, which is ${(u1).toFixed(1)}% to 1 decimal place.` }
  ] }; }
});

/* r = ±m ÷ 10 (m = 3 to 9, never 6), the total variation T = 100k in square kWh, so the explained part m²k and the
   unexplained part (100 − m²)k are whole numbers below 1000. */
mk({
 id: 'q33c', parent: 'q33', kind: 'applied', title: 'Dust and the lost kilowatt-hours',
 brief: 'The cleaning budget depends on how much of the daily swing in power the dust accounts for, in kilowatt-hours rather than percentages.',
 labels: ['r²', 'explained (kWh²)', 'unexplained (kWh²)'], tolerance: 0.005,
 gl: [['r²'], ['explained (kWh²)'], ['unexplained (kWh²)']]
}, {
 canonical: { m: 7, neg: 1, k: 4 },
 draw: R => { let m; do { m = R.int(3, 9); } while (m === 6); return { m, neg: R.int(0, 1), k: R.int(2, 9) }; },
 build: ({ m, neg, k }) => { const r = (neg ? -m : m) / 10, sq = m * m / 100, T = 100 * k, ex = m * m * k, un = (100 - m * m) * k,
  what = neg ? 'power output' : 'power lost'; return {
  prompt: `Over many days the farm plotted the thickness of dust on its panels against the ${what} that day, and found the correlation coefficient r = ${n(r)}. The total variation in the daily ${what}, measured as the sum of the squared gaps of the daily values from their mean, is ${n(T)} square kWh (kWh²). The share of this total that the best-fit straight line explains is r². Enter r², then the part of the total variation the line explains, then the part it leaves unexplained, both in kWh².`,
  answer: [sq, ex, un],
  hints: ['Square r first; a negative r gives a positive r². Then r² is a share of the total variation, so multiply the total by it to get the part the line explains.', 'The explained and unexplained parts add up to the total variation.'],
  solution: `r² = ${par(r)}² = ${n(sq)}. The line explains ${n(sq)} × ${n(T)} = ${n(ex)} kWh². The rest, ${n(T)} − ${n(ex)} = ${n(un)} kWh², is left unexplained.`,
  guidance: [
   { prompt: `What is r² for r = ${n(r)}?`, answer: [sq], explanation: `${par(r)} × ${par(r)} = ${n(sq)}.` },
   { prompt: `r² = ${n(sq)} is the share of the total variation, ${n(T)} kWh², that the line explains. What part is that in kWh²?`, answer: [ex], explanation: `${n(sq)} × ${n(T)} = ${n(ex)} kWh².` },
   { prompt: `The line explains ${n(ex)} kWh² out of ${n(T)} kWh². How much does it leave unexplained?`, answer: [un], explanation: `${n(T)} − ${n(ex)} = ${n(un)} kWh².` }
  ] }; }
});

/* Five days of (hours of sunlight, output), distinct whole hours from 1 to 12 in order, from a rising or falling line with a
   little scatter; r² between 0.30 and 0.97, never on a rounding tie at 1 decimal. Not the parent's worked example, and not
   q30's. Uses q30: r² = top² ÷ (A × B), with the top and the two sums of squares worked as q30 teaches, so no square root. */
const corr5 = pts => { const xs = pts.map(q => q[0]), ys = pts.map(q => q[1]), sx = sum(xs), sy = sum(ys), sxx = sum(xs.map(x => x * x)), syy = sum(ys.map(y => y * y)), sxy = sum(pts.map(q => q[0] * q[1])),
 top = 5 * sxy - sx * sy, A = 5 * sxx - sx * sx, B = 5 * syy - sy * sy, pct = top * top * 100 / (A * B); return { sx, sy, sxx, syy, sxy, top, A, B, pct, p1: r1(pct), u1: r1(100 - pct) }; };
mk({
 id: 'q33d', parent: 'q33', kind: 'challenge', uses: 'q30', title: 'The share of the swing, from raw readings',
 brief: 'Mira has only the raw log of five days, and wants to know how much of the swing in output the sunlight line accounts for.',
 labels: ['explained (%)', 'unexplained (%)'], tolerance: 0.005,
 gl: [['Σx', 'Σy', 'Σx²', 'Σy²', 'Σxy'], ['top', 'A', 'B'], ['explained (%)', 'unexplained (%)']]
}, {
 canonical: { pts: [[2, 9], [4, 12], [5, 17], [8, 18], [10, 27]] },
 draw: R => { let pts, C; do { const xs = []; while (xs.length < 5) { const v = R.int(1, 12); if (!xs.includes(v)) xs.push(v); } xs.sort((a, b) => a - b);
   const b0 = R.nz(-3, 3), a0 = b0 > 0 ? R.int(1, 8) : R.int(30, 40); pts = xs.map(x => [x, a0 + b0 * x + R.int(-4, 4)]); C = corr5(pts); }
  while (pts.some(q => q[1] < 1) || C.A <= 0 || C.B <= 0 || C.pct < 30 || C.pct > 97 || tie1(C.pct)); return { pts }; },
 build: ({ pts }) => { const C = corr5(pts), { sx, sy, sxx, syy, sxy, top, A, B, pct, p1, u1 } = C; return {
  prompt: `Mira’s logbook lists five days as (hours of sunlight x, power output y in MWh): ${pts.map(q => `(${n(q[0])}, ${n(q[1])})`).join(', ')}. For n = 5 points, r = top ÷ √(A × B), where top = nΣxy − ΣxΣy, A = nΣx² − (Σx)² and B = nΣy² − (Σy)². Squaring gives r² = top² ÷ (A × B), so no square root is needed. Enter the percentage of the variation in output that the best-fit straight line explains, then the percentage it leaves unexplained, both rounded to 1 decimal place. Round only at the end.`,
  answer: [p1, u1],
  hints: ['Tabulate the five sums first: Σx, Σy, Σx², Σy² and Σxy. Then work out top, A and B. A negative top is fine, because it is squared.', 'Divide top² by A × B to get r², then multiply by 100 for the percentage explained. The unexplained share is 100% minus that.'],
  solution: `Σx = ${n(sx)}, Σy = ${n(sy)}, Σx² = ${n(sxx)}, Σy² = ${n(syy)} and Σxy = ${n(sxy)}. top = 5 × ${n(sxy)} − ${n(sx)} × ${n(sy)} = ${n(top)}, A = 5 × ${n(sxx)} − ${n(sx)}² = ${n(A)} and B = 5 × ${n(syy)} − ${n(sy)}² = ${n(B)}. So r² = ${par(top)}² ÷ (${n(A)} × ${n(B)}) = ${n(top * top)} ÷ ${n(A * B)} ≈ ${n(Math.round(pct * 1e4) / 1e6)}. The line explains ${(p1).toFixed(1)}% of the variation to 1 decimal place and leaves ${n(u1)}% unexplained.`,
  guidance: [
   { prompt: 'What are Σx, Σy, Σx², Σy² and Σxy? Type each number in full, without commas inside it.', answer: [sx, sy, sxx, syy, sxy], explanation: `Σx = ${pts.map(q => n(q[0])).join(' + ')} = ${n(sx)}; Σy = ${pts.map(q => n(q[1])).join(' + ')} = ${n(sy)}; Σx² = ${pts.map(q => n(q[0] * q[0])).join(' + ')} = ${n(sxx)}; Σy² = ${pts.map(q => n(q[1] * q[1])).join(' + ')} = ${n(syy)}; Σxy = ${pts.map(q => n(q[0] * q[1])).join(' + ')} = ${n(sxy)}.` },
   { prompt: `What are top = 5Σxy − ΣxΣy, A = 5Σx² − (Σx)² and B = 5Σy² − (Σy)²? Type each number in full, without commas inside it.`, answer: [top, A, B], explanation: `top = 5 × ${n(sxy)} − ${n(sx)} × ${n(sy)} = ${n(top)}; A = 5 × ${n(sxx)} − ${n(sx * sx)} = ${n(A)}; B = 5 × ${n(syy)} − ${n(sy * sy)} = ${n(B)}.` },
   { prompt: `r² = top² ÷ (A × B). Work it out, multiply by 100, and round to 1 decimal place. What percentages does the line explain and leave unexplained?`, answer: [p1, u1], explanation: `r² = ${n(top * top)} ÷ ${n(A * B)} ≈ ${n(Math.round(pct * 1e4) / 1e6)}, so the line explains ${n(p1)}% and leaves 100 − ${n(Math.round(pct * 1e4) / 1e4)} ≈ ${n(u1)}% unexplained.` }
  ] }; }
});

/* ---- q34 Testing r, and outliers from a line [12.4, 12.6] ---- */

/* Residuals in tenths of a kWh that add to 0 (as least-squares residuals do), in a shuffled order. The standard deviation
   s is printed to 2 decimals and 2s is worked from that printed s. spike: one residual of 3.5 to 6 kWh is planted. */
const makeRes = (R, N, spike) => { for (;;) { const res = []; for (let i = 0; i < N - 1; i++) res.push(R.int(-22, 22));
 if (spike) res[R.int(0, N - 2)] = (R.bool() ? 1 : -1) * R.int(35, 60);
 const last = -sum(res); if (Math.abs(last) > 30) continue; res.push(last); return shuffle(R, res); } };
const resid = ({ N, res }) => { const v = res.map(x => x / 10), sse = sum(res.map(x => x * x)) / 100, s = r2(Math.sqrt(sse / (N - 2))), two = r2(2 * s), out = v.filter(x => Math.abs(x) > two); return { v, s, two, out }; };
/* A correlation whose r² as a percentage would sit on a rounding tie at 1 decimal: |100r| ends in 5. */
const r100Tie = v => Math.abs(v) % 10 === 5;
/* True when no residual lies within 0.15 of 2s and |r| is at least 0.02 from the critical value, so neither answer turns on a rounding. */
const clear = ({ N, r100, res }) => { const S = resid({ N, res }); return S.s > 0 && !S.v.some(x => Math.abs(Math.abs(x) - S.two) < 0.15) && Math.abs(Math.abs(r100) / 100 - RCRIT[N - 2]) >= 0.02; };
const sigTxt = (r, crit, N, sig) => sig ? `r = ${n(r)} is ${r > 0 ? `above ${n(crit)}` : `below −${n(crit)}`}, so r is significant: enter 1.` : `r = ${n(r)} lies between −${n(crit)} and ${n(crit)}, so r is not significant: enter 0. A correlation this size could easily happen by chance with ${n(N)} points.`;
const outTxt = S => S.out.length === 0 ? `No residual is further than ${n(S.two)} from 0, so no day is an outlier.` : S.out.length === 1 ? `Only the residual ${n(S.out[0])} is further than ${n(S.two)} from 0, so 1 day is an outlier.` : `The residuals ${andList(S.out)} are further than ${n(S.two)} from 0, so ${n(S.out.length)} days are outliers.`;
const outWhy = S => S.out.length === 0 ? 'No residual is beyond it in either direction.' : `Beyond it in either direction: ${andList(S.out)}.`;

/* N = 7 to 14 days (df 5 to 12, inside the printed table). Not the parent's worked example (12 points, r = −0.81). */
mk({
 id: 'q34b', parent: 'q34', kind: 'setting', title: 'Battery hall: pattern or fluke?',
 brief: 'The battery hall seems to follow the weather, and the council wants to know whether that is a real pattern and whether any day was odd.',
 labels: ['critical value', '1 significant, 0 not', 'outliers'], tolerance: 0.0005,
 gl: [['df', 'critical value'], ['1 significant, 0 not'], ['2s (kWh)', 'outliers']]
}, {
 canonical: { N: 9, r100: -58, res: [8, -12, 5, -9, 40, -6, 3, -14, -15] },
 draw: R => { let p; do { const N = R.int(7, 14), r100 = R.int(40, 95); p = { N, r100: R.bool() ? r100 : -r100, res: makeRes(R, N, R.bool()) }; } while (!clear(p) || (p.N === 12 && p.r100 === -81)); return p; },
 build: p => { const S = resid(p), r = p.r100 / 100, df = p.N - 2, crit = RCRIT[df], sig = Math.abs(r) > crit ? 1 : 0, cnt = S.out.length,
  pair = r > 0 ? 'afternoon temperature in the battery hall and the energy the batteries lost overnight' : 'hours of heavy cloud in a day and the energy the batteries stored that day'; return {
  prompt: `The battery hall’s log covers ${n(p.N)} days. The farm fitted a least-squares line to its records of the ${pair} and found r = ${n(r)}. The ${n(p.N)} residuals, in kWh, are ${list(S.v)}. Their standard deviation about the line is s = ${n(S.s)} kWh. ${rTable} Enter the critical value of r that applies to these days, then 1 if r is significant at the 5% level or 0 if not, then the number of days that are outliers by the two-standard-deviation rule (a residual more than 2s from 0, above or below).`,
  answer: [crit, sig, cnt],
  hints: ['The test of r has the number of points minus 2 degrees of freedom. Read the critical value from that row of the table.', 'r is significant when it is above the critical value or below its negative. A day is an outlier when its residual is more than 2s above or below 0.'],
  solution: `df = ${n(p.N)} − 2 = ${n(df)}, and the table gives the critical value ${n(crit)} for df ${n(df)}. ${sigTxt(r, crit, p.N, sig)} For outliers, 2s = 2 × ${n(S.s)} = ${n(S.two)} kWh. ${outTxt(S)} Enter ${n(cnt)}.`,
  guidance: [
   { prompt: 'How many degrees of freedom does the test of r have, and what critical value does the table give for them?', answer: [df, crit], explanation: `df = ${n(p.N)} − 2 = ${n(df)}, and the row for df ${n(df)} reads ${n(crit)}.` },
   { prompt: `Compare r = ${n(r)} with ${n(crit)} and −${n(crit)}. Enter 1 if r is significant, 0 if not.`, answer: [sig], explanation: sig ? `r is ${r > 0 ? `above ${n(crit)}` : `below −${n(crit)}`}, so it is significant.` : `r lies between −${n(crit)} and ${n(crit)}, so it is not significant.` },
   { prompt: 'What is 2s, and how many residuals are further than 2s from 0?', answer: [S.two, cnt], explanation: `2 × ${n(S.s)} = ${n(S.two)}. ${outWhy(S)}` }
  ] }; }
});

/* As q34b, but one residual is planted so that one to three days are outliers, and each costs c crew-hours. */
mk({
 id: 'q34c', parent: 'q34', kind: 'applied', title: 'The inspection budget',
 brief: 'The council will only trust the line if its pattern is real, and every odd day must be inspected, so it needs the budget for the crew.',
 labels: ['critical value', '1 significant, 0 not', 'days to inspect', 'crew-hours'], tolerance: 0.0005,
 gl: [['df', 'critical value'], ['1 significant, 0 not', '2s (kWh)'], ['days to inspect', 'crew-hours']]
}, {
 canonical: { N: 11, r100: 77, res: [5, -7, 3, -4, 6, -2, 45, -8, 4, -3, -39], c: 3 },
 draw: R => { let p; do { const N = R.int(8, 14), r100 = R.int(40, 95); p = { N, r100: R.bool() ? r100 : -r100, res: makeRes(R, N, true), c: R.int(2, 6) }; } while (!clear(p) || resid(p).out.length < 1 || resid(p).out.length > 3); return p; },
 build: p => { const S = resid(p), r = p.r100 / 100, df = p.N - 2, crit = RCRIT[df], sig = Math.abs(r) > crit ? 1 : 0, cnt = S.out.length, hrs = cnt * p.c,
  pair = r > 0 ? 'wind speed over the array and the energy the cooling pumps used that day' : 'thickness of dust on the panels and the energy the farm delivered that day'; return {
  prompt: `The council will only use the farm’s line for forecasts if r is significant at the 5% level. Separately, every outlier day, by the two-standard-deviation rule (a residual more than 2s from 0, above or below), must be inspected by hand, at ${n(p.c)} crew-hours a day. The farm fitted a least-squares line to its records of the ${pair} over ${n(p.N)} days and found r = ${n(r)}. The ${n(p.N)} residuals, in kWh, are ${list(S.v)}. Their standard deviation about the line is s = ${n(S.s)} kWh. ${rTable} Enter the critical value of r for these days, then 1 if r is significant or 0 if not, then the number of days to inspect, then the total crew-hours the inspections need.`,
  answer: [crit, sig, cnt, hrs],
  hints: ['Find the degrees of freedom, the number of points minus 2, and read the critical value from that row. r is significant when it is above that value or below its negative.', 'A day to inspect has a residual more than 2s from 0, in either direction. The crew-hours are the number of days times the crew-hours for one day.'],
  solution: `df = ${n(p.N)} − 2 = ${n(df)}, and the table gives ${n(crit)}. ${sigTxt(r, crit, p.N, sig)} Next, 2s = 2 × ${n(S.s)} = ${n(S.two)} kWh. ${outTxt(S)} The inspections need ${n(cnt)} × ${n(p.c)} = ${n(hrs)} crew-hours.`,
  guidance: [
   { prompt: 'How many degrees of freedom does the test of r have, and what critical value does the table give for them?', answer: [df, crit], explanation: `df = ${n(p.N)} − 2 = ${n(df)}, and the row for df ${n(df)} reads ${n(crit)}.` },
   { prompt: `Compare r = ${n(r)} with ${n(crit)} and −${n(crit)}: enter 1 if r is significant, 0 if not. Then work out 2s from s = ${n(S.s)}.`, answer: [sig, S.two], explanation: `${sig ? `r is ${r > 0 ? `above ${n(crit)}` : `below −${n(crit)}`}, so it is significant` : `r lies between −${n(crit)} and ${n(crit)}, so it is not significant`}. 2 × ${n(S.s)} = ${n(S.two)}.` },
   { prompt: `How many residuals are further than ${n(S.two)} from 0, and what is the total crew-hours at ${n(p.c)} crew-hours a day?`, answer: [cnt, hrs], explanation: `${outWhy(S)} That is ${n(cnt)} ${cnt === 1 ? 'day' : 'days'}, and ${n(cnt)} × ${n(p.c)} = ${n(hrs)} crew-hours.` }
  ] }; }
});

/* Uses q33: besides the test of r and the outliers, the share of the variation the line explains, to 1 decimal place.
   r100 never ends in 5, so r² as a percentage never sits on a rounding tie. */
mk({
 id: 'q34d', parent: 'q34', kind: 'challenge', uses: 'q33', title: 'Strong, but how much does it explain?',
 brief: 'The council has a pattern in the storage records, and asks whether it is real and how much of the day-to-day swing it really accounts for.',
 labels: ['critical value', '1 significant, 0 not', 'explained (%)', 'outliers'], tolerance: 0.0005,
 gl: [['df', 'critical value'], ['1 significant, 0 not', 'explained (%)'], ['2s (kWh)', 'outliers']]
}, {
 canonical: { N: 12, r100: 86, res: [4, -6, 19, -3, 7, -10, 2, -5, 6, -4, -1, -9] },
 draw: R => { let p; do { const N = R.int(8, 14), r100 = R.int(40, 95); p = { N, r100: R.bool() ? r100 : -r100, res: makeRes(R, N, R.bool()) }; } while (!clear(p) || r100Tie(p.r100) || (p.N === 12 && p.r100 === -81)); return p; },
 build: p => { const S = resid(p), r = p.r100 / 100, df = p.N - 2, crit = RCRIT[df], sig = Math.abs(r) > crit ? 1 : 0, cnt = S.out.length, pc = p.r100 * p.r100 / 100, p1 = r1(pc),
  pair = r > 0 ? 'hours of sunlight in a day and the energy stored in the battery bank that day' : 'time since the panels were last cleaned and the farm’s power output that day'; return {
  prompt: `The farm fitted a least-squares line to its records of the ${pair} over ${n(p.N)} days and found r = ${n(r)}. The ${n(p.N)} residuals, in kWh, are ${list(S.v)}. Their standard deviation about the line is s = ${n(S.s)} kWh. ${rTable} Enter the critical value of r for these days, then 1 if r is significant at the 5% level or 0 if not, then the percentage of the variation in the daily figure that the line explains, rounded to 1 decimal place, then the number of days that are outliers by the two-standard-deviation rule (a residual more than 2s from 0, above or below).`,
  answer: [crit, sig, p1, cnt],
  hints: ['The test of r has the number of points minus 2 degrees of freedom. r is significant when it is above the critical value for that row or below its negative.', 'The share of the variation the line explains is r² as a percentage: square r and multiply by 100. A day is an outlier when its residual is more than 2s above or below 0.'],
  solution: `df = ${n(p.N)} − 2 = ${n(df)}, and the table gives ${n(crit)}. ${sigTxt(r, crit, p.N, sig)} The line explains r² = ${par(r)}² = ${n(p.r100 * p.r100 / 10000)}, which is ${n(pc)}% of the variation, or ${(p1).toFixed(1)}% to 1 decimal place. Then 2s = 2 × ${n(S.s)} = ${n(S.two)} kWh. ${outTxt(S)}`,
  guidance: [
   { prompt: 'How many degrees of freedom does the test of r have, and what critical value does the table give for them?', answer: [df, crit], explanation: `df = ${n(p.N)} − 2 = ${n(df)}, and the row for df ${n(df)} reads ${n(crit)}.` },
   { prompt: `Compare r = ${n(r)} with ${n(crit)} and −${n(crit)}: enter 1 if r is significant, 0 if not. Then square r, multiply by 100 and round to 1 decimal place. What percentage does the line explain?`, answer: [sig, p1], explanation: `${sig ? `r is ${r > 0 ? `above ${n(crit)}` : `below −${n(crit)}`}, so it is significant` : `r lies between −${n(crit)} and ${n(crit)}, so it is not significant`}. r² = ${par(r)}² = ${n(p.r100 * p.r100 / 10000)}, which is ${n(pc)}%, or ${(p1).toFixed(1)}% to 1 decimal place.` },
   { prompt: 'What is 2s, and how many residuals are further than 2s from 0?', answer: [S.two, cnt], explanation: `2 × ${n(S.s)} = ${n(S.two)}. ${outWhy(S)}` }
  ] }; }
});

/* ---- q35 One-way ANOVA: variation between and within groups [13.1, 13.2] ---- */

/* Sums of squares for groups g (arrays of readings, sizes may differ): each group's mean, the grand mean of all the
   readings, SS between (size × (mean − grand mean)², added) and SS within (each reading from its own group's mean). */
const anova = g => { const sizes = g.map(a => a.length), means = g.map(a => sum(a) / a.length), all = g.flat(), N = all.length, total = sum(all), grand = total / N,
 parts = means.map((m, j) => sizes[j] * (m - grand) * (m - grand)), ssb = sum(parts), within = g.map((a, j) => a.map(x => (x - means[j]) * (x - means[j]))), ssw = sum(within.flat());
 return { sizes, means, N, total, grand, parts, ssb, within, ssw, sums: g.map(sum) }; };
/* Whole-number patterns of deviations that add to 0, by group size: a group built from one has a whole mean. */
const PAT = {
 3: [[-1, 0, 1], [-2, 0, 2], [-2, 1, 1], [-1, -1, 2], [-3, 1, 2], [-3, 0, 3]],
 4: [[-1, -1, 1, 1], [-2, 0, 0, 2], [-3, 1, 1, 1], [-2, -1, 1, 2], [-3, -1, 1, 3], [-1, 0, 0, 1]],
 5: [[-2, -1, 0, 1, 2], [-2, 0, 0, 1, 1], [-1, -1, 0, 0, 2], [-3, 0, 1, 1, 1], [-2, -1, 0, 0, 3], [-1, -1, -1, 1, 2]]
};
/* Groups of the given sizes whose means are grand + d[j] (whole numbers), each reading a pattern deviation from its mean. */
const groups = (R, grand, d, sizes) => d.map((x, j) => { const sg = R.bool() ? 1 : -1; return shuffle(R, R.pick(PAT[sizes[j]]).map(v => sg * v)).map(v => grand + x + v); });
/* Offsets d with Σ size × d = 0 (so the grand mean is exactly the base), not all 0. */
const offsets = (R, sizes) => { let d; do { d = sizes.map(() => R.int(-5, 5)); } while (sum(d.map((x, j) => x * sizes[j])) !== 0 || d.every(x => x === 0)); return d; };
const splitText = (g, names, unit) => g.map((a, j) => `${names[j]} ${list(a)}`).join('; ');

/* Three designs on m = 3 or 4 days each, equal sizes, so d adds to 0. Not the parent's worked example (4, 5, 6; 7, 9, 8; 3, 5, 7). */
mk({
 id: 'q35b', parent: 'q35', kind: 'setting', title: 'Three recyclers, one ledger',
 brief: 'Three designs of water recycler have been trialled, and the council wants the spread of their daily yields split into its two parts.',
 labels: ['SS between groups', 'SS within groups', 'total SS'], tolerance: 0.01,
 gl: [['mean of X', 'mean of Y', 'mean of Z', 'grand mean'], ['SS between groups'], ['SS within groups', 'total SS']]
}, {
 canonical: { g: [[36, 37, 38], [39, 42, 42], [41, 41, 44]] },
 draw: R => { const m = R.int(3, 4); let d; do { d = [R.int(-5, 5), R.int(-5, 5)]; d.push(-d[0] - d[1]); } while (Math.abs(d[2]) > 6 || d.every(x => x === 0));
   return { g: groups(R, R.int(25, 60), d, [m, m, m]) }; },
 build: ({ g }) => { const A = anova(g), names = ['X', 'Y', 'Z'], sst = A.ssb + A.ssw; return {
  prompt: `The council is comparing three designs of water recycler, X, Y and Z. Each ran on ${n(A.sizes[0])} days, and the litres of water recovered each day were: ${splitText(g, names)}. Enter the sum of squares between groups, then the sum of squares within groups, then the total sum of squares of all the readings about the grand mean.`,
  answer: [A.ssb, A.ssw, sst],
  hints: ['Find each design’s mean and the grand mean of all the readings together. Between groups: for each design, square its mean minus the grand mean, multiply by the number of days, then add.', 'Within groups: square each day’s distance from its own design’s mean and add them all. The total sum of squares is the between part plus the within part.'],
  solution: `The group means are ${list(A.means)}, and the grand mean of all ${n(A.N)} readings is ${n(A.total)} ÷ ${n(A.N)} = ${n(A.grand)}. Between groups: ${A.means.map(x => `${n(A.sizes[0])} × (${n(x)} − ${n(A.grand)})²`).join(' + ')} = ${A.parts.map(n).join(' + ')} = ${n(A.ssb)}. Within groups: ${A.within.map((w, j) => `${names[j]} gives ${w.map(n).join(' + ')} = ${n(sum(w))}`).join(', ')}, so ${n(A.ssw)} in all. The total sum of squares about the grand mean is ${n(A.ssb)} + ${n(A.ssw)} = ${n(sst)}.`,
  guidance: [
   { prompt: 'What are the means of designs X, Y and Z, and the grand mean of all the readings?', answer: [...A.means, A.grand], explanation: `${g.map((a, j) => `${names[j]}: ${n(A.sums[j])} ÷ ${n(A.sizes[j])} = ${n(A.means[j])}`).join('; ')}. All ${n(A.N)} readings add to ${n(A.total)}, and ${n(A.total)} ÷ ${n(A.N)} = ${n(A.grand)}.` },
   { prompt: 'For each design, multiply its number of days by (design mean − grand mean)², and add. What is the sum of squares between groups?', answer: [A.ssb], explanation: `${A.means.map(x => `${n(A.sizes[0])} × (${n(x)} − ${n(A.grand)})²`).join(' + ')} = ${A.parts.map(n).join(' + ')} = ${n(A.ssb)}.` },
   { prompt: 'Square each reading’s distance from its own design’s mean and add them all. What are the sum of squares within groups and the total sum of squares?', answer: [A.ssw, sst], explanation: `${A.within.map((w, j) => `${names[j]}: ${w.map(n).join(' + ')}`).join('; ')}. Together they make ${n(A.ssw)}. The total is ${n(A.ssb)} + ${n(A.ssw)} = ${n(sst)}.` }
  ] }; }
});

/* Four mixes on m = 3 or 4 beds, equal sizes. The share of the total spread that lies between groups, to 1 decimal place,
   is never on a rounding tie and lies between 20% and 90%. */
mk({
 id: 'q35c', parent: 'q35', kind: 'applied', title: 'How much of the spread is the mix?',
 brief: 'The council wants to know how much of the spread in tomato yields comes from the choice of fertiliser mix rather than from the beds themselves.',
 labels: ['SS between groups', 'SS within groups', 'between groups (% of total)'], tolerance: 0.005,
 gl: [['mean of mix 1', 'mean of mix 2', 'mean of mix 3', 'mean of mix 4', 'grand mean'], ['SS between groups', 'SS within groups'], ['between groups (% of total)']]
}, {
 canonical: { g: [[19, 20, 21], [23, 25, 27], [25, 27, 29], [23, 24, 25]] },
 draw: R => { for (;;) { const m = R.int(3, 4), d = [R.int(-6, 6), R.int(-6, 6), R.int(-6, 6)]; d.push(-sum(d)); if (Math.abs(d[3]) > 7) continue;
   const g = groups(R, R.int(15, 35), d, [m, m, m, m]), A = anova(g), sh = A.ssb / (A.ssb + A.ssw) * 100;
   if (A.ssb === 0 || A.ssw === 0 || sh < 20 || sh > 90 || tie1(sh)) continue; return { g }; } },
 build: ({ g }) => { const A = anova(g), sst = A.ssb + A.ssw, sh = A.ssb / sst * 100, p1 = r1(sh); return {
  prompt: `The farm trialled four fertiliser mixes, each on ${n(A.sizes[0])} beds, and the tomato yields of the beds, in kilograms, were: ${splitText(g, ['mix 1', 'mix 2', 'mix 3', 'mix 4'])}. The council asks how much of the total spread of all the yields lies between the mixes rather than inside them. The total spread is the sum of squares between groups plus the sum of squares within groups. Enter the sum of squares between groups, the sum of squares within groups, then the percentage of the total spread that lies between groups, rounded to 1 decimal place.`,
  answer: [A.ssb, A.ssw, p1],
  hints: ['Find each mix’s mean and the grand mean of all the readings. Between groups: for each mix, square its mean minus the grand mean, multiply by the number of beds, then add. Within groups: square each bed’s distance from its own mix’s mean and add them all.', 'The total spread is the between part plus the within part. Divide the between part by the total and multiply by 100 for the percentage.'],
  solution: `The group means are ${list(A.means)}, and the grand mean of all ${n(A.N)} yields is ${n(A.total)} ÷ ${n(A.N)} = ${n(A.grand)}. Between groups: ${A.means.map(x => `${n(A.sizes[0])} × (${n(x)} − ${n(A.grand)})²`).join(' + ')} = ${A.parts.map(n).join(' + ')} = ${n(A.ssb)}. Within groups: ${A.within.map((w, j) => `mix ${n(j + 1)} gives ${w.map(n).join(' + ')} = ${n(sum(w))}`).join(', ')}, so ${n(A.ssw)} in all. The total spread is ${n(A.ssb)} + ${n(A.ssw)} = ${n(sst)}, and ${n(A.ssb)} ÷ ${n(sst)} × 100 ≈ ${n(Math.round(sh * 1e4) / 1e4)}, which is ${(p1).toFixed(1)}% to 1 decimal place.`,
  guidance: [
   { prompt: 'What are the means of the four mixes, and the grand mean of all the yields?', answer: [...A.means, A.grand], explanation: `${g.map((a, j) => `mix ${n(j + 1)}: ${n(A.sums[j])} ÷ ${n(A.sizes[j])} = ${n(A.means[j])}`).join('; ')}. All ${n(A.N)} yields add to ${n(A.total)}, and ${n(A.total)} ÷ ${n(A.N)} = ${n(A.grand)}.` },
   { prompt: 'Between groups, add size × (mix mean − grand mean)² over the mixes. Within groups, add the squared distances of the readings from their own mix’s mean. What are the two sums of squares?', answer: [A.ssb, A.ssw], explanation: `Between: ${A.means.map(x => `${n(A.sizes[0])} × (${n(x)} − ${n(A.grand)})²`).join(' + ')} = ${n(A.ssb)}. Within: ${A.within.map((w, j) => `${w.map(n).join(' + ')}`).join('; ')}, which make ${n(A.ssw)}.` },
   { prompt: `The total spread is ${n(sst)}. What percentage of it lies between groups, rounded to 1 decimal place?`, answer: [p1], explanation: `${n(A.ssb)} ÷ ${n(sst)} × 100 ≈ ${n(Math.round(sh * 1e4) / 1e4)}, which is ${(p1).toFixed(1)}% to 1 decimal place.` }
  ] }; }
});

/* Three crews with different numbers of shifts (3 to 5 each, not all equal), so the grand mean is not the mean of the three
   means and each between term uses its own size. The group means are whole, and so is the grand mean (Σ size × d = 0). */
const SIZE_SETS = [[3, 4, 5], [4, 4, 5], [3, 5, 5], [3, 3, 4], [4, 5, 5], [3, 4, 4], [3, 3, 5], [4, 4, 3]];
mk({
 id: 'q35d', parent: 'q35', kind: 'challenge', title: 'Crews with unequal shifts',
 brief: 'Three drill crews worked different numbers of shifts, and the council wants the spread of their daily metres split fairly.',
 labels: ['grand mean', 'SS between groups', 'SS within groups'], tolerance: 0.01,
 gl: [['mean of crew 1', 'mean of crew 2', 'mean of crew 3'], ['grand mean'], ['SS between groups', 'SS within groups']]
}, {
 canonical: { g: [[31, 32, 33], [29, 31, 31, 33], [26, 27, 28, 29, 30]] },
 draw: R => { const sizes = shuffle(R, R.pick(SIZE_SETS)); return { g: groups(R, R.int(12, 30), offsets(R, sizes), sizes) }; },
 build: ({ g }) => { const A = anova(g), names = ['crew 1', 'crew 2', 'crew 3']; return {
  prompt: `The council compares three drill crews by the metres each drilled per shift. The crews worked different numbers of shifts: ${g.map((a, j) => `${names[j]}, ${n(a.length)} shifts`).join('; ')}. The metres drilled per shift were: ${splitText(g, names)}. The crews have different numbers of shifts, so the grand mean is the mean of all ${n(A.N)} readings together, and each crew’s term in the between-groups sum uses its own number of shifts. Enter the grand mean, then the sum of squares between groups, then the sum of squares within groups.`,
  answer: [A.grand, A.ssb, A.ssw],
  hints: ['Add all the readings and divide by how many there are for the grand mean. It is not the plain average of the three crew means when the crews have different sizes.', 'Between groups: for each crew, multiply its own number of shifts by (crew mean − grand mean)², then add. Within groups: square each reading’s distance from its own crew’s mean and add them all.'],
  solution: `The crew means are ${list(A.means)}. All ${n(A.N)} readings add to ${n(A.total)}, so the grand mean is ${n(A.total)} ÷ ${n(A.N)} = ${n(A.grand)}. Between groups: ${A.means.map((x, j) => `${n(A.sizes[j])} × (${n(x)} − ${n(A.grand)})²`).join(' + ')} = ${A.parts.map(n).join(' + ')} = ${n(A.ssb)}. Within groups: ${A.within.map((w, j) => `${names[j]} gives ${w.map(n).join(' + ')} = ${n(sum(w))}`).join(', ')}, so ${n(A.ssw)} in all.`,
  guidance: [
   { prompt: 'What are the means of the three crews?', answer: A.means, explanation: g.map((a, j) => `${names[j]}: ${n(A.sums[j])} ÷ ${n(A.sizes[j])} = ${n(A.means[j])}`).join('; ') + '.' },
   { prompt: `What is the grand mean of all ${n(A.N)} readings together?`, answer: [A.grand], explanation: `All ${n(A.N)} readings add to ${n(A.total)}, and ${n(A.total)} ÷ ${n(A.N)} = ${n(A.grand)}.` },
   { prompt: 'Between groups, add size × (crew mean − grand mean)² over the crews. Within groups, add the squared distances of the readings from their own crew’s mean. What are the two sums of squares?', answer: [A.ssb, A.ssw], explanation: `Between: ${A.means.map((x, j) => `${n(A.sizes[j])} × (${n(x)} − ${n(A.grand)})²`).join(' + ')} = ${A.parts.map(n).join(' + ')} = ${n(A.ssb)}. Within: ${A.within.map((w, j) => `${names[j]}: ${w.map(n).join(' + ')}`).join('; ')}, which make ${n(A.ssw)}.` }
  ] }; }
});

})();
