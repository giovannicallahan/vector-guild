/* Independent oracles for Foundations chapters 1 and 2, q01–q12 (game/realms/found/missions-a.js).
   Each one rebuilds the numbers the prompt states from the generator's parameters and answers the question the
   prompt asks by a different method from build(): counting one at a time, column arithmetic on digit strings,
   repeated subtraction, a small expression evaluator, walking the number line, and searching for the fraction,
   percent or rate that makes the stated relation true. */
(function(){ 'use strict';
/* The smallest whole number v in [lo, hi] with test(v), or NaN. */
const search = (lo, hi, test) => { for (let v = lo; v <= hi; v++) if (test(v)) return v; return NaN; };
/* Add two whole numbers written as digit strings, column by column from the right, carrying. */
const addCols = (x, y) => {
  x = String(x); y = String(y); let out = '', carry = 0;
  for (let i = 1; i <= Math.max(x.length, y.length); i++) {
    const s = Number(x[x.length - i] || 0) + Number(y[y.length - i] || 0) + carry;
    out = String(s % 10) + out; carry = s >= 10 ? 1 : 0;
  }
  return Number((carry ? '1' : '') + out);
};
/* Subtract y from x (x >= y), column by column from the right, borrowing. */
const subCols = (x, y) => {
  const top = String(x).split('').map(Number), bot = String(y).padStart(top.length, '0').split('').map(Number);
  const out = [];
  for (let i = top.length - 1; i >= 0; i--) {
    if (top[i] < bot[i]) { top[i] += 10; let j = i - 1; while (top[j] === 0) { top[j] = 9; j--; } top[j]--; }
    out.unshift(top[i] - bot[i]);
  }
  return Number(out.join(''));
};
/* Evaluate an expression in + − × ÷ and brackets in the agreed order (recursive descent). */
const evaluate = text => {
  const tokens = text.match(/\d+|[-+×÷()]/g); let i = 0;
  const atom = () => { const t = tokens[i++]; if (t === '(') { const v = sum(); i++; return v; } return Number(t); };
  const product = () => { let v = atom(); while (tokens[i] === '×' || tokens[i] === '÷') { const op = tokens[i++], w = atom(); v = op === '×' ? v * w : v / w; } return v; };
  const sum = () => { let v = product(); while (tokens[i] === '+' || tokens[i] === '-') { const op = tokens[i++], w = product(); v = op === '+' ? v + w : v - w; } return v; };
  return sum();
};
/* A fraction top/bottom in lowest terms by search: the smallest denominator D for which top/bottom = N/D exactly. */
const lowest = (top, bottom) => { const D = search(1, bottom, D => (top * D) % bottom === 0); return [top * D / bottom, D]; };
/* Hundredths written as a decimal string with two places, and read back by its digits. */
const dec = h => { const s = String(h).padStart(3, '0'); return s.slice(0, -2) + '.' + s.slice(-2); };
const hundredths = s => Number(s.replace('.', ''));

Object.assign(window.ORACLE, {
  /* Count the rivets group by group, then read the hundreds digit of the written total. */
  q01: p => {
    let total = 0;
    for (let i = 0; i < p.a; i++) total += 1000;
    for (let i = 0; i < p.b; i++) total += 100;
    for (let i = 0; i < p.c; i++) total += 10;
    for (let i = 0; i < p.d; i++) total += 1;
    const s = String(total);
    return [total, Number(s[s.length - 3]) * 100];
  },
  /* Column addition for the shuttle, column subtraction for the survey team. */
  q02: p => { const after = addCols(p.a, p.b); return [after, subCols(after, p.c)]; },
  /* Count the jugs shelf by shelf, then rack by rack. */
  q03: p => {
    let one = 0; for (let s = 0; s < p.k; s++) one += p.m;
    let all = 0; for (let r = 0; r < p.r; r++) all += one;
    return [one, all];
  },
  /* The prompt states N packs and boxes of d; fill boxes one at a time while a full box can still be made. */
  q04: p => {
    const N = p.d * p.q + p.r; let left = N, boxes = 0;
    while (left >= p.d) { left -= p.d; boxes++; }
    return [boxes, left];
  },
  /* Rebuild the two lines of the note as text and evaluate them with a precedence parser. */
  q05: p => {
    const A = `${p.a} + ${p.b} × (${p.c} - ${p.d})`, B = `${p.e * p.f} ÷ ${p.f} - ${p.g} × ${p.h}`;
    return [evaluate(A), evaluate(B)];
  },
  /* Walk the thermometer one degree at a time. */
  q06: p => {
    let t = p.s; for (let i = 0; i < p.u; i++) t++;
    const noon = t; for (let i = 0; i < p.w; i++) t--;
    return [noon, t];
  },
  /* A bar of d·w grams cut into d equal pieces: find the piece weight by search, then weigh the pieces eaten. */
  q07: p => {
    const bar = p.d * p.w, piece = search(1, bar, x => x * p.d === bar);
    let eaten = 0; for (let i = 0; i < p.k; i++) eaten += piece;
    return [p.k, p.d, eaten];
  },
  /* pm served of qm trays, in lowest terms by searching for the smallest denominator. */
  q08: p => lowest(p.p * p.m, p.q * p.m),
  /* Sum and product as exact rationals over the product of the denominators, then reduced by search. */
  q09: p => {
    const sum = lowest(p.a * p.d + p.c * p.b, p.b * p.d), prod = lowest(p.e * p.g, p.f * p.h);
    return [sum[0], sum[1], prod[0], prod[1]];
  },
  /* Write the three amounts as decimals, read them as hundredths, add and subtract by columns. */
  q10: p => {
    const amounts = [p.x, p.y, p.z].map(dec).map(hundredths);
    const poured = addCols(addCols(amounts[0], amounts[1]), amounts[2]);
    const room = subCols(hundredths(p.C + '.00'), poured);
    return [poured / 100, room / 100];
  },
  /* The litres L with L out of C equal to p out of 100, by search; the rest is counted up to full. */
  q11: p => {
    const L = search(0, p.C, v => 100 * v === p.C * p.p);
    let toFill = 0; while (L + toFill < p.C) toFill++;
    return [L, toFill];
  },
  /* The pump states r·m litres in m minutes. The rate is the litres in one minute; the litres in T minutes are the
     amount X that keeps X/T equal to (r·m)/m, found by search. */
  q12: p => {
    const litres = p.r * p.m;
    const rate = search(0, 1000, v => v * p.m === litres);
    const X = search(0, 100000, v => v * p.m === litres * p.T);
    return [rate, X];
  },
});
})();
