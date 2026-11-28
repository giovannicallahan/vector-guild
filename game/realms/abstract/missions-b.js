/* Abstract algebra: patterns of moves missions, file b: q11–q20. Mission objects: docs/PACK-FORMAT.md §2 (every field), §2.1 (what the
   harness requires), §7 (answers). Generators: gen-b.js (build(canonical) reproduces the prompt, hints, solution
   and guidance here exactly); experiments: experiments-b.js; drill statements: variants-b.js; oracles:
   qa/realms/abstract/oracle-b.js. One author per file. The missions of this file (id, chapter, tier and XP, sector):
     q11  ch 2 Order and cycles · Basic, 100 XP · sector 'Beacon Tower' · Chapter review: orders and inverses mixed [4.1, 3.2]
     q12  ch 3 Permutations and symmetry · Intermediate, 150 XP · sector 'Hatch Hall' · Permutations and composition [5.1]
     q13  ch 3 Permutations and symmetry · Intermediate, 150 XP · sector 'Hatch Hall' · Cycle notation and the order of a permutation [5.1]
     q14  ch 3 Permutations and symmetry · Intermediate, 150 XP · sector 'Hatch Hall' · Transpositions, even and odd [5.1]
     q15  ch 3 Permutations and symmetry · Intermediate, 150 XP · sector 'Hatch Hall' · Counting S_n and A_n [5.1]
     q16  ch 3 Permutations and symmetry · Intermediate, 150 XP · sector 'Hatch Hall' · Dihedral groups: turning and flipping a polygon [5.2]
     q17  ch 3 Permutations and symmetry · Intermediate, 150 XP · sector 'Hatch Hall' · Chapter review: symmetry moves mixed [5.2, 5.1]
     q18  ch 4 Subgroups and cosets · Intermediate, 150 XP · sector 'Sorting Depot' · Subgroups of a cyclic group [3.3, 4.1]
     q19  ch 4 Subgroups and cosets · Intermediate, 150 XP · sector 'Sorting Depot' · Cosets [6.1]
     q20  ch 4 Subgroups and cosets · Intermediate, 150 XP · sector 'Sorting Depot' · Lagrange's theorem [6.2] */
