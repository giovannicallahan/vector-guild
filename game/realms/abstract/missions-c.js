/* Abstract algebra: patterns of moves missions, file c: q21–q30. Mission objects: docs/PACK-FORMAT.md §2 (every field), §2.1 (what the
   harness requires), §7 (answers). Generators: gen-c.js (build(canonical) reproduces the prompt, hints, solution
   and guidance here exactly); experiments: experiments-c.js; drill statements: variants-c.js; oracles:
   qa/realms/abstract/oracle-c.js. One author per file. The missions of this file (id, chapter, tier and XP, sector):
     q21  ch 4 Subgroups and cosets · Intermediate, 150 XP · sector 'Sorting Depot' · Euler's and Fermat's theorems [6.3]
     q22  ch 4 Subgroups and cosets · Intermediate, 150 XP · sector 'Sorting Depot' · Conjugates and normal subgroups [10.1]
     q23  ch 4 Subgroups and cosets · Intermediate, 150 XP · sector 'Sorting Depot' · Chapter review: subgroups, cosets and Lagrange [6.1, 6.2]
     q24  ch 5 Maps between groups · Intermediate, 150 XP · sector 'Relay Exchange' · Homomorphisms [11.1]
     q25  ch 5 Maps between groups · Intermediate, 150 XP · sector 'Relay Exchange' · Kernel and image [11.1]
     q26  ch 5 Maps between groups · Intermediate, 150 XP · sector 'Relay Exchange' · Isomorphisms [9.1, 9.2]
     q27  ch 5 Maps between groups · Intermediate, 150 XP · sector 'Relay Exchange' · Direct products [9.2]
     q28  ch 5 Maps between groups · Intermediate, 150 XP · sector 'Relay Exchange' · Quotient groups [10.1]
     q29  ch 5 Maps between groups · Intermediate, 150 XP · sector 'Relay Exchange' · Chapter review: the first isomorphism theorem [11.2]
     q30  ch 6 Groups in action · Advanced, 200 XP · sector 'Tile Studio' · Group actions and orbits [14.1] */
