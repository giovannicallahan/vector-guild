/* Independent oracles for Foundations practice missions, file 7 of 8: q31b–q35d (game/realms/found/practice-7.js).
   One entry per practice mission: ORACLE.<id>(p) returns the answer list for the generator's parameters p, worked out
   from what the prompt states by a different method from build() (counting, digit reading, search, a general solver).
   qa/generators.js loads this file after the whole pack and fails a practice mission that has no oracle here. */
(function(){ 'use strict';
/* Helpers. Each one searches or does general polynomial arithmetic; none uses the closed formula of the mission. */
/* Whole number whose square is n, found by counting up. */
const wholeRoot = n => { let r = 0; while (r * r < n) r++; if (r * r !== n) throw new Error('not a perfect square: ' + n); return r; };
/* √n = k√m: strip square factors out of n one prime at a time (trial division). Returns [k, m]. */
const simplestSurd = n => {
  let k = 1, m = n;
  for (let f = 2; f * f <= m; f++) { while (m % (f * f) === 0) { m /= f * f; k *= f; } }
  return [k, m];
};
/* Polynomials as coefficient lists, constant first: [c0, c1, c2] is c0 + c1·x + c2·x². */
const polyMul = (u, v) => { const out = new Array(u.length + v.length - 1).fill(0); u.forEach((a, i) => v.forEach((b, j) => { out[i + j] += a * b; })); return out; };
const polyAdd = (u, v) => { const out = []; for (let i = 0; i < Math.max(u.length, v.length); i++) out.push((u[i] || 0) + (v[i] || 0)); return out; };
const polyAt = (u, x) => { let y = 0; for (let i = u.length - 1; i >= 0; i--) y = y * x + u[i]; return y; };
/* The pair of whole numbers (smaller first) that multiply to C and add to B, by listing the factor pairs of C. */
const pairFor = (B, C) => {
  const found = [];
  for (let u = 1; u * u <= C; u++) { if (C % u === 0 && u + C / u === B) found.push([u, C / u]); }
  if (found.length !== 1) throw new Error('expected one pair for B=' + B + ' C=' + C + ', found ' + found.length);
  return found[0];
};
/* Whole-number roots of a polynomial, by trying every x in a range. Smaller first. */
const wholeRoots = (u, lo, hi) => { const r = []; for (let x = lo; x <= hi; x++) if (polyAt(u, x) === 0) r.push(x); return r; };
/* Lowest point of an upward parabola: scan half-steps and keep the smallest y. Returns [x, y]. */
const lowestPoint = (u, lo, hi) => { let best = null; for (let t = lo * 2; t <= hi * 2; t++) { const x = t / 2, y = polyAt(u, x); if (best === null || y < best[1]) best = [x, y]; } return best; };
/* Divide polynomial u by the linear factor (x + a) by synthetic division. Returns the quotient; throws on a remainder. */
const divideByLinear = (u, a) => {
  const top = u.slice().reverse(); const q = []; let carry = 0;
  for (let i = 0; i < top.length; i++) { carry = top[i] + carry * (-a); if (i < top.length - 1) q.push(carry); }
  if (carry !== 0) throw new Error('remainder ' + carry);
  return q.reverse();
};

Object.assign(window.ORACLE, {
  /* The prompt gives the two areas. Side by counting up to the root; fence by walking the four sides; surd by trial division. */
  q31b: p => {
    const A = p.s * p.s, N = p.k * p.k * p.m;
    const side = wholeRoot(A);
    let fence = 0; for (let i = 0; i < 4; i++) fence += side;
    const [k, m] = simplestSurd(N);
    return [side, fence, k, m];
  },
  /* Share the total out tile by tile, then simplify the root of one tile's area by trial division. */
  q31c: p => {
    const total = p.c * p.k * p.k * p.m;
    let tile = 0; while (tile * p.c < total) tile++;
    if (tile * p.c !== total) throw new Error('total does not share out evenly');
    const [k, m] = simplestSurd(tile);
    return [tile, k, m];
  },
  /* Pole and ground distance as stated; the squares on the two short sides, added; then trial division. */
  q31d: p => {
    const h = p.g * p.u, d = p.g * p.v;
    const sq = h * h + d * d;
    const [k, m] = simplestSurd(sq);
    return [sq, k, m];
  },
  /* General polynomial arithmetic: (a + x)(b + x) + p·(c + x); read off the x and constant coefficients. */
  q32b: p => {
    const total = polyAdd(polyMul([p.a, 1], [p.b, 1]), polyMul([p.p], [p.c, 1]));
    if (total[2] !== 1) throw new Error('x² coefficient is not 1');
    return [total[1], total[0]];
  },
  /* Multiply out as polynomials; the area from the two measured sides (not from the expansion); cost by repeated addition. */
  q32c: p => {
    const area = polyMul([p.a, 1], [p.b, 1]);
    const lawn = (p.x0 + p.a) * (p.x0 + p.b);
    if (polyAt(area, p.x0) !== lawn) throw new Error('expansion and sides disagree');
    let cost = 0; for (let i = 0; i < lawn; i++) cost += p.price;
    return [area[1], area[0], lawn, cost];
  },
  /* (c + p·x)(d + x) + (a + x)(b + x) as polynomials. */
  q32d: p => {
    const total = polyAdd(polyMul([p.c, p.p], [p.d, 1]), polyMul([p.a, 1], [p.b, 1]));
    return [total[2], total[1], total[0]];
  },
  /* The prompt shows B and C only: list the factor pairs of C and pick the one that adds to B. Seats from the polynomial. */
  q33b: p => {
    const B = p.p + p.q, C = p.p * p.q;
    const [rows, seats] = pairFor(B, C);
    return [rows, seats, polyAt([C, B, 1], p.x0)];
  },
  /* Count the strips and small plates as stated, search for the pair, then measure each side at the chosen x. */
  q33c: p => {
    const B = p.p + p.q, C = p.p * p.q;
    const [small, large] = pairFor(B, C);
    const shortSide = p.x0 + small, longSide = p.x0 + large;
    if (shortSide * longSide !== polyAt([C, B, 1], p.x0)) throw new Error('sides do not give the area');
    return [small, large, shortSide, longSide];
  },
  /* Pair by search. x by trying whole numbers until the walk round the four sides matches the stated fence. */
  q33d: p => {
    const B = p.p + p.q, C = p.p * p.q, P = 4 * p.x0 + 2 * (p.p + p.q);
    const [small, large] = pairFor(B, C);
    let x = null;
    for (let t = 0; t <= 1000; t++) { if ((t + small) + (t + large) + (t + small) + (t + large) === P) { x = t; break; } }
    if (x === null) throw new Error('no whole x gives the fence');
    return [small, large, x, x + large];
  },
  /* Roots by trying every month; lowest balance by scanning the curve in half-month steps. */
  q34b: p => {
    const s = p.r + p.d, curve = [p.r * s, -(p.r + s), 1];
    const roots = wholeRoots(curve, -5, 60);
    if (roots.length !== 2) throw new Error('expected two roots');
    const low = lowestPoint(curve, -5, 60);
    return [roots[0], roots[1], low[0], low[1]];
  },
  /* Count the stretch below bridge level kilometre by kilometre between the crossings; scan for the lowest point. */
  q34c: p => {
    const s = p.r + p.d, curve = [p.r * s, -(p.r + s), 1];
    const roots = wholeRoots(curve, -5, 60);
    if (roots.length !== 2) throw new Error('expected two roots');
    let below = 0; for (let x = roots[0]; x < roots[1]; x++) below++;
    const low = lowestPoint(curve, -5, 60);
    return [below, low[0], Math.abs(low[1])];
  },
  /* (x − r)(x − s) as polynomials; the number before x is entered without its minus sign. Vertex by scanning. */
  q34d: p => {
    const s = p.r + p.d, curve = polyMul([-p.r, 1], [-s, 1]);
    const low = lowestPoint(curve, -5, 60);
    return [-curve[1], curve[0], low[0], low[1]];
  },
  /* Synthetic division of x² + Bx + C by x + a; each share by dividing the actual cost by the head count; the x that zeroes x + a by search. */
  q35b: p => {
    const B = p.a + p.c, C = p.a * p.c, cost = [C, B, 1];
    const q = divideByLinear(cost, p.a);
    let bad = null; for (let x = -50; x <= 50; x++) if (x + p.a === 0) bad = x;
    return [q[0], polyAt(cost, p.x0) / (p.x0 + p.a), bad];
  },
  /* Synthetic division; rolls counted from x + a; batch from the polynomial; one roll = batch ÷ rolls. */
  q35c: p => {
    const B = p.a + p.c, C = p.a * p.c, dough = [C, B, 1];
    const q = divideByLinear(dough, p.a);
    const rolls = p.x0 + p.a, batch = polyAt(dough, p.x0);
    return [q[0], rolls, batch / rolls, batch];
  },
  /* x² − Bx + C divided by x − r: quotient is x − (number), entered positive. Pay by real division; bad x by search. */
  q35d: p => {
    const B = p.r + p.s, C = p.r * p.s, pay = [C, -B, 1];
    const q = divideByLinear(pay, -p.r);
    let bad = null; for (let x = -50; x <= 50; x++) if (x - p.r === 0) bad = x;
    return [-q[0], polyAt(pay, p.x0) / (p.x0 - p.r), bad];
  },
});
})();