(function(){
'use strict';
/* Thomas W. Judson, Abstract Algebra: Theory and Applications (LibreTexts) sections, one entry per section the missions below cite. Open each page before you set `verified` to the
   date you saw it. Every mission needs at least one source whose title matches /^Judson, Abstract Algebra/ (Judson, Abstract Algebra).
   A title reads like: Judson, Abstract Algebra: Theory and Applications (LibreTexts) — 4.1 Cyclic Subgroups
   Link to the section page itself: https://math.libretexts.org/Bookshelves/Abstract_and_Geometric_Algebra/Abstract_Algebra%3A_Theory_and_Applications_(Judson)/<NN>%3A_<Chapter>/<N.MM>%3A_<Section> */
const source = {
 s3_2: { title: 'Judson, Abstract Algebra: Theory and Applications (LibreTexts) — 3.2 Definitions and Examples', url: 'https://math.libretexts.org/Bookshelves/Abstract_and_Geometric_Algebra/Abstract_Algebra%3A_Theory_and_Applications_(Judson)/03%3A_Groups/3.08%3A_Definitions_and_Examples', verified: '2026-11-27' },
 s3_3: { title: 'Judson, Abstract Algebra: Theory and Applications (LibreTexts) — 3.3 Subgroups', url: 'https://math.libretexts.org/Bookshelves/Abstract_and_Geometric_Algebra/Abstract_Algebra%3A_Theory_and_Applications_(Judson)/03%3A_Groups/3.09%3A_Subgroups', verified: '2026-11-27' },
 s4_1: { title: 'Judson, Abstract Algebra: Theory and Applications (LibreTexts) — 4.1 Cyclic Subgroups', url: 'https://math.libretexts.org/Bookshelves/Abstract_and_Geometric_Algebra/Abstract_Algebra%3A_Theory_and_Applications_(Judson)/04%3A_Cyclic_Groups/4.01%3A_Cyclic_Subgroups', verified: '2026-11-27' },
 s5_1: { title: 'Judson, Abstract Algebra: Theory and Applications (LibreTexts) — 5.1 Definitions and Notation', url: 'https://math.libretexts.org/Bookshelves/Abstract_and_Geometric_Algebra/Abstract_Algebra%3A_Theory_and_Applications_(Judson)/05%3A_Permutation_Groups/5.01%3A_Definitions_and_Notation', verified: '2026-11-27' },
 s5_2: { title: 'Judson, Abstract Algebra: Theory and Applications (LibreTexts) — 5.2 Dihedral Groups', url: 'https://math.libretexts.org/Bookshelves/Abstract_and_Geometric_Algebra/Abstract_Algebra%3A_Theory_and_Applications_(Judson)/05%3A_Permutation_Groups/5.02%3A_Dihedral_Groups', verified: '2026-11-27' },
 s6_1: { title: 'Judson, Abstract Algebra: Theory and Applications (LibreTexts) — 6.1 Cosets', url: 'https://math.libretexts.org/Bookshelves/Abstract_and_Geometric_Algebra/Abstract_Algebra%3A_Theory_and_Applications_(Judson)/06%3A_Cosets_and_Lagrange\'s_Theorem/6.01%3A_Cosets', verified: '2026-11-27' },
 s6_2: { title: 'Judson, Abstract Algebra: Theory and Applications (LibreTexts) — 6.2 Lagrange’s Theorem', url: 'https://math.libretexts.org/Bookshelves/Abstract_and_Geometric_Algebra/Abstract_Algebra%3A_Theory_and_Applications_(Judson)/06%3A_Cosets_and_Lagrange\'s_Theorem/6.02%3A_Lagrange\'s_Theorem', verified: '2026-11-27' }
};
/* Each mission cites a section with its own one-line description of what that section gives this mission. */
const cite = (s, description) => ({ title: s.title, url: s.url, description, verified: s.verified });
window.QUESTS = window.QUESTS || [];
window.QUESTS.push(
 {
  id: 'q11', title: 'The beacon that comes back round', topic: 'Chapter review: orders and inverses', tier: 'Basic', sector: 'Beacon Tower',
  brief: 'A beacon’s timer multiplies a stored number on every beat, and Mira needs both its flash rhythm and the number that undoes one beat.',
  lesson: 'If aᵏ = 1 for the order k of a, then a × aᵏ⁻¹ = 1, so the inverse of a is aᵏ⁻¹: one list of powers gives both the order and the inverse.',
  prompt: 'A pulse beacon keeps a number from U(13): the whole numbers from 1 to 12 that share no factor with 13 except 1, combined by multiplying mod 13. The stored number starts at 1. On every beat the timer multiplies it by 5 and keeps the remainder mod 13, and the beacon flashes whenever the stored number is back at 1. Enter the order of 5 in U(13), which is the number of beats from one flash to the next, then the inverse of 5 in U(13).',
  answer: [4, 8], labels: ['order of the number', 'inverse'], tolerance: 0.01,
  hints: [
   'The order is the smallest power k with aᵏ mod n = 1. Multiply by the number again and again, taking the remainder each time, until you reach 1.',
   'If aᵏ = 1, then a × aᵏ⁻¹ = 1. So the power just before the first 1 is the inverse.'
  ],
  solution: 'Multiplying by 5 each time and keeping the remainder mod 13, the powers 5¹, 5², … are 5, 12, 8, 1. The first 1 is 5⁴, so the order of 5 in U(13) is 4. Then 5 × 5³ = 5⁴ = 1, so the inverse of 5 is 5³ mod 13 = 8. Check: 5 × 8 = 40 = 3 × 13 + 1.',
  xp: 100, prereqs: ['q09', 'q10'],
  artifact: { name: 'Beacon rhythm card', description: 'A list of powers that ends at 1, with the inverse read off the step before.' },
  sources: [cite(source.s4_1, 'The order of an element and the cyclic subgroup ⟨a⟩ it makes. The rule that the inverse is aᵏ⁻¹ is worked out in this mission.'), cite(source.s3_2, 'Groups, identities and inverses, and the group U(n) under multiplication mod n.')],
  teaching: {
   intuition: 'This review puts two earlier ideas side by side in U(n), the whole numbers from 1 to n − 1 that share no factor with n except 1, combined by multiplying mod n. The order of a is the smallest power k with aᵏ mod n = 1: keep multiplying by a, taking the remainder each time, and count the steps until 1 comes back. The inverse of a is the number b in U(n) with a × b mod n = 1, the move that undoes multiplying by a. The two are linked. Once aᵏ = 1, split off one factor: a × aᵏ⁻¹ = aᵏ = 1. So the power just before the first 1 is the inverse. Every element of U(n) has an order, because U(n) is finite and its powers must come back round, so this trick always works. The same list of powers answers both questions.',
   steps: [
    'Multiply by a again and again, keeping the remainder mod n each time, and write the powers a¹, a², a³, … in a row.',
    'Stop at the first power equal to 1. Its exponent k is the order of a.',
    'The power just before it, aᵏ⁻¹, is the inverse of a.',
    'Check: a times the inverse should leave remainder 1 when divided by n.'
   ],
   example: {
    prompt: 'Find the order of 3 in U(11) and the inverse of 3 in U(11).',
    steps: [
     'The powers of 3 mod 11: 3, 9, 27 mod 11 = 5, 15 mod 11 = 4, 12 mod 11 = 1.',
     'The first 1 is 3⁵, so the order of 3 is 5.',
     'The power before it is 3⁴ mod 11 = 4, and 3 × 4 = 12 = 1 × 11 + 1, so 4 is the inverse.'
    ],
    answer: 'Order 5; the inverse of 3 is 4.'
   },
   pitfalls: [
    'Taking the last power you wrote, which is 1, as the inverse. The inverse is the power before the first 1.',
    'Giving n − a, the inverse for adding mod n, when the group multiplies. In U(n) the inverse b must make a × b leave remainder 1.',
    'Forgetting to take the remainder after each multiplication, so the numbers grow and the 1 is never seen.'
   ]
  },
  guidance: [
   { prompt: 'Start the list of powers. What is 5² mod 13?', answer: [12], labels: ['square mod n'], explanation: '5 × 5 = 25 = 1 × 13 + 12, so 5² mod 13 = 12.' },
   { prompt: 'Keep multiplying by 5 and taking the remainder mod 13 until you reach 1. What is the order of 5?', answer: [4], labels: ['order'], explanation: 'The powers are 5, 12, 8, 1. The first 1 is power number 4, so the order is 4.' },
   { prompt: 'The inverse is the power just before the first 1, 5³. What is it mod 13?', answer: [8], labels: ['inverse'], explanation: '5³ mod 13 = 8, and 5 × 8 = 40, which leaves remainder 1 when divided by 13.' }
  ]
 },
 {
  id: 'q12', title: 'Two moves on the bolt ring', topic: 'Permutations and composition', tier: 'Intermediate', sector: 'Hatch Hall',
  brief: 'A hatch lock runs two bolt moves one after the other, and the crew must know where each bolt ends before they seal the hatch.',
  lesson: 'A permutation is a rearrangement of a finite set; the composition σ ∘ τ does τ first and then σ, so (σ ∘ τ)(i) = σ(τ(i)).',
  prompt: 'A hatch lock has 6 bolt sockets numbered 1 to 6. Each move lifts every bolt and drops it into a socket again, one bolt per socket, so a move is a permutation of the socket numbers. An arrow 2 → 5 means the bolt in socket 2 drops into socket 5. Move σ is 1 → 3, 2 → 6, 3 → 4, 4 → 1, 5 → 2, 6 → 5. Move τ is 1 → 2, 2 → 4, 3 → 5, 4 → 6, 5 → 1, 6 → 3. The crew runs the composition σ ∘ τ, which means τ first, then σ. Enter (σ ∘ τ)(1), then (σ ∘ τ)(4): the sockets where the bolts that started in sockets 1 and 4 end up.',
  answer: [6, 5], labels: ['(σ ∘ τ)(first socket)', '(σ ∘ τ)(second socket)'], tolerance: 0.01,
  hints: [
   'σ ∘ τ means τ first, then σ: (σ ∘ τ)(i) = σ(τ(i)). Find τ(i) in τ’s list first.',
   'Then look up that socket in σ’s list: that is where the bolt ends.'
  ],
  solution: 'τ(1) = 2 and σ(2) = 6, so (σ ∘ τ)(1) = 6. τ(4) = 6 and σ(6) = 5, so (σ ∘ τ)(4) = 5. Running σ first would send the bolt from socket 1 to τ(σ(1)) = 5 instead, so the order of the moves matters.',
  xp: 150, prereqs: ['q04'],
  artifact: { name: 'Bolt move pair', description: 'Two rearrangements of the same sockets and the single move they make together.' },
  sources: [cite(source.s5_1, 'Permutations of a finite set, written as lists or in cycle notation, and their composition.')],
  teaching: {
   intuition: 'A permutation of a finite set is a rearrangement of it: a rule that sends every element to an element of the same set, with no two sent to the same place, so nothing is lost and nothing doubles up. For a hatch with sockets 1 to 6, a permutation σ says for each socket i the socket σ(i) its bolt drops into. Writing σ: 1 → 3, 2 → 6, … lists it in full. Two moves done one after the other make a single move, their composition, written σ ∘ τ and read “σ after τ”. As with functions, the one on the right goes first: (σ ∘ τ)(i) = σ(τ(i)), so first look up i in τ, then look up the answer in σ. The composition of two permutations is again a permutation, the move that does nothing is the identity, and every move can be undone. But the order matters: σ ∘ τ and τ ∘ σ are usually different moves.',
   steps: [
    'Find τ(i): look up i in τ’s list, because τ is done first.',
    'Find σ of that socket: look it up in σ’s list.',
    'That socket is (σ ∘ τ)(i). Repeat for every socket you need.'
   ],
   example: {
    prompt: 'On 4 sockets, σ: 1 → 3, 2 → 1, 3 → 2, 4 → 4 and τ: 1 → 2, 2 → 1, 3 → 3, 4 → 4. Find (σ ∘ τ)(1) and (τ ∘ σ)(1).',
    steps: [
     '(σ ∘ τ)(1): τ(1) = 2, then σ(2) = 1, so (σ ∘ τ)(1) = 1.',
     '(τ ∘ σ)(1): σ(1) = 3, then τ(3) = 3, so (τ ∘ σ)(1) = 3.'
    ],
    answer: '(σ ∘ τ)(1) = 1 but (τ ∘ σ)(1) = 3: the order of the two moves matters.'
   },
   pitfalls: [
    'Doing σ first because it is written first. In σ ∘ τ the right-hand move, τ, acts first.',
    'Reading a list backwards: in 2 → 5 the bolt from socket 2 goes to socket 5, not the bolt from socket 5 to socket 2.',
    'Assuming σ ∘ τ equals τ ∘ σ. Moves of a hatch, like most permutations, do not swap order freely.'
   ]
  },
  guidance: [
   { prompt: 'τ goes first. Where does τ send the bolt in socket 1?', answer: [2], labels: ['τ(first socket)'], explanation: 'τ’s list has 1 → 2, so τ(1) = 2.' },
   { prompt: 'Now σ moves that bolt. What is σ(2), which is (σ ∘ τ)(1)?', answer: [6], labels: ['(σ ∘ τ)(first socket)'], explanation: 'σ’s list has 2 → 6, so (σ ∘ τ)(1) = σ(τ(1)) = 6.' },
   { prompt: 'The same for the bolt in socket 4. What is τ(4)?', answer: [6], labels: ['τ(second socket)'], explanation: 'τ’s list has 4 → 6, so τ(4) = 6.' },
   { prompt: 'What is σ(6), which is (σ ∘ τ)(4)?', answer: [5], labels: ['(σ ∘ τ)(second socket)'], explanation: 'σ’s list has 6 → 5, so (σ ∘ τ)(4) = 5.' }
  ]
 },
 {
  id: 'q13', title: 'How often must the hatch cycle?', topic: 'Cycle notation and the order of a permutation', tier: 'Intermediate', sector: 'Hatch Hall',
  brief: 'A hatch repeats one bolt move over and over, and Mira wants to know after how many repeats every bolt is back in its own socket.',
  lesson: 'Write a permutation as disjoint cycles; its order is the lcm of the cycle lengths.',
  prompt: 'A hatch has 8 bolt sockets, and one of its moves is the permutation 1 → 4, 2 → 8, 3 → 3, 4 → 7, 5 → 6, 6 → 2, 7 → 1, 8 → 5. Write the move in cycle notation, counting each fixed point (a socket whose bolt stays put) as a cycle of length 1. Enter the number of cycles, then the order of the move: the smallest number of times it must be repeated to bring every bolt back to its own socket.',
  answer: [3, 12], labels: ['number of cycles', 'order'], tolerance: 0.01,
  hints: [
   'Start at 1 and follow the arrows until you come back to 1: that is one cycle. Then start again from the smallest socket not used yet.',
   'A cycle of length L brings its bolts home after L, 2L, 3L, … repeats. All the bolts are home together for the first time at the lcm of the cycle lengths.'
  ],
  solution: 'Following the arrows gives (1 4 7)(2 8 5 6)(3): 3 cycles, of lengths 3, 4 and 1. A cycle of length L is home after every multiple of L, so every bolt is home at once first after lcm(3, 4, 1) = 12 repeats. The order of the move is 12.',
  xp: 150, prereqs: ['q12', 'q07'],
  artifact: { name: 'Cycle chart', description: 'A bolt move drawn as loops, with the number of repeats that brings every loop home.' },
  sources: [cite(source.s5_1, 'Cycle notation, disjoint cycles and composing cycles. The rule that the order is the lcm of the cycle lengths is worked out in this mission.')],
  teaching: {
   intuition: 'Follow one bolt under a move again and again: socket 1 sends it to σ(1), that socket sends it on, and sooner or later it comes back to 1. The sockets it visits form a cycle, written in brackets in the order visited: (1 4 7) means 1 → 4, 4 → 7 and 7 → 1. Writing a whole move as its cycles, side by side, is cycle notation. The cycles share no sockets. A socket whose bolt stays put is a fixed point; here we count it as a cycle of length 1, written like (3). Now repeat the move. A cycle of length L brings its bolts home after L repeats, and again after 2L, 3L and so on. Every bolt is home at the same moment exactly when the number of repeats is a multiple of every cycle length. The smallest such number is the least common multiple, lcm, of the lengths: the smallest positive whole number that each of them divides exactly. So the order of the move, the smallest number of repeats that gives back the identity, is the lcm of its cycle lengths. One way to find an lcm is to go through the multiples of the largest length until every length divides one; for two numbers, lcm(a, b) = a × b ÷ gcd(a, b).',
   steps: [
    'Start at 1 and follow the arrows until you return to 1. Write the sockets you visit as one cycle.',
    'Start again from the smallest socket not used yet, and repeat until every socket is in a cycle, fixed points included.',
    'Count the cycles and note their lengths.',
    'The order is the lcm of the lengths: the smallest number that every length divides.'
   ],
   example: {
    prompt: 'Find the cycles and the order of the move 1 → 2, 2 → 3, 3 → 1, 4 → 5, 5 → 4, 6 → 6.',
    steps: [
     '1 → 2 → 3 → 1 gives (1 2 3); 4 → 5 → 4 gives (4 5); 6 stays put, giving (6).',
     'That is 3 cycles, of lengths 3, 2 and 1.',
     'Multiples of 3 are 3, 6, …; 6 is the first that 2 also divides, so lcm(3, 2, 1) = 6.'
    ],
    answer: '(1 2 3)(4 5)(6): 3 cycles, order 6.'
   },
   pitfalls: [
    'Multiplying the cycle lengths. A 2-cycle and a 4-cycle are both home after 4 repeats, not 8.',
    'Taking the longest cycle length as the order. A 3-cycle and a 2-cycle need 6 repeats, not 3.',
    'Leaving out the fixed points when counting cycles. Each one is a cycle of length 1.'
   ]
  },
  guidance: [
   { prompt: 'Start at 1 and follow the arrows back to 1. How long is the cycle that contains 1?', answer: [3], labels: ['length of the cycle with 1'], explanation: '1 → 4 → 7 → 1, so the cycle (1 4 7) has length 3.' },
   { prompt: 'Keep going from the smallest socket not used yet until every socket is in a cycle. How many cycles are there, fixed points included?', answer: [3], labels: ['number of cycles'], explanation: 'The move is (1 4 7)(2 8 5 6)(3), which has 3 cycles.' },
   { prompt: 'The cycle lengths are 3, 4 and 1. What is their lcm, the order of the move?', answer: [12], labels: ['order'], explanation: '12 is the smallest number that every cycle length divides exactly, so lcm(3, 4, 1) = 12.' }
  ]
 },
 {
  id: 'q14', title: 'Swaps for the hatch robot', topic: 'Transpositions, even and odd', tier: 'Intermediate', sector: 'Hatch Hall',
  brief: 'The hatch robot can only swap two bolts at a time, so the crew needs to know how many swaps a bolt move takes and whether it is even or odd.',
  lesson: 'A cycle of length L is L − 1 transpositions; a permutation is even or odd as that count is, and its sign is 1 or −1.',
  prompt: 'A hatch has 7 bolt sockets, and one of its moves is the permutation 1 → 3, 2 → 5, 3 → 6, 4 → 7, 5 → 1, 6 → 2, 7 → 4. The crew’s robot can only swap the bolts in two sockets at a time. Write the move in cycle notation, counting each fixed point as a cycle of length 1, then write each cycle of length L as L − 1 transpositions. Enter the number of transpositions this gives, then the sign of the move: 1 if it is an even permutation, −1 if it is odd.',
  answer: [5, -1], labels: ['transpositions', 'sign'], tolerance: 0.01,
  hints: [
   'A cycle of length L is L − 1 transpositions and a fixed point needs none, so the total is the number of sockets minus the number of cycles.',
   'An even number of transpositions makes an even permutation, with sign 1; an odd number makes an odd permutation, with sign −1.'
  ],
  solution: 'In cycle notation the move is (1 3 6 2 5)(4 7): 2 cycles on 7 sockets. A cycle of length L needs L − 1 transpositions, so the total is 4 + 1 = 5, which is 7 − 2. For instance (1 3 6 2 5) = (1 5)(1 2)(1 6)(1 3), read from right to left. 5 is odd, so the move is an odd permutation and its sign is −1.',
  xp: 150, prereqs: ['q13'],
  artifact: { name: 'Swap ledger', description: 'A bolt move broken into swaps of two sockets, marked even or odd.' },
  sources: [cite(source.s5_1, 'Transpositions, writing a cycle as transpositions, even and odd permutations. The count “sockets minus cycles” is worked out in this mission.')],
  teaching: {
   intuition: 'A transposition is a permutation that swaps two symbols and leaves every other one alone, such as (2 5). Every permutation can be built from transpositions. A cycle of length L takes L − 1 of them, all swapping with its first symbol: (a b c d) = (a d)(a c)(a b), done from right to left, and the same pattern works for any length. For example (1 4 2) = (1 2)(1 4): the right-hand swap (1 4) sends 1 to 4, and (1 2) leaves 4 alone, so 1 ends at 4, just as the cycle says. A fixed point needs no swaps. So a move with c cycles on n symbols, fixed points counted, takes (n − c) transpositions this way, and no way of writing it uses fewer. A permutation can be written with transpositions in many ways, but a key theorem says the count is always even or always odd for the same permutation. So each permutation is an even permutation or an odd permutation, and its sign is 1 for even and −1 for odd.',
   steps: [
    'Write the permutation in cycle notation, with fixed points as cycles of length 1.',
    'Each cycle of length L gives L − 1 transpositions. Add them up; the total is n minus the number of cycles.',
    'If the total is even, the permutation is even and its sign is 1; if odd, it is odd and its sign is −1.'
   ],
   example: {
    prompt: 'How many transpositions does the cycle rule give for 1 → 4, 2 → 1, 3 → 5, 4 → 2, 5 → 3, 6 → 6, and what is its sign?',
    steps: [
     'Cycles: (1 4 2)(3 5)(6), so 3 cycles on 6 symbols.',
     '(1 4 2) = (1 2)(1 4) needs 2, (3 5) needs 1 and (6) needs none: 2 + 1 + 0 = 3, which is 6 − 3.',
     '3 is odd, so the move is odd.'
    ],
    answer: '3 transpositions; an odd permutation, sign −1.'
   },
   pitfalls: [
    'Counting a cycle of length L as L transpositions. A 3-cycle needs 2 swaps, not 3.',
    'Forgetting the fixed points when using n minus the number of cycles: each fixed point is a cycle.',
    'Taking an odd cycle length to mean an odd permutation. A 3-cycle is even: it is 2 transpositions.'
   ]
  },
  guidance: [
   { prompt: 'Write the move in cycle notation. How many cycles are there, fixed points included?', answer: [2], labels: ['number of cycles'], explanation: 'The move is (1 3 6 2 5)(4 7), which has 2 cycles.' },
   { prompt: 'Each cycle of length L needs L − 1 transpositions. How many transpositions is that in all?', answer: [5], labels: ['transpositions'], explanation: '4 + 1 = 5, the same as 7 sockets minus 2 cycles.' },
   { prompt: '5 transpositions: is that even or odd? Enter the sign, 1 for even or −1 for odd.', answer: [-1], labels: ['sign'], explanation: '5 is odd, so the move is an odd permutation with sign −1.' }
  ]
 },
 {
  id: 'q15', title: 'Every way to reseat the free bolts', topic: 'Counting Sₙ and Aₙ', tier: 'Intermediate', sector: 'Hatch Hall',
  brief: 'Some of a hatch’s bolts are welded, and the crew wants to know how many bolt moves are left to test, how many are even and how many are single swaps.',
  lesson: 'The symmetric group Sₙ has n! elements, the alternating group Aₙ of even permutations has n! ÷ 2, and there are n(n − 1) ÷ 2 transpositions.',
  prompt: 'A hatch has 9 bolt sockets, but 4 of the bolts are welded in place. The other 5 bolts can be lifted and dropped back into their own 5 sockets in any order, one bolt per socket, and each such rearrangement is a permutation of those 5 sockets. Enter how many rearrangements there are (the one that moves nothing counts), then how many of them are even permutations, then how many of them are transpositions. Type each number without commas.',
  answer: [120, 60, 10], labels: ['rearrangements', 'even rearrangements', 'transpositions'], tolerance: 0.01,
  hints: [
   'The first free bolt has n sockets to choose from, the next n − 1, and so on: n! = n × (n − 1) × … × 1 rearrangements of n bolts.',
   'Exactly half the permutations of n ≥ 2 symbols are even. A transposition is fixed by the pair of sockets it swaps: n(n − 1) ÷ 2 pairs.'
  ],
  solution: 'Only the 5 free bolts move, so the rearrangements form the symmetric group S₅, with 5! = 5 × 4 × 3 × 2 × 1 = 120 elements. Half of them are even, so the alternating group A₅ has 120 ÷ 2 = 60 elements. A transposition swaps 2 of the 5 sockets: 5 × 4 ÷ 2 = 10 pairs.',
  xp: 150, prereqs: ['q14'],
  artifact: { name: 'Move census', description: 'The count of every bolt move, the even ones and the single swaps.' },
  sources: [cite(source.s5_1, 'The symmetric group Sₙ, the alternating group Aₙ and the theorem that Aₙ has half the elements of Sₙ. The count of transpositions is worked out in this mission.')],
  teaching: {
   intuition: 'All the permutations of n symbols, combined by composition, form a group called the symmetric group Sₙ. How many are there? Place the symbols one at a time: the first can go to any of n places, the second to any of the n − 1 left, then n − 2, and so on down to 1. So there are n × (n − 1) × … × 2 × 1 of them. That product is called n factorial and written n!; for example 4! = 4 × 3 × 2 × 1 = 24. The even permutations form a smaller group inside Sₙ, the alternating group Aₙ, and for n ≥ 2 it holds exactly half of Sₙ: n! ÷ 2. The reason is that composing with one fixed transposition, say (1 2), turns every even permutation into an odd one and back again, pairing them off one to one. Finally, a transposition is fixed by the pair of symbols it swaps. Choose the first of the pair in n ways and the second in n − 1 ways, but each pair is then counted twice, so there are n(n − 1) ÷ 2 transpositions.',
   steps: [
    'Work out how many symbols really move: here, the bolts that are not welded.',
    'The number of permutations of n symbols is n! = n × (n − 1) × … × 1.',
    'Halve it for the even ones, the elements of Aₙ.',
    'The number of transpositions is n × (n − 1) ÷ 2.'
   ],
   example: {
    prompt: 'A small hatch has 4 bolts and none is welded. Count its bolt moves, the even ones and the transpositions.',
    steps: [
     '4! = 4 × 3 × 2 × 1 = 24 moves: the group S₄.',
     'Half are even: 24 ÷ 2 = 12, the group A₄.',
     'Pairs of sockets: 4 × 3 ÷ 2 = 6 transpositions.'
    ],
    answer: '24 moves, 12 even, 6 transpositions.'
   },
   pitfalls: [
    'Using all the sockets when some bolts never move. Only the free bolts are rearranged.',
    'Counting each transposition twice: (1 2) and (2 1) are the same swap.',
    'Forgetting the identity, the move that changes nothing. It is one of the n! and it is even.'
   ]
  },
  guidance: [
   { prompt: 'How many rearrangements of the 5 free bolts are there? Work out 5!.', answer: [120], labels: ['rearrangements'], explanation: '5! = 5 × 4 × 3 × 2 × 1 = 120. The 4 welded bolts add nothing: they never move.' },
   { prompt: 'Exactly half of these are even permutations. How many is that?', answer: [60], labels: ['even rearrangements'], explanation: '120 ÷ 2 = 60, the size of the alternating group A₅.' },
   { prompt: 'A transposition swaps one pair of the 5 sockets. How many pairs are there?', answer: [10], labels: ['transpositions'], explanation: 'The first socket of the pair can be any of 5 and the second any of the other 4, but that counts each pair twice: 5 × 4 ÷ 2 = 10.' }
  ]
 },
 {
  id: 'q16', title: 'Turn and flip the hexagonal hatch', topic: 'Dihedral groups: turning and flipping a polygon', tier: 'Intermediate', sector: 'Hatch Hall',
  brief: 'A polygon hatch only seals when it is turned or flipped onto its own frame, and the crew must track where each corner ends up.',
  lesson: 'The dihedral group Dₙ is the 2n symmetries of a regular n-gon: n turns and n flips. With marks 0 to n − 1, a turn by r sends p to p + r and the flip sends p to −p, mod n.',
  prompt: 'A hatch is a regular polygon with 6 corners. Marks 0 to 5 are painted on the frame at the corner positions, going anticlockwise, and they never move. A turn by r steps moves every corner r marks anticlockwise, so the corner at mark p goes to mark (p + r) mod 6. The flip turns the hatch over across the line through the centre and mark 0, so the corner at mark p goes to mark (−p) mod 6, which is 6 − p, while mark 0 stays put. Enter the number of symmetries in the dihedral group D₆ (all the turns, the turn by 0 included, and all the flips), then the mark where the corner that starts at mark 4 ends up after a turn by 3 steps followed by the flip.',
  answer: [12, 5], labels: ['symmetries in the group', 'final mark'], tolerance: 0.01,
  hints: [
   'Dₙ has n turns, counting the turn by 0, and n flips.',
   'Do the turn first: add r and take the remainder mod n. Then flip: subtract that mark from n, unless it is 0.'
  ],
  solution: 'D₆ has 6 turns and 6 flips, so |D₆| = 2 × 6 = 12. The turn takes mark 4 to (4 + 3) mod 6 = 1. The flip then takes mark 1 to 6 − 1 = 5.',
  xp: 150, prereqs: ['q12'],
  artifact: { name: 'Hatch symmetry wheel', description: 'Every turn and flip of a polygon hatch, with the corner marks they move.' },
  sources: [cite(source.s5_2, 'The dihedral group Dₙ of the 2n rotations and reflections of a regular n-gon. The formulas with marks 0 to n − 1 are worked out in this mission.')],
  teaching: {
   intuition: 'A regular polygon with n corners fits its frame in exactly 2n ways. It can be turned by 0, 1, 2, … or n − 1 steps, where one step carries each corner to the next corner position: that is n turns, the turn by 0 being the identity. Or it can be turned over, a flip across one of its n lines of symmetry: n flips. These 2n moves, combined by doing one after the other, form the dihedral group Dₙ, and its number of elements, written |Dₙ|, is 2n. To track the moves, paint marks 0 to n − 1 on the frame, anticlockwise, at the corner positions. A turn by r steps anticlockwise sends the corner at mark p to mark (p + r) mod n. The flip across the line through the centre and mark 0 sends mark p to mark (−p) mod n, which is n − p, and leaves mark 0 where it is. Each symmetry is a permutation of the corners, so composing them works just as for bolt moves: follow one corner through the moves in order.',
   steps: [
    '|Dₙ| = 2n: n turns, the turn by 0 included, and n flips.',
    'For a turn by r steps, add r to the mark and take the remainder mod n.',
    'For the flip, replace a mark p by n − p; mark 0 stays.',
    'For several moves, apply them one at a time in the order they are done.'
   ],
   example: {
    prompt: 'A pentagon hatch (5 corners). Find |D₅| and where the corner at mark 1 ends after a turn by 2 steps then the flip.',
    steps: [
     '|D₅| = 2 × 5 = 10.',
     'The turn: (1 + 2) mod 5 = 3.',
     'The flip: 5 − 3 = 2.'
    ],
    answer: '|D₅| = 10, and the corner ends at mark 2.'
   },
   pitfalls: [
    'Counting only the turns, or forgetting the turn by 0. Dₙ has n turns and n flips.',
    'Doing the flip before the turn. Here the turn comes first, and the two orders usually give different marks.',
    'Leaving a mark as p + r when it reaches n or more. Take the remainder mod n.'
   ]
  },
  guidance: [
   { prompt: 'How many symmetries does D₆ have, turns and flips together?', answer: [12], labels: ['symmetries'], explanation: '6 turns (by 0, 1, …, 5 steps) and 6 flips make 12 symmetries.' },
   { prompt: 'After the turn by 3 steps, at which mark is the corner that started at mark 4?', answer: [1], labels: ['mark after the turn'], explanation: '4 + 3 = 7 = 1 × 6 + 1, so it is at mark 1.' },
   { prompt: 'Now the flip. Where does it send the corner at mark 1?', answer: [5], labels: ['mark after the flip'], explanation: 'The flip sends mark 1 to 6 − 1 = 5.' }
  ]
 },
 {
  id: 'q17', title: 'The locking routine', topic: 'Chapter review: symmetry moves and their matrices', tier: 'Intermediate', sector: 'Hatch Hall',
  brief: 'A hatch runs a fixed locking routine of turns and flips, and Mira needs where it sends a corner, whether it mirrors the hatch, and how often it must run to reset.',
  lesson: 'A routine of turns and flips is a turn when its matrix has determinant 1 and a flip when it has determinant −1; a flip has order 2 and a turn by t steps has order n ÷ gcd(t, n).',
  prompt: 'A hatch is a regular polygon with 10 corners, and marks 0 to 9 are painted anticlockwise on the frame at the corner positions. A turn by r steps sends the corner at mark p to mark (p + r) mod 10; the flip across the line through the centre and mark 0 sends it to mark (−p) mod 10. A locking routine does these moves in order: flip, then turn by 4 steps, then flip. Enter the mark where the corner that starts at mark 3 ends up, then the determinant of the 2 × 2 matrix of the whole routine (1 or −1), then the order of the routine: the smallest number of times it must be repeated to bring every corner back to its own mark.',
  answer: [9, 1, 5], labels: ['final mark', 'determinant', 'order'], tolerance: 0.01,
  hints: [
   'Follow the one corner through the moves in order, taking the remainder mod n after each one.',
   'A turn’s matrix has determinant 1 and the flip’s has −1, and determinants multiply. A routine with determinant −1 is a flip, of order 2; one with determinant 1 is a turn by some number of steps t, of order n ÷ gcd(t, n).'
  ],
  solution: 'The corner goes 3 → 7 → 1 → 9, so it ends at mark 9. The determinant is (−1) × 1 × (−1) = 1. So the routine is a turn. It sends every mark p to p − 4, a turn by 6 steps (mod 10), and its order is 10 ÷ gcd(6, 10) = 10 ÷ 2 = 5.',
  xp: 150, prereqs: ['q15', 'q16'],
  artifact: { name: 'Routine card', description: 'A locking routine of turns and flips, with its determinant and how often it repeats.' },
  sources: [cite(source.s5_2, 'The rotations and reflections in Dₙ and how they combine. Their matrices and determinants are worked out in this mission from Linear algebra.'), cite(source.s5_1, 'Permutations, their composition and the order of a permutation.')],
  teaching: {
   intuition: 'Every symmetry of a polygon hatch moves the plane, so it has a 2 × 2 matrix, as in Linear algebra. Put the centre at the origin and mark 0 on the positive x-axis. A turn through an angle θ has the rotation matrix with rows (cos θ, −sin θ) and (sin θ, cos θ), whose determinant is cos²θ + sin²θ = 1. The flip across the x-axis has rows (1, 0) and (0, −1), with determinant −1. The matrix of a routine is the product of the matrices of its moves, and the determinant of a product is the product of the determinants. So a routine’s determinant is the product of one −1 for each flip: 1 when it has an even number of flips, −1 when it has an odd number. A symmetry with determinant 1 keeps the hatch face up, so it is a turn; one with determinant −1 has turned it over, so it is a flip. That fixes the order. A flip done twice is the identity, so every flip has order 2. A turn by t steps is like adding t in Zₙ, so its order is n ÷ gcd(t, n).',
   steps: [
    'Follow one corner through the moves in order: add r for a turn, replace p by n − p for the flip, and take remainders mod n.',
    'Multiply −1 for each flip and 1 for each turn: that is the determinant of the routine.',
    'Determinant −1: the routine is a flip, of order 2.',
    'Determinant 1: find how far the routine turns every mark, t steps, and the order is n ÷ gcd(t, n).'
   ],
   example: {
    prompt: 'A hatch with 6 corners runs: flip, then turn by 2 steps, then flip. Where does the corner at mark 1 go, and what are the determinant and the order of the routine?',
    steps: [
     'The corner: 1 → 5 (flip) → 1 (turn by 2) → 5 (flip). It ends at mark 5.',
     'Two flips: (−1) × 1 × (−1) = 1, so the routine is a turn.',
     'Every mark p goes to p − 2, a turn by 4 steps mod 6; its order is 6 ÷ gcd(4, 6) = 6 ÷ 2 = 3.'
    ],
    answer: 'Mark 5, determinant 1, order 3.'
   },
   pitfalls: [
    'Confusing the determinant with the sign of the move as a permutation of the corners. A square’s flip across the line through the midpoints of two opposite sides swaps two pairs of corners, an even permutation, yet its matrix has determinant −1.',
    'Thinking two flips make a flip. Their determinants multiply to 1, so two flips make a turn.',
    'Giving n as the order of every turn. A turn by t steps has order n ÷ gcd(t, n), which is smaller when t and n share a factor.'
   ]
  },
  guidance: [
   { prompt: 'Follow the corner that starts at mark 3 through the moves. At which mark does it end?', answer: [9], labels: ['final mark'], explanation: 'Move by move: 3 → 7 → 1 → 9.' },
   { prompt: 'The routine has 2 flips. Each flip has determinant −1, each turn 1, and determinants multiply. What is the determinant of the routine?', answer: [1], labels: ['determinant'], explanation: '(−1) × 1 × (−1) = 1.' },
   { prompt: 'A routine with determinant 1 is a turn; this one is a turn by 6 steps. What is its order, 10 ÷ gcd(6, 10)?', answer: [5], labels: ['order'], explanation: 'gcd(6, 10) = 2, so the order is 10 ÷ 2 = 5.' }
  ]
 },
 {
  id: 'q18', title: 'Wheels inside the sorting wheel', topic: 'Subgroups of a cyclic group', tier: 'Intermediate', sector: 'Sorting Depot',
  brief: 'The depot’s sorting wheel can be set to visit only some of its slots, and the crew wants to know every such setting and how many slots each one reaches.',
  lesson: 'A subgroup is a subset that is a group under the same operation; Zₙ has exactly one subgroup of each size d that divides n, and ⟨a⟩ has n ÷ gcd(a, n) elements.',
  prompt: 'A sorting wheel at the depot has 36 slots numbered 0 to 35, and turning it on by k slots is adding k mod 36, so its moves form the group Z₃₆. A subgroup is a set of these moves that is a group by itself under the same addition. Enter the number of subgroups of Z₃₆, then the size of ⟨15⟩, the subgroup made by adding 15 again and again.',
  answer: [9, 12], labels: ['number of subgroups', 'size of ⟨a⟩'], tolerance: 0.01,
  hints: [
   'Zₙ has exactly one subgroup for each divisor d of n, the one with d elements. So count the divisors of n, 1 and n included.',
   'Adding a again and again lands on the multiples of gcd(a, n), so ⟨a⟩ has n ÷ gcd(a, n) elements.'
  ],
  solution: 'The divisors of 36 are 1, 2, 3, 4, 6, 9, 12, 18 and 36, so Z₃₆ has 9 subgroups, one of each of those sizes. gcd(15, 36) = 3, so ⟨15⟩ = ⟨3⟩ = {0, 3, 6, …, 33}, which has 36 ÷ 3 = 12 elements.',
  xp: 150, prereqs: ['q09'],
  artifact: { name: 'Subwheel list', description: 'Every smaller wheel hidden in the sorting wheel, one for each divisor.' },
  sources: [cite(source.s3_3, 'Subgroups and the tests that show a subset of a group is a subgroup.'), cite(source.s4_1, 'Cyclic subgroups ⟨a⟩, the subgroups of a cyclic group and the size of ⟨a⟩ in Zₙ. Counting the subgroups by the divisors of n is worked out in this mission.')],
  teaching: {
   intuition: 'A subgroup of a group G is a subset H that is a group by itself under the same operation: combining two elements of H stays in H, the identity is in H, and the inverse of each element of H is in H. In Zₙ, the numbers 0 to n − 1 under adding mod n, the subgroup ⟨a⟩ is everything you reach by adding a again and again: 0, a, 2a, … mod n. Adding a lands exactly on the multiples of g = gcd(a, n), the largest number dividing both a and n, so ⟨a⟩ = ⟨g⟩ = {0, g, 2g, …, n − g}, with n ÷ g elements. Every subgroup of a cyclic group is cyclic, so every subgroup of Zₙ is one of these ⟨g⟩. Its size n ÷ g is a divisor of n, and different divisors g give different sizes. So Zₙ has exactly one subgroup for each divisor d of n, the one with d elements, and the number of subgroups is the number of divisors of n, counting 1 (the subgroup {0}) and n (the whole group).',
   steps: [
    'List the divisors of n, 1 and n included. Their count is the number of subgroups of Zₙ.',
    'For ⟨a⟩, work out g = gcd(a, n).',
    '⟨a⟩ is the multiples of g below n, so it has n ÷ g elements.'
   ],
   example: {
    prompt: 'How many subgroups does Z₂₀ have, and how many elements are in ⟨8⟩?',
    steps: [
     'The divisors of 20 are 1, 2, 4, 5, 10 and 20: 6 of them, so 6 subgroups.',
     'gcd(8, 20) = 4, so ⟨8⟩ = ⟨4⟩ = {0, 4, 8, 12, 16}.',
     'That is 20 ÷ 4 = 5 elements: adding 8 gives 0, 8, 16, 4, 12 and then 0 again.'
    ],
    answer: '6 subgroups; ⟨8⟩ has 5 elements.'
   },
   pitfalls: [
    'Leaving out the divisors 1 and n. {0} and the whole of Zₙ are subgroups too.',
    'Taking n ÷ a as the size of ⟨a⟩. It is n ÷ gcd(a, n), and a need not divide n.',
    'Listing only the multiples of a below n, such as 0, 8 and 16 in Z₂₀, and stopping. Keep adding mod n until you are back at 0.'
   ]
  },
  guidance: [
   { prompt: 'List the divisors of 36, 1 and 36 included. How many are there?', answer: [9], labels: ['divisors'], explanation: '1, 2, 3, 4, 6, 9, 12, 18 and 36: 9 divisors, so 9 subgroups.' },
   { prompt: 'What is gcd(15, 36)?', answer: [3], labels: ['gcd'], explanation: '3 is the largest number that divides both 15 and 36.' },
   { prompt: 'What is the size of ⟨15⟩, which is 36 ÷ gcd(15, 36)?', answer: [12], labels: ['size of ⟨a⟩'], explanation: '36 ÷ 3 = 12: ⟨15⟩ is {0, 3, 6, …, 33}.' }
  ]
 },
 {
  id: 'q19', title: 'Racks of matching labels', topic: 'Cosets', tier: 'Intermediate', sector: 'Sorting Depot',
  brief: 'The depot sorts its labelled parts into racks that all match one pattern, and the crew needs the number of racks and the lowest label on one of them.',
  lesson: 'A coset a + H adds a to every element of H; the cosets of H are equal or share nothing, each has |H| elements, and in Zₙ the cosets of ⟨d⟩ are the d remainder classes mod d.',
  prompt: 'The depot labels its parts 0 to 23 and adds labels mod 24, so the labels form the group Z₂₄. Rack H holds the subgroup ⟨6⟩ = {0, 6, 12, 18}. For a label a, the coset a + H is the set made by adding a to every element of H, mod 24, and each coset fills one rack. Enter the number of different cosets of H in Z₂₄, then the smallest label in the coset 17 + H.',
  answer: [6, 5], labels: ['number of cosets', 'smallest label in the coset'], tolerance: 0.01,
  hints: [
   'Two cosets are either the same set or share nothing, and each has as many elements as H. So the number of cosets is the size of the whole group divided by the size of H.',
   'Every element of a + H differs from a by a multiple of d. Take away d again and again, staying at 0 or above: the smallest element is the remainder of a ÷ d.'
  ],
  solution: 'H = ⟨6⟩ has 24 ÷ 6 = 4 elements. The cosets do not overlap and each has 4 elements, so there are 24 ÷ 4 = 6 of them: 0 + H, 1 + H, …, 5 + H. 17 = 2 × 6 + 5, so the smallest label in 17 + H is 5.',
  xp: 150, prereqs: ['q18'],
  artifact: { name: 'Coset racks', description: 'A stock of labels sorted into equal racks that never overlap.' },
  sources: [cite(source.s6_1, 'Left and right cosets of a subgroup, and how they split a group into equal pieces that do not overlap.')],
  teaching: {
   intuition: 'Take a subgroup H of a group and add one element a to every element of H. The set you get, a + H, is called a coset of H. (When the group multiplies, the coset is written aH.) In Z₁₂ with H = ⟨4⟩ = {0, 4, 8}, the coset 1 + H is {1, 5, 9} and 2 + H is {2, 6, 10}. Cosets behave like racks in a depot. Each has exactly as many elements as H, two cosets are either the same set or share no element, and every element a lies in its own coset a + H. So the cosets split the group into equal pieces that do not overlap, and the number of cosets is |G| ÷ |H|, where |G| is the number of elements of G. In Zₙ, when d divides n, the coset a + ⟨d⟩ holds exactly the numbers that leave the same remainder as a when divided by d. So there are d cosets, and the smallest element of a + ⟨d⟩ is the remainder of a ÷ d.',
   steps: [
    'Find the size of H: ⟨d⟩ in Zₙ has n ÷ d elements.',
    'The number of cosets is the size of the group divided by the size of H.',
    'The coset a + ⟨d⟩ contains a, a − d, a − 2d, …; its smallest element is the remainder of a ÷ d.'
   ],
   example: {
    prompt: 'In Z₁₂ with H = ⟨4⟩ = {0, 4, 8}, how many cosets are there, and what is the smallest element of 9 + H?',
    steps: [
     'H has 12 ÷ 4 = 3 elements, so there are 12 ÷ 3 = 4 cosets: 0 + H, 1 + H, 2 + H and 3 + H.',
     '9 + H = {9, 13 mod 12, 17 mod 12} = {9, 1, 5}.',
     'Its smallest element is 1, the remainder of 9 ÷ 4.'
    ],
    answer: '4 cosets; the smallest element of 9 + H is 1.'
   },
   pitfalls: [
    'Giving the size of a coset, n ÷ d, as the number of cosets, d.',
    'Taking the remainder of a ÷ n instead of a ÷ d. The coset is fixed by the remainder mod d.',
    'Counting a + H and a + d + H as different cosets. They are the same rack.'
   ]
  },
  guidance: [
   { prompt: 'How many elements does H = ⟨6⟩ have?', answer: [4], labels: ['size of H'], explanation: 'The multiples of 6 below 24: 24 ÷ 6 = 4 of them.' },
   { prompt: 'The cosets split Z₂₄ into racks of 4 labels each, with no overlap. How many cosets are there?', answer: [6], labels: ['number of cosets'], explanation: '24 labels in racks of 4: 24 ÷ 4 = 6 cosets.' },
   { prompt: 'Take 6 away from 17 as often as you can without going below 0. What is the smallest label in 17 + H?', answer: [5], labels: ['smallest label'], explanation: '17 = 2 × 6 + 5, so the smallest label in 17 + H is 5.' }
  ]
 },
 {
  id: 'q20', title: 'Batches that must divide evenly', topic: 'Lagrange’s theorem', tier: 'Intermediate', sector: 'Sorting Depot',
  brief: 'Before building a new batch rule for the sorting robot, Mira wants to know how many batches its moves split into and which batch sizes are even possible.',
  lesson: 'Lagrange’s theorem: in a finite group G the size of every subgroup H divides |G|, and the index [G : H] = |G| ÷ |H| is the number of cosets.',
  prompt: 'A sorting robot’s moves form a group G with 60 moves, and the moves that keep a crate upright form a subgroup H with 12 moves. Enter the index [G : H], the number of cosets of H in G, then 1 if Lagrange’s theorem allows G to have a subgroup with 8 moves, or 0 if the theorem rules one out. (Allowed is not the same as certain: the theorem can only rule sizes out.)',
  answer: [5, 0], labels: ['index', 'size allowed (1 or 0)'], tolerance: 0.01,
  hints: [
   'The cosets of H split G into equal batches of |H| moves, so the index [G : H] is |G| ÷ |H|.',
   'Lagrange’s theorem: the size of every subgroup divides the size of the group. A size that does not divide |G| is ruled out.'
  ],
  solution: 'The cosets of H split the 60 moves into batches of 12, so [G : H] = 60 ÷ 12 = 5. 60 = 7 × 8 + 4, so 8 does not divide 60 and Lagrange’s theorem rules out a subgroup of 8 moves.',
  xp: 150, prereqs: ['q19'],
  artifact: { name: 'Batch size rule', description: 'The one test every subgroup size must pass: it divides the size of the group.' },
  sources: [cite(source.s6_2, 'Lagrange’s theorem, the index [G : H] and what the theorem says about the sizes of subgroups.')],
  teaching: {
   intuition: 'The cosets of a subgroup H split a finite group G into pieces that do not overlap, each with exactly |H| elements. So |G| is |H| times the number of cosets. The number of cosets is called the index of H in G, written [G : H], and [G : H] = |G| ÷ |H|. This gives Lagrange’s theorem: the size of every subgroup of a finite group divides the size of the group. A group with 18 elements can only have subgroups of sizes 1, 2, 3, 6, 9 and 18; a subgroup of 4 elements is impossible, because 4 does not divide 18. The theorem only works one way. It rules sizes out, but it never promises that a subgroup of an allowed size exists: the group A₄ of the 12 even rearrangements of 4 symbols has no subgroup of 6 elements, although 6 divides 12. For a cyclic group Zₙ every divisor does have its subgroup, but that is a special property of cyclic groups.',
   steps: [
    'The index [G : H] is |G| ÷ |H|, the number of cosets of H.',
    'To test a size m, divide |G| by m and look at the remainder.',
    'Remainder 0: Lagrange’s theorem allows a subgroup of size m. Any other remainder: it rules one out.'
   ],
   example: {
    prompt: 'A group G has 24 elements and a subgroup H with 6. Find [G : H], and say whether Lagrange’s theorem allows subgroups of 9 and of 8 elements.',
    steps: [
     '[G : H] = 24 ÷ 6 = 4.',
     '24 = 2 × 9 + 6, so 9 does not divide 24: a subgroup of 9 elements is ruled out.',
     '24 = 3 × 8, so 8 divides 24: a subgroup of 8 elements is allowed.'
    ],
    answer: 'Index 4; 9 is ruled out (0), 8 is allowed (1).'
   },
   pitfalls: [
    'Reading “allowed” as “guaranteed”. The theorem only rules sizes out; a group of 12 elements need not have a subgroup of 6.',
    'Dividing the wrong way: the index is |G| ÷ |H|, not |H| ÷ |G|.',
    'Testing whether m divides |H| instead of |G|. Every subgroup size must divide the size of the whole group.'
   ]
  },
  guidance: [
   { prompt: 'What is the index [G : H] = |G| ÷ |H|?', answer: [5], labels: ['index'], explanation: '60 ÷ 12 = 5: G splits into 5 cosets of H.' },
   { prompt: 'What is the remainder when 60 is divided by 8?', answer: [4], labels: ['remainder'], explanation: '60 = 7 × 8 + 4, so the remainder is 4.' },
   { prompt: 'Does Lagrange’s theorem allow a subgroup with 8 moves? Enter 1 for allowed or 0 for ruled out.', answer: [0], labels: ['allowed (1 or 0)'], explanation: '8 does not divide 60, so no subgroup of G can have 8 moves: 0.' }
  ]
 }
);
})();
