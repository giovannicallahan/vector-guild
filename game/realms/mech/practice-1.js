/* Mechanics: motion and force practice missions, file 1 of 8: concepts q01–q05, three practice missions each
   (q01b q01c q01d q02b q02c q02d q03b q03c q03d q04b q04c q04d q05b q05c q05d).
   Format and rules: docs/PACK-FORMAT.md, "Practice missions" (§10).
     b  kind 'setting'    the same skill in a new real-world setting
     c  kind 'applied'    a word problem with two or three steps (two or three guided steps)
     d  kind 'challenge'  harder numbers, or the skill combined with one earlier concept (optional `uses: 'qNN'`)
   A practice mission supplies only: id, parent, kind, title, brief, prompt, answer, labels, tolerance, hints,
   solution, guidance (and `uses` for a challenge). Everything else comes from its parent, the learn mission:
   topic, tier, xp, sector, lesson, teaching, sources, the concept bench and the review drill. Do not write those.
   Each mission is registered together with its generator by add(mission, generator); build(canonical) must
   reproduce the authored prompt, hints, solution and guidance exactly. Oracles: qa/realms/mech/oracle-p1.js. */
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
const sgn = v => v < 0 ? '−' : '+';
const coef = v => Math.abs(v) === 1 ? '' : n(Math.abs(v));
/* A vector written with unit vectors: vIJ(7, −2) is "7î − 2ĵ"; vIJ(−1, 3) is "−î + 3ĵ". */
const vIJ = (x, y) => `${x < 0 ? '−' : ''}${coef(x)}î ${sgn(y)} ${coef(y)}ĵ`;
const r1 = x => Math.round(x * 10) / 10, r2 = x => Math.round(x * 100) / 100, r3 = x => Math.round(x * 1000) / 1000;
/* A rounded value printed with all its decimal places: fx(3.9, 2) is "3.90". */
const fx = (x, dp) => x.toFixed(dp).replace('-', '−');
/* True when x sits within 0.03 of a rounding tie at dp places, so a slightly different calculator path could round it the other way. */
const tie = (x, dp) => { const s = Math.abs(x) * Math.pow(10, dp), f = s - Math.floor(s); return Math.abs(f - 0.5) < 0.03; };
const SUP = { '-': '⁻', '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹' };
const sup = e => String(e).split('').map(c => SUP[c]).join('');
/* Every retry loop is bounded: at most 1000 tries, then the canonical parameters. */
const retry = (make, ok, fallback) => { for (let i = 0; i < 1000; i++) { const p = make(); if (ok(p)) return p; } return { ...fallback }; };
/* The amount a × 10^k for a whole number a and any whole exponent k, free of float noise. */
const pw10 = (a, k) => k >= 0 ? a * Math.pow(10, k) : a / Math.pow(10, -k);
/* "1 hour", "2 hours". */
const pl = (x, one, many) => `${n(x)} ${x === 1 ? one : many}`;

/* ---- q01 SI units and conversion factors [1.3] ---- */

mk({
 id: 'q01b', parent: 'q01', kind: 'setting',
 title: 'The cable tram timetable',
 brief: 'The ridge tram hauls survey crates along a cable, and its timetable must be written in the units the logbook uses.',
 labels: ['speed (m/s)', 'speed (km/h)', 'trip time (min)'], tolerance: 0.01,
 gl: [['speed (m/s)'], ['speed (km/h)'], ['trip time (min)']]
}, {
 /* Not the q01 canonical (54 km/h for 4 min) nor its worked example (72 km/h for 3 min). V = 150 j, so V ÷ 60 is a multiple of 2.5
    and V × 60 ÷ 1000 a whole number; L = 0.15 j m kilometres is the cable length for a whole m minutes. */
 canonical: { V: 600, L: 4.2 },
 draw: R => { const j = R.int(1, 6), m = R.int(4, 20); return { V: 150 * j, L: r2(0.15 * j * m) }; },
 build: ({ V, L }) => { const ms = V / 60, kmh = V * 6 / 100, mt = Math.round(L * 1000), t = Math.round(mt / V); return {
  prompt: `The ridge tram hauls survey crates along a cable at ${n(V)} metres per minute (m/min). Enter its speed in metres per second (m/s), then its speed in kilometres per hour (km/h), then the number of minutes it needs to travel the whole ${n(L)} km cable.`,
  answer: [ms, kmh, t],
  hints: ['A minute is 60 seconds. Multiply by the conversion factor (1 min ÷ 60 s), so that the minutes cancel and seconds are left underneath.',
   'For km/h, change both units: metres per minute × (60 min ÷ 1 h) × (1 km ÷ 1000 m). The minutes and the metres cancel.',
   'Change the cable length to metres first. Then the time in minutes is the distance in metres divided by the speed in metres per minute.'],
  solution: `${n(V)} m/min × (1 min ÷ 60 s) = ${n(ms)} m/s. In km/h: ${n(V)} m/min × (60 min ÷ 1 h) × (1 km ÷ 1000 m) = ${n(V * 60)} m per hour = ${n(kmh)} km/h. The cable is ${n(L)} km × (1000 m ÷ 1 km) = ${n(mt)} m, and ${n(mt)} m ÷ ${n(V)} m/min = ${n(t)} min.`,
  guidance: [
   { prompt: `What is ${n(V)} metres per minute in metres per second?`, answer: [ms], explanation: `Each minute is 60 seconds, so ${n(V)} m/min × (1 min ÷ 60 s) = ${n(ms)} m/s.` },
   { prompt: `There are 60 minutes in an hour and 1000 metres in a kilometre. What is ${n(V)} metres per minute in kilometres per hour?`, answer: [kmh], explanation: `${n(V)} m/min × 60 = ${n(V * 60)} m per hour, and ${n(V * 60)} m × (1 km ÷ 1000 m) = ${n(kmh)} km, so ${n(kmh)} km/h.` },
   { prompt: `The cable is ${n(L)} km, which is ${n(mt)} m. At ${n(V)} metres per minute, how many minutes does the tram need for the whole cable?`, answer: [t], explanation: `Time = distance ÷ speed = ${n(mt)} m ÷ ${n(V)} m/min = ${n(t)} min: the metres cancel and minutes are left.` }
  ] }; }
});

