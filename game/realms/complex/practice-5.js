/* Complex analysis: the plane of numbers practice missions, file 5 of 8: concepts q21–q25, three practice missions each
   (q21b q21c q21d q22b q22c q22d q23b q23c q23d q24b q24c q24d q25b q25c q25d).
   Format and rules: docs/PACK-FORMAT.md, "Practice missions" (§10).
     b  kind 'setting'    the same skill in a new real-world setting
     c  kind 'applied'    a word problem with two or three steps (two or three guided steps)
     d  kind 'challenge'  harder numbers, or the skill combined with one earlier concept (optional `uses: 'qNN'`)
   A practice mission supplies only: id, parent, kind, title, brief, prompt, answer, labels, tolerance, hints,
   solution, guidance (and `uses` for a challenge). Everything else comes from its parent, the learn mission:
   topic, tier, xp, sector, lesson, teaching, sources, the concept bench and the review drill. Do not write those.
   Each mission is registered together with its generator by add(mission, generator); build(canonical) must
   reproduce the authored prompt, hints, solution and guidance exactly. Oracles: qa/realms/complex/oracle-p5.js. */
(function(){
'use strict';
const G = window.Gen, { n, plus, par } = G;
const PRACTICE = window.PRACTICE = window.PRACTICE || [];
const GEN = window.MISSION_GEN = window.MISSION_GEN || {};
/* Registers one practice mission and its generator {canonical, draw(R), build(p)}. */
const add = (mission, generator) => { PRACTICE.push(mission); GEN[mission.id] = generator; };

/* Builds the authored mission from build(canonical), so the authored text and the generator can never drift apart.
   meta: id, parent, kind, title, brief, labels, tolerance, gl (the label of each guided step, one box each), uses (optional). */
const mk = (meta, gen) => {
 const b = gen.build(gen.canonical), { gl, ...m } = meta;
 add({ ...m, prompt: b.prompt, answer: b.answer, hints: b.hints, solution: b.solution,
  guidance: b.guidance.map((g, i) => ({ prompt: g.prompt, answer: g.answer, labels: gl[i], explanation: g.explanation })) }, gen);
};
const SUP = { 1: '¹', 2: '²', 3: '³', 4: '⁴' };
/* cx(3, −2) is '3 − 2i', cx(0, 1) is 'i', cx(−4, 0) is '−4': a complex number written the usual way. */
const cx = (re, im) => { if (im === 0) return n(re); const body = (Math.abs(im) === 1 ? '' : n(Math.abs(im))) + 'i';
 if (re === 0) return (im < 0 ? '−' : '') + body; return `${n(re)} ${im < 0 ? '−' : '+'} ${body}`; };
/* z − a for a complex a: 'z − 3', 'z + 2', 'z − 2i', 'z − (1 + 2i)', or 'z' when a is 0; zp is the same in brackets. */
const zm = (re, im = 0) => { if (re === 0 && im === 0) return 'z';
 if (im === 0) return re > 0 ? `z − ${n(re)}` : `z + ${n(-re)}`;
 if (re === 0) return `z ${im > 0 ? '−' : '+'} ${cx(0, Math.abs(im))}`;
 return `z − (${cx(re, im)})`; };
const zp = (re, im = 0) => (re === 0 && im === 0) ? 'z' : `(${zm(re, im)})`;
/* zp(c) raised to the power m (m = 1 leaves it bare). */
const mp = (z, m) => m === 1 ? z : z + SUP[m];
/* The circle |z − c| = r for a real centre c. */
const circ = (c, r) => `|${zm(c)}| = ${n(r)}`;
/* A polynomial from its coefficients, highest power first: poly([2, −3, 5], 'z') is '2z² − 3z + 5'. */
const poly = (cs, v) => { const deg = cs.length - 1; let out = '';
 cs.forEach((c, i) => { const p = deg - i; if (c === 0) return; const a = Math.abs(c), body = p === 0 ? n(a) : (a === 1 ? '' : n(a)) + v + (p > 1 ? SUP[p] : '');
  out += out ? (c < 0 ? ' − ' : ' + ') + body : (c < 0 ? '−' : '') + body; });
 return out || '0'; };
/* Signed sum of numbers as worked, zeros left out: sum([8, −6, 5]) is '8 − 6 + 5'; eq adds '= value' unless that repeats it. */
const sum = list => { const l = list.filter(v => v !== 0); return l.length ? l.map((v, i) => i ? (v < 0 ? ' − ' : ' + ') + n(Math.abs(v)) : n(v)).join('') : '0'; };
const eq = (list, v) => { const t = sum(list); return t === n(v) ? t : `${t} = ${n(v)}`; };
const fact = k => k <= 1 ? 1 : k * fact(k - 1);
/* k πi as text: '12πi', '−10πi', or '0' when k is 0. */
const kpi = k => k === 0 ? '0' : `${n(k)}πi`;
/* The derivative symbol for n = 1, 2, 3: f′, f′′, f⁽³⁾. */
const der = (k, f = 'f') => k === 1 ? f + '′' : k === 2 ? f + '′′' : f + '⁽' + SUP[k] + '⁾';
const sg = x => x < 0 ? '−' : '+';
const ab = x => n(Math.abs(x));
/* 'once', 'twice', '3 times'; turns(m) with a direction: 'twice anticlockwise', 'once clockwise'. */
const times = m => m === 1 ? 'once' : m === 2 ? 'twice' : `${n(m)} times`;
const turns = m => times(Math.abs(m)) + (m > 0 ? ' anticlockwise' : ' clockwise');
/* The point p + qi, squared distance from the real centre c, and whether it is inside |z − c| = r with |d² − r²| at least 2 (never on the circle). */
const d2c = (p, q, c) => (p - c) * (p - c) + q * q;
const fitsC = (p, q, c, r, inside) => { const d = d2c(p, q, c), r2 = r * r; return (d < r2) === inside && Math.abs(d - r2) >= 2; };
const same = (p, q) => Object.keys(q).every(k => p[k] === q[k]);
/* A bounded search for a draw that passes ok(); after 1000 tries the canonical parameters. */
const retry = (make, ok, canonical) => { for (let i = 0; i < 1000; i++) { const p = make(); if (ok(p)) return p; } return canonical; };

/* ---- q21 Cauchy's theorem [4.6] ---- */

mk({
 id: 'q21b', parent: 'q21', kind: 'setting', title: 'The cable round the pumps',
 brief: 'A cable is being laid round the pump yard, and the crew wants to know which pump fields it will pick up.',
 labels: ['k for pump A', 'k for pump B'], tolerance: 0.01,
 gl: [['|a|²'], ['k for pump A'], ['k for pump B']]
}, {
 /* Pump A at a = p + qi, pump B on the imaginary axis at si. Not the worked example (4 − i and 1 − i round |z| = 2). */
 canonical: { p: 5, q: -3, R: 4, s: 2 },
 draw: R => { const inA = R.bool(), inB = R.bool(); return retry(() => ({ R: R.int(2, 6), p: R.nz(-6, 6), q: R.nz(-6, 6), s: R.nz(-6, 6) }),
  x => fitsC(x.p, x.q, 0, x.R, inA) && Math.abs(x.s) !== x.R && (Math.abs(x.s) < x.R) === inB && !(x.R === 2 && x.q === -1 && (x.p === 4 || x.p === 1)), { p: 5, q: -3, R: 4, s: 2 }); },
 build: ({ p, q, R, s }) => { const A = cx(p, q), B = cx(0, s), d2 = p * p + q * q, R2 = R * R, inA = d2 < R2, inB = Math.abs(s) < R, kA = inA ? 2 : 0, kB = inB ? 2 : 0; return {
  prompt: `A cable is laid in the circle |z| = ${n(R)} and run once anticlockwise. Two pumps make fields along it. Pump A sits at a = ${A} and makes the field 1 ÷ ${zp(p, q)}; pump B sits at b = ${B} and makes the field 1 ÷ ${zp(0, s)}. Round the cable, enter k in ∮ dz ÷ ${zp(p, q)} = kπi for pump A, then k in ∮ dz ÷ ${zp(0, s)} = kπi for pump B.`,
  answer: [kA, kB],
  hints: ['A point is inside the circle |z| = R when its distance from the origin is less than R. For a point p + qi that means p² + q² < R², so compare squares and no square root is needed. A point si on the imaginary axis is |s| from the origin.',
   'Cauchy’s theorem: if a function is analytic at every point on and inside the loop, its integral round the loop is zero. If the one bad point is inside, the loop can be shrunk to a small circle round it, and the integral is the value for ∮ dz ÷ (z − a) round a circle that holds a.'],
  solution: `|a|² = ${par(p)}² + ${par(q)}² = ${n(d2)} and R² = ${n(R2)}. ${inA ? `${n(d2)} is less than ${n(R2)}, so a is inside the cable, and shrinking the cable to a small circle round a gives 2πi: k = 2.` : `${n(d2)} is more than ${n(R2)}, so a is outside the cable. The field is analytic on and inside the cable, so Cauchy’s theorem gives 0: k = 0.`} Pump B is ${n(Math.abs(s))} from 0, ${inB ? 'less' : 'more'} than ${n(R)}, so it is ${inB ? 'inside' : 'outside'}${inB ? ', and the same shrinking argument gives 2πi: k = 2.' : ', and Cauchy’s theorem gives 0: k = 0.'}`,
  guidance: [
   { prompt: `How far is a = ${A} from 0, squared? Work out |a|² = (Re a)² + (Im a)². The cable has R² = ${n(R2)}.`, answer: [d2], explanation: `|a|² = ${par(p)}² + ${par(q)}² = ${n(d2)}, which is ${inA ? 'less' : 'more'} than ${n(R2)}, so a is ${inA ? 'inside' : 'outside'} the cable.` },
   { prompt: `What is k in ∮ dz ÷ ${zp(p, q)} = kπi for pump A?`, answer: [kA], explanation: inA ? 'The bad point is inside, so the cable can be shrunk to a small circle round a, which gives 2πi: k = 2.' : 'The function is analytic on and inside the cable, so Cauchy’s theorem gives 0: k = 0.' },
   { prompt: `Pump B is at ${B}, which is ${n(Math.abs(s))} from 0. What is k in ∮ dz ÷ ${zp(0, s)} = kπi?`, answer: [kB], explanation: `${n(Math.abs(s))} is ${inB ? 'less' : 'more'} than the radius ${n(R)}, so b is ${inB ? 'inside, and the integral is 2πi: k = 2' : 'outside, and Cauchy’s theorem gives 0: k = 0'}.` }
  ] }; }
});

mk({
 id: 'q21c', parent: 'q21', kind: 'applied', title: 'Which feeds reach the road',
 brief: 'Three feeds run into the ring road from different corners of the plain, and the control room wants one reading for all of them.',
 labels: ['feeds inside', 'k for the total'], tolerance: 0.01,
 gl: [['|a₃|²'], ['feeds inside'], ['k for the total']]
}, {
 /* Feeds 1 and 2 at real points, feed 3 at p + qi; at least one is inside. */
 canonical: { R: 4, a1: -2, a2: 6, p: 3, q: -1 },
 draw: R => { const in3 = R.bool(); return retry(() => ({ R: R.int(2, 6), a1: R.nz(-8, 8), a2: R.nz(-8, 8), p: R.nz(-6, 6), q: R.nz(-6, 6) }),
  x => x.a1 !== x.a2 && Math.abs(x.a1) !== x.R && Math.abs(x.a2) !== x.R && fitsC(x.p, x.q, 0, x.R, in3) && (Math.abs(x.a1) < x.R || Math.abs(x.a2) < x.R || in3), { R: 4, a1: -2, a2: 6, p: 3, q: -1 }); },
 build: ({ R, a1, a2, p, q }) => { const A3 = cx(p, q), d2 = p * p + q * q, R2 = R * R, in1 = Math.abs(a1) < R, in2 = Math.abs(a2) < R, in3 = d2 < R2, cnt = +in1 + +in2 + +in3, k = 2 * cnt,
  F = `1 ÷ ${zp(a1)} + 1 ÷ ${zp(a2)} + 1 ÷ ${zp(p, q)}`, side = (x, y) => `${y ? 'inside' : 'outside'}`; return {
  prompt: `Three feeds run into the ring road, the circle |z| = ${n(R)}, driven once anticlockwise. Feed 1 sits at the point ${n(a1)}, feed 2 at ${n(a2)} and feed 3 at ${A3}, and each makes a field of the form 1 ÷ (z − its point). The control room records the total field, ${F}. The integral of a sum is the sum of the integrals of its terms. Enter how many of the three feeds sit inside the road, then k in ∮ (${F}) dz = kπi.`,
  answer: [cnt, k],
  hints: ['A point is inside the circle |z| = R when its distance from the origin is less than R. A real point a is inside when |a| < R. For p + qi compare p² + q² with R², so no square root is needed.',
   'Take the terms one at a time. A feed that sits inside adds the same fixed amount to the total, the value of ∮ dz ÷ (z − a) round a circle that holds a, and a feed outside adds zero by Cauchy’s theorem.'],
  solution: `Feed 1 is ${n(Math.abs(a1))} from 0, ${in1 ? 'less' : 'more'} than ${n(R)}, so it is ${side(0, in1)}. Feed 2 is ${n(Math.abs(a2))} from 0, ${in2 ? 'less' : 'more'} than ${n(R)}, so it is ${side(0, in2)}. For feed 3, |a|² = ${par(p)}² + ${par(q)}² = ${n(d2)}, ${in3 ? 'less' : 'more'} than R² = ${n(R2)}, so it is ${side(0, in3)}. ${n(cnt)} of the feeds ${cnt === 1 ? 'is' : 'are'} inside. Each feed inside gives 2πi and each feed outside gives 0, so the total is ${n(cnt)} × 2πi = ${kpi(k)}: k = ${n(k)}.`,
  guidance: [
   { prompt: `Feeds 1 and 2 are on the real line, so only feed 3 needs a sum of squares. Work out |a₃|² = (Re a₃)² + (Im a₃)² for a₃ = ${A3}.`, answer: [d2], explanation: `|a₃|² = ${par(p)}² + ${par(q)}² = ${n(d2)}, ${in3 ? 'less' : 'more'} than R² = ${n(R2)}, so feed 3 is ${side(0, in3)}.` },
   { prompt: `Feed 1 is ${n(Math.abs(a1))} from 0 and feed 2 is ${n(Math.abs(a2))} from 0; the road has radius ${n(R)}. Counting feed 3 as well, how many feeds are inside?`, answer: [cnt], explanation: `Feed 1 is ${side(0, in1)}, feed 2 is ${side(0, in2)} and feed 3 is ${side(0, in3)}, so ${n(cnt)} ${cnt === 1 ? 'is' : 'are'} inside.` },
   { prompt: `Each feed inside gives 2πi and each feed outside gives 0. What is k for the total field?`, answer: [k], explanation: `${n(cnt)} × 2πi = ${kpi(k)}, so k = ${n(k)}.` }
  ] }; }
});

mk({
 id: 'q21d', parent: 'q21', kind: 'challenge', uses: 'q20', title: 'The beacon and the relay',
 brief: 'A service loop runs round a relay that is not at the origin, and a beacon somewhere on the plain may or may not be inside it.',
 labels: ['k for the beacon', 'k for the total'], tolerance: 0.01,
 gl: [['|a − c|²'], ['k for the beacon'], ['k for the relay']]
}, {
 /* Loop |z − c| = r with c real and non-zero; beacon at p + qi; relay term 1 ÷ (z − c)^m with m = 1, 2 or 3. */
 canonical: { c: -2, r: 3, p: -1, q: 1, m: 1 },
 draw: R => { const inA = R.next() < 0.6; return retry(() => ({ c: R.nz(-5, 5), r: R.int(2, 6), p: R.int(-7, 7), q: R.nz(-6, 6), m: R.pick([1, 1, 2, 3]) }),
  x => fitsC(x.p, x.q, x.c, x.r, inA), { c: -2, r: 3, p: -1, q: 1, m: 1 }); },
 build: ({ c, r, p, q, m }) => { const A = cx(p, q), d = d2c(p, q, c), r2 = r * r, inA = d < r2, kA = inA ? 2 : 0, kC = m === 1 ? 2 : 0, K = kA + kC, rel = `1 ÷ ${mp(zp(c), m)}`; return {
  prompt: `A service loop is the circle ${circ(c, r)}, driven once anticlockwise. A beacon at a = ${A} makes the field 1 ÷ ${zp(p, q)}, and a relay at the centre of the loop, the point ${n(c)}, makes the field ${rel}. The integral of a sum is the sum of the integrals of its terms. Enter k in ∮ dz ÷ ${zp(p, q)} = kπi for the beacon alone, then k in ∮ (1 ÷ ${zp(p, q)} + ${rel}) dz = kπi for both fields together.`,
  answer: [kA, K],
  hints: ['A point a is inside the circle |z − c| = r when its distance from the centre c is less than r. For a = p + qi that means (p − c)² + q² < r², so compare squares. Be careful: the centre is not the origin here.',
   'Round a circle centred on c, a power (z − c)ⁿ with n a whole number gives the value of ∮ dz ÷ (z − c) when n = −1 and zero for every other whole n. The beacon term follows Cauchy’s theorem: it gives that same value if a is inside the loop and zero if it is outside. Add the pieces.'],
  solution: `The centre is ${n(c)}, so |a − c|² = (${par(p)} − ${par(c)})² + ${par(q)}² = ${n(d)} and r² = ${n(r2)}. ${n(d)} is ${inA ? 'less' : 'more'} than ${n(r2)}, so the beacon is ${inA ? 'inside' : 'outside'} the loop and gives ${inA ? '2πi: k = 2' : '0: k = 0'}. The relay term is ${rel}, ${m === 1 ? 'the power −1 of (z − c), which gives 2πi: 2' : `the power −${n(m)} of (z − c), which gives 0: 0`}. Together k = ${n(kA)} + ${n(kC)} = ${n(K)}.`,
  guidance: [
   { prompt: `Is the beacon inside the loop? Work out |a − c|² = (Re a − c)² + (Im a)² for a = ${A} and c = ${n(c)}, to compare with r² = ${n(r2)}.`, answer: [d], explanation: `(${par(p)} − ${par(c)})² + ${par(q)}² = ${n(d)}, ${inA ? 'less' : 'more'} than ${n(r2)}, so the beacon is ${inA ? 'inside' : 'outside'}.` },
   { prompt: `What is k in ∮ dz ÷ ${zp(p, q)} = kπi round this loop?`, answer: [kA], explanation: inA ? 'The beacon is inside, so the integral is 2πi: k = 2.' : 'The beacon is outside, so Cauchy’s theorem gives 0: k = 0.' },
   { prompt: `The relay term is ${rel}, a power of (z − c) round a circle centred on c. What is k for it alone?`, answer: [kC], explanation: m === 1 ? 'The power is −1, so the integral is 2πi: k = 2.' : `The power is −${n(m)}, not −1, so the integral is 0: k = 0.` }
  ] }; }
});

/* ---- q22 Holes and winding numbers [4.7] ---- */

mk({
 id: 'q22b', parent: 'q22', kind: 'setting', title: 'The line-painting truck',
 brief: 'A truck repaints the lines of the ring road lap after lap, and the radio post beside the road sends a signal the log must total.',
 labels: ['winding number', 'k'], tolerance: 0.01,
 gl: [['distance from 0'], ['winding number'], ['k']]
}, {
 /* A radio post at the real point s, signal C ÷ (z − s), C may be negative. Not the worked example (once clockwise round 2i, C = 5). */
 canonical: { m: -3, R: 5, s: 2, C: -3 },
 draw: R => { const inside = R.next() < 0.75; return retry(() => ({ m: R.pick([-4, -3, -2, -1, 1, 2, 3, 4]), R: R.int(2, 6), s: R.nz(-8, 8), C: R.pick([-1, 1]) * R.int(2, 6) }),
  x => Math.abs(x.s) !== x.R && (Math.abs(x.s) < x.R) === inside, { m: -3, R: 5, s: 2, C: -3 }); },
 build: ({ m, R, s, C }) => { const inside = Math.abs(s) < R, w = inside ? m : 0, k = 2 * C * w; return {
  prompt: `A line-painting truck drives round the ring road, the circle |z| = ${n(R)}, ${turns(m)} without stopping, and ends where it started. A radio post stands at the real point a = ${n(s)} and sends the signal ${n(C)} ÷ ${zp(s)} along the road. Enter the winding number of the truck’s path round the post, then k in ∮ ${n(C)} ÷ ${zp(s)} dz = kπi along the whole path.`,
  answer: [w, k],
  hints: ['The winding number counts the net turns round the post: each anticlockwise turn counts +1 and each clockwise turn −1. A post outside the circle is never turned round, so its winding number is zero.',
   'Every anticlockwise turn round a adds 2πi to ∮ dz ÷ (z − a), and a number on top of the fraction multiplies the whole integral: ∮ C ÷ (z − a) dz = 2πi × C × (winding number). Keep the sign of C.'],
  solution: `The post is ${n(Math.abs(s))} from 0, ${inside ? 'less' : 'more'} than R = ${n(R)}, so it is ${inside ? 'inside' : 'outside'} the circle. ${inside ? `The path goes round it ${turns(m)}, so its winding number is ${n(m)}.` : 'The path never goes round it, so its winding number is 0.'} The integral is 2πi × ${par(C)} × ${par(w)} = ${kpi(k)}, so k = ${n(k)}.`,
  guidance: [
   { prompt: `How far is the post at a = ${n(s)} from 0? The road has radius ${n(R)}.`, answer: [Math.abs(s)], explanation: `|${n(s)}| = ${n(Math.abs(s))}, ${inside ? 'less' : 'more'} than ${n(R)}, so the post is ${inside ? 'inside' : 'outside'} the road.` },
   { prompt: `The truck goes round the circle ${turns(m)}. What is the winding number of its path round the post?`, answer: [w], explanation: inside ? `Each lap goes round the post, and ${m > 0 ? 'anticlockwise turns count +1' : 'clockwise turns count −1'}, so the winding number is ${n(m)}.` : 'The path never goes round a point outside the circle, so the winding number is 0.' },
   { prompt: `What is k in ∮ ${n(C)} ÷ ${zp(s)} dz = kπi?`, answer: [k], explanation: `2πi × ${par(C)} × ${par(w)} = ${kpi(k)}, so k = ${n(k)}.` }
  ] }; }
});

mk({
 id: 'q22c', parent: 'q22', kind: 'applied', title: 'Out and back round the ring',
 brief: 'A maintenance truck drives several laps one way and then some the other way, and the logger wants the net reading from two relays.',
 labels: ['winding number', 'k'], tolerance: 0.01,
 gl: [['winding number'], ['sum of the multipliers inside'], ['k']]
}, {
 /* Relay A at p + qi with multiplier CA, relay B at the real point b with multiplier CB; at least one inside and the multipliers inside never cancel. */
 canonical: { R: 4, m1: 5, m2: 2, p: -2, q: 1, CA: 3, b: -3, CB: -5 },
 draw: R => { const inA = R.bool(); return retry(() => ({ R: R.int(2, 6), m1: R.int(2, 5), m2: R.int(1, 4), p: R.nz(-6, 6), q: R.nz(-6, 6), CA: R.pick([-1, 1]) * R.int(2, 6), b: R.nz(-8, 8), CB: R.pick([-1, 1]) * R.int(2, 6) }),
  x => x.m1 !== x.m2 && fitsC(x.p, x.q, 0, x.R, inA) && Math.abs(x.b) !== x.R && ((inA ? x.CA : 0) + (Math.abs(x.b) < x.R ? x.CB : 0)) !== 0, { R: 4, m1: 5, m2: 2, p: -2, q: 1, CA: 3, b: -3, CB: -5 }); },
 build: ({ R, m1, m2, p, q, CA, b, CB }) => { const A = cx(p, q), d2 = p * p + q * q, R2 = R * R, inA = d2 < R2, inB = Math.abs(b) < R, w = m1 - m2, S = (inA ? CA : 0) + (inB ? CB : 0), k = 2 * w * S,
  F = `${n(CA)} ÷ ${zp(p, q)} ${sg(CB)} ${ab(CB)} ÷ ${zp(b)}`, side = y => y ? 'inside' : 'outside',
  parts = [inA ? n(CA) : null, inB ? n(CB) : null].filter(v => v !== null); return {
  prompt: `A maintenance truck drives round the ring road, the circle |z| = ${n(R)}, ${times(m1)} anticlockwise and then ${times(m2)} clockwise, and stops where it started. Two relays stand on the plain: relay A at a = ${A} sends the signal ${n(CA)} ÷ ${zp(p, q)}, and relay B at b = ${n(b)} sends the signal ${n(CB)} ÷ ${zp(b)}. The truck’s logger adds the two signals and records their integral along the whole path. An anticlockwise turn counts +1 and a clockwise turn counts −1. Enter the winding number of the path round a point inside the circle, then k in ∮ (${F}) dz = kπi along the whole path.`,
  answer: [w, k],
  hints: ['The winding number counts net turns: the anticlockwise turns count +1 each and the clockwise turns −1 each, so first add them with their signs. A point outside the circle is never turned round.',
   'Take the terms one at a time. A term C ÷ (z − a) with a inside gives 2πi × C × (winding number), and a term with a outside gives zero. Add the numbers C of the relays that are inside before you multiply.'],
  solution: `The path makes ${n(m1)} anticlockwise turns and ${n(m2)} clockwise turns, so the winding number round a point inside is ${n(m1)} − ${n(m2)} = ${n(w)}. For relay A, |a|² = ${par(p)}² + ${par(q)}² = ${n(d2)}, ${inA ? 'less' : 'more'} than R² = ${n(R2)}, so it is ${side(inA)}. Relay B is ${n(Math.abs(b))} from 0, ${inB ? 'less' : 'more'} than ${n(R)}, so it is ${side(inB)}. The multipliers inside add up to ${parts.length === 2 ? `${n(CA)} + ${par(CB)} = ${n(S)}` : n(S)}. The integral is 2πi × ${par(S)} × ${par(w)} = ${kpi(k)}, so k = ${n(k)}.`,
  guidance: [
   { prompt: `The path makes ${n(m1)} anticlockwise turns, each +1, and ${n(m2)} clockwise turns, each −1. What is the winding number round a point inside the circle?`, answer: [w], explanation: `${n(m1)} − ${n(m2)} = ${n(w)}.` },
   { prompt: `Which relays are inside the circle? Relay A has |a|² = ${n(d2)} against R² = ${n(R2)}, and relay B is ${n(Math.abs(b))} from 0 against R = ${n(R)}. Add the multipliers (the numbers on top) of the relays that are inside.`, answer: [S], explanation: `Relay A is ${side(inA)} and relay B is ${side(inB)}, so the sum is ${parts.length === 2 ? `${n(CA)} + ${par(CB)} = ${n(S)}` : n(S)}.` },
   { prompt: `The integral is 2πi × (sum of the multipliers inside) × (winding number). What is k?`, answer: [k], explanation: `2πi × ${par(S)} × ${par(w)} = ${kpi(k)}, so k = ${n(k)}.` }
  ] }; }
});

mk({
 id: 'q22d', parent: 'q22', kind: 'challenge', uses: 'q19', title: 'The drone and the calibration field',
 brief: 'A drone flies several laps of the ring road with a calibration field added to the signal, and only the beacon should count.',
 labels: ['winding number', 'k'], tolerance: 0.01,
 gl: [['|a|²'], ['winding number'], ['k']]
}, {
 /* Field C ÷ (z − a) + D z² + E, a = p + qi, path m laps of |z| = R. Not the worked example (once clockwise round 2i, 5 ÷ (z − 2i)). */
 canonical: { m: -2, R: 5, p: -3, q: 2, C: 4, D: 3, E: -5 },
 draw: R => { const inside = R.next() < 0.75; return retry(() => ({ m: R.pick([-4, -3, -2, 2, 3, 4]), R: R.int(2, 6), p: R.nz(-6, 6), q: R.nz(-6, 6), C: R.pick([-1, 1]) * R.int(2, 6), D: R.int(1, 4), E: R.nz(-6, 6) }),
  x => fitsC(x.p, x.q, 0, x.R, inside), { m: -2, R: 5, p: -3, q: 2, C: 4, D: 3, E: -5 }); },
 build: ({ m, R, p, q, C, D, E }) => { const A = cx(p, q), d2 = p * p + q * q, R2 = R * R, inside = d2 < R2, w = inside ? m : 0, k = 2 * C * w, P = poly([D, 0, E], 'z'),
  F = `${n(C)} ÷ ${zp(p, q)} + ${P}`; return {
  prompt: `A drone flies the ring road, the circle |z| = ${n(R)}, ${turns(m)} without stopping, and lands where it started. A beacon at a = ${A} sends the signal ${n(C)} ÷ ${zp(p, q)}, and a calibration field ${P} is added to it, so the total field along the road is ${F}. Enter the winding number of the drone’s path round a, then k in ∮ (${F}) dz = kπi along the whole path.`,
  answer: [w, k],
  hints: ['A power of z, or a constant, has an antiderivative. Over a path that ends where it starts, the integral is the antiderivative at the end minus the same antiderivative at the start, which is zero. So only the beacon term can contribute.',
   'The winding number counts net turns round a: each anticlockwise turn is +1, each clockwise turn −1, and a point outside the circle is never turned round. The beacon term gives 2πi × (its number on top) × (winding number).'],
  solution: `The calibration field ${P} has an antiderivative, and the path ends where it starts, so it gives 0. For the beacon, |a|² = ${par(p)}² + ${par(q)}² = ${n(d2)}, ${inside ? 'less' : 'more'} than R² = ${n(R2)}, so a is ${inside ? 'inside' : 'outside'} the circle. ${inside ? `The path goes round a ${turns(m)}, so its winding number is ${n(m)}.` : 'The path never goes round a, so its winding number is 0.'} The integral is 2πi × ${par(C)} × ${par(w)} = ${kpi(k)}, so k = ${n(k)}.`,
  guidance: [
   { prompt: `Is the beacon inside the road? Work out |a|² = (Re a)² + (Im a)² for a = ${A}, to compare with R² = ${n(R2)}.`, answer: [d2], explanation: `|a|² = ${par(p)}² + ${par(q)}² = ${n(d2)}, ${inside ? 'less' : 'more'} than ${n(R2)}, so a is ${inside ? 'inside' : 'outside'}.` },
   { prompt: `The drone goes round the circle ${turns(m)}. What is the winding number of its path round a?`, answer: [w], explanation: inside ? `Each lap goes round a, and ${m > 0 ? 'anticlockwise turns count +1' : 'clockwise turns count −1'}, so the winding number is ${n(m)}.` : 'The path never goes round a point outside the circle, so the winding number is 0.' },
   { prompt: `The calibration field gives 0 because it has an antiderivative. What is k for the beacon term ${n(C)} ÷ ${zp(p, q)}, and so for the total?`, answer: [k], explanation: `2πi × ${par(C)} × ${par(w)} = ${kpi(k)}, so k = ${n(k)}.` }
  ] }; }
});

/* ---- q23 Chapter review: once round the ring road [4.5, 4.6] ---- */

mk({
 id: 'q23b', parent: 'q23', kind: 'setting', title: 'Two readings at the pump house',
 brief: 'The pump house log ends its shift with a reading round the whole yard and a reading round the master pump.',
 labels: ['k for the yard loop', 'k for the pump loop'], tolerance: 0.01,
 gl: [['points inside'], ['k for the yard loop'], ['k for the pump loop']]
}, {
 /* Yard loop |z| = R with three real bad points, one or two of them inside; pump loop |z − c| = r with D(z − c)⁻³ + E(z − c)⁻¹ + F(z − c)². */
 canonical: { R: 5, a: -2, A: 3, b: 4, B: -5, d: 7, C: 2, c: 1, r: 2, D: 4, E: -3, F: 5 },
 draw: R => retry(() => ({ R: R.int(3, 6), a: R.nz(-8, 8), A: R.pick([-1, 1]) * R.int(2, 9), b: R.nz(-8, 8), B: R.pick([-1, 1]) * R.int(2, 9), d: R.nz(-8, 8), C: R.pick([-1, 1]) * R.int(2, 9),
   c: R.int(-4, 4), r: R.int(1, 3), D: R.int(2, 9), E: R.pick([-1, 1]) * R.int(2, 9), F: R.pick([-1, 1]) * R.int(2, 9) }),
  x => { const ins = [Math.abs(x.a) < x.R, Math.abs(x.b) < x.R, Math.abs(x.d) < x.R], cnt = ins.filter(Boolean).length, S = (ins[0] ? x.A : 0) + (ins[1] ? x.B : 0) + (ins[2] ? x.C : 0);
   return x.a !== x.b && x.a !== x.d && x.b !== x.d && Math.abs(x.a) !== x.R && Math.abs(x.b) !== x.R && Math.abs(x.d) !== x.R && cnt >= 1 && cnt <= 2 && S !== 0; },
  { R: 5, a: -2, A: 3, b: 4, B: -5, d: 7, C: 2, c: 1, r: 2, D: 4, E: -3, F: 5 }),
 build: ({ R, a, A, b, B, d, C, c, r, D, E, F }) => { const ins = [Math.abs(a) < R, Math.abs(b) < R, Math.abs(d) < R], coef = [A, B, C], pts = [a, b, d], cnt = ins.filter(Boolean).length,
   S = coef.reduce((t, v, i) => t + (ins[i] ? v : 0), 0), k1 = 2 * S, k2 = 2 * E, inList = pts.filter((v, i) => ins[i]), outList = pts.filter((v, i) => !ins[i]), inCoef = coef.filter((v, i) => ins[i]),
   I1 = `${n(A)} ÷ ${zp(a)} ${sg(B)} ${ab(B)} ÷ ${zp(b)} ${sg(C)} ${ab(C)} ÷ ${zp(d)}`,
   I2 = `${n(D)} ÷ ${zp(c)}³ ${sg(E)} ${ab(E)} ÷ ${zp(c)} ${sg(F)} ${ab(F)}${zp(c)}²`,
   list = v => v.map(n).join(' and '); return {
  prompt: `Two readings at the pump house. First, round the yard loop, the circle |z| = ${n(R)}, once anticlockwise, enter k in ∮ (${I1}) dz = kπi. Second, round the loop ${circ(c, r)} that surrounds the master pump, once anticlockwise, enter k in ∮ (${I2}) dz = kπi.`,
  answer: [k1, k2],
  hints: ['Split each integral into its terms. A term A ÷ (z − a) gives 2πi × A when a is inside the loop, and zero when a is outside, by Cauchy’s theorem. For |z| = R, the point a is inside when |a| < R.',
   'Round a circle centred on c, (z − c)ⁿ integrates to 2πi when n = −1 and to zero for every other whole number n, positive or negative. Only the power −1 survives.'],
  solution: `First reading: the bad points are ${list(pts)}. ${list(inList)} ${inList.length === 1 ? 'is' : 'are'} inside, less than ${n(R)} from 0; ${list(outList)} ${outList.length === 1 ? 'is' : 'are'} outside, more than ${n(R)} from 0, so ${outList.length === 1 ? 'its term gives' : 'their terms give'} 0. The inside terms give 2πi × ${inCoef.length === 1 ? par(inCoef[0]) : `(${sum(inCoef)})`}${inCoef.length === 1 ? '' : ` = 2πi × ${par(S)}`} = ${kpi(k1)}, so k = ${n(k1)}. Second reading: the loop is centred on ${n(c)}, so ${n(D)} ÷ ${zp(c)}³ and ${n(F)}${zp(c)}² give 0 and only ${n(E)} ÷ ${zp(c)} counts: 2πi × ${par(E)} = ${kpi(k2)}, so k = ${n(k2)}.`,
  guidance: [
   { prompt: `In the first reading the bad points are ${list(pts)}. The yard loop has radius ${n(R)}. How many of the three bad points are inside it?`, answer: [cnt], explanation: `A point is inside when its distance from 0 is less than ${n(R)}: ${pts.map((v, i) => `${n(v)} is ${ins[i] ? 'inside' : 'outside'}`).join(', ')}, so ${n(cnt)} ${cnt === 1 ? 'is' : 'are'} inside.` },
   { prompt: `Only the terms with a bad point inside count, each giving 2πi times its number on top. What is k for the first reading?`, answer: [k1], explanation: `The inside terms give 2πi × ${par(S)} = ${kpi(k1)}, and the others give 0, so k = ${n(k1)}.` },
   { prompt: `Round ${circ(c, r)} only the power −1 of ${zp(c)} counts. What is k for the second reading?`, answer: [k2], explanation: `The ${zp(c)}⁻³ and ${zp(c)}² terms give 0. ${n(E)} ÷ ${zp(c)} gives 2πi × ${par(E)} = ${kpi(k2)}, so k = ${n(k2)}.` }
  ] }; }
});

mk({
 id: 'q23c', parent: 'q23', kind: 'applied', title: 'The gate sensor and the stray transmitter',
 brief: 'A gate sensor has its own two-part field, and a stray transmitter nearby may or may not be inside the loop that reads it.',
 labels: ['k for the sensor terms', 'k for the total'], tolerance: 0.01,
 gl: [['distance from the centre'], ['k for the sensor terms'], ['k for the total']]
}, {
 /* Loop |z − c| = r; sensor A ÷ (z − c) + B ÷ (z − c)² at the centre; stray transmitter C ÷ (z − a), a real. */
 canonical: { c: -1, r: 3, A: 4, B: 2, a: 1, C: 5 },
 draw: R => { const inside = R.next() < 0.6; return retry(() => ({ c: R.int(-4, 4), r: R.int(2, 5), A: R.pick([-1, 1]) * R.int(2, 9), B: R.int(2, 9), a: R.int(-8, 8), C: R.pick([-1, 1]) * R.int(2, 9) }),
   x => x.a !== x.c && Math.abs(x.a - x.c) !== x.r && (Math.abs(x.a - x.c) < x.r) === inside, { c: -1, r: 3, A: 4, B: 2, a: 1, C: 5 }); },
 build: ({ c, r, A, B, a, C }) => { const dist = Math.abs(a - c), inside = dist < r, kS = 2 * A, K = kS + (inside ? 2 * C : 0),
  F = `${n(A)} ÷ ${zp(c)} + ${n(B)} ÷ ${zp(c)}² ${sg(C)} ${ab(C)} ÷ ${zp(a)}`; return {
  prompt: `A gate crew reads the field round a sensor. The reading loop is the circle ${circ(c, r)}, driven once anticlockwise. The sensor sits at the centre, the point ${n(c)}, and puts out the field ${n(A)} ÷ ${zp(c)} + ${n(B)} ÷ ${zp(c)}². A stray transmitter at the real point a = ${n(a)} adds the field ${n(C)} ÷ ${zp(a)}. The reading is the integral of the total field, ${F}. Enter k for the two sensor terms alone, then k in ∮ (${F}) dz = kπi for the total.`,
  answer: [kS, K],
  hints: ['A real point a is inside the circle |z − c| = r when its distance from the centre, |a − c|, is less than r. Cauchy’s theorem handles a term whose bad point is outside the loop.',
   'Round a circle centred on c, only the power −1 of (z − c) survives: it gives 2πi times its number on top, and every other whole power gives zero. A term C ÷ (z − a) with a inside gives 2πi × C.'],
  solution: `The sensor terms are centred on ${n(c)}, the centre of the loop, so ${n(B)} ÷ ${zp(c)}² gives 0 and ${n(A)} ÷ ${zp(c)} gives 2πi × ${par(A)} = ${kpi(kS)}: k = ${n(kS)}. The stray transmitter is ${n(dist)} from the centre, ${inside ? 'less' : 'more'} than the radius ${n(r)}, so it is ${inside ? `inside and adds 2πi × ${par(C)} = ${kpi(2 * C)}` : 'outside and adds 0'}. The total is k = ${inside ? `${n(kS)} + ${par(2 * C)} = ${n(K)}` : n(K)}.`,
  guidance: [
   { prompt: `How far is the transmitter at a = ${n(a)} from the centre ${n(c)} of the loop? The loop has radius ${n(r)}.`, answer: [dist], explanation: `|${n(a)} − ${par(c)}| = ${n(dist)}, ${inside ? 'less' : 'more'} than ${n(r)}, so the transmitter is ${inside ? 'inside' : 'outside'}.` },
   { prompt: `The sensor terms are centred on the centre of the loop, so only the power −1 counts. What is k for ${n(A)} ÷ ${zp(c)} + ${n(B)} ÷ ${zp(c)}²?`, answer: [kS], explanation: `The ${zp(c)}⁻² term gives 0. ${n(A)} ÷ ${zp(c)} gives 2πi × ${par(A)} = ${kpi(kS)}, so k = ${n(kS)}.` },
   { prompt: `Now add the stray transmitter, which gives ${inside ? '2πi times its number on top' : '0'} because it is ${inside ? 'inside' : 'outside'}. What is k for the total?`, answer: [K], explanation: inside ? `${n(kS)} + 2 × ${par(C)} = ${n(K)}, so k = ${n(K)}.` : `${n(kS)} + 0 = ${n(K)}, so k = ${n(K)}.` }
  ] }; }
});

mk({
 id: 'q23d', parent: 'q23', kind: 'challenge', uses: 'q19', title: 'A pole that is not at the centre',
 brief: 'A service loop has a doubled-up term sitting off its centre, and the crew must work out which terms actually count.',
 labels: ['terms that count', 'k'], tolerance: 0.01,
 gl: [['terms that count'], ['sum of the numbers on top'], ['k']]
}, {
 /* Loop |z − c| = r (c real). Field A ÷ (z − a) + B ÷ (z − b) + D ÷ (z − e)², a and e real, b = p + qi; e ≠ c, so the squared term is off centre. */
 canonical: { c: 1, r: 4, a: 7, A: 3, p: -2, q: 1, B: -5, e: -1, D: 6 },
 draw: R => { const inA = R.bool(), inB = R.next() < 0.7; return retry(() => ({ c: R.int(-3, 3), r: R.int(2, 6), a: R.int(-9, 9), A: R.pick([-1, 1]) * R.int(2, 9), p: R.int(-7, 7), q: R.nz(-6, 6), B: R.pick([-1, 1]) * R.int(2, 9), e: R.int(-6, 6), D: R.int(2, 9) }),
   x => (Math.abs(x.a - x.c) < x.r) === inA && Math.abs(Math.abs(x.a - x.c) - x.r) >= 1 && fitsC(x.p, x.q, x.c, x.r, inB) && x.e !== x.c && Math.abs(x.e - x.c) !== x.r && ((inA ? x.A : 0) + (inB ? x.B : 0)) !== 0, { c: 1, r: 4, a: 7, A: 3, p: -2, q: 1, B: -5, e: -1, D: 6 }); },
 build: ({ c, r, a, A, p, q, B, e, D }) => { const inA = Math.abs(a - c) < r, d = d2c(p, q, c), r2 = r * r, inB = d < r2, cnt = +inA + +inB, S = (inA ? A : 0) + (inB ? B : 0), K = 2 * S, Bz = cx(p, q),
  F = `${n(A)} ÷ ${zp(a)} ${sg(B)} ${ab(B)} ÷ ${zp(p, q)} ${sg(D)} ${ab(D)} ÷ ${zp(e)}²`, side = y => y ? 'inside' : 'outside'; return {
  prompt: `A service loop is the circle ${circ(c, r)}, driven once anticlockwise. The field along it has three terms: ${F}. Its bad points are the real point a = ${n(a)}, the point b = ${Bz}, and the real point e = ${n(e)}, which is not the centre of the loop. Enter how many of the three terms have an integral round the loop that is not 0, then k in ∮ (${F}) dz = kπi.`,
  answer: [cnt, K],
  hints: ['A term D ÷ (z − e)² has the antiderivative −D ÷ (z − e), which is analytic everywhere except at e. Round any closed loop that does not pass through e, the integral is that antiderivative at the end minus the same at the start, which is zero, even when e is inside.',
   'For the other two terms, a point is inside the loop when its distance from the centre c is less than r. For b = p + qi compare (p − c)² + q² with r². A term A ÷ (z − a) with a inside gives 2πi × A, and with a outside it gives zero.'],
  solution: `The squared term ÷ ${zp(e)}² has the antiderivative −${n(D)} ÷ ${zp(e)}, so its integral round the closed loop is 0 whether e is inside or not. The point a = ${n(a)} is ${n(Math.abs(a - c))} from the centre ${n(c)}, ${inA ? 'less' : 'more'} than ${n(r)}, so it is ${side(inA)}. For b, (${par(p)} − ${par(c)})² + ${par(q)}² = ${n(d)}, ${inB ? 'less' : 'more'} than r² = ${n(r2)}, so b is ${side(inB)}. ${n(cnt)} of the terms ${cnt === 1 ? 'counts' : 'count'}, and the ${cnt === 1 ? 'number' : 'numbers'} on top of the ${cnt === 1 ? 'term that counts' : 'terms that count'} ${cnt === 1 ? 'is' : 'add up to'} ${n(S)}. The integral is 2πi × ${par(S)} = ${kpi(K)}, so k = ${n(K)}.`,
  guidance: [
   { prompt: `The ÷ ${zp(e)}² term integrates to 0. The other two terms count only if their bad points are inside the loop: a = ${n(a)} is ${n(Math.abs(a - c))} from the centre, and for b work out (Re b − c)² + (Im b)² against r² = ${n(r2)}. How many of the three terms count?`, answer: [cnt], explanation: `a is ${side(inA)} (${n(Math.abs(a - c))} against ${n(r)}); b has (${par(p)} − ${par(c)})² + ${par(q)}² = ${n(d)} against ${n(r2)}, so it is ${side(inB)}. So ${n(cnt)} ${cnt === 1 ? 'term counts' : 'terms count'}.` },
   { prompt: `Add the numbers on top (${n(A)} and ${n(B)}) of the terms whose bad points are inside the loop. What is the sum?`, answer: [S], explanation: `${inA ? `a is inside, so ${n(A)} counts` : 'a is outside, so its number is left out'}; ${inB ? `b is inside, so ${n(B)} counts` : 'b is outside, so its number is left out'}. The sum is ${n(S)}.` },
   { prompt: `The integral is 2πi times that sum. What is k?`, answer: [K], explanation: `2πi × ${par(S)} = ${kpi(K)}, so k = ${n(K)}.` }
  ] }; }
});

/* ---- q24 Cauchy's integral formula [5.1] ---- */

mk({
 id: 'q24b', parent: 'q24', kind: 'setting', title: 'The sensor ring in the lab',
 brief: 'A sensor ring in the field lab reads a field with a plus sign in its bottom, and the crew wants the value at the point it hides.',
 labels: ['f(a)', 'k'], tolerance: 0.01,
 gl: [['distance from the centre'], ['f(a)'], ['k']]
}, {
 /* f(z) = αz³ + βz + γ over z − a with a negative, so the bottom is written z + |a|. Not the worked example (z² + 4 at a = −1 round |z| = 2). */
 canonical: { al: 1, be: -4, ga: 3, a: -2, c: -1, r: 3 },
 draw: R => retry(() => ({ al: R.pick([-3, -2, -1, 1, 2, 3]), be: R.int(-6, 6), ga: R.int(-6, 6), a: R.int(-4, -1), c: R.int(-3, 3), r: R.int(2, 5) }),
  x => Math.abs(x.a - x.c) < x.r && x.al * x.a * x.a * x.a + x.be * x.a + x.ga !== 0, { al: 1, be: -4, ga: 3, a: -2, c: -1, r: 3 }),
 build: ({ al, be, ga, a, c, r }) => { const f = poly([al, 0, be, ga], 'z'), fa = al * a * a * a + be * a + ga, k = 2 * fa, dist = Math.abs(a - c); return {
  prompt: `A sensor ring in the field lab follows the circle ${circ(c, r)}, once anticlockwise. The field along it is f(z) ÷ ${zp(a)} with f(z) = ${f}. The bottom ${zm(a)} is z − a for a = ${n(a)}, so a is the point where the bottom is zero. Enter f(${n(a)}), then k in ∮ (${f}) ÷ ${zp(a)} dz = kπi.`,
  answer: [fa, k],
  hints: ['Cauchy’s integral formula: if f is analytic on and inside the loop and a is inside it, ∮ f(z) ÷ (z − a) dz = 2πi f(a). Write the bottom as z − a first: z + 5 is z − (−5).',
   'Check that a is inside: a real point a is inside the circle |z − c| = r when its distance from the centre, |a − c|, is less than r. A polynomial is analytic everywhere.'],
  solution: `${n(a)} is ${n(dist)} from the centre ${n(c)}, less than the radius ${n(r)}, so a is inside the ring, and f is a polynomial, analytic everywhere. f(${n(a)}) = ${eq([al * a * a * a, be * a, ga], fa)}. By Cauchy’s integral formula the integral is 2πi × ${par(fa)} = ${kpi(k)}, so k = ${n(k)}.`,
  guidance: [
   { prompt: `How far is a = ${n(a)} from the centre ${n(c)} of the ring? Its radius is ${n(r)}.`, answer: [dist], explanation: `|${n(a)} − ${par(c)}| = ${n(dist)}, less than ${n(r)}, so a is inside and Cauchy’s integral formula applies.` },
   { prompt: `Put z = ${n(a)} into f(z) = ${f}. What is f(${n(a)})?`, answer: [fa], explanation: `f(${n(a)}) = ${eq([al * a * a * a, be * a, ga], fa)}.` },
   { prompt: `The integral is 2πi f(a). What is k?`, answer: [k], explanation: `2πi × ${par(fa)} = ${kpi(k)}, so k = ${n(k)}.` }
  ] }; }
});

mk({
 id: 'q24c', parent: 'q24', kind: 'applied', title: 'The dial nobody wrote down',
 brief: 'A coil meter shows its reading but the calibration dial setting was lost, and the lab wants it back from the reading alone.',
 labels: ['f(a)', 's'], tolerance: 0.01,
 gl: [['f(a)'], ['s × a'], ['s']]
}, {
 /* f(z) = z² + sz + γ, reading K πi = 2f(a)πi, a non-zero and inside; the dial s is the whole number to find. */
 canonical: { s: 3, ga: -4, a: 2, c: 0, r: 4 },
 draw: R => retry(() => ({ s: R.nz(-6, 6), ga: R.nz(-7, 7), a: R.pick([-4, -3, -2, 2, 3, 4]), c: R.int(-3, 3), r: R.int(2, 6) }),
  x => Math.abs(x.a - x.c) < x.r && x.a * x.a + x.s * x.a + x.ga !== 0, { s: 3, ga: -4, a: 2, c: 0, r: 4 }),
 build: ({ s, ga, a, c, r }) => { const fa = a * a + s * a + ga, K = 2 * fa, sa = s * a, f = `z² + sz ${sg(ga)} ${ab(ga)}`, dist = Math.abs(a - c); return {
  prompt: `The meter on a lab coil reads ∮ (${f}) ÷ ${zp(a)} dz = ${kpi(K)}, once anticlockwise round the circle ${circ(c, r)}. Here s is a setting on a dial that nobody wrote down. The point ${n(a)} lies inside the coil. Enter f(${n(a)}), the value of the top of the fraction at that point as the meter reading implies it, then the dial setting s.`,
  answer: [fa, s],
  hints: ['Cauchy’s integral formula: for f analytic on and inside the loop and a inside it, ∮ f(z) ÷ (z − a) dz = 2πi f(a). Divide the reading by 2πi to get f(a) without using s at all.',
   'Then put z = a into the top of the fraction: f(a) = a² + s × a + (the constant). Move everything except the term with s to the other side, then divide by a.'],
  solution: `The point ${n(a)} is ${n(dist)} from the centre ${n(c)}, less than ${n(r)}, so it is inside, and the top is a polynomial, analytic everywhere. By Cauchy’s integral formula the reading is 2πi f(${n(a)}) = ${kpi(K)}, so f(${n(a)}) = ${n(fa)}. Also f(${n(a)}) = ${par(a)}² + s × ${par(a)} ${sg(ga)} ${ab(ga)}, so ${n(a * a)} ${sg(a)} ${ab(a)}s ${sg(ga)} ${ab(ga)} = ${n(fa)}, which gives ${n(a)}s = ${n(fa)} − ${par(a * a + ga)} = ${n(sa)}, so s = ${n(sa)} ÷ ${par(a)} = ${n(s)}.`,
  guidance: [
   { prompt: `The reading is 2πi f(a) = ${kpi(K)}. What is f(${n(a)})?`, answer: [fa], explanation: `f(${n(a)}) = ${n(K)}πi ÷ 2πi = ${n(fa)}.` },
   { prompt: `Put z = ${n(a)} into the top: f(${n(a)}) = ${par(a)}² + s × ${par(a)} ${sg(ga)} ${ab(ga)} = ${n(fa)}. What is s × ${par(a)}, the s term on its own?`, answer: [sa], explanation: `${n(fa)} − ${par(a * a)} − ${par(ga)} = ${n(sa)}.` },
   { prompt: `s × ${par(a)} = ${n(sa)}. What is s?`, answer: [s], explanation: `s = ${n(sa)} ÷ ${par(a)} = ${n(s)}.` }
  ] }; }
});

mk({
 id: 'q24d', parent: 'q24', kind: 'challenge', uses: 'q22', title: 'Laps round the coil road',
 brief: 'A test truck laps the coil road several times, and the field it reads depends on the value at a point the road may or may not surround.',
 labels: ['f(a)', 'winding number', 'k'], tolerance: 0.01,
 gl: [['winding number'], ['f(a)'], ['k']]
}, {
 /* Cubic f, a real, path m laps of |z − c| = r; a is inside in about three draws in four. Not the worked example (z² + 4, a = −1, |z| = 2). */
 canonical: { al: 1, be: -2, ga: 1, de: 3, a: 2, c: 1, r: 3, m: -2 },
 draw: R => { const inside = R.next() < 0.75; return retry(() => ({ al: R.pick([-2, -1, 1, 2]), be: R.int(-4, 4), ga: R.int(-4, 4), de: R.int(-4, 4), a: R.int(-3, 3), c: R.int(-3, 3), r: R.int(2, 5), m: R.pick([-3, -2, 2, 3]) }),
  x => (Math.abs(x.a - x.c) < x.r) === inside && Math.abs(x.a - x.c) !== x.r && x.al * x.a * x.a * x.a + x.be * x.a * x.a + x.ga * x.a + x.de !== 0, { al: 1, be: -2, ga: 1, de: 3, a: 2, c: 1, r: 3, m: -2 }); },
 build: ({ al, be, ga, de, a, c, r, m }) => { const f = poly([al, be, ga, de], 'z'), terms = [al * a * a * a, be * a * a, ga * a, de], fa = terms.reduce((t, v) => t + v, 0), dist = Math.abs(a - c), inside = dist < r, w = inside ? m : 0, k = 2 * w * fa; return {
  prompt: `A tester drives a truck round the coil road, the circle ${circ(c, r)}, ${turns(m)} without stopping. The field along the road is f(z) ÷ ${zp(a)} with a = ${n(a)} and f(z) = ${f}. For a closed path that winds w times round a (net anticlockwise turns, with clockwise turns counted as negative) and a function f that is analytic everywhere, Cauchy’s integral formula becomes ∮ f(z) ÷ (z − a) dz = 2πi × w × f(a). Enter f(${n(a)}), then the winding number of the path round a, then k in ∮ (${f}) ÷ ${zp(a)} dz = kπi along the whole path.`,
  answer: [fa, w, k],
  hints: ['The winding number counts net turns round a: each anticlockwise turn is +1 and each clockwise turn −1. A real point a is inside the circle |z − c| = r when |a − c| < r, and a point outside is never turned round.',
   'Put z = a into the top of the fraction to get f(a). Then use the formula in the problem: the integral is 2πi × w × f(a), so k is 2 × w × f(a).'],
  solution: `f(${n(a)}) = ${eq(terms, fa)}. The point ${n(a)} is ${n(dist)} from the centre ${n(c)}, ${inside ? 'less' : 'more'} than ${n(r)}, so it is ${inside ? 'inside' : 'outside'} the road. ${inside ? `The truck goes round it ${turns(m)}, so the winding number is ${n(m)}.` : 'The truck never goes round it, so the winding number is 0.'} The integral is 2πi × ${par(w)} × ${par(fa)} = ${kpi(k)}, so k = ${n(k)}.`,
  guidance: [
   { prompt: `The point a = ${n(a)} is ${n(dist)} from the centre ${n(c)}, and the road has radius ${n(r)}. The truck goes round ${turns(m)}. What is the winding number of its path round a?`, answer: [w], explanation: inside ? `a is inside, each lap goes round it, and ${m > 0 ? 'anticlockwise turns count +1' : 'clockwise turns count −1'}, so the winding number is ${n(m)}.` : 'a is outside, so the path never goes round it and the winding number is 0.' },
   { prompt: `Put z = ${n(a)} into f(z) = ${f}. What is f(${n(a)})?`, answer: [fa], explanation: `f(${n(a)}) = ${eq(terms, fa)}.` },
   { prompt: `The integral is 2πi × w × f(a). What is k?`, answer: [k], explanation: `2πi × ${par(w)} × ${par(fa)} = ${kpi(k)}, so k = ${n(k)}.` }
  ] }; }
});

/* ---- q25 The formula for derivatives [5.2] ---- */

mk({
 id: 'q25b', parent: 'q25', kind: 'setting', title: 'The third coil on the bench',
 brief: 'A bench coil has a squared or cubed bottom in its field, and the lab wants to know which derivative the bench is really reading.',
 labels: ['n', 'derivative at a', 'k'], tolerance: 0.01,
 gl: [['n'], ['derivative at a'], ['k']]
}, {
 /* f(z) = c3 z³ + c1 z + c0 (no z² term), n = 1 or 2, a loop |z − c| = r with a inside. Not the worked example (z³ − 5z at a = 1 with n = 2). */
 canonical: { c3: 2, c1: -5, c0: 3, a: 1, n: 2, c: -1, r: 4 },
 draw: R => retry(() => ({ c3: R.pick([-3, -2, -1, 1, 2, 3]), c1: R.int(-6, 6), c0: R.int(-6, 6), a: R.int(-3, 3), n: R.int(1, 2), c: R.int(-3, 3), r: R.int(3, 6) }),
  x => Math.abs(x.a - x.c) < x.r && (x.n === 1 ? 3 * x.c3 * x.a * x.a + x.c1 : 6 * x.c3 * x.a) !== 0 && !(x.c3 === 1 && x.c1 === -5 && x.a === 1 && x.n === 2), { c3: 2, c1: -5, c0: 3, a: 1, n: 2, c: -1, r: 4 }),
 build: ({ c3, c1, c0, a, n: k, c, r }) => { const f = poly([c3, 0, c1, c0], 'z'), d1 = poly([3 * c3, 0, c1], 'z'), d2 = poly([6 * c3, 0], 'z'),
  fn = k === 1 ? 3 * c3 * a * a + c1 : 6 * c3 * a, K = 2 * fn / fact(k), dist = Math.abs(a - c),
  work = k === 1 ? `f′(z) = ${d1}, so f′(${n(a)}) = ${eq([3 * c3 * a * a, c1], fn)}.` : `f′(z) = ${d1} and f′′(z) = ${d2}, so f′′(${n(a)}) = ${n(6 * c3)} × ${par(a)} = ${n(fn)}.`; return {
  prompt: `A bench coil in the field lab follows the circle ${circ(c, r)}, once anticlockwise. Its field is (${f}) ÷ ${zp(a)}${SUP[k + 1]}. Enter n, the order of the derivative that Cauchy’s formula for derivatives needs here, then that derivative of f(z) = ${f} at z = ${n(a)}, then k in ∮ (${f}) ÷ ${zp(a)}${SUP[k + 1]} dz = kπi.`,
  answer: [k, fn, K],
  hints: ['Cauchy’s formula for derivatives: ∮ f(z) ÷ (z − a)ⁿ⁺¹ dz = 2πi f⁽ⁿ⁾(a) ÷ n!, where f⁽ⁿ⁾ is f differentiated n times. Read n from the power on the bottom, which is one more than n.',
   'Differentiate term by term with the power rule: the derivative of a constant is zero. Then check that a is inside the circle |z − c| = r, which means |a − c| < r for a real a.'],
  solution: `The power on the bottom is ${n(k + 1)}, so n = ${n(k)}. ${work} a = ${n(a)} is ${n(dist)} from the centre ${n(c)}, less than the radius ${n(r)}, so it is inside, and f is a polynomial, analytic everywhere. The integral is 2πi × ${par(fn)} ÷ ${n(k)}! = ${kpi(K)}, so k = ${n(K)}.`,
  guidance: [
   { prompt: `The bottom is ${zp(a)}${SUP[k + 1]}, and in the formula the power is n + 1. What is n?`, answer: [k], explanation: `n + 1 = ${n(k + 1)}, so n = ${n(k)}.` },
   { prompt: `Differentiate f(z) = ${f} ${k === 1 ? 'once' : 'twice'} and put in z = ${n(a)}. What is ${der(k)}(${n(a)})?`, answer: [fn], explanation: work },
   { prompt: `The integral is 2πi × ${der(k)}(${n(a)}) ÷ ${n(k)}!. What is k?`, answer: [K], explanation: `2πi × ${par(fn)} ÷ ${n(fact(k))} = ${kpi(K)}, so k = ${n(K)}.` }
  ] }; }
});

mk({
 id: 'q25c', parent: 'q25', kind: 'applied', title: 'Two coils in series',
 brief: 'Two coils are wired in series round the same ring, one reading a slope and the other a curvature, and the lab wants the combined reading.',
 labels: ['f′(a)', 'f′′(a)', 'k'], tolerance: 0.01,
 gl: [['f′(a)'], ['f′′(a)'], ['k']]
}, {
 /* Cubic f, a with |a| < R; field f ÷ (z − a)² + f ÷ (z − a)³; k = 2f′(a) + f′′(a). */
 canonical: { c3: 1, c2: -2, c1: 3, c0: -4, a: 1, R: 3 },
 draw: R => retry(() => ({ c3: R.pick([-2, -1, 1, 2]), c2: R.int(-4, 4), c1: R.int(-5, 5), c0: R.int(-5, 5), a: R.int(-2, 2), R: R.int(3, 5) }),
  x => 3 * x.c3 * x.a * x.a + 2 * x.c2 * x.a + x.c1 !== 0 && 6 * x.c3 * x.a + 2 * x.c2 !== 0, { c3: 1, c2: -2, c1: 3, c0: -4, a: 1, R: 3 }),
 build: ({ c3, c2, c1, c0, a, R }) => { const f = poly([c3, c2, c1, c0], 'z'), d1 = poly([3 * c3, 2 * c2, c1], 'z'), d2 = poly([6 * c3, 2 * c2], 'z'),
  f1 = 3 * c3 * a * a + 2 * c2 * a + c1, f2 = 6 * c3 * a + 2 * c2, K = 2 * f1 + f2, F = `(${f}) ÷ ${zp(a)}² + (${f}) ÷ ${zp(a)}³`; return {
  prompt: `Two coils are wired in series round the same ring, the circle |z| = ${n(R)}, once anticlockwise. The first coil’s field is f(z) ÷ ${zp(a)}² and the second’s is f(z) ÷ ${zp(a)}³, with the same f(z) = ${f} and a = ${n(a)}. The integral of a sum is the sum of the integrals of its terms. Enter f′(${n(a)}), then f′′(${n(a)}), then k in ∮ (${F}) dz = kπi for the two coils together.`,
  answer: [f1, f2, K],
  hints: ['Cauchy’s formula for derivatives: ∮ f(z) ÷ (z − a)ⁿ⁺¹ dz = 2πi f⁽ⁿ⁾(a) ÷ n!. A square on the bottom means n is one less than that power, and a cube means n is two less than that power.',
   'Work out the integral of each coil on its own, keeping the factorial: n! for the second derivative is 1 × 2. Then add the two values of k. First check that a is inside the ring.'],
  solution: `f′(z) = ${d1}, so f′(${n(a)}) = ${eq([3 * c3 * a * a, 2 * c2 * a, c1], f1)}. f′′(z) = ${d2}, so f′′(${n(a)}) = ${eq([6 * c3 * a, 2 * c2], f2)}. a = ${n(a)} is inside |z| = ${n(R)}, since |${n(a)}| < ${n(R)}, and f is a polynomial. The first coil has a square on the bottom, so n = 1 and it gives 2πi × ${par(f1)} ÷ 1! = ${kpi(2 * f1)}. The second has a cube, so n = 2 and it gives 2πi × ${par(f2)} ÷ 2! = ${kpi(f2)}. Together k = ${n(2 * f1)} + ${par(f2)} = ${n(K)}.`,
  guidance: [
   { prompt: `The first coil has a square on the bottom, so it needs the first derivative. Differentiate f(z) = ${f} once and put in z = ${n(a)}. What is f′(${n(a)})?`, answer: [f1], explanation: `f′(z) = ${d1}, so f′(${n(a)}) = ${eq([3 * c3 * a * a, 2 * c2 * a, c1], f1)}.` },
   { prompt: `The second coil has a cube on the bottom, so it needs the second derivative. Differentiate once more and put in z = ${n(a)}. What is f′′(${n(a)})?`, answer: [f2], explanation: `f′′(z) = ${d2}, so f′′(${n(a)}) = ${eq([6 * c3 * a, 2 * c2], f2)}.` },
   { prompt: `The first coil gives 2πi × f′(a) ÷ 1! and the second gives 2πi × f′′(a) ÷ 2!. What is k for the two together?`, answer: [K], explanation: `${n(2 * f1)} + ${par(f2)} = ${n(K)}, so k = ${n(K)}.` }
  ] }; }
});

mk({
 id: 'q25d', parent: 'q25', kind: 'challenge', title: 'The big coil with a quartic top',
 brief: 'The biggest coil in the lab has a high power on the bottom, and its reading hides a second or third derivative.',
 labels: ['n', 'derivative at a', 'k'], tolerance: 0.01,
 gl: [['n'], ['derivative at a'], ['k']]
}, {
 /* Quartic f, n = 2 or 3 (so the bottom is a cube or a fourth power), a loop |z − c| = r with a inside. Not the worked example. */
 canonical: { c4: 1, c3: -2, c2: 0, c1: 3, c0: -1, a: 1, n: 3, c: -1, r: 4 },
 draw: R => retry(() => ({ c4: R.pick([-2, -1, 1, 2]), c3: R.int(-4, 4), c2: R.int(-4, 4), c1: R.int(-5, 5), c0: R.int(-5, 5), a: R.int(-2, 2), n: R.int(2, 3), c: R.int(-3, 3), r: R.int(3, 6) }),
  x => Math.abs(x.a - x.c) < x.r && (x.n === 2 ? 12 * x.c4 * x.a * x.a + 6 * x.c3 * x.a + 2 * x.c2 : 24 * x.c4 * x.a + 6 * x.c3) !== 0, { c4: 1, c3: -2, c2: 0, c1: 3, c0: -1, a: 1, n: 3, c: -1, r: 4 }),
 build: ({ c4, c3, c2, c1, c0, a, n: k, c, r }) => { const f = poly([c4, c3, c2, c1, c0], 'z'), d1 = poly([4 * c4, 3 * c3, 2 * c2, c1], 'z'), d2 = poly([12 * c4, 6 * c3, 2 * c2], 'z'), d3 = poly([24 * c4, 6 * c3], 'z'),
  parts = k === 2 ? [12 * c4 * a * a, 6 * c3 * a, 2 * c2] : [24 * c4 * a, 6 * c3], fn = parts.reduce((t, v) => t + v, 0), K = 2 * fn / fact(k), dist = Math.abs(a - c),
  work = k === 2 ? `f′(z) = ${d1} and f′′(z) = ${d2}, so f′′(${n(a)}) = ${eq(parts, fn)}.` : `f′(z) = ${d1}, f′′(z) = ${d2} and f⁽³⁾(z) = ${d3}, so f⁽³⁾(${n(a)}) = ${eq(parts, fn)}.`; return {
  prompt: `The biggest coil in the lab follows the circle ${circ(c, r)}, once anticlockwise. Its field is (${f}) ÷ ${zp(a)}${SUP[k + 1]}. Enter n, the order of the derivative that Cauchy’s formula for derivatives needs here, then that derivative of f(z) = ${f} at z = ${n(a)}, then k in ∮ (${f}) ÷ ${zp(a)}${SUP[k + 1]} dz = kπi.`,
  answer: [k, fn, K],
  hints: ['Cauchy’s formula for derivatives: ∮ f(z) ÷ (z − a)ⁿ⁺¹ dz = 2πi f⁽ⁿ⁾(a) ÷ n!. The power on the bottom is n + 1, and n! is the product of the whole numbers from 1 up to n.',
   'Differentiate n times with the power rule, one derivative at a time, before you put in z = a. Then check that a is inside the circle |z − c| = r, which means |a − c| < r for a real a.'],
  solution: `The power on the bottom is ${n(k + 1)}, so n = ${n(k)}. ${work} a = ${n(a)} is ${n(dist)} from the centre ${n(c)}, less than the radius ${n(r)}, so it is inside, and f is a polynomial, analytic everywhere. The integral is 2πi × ${par(fn)} ÷ ${n(k)}! = ${kpi(K)}, so k = ${n(K)}.`,
  guidance: [
   { prompt: `The bottom is ${zp(a)}${SUP[k + 1]}, and in the formula the power is n + 1. What is n?`, answer: [k], explanation: `n + 1 = ${n(k + 1)}, so n = ${n(k)}.` },
   { prompt: `Differentiate f(z) = ${f} ${k === 2 ? 'twice' : 'three times'} and put in z = ${n(a)}. What is ${der(k)}(${n(a)})?`, answer: [fn], explanation: work },
   { prompt: `The integral is 2πi × ${der(k)}(${n(a)}) ÷ ${n(k)}!, and ${n(k)}! = ${n(fact(k))}. What is k?`, answer: [K], explanation: `2πi × ${par(fn)} ÷ ${n(fact(k))} = ${kpi(K)}, so k = ${n(K)}.` }
  ] }; }
});

})();
