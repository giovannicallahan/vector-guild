/* Independent oracles for Abstract algebra learn missions, file a: q01–q10 (game/realms/abstract/missions-a.js).
   ORACLE.<id>(p) returns the answer list for the generator's parameters p, worked out from the prompt by a
   different method from build(): stepping a dial one click at a time, scanning tables, and searching.
   Do not import game files. Parameter names follow the prompts: m = number of positions or modulus. */
(function(){ 'use strict';
/* Step a dial with m positions forward (or back) one position at a time, starting from 0. */
const turn = (m, steps) => { let pos = 0; const dir = steps >= 0 ? 1 : -1; for (let i = 0; i < Math.abs(steps); i++) { pos += dir; if (pos === m) pos = 0; if (pos < 0) pos = m - 1; } return pos; };
const gcd = (x, y) => { while (y) { [x, y] = [y, x % y]; } return x; };
/* Order of g under repeated multiplication mod m, by walking powers until 1 returns. */
const orderMul = (m, g) => { let v = g % m, k = 1; while (v !== 1 % m) { v = (v * g) % m; k++; if (k > 10 * m) return NaN; } return k; };
Object.assign(window.ORACLE, {
  /* m positions; a forward then b forward; a forward then b back. Walk the dial one step at a time. */
  q01: p => { const there = turn(p.m, p.a); return [ (() => { let pos = there; for (let i = 0; i < p.b; i++) { pos++; if (pos === p.m) pos = 0; } return pos; })(), (() => { let pos = there; for (let i = 0; i < p.b; i++) { pos--; if (pos < 0) pos = p.m - 1; } return pos; })() ]; },
  /* m positions; each click moves a steps (b clicks, then a clicks). Click the ratchet one click at a time. */
  q02: p => { const run = n => { let pos = 0; for (let i = 0; i < n; i++) pos = (pos + (p.a % p.m)) % p.m; return pos; }; return [run(p.b), run(p.a)]; },
  /* x*y = (x+y+k) mod m. Build the whole table, then read the two entries (x1,y1) and (x2,y2). */
  q03: p => { const T = []; for (let x = 0; x < p.m; x++) { T.push([]); for (let y = 0; y < p.m; y++) T[x].push((x + y + p.k) % p.m); } return [T[p.x1][p.y1], T[p.x2][p.y2]]; },
  /* x*y = (x+y+k) mod m. Search for e with e*x = x for every x; then search for b with a*b = e. */
  q04: p => { const op = (x, y) => (x + y + p.k) % p.m; let e = -1; for (let c = 0; c < p.m && e < 0; c++) { let ok = true; for (let x = 0; x < p.m; x++) if (op(c, x) !== x || op(x, c) !== x) ok = false; if (ok) e = c; } let b = -1; for (let c = 0; c < p.m && b < 0; c++) if (op(p.a, c) === e) b = c; return [e, b]; },
  /* Settings 1..m-1 multiplied mod m. Test closure over all pairs, find an identity by search, test every inverse. */
  q05: p => { const els = []; for (let i = 1; i < p.m; i++) els.push(i); const mul = (x, y) => (x * y) % p.m; const closed = els.every(x => els.every(y => mul(x, y) !== 0)); const idn = els.find(e => els.every(x => mul(e, x) === x && mul(x, e) === x)); const hasId = idn !== undefined; const inv = hasId && els.every(x => els.some(y => mul(x, y) === idn && mul(y, x) === idn)); return [mul(p.a, p.b), closed ? 1 : 0, hasId ? 1 : 0, inv ? 1 : 0]; },
  /* U(m): count the settings with a partner giving 1 (that is the coprime ones); inverse of a found by search. */
  q06: p => { let n = 0; for (let x = 0; x < p.m; x++) if (Array.from({ length: p.m }, (_, y) => y).some(y => (x * y) % p.m === 1)) n++; let b = -1; for (let y = 0; y < p.m && b < 0; y++) if ((p.a * y) % p.m === 1) b = y; return [n, b]; },
  /* Z_m, jump a lamps per beat. gcd by Euclid; order by walking the pulse round until it is back at lamp 0. */
  q07: p => { let pos = p.a % p.m, k = 1; while (pos !== 0) { pos = (pos + p.a) % p.m; k++; } return [gcd(p.a, p.m), k]; },
  /* U(m), multiplier a. Square and cube by multiplying out; order by walking the powers until 1 returns. */
  q08: p => { const sq = (p.a * p.a) % p.m; const cu = (sq * p.a) % p.m; return [sq, cu, orderMul(p.m, p.a)]; },
  /* Z_m. Light up the lamps of <g> for every g, count those lighting all m lamps; then test a alone. */
  q09: p => { const lights = g => { const seen = new Set(); let pos = 0; for (let i = 0; i < p.m; i++) { seen.add(pos); pos = (pos + g) % p.m; } return seen.size; }; let n = 0; for (let g = 0; g < p.m; g++) if (lights(g) === p.m) n++; return [n, lights(p.a) === p.m ? 1 : 0]; },
  /* U(m), multiplier a, k beats. Walk the powers to get the order, reduce k by repeated subtraction, then walk k mod order powers. */
  q10: p => { const ord = orderMul(p.m, p.a); let r = p.k; while (r >= ord) r -= ord; let v = 1 % p.m; for (let i = 0; i < r; i++) v = (v * p.a) % p.m; return [ord, r, v]; },
});
})();