mk({
 id: 'q01c', parent: 'q01', kind: 'applied',
 title: 'The rover and the far pylon',
 brief: 'The rover has driven part of the way to a signal pylon, and Mira needs to know how much cable run is still ahead of it.',
 labels: ['distance left (m)'], tolerance: 0.01,
 gl: [['first leg (m)'], ['second leg (m)'], ['distance left (m)']]
}, {
 /* Speeds V are multiples of 9 km/h, so a speed is 5V/18 m/s (a multiple of 2.5) and a leg is 50 V × minutes ÷ 3 metres, a whole number. Never the q01 canonical (54 km/h for 4 min). The pylon is
    200 to 2000 m beyond where the rover stops, in steps of 50. */
 canonical: { V1: 36, M1: 5, V2: 45, M2: 6, D: 8400 },
 draw: R => retry(() => { const V1 = 9 * R.int(2, 6), M1 = R.int(2, 8), V2 = 9 * R.int(2, 6), M2 = R.int(2, 8); return { V1, M1, V2, M2, D: 50 * (V1 * M1 + V2 * M2) / 3 + 50 * R.int(4, 40) }; },
  p => !(p.V1 === 54 && p.M1 === 4) && !(p.V2 === 54 && p.M2 === 4), { V1: 36, M1: 5, V2: 45, M2: 6, D: 8400 }),
 build: ({ V1, M1, V2, M2, D }) => { const m1 = 5 * V1 / 18, m2 = 5 * V2 / 18, l1 = 50 * V1 * M1 / 3, l2 = 50 * V2 * M2 / 3, left = D - l1 - l2; return {
  prompt: `The survey rover leaves the depot and drives in a straight line towards a signal pylon that stands ${n(D)} m from the depot. It drives at ${n(V1)} km/h for ${n(M1)} minutes, then at ${n(V2)} km/h for ${n(M2)} minutes, in the same direction. Enter how far the rover still is from the pylon when it stops, in metres, typed without commas.`,
  answer: [left],
  hints: ['Change each speed to metres per second with the factors (1000 m ÷ 1 km) and (1 h ÷ 3600 s), and each time to seconds. A leg is its speed times its time.',
   'Add the two leg distances, both in metres, and take the total away from the distance to the pylon.'],
  solution: `First leg: ${n(V1)} km/h = ${n(m1)} m/s and ${n(M1)} min = ${n(60 * M1)} s, so it covers ${n(m1)} × ${n(60 * M1)} = ${n(l1)} m. Second leg: ${n(V2)} km/h = ${n(m2)} m/s and ${n(M2)} min = ${n(60 * M2)} s, so it covers ${n(m2)} × ${n(60 * M2)} = ${n(l2)} m. Together that is ${n(l1 + l2)} m, so the rover is ${n(D)} − ${n(l1 + l2)} = ${n(left)} m from the pylon.`,
  guidance: [
   { prompt: `How far does the rover go in the first leg, ${n(V1)} km/h for ${n(M1)} minutes, in metres?`, answer: [l1], explanation: `${n(V1)} km/h = ${n(m1)} m/s and ${n(M1)} min = ${n(60 * M1)} s, so the distance is ${n(m1)} × ${n(60 * M1)} = ${n(l1)} m.` },
   { prompt: `How far does it go in the second leg, ${n(V2)} km/h for ${n(M2)} minutes, in metres?`, answer: [l2], explanation: `${n(V2)} km/h = ${n(m2)} m/s and ${n(M2)} min = ${n(60 * M2)} s, so the distance is ${n(m2)} × ${n(60 * M2)} = ${n(l2)} m.` },
   { prompt: `The two legs cover ${n(l1)} m and ${n(l2)} m. How many metres is the rover from the pylon, which is ${n(D)} m from the depot?`, answer: [left], explanation: `The legs add to ${n(l1 + l2)} m, and ${n(D)} − ${n(l1 + l2)} = ${n(left)} m is still to go.` }
  ] }; }
});

mk({
 id: 'q01d', parent: 'q01', kind: 'challenge',
 title: 'The relay drone’s long haul',
 brief: 'A relay drone has been in the air since the morning check, and the flight log needs it in kilometres, hours and seconds.',
 labels: ['speed (km/h)', 'flight time (s)', 'distance (km)'], tolerance: 0.01,
 gl: [['speed (km/h)'], ['flight time (s)'], ['distance (km)']]
}, {
 /* V is a multiple of 5 m/s, so the speed in km/h (3.6 V) is a whole number and the distance V (3600 H + 60 M) ÷ 1000 km has at most one decimal place. */
 canonical: { V: 25, H: 2, M: 30 },
 draw: R => ({ V: 5 * R.int(2, 12), H: R.int(1, 3), M: R.int(2, 59) }),
 build: ({ V, H, M }) => { const kmh = 18 * V / 5, s = 3600 * H + 60 * M, km = 3 * V * (60 * H + M) / 50; return {
  prompt: `A relay drone cruises at ${n(V)} metres per second (m/s) on a survey flight that lasts ${pl(H, 'hour', 'hours')} and ${n(M)} minutes. Enter its speed in kilometres per hour (km/h), the flight time in seconds (s, typed without commas), then the distance it flies in kilometres (km).`,
  answer: [kmh, s, km],
  hints: ['Turn metres per second into kilometres per hour with (1 km ÷ 1000 m) and (3600 s ÷ 1 h): the seconds are underneath in m/s, so 3600 s goes on top.',
   'An hour is 3600 seconds and a minute is 60 seconds. Change the hours and the minutes to seconds and add them.',
   'Distance = speed × time. With the speed in m/s and the time in s the distance is in metres; then change it to kilometres.'],
  solution: `${n(V)} m/s × (1 km ÷ 1000 m) × (3600 s ÷ 1 h) = ${n(V * 3.6)} km/h. The flight time is ${n(H)} × 3600 + ${n(M)} × 60 = ${n(3600 * H)} + ${n(60 * M)} = ${n(s)} s. The distance is ${n(V)} m/s × ${n(s)} s = ${n(V * s)} m, which is ${n(km)} km.`,
  guidance: [
   { prompt: `What is ${n(V)} metres per second in kilometres per hour?`, answer: [kmh], explanation: `${n(V)} m/s × (1 km ÷ 1000 m) × (3600 s ÷ 1 h) = ${n(V * 3.6)} km/h.` },
   { prompt: `How many seconds are there in ${pl(H, 'hour', 'hours')} and ${n(M)} minutes?`, answer: [s], explanation: `${n(H)} × 3600 = ${n(3600 * H)} s and ${n(M)} × 60 = ${n(60 * M)} s, which makes ${n(s)} s.` },
   { prompt: `The drone flies at ${n(V)} m/s for ${n(s)} s. How many kilometres is that?`, answer: [km], explanation: `${n(V)} × ${n(s)} = ${n(V * s)} m, and dividing by 1000 gives ${n(km)} km.` }
  ] }; }
});

/* ---- q02 Powers of ten and metric prefixes [1.2] ---- */

mk({
 id: 'q02b', parent: 'q02', kind: 'setting',
 title: 'Dust, cable and flash',
 brief: 'The rail inspectors log a dust grain, a cable run and a flash lamp, and the report sheet wants each in a prefixed unit.',
 labels: ['grain width (μm)', 'cable length (km)', 'flash energy (kJ)'], tolerance: 0.01,
 gl: [['grain width (μm)'], ['cable length (km)'], ['flash energy (kJ)']]
}, {
 /* Mantissas a ÷ 10 from 1.2 to 9.9 (never a whole number), so each answer is the mantissa's digits or ten or a hundred times them.
    Never the q02 worked example (2.6 × 10⁴ m). */
 canonical: { a1: 64, e1: -5, a2: 73, e2: 4, a3: 51, e3: 6 },
 draw: R => { const m = () => R.int(12, 99); return retry(() => ({ a1: m(), e1: R.pick([-5, -4]), a2: m(), e2: R.pick([4, 5]), a3: m(), e3: R.pick([5, 6]) }),
  p => p.a1 % 10 && p.a2 % 10 && p.a3 % 10 && !(p.a2 === 26 && p.e2 === 4), { a1: 64, e1: -5, a2: 73, e2: 4, a3: 51, e3: 6 }); },
 build: ({ a1, e1, a2, e2, a3, e3 }) => { const m1 = a1 / 10, m2 = a2 / 10, m3 = a3 / 10, um = pw10(a1, e1 + 5), km = pw10(a2, e2 - 4), kJ = pw10(a3, e3 - 4); return {
  prompt: `The rail inspectors log three readings. A dust grain on the rail is ${n(m1)} × 10${sup(e1)} m wide, the cable run is ${n(m2)} × 10${sup(e2)} m long, and a flash lamp gives out ${n(m3)} × 10${sup(e3)} J of energy. Enter the grain width in micrometres (μm), the cable length in kilometres (km), then the energy in kilojoules (kJ), typed without commas.`,
  answer: [um, km, kJ],
  hints: ['micro- (μ) stands for 10⁻⁶ and kilo- (k) for 10³. To write a value in a prefixed unit, divide it by the prefix’s power of ten.',
   'Dividing powers of ten subtracts the exponents: 10ᵃ ÷ 10ᵇ = 10ᵃ⁻ᵇ. Then 10¹ moves the decimal point one place to the right, 10² two places, and 10⁰ = 1 leaves it where it is.'],
  solution: `Grain: ${n(m1)} × 10${sup(e1)} m ÷ 10⁻⁶ = ${n(m1)} × 10${sup(e1 + 6)} = ${n(um)} μm. Cable: ${n(m2)} × 10${sup(e2)} m ÷ 10³ = ${n(m2)} × 10${sup(e2 - 3)} = ${n(km)} km. Flash: ${n(m3)} × 10${sup(e3)} J ÷ 10³ = ${n(m3)} × 10${sup(e3 - 3)} = ${n(kJ)} kJ.`,
  guidance: [
   { prompt: `One micrometre is 10⁻⁶ m. What is ${n(m1)} × 10${sup(e1)} m ÷ 10⁻⁶, the grain width in micrometres?`, answer: [um], explanation: `The exponents subtract: ${n(e1)} − (−6) = ${n(e1 + 6)}, so the width is ${n(m1)} × 10${sup(e1 + 6)} = ${n(um)} μm.` },
   { prompt: `One kilometre is 10³ m. What is the cable, ${n(m2)} × 10${sup(e2)} m, in kilometres?`, answer: [km], explanation: `${n(e2)} − 3 = ${n(e2 - 3)}, so the cable is ${n(m2)} × 10${sup(e2 - 3)} = ${n(km)} km.` },
   { prompt: `One kilojoule is 10³ J. What is the flash energy, ${n(m3)} × 10${sup(e3)} J, in kilojoules?`, answer: [kJ], explanation: `${n(e3)} − 3 = ${n(e3 - 3)}, so the energy is ${n(m3)} × 10${sup(e3 - 3)} = ${n(kJ)} kJ.` }
  ] }; }
});

