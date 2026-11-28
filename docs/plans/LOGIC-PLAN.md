# Logic and proof pack (`logic`) — concept plan

Pack id `logic`, name "Logic and proof", 40 learn missions (`q01`–`q40`) + 120 practice (`qNNb/c/d`) = 160. Format: `docs/PACK-FORMAT.md` (every rule there applies; read "found" as "logic"), in the shape of `docs/CALC1-PLAN.md`.

**Player:** an adult who has finished Foundations (arithmetic, fractions, negative numbers, algebra, equations, inequalities, functions, exponents, square roots, factoring, quadratics) and nothing more. Sets, counting and probability are not assumed (`disc` owns sets and counting): a domain is always a short printed list of numbers, and a row count is found by doubling, taught in q07. Truth tables and proof methods belong to this pack; divisibility appears only as material for proofs, never remainders or modular arithmetic (those are `disc` and `number`). Every word and symbol below is taught in the mission that first uses it: statement, truth value, true typed as 1 and false as 0, p and q as statement letters, negation ¬, conjunction ∧ ("and"), disjunction ∨ (inclusive "or"), conditional → ("if … then"), hypothesis, conclusion, biconditional ↔ ("if and only if"), compound statement, truth table, row, tautology, contradiction, logically equivalent ≡, De Morgan's laws, converse, inverse, contrapositive, quantifier, ∀ ("for every"), ∃ ("there is"), domain, witness, counterexample, argument, premise, valid, modus ponens, modus tollens, chain rule (hypothetical syllogism), fallacy, knight, knave, even, odd, a | b ("a divides b"), definition, theorem, proof, direct proof, proof by contrapositive, proof by cases, proof by contradiction, irrational, prime, existence proof, mathematical induction, base case, inductive step, inductive hypothesis, strong induction, ∎.

**Setting:** the Kepler outpost now runs on written rules: the airlock computers follow them, the council votes on them and some of them contradict each other. Mira has opened a Rules Hall beside the airlocks, with a switch room, a council chamber and a proof workshop, and wants every claim checked before anyone trusts it.

