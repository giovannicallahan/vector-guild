/* Electricity and magnetism: fields mission generators, file b: q11–q20. Shape and helpers: docs/PACK-FORMAT.md §3 and game/gen-core.js.
   build(canonical) must reproduce the authored text in missions-b.js exactly. */
(function(){
'use strict';
const G = window.Gen, { n, plus, par } = G;
/* Constants as the prompts print them. */
const EPS = 8.85e-12, K = 8.99e9, QE = 1.6e-19, MP = 1.67e-27, MHE = 6.64e-27;
/* Round to 2 decimal places; tie2 is true when x sits on (or within float noise of) a rounding tie at the 2nd place. */
const rd2 = x => Math.round(x * 100 + (x >= 0 ? 1e-9 : -1e-9)) / 100;
const tie2 = x => Math.abs(Math.abs(x * 100) % 1 - 0.5) < 1e-4;
/* A bounded retry: at most 1000 tries, then the canonical parameters. */
const tries = (make, ok, fallback) => { for (let i = 0; i < 1000; i++) { const p = make(); if (ok(p)) return p; } return { ...fallback }; };
/* Signed terms for a polynomial: trm(−9, 'x²') is '− 9x²', trm(2, 'x³', true) is '2x³'; cst(40) is '+ 40'. */
const trm = (v, x, first) => first ? `${v < 0 ? '−' : ''}${n(Math.abs(v))}${x}` : `${v < 0 ? '−' : '+'} ${n(Math.abs(v))}${x}`;
const cst = v => `${v < 0 ? '−' : '+'} ${n(Math.abs(v))}`;
/* Words for the direction of a radial field. */
const way = (E, shape) => E > 0 ? `away from the ${shape ? 'axis' : 'centre'}` : `towards the ${shape ? 'axis' : 'centre'}`;

/* q11: field of a sphere E = Q ÷ (4πε₀r²) or of a long line E = λ ÷ (2πε₀r), with the enclosed charge chosen by the Gaussian surface. */
const f11 = (shape, Q, r) => shape ? Q * 1e-9 / (2 * Math.PI * EPS * r) : Q * 1e-9 / (4 * Math.PI * EPS * r * r);
/* q12, q14: the distances the draws use (metres); k ÷ r then has at most 2 decimals in the units of the prompt. */
const D = [0.1, 0.2, 0.25, 0.5];
const DC = [10, 20, 25, 50, 100];
/* q19: equivalent capacitance of the two layouts. */
const ceq19 = ({ lay, c1, c2, c3 }) => { const pair = lay ? c1 * c2 / (c1 + c2) : c2 + c3; return { pair, ceq: lay ? pair + c3 : c1 * pair / (c1 + pair) }; };
const is2dp = x => Math.abs(x * 100 - Math.round(x * 100)) < 1e-7;

window.MISSION_GEN = window.MISSION_GEN || {};
Object.assign(window.MISSION_GEN, {
 /* shape 0: bead q1 (nC) at the centre of a thin shell of radius R carrying q2 (nC); shape 1: wire λ1 (nC/m) on the axis of
    a thin tube of radius R carrying λ2 (nC/m). Radii are in tenths of a metre, r1 < R < r2. The total is never 0, and
    neither field lands on a rounding tie. Not the worked example (wire 5, tube −8 at 0.4 m, field at 0.6 m). */
 q11: {
  canonical: { shape: 0, q1: 4, q2: -7, R: 5, r1: 2, r2: 8 },
  draw: R => tries(() => { const Rr = R.int(3, 6); return { shape: R.int(0, 1), q1: R.nz(-9, 9), q2: R.nz(-9, 9), R: Rr, r1: R.int(1, Rr - 1), r2: R.int(Rr + 1, 10) }; },
   p => p.q1 + p.q2 !== 0 && !tie2(f11(p.shape, p.q1, p.r1 / 10)) && !tie2(f11(p.shape, p.q1 + p.q2, p.r2 / 10)) && !(p.shape === 1 && p.q1 === 5 && p.q2 === -8 && p.R === 4 && p.r2 === 6),
   { shape: 0, q1: 4, q2: -7, R: 5, r1: 2, r2: 8 }),
  build: ({ shape, q1, q2, R, r1, r2 }) => {
   const a = r1 / 10, b = r2 / 10, rad = R / 10, Q2 = q1 + q2, E1 = rd2(f11(shape, q1, a)), E2 = rd2(f11(shape, Q2, b));
   const unit = shape ? 'nC per metre' : 'nC', from = shape ? 'axis' : 'centre';
   const setup = shape
    ? `In the Shield Dome a long straight wire carrying ${n(q1)} nC per metre runs along the axis of a long thin metal tube of radius ${n(rad)} m, which carries ${n(q2)} nC per metre spread evenly over it.`
    : `In the Shield Dome a test rig holds a small bead carrying ${n(q1)} nC at the centre of a thin spherical metal shell of radius ${n(rad)} m, which carries ${n(q2)} nC spread evenly over it.`;
   const law = shape ? 'E = λ_enc ÷ (2πε₀r)' : 'E = Q_enc ÷ (4πε₀r²)';
   const sub = (Q, r) => shape ? `${n(Q)} × 10⁻⁹ ÷ (2π × 8.85 × 10⁻¹² × ${n(r)})` : `${n(Q)} × 10⁻⁹ ÷ (4π × 8.85 × 10⁻¹² × ${n(r * r)})`;
   const surf = r => shape ? `a Gaussian cylinder of radius ${n(r)} m around the axis` : `a Gaussian sphere of radius ${n(r)} m centred on the bead`;
   return {
    prompt: `${setup} Use ε₀ = 8.85 × 10⁻¹² C²/(N·m²). Enter the radial component of the electric field at ${n(a)} m from the ${from}, then at ${n(b)} m from the ${from}, both in N/C to 2 decimal places (type them without commas). A positive value points away from the ${from} and a negative value points towards it.`,
    answer: [E1, E2],
    hints: [
     shape ? 'Choose a Gaussian surface with the same symmetry as the charges: a cylinder around the axis. Only the charge inside it counts, and the charge on the tube is inside only when the cylinder is wider than the tube.'
           : 'Choose a Gaussian surface with the same symmetry as the charges: a sphere centred on the bead. Only the charge inside it counts, and the charge on the shell is inside only when the sphere is bigger than the shell.',
     shape ? 'Over a cylinder of radius r and length L only the curved side has flux, so E × 2πrL = λ_enc × L ÷ ε₀ and E = λ_enc ÷ (2πε₀r). Remember 1 nC = 10⁻⁹ C.'
           : 'Over a sphere of radius r the field is the same size everywhere and straight out, so E × 4πr² = Q_enc ÷ ε₀ and E = Q_enc ÷ (4πε₀r²). Remember 1 nC = 10⁻⁹ C.'
    ],
    solution: `At ${n(a)} m, ${surf(a)} lies inside the ${shape ? 'tube' : 'shell'}, so it encloses only the ${shape ? 'wire' : 'bead'}: ${n(q1)} ${unit}. Gauss's law gives ${law} = ${sub(q1, a)}, which is ${n(E1)} N/C to 2 decimal places, pointing ${way(E1, shape)}. At ${n(b)} m, ${surf(b)} encloses the ${shape ? 'wire and the whole tube' : 'bead and the whole shell'}: ${n(q1)} + ${par(q2)} = ${n(Q2)} ${unit}. So E = ${sub(Q2, b)}, which is ${n(E2)} N/C to 2 decimal places, pointing ${way(E2, shape)}. The charge on the ${shape ? 'tube' : 'shell'} adds nothing to the field inside it.`,
    guidance: [
     { prompt: `Take ${surf(a)}. How much charge does it enclose, in ${unit}?`, answer: [q1], explanation: `The ${shape ? 'tube' : 'shell'} is at ${n(rad)} m, outside this surface, so only the ${shape ? 'wire' : 'bead'} is enclosed: ${n(q1)} ${unit}.` },
     { prompt: `Use ${law} with r = ${n(a)} m. What is the radial field there, in N/C to 2 decimal places?`, answer: [E1], explanation: `${sub(q1, a)} gives ${n(E1)} N/C to 2 decimal places.` },
     { prompt: `Now take ${surf(b)}. How much charge does it enclose, in ${unit}?`, answer: [Q2], explanation: `This surface is outside the ${shape ? 'tube' : 'shell'}, so it encloses both charges: ${n(q1)} + ${par(q2)} = ${n(Q2)} ${unit}.` },
     { prompt: `What is the radial field at ${n(b)} m, in N/C to 2 decimal places?`, answer: [E2], explanation: `${sub(Q2, b)} gives ${n(E2)} N/C to 2 decimal places. The sign says it points ${way(E2, shape)}.` }
    ] }; }
 },
 /* Charges q1, q2 in μC (signed); separations from D, never halved (then the work would equal U), so U = 8.99 q1q2 ÷ r mJ has at most 2 decimals. Not the worked
    example (2 μC and 6 μC at 0.3 m). */
 q12: {
  canonical: { q1: 3, q2: -5, i: 3, j: 1 },
  draw: R => tries(() => ({ q1: R.int(1, 9), q2: R.nz(-9, 9), i: R.int(0, 3), j: R.int(0, 3) }), p => p.i !== p.j && D[p.j] * 2 !== D[p.i] && Math.abs(p.q2) >= 2, { q1: 3, q2: -5, i: 3, j: 1 }),
  build: ({ q1, q2, i, j }) => { const a = D[i], b = D[j], P = q1 * q2, U1 = 8.99 * P / a, U2 = 8.99 * P / b, W = U2 - U1, like = P > 0;
   const kq = `8.99 × ${n(q1)} × ${par(q2)}`;
   return {
    prompt: `A dust grain carrying ${n(q1)} μC is held ${n(a)} m from a panel clip carrying ${n(q2)} μC. Use k = 8.99 × 10⁹ N·m²/C², and take the potential energy to be 0 when the charges are very far apart. Enter the electric potential energy of the pair, then the work an outside force must do to move the grain slowly until the two are ${n(b)} m apart. Both are in mJ (1 mJ = 0.001 J) and may be negative; type them without commas.`,
    answer: [U1, W],
    hints: ['The electric potential energy of two point charges is U = kq₁q₂ ÷ r. Keep the signs of the charges: like charges give a positive U, unlike charges a negative U.', 'Moving the charges slowly, the outside force does work equal to the change in potential energy: W = U at the end − U at the start.'],
    solution: `With both charges in μC, kq₁q₂ = 8.99 × 10⁹ × 10⁻⁶ × 10⁻⁶ × q₁q₂ = 8.99 × 10⁻³ × q₁q₂ J·m, so U = 8.99 × q₁ × q₂ ÷ r in mJ when r is in metres. At ${n(a)} m, U = ${kq} ÷ ${n(a)} = ${n(U1)} mJ. At ${n(b)} m, U = ${kq} ÷ ${n(b)} = ${n(U2)} mJ. The work done by the outside force is the change in potential energy: ${n(U2)} − ${par(U1)} = ${n(W)} mJ. ${like ? 'Like charges repel' : 'Unlike charges attract'}, so ${W > 0 ? 'this move goes against the electric force and the outside force’s work is positive' : 'the electric force does the work on this move and the outside force only holds back, so its work is negative'}.`,
    guidance: [
     { prompt: `Put the charges and the separation ${n(a)} m into U = kq₁q₂ ÷ r. What is U, in mJ?`, answer: [U1], explanation: `With the charges in μC, U = 8.99 × q₁ × q₂ ÷ r mJ: ${kq} ÷ ${n(a)} = ${n(U1)} mJ. The sign is ${like ? 'positive because the charges are alike' : 'negative because the charges are unlike'}.` },
     { prompt: `Now the separation is ${n(b)} m. What is U there, in mJ?`, answer: [U2], explanation: `${kq} ÷ ${n(b)} = ${n(U2)} mJ.` },
     { prompt: `The outside force's work is U at the end minus U at the start. What is it, in mJ?`, answer: [W], explanation: `${n(U2)} − ${par(U1)} = ${n(W)} mJ.` }
    ] }; }
 },
 /* z = 1 proton, z = 2 helium nucleus; potential difference V (volts, a multiple of 100). Not the worked example (a proton through 200 V). */
 q13: {
  canonical: { z: 2, V: 1500 },
  draw: R => tries(() => ({ z: R.int(1, 2), V: 100 * R.int(1, 50) }), p => !(p.z === 1 && p.V === 200) && !tie2(Math.sqrt(2 * p.z * p.V * QE / (p.z === 1 ? MP : MHE)) / 1000), { z: 2, V: 1500 }),
  build: ({ z, V }) => { const m = z === 1 ? MP : MHE, eV = z * V, J = 0.016 * eV, v = rd2(Math.sqrt(2 * eV * QE / m) / 1000);
   const who = z === 1 ? 'proton (charge e, mass 1.67 × 10⁻²⁷ kg)' : 'helium nucleus (charge 2e, mass 6.64 × 10⁻²⁷ kg)';
   const ms = z === 1 ? '1.67 × 10⁻²⁷' : '6.64 × 10⁻²⁷', mp = `(${ms})`;
   return {
    prompt: `The ion gun releases a ${who} from rest and accelerates it through a potential difference of ${n(V)} V, from high potential to low potential. Use e = 1.60 × 10⁻¹⁹ C. Enter the kinetic energy it gains in eV, then the same energy as the number that multiplies 10⁻¹⁷ J, then its final speed in km/s to 2 decimal places (type the answers without commas).`,
    answer: [eV, J, v],
    hints: ['A charge q that falls through a potential difference ΔV gains kinetic energy qΔV. In electron-volts this is just the number of elementary charges times the number of volts.', 'Turn eV into joules with 1 eV = 1.60 × 10⁻¹⁹ J, then set ½mv² equal to that energy and solve for v. Divide metres per second by 1000 to get km/s.'],
    solution: `The ${z === 1 ? 'proton' : 'nucleus'} carries ${z === 1 ? 'one elementary charge' : 'two elementary charges'}, so it gains ${n(z)} × ${n(V)} = ${n(eV)} eV. In joules that is ${n(eV)} × 1.60 × 10⁻¹⁹ = ${n(J)} × 10⁻¹⁷ J. From ½mv² = ${n(J)} × 10⁻¹⁷ J, v = √(2 × ${n(J)} × 10⁻¹⁷ ÷ ${mp}) m/s, which is ${n(v)} km/s to 2 decimal places.`,
    guidance: [
     { prompt: `The charge is ${z === 1 ? 'e' : '2e'} and the potential difference is ${n(V)} V. How much energy does it gain, in eV?`, answer: [eV], explanation: `Each elementary charge falling through 1 V gains 1 eV, so ${n(z)} × ${n(V)} = ${n(eV)} eV.` },
     { prompt: `Turn ${n(eV)} eV into joules. What number multiplies 10⁻¹⁷ J?`, answer: [J], explanation: `${n(eV)} × 1.60 × 10⁻¹⁹ J = ${n(J)} × 10⁻¹⁷ J.` },
     { prompt: `Set ½mv² = ${n(J)} × 10⁻¹⁷ J with m = ${ms} kg. What is v, in km/s to 2 decimal places?`, answer: [v], explanation: `v = √(2 × ${n(J)} × 10⁻¹⁷ ÷ ${mp}) m/s, which is ${n(v)} km/s to 2 decimal places.` }
    ] }; }
 },
 /* The probe is at x = p cm; three charges (μC) sit at signed offsets from DC (cm), all different, so each kq ÷ r in kV has
    at most 2 decimals. A test charge qt (μC) is then brought in from very far away: W = qt × V in mJ. */
 q14: {
  canonical: { p: 30, q: [5, -2, 3], d: [-10, 20, 50], qt: 2 },
  draw: R => tries(() => ({ p: 10 * R.int(2, 6), q: [R.nz(-9, 9), R.nz(-9, 9), R.nz(-9, 9)], d: [R.pick(DC) * (R.bool() ? 1 : -1), R.pick(DC) * (R.bool() ? 1 : -1), R.pick(DC) * (R.bool() ? 1 : -1)], qt: R.int(2, 5) }),
   p => new Set(p.d).size === 3 && p.q.some(x => x > 0) && p.q.some(x => x < 0) && Math.abs(p.q.reduce((s, x, i) => s + x * 100 / Math.abs(p.d[i]), 0)) > 1e-9, { p: 30, q: [5, -2, 3], d: [-10, 20, 50], qt: 2 }),
  build: ({ p, q, d, qt }) => { const x = d.map(v => (p + v) / 100), r = d.map(v => Math.abs(v) / 100), Vi = q.map((c, i) => 8.99 * c / r[i]), V = Vi.reduce((s, v) => s + v, 0), W = qt * V;
   const at = i => `${n(q[i])} μC at x = ${n(x[i])} m`;
   return {
    prompt: `Three charged ion traps sit on a straight rail: ${at(0)}, ${at(1)} and ${at(2)}. A probe is at x = ${n(p / 100)} m. Use k = 8.99 × 10⁹ N·m²/C², and take the potential to be 0 very far away. Enter the electric potential at the probe in kV, then the work needed to bring a +${n(qt)} μC charge slowly from very far away to the probe, in mJ (type them without commas).`,
    answer: [V, W],
    hints: ['Each point charge gives a potential kq ÷ r at a distance r, with the sign of its charge. Potential has no direction, so the three just add.', 'The work to bring a charge q from where the potential is 0 to a point at potential V is qV. With q in μC and V in kV the work comes out in mJ.'],
    solution: `The distances from the probe are ${n(r[0])} m, ${n(r[1])} m and ${n(r[2])} m. With q in μC, kq ÷ r = 8.99 × q ÷ r in kV: ${q.map((c, i) => `8.99 × ${par(c)} ÷ ${n(r[i])} = ${n(Vi[i])}`).join(', ')}. Adding, V = ${n(Vi[0])} + ${par(Vi[1])} + ${par(Vi[2])} = ${n(V)} kV. The work is qV = ${n(qt)} × ${par(V)} = ${n(W)} mJ.`,
    guidance: [
     { prompt: `The ${n(q[0])} μC charge is ${n(r[0])} m from the probe. What potential does it give there, in kV?`, answer: [Vi[0]], explanation: `8.99 × 10⁹ × ${n(q[0])} × 10⁻⁶ ÷ ${n(r[0])} V is 8.99 × ${par(q[0])} ÷ ${n(r[0])} = ${n(Vi[0])} kV.` },
     { prompt: `The other two give ${n(Vi[1])} kV and ${n(Vi[2])} kV. What is the total potential at the probe, in kV?`, answer: [V], explanation: `Potentials are numbers, not arrows, so they add: ${n(Vi[0])} + ${par(Vi[1])} + ${par(Vi[2])} = ${n(V)} kV.` },
     { prompt: `What work brings +${n(qt)} μC from very far away to the probe, in mJ?`, answer: [W], explanation: `W = qV = ${n(qt)} μC × ${par(V)} kV = ${n(W)} mJ.` }
    ] }; }
 },
 /* V(x) = ax³ + bx² + c volts with |a|, |b| >= 2; E = −(3ax² + 2bx) at a whole-number x0 where E is not 0. Not the worked example (V = 4x² − 3x³ at x = 1, which has no constant term). */
 q15: {
  canonical: { a: 2, b: -9, c: 40, x0: 2 },
  draw: R => tries(() => ({ a: R.nz(-5, 5), b: R.nz(-12, 12), c: 10 * R.int(1, 9), x0: R.nz(-3, 4) }),
   p => Math.abs(p.a) >= 2 && Math.abs(p.b) >= 2 && 3 * p.a * p.x0 * p.x0 + 2 * p.b * p.x0 !== 0, { a: 2, b: -9, c: 40, x0: 2 }),
  build: ({ a, b, c, x0 }) => { const V = a * x0 ** 3 + b * x0 ** 2 + c, s = 3 * a * x0 * x0 + 2 * b * x0, E = -s;
   const Vx = `${trm(a, 'x³', true)} ${trm(b, 'x²')} ${cst(c)}`, dV = `${trm(3 * a, 'x²', true)} ${trm(2 * b, 'x')}`;
   return {
    prompt: `Along the beam pipe of the Accelerator Bay the potential is V(x) = ${Vx} volts, where x is the position in metres. Enter the potential at x = ${n(x0)} m in V, then the x-component of the electric field there, E_x, in V/m (it may be negative).`,
    answer: [V, E],
    hints: ['The field is minus the rate of change of the potential with position: E_x = −dV/dx. Differentiate V(x) term by term; the constant has derivative 0.', 'Put the position into dV/dx, then change the sign. A positive E_x points towards larger x, which is the way the potential falls.'],
    solution: `V(${n(x0)}) = ${n(a)} × ${par(x0 ** 3)} + ${par(b)} × ${n(x0 * x0)} + ${n(c)} = ${n(V)} V. Differentiating, dV/dx = ${dV}, so at x = ${n(x0)} it is ${n(3 * a)} × ${n(x0 * x0)} + ${par(2 * b)} × ${par(x0)} = ${n(s)} V/m. The field is E_x = −dV/dx = ${n(E)} V/m${E > 0 ? ', pointing towards larger x' : ', pointing towards smaller x'}.`,
    guidance: [
     { prompt: `Put x = ${n(x0)} into V(x). What is the potential there, in V?`, answer: [V], explanation: `${n(a)} × ${par(x0 ** 3)} + ${par(b)} × ${n(x0 * x0)} + ${n(c)} = ${n(V)} V.` },
     { prompt: `The derivative is dV/dx = ${dV}. What is it at x = ${n(x0)}, in V/m?`, answer: [s], explanation: `${n(3 * a)} × ${n(x0 * x0)} + ${par(2 * b)} × ${par(x0)} = ${n(s)} V/m.` },
     { prompt: `E_x = −dV/dx. What is E_x at x = ${n(x0)}, in V/m?`, answer: [E], explanation: `Change the sign: E_x = ${n(E)} V/m.` }
    ] }; }
 },
 /* Plates d mm apart at a potential difference V (a multiple of 50); a point s mm from the positive plate, at least 2 mm from each plate (so neither potential box equals the field box). V ÷ d in kV/m has at most 2 decimals. Not the worked example (120 V across 3 mm). */
 q16: {
  canonical: { V: 450, d: 8, s: 3 },
  draw: R => tries(() => { const d = R.pick([4, 5, 8, 10]); return { V: 50 * R.int(1, 20), d, s: R.int(2, d - 2) }; }, p => 2 * p.s !== p.d && !(p.V === 450 && p.d === 8), { V: 450, d: 8, s: 3 }),
  build: ({ V, d, s }) => { const E = V / d, drop = E * s, Vp = V - drop;
   return {
    prompt: `Two large parallel plates in the ion gun are ${n(d)} mm apart, with the positive plate ${n(V)} V above the negative plate. The field between them is uniform. Take the negative plate as 0 V. Enter the field strength between the plates in kV/m, then the potential difference between the positive plate and a point ${n(s)} mm from it in V, then the potential of that point in V.`,
    answer: [E, drop, Vp],
    hints: ['In a uniform field the potential falls by the same amount for every millimetre you move along the field, so E = V ÷ d. A volt per millimetre is a kilovolt per metre.', 'The potential difference over part of the gap is E × (distance moved along the field). The point’s own potential is what is left of the positive plate’s potential after that drop.'],
    solution: `E = V ÷ d = ${n(V)} V ÷ ${n(d)} mm = ${n(E)} V/mm, which is ${n(E)} kV/m. Over ${n(s)} mm the potential falls by ${n(E)} × ${n(s)} = ${n(drop)} V. The positive plate is at ${n(V)} V, so the point is at ${n(V)} − ${n(drop)} = ${n(Vp)} V. Every point in the plane ${n(s)} mm from the positive plate has this same potential: that plane is an equipotential.`,
    guidance: [
     { prompt: `${n(V)} V across ${n(d)} mm. What is the field, in kV/m?`, answer: [E], explanation: `${n(V)} ÷ ${n(d)} = ${n(E)} V per millimetre, and 1 V/mm = 1000 V/m = 1 kV/m, so E = ${n(E)} kV/m.` },
     { prompt: `How much does the potential fall over the ${n(s)} mm from the positive plate, in V?`, answer: [drop], explanation: `${n(E)} V/mm × ${n(s)} mm = ${n(drop)} V.` },
     { prompt: `What is the potential of the point, in V, with the negative plate at 0 V?`, answer: [Vp], explanation: `${n(V)} − ${n(drop)} = ${n(Vp)} V.` }
    ] }; }
 },
 /* A proton enters at v0 = 40k km/s (so its kinetic energy is 8.35k² eV, exactly) through the low-potential plate and moves
    against a uniform field E = Vp ÷ g; it stops after s = KE ÷ E, inside the gap. s is not on a rounding tie. Not the worked example (120 km/s against 20 kV/m). */
 q17: {
  canonical: { k: 5, Vp: 600, g: 8 },
  draw: R => tries(() => ({ k: R.int(2, 10), Vp: 50 * R.int(2, 20), g: R.pick([4, 5, 8, 10]) }), p => 8.35 * p.k * p.k < p.Vp && !(p.k === 3 && p.Vp === 20 * p.g) && !tie2(8.35 * p.k * p.k * p.g / p.Vp), { k: 5, Vp: 600, g: 8 }),
  build: ({ k, Vp, g }) => { const v0 = 40 * k, KE = 8.35 * k * k, E = Vp / g, s = rd2(KE / E);
   return {
    prompt: `In the ion gun a proton (mass 1.67 × 10⁻²⁷ kg, charge e = 1.60 × 10⁻¹⁹ C) passes through a hole in the negative plate at ${n(v0)} km/s, heading straight for the positive plate. The plates are ${n(g)} mm apart with a potential difference of ${n(Vp)} V, and the field between them is uniform. Enter the field strength in kV/m, then the proton’s kinetic energy at the hole in eV, then how far it gets past the hole before it stops, in mm to 2 decimal places.`,
    answer: [E, KE, s],
    hints: ['The field is the potential difference divided by the gap, E = V ÷ d; a volt per millimetre is a kilovolt per metre.', 'Moving towards higher potential, the proton loses e × ΔV of kinetic energy, which is ΔV in eV. It stops where the potential rise equals its kinetic energy in eV, and the rise over a distance s is E × s.'],
    solution: `E = ${n(Vp)} V ÷ ${n(g)} mm = ${n(E)} V/mm, which is ${n(E)} kV/m. The kinetic energy is ½mv² = ½ × 1.67 × 10⁻²⁷ × (${n(v0)} × 10³)² J, and dividing by 1.60 × 10⁻¹⁹ J per eV gives ${n(KE)} eV. The proton stops where it has climbed ${n(KE)} V, which takes ${n(KE)} ÷ ${n(E)} mm, or ${n(s)} mm to 2 decimal places. That is less than the ${n(g)} mm gap, so it stops before the positive plate and is pushed back.`,
    guidance: [
     { prompt: `${n(Vp)} V across ${n(g)} mm. What is the field, in kV/m?`, answer: [E], explanation: `${n(Vp)} ÷ ${n(g)} = ${n(E)} V/mm, which is ${n(E)} kV/m.` },
     { prompt: `Find ½mv² for v = ${n(v0)} km/s and turn it into eV. What is the kinetic energy, in eV?`, answer: [KE], explanation: `½ × 1.67 × 10⁻²⁷ × (${n(v0)} × 10³)² J ÷ 1.60 × 10⁻¹⁹ J per eV = ${n(KE)} eV.` },
     { prompt: `The proton stops after climbing ${n(KE)} V, and the potential rises ${n(E)} V per mm. How far does it get, in mm to 2 decimal places?`, answer: [s], explanation: `${n(KE)} ÷ ${n(E)} gives ${n(s)} mm to 2 decimal places.` }
    ] }; }
 },
 /* Plate area A (cm², a multiple of 100), gap d (mm), voltage V. C = 0.885A ÷ d pF; Q = CV ÷ 1000 nC. Neither lands on a tie,
    and Q from C rounded to 2 decimals rounds the same way. Not the worked example (0.5 m² at 1 mm). */
 q18: {
  canonical: { A: 400, d: 2, V: 300 },
  draw: R => tries(() => ({ A: 100 * R.int(1, 25), d: R.pick([0.5, 1, 2, 2.5, 5]), V: 50 * R.int(2, 40) }), p => { const C = 0.885 * p.A / p.d, Q = C * p.V / 1000; return !tie2(C) && !tie2(Q) && rd2(rd2(C) * p.V / 1000) === rd2(Q); }, { A: 400, d: 2, V: 300 }),
  build: ({ A, d, V }) => { const Am = A / 10000, C = rd2(0.885 * A / d), Q = rd2(0.885 * A / d * V / 1000);
   return {
    prompt: `A capacitor for the Battery Vault is two flat metal plates, each of area ${n(A)} cm², ${n(d)} mm apart with air between them. Use ε₀ = 8.85 × 10⁻¹² F/m. Enter the plate area in m², then the capacitance in pF to 2 decimal places, then the charge on the positive plate when it is connected to ${n(V)} V, in nC to 2 decimal places (type them without commas).`,
    answer: [Am, C, Q],
    hints: ['A parallel-plate capacitor has C = ε₀A ÷ d, with A in m² and d in m. There are 10000 cm² in 1 m² and 1000 mm in 1 m.', 'The charge stored is Q = CV. A picofarad times a volt is a picocoulomb, and 1000 pC = 1 nC.'],
    solution: `A = ${n(A)} cm² = ${n(Am)} m² and d = ${n(d)} mm = ${n(d / 1000)} m. C = ε₀A ÷ d = 8.85 × 10⁻¹² × ${n(Am)} ÷ ${n(d / 1000)} F, which is ${n(C)} pF to 2 decimal places. Q = CV = ${n(C)} pF × ${n(V)} V, about ${n(Q * 1000)} pC, which is ${n(Q)} nC to 2 decimal places.`,
    guidance: [
     { prompt: `There are 10000 cm² in 1 m². What is ${n(A)} cm² in m²?`, answer: [Am], explanation: `${n(A)} ÷ 10000 = ${n(Am)} m².` },
     { prompt: `Use C = ε₀A ÷ d with d = ${n(d / 1000)} m. What is C, in pF to 2 decimal places?`, answer: [C], explanation: `8.85 × 10⁻¹² × ${n(Am)} ÷ ${n(d / 1000)} F is ${n(C)} pF to 2 decimal places.` },
     { prompt: `Use Q = CV with V = ${n(V)} V. What is Q, in nC to 2 decimal places?`, answer: [Q], explanation: `${n(C)} pF × ${n(V)} V is about ${n(Q * 1000)} pC, which is ${n(Q)} nC.` }
    ] }; }
 },
 /* lay 0: C1 in series with (C2 parallel C3); lay 1: (C1 series C2) parallel C3. Values in μF; the equivalent has at most 2 decimals. Not the worked example (2 μF and 6 μF). */
 q19: {
  canonical: { lay: 0, c1: 6, c2: 1, c3: 2, V: 12 },
  draw: R => tries(() => ({ lay: R.int(0, 1), c1: R.int(1, 12), c2: R.int(1, 12), c3: R.int(1, 12), V: 6 * R.int(1, 8) }), p => is2dp(ceq19(p).ceq) && is2dp(ceq19(p).pair) && !(p.c1 === 2 && p.c2 === 6), { lay: 0, c1: 6, c2: 1, c3: 2, V: 12 }),
  build: ({ lay, c1, c2, c3, V }) => { const { pair, ceq } = ceq19({ lay, c1, c2, c3 }), Q = ceq * V;
   const net = lay ? `C₁ = ${n(c1)} μF and C₂ = ${n(c2)} μF are joined in series, and that pair is connected in parallel with C₃ = ${n(c3)} μF`
                   : `C₂ = ${n(c2)} μF and C₃ = ${n(c3)} μF are joined in parallel, and that pair is connected in series with C₁ = ${n(c1)} μF`;
   const step1 = lay ? `In series, 1 ÷ C = 1 ÷ ${n(c1)} + 1 ÷ ${n(c2)}, so the pair is ${n(c1 * c2)} ÷ ${n(c1 + c2)} = ${n(pair)} μF.` : `In parallel the capacitances add: ${n(c2)} + ${n(c3)} = ${n(pair)} μF.`;
   const step2 = lay ? `The pair is in parallel with C₃, so they add: ${n(pair)} + ${n(c3)} = ${n(ceq)} μF.` : `C₁ is in series with the pair: 1 ÷ C = 1 ÷ ${n(c1)} + 1 ÷ ${n(pair)}, so C = ${n(c1 * pair)} ÷ ${n(c1 + pair)} = ${n(ceq)} μF.`;
   return {
    prompt: `In a bank of the Battery Vault, ${net}. A ${n(V)} V supply is connected across the whole network. Enter the equivalent capacitance of the network in μF, then the total charge the supply moves onto it in μC.`,
    answer: [ceq, Q],
    hints: ['Work from the inside out: replace the pair first by one capacitor, then combine that with the third. In parallel capacitances add; in series their reciprocals add.', 'The whole network behaves like one capacitor of the equivalent capacitance, so the charge it takes is Q = C × V.'],
    solution: `${step1} ${step2} The supply moves Q = CV = ${n(ceq)} μF × ${n(V)} V = ${n(Q)} μC.`,
    guidance: [
     { prompt: `Start with the pair. What single capacitance replaces it, in μF?`, answer: [pair], explanation: step1 },
     { prompt: `Now combine ${n(pair)} μF with the remaining capacitor. What is the equivalent capacitance, in μF?`, answer: [ceq], explanation: step2 },
     { prompt: `What charge does the ${n(V)} V supply move onto the network, in μC?`, answer: [Q], explanation: `Q = ${n(ceq)} × ${n(V)} = ${n(Q)} μC.` }
    ] }; }
 },
 /* Two capacitors c1, c2 (μF, multiples of 10) in parallel charged to V (a multiple of 10 volts), emptied in t ms. Q = CV ÷ 1000 mC,
    U = CV² ÷ 2000 mJ, P = U ÷ t W, each with at most 2 decimals. Not the worked example (500 μF at 20 V). */
 q20: {
  canonical: { c1: 220, c2: 330, V: 40, t: 5 },
  draw: R => tries(() => ({ c1: 10 * R.int(1, 50), c2: 10 * R.int(1, 50), V: 10 * R.int(1, 10), t: R.pick([2, 5, 10, 20, 25, 50]) }), p => !((p.c1 + p.c2) === 500 && p.V === 20) && (p.c1 + p.c2) * p.V * p.V / 2000 / p.t >= 0.1 && is2dp((p.c1 + p.c2) * p.V * p.V / 2000 / p.t), { c1: 220, c2: 330, V: 40, t: 5 }),
  build: ({ c1, c2, V, t }) => { const C = c1 + c2, Q = C * V / 1000, U = C * V * V / 2000, P = U / t;
   return {
    prompt: `The night bank wires a ${n(c1)} μF capacitor and a ${n(c2)} μF capacitor in parallel and charges them to ${n(V)} V. Enter the total charge stored in mC, then the energy stored in mJ, then the average power in W if all that energy is released in ${n(t)} ms (type them without commas).`,
    answer: [Q, U, P],
    hints: ['Capacitors in parallel add: C = C₁ + C₂. The charge is Q = CV, and 1 μF × 1 V = 1 μC.', 'The energy stored is U = ½CV², and 1 μF × (1 V)² = 1 μJ. Average power is energy divided by time, and 1 mJ ÷ 1 ms = 1 W.'],
    solution: `In parallel, C = ${n(c1)} + ${n(c2)} = ${n(C)} μF. Q = CV = ${n(C)} μF × ${n(V)} V = ${n(C * V)} μC, which is ${n(Q)} mC. U = ½CV² = ½ × ${n(C)} μF × ${n(V * V)} V² = ${n(C * V * V / 2)} μJ, which is ${n(U)} mJ. Released in ${n(t)} ms, the average power is ${n(U)} mJ ÷ ${n(t)} ms = ${n(P)} W.`,
    guidance: [
     { prompt: `With C = ${n(C)} μF at ${n(V)} V, what charge is stored, in mC?`, answer: [Q], explanation: `${n(C)} × ${n(V)} = ${n(C * V)} μC, and 1000 μC = 1 mC, so Q = ${n(Q)} mC.` },
     { prompt: `What energy is stored, U = ½CV², in mJ?`, answer: [U], explanation: `½ × ${n(C)} × ${n(V * V)} = ${n(C * V * V / 2)} μJ, which is ${n(U)} mJ.` },
     { prompt: `The energy comes out in ${n(t)} ms. What is the average power, in W?`, answer: [P], explanation: `${n(U)} mJ ÷ ${n(t)} ms = ${n(P)} W.` }
    ] }; }
 }
});
})();