mk({
 id: 'q02c', parent: 'q02', kind: 'applied',
 title: 'The flag through the gate',
 brief: 'A timing gate on the sled rail logs how long a marker flag blocks its beam, and the crew wants the sled’s speed from it.',
 labels: ['passing time (μs)', 'sled speed (m/s)'], tolerance: 0.0005,
 gl: [['flag width (m)'], ['passing time (μs)'], ['sled speed (m/s)']]
}, {
 /* L = v a millimetres with v from 3 to 20 and a in {2, 4, 5, 8}, so the speed L ÷ a is the whole number v. Never v = 9 with a = 4 twice. */
 canonical: { L: 36, a: 4 },
 draw: R => { const a = R.pick([2, 4, 5, 8]), v = R.int(3, 20); return { L: v * a, a }; },
 build: ({ L, a }) => { const w = L / 1000, us = a * 1000, v = L / a; return {
  prompt: `A timing gate on the sled rail measures how long a marker flag takes to pass it. The flag is ${n(L)} millimetres (mm) wide, and the gate records the passing time as ${n(a)} × 10⁻³ s. Enter the passing time in microseconds (μs, typed without commas), then the sled’s speed in metres per second (m/s), found as the flag’s width in metres divided by the passing time in seconds.`,
  answer: [us, v],
  hints: ['milli- (m) stands for 10⁻³ and micro- (μ) for 10⁻⁶. To write the width in metres, multiply by 10⁻³ (mm → m); to write the time in microseconds, divide by 10⁻⁶ (s → μs).',
   'Speed = distance ÷ time, with the distance in metres and the time in seconds. Powers of ten divide by subtracting exponents.'],
  solution: `The width is ${n(L)} mm ÷ 1000 = ${n(w)} m. The time is ${n(a)} × 10⁻³ s ÷ 10⁻⁶ = ${n(a)} × 10³ = ${n(us)} μs. The speed is ${n(w)} m ÷ (${n(a)} × 10⁻³ s) = ${n(v)} m/s.`,
  guidance: [
   { prompt: `One millimetre is 10⁻³ m. What is the flag’s width, ${n(L)} mm, in metres?`, answer: [w], explanation: `${n(L)} mm ÷ 1000 = ${n(w)} m.` },
   { prompt: `One microsecond is 10⁻⁶ s. What is the passing time, ${n(a)} × 10⁻³ s, in microseconds?`, answer: [us], explanation: `The exponents subtract: −3 − (−6) = 3, so the time is ${n(a)} × 10³ = ${n(us)} μs.` },
   { prompt: `The flag, ${n(w)} m wide, passes the gate in ${n(a)} × 10⁻³ s. What is the sled’s speed in metres per second?`, answer: [v], explanation: `${n(w)} ÷ ${n(a / 1000)} = ${n(v)} m/s, because ${n(a)} × 10⁻³ s is ${n(a / 1000)} s.` }
  ] }; }
});

mk({
 id: 'q02d', parent: 'q02', kind: 'challenge',
 title: 'The same logs, new prefixes',
 brief: 'Three old logs use prefixes the new report does not, so each reading must jump from one prefixed unit to another.',
 labels: ['delay (ms)', 'path (m)', 'energy (kJ)'], tolerance: 0.01,
 gl: [['delay (ms)'], ['path (m)'], ['energy (kJ)']]
}, {
 /* Mantissas a ÷ 10 from 1.2 to 9.9. The delay's exponent is 3, 4 or 5 (answer a ÷ 10, a, 10 a); the path's and the energy's are −3, −2 or −1
    (answers a ÷ 10, a, 10 a). Each answer is a short decimal. */
 canonical: { a1: 24, e1: 3, a2: 56, e2: -1, a3: 39, e3: -2 },
 draw: R => { const m = () => R.int(12, 99); return retry(() => ({ a1: m(), e1: R.int(3, 5), a2: m(), e2: R.int(-3, -1), a3: m(), e3: R.int(-3, -1) }),
  p => p.a1 % 10 && p.a2 % 10 && p.a3 % 10, { a1: 24, e1: 3, a2: 56, e2: -1, a3: 39, e3: -2 }); },
 build: ({ a1, e1, a2, e2, a3, e3 }) => { const m1 = a1 / 10, m2 = a2 / 10, m3 = a3 / 10, ms = pw10(a1, e1 - 4), m = pw10(a2, e2 + 2), kJ = pw10(a3, e3 + 2); return {
  prompt: `Three old logs use different prefixes from the new report. A relay delay is ${n(m1)} × 10${sup(e1)} μs, a path is ${n(m2)} × 10${sup(e2)} km long, and a storage cell holds ${n(m3)} × 10${sup(e3)} MJ. To move from one prefixed unit to another, first multiply by the old prefix’s power of ten to reach the plain unit (for μs to s, × 10⁻⁶), then divide by the new prefix’s. Enter the delay in milliseconds (ms), the path in metres (m), then the energy in kilojoules (kJ).`,
  answer: [ms, m, kJ],
  hints: ['The prefixes are micro- (μ) 10⁻⁶, milli- (m) 10⁻³, kilo- (k) 10³ and mega- (M) 10⁶. Go to the plain unit first, then to the new prefix.',
   'Multiplying by the old power of ten and dividing by the new one add and subtract the exponents. Keep the exponent of the amount, add the old prefix’s exponent, and subtract the new one.'],
  solution: `Delay: ${n(m1)} × 10${sup(e1)} μs = ${n(m1)} × 10${sup(e1 - 6)} s, and ÷ 10⁻³ gives ${n(m1)} × 10${sup(e1 - 3)} = ${n(ms)} ms. Path: ${n(m2)} × 10${sup(e2)} km = ${n(m2)} × 10${sup(e2 + 3)} m = ${n(m)} m. Energy: ${n(m3)} × 10${sup(e3)} MJ = ${n(m3)} × 10${sup(e3 + 6)} J, and ÷ 10³ gives ${n(m3)} × 10${sup(e3 + 3)} = ${n(kJ)} kJ.`,
  guidance: [
   { prompt: `Write the delay, ${n(m1)} × 10${sup(e1)} μs, in milliseconds: × 10⁻⁶ to seconds, then ÷ 10⁻³. What is it?`, answer: [ms], explanation: `The exponent goes ${n(e1)} − 6 = ${n(e1 - 6)} for seconds and then ${n(e1 - 6)} + 3 = ${n(e1 - 3)}, so the delay is ${n(m1)} × 10${sup(e1 - 3)} = ${n(ms)} ms.` },
   { prompt: `Write the path, ${n(m2)} × 10${sup(e2)} km, in metres. What is it?`, answer: [m], explanation: `A kilometre is 10³ m, so the exponent goes ${n(e2)} + 3 = ${n(e2 + 3)} and the path is ${n(m2)} × 10${sup(e2 + 3)} = ${n(m)} m.` },
   { prompt: `Write the energy, ${n(m3)} × 10${sup(e3)} MJ, in kilojoules: × 10⁶ to joules, then ÷ 10³. What is it?`, answer: [kJ], explanation: `The exponent goes ${n(e3)} + 6 = ${n(e3 + 6)} for joules and then ${n(e3 + 6)} − 3 = ${n(e3 + 3)}, so the energy is ${n(m3)} × 10${sup(e3 + 3)} = ${n(kJ)} kJ.` }
  ] }; }
});

