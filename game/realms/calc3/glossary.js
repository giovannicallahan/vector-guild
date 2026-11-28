/* Calculus 3: many variables glossary: the words this pack teaches, shown as tap-to-define buttons in its lessons, prompts, hints and
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
P['calc3'] = {
 required: ['vector', 'magnitude', 'dot product', 'cross product', 'normal vector', 'partial derivative', 'gradient', 'directional derivative', 'saddle point', 'double integral', 'Jacobian', 'vector field', 'line integral', 'flux'],
 terms: [
  /* q01–q10 (missions-a.js) */
  ['coordinate', 'q01', 'One of the three numbers (x, y, z) that fix a point in space: how far east, north and up it is from the origin.', '(2, −1, 3) has x coordinate 2, y coordinate −1 and z coordinate 3.'],
  ['origin', 'q01', 'The starting point from which all coordinates are measured, the point (0, 0, 0).', 'The deck’s corner post is the origin of the survey.'],
  ['vector', 'q02', 'A quantity with a size and a direction, drawn as an arrow and written by its components.', '⟨4, −1, 2⟩ means 4 east, 1 south and 2 up.'],
  ['component', 'q02', 'One of the numbers in a vector: its amount along one axis.', 'The z component of ⟨4, −1, 2⟩ is 2.'],
  ['scalar', 'q02', 'A plain number, as opposed to a vector; multiplying a vector by a scalar stretches it, and a negative one also turns it round.', '3⟨1, 0, −2⟩ = ⟨3, 0, −6⟩.'],
  ['magnitude', 'q03', 'The length of a vector, written ‖v‖: the square root of the sum of its squared components.', '‖⟨2, 3, 6⟩‖ = √49 = 7.'],
  ['unit vector', 'q03', 'A vector of magnitude 1; dividing a vector by its magnitude gives the unit vector in its direction.', 'The unit vector along ⟨2, 3, 6⟩ is ⟨2/7, 3/7, 6/7⟩.'],
  ['dot product', 'q04', 'The number u · v found by multiplying matching components and adding; it equals ‖u‖ ‖v‖ cos θ.', '⟨1, 2, 2⟩ · ⟨6, −3, 2⟩ = 6 − 6 + 4 = 4.'],
  ['orthogonal', 'q04', 'At right angles to each other; two vectors are orthogonal when their dot product is 0.', '⟨1, 1, 0⟩ and ⟨1, −1, 5⟩ are orthogonal: 1 − 1 + 0 = 0.'],
  ['scalar projection', 'q05', 'The part of one vector that lies along another: F · d ÷ ‖d‖.', 'F = ⟨6, 1, 1⟩ onto d = ⟨2, 1, 2⟩: 15 ÷ 3 = 5.'],
  ['work', 'q05', 'The energy a force spends moving something: for a constant force F and a displacement d it is F · d, in joules.', 'F = ⟨6, 1, 1⟩ N along d = ⟨2, 1, 2⟩ m does 15 J of work.', [], 'work out|worked|works|working|work it|work in|work along|work them'],
  ['cross product', 'q06', 'The vector u × v at right angles to both u and v, whose length is the area of the parallelogram they span.', '⟨2, 2, 1⟩ × ⟨1, −2, 2⟩ = ⟨6, −3, −6⟩.'],
  ['torque', 'q06', 'The turning effect of a force F applied at the end of a lever arm r: the cross product r × F.', 'A longer spanner gives more torque for the same push.'],
  ['parametric equations', 'q07', 'Equations that give each coordinate of a point in terms of one extra number, the parameter.', 'x = 1 + 2t, y = −t, z = 5 − t is a line.'],
  ['direction vector', 'q07', 'The vector a line moves along: each step of 1 in the parameter moves the point by this vector.', 'The line x = 1 + 2t, y = −t, z = 5 has direction vector ⟨2, −1, 0⟩.'],
  ['normal vector', 'q08', 'A vector at right angles to a plane; its components are the coefficients a, b, c in ax + by + cz = d.', 'The plane 3x − 6y + 4z = 11 has normal vector ⟨3, −6, 4⟩.'],
  ['absolute value', 'q09', 'The size of a number without its sign, written with bars.', '|−9| = 9 and |9| = 9.'],
  ['vector-valued function', 'q10', 'A rule that gives a vector for each value of t, such as a position r(t) at each time.', 'r(t) = ⟨t², 2t, 1⟩ gives ⟨4, 4, 1⟩ at t = 2.'],
  ['velocity', 'q10', 'The derivative of the position vector, r′(t): it points the way the object moves.', 'r(t) = ⟨t², 3t, 0⟩ has velocity ⟨2t, 3, 0⟩.'],
  ['speed', 'q10', 'How fast something moves: the magnitude of its velocity, a number with no direction.', 'Velocity ⟨3, 4, 0⟩ m/s means a speed of 5 m/s.'],
  ['acceleration', 'q10', 'The derivative of the velocity, a(t) = v′(t) = r″(t): how the velocity is changing.', 'v(t) = ⟨2t, 3, 0⟩ gives acceleration ⟨2, 0, 0⟩.'],
  /* q11–q20 (missions-b.js) */
  ['function of two variables', 'q12', 'A rule that takes two input numbers, such as map coordinates x and y, and gives back one number.', 'h(x, y) = 50 − x² − y² gives the height 45 at (1, 2).', ['functions of two variables']],
  ['level curve', 'q12', 'The curve of all points (x, y) where a function of two variables takes one fixed value c: the curve f(x, y) = c.', 'For h = x² + y², the level curve h = 25 is a circle of radius 5.', ['contour line']],
  ['contour map', 'q12', 'A map that shows several level curves of one function, usually for evenly spaced values; close lines mean steep ground.', 'Lines at heights 10, 20 and 30 m drawn on one map of a hill.'],
  ['limit along a path', 'q13', 'The value a function of two variables approaches as the point moves towards a target along one chosen path.', 'Along y = x, 10xy ÷ (x² + y²) is always 5, so its limit along that path is 5.', ['limits along paths']],
  ['partial derivative', 'q14', 'The rate of change of a function of several variables when only one variable changes and the others are held fixed.', 'For h = x²y, ∂h/∂x = 2xy and ∂h/∂y = x².'],
  ['second partial derivative', 'q15', 'A partial derivative of a partial derivative, such as h_xx, which says how the slope in one direction itself changes.', 'For h = x³y, h_x = 3x²y and h_xx = 6xy.'],
  ['mixed partial derivative', 'q15', 'A second partial derivative taken with respect to two different variables, such as h_xy; for smooth functions h_xy = h_yx.', 'For h = x²y³, h_xy = 6xy² and h_yx = 6xy² too.', ['mixed partial']],
  ['tangent plane', 'q16', 'The plane that touches a surface z = f(x, y) at one point and has the same two slopes there as the surface.', 'For z = x² + y² at (1, 1, 2): z = 2 + 2(x − 1) + 2(y − 1).'],
  ['linear approximation', 'q16', 'An estimate of a function near a point from its tangent plane: f(a, b) + f_x × Δx + f_y × Δy.', 'f(1, 2) = 45, f_x = −2, f_y = −4: f(1.1, 2.1) ≈ 45 − 0.2 − 0.4 = 44.4.'],
  ['multivariable chain rule', 'q18', 'The rate of change of f(x(t), y(t)): add ∂f/∂x × dx/dt and ∂f/∂y × dy/dt.', 'T = xy, x = t², y = 3t: dT/dt = y × 2t + x × 3.'],
  ['gradient', 'q19', 'The vector of a function’s partial derivatives, ∇f = ⟨∂f/∂x, ∂f/∂y⟩; it points the way the function increases fastest.', 'For f = x² + y², ∇f = ⟨2x, 2y⟩, which is ⟨2, 4⟩ at (1, 2).'],
  ['directional derivative', 'q19', 'The rate of change of a function in the direction of a unit vector u, found as the dot product ∇f · u.', '∇f = ⟨2, 4⟩ and u = ⟨0.6, 0.8⟩ give 1.2 + 3.2 = 4.4.', ['directional derivatives']],
  ['steepest ascent', 'q20', 'The direction in which a function increases fastest: the direction of its gradient, with rate equal to the gradient’s magnitude.', '∇f = ⟨6, 8⟩: the steepest ascent has rate 10.'],
  /* q21–q30 (missions-c.js) */
  ['critical point', 'q21', 'A point where both partial derivatives of f(x, y) are 0 (or one does not exist); highs, lows and saddle points happen there.', 'f(x, y) = x² + y² − 2x has f_x = 2x − 2 and f_y = 2y, so (1, 0) is a critical point.'],
  ['saddle point', 'q21', 'A critical point that is neither a local maximum nor a local minimum: the surface rises one way and falls another, like a mountain pass.', 'f(x, y) = x² − y² has a saddle point at (0, 0).'],
  ['local maximum', 'q21', 'A point where a function is at least as large as at every point near it.', 'f(x, y) = 5 − x² − y² has a local maximum of 5 at (0, 0).', ['local maxima']],
  ['local minimum', 'q21', 'A point where a function is no larger than at every point near it.', 'f(x, y) = x² + y² has a local minimum of 0 at (0, 0).', ['local minima']],
  ['discriminant', 'q21', 'The number D = f_xx f_yy − (f_xy)² at a critical point; its sign, with the sign of f_xx, says what kind of point it is.', 'For f = x² + 3y², D = 2 × 6 − 0² = 12.'],
  ['second derivative test', 'q21', 'A test that sorts a critical point by D: negative means a saddle point; positive means a minimum if f_xx > 0 and a maximum if f_xx < 0.', 'D = 12 with f_xx = 2 gives a local minimum.'],
  ['constraint', 'q22', 'A rule, written g(x, y) = k, that the inputs must obey, such as staying on a circle.', 'x² + y² = 25 keeps the point on the circle of radius 5.'],
  ['Lagrange multiplier', 'q22', 'The number λ with ∇f = λ∇g at a point where f is largest or smallest on the constraint g(x, y) = k.', 'For f = x + y on x² + y² = 8: 1 = 2λx and 1 = 2λy give λ = 1/4 at (2, 2).'],
  ['double integral', 'q24', 'The integral ∬ f dA of a function over a region of the plane; for a positive height it is the volume under the surface.', 'The double integral of 3 over a 2 by 4 rectangle is 3 × 8 = 24.'],
  ['iterated integral', 'q24', 'One ordinary integral inside another: integrate in one variable with the other held fixed, then integrate the result.', 'Integrating xy in x from 0 to 2 gives 2y; integrating 2y in y from 0 to 1 gives 1.'],
  ['Fubini’s theorem', 'q24', 'Over a rectangle, a double integral can be worked as an iterated integral in either order, with the same result.', 'x first then y, or y first then x: both give the same volume.', ['Fubini']],
  ['average value', 'q24', 'The double integral of a function over a region divided by the area of the region.', 'A volume of 64 over a floor of 8 square metres is an average height of 8 m.'],
  ['type I region', 'q25', 'A region between two upright lines x = a and x = b, where for each x the values of y run from a lower curve to an upper curve.', '0 ≤ x ≤ 2 with 0 ≤ y ≤ x² is a type I region.'],
  ['type II region', 'q25', 'A region between two level lines y = c and y = d, where for each y the values of x run from a left curve to a right curve.', '0 ≤ y ≤ 4 with √y ≤ x ≤ 2 is a type II region.'],
  ['polar coordinates', 'q26', 'A point’s distance r from the centre and its angle θ from the positive x-axis, with x = r cos θ and y = r sin θ.', 'The point (0, 2) has r = 2 and θ = π/2.'],
  ['triple integral', 'q27', 'The integral ∭ f dV of a function over a solid; with f = 1 it is the volume, with a density it is the mass.', 'The triple integral of 1 over a 2 by 3 by 1 box is 6.'],
  ['cylindrical coordinates', 'q28', 'Polar coordinates in the floor plus the height: (r, θ, z), with dV = r dz dr dθ.', 'A cylinder of radius 2 and height 5 is 0 ≤ r ≤ 2, 0 ≤ z ≤ 5.'],
  ['spherical coordinates', 'q28', 'A point’s distance ρ from the origin, its angle θ round the z-axis and its angle φ down from the z-axis, with dV = ρ² sin φ dρ dφ dθ.', 'The ball of radius 3 is 0 ≤ ρ ≤ 3, 0 ≤ φ ≤ π, 0 ≤ θ ≤ 2π.'],
  ['change of variables', 'q30', 'Rewriting an integral in new variables u and v that make the region simpler, with the Jacobian as the area factor.', 'u = x + y and v = x − y turn a tilted square into an upright one.'],
  ['Jacobian', 'q30', 'The determinant J = ∂(x, y)/∂(u, v) of the partial derivatives; its size |J| is how much area each du dv stands for.', 'For u = x + 2y, v = x: ∂(u, v)/∂(x, y) = 1 × 0 − 2 × 1 = −2, so J = −1/2.'],
  /* q31–q40 (missions-d.js) */
  ['vector field', 'q31', 'A rule that gives an arrow, a vector, at every point of the plane or of space.', 'F(x, y) = ⟨−y, x⟩ gives the arrow ⟨−2, 1⟩ at the point (1, 2).'],
  ['line integral', 'q31', 'An integral that adds up a quantity along a curve, such as density along a cable or force along a path.', 'A cable’s mass is the line integral of its density along it.'],
  ['force field', 'q32', 'A vector field whose arrow at each point is the force an object would feel there.', 'A winch’s pull F(x, y) = ⟨y, 2x⟩ newtons is a force field.'],
  ['conservative field', 'q33', 'A vector field that is the gradient of a function, so the work it does depends only on where a path starts and ends.', '⟨2x, 2y⟩ is the gradient of x² + y², so it is a conservative field.', ['conservative vector field']],
  ['potential function', 'q33', 'A function φ whose gradient is a given field; the field’s work from A to B is then φ(B) − φ(A).', 'φ = x² + xy is a potential function for ⟨2x + y, x⟩.', ['potential']],
  ['closed curve', 'q34', 'A curve that ends at the point where it starts, such as a circle or the edge of a rectangle.', 'One lap round a yard fence is a closed curve.'],
  ['circulation', 'q34', 'The work a field does round a closed curve, written ∮ F · dr; it measures how much the field flows round the loop.', '⟨−y, x⟩ has circulation 2π round the unit circle, anticlockwise.'],
  ['Green’s theorem', 'q34', 'For a closed curve travelled anticlockwise, the circulation of ⟨P, Q⟩ equals the double integral of ∂Q/∂x − ∂P/∂y inside.', 'For ⟨−y, x⟩ round a 2 by 3 rectangle: 2 × 6 = 12.', ['Green\'s theorem']],
  ['divergence', 'q35', 'div F = ∂P/∂x + ∂Q/∂y + ∂R/∂z: how much a flow spreads out from a point, per unit of volume.', 'F = ⟨x, y, z⟩ has divergence 3 everywhere.', ['div']],
  ['curl', 'q35', 'A vector built from partial derivatives of a field that shows the axis a flow spins round and how fast.', 'F = ⟨−y, x, 0⟩ has curl ⟨0, 0, 2⟩: it spins round the z-axis.', [], 'curl (the|your) fingers'],
  ['parametrised surface', 'q36', 'A surface given by a rule r(u, v) that sends each pair of parameters to a point in space.', 'r(θ, z) = ⟨2 cos θ, 2 sin θ, z⟩ is a cylinder of radius 2.', ['parametrized surface']],
  ['surface area', 'q36', 'The area of a curved surface, found as the double integral of ‖r_u × r_v‖ over its parameters.', 'A cylinder of radius 2 and height 5 has surface area 20π, without its ends.'],
  ['flux', 'q37', 'How much of a flow passes through a surface each second: the double integral of F · N over it.', 'Air at ⟨0, 0, 4⟩ m/s through a flat 3 m by 3 m panel: an upward flux of 36 m³/s.'],
  ['orientation', 'q37', 'The choice of which side of a surface counts as forwards, given by the direction of its normal vector.', 'An upward orientation on a floor uses the normal ⟨0, 0, 1⟩.'],
  ['Stokes’ theorem', 'q38', 'The circulation round a closed curve equals the flux of the curl through any surface with that curve as its rim, its normal matched to the direction of travel by the right-hand rule.', 'A dome and its flat floor share a rim, so they have the same flux of the curl.', ['Stokes\' theorem']],
  ['right-hand rule', 'q38', 'Curl the fingers of your right hand along the direction of travel; your thumb then points along the matching normal.', 'Anticlockwise seen from above goes with an upward normal.'],
  ['closed surface', 'q39', 'A surface with no edge that encloses a solid, such as the six walls of a box or the skin of a ball.', 'The six faces of a cube make a closed surface.'],
  ['divergence theorem', 'q39', 'The flux out through a closed surface equals the triple integral of the divergence over the solid inside.', 'For ⟨x, y, z⟩ out of a 2 m cube: 3 × 8 = 24.'],
  ['differential equation', 'q40', 'An equation that gives the rate of change of a quantity in terms of the quantity itself or other variables.', 'dM/dt = −0.1M says the air in a dome leaks at a tenth of what is there each second.'],
 ]
};
})();
