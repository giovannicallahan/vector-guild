/* Independent oracles for Waves: sound and light learn missions, file b: q11–q20 (game/realms/waves/missions-b.js).
   ORACLE.<id>(p) returns the answer list for the generator's parameters p, worked out from what the prompt states
   by a different method from build() (docs/PACK-FORMAT.md §6): a table of values, a search, a numerical method or a
   general solver. Do not import game files. Answers are rounded to the places each prompt states, from the
   unrounded working. */
(function(){ 'use strict';
const rnd = (x, d) => { const f = Math.pow(10, d); return Math.round((x + Math.sign(x) * 1e-12) * f) / f; };
const V_AIR = 343; /* speed of sound the prompts print for the hall */
/* Bisection: smallest x in [lo, hi] where the rising function g(x) reaches target. */
const solveUp = (g, target, lo, hi) => { for (let i = 0; i < 200; i++) { const m = (lo + hi) / 2; if (g(m) < target) lo = m; else hi = m; } return (lo + hi) / 2; };
/* Doppler by counting wavefronts: speeds are measured along the line from listener to source, positive when
   that mover heads towards the other. The waves are spaced (v − uS) ÷ fs apart in the air; the listener meets
   them at relative speed v + uL. */
const heard = (fs, uL, uS) => { const lam = (V_AIR - uS) / fs; return (V_AIR + uL) / lam; };
Object.assign(window.ORACLE, {
  /* μ = M ÷ L (kg per metre). Wave speed = the v that makes v²·μ equal the tension (search). λ = v ÷ f.
     Travel time = the time for a steady v to cover L. */
  q11: p => {
    const mu = p.M / p.L;
    const v = solveUp(x => x * x * mu, p.F, 0, 1e6);
    return [rnd(mu, 6), rnd(v, 6), rnd(v / p.f, 6), rnd(p.L / v, 3)];
  },
  /* Two sines added. The combined amplitude is the largest size of y1 + y2 as the common phase kx − ωt runs
     through a whole turn (scan); the displacement adds the two sines at the stated phase, the second shifted by phi. */
  q12: p => {
    const n = 200000; let amp = 0;
    for (let i = 0; i < n; i++) {
      const u = 2 * Math.PI * i / n;
      amp = Math.max(amp, Math.abs(p.A * Math.sin(u) + p.A * Math.sin(u + p.phi)));
    }
    const y = p.A * Math.sin(p.th) + p.A * Math.sin(p.th + p.phi);
    return [rnd(amp, 2), rnd(y, 2)];
  },
  /* Nodes of sin(nπx/L) on a cable fixed at both ends: the zeros are at x = kL/n. Neighbouring zeros give the
     spacing, the wavelength is twice it, and f = v ÷ λ. (h is the number of loops.) */
  q13: p => {
    const nodes = []; for (let k = 0; k <= p.h; k++) nodes.push(k * p.L / p.h);
    const spacing = nodes[1] - nodes[0], lam = 2 * spacing;
    return [rnd(lam, 6), rnd(p.v / lam, 6), rnd(spacing, 6)];
  },
  /* v = 331 √(1 + Tc/273); wavelength from the unrounded speed. */
  q14: p => {
    const v = 331 * Math.sqrt(1 + p.Tc / 273);
    return [rnd(v, 2), rnd(v / p.f, 3)];
  },
  /* β = 10 log10(I ÷ 1e-12). The first intensity is a × 10^e; the second is r times it (r is the printed ratio).
     The last box is the second intensity divided by the first. */
  q15: p => {
    const I1 = p.a * Math.pow(10, p.e), I2 = p.r * I1;
    const lvl = I => 10 * Math.log10(I / 1e-12);
    return [rnd(lvl(I1), 1), rnd(lvl(I2), 1), rnd(I2 / I1, 6)];
  },
  /* Pipe modes listed from the wavelength condition: closed-open fits odd quarter-wavelengths (L = nλ/4, n odd),
     open-open fits n half-wavelengths. The fundamental is the lowest, the next is the second in the list.
     The other pipe's length is found by searching for the length whose lowest mode equals this fundamental. */
  q16: p => {
    const modes = (L, closed) => { const out = []; for (let n = 1; out.length < 4; n++) { if (closed && n % 2 === 0) continue; out.push(V_AIR / ((closed ? 4 : 2) * L / n)); } return out; };
    const m = modes(p.L, p.shut);
    const lowest = L => modes(L, !p.shut)[0];
    let lo = 1e-6, hi = 1e3; for (let i = 0; i < 200; i++) { const mid = (lo + hi) / 2; if (lowest(mid) > m[0]) lo = mid; else hi = mid; }
    return [rnd(m[0], 2), rnd(m[1], 2), rnd((lo + hi) / 2, 3)];
  },
  /* String: v = √(F ÷ μ); the h-th harmonic has h half-wavelengths on the string, so λ = 2Ls ÷ h and f = v ÷ λ.
     The pipe's fundamental has one quarter-wavelength (closed) or one half-wavelength (open) in the pipe. */
  q17: p => {
    const v = Math.sqrt(p.F / p.mu), f = v / (2 * p.Ls / p.h);
    const lamAir = V_AIR / f, L = lamAir / (p.shut ? 4 : 2);
    return [rnd(v, 3), rnd(f, 3), rnd(L, 3)];
  },
  /* Beats per second = the gap between the two notes; beats heard = gap × time; the second pipe is b above or
     below the fork. The first pipe sits d above the fork (the prompt prints fork + d). */
  q18: p => {
    const pipe = p.f1 + p.d;
    const beat = Math.abs(p.f1 - pipe);
    return [rnd(beat, 6), rnd(beat * p.t, 6), rnd(p.up ? p.f1 + p.b : p.f1 - p.b, 6)];
  },
  /* Still listener, moving rover: count wavefronts. Approaching, the source follows its own waves so they are
     bunched; moving away, stretched. */
  q19: p => [rnd(heard(p.fs, 0, p.vs), 1), rnd(heard(p.fs, 0, -p.vs), 1)],
  /* Part 1: listener moves, tower still (towards the tower unless "away"). Part 2: both move, towards each other
     unless "apart". */
  q20: p => {
    const first = heard(p.fs, p.away ? -p.vo : p.vo, 0);
    const second = p.apart ? heard(p.fs, -p.vo, -p.vs) : heard(p.fs, p.vo, p.vs);
    return [rnd(first, 1), rnd(second, 1)];
  }
});
})();