/* ---- q03 Vector components from magnitude and angle (radians) [2.2] ---- */

/* Which quarter of the compass an angle points into, for a wind (q03b). */
const windWhere = th => th < Math.PI / 2 ? `The angle ${n(th)} is between 0 and π/2 ≈ 1.57, so the wind blows towards the north-east: both parts are positive.`
 : th < Math.PI ? `The angle ${n(th)} is between π/2 ≈ 1.57 and π ≈ 3.14, so the wind blows towards the north-west: the eastward part is negative and the northward part positive.`
 : th < 3 * Math.PI / 2 ? `The angle ${n(th)} is between π ≈ 3.14 and 3π/2 ≈ 4.71, so the wind blows towards the south-west: both parts are negative.`
 : `The angle ${n(th)} is between 3π/2 ≈ 4.71 and 2π ≈ 6.28, so the wind blows towards the south-east: the eastward part is positive and the northward part negative.`;
/* Off the axes (|cos| and |sin| at least 0.15), so no component is nearly 0. */
/* An angle of exactly 1 radian is never drawn: the prompt would read "1 radians". */
const offAxes = th => Math.abs(Math.cos(th)) >= 0.15 && Math.abs(Math.sin(th)) >= 0.15 && th !== 1;

mk({
 id: 'q03b', parent: 'q03', kind: 'setting',
 title: 'Wind across the ridge',
 brief: 'A gust is crossing the ridge, and the anemometer’s single reading has to be split into an eastward part and a northward part.',
 labels: ['eastward part (m/s)', 'northward part (m/s)'], tolerance: 0.005,
 gl: [['eastward part (m/s)'], ['northward part (m/s)']]
}, {
 /* Never the q03 canonical (40 m at 2.1 rad) nor its worked example (10 m at 0.5 rad); off the axes and off rounding ties. */
 canonical: { S: 18, th10: 52 },
 draw: R => retry(() => ({ S: R.int(3, 30), th10: R.int(1, 62) }), ({ S, th10 }) => { const c = Math.cos(th10 / 10), s = Math.sin(th10 / 10);
  return offAxes(th10 / 10) && !tie(S * c, 2) && !tie(S * s, 2) && !(S === 40 && th10 === 21) && !(S === 10 && th10 === 5); }, { S: 18, th10: 52 }),
 build: ({ S, th10 }) => { const th = th10 / 10, c = Math.cos(th), s = Math.sin(th), x = S * c, y = S * s, X = r2(x), Y = r2(y); return {
  prompt: `A gust of wind crosses the ridge at ${n(S)} metres per second (m/s). Take the x-axis pointing east and the y-axis pointing north. The gust blows along a line that makes an angle of ${n(th)} radians with the positive x-axis, measured anticlockwise (from east towards north). Enter the eastward part of the wind (its x component), then the northward part (its y component), each in m/s to 2 decimal places. A negative part means the wind blows towards the west or the south.`,
  answer: [X, Y],
  hints: ['The x part is the speed times the cosine of the angle, and the y part is the speed times the sine. Work in radians.',
   'Round only at the end. Between π/2 and π the cosine is negative; between π and 3π/2 both are negative; between 3π/2 and 2π the sine is negative.'],
  solution: `${windWhere(th)} cos ${n(th)} ≈ ${n(c)} and sin ${n(th)} ≈ ${n(s)}. The eastward part is ${n(S)} × cos ${n(th)} ≈ ${n(x)} m/s, which is ${fx(X, 2)} m/s to 2 decimal places. The northward part is ${n(S)} × sin ${n(th)} ≈ ${n(y)} m/s, which is ${fx(Y, 2)} m/s to 2 decimal places.`,
  guidance: [
   { prompt: `What is the eastward part, ${n(S)} × cos ${n(th)}, in m/s to 2 decimal places?`, answer: [X], explanation: `cos ${n(th)} ≈ ${n(c)}, and ${n(S)} × cos ${n(th)} ≈ ${n(x)}, so the eastward part is ${fx(X, 2)} m/s.` },
   { prompt: `What is the northward part, ${n(S)} × sin ${n(th)}, in m/s to 2 decimal places?`, answer: [Y], explanation: `sin ${n(th)} ≈ ${n(s)}, and ${n(S)} × sin ${n(th)} ≈ ${n(y)}, so the northward part is ${fx(Y, 2)} m/s.` }
  ] }; }
});

mk({
 id: 'q03c', parent: 'q03', kind: 'applied',
 title: 'Will the ramp clear the shelf?',
 brief: 'A new sled ramp is being laid up the slope, and the crew must know whether its top will clear a rock shelf.',
 labels: ['horizontal run (m)', 'height gained (m)', 'clearance (m)'], tolerance: 0.005,
 gl: [['horizontal run (m)'], ['height gained (m)'], ['clearance (m)']]
}, {
 /* The angle is 0.2 to 1.3 rad, so both parts are positive. The shelf height H is a whole number of metres within 8 m of the ramp's rise, at least 1. */
 canonical: { L: 80, th10: 7, H: 45 },
 draw: R => retry(() => { const L = R.int(20, 120), th10 = R.except(2, 13, [10]), rise = L * Math.sin(th10 / 10); return { L, th10, H: Math.max(1, Math.round(rise) + R.int(-8, 8)) }; },
  ({ L, th10, H }) => { const th = th10 / 10; return !tie(L * Math.cos(th), 2) && !tie(L * Math.sin(th), 2); }, { L: 80, th10: 7, H: 45 }),
 build: ({ L, th10, H }) => { const th = th10 / 10, c = Math.cos(th), s = Math.sin(th), run = L * c, rise = L * s, cl = rise - H, RUN = r2(run), RISE = r2(rise), CL = r2(cl); return {
  prompt: `A new sled ramp is laid up the slope as a straight track ${n(L)} m long. The track makes an angle of ${n(th)} radians with the horizontal. Take x as the distance along the ground and y as the height gained from the ramp’s foot. A rock shelf beside the top of the ramp stands ${n(H)} m above the foot. Enter the horizontal run of the track, then the height it gains, then the clearance (the height gained minus the shelf’s height; negative if the ramp ends below the shelf), each in metres to 2 decimal places.`,
  answer: [RUN, RISE, CL],
  hints: ['Treat the track as a vector of magnitude equal to its length, at the given angle from the horizontal x-axis. The run is its x component and the height gained its y component.',
   'The run is the length times the cosine of the angle and the height gained is the length times the sine, in radians. The clearance is the height gained minus the shelf’s height; round only at the end.'],
  solution: `The run is ${n(L)} × cos ${n(th)} ≈ ${n(run)} m, which is ${fx(RUN, 2)} m to 2 decimal places. The height gained is ${n(L)} × sin ${n(th)} ≈ ${n(rise)} m, which is ${fx(RISE, 2)} m. The clearance is ${n(rise)} − ${n(H)} ≈ ${n(cl)} m, which is ${fx(CL, 2)} m to 2 decimal places: ${cl >= 0 ? 'the top of the ramp is above the shelf' : 'the top of the ramp is below the shelf'}.`,
  guidance: [
   { prompt: `What is the horizontal run, ${n(L)} × cos ${n(th)}, in metres to 2 decimal places?`, answer: [RUN], explanation: `cos ${n(th)} ≈ ${n(c)}, and ${n(L)} × cos ${n(th)} ≈ ${n(run)}, so the run is ${fx(RUN, 2)} m.` },
   { prompt: `What is the height gained, ${n(L)} × sin ${n(th)}, in metres to 2 decimal places?`, answer: [RISE], explanation: `sin ${n(th)} ≈ ${n(s)}, and ${n(L)} × sin ${n(th)} ≈ ${n(rise)}, so the height gained is ${fx(RISE, 2)} m.` },
   { prompt: `The ramp gains ${fx(RISE, 2)} m and the shelf is ${n(H)} m above the foot. What is the clearance (height gained minus ${n(H)}), in metres to 2 decimal places?`, answer: [CL], explanation: `${fx(RISE, 2)} − ${n(H)} = ${fx(CL, 2)}, so the clearance is ${fx(CL, 2)} m.` }
  ] }; }
});

