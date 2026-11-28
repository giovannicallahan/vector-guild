/* Realm registry: the star map and the realm loader both read this list.
   node      one shape on the star map
   needs     map nodes this one builds on (soft lock: a warning, never a block)
   parts     playable realms inside the node. status 'ready' = a pack exists; 'coming' = not built yet.
             missions = every mission of the full pack, learn and practice (Foundations and Calculus 1: 40 learn +
             120 practice each; linear algebra: 68 learn + 204 practice).
             learn = the learn missions alone, one per concept, where a pack has practice missions as well.
             ach = the part's two achievements (game/collection/achievements.js): <id>-done "Learn every concept in
             <short>." and <id>-master "Solve every mission in <short>, practice included."; done and master are their
             names; doneReward is the stardust for <id>-done when it is not 150. Ids never change once shipped.
   A part with status 'ready' has a pack id; its scripts are listed in VG_PACKS (realms/packs.js).
   A new pack is added by tools/new-pack.js (docs/PACK-SPEC.md), which flips its part to ready; nobody edits this
   file by hand for a pack. */
window.VG_REALMS = [
 {node:'found',name:'Foundations',pos:[0,-1,2],color:'amber',needs:[],
  learn:'Numbers, equations, functions and graphs: the language every other realm speaks.',
  world:'Split a bill, read a chart in the news, work out how long a trip takes.',
  parts:[{id:'found',name:'Foundations',status:'ready',missions:160,learn:40,ach:{short:'Foundations',done:'Solid ground',master:'Bedrock',doneReward:120}}]},
 {node:'alg',name:'Algebra',pos:[-8,2,3],color:'cyan',needs:['found'],
  learn:'Vectors, matrices and the structures behind them.',
  world:'Steer a spacecraft, compress a photo, rank web pages.',
  parts:[{id:'la',name:'Linear algebra',status:'ready',missions:272,learn:68,ach:{short:'Linear algebra',done:'Master of arrows',master:'Full span'}},{id:'abstract',name:'Abstract algebra: patterns of moves',status:'ready',missions:160,learn:40,ach:{short:'Abstract algebra',done:'Closed under composition',master:'Every pattern counted'}}]},
 {node:'calc',name:'Calculus',pos:[7,1,4],color:'violet',needs:['found'],
  learn:'How things change and how change adds up, first along a line and then across surfaces.',
  world:'Find the fastest route, the dose that lasts, the shape that uses least material.',
  parts:[{id:'calc1',name:'Calculus 1: change',status:'ready',missions:160,learn:40,ach:{short:'Calculus 1',done:'Rate of climb',master:'Area under the curve'}},{id:'calc2',name:'Calculus 2: accumulation',status:'ready',missions:160,learn:40,ach:{short:'Calculus 2',done:'Filled to the brim',master:'The sum of everything'}},{id:'calc3',name:'Calculus 3: many variables',status:'ready',missions:160,learn:40,ach:{short:'Calculus 3',done:'Every direction',master:'The whole of space'}}]},
 {node:'stat',name:'Statistics & probability',pos:[2,-7,-4],color:'cyan',needs:['found'],
  learn:'Reasoning under uncertainty: chance, evidence and what a sample can tell you.',
  world:'Judge a medical test, a poll, or whether a result is luck.',
  parts:[{id:'prob',name:'Probability',status:'ready',missions:160,learn:40,ach:{short:'Probability',done:'Weighing the odds',master:'Law of large numbers'}},{id:'stats',name:'Data and inference',status:'ready',missions:160,learn:40,ach:{short:'Data & inference',done:'Beyond reasonable doubt',master:'Significant at every level'}}]},
 {node:'logic',name:'Logic',pos:[-4,7,-5],color:'amber',needs:['found'],
  learn:'What it means for an argument to be valid, and how to prove something for certain.',
  world:'Spot a flawed argument, design a circuit, write a rule a computer can check.',
  parts:[{id:'logic',name:'Logic and proof',status:'ready',missions:160,learn:40,ach:{short:'Logic and proof',done:'Q.E.D.',master:'Every case covered'}}]},
 {node:'disc',name:'Discrete math',pos:[-9,-5,-3],color:'violet',needs:['found'],
  learn:'Counting, arrangements and step-by-step structures: the math of things you can list.',
  world:'Schedule a tournament, count passwords, plan deliveries.',
  parts:[{id:'disc',name:'Discrete mathematics',status:'ready',missions:160,learn:40,ach:{short:'Discrete maths',done:'Every way counted',master:'The whole ledger'}}]},
 {node:'diff',name:'Differential equations',pos:[13,6,-2],color:'amber',needs:['calc','alg'],
  learn:'Equations that describe how something evolves from moment to moment.',
  world:'Predict an outbreak, cool a battery, damp a bridge.',
  parts:[{id:'ode',name:'Differential equations',status:'ready',missions:160,learn:40,ach:{short:'Differential eqs',done:'Ahead of time',master:'Every system steady'}}]},
 {node:'num',name:'Number & graph theory',pos:[-15,-9,2],color:'cyan',needs:['disc'],
  learn:'Primes and divisibility, and networks of points joined by links.',
  world:'Keep a message secret, route the internet, map friendships.',
  parts:[{id:'number',name:'Number theory: the hidden life of whole numbers',status:'ready',missions:160,learn:40,ach:{short:'Number theory',done:'Nothing left over',master:'Unbreakable key'}},{id:'graph',name:'Graph theory: networks',status:'ready',missions:160,learn:40,ach:{short:'Graph theory',done:'Every dome connected',master:'No edge left uncounted'}}]},
 {node:'anal',name:'Real & complex analysis',pos:[5,11,-9],color:'cyan',needs:['calc','logic'],
  learn:'Why calculus works: limits made exact, then extended to complex numbers.',
  world:'Trust a numerical simulation, shape an aerofoil, filter a signal.',
  parts:[{id:'real',name:'Real analysis',status:'ready',missions:160,learn:40,ach:{short:'Real analysis',done:'Within epsilon',master:'Certified to the last digit'}},{id:'complex',name:'Complex analysis: the plane of numbers',status:'ready',missions:160,learn:40,ach:{short:'Complex analysis',done:'Once round the ring',master:'Every residue found'}}]},
 {node:'topo',name:'Topology',pos:[-2,15,-13],color:'violet',needs:['anal'],
  learn:'The properties of a shape that survive stretching and bending.',
  world:'Untangle DNA, find holes in data, plan a robot arm\'s reach.',
  parts:[{id:'topo',name:'Topology: shape without size',status:'ready',missions:160,learn:40,ach:{short:'Topology',done:'Same shape, any size',master:'Every surface named'}}]},
 {node:'phys',name:'Physics',pos:[14,-4,6],color:'warn',needs:['calc'],
  learn:'The laws of motion, energy and fields, written in the math from the other realms.',
  world:'Land a rover, size a solar array, tune an antenna.',
  parts:[{id:'mech',name:'Mechanics: motion and force',status:'ready',missions:160,learn:40,ach:{short:'Mechanics',done:'First principles',master:'Perpetual motion'}},{id:'em',name:'Electricity and magnetism: fields',status:'ready',missions:160,learn:40,ach:{short:'Electromagnetism',done:'Closed circuit',master:'Maxwell\'s heir'}},{id:'waves',name:'Waves: sound and light',status:'ready',missions:160,learn:40,ach:{short:'Sound and light',done:'Perfect pitch',master:'Interference pattern'}}]}
];
