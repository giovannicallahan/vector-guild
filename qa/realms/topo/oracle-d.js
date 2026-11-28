/* Independent oracles for Topology: shape without size learn missions, file d: q31–q40 (game/realms/topo/missions-d.js).
   ORACLE.<id>(p) returns the answer list for the generator's parameters p, worked out from what the prompt states
   by a different method from build() (docs/PACK-FORMAT.md §6): a table of values, a search, a numerical method or a
   general solver. Do not import game files. */
(function(){ 'use strict';
const rd = (x, d) => { const f = Math.pow(10, d); return Math.round(x * f * (1 + 1e-12) + (x >= 0 ? 1e-9 : -1e-9)) / f; };
/* Sector codes in the drone logs: 0 = NE, 1 = NW, 2 = SW, 3 = SE (anticlockwise order). The ray due east is the
   border between SE (3) and NE (0): 3 → 0 is anticlockwise, 0 → 3 is clockwise. */
const crossings = seq => { let ac = 0, cw = 0; for (let i = 1; i < seq.length; i++) { if (seq[i - 1] === 3 && seq[i] === 0) ac++; else if (seq[i - 1] === 0 && seq[i] === 3) cw++; } return [ac, cw]; };
const wind = seq => { const [a, c] = crossings(seq); return a - c; };
/* Euler characteristic of a closed surface by its classification: orientable genus h gives 2 − 2h, non-orientable with h cross-caps gives 2 − h. */
const chiOf = (orientable, h) => orientable ? 2 - 2 * h : 2 - h;
Object.assign(window.ORACLE, {
  /* Angles a·π/12, b·π/12, c·π/12 (a, b, c are the numerators over 12 in the printed text); radius s; second area A2.
     kA = angle sum − π with k = 1 ÷ s². The triangle must exist on the sphere: its polar triangle has sides π − α, π − β,
     π − γ, which must obey the triangle inequality (each less than the sum of the other two) and add up to less than 2π. */
  q31: p => {
    const sum = (p.a + p.b + p.c) * Math.PI / 12, ex = sum - Math.PI, k = 1 / (p.s * p.s);
    const pol = [p.a, p.b, p.c].map(x => Math.PI - x * Math.PI / 12), tot = pol[0] + pol[1] + pol[2];
    if (pol.some(x => x <= 0 || x >= tot - x) || tot >= 2 * Math.PI) return ['no such spherical triangle'];
    return [rd(ex, 2), rd(ex / k, 2), rd(Math.PI + k * p.A2, 2)];
  },
  /* Genus g closed surface with k = −1 ÷ m: kA = 2πχ gives A ÷ π = 2χ ÷ k. Sphere of radius s: area 4πs². */
  q32: p => {
    const chi = 2 - 2 * p.g, k = -1 / p.m;
    return [chi, rd(2 * chi / k, 6), 4 * p.s * p.s];
  },
  /* o = 1 orientable genus h, o = 0 non-orientable with h cross-caps. Sign of k is the sign of χ (kA = 2πχ, A > 0).
     Design 3 with k = −1: A ÷ π = 2χ ÷ k = −2χ. */
  q33: p => {
    const sg = x => x > 0 ? 1 : x < 0 ? -1 : 0;
    const c1 = chiOf(p.o1, p.h1), c2 = chiOf(p.o2, p.h2), c3 = chiOf(p.o3, p.h3);
    return [sg(c1), sg(c2), rd(2 * c3 / -1, 6)];
  },
  /* Genus g polygon has 4g sides and 4g corners, all at one point, so the corner angles add to 2π: 4g·(π ÷ N) = 2π.
     In the tiling the corners that meet at the point also fill 2π, so 4g corners meet there.
     Area from the polygon angle sum: kA = angle sum − (n − 2)π with n = 4g sides, k = −1 ÷ m. */
  q34: p => {
    const n = 4 * p.g; let N = 1;
    while (n * Math.PI / N > 2 * Math.PI + 1e-9) N++;
    const k = -1 / p.m, sum = 2 * Math.PI, area = (sum - (n - 2) * Math.PI) / k;
    return [N, 2 * N, rd(area / Math.PI, 6)];
  },
  /* seq is the list of sector codes (0 NE, 1 NW, 2 SW, 3 SE). */
  q35: p => { const [a, c] = crossings(p.seq); return [a, c, a - c]; },
  /* Joining adds winding numbers; reversing negates. */
  q36: p => { const wa = wind(p.a), wb = wind(p.b); return [wa + wb, -wa, wb - wa + wb]; },
  /* f(θ) = aθ, g(θ) = bθ, loop of winding k. Degree of the composite is a·b (check by counting preimages of 0:
     the points θ in [0, 2π) with abθ ≡ 0 are 2πj ÷ |ab|, so |ab| of them). Image winding = degree × k. */
  q37: p => {
    const d = p.a * p.b; let pre = 0;
    for (let j = 0; j < Math.abs(d); j++) pre++;
    return [d, pre, d * p.k];
  },
  /* kind 0: grid x wide, y tall; kind 1: wheel with x spokes; kind 2: x posts each joined to every other.
     Loops = E − V + 1 (connected graph). */
  q38: p => {
    let V, E;
    if (p.kind === 0) { V = (p.x + 1) * (p.y + 1); E = 0; for (let r = 0; r <= p.y; r++) E += p.x; for (let c = 0; c <= p.x; c++) E += p.y; }
    else if (p.kind === 1) { V = p.x + 1; E = p.x + p.x; }
    else { V = p.x; E = 0; for (let i = 0; i < p.x; i++) for (let j = i + 1; j < p.x; j++) E++; }
    return [V, E, E - V + 1];
  },
  /* f(x) = (s·x² + P) ÷ 10 (s = −1 gives (P − x²) ÷ 10); g = f − x. Bisection on [0, 5] where g changes sign. */
  q39: p => {
    const f = x => (p.s * x * x + p.P) / 10, g = x => f(x) - x;
    let lo = 0, hi = 5; const sLo = Math.sign(g(0));
    for (let i = 0; i < 200; i++) { const m = (lo + hi) / 2; if (Math.sign(g(m)) === sLo) lo = m; else hi = m; }
    return [rd(g(0), 6), rd(g(5), 6), rd((lo + hi) / 2, 2)];
  },
  /* Each circuit encloses the sensors whose letters are in its code (c1, c2, c3) and turns t1, t2, t3 times (negative = clockwise).
     Winding round a sensor adds the turns of every circuit enclosing it. */
  q40: p => {
    const cs = [[p.c1, p.t1], [p.c2, p.t2], [p.c3, p.t3]];
    const w = L => cs.reduce((s, [c, t]) => s + (c.includes(L) ? t : 0), 0);
    const a = w('A'), b = w('B'), c = w('C');
    return [a, b, c, a + b + c];
  },
});
})();
