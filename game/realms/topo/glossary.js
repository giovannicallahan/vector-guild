/* Topology: shape without size glossary: the words this pack teaches, shown as tap-to-define buttons in its lessons, prompts, hints and
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
P['topo'] = {
 required: ['metric', 'open set', 'closed set', 'topology', 'continuous', 'homeomorphism', 'connected', 'compact', 'surface', 'Euler characteristic', 'genus', 'orientable', 'curvature', 'winding number'],
 terms: [
  /* q01–q10 (missions-a.js) */
  ['metric', 'q01', 'A rule d(x, y) giving the distance between two points: never negative, 0 only from a point to itself, the same both ways, and obeying the triangle inequality.', 'The usual distance |x − y| on the number line is a metric.'],
  ['Euclidean metric', 'q01', 'The straight-line distance: the square root of the sum of the squared gaps in each coordinate.', 'From (1, 1) to (4, 5): √(9 + 16) = 5.', ['Euclidean distance']],
  ['taxicab metric', 'q01', 'The distance along grid lines: the sum of the gaps in each coordinate, without their signs.', 'From (1, 1) to (4, 5): 3 + 4 = 7.', ['taxicab distance']],
  ['maximum metric', 'q01', 'The larger of the gaps in each coordinate, without their signs.', 'From (1, 1) to (4, 5): the larger of 3 and 4, which is 4.', ['maximum distance']],
  ['ball', 'q02', 'The ball B(x, r) is the set of all points at distance less than r from the centre x.', 'On the number line B(3, 2) is the open interval (1, 5).'],
  ['triangle inequality', 'q03', 'The rule d(x, z) ≤ d(x, y) + d(y, z): a detour through y is never shorter than the direct distance.', 'If d(x, y) = 5 and d(y, z) = 2, then d(x, z) is at most 7.'],
  ['discrete metric', 'q03', 'The metric that puts any two different points at distance 1 and each point at distance 0 from itself.', 'The route B, B, A has discrete length 0 + 1 = 1.'],
  ['open set', 'q04', 'A set in which every point has a ball round it that lies wholly inside the set.', 'The interval (2, 9) is open; [2, 9] is not.'],
  ['interior', 'q05', 'A point of a set is an interior point when some ball round it lies inside the set; the interior is all such points.', 'The interior of [1, 4) is (1, 4).', ['interior point'], 'interior angle'],
  ['boundary', 'q05', 'The boundary of a set is every point where each ball, however small, meets both the set and the outside of it.', 'The boundary of [1, 4) is the two points 1 and 4.', ['boundary point'], 'boundary circle'],
  ['closure', 'q05', 'The closure of a set is the smallest closed set containing it: the set together with its boundary.', 'The closure of (0, 2] is [0, 2].'],
  ['closed set', 'q05', 'A set whose complement is open; equivalently, one that contains all of its boundary points.', 'The interval [2, 9] is closed; [2, 9) is not.'],
  ['topology', 'q07', 'A list of subsets of a set X, called open, that contains ∅ and X and every union and finite intersection of its members.', 'On {1, 2}: ∅, {1}, {1, 2}.', [], 'Topology studies|Topology:'],
  ['topological space', 'q07', 'A set together with a topology on it, that is, a chosen list of open sets.', 'X = {1, 2, 3} with open sets ∅, {1}, X.'],
  ['discrete topology', 'q07', 'The topology in which every subset is open.', 'On 3 points it has 2 × 2 × 2 = 8 open sets.'],
  ['indiscrete topology', 'q07', 'The topology in which only ∅ and the whole set are open.', 'On {1, 2, 3} the open sets are just ∅ and {1, 2, 3}.'],
  ['basis', 'q09', 'A family of open sets whose unions give every open set of the topology.', 'The basis {1}, {2, 3} gives ∅, {1}, {2, 3} and {1, 2, 3}.'],
  ['continuous', 'q10', 'A map is continuous when the preimage of every open set is open.', 'Every constant map is continuous.'],
  ['preimage', 'q10', 'The preimage f⁻¹(V) of a set V is the set of all points that the map f sends into V.', 'If f(1) = a and f(2) = b, then f⁻¹({a}) = {1}.'],
  /* q11–q20 (missions-b.js) */
  ['connected', 'q12', 'A set is connected when it cannot be split into two non-empty, separate parts that are each open in the set.', '[0, 2] is connected; [0, 1] ∪ [2, 3] is not.'],
  ['component', 'q12', 'A component of a set is one of its largest connected pieces.', '(0, 1) ∪ (1, 2) has 2 components.'],
  ['cut point', 'q13', 'A cut point of a connected shape is a point whose removal leaves more than one piece.', 'The middle of a line segment is a cut point; no point of a circle is.'],
  ['homeomorphism', 'q14', 'A homeomorphism is a one-to-one pairing of the points of two spaces that is continuous both ways.', 'Stretching a C into an L is a homeomorphism.'],
  ['homeomorphic', 'q14', 'Two spaces are homeomorphic, written ≅, when there is a homeomorphism from one onto the other.', 'C ≅ L, but T is not homeomorphic to L.'],
  ['open cover', 'q15', 'An open cover of a set is a family of open sets whose union contains the set.', 'The intervals (k − 1, k + 1) for whole numbers k cover the line.'],
  ['subcover', 'q15', 'A subcover is part of an open cover that still covers the whole set.', '(−1, 2) and (1, 4) are a subcover of [0, 3] from a larger cover.'],
  ['compact', 'q15', 'A set is compact when every open cover of it has a finite subcover; on the line, exactly when it is closed and bounded.', '[0, 1] is compact; (0, 1] is not.'],
  ['extreme value theorem', 'q16', 'The extreme value theorem says a continuous function on a compact set reaches a largest and a smallest value.', 'x² on [−1, 2] reaches 4 at x = 2 and 0 at x = 0.'],
  ['quotient space', 'q18', 'A quotient space is the space made by gluing: each group of points declared the same becomes one point.', 'A square with its left and right edges glued is a cylinder.'],
  ['gluing', 'q18', 'Gluing, or sewing, declares points of a space to be the same point, such as matching points of two edges.', 'Gluing the ends of a strip makes a ring.'],
  ['surface', 'q19', 'A surface is a space that looks like a small piece of the flat plane near every point not on its edge.', 'A sphere, a torus and a disc are surfaces.'],
  ['boundary circle', 'q19', 'A boundary circle is one closed loop of the edge of a surface.', 'An annulus has 2 boundary circles.'],
  ['orientable', 'q19', 'A surface is orientable when it contains no Möbius strip.', 'A torus is orientable; a Klein bottle is not.'],
  ['disc', 'q19', 'A disc is a flat round panel: a circle together with everything inside it.', 'A disc has 1 boundary circle.'],
  ['annulus', 'q19', 'An annulus is the flat ring between two circles, one inside the other.', 'A washer is an annulus.'],
  ['Möbius strip', 'q19', 'A Möbius strip is a strip whose two ends are sewn together after a half-twist.', 'A Möbius strip has 1 boundary circle and is not orientable.'],
  ['pair of trousers', 'q19', 'A pair of trousers is a disc with two smaller discs cut out of it.', 'A pair of trousers has 3 boundary circles.'],
  ['sphere', 'q19', 'A sphere is the surface of a ball, a closed surface with no edge.', 'A blown-up balloon is a sphere.'],
  ['torus', 'q19', 'A torus is the surface of a ring doughnut, made from a square by the word a b a⁻¹ b⁻¹.', 'A torus has no boundary circles and is orientable.'],
  ['Klein bottle', 'q19', 'A Klein bottle is the closed surface made from a square by the word a b a⁻¹ b.', 'A Klein bottle contains a Möbius strip.'],
  ['projective plane', 'q19', 'A projective plane is a disc whose rim is sewn to itself by joining every pair of opposite points.', 'A projective plane is closed and not orientable.'],
  ['cell division', 'q20', 'A cell division cuts a surface into vertices, edges between them and faces, each face a patch like an open disc.', 'A cube frame is a cell division of the sphere.'],
  ['Euler characteristic', 'q20', 'The Euler characteristic χ of a surface is V − E + F for any cell division of it.', 'Cube: 8 − 12 + 6 = 2.', ['χ']],
  /* q21–q30 (missions-c.js) */
  ['graph', 'q21', 'Points called vertices joined by lines called edges, with no faces filled in; its Euler characteristic is V − E.', 'A triangle of 3 cables has V = 3, E = 3 and χ = 0.', [], 'graph of |graph paper|plot'],
  ['vertex class', 'q22', 'A group of polygon corners that sewing the edges together turns into one single point of the surface.', 'In the torus word a b a⁻¹ b⁻¹ all four corners form one vertex class.'],
  ['connected sum', 'q24', 'Two surfaces joined into one by cutting a small hole in each and sewing a tube between the holes; written A # B.', 'χ(torus # torus) = 0 + 0 − 2 = −2.'],
  ['genus', 'q25', 'The number of handles on a sphere with handles: the number of tori joined together by connected sum.', 'The torus has genus 1, and genus g has χ = 2 − 2g.'],
  ['cross-cap', 'q26', 'A projective plane with a small round hole cut in it, sewn into a hole in another surface.', 'The sphere with 3 cross-caps has χ = 2 − 3 = −1.'],
  ['classification of surfaces', 'q27', 'The theorem that every surface is the sphere, a sphere with handles or a sphere with cross-caps, and no two of these are the same.', 'Not orientable with χ = −1 means the sphere with 3 cross-caps.'],
  ['curvature', 'q30', 'A number saying how a surface bends at a point: positive like a sphere, zero where flat, negative like a saddle.', 'A sphere of radius 2 m has k = 1 ÷ 4 = 0.25 per square metre.'],
  /* q31–q40 (missions-d.js) */
  ['angle excess', 'q31', 'The amount by which the angles of a triangle on a curved surface add up to more than π; on curvature k it is k times the area.', 'Three right angles on a sphere: excess 3π ÷ 2 − π = π ÷ 2.'],
  ['great circle', 'q31', 'A circle on a sphere whose centre is the centre of the sphere; its arcs are the straightest paths on the sphere.', 'The equator is a great circle of the Earth.'],
  ['Gauss–Bonnet', 'q32', 'The formula kA = 2πχ linking the constant curvature k, the area A and the Euler characteristic χ of a closed surface.', 'A sphere of radius 1: k = 1 and χ = 2, so A = 4π.'],
  ['elliptic geometry', 'q33', 'Geometry of constant positive curvature, like a sphere’s, in which the angles of a triangle add up to more than π.', 'The sphere and the projective plane carry elliptic geometry.', ['elliptic']],
  ['hyperbolic geometry', 'q33', 'Geometry of constant negative curvature, in which the angles of a triangle add up to less than π.', 'A surface of genus 2 carries hyperbolic geometry.', ['hyperbolic']],
  ['flat geometry', 'q33', 'Geometry of curvature 0, the ordinary Euclidean kind, in which the angles of a triangle add up to exactly π.', 'The torus and the Klein bottle carry flat geometry.'],
  ['fundamental domain', 'q34', 'A region holding one representative of every point of a glued surface, with at most one of them in its interior.', 'A square is a fundamental domain for the torus.'],
  ['tiling', 'q34', 'A covering of a plane by copies of one shape that leave no gaps and do not overlap.', 'Squares tile the flat plane, four meeting at each corner.'],
  ['loop', 'q35', 'A path that starts and ends at the same point.', 'A drone flight from the pad, round a beacon and back to the pad.'],
  ['winding number', 'q35', 'The net number of times a loop goes anticlockwise round a point it avoids; clockwise turns count as negative.', 'A loop that goes twice round clockwise has winding number −2.'],
  ['homotopy', 'q35', 'A deformation of one loop into another, little by little, without tearing it or passing through a forbidden point.', 'A circle round a beacon can be squashed into an oval by a homotopy.', ['homotopic']],
  ['fundamental group', 'q36', 'The loops at a base point, grouped by homotopy and combined by joining one after another.', 'The fundamental group of a circle is the whole numbers, under adding.'],
  ['degree of a circle map', 'q37', 'The number of times a map of a circle to itself wraps it round, counted with sign: θ ↦ nθ has degree n.', 'θ ↦ −3θ has degree −3.'],
  ['independent loop', 'q38', 'One of the fewest loops in a graph from which every loop can be built; a connected graph has E − V + 1 of them.', 'A wheel with 5 spokes has 5 independent loops.'],
  ['spanning tree', 'q38', 'A part of a connected graph that reaches every vertex, has no loop and uses V − 1 edges.', 'A path through all 4 corners of a square, using 3 of its 4 sides.'],
  ['fixed point', 'q39', 'An input x that a function leaves unchanged: f(x) = x.', 'x = 2 is a fixed point of f(x) = (x + 4) ÷ 3.'],
 ]
};
})();
