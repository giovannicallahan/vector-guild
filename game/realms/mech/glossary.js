/* Mechanics: motion and force glossary: the words this pack teaches, shown as tap-to-define buttons in its lessons, prompts, hints and
   solutions. game/glossary.js (loaded right after this file) merges them; docs/PACK-SPEC.md, "Glossary".
   required  the words the pack must define: qa/glossary.test.js fails while one is missing
   terms     one row per word: [term, taught, means, example, also?, avoid?]
               term     the word as shown at the top of the definition (keyed in lower case)
               taught   the learn mission that teaches it (q01–q40); once that mission is written, its text must use the word
               means    one plain sentence, 20 to 190 characters, ending with a full stop
               example  one tiny example, 8 to 150 characters
               also     other spellings of the same word (plurals are added automatically)
               avoid    a pattern: where the text around a match fits it, the word has another sense there and is left alone
   Minus signs are − (U+2212). Add the row for a word in the same change as the mission that teaches it, under the
   section of that mission's file. Once all 40 learn missions are written the pack needs at least 40 words. */
(function(){
'use strict';
const P = window.VG_GLOSSARY_PACKS = window.VG_GLOSSARY_PACKS || {};
P['mech'] = {
 required: ['vector', 'component', 'displacement', 'velocity', 'acceleration', 'projectile', 'centripetal', 'force', 'newton', 'friction', 'work', 'kinetic energy', 'momentum', 'torque'],
 terms: [
  /* q01–q10 (missions-a.js) */
  ['SI unit', 'q01', 'A unit of the agreed international system; for mechanics the base ones are the metre, the kilogram and the second.', 'A speed in SI units is in metres per second, m/s.'],
  ['conversion factor', 'q01', 'A fraction whose top and bottom are the same amount in two different units, so it is worth exactly 1.', '1000 m ÷ 1 km turns 3 km into 3000 m.'],
  ['metre', 'q01', 'The SI unit of length, written m.', 'A kilometre is 1000 metres.'],
  ['kilogram', 'q01', 'The SI unit of mass, written kg.', 'A crate of 20 kg has twice the mass of one of 10 kg.'],
  ['metric prefix', 'q02', 'A word in front of a unit that stands for a power of ten, such as milli- (10⁻³), micro- (10⁻⁶), kilo- (10³) or mega- (10⁶).', '1 km is 10³ m and 1 μs is 10⁻⁶ s.', ['prefix']],
  ['power of ten', 'q02', 'A number 10ⁿ: 10 multiplied by itself n times, or 1 divided by such a number when n is negative.', '10³ = 1000 and 10⁻² = 0.01.', ['powers of ten']],
  ['scalar', 'q03', 'A quantity that is just a number with a unit and has no direction.', 'A mass of 3 kg and a time of 5 s are scalars.'],
  ['vector', 'q03', 'A quantity with both a size and a direction, drawn as an arrow.', '40 m towards the north-west is a vector.'],
  ['magnitude', 'q03', 'The size of a vector, never negative; for components Ax and Ay it is √(Ax² + Ay²).', 'The vector 3î + 4ĵ has magnitude 5.'],
  ['component', 'q03', 'How far a vector goes along one axis; for magnitude A at angle θ from the x-axis the components are A cos θ and A sin θ.', '3î − 4ĵ has x component 3 and y component −4.'],
  ['unit vector', 'q03', 'A vector of magnitude 1 that marks a direction; î points along the x-axis and ĵ along the y-axis.', '5î + 2ĵ is 5 steps along î and 2 along ĵ.'],
  ['resultant', 'q04', 'The single vector equal to the sum of several vectors, found by adding their components.', '(3î + ĵ) + (î + 3ĵ) has resultant 4î + 4ĵ.'],
  ['dot product', 'q05', 'The number A · B = AxBx + AyBy, which also equals |A| |B| cos φ for the angle φ between the vectors.', '(î + 2ĵ) · (3î + ĵ) = 3 + 2 = 5.', ['scalar product']],
  ['position', 'q06', 'Where a body is, as a signed distance from a chosen reference point along a chosen positive direction.', 'x = −8 m is 8 m from the marker on the negative side.'],
  ['displacement', 'q06', 'The change in position, final position minus starting position; it has a sign and ignores the path in between.', 'From x = 12 m to x = −8 m is a displacement of −20 m.'],
  ['distance', 'q06', 'The total length of path travelled, adding every leg as a positive amount.', 'Up 10 m and back 6 m is a distance of 16 m.'],
  ['velocity', 'q06', 'The rate of change of position, in metres per second; its sign gives the direction of motion.', 'A sled sliding downhill at 5 m/s has velocity −5 m/s if uphill is positive.'],
  ['average velocity', 'q06', 'The displacement divided by the time it took, Δx ÷ Δt.', 'A displacement of 20 m in 4 s is an average velocity of 5 m/s.'],
  ['instantaneous velocity', 'q07', 'The velocity at one instant: the derivative of position, v(t) = dx/dt.', 'For x(t) = 2t² + 5t, the velocity at t = 2 is 13 m/s.'],
  ['speed', 'q07', 'The size of the velocity, with its sign dropped, so it is never negative.', 'A velocity of −5 m/s is a speed of 5 m/s.'],
  ['acceleration', 'q08', 'The rate of change of velocity, a = dv/dt, in metres per second squared (m/s²).', 'Going from 4 m/s to 25 m/s in 3 s is an average acceleration of 7 m/s².'],
  ['average acceleration', 'q08', 'The change in velocity divided by the time it took, Δv ÷ Δt.', 'Losing 12 m/s in 4 s is an average acceleration of −3 m/s².'],
  ['deceleration', 'q09', 'An acceleration against the direction of motion, which slows a body down.', 'A deceleration of 3 m/s² on a sled moving forwards is an acceleration of −3 m/s².'],
  ['kinematic equations', 'q09', 'The equations v = v₀ + at, x = x₀ + v₀t + ½at² and v² = v₀² + 2a(x − x₀) for motion with constant acceleration.', 'From 12 m/s at −3 m/s², a sled stops in 4 s.', ['kinematic equation']],
  ['free fall', 'q10', 'Motion under gravity alone, with air resistance ignored: a constant downward acceleration g = 9.8 m/s² near the ground.', 'A pod thrown up at 19.6 m/s reaches its top after 2 s.'],
  /* q11–q20 (missions-b.js) */
  ['projectile', 'q12', 'An object that, once thrown or fired, moves under gravity alone, with the air ignored.', 'A pod fired sideways off a ledge is a projectile: it glides sideways and falls at the same time.'],
  ['range', 'q13', 'The distance along level ground from where a projectile is launched to where it lands.', 'Thrown at 15 m/s, 1 radian up, a pod has a range of 225 × sin 2 ÷ 9.8 ≈ 20.88 m.', [], 'in the range|range of|ranges? from'],
  ['period', 'q14', 'The time a repeating motion takes to go through one full cycle, such as one turn of a circle.', 'A sling arm that turns once every 4 s has a period of 4 s.'],
  ['centripetal', 'q14', 'Pointing towards the centre of a circle; a body moving on a circle has a centripetal acceleration of size v² ÷ r.', 'At 6 m/s on a circle of radius 9 m the centripetal acceleration is 36 ÷ 9 = 4 m/s².'],
  ['tangential acceleration', 'q15', 'The part of the acceleration that points along the path of a body on a curve: the rate at which its speed changes.', 'A pod on a sling gaining 3 m/s of speed every second has a tangential acceleration of 3 m/s².'],
  ['frame of reference', 'q16', 'The body or place that positions and velocities are measured against, such as the ground or a moving rover.', 'A wind vane on a moving rover measures the wind in the rover’s frame of reference.', ['reference frame']],
  ['relative velocity', 'q16', 'The velocity of one body as measured from another body, which may itself be moving.', 'A rover driving east at 5 m/s on a still day feels a wind of 5 m/s from the east.'],
  ['force', 'q18', 'A push or a pull on a body, with a size and a direction, so it is a vector; it is measured in newtons.', 'A winch rope pulling a sled east with 12 N is a force of 12 N east.'],
  ['newton', 'q18', 'The unit of force: the force that gives 1 kg an acceleration of 1 m/s², so 1 N = 1 kg·m/s².', 'A net force of 10 N on a 4 kg sled gives it 10 ÷ 4 = 2.5 m/s².', [], 'Newton[’\']s'],
  ['net force', 'q18', 'The vector sum of all the forces acting on a body, written ΣF.', 'Pulls of (5, 1) N and (−2, 3) N add to a net force of (3, 4) N.'],
  ['mass', 'q18', 'How much matter a body has, measured in kilograms; the more mass, the harder the body is to speed up or slow down.', 'A 4 kg sled needs 4 N of net force for each 1 m/s² of acceleration.'],
  ['Newton’s second law', 'q18', 'The net force on a body equals its mass times its acceleration: ΣF = ma.', 'A 2 kg sled with a net force of 5 N accelerates at 5 ÷ 2 = 2.5 m/s².', ['Newton\'s second law', 'second law']],
  ['weight', 'q19', 'The force of gravity on a body, w = mg, pointing down; with g = 9.8 m/s², each kilogram weighs 9.8 N.', 'A 60 kg crate weighs 60 × 9.8 = 588 N.'],
  ['normal force', 'q19', 'The push a surface gives a body resting on it, at a right angle to the surface; it is as large as it must be.', 'A floor holding a 50 kg crate still pushes up with a normal force of 490 N.'],
  ['free-body diagram', 'q19', 'A sketch of one body alone, with an arrow for every force that acts on it.', 'A crate in a lift: one arrow F_N up and one arrow mg down.', ['free body diagram']],
  ['tension', 'q20', 'The pull a stretched rope or cable gives, along its length, on whatever is tied to each end.', 'A cable holding a 20 kg crate still has a tension of 20 × 9.8 = 196 N.'],
  ['Newton’s third law', 'q20', 'When one body pushes or pulls on a second, the second pushes or pulls back on the first with a force of the same size in the opposite direction.', 'A cable pulls a crate up with 110 N, and the crate pulls the cable down with 110 N.', ['Newton\'s third law', 'third law']],
  /* q21–q30 (missions-c.js) */
  ['inclined plane', 'q21', 'A flat surface tilted at an angle to the horizontal, such as a ramp; weight splits into a part along it and a part into it.', 'On a ramp at θ, a weight w pulls w sin θ along it.', ['ramp angle']],
  ['friction', 'q22', 'The force a surface exerts along itself on a body touching it, against sliding or the start of sliding.', 'Friction stops a crate sliding down a gentle ramp.'],
  ['static friction', 'q22', 'Friction on a body that is not sliding; it matches the push trying to slide the body, up to μs N.', 'A crate pushed with 30 N that does not move feels 30 N of static friction.'],
  ['kinetic friction', 'q22', 'Friction on a body that is sliding; its size is μk N, whatever the speed.', 'With μk = 0.3 and N = 200 N, kinetic friction is 60 N.'],
  ['coefficient of friction', 'q22', 'A plain number, μs for static and μk for kinetic friction, that times the normal force gives the friction force.', 'Steel on steel might have μs = 0.6 and μk = 0.4.', ['coefficient of static friction', 'coefficient of kinetic friction']],
  ['centripetal force', 'q24', 'The net force towards the centre that keeps a body on a circle, of size mv² ÷ r; tension or friction can supply it.', 'A 2 kg ball at 3 m/s on a 1 m circle needs 18 N.'],
  ['drag', 'q25', 'The force air or water exerts on a body moving through it, pointing against the motion and growing with speed.', 'With D = bv², doubling the speed makes the drag four times as large.', [], 'drags? (on|a|it|the)\\b|brake'],
  ['terminal speed', 'q25', 'The steady speed a falling body reaches when drag has grown to equal its weight, so it stops speeding up.', 'With D = 0.25v² and weight 100 N, v = √400 = 20 m/s.'],
  ['work', 'q26', 'What a force does in moving a body: the part of the force along the motion times the distance moved, W = Fd cos θ.', 'A 10 N push through 3 m along it does 30 J of work.', [], '\\bwork(s|ing)? (out|through|with)\\b'],
  ['joule', 'q26', 'The SI unit of work and energy, written J: one newton acting through one metre.', '5 N pushing a box 2 m does 10 J.'],
  ['kinetic energy', 'q27', 'The energy a body has because it is moving, K = ½mv².', 'A 2 kg cart at 3 m/s has ½ × 2 × 9 = 9 J.'],
  ['work-energy theorem', 'q27', 'The rule that the net work done on a body equals the change in its kinetic energy.', 'If 50 J of net work is done on a cart with 20 J, it ends with 70 J.'],
  ['power', 'q28', 'The rate of doing work, P = W ÷ t, or P = Fv for a force on a moving body.', '600 J of work done in 3 s is 200 W of power.', [], 'powers? of ten|to the power|power of'],
  ['watt', 'q28', 'The SI unit of power, written W: one joule of work each second.', 'A 2 kW winch does 2000 J of work each second.', ['kilowatt']],
  ['potential energy', 'q30', 'Energy stored by where a body is, such as mgy for height or ½kx² for a squeezed spring.', 'A 10 kg box 2 m up has 10 × 9.8 × 2 = 196 J above the floor.'],
  ['spring constant', 'q30', 'The stiffness k of a spring: the force in newtons for each metre it is squeezed or stretched.', 'A spring with k = 500 N/m squeezed 0.1 m pushes back with 50 N.'],
  /* q31–q40 (missions-d.js) */
  ['mechanical energy', 'q31', 'The kinetic energy plus the potential energy of a body or system, which stays the same while only conservative forces do work.', 'A sled with K = 200 J and U = 300 J has 500 J of mechanical energy.', []],
  ['conservative force', 'q31', 'A force, such as gravity or a spring, that stores the energy it takes and gives all of it back, so it keeps mechanical energy the same.', 'Gravity is conservative; friction is not.', []],
  ['momentum', 'q32', 'Mass times velocity, p = mv, measured in kg·m/s; it has the direction of the velocity.', 'A 100 kg module at 3 m/s has momentum 300 kg·m/s.', []],
  ['impulse', 'q32', 'A force times the time it acts, in newton seconds (N·s); it equals the change in momentum it causes.', 'A 50 N push for 0.2 s gives an impulse of 10 N·s.', []],
  ['elastic collision', 'q33', 'A collision in which the bodies bounce apart and the total kinetic energy is the same afterwards as before.', 'Two hard steel balls bouncing off each other collide almost elastically.', []],
  ['inelastic collision', 'q33', 'A collision in which some kinetic energy turns into heat, sound or bent metal; when the bodies stick together the loss is the largest.', 'Two modules that latch together have a perfectly inelastic collision.', ['perfectly inelastic']],
  ['centre of mass', 'q34', 'The point that stands for a whole group of masses: the mass-weighted average of their positions.', '2 kg at x = 0 and 6 kg at x = 4: the centre of mass is at x = 3.', ['centres of mass']],
  ['angular position', 'q35', 'The angle, in radians, that a turning body has turned through from a chosen starting line.', 'After half a turn the angular position has changed by π radians.', []],
  ['angular velocity', 'q35', 'How fast the angle of a turning body changes, ω = dθ/dt, in radians per second.', '60 rpm is an angular velocity of 2π ≈ 6.28 rad/s.', []],
  ['rpm', 'q35', 'Revolutions per minute: the number of full turns a wheel makes in one minute.', '120 rpm is 2 turns each second.', []],
  ['moment of inertia', 'q36', 'How hard a body is to start or stop spinning about an axis: for point masses, I = Σmr², in kg·m².', '2 kg at 0.5 m from the axle: I = 2 × 0.25 = 0.5 kg·m².', ['moments of inertia']],
  ['rotational kinetic energy', 'q36', 'The energy a body has because it spins: ½Iω², in joules.', 'I = 2 kg·m² at 3 rad/s holds ½ × 2 × 9 = 9 J.', []],
  ['torque', 'q37', 'The turning effect of a force about an axis, τ = rF sin θ, in newton metres (N·m).', '20 N at right angles, 0.5 m from the axle: τ = 10 N·m.', []],
  ['lever arm', 'q37', 'The shortest distance from the axis to the line along which a force acts, r sin θ.', 'A pull at right angles to a 0.4 m spanner has a lever arm of 0.4 m.', []],
  ['angular acceleration', 'q37', 'How fast the angular velocity changes, α = dω/dt, in radians per second squared.', 'Going from 0 to 10 rad/s in 5 s is an angular acceleration of 2 rad/s².', []],
  ['angular momentum', 'q38', 'The turning partner of momentum, L = Iω, in kg·m²/s; it stays the same when no outside torque acts.', 'I = 4 kg·m² at 5 rad/s: L = 20 kg·m²/s.', []],
  ['gravitational constant', 'q39', 'The number G = 6.67 × 10⁻¹¹ N·m²/kg² in Newton’s law of gravitation, F = Gm₁m₂ ÷ r².', 'Two 1 kg masses 1 m apart pull with a force of G newtons.', []],
  ['orbit', 'q39', 'The path of a body that keeps falling around a planet while moving sideways fast enough never to reach it.', 'A satellite in a circular orbit stays the same height above the ground.', []],
  ['orbital speed', 'q39', 'The speed needed to stay on a circular orbit of radius r: v = √(GM ÷ r), with r measured from the planet’s centre.', 'GM = 4 × 10¹⁴ m³/s² and r = 16000 km give 5000 m/s.', []],
 ]
};
})();
