/* Independent oracles for Electromagnetism: practice missions, file 1 of 8: q01b–q05d (game/realms/em/practice-1.js).
   One entry per practice mission: ORACLE.<id>(p) returns the answer list for the generator's parameters p, worked out
   from what the prompt states, in SI units (coulombs, metres, newtons), by a different route from build(): each
   quantity is converted to SI, the physics is done there, and the result is converted back to the unit the prompt asks for.
   qa/generators.js loads this file after the whole pack and fails a mission with no oracle here. */
(function(){ 'use strict';
const r2 = x => Math.round(x * 100) / 100;
const r6 = x => Math.round(x * 1e6) / 1e6;
const K = 8.99e9, QE = 1.60e-19;
const sgn = x => (x > 0 ? 1 : -1);
/* Field x component at the origin from a uniform line of charge density lam (C/m) lying on x from x0 to x1 (metres, same
   side, 0 < |x0| < |x1|): integral of k lam dx (0 − x) / |x|³ = −k lam (1/x0 − 1/x1) for x > 0, mirrored for x < 0. */
const lineField = (lam, x0, x1) => x0 > 0 ? -K * lam * (1 / x0 - 1 / x1) : K * lam * (1 / -x0 - 1 / -x1);
Object.assign(window.ORACLE, {
  /* c = printed charge as the number multiplying 1e-17 C; electrons missing N = c × 1e-17 ÷ e.
     m electrons come back: new charge = (N − m) e. */
  q01b: p => { const N = Math.round(p.c * 1e-17 / QE); return [N, r6((N - p.m) * QE / 1e-17)]; },
  /* a: grain A has 10a more electrons than protons (charge −10a e); b: grain B has 10b more protons (+10b e).
     Each ends with half of the total charge. Answer 1: electrons in excess per grain; answer 2: charge in 1e-17 C. */
  q01c: p => {
    const total = (-10 * p.a + 10 * p.b) * QE, each = total / 2;
    return [r6(-each / QE), r6(each / 1e-17)];
  },
  /* Charge −Q nC (Q printed): count = |Q| / e in billions;
     then m billion electrons leave, so the charge rises by m × 1e9 e. */
  q01d: p => {
    const Q = -p.Q * 1e-9, n = -Q / QE;
    return [r6(n / 1e9), r2((Q + p.m * 1e9 * QE) * 1e9)];
  },
  /* Coulomb: F = k |q1 q2| / d², nC and cm to SI, back to μN; repel (1) when the charges have the same sign. */
  q02b: p => [r2(K * Math.abs(p.a * 1e-9 * p.b * 1e-9) / Math.pow(p.d * 1e-2, 2) * 1e6), p.a * p.b > 0 ? 1 : -1],
  /* Charges are −M1 × 10^10 e and s2 × (−M2 × 10^10 e) (s2 = 1: bead 2 also has extra electrons, so it repels; s2 = −1: protons, so it attracts). */
  q02c: p => {
    const q1 = -p.M1 * 1e10 * QE, q2 = -p.s2 * p.M2 * 1e10 * QE;
    return [r2(K * Math.abs(q1 * q2) / Math.pow(p.d * 1e-2, 2) * 1e6), q1 * q2 > 0 ? 1 : -1];
  },
  /* Weight = m g in newtons then mN; balance k |a b| / r² = weight, so r = sqrt(k a b / W). Both charges have the same sign (repel). */
  q02d: p => {
    const W = p.m * 1e-3 * 9.8;
    return [r2(W * 1e3), r2(Math.sqrt(K * (p.a * 1e-6) * (p.b * 1e-6) / W))];
  },
  /* Test charge q at x = 0, posts at x = s d_i. Force on q from post i: x component = k q q_i (0 − s d_i) / d_i³ = −s k q q_i / d_i². */
  q03b: p => {
    const f = (qi, d) => -p.s * K * (p.q * 1e-9) * (qi * 1e-9) / Math.pow(d * 1e-2, 2);
    return [r2((f(p.q1, p.d1) + f(p.q2, p.d2)) * 1e6)];
  },
  /* Posts at −d1 and +d2. F_x = k q (q1 / d1² − q2 / d2²); a = F / m with m in mg → kg. */
  q03c: p => {
    const F = K * (p.q * 1e-9) * ((p.q1 * 1e-9) / Math.pow(p.d1 * 1e-2, 2) - (p.q2 * 1e-9) / Math.pow(p.d2 * 1e-2, 2));
    return [r2(F * 1e6), r2(F / (p.m * 1e-6))];
  },
  /* Posts at 0 and L with charges s a² and s b² nC and gap L = u (a + b) cm (read off the printed draws, e.g. a=5,b=3,u=5 → 40 cm).
     Zero force where sqrt(Q1)/x = sqrt(Q2)/(L − x), i.e. x = L a / (a + b) = u a. At x = L/2 the force is k q (Q1 / x² − Q2 / (L − x)²). */
  q03d: p => {
    const L = p.L, Q1 = p.Q1 * 1e-9, Q2 = p.Q2 * 1e-9, q = p.q * 1e-9;
    /* Balance point by bisection on the net force (x in cm, between the posts). */
    const net = x => Q1 / (x * x) - Q2 / ((L - x) * (L - x));
    let lo = 1e-9 * L, hi = L * (1 - 1e-9);
    for (let i = 0; i < 200; i++) { const mid = (lo + hi) / 2; if (Math.sign(net(mid)) === Math.sign(net(lo))) lo = mid; else hi = mid; }
    const x0 = (lo + hi) / 2;
    const h = L / 2 * 1e-2;
    return [r2(x0), r2(K * q * (Q1 / (h * h) - Q2 / (h * h)) * 1e6)];
  },
  /* Charge q at the origin, P at x = s d cm: E_x = s k q / r² (away from a positive source); F = Q E. kN/C and mN. */
  q04b: p => {
    const E = p.s * K * (p.q * 1e-9) / Math.pow(p.d * 1e-2, 2);
    return [r2(E / 1e3), r2(p.Q * 1e-6 * E * 1e3)];
  },
  /* Grain charge sQ × Q μC at d × 0.1 m. Field size = k q0 / r² (q0 in nC); attraction means the source has the opposite sign to the grain. */
  q04c: p => {
    /* F is the printed force in μN; E = F ÷ |Q|; the source size from E = k|q| ÷ r², a whole number of nC. */
    const r = p.d * 0.1, E = p.F * 1e-6 / (p.Q * 1e-6), size = Math.round(E * r * r / K * 1e9);
    return [r2(E), (p.att ? -p.sQ : p.sQ) * size];
  },
  /* Beacons at −d1 and +d2: E_x = k q1 / d1² − k q2 / d2²; F = Q E. */
  q04d: p => {
    const E = K * (p.q1 * 1e-9) / Math.pow(p.d1 * 1e-2, 2) - K * (p.q2 * 1e-9) / Math.pow(p.d2 * 1e-2, 2);
    return [r2(E / 1e3), r2(p.Q * 1e-6 * E * 1e3)];
  },
  /* Cable on x = s a .. s b (cm → m), density t lam nC/m: total charge = λ (b − a); field from the line integral above. */
  q05b: p => {
    const lam = p.t * p.lam * 1e-9, x0 = p.s * p.a * 1e-2, x1 = p.s * p.b * 1e-2;
    return [r6(lam * (p.b - p.a) * 1e-2 * 1e9), r2(lineField(lam, x0, x1) / 1e3)];
  },
  /* Positive rail from a to b cm; F = Q E. */
  q05c: p => {
    const E = lineField(p.lam * 1e-9, p.a * 1e-2, p.b * 1e-2);
    return [r2(E / 1e3), r2(p.Q * 1e-6 * E * 1e3)];
  },
  /* Left rail −b1..−a1 with λ = t1 l1, right rail a2..b2 with λ = t2 l2. */
  q05d: p => {
    const l1 = p.t1 * p.l1 * 1e-9, l2 = p.t2 * p.l2 * 1e-9;
    const tot = l1 * (p.b1 - p.a1) * 1e-2 + l2 * (p.b2 - p.a2) * 1e-2;
    const E = lineField(l1, -p.a1 * 1e-2, -p.b1 * 1e-2) + lineField(l2, p.a2 * 1e-2, p.b2 * 1e-2);
    return [r6(tot * 1e9), r2(E / 1e3)];
  }
});
})();
