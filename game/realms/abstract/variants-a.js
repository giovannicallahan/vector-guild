/* Abstract algebra: patterns of moves review-drill statements, file a: q01–q10. Shape: docs/PACK-FORMAT.md §5.
   Each statement uses the same numbers as the matching model in experiments-a.js. Loaded before game/variants.js, which merges these tables. */
(function(){
'use strict';
window.VARIANT_SETUP = window.VARIANT_SETUP || {};
window.VARIANT_POOL = window.VARIANT_POOL || {};
Object.assign(window.VARIANT_SETUP, {
 q01: t => `A 12-position dial, numbered 0 to 11, starts at 0. It turns 9 steps forward, then ${t + 11} more steps forward.`,
 q02: t => `A ratchet moves an 11-position dial, numbered 0 to 10, 7 steps forward per click. Starting from 0, it makes ${t + 11} clicks.`,
 q03: t => `The operation x ∗ y = (x + y + 3) mod 7 acts on the settings 0 to 6. Look at row 5, column ${(t + 10) % 7} of its operation table.`,
 q04: t => `The operation x ∗ y = (x + y + 4) mod 9 acts on the settings 0 to 8, and its identity element is 5. Take the setting ${(t + 10) % 9}.`,
 q05: t => { const m = 4 + (t + 10) % 17; return `A dial's settings are 1 to ${m - 1}, combined by multiplying mod ${m}; 0 is not a setting.`; },
 q06: t => `U(n) is the set of numbers from 1 to n − 1 coprime to n, multiplied mod n. Take n = ${t + 20}.`,
 q07: t => `A pulse starts at lamp 0 of a ring of 24 lamps, numbered 0 to 23, and jumps ${t + 11} lamps per beat.`,
 q08: t => `A beacon's code is multiplied by ${2 + (t + 10) % 11}, mod 13, on every beat. Work in U(13).`,
 q09: t => `Z_n is the numbers 0 to n − 1 added mod n, and g generates it when the multiples of g reach every element. Take n = ${t + 18}.`,
 q10: t => `A beacon multiplies its code by 3, mod 11, on every beat. Take k = ${410 + t} beats.`,
});
Object.assign(window.VARIANT_POOL, {
 // qNN: [1, 2, 3, 4, 5],   // optional; default −6..6 without 0
});
})();
