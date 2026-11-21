/* Independent oracles for Foundations practice missions, file 1 of 8: q01b–q05d (game/realms/found/practice-1.js).
   One entry per practice mission: ORACLE.<id>(p) returns the answer list for the generator's parameters p, worked out
   from what the prompt states by a different method from build() (counting, digit reading, search, a general solver).
   qa/generators.js loads this file after the whole pack and fails a practice mission that has no oracle here. */
(function(){ 'use strict';
/* Helpers: counting, never the closed formula. */
const repeatAdd = (step, times) => { let s = 0; for (let i = 0; i < times; i++) s += step; return s; };
/* How many whole lots of `size` can be taken out of `stock`, by taking them out one at a time: [lots, what is left]. */
const takeOut = (stock, size) => { let lots = 0, left = stock; while (left >= size) { left -= size; lots++; } return [lots, left]; };
/* Count on (up) from `from` to `to`, one at a time: the number of single steps. */
const countUp = (from, to) => { let steps = 0; for (let x = from; x < to; x++) steps++; return steps; };
/* Digit of a whole number, `place` from the right (0 = ones), read from its written form. */
const digitAt = (num, place) => { const s = String(num); const i = s.length - 1 - place; return i < 0 ? 0 : Number(s[i]); };
/* A small general evaluator for + − × ÷ and brackets, with the standard order (recursive descent, left to right). */
const evaluate = text => {
  const toks = text.replace(/−/g, '-').replace(/×/g, '*').replace(/÷/g, '/').match(/\d+|[-+*/()]/g);
  let i = 0;
  const atom = () => { const t = toks[i++]; if (t === '(') { const v = sum(); i++; return v; } return Number(t); };
  const product = () => { let v = atom(); while (toks[i] === '*' || toks[i] === '/') { const op = toks[i++]; const r = atom(); v = op === '*' ? v * r : v / r; } return v; };
  const sum = () => { let v = product(); while (toks[i] === '+' || toks[i] === '-') { const op = toks[i++]; const r = product(); v = op === '+' ? v + r : v - r; } return v; };
  return sum();
};

Object.assign(window.ORACLE, {
  /* Write the four counts side by side as text and read the number; count the packets' seeds ten at a time. */
  q01b: p => {
    const total = Number(String(p.a) + String(p.b) + String(p.c) + String(p.d));
    let inPackets = 0; for (let i = 0; i < p.c; i++) inPackets += 10;
    return [total, inPackets];
  },
  /* Read the amount as written, then hand the money out greedily: bundles, then 100s, then 10s. */
  q01c: p => {
    const amount = Number(String(p.a) + String(p.b) + String(p.c) + '0');
    const [bundles, afterBundles] = takeOut(amount, 1000);
    const [hundreds, afterHundreds] = takeOut(afterBundles, 100);
    const [tens] = takeOut(afterHundreds, 10);
    return [bundles, hundreds, tens];
  },
  /* Lay out every tile group by repeated addition, then read the thousands digit off the written total. */
  q01d: p => {
    const total = repeatAdd(1000, p.a) + repeatAdd(100, p.b) + repeatAdd(10, p.c) + repeatAdd(1, p.d);
    return [total, repeatAdd(1000, digitAt(total, 3))];
  },
  /* Subtract by counting up from the bill to the balance; add by counting on. */
  q02b: p => {
    const afterBill = countUp(p.b, p.a);
    let afterWages = afterBill; for (let i = 0; i < p.c; i++) afterWages++;
    return [afterBill, afterWages];
  },
  /* Add the three weeks column by column (ones, tens, hundreds, with carries); count up to the target. */
  q02c: p => {
    let carry = 0, walked = 0;
    for (let place = 0; place < 5; place++) {
      const col = digitAt(p.a, place) + digitAt(p.b, place) + digitAt(p.c, place) + carry;
      walked += (col % 10) * Math.pow(10, place); carry = (col - col % 10) / 10;
    }
    return [walked, countUp(walked, p.t)];
  },
  /* Only the two readings are shown: count up from the old reading to today's, then count h back off. */
  q02d: p => {
    const earlier = p.p, today = p.p + p.u;
    const used = countUp(earlier, today);
    let rest = used; for (let i = 0; i < p.h; i++) rest--;
    return [used, rest];
  },
  /* One call: add m once for each minute. All calls: add the one-call figure once for each call. */
  q03b: p => {
    const oneCall = repeatAdd(p.m, p.k);
    return [oneCall, repeatAdd(oneCall, p.r)];
  },
  /* Put every tin and every roller on the bill one at a time. */
  q03c: p => {
    let paint = 0, rollers = 0, bill = 0;
    for (let i = 0; i < p.t; i++) { paint += p.p; bill += p.p; }
    for (let i = 0; i < p.b; i++) { rollers += p.q; bill += p.q; }
    return [paint, rollers, bill];
  },
  /* Ten weeks: shift the digits of m one place (append a 0). All weeks: fill the jar week by week. */
  q03d: p => {
    const tenWeeks = Number(String(p.m) + '0');
    let jar = 0; for (let week = 1; week <= p.w; week++) jar += p.m;
    return [tenWeeks, jar];
  },
  /* Build the jar's grams as the prompt shows them, then make cups one at a time until too little is left. */
  q04b: p => {
    const N = repeatAdd(p.d, p.q) + p.r;
    return takeOut(N, p.d);
  },
  /* Fill minibuses one at a time; then search for the smallest number of minibuses with enough seats. */
  q04c: p => {
    const N = repeatAdd(p.d, p.q) + p.r;
    const [full, left] = takeOut(N, p.d);
    let book = 0; while (repeatAdd(p.d, book) < N) book++;
    return [full, left, book];
  },
  /* Unpack every case, then load racks one at a time. */
  q04d: p => {
    const cells = repeatAdd(p.m, p.k);
    const [racks, left] = takeOut(cells, p.d);
    return [cells, racks, left];
  },
  /* Type each line as it is printed and run it through the general evaluator. */
  q05b: p => [
    evaluate(`${p.a} + ${p.b} × ${p.c}`),
    evaluate(`(${p.x} + ${p.y}) ÷ ${p.p}`)
  ],
  q05c: p => [
    evaluate(`(${p.g} + ${p.h})`),
    evaluate(`(${p.g} + ${p.h}) × ${p.r} − ${p.d}`)
  ],
  /* The number printed before ÷ is the product u × q. */
  q05d: p => [
    evaluate(`${p.t} − ${p.u * p.q} ÷ ${p.q} × ${p.r} + ${p.s}`),
    evaluate(`(${p.a} + ${p.b}) × (${p.c} − ${p.e}) − ${p.f} × ${p.g}`)
  ],
});
})();