**Sources:** OpenStax Contemporary Mathematics, chapter 2 Logic (CM), `https://openstax.org/books/contemporary-mathematics/pages/<slug>`, title form `OpenStax Contemporary Mathematics — 2.5 Equivalent Statements`; and Levin, Discrete Mathematics: An Open Introduction, 3rd edition (Levin), `https://discrete.openmathbooks.org/dmoi3/<page>.html`, title form `Levin, Discrete Mathematics: An Open Introduction — 3.2 Proofs`. Publisher words: `OpenStax` or `Levin` (the pack's `sourceRule` must accept both). All 11 URLs below were opened on 2026-11-27; none is UNVERIFIED.

| Ch | Section title (concepts) | URL |
|---|---|---|
| 1 | CM 2.1 Statements and Quantifiers (q01, q02); CM 2.2 Compound Statements (q03–q05); CM 2.4 Truth Tables for the Conditional and Biconditional (q05, q06) | https://openstax.org/books/contemporary-mathematics/pages/2-1-statements-and-quantifiers https://openstax.org/books/contemporary-mathematics/pages/2-2-compound-statements https://openstax.org/books/contemporary-mathematics/pages/2-4-truth-tables-for-the-conditional-and-biconditional |
| 2 | CM 2.3 Constructing Truth Tables (q07–q09, q11); CM 2.5 Equivalent Statements (q10, q11); Levin 3.1 Propositional Logic (q09, q10) | https://openstax.org/books/contemporary-mathematics/pages/2-3-constructing-truth-tables https://openstax.org/books/contemporary-mathematics/pages/2-5-equivalent-statements https://discrete.openmathbooks.org/dmoi3/sec_propositional.html |
| 3 | CM 2.6 De Morgan's Laws (q12, q14); CM 2.5 (q13); CM 2.1 (q15, q16); Levin 0.2 Mathematical Statements (q15, q16) | https://openstax.org/books/contemporary-mathematics/pages/2-6-de-morgans-laws https://discrete.openmathbooks.org/dmoi3/sec_intro-statements.html |
| 4 | CM 2.7 Logical Arguments (q18–q20, q23); Levin 3.1 (q19, q22); Levin 0.2 (q21, q22) | https://openstax.org/books/contemporary-mathematics/pages/2-7-logical-arguments |
| 5–6 | Levin 3.2 Proofs (q24–q34) | https://discrete.openmathbooks.org/dmoi3/sec_logic-proofs.html |
| 7 | Levin 2.5 Induction (q35–q40) | https://discrete.openmathbooks.org/dmoi3/sec_seq-induction.html |

| Ch | Name | Ids | Tier, XP | Sector | Purpose ("we have to …") | Landmark |
|---|---|---|---|---|---|---|
| 1 | Statements | q01–q06 | Basic, 100 | Switch Room | read every rule the airlock computer follows | Relay mast |
| 2 | Truth tables | q07–q11 | Basic, 100 | Control Panel | check a rule against every case before we wire it in | Panel tower |
| 3 | Laws of logic | q12–q17 | Intermediate, 150 | Regulations Office | rewrite every regulation without changing what it means | Archive vault |
| 4 | Arguments | q18–q23 | Intermediate, 150 | Council Chamber | tell a sound argument from a merely persuasive one | Debate dome |
| 5 | Direct proof | q24–q29 | Intermediate, 150 | Proof Workshop | show a rule holds for every number, not just the ones we tried | Anvil frame |
| 6 | Indirect proof | q30–q34 | Advanced, 200 | Inquiry Office | settle a claim by ruling out every alternative | Watchtower |
| 7 | Induction | q35–q40 | Advanced, 200 | Long Stair | prove a rule for every step of a stair that never ends | Spiral stair |

Blurbs: 1 Statements, true and false, not, and, or, if-then and if-and-only-if. 2 Truth tables, tautologies, contradictions and equivalent statements. 3 De Morgan's laws, the contrapositive, quantifiers and counterexamples. 4 Valid arguments, rules of inference, fallacies, nested quantifiers and knights and knaves. 5 Definitions, direct proof, proof by contrapositive and proof by cases. 6 Contradiction, counterexamples, existence, if-and-only-if proofs and flawed proofs. 7 Mathematical induction for sums and inequalities, and strong induction.

## Concepts (one learn mission each; section in brackets; ← prerequisites)

1. q01 Statements and truth values [CM 2.1] ← none
   Asked: 1 or 0 for each of three sentences about numbers ("17 is greater than 3 × 6"). Varies: the numbers.
2. q02 Negation ¬ [CM 2.1] ← q01
   Asked: the truth value of ¬p, then the largest reading that makes "not more than k litres" true. Varies: p, k.
3. q03 And (∧) [CM 2.2] ← q02
   Asked: the truth value of p ∧ q, then how many whole numbers from 1 to N make it true. Varies: the two conditions, N.
4. q04 Inclusive or (∨) [CM 2.2] ← q03
   Asked: how many whole numbers from 1 to N make p ∨ q true. Varies: conditions, N.
5. q05 If … then (→): hypothesis and conclusion [CM 2.2, 2.4] ← q03
   Asked: the truth value for given p and q, then how many logged airlock cycles break the rule. Varies: the log.
6. q06 If and only if (↔) [CM 2.4] ← q05
   Asked: the truth value of p ↔ q for three cases, as three boxes. Varies: the cases.
7. q07 Truth tables: one row per case, doubling with each letter [CM 2.3] ← q04, q05
   Asked: the number of rows for n letters, then the row number of a given case in the standard order. Varies: n ≤ 5, the case.
8. q08 Building a truth table [CM 2.3] ← q07
   Asked: the number of rows on which a compound statement such as (p ∨ q) → ¬r is true. Varies: the statement.
9. q09 Tautologies and contradictions [CM 2.3, Levin 3.1] ← q08
   Asked: the number of true rows, then 1 if a tautology, 0 if not. Varies: the statement.
10. q10 Logical equivalence: rows where two statements differ [CM 2.5, Levin 3.1] ← q08
   Asked: the number of rows where the two disagree (0 means equivalent). Varies: the pair.
11. q11 Chapter review: tables and equivalence [CM 2.3, 2.5] ← q09, q10
   Asked: true-row counts for two statements and the rows where they differ. Varies: statements.
12. q12 De Morgan's laws [CM 2.6] ← q10
   Asked: how many numbers from 1 to N satisfy ¬(p ∧ q), found as ¬p ∨ ¬q. Varies: conditions, N.
13. q13 Converse, inverse and contrapositive [CM 2.5] ← q10
   Asked: 1 or 0 for each of the three for a given numeric rule, then the index of the one equivalent to it. Varies: rule.
14. q14 Negating a conditional: p ∧ ¬q [CM 2.6] ← q12, q13
   Asked: the number of logged cases where the negation is true (the rule-breakers). Varies: log.
15. q15 Quantifiers ∀ and ∃ over a printed domain [CM 2.1, Levin 0.2] ← q04
   Asked: 1 or 0 for "for every x in the list …" and "there is an x …", then the number of witnesses. Varies: list, condition.
16. q16 Negating a quantifier; the smallest counterexample [CM 2.1, Levin 0.2] ← q15, q12
   Asked: the smallest n in the domain that breaks a "for every n" claim (as n² − n + 41 is prime). Varies: claim family, domain.
17. q17 Chapter review: rewriting regulations [CM 2.6, Levin 0.2] ← q14, q16
   Asked: rule-breaker counts and a smallest counterexample. Varies: rules.
18. q18 Arguments and validity by truth table [CM 2.7] ← q08
   Asked: the number of rows where every premise is true and the conclusion false, then 1 if valid (that count is 0). Varies: argument.
19. q19 Modus ponens and modus tollens [CM 2.7, Levin 3.1] ← q18
   Asked: the forced truth value of the conclusion, then the index of the rule used. Varies: argument.
20. q20 Chains of reasoning and fallacies [CM 2.7] ← q19
   Asked: 1 (valid) or 0 (fallacy) for three arguments, such as affirming the conclusion. Varies: arguments.
21. q21 Nested quantifiers on a printed grid [Levin 0.2] ← q16
   Asked: 1 or 0 for "for every x there is a y" and for "there is a y for every x", then the number of x with a match. Varies: grid.
22. q22 Knights and knaves [Levin 0.2, 3.1] ← q08
   Asked: the number of knights among three islanders. Varies: statements, drawn until exactly one assignment fits.
23. q23 Chapter review: weighing an argument in council [CM 2.7, Levin 0.2] ← q20, q21
   Asked: validity codes and a witness count. Varies: arguments.
24. q24 Definitions: even, odd and "divides" [Levin 3.2, 0.2] ← q15
   Asked: the k with n = 2k + 1, then 1 or 0 for a | b. Varies: n, a, b.
25. q25 Direct proof, step by step [Levin 3.2] ← q24, q19
   Asked: for odd × odd = 2(2ab + a + b) + 1, the bracket's value for drawn a and b, then the index of the missing step. Varies: a, b, the step.
26. q26 Direct proofs with "divides" [Levin 3.2] ← q25
   Asked: the whole number m in a + b = 3m when 3 | a and 3 | b, for drawn a and b. Varies: divisor, a, b.
27. q27 Proof by contrapositive [Levin 3.2] ← q13, q25
   Asked: the index of the statement that is actually proved, then a numeric check of it. Varies: claim.
28. q28 Proof by cases [Levin 3.2] ← q25
   Asked: the number of cases, then the whole number (n² + n) ÷ 2 for a drawn n in each case. Varies: n, the claim.
29. q29 Chapter review: choosing a method [Levin 3.2] ← q26, q27, q28
   Asked: the method index (1 direct, 2 contrapositive, 3 cases), then a value from the proof. Varies: claim.
30. q30 Proof by contradiction [Levin 3.2] ← q27
   Asked: for Euclid's argument, N = (product of the listed primes) + 1 and its smallest prime factor; or the step where a contradiction appears. Varies: the prime list.
31. q31 Disproving with a counterexample [Levin 3.2] ← q16
   Asked: the smallest counterexample to a false claim about whole numbers. Varies: claim family.
32. q32 Existence proofs: finding a witness [Levin 3.2] ← q15
   Asked: the smallest witness for "there is an n with …". Varies: condition.
33. q33 If-and-only-if proofs: both directions [Levin 3.2] ← q06, q27
   Asked: which direction a given argument proves (1 forward, 2 backward), then the count of n from 1 to N satisfying each side (equal). Varies: claim, N.
34. q34 Spotting the flawed step [Levin 3.2] ← q30
   Asked: the index of the first wrong step (dividing by zero, a converse used as if equivalent). Varies: the bogus proof.
35. q35 Induction: the base case and the domino idea [Levin 2.5] ← q25
   Asked: both sides of a claim at the base case, then the first n where it holds. Varies: claim.
36. q36 The inductive step: from k to k + 1 [Levin 2.5] ← q35
   Asked: the amount added going from case k to case k + 1, for a drawn k. Varies: formula, k.
37. q37 Induction for sums [Levin 2.5] ← q36
   Asked: the value of a proved formula such as 1 + 3 + … + (2n − 1) = n² at a drawn n, and the next term. Varies: formula, n.
38. q38 Induction for inequalities: where it starts [Levin 2.5] ← q36
   Asked: the smallest n from which 2ⁿ > n² (or 3ⁿ > n³, and so on) holds for good. Varies: the pair.
39. q39 Strong induction: postage stamps [Levin 2.5] ← q38
   Asked: the largest amount that cannot be paid with a- and b-unit stamps, then the number of base cases needed. Varies: a, b.
40. q40 Realm review and bridge to Real analysis: "for every ε there is an N" [Levin 0.2, 2.5] ← q37, q39
   Asked: the smallest N with 1 ÷ n < ε for every n ≥ N, plus one induction value. Varies: ε, formula.

## Answers
Logic is not numeric by nature, so every answer is a number of one of these kinds: a truth value (1 true, 0 false); a count (rows, true rows, rule-breakers, witnesses, knights, cases, numbers from 1 to N that satisfy a condition); an index of a step, rule, method or statement from a numbered list in the prompt; a smallest counterexample or witness; or a value computed inside a proof (k in 2k + 1, the m in 3m, Euclid's N). A proof is never an answer. Generators vary the numbers in a condition, the compound statement (from a pool of shapes), the domain, the log, or the order of steps, so each draw is new; an index answer is shuffled with its list.

## Ranks, achievements, copy
Ranks: OBSERVER, RULE READER, CIRCUIT CHECKER, REGULATOR, ADVOCATE, PROVER, INVESTIGATOR, CHIEF LOGICIAN, MASTER OF PROOF.
Achievements: "Q.E.D." (`logic-done`, all 40 concepts); "Every case covered" (`logic-master`, all 160).
Home title: "Every rule makes a claim.<br><em>Learn to prove it.</em>"
First visit (Mira): "Welcome back. The outpost runs on written rules now, and some of them contradict each other. We start with one sentence and one question: is it true? Type 1 for true and 0 for false."
First button: "Check the first rule". All done: "You did it. Every rule in the hall is checked, and you can prove what holds for every number. Real analysis will use these tools to make limits exact, once you have finished Calculus 2."
Must-have glossary terms: statement, negation, conjunction, disjunction, conditional, truth table, tautology, logically equivalent, contrapositive, quantifier, counterexample, valid argument, proof by contradiction, mathematical induction.
