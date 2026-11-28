/* Discrete mathematics missions, file a: q01–q10. Mission objects: docs/PACK-FORMAT.md §2 (every field), §2.1 (what the
   harness requires), §7 (answers). Generators: gen-a.js (build(canonical) reproduces the prompt, hints, solution
   and guidance here exactly); experiments: experiments-a.js; drill statements: variants-a.js; oracles:
   qa/realms/disc/oracle-a.js. One author per file. The missions of this file (id, chapter, tier and XP, sector):
     q01  ch 1 Sets and Venn diagrams · Basic, 100 XP · sector 'Store Rooms' · Sets, elements and cardinality [CM 1.1, Levin 0.3]
     q02  ch 1 Sets and Venn diagrams · Basic, 100 XP · sector 'Store Rooms' · Subsets and the empty set [Levin 0.3]
     q03  ch 1 Sets and Venn diagrams · Basic, 100 XP · sector 'Store Rooms' · Union and intersection [CM 1.4, Levin 0.3]
     q04  ch 1 Sets and Venn diagrams · Basic, 100 XP · sector 'Store Rooms' · Complement, difference and |A ∪ B| = |A| + |B| − |A ∩ B| [CM 1.4, Levin 0.3]
     q05  ch 1 Sets and Venn diagrams · Basic, 100 XP · sector 'Store Rooms' · Three-set Venn diagrams [CM 1.5]
     q06  ch 1 Sets and Venn diagrams · Basic, 100 XP · sector 'Store Rooms' · Cartesian products [Levin 0.3]
     q07  ch 2 Functions and counting principles · Basic, 100 XP · sector 'Labelling Bay' · Functions between finite sets: domain, codomain, image [Levin 0.4]
     q08  ch 2 Functions and counting principles · Basic, 100 XP · sector 'Labelling Bay' · One-to-one and onto [Levin 0.4]
     q09  ch 2 Functions and counting principles · Basic, 100 XP · sector 'Labelling Bay' · The additive principle [Levin 1.1]
     q10  ch 2 Functions and counting principles · Basic, 100 XP · sector 'Labelling Bay' · The multiplicative principle [Levin 1.1] */
