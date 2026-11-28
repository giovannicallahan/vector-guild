/* Calculus 3: many variables practice missions, file 4 of 8: concepts q16–q20, three practice missions each
   (q16b q16c q16d q17b q17c q17d q18b q18c q18d q19b q19c q19d q20b q20c q20d).
   Format and rules: docs/PACK-FORMAT.md, "Practice missions" (§10).
     b  kind 'setting'    the same skill in a new real-world setting
     c  kind 'applied'    a word problem with two or three steps (two or three guided steps)
     d  kind 'challenge'  harder numbers, or the skill combined with one earlier concept (optional `uses: 'qNN'`)
   A practice mission supplies only: id, parent, kind, title, brief, prompt, answer, labels, tolerance, hints,
   solution, guidance (and `uses` for a challenge). Everything else comes from its parent, the learn mission:
   topic, tier, xp, sector, lesson, teaching, sources, the concept bench and the review drill. Do not write those.
   Each mission is registered together with its generator by add(mission, generator); build(canonical) must
   reproduce the authored prompt, hints, solution and guidance exactly. Oracles: qa/realms/calc3/oracle-p4.js. */
(function(){
'use strict';
const G = window.Gen, { n, plus, par } = G;
/* A rounded value written with all its decimal places: dpl(0.8, 2) → '0.80'. */
const dpl = (x, k) => x.toFixed(k).replace('-', '−');
const PRACTICE = window.PRACTICE = window.PRACTICE || [];
const GEN = window.MISSION_GEN = window.MISSION_GEN || {};
/* Registers one practice mission and its generator {canonical, draw(R), build(p)}. */
const add = (mission, generator) => { PRACTICE.push(mission); GEN[mission.id] = generator; };

/* Helpers. practice(meta, stepLabels, generator) registers a mission through add(): its prompt, answers, hints,
   solution and guided steps are build(canonical) itself (cleaned as the engine cleans them), so the authored text
   and the generator cannot drift apart. `meta` holds id, parent, kind, title, brief, labels, tolerance (and uses);
   `stepLabels` holds the answer labels of each guided step, in order. To read a mission as the player sees it:
   node qa/show-mission.js <id> --realm calc3 --draw 3 */
/* A sum of terms written the usual way: ex([[3, 'x²'], [−1, 'y'], [4, '']]) is "3x² − y + 4". Zero terms are left out,
   a coefficient 1 is not written before a letter, and the first term carries only a minus sign. */
const ex = terms => { const out = []; for (const [c, m] of terms) { if (!c) continue; const a = Math.abs(c), body = (a === 1 && m) ? m : n(a) + m;
 out.push(out.length ? `${c < 0 ? '−' : '+'} ${body}` : `${c < 0 ? '−' : ''}${body}`); } return out.length ? out.join(' ') : '0'; };
/* A sum of numbers as worked out: sm([24, −8, 4]) is "24 − 8 + 4". Callers never pass a zero. */
const sm = list => list.map((v, i) => i ? `${v < 0 ? '−' : '+'} ${n(Math.abs(v))}` : n(v)).join(' ');
const pt = (a, b) => `(${n(a)}, ${n(b)})`;
/* "(x − 3)" or "(x + 2)" */
const shift = (v, x) => v < 0 ? `(${x} + ${n(-v)})` : `(${x} − ${n(v)})`;
const rd = (x, k) => Math.round(x * Math.pow(10, k)) / Math.pow(10, k);
/* Directions of whole length 5 or 10, in all four sign choices: ⟨3, 4⟩, ⟨4, 3⟩, ⟨6, 8⟩, ⟨8, 6⟩. */
const DIR = []; for (const [u, v] of [[3, 4], [4, 3], [6, 8], [8, 6]]) for (const su of [1, -1]) for (const sv of [1, -1]) DIR.push([su * u, sv * v]);
/* The same with length 5 only (a unit vector of tenths). */
const DIR5 = DIR.filter(([u, v]) => Math.hypot(u, v) === 5);
/* Rounded answers: edge(x, k) is true when x sits so near a rounding tie at k places that a slightly different
   calculator path could round the other way; draws skip those. */
const edge = (x, k) => { const s = Math.abs(x) * Math.pow(10, k), f = s - Math.floor(s); return Math.abs(f - 0.5) < 0.05; };
const practice = (meta, stepLabels, generator) => {
 const b = generator.build(generator.canonical), c = G.clean, t = G.tidy, { id, parent, kind, title, brief, labels, tolerance, uses } = meta;
 add({ id, parent, kind, title, brief, prompt: c(b.prompt), answer: b.answer.map(t), labels, tolerance,
  hints: b.hints.map(c), solution: c(b.solution),
  guidance: b.guidance.map((s, i) => ({ prompt: c(s.prompt), answer: s.answer.map(t), labels: stepLabels[i], explanation: c(s.explanation) })),
  ...(uses ? { uses } : {}) }, generator);
};

/* ---- q16 Tangent planes and linear approximation [4.4] ---- */


/* q16b: terrace height g = k + cx² + axy + by³: g_x = 2cx + ay, g_y = ax + 3by². Steps in tenths, so the estimate has one
   decimal. Not the parent's form (no xy term there). */
const v16b = ({ k, a, b, c, x, y, dx, dy }) => { const H = k + c * x * x + a * x * y + b * y ** 3, gx = 2 * c * x + a * y, gy = a * x + 3 * b * y * y;
 return { H, gx, gy, est: rd(H + (gx * dx + gy * dy) / 10, 1), Dx: dx / 10, Dy: dy / 10 }; };
practice({ id: 'q16b', parent: 'q16', kind: 'setting', title: 'The terrace panel frame',
 brief: 'A frame for a row of solar panels is to be laid on a terrace in the crater wall, and the crew wants to know how it will tilt and how high the ground is a few steps along.',
 labels: ['slope g_x', 'slope g_y', 'estimated height (m)'], tolerance: 0.01 },
 [['height (m)'], ['g_x', 'g_y'], ['estimate (m)']], {
 canonical: { k: 60, a: 2, b: 1, c: -1, x: 2, y: 1, dx: -1, dy: 2 },
 draw: R => { let p, v; do { p = { k: R.int(30, 90), a: R.nz(-3, 3), b: R.pick([-2, -1, 1, 2]), c: R.nz(-3, 3), x: R.nz(-3, 3), y: R.nz(-3, 3), dx: R.pick([-2, -1, 1, 2]), dy: R.pick([-2, -1, 1, 2]) }; v = v16b(p); }
  while (!v.gx || !v.gy || v.H < 10); return p; },
 build: p => { const { k, a, b, c, x, y, dx, dy } = p, { H, gx, gy, est, Dx, Dy } = v16b(p), P = pt(x, y), Q = pt(x + Dx, y + Dy);
  const f = ex([[k, ''], [c, 'x²'], [a, 'xy'], [b, 'y³']]), Fx = ex([[2 * c, 'x'], [a, 'y']]), Fy = ex([[a, 'x'], [3 * b, 'y²']]);
  const plane = `z = ${ex([[H, ''], [gx, shift(x, 'x')], [gy, shift(y, 'y')]])}`, Lsum = `${n(H)} + ${par(gx)} × ${par(Dx)} + ${par(gy)} × ${par(Dy)} = ${sm([H, rd(gx * Dx, 1), rd(gy * Dy, 1)])} = ${n(est)}`; return {
  prompt: `A row of solar panels is to stand on a terrace whose ground height is g(x, y) = ${f} metres, with (x, y) in metres on the survey map. The frame is laid flat on the ground at the map point ${P}, along the tangent plane there. Enter the two slopes of that plane, g_x and g_y at ${P}. Then use the linear approximation to estimate the ground height at the nearby point ${Q}, in metres.`,
  answer: [gx, gy, est],
  hints: ['Hold y fixed to find g_x and hold x fixed to find g_y, then put in the point.', 'The linear approximation is L = g(a, b) + g_x × Δx + g_y × Δy, where Δx and Δy are the steps from the map point (a, b) to the nearby point.'],
  solution: `g${P} = ${sm([k, c * x * x, a * x * y, b * y ** 3])} = ${n(H)}. g_x = ${Fx}, so g_x${P} = ${sm([2 * c * x, a * y])} = ${n(gx)}; g_y = ${Fy}, so g_y${P} = ${sm([a * x, 3 * b * y * y])} = ${n(gy)}. The tangent plane is ${plane}. The steps are Δx = ${n(Dx)} and Δy = ${n(Dy)}, so L = ${Lsum} metres.`,
  guidance: [
   { prompt: `What is the ground height g${P}?`, answer: [H], explanation: `g${P} = ${sm([k, c * x * x, a * x * y, b * y ** 3])} = ${n(H)} metres.` },
   { prompt: `g_x = ${Fx} and g_y = ${Fy}. What are g_x${P} and g_y${P}?`, answer: [gx, gy], explanation: `g_x${P} = ${sm([2 * c * x, a * y])} = ${n(gx)} and g_y${P} = ${sm([a * x, 3 * b * y * y])} = ${n(gy)}. These are the two slopes of the tangent plane.` },
   { prompt: `From ${P} to ${Q} the steps are Δx = ${n(Dx)} and Δy = ${n(Dy)}. What is the estimate L = g + g_x × Δx + g_y × Δy?`, answer: [est], explanation: `L = ${Lsum} metres.` }
  ] }; }
});

/* q16c: dust depth D = k + ax² + bxy + cy² millimetres; D_x = 2ax + by, D_y = bx + 2cy. The steps are tenths. The
   exact depth at the new point is a sum of hundredths, and exact − estimate = (a·dx² + b·dx·dy + c·dy²) ÷ 100. */
const v16c = ({ k, a, b, c, x, y, dx, dy }) => { const D0 = k + a * x * x + b * x * y + c * y * y, fx = 2 * a * x + b * y, fy = b * x + 2 * c * y,
  chg = rd((fx * dx + fy * dy) / 10, 1), est = rd(D0 + chg, 1), X = 10 * x + dx, Y = 10 * y + dy, exact = (100 * k + a * X * X + b * X * Y + c * Y * Y) / 100;
 return { D0, fx, fy, chg, est, exact, miss: rd(exact - est, 2), Dx: dx / 10, Dy: dy / 10, Xn: X / 10, Yn: Y / 10 }; };
practice({ id: 'q16c', parent: 'q16', kind: 'applied', title: 'Dust on the sampling run',
 brief: 'A rover will drive a short way across drifted dust, and the crew wants a quick depth estimate on arrival and a sense of how good the estimate is.',
 labels: ['estimated change (mm)', 'estimated depth (mm)', 'exact minus estimate (mm)'], tolerance: 0.005 },
 [['D_x', 'D_y'], ['estimated change (mm)', 'estimated depth (mm)'], ['exact depth (mm)', 'exact minus estimate (mm)']], {
 canonical: { k: 60, a: 2, b: -1, c: 3, x: 2, y: 1, dx: 2, dy: -1 },
 draw: R => { let p, v; do { p = { k: R.int(40, 90), a: R.nz(-3, 3), b: R.nz(-3, 3), c: R.nz(-3, 3), x: R.int(1, 3), y: R.int(1, 3), dx: R.pick([-2, -1, 1, 2]), dy: R.pick([-2, -1, 1, 2]) }; v = v16c(p); }
  while (!v.fx || !v.fy || !v.chg || !v.miss || v.D0 < 10 || v.exact < 10); return p; },
 build: p => { const { k, a, b, c, x, y, dx, dy } = p, { D0, fx, fy, chg, est, exact, miss, Dx, Dy, Xn, Yn } = v16c(p), P = pt(x, y), Q = pt(Xn, Yn);
  const f = ex([[k, ''], [a, 'x²'], [b, 'xy'], [c, 'y²']]), Fx = ex([[2 * a, 'x'], [b, 'y']]), Fy = ex([[b, 'x'], [2 * c, 'y']]);
  const chgSum = `${par(fx)} × ${par(Dx)} + ${par(fy)} × ${par(Dy)} = ${sm([rd(fx * Dx, 1), rd(fy * Dy, 1)])} = ${n(chg)}`;
  const exSum = `${sm([k, rd(a * Xn * Xn, 2), rd(b * Xn * Yn, 2), rd(c * Yn * Yn, 2)])} = ${n(exact)}`; return {
  prompt: `Fine dust has drifted over the crater floor to a depth of D(x, y) = ${f} millimetres at the map point (x, y), in metres from the survey deck. A sampling rover stands at ${P} and will drive to ${Q}. Use the linear approximation to estimate the change in depth over the drive, in millimetres, and the estimated depth at ${Q}. Then work out the exact depth at ${Q} from the formula, and enter how far the estimate misses it: the exact depth minus the estimate, which is negative when the exact depth is smaller.`,
  answer: [chg, est, miss],
  hints: ['Find the slopes D_x and D_y at the start and the steps Δx and Δy. The estimated change in depth is D_x × Δx + D_y × Δy.', 'The estimate is the depth at the start plus that change. For the exact depth, put the new x and y, decimals and all, straight into the formula; then subtract the estimate.'],
  solution: `D${P} = ${sm([k, a * x * x, b * x * y, c * y * y])} = ${n(D0)}. D_x = ${Fx} and D_y = ${Fy}, so D_x${P} = ${sm([2 * a * x, b * y])} = ${n(fx)} and D_y${P} = ${sm([b * x, 2 * c * y])} = ${n(fy)}. The steps are Δx = ${n(Dx)} and Δy = ${n(Dy)}, so the estimated change is ${chgSum} mm and the estimated depth is ${n(D0)} + ${par(chg)} = ${n(est)} mm. The exact depth is D${Q} = ${exSum} mm, so the estimate misses it by ${n(exact)} − ${par(est)} = ${n(miss)} mm.`,
  guidance: [
   { prompt: `D_x = ${Fx} and D_y = ${Fy}. What are D_x${P} and D_y${P}?`, answer: [fx, fy], explanation: `D_x${P} = ${sm([2 * a * x, b * y])} = ${n(fx)} and D_y${P} = ${sm([b * x, 2 * c * y])} = ${n(fy)}.` },
   { prompt: `The depth at ${P} is ${n(D0)} mm, and the steps are Δx = ${n(Dx)} and Δy = ${n(Dy)}. What are the estimated change in depth and the estimated depth at ${Q}?`, answer: [chg, est], explanation: `The change is ${chgSum} mm, so the estimated depth is ${n(D0)} + ${par(chg)} = ${n(est)} mm.` },
   { prompt: `Put x = ${n(Xn)} and y = ${n(Yn)} into D(x, y). What is the exact depth, and what is the exact depth minus the estimate?`, answer: [exact, miss], explanation: `D${Q} = ${exSum} mm, and ${n(exact)} − ${par(est)} = ${n(miss)} mm.` }
  ] }; }
});

/* q16d: h = k + ax²y + bxy², so h_x = 2axy + by², h_y = ax² + 2bxy. The tangent plane z = H + h_x(x − p) + h_y(y − q) is
   h_x·x + h_y·y − z = d with d = h_x·p + h_y·q − H, which is n · P for n = ⟨h_x, h_y, −1⟩ and P = (p, q, H). */
const v16d = ({ k, a, b, x, y }) => { const H = k + a * x * x * y + b * x * y * y, hx = 2 * a * x * y + b * y * y, hy = a * x * x + 2 * b * x * y; return { H, hx, hy, d: hx * x + hy * y - H }; };
practice({ id: 'q16d', parent: 'q16', kind: 'challenge', uses: 'q08', title: 'The anchor plate on the wall',
 brief: 'An anchor plate must lie exactly along the tangent plane of a crater wall, and the fitters want its equation in the form they use at the dock.',
 labels: ['slope h_x', 'slope h_y', 'd'], tolerance: 0.01 },
 [['height (m)'], ['h_x', 'h_y'], ['d']], {
 canonical: { k: 20, a: 1, b: -1, x: 2, y: 1 },
 draw: R => { let p, v; do { p = { k: R.int(10, 40), a: R.nz(-2, 2), b: R.nz(-2, 2), x: R.nz(-3, 3), y: R.nz(-3, 3) }; v = v16d(p); }
  while (!v.hx || !v.hy || !v.H || !v.d || Math.abs(v.d) > 900); return p; },
 build: p => { const { k, a, b, x, y } = p, { H, hx, hy, d } = v16d(p), P = pt(x, y);
  const f = ex([[k, ''], [a, 'x²y'], [b, 'xy²']]), Fx = ex([[2 * a, 'xy'], [b, 'y²']]), Fy = ex([[a, 'x²'], [2 * b, 'xy']]); return {
  prompt: `The ground on a crater wall has height h(x, y) = ${f} metres, with x and y in metres on the survey map. A flat anchor plate must lie along the tangent plane at the map point ${P}. That plane touches the surface at the point of the wall directly above ${P}, and has normal vector ⟨h_x, h_y, −1⟩, where h_x and h_y are the slopes at ${P}. Written as h_x·x + h_y·y − z = d, it is a plane equation of the form ax + by + cz = d. Enter h_x and h_y at ${P}, then the number d.`,
  answer: [hx, hy, d],
  hints: ['The point of the plane on the wall has x and y from the map point, and its z is the height h there. Find h_x and h_y by holding the other letter fixed.', 'In a plane equation, d is the dot product of the normal vector with any point of the plane: d = n · P.'],
  solution: `h${P} = ${sm([k, a * x * x * y, b * x * y * y])} = ${n(H)}, so the plane passes through the point (${n(x)}, ${n(y)}, ${n(H)}). h_x = ${Fx}, so h_x${P} = ${sm([2 * a * x * y, b * y * y])} = ${n(hx)}; h_y = ${Fy}, so h_y${P} = ${sm([a * x * x, 2 * b * x * y])} = ${n(hy)}. The normal vector is n = ⟨${n(hx)}, ${n(hy)}, −1⟩, and d = n · P = ${par(hx)} × ${par(x)} + ${par(hy)} × ${par(y)} + (−1) × ${par(H)} = ${sm([hx * x, hy * y, -H])} = ${n(d)}.`,
  guidance: [
   { prompt: `What is the height h${P}? It is the z of the point where the plane touches the wall.`, answer: [H], explanation: `h${P} = ${sm([k, a * x * x * y, b * x * y * y])} = ${n(H)}, so the plane passes through (${n(x)}, ${n(y)}, ${n(H)}).` },
   { prompt: `h_x = ${Fx} and h_y = ${Fy}. What are h_x${P} and h_y${P}?`, answer: [hx, hy], explanation: `h_x${P} = ${sm([2 * a * x * y, b * y * y])} = ${n(hx)} and h_y${P} = ${sm([a * x * x, 2 * b * x * y])} = ${n(hy)}.` },
   { prompt: `The normal vector is n = ⟨${n(hx)}, ${n(hy)}, −1⟩ and the plane passes through (${n(x)}, ${n(y)}, ${n(H)}). What is d = n · P?`, answer: [d], explanation: `d = ${par(hx)} × ${par(x)} + ${par(hy)} × ${par(y)} + (−1) × ${par(H)} = ${sm([hx * x, hy * y, -H])} = ${n(d)}.` }
  ] }; }
});

/* ---- q17 Chapter review: reading a terrain map [4.1, 4.3] ---- */

/* q17b: temperature T = k + ax³ + bxy² + cy: T_x = 3ax² + by², T_y = 2bxy + c. Steps in tenths. Not the parent's form. */
const v17b = ({ k, a, b, c, x, y, dx, dy }) => { const H = k + a * x ** 3 + b * x * y * y + c * y, fx = 3 * a * x * x + b * y * y, fy = 2 * b * x * y + c;
 return { H, fx, fy, est: rd(H + (fx * dx + fy * dy) / 10, 1), Dx: dx / 10, Dy: dy / 10 }; };
practice({ id: 'q17b', parent: 'q17', kind: 'setting', title: 'The warm spot on the crater floor',
 brief: 'A sensor cart is parked on the crater floor, and the lab wants its temperature contour, how fast the ground warms to the east, and the temperature at its next stop.',
 labels: ['contour level (°C)', 'rate going east T_x', 'estimated temperature (°C)'], tolerance: 0.01 },
 [['temperature (°C)'], ['T_x', 'T_y'], ['estimate (°C)']], {
 canonical: { k: 30, a: 1, b: -2, c: 3, x: 2, y: 1, dx: 2, dy: -1 },
 draw: R => { let p, v; do { p = { k: R.int(30, 70), a: R.pick([-2, -1, 1, 2]), b: R.pick([-2, -1, 1, 2]), c: R.nz(-4, 4), x: R.int(1, 3), y: R.int(1, 3), dx: R.pick([-2, -1, 1, 2]), dy: R.pick([-2, -1, 1, 2]) }; v = v17b(p); }
  while (!v.fx || !v.fy || v.H < 5); return p; },
 build: p => { const { k, a, b, c, x, y, dx, dy } = p, { H, fx, fy, est, Dx, Dy } = v17b(p), P = pt(x, y), Q = pt(x + Dx, y + Dy);
  const f = ex([[k, ''], [a, 'x³'], [b, 'xy²'], [c, 'y']]), Fx = ex([[3 * a, 'x²'], [b, 'y²']]), Fy = ex([[2 * b, 'xy'], [c, '']]);
  const Lsum = `${n(H)} + ${par(fx)} × ${par(Dx)} + ${par(fy)} × ${par(Dy)} = ${sm([H, rd(fx * Dx, 1), rd(fy * Dy, 1)])} = ${n(est)}`; return {
  prompt: `A thermal survey of the crater floor gives the ground temperature as T(x, y) = ${f} degrees Celsius, with x metres east and y metres north of the survey deck. A sensor cart is parked at ${P}. Enter the level of the contour line it sits on, which is the temperature there. Then enter the rate at which the temperature changes going east, T_x${P}, in degrees per metre, and the linear estimate of the temperature at ${Q}.`,
  answer: [H, fx, est],
  hints: ['The cart’s contour line is the level curve T(x, y) = c through its point, so c is the temperature there.', 'T_x is found by holding y fixed. The estimate needs both slopes: L = T + T_x × Δx + T_y × Δy, with the steps Δx and Δy from the cart to the next stop.'],
  solution: `T${P} = ${sm([k, a * x ** 3, b * x * y * y, c * y])} = ${n(H)}, so the cart is on the ${n(H)} °C contour line. T_x = ${Fx}, which at ${P} is ${sm([3 * a * x * x, b * y * y])} = ${n(fx)}, and T_y = ${Fy}, which is ${sm([2 * b * x * y, c])} = ${n(fy)}. With Δx = ${n(Dx)} and Δy = ${n(Dy)}, L = ${Lsum} °C.`,
  guidance: [
   { prompt: `What is T${P}, the level of the cart’s contour line?`, answer: [H], explanation: `T${P} = ${sm([k, a * x ** 3, b * x * y * y, c * y])} = ${n(H)} °C.` },
   { prompt: `T_x = ${Fx} and T_y = ${Fy}. What are T_x${P} and T_y${P}?`, answer: [fx, fy], explanation: `T_x${P} = ${sm([3 * a * x * x, b * y * y])} = ${n(fx)} and T_y${P} = ${sm([2 * b * x * y, c])} = ${n(fy)}.` },
   { prompt: `The steps to ${Q} are Δx = ${n(Dx)} and Δy = ${n(Dy)}. What is the estimate L?`, answer: [est], explanation: `L = ${Lsum} °C.` }
  ] }; }
});

/* q17c: h = k + ax²y + bxy + cy², h_x = 2axy + by, which is positive (the rover climbs going east). The rise is h_x × m
   for m a multiple of 0.5, so the distance is m, with at most one decimal. */
const v17c = ({ k, a, b, c, x, y, mm }) => { const H = k + a * x * x * y + b * x * y + c * y * y, fx = 2 * a * x * y + b * y, fy = a * x * x + b * x + 2 * c * y, m = mm / 2; return { H, fx, fy, m, R: rd((fx + fy) * m, 1) }; };
practice({ id: 'q17c', parent: 'q17', kind: 'applied', title: 'How far to climb the slope',
 brief: 'A rover must reach a ledge a few metres higher than where it stands, driving north-east, and the planner needs to know how far it has to go.',
 labels: ['contour level (m)', 'slope going east h_x', 'slope going north h_y', 'distance east (m)'], tolerance: 0.01 },
 [['height (m)'], ['h_x', 'h_y'], ['distance east (m)']], {
 /* The rover moves s metres east and s metres north, and the linear estimate of the rise is (h_x + h_y)s. */
 canonical: { k: 40, a: 1, b: 2, c: -1, x: 2, y: 3, mm: 3 },
 draw: R => { let p, v; do { p = { k: R.int(20, 60), a: R.pick([-2, -1, 1, 2]), b: R.nz(-3, 3), c: R.pick([-2, -1, 1, 2]), x: R.int(1, 3), y: R.int(1, 3), mm: R.int(1, 6) }; v = v17c(p); }
  while (v.fx + v.fy <= 1 || v.fx === 0 || v.fy === 0 || v.H < 5 || v.R === 1 || v.m === 1); return p; },
 build: p => { const { k, a, b, c, x, y, mm } = p, { H, fx, fy, m, R } = v17c(p), P = pt(x, y), S = fx + fy;
  const f = ex([[k, ''], [a, 'x²y'], [b, 'xy'], [c, 'y²']]); return {
  prompt: `The ground height on a crater slope is h(x, y) = ${f} metres, with x metres east and y metres north of the survey deck. A rover is parked at ${P} and must reach a ledge ${n(R)} metres higher. It drives north-east, so it moves the same distance north as it moves east. Use the tangent plane at ${P} for the whole drive: moving Δx east and Δy north raises the ground by about h_x Δx + h_y Δy. Enter the level of the contour line the rover is parked on. Then enter the slopes h_x${P} and h_y${P}. Then enter how far east the rover must drive, in metres (it goes the same distance north).`,
  answer: [H, fx, fy, m],
  hints: ['The rover’s contour level is the height h at its point. Each slope comes from holding the other letter fixed and differentiating.', 'If the rover goes s metres east and s metres north, the ground rises about h_x s + h_y s = (h_x + h_y)s. Divide the rise needed by h_x + h_y.'],
  solution: `h${P} = ${sm([k, a * x * x * y, b * x * y, c * y * y])} = ${n(H)}, so the rover is on the ${n(H)} m contour line. h_x = ${ex([[2 * a, 'xy'], [b, 'y']])}, so h_x${P} = ${sm([2 * a * x * y, b * y])} = ${n(fx)}, and h_y = ${ex([[a, 'x²'], [b, 'x'], [2 * c, 'y']])}, so h_y${P} = ${sm([a * x * x, b * x, 2 * c * y])} = ${n(fy)}. Going s metres east and s metres north raises the ground by about ${ex([[fx, 's'], [fy, 's']])} = ${n(S)}s metres. To rise ${n(R)} metres the rover drives ${n(R)} ÷ ${n(S)} = ${n(m)} metres east, and the same distance north.`,
  guidance: [
   { prompt: `What is h${P}, the level of the rover’s contour line?`, answer: [H], explanation: `h${P} = ${sm([k, a * x * x * y, b * x * y, c * y * y])} = ${n(H)} metres.` },
   { prompt: `h_x = ${ex([[2 * a, 'xy'], [b, 'y']])} and h_y = ${ex([[a, 'x²'], [b, 'x'], [2 * c, 'y']])}. What are h_x${P} and h_y${P}?`, answer: [fx, fy], explanation: `h_x${P} = ${sm([2 * a * x * y, b * y])} = ${n(fx)} and h_y${P} = ${sm([a * x * x, b * x, 2 * c * y])} = ${n(fy)}.` },
   { prompt: `For each metre east the rover also goes one metre north, so the ground rises about h_x + h_y metres for each metre east. The rover needs ${n(R)} metres of rise. How many metres east must it drive?`, answer: [m], explanation: `The rise per metre east is ${n(fx)} ${fy < 0 ? '−' : '+'} ${n(Math.abs(fy))} = ${n(S)} metres, so the rover drives ${n(R)} ÷ ${n(S)} = ${n(m)} metres east, and the same distance north.` }
  ] }; }
});

/* q17d: h = k + ax²y + bxy³: h_y = ax² + 3bxy², h_xy = 2ax + 3by², h_yy = 6bxy. The linear approximation of the slope h_y
   is h_y + h_xy Δx + h_yy Δy (steps in tenths, one decimal). */
const v17d = ({ k, a, b, x, y, dx, dy }) => { const hy = a * x * x + 3 * b * x * y * y, hxy = 2 * a * x + 3 * b * y * y, hyy = 6 * b * x * y;
 return { hy, hxy, hyy, est: rd(hy + (hxy * dx + hyy * dy) / 10, 1), Dx: dx / 10, Dy: dy / 10 }; };
practice({ id: 'q17d', parent: 'q17', kind: 'challenge', uses: 'q15', title: 'The slope that keeps changing',
 brief: 'The rover’s tilt alarm reads the slope going north, and the planner wants to know how that slope itself will change over the next short drive.',
 labels: ['slope north h_y', 'h_xy', 'h_yy', 'estimated slope north'], tolerance: 0.01 },
 [['h_y'], ['h_xy', 'h_yy'], ['estimated slope']], {
 canonical: { k: 40, a: 1, b: -1, x: 2, y: 1, dx: 2, dy: -1 },
 draw: R => { let p, v; do { p = { k: R.int(30, 70), a: R.nz(-2, 2), b: R.nz(-2, 2), x: R.nz(-3, 3), y: R.nz(-3, 3), dx: R.pick([-2, -1, 1, 2]), dy: R.pick([-2, -1, 1, 2]) }; v = v17d(p); }
  while (!v.hy || !v.hxy); return p; },
 build: p => { const { k, a, b, x, y, dx, dy } = p, { hy, hxy, hyy, est, Dx, Dy } = v17d(p), P = pt(x, y), Q = pt(x + Dx, y + Dy);
  const f = ex([[k, ''], [a, 'x²y'], [b, 'xy³']]), Fy = ex([[a, 'x²'], [3 * b, 'xy²']]), Fxy = ex([[2 * a, 'x'], [3 * b, 'y²']]), Fyy = ex([[6 * b, 'xy']]);
  const Lsum = `${n(hy)} + ${par(hxy)} × ${par(Dx)} + ${par(hyy)} × ${par(Dy)} = ${sm([hy, rd(hxy * Dx, 1), rd(hyy * Dy, 1)])} = ${n(est)}`; return {
  prompt: `The ground on a crater slope has height h(x, y) = ${f} metres, with x metres east and y metres north of the survey deck. A rover stands at ${P}. Enter the slope going north there, h_y${P}. Then enter the second partial derivatives h_xy and h_yy at that point. The north slope changes as the rover moves, so use the linear approximation on the slope h_y itself, as if it were a height, to estimate the slope going north at ${Q}.`,
  answer: [hy, hxy, hyy, est],
  hints: ['The slope h_y is itself a function of x and y, so it has partial derivatives of its own: h_xy (differentiate h_y with respect to x, which equals the mixed partial in the other order) and h_yy.', 'The linear approximation for the slope is: new h_y ≈ h_y + h_xy × Δx + h_yy × Δy, with the steps Δx and Δy from the rover’s point to the new point.'],
  solution: `h_y = ${Fy}, so h_y${P} = ${sm([a * x * x, 3 * b * x * y * y])} = ${n(hy)}. Differentiating h_y with respect to x gives h_xy = ${Fxy}, which is ${sm([2 * a * x, 3 * b * y * y])} = ${n(hxy)} at ${P}; differentiating with respect to y gives h_yy = ${Fyy}, which is ${n(hyy)}. With Δx = ${n(Dx)} and Δy = ${n(Dy)}, the estimated north slope at ${Q} is ${Lsum}.`,
  guidance: [
   { prompt: `h_y = ${Fy}. What is h_y${P}?`, answer: [hy], explanation: `h_y${P} = ${sm([a * x * x, 3 * b * x * y * y])} = ${n(hy)}.` },
   { prompt: `Differentiate h_y = ${Fy} with respect to x to get h_xy, and with respect to y to get h_yy. What are h_xy${P} and h_yy${P}?`, answer: [hxy, hyy], explanation: `h_xy = ${Fxy}, which is ${sm([2 * a * x, 3 * b * y * y])} = ${n(hxy)}, and h_yy = ${Fyy}, which is ${n(hyy)}.` },
   { prompt: `The steps to ${Q} are Δx = ${n(Dx)} and Δy = ${n(Dy)}. What is the estimated slope north there, h_y + h_xy × Δx + h_yy × Δy?`, answer: [est], explanation: `${Lsum}.` }
  ] }; }
});

/* ---- q18 The chain rule for several variables [4.5] ---- */

/* q18b: P = ax²y + by² along x = p + qt, y = rt at t = s: P_x = 2axy, P_y = ax² + 2by. The rate stays below 1000. */
const v18b = ({ a, b, p, q, r, s }) => { const X = p + q * s, Y = r * s, Px = 2 * a * X * Y, Py = a * X * X + 2 * b * Y; return { X, Y, Px, Py, rate: Px * q + Py * r }; };
practice({ id: 'q18b', parent: 'q18', kind: 'setting', title: 'The survey drone’s pressure reading',
 brief: 'A survey drone is flying a straight line across the plain, and the mast wants to know how fast the air pressure at the drone is changing.',
 labels: ['dx/dt (km per hour)', 'dy/dt (km per hour)', 'dP/dt (Pa per hour)'], tolerance: 0.01 },
 [['x (km)', 'y (km)'], ['∂P/∂x', '∂P/∂y'], ['dP/dt (Pa per hour)']], {
 canonical: { a: 1, b: -1, p: 2, q: 1, r: 2, s: 1 },
 draw: R => { let o, v; do { o = { a: R.pick([-2, -1, 1, 2]), b: R.nz(-3, 3), p: R.int(1, 4), q: R.nz(-3, 3), r: R.nz(-3, 3), s: R.int(1, 3) }; v = v18b(o); }
  while (!v.X || !v.Y || !v.Px || !v.Py || Math.abs(v.rate) >= 1000); return o; },
 build: ({ a, b, p, q, r, s }) => { const { X, Y, Px, Py, rate } = v18b({ a, b, p, q, r, s });
  const F = ex([[a, 'x²y'], [b, 'y²']]), Fx = ex([[2 * a, 'xy']]), Fy = ex([[a, 'x²'], [2 * b, '']]), xt = ex([[p, ''], [q, 't']]), yt = ex([[r, 't']]); return {
  prompt: `A survey drone flies across the plain, where the air pressure at the point (x, y) is P(x, y) = ${F} pascals, with x and y in kilometres. t hours after take-off the drone is at x(t) = ${xt}, y(t) = ${yt}. Enter dx/dt and dy/dt, the drone’s speeds in the x and y directions, in kilometres per hour. Then enter dP/dt at t = ${n(s)}, the rate at which the pressure at the drone is changing, in pascals per hour.`,
  answer: [q, r, rate],
  hints: ['Differentiate each coordinate of the path with respect to t to get dx/dt and dy/dt. For the pressure, find where the drone is at that time and put that point into ∂P/∂x and ∂P/∂y.', 'The multivariable chain rule: dP/dt = ∂P/∂x × dx/dt + ∂P/∂y × dy/dt.'],
  solution: `x(t) = ${xt} gives dx/dt = ${n(q)}, and y(t) = ${yt} gives dy/dt = ${n(r)}. At t = ${n(s)} the drone is at x = ${n(X)}, y = ${n(Y)}. There ∂P/∂x = ${Fx} = ${par(2 * a)} × ${par(X)} × ${par(Y)} = ${n(Px)} and ∂P/∂y = ${Fy} = ${sm([a * X * X, 2 * b * Y])} = ${n(Py)}. By the multivariable chain rule, dP/dt = ${par(Px)} × ${par(q)} + ${par(Py)} × ${par(r)} = ${sm([Px * q, Py * r])} = ${n(rate)} Pa per hour.`,
  guidance: [
   { prompt: `Where is the drone at t = ${n(s)}? Enter x(${n(s)}) and y(${n(s)}).`, answer: [X, Y], explanation: `x(${n(s)}) = ${sm([p, q * s])} = ${n(X)} and y(${n(s)}) = ${par(r)} × ${n(s)} = ${n(Y)}.` },
   { prompt: `∂P/∂x = ${Fx} and ∂P/∂y = ${Fy}. What are they at ${pt(X, Y)}?`, answer: [Px, Py], explanation: `∂P/∂x = ${par(2 * a)} × ${par(X)} × ${par(Y)} = ${n(Px)} and ∂P/∂y = ${sm([a * X * X, 2 * b * Y])} = ${n(Py)}.` },
   { prompt: `With dx/dt = ${n(q)} and dy/dt = ${n(r)}, what is dP/dt = ∂P/∂x × dx/dt + ∂P/∂y × dy/dt?`, answer: [rate], explanation: `dP/dt = ${par(Px)} × ${par(q)} + ${par(Py)} × ${par(r)} = ${sm([Px * q, Py * r])} = ${n(rate)} Pa per hour.` }
  ] }; }
});

/* q18c: T = axy + by² + cx along x = p + qt², y = r + ut at t = s; dx/dt = 2qs, dy/dt = u. The temperature at that moment
   is T0 (a whole number); the later time is h tenths of an hour on, so the estimate has one decimal. */
const v18c = ({ a, b, c, p, q, r, u, s, h }) => { const X = p + q * s * s, Y = r + u * s, Tx = a * Y + c, Ty = a * X + 2 * b * Y, vx = 2 * q * s, rate = Tx * vx + Ty * u, T0 = a * X * Y + b * Y * Y + c * X;
 return { X, Y, Tx, Ty, vx, rate, T0, est: rd(T0 + rate * h / 10, 1), dt: h / 10 }; };
practice({ id: 'q18c', parent: 'q18', kind: 'applied', title: 'The buggy’s temperature a little later',
 brief: 'A wind-vane buggy is driving across the plain, and the mast wants to know how fast its thermometer reading is changing and what it will show shortly.',
 labels: ['dT/dt (°C per hour)', 'estimated temperature (°C)'], tolerance: 0.01 },
 [['∂T/∂x', '∂T/∂y'], ['dT/dt (°C per hour)'], ['estimate (°C)']], {
 canonical: { a: 2, b: -1, c: 3, p: 1, q: 1, r: 2, u: 1, s: 1, h: 5 },
 draw: R => { let o, v; do { o = { a: R.pick([-2, -1, 1, 2]), b: R.nz(-2, 2), c: R.nz(-4, 4), p: R.int(1, 3), q: R.nz(-2, 2), r: R.int(1, 3), u: R.nz(-2, 2), s: R.int(1, 2), h: R.pick([1, 2, 5]) }; v = v18c(o); }
  while (!v.X || !v.Y || !v.Tx || !v.Ty || !v.T0 || !v.rate || Math.abs(v.rate) >= 500); return o; },
 build: ({ a, b, c, p, q, r, u, s, h }) => { const { X, Y, Tx, Ty, vx, rate, T0, est, dt } = v18c({ a, b, c, p, q, r, u, s, h });
  const F = ex([[a, 'xy'], [b, 'y²'], [c, 'x']]), Fx = ex([[a, 'y'], [c, '']]), Fy = ex([[a, 'x'], [2 * b, 'y']]), xt = ex([[p, ''], [q, 't²']]), yt = ex([[r, ''], [u, 't']]);
  const step = `${par(Tx)} × ${par(vx)} + ${par(Ty)} × ${par(u)} = ${sm([Tx * vx, Ty * u])} = ${n(rate)}`; return {
  prompt: `A wind-vane buggy drives across the plain, where the air temperature at the point (x, y) is T(x, y) = ${F} degrees Celsius, with x and y in kilometres. t hours after the start the buggy is at x(t) = ${xt}, y(t) = ${yt}. At t = ${n(s)} its thermometer reads ${n(T0)} °C. Enter dT/dt at that moment, in degrees per hour. Then assume the temperature keeps changing at that rate and enter the estimated reading ${n(dt)} hours later.`,
  answer: [rate, est],
  hints: ['Find where the buggy is at t = ' + n(s) + ' and put that point into ∂T/∂x and ∂T/∂y. Then differentiate x(t) and y(t) to get dx/dt and dy/dt.', 'The multivariable chain rule gives dT/dt = ∂T/∂x × dx/dt + ∂T/∂y × dy/dt. If the reading keeps changing at that rate, the change over a time Δt is dT/dt × Δt, and it is added to the reading now.'],
  solution: `At t = ${n(s)} the buggy is at x = ${n(X)}, y = ${n(Y)}. There ∂T/∂x = ${Fx} = ${sm([a * Y, c])} = ${n(Tx)} and ∂T/∂y = ${Fy} = ${sm([a * X, 2 * b * Y])} = ${n(Ty)}. Also dx/dt = ${ex([[2 * q, 't']])} = ${n(vx)} and dy/dt = ${n(u)}. By the multivariable chain rule, dT/dt = ${step} °C per hour. Over ${n(dt)} hours the reading changes by about ${par(rate)} × ${n(dt)} = ${n(rd(rate * dt, 2))}, so it will read about ${n(T0)} + ${par(rd(rate * dt, 2))} = ${n(est)} °C.`,
  guidance: [
   { prompt: `The buggy is at ${pt(X, Y)} at t = ${n(s)}. ∂T/∂x = ${Fx} and ∂T/∂y = ${Fy}. What are they there?`, answer: [Tx, Ty], explanation: `∂T/∂x = ${sm([a * Y, c])} = ${n(Tx)} and ∂T/∂y = ${sm([a * X, 2 * b * Y])} = ${n(Ty)}.` },
   { prompt: `Here dx/dt = ${ex([[2 * q, 't']])} and dy/dt = ${n(u)}. What is dT/dt = ∂T/∂x × dx/dt + ∂T/∂y × dy/dt at t = ${n(s)}?`, answer: [rate], explanation: `dx/dt = ${n(vx)} at t = ${n(s)}, so dT/dt = ${step} °C per hour.` },
   { prompt: `The reading is ${n(T0)} °C and is changing at ${n(rate)} °C per hour. What does it read ${n(dt)} hours later, if it keeps changing at that rate?`, answer: [est], explanation: `${n(T0)} + ${par(rate)} × ${n(dt)} = ${n(T0)} + ${par(rd(rate * dt, 2))} = ${n(est)} °C.` }
  ] }; }
});

/* q18d: T = ax²y + by³ along x = p + qt², y = r + ut at t = s: T_x = 2axy, T_y = ax² + 3by², dx/dt = 2qs, dy/dt = u. The
   level c is T at the balloon. The rate stays below 1000. */
const v18d = ({ a, b, p, q, r, u, s }) => { const X = p + q * s * s, Y = r + u * s, c = a * X * X * Y + b * Y ** 3, Tx = 2 * a * X * Y, Ty = a * X * X + 3 * b * Y * Y, vx = 2 * q * s;
 return { X, Y, c, Tx, Ty, vx, rate: Tx * vx + Ty * u }; };
practice({ id: 'q18d', parent: 'q18', kind: 'challenge', uses: 'q12', title: 'Crossing a contour line',
 brief: 'A survey balloon is crossing one of the mast’s temperature contour lines, and the crew wants to know which line it is and how fast its reading is moving.',
 labels: ['contour level c (°C)', 'dT/dt (°C per hour)'], tolerance: 0.01 },
 [['x (km)', 'y (km)'], ['contour level c (°C)'], ['∂T/∂x', '∂T/∂y'], ['dT/dt (°C per hour)']], {
 canonical: { a: 1, b: -1, p: 1, q: 1, r: 1, u: 2, s: 1 },
 draw: R => { let o, v; do { o = { a: R.pick([-2, -1, 1, 2]), b: R.pick([-2, -1, 1, 2]), p: R.int(1, 3), q: R.nz(-2, 2), r: R.int(1, 3), u: R.nz(-2, 2), s: R.int(1, 2) }; v = v18d(o); }
  while (!v.X || !v.Y || !v.c || !v.Tx || !v.Ty || Math.abs(v.rate) >= 1000); return o; },
 build: ({ a, b, p, q, r, u, s }) => { const { X, Y, c, Tx, Ty, vx, rate } = v18d({ a, b, p, q, r, u, s });
  const F = ex([[a, 'x²y'], [b, 'y³']]), Fx = ex([[2 * a, 'xy']]), Fy = ex([[a, 'x²'], [3 * b, 'y²']]), xt = ex([[p, ''], [q, 't²']]), yt = ex([[r, ''], [u, 't']]);
  const cSum = sm([a * X * X * Y, b * Y ** 3]), step = `${par(Tx)} × ${par(vx)} + ${par(Ty)} × ${par(u)} = ${sm([Tx * vx, Ty * u])} = ${n(rate)}`; return {
  prompt: `A survey balloon drifts over the plain, where the air temperature at the point (x, y) is T(x, y) = ${F} degrees Celsius, with x and y in kilometres. t hours after release it is at x(t) = ${xt}, y(t) = ${yt}. At t = ${n(s)} the balloon is crossing one of the temperature contour lines. Enter the level c of that contour line, the temperature at the balloon. Then enter dT/dt there, the rate at which the balloon’s temperature is changing, in degrees per hour.`,
  answer: [c, rate],
  hints: ['The level c of the contour line through the balloon is the value of T at the balloon’s position at that time, so find the position first.', 'The multivariable chain rule: dT/dt = ∂T/∂x × dx/dt + ∂T/∂y × dy/dt, with the partial derivatives worked out at the balloon’s position.'],
  solution: `At t = ${n(s)} the balloon is at x = ${n(X)}, y = ${n(Y)}. The level of its contour line is T${pt(X, Y)} = ${cSum} = ${n(c)}. Next ∂T/∂x = ${Fx} = ${par(2 * a)} × ${par(X)} × ${par(Y)} = ${n(Tx)} and ∂T/∂y = ${Fy} = ${sm([a * X * X, 3 * b * Y * Y])} = ${n(Ty)}. Also dx/dt = ${ex([[2 * q, 't']])} = ${n(vx)} and dy/dt = ${n(u)}. So dT/dt = ${step} °C per hour.`,
  guidance: [
   { prompt: `Where is the balloon at t = ${n(s)}? Enter x(${n(s)}) and y(${n(s)}).`, answer: [X, Y], explanation: `x(${n(s)}) = ${sm([p, q * s * s])} = ${n(X)} and y(${n(s)}) = ${sm([r, u * s])} = ${n(Y)}.` },
   { prompt: `What is T${pt(X, Y)}, the level of the contour line the balloon is crossing?`, answer: [c], explanation: `T${pt(X, Y)} = ${cSum} = ${n(c)} °C.` },
   { prompt: `∂T/∂x = ${Fx} and ∂T/∂y = ${Fy}. What are they at ${pt(X, Y)}?`, answer: [Tx, Ty], explanation: `∂T/∂x = ${par(2 * a)} × ${par(X)} × ${par(Y)} = ${n(Tx)} and ∂T/∂y = ${sm([a * X * X, 3 * b * Y * Y])} = ${n(Ty)}.` },
   { prompt: `Here dx/dt = ${ex([[2 * q, 't']])} and dy/dt = ${n(u)}. What is dT/dt at t = ${n(s)}?`, answer: [rate], explanation: `dx/dt = ${n(vx)} at t = ${n(s)}, so dT/dt = ${step} °C per hour.` }
  ] }; }
});

/* ---- q19 Directional derivatives and the gradient [4.6] ---- */

/* q19b: wind speed w = ax²y + by²: w_x = 2axy, w_y = ax² + 2by. The course runs from (x, y) to (x + u, y + v), a vector
   of whole length L = 5 or 10, so the rate (w_x·u + w_y·v) ÷ L has at most one decimal. */
const v19b = ({ a, b, x, y, u, v }) => { const fx = 2 * a * x * y, fy = a * x * x + 2 * b * y, L = Math.hypot(u, v); return { fx, fy, L, ux: u / L, uy: v / L, rate: rd((fx * u + fy * v) / L, 1) }; };
practice({ id: 'q19b', parent: 'q19', kind: 'setting', title: 'Flying between two wind vanes',
 brief: 'A drone will fly straight from one wind vane to another, and the mast wants to know how the wind speed changes along the way.',
 labels: ['∇w first component', '∇w second component', 'rate along the course (m/s per km)'], tolerance: 0.01 },
 [['∂w/∂x', '∂w/∂y'], ['u first component', 'u second component'], ['rate (m/s per km)']], {
 canonical: { a: 1, b: 2, x: 2, y: 1, u: -4, v: 3 },
 draw: R => { let o, w; do { const [u, v] = R.pick(DIR); o = { a: R.pick([-2, -1, 1, 2]), b: R.nz(-3, 3), x: R.nz(-3, 3), y: R.nz(-3, 3), u, v }; w = v19b(o); } while (!w.fx || !w.fy); return o; },
 build: p => { const { a, b, x, y, u, v } = p, { fx, fy, L, ux, uy, rate } = v19b(p), P = pt(x, y), Q = pt(x + u, y + v), D = `⟨${n(u)}, ${n(v)}⟩`;
  const F = ex([[a, 'x²y'], [b, 'y²']]), Fx = ex([[2 * a, 'xy']]), Fy = ex([[a, 'x²'], [2 * b, 'y']]);
  const dot = `${par(fx)} × ${par(ux)} + ${par(fy)} × ${par(uy)} = ${sm([rd(fx * ux, 2), rd(fy * uy, 2)])} = ${n(rate)}`; return {
  prompt: `The wind-vane array on the plain measures the wind speed as w(x, y) = ${F} metres per second, with x and y in kilometres. One vane stands at ${P} and a second stands at ${Q}. A drone flies in a straight line from the first vane towards the second. Enter the two components of the gradient ∇w at the first vane. Then enter the directional derivative of w along the drone’s course, in metres per second per kilometre.`,
  answer: [fx, fy, rate],
  hints: ['The gradient is ∇w = ⟨∂w/∂x, ∂w/∂y⟩, worked out at the first vane.', 'The course points along the arrow from the first vane to the second: subtract the coordinates. Divide that arrow by its length to get a unit vector u, then take the dot product ∇w · u.'],
  solution: `∂w/∂x = ${Fx} = ${par(2 * a)} × ${par(x)} × ${par(y)} = ${n(fx)} and ∂w/∂y = ${Fy} = ${sm([a * x * x, 2 * b * y])} = ${n(fy)}, so ∇w${P} = ⟨${n(fx)}, ${n(fy)}⟩. The arrow from ${P} to ${Q} is ${D}, with length √(${n(u * u)} + ${n(v * v)}) = ${n(L)}, so the unit vector is u = ⟨${n(u)}/${n(L)}, ${n(v)}/${n(L)}⟩ = ⟨${n(ux)}, ${n(uy)}⟩. The directional derivative is ∇w · u = ${dot} metres per second per kilometre.`,
  guidance: [
   { prompt: `∂w/∂x = ${Fx} and ∂w/∂y = ${Fy}. What are the components of ∇w at ${P}?`, answer: [fx, fy], explanation: `∂w/∂x = ${par(2 * a)} × ${par(x)} × ${par(y)} = ${n(fx)} and ∂w/∂y = ${sm([a * x * x, 2 * b * y])} = ${n(fy)}, so ∇w${P} = ⟨${n(fx)}, ${n(fy)}⟩.` },
   { prompt: `The arrow from ${P} to ${Q} is ${D}, and its length is ${n(L)}. What are the components of the unit vector u along it, as decimals?`, answer: [ux, uy], explanation: `Divide each component by ${n(L)}: u = ⟨${n(u)}/${n(L)}, ${n(v)}/${n(L)}⟩ = ⟨${n(ux)}, ${n(uy)}⟩.` },
   { prompt: `What is the directional derivative ∇w · u?`, answer: [rate], explanation: `∇w · u = ${dot} metres per second per kilometre.` }
  ] }; }
});

/* q19c: T = k + ax² + bxy + cy² released at (x, y), heading ⟨u, v⟩ = m·⟨3, 4⟩ in some sign and order (length 5m), flown
   for h tenths of a kilometre. rate = (T_x u + T_y v) ÷ (5m) has at most one decimal; the estimate has two. */
const v19c = ({ k, a, b, c, x, y, u, v, h }) => { const fx = 2 * a * x + b * y, fy = b * x + 2 * c * y, L = Math.hypot(u, v), rate = rd((fx * u + fy * v) / L, 1), T0 = k + a * x * x + b * x * y + c * y * y;
 return { fx, fy, L, rate, T0, dist: h / 10, est: rd(T0 + rate * h / 10, 2), ux: u / L, uy: v / L }; };
practice({ id: 'q19c', parent: 'q19', kind: 'applied', title: 'The balloon’s warming trail',
 brief: 'A balloon released from the mast will drift in a steady direction, and the crew wants to know how much warmer or cooler the air will be a short way along its track.',
 labels: ['rate along the heading (°C per km)', 'estimated temperature (°C)'], tolerance: 0.005 },
 [['∂T/∂x', '∂T/∂y'], ['rate (°C per km)'], ['estimate (°C)']], {
 canonical: { k: 15, a: 1, b: 2, c: -1, x: 2, y: 1, u: 6, v: 8, h: 5 },
 draw: R => { let o, w; do { const [bu, bv] = R.pick(DIR5), m = R.int(1, 3); o = { k: R.int(10, 30), a: R.nz(-3, 3), b: R.nz(-3, 3), c: R.nz(-3, 3), x: R.nz(-3, 3), y: R.nz(-3, 3), u: bu * m, v: bv * m, h: R.pick([2, 5]) }; w = v19c(o); }
  while (!w.fx || !w.fy || !w.rate || w.T0 < 1); return o; },
 build: p => { const { k, a, b, c, x, y, u, v, h } = p, { fx, fy, L, rate, T0, dist, est, ux, uy } = v19c(p), P = pt(x, y), D = `⟨${n(u)}, ${n(v)}⟩`;
  const F = ex([[k, ''], [a, 'x²'], [b, 'xy'], [c, 'y²']]), Fx = ex([[2 * a, 'x'], [b, 'y']]), Fy = ex([[b, 'x'], [2 * c, 'y']]);
  const dot = `${par(fx)} × ${par(ux)} + ${par(fy)} × ${par(uy)} = ${sm([rd(fx * ux, 2), rd(fy * uy, 2)])} = ${n(rate)}`; return {
  prompt: `A weather balloon is released at the point ${P} of the plain, where the air temperature is T(x, y) = ${F} degrees Celsius, with x and y in kilometres. It drifts in a straight line in the direction of the vector ${D}. Enter the rate of change of the temperature along the balloon’s heading, in degrees per kilometre. Then assume the temperature keeps changing at that rate, and enter the estimated temperature after the balloon has drifted ${n(dist)} kilometres.`,
  answer: [rate, est],
  hints: ['Find the gradient of T at the release point, divide the heading by its length to get a unit vector, and take the dot product to get the rate per kilometre.', 'The change over a distance d is the rate times d. Add it to the temperature at the release point, which you get by putting that point into T(x, y).'],
  solution: `∂T/∂x = ${Fx} = ${sm([2 * a * x, b * y])} = ${n(fx)} and ∂T/∂y = ${Fy} = ${sm([b * x, 2 * c * y])} = ${n(fy)}, so ∇T${P} = ⟨${n(fx)}, ${n(fy)}⟩. The heading ${D} has length √(${n(u * u)} + ${n(v * v)}) = ${n(L)}, so u = ⟨${n(ux)}, ${n(uy)}⟩ and the rate is ∇T · u = ${dot} °C per kilometre. At the release point T${P} = ${sm([k, a * x * x, b * x * y, c * y * y])} = ${n(T0)}. After ${n(dist)} km the temperature is about ${n(T0)} + ${par(rate)} × ${n(dist)} = ${n(est)} °C.`,
  guidance: [
   { prompt: `∂T/∂x = ${Fx} and ∂T/∂y = ${Fy}. What are the components of ∇T at ${P}?`, answer: [fx, fy], explanation: `∂T/∂x = ${sm([2 * a * x, b * y])} = ${n(fx)} and ∂T/∂y = ${sm([b * x, 2 * c * y])} = ${n(fy)}.` },
   { prompt: `The heading ${D} has length ${n(L)}, so the unit vector is u = ⟨${n(ux)}, ${n(uy)}⟩. What is the rate ∇T · u, in degrees per kilometre?`, answer: [rate], explanation: `∇T · u = ${dot} °C per kilometre.` },
   { prompt: `The temperature at the release point is ${n(T0)} °C. What is the estimated temperature after ${n(dist)} km, if it keeps changing at ${n(rate)} °C per kilometre?`, answer: [est], explanation: `${n(T0)} + ${par(rate)} × ${n(dist)} = ${n(est)} °C.` }
  ] }; }
});

/* q19d: T = ax² + bxy + cy² + ex at (x, y), velocity ⟨u, v⟩ of whole speed 5 or 10 km/h: dT/dt = T_x u + T_y v by the
   chain rule, and the rate along the course is dT/dt ÷ speed, with at most one decimal. */
const v19d = ({ a, b, c, e, x, y, u, v }) => { const fx = 2 * a * x + b * y + e, fy = b * x + 2 * c * y, S = Math.hypot(u, v), dTdt = fx * u + fy * v; return { fx, fy, S, dTdt, rate: rd(dTdt / S, 1) }; };
practice({ id: 'q19d', parent: 'q19', kind: 'challenge', uses: 'q18', title: 'Rate in time, rate in distance',
 brief: 'A balloon’s thermometer is changing by so many degrees an hour, and the crew wants the same change as degrees per kilometre along its course.',
 labels: ['∇T first component', '∇T second component', 'dT/dt (°C per hour)', 'rate along the course (°C per km)'], tolerance: 0.01 },
 [['∂T/∂x', '∂T/∂y'], ['dT/dt (°C per hour)'], ['rate (°C per km)']], {
 canonical: { a: 1, b: 2, c: -1, e: 3, x: 2, y: 1, u: 3, v: -4 },
 draw: R => { let o, w; do { const [u, v] = R.pick(DIR); o = { a: R.nz(-3, 3), b: R.nz(-3, 3), c: R.nz(-3, 3), e: R.nz(-3, 3), x: R.nz(-3, 3), y: R.nz(-3, 3), u, v }; w = v19d(o); } while (!w.fx || !w.fy || !w.dTdt); return o; },
 build: p => { const { a, b, c, e, x, y, u, v } = p, { fx, fy, S, dTdt, rate } = v19d(p), P = pt(x, y), V = `⟨${n(u)}, ${n(v)}⟩`;
  const F = ex([[a, 'x²'], [b, 'xy'], [c, 'y²'], [e, 'x']]), Fx = ex([[2 * a, 'x'], [b, 'y'], [e, '']]), Fy = ex([[b, 'x'], [2 * c, 'y']]);
  const chain = `${par(fx)} × ${par(u)} + ${par(fy)} × ${par(v)} = ${sm([fx * u, fy * v])} = ${n(dTdt)}`; return {
  prompt: `A weather balloon is at the point ${P} of the plain, where the air temperature is T(x, y) = ${F} degrees Celsius, with x and y in kilometres. At that moment the balloon moves with velocity ${V} kilometres per hour, so x is changing at ${n(u)} and y at ${n(v)} kilometres per hour. Enter the two components of the gradient ∇T there. Then enter dT/dt, the rate at which the temperature at the balloon is changing, in degrees per hour. Then enter the directional derivative of T in the direction the balloon is moving, in degrees per kilometre.`,
  answer: [fx, fy, dTdt, rate],
  hints: ['The gradient is ∇T = ⟨∂T/∂x, ∂T/∂y⟩ at the point. The chain rule gives dT/dt = ∂T/∂x × dx/dt + ∂T/∂y × dy/dt, where dx/dt and dy/dt are the velocity components.', 'The directional derivative uses a unit vector: divide the velocity by the balloon’s speed, its length, and take the dot product with ∇T. It is the same as dT/dt divided by the speed.'],
  solution: `∂T/∂x = ${Fx} = ${sm([2 * a * x, b * y, e])} = ${n(fx)} and ∂T/∂y = ${Fy} = ${sm([b * x, 2 * c * y])} = ${n(fy)}, so ∇T${P} = ⟨${n(fx)}, ${n(fy)}⟩. By the multivariable chain rule, dT/dt = ${chain} °C per hour. The speed is √(${n(u * u)} + ${n(v * v)}) = ${n(S)} km per hour, so the unit vector along the course is ⟨${n(u / S)}, ${n(v / S)}⟩ and the directional derivative is ${n(dTdt)} ÷ ${n(S)} = ${n(rate)} °C per kilometre.`,
  guidance: [
   { prompt: `∂T/∂x = ${Fx} and ∂T/∂y = ${Fy}. What are the components of ∇T at ${P}?`, answer: [fx, fy], explanation: `∂T/∂x = ${sm([2 * a * x, b * y, e])} = ${n(fx)} and ∂T/∂y = ${sm([b * x, 2 * c * y])} = ${n(fy)}.` },
   { prompt: `With dx/dt = ${n(u)} and dy/dt = ${n(v)}, what is dT/dt = ∂T/∂x × dx/dt + ∂T/∂y × dy/dt?`, answer: [dTdt], explanation: `dT/dt = ${chain} °C per hour.` },
   { prompt: `The balloon’s speed is ${n(S)} km per hour and the temperature changes by ${n(dTdt)} °C each hour. How many degrees does it change per kilometre travelled?`, answer: [rate], explanation: `${n(dTdt)} ÷ ${n(S)} = ${n(rate)} °C per kilometre, which equals ∇T · u for the unit vector u along the course.` }
  ] }; }
});

/* ---- q20 Steepest ascent [4.6] ---- */

/* q20b: T = ax² + bxy + cy² + dx + ey at (x, y) with a gradient of whole length L. The angle with due north ⟨0, 1⟩ is
   arccos(T_y ÷ L), to 3 decimals, never near a rounding tie. Not the parent's question (angle from east). */
const v20b = ({ a, b, c, d, e, x, y }) => { const fx = 2 * a * x + b * y + d, fy = b * x + 2 * c * y + e, L = Math.hypot(fx, fy); return { fx, fy, L, th: Math.acos(fy / L) }; };
const ok20 = w => w.fx && w.fy && Number.isInteger(w.L) && !edge(w.th, 3);
practice({ id: 'q20b', parent: 'q20', kind: 'setting', title: 'The heat-seeking probe',
 brief: 'A heat-seeking probe on the plain must climb the temperature as fast as it can, and the crew needs its best rate and the heading to set it on.',
 labels: ['greatest rate (°C per km)', 'angle from north (radians)'], tolerance: 0.0005 },
 [['∂T/∂x', '∂T/∂y'], ['‖∇T‖'], ['angle θ (radians)']], {
 canonical: { a: 1, b: 1, c: -3, d: -1, e: 1, x: 2, y: 1 },
 draw: R => { let o, w; do { o = { a: R.nz(-3, 3), b: R.nz(-3, 3), c: R.nz(-3, 3), d: R.int(-4, 4), e: R.int(-4, 4), x: R.nz(-3, 3), y: R.nz(-3, 3) }; w = v20b(o); } while (!ok20(w)); return o; },
 build: p => { const { a, b, c, d, e, x, y } = p, { fx, fy, L, th } = v20b(p), P = pt(x, y), t3 = rd(th, 3);
  const F = ex([[a, 'x²'], [b, 'xy'], [c, 'y²'], [d, 'x'], [e, 'y']]), Fx = ex([[2 * a, 'x'], [b, 'y'], [d, '']]), Fy = ex([[b, 'x'], [2 * c, 'y'], [e, '']]); return {
  prompt: `A heat-seeking probe sits at ${P} on the plain, where the air temperature is T(x, y) = ${F} degrees Celsius, with x and y in kilometres (x points east and y points north). The probe must climb the temperature as fast as it can. Enter the greatest rate of increase of T at ${P}, in degrees per kilometre. Then enter the angle between the direction of steepest ascent and due north, the direction of ⟨0, 1⟩, in radians to 3 decimal places.`,
  answer: [L, t3],
  hints: ['The greatest rate of increase is the length of the gradient: ‖∇T‖ = √((∂T/∂x)² + (∂T/∂y)²).', 'The steepest way up is the direction of ∇T. The angle θ between ∇T and ⟨0, 1⟩ comes from the dot product: cos θ = (∇T · ⟨0, 1⟩) ÷ ‖∇T‖, with θ between 0 and π.'],
  solution: `∂T/∂x = ${Fx} = ${sm([2 * a * x, b * y, ...(d ? [d] : [])])} = ${n(fx)} and ∂T/∂y = ${Fy} = ${sm([b * x, 2 * c * y, ...(e ? [e] : [])])} = ${n(fy)}, so ∇T${P} = ⟨${n(fx)}, ${n(fy)}⟩. The greatest rate of increase is ‖∇T‖ = √(${n(fx * fx)} + ${n(fy * fy)}) = √${n(L * L)} = ${n(L)} degrees per kilometre, in the direction of ∇T. For the angle with ⟨0, 1⟩, ∇T · ⟨0, 1⟩ = ${n(fy)}, so cos θ = ${n(fy)} ÷ ${n(L)} and θ = arccos(${n(fy)} ÷ ${n(L)}), which is ${dpl(t3, 3)} radians to 3 decimal places.`,
  guidance: [
   { prompt: `∂T/∂x = ${Fx} and ∂T/∂y = ${Fy}. What are the components of ∇T at ${P}?`, answer: [fx, fy], explanation: `∂T/∂x = ${sm([2 * a * x, b * y, ...(d ? [d] : [])])} = ${n(fx)} and ∂T/∂y = ${sm([b * x, 2 * c * y, ...(e ? [e] : [])])} = ${n(fy)}.` },
   { prompt: `What is the length ‖∇T‖ of ⟨${n(fx)}, ${n(fy)}⟩?`, answer: [L], explanation: `${n(fx * fx)} + ${n(fy * fy)} = ${n(L * L)}, and √${n(L * L)} = ${n(L)}. That is the greatest rate of increase, in degrees per kilometre.` },
   { prompt: `cos θ = ${n(fy)} ÷ ${n(L)}. What is θ in radians, to 3 decimal places?`, answer: [t3], explanation: `θ = arccos(${n(fy)} ÷ ${n(L)}), which is ${dpl(t3, 3)} radians to 3 decimal places${fy < 0 ? ': more than π/2, because ∇T points partly south' : ''}.` }
  ] }; }
});

/* q20c: P = ax² + bxy + cy² + dx + ey with a gradient of whole length L. The drone flies at V km/h along ∇P and gains
   G = L·V·m pascals, m = mm ÷ 2 hours, so the time asked is m. */
const v20c = ({ a, b, c, d, e, x, y, V, mm }) => { const fx = 2 * a * x + b * y + d, fy = b * x + 2 * c * y + e, L = Math.hypot(fx, fy), m = mm / 2, D = V * m;
 return { fx, fy, L, m, per: L * V, G: L * V * m, D, X: rd(x + D * fx / L, 6), Y: rd(y + D * fy / L, 6) }; };
/* True when x has at most two decimal places. */
const two = x => Math.abs(x * 100 - Math.round(x * 100)) < 1e-6;
practice({ id: 'q20c', parent: 'q20', kind: 'applied', title: 'Chasing the pressure rise',
 brief: 'A pressure-chasing drone will fly the steepest way up at a steady speed, and the crew wants to know how fast the pressure it feels rises, how long it needs for a given gain and where it will be then.',
 labels: ['greatest rate (Pa per km)', 'pressure rise per hour (Pa)', 'time to gain (hours)', 'x at the end (km)', 'y at the end (km)'], tolerance: 0.005 },
 [['∂P/∂x', '∂P/∂y', '‖∇P‖'], ['rise per hour (Pa)', 'time (hours)'], ['x at the end (km)', 'y at the end (km)']], {
 canonical: { a: 1, b: 1, c: -3, d: -1, e: 1, x: 2, y: 1, V: 3, mm: 3 },
 draw: R => { let o, w; do { o = { a: R.nz(-3, 3), b: R.nz(-3, 3), c: R.nz(-3, 3), d: R.int(-4, 4), e: R.int(-4, 4), x: R.nz(-3, 3), y: R.nz(-3, 3), V: R.int(2, 5), mm: R.int(1, 6) }; w = v20c(o); }
  while (!(w.fx && w.fy && Number.isInteger(w.L) && w.m !== 1 && two(w.X) && two(w.Y))); return o; },
 build: p => { const { a, b, c, d, e, x, y, V } = p, { fx, fy, L, m, per, G, D, X, Y } = v20c(p), P = pt(x, y), u = `⟨${n(fx)}/${n(L)}, ${n(fy)}/${n(L)}⟩`;
  const F = ex([[a, 'x²'], [b, 'xy'], [c, 'y²'], [d, 'x'], [e, 'y']]), Fx = ex([[2 * a, 'x'], [b, 'y'], [d, '']]), Fy = ex([[b, 'x'], [2 * c, 'y'], [e, '']]); return {
  prompt: `Above the plain, the air pressure differs from its base level by P(x, y) = ${F} pascals, with x and y in kilometres. A drone at ${P} flies in a straight line in the direction of steepest ascent of the pressure at ${P}, at a steady ${n(V)} kilometres per hour. Assume the pressure it feels keeps rising at that greatest rate for the whole flight. Enter the greatest rate of increase of P at ${P}, in pascals per kilometre. Then enter how many pascals per hour the pressure at the drone rises. Then enter how many hours the drone needs to gain ${n(G)} pascals. Then enter the drone’s x and y coordinates at that moment, in kilometres (decimals are fine).`,
  answer: [L, per, m, X, Y],
  hints: ['The greatest rate of increase is the length of the gradient, ‖∇P‖, in pascals per kilometre.', 'The drone covers a fixed number of kilometres each hour, so pascals per hour is pascals per kilometre times kilometres per hour. Time needed is the gain wanted divided by the rise per hour.', 'The drone flies along the unit vector ∇P ÷ ‖∇P‖. Its distance flown is speed times time; add that distance times the unit vector to the start point.'],
  solution: `∂P/∂x = ${Fx} = ${sm([2 * a * x, b * y, ...(d ? [d] : [])])} = ${n(fx)} and ∂P/∂y = ${Fy} = ${sm([b * x, 2 * c * y, ...(e ? [e] : [])])} = ${n(fy)}, so ∇P${P} = ⟨${n(fx)}, ${n(fy)}⟩ and ‖∇P‖ = √(${n(fx * fx)} + ${n(fy * fy)}) = ${n(L)} pascals per kilometre. At ${n(V)} km per hour the pressure rises ${n(L)} × ${n(V)} = ${n(per)} pascals per hour. To gain ${n(G)} pascals takes ${n(G)} ÷ ${n(per)} = ${n(m)} hours. In that time the drone flies ${n(V)} × ${n(m)} = ${n(D)} km along the unit vector ${u}, so it ends at x = ${n(x)} + ${n(D)} × ${fx < 0 ? `(${n(fx)}/${n(L)})` : `${n(fx)}/${n(L)}`} = ${n(X)} and y = ${n(y)} + ${n(D)} × ${fy < 0 ? `(${n(fy)}/${n(L)})` : `${n(fy)}/${n(L)}`} = ${n(Y)}.`,
  guidance: [
   { prompt: `∂P/∂x = ${Fx} and ∂P/∂y = ${Fy}. What are the components of ∇P at ${P}, and its length ‖∇P‖, the greatest rate of increase in pascals per kilometre?`, answer: [fx, fy, L], explanation: `∂P/∂x = ${sm([2 * a * x, b * y, ...(d ? [d] : [])])} = ${n(fx)} and ∂P/∂y = ${sm([b * x, 2 * c * y, ...(e ? [e] : [])])} = ${n(fy)}. Then ${n(fx * fx)} + ${n(fy * fy)} = ${n(L * L)}, and √${n(L * L)} = ${n(L)} pascals per kilometre.` },
   { prompt: `The drone climbs ${n(L)} pascals per kilometre and flies ${n(V)} kilometres per hour. How many pascals per hour does the pressure rise, and how many hours does it take to gain ${n(G)} pascals?`, answer: [per, m], explanation: `${n(L)} × ${n(V)} = ${n(per)} pascals per hour, and ${n(G)} ÷ ${n(per)} = ${n(m)} hours.` },
   { prompt: `In ${n(m)} hours the drone flies ${n(V)} × ${n(m)} = ${n(D)} km along the unit vector ∇P ÷ ‖∇P‖ = ${u}. Where does it end? Enter its x and y coordinates.`, answer: [X, Y], explanation: `x = ${n(x)} + ${n(D)} × ${fx < 0 ? `(${n(fx)}/${n(L)})` : `${n(fx)}/${n(L)}`} = ${n(X)} and y = ${n(y)} + ${n(D)} × ${fy < 0 ? `(${n(fy)}/${n(L)})` : `${n(fy)}/${n(L)}`} = ${n(Y)}.` }
  ] }; }
});

/* q20d: D = ax² + bxy + cy² + dx + ey at (x, y) with a gradient of whole length L; a heading ⟨u, v⟩ of length 5. The rate
   along it is (D_x u + D_y v) ÷ 5, and cos θ = rate ÷ L. The heading is never along ∇D, and θ never sits near a rounding tie. */
const v20d = ({ a, b, c, d, e, x, y, u, v }) => { const fx = 2 * a * x + b * y + d, fy = b * x + 2 * c * y + e, L = Math.hypot(fx, fy), dot = fx * u + fy * v, rate = dot / 5; return { fx, fy, L, dot, rate, th: Math.acos(rate / L) }; };
practice({ id: 'q20d', parent: 'q20', kind: 'challenge', uses: 'q19', title: 'What the detour costs',
 brief: 'A dust-sampling drone is flying a fixed heading rather than the steepest way up, and the crew wants to know how much of the best rate it still gets.',
 labels: ['greatest rate (mg/m³ per km)', 'rate along the heading (mg/m³ per km)', 'angle from steepest ascent (radians)'], tolerance: 0.0005 },
 [['∂D/∂x', '∂D/∂y'], ['‖∇D‖', 'rate along the heading'], ['angle θ (radians)']], {
 canonical: { a: 1, b: 1, c: -3, d: -2, e: 1, x: 3, y: 2, u: 3, v: 4 },
 draw: R => { let o, w; do { const [u, v] = R.pick(DIR5); o = { a: R.nz(-3, 3), b: R.nz(-3, 3), c: R.nz(-3, 3), d: R.int(-4, 4), e: R.int(-4, 4), x: R.nz(-3, 3), y: R.nz(-3, 3), u, v }; w = v20d(o); }
  while (!(w.fx && w.fy && Number.isInteger(w.L) && Math.abs(w.rate) < w.L - 0.5 && !edge(w.th, 3))); return o; },
 build: p => { const { a, b, c, d, e, x, y, u, v } = p, { fx, fy, L, dot, rate, th } = v20d(p), P = pt(x, y), V = `⟨${n(u)}, ${n(v)}⟩`, t3 = rd(th, 3), ux = u / 5, uy = v / 5;
  const F = ex([[a, 'x²'], [b, 'xy'], [c, 'y²'], [d, 'x'], [e, 'y']]), Fx = ex([[2 * a, 'x'], [b, 'y'], [d, '']]), Fy = ex([[b, 'x'], [2 * c, 'y'], [e, '']]);
  const dsum = `${par(fx)} × ${par(ux)} + ${par(fy)} × ${par(uy)} = ${sm([rd(fx * ux, 2), rd(fy * uy, 2)])} = ${n(rate)}`; return {
  prompt: `The wind-vane array maps the dust density over the plain as D(x, y) = ${F} milligrams per cubic metre, with x and y in kilometres. A drone at ${P} is flying along the heading of the vector ${V}, not the steepest way up. Enter the greatest rate of increase of D at ${P}, per kilometre. Then enter the rate of change of D along the drone’s heading, per kilometre. Then enter the angle between the heading and the direction of steepest ascent, in radians to 3 decimal places.`,
  answer: [L, rate, t3],
  hints: ['The greatest rate is the length of the gradient. The rate along the heading is the dot product of ∇D with the unit vector in the heading’s direction: divide the heading by its length first.', 'The rate along any direction is ‖∇D‖ × cos θ, where θ is the angle between that direction and ∇D. So cos θ = (rate along the heading) ÷ ‖∇D‖, with θ between 0 and π.'],
  solution: `∂D/∂x = ${Fx} = ${sm([2 * a * x, b * y, ...(d ? [d] : [])])} = ${n(fx)} and ∂D/∂y = ${Fy} = ${sm([b * x, 2 * c * y, ...(e ? [e] : [])])} = ${n(fy)}, so ∇D${P} = ⟨${n(fx)}, ${n(fy)}⟩ and ‖∇D‖ = √(${n(fx * fx)} + ${n(fy * fy)}) = ${n(L)}. The heading ${V} has length 5, so u = ⟨${n(ux)}, ${n(uy)}⟩ and the rate along it is ∇D · u = ${dsum}. Then cos θ = ${n(rate)} ÷ ${n(L)}, so θ = arccos(${n(rate)} ÷ ${n(L)}), which is ${dpl(t3, 3)} radians to 3 decimal places.`,
  guidance: [
   { prompt: `∂D/∂x = ${Fx} and ∂D/∂y = ${Fy}. What are the components of ∇D at ${P}?`, answer: [fx, fy], explanation: `∂D/∂x = ${sm([2 * a * x, b * y, ...(d ? [d] : [])])} = ${n(fx)} and ∂D/∂y = ${sm([b * x, 2 * c * y, ...(e ? [e] : [])])} = ${n(fy)}.` },
   { prompt: `What is ‖∇D‖ for ⟨${n(fx)}, ${n(fy)}⟩? Then, with the unit heading u = ⟨${n(ux)}, ${n(uy)}⟩, what is the rate ∇D · u along the heading?`, answer: [L, rate], explanation: `‖∇D‖ = √(${n(fx * fx)} + ${n(fy * fy)}) = ${n(L)}, and ∇D · u = ${dsum}.` },
   { prompt: `cos θ = ${n(rate)} ÷ ${n(L)}. What is θ in radians, to 3 decimal places?`, answer: [t3], explanation: `θ = arccos(${n(rate)} ÷ ${n(L)}), which is ${dpl(t3, 3)} radians to 3 decimal places.` }
  ] }; }
});

})();
