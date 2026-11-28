/* Topology: shape without size review-drill statements, file d: q31–q40. Shape: docs/PACK-FORMAT.md §5.
   Each statement uses the same numbers as the matching model in experiments-d.js. Loaded before game/variants.js, which merges these tables. */
(function(){
'use strict';
window.VARIANT_SETUP = window.VARIANT_SETUP || {};
window.VARIANT_POOL = window.VARIANT_POOL || {};
Object.assign(window.VARIANT_SETUP, {
 q31: t => `A dome is part of a sphere of radius 6 metres, so k = 1 ÷ 36. A triangle on it, with sides along great circles, has angles π ÷ 2, π ÷ 2 and ${1 + (t + 10) % 11}π ÷ 12 radians.`,
 q32: t => `A closed orientable surface of genus ${2 + (t + 10) % 9} is given constant curvature k = −1.`,
 q33: t => { const u = t + 10, name = u <= 9 ? (u === 0 ? 'a sphere (orientable, genus 0)' : u === 1 ? 'a torus (orientable, genus 1)' : `an orientable surface of genus ${u}`) : (u === 10 ? 'a projective plane (1 cross-cap)' : u === 11 ? 'a Klein bottle (2 cross-caps)' : `a non-orientable surface with ${u - 9} cross-caps`); return `A hull design is ${name}, to be given one constant curvature k all over.`; },
 q34: t => { const g = 2 + (t + 10) % 7; return `The surface of genus ${g} is made from one regular polygon with ${4 * g} sides, glued so all its corners meet at one point, drawn with curvature k = −1.`; },
 q35: t => { const u = 1 + (t + 10) % 5, v = (t + 10) % 3; return `A drone’s closed loop round a beacon crosses the ray due east from it ${u === 1 ? 'once' : u === 2 ? 'twice' : u + ' times'} anticlockwise and ${v === 0 ? 'never' : v === 1 ? 'once' : 'twice'} clockwise.`; },
 q36: t => `Loop a has winding number ${window.Gen.n(t)} round the beacon and loop b has winding number 3; both start and end at the same point.`,
 q37: t => `A circle map takes the point at angle θ to angle ${window.Gen.n(t === 0 ? 5 : t)}θ. A loop goes round the circle with winding number 3.`,
 q38: t => { const s = 3 + (t + 10) % 10; return `A cable wheel has a hub joined by ${s} spokes to ${s} rim junctions, each rim junction joined to the next round the rim.`; },
 q39: t => `f(x) = (x² + ${[1, 2, 3, 4, 5, 6, 7, 8, 10, 11, 12, 13, 14, 15, 17, 18, 19, 20, 22, 23, 24][t + 10]}) ÷ 10 is continuous and takes [0, 5] into itself.`,
 q40: t => `Sensors A, B and C stand in a row. A loop flies twice anticlockwise round a circle enclosing A and B, then ${window.Gen.n(t)} times round a circle enclosing B only (a negative count means clockwise, 0 means it skips that circuit), then once anticlockwise round a circle enclosing B and C.`,
});
Object.assign(window.VARIANT_POOL, {
 // qNN: [1, 2, 3, 4, 5],   // optional; default −6..6 without 0
});
})();