(function(){
'use strict';
/* Oscar Levin, Discrete Mathematics: An Open Introduction (3rd edition), and OpenStax Contemporary Mathematics, chapter 1 Sets:
   the sections docs/plans/DISC-PLAN.md gives for q01–q10, each opened on the date in `verified`. */
const source = {
 cm11: { title: 'OpenStax Contemporary Mathematics — 1.1 Basic Set Concepts', url: 'https://openstax.org/books/contemporary-mathematics/pages/1-1-basic-set-concepts', description: 'Sets, elements, roster and set-builder notation, cardinality and the empty set.', verified: '2026-11-27' },
 l03: { title: 'Levin, Discrete Mathematics: An Open Introduction — 0.3 Sets', url: 'https://discrete.openmathbooks.org/dmoi3/sec_intro-sets.html', description: 'Sets and their notation, subsets, the empty set, union, intersection, complement, difference, Venn diagrams and Cartesian products.', verified: '2026-11-27' },
 cm14: { title: 'OpenStax Contemporary Mathematics — 1.4 Set Operations with Two Sets', url: 'https://openstax.org/books/contemporary-mathematics/pages/1-4-set-operations-with-two-sets', description: 'Union, intersection and complement of two sets in Venn diagrams, and the cardinality of a union.', verified: '2026-11-27' },
 cm15: { title: 'OpenStax Contemporary Mathematics — 1.5 Set Operations with Three Sets', url: 'https://openstax.org/books/contemporary-mathematics/pages/1-5-set-operations-with-three-sets', description: 'Venn diagrams with three sets, and filling their regions from survey totals.', verified: '2026-11-27' },
 l04: { title: 'Levin, Discrete Mathematics: An Open Introduction — 0.4 Functions', url: 'https://discrete.openmathbooks.org/dmoi3/sec_intro-functions.html', description: 'Functions between sets, domain, codomain, image and range, and one-to-one, onto and bijective functions.', verified: '2026-11-27' },
 l11: { title: 'Levin, Discrete Mathematics: An Open Introduction — 1.1 Additive and Multiplicative Principles', url: 'https://discrete.openmathbooks.org/dmoi3/sec_counting-addmult.html', description: 'The additive and multiplicative principles, and their links to union and Cartesian product.', verified: '2026-11-27' }
};
window.QUESTS = window.QUESTS || [];
window.QUESTS.push(
 {
  id: "q01", title: "Stock-taking bin A", topic: "Sets, elements and cardinality", tier: "Basic", sector: "Store Rooms",
  brief: "The store rooms have never been stock-taken, and Mira wants each bin written down as a set with an exact count.",
  lesson: "A set is a collection of different elements, written in braces; its cardinality |A| is the number of elements it has.",
  prompt: "The clerk stock-takes bin A on rack 1 and writes down the crate codes as A = {12, 7, 30, 18, 7, 25}. Set B is the set of all multiples of 4 from 10 to 50, including both ends. Enter |A|, the number of elements of A, then |B|.",
  answer: [5,10], labels: ["|A|","|B|"], tolerance: 0.01,
  hints: [
   "A set never counts the same element twice: if a code appears twice in the list, it is still one element.",
   "List B: start at the first multiple of 4 that is 10 or more, and keep adding 4 until the next one would pass 50."
  ],
  solution: "The clerk’s list has 6 entries, but 7 appears twice and counts once, so A = {7, 12, 18, 25, 30} and |A| = 5. The multiples of 4 from 10 to 50 are 12, 16, 20, 24, 28, 32, 36, 40, 44 and 48: from 12 to 48 in steps of 4 is (48 − 12) ÷ 4 + 1 = 10 numbers, so |B| = 10.",
  xp: 100, prereqs: [],
  artifact: {"name":"Bin card, rack 1","description":"The first bin in the depot written as a set, with its count."},
  sources: [source.cm11, source.l03],
  teaching: {
   intuition: "A set is a collection of things, taken as one whole. The things in it are its elements. We write a set by listing its elements between braces, { and }, separated by commas: {2, 5, 9} is the set whose elements are 2, 5 and 9. Order does not matter, and writing an element twice does not add it twice: {5, 2, 9, 2} is the same set as {2, 5, 9}. The symbol ∈ means “is an element of”, so 5 ∈ {2, 5, 9}. A set can also be given by a rule, such as “all multiples of 3 from 5 to 20”: its elements are exactly the numbers that fit the rule. The number of elements of a set A is its cardinality, written |A|. Here the two upright bars do not mean absolute value: |{2, 5, 9}| = 3.",
   steps: [
    "For a listed set, cross out any repeat: each different element counts once.",
    "For a set given by a rule, find the smallest and the largest numbers that fit the rule.",
    "Count the numbers from the smallest to the largest in steps of the rule: (largest − smallest) ÷ step + 1.",
    "Write the count as |A|. It is a whole number, and it is 0 only for a set with no elements."
   ],
   example: {
    prompt: "A bin holds the codes {4, 11, 4, 9}. The set C is all multiples of 3 from 5 to 20. Find the cardinality of each.",
    steps: [
     "4 appears twice and counts once, so the bin set is {4, 9, 11}, with 3 elements.",
     "The multiples of 3 from 5 to 20 are 6, 9, 12, 15 and 18: (18 − 6) ÷ 3 + 1 = 5."
    ],
    answer: "The bin set has cardinality 3, and |C| = 5."
   },
   pitfalls: [
    "Counting a repeated element twice. {7, 7, 3} has 2 elements, not 3.",
    "Leaving out an end: “from 12 to 48” includes 12 and 48 themselves when they fit the rule.",
    "Forgetting the + 1: from 12 to 48 in steps of 4 is 9 steps but 10 numbers."
   ]
  },
  guidance: [
   { prompt: "The clerk’s list for A is {12, 7, 30, 18, 7, 25}. Which code appears twice, and how many different codes are there?", answer: [7,5], labels: ["repeated code","different codes"], explanation: "7 is written twice but is one element, so A = {7, 12, 18, 25, 30}, with 5 different codes." },
   { prompt: "For B, what are the smallest and the largest multiples of 4 from 10 to 50?", answer: [12,48], labels: ["smallest multiple","largest multiple"], explanation: "12 = 4 × 3 is the first multiple of 4 that is 10 or more, and 48 = 4 × 12 is the last one that is 50 or less." },
   { prompt: "How many numbers are there from 12 to 48 in steps of 4? Count them, or work out (48 − 12) ÷ 4 + 1.", answer: [10], labels: ["|B|"], explanation: "(48 − 12) ÷ 4 = 9 steps, and the + 1 counts the starting number too: 10 numbers, so |B| = 10." }
  ]
 },
 {
  id: "q02", title: "Checking the packing list", topic: "Subsets and the empty set", tier: "Basic", sector: "Store Rooms",
  brief: "A packing list has come down from the dome crews, and Mira needs to know whether one bin can fill it on its own.",
  lesson: "A ⊆ B means every element of A is in B; the empty set ∅ has no elements and is a subset of every set.",
  prompt: "Bin B holds the crates numbered {3, 8, 14, 21, 26, 33, 40}. A packing list from the dome crews asks for the crates A = {8, 21, 33}. Enter 1 if A ⊆ B, that is, every crate on the list is in the bin, or 0 if not. Then enter how many crates in bin B are not on list A.",
  answer: [1,4], labels: ["A ⊆ B (1 yes, 0 no)","crates of B not on A"], tolerance: 0.01,
  hints: [
   "Check the elements of A one at a time: each one must appear in B for A to be a subset of B.",
   "For the second answer, go through B and cross out every crate that is also on list A. Count what is left."
  ],
  solution: "Every element of A is in B, so A ⊆ B: enter 1. Crossing the crates of list A out of B (8, 21 and 33) leaves {3, 14, 26, 40}, which is 4 crates.",
  xp: 100, prereqs: ["q01"],
  artifact: {"name":"Packing list, ticked","description":"A list checked crate by crate against one bin."},
  sources: [source.l03],
  teaching: {
   intuition: "Set A is a subset of set B when every element of A is also an element of B. We write A ⊆ B. The symbol looks like a rounded “less than or equal to”: A sits inside B and may even be all of B, so every set is a subset of itself. One missing element is enough to spoil it: if a single element of A is not in B, then A is not a subset of B. The set with no elements at all is the empty set, written ∅ or { }. Its cardinality is 0, and it is a subset of every set, because it has no element that could be missing. Once A ⊆ B, the elements of B that are not in A are the ones left over when the elements of A are crossed out of B, so there are |B| − |A| of them.",
   steps: [
    "Take the elements of A one at a time and look for each one in B.",
    "If every one is found, A ⊆ B; if even one is missing, A is not a subset of B.",
    "To count the elements of B that are not in A, cross out of B every element that A shares with it, and count what remains.",
    "When A ⊆ B, this count is |B| − |A|."
   ],
   example: {
    prompt: "B = {2, 5, 9, 12, 17} and A = {5, 12}. Is A ⊆ B, and how many elements of B are not in A?",
    steps: [
     "5 is in B and 12 is in B, so A ⊆ B.",
     "Crossing 5 and 12 out of B leaves {2, 9, 17}: 3 elements, which is 5 − 2."
    ],
    answer: "Yes, A ⊆ B (enter 1), and 3 elements of B are not in A."
   },
   pitfalls: [
    "Calling A a subset because most of its elements are in B. All of them must be.",
    "Mixing up the direction: A ⊆ B asks whether A fits inside B, not whether B fits inside A.",
    "Using |B| − |A| when A is not a subset: an element of A outside B was never in B to be crossed out."
   ]
  },
  guidance: [
   { prompt: "List A is {8, 21, 33}. How many of its crates are in bin B?", answer: [3], labels: ["crates of A in B"], explanation: "8, 21 and 33 are in B." },
   { prompt: "List A has 3 crates. Enter 1 if all of them are in B, or 0 if at least one is missing.", answer: [1], labels: ["A ⊆ B (1 yes, 0 no)"], explanation: "All of them are in B, so A ⊆ B." },
   { prompt: "Bin B has 7 crates. Cross out those that are on list A. How many are left?", answer: [4], labels: ["crates of B not on A"], explanation: "Crossing out 8, 21 and 33 leaves {3, 14, 26, 40}: 4 crates." }
  ]
 },
 {
  id: "q03", title: "Merging the delivery lists", topic: "Union and intersection", tier: "Basic", sector: "Store Rooms",
  brief: "Two delivery lists overlap, and the store rooms need to know how many different crates arrived and how many were logged twice.",
  lesson: "The union A ∪ B holds every element of either set, once; the intersection A ∩ B holds only the elements in both.",
  prompt: "The morning delivery list A logged the crates {2, 5, 9, 14, 20, 27}, and the afternoon list B logged {5, 11, 14, 20, 31}. Some crates were logged on both lists. Enter |A ∪ B|, the number of different crates on either list, then |A ∩ B|, the number of crates on both.",
  answer: [8,3], labels: ["|A ∪ B|","|A ∩ B|"], tolerance: 0.01,
  hints: [
   "For the intersection, go through A and keep each number that also appears in B.",
   "For the union, write out all of A, then add each number of B that is not already there. Do not write a shared number twice."
  ],
  solution: "The crates on both lists are 5, 14 and 20, so A ∩ B = {5, 14, 20} and |A ∩ B| = 3. The union is A with the numbers of B that A does not have (11 and 31) added: A ∪ B = {2, 5, 9, 11, 14, 20, 27, 31}, so |A ∪ B| = 8.",
  xp: 100, prereqs: ["q01"],
  artifact: {"name":"Merged delivery log","description":"Two lists poured into one, each crate written once."},
  sources: [source.cm14, source.l03],
  teaching: {
   intuition: "Two sets can be combined in two ways. The union A ∪ B is the set of everything that is in A, or in B, or in both: pour the two sets together and keep one copy of each element. The intersection A ∩ B is the set of the elements that are in A and in B at the same time: only what the two sets share. A way to remember the symbols: ∪ is an open cup that holds everything, and ∩ is a lid turned over it that covers only the overlap. If two sets share nothing, their intersection is the empty set ∅, and the sets are called disjoint. A shared element is in the union only once, which is why |A ∪ B| is usually less than |A| + |B|.",
   steps: [
    "Find the intersection: go through A and keep each element that is also in B.",
    "Find the union: write down all of A, then add each element of B that is not in A yet.",
    "Count each set. Check: the union is at least as big as each set, and the intersection is no bigger than either."
   ],
   example: {
    prompt: "A = {1, 4, 6, 8} and B = {4, 7, 8, 10, 13}. Find |A ∪ B| and |A ∩ B|.",
    steps: [
     "Shared elements: 4 and 8, so A ∩ B = {4, 8} and |A ∩ B| = 2.",
     "Union: {1, 4, 6, 8} with 7, 10 and 13 added gives {1, 4, 6, 7, 8, 10, 13}, so |A ∪ B| = 7."
    ],
    answer: "|A ∪ B| = 7 and |A ∩ B| = 2."
   },
   pitfalls: [
    "Adding the two sizes for the union, which counts each shared element twice.",
    "Swapping the symbols: ∪ (union, “or”) gives the bigger set, ∩ (intersection, “and”) the smaller."
   ]
  },
  guidance: [
   { prompt: "Which crates are on both lists? Enter how many there are.", answer: [3], labels: ["|A ∩ B|"], explanation: "5, 14 and 20 are on both lists, so |A ∩ B| = 3." },
   { prompt: "How many crates on list B are not on list A?", answer: [2], labels: ["crates on B only"], explanation: "11 and 31 are on B only." },
   { prompt: "List A has 6 crates. Add the 2 crates of B that A does not have. What is |A ∪ B|?", answer: [8], labels: ["|A ∪ B|"], explanation: "6 + 2 = 8. The shared crates are already in A, so they are not added again." }
  ]
 },
 {
  id: "q04", title: "Crates that are neither", topic: "Complement, difference and |A ∪ B| = |A| + |B| − |A ∩ B|", tier: "Basic", sector: "Store Rooms",
  brief: "Mira has the totals for fragile and heavy crates but not the full lists, and she needs the plain crates counted for the next shipment.",
  lesson: "The complement Aᶜ is everything in U outside A, A \\ B is A without the elements of B, and |A ∪ B| = |A| + |B| − |A ∩ B|.",
  prompt: "The store rooms hold 60 crates, and they are the universal set U for this count. 25 crates are fragile (set F), 30 are heavy (set H), and 12 are both fragile and heavy. Enter the number of crates that are neither fragile nor heavy, |(F ∪ H)ᶜ|, then |F \\ H|, the number of fragile crates that are not heavy.",
  answer: [17,13], labels: ["neither","|F \\ H|"], tolerance: 0.01,
  hints: [
   "First find |F ∪ H| = |F| + |H| − |F ∩ H|: the 12 crates that are both were counted once in F and again in H.",
   "The complement of F ∪ H is everything in U outside it, so take |F ∪ H| away from |U|. For F \\ H, take the shared crates away from F."
  ],
  solution: "|F ∪ H| = 25 + 30 − 12 = 43. The crates that are neither are the complement of F ∪ H: 60 − 43 = 17. The fragile crates that are not heavy are the set difference F \\ H: 25 − 12 = 13.",
  xp: 100, prereqs: ["q03"],
  artifact: {"name":"Two-circle chart","description":"A rectangle, two overlapping circles and a number in every region."},
  sources: [source.cm14, source.l03],
  teaching: {
   intuition: "Every count happens inside some universal set U: the whole collection we are talking about, such as all the crates in the depot. The complement of a set A, written Aᶜ, is everything in U that is not in A, so |Aᶜ| = |U| − |A|. The set difference A \\ B, read “A minus B”, is what is left of A after removing every element that is also in B: the fragile crates that are not heavy, say. A Venn diagram pictures all of this: a rectangle for U with a circle for each set inside it, the circles overlapping where the sets share elements. The overlap explains the key formula |A ∪ B| = |A| + |B| − |A ∩ B|. Adding |A| and |B| counts the overlap twice, once in each circle, so we take it away once.",
   steps: [
    "Draw U as a rectangle and the two sets as overlapping circles. Write |A ∩ B| in the overlap.",
    "Find |A ∪ B| = |A| + |B| − |A ∩ B|.",
    "The complement of the union is everything outside both circles: |U| − |A ∪ B|.",
    "The set difference A \\ B is the part of circle A outside the overlap: |A| − |A ∩ B|."
   ],
   example: {
    prompt: "U has 40 crates; 18 are in A, 15 are in B, and 6 are in both. How many are in neither, and how many are in A \\ B?",
    steps: [
     "|A ∪ B| = 18 + 15 − 6 = 27.",
     "Neither: 40 − 27 = 13. A \\ B: 18 − 6 = 12."
    ],
    answer: "13 crates are in neither set, and |A \\ B| = 12."
   },
   pitfalls: [
    "Forgetting to subtract the overlap: 18 + 15 counts the 6 shared crates twice.",
    "Taking |A \\ B| to be |A| − |B|. Only the shared elements are removed from A, not all of B.",
    "Subtracting |A| and |B| from |U| one after the other, which takes the overlap away twice."
   ]
  },
  guidance: [
   { prompt: "How many crates are fragile or heavy or both? Use |F ∪ H| = |F| + |H| − |F ∩ H|.", answer: [43], labels: ["|F ∪ H|"], explanation: "25 + 30 = 55 counts the 12 shared crates twice, so |F ∪ H| = 55 − 12 = 43." },
   { prompt: "How many of the 60 crates are outside F ∪ H?", answer: [17], labels: ["neither"], explanation: "60 − 43 = 17 crates are in neither circle of the Venn diagram." },
   { prompt: "How many of the 25 fragile crates are not among the 12 that are also heavy?", answer: [13], labels: ["|F \\ H|"], explanation: "|F \\ H| = 25 − 12 = 13." }
  ]
 },
 {
  id: "q05", title: "The store room survey", topic: "Three-set Venn diagrams", tier: "Basic", sector: "Store Rooms",
  brief: "A survey of one store room came back as overlapping totals, and Mira needs the crates sorted into single-label and unlabelled piles.",
  lesson: "Fill a three-set Venn diagram from the centre outwards; each total covers every region inside its circle.",
  prompt: "A survey of the 60 crates in store room 3 finds 28 fragile (set F), 21 cold-stored (set C) and 24 heavy (set H). Of these, 8 are fragile and cold, 9 are fragile and heavy, 7 are cold and heavy, and 3 are all three. Enter the number of crates in exactly one of the three sets, then the number in none of them.",
  answer: [34,8], labels: ["exactly one set","none"], tolerance: 0.01,
  hints: [
   "Fill the Venn diagram from the middle outwards: first the centre (all three), then each “exactly two” region, which is a pair total minus the centre.",
   "Each “only” region is the set total minus the three other regions inside that circle. Add the three “only” regions for the first answer."
  ],
  solution: "Centre: 3. Exactly two: F and C only 8 − 3 = 5, F and H only 9 − 3 = 6, C and H only 7 − 3 = 4. Only F: 28 − 5 − 6 − 3 = 14; only C: 21 − 5 − 4 − 3 = 9; only H: 24 − 6 − 4 − 3 = 11. Exactly one set: 14 + 9 + 11 = 34. The seven regions hold 52 crates, so 60 − 52 = 8 are in none.",
  xp: 100, prereqs: ["q04"],
  artifact: {"name":"Three-circle chart","description":"Eight regions, filled from the middle outwards."},
  sources: [source.cm15],
  teaching: {
   intuition: "Three overlapping circles inside the rectangle U cut it into eight regions: inside all three circles, inside exactly two (three such regions), inside exactly one (three more), and outside every circle. Survey figures usually give totals, such as “21 crates are cold-stored”, and a total counts every region inside that circle, not just the part that is cold-stored only. So we fill the Venn diagram from the inside out. The centre, the crates in all three sets, is given directly. A pair total such as |F ∩ C| covers two regions, the centre and the “F and C only” region, so subtracting the centre leaves the “exactly two” part. Then a circle’s total minus its three inner regions leaves the part in that set only. Once all seven regions are filled, whatever remains of |U| is outside every circle.",
   steps: [
    "Write the number in all three sets in the centre.",
    "For each pair, subtract the centre from the pair total to get the “exactly those two” region.",
    "For each set, subtract its three inner regions (two pair regions and the centre) from its total to get the “only” region.",
    "Add the regions you need. The count in none is |U| minus all seven regions."
   ],
   example: {
    prompt: "Of 50 crates, 20 are in A, 18 in B and 16 in C; 7 are in A and B, 6 in A and C, 5 in B and C, and 2 in all three. How many are in exactly one set, and how many in none?",
    steps: [
     "Centre 2. Exactly two: 7 − 2 = 5, 6 − 2 = 4 and 5 − 2 = 3.",
     "Only A: 20 − 5 − 4 − 2 = 9; only B: 18 − 5 − 3 − 2 = 8; only C: 16 − 4 − 3 − 2 = 7.",
     "Exactly one: 9 + 8 + 7 = 24. The seven regions hold 38 crates, so 50 − 38 = 12 are in none."
    ],
    answer: "24 crates are in exactly one set, and 12 are in none."
   },
   pitfalls: [
    "Using a pair total as the “exactly two” region: |F ∩ C| also includes the crates in all three sets.",
    "Taking a set total as its “only” region: the fragile total includes the fragile crates that are also cold or heavy.",
    "Adding the three set totals to count the crates in at least one set, which counts the overlaps several times."
   ]
  },
  guidance: [
   { prompt: "The centre holds the 3 crates in all three sets. How many crates are in F and C but not H, in F and H but not C, and in C and H but not F?", answer: [5,6,4], labels: ["F and C only","F and H only","C and H only"], explanation: "Each pair total includes the centre, so take 3 away: 8 − 3 = 5, 9 − 3 = 6 and 7 − 3 = 4." },
   { prompt: "How many crates are in F only, in C only, and in H only?", answer: [14,9,11], labels: ["F only","C only","H only"], explanation: "Take the three inner regions away from each total: 28 − (5 + 6 + 3) = 14, 21 − (5 + 4 + 3) = 9 and 24 − (6 + 4 + 3) = 11." },
   { prompt: "Add the three “only” regions, then take all seven regions away from the 60 crates. How many are in exactly one set, and how many in none?", answer: [34,8], labels: ["exactly one set","none"], explanation: "14 + 9 + 11 = 34. The seven regions add up to 52, and 60 − 52 = 8." }
  ]
 },
 {
  id: "q06", title: "Pairing boxes for the lift", topic: "Cartesian products", tier: "Basic", sector: "Store Rooms",
  brief: "The cargo lift carries one box from each of two shelves at a time, and Mira wants to know how many different loads there are and how many hit the lift’s best mass.",
  lesson: "The Cartesian product A × B is the set of all ordered pairs (a, b) with a in A and b in B, and |A × B| = |A| × |B|.",
  prompt: "The cargo lift takes one box from shelf A and then one box from shelf B. Each box on shelf A has a different mass, in kilograms: A = {2, 3, 5, 8}. So does each box on shelf B: B = {1, 4, 6}. A load is written as the ordered pair (a, b) of the two masses. Enter |A × B|, the number of possible loads, then the number of loads (a, b) with a + b = 9, the mass the lift runs best with.",
  answer: [12,3], labels: ["|A × B|","loads at the target"], tolerance: 0.01,
  hints: [
   "Each box of shelf A can be paired with each box of shelf B: picture a grid with a row for each element of A and a column for each element of B.",
   "For the second answer, take each a in A in turn and check whether 9 − a is in B."
  ],
  solution: "A has 4 elements and B has 3, so |A × B| = 4 × 3 = 12. The pairs with a + b = 9 are (3, 6), (5, 4) and (8, 1), so there are 3 such loads.",
  xp: 100, prereqs: ["q03"],
  artifact: {"name":"Load grid","description":"A grid with a row for each box on one shelf and a column for each box on the other."},
  sources: [source.l03],
  teaching: {
   intuition: "An ordered pair (a, b) is two things in a fixed order, as with the coordinates from Foundations: (3, 5) and (5, 3) are different pairs. The Cartesian product A × B is the set of all ordered pairs whose first entry is an element of A and whose second entry is an element of B. If A = {1, 2} and B = {7, 8, 9}, then A × B = {(1, 7), (1, 8), (1, 9), (2, 7), (2, 8), (2, 9)}. Picture a grid with a row for each element of A and a column for each element of B: every cell is one pair. So |A × B| = |A| × |B|. The pairs that meet a condition, such as entries that add up to a target, form a subset of A × B, and we count them by checking the grid one row at a time.",
   steps: [
    "Count the elements of A and of B.",
    "Multiply: |A × B| = |A| × |B|, one pair for each cell of the grid.",
    "To count the pairs that meet a condition, go through the elements a of A one at a time and find the elements b of B that complete it.",
    "Add up what each a gives."
   ],
   example: {
    prompt: "A = {1, 4, 7} and B = {2, 3, 5, 6}. Find |A × B| and the number of pairs (a, b) with a + b = 9.",
    steps: [
     "|A × B| = 3 × 4 = 12.",
     "a = 1 needs b = 8, which is not in B; a = 4 needs 5, which is in B; a = 7 needs 2, which is in B."
    ],
    answer: "|A × B| = 12, and 2 pairs, (4, 5) and (7, 2), add up to 9."
   },
   pitfalls: [
    "Adding |A| and |B| instead of multiplying. Each element of A pairs with every element of B.",
    "Treating (4, 5) and (5, 4) as the same pair, or counting a pair whose first entry is not in A."
   ]
  },
  guidance: [
   { prompt: "How many elements do A and B have?", answer: [4,3], labels: ["|A|","|B|"], explanation: "A = {2, 3, 5, 8} has 4 elements and B = {1, 4, 6} has 3." },
   { prompt: "How many ordered pairs (a, b) are there in all?", answer: [12], labels: ["|A × B|"], explanation: "4 rows times 3 columns: 4 × 3 = 12 pairs." },
   { prompt: "For each a in A, work out 9 − a and look for it in B. How many pairs add up to 9?", answer: [3], labels: ["loads at the target"], explanation: "9 − 2 = 7 is not; 9 − 3 = 6 is in B; 9 − 5 = 4 is in B; 9 − 8 = 1 is in B. That gives (3, 6), (5, 4) and (8, 1): 3 pairs." }
  ]
 },
 {
  id: "q07", title: "The crate-to-bin table", topic: "Functions between finite sets: domain, codomain, image", tier: "Basic", sector: "Labelling Bay",
  brief: "Every crate in the labelling bay is sent to a bin by a table, and Mira wants the table read as a function.",
  lesson: "A function f: A → B gives each element of the domain A exactly one image in the codomain B; the range is the set of images that occur.",
  prompt: "The labelling bay sends each crate to a bin. The crates are A = {1, 2, 3, 4, 5, 6} and the bins are B = {1, 2, 3, 4, 5}. The function f: A → B is given by the arrow table 1 → 3, 2 → 1, 3 → 4, 4 → 3, 5 → 1, 6 → 4. Enter f(2), then f(4), then the size of the range of f: the number of bins that receive at least one crate.",
  answer: [1,3,3], labels: ["first image","second image","size of the range"], tolerance: 0.01,
  hints: [
   "f(2) is the bin at the end of the arrow that starts at crate 2.",
   "The range is the set of all outputs. List the bin at the end of every arrow, then cross out repeats."
  ],
  solution: "The arrow from 2 ends at bin 1, so f(2) = 1; the arrow from 4 ends at bin 3, so f(4) = 3. The arrows end at 3, 1, 4, 3, 1, 4, so the range is {1, 3, 4}, with 3 elements, although the codomain B has 5.",
  xp: 100, prereqs: ["q01"],
  artifact: {"name":"Arrow table","description":"One arrow from every crate, each ending at a bin."},
  sources: [source.l04],
  teaching: {
   intuition: "A function from a set A to a set B is a rule that gives every element of A exactly one element of B. We write f: A → B. A is the domain, the set of inputs, and B is the codomain, the set the outputs are allowed to land in. For finite sets we can show f as an arrow table: one arrow leaves each element of the domain, and it ends at that element’s image, written f(x) as in the function notation of Foundations. Two arrows may end at the same place, and some elements of B may get no arrow at all. The range of f is the set of images that actually occur, so it is a subset of the codomain and can be smaller. Every element of A needs exactly one arrow: an input with no arrow, or with two, means the rule is not a function.",
   steps: [
    "Read the domain and the codomain: f: A → B takes its inputs from A and gives outputs in B.",
    "To find f(x), follow the one arrow that starts at x.",
    "To find the range, collect the end of every arrow and cross out repeats.",
    "Count the range. It is never bigger than the codomain, and never bigger than the domain."
   ],
   example: {
    prompt: "f: {1, 2, 3, 4} → {7, 8, 9} is given by 1 → 8, 2 → 7, 3 → 8, 4 → 8. Find f(3) and the size of the range.",
    steps: [
     "The arrow from 3 ends at 8, so f(3) = 8.",
     "The ends are 8, 7, 8, 8; without repeats the range is {7, 8}."
    ],
    answer: "f(3) = 8, and the range has 2 elements; 9 is in the codomain but not in the range."
   },
   pitfalls: [
    "Giving the size of the codomain as the size of the range. A bin that no arrow reaches is in the codomain but not in the range.",
    "Counting a bin once for every arrow that reaches it. The range is a set, so each bin counts once."
   ]
  },
  guidance: [
   { prompt: "How many elements does the domain A have, and how many does the codomain B have?", answer: [6,5], labels: ["size of the domain","size of the codomain"], explanation: "A = {1, 2, 3, 4, 5, 6} has 6 crates and B = {1, 2, 3, 4, 5} has 5 bins." },
   { prompt: "Follow the arrows from crates 2 and 4. Where do they end?", answer: [1,3], labels: ["first image","second image"], explanation: "2 → 1 and 4 → 3, so f(2) = 1 and f(4) = 3." },
   { prompt: "List the bins at the ends of all 6 arrows and cross out repeats. How many different bins are left?", answer: [3], labels: ["size of the range"], explanation: "The ends are 3, 1, 4, 3, 1, 4. Without repeats that is {1, 3, 4}: 3 bins." }
  ]
 },
 {
  id: "q08", title: "No two crates, one tag", topic: "One-to-one and onto", tier: "Basic", sector: "Labelling Bay",
  brief: "The tag printer gives each crate a tag, and Mira wants to know whether any tag was used twice and how many tags were never printed.",
  lesson: "A function is one-to-one when no two inputs share an image, onto when every element of the codomain is an image, and a bijection when it is both.",
  prompt: "The tag printer gives each crate of A = {1, 2, 3, 4, 5} one tag from T = {1, 2, 3, 4, 5, 6, 7}. The tagging f: A → T is 1 → 6, 2 → 2, 3 → 7, 4 → 4, 5 → 1. Enter 1 if f is one-to-one, that is, no two crates get the same tag, or 0 if not. Then enter the number of tags in T that no crate gets.",
  answer: [1,2], labels: ["one-to-one (1 yes, 0 no)","tags not used"], tolerance: 0.01,
  hints: [
   "Look at the tags at the ends of the arrows: f is one-to-one exactly when none of them appears twice.",
   "f is onto when every tag is used. Count the tags of T that are missing from the list of arrow ends."
  ],
  solution: "The arrow ends are 6, 2, 7, 4, 1. No tag appears twice, so f is one-to-one: enter 1. The tags used are {1, 2, 4, 6, 7}. The tags no crate gets are 3 and 5, so the count is 2 and f is not onto.",
  xp: 100, prereqs: ["q07"],
  artifact: {"name":"Tag roll","description":"A roll of tags with the unused ones still attached."},
  sources: [source.l04],
  teaching: {
   intuition: "Two questions tell us a lot about a function f: A → B. First, is it one-to-one? That means different inputs always have different images: no two arrows end at the same element of B. One-to-one is also called injective. Second, is it onto? That means every element of the codomain B is the image of at least one input: every element of B gets an arrow, so the range is all of B. Onto is also called surjective. A tagging of crates is one-to-one when no two crates share a tag, and onto when no tag is left unused. A function that is both one-to-one and onto is a bijection: it pairs off the elements of A and B exactly, so |A| = |B|. If A has more elements than B, two arrows must share an end, so f cannot be one-to-one; if A has fewer, some element of B gets no arrow, so f cannot be onto.",
   steps: [
    "List the image of every element of the domain.",
    "One-to-one: check that no image appears twice in the list.",
    "Onto: check that every element of the codomain appears in the list. The elements that do not appear are the ones no input reaches.",
    "If both checks pass, the function is a bijection."
   ],
   example: {
    prompt: "f: {1, 2, 3, 4} → {1, 2, 3} is 1 → 2, 2 → 3, 3 → 2, 4 → 1. Is f one-to-one, and how many elements of the codomain does no input reach?",
    steps: [
     "The images are 2, 3, 2, 1: the image 2 appears twice, so f is not one-to-one.",
     "The images include 1, 2 and 3, every element of the codomain, so f is onto and no element is missed."
    ],
    answer: "Not one-to-one (enter 0), and 0 elements are missed: f is onto."
   },
   pitfalls: [
    "Checking the inputs instead of the outputs. Every input has exactly one arrow anyway; one-to-one is about two arrows landing on the same output.",
    "Thinking that a one-to-one function must be onto. With more tags than crates, some tag is always left over.",
    "Counting the elements of the codomain that are reached instead of those that are not."
   ]
  },
  guidance: [
   { prompt: "List the tag at the end of each arrow. Enter 1 if no tag appears twice, or 0 if one does.", answer: [1], labels: ["one-to-one (1 yes, 0 no)"], explanation: "The ends 6, 2, 7, 4, 1 are all different, so f is one-to-one." },
   { prompt: "How many different tags are used?", answer: [5], labels: ["tags used"], explanation: "The tags used are {1, 2, 4, 6, 7}: 5 of them." },
   { prompt: "T has 7 tags and 5 are used. How many are never used?", answer: [2], labels: ["tags not used"], explanation: "7 − 5 = 2." }
  ]
 },
 {
  id: "q09", title: "One spare from the shelves", topic: "The additive principle", tier: "Basic", sector: "Labelling Bay",
  brief: "A repair crew needs one spare part, and Mira wants the number of choices on record before she reorders.",
  lesson: "The additive principle: for choices that share nothing, the number of ways to do one or the other is the sum of the ways.",
  prompt: "The spare-parts shelves hold 7 different filters, 5 different valves and 9 different seals, and no part is on two shelves. A repair needs one spare part of any kind: enter the number of ways to choose it. Then, on the hose rack, 12 hoses are rated for cold and 10 are rated for heat, and 4 of them are rated for both. Enter the number of ways to choose one hose that is rated for cold or for heat.",
  answer: [21,18], labels: ["ways to pick a part","ways to pick a hose"], tolerance: 0.01,
  hints: [
   "The three shelves have nothing in common, so the numbers of choices add up.",
   "The cold-rated and heat-rated hoses overlap. Adding the two counts takes the hoses rated for both twice, so take them away once."
  ],
  solution: "The filters, valves and seals are disjoint sets, so by the additive principle there are 7 + 5 + 9 = 21 ways. The hose ratings overlap, so the count is |C ∪ H| = 12 + 10 − 4 = 18.",
  xp: 100, prereqs: ["q04"],
  artifact: {"name":"Spares register","description":"Three shelves and a rack, with the number of choices on each."},
  sources: [source.l11],
  teaching: {
   intuition: "Counting is easiest when the choices fall into separate groups. The additive principle says: if one event can happen in m ways and a second, different event can happen in n ways, and no way belongs to both, then there are m + n ways for one or the other to happen. In set language, if A and B are disjoint, so that A ∩ B = ∅, then |A ∪ B| = |A| + |B|. It works for any number of groups that share nothing: choosing one tool from three separate drawers of 4, 6 and 5 tools gives 4 + 6 + 5 = 15 choices. When the groups do overlap, plain adding counts the shared choices twice, and we use the formula from the store rooms instead: |A ∪ B| = |A| + |B| − |A ∩ B|.",
   steps: [
    "Split the choices into groups and check whether any choice is in two groups.",
    "If the groups are disjoint, add their sizes: that is the additive principle.",
    "If two groups overlap, add their sizes and take the overlap away once."
   ],
   example: {
    prompt: "One drawer holds 4 spanners, another 6 drivers and another 3 clamps. A rack has 8 red cables and 5 long cables, and 2 of them are both red and long. In how many ways can you pick one tool, and one cable that is red or long?",
    steps: [
     "The drawers share nothing: 4 + 6 + 3 = 13.",
     "The cables overlap in 2: 8 + 5 − 2 = 11."
    ],
    answer: "13 ways to pick a tool, and 11 ways to pick a red or long cable."
   },
   pitfalls: [
    "Multiplying the group sizes. Choosing one item from one of the groups adds; multiplying is for choosing one from each group, in the next mission.",
    "Adding overlapping groups without taking the overlap away."
   ]
  },
  guidance: [
   { prompt: "One part from three shelves that share nothing: what is 7 + 5 + 9?", answer: [21], labels: ["ways to pick a part"], explanation: "7 + 5 + 9 = 21. No part is counted twice, because no part is on two shelves." },
   { prompt: "If you simply added the 12 cold-rated and the 10 heat-rated hoses, how many would you count?", answer: [22], labels: ["simple sum of hoses"], explanation: "12 + 10 = 22, but the 4 hoses rated for both are in that count twice." },
   { prompt: "Take away the 4 hoses that were counted twice. How many hoses are rated for cold or for heat?", answer: [18], labels: ["ways to pick a hose"], explanation: "22 − 4 = 18, which is |C ∪ H| = |C| + |H| − |C ∩ H|." }
  ]
 },
 {
  id: "q10", title: "Printing crate codes", topic: "The multiplicative principle", tier: "Basic", sector: "Labelling Bay",
  brief: "The labelling bay is printing new crate codes, and Mira needs to know how many codes each rule allows before the printer runs.",
  lesson: "The multiplicative principle: a choice made in stages has as many outcomes as the product of the numbers of choices at the stages.",
  prompt: "Crate codes in the labelling bay are one letter and then two digits, such as B47. The depot uses only 8 letters. Enter how many codes there are with no other rule (type it without commas). Then the rule changes: the last digit is even, and the two digits are different. Enter how many codes follow the new rule.",
  answer: [800,360], labels: ["codes with no rule","codes under the new rule"], tolerance: 0.01,
  hints: [
   "Each place is a stage: 8 letters, then 10 digits, then 10 digits. Multiply the numbers of choices.",
   "Under the new rule, fill the most restricted digit first and count its choices, then count the choices left for the other digit."
  ],
  solution: "With no rule there are 8 × 10 × 10 = 800 codes. Under the new rule the letter still has 8 choices. Fill the last digit first: 0, 2, 4, 6 or 8, so 5 choices. The first digit can be any digit except that one: 10 − 1 = 9 choices. By the multiplicative principle there are 8 × 5 × 9 = 360 codes.",
  xp: 100, prereqs: ["q09","q06"],
  artifact: {"name":"Code printer plate","description":"A letter wheel and two digit wheels, turning in stages."},
  sources: [source.l11],
  teaching: {
   intuition: "When a choice is made in stages, one after another, the counts multiply. The multiplicative principle says: if one event can happen in m ways, and for each of those a second event can happen in n ways, then the two together can happen in m × n ways. This is the grid of the Cartesian product again: m rows, n columns, m × n cells. A code made of one letter from 3 letters and then one digit from 10 has 3 × 10 = 30 possibilities, and every extra stage multiplies again. A rule can cut the choices at one stage, as “the digit is odd” leaves 5 digits, or tie a stage to an earlier one, as “the two digits are different” leaves one digit fewer for the second. What matters is that each stage has the same number of choices whatever was picked before, so fill the most restricted place first.",
   steps: [
    "Split the code into stages, one for each place.",
    "Count the choices at each stage. Fill the most restricted place first, then count what is left for the others.",
    "Multiply the counts of all the stages."
   ],
   example: {
    prompt: "Codes are one letter from 5, then two digits, where the first digit is not 0 and the last digit is odd. How many codes are there?",
    steps: [
     "Letter: 5 choices. First digit: 1 to 9, so 9 choices. Last digit: 1, 3, 5, 7 or 9, so 5 choices.",
     "Multiply: 5 × 9 × 5 = 225."
    ],
    answer: "225 codes."
   },
   pitfalls: [
    "Adding the stages instead of multiplying. Every letter goes with every pair of digits, so the counts multiply.",
    "Forgetting that 0 is a digit: there are 10 digits, 0 to 9, and 5 of them, 0, 2, 4, 6 and 8, are even.",
    "Filling an easy place first and then finding that the next count depends on what was picked. With “last digit even, digits different”, choose the last digit first."
   ]
  },
  guidance: [
   { prompt: "With no rule, how many choices are there for the letter, and how many for each digit?", answer: [8,10], labels: ["letter choices","digit choices"], explanation: "8 letters, and 10 digits (0 to 9) for each place, so 8 × 10 × 10 = 800 codes." },
   { prompt: "Under the new rule (the last digit is even, and the two digits are different), start with the last digit. How many choices does it have, and then how many are left for the first digit?", answer: [5,9], labels: ["choices, digit filled first","choices, digit filled second"], explanation: "Fill the last digit first: 0, 2, 4, 6 or 8, so 5 choices. The first digit can be any digit except that one: 10 − 1 = 9 choices." },
   { prompt: "Multiply the three stages. What is 8 × 5 × 9?", answer: [360], labels: ["codes under the new rule"], explanation: "8 × 5 = 40, and 40 × 9 = 360 codes." }
  ]
 }
);
})();
