/* Independent oracles for Electricity and magnetism: fields practice missions, file 7 of 8: q31b–q35d (game/realms/em/practice-7.js).
   One entry per practice mission: ORACLE.<id>(p) returns the answer list for the generator's parameters p, worked out
   from what the prompt states by a different method from build() (a table, a search, a numerical method, a solver).
   qa/generators.js loads this file after the whole pack and fails a practice mission that has no oracle here. */
(function(){ 'use strict';
/* Round to 2 decimal places, as every prompt asks, only at the very end. */
const r2 = x => Number(x.toFixed(2));
const E = 1.60e-19, MU0 = 4 * Math.PI * 1e-7, G = 10;
/* Force per metre between two long parallel wires, worked from the field of one (B = μ0 I / 2πd) acting on the other. */
const fieldOfWire = (I, d) => MU0 * I / (2 * Math.PI * d);
Object.assign(window.ORACLE, {
  /* q31b: a = mass in 1e-26 kg, z = charge in units of e, k = speed in 1e4 m/s, b = field in mT. */
  q31b: p => {
    const m = p.a * 1e-26, q = p.z * E, v = p.k * 1e4, B = p.b * 1e-3;
    const r = m * v / (q * B);
    return [r2(r * 100), r2((2 * Math.PI * r / v) * 1e6)];
  },
  /* q31c: a = mass in 1e-26 kg, z = charge in units of e, b = field in mT, d = slit-to-plate distance in cm (a diameter). */
  q31c: p => {
    const m = p.a * 1e-26, q = p.z * E, B = p.b * 1e-3, r = p.d / 200;
    const v = q * B * r / m;
    return [r2(v / 1000), r2((Math.PI * r / v) * 1e6)];
  },
  /* q31d: a = mass in 1e-27 kg, z = charge in units of e, V = potential difference in kV, b = field in mT. */
  q31d: p => {
    const m = p.a * 1e-27, q = p.z * E, B = p.b * 1e-3, ke = q * p.V * 1000;
    const v = Math.sqrt(2 * ke / m);
    return [r2(v / 1000), r2(m * v / (q * B) * 100)];
  },
  /* q32b: f = force in mN, L = length in cm, b = field in mT, a = index into the angles [π/6, 5π/6, π/2], R = resistance in Ω. */
  q32b: p => {
    const sin = [0.5, 0.5, 1][p.a];
    const I = (p.f * 1e-3) / ((p.L / 100) * (p.b * 1e-3) * sin);
    return [r2(I), r2(I * p.R)];
  },
  /* q32c: m = mass in g, L = length in cm, b = field in mT, R = resistance in Ω; hover when ILB = mg. */
  q32c: p => {
    const I = (p.m * 1e-3 * G) / ((p.L / 100) * (p.b * 1e-3));
    return [r2(I), r2(I * p.R)];
  },
  /* q32d: supply V volts across R ohms; L in cm, b in mT, m in g, t in s. */
  q32d: p => {
    const I = p.V / p.R;
    const F = I * (p.L / 100) * (p.b * 1e-3);
    const a = F / (p.m * 1e-3);
    return [I, r2(F), r2(a * p.t)];
  },
  /* q33b: B1 in μT at r1 cm; the wire's field falls as 1/r. */
  q33b: p => {
    const I = (p.B1 * 1e-6) * 2 * Math.PI * (p.r1 / 100) / MU0;
    return [r2(I), r2(fieldOfWire(I, p.r2 / 100) * 1e6)];
  },
  /* q33c: force per metre on B from A and from C; same = true means C runs the same way as B, false means opposite. */
  q33c: p => {
    const fA = fieldOfWire(p.iA, p.d1 / 100) * p.iB;
    const fC = fieldOfWire(p.iC, p.d2 / 100) * p.iB;
    /* Positive means towards A. A runs with B, so A always attracts B (towards A).
       C attracts B towards C if it runs with B, and repels B (towards A) if it runs against B. */
    const net = p.same ? fA - fC : fA + fC;
    return [r2(Math.abs(net) * 1e6), net > 0 ? 1 : -1];
  },
  /* q33d: the upper wire's weight per metre is lam grams per metre; lam is in g/m, currents in A. */
  q33d: p => {
    const w = p.lam * 1e-3 * G;
    const B = w / p.i2;
    const gap = MU0 * p.i1 / (2 * Math.PI * B);
    return [r2(B * 1e6), r2(gap * 1000)];
  },
  /* q34b: Ampère's law round the circle: ∮B·dl = μ0 × (current passing through); cable 3 runs the other way. */
  q34b: p => {
    const I = p.i1 + p.i2 - p.i3;
    const loop = MU0 * I;
    return [I, r2(loop * 1e6), r2(Math.abs(loop / (2 * Math.PI * p.r / 100)) * 1e6)];
  },
  /* q34c: N1, N2 turns along l1, l2 cm, carrying I1, I2 A. */
  q34c: p => {
    const b1 = MU0 * (p.N1 / (p.l1 / 100)) * p.I1, b2 = MU0 * (p.N2 / (p.l2 / 100)) * p.I2;
    /* Same sense: both fields point the same way along the axis. Opposite sense: the outer field points the other way. */
    const net = p.same ? b1 + b2 : b1 - b2;
    return [r2(Math.abs(net) * 1e3), net > 0 ? 1 : -1];
  },
  /* q34d: n in turns per metre, coil current I A, iw cable current in A, r cm to the axis. */
  q34d: p => {
    const bc = MU0 * p.n * p.I, bw = fieldOfWire(p.iw, p.r / 100);
    return [r2(bc * 1e3), r2(bw * 1e3), r2(Math.hypot(bc, bw) * 1e3)];
  },
  /* q35b: the field points down and changes b1 to b2 (mT). Lenz: the induced field opposes the change.
     Down and growing: induced field up, which is anticlockwise seen from above (-1). Down and shrinking: induced field down, clockwise (+1). */
  q35b: p => {
    const area = (p.w / 100) * (p.h / 100);
    const emf = p.N * area * Math.abs(p.b2 - p.b1) * 1e-3 / p.dt;
    const dir = p.b2 > p.b1 ? -1 : 1;
    return [r2(emf * 1e3), r2(emf / p.R * 1e3), dir];
  },
  /* q35c: field falls from b mT to zero over dt s; the circuit has Rc + Rs ohms. */
  q35c: p => {
    const emf = p.N * (p.w / 100) * (p.h / 100) * (p.b * 1e-3) / p.dt;
    const I = emf / (p.Rc + p.Rs);
    return [r2(emf * 1e3), r2(I * p.dt * 1e3)];
  },
  /* q35d: n turns per metre, current i1 to i2 (A); cc true = current anticlockwise from above, field up. N2 turns of a cm² each. */
  q35d: p => {
    /* Signed vertical field (up positive) before and after. */
    const up = p.cc ? 1 : -1;
    const z1 = up * MU0 * p.n * p.i1, z2 = up * MU0 * p.n * p.i2;
    const dB = Math.abs(z2 - z1);
    const emf = p.N2 * (p.a * 1e-4) * dB / p.dt;
    /* The induced field opposes the change in the vertical field: if it grows upward the induced field points down (clockwise from above, +1);
       if it falls (or grows downward) the induced field points up (anticlockwise, -1). */
    const dir = (z2 - z1) > 0 ? 1 : -1;
    return [r2(dB * 1e3), r2(emf * 1e3), dir];
  },
});
})();