mk({
 id: 'q03d', parent: 'q03', kind: 'challenge', uses: 'q02',
 title: 'The balloon on the tracking line',
 brief: 'The tracking radar gives a weather balloon’s range in plain metres, but the chart is drawn in kilometres.',
 labels: ['x component (km)', 'y component (km)'], tolerance: 0.0005,
 gl: [['range (km)'], ['x component (km)'], ['y component (km)']]
}, {
 /* The range is a ÷ 10 × 10ᵉ m with e = 3 or 4, so it is a ÷ 10 or a kilometres. Off the axes and off rounding ties at 3 decimal places.
    Never the q03 canonical (40 m at 2.1 rad) nor its worked example (10 m at 0.5 rad). */
 canonical: { a: 36, e: 4, th10: 38 },
 draw: R => retry(() => ({ a: R.int(12, 99), e: R.int(3, 4), th10: R.int(1, 62) }), ({ a, e, th10 }) => { const th = th10 / 10, M = pw10(a, e - 4);
  return a % 10 && offAxes(th) && !tie(M * Math.cos(th), 3) && !tie(M * Math.sin(th), 3) && th10 !== 21 && th10 !== 5; }, { a: 36, e: 4, th10: 38 }),
 build: ({ a, e, th10 }) => { const th = th10 / 10, m = a / 10, M = pw10(a, e - 4), c = Math.cos(th), s = Math.sin(th), x = M * c, y = M * s, X = r3(x), Y = r3(y); return {
  prompt: `A weather balloon is tracked at a range of ${n(m)} × 10${sup(e)} m from the survey mast. Take the x-axis pointing east and the y-axis pointing north. The line from the mast to the balloon makes an angle of ${n(th)} radians with the positive x-axis, measured anticlockwise (from east towards north). Enter the x component, then the y component, of the vector from the mast to the balloon, each in kilometres (km) to 3 decimal places. A negative component points west or south.`,
  answer: [X, Y],
  hints: ['Kilo- stands for 10³, so divide the range in metres by 10³ to get kilometres: subtract 3 from the power of ten.',
   'The x component is the magnitude times the cosine of the angle and the y component is the magnitude times the sine, in radians. Round only at the end.'],
  solution: `The range is ${n(m)} × 10${sup(e)} m ÷ 10³ = ${n(m)} × 10${sup(e - 3)} = ${n(M)} km. cos ${n(th)} ≈ ${n(c)} and sin ${n(th)} ≈ ${n(s)}. The x component is ${n(M)} × cos ${n(th)} ≈ ${n(x)} km, which is ${fx(X, 3)} km to 3 decimal places. The y component is ${n(M)} × sin ${n(th)} ≈ ${n(y)} km, which is ${fx(Y, 3)} km to 3 decimal places.`,
  guidance: [
   { prompt: `What is the range, ${n(m)} × 10${sup(e)} m, in kilometres (divide by 10³)?`, answer: [M], explanation: `${n(e)} − 3 = ${n(e - 3)}, so the range is ${n(m)} × 10${sup(e - 3)} = ${n(M)} km.` },
   { prompt: `What is the x component, ${n(M)} × cos ${n(th)}, in kilometres to 3 decimal places?`, answer: [X], explanation: `cos ${n(th)} ≈ ${n(c)}, and ${n(M)} × cos ${n(th)} ≈ ${n(x)}, so the x component is ${fx(X, 3)} km.` },
   { prompt: `What is the y component, ${n(M)} × sin ${n(th)}, in kilometres to 3 decimal places?`, answer: [Y], explanation: `sin ${n(th)} ≈ ${n(s)}, and ${n(M)} × sin ${n(th)} ≈ ${n(y)}, so the y component is ${fx(Y, 3)} km.` }
  ] }; }
});

/* ---- q04 Adding vectors by components; magnitude and direction of the resultant [2.3] ---- */

/* A signed move in words: seg(−4, 'east', 'west') is "4 m west". */
const seg = (v, pos, neg) => `${n(Math.abs(v))} m ${v > 0 ? pos : neg}`;

mk({
 id: 'q04b', parent: 'q04', kind: 'setting',
 title: 'The balloon in two drifts',
 brief: 'A survey balloon was pushed by two gusts in turn, and the office wants the single straight line from where it started to where it ended up.',
 labels: ['total east (m)', 'total north (m)', 'distance (m)', 'angle (rad)'], tolerance: 0.005,
 gl: [['total east (m)'], ['total north (m)'], ['distance (m)'], ['angle (rad)']]
}, {
 /* Four non-zero whole moves from −12 to 12, at least one negative, whose totals are both positive (so the angle is tan⁻¹(Ry ÷ Rx)); never the
    q04 canonical moves (7, −2) and (−3, 8), and off rounding ties. */
 canonical: { a: 10, b: -4, c: -3, d: 9 },
 draw: R => retry(() => ({ a: R.nz(-12, 12), b: R.nz(-12, 12), c: R.nz(-12, 12), d: R.nz(-12, 12) }), ({ a, b, c, d }) => { const x = a + c, y = b + d;
  return x >= 1 && y >= 1 && Math.min(a, b, c, d) < 0 && x !== y && !tie(Math.hypot(x, y), 2) && !tie(Math.atan(y / x), 2) && !(a === 7 && b === -2 && c === -3 && d === 8); }, { a: 10, b: -4, c: -3, d: 9 }),
 build: ({ a, b, c, d }) => { const x = a + c, y = b + d, m = Math.hypot(x, y), th = Math.atan(y / x), M = r2(m), TH = r2(th); return {
  prompt: `A survey balloon is pushed by two gusts in turn. In the first drift it moves ${seg(a, 'east', 'west')} and ${seg(b, 'north', 'south')}. In the second it moves ${seg(c, 'east', 'west')} and ${seg(d, 'north', 'south')}. Take x as east and y as north, so a move west or south is negative. Enter its total move east, then its total move north, both in metres, then its straight-line distance from the start in metres to 2 decimal places, then the direction of that straight line: the angle from the positive x-axis, anticlockwise, in radians to 2 decimal places. Both totals are positive here, so that angle lies between 0 and π/2.`,
  answer: [x, y, M, TH],
  hints: ['Add the x moves to get the total x, and the y moves to get the total y. West and south moves are negative.',
   'The straight-line distance is √(x² + y²) for the two totals. When both totals are positive, the angle is tan⁻¹(y ÷ x), in radians.'],
  solution: `Total x: ${n(a)} + ${par(c)} = ${n(x)} m. Total y: ${n(b)} + ${par(d)} = ${n(y)} m. The distance is √(${par(x)}² + ${par(y)}²) = √${n(x * x + y * y)} ≈ ${n(m)}, which is ${fx(M, 2)} m to 2 decimal places. The angle is tan⁻¹(${n(y)} ÷ ${n(x)}) ≈ ${n(th)}, which is ${fx(TH, 2)} radians to 2 decimal places.`,
  guidance: [
   { prompt: `Add the two moves along x (east is positive, west negative): ${n(a)} and ${n(c)}. What is the total x, in metres?`, answer: [x], explanation: `${n(a)} + ${par(c)} = ${n(x)} m.` },
   { prompt: `Add the two moves along y (north is positive, south negative): ${n(b)} and ${n(d)}. What is the total y, in metres?`, answer: [y], explanation: `${n(b)} + ${par(d)} = ${n(y)} m.` },
   { prompt: `What is √(${n(x)}² + ${n(y)}²), the straight-line distance, in metres to 2 decimal places?`, answer: [M], explanation: `${n(x)}² + ${n(y)}² = ${n(x * x)} + ${n(y * y)} = ${n(x * x + y * y)}, and √${n(x * x + y * y)} ≈ ${n(m)}, so the distance is ${fx(M, 2)} m.` },
   { prompt: `What is the angle tan⁻¹(${n(y)} ÷ ${n(x)}), in radians to 2 decimal places?`, answer: [TH], explanation: `${n(y)} ÷ ${n(x)} ≈ ${n(y / x)}, and tan⁻¹ of that is about ${n(th)} radians, which rounds to ${fx(TH, 2)}.` }
  ] }; }
});

