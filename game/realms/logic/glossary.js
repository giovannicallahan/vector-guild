/* Logic and proof glossary: the words this pack teaches, shown as tap-to-define buttons in its lessons, prompts, hints and
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
P['logic'] = {
 required: ['statement', 'negation', 'conjunction', 'disjunction', 'conditional', 'truth table', 'tautology', 'logically equivalent', 'contrapositive', 'quantifier', 'counterexample', 'valid argument', 'proof by contradiction', 'mathematical induction'],
 terms: [
  /* q01–q10 (missions-a.js) */
  ['statement', 'q01', 'A sentence that is either true or false, but not both.', '“9 is greater than 4” is a true statement; “Shut the door” is not a statement.'],
  ['truth value', 'q01', 'Whether a statement is true or false; in this realm it is typed as 1 for true and 0 for false.', '“2 + 2 equals 5” has the truth value 0.'],
  ['negation', 'q02', 'The statement that another statement is not the case, written ¬p; it is true exactly when p is false.', 'If p is “n is less than 4”, then ¬p is “n is 4 or more”.'],
  ['compound statement', 'q03', 'A statement built from smaller statements joined by words such as not, and, or, if … then.', 'p ∧ ¬q is a compound statement made from p and q.'],
  ['conjunction', 'q03', 'Two statements joined by “and”, written p ∧ q; it is true only when both parts are true.', '“n is greater than 2 and n is less than 5” is true for n = 3 and n = 4.'],
  ['disjunction', 'q04', 'Two statements joined by an inclusive “or”, written p ∨ q; it is false only when both parts are false.', '“n is less than 2 or n is greater than 8” is true for n = 1 and n = 9.'],
  ['inclusive or', 'q04', 'The “or” of logic, which is true when either part is true and also when both are.', '“n is less than 5 or n is a multiple of 2” is true for n = 4, where both parts hold.'],
  ['conditional', 'q05', 'An if-then statement p → q; it is false only when its hypothesis is true and its conclusion is false.', '“If n is greater than 5, then n is greater than 2” is true for every n.'],
  ['hypothesis', 'q05', 'The part of an if-then statement that comes after “if”.', 'In “if it rains, the hatch is closed”, the hypothesis is “it rains”.'],
  ['conclusion', 'q05', 'The part of an if-then statement that comes after “then”, or more generally the claim said to follow.', 'In “if it rains, the hatch is closed”, the conclusion is “the hatch is closed”.'],
  ['biconditional', 'q06', 'An if-and-only-if statement p ↔ q; it is true when p and q have the same truth value.', 'For a whole number n, “n is greater than 3 if and only if n is greater than 2” is false only for n = 3.', ['if and only if']],
  ['truth table', 'q07', 'A table with one row for each case of the letters, showing the truth value of a statement in every case.', 'A truth table for p and q has 4 rows: TT, TF, FT and FF.'],
  ['tautology', 'q09', 'A compound statement that is true on every row of its truth table.', 'p ∨ ¬p is a tautology: it is true whether p is true or false.', ['tautologies']],
  ['contradiction', 'q09', 'A compound statement that is false on every row of its truth table.', 'p ∧ ¬p is a contradiction: it is false whether p is true or false.'],
  ['logically equivalent', 'q10', 'Having the same truth value on every row of one truth table, written with the symbol ≡.', 'p → q ≡ ¬p ∨ q: the two columns match on all 4 rows.', ['≡']],
  ['connective', 'q08', 'One of the symbols ¬, ∧, ∨, → and ↔ that build compound statements from smaller ones.', 'In (p ∨ q) → ¬r the main connective is →, which joins p ∨ q to ¬r.'],
  /* q11–q20 (missions-b.js) */
  ['De Morgan’s laws', 'q12', 'The two rules for negating “and” and “or”: ¬(p ∧ q) ≡ ¬p ∨ ¬q and ¬(p ∨ q) ≡ ¬p ∧ ¬q.', '“Not both heavy and fragile” means “light, or not fragile, or both”.', ['De Morgan’s law', 'De Morgan\'s laws']],
  ['converse', 'q13', 'The conditional q → p made by swapping the two parts of p → q; it can have a different truth value.', 'The converse of “if n is a multiple of 6, then n is a multiple of 3” is false: n = 9.'],
  ['inverse', 'q13', 'The conditional ¬p → ¬q made by negating both parts of p → q; it matches the converse, not the rule.', 'The inverse of “if n > 9, then n > 6” is “if n ≤ 9, then n ≤ 6”.'],
  ['contrapositive', 'q13', 'The conditional ¬q → ¬p made by swapping and negating both parts of p → q; it is logically equivalent to p → q.', 'The contrapositive of “if n > 9, then n > 6” is “if n ≤ 6, then n ≤ 9”.'],
  ['quantifier', 'q15', 'A word or symbol that says how many members of the domain must pass: ∀ for every one, ∃ for at least one.', '∀x (x > 3) and ∃x (x > 8) over the domain 4, 7, 9 are both true.', ['∀', '∃']],
  ['domain', 'q15', 'The list of values a letter such as x is allowed to take in a claim with a quantifier.', 'Over the domain 2, 5, 6, the claim ∃x (x > 5) has the witness 6.'],
  ['witness', 'q15', 'A member of the domain that makes a “there is” claim true; one witness is enough.', 'For ∃x (x is a multiple of 3) over 2, 5, 6, 11, the only witness is 6.', ['witnesses']],
  ['counterexample', 'q16', 'A case that makes a “for every” claim false; a single one is enough to disprove the claim.', 'n = 5 is a counterexample to “for every n, n² < 3n + 10”, since 25 < 25 is false.'],
  ['argument', 'q18', 'A list of statements called premises, followed by a conclusion that is claimed to follow from them.', 'Premises p → q and p, conclusion q.'],
  ['premise', 'q18', 'One of the statements an argument starts from and takes as given.', 'In “p ∨ q, ¬p, so q” the premises are p ∨ q and ¬p.'],
  ['valid argument', 'q18', 'An argument whose conclusion is true on every row of the truth table where all its premises are true.', '“p → q, ¬q, so ¬p” is a valid argument: no row has true premises and a false conclusion.', ['valid']],
  ['rule of inference', 'q19', 'A valid pattern of argument with a name, used as one step of reasoning.', 'Modus ponens and modus tollens are rules of inference.', ['rules of inference']],
  ['modus ponens', 'q19', 'The rule of inference that goes from p → q and p to the conclusion q.', 'If the pump runs, the pressure rises; the pump runs; so the pressure rises.'],
  ['modus tollens', 'q19', 'The rule of inference that goes from p → q and ¬q to the conclusion ¬p.', 'If the pump runs, the pressure rises; it did not rise; so the pump is not running.'],
  ['chain rule', 'q20', 'The rule of inference that goes from p → q and q → r to the conclusion p → r.', 'If sealed, then the fan is on; if the fan is on, then the heater is on; so if sealed, then the heater is on.', ['hypothetical syllogism']],
  ['fallacy', 'q20', 'An argument pattern that can look convincing but is not valid: its premises can be true while its conclusion is false.', 'From p → q and q, concluding p is a fallacy.', ['fallacies']],
  ['affirming the conclusion', 'q20', 'The fallacy of going from p → q and q to p.', 'The pressure rose, so the pump must be running: but something else may have raised it.'],
  ['denying the hypothesis', 'q20', 'The fallacy of going from p → q and ¬p to ¬q.', 'The pump is off, so the pressure cannot rise: but something else may raise it.'],
  /* q21–q30 (missions-c.js) */
  ['nested quantifier', 'q21', 'Two quantifiers in one statement, one inside the other, such as “for every x there is a y”; changing their order can change the meaning.', '∀x ∃y (y > x) is true for whole numbers, but ∃y ∀x (y > x) is false.'],
  ['knight', 'q22', 'In a logic puzzle, an islander who always tells the truth, so every statement a knight makes is true.', 'A knight who says “Bo is a knave” makes Bo a knave.'],
  ['knave', 'q22', 'In a logic puzzle, an islander who always lies, so every statement a knave makes is false.', 'A knave who says “we are both knaves” cannot be telling the truth.'],
  ['even', 'q24', 'A whole number is even when it equals 2 times a whole number: n = 2k.', '14 = 2 × 7 is even, and so is 0 = 2 × 0.', [], 'even (if|though|so|more|less|after|before|then|a |the )|not even|or even'],
  ['odd', 'q24', 'A whole number is odd when it is 1 more than an even number: n = 2k + 1 for a whole number k.', '37 = 2 × 18 + 1 is odd.'],
  ['divides', 'q24', 'a divides b, written a | b, when b equals a times some whole number; it is a claim, true or false, not a number.', '4 | 28 is true because 28 = 4 × 7; 6 | 32 is false.'],
  ['definition', 'q24', 'An exact statement of what a word means, which a proof may then use about anything the word describes.', 'Definition: n is odd when n = 2k + 1 for some whole number k.'],
  ['theorem', 'q25', 'A statement that has been proved true, often in the form “if hypothesis, then conclusion”.', 'Theorem: if m and n are odd, then m × n is odd.'],
  ['proof', 'q25', 'A chain of statements, each an assumption, a definition or a step forced by earlier ones, that shows a claim holds in every case.', 'A proof that odd × odd is odd covers every pair of odd numbers, not only 3 and 5.'],
  ['direct proof', 'q25', 'A proof that assumes the hypothesis and moves step by step, using definitions and algebra, until it reaches the conclusion.', 'Assume m = 2a + 1 and n = 2b + 1, multiply, and reach 2(2ab + a + b) + 1.'],
  ['proof by contrapositive', 'q27', 'A proof of “if p, then q” that gives a direct proof of “if not q, then not p” instead; the two are logically equivalent.', 'To show “if n² is even, then n is even”, prove “if n is odd, then n² is odd”.'],
  ['proof by cases', 'q28', 'A proof that splits the possibilities into cases that cover them all and proves the claim separately in each case.', 'n² + n is even: one case for n even, one for n odd.'],
  ['proof by contradiction', 'q30', 'A proof that assumes the claim is false and shows that this assumption leads to something impossible, so the claim must be true.', 'Assume a list holds every prime; Euclid’s N then has a prime factor missing from it.'],
  ['prime', 'q30', 'A whole number above 1 whose only divisors are 1 and itself.', '2, 3, 5, 7 and 11 are prime; 15 = 3 × 5 is not.', ['primes']],
  /* q31–q40 (missions-d.js) */
  ['existence proof', 'q32', 'A proof that something exists, given by showing one example of it, a witness, and checking that it works.', 'There is an even prime: 2 is one, and that settles it.', []],
  ['forward direction', 'q33', 'In “P if and only if Q”, the half that says if P, then Q.', 'For “n² is even if and only if n is even”: if n² is even, then n is even.', []],
  ['backward direction', 'q33', 'In “P if and only if Q”, the half that says if Q, then P.', 'For “n² is even if and only if n is even”: if n is even, then n² is even.', []],
  ['mathematical induction', 'q35', 'A way to prove a claim for every whole number from a starting point on: prove a base case, then prove that each case gives the next.', 'Show 1 = 1², then that adding 2k + 1 to k² gives (k + 1)².', []],
  ['base case', 'q35', 'The first case of a proof by induction, checked directly: the claim is true for the starting number.', 'For 1 + 2 + … + n = n(n + 1) ÷ 2, both sides are 1 at n = 1.', []],
  ['inductive step', 'q36', 'The part of a proof by induction that shows: if the claim holds for k, it also holds for k + 1.', 'k² + (2k + 1) = (k + 1)², so the odd-number formula passes from k to k + 1.', []],
  ['inductive hypothesis', 'q36', 'The assumption, made in the inductive step, that the claim holds for one number k.', 'Assume 1 + 3 + … + (2k − 1) = k².', []],
  ['strong induction', 'q39', 'Induction in which the step may use every earlier case, not only the one just before.', 'To pay 11 credits with 3s and 5s, take the payment for 8 and add a 3.', []],
  ['epsilon', 'q40', 'The Greek letter ε, used in analysis for a small positive tolerance that may be chosen as small as you like.', 'For ε = 0.01, 1 ÷ n < ε from n = 101 on.', ['ε']],
 ]
};
})();
