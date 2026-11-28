/* Independent oracles for Waves: sound and light practice missions, file 4 of 8: q16b–q20d (game/realms/waves/practice-4.js).
   One entry per practice mission: ORACLE.<id>(p) returns the answer list for the generator's parameters p, worked out
   from what the prompt states by a different method from build() (harmonic lists searched for a match, beats counted
   per second, the Doppler shift from the moving-wavefront picture with Hz-by-Hz arithmetic).
   qa/generators.js loads this file after the whole pack and fails a practice mission that has no oracle here. */
(function(){ 'use strict';
const rd = (x, d) => { const s = Math.pow(10, d); return Math.round(x * s + (x >= 0 ? 1e-9 : -1e-9)) / s; };
const V = 343;
/* Pipe harmonic list: open both ends gives n v/(2L) for n = 1, 2, 3...; closed one end gives n v/(4L) for odd n.
   Returns the frequency of harmonic number h (h is the ordinal printed in the prompt). */
const pipeHarm = (L, shut, h) => h * V / ((shut ? 4 : 2) * L);
/* v = 331 sqrt(1 + T/273), as printed. */
const vAir = T => 331 * Math.sqrt(1 + T / 273);
/* Doppler: a listener at speed vo and a source at speed vs, each moving along the line joining them.
   Count the wavefronts the listener meets per second: the listener meets crests at spacing lambda' = (V -/+ vs)/fs
   and closes on them at V +/- vo. Signs: towards = +1 for listener moving to the source, srcTo = +1 for source moving to the listener. */
const dop = (fs, vo, lisTo, vsrc, srcTo) => {
  const lam = (V - srcTo * vsrc) / fs;
  return (V + lisTo * vo) / lam;
};
Object.assign(window.ORACLE, {
  /* f is the fundamental in Hz; shut = closed at one end; h = which harmonic is asked (odd for a closed pipe). */
  q16b: p => [rd(V / ((p.shut ? 4 : 2) * p.f), 3), rd(p.h * p.f, 6)],
  /* L metres, cut in centimetres; fundamental before, after and the rise. */
  q16c: p => {
    const a = pipeHarm(p.L, p.shut, 1), b = pipeHarm(p.L - p.cut / 100, p.shut, 1);
    return [rd(a, 2), rd(b, 2), rd(b - a, 2)];
  },
  /* T in celsius; h = harmonic number of the measured note fh; shut = closed at one end. Length uses this hall's speed. */
  q16d: p => {
    const v = vAir(p.T), f1 = p.fh / p.h;
    return [rd(v, 2), rd(f1, 6), rd(v / ((p.shut ? 4 : 2) * f1), 3)];
  },
  /* Pipe length Lp, string length Ls, density mu, tension F. Search the string's harmonics for the pipe's fundamental. */
  q17b: p => {
    const fp = pipeHarm(p.Lp, p.shut, 1), vs = Math.sqrt(p.F / p.mu);
    let n = 0;
    for (let k = 1; k <= 200; k++) if (Math.abs(k * vs / (2 * p.Ls) - fp) < 1e-6 * fp) { n = k; break; }
    return [rd(fp, 6), rd(vs, 6), n];
  },
  /* hs = which harmonic of the string must match the pipe's fundamental; F = mu v^2. */
  q17c: p => {
    const fp = pipeHarm(p.Lp, p.shut, 1), v = 2 * p.Ls * fp / p.hs;
    return [rd(fp, 2), rd(v, 2), rd(p.mu * v * v, 2)];
  },
  /* hp = pipe harmonic number, hs = string harmonic number; vs = the string's wave speed in m/s, so the printed tension is mu vs^2. */
  q17d: p => {
    const v = vAir(p.T), f = p.hp * v / ((p.shut ? 4 : 2) * p.Lp);
    const vstr = Math.sqrt(p.F / p.mu);   // F is the printed tension
    return [rd(v, 2), rd(f, 2), rd(p.hs * vstr / (2 * f), 3)];
  },
  /* c swells in t seconds; the siren is lower or higher (up) than the tower's f1. */
  q18b: p => { const b = p.c / p.t; return [rd(b, 6), rd(p.up ? p.f1 + b : p.f1 - b, 6)]; },
  /* Rover is lower than the tower; s Hz is added to the rover. */
  q18c: p => {
    const b = p.c / p.t, fr = p.ft - b;
    return [rd(b, 6), rd(fr, 6), rd(Math.abs(p.ft - (fr + p.s)), 6)];
  },
  /* Pipe of length Lp, h-th harmonic, tuning fork fk, t seconds of listening. */
  q18d: p => {
    const f = pipeHarm(p.Lp, p.shut, p.h), b = Math.abs(f - p.fk);
    return [rd(f, 6), rd(b, 6), rd(b * p.t, 6)];
  },
  /* kmh converted at 3.6; source moves towards then away from a still listener. */
  q19b: p => {
    const v = p.kmh / 3.6;
    return [rd(dop(p.fs, 0, 1, v, 1), 1), rd(dop(p.fs, 0, 1, v, -1), 1)];
  },
  /* v1 and v2 are the speeds of rovers A and B, both approaching; swells per second = |fA - fB| (unrounded notes). */
  q19c: p => {
    const a = dop(p.fs, 0, 1, p.v1, 1), b = dop(p.fs, 0, 1, p.v2, 1);
    return [rd(a, 1), rd(b, 1), rd(Math.abs(a - b), 1)];
  },
  /* Pipe length Lp, h-th harmonic, rover speed vs. */
  q19d: p => {
    const f = pipeHarm(p.Lp, p.shut, p.h);
    return [rd(f, 6), rd(dop(f, 0, 1, p.vs, 1), 1), rd(dop(f, 0, 1, p.vs, -1), 1)];
  },
  /* Beacon fs fixed; the listener drives at vo towards it, then away. */
  q20b: p => [rd(dop(p.fs, p.vo, 1, 0, 1), 1), rd(dop(p.fs, p.vo, -1, 0, 1), 1)],
  /* u = Mira's ground speed, v = the siren rover's ground speed; head-on, then moving apart. */
  q20c: p => {
    const a = dop(p.fs, p.u, 1, p.v, 1), b = dop(p.fs, p.u, -1, p.v, -1);
    return [rd(a, 1), rd(b, 1), rd(a - b, 1)];
  },
  /* vo = Mira's speed, vs = the siren rover's speed, same direction; lis true = Mira behind the siren rover (she gains on it),
     false = Mira ahead (the siren rover gains on her). Second answer: Mira stopped. */
  q20d: p => {
    const t = p.lis ? 1 : -1;
    /* behind: she moves towards the source, the source moves away (-1); ahead: she moves away (-1), the source moves towards her (+1). */
    const a = dop(p.fs, p.vo, t, p.vs, -t), b = dop(p.fs, 0, 1, p.vs, -t);
    return [rd(a, 1), rd(b, 1)];
  }
});
})();