mk({
 id: 'q04c', parent: 'q04', kind: 'applied',
 title: 'The drone’s way home',
 brief: 'A survey drone is low on charge after three legs, and Mira needs the length of the straight flight that would bring it back to the mast.',
 labels: ['total east (m)', 'total north (m)', 'return distance (m)'], tolerance: 0.005,
 gl: [['total east (m)'], ['total north (m)'], ['return distance (m)']]
}, {
 /* Six non-zero whole components from −12 to 12; the totals are both non-zero (so neither answer box is 0) and the return distance is off rounding ties.
    Never the two legs of the q04 canonical (7î − 2ĵ and −3î + 8ĵ together). */
 canonical: { ax: 6, ay: 5, bx: -9, by: 3, cx: 4, cy: -11 },
 draw: R => retry(() => ({ ax: R.nz(-12, 12), ay: R.nz(-12, 12), bx: R.nz(-12, 12), by: R.nz(-12, 12), cx: R.nz(-12, 12), cy: R.nz(-12, 12) }), p => { const x = p.ax + p.bx + p.cx, y = p.ay + p.by + p.cy;
  return x !== 0 && y !== 0 && !tie(Math.hypot(x, y), 2) && !(p.ax === 7 && p.ay === -2 && p.bx === -3 && p.by === 8); }, { ax: 6, ay: 5, bx: -9, by: 3, cx: 4, cy: -11 }),
 build: ({ ax, ay, bx, by, cx, cy }) => { const x = ax + bx + cx, y = ay + by + cy, m = Math.hypot(x, y), M = r2(m); return {
  prompt: `A survey drone flies three straight legs from the mast: A = ${vIJ(ax, ay)} metres, then B = ${vIJ(bx, by)} metres, then C = ${vIJ(cx, cy)} metres, where î points east and ĵ points north. It then has to fly straight back to the mast. Enter the total move of the three legs east, then north, in metres (a negative total means west or south), then the length of the straight flight back to the mast in metres to 2 decimal places.`,
  answer: [x, y, M],
  hints: ['The resultant of three vectors is found the same way as for two: add the x components of A, B and C, and add their y components.',
   'The straight flight back is as long as the resultant’s magnitude, √(x² + y²), where x and y are the two totals. It does not matter which way the totals point, because they are squared.'],
  solution: `Total x: ${n(ax)} + ${par(bx)} + ${par(cx)} = ${n(x)} m. Total y: ${n(ay)} + ${par(by)} + ${par(cy)} = ${n(y)} m. The way back is as long as √(${par(x)}² + ${par(y)}²) = √${n(x * x + y * y)} ≈ ${n(m)}, which is ${fx(M, 2)} m to 2 decimal places.`,
  guidance: [
   { prompt: `Add the x components of the three legs: ${n(ax)}, ${n(bx)} and ${n(cx)}. What is the total x, in metres?`, answer: [x], explanation: `${n(ax)} + ${par(bx)} + ${par(cx)} = ${n(x)} m.` },
   { prompt: `Add the y components of the three legs: ${n(ay)}, ${n(by)} and ${n(cy)}. What is the total y, in metres?`, answer: [y], explanation: `${n(ay)} + ${par(by)} + ${par(cy)} = ${n(y)} m.` },
   { prompt: `What is √(${par(x)}² + ${par(y)}²), the length of the straight flight back, in metres to 2 decimal places?`, answer: [M], explanation: `${par(x)}² + ${par(y)}² = ${n(x * x)} + ${n(y * y)} = ${n(x * x + y * y)}, and √${n(x * x + y * y)} ≈ ${n(m)}, so the flight back is ${fx(M, 2)} m.` }
  ] }; }
});

mk({
 id: 'q04d', parent: 'q04', kind: 'challenge', uses: 'q03',
 title: 'A leg by angle, a leg by parts',
 brief: 'The drone’s first leg was logged as a length and a bearing, its second as east and north moves, and both must be merged into one resultant.',
 labels: ['Rx (m)', 'Ry (m)', 'magnitude (m)'], tolerance: 0.005,
 gl: [['x component of A (m)'], ['y component of A (m)'], ['Rx (m)'], ['Ry (m)'], ['magnitude (m)']]
}, {
 /* A is M m at th10 ÷ 10 radians, off the axes. Both parts of B are whole numbers from −12 to 12. The resultant's parts are at least 1 in size, and
    the 2-decimal answers are off rounding ties, and the magnitude rounds the same from the rounded parts as from the exact ones. */
 canonical: { M: 25, th10: 6, bx: -4, by: 9 },
 draw: R => retry(() => ({ M: R.int(10, 60), th10: R.int(1, 62), bx: R.nz(-12, 12), by: R.nz(-12, 12) }), ({ M, th10, bx, by }) => { const th = th10 / 10, ax = M * Math.cos(th), ay = M * Math.sin(th), x = ax + bx, y = ay + by, h = Math.hypot(x, y);
   return offAxes(th) && Math.abs(x) >= 1 && Math.abs(y) >= 1 && !tie(ax, 2) && !tie(ay, 2) && !tie(h, 2) && r2(Math.hypot(r2(x), r2(y))) === r2(h); }, { M: 25, th10: 6, bx: -4, by: 9 }),
 build: ({ M, th10, bx, by }) => { const th = th10 / 10, c = Math.cos(th), s = Math.sin(th), ax = M * c, ay = M * s, x = ax + bx, y = ay + by, h = Math.hypot(x, y), AX = r2(ax), AY = r2(ay), X = r2(x), Y = r2(y), H = r2(h); return {
  prompt: `A survey drone flies two legs from the mast, with x pointing east and y pointing north, in metres. The first leg is A: ${n(M)} m long, at an angle of ${n(th)} radians from the positive x-axis, measured anticlockwise. The second leg is the vector B = ${vIJ(bx, by)} metres. Enter the x component, then the y component, of the resultant R = A + B, then the magnitude of R, each in metres to 2 decimal places.`,
  answer: [X, Y, H],
  hints: ['A is given by magnitude and angle, so first split it into components: Ax = A cos θ and Ay = A sin θ, in radians. B is already in components.',
   'Add matching components: Rx = Ax + Bx and Ry = Ay + By. Then the magnitude is √(Rx² + Ry²). Round only at the end.'],
  solution: `Ax = ${n(M)} × cos ${n(th)} ≈ ${n(ax)} m and Ay = ${n(M)} × sin ${n(th)} ≈ ${n(ay)} m. So Rx = ${n(ax)} + ${par(bx)} ≈ ${n(x)}, which is ${fx(X, 2)} m, and Ry = ${n(ay)} + ${par(by)} ≈ ${n(y)}, which is ${fx(Y, 2)} m. The magnitude is √(${par(x)}² + ${par(y)}²) ≈ ${n(h)}, which is ${fx(H, 2)} m to 2 decimal places.`,
  guidance: [
   { prompt: `What is the x component of A, ${n(M)} × cos ${n(th)}, in metres to 2 decimal places?`, answer: [AX], explanation: `cos ${n(th)} ≈ ${n(c)}, and ${n(M)} × cos ${n(th)} ≈ ${n(ax)}, so Ax is ${fx(AX, 2)} m.` },
   { prompt: `What is the y component of A, ${n(M)} × sin ${n(th)}, in metres to 2 decimal places?`, answer: [AY], explanation: `sin ${n(th)} ≈ ${n(s)}, and ${n(M)} × sin ${n(th)} ≈ ${n(ay)}, so Ay is ${fx(AY, 2)} m.` },
   { prompt: `Add the x components: Ax ≈ ${fx(AX, 2)} and Bx = ${n(bx)}. What is Rx, in metres to 2 decimal places?`, answer: [X], explanation: `${fx(AX, 2)} + ${par(bx)} = ${fx(X, 2)}, so Rx is ${fx(X, 2)} m.` },
   { prompt: `Add the y components: Ay ≈ ${fx(AY, 2)} and By = ${n(by)}. What is Ry, in metres to 2 decimal places?`, answer: [Y], explanation: `${fx(AY, 2)} + ${par(by)} = ${fx(Y, 2)}, so Ry is ${fx(Y, 2)} m.` },
   { prompt: `What is the magnitude √(Rx² + Ry²), in metres to 2 decimal places?`, answer: [H], explanation: `√(${par(x)}² + ${par(y)}²) ≈ ${n(h)}, so the magnitude is ${fx(H, 2)} m.` }
  ] }; }
});