(function(){
'use strict';
/* Thomas W. Judson, Abstract Algebra: Theory and Applications (LibreTexts) sections, one entry per section the missions below cite. Open each page before you set `verified` to the
   date you saw it. Every mission needs at least one source whose title matches /^Judson, Abstract Algebra/ (Judson, Abstract Algebra).
   A title reads like: Judson, Abstract Algebra: Theory and Applications (LibreTexts) — 4.1 Cyclic Subgroups
   Link to the section page itself: https://math.libretexts.org/Bookshelves/Abstract_and_Geometric_Algebra/Abstract_Algebra%3A_Theory_and_Applications_(Judson)/<NN>%3A_<Chapter>/<N.MM>%3A_<Section> */
const source = {
 s6_1: { title: "Judson, Abstract Algebra: Theory and Applications (LibreTexts) — 6.1 Cosets", url: "https://math.libretexts.org/Bookshelves/Abstract_and_Geometric_Algebra/Abstract_Algebra%3A_Theory_and_Applications_(Judson)/06%3A_Cosets_and_Lagrange's_Theorem/6.01%3A_Cosets", description: "Left and right cosets, with the cosets of {0, 3} in Z₆, and the fact that the cosets of a subgroup split the group into disjoint pieces.", verified: "2026-11-28" },
 s6_2: { title: "Judson, Abstract Algebra: Theory and Applications (LibreTexts) — 6.2 Lagrange's Theorem", url: "https://math.libretexts.org/Bookshelves/Abstract_and_Geometric_Algebra/Abstract_Algebra%3A_Theory_and_Applications_(Judson)/06%3A_Cosets_and_Lagrange's_Theorem/6.02%3A_Lagrange's_Theorem", description: "Lagrange’s theorem: |G| ÷ |H| = [G : H], the number of cosets of H. Reducing ⟨a⟩ to ⟨gcd(a, n)⟩ is worked out in this mission.", verified: "2026-11-28" },
 s6_3: { title: "Judson, Abstract Algebra: Theory and Applications (LibreTexts) — 6.3 Fermat's and Euler's Theorems", url: "https://math.libretexts.org/Bookshelves/Abstract_and_Geometric_Algebra/Abstract_Algebra%3A_Theory_and_Applications_(Judson)/06%3A_Cosets_and_Lagrange's_Theorem/6.03%3A_Fermat's_and_Euler's_Theorems", description: "Euler’s φ-function as the count of numbers below n coprime to n, Euler’s theorem and Fermat’s little theorem. Reducing a large power with them is worked out in this mission.", verified: "2026-11-28" },
 s9_1: { title: "Judson, Abstract Algebra: Theory and Applications (LibreTexts) — 9.1 Definition and Examples", url: "https://math.libretexts.org/Bookshelves/Abstract_and_Geometric_Algebra/Abstract_Algebra%3A_Theory_and_Applications_(Judson)/09%3A_Isomorphisms/9.01%3A_Definition_and_Examples", description: "Isomorphisms as one-to-one, onto maps that keep the operation, and the theorem that a cyclic group of order n is isomorphic to Zₙ. That an isomorphism keeps orders is worked out in this mission.", verified: "2026-11-28" },
 s9_2: { title: "Judson, Abstract Algebra: Theory and Applications (LibreTexts) — 9.2 Direct Products", url: "https://math.libretexts.org/Bookshelves/Abstract_and_Geometric_Algebra/Abstract_Algebra%3A_Theory_and_Applications_(Judson)/09%3A_Isomorphisms/9.02%3A_Direct_Products", description: "Direct products of groups, the order of a pair as the lcm of the orders of its parts, and Zₘ × Zₙ ≅ Zₘₙ exactly when gcd(m, n) = 1. Finding the reading matched to a pair is worked out in this mission.", verified: "2026-11-28" },
 s10_1: { title: "Judson, Abstract Algebra: Theory and Applications (LibreTexts) — 10.1 Factor Groups and Normal Subgroups", url: "https://math.libretexts.org/Bookshelves/Abstract_and_Geometric_Algebra/Abstract_Algebra%3A_Theory_and_Applications_(Judson)/10%3A_Normal_Subgroups_and_Factor_Groups/10.01%3A_Factor_Groups_and_Normal_Subgroups", description: "Normal subgroups (gH = Hg, and gNg⁻¹ = N), the examples in S₃, every subgroup of an abelian group being normal, and factor (quotient) groups of cosets.", verified: "2026-11-28" },
 s11_1: { title: "Judson, Abstract Algebra: Theory and Applications (LibreTexts) — 11.1 Group Homomorphisms", url: "https://math.libretexts.org/Bookshelves/Abstract_and_Geometric_Algebra/Abstract_Algebra%3A_Theory_and_Applications_(Judson)/11%3A_Homomorphisms/11.01%3A_Group_Homomorphisms", description: "Homomorphisms, their kernel and image, and the kernel as a normal subgroup. The maps x ↦ kx mod n and when they are well defined are worked out in this mission.", verified: "2026-11-28" },
 s11_2: { title: "Judson, Abstract Algebra: Theory and Applications (LibreTexts) — 11.2 The Isomorphism Theorems", url: "https://math.libretexts.org/Bookshelves/Abstract_and_Geometric_Algebra/Abstract_Algebra%3A_Theory_and_Applications_(Judson)/11%3A_Homomorphisms/11.02%3A_The_Isomorphism_Theorms", description: "The first isomorphism theorem: G divided by the kernel of a homomorphism is isomorphic to its image.", verified: "2026-11-28" },
 s14_1: { title: "Judson, Abstract Algebra: Theory and Applications (LibreTexts) — 14.1 Groups Acting on Sets", url: "https://math.libretexts.org/Bookshelves/Abstract_and_Geometric_Algebra/Abstract_Algebra%3A_Theory_and_Applications_(Judson)/14%3A_Group_Actions/14.01%3A_Groups_Acting_on_Sets", description: "Group actions on a set, orbits and stabilisers. The turns of a ring of tiles are worked out in this mission.", verified: "2026-11-28" }
};
window.QUESTS = window.QUESTS || [];
window.QUESTS.push(
 {
  id: "q21", title: "The lock with a thousand turns", topic: "Euler’s and Fermat’s theorems", tier: "Intermediate", sector: "Sorting Depot",
  brief: "A depot lock has to be set to a power far too large to multiply out, and Mira wants the setting without a thousand multiplications.",
  lesson: "When a and n are coprime, a to the power φ(n) leaves remainder 1 mod n, so a power can be cut down to its remainder on division by φ(n).",
  prompt: "A depot lock is set by a code wheel that multiplies by 3 mod 34, and today’s setting is 3¹⁰⁰⁰ mod 34: 3 to the power 1000, divided by 34, keeping only the remainder. 3 and 34 are coprime. Enter φ(34), the number of whole numbers from 1 to 33 that are coprime to 34; then the remainder when 1000 is divided by φ(34); then 3¹⁰⁰⁰ mod 34.",
  answer: [16,8,33], labels: ["φ(n)","remainder of the power ÷ φ(n)","the setting"], tolerance: 0.01,
  hints: [
   "Euler’s theorem: when a and n are coprime, a to the power φ(n) leaves remainder 1 on division by n. So every full block of φ(n) in the power can be dropped.",
   "Write the power as a multiple of φ(n) plus a remainder r. Only r matters: the answer is a to the power r, mod n, which you reach by multiplying by a step by step and keeping the remainder each time."
  ],
  solution: "The numbers from 1 to 33 that are coprime to 34 are 1, 3, 5, 7, 9, 11, 13, 15, 19, 21, 23, 25, 27, 29, 31, 33, so φ(34) = 16. 1000 = 16 × 62 + 8, so the remainder is 8. By Euler’s theorem 3¹⁶ mod 34 = 1, so each of the 62 blocks of 16 in the power gives a factor that leaves 1, and 3¹⁰⁰⁰ mod 34 = 3⁸ mod 34. The powers of 3 mod 34 go 3, 9, 27, 13, 5, 15, 11, 33, so the answer is 33.",
  xp: 150, prereqs: ["q20","q10"],
  artifact: { name: "Shortcut card", description: "One line that turns a power in the thousands into a handful of multiplications." },
  sources: [source.s6_3, source.s6_2],
  teaching: {
   intuition: "Euler’s φ (the Greek letter phi) counts the numbers from 1 to n − 1 that are coprime to n. That is the size of U(n), the group of units mod n under multiplication. Lagrange’s theorem says the order of every element divides the size of its group, so the order of a in U(n) divides φ(n), and therefore a to the power φ(n) leaves remainder 1 on division by n. This is Euler’s theorem; it needs a and n to be coprime. When n is a prime p, φ(p) = p − 1, and the special case, a to the power p − 1 leaves 1 mod p, is Fermat’s little theorem. The use is a shortcut: every full block of φ(n) in a huge power multiplies in a factor that leaves 1, so only the remainder of the power on division by φ(n) matters.",
   steps: [
    "Check that a and n are coprime; Euler’s theorem needs it.",
    "Find φ(n): list the numbers from 1 to n − 1 that share no factor with n other than 1 and count them. For a prime p, φ(p) = p − 1.",
    "Divide the power k by φ(n): k = φ(n) × q + r, with the remainder r from 0 to φ(n) − 1.",
    "aᵏ mod n is the same as aʳ mod n. Multiply by a step by step, keeping only the remainder mod n each time, or use repeated squaring."
   ],
   example: {
    prompt: "Find 2¹⁰⁰³ mod 15, that is, 2 to the power 1003 divided by 15, keeping the remainder.",
    steps: [
     "2 and 15 are coprime. The numbers from 1 to 14 coprime to 15 are 1, 2, 4, 7, 8, 11, 13, 14, so φ(15) = 8.",
     "1003 = 8 × 125 + 3, so the remainder of the power is 3.",
     "By Euler’s theorem 2⁸ mod 15 = 1, so 2¹⁰⁰³ mod 15 = 2³ mod 15 = 8."
    ],
    answer: "2¹⁰⁰³ mod 15 = 8."
   },
   pitfalls: [
    "Reducing the power mod n instead of mod φ(n). The power is cut down by blocks of φ(n), because a to the power φ(n) is the one that leaves 1.",
    "Using the theorem when a and n share a factor. 2⁴ mod 8 is 0, not 1: Euler’s theorem only holds for a coprime to n.",
    "Taking φ(n) as n − 1 for every n. That is true only when n is prime; for other n count the coprime numbers."
   ]
  },
  guidance: [
   { prompt: "List the numbers from 1 to 33 that are coprime to 34. How many are there? That count is φ(34).", answer: [16], labels: ["φ(n)"], explanation: "They are 1, 3, 5, 7, 9, 11, 13, 15, 19, 21, 23, 25, 27, 29, 31, 33: 16 numbers, so φ(34) = 16." },
   { prompt: "Divide the power 1000 by φ(34) = 16. What is the remainder?", answer: [8], labels: ["remainder"], explanation: "16 × 62 = 992, and 1000 − 992 = 8. So 1000 = 16 × 62 + 8." },
   { prompt: "By Euler’s theorem 3¹⁶ mod 34 = 1, so only the remainder 8 of the power matters. What is 3⁸ mod 34?", answer: [33], labels: ["the setting"], explanation: "Multiply by 3 and keep the remainder mod 34 each time: 3, 9, 27, 13, 5, 15, 11, 33. So 3⁸ mod 34 = 33, and that is also 3¹⁰⁰⁰ mod 34." }
  ]
 },
 {
  id: "q22", title: "Relabelling the bin robot", topic: "Conjugates and normal subgroups", tier: "Intermediate", sector: "Sorting Depot",
  brief: "The depot robot’s slots are being renumbered, and the crew needs to know which of its programmes still make sense after any renumbering.",
  lesson: "The conjugate τ ∘ σ ∘ τ⁻¹ does σ’s move on slots relabelled by τ, and a subgroup is normal when every conjugate of its elements stays inside it.",
  prompt: "A depot robot rearranges the bins in five slots, numbered 1 to 5. Each move is written as where it sends each slot’s bin: σ: 1 → 3, 2 → 5, 3 → 4, 4 → 1, 5 → 2; τ: 1 → 2, 2 → 1, 3 → 4, 4 → 5, 5 → 3. Moves are combined right to left, so τ ∘ σ means σ first, then τ, and τ⁻¹ is the move that undoes τ. Enter (τ ∘ σ ∘ τ⁻¹)(4), the slot that τ⁻¹, then σ, then τ send slot 4 to. Then take S₃, the group of all six rearrangements of three slots, and its subgroup H = {identity, the swap of slots 1 and 2}. Enter 1 if H is a normal subgroup and 0 if it is not.",
  answer: [5,0], labels: ["(τ ∘ σ ∘ τ⁻¹)(i)","H normal (1 or 0)"], tolerance: 0.01,
  hints: [
   "Work from the right. τ⁻¹ sends a slot back to the slot that τ sends there. Then apply σ, then τ.",
   "H is normal when g h g⁻¹ is in H for every g in the group and every h in H. One g that takes some h outside H is enough to show H is not normal."
  ],
  solution: "τ sends 3 to 4, so τ⁻¹(4) = 3. Then σ(3) = 4 and τ(4) = 5, so (τ ∘ σ ∘ τ⁻¹)(4) = 5. For H in S₃, take g = the move 1 → 2, 2 → 3, 3 → 1. Conjugating relabels the slots, so g h g⁻¹ swaps g(1) = 2 and g(2) = 3: the swap of slots 2 and 3, which is not in H. So H is not normal: enter 0.",
  xp: 150, prereqs: ["q12","q19"],
  artifact: { name: "Relabelling chart", description: "One move seen through another: the same pattern on renamed slots." },
  sources: [source.s10_1],
  teaching: {
   intuition: "Suppose a move σ sends slot 2 to slot 5, and another move τ renames the slots. Then τ ∘ σ ∘ τ⁻¹ is σ seen through the renaming: first undo τ to get back to the old names, then do σ, then rename again. It sends τ(2) to τ(5). This new move is called the conjugate of σ by τ; with g in place of τ, the conjugate of h by g is g h g⁻¹. Here τ⁻¹ is the inverse of τ, the move that undoes it, and moves are combined right to left, so in τ ∘ σ the move σ happens first. A subgroup H of G is a normal subgroup when g h g⁻¹ is in H for every g in G and every h in H: no renaming can push its moves outside it. That is the same as gH = Hg for every g, so its left and right cosets agree. In a group where the order of combining never matters, every subgroup is normal, because g + h − g is just h.",
   steps: [
    "To find (τ ∘ σ ∘ τ⁻¹)(i), work from the right: τ⁻¹(i) is the slot that τ sends to i.",
    "Apply σ to that slot, then apply τ to the result.",
    "To test whether H is normal, take each h in H and each g in G and check that g h g⁻¹ is in H. A single g and h with g h g⁻¹ outside H shows H is not normal.",
    "Shortcuts: conjugating relabels, so g h g⁻¹ moves as many slots as h does; in a group where order never matters, every subgroup is normal."
   ],
   example: {
    prompt: "On four slots, σ: 1 → 2, 2 → 3, 3 → 1, 4 → 4 and τ: 1 → 4, 2 → 2, 3 → 3, 4 → 1. Find (τ ∘ σ ∘ τ⁻¹)(4).",
    steps: [
     "τ sends 1 to 4, so τ⁻¹(4) = 1.",
     "σ(1) = 2, and τ(2) = 2.",
     "Check with relabelling: σ sends 1 to 2, so the conjugate sends τ(1) = 4 to τ(2) = 2."
    ],
    answer: "(τ ∘ σ ∘ τ⁻¹)(4) = 2."
   },
   pitfalls: [
    "Working left to right. In τ ∘ σ ∘ τ⁻¹ the move on the right, τ⁻¹, happens first.",
    "Using τ in place of τ⁻¹. τ⁻¹(i) is the slot that τ sends to i, not the slot τ sends i to.",
    "Deciding H is normal after checking only one g. Every g in the group must keep every h of H inside H."
   ]
  },
  guidance: [
   { prompt: "Start on the right with τ⁻¹. Which slot does τ send to slot 4? That slot is τ⁻¹(4).", answer: [3], labels: ["τ⁻¹(i)"], explanation: "τ sends 3 to 4, so τ⁻¹ sends 4 back to 3." },
   { prompt: "Next apply σ. What is σ(3)?", answer: [4], labels: ["σ of it"], explanation: "σ sends 3 to 4." },
   { prompt: "Last apply τ. What is τ(4)? That is (τ ∘ σ ∘ τ⁻¹)(4).", answer: [5], labels: ["(τ ∘ σ ∘ τ⁻¹)(i)"], explanation: "τ sends 4 to 5, so (τ ∘ σ ∘ τ⁻¹)(4) = 5." },
   { prompt: "Now the subgroup: H = {identity, the swap of slots 1 and 2} in S₃. Is H normal? Enter 1 for yes, 0 for no.", answer: [0], labels: ["H normal (1 or 0)"], explanation: "For H in S₃, take g = the move 1 → 2, 2 → 3, 3 → 1. Conjugating relabels the slots, so g h g⁻¹ swaps g(1) = 2 and g(2) = 3: the swap of slots 2 and 3, which is not in H. So H is not normal: enter 0." }
  ]
 },
 {
  id: "q23", title: "Batches that tile the depot", topic: "Review: subgroups, cosets and Lagrange", tier: "Intermediate", sector: "Sorting Depot",
  brief: "A new stock of labelled parts has to be split into equal batches, and Mira wants the batch size, the number of batches and where one part belongs.",
  lesson: "In Zₙ, ⟨a⟩ = ⟨gcd(a, n)⟩ has n ÷ gcd(a, n) elements, its index is gcd(a, n), and a coset b + ⟨a⟩ is fixed by the remainder of b on division by gcd(a, n).",
  prompt: "The Sorting Depot labels its parts 0 to 35 and adds labels mod 36: the group Z₃₆. One batch is the subgroup ⟨8⟩, everything reached by adding 8 again and again. Enter the number of elements of ⟨8⟩, then its index in Z₃₆ (the number of cosets), then the smallest element of the coset 23 + ⟨8⟩.",
  answer: [9,4,3], labels: ["|⟨a⟩|","index","smallest element of the coset"], tolerance: 0.01,
  hints: [
   "The multiples of a mod n are exactly the multiples of gcd(a, n), so ⟨a⟩ = ⟨gcd(a, n)⟩, with n ÷ gcd(a, n) elements.",
   "By Lagrange’s theorem the index is |G| ÷ |H|. The coset b + ⟨g⟩ holds the numbers that leave the same remainder as b on division by g."
  ],
  solution: "gcd(8, 36) = 4, so ⟨8⟩ = ⟨4⟩ = {0, 4, 8, …, 32}, with 36 ÷ 4 = 9 elements. By Lagrange’s theorem the index is 36 ÷ 9 = 4. 23 leaves remainder 3 on division by 4, so the coset 23 + ⟨8⟩ holds 3, 7, 11 and so on, and its smallest element is 3.",
  xp: 150, prereqs: ["q20","q22"],
  artifact: { name: "Batch rack plan", description: "Equal racks that hold every part exactly once." },
  sources: [source.s6_1, source.s6_2],
  teaching: {
   intuition: "This mission puts the chapter together in one group, Zₙ. A subgroup made by one element a, written ⟨a⟩, is everything you reach by adding a again and again. Adding a keeps landing on multiples of gcd(a, n), the largest number that divides both, and in the end reaches all of them, so ⟨a⟩ is the same subgroup as ⟨gcd(a, n)⟩, with n ÷ gcd(a, n) elements. Its cosets b + ⟨a⟩ are equal batches that never overlap and cover the whole group. Lagrange’s theorem counts them: the index, the number of cosets, is |G| ÷ |H|, which here is gcd(a, n). A coset of ⟨g⟩ holds the numbers that leave one remainder on division by g, so its smallest element is that remainder.",
   steps: [
    "Find g = gcd(a, n). Then ⟨a⟩ = ⟨g⟩ = {0, g, 2g, …}.",
    "The size of ⟨a⟩ is n ÷ g.",
    "By Lagrange’s theorem the index is n divided by the size of ⟨a⟩, which is g.",
    "The coset b + ⟨a⟩ holds the numbers with the same remainder as b on division by g; its smallest element is that remainder."
   ],
   example: {
    prompt: "In Z₂₀, find the size of ⟨6⟩, its index and the smallest element of 7 + ⟨6⟩.",
    steps: [
     "gcd(6, 20) = 2, so ⟨6⟩ = ⟨2⟩ = {0, 2, 4, …, 18}, with 10 elements.",
     "The index is 20 ÷ 10 = 2: the even and the odd numbers.",
     "7 leaves remainder 1 on division by 2, so 7 + ⟨6⟩ is the odd numbers, starting at 1."
    ],
    answer: "10 elements, index 2, smallest element 1."
   },
   pitfalls: [
    "Taking the size of ⟨a⟩ as n ÷ a. That only works when a divides n; in general divide by gcd(a, n).",
    "Giving b itself as the smallest element of the coset. Subtract g as often as you can: the smallest element is b’s remainder on division by g.",
    "Mixing up the size of the subgroup and the index. Their product is n."
   ]
  },
  guidance: [
   { prompt: "What is gcd(8, 36), the largest whole number that divides both?", answer: [4], labels: ["gcd"], explanation: "4 divides 8 and 36, and no larger number divides both. So ⟨8⟩ = ⟨4⟩, and its number of cosets, the index, is 4." },
   { prompt: "⟨8⟩ = ⟨4⟩ holds 0, 4, 8 and so on below 36. How many elements is that?", answer: [9], labels: ["|⟨a⟩|"], explanation: "36 ÷ 4 = 9. Check with Lagrange: 9 × 4 = 36." },
   { prompt: "The coset 23 + ⟨8⟩ holds the labels that leave the same remainder as 23 on division by 4. What is its smallest element?", answer: [3], labels: ["smallest element"], explanation: "23 = 4 × 5 + 3, so the coset is 3, 7, 11 and so on, starting at 3." }
  ]
 },
 {
  id: "q24", title: "A relay between two dials", topic: "Homomorphisms", tier: "Intermediate", sector: "Relay Exchange",
  brief: "The Relay Exchange copies readings from one dial to another, and the crew must know whether the copy keeps the pattern of turns.",
  lesson: "A homomorphism φ keeps the operation: φ(x + y) = φ(x) + φ(y). The rule x ↦ kx mod n from Zₘ is one exactly when it is well defined, which is when n divides k × m.",
  prompt: "A relay passes readings from a 6-position dial, Z₆, to a 9-position dial, Z₉, by the rule φ(x) = 3x mod 9, used on the reading x from 0 to 5. Enter φ(4), then φ(5), then φ of the sum 4 + 5 worked out in Z₆. Then enter 1 if φ is well defined (the readings x and x + 6, which are the same position of the first dial, always give the same output), so that it is a homomorphism, and 0 if it is not.",
  answer: [3,6,0,1], labels: ["φ(a)","φ(b)","φ(a + b)","well defined (1 or 0)"], tolerance: 0.01,
  hints: [
   "A homomorphism keeps the pattern: φ(x + y) equals φ(x) + φ(y), the sum on the left worked out in the first dial and the sum on the right in the second.",
   "A reading x of the first dial is the same position as x + m. The rule is well defined exactly when k × m is a multiple of the size of the second dial, so that adding m to x never changes kx mod that size."
  ],
  solution: "φ(4) = 12 mod 9 = 3 and φ(5) = 15 mod 9 = 6. In Z₆, 4 + 5 = 9 − 6 = 3, and φ(3) = 9 mod 9 = 0. That matches φ(4) + φ(5) = 3 + 6, which is 0 mod 9. 3 × 6 = 18 is a multiple of 9, so adding 6 to a reading never changes the output: φ is well defined, and it is a homomorphism. Enter 1.",
  xp: 150, prereqs: ["q18"],
  artifact: { name: "Relay coupling", description: "A link between two dials that keeps every sum." },
  sources: [source.s11_1],
  teaching: {
   intuition: "A map between two groups is a rule that sends each element of the first to an element of the second. It is a homomorphism when it keeps the pattern of the operation: φ(x + y) = φ(x) + φ(y), where the sum on the left is worked out in the first group and the sum on the right in the second. Take the rule φ(x) = kx mod n from Zₘ to Zₙ. There is a catch. A reading of the m-position dial is a remainder, so x and x + m are the same position, and the rule must give them the same output. When it always does, the rule is called well defined. k(x + m) = kx + km, so it is well defined exactly when km is a multiple of n. Then φ keeps sums even when a sum wraps round past m, and φ is a homomorphism. When km is not a multiple of n, a wrap-around changes the output and the rule is no map from Zₘ at all.",
   steps: [
    "Work out each output: multiply the reading by k and take the remainder mod n.",
    "For a sum, add the readings in the first dial (mod m) first, then apply φ.",
    "Compare with φ(x) + φ(y) mod n. They agree for every x and y exactly when the rule is well defined.",
    "Test it in one step: the rule x ↦ kx mod n is well defined on Zₘ exactly when k × m is a multiple of n."
   ],
   example: {
    prompt: "Is x ↦ 2x mod 8 well defined on Z₄? Is x ↦ x mod 6 well defined on Z₄?",
    steps: [
     "2 × 4 = 8 is a multiple of 8, so x ↦ 2x mod 8 is well defined: φ(3) + φ(1) = 6 + 2 = 8, which is 0 mod 8, and φ(3 + 1) = φ(0) = 0.",
     "1 × 4 = 4 is not a multiple of 6. In Z₄, 3 + 1 = 0, and φ(0) = 0, but φ(3) + φ(1) = 4 mod 6."
    ],
    answer: "The first is well defined (a homomorphism); the second is not."
   },
   pitfalls: [
    "Adding the readings without wrapping round in the first dial. In Z₆, 4 + 5 is 3, not 9.",
    "Testing whether k divides n, or n divides k. The test is whether n divides k × m.",
    "Checking one sum that happens to match and calling the rule well defined. Use the k × m test, which covers every sum."
   ]
  },
  guidance: [
   { prompt: "What is φ(4) = 3 × 4 mod 9?", answer: [3], labels: ["φ(a)"], explanation: "3 × 4 = 12, which leaves 3 on division by 9." },
   { prompt: "What is φ(5) = 3 × 5 mod 9?", answer: [6], labels: ["φ(b)"], explanation: "3 × 5 = 15, which leaves 6 on division by 9." },
   { prompt: "Add on the first dial: what is 4 + 5 in Z₆?", answer: [3], labels: ["a + b in the first dial"], explanation: "4 + 5 = 9, which is 3 mod 6." },
   { prompt: "What is φ(3) = 3 × 3 mod 9?", answer: [0], labels: ["φ(a + b)"], explanation: "3 × 3 = 9, which leaves 0 on division by 9. Compare it with φ(4) + φ(5) = 9, which is 0 mod 9." },
   { prompt: "Is 3 × 6 a multiple of 9? Enter 1 if φ is well defined and 0 if it is not.", answer: [1], labels: ["well defined (1 or 0)"], explanation: "That matches φ(4) + φ(5) = 3 + 6, which is 0 mod 9. 3 × 6 = 18 is a multiple of 9, so adding 6 to a reading never changes the output: φ is well defined, and it is a homomorphism. Enter 1." }
  ]
 },
 {
  id: "q25", title: "What the relay loses", topic: "Kernel and image", tier: "Intermediate", sector: "Relay Exchange",
  brief: "A relay that multiplies readings sends several of them to the same output, and the crew wants to know how many are lost and how many outputs remain.",
  lesson: "The kernel of a homomorphism is everything it sends to the identity, and the image is everything it reaches; for x ↦ kx on Zₙ they have gcd(k, n) and n ÷ gcd(k, n) elements.",
  prompt: "A relay maps the 30-position dial Z₃₀ to itself by φ(x) = 12x mod 30, a homomorphism. Enter the number of elements of the kernel of φ (the readings it sends to 0), then the number of elements of the image of φ (the different outputs).",
  answer: [6,5], labels: ["|kernel|","|image|"], tolerance: 0.01,
  hints: [
   "kx mod n is 0 exactly when x is a multiple of n ÷ gcd(k, n). Count those multiples from 0 to n − 1.",
   "The outputs are exactly the multiples of gcd(k, n) below n. As a check, the kernel size times the image size is n."
  ],
  solution: "gcd(12, 30) = 6. 12x mod 30 is 0 exactly when x is a multiple of 30 ÷ 6 = 5, so the kernel is {0, 5, 10, 15, 20, 25}, with 6 elements. The outputs are the multiples of 6: the image is {0, 6, 12, 18, 24}, with 5 elements. And 6 × 5 = 30.",
  xp: 150, prereqs: ["q24"],
  artifact: { name: "Loss gauge", description: "A dial that counts the readings a relay squashes to zero." },
  sources: [source.s11_1],
  teaching: {
   intuition: "A homomorphism can squash several elements onto one. Two numbers describe how much. The kernel is the set of elements it sends to the identity, here the reading 0: what the relay cannot tell apart from nothing. The image is the set of all the outputs it actually reaches. Both are subgroups. For φ(x) = kx mod n on Zₙ, let g = gcd(k, n). kx is a multiple of n exactly when x is a multiple of n ÷ g, so the kernel is the multiples of n ÷ g, and there are g of them. The outputs are exactly the multiples of g, so the image has n ÷ g elements. The two sizes multiply to n: every output is reached by the same number of readings, the size of the kernel.",
   steps: [
    "Find g = gcd(k, n).",
    "The kernel is every x with kx mod n = 0: the multiples of n ÷ g from 0 to n − 1. It has g elements.",
    "The image is every output kx mod n: the multiples of g from 0 to n − 1. It has n ÷ g elements.",
    "Check: the kernel size times the image size is n."
   ],
   example: {
    prompt: "For φ(x) = 8x mod 12 on Z₁₂, find the kernel and the image.",
    steps: [
     "gcd(8, 12) = 4, so 8x is a multiple of 12 exactly when x is a multiple of 3: the kernel is {0, 3, 6, 9}, with 4 elements.",
     "The outputs are the multiples of 4: the image is {0, 4, 8}, with 3 elements. And 4 × 3 = 12."
    ],
    answer: "Kernel of 4 elements, image of 3 elements."
   },
   pitfalls: [
    "Leaving 0 out of the kernel. φ(0) = 0 always, so 0 is in every kernel.",
    "Counting the image as the multiples of k. Outputs are taken mod n, so they are the multiples of gcd(k, n).",
    "Swapping the two: the kernel has gcd(k, n) elements and the image has n ÷ gcd(k, n)."
   ]
  },
  guidance: [
   { prompt: "What is the smallest reading x, 1 or more, with 12x mod 30 = 0?", answer: [5], labels: ["smallest x in the kernel"], explanation: "gcd(12, 30) = 6, and 12 × 5 = 60 is a multiple of 30, while no smaller x works. That smallest x is 30 ÷ 6 = 5." },
   { prompt: "The kernel is every multiple of 5 from 0 to 29. How many elements does it have?", answer: [6], labels: ["|kernel|"], explanation: "The kernel is {0, 5, 10, 15, 20, 25}: 30 ÷ 5 = 6 elements." },
   { prompt: "The image is every multiple of 6 from 0 to 29. How many elements does it have?", answer: [5], labels: ["|image|"], explanation: "The image is {0, 6, 12, 18, 24}: 30 ÷ 6 = 5 elements, and 6 × 5 = 30." }
  ]
 },
 {
  id: "q26", title: "Two dials or one", topic: "Isomorphisms", tier: "Intermediate", sector: "Relay Exchange",
  brief: "Two coupled dials might do exactly the job of one bigger dial, and Mira wants to know before she orders the bigger one.",
  lesson: "An isomorphism is a one-to-one, onto homomorphism: the two groups have the same pattern under different names. Zₘ × Zₙ ≅ Zₘₙ exactly when gcd(m, n) = 1.",
  prompt: "Two dials, Z₄ and Z₆, are coupled into one relay whose states are the pairs (x, y): the direct product Z₄ × Z₆. Enter the number of states, then the largest order of any state, then 1 if Z₄ × Z₆ ≅ Z₂₄ (the coupled relay is a copy of one 24-position dial) and 0 if it is not.",
  answer: [24,12,0], labels: ["number of states","largest order","isomorphic (1 or 0)"], tolerance: 0.01,
  hints: [
   "The order of a pair is the lcm of the orders of its two parts: the first time both dials are home together. The largest order is the lcm of the two dial sizes.",
   "An isomorphism keeps every order, and a one-dial relay with N positions has a state of order N. So the product is a copy of one dial exactly when its largest order equals its number of states."
  ],
  solution: "There are 4 × 6 = 24 pairs. The order of a pair (x, y) is the lcm of the order of x, which divides 4, and the order of y, which divides 6, so no pair beats (1, 1), whose order is lcm(4, 6) = 24 ÷ 2 = 12. gcd(4, 6) = 2, so the largest order is 12, less than 24. Z₂₄ has an element of order 24 (the reading 1), and an isomorphism keeps every order, so the two are not isomorphic: enter 0.",
  xp: 150, prereqs: ["q25"],
  artifact: { name: "Coupling test", description: "One lcm that says whether two dials act as one." },
  sources: [source.s9_1, source.s9_2],
  teaching: {
   intuition: "Two groups are isomorphic, written ≅, when there is an isomorphism between them: a homomorphism that pairs their elements off one to one, with nothing left over on either side. Then they are the same pattern under different names, and every fact about one is a fact about the other; in particular matched elements have the same order. Couple two dials Zₘ and Zₙ: a state is a pair (x, y), and a step adds in each dial separately. This is the direct product Zₘ × Zₙ, with m × n states. A pair is home when both dials are home, so its order is the lcm of the orders of its parts. The lcm, or least common multiple, is the smallest positive number that both divide, and lcm(m, n) = m × n ÷ gcd(m, n). The largest order is lcm(m, n), reached by (1, 1). One dial Zₘₙ has a state of order m × n, the reading 1, so the coupled dials are a copy of it exactly when lcm(m, n) = m × n, which is when gcd(m, n) = 1.",
   steps: [
    "Count the states of Zₘ × Zₙ: m × n.",
    "Find gcd(m, n), and from it lcm(m, n) = m × n ÷ gcd(m, n). That is the order of (1, 1) and the largest order of any pair.",
    "Zₘₙ has an element of order m × n, and an isomorphism keeps orders.",
    "So Zₘ × Zₙ ≅ Zₘₙ exactly when the largest order is m × n, that is when gcd(m, n) = 1."
   ],
   example: {
    prompt: "Is Z₂ × Z₃ isomorphic to Z₆? Is Z₂ × Z₂ isomorphic to Z₄?",
    steps: [
     "In Z₂ × Z₃ the pair (1, 1) goes (1, 1), (0, 2), (1, 0), (0, 1), (1, 2), (0, 0): order 6 = lcm(2, 3), so it runs through all 6 states like the reading 1 on Z₆.",
     "In Z₂ × Z₂ every pair is home after 2 steps, so no element has order 4, while Z₄ has one."
    ],
    answer: "Z₂ × Z₃ ≅ Z₆; Z₂ × Z₂ is not isomorphic to Z₄."
   },
   pitfalls: [
    "Deciding from the number of states alone. Z₂ × Z₂ and Z₄ both have 4 elements but different patterns.",
    "Taking the largest order as m × n every time. It is lcm(m, n), which is smaller when m and n share a factor.",
    "Thinking an isomorphism must keep the names of the elements. It only has to keep the pattern of the operation."
   ]
  },
  guidance: [
   { prompt: "How many pairs (x, y) are there, with x from 0 to 3 and y from 0 to 5?", answer: [24], labels: ["number of states"], explanation: "4 choices of x times 6 choices of y: 24 states." },
   { prompt: "What is gcd(4, 6)?", answer: [2], labels: ["gcd"], explanation: "2 is the largest whole number that divides both 4 and 6." },
   { prompt: "What is the order of (1, 1): lcm(4, 6) = 4 × 6 ÷ gcd?", answer: [12], labels: ["order of (1, 1)"], explanation: "24 ÷ 2 = 12: after 12 steps both dials are home together for the first time. No state has a larger order." },
   { prompt: "Is Z₄ × Z₆ isomorphic to Z₂₄? Enter 1 for yes, 0 for no.", answer: [0], labels: ["isomorphic (1 or 0)"], explanation: "gcd(4, 6) = 2, so the largest order is 12, less than 24. Z₂₄ has an element of order 24 (the reading 1), and an isomorphism keeps every order, so the two are not isomorphic: enter 0." }
  ]
 },
 {
  id: "q27", title: "Reading a pair off one dial", topic: "Direct products", tier: "Intermediate", sector: "Relay Exchange",
  brief: "The relay stores each pair of dial readings as one reading of a big dial, and the crew needs to go between the two.",
  lesson: "In Zₘ × Zₙ the order of (x, y) is the lcm of the orders of x and y. When m and n are coprime, w ↦ (w mod m, w mod n) matches Zₘₙ with Zₘ × Zₙ.",
  prompt: "The relay pairs the dials Z₄ and Z₉; 4 and 9 are coprime, so Z₄ × Z₉ ≅ Z₃₆, with the reading w of the 36-position dial matched to the pair (w mod 4, w mod 9). Enter the order of the state (2, 5) in Z₄ × Z₉, then the reading w from 0 to 35 that is matched to it.",
  answer: [18,14], labels: ["order of the pair","matching reading w"], tolerance: 0.01,
  hints: [
   "The order of x in Zₙ is n ÷ gcd(x, n). The order of a pair is the lcm of the orders of its two parts.",
   "For w, list the numbers below the size of the big dial that leave the right remainder on division by the second dial size, and pick the one that also leaves the right remainder on division by the first."
  ],
  solution: "The order of 2 in Z₄ is 4 ÷ gcd(2, 4) = 2, and the order of 5 in Z₉ is 9 ÷ gcd(5, 9) = 9. So (2, 5) has order lcm(2, 9) = 18. The numbers below 36 that leave 5 on division by 9 are 5, 14, 23, 32; of these only 14 leaves 2 on division by 4, so w = 14.",
  xp: 150, prereqs: ["q26"],
  artifact: { name: "Pair decoder", description: "A table from one big dial to two small ones and back." },
  sources: [source.s9_2],
  teaching: {
   intuition: "In the direct product Zₘ × Zₙ the two parts of a pair move independently, each in its own dial. The order of x in Zₘ is m ÷ gcd(x, m), the order of y in Zₙ is n ÷ gcd(y, n), and the pair is home only when both parts are, so the order of (x, y) is the lcm of those two orders. When m and n are coprime, the last mission showed Zₘ × Zₙ ≅ Zₘₙ. A concrete isomorphism reads one big reading w as the pair of its remainders: w ↦ (w mod m, w mod n). Adding readings adds the remainders, so it keeps sums, and because m and n are coprime no two readings below m × n give the same pair. To go back from a pair (x, y) to w, list the numbers below m × n that leave y on division by n, and pick the one that leaves x on division by m.",
   steps: [
    "The order of x in Zₘ is m ÷ gcd(x, m); the order of y in Zₙ is n ÷ gcd(y, n).",
    "The order of (x, y) is the lcm of the two orders.",
    "To find the reading w matched to (x, y): list y, y + n, y + 2n and so on below m × n.",
    "Pick the number in the list that leaves remainder x on division by m."
   ],
   example: {
    prompt: "In Z₂ × Z₅, find the order of (1, 3) and the reading of Z₁₀ matched to it.",
    steps: [
     "1 has order 2 in Z₂ and 3 has order 5 in Z₅, so (1, 3) has order lcm(2, 5) = 10.",
     "The numbers below 10 that leave 3 on division by 5 are 3 and 8; 3 leaves 1 on division by 2."
    ],
    answer: "Order 10; the matched reading is 3."
   },
   pitfalls: [
    "Multiplying the two orders instead of taking their lcm. They agree only when the orders share no factor.",
    "Taking the order of x as m in every case. A reading that shares a factor with m comes home sooner.",
    "Stopping at the first number with the right remainder for one dial. w must leave the right remainder for both."
   ]
  },
  guidance: [
   { prompt: "What is the order of 2 in Z₄?", answer: [2], labels: ["order of x"], explanation: "4 ÷ gcd(2, 4) = 2: that many steps of 2 first bring the dial back to 0." },
   { prompt: "What is the order of 5 in Z₉?", answer: [9], labels: ["order of y"], explanation: "9 ÷ gcd(5, 9) = 9." },
   { prompt: "What is the order of the pair (2, 5), the lcm of 2 and 9?", answer: [18], labels: ["order of the pair"], explanation: "lcm(2, 9) = 18: the first number of steps after which both parts are home together." },
   { prompt: "The numbers below 36 that leave 5 on division by 9 are 5, 14, 23, 32. Which one leaves 2 on division by 4?", answer: [14], labels: ["w"], explanation: "14 = 4 × 3 + 2, so w mod 4 = 2 and w mod 9 = 5. The pair (2, 5) is matched to 14." }
  ]
 },
 {
  id: "q28", title: "Dials made of batches", topic: "Quotient groups", tier: "Intermediate", sector: "Relay Exchange",
  brief: "A coarse relay only reports which batch a reading falls in, and Mira wants to know how that coarse dial behaves.",
  lesson: "The cosets of a normal subgroup H form the quotient group G/H, added by adding representatives; Zₙ/⟨d⟩ has d elements and x + ⟨d⟩ has order d ÷ gcd(x, d).",
  prompt: "The relay groups the readings of Z₂₄ into the cosets of its subgroup H = ⟨8⟩ = {0, 8, 16}. Each coset is one element of the quotient group Z₂₄/H, and cosets are added by adding any one reading from each. Enter the number of elements of Z₂₄/H, then the order of the coset 6 + H in it.",
  answer: [8,4], labels: ["|Zₙ/H|","order of x + H"], tolerance: 0.01,
  hints: [
   "The cosets of H split all the readings into equal batches the size of H, so the number of cosets is the size of the group divided by the size of H.",
   "Adding the coset x + H to itself k times gives kx + H. That is H itself, the identity of the quotient group, exactly when kx is in H."
  ],
  solution: "H = ⟨8⟩ has 24 ÷ 8 = 3 elements, so the 24 readings split into 24 ÷ 3 = 8 cosets: Z₂₄/H has 8 elements. Adding 6 + H to itself k times gives k × 6 + H, which is H when k × 6 is a multiple of 8. The multiples of 6 go 6, 12, 18, 24, and 24 is the first that is a multiple of 8, so the order of 6 + H is 4. That is 8 ÷ gcd(6, 8) = 8 ÷ 2.",
  xp: 150, prereqs: ["q19","q25"],
  artifact: { name: "Coarse dial", description: "A dial whose positions are whole batches of readings." },
  sources: [source.s10_1],
  teaching: {
   intuition: "Sometimes we only care which batch a reading is in. The batches are the cosets of a subgroup H, and we can treat each coset as a single element. To add two cosets, add any reading from the first to any reading from the second and take the coset of the result: (x + H) + (y + H) = (x + y) + H. This gives the same answer whichever readings we pick exactly when H is a normal subgroup, and in Zₙ every subgroup is normal, because adding does not depend on order. The cosets with this addition form the quotient group G/H, read “G mod H”. Its identity is H itself, the coset of 0. For H = ⟨d⟩ in Zₙ, with d dividing n, H has n ÷ d elements, so there are d cosets, and Zₙ/⟨d⟩ behaves like a d-position dial: the order of x + H is the smallest k with kx a multiple of d, which is d ÷ gcd(x, d).",
   steps: [
    "The size of H = ⟨d⟩ in Zₙ is n ÷ d.",
    "The number of cosets, which is the size of Zₙ/H, is n divided by the size of H, that is d.",
    "Adding the coset x + H to itself k times gives kx + H, which is the identity H exactly when kx is a multiple of d.",
    "So the order of x + H is the smallest such k: d ÷ gcd(x, d)."
   ],
   example: {
    prompt: "In Z₁₈ with H = ⟨6⟩ = {0, 6, 12}, how many elements has Z₁₈/H, and what is the order of 4 + H?",
    steps: [
     "H has 3 elements, so there are 18 ÷ 3 = 6 cosets: 0 + H, 1 + H and so on up to 5 + H.",
     "The multiples of 4 go 4, 8, 12; 12 is the first in H, so 4 + H has order 3."
    ],
    answer: "Z₁₈/H has 6 elements, and 4 + H has order 3."
   },
   pitfalls: [
    "Giving the size of H as the size of the quotient. The quotient counts cosets, not the elements of one coset.",
    "Taking the order of x + H as the order of x in Zₙ. In the quotient, x only has to reach H, not 0.",
    "Forgetting that the identity of the quotient is H itself, not the coset 1 + H."
   ]
  },
  guidance: [
   { prompt: "How many elements does H = ⟨8⟩ have in Z₂₄?", answer: [3], labels: ["|H|"], explanation: "H = {0, 8, 16}: 24 ÷ 8 = 3 elements." },
   { prompt: "The cosets of H are batches of 3 readings that never overlap and cover all 24. How many cosets are there?", answer: [8], labels: ["|Zₙ/H|"], explanation: "24 ÷ 3 = 8, so Z₂₄/H has 8 elements, the cosets 0 + H to 7 + H." },
   { prompt: "What is the smallest k, 1 or more, for which 6 × k is a multiple of 8? That k is the order of 6 + H.", answer: [4], labels: ["order of x + H"], explanation: "The multiples of 6 go 6, 12, 18, 24, and 24 is the first that is a multiple of 8. So k = 4." }
  ]
 },
 {
  id: "q29", title: "The relay theorem", topic: "Review: the first isomorphism theorem", tier: "Intermediate", sector: "Relay Exchange",
  brief: "Before the Relay Exchange signs off, Mira wants every relay sized from its kernel alone, and one coupled relay timed.",
  lesson: "The first isomorphism theorem: for a homomorphism φ from G, G / kernel ≅ image, so |image| = |G| ÷ |kernel|.",
  prompt: "The relay sends Z₂₀ to Z₁₂ by φ(x) = 9x mod 12. It is a homomorphism, because 9 × 20 = 180 is a multiple of 12. Enter the number of elements of the kernel of φ, then the number of elements of its image. A second relay works on the pairs of Z₆ × Z₄: enter the order of (4, 2).",
  answer: [5,4,6], labels: ["|kernel|","|image|","order of the pair"], tolerance: 0.01,
  hints: [
   "The kernel holds the x from 0 to N − 1 with kx mod M = 0, which are the multiples of M ÷ gcd(k, M).",
   "The first isomorphism theorem says G / kernel ≅ image, so the image has |G| ÷ |kernel| elements. The order of a pair is the lcm of the orders of its parts."
  ],
  solution: "gcd(9, 12) = 3, so 9x mod 12 = 0 exactly when x is a multiple of 12 ÷ 3 = 4. From 0 to 19 these are 0, 4, 8, 12, 16: the kernel has 5 elements. By the first isomorphism theorem the image has 20 ÷ 5 = 4 elements. In the second relay, 4 has order 6 ÷ gcd(4, 6) = 3 in Z₆ and 2 has order 4 ÷ gcd(2, 4) = 2 in Z₄, so (4, 2) has order lcm(3, 2) = 6.",
  xp: 150, prereqs: ["q27","q28"],
  artifact: { name: "Relay certificate", description: "Kernel, image and quotient, signed off as one pattern." },
  sources: [source.s11_2, source.s9_2],
  teaching: {
   intuition: "A homomorphism φ from G sends every element of one coset of its kernel K to the same output: if x and y differ by an element of K, φ(x) and φ(y) differ by the identity. Different cosets go to different outputs. So the cosets of the kernel and the outputs in the image match one to one, and the match keeps the operation. That is the first isomorphism theorem: G/K ≅ image. Counting both sides gives the working rule: the image has |G| ÷ |K| elements, where |G| is the number of elements of G. So the size of what a relay can show follows from the size of what it loses. This mission also brings back the direct product: the order of a pair is the lcm of the orders of its parts.",
   steps: [
    "Find the kernel: the elements φ sends to the identity. For x ↦ kx mod M from an N-position dial these are the multiples of M ÷ gcd(k, M) below N.",
    "Count the kernel.",
    "By the first isomorphism theorem, |image| = |G| ÷ |kernel|.",
    "For a pair in a direct product, find the order of each part and take their lcm."
   ],
   example: {
    prompt: "φ(x) = 2x mod 8 sends Z₁₂ to Z₈ (2 × 12 = 24 is a multiple of 8). Find the sizes of its kernel and image.",
    steps: [
     "gcd(2, 8) = 2, so 2x mod 8 = 0 exactly when x is a multiple of 4: the kernel is {0, 4, 8}, with 3 elements.",
     "By the first isomorphism theorem the image has 12 ÷ 3 = 4 elements: indeed it is {0, 2, 4, 6}."
    ],
    answer: "Kernel of 3 elements, image of 4."
   },
   pitfalls: [
    "Dividing the size of the target group, not of G, by the kernel. The theorem counts the group the relay starts from.",
    "Listing kernel elements of N or more on an N-position dial. The kernel lives in the starting group.",
    "Taking the order of a pair as the product of the orders of its parts rather than their lcm."
   ]
  },
  guidance: [
   { prompt: "What is the smallest x, 1 or more, with 9x mod 12 = 0?", answer: [4], labels: ["smallest x in the kernel"], explanation: "gcd(9, 12) = 3, and the smallest such x is 12 ÷ 3 = 4: 9 × 4 = 36, a multiple of 12." },
   { prompt: "The kernel is the multiples of 4 from 0 to 19. How many are there?", answer: [5], labels: ["|kernel|"], explanation: "They are 0, 4, 8, 12, 16: 5 elements." },
   { prompt: "By the first isomorphism theorem, how many elements does the image have?", answer: [4], labels: ["|image|"], explanation: "|image| = |G| ÷ |kernel| = 20 ÷ 5 = 4. As a check, the image is the multiples of 3 in Z₁₂: {0, 3, 6, 9}." },
   { prompt: "What is the order of (4, 2) in Z₆ × Z₄?", answer: [6], labels: ["order of the pair"], explanation: "4 has order 3 and 2 has order 2, so the pair has order lcm(3, 2) = 6." }
  ]
 },
 {
  id: "q30", title: "Turning the tile ring", topic: "Group actions and orbits", tier: "Advanced", sector: "Tile Studio",
  brief: "The Tile Studio lays rings of coloured tiles round the dome, and Mira wants to know how many different-looking rings one design gives when the ring is turned.",
  lesson: "A group acts on a set when each of its elements moves each member of the set, in a way that respects the operation; the orbit of a member is everything it can be moved to.",
  prompt: "A dome ring has 8 tile slots, numbered clockwise. Reading clockwise from slot 1, its tiles are R B B Y R B B Y (R red, B blue, Y yellow). The 8 turns of the ring, by 0, 1, 2 and so on up to 7 slots, act on its colourings. Enter the size of the orbit of this colouring (how many different colourings the turns make from it), then how many of the 8 turns leave it unchanged.",
  answer: [4,2], labels: ["orbit size","turns that leave it unchanged"], tolerance: 0.01,
  hints: [
   "Turn the ring one slot at a time and watch for the first turn that brings back exactly the starting colours. The colourings seen before that turn are all different.",
   "If the first turn that brings the colouring back is by p slots, the turns that leave it unchanged are 0, p, 2p and so on, and the orbit holds p colourings."
  ],
  solution: "Turning the ring slot by slot, the colouring first comes back after a turn of 4 slots. So the turns by 0 to 3 slots give 4 different colourings, and every other turn repeats one of them: the orbit has 4 colourings. The turns that leave it unchanged are by 0, 4 slots: 2 of the 8. And 4 × 2 = 8.",
  xp: 200, prereqs: ["q16"],
  artifact: { name: "Ring stencil", description: "One design and every turn of it, laid side by side." },
  sources: [source.s14_1],
  teaching: {
   intuition: "The turns of a ring of n slots form a group: turning by r slots and then by s slots is a turn by r + s, mod n. These turns also move something else: the colourings of the tiles in the ring. When a group moves the members of a set like this, so that the turn by 0 moves nothing and doing one move after another is the same as doing their combination, we say the group acts on the set; this is a group action. The orbit of a colouring is the set of all colourings the turns can make from it. Count it by turning one slot at a time: the colouring first comes back after some turn p, the colourings before that are all different, and after it they repeat. So the orbit has p members, and the turns that leave the colouring unchanged are 0, p, 2p and so on, n ÷ p of them.",
   steps: [
    "Write the colouring as a list of colours read clockwise from slot 1.",
    "Turn by one slot at a time and find the first turn p, 1 or more, after which every slot shows its old colour again.",
    "The orbit has p colourings: the ones made by the turns by 0 to p − 1 slots.",
    "The turns that leave the colouring unchanged are the multiples of p below n: n ÷ p of them."
   ],
   example: {
    prompt: "A ring of 6 slots reads R B R B R B. How big is its orbit under the 6 turns?",
    steps: [
     "A turn by 1 slot gives B R B R B R, which is different. A turn by 2 slots gives R B R B R B again.",
     "So the orbit is the 2 colourings R B R B R B and B R B R B R, and the turns by 0, 2 and 4 slots leave it unchanged."
    ],
    answer: "Orbit of 2 colourings; 3 turns leave it unchanged."
   },
   pitfalls: [
    "Counting the turns, n, as the orbit size. A colouring that repeats round the ring has fewer different turns.",
    "Forgetting the turn by 0 slots among the turns that leave a colouring unchanged.",
    "Stopping at a turn that brings back some slots but not all of them. Every slot must show its old colour."
   ]
  },
  guidance: [
   { prompt: "What is the smallest turn, by 1 slot or more, that brings back the same colour in every slot? That number is the size of the orbit.", answer: [4], labels: ["orbit size"], explanation: "The pattern R B B Y R B B Y first comes back after a turn of 4 slots, so the turns by 0 to 3 slots make 4 different colourings: the orbit." },
   { prompt: "The turns that leave the colouring unchanged are the multiples of 4 below 8, starting with the turn by 0. How many are there?", answer: [2], labels: ["turns that leave it unchanged"], explanation: "They are the turns by 0, 4 slots: 2 of them, and 4 × 2 = 8." }
  ]
 }
);
})();
