/* Probability review-drill statements, file c: q21–q30. Shape: docs/PACK-FORMAT.md §5.
   Each statement uses the same numbers as the matching model in experiments-c.js. Loaded before game/variants.js, which merges these tables. */
(function(){
'use strict';
const n = x => window.Gen.n(x);
const rd = (x, dp) => Math.round(x * Math.pow(10, dp)) / Math.pow(10, dp);
const f6 = x => String(rd(x, 6));
window.VARIANT_SETUP = window.VARIANT_SETUP || {};
window.VARIANT_POOL = window.VARIANT_POOL || {};
Object.assign(window.VARIANT_SETUP, {
 q21: t => `A greenhouse tray holds ${t + 15} seeds, and each sprouts with probability 0.2, whatever the others do.`,
 q22: t => `Seeds sprout with probability 0.25 each, and Mira plants them one at a time until the first one sprouts. Look at seed number ${1 + (t + 10) % 8}.`,
 q23: t => `A row of ${2 + (t + 10) % 6} seeds is planted, and each sprouts with probability 0.3, whatever the others do.`,
 q24: t => { const k = (t + 10) % 6; return `Meteor pings arrive at random, at an average of 2 a minute; e^(−2) = 0.135335. Look at exactly ${k} ${k === 1 ? 'ping' : 'pings'} in one minute.`; },
 q25: t => `A relay signal arrives at a time spread evenly from 0 to 20 minutes past the hour. Look at the stretch from 2 to ${3 + (t + 10) % 17} minutes past the hour.`,
 q26: t => `A beacon checks in at a time spread evenly from 10 to 30 minutes after midnight. Look at the ${5 + 5 * ((t + 10) % 19)}th percentile of the check-in time.`,
 q27: t => { const x = t + 12, v = rd(0.1 * x, 4); return `A valve’s lifetime is exponential with decay rate m = 0.1 per hour, and e^(−${n(v)}) = ${f6(Math.exp(-v))}. Look at a new valve failing within ${x} hours.`; },
 q28: t => { const b = 2 + (t + 10) % 10, v = rd(0.2 * b, 4); return `A battery’s life is exponential with decay rate m = 0.2 per hour, and it has already run 5 hours without failing; e^(−${n(v)}) = ${f6(Math.exp(-v))}. Look at it lasting another ${b} hours.`; },
 q29: t => { const kind = 1 + (t + 10) % 3, idx = Math.floor((t + 10) / 3);
  if (kind === 1) { const k = 1 + idx % 5; return `Models: 1 Poisson, 2 uniform, 3 exponential. Static crackles arrive at random, at an average of 3 a minute; e^(−3) = 0.049787. Find the chance of exactly ${k} ${k === 1 ? 'crackle' : 'crackles'} in one minute.`; }
  if (kind === 2) return `Models: 1 Poisson, 2 uniform, 3 exponential. A courier calls at a time equally likely anywhere from 0 to 40 minutes past nine. Find the chance that the call comes between 4 and ${10 + 4 * idx} minutes past nine.`;
  const x = 3 + 2 * idx, v = rd(0.1 * x, 4); return `Models: 1 Poisson, 2 uniform, 3 exponential. A headset battery runs flat at random with decay rate m = 0.1 per hour; e^(−${n(v)}) = ${f6(Math.exp(-v))}. Find the chance that it runs flat within ${x} hours.`; },
 q30: t => { const P = []; for (let i = -3; i < 3; i++) for (let j = i + 1; j <= 3; j++) P.push([i, j]); const [i, j] = P[(t + 10) % 21];
  return `Bolt lengths are normal with mean 50 mm and standard deviation 2 mm. Look at the bolts between ${50 + 2 * i} mm and ${50 + 2 * j} mm long.`; },
});
Object.assign(window.VARIANT_POOL, {
 // qNN: [1, 2, 3, 4, 5],   // optional; default −6..6 without 0
});
})();