/* ---- q05 The dot product and the angle between two vectors [2.4] ---- */

mk({
 id: 'q05b', parent: 'q05', kind: 'setting',
 title: 'Hut, tank and shed',
 brief: 'From the survey hut the water tank and the generator shed lie in two directions, and the crew wants the angle at the hut between them.',
 labels: ['A · B (m²)', 'angle (rad)'], tolerance: 0.0005,
 gl: [['A · B (m²)'], ['|A| (m)'], ['|B| (m)'], ['angle (rad)']]
}, {
 /* Whole components from −9 to 9 (none 0), not nearly parallel (|cos φ| at most 0.98), magnitudes and angle off rounding ties at 3 decimal places.
    Never the q05 canonical (4î + 3ĵ and 2î − 5ĵ) nor its worked example (î + 2ĵ and 3î + ĵ). */
 canonical: { ax: 5, ay: -2, bx: 3, by: 6 },
 draw: R => retry(() => ({ ax: R.nz(-9, 9), ay: R.nz(-9, 9), bx: R.nz(-9, 9), by: R.nz(-9, 9) }), ({ ax, ay, bx, by }) => { const A = Math.hypot(ax, ay), B = Math.hypot(bx, by), d = ax * bx + ay * by;
  return Math.abs(d / (A * B)) <= 0.98 && !tie(A, 3) && !tie(B, 3) && !tie(Math.acos(d / (A * B)), 3) && !(ax === 4 && ay === 3 && bx === 2 && by === -5) && !(ax === 1 && ay === 2 && bx === 3 && by === 1); }, { ax: 5, ay: -2, bx: 3, by: 6 }),
 build: ({ ax, ay, bx, by }) => { const d = ax * bx + ay * by, A = Math.hypot(ax, ay), B = Math.hypot(bx, by), c = d / (A * B), ph = Math.acos(c), A3 = r3(A), B3 = r3(B), PH = r3(ph); return {
  prompt: `Seen from the survey hut, the water tank lies along the vector A = ${vIJ(ax, ay)} and the generator shed along the vector B = ${vIJ(bx, by)}, in metres (î points east, ĵ points north). Enter the dot product A · B in square metres (m²), then the angle at the hut between the two directions, in radians to 3 decimal places.`,
  answer: [d, PH],
  hints: ['Multiply the x components, multiply the y components, and add the two products: A · B = AxBx + AyBy.',
   'The dot product also equals |A| |B| cos φ, where φ is the angle between the vectors. So divide by the two magnitudes to get cos φ, then take the inverse cosine, which gives an angle between 0 and π.'],
  solution: `A · B = ${par(ax)} × ${par(bx)} + ${par(ay)} × ${par(by)} = ${n(ax * bx)} + ${par(ay * by)} = ${n(d)} m². The magnitudes are |A| = √${n(ax * ax + ay * ay)} ≈ ${n(A)} m and |B| = √${n(bx * bx + by * by)} ≈ ${n(B)} m. So cos φ = ${n(d)} ÷ (${n(A)} × ${n(B)}) ≈ ${n(c)}, and φ = cos⁻¹(${n(c)}) ≈ ${n(ph)}, which is ${fx(PH, 3)} radians to 3 decimal places.`,
  guidance: [
   { prompt: `What is A · B = ${par(ax)} × ${par(bx)} + ${par(ay)} × ${par(by)}, in square metres?`, answer: [d], explanation: `${n(ax * bx)} + ${par(ay * by)} = ${n(d)} m².` },
   { prompt: `What is the magnitude |A| = √(${par(ax)}² + ${par(ay)}²), in metres to 3 decimal places?`, answer: [A3], explanation: `${n(ax * ax)} + ${n(ay * ay)} = ${n(ax * ax + ay * ay)}, and √${n(ax * ax + ay * ay)} ≈ ${n(A)}, so |A| ≈ ${fx(A3, 3)} m. Keep the unrounded value for the last step.` },
   { prompt: `What is the magnitude |B| = √(${par(bx)}² + ${par(by)}²), in metres to 3 decimal places?`, answer: [B3], explanation: `${n(bx * bx)} + ${n(by * by)} = ${n(bx * bx + by * by)}, and √${n(bx * bx + by * by)} ≈ ${n(B)}, so |B| ≈ ${fx(B3, 3)} m. Keep the unrounded value for the last step.` },
   { prompt: `cos φ = A · B ÷ (|A| |B|). What is the angle φ, in radians to 3 decimal places?`, answer: [PH], explanation: `cos φ = ${n(d)} ÷ (${n(A)} × ${n(B)}) ≈ ${n(c)}, and cos⁻¹(${n(c)}) ≈ ${n(ph)}, so φ ≈ ${fx(PH, 3)} radians.` }
  ] }; }
});

