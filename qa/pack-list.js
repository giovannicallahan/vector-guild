/* Which realm packs the checks cover, read from the game's own data, so a pack added by tools/new-pack.js is covered
   by every check without a line changed here or in a test (docs/PACK-SPEC.md, "Adding a pack").
   Not a test: the tests and tools require it.
     ids()            every pack in game/realms/packs.js (VG_PACKS): first the ready parts of the star-map registry
                      (game/realms/registry.js) in registry order (found, la, calc1, ...), then any pack the registry
                      does not list, in VG_PACKS order
     readyParts()     the registry's ready parts, in registry order, as plain objects
     BASE             the three packs of MathCosmos 2.5. The star-map tests (qa/home.test.js, qa/shell.test.js) pin
                      down their own behaviour on a registry in which only these are ready: baseRegistry()
     baseRegistry()   a copy of the registry with every part outside BASE shown as 'coming' (no counts), and without
                      any part the 2.5 registry did not have
     written(H)       for a pack loaded by qa/harness.js (its exports H): are all its declared learn missions written?
   A pack that is still filling up is covered by qa/harness.js and qa/generators.js from its first file on; the
   page-level suites that need whole chapters (skip-ahead, the realm collection, the daily review) cover it once all
   its learn missions are written, and print a NOTE until then. */
'use strict';
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const game = path.resolve(__dirname, '../game');
const BASE = Object.freeze(['found', 'la', 'calc1']);
const plain = x => JSON.parse(JSON.stringify(x));
function data() {
  const w = {};
  vm.runInNewContext(fs.readFileSync(path.join(game, 'realms/packs.js'), 'utf8'), { window: w });
  vm.runInNewContext(fs.readFileSync(path.join(game, 'realms/registry.js'), 'utf8'), { window: w });
  return { packs: w.VG_PACKS, realms: plain(w.VG_REALMS) };
}
function readyParts() {
  const out = [];
  for (const node of data().realms) for (const p of node.parts || []) if (p && p.status === 'ready' && p.id) out.push(Object.assign({ node: node.node }, p));
  return out;
}
function ids() {
  const { packs } = data(), own = id => Object.prototype.hasOwnProperty.call(packs, id);
  const fromRegistry = readyParts().map(p => p.id).filter(own);
  return fromRegistry.concat(Object.keys(packs).filter(id => !fromRegistry.includes(id)));
}
/* The parts the 2.5 registry had, ready or coming, with their 2.5 names. A part added since is left out of
   baseRegistry(), and a part made ready since is shown as it was: coming, under its 2.5 name. */
const BASE_PARTS = Object.freeze({ found: 'Foundations', la: 'Linear algebra', abstract: 'Abstract algebra', calc1: 'Calculus 1: change', calc2: 'Calculus 2: accumulation', calc3: 'Calculus 3: many variables', prob: 'Probability', stats: 'Data and inference', logic: 'Logic and proof', disc: 'Discrete mathematics', ode: 'Differential equations', number: 'Number theory', graph: 'Graph theory', real: 'Real analysis', complex: 'Complex analysis', topo: 'Topology', mech: 'Mechanics', em: 'Electricity and magnetism', waves: 'Waves' });
const has = (o, k) => Object.prototype.hasOwnProperty.call(o, k);
function baseRegistry() {
  return data().realms.map(node => Object.assign({}, node, { parts: (node.parts || []).filter(p => has(BASE_PARTS, p.id)).map(p => BASE.includes(p.id) ? p : { id: p.id, name: BASE_PARTS[p.id], status: 'coming' }) }));
}
const written = H => !(H.missing || []).length;
module.exports = { BASE, ids, readyParts, baseRegistry, written };
