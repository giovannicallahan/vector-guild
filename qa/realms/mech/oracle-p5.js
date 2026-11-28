/* Independent oracles for Mechanics: practice missions, file 5 of 8: q21b–q25d (game/realms/mech/practice-5.js).
   One entry per practice mission: ORACLE.<id>(p) returns the answer list for the generator's parameters p, worked out
   from the prompt by a different method from build(): force components by trigonometry, and for the connected bodies
   a whole-system equation (net driving force ÷ total mass) with the tension found from one body. */
(function(){ 'use strict';
const rd = (x, d) => { const f = Math.pow(10, d); return Math.round(x * f + 1e-9 * Math.sign(x)) / f; };
const g = 9.8;
Object.assign(window.ORACLE, {
  /* q21b: W newtons, th radians (both printed). */
  q21b: p => [rd(p.W * Math.sin(p.th), 2), rd(p.W * Math.cos(p.th), 2)],
  /* q21c: k is the printed number of crates, m the printed mass of each. Cable balances the along-ramp part;
     the snapped-cable acceleration is (that force) / (total mass). */
  q21c: p => {
    const M = p.k * p.m, w = M * g, along = w * Math.sin(p.th);
    return [rd(along, 2), rd(w * Math.cos(p.th), 2), rd(along / M, 2)];
  },
  /* q21d: H rise, Rn run (printed); slope length by Pythagoras; sin = H/L, cos = Rn/L. */
  q21d: p => {
    const L = Math.sqrt(p.H * p.H + p.Rn * p.Rn), w = p.m * g;
    return [rd(L, 2), rd(w * p.H / L, 2), rd(w * p.Rn / L, 2)];
  },
  /* q22b: weight W (N), slope angle th. Static holds if w sin th <= us N. */
  q22b: p => {
    const N = p.W * Math.cos(p.th), pull = p.W * Math.sin(p.th);
    if (pull <= p.us * N) return [rd(pull, 2), 0];
    return [rd(p.uk * N, 2), rd(pull - p.uk * N, 2)];
  },
  /* q22c: level deck; pull F, mass m, t seconds from rest. */
  q22c: p => {
    const N = p.m * g;
    if (p.F <= p.us * N) return [rd(p.F, 2), 0, 0];
    const a = (p.F - p.uk * N) / p.m;
    return [rd(p.uk * N, 2), rd(a, 2), rd(a * p.t, 2)];
  },
  /* q22d: ramp with an up-ramp push P. net = m g sin th − P (down positive); static holds if |net| <= us N. */
  q22d: p => {
    const N = p.m * g * Math.cos(p.th), net = p.m * g * Math.sin(p.th) - p.P;
    if (Math.abs(net) <= p.us * N) return [rd(Math.abs(net), 2), 0];
    const f = p.uk * N, a = (net > 0 ? net - f : net + f) / p.m;
    return [rd(f, 2), rd(a, 2)];
  },
  /* q23b: sled m1 on the deck, bucket m2 hanging. System: (m2 g − uk m1 g) / (m1 + m2); tension from the bucket. */
  q23b: p => {
    const a = (p.m2 * g - p.uk * p.m1 * g) / (p.m1 + p.m2);
    return [rd(a, 2), rd(p.m2 * (g - a), 2)];
  },
  /* q23c: crate m1 slides down a ramp, counterweight m2 rises. */
  q23c: p => {
    const a = (p.m1 * g * Math.sin(p.th) - p.uk * p.m1 * g * Math.cos(p.th) - p.m2 * g) / (p.m1 + p.m2);
    return [rd(a, 2), rd(p.m2 * (g + a), 2)];
  },
  /* q23d: A (m1, th1) slides down, B (m2, th2) is pulled up; friction opposes motion on both. */
  q23d: p => {
    const drive = p.m1 * g * Math.sin(p.th1) - p.m2 * g * Math.sin(p.th2);
    const fr = p.uk * g * (p.m1 * Math.cos(p.th1) + p.m2 * Math.cos(p.th2));
    const a = (drive - fr) / (p.m1 + p.m2);
    const T = p.m2 * (a + g * Math.sin(p.th2) + p.uk * g * Math.cos(p.th2));
    return [rd(a, 2), rd(T, 2)];
  },
  /* q24b: T = m v²/r; greatest speed from m v²/r = Tmax. */
  q24b: p => [rd(p.m * p.v * p.v / p.r, 2), rd(Math.sqrt(p.Tmax * p.r / p.m), 2)],
  /* q24c: needed force m v²/r; smallest radius from m v²/r = us m g, i.e. v²/(us g). */
  q24c: p => [rd(p.m * p.v * p.v / p.r, 2), rd(p.v * p.v / (p.us * g), 2)],
  /* q24d: v = circumference / lap time; a = (2π/T)² r; skid limit v² = us g r, so T = 2π sqrt(r/(us g)). */
  q24d: p => {
    const w = 2 * Math.PI / p.T;
    return [rd(w * p.r, 2), rd(w * w * p.r, 2), rd(2 * Math.PI * Math.sqrt(p.r / (p.us * g)), 2)];
  },
  /* q25b: f is the printed percent. Terminal b v² = m g; drag at f% of weight: b v² = (f/100) m g. */
  q25b: p => [rd(Math.sqrt(p.m * g / p.b), 2), rd(Math.sqrt(p.f / 100 * p.m * g / p.b), 2)],
  /* q25c: b from the balance reading D = b v1²; terminal speed; a at v2 = g − b v2²/m. */
  q25c: p => {
    const b = p.D / (p.v1 * p.v1);
    return [rd(b, 2), rd(Math.sqrt(p.m * g / b), 2), rd(g - b * p.v2 * p.v2 / p.m, 2)];
  },
  /* q25d: drive per kg = g(sin th − uk cos th); terminal b v² = m g (sin th − uk cos th); a at v. */
  q25d: p => {
    const F = p.m * g * (Math.sin(p.th) - p.uk * Math.cos(p.th));
    return [rd(Math.sqrt(F / p.b), 2), rd((F - p.b * p.v * p.v) / p.m, 2)];
  },
});
})();