mk({
 id: 'q05c', parent: 'q05', kind: 'applied',
 title: 'The panel facing the sun',
 brief: 'The outpost’s solar panel is tilted away from the sun, and Mira wants to know how much of the full light it still catches.',
 labels: ['N · S', '|N| |S|', 'sunlight caught (%)'], tolerance: 0.0005,
 gl: [['N · S'], ['|N| |S|'], ['sunlight caught (%)']]
}, {
 /* Whole components from −9 to 9 (none 0) with N · S > 0 and cos φ from 0.2 to 0.98, so the angle is below π/2. The percentage is off rounding ties and
    is the same from the rounded product |N| |S| as from the exact one. */
 canonical: { nx: 3, ny: 4, sx: 6, sy: 1 },
 draw: R => retry(() => ({ nx: R.nz(-9, 9), ny: R.nz(-9, 9), sx: R.nz(-9, 9), sy: R.nz(-9, 9) }), ({ nx, ny, sx, sy }) => { const d = nx * sx + ny * sy, P = Math.hypot(nx, ny) * Math.hypot(sx, sy), c = d / P;
  return d > 0 && c >= 0.2 && c <= 0.98 && !tie(P, 3) && !tie(100 * c, 1) && r1(100 * d / r3(P)) === r1(100 * c); }, { nx: 3, ny: 4, sx: 6, sy: 1 }),
 build: ({ nx, ny, sx, sy }) => { const d = nx * sx + ny * sy, N = Math.hypot(nx, ny), S = Math.hypot(sx, sy), P = N * S, c = d / P, p3 = r3(P), pct = r1(100 * c); return {
  prompt: `On a flat map of the ridge (î east, ĵ north), the outpost’s solar panel faces along the direction N = ${vIJ(nx, ny)}, and the sun lies along the direction S = ${vIJ(sx, sy)} from the panel. Only the directions matter. When the angle φ between N and S is less than π/2, the panel catches the fraction cos φ of full sunlight. Enter N · S, then the product of the two magnitudes |N| |S| to 3 decimal places, then the percentage of full sunlight the panel catches (100 × cos φ) to 1 decimal place.`,
  answer: [d, p3, pct],
  hints: ['Multiply matching components and add: N · S = NxSx + NySy.',
   'Find each magnitude as √(x² + y²) and multiply the two. Keep every digit until you round at the end.',
   'cos φ = N · S ÷ (|N| |S|), and the percentage is 100 times that.'],
  solution: `N · S = ${par(nx)} × ${par(sx)} + ${par(ny)} × ${par(sy)} = ${n(nx * sx)} + ${par(ny * sy)} = ${n(d)}. The magnitudes are |N| = √${n(nx * nx + ny * ny)} ≈ ${n(N)} and |S| = √${n(sx * sx + sy * sy)} ≈ ${n(S)}, so |N| |S| = √${n((nx * nx + ny * ny) * (sx * sx + sy * sy))} ≈ ${n(P)}, which is ${fx(p3, 3)} to 3 decimal places. Then cos φ = ${n(d)} ÷ ${n(P)} ≈ ${n(c)}, so the panel catches about ${n(100 * c)} %, which is ${fx(pct, 1)} % to 1 decimal place.`,
  guidance: [
   { prompt: `What is N · S = ${par(nx)} × ${par(sx)} + ${par(ny)} × ${par(sy)}?`, answer: [d], explanation: `${n(nx * sx)} + ${par(ny * sy)} = ${n(d)}.` },
   { prompt: `What is |N| |S| = √(${par(nx)}² + ${par(ny)}²) × √(${par(sx)}² + ${par(sy)}²), to 3 decimal places?`, answer: [p3], explanation: `√${n(nx * nx + ny * ny)} × √${n(sx * sx + sy * sy)} ≈ ${n(N)} × ${n(S)} ≈ ${n(P)}, which is ${fx(p3, 3)}.` },
   { prompt: `cos φ = N · S ÷ (|N| |S|) = ${n(d)} ÷ ${fx(p3, 3)}. What percentage of full sunlight does the panel catch (100 × cos φ), to 1 decimal place?`, answer: [pct], explanation: `${n(d)} ÷ ${n(P)} ≈ ${n(c)}, and 100 × ${n(c)} ≈ ${n(100 * c)}, so the panel catches ${fx(pct, 1)} %.` }
  ] }; }
});

mk({
 id: 'q05d', parent: 'q05', kind: 'challenge', uses: 'q04',
 title: 'The resultant against the relay line',
 brief: 'A drone’s two legs add up to one move, and the relay antenna must be turned from that move towards the relay line.',
 labels: ['R · C (m²)', 'angle (rad)'], tolerance: 0.0005,
 gl: [['Rx (m)'], ['Ry (m)'], ['R · C (m²)'], ['angle (rad)']]
}, {
 /* Whole components from −9 to 9 (none 0). The resultant's parts are both non-zero, R · C is not 0, the angle between R and C is not nearly 0 or π
    (|cos φ| at most 0.98) and is off rounding ties at 3 decimal places. */
 canonical: { ax: 5, ay: 2, bx: -1, by: 4, cx: 5, cy: 3 },
 draw: R => retry(() => ({ ax: R.nz(-9, 9), ay: R.nz(-9, 9), bx: R.nz(-9, 9), by: R.nz(-9, 9), cx: R.nz(-9, 9), cy: R.nz(-9, 9) }), p => { const x = p.ax + p.bx, y = p.ay + p.by, d = x * p.cx + y * p.cy, c = d / (Math.hypot(x, y) * Math.hypot(p.cx, p.cy));
  return x !== 0 && y !== 0 && d !== 0 && Math.abs(c) <= 0.98 && !tie(Math.acos(c), 3); }, { ax: 5, ay: 2, bx: -1, by: 4, cx: 5, cy: 3 }),
 build: ({ ax, ay, bx, by, cx, cy }) => { const x = ax + bx, y = ay + by, d = x * cx + y * cy, Rm = Math.hypot(x, y), Cm = Math.hypot(cx, cy), c = d / (Rm * Cm), ph = Math.acos(c), PH = r3(ph); return {
  prompt: `A survey drone flies two legs from the mast, A = ${vIJ(ax, ay)} metres and then B = ${vIJ(bx, by)} metres (î points east, ĵ north), so its total move is the resultant R = A + B. A radio relay line leaves the mast along C = ${vIJ(cx, cy)} metres. Enter the dot product R · C in square metres (m²), then the angle between R and C in radians to 3 decimal places.`,
  answer: [d, PH],
  hints: ['First add matching components to get R. Then multiply the x components of R and C, multiply their y components, and add the two products.',
   'The dot product equals |R| |C| cos φ, so cos φ = R · C ÷ (|R| |C|). The inverse cosine of that is the angle, between 0 and π. Keep every digit until you round at the end.'],
  solution: `Rx = ${n(ax)} + ${par(bx)} = ${n(x)} m and Ry = ${n(ay)} + ${par(by)} = ${n(y)} m. Then R · C = ${par(x)} × ${par(cx)} + ${par(y)} × ${par(cy)} = ${n(x * cx)} + ${par(y * cy)} = ${n(d)} m². The magnitudes are |R| = √${n(x * x + y * y)} ≈ ${n(Rm)} m and |C| = √${n(cx * cx + cy * cy)} ≈ ${n(Cm)} m, so cos φ = ${n(d)} ÷ (${n(Rm)} × ${n(Cm)}) ≈ ${n(c)}, and φ = cos⁻¹(${n(c)}) ≈ ${n(ph)}, which is ${fx(PH, 3)} radians to 3 decimal places.`,
  guidance: [
   { prompt: `Add the x components of A and B: ${n(ax)} and ${n(bx)}. What is Rx, in metres?`, answer: [x], explanation: `${n(ax)} + ${par(bx)} = ${n(x)} m.` },
   { prompt: `Add the y components of A and B: ${n(ay)} and ${n(by)}. What is Ry, in metres?`, answer: [y], explanation: `${n(ay)} + ${par(by)} = ${n(y)} m.` },
   { prompt: `What is R · C = ${par(x)} × ${par(cx)} + ${par(y)} × ${par(cy)}, in square metres?`, answer: [d], explanation: `${n(x * cx)} + ${par(y * cy)} = ${n(d)} m².` },
   { prompt: `cos φ = R · C ÷ (|R| |C|), with |R| = √${n(x * x + y * y)} and |C| = √${n(cx * cx + cy * cy)}. What is the angle φ, in radians to 3 decimal places?`, answer: [PH], explanation: `cos φ = ${n(d)} ÷ (${n(Rm)} × ${n(Cm)}) ≈ ${n(c)}, and cos⁻¹(${n(c)}) ≈ ${n(ph)}, so φ ≈ ${fx(PH, 3)} radians.` }
  ] }; }
});

})();
