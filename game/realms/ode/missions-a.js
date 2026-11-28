/* Differential equations missions, file a: q01–q10. Mission objects: docs/PACK-FORMAT.md §2 (every field), §2.1 (what the
   harness requires), §7 (answers). Generators: gen-a.js (build(canonical) reproduces the prompt, hints, solution
   and guidance here exactly); experiments: experiments-a.js; drill statements: variants-a.js; oracles:
   qa/realms/ode/oracle-a.js. One author per file. The missions of this file (id, chapter, tier and XP, sector):
     q01  ch 1 Equations of change · Basic, 100 XP · sector 'Greenhouse' · Checking a solution [0.2]
     q02  ch 1 Equations of change · Basic, 100 XP · sector 'Greenhouse' · Order and linearity [0.3]
     q03  ch 1 Equations of change · Basic, 100 XP · sector 'Greenhouse' · Integrals as solutions: y′ = f(x) with a starting value [1.1]
     q04  ch 1 Equations of change · Basic, 100 XP · sector 'Greenhouse' · Slope fields and equilibrium solutions [1.2]
     q05  ch 1 Equations of change · Basic, 100 XP · sector 'Greenhouse' · Euler's method [1.7]
     q06  ch 1 Equations of change · Basic, 100 XP · sector 'Greenhouse' · Separable equations [1.3]
     q07  ch 2 First-order models · Basic, 100 XP · sector 'Coolant Loop' · Linear first-order equations and the integrating factor [1.4]
     q08  ch 2 First-order models · Basic, 100 XP · sector 'Coolant Loop' · Mixing tanks [1.4]
     q09  ch 2 First-order models · Basic, 100 XP · sector 'Coolant Loop' · Autonomous equations: equilibria and stability [1.6]
     q10  ch 2 First-order models · Basic, 100 XP · sector 'Coolant Loop' · Logistic growth [1.6] */
(function(){
'use strict';
/* Jiří Lebl, Notes on Diffy Qs: Differential Equations for Engineers sections, one entry per section the missions below cite. Open each page before you set `verified` to the
   date you saw it. Every mission needs at least one source whose title matches /^Lebl/ (Lebl, Notes on Diffy Qs).
   A title reads like: Lebl, Notes on Diffy Qs — 1.3 Separable equations
   Link to the section page itself: https://www.jirka.org/diffyqs/html/<file>.html */
const source = {
 s0_2: {"title":"Lebl, Notes on Diffy Qs — 0.2 Introduction to differential equations","url":"https://www.jirka.org/diffyqs/html/introde_section.html","description":"What a differential equation and its solution are, and checking that a given function solves an equation by putting it in. The starting-rate condition used here is worked out in this mission.","verified":"2026-11-27"},
 s0_3: {"title":"Lebl, Notes on Diffy Qs — 0.3 Classification of differential equations","url":"https://www.jirka.org/diffyqs/html/classification_section.html","description":"Ordinary and partial differential equations, the order of an equation, and linear against nonlinear equations.","verified":"2026-11-27"},
 s1_1: {"title":"Lebl, Notes on Diffy Qs — 1.1 Integrals as solutions","url":"https://www.jirka.org/diffyqs/html/integralsols_section.html","description":"Solving y′ = f(x) by integration, the general solution with its constant, and initial value problems.","verified":"2026-11-27"},
 s1_2: {"title":"Lebl, Notes on Diffy Qs — 1.2 Slope fields","url":"https://www.jirka.org/diffyqs/html/slopefields_section.html","description":"Slope fields: the slope the equation gives at each point, and solution curves that follow those slopes. The equilibrium solution of this mission’s equation is worked out in this mission.","verified":"2026-11-27"},
 s1_3: {"title":"Lebl, Notes on Diffy Qs — 1.3 Separable equations","url":"https://www.jirka.org/diffyqs/html/separable_section.html","description":"Separable equations: moving y to one side and x to the other, integrating both sides, and using an initial condition.","verified":"2026-11-27"},
 s1_4: {"title":"Lebl, Notes on Diffy Qs — 1.4 Linear equations and the integrating factor","url":"https://www.jirka.org/diffyqs/html/intfactor_section.html","description":"First-order linear equations solved with an integrating factor, and a mixing tank of salt water as an application.","verified":"2026-11-27"},
 s1_6: {"title":"Lebl, Notes on Diffy Qs — 1.6 Autonomous equations","url":"https://www.jirka.org/diffyqs/html/auteq_section.html","description":"Autonomous equations, their equilibrium (critical) points, stable and unstable equilibria, and the logistic equation with its carrying capacity. The time to reach a level is worked out in this mission.","verified":"2026-11-27"},
 s1_7: {"title":"Lebl, Notes on Diffy Qs — 1.7 Numerical methods: Euler’s method","url":"https://www.jirka.org/diffyqs/html/numer_section.html","description":"Euler’s method: stepping along the slope with a step size h to approximate the solution of an initial value problem.","verified":"2026-11-27"}
};
window.QUESTS = window.QUESTS || [];
window.QUESTS.push(
 {
  "id": "q01",
  "title": "The gel that feeds itself",
  "topic": "Checking a solution",
  "tier": "Basic",
  "sector": "Greenhouse",
  "brief": "The seed trays are fed by a nutrient gel that changes by itself, and Mira wants a formula for it that the equation really allows.",
  "lesson": "A function is a solution of a differential equation when putting it and its derivatives into the equation makes both sides equal for every t.",
  "prompt": "Mira models the nutrient gel in a seed tray with the differential equation 3y′ − 6y = 0, where y is the gel in grams and t is the time in days. She tries a solution of the form y = Ce^(kt). Enter the value of k that makes it a solution. At the start the gel is changing at y′(0) = 80 grams per day; then enter C.",
  "answer": [
   2,
   40
  ],
  "labels": [
   "k",
   "C (grams)"
  ],
  "tolerance": 0.01,
  "hints": [
   "Differentiate y = Ce^(kt) to get y′ = kCe^(kt). Put y and y′ into the equation and divide every term by Ce^(kt), which is never 0: what is left is an equation for k alone.",
   "At t = 0 the factor e^(kt) is e⁰, which is 1, so y′(0) = kC. Divide the starting rate by k to get C."
  ],
  "solution": "Put y = Ce^(kt) and y′ = kCe^(kt) into 3y′ − 6y = 0: 3kCe^(kt) − 6Ce^(kt) = 0. Dividing by Ce^(kt) leaves 3k − 6 = 0, so k = 6 ÷ 3 = 2. Then y′(0) = kC = 2C, and this equals 80, so C = 80 ÷ 2 = 40. The solution is y = 40e^(2t), which starts at 40 grams.",
  "xp": 100,
  "prereqs": [],
  "artifact": {
   "name": "Gel tray log",
   "description": "The first equation of change at the outpost, with the solution that fits it."
  },
  "sources": [
   source.s0_2
  ],
  "teaching": {
   "intuition": "Most laws of nature do not say what a quantity is; they say how fast it changes. A differential equation is an equation that links an unknown function to its own derivatives. We write y′ for the derivative dy/dt of the unknown y(t), so y′ = 2y says that y grows at a rate equal to twice its size. A solution is a function that makes the equation true for every t. Checking a guess is easy: differentiate it, put the function and its derivative into the equation, and see whether both sides agree. Exponentials are the natural guess for equations where the rate is a multiple of the amount, because the derivative of Ce^(kt) is kCe^(kt): the same shape, just multiplied by k.",
   "steps": [
    "Write down the guess and its derivative: for y = Ce^(kt), y′ = kCe^(kt).",
    "Put both into the differential equation in place of y and y′.",
    "Every term now has the factor Ce^(kt), which is never 0 when C is not 0. Divide it out and solve what is left for k.",
    "Use the extra fact about the start, such as the starting value or the starting rate at t = 0, to find C. At t = 0, e^(kt) = 1."
   ],
   "example": {
    "prompt": "Find k so that y = Ce^(kt) solves 2y′ + 10y = 0, and find C if the starting rate is y′(0) = −15.",
    "steps": [
     "Put in y and y′ = kCe^(kt): 2kCe^(kt) + 10Ce^(kt) = 0.",
     "Divide by Ce^(kt): 2k + 10 = 0, so k = −5.",
     "At t = 0, y′(0) = kC = −5C = −15, so C = 3."
    ],
    "answer": "k = −5 and C = 3, so y = 3e^(−5t)."
   },
   "pitfalls": [
    "Forgetting the factor k when differentiating: the derivative of Ce^(kt) is kCe^(kt), not Ce^(kt).",
    "Keeping the sign of the y term on the wrong side: in 3y′ − 6y = 0 the y term is −6y, so 3k − 6 = 0 and k is positive.",
    "Treating the starting rate y′(0) as the starting amount y(0). The rate is k times the amount, so divide it by k."
   ]
  },
  "guidance": [
   {
    "prompt": "Put y = Ce^(kt) and y′ = kCe^(kt) into 3y′ − 6y = 0 and divide by Ce^(kt). That leaves 3k − 6 = 0. What is k?",
    "answer": [
     2
    ],
    "labels": [
     "k"
    ],
    "explanation": "3k = 6, so k = 6 ÷ 3 = 2. Any other k leaves a term that is not 0, so the equation fails."
   },
   {
    "prompt": "With k = 2, the starting rate is y′(0) = 2C, and it equals 80. What is C?",
    "answer": [
     40
    ],
    "labels": [
     "C (grams)"
    ],
    "explanation": "C = 80 ÷ 2 = 40. Since e⁰ = 1, C is also the amount of gel at t = 0: 40 grams."
   }
  ]
 },
 {
  "id": "q02",
  "title": "Sorting the controller equations",
  "topic": "Order and linearity",
  "tier": "Basic",
  "sector": "Greenhouse",
  "brief": "The greenhouse controllers come with equations of every shape, and Mira wants each one sorted before anyone tries to solve it.",
  "lesson": "The order of a differential equation is its highest derivative; it is linear when y and its derivatives appear only to the first power, multiplied by functions of t.",
  "prompt": "A greenhouse controller is described by the equation y″ + 3y′ + y² = sin t, where y is a function of the time t. Enter the order of this differential equation, then enter 1 if it is linear or 0 if it is nonlinear.",
  "answer": [
   2,
   0
  ],
  "labels": [
   "order",
   "linear (1) or nonlinear (0)"
  ],
  "tolerance": 0.01,
  "hints": [
   "The order is the order of the highest derivative of y that appears: y′ is first order, y″ second order, y‴ third order.",
   "An equation is linear when each term is y, or one of its derivatives, multiplied only by a number or a function of t, or else is a function of t alone. A power of y or of a derivative, a product of two of them, or y inside a function such as sin makes it nonlinear."
  ],
  "solution": "The highest derivative of y in y″ + 3y′ + y² = sin t is y″, so the order is 2. For a linear equation each term must be y or a derivative of y multiplied only by a number or a function of t, or a function of t alone. The term y² is not of that form, because y is squared, so the equation is nonlinear: enter 0.",
  "xp": 100,
  "prereqs": [
   "q01"
  ],
  "artifact": {
   "name": "Equation sorting rack",
   "description": "Labelled slots for first, second and third order, linear and nonlinear."
  },
  "sources": [
   source.s0_3
  ],
  "teaching": {
   "intuition": "Before solving an equation it pays to know what kind it is, because each kind has its own methods. An ordinary differential equation, or ODE, has an unknown function of one variable, here y(t), and its ordinary derivatives. The second derivative is written y″ and the third y‴. The order of the equation is the order of the highest derivative in it: y″ + y = 0 is second order. The equation is linear when every term is y or one of its derivatives multiplied only by a number or a function of t, or is a function of t alone. So t²y″ + (sin t)y = e^t is linear, even though t² and sin t are not simple. It is nonlinear as soon as y or a derivative is squared, multiplied by another of them (as in yy′), or put inside a function (as in sin y or e^y). Linear equations are the ones with general methods; nonlinear ones often need special tricks or pictures.",
   "steps": [
    "Find the highest derivative of y in the equation: its order (1 for y′, 2 for y″, 3 for y‴) is the order of the equation.",
    "Go through the terms one at a time. Functions of t, alone or multiplying y or a derivative, are allowed in a linear equation.",
    "Look for a term that squares y or a derivative, multiplies two of them together, or puts y inside a function such as sin or e^. One such term makes the equation nonlinear."
   ],
   "example": {
    "prompt": "Classify (sin t)y′ + 5y = e^t and y″ + yy′ = 0.",
    "steps": [
     "In the first, the highest derivative is y′, so it is first order. Each term is y or y′ times a function of t, or a function of t alone: linear.",
     "In the second, the highest derivative is y″, so it is second order. The term yy′ multiplies y by its derivative: nonlinear."
    ],
    "answer": "The first is first order and linear; the second is second order and nonlinear."
   },
   "pitfalls": [
    "Calling an equation nonlinear because of a function of t such as t² or sin t. Only powers, products and functions of y and its derivatives make it nonlinear.",
    "Reading the order from a power: (y′)² is a first derivative squared, so it is first order, and it makes the equation nonlinear.",
    "Taking the order from the first term written instead of the highest derivative anywhere in the equation."
   ]
  },
  "guidance": [
   {
    "prompt": "Which derivative of y is the highest one in y″ + 3y′ + y² = sin t? Enter its order: 1 for y′, 2 for y″, 3 for y‴.",
    "answer": [
     2
    ],
    "labels": [
     "order"
    ],
    "explanation": "The highest derivative is y″, so the equation has order 2. The other terms have lower order and do not change that."
   },
   {
    "prompt": "Look at each term of y″ + 3y′ + y² = sin t. Enter 1 if every term is y or a derivative of y multiplied by a number or a function of t, or a function of t alone; enter 0 if some term breaks that rule.",
    "answer": [
     0
    ],
    "labels": [
     "linear (1) or nonlinear (0)"
    ],
    "explanation": "The term y² is not of that form, because y is squared, so the equation is nonlinear: enter 0."
   }
  ]
 },
 {
  "id": "q03",
  "title": "Filling the cistern",
  "topic": "Integrals as solutions: y′ = f(x) with a starting value",
  "tier": "Basic",
  "sector": "Greenhouse",
  "brief": "The greenhouse cistern fills at a rate that changes through the morning, and the crew want to know how much water it will hold later on.",
  "lesson": "When y′ depends on x alone, every solution is an antiderivative plus a constant, and one starting value picks the constant.",
  "prompt": "The water y in a greenhouse cistern, in litres, changes at the rate y′ = 6x² − 2x + 4 litres per hour, where x is the number of hours since the pumps started. The gauge read y(1) = 20 litres. Solve this initial value problem and enter y(3), the water in the cistern 3 hours after the pumps started.",
  "answer": [
   72
  ],
  "labels": [
   "y at the later time (litres)"
  ],
  "tolerance": 0.01,
  "hints": [
   "Integrate the rate term by term: the general solution is an antiderivative of the right-hand side plus a constant C.",
   "Put the initial condition into the general solution to find C, then put in the later x."
  ],
  "solution": "Integrating gives the general solution y = 2x³ − x² + 4x + C. The initial condition y(1) = 20 gives 2 × 1 − 1 + 4 × 1 + C = 20, that is 5 + C = 20, so C = 15. The particular solution is y = 2x³ − x² + 4x + 15, and y(3) = 2 × 27 − 9 + 4 × 3 + 15 = 57 + 15 = 72 litres.",
  "xp": 100,
  "prereqs": [
   "q01"
  ],
  "artifact": {
   "name": "Cistern gauge",
   "description": "A dial marked with the reading it started from and the one it reached."
  },
  "sources": [
   source.s1_1
  ],
  "teaching": {
   "intuition": "The simplest differential equations give the rate as a function of x alone: y′ = f(x). Then solving the equation is just integrating, because y must be an antiderivative of f. But every antiderivative can be shifted up or down by a constant and still have the same derivative, so y = F(x) + C, where F is any antiderivative. This whole family, with C left free, is the general solution. To pick out one member we need one more fact, an initial condition such as y(1) = 20: the value of y at one x. An equation together with an initial condition is an initial value problem, and the one function that satisfies both is the particular solution. Physically: knowing how fast water flows in tells you how the level changes, and one gauge reading tells you where the level actually is.",
   "steps": [
    "Integrate the right-hand side term by term to get an antiderivative F(x).",
    "Write the general solution y = F(x) + C.",
    "Put the initial condition in: if y(x₀) = y₀, then C = y₀ − F(x₀).",
    "Put the later x into the particular solution F(x) + C."
   ],
   "example": {
    "prompt": "Solve y′ = 3x² + 2 with y(0) = 4, and find y(2).",
    "steps": [
     "An antiderivative is x³ + 2x, so the general solution is y = x³ + 2x + C.",
     "At x = 0: 0 + C = 4, so C = 4 and y = x³ + 2x + 4.",
     "At x = 2: 8 + 4 + 4 = 16."
    ],
    "answer": "y(2) = 16."
   },
   "pitfalls": [
    "Forgetting the constant C, or setting it to 0, instead of finding it from the initial condition.",
    "Using C = y₀ when the initial condition is not at x = 0: the antiderivative at x₀ must be subtracted first.",
    "Differentiating the rate instead of integrating it."
   ]
  },
  "guidance": [
   {
    "prompt": "The general solution is y = 2x³ − x² + 4x + C. The initial condition says y = 20 when x = 1. What is C?",
    "answer": [
     15
    ],
    "labels": [
     "C"
    ],
    "explanation": "At x = 1 the antiderivative is 5, so 5 + C = 20 and C = 15."
   },
   {
    "prompt": "The particular solution is y = 2x³ − x² + 4x + 15. What is y(3)?",
    "answer": [
     72
    ],
    "labels": [
     "y at the later time (litres)"
    ],
    "explanation": "At x = 3 the antiderivative is 57; adding C gives 57 + 15 = 72 litres."
   }
  ]
 },
 {
  "id": "q04",
  "title": "Reading the humidity field",
  "topic": "Slope fields and equilibrium solutions",
  "tier": "Basic",
  "sector": "Greenhouse",
  "brief": "Mira has sketched the little arrows of a humidity equation across the greenhouse wall chart, and wants two readings from it before the vents are set.",
  "lesson": "A slope field draws the slope y′ = f(x, y) at each point; a constant y where the slope is 0 for every x is an equilibrium solution.",
  "prompt": "Mira draws the slope field of y′ = (x + 1)(2y − 8) for a greenhouse humidity gauge, where y is the reading and x is the time in hours. Enter the slope of the field at the point (2, 1). Then enter the value of the equilibrium solution: the constant y that solves the equation.",
  "answer": [
   -18,
   4
  ],
  "labels": [
   "slope at the point",
   "equilibrium y"
  ],
  "tolerance": 0.01,
  "hints": [
   "The slope of the field at a point (x, y) is the right-hand side of the equation worked out at that x and that y.",
   "A constant solution has y′ = 0 at every x. The factor with x in it is not 0 for every x, so the factor with y in it must be 0."
  ],
  "solution": "At (2, 1) the slope is (2 + 1)(2 × 1 − 8) = 3 × (−6) = −18. For a constant solution y′ must be 0 for every x, so 2y − 8 = 0 and y = 8 ÷ 2 = 4. The horizontal line y = 4 is the equilibrium solution.",
  "xp": 100,
  "prereqs": [
   "q03"
  ],
  "artifact": {
   "name": "Slope-field chart",
   "description": "A wall chart of short arrows, with one flat line running straight across it."
  },
  "sources": [
   source.s1_2
  ],
  "teaching": {
   "intuition": "An equation y′ = f(x, y) tells you, at every point (x, y) of the plane, how steep a solution through that point must be. Draw a short line with that slope at many points and you get a slope field. A solution curve is a curve that follows these little lines everywhere, like a leaf floating along the arrows of a current. You can read the slope at any point by working out f there. Sometimes a horizontal line fits the field exactly: if f(x, m) = 0 for every x, the constant function y = m has derivative 0 and so solves the equation. Such a constant solution is called an equilibrium solution, and in the slope field it shows up as a row of flat lines.",
   "steps": [
    "To read the slope at a point, put its x and its y into the right-hand side f(x, y).",
    "A positive number means solutions rise through that point, a negative number that they fall, and 0 that they are momentarily flat.",
    "For an equilibrium solution, find the constant y that makes f(x, y) = 0 for every x, not just at one x."
   ],
   "example": {
    "prompt": "For y′ = (x − 5)(3y − 6), find the slope at (1, 4) and the equilibrium solution.",
    "steps": [
     "At (1, 4): (1 − 5)(3 × 4 − 6) = (−4) × 6 = −24.",
     "The slope is 0 for every x only when 3y − 6 = 0, that is y = 2. (x − 5 is 0 only at x = 5.)"
    ],
    "answer": "The slope at (1, 4) is −24, and y = 2 is the equilibrium solution."
   },
   "pitfalls": [
    "Swapping x and y when putting a point into f: in (2, 1) the first number is x.",
    "Taking the x value that makes a factor 0 as an equilibrium. A solution y = m must have slope 0 for every x, so only a factor with y in it gives one.",
    "Forgetting the sign: a negative slope means the solution is falling through the point."
   ]
  },
  "guidance": [
   {
    "prompt": "Put x = 2 and y = 1 into (x + 1)(2y − 8). What is the slope there?",
    "answer": [
     -18
    ],
    "labels": [
     "slope at the point"
    ],
    "explanation": "x + 1 = 3 and 2y − 8 = −6, so the slope is 3 × (−6) = −18."
   },
   {
    "prompt": "An equilibrium solution is a constant y with slope 0 at every x. For which y is 2y − 8 = 0?",
    "answer": [
     4
    ],
    "labels": [
     "equilibrium y"
    ],
    "explanation": "2y = 8, so y = 4. Along the line y = 4 every slope in the field is 0, so the line itself is a solution."
   }
  ]
 },
 {
  "id": "q05",
  "title": "Stepping through the moisture curve",
  "topic": "Euler's method",
  "tier": "Basic",
  "sector": "Greenhouse",
  "brief": "The test bed's moisture equation has no tidy formula Mira trusts, so she wants the computer's step-by-step estimate checked by hand.",
  "lesson": "Euler's method estimates a solution by repeatedly moving a step h along the slope given by the equation at the current point.",
  "prompt": "The moisture level y of a test bed obeys y′ = x + 2y, where x is the time in hours, and y(0) = 1. Use Euler's method with step size h = 0.1 for 3 steps, to estimate y at x = 0.3. Enter the estimate to 3 decimal places.",
  "answer": [
   1.76
  ],
  "labels": [
   "estimate of y"
  ],
  "tolerance": 0.0005,
  "hints": [
   "Each step of Euler's method works out the slope f(x, y) at the current point, then moves along it: the new y is the old y plus h times the slope, and the new x is the old x plus h.",
   "Keep every decimal of each y until the last step, and round only the final estimate."
  ],
  "solution": "Write f(x, y) = x + 2y. The slopes are f(0, 1) = 2, f(0.1, 1.2) = 2.5, f(0.2, 1.45) = 3.1. The steps are y₁ = 1 + 0.1 × 2 = 1.2, y₂ = 1.2 + 0.1 × 2.5 = 1.45, y₃ = 1.45 + 0.1 × 3.1 = 1.76. So after 3 steps the estimate of y(0.3) is 1.76.",
  "xp": 100,
  "prereqs": [
   "q04"
  ],
  "artifact": {
   "name": "Stepping log",
   "description": "A column of small steps, each one taken along the slope of the last point."
  },
  "sources": [
   source.s1_7
  ],
  "teaching": {
   "intuition": "Many differential equations cannot be solved with a formula, but a slope field still tells us which way the solution heads. Euler's method turns that into numbers. Start at the known point (x₀, y₀). Work out the slope f(x₀, y₀) there, and walk a short distance h to the right along that straight line: the new point is x₁ = x₀ + h, y₁ = y₀ + h × f(x₀, y₀). Then do the same from the new point with the new slope, and again. The distance h is called the step size. Each step pretends the slope stays fixed for a moment, so the estimate drifts a little from the true curve; a smaller step size gives a better estimate at the cost of more steps.",
   "steps": [
    "Write the equation as y′ = f(x, y) and start at the initial condition (x₀, y₀).",
    "Work out the slope f at the current point.",
    "Step: the new y is the old y plus h times the slope, and the new x is the old x plus h.",
    "Repeat from the new point until you reach the x you want, keeping every decimal until the end."
   ],
   "example": {
    "prompt": "Use Euler's method on y′ = y − x with y(0) = 2, step size h = 0.5, for 2 steps.",
    "steps": [
     "At (0, 2) the slope is 2 − 0 = 2, so y₁ = 2 + 0.5 × 2 = 3 at x = 0.5.",
     "At (0.5, 3) the slope is 3 − 0.5 = 2.5, so y₂ = 3 + 0.5 × 2.5 = 4.25 at x = 1."
    ],
    "answer": "The estimate of y(1) is 4.25."
   },
   "pitfalls": [
    "Using the slope at the starting point for every step. The slope must be worked out again at each new point.",
    "Forgetting to move x forward by h, so the x part of the slope is always worked out at 0.",
    "Adding the slope itself instead of h times the slope."
   ]
  },
  "guidance": [
   {
    "prompt": "Start at the point (0, 1). What is the slope f(0, 1) there?",
    "answer": [
     2
    ],
    "labels": [
     "slope at the start"
    ],
    "explanation": "At x = 0 the x term is 0, and the y term is 2 × 1 = 2."
   },
   {
    "prompt": "Take the first step: y₁ = 1 + 0.1 × 2. What is y₁?",
    "answer": [
     1.2
    ],
    "labels": [
     "y after one step"
    ],
    "explanation": "0.1 × 2 = 0.2, so y₁ = 1.2, the estimate at x = 0.1."
   },
   {
    "prompt": "Repeat the step until x = 0.3, working out the slope at each new point. What is the estimate after 3 steps, to 3 decimal places?",
    "answer": [
     1.76
    ],
    "labels": [
     "estimate of y"
    ],
    "explanation": "y₂ = 1.2 + 0.1 × 2.5 = 1.45, y₃ = 1.45 + 0.1 × 3.1 = 1.76. The estimate is 1.76 to 3 decimal places."
   }
  ]
 },
 {
  "id": "q06",
  "title": "Splitting the variables",
  "topic": "Separable equations",
  "tier": "Basic",
  "sector": "Greenhouse",
  "brief": "A greenhouse trial runs on an equation where the y part and the t part can be pulled apart, and Mira wants its exact value at the end of the run.",
  "lesson": "In a separable equation y′ = g(t)h(y), move all the y terms to one side and all the t terms to the other, then integrate both sides.",
  "prompt": "In a greenhouse trial a quantity y obeys the differential equation y′ = 0.3y, where t is the time in hours, and y(0) = 5. Solve it by separating the variables, and enter y at t = 4 to 3 decimal places.",
  "answer": [
   16.601
  ],
  "labels": [
   "y at the later time"
  ],
  "tolerance": 0.0005,
  "hints": [
   "Write y′ as dy ÷ dt and move everything with y to the left and everything with t to the right, then integrate both sides and add one constant.",
   "Use y(0) to find the constant before you put in the later time. Round only the final value."
  ],
  "solution": "Separate: dy ÷ y = 0.3 dt. Integrating both sides gives ln y = 0.3t + c, so y = Ae^(0.3t) with A = e^c. At t = 0 this is A, so A = 5. y(4) = 5e^(1.2) = 16.601 to 3 decimal places.",
  "xp": 100,
  "prereqs": [
   "q03"
  ],
  "artifact": {
   "name": "Two-sided integral card",
   "description": "A card with the y side on the left and the t side on the right."
  },
  "sources": [
   source.s1_3
  ],
  "teaching": {
   "intuition": "Integrating works when y′ depends on t alone. Many equations mix y and t, but in a special way: the right-hand side is a function of t times a function of y. Such an equation is a separable equation. Write y′ as dy/dt and treat dy and dt as pieces you can move: divide by the y part and multiply by dt, so that everything with y sits on the left and everything with t on the right. For y′ = 0.5y this gives dy ÷ y = 0.5 dt. Now integrate each side with respect to its own variable: ln y = 0.5t + c, with one constant for both sides. Solve for y, and use the initial condition to fix the constant. The same steps work for other separable forms. For y′ = kty, separating gives dy ÷ y = kt dt, so ln y = (k ÷ 2)t² + c and y = Ae^((k ÷ 2)t²). For y′ = t ÷ y, multiply both sides by y and by dt: y dy = t dt, so y² ÷ 2 = t² ÷ 2 + c, that is y² = t² + 2c; when y(0) is positive, take the positive square root. Moving dy and dt about looks like a trick, but it is the chain rule run backwards, and it gives the right answer.",
   "steps": [
    "Check that the right-hand side is (a function of t) × (a function of y).",
    "Separate: put every y factor with dy on the left and every t factor with dt on the right.",
    "Integrate both sides and write a single constant on one side.",
    "Solve for y, use the initial condition to find the constant, and put in the later time."
   ],
   "example": {
    "prompt": "Solve y′ = 2y with y(0) = 3 and find y(1) to 3 decimal places.",
    "steps": [
     "Separate: dy ÷ y = 2 dt, so ln y = 2t + c and y = Ae^(2t).",
     "At t = 0, y = A = 3, so y = 3e^(2t).",
     "y(1) = 3e² = 22.167 to 3 decimal places."
    ],
    "answer": "y(1) ≈ 22.167."
   },
   "pitfalls": [
    "Adding the constant after solving for y instead of when integrating: ln y = kt + c becomes y = Ae^(kt), not e^(kt) + c.",
    "Forgetting the extra factor when integrating t dt: it gives t² ÷ 2, not t².",
    "Rounding the exponent or e to a few decimals before multiplying, which shifts the last decimal of the answer."
   ]
  },
  "guidance": [
   {
    "prompt": "Separate: dy ÷ y = 0.3 dt. Integrating both sides gives ln y = 0.3t + c, so y = Ae^(0.3t) with A = e^c. At t = 0 this is A, so A = 5. What is the exponent 0.3 × 4 in y(4) = 5e^(0.3 × 4)?",
    "answer": [
     1.2
    ],
    "labels": [
     "exponent, or y² for y′ = t ÷ y"
    ],
    "explanation": "The exponent is 1.2, so y(4) = 5e^(1.2)."
   },
   {
    "prompt": "What is y(4) = 5e^(1.2) to 3 decimal places?",
    "answer": [
     16.601
    ],
    "labels": [
     "y at the later time"
    ],
    "explanation": "y(4) = 5e^(1.2) = 16.601 to 3 decimal places."
   }
  ]
 },
 {
  "id": "q07",
  "title": "Warming the coolant line",
  "topic": "Linear first-order equations and the integrating factor",
  "tier": "Basic",
  "sector": "Coolant Loop",
  "brief": "A heater is warming a coolant line, and the controller needs the line's temperature at a set time to decide when to open the valve.",
  "lesson": "For y′ + py = g(t), multiplying by the integrating factor e^(pt) turns the left side into (e^(pt)y)′, which can be integrated.",
  "prompt": "The temperature y of a coolant line, in degrees above the room, obeys 2y′ + 6y = 30, where t is the time in minutes, and y(0) = 2. Write the integrating factor as e^(rt) and enter r. Then solve the equation and enter y(1) to 3 decimal places.",
  "answer": [
   3,
   4.851
  ],
  "labels": [
   "r",
   "temperature at the later time (degrees)"
  ],
  "tolerance": 0.0005,
  "hints": [
   "First divide the whole equation by the number in front of y′, so that it reads y′ + py = g(t). The integrating factor is then e^(pt).",
   "Multiplying by the integrating factor turns the left side into the derivative of e^(pt)y. Integrate both sides, divide by e^(pt), and use y(0) to find the constant."
  ],
  "solution": "Dividing by 2 gives y′ + 3y = 15, so the integrating factor is e^(3t) and r = 3. Multiplying through, (e^(3t)y)′ = 15e^(3t), and integrating gives e^(3t)y = 15 ÷ 3 × e^(3t) + D, so y = 5 + De^(−3t). At t = 0, y = 5 + D = 2, so D = −3 and y = 5 − 3e^(−3t). Then y(1) = 5 − 3e^(−3) = 4.851 to 3 decimal places.",
  "xp": 100,
  "prereqs": [
   "q06"
  ],
  "artifact": {
   "name": "Heater curve",
   "description": "The coolant temperature rising towards its steady value."
  },
  "sources": [
   source.s1_4
  ],
  "teaching": {
   "intuition": "A first-order linear equation can be written y′ + py = g(t): the unknown and its derivative appear to the first power, and the push from outside, g(t), depends on t alone. It is usually not separable, but there is a clever factor that unlocks it. The product rule says (e^(pt)y)′ = e^(pt)y′ + pe^(pt)y = e^(pt)(y′ + py). So if we multiply the whole equation by e^(pt), the left side becomes the derivative of a single product, e^(pt)y, and we can integrate both sides: e^(pt)y = ∫e^(pt)g(t)dt + D. The factor e^(pt) is called the integrating factor. Divide by it to get y, then use the initial condition to find D. The part with D dies away like e^(−pt), and what is left is the response to the push.",
   "steps": [
    "Divide by the number in front of y′, so the equation reads y′ + py = g(t).",
    "The integrating factor is e^(pt). Multiply both sides by it; the left side is now (e^(pt)y)′.",
    "Integrate both sides, remembering the constant D, and divide by e^(pt).",
    "Use the initial condition to find D, then put in the later time."
   ],
   "example": {
    "prompt": "Solve y′ + 2y = 4 with y(0) = 0 and find y(1).",
    "steps": [
     "The integrating factor is e^(2t): (e^(2t)y)′ = 4e^(2t).",
     "Integrating: e^(2t)y = 2e^(2t) + D, so y = 2 + De^(−2t). At t = 0, 2 + D = 0, so D = −2.",
     "y(1) = 2 − 2e^(−2) = 1.729 to 3 decimal places."
    ],
    "answer": "The integrating factor is e^(2t) and y(1) ≈ 1.729."
   },
   "pitfalls": [
    "Reading p before dividing by the number in front of y′: in 2y′ + 6y = 30, p is 3, not 6.",
    "Forgetting to multiply the right-hand side by the integrating factor as well.",
    "Adding the constant after dividing by e^(pt), which gives y = K + D instead of y = K + De^(−pt)."
   ]
  },
  "guidance": [
   {
    "prompt": "Divide 2y′ + 6y = 30 by 2. The equation becomes y′ + py = g(t). What is p, the r of the integrating factor e^(rt)?",
    "answer": [
     3
    ],
    "labels": [
     "r"
    ],
    "explanation": "Dividing gives y′ + 3y = 15, so p = 3 and the integrating factor is e^(3t)."
   },
   {
    "prompt": "Multiply by e^(3t) and integrate: the solution has the form y = K + De^(−3t). What is K?",
    "answer": [
     5
    ],
    "labels": [
     "K"
    ],
    "explanation": "(e^(3t)y)′ = 15e^(3t), and integrating gives e^(3t)y = 15 ÷ 3 × e^(3t) + D, so y = 5 + De^(−3t). So K = 5."
   },
   {
    "prompt": "Use y(0) = 2 to find D, then work out y(1). What is it to 3 decimal places?",
    "answer": [
     4.851
    ],
    "labels": [
     "temperature at the later time (degrees)"
    ],
    "explanation": "5 + D = 2 gives D = −3, so y = 5 − 3e^(−3t) and y(1) = 4.851."
   }
  ]
 },
 {
  "id": "q08",
  "title": "Salt in the brine tank",
  "topic": "Mixing tanks",
  "tier": "Basic",
  "sector": "Coolant Loop",
  "brief": "The coolant brine has to reach the right saltiness before the pumps start, and Mira wants to know how salty the tank will be and where it is heading.",
  "lesson": "In a mixing problem the amount x changes at the rate in minus the rate out, which gives a linear equation x′ + (r ÷ V)x = rc.",
  "prompt": "A brine tank in the coolant loop holds 200 litres of water with 10 kg of salt dissolved in it. Brine with 0.25 kg of salt per litre flows in at 4 litres per minute, and the well-mixed liquid flows out at the same rate, so the volume stays 200 litres. Enter the salt in the tank after 30 minutes, in kg to 3 decimal places. Then enter the amount of salt, in kg, that the tank settles towards in the long run.",
  "answer": [
   28.048,
   50
  ],
  "labels": [
   "salt after the time (kg)",
   "long-run salt (kg)"
  ],
  "tolerance": 0.0005,
  "hints": [
   "The salt x changes at the rate in minus the rate out. Salt comes in at the flow rate times the incoming concentration; it leaves at the flow rate times x ÷ V, the concentration in the tank.",
   "The equation x′ + (r ÷ V)x = rc is linear: solve it with the integrating factor e^(rt ÷ V) and use the starting amount for the constant. In the long run the exponential term dies away."
  ],
  "solution": "Salt flows in at 4 × 0.25 = 1 kg per minute and out at 4 × x ÷ 200 = 0.02x kg per minute, so x′ = 1 − 0.02x, that is x′ + 0.02x = 1. With the integrating factor e^(0.02t) the solution is x = 1 ÷ 0.02 + Ce^(−0.02t) = 50 + Ce^(−0.02t). At t = 0, x = 10, so C = −40. After 30 minutes, x = 50 − 40e^(−0.6) = 28.048 kg to 3 decimal places. As t grows, e^(−0.02t) shrinks to 0, so the salt settles towards 50 kg.",
  "xp": 100,
  "prereqs": [
   "q07"
  ],
  "artifact": {
   "name": "Brine float",
   "description": "A float that rises with the saltiness of the tank."
  },
  "sources": [
   source.s1_4
  ],
  "teaching": {
   "intuition": "A mixing problem follows one substance, such as salt, in a tank that liquid flows into and out of. Let x(t) be the amount of salt and V the volume. Salt arrives with the incoming liquid: flow rate r times its concentration c. It leaves with the outgoing liquid: flow rate r times the concentration in the tank, which, if the tank is well mixed, is x ÷ V. So x′ = rate in − rate out = rc − (r ÷ V)x. That is a linear equation, x′ + (r ÷ V)x = rc, which the integrating factor e^(rt ÷ V) solves: x = Vc + Ce^(−rt ÷ V). The exponential part fades away, so in the long run the salt settles at Vc, the amount the tank would hold if it were full of the incoming brine.",
   "steps": [
    "Rate in: the inflow rate times the incoming concentration.",
    "Rate out: the outflow rate times x ÷ V, the concentration in the tank (the outflow equals the inflow here, so V stays fixed).",
    "Write x′ = rate in − rate out and solve it as a linear equation; the starting amount gives the constant.",
    "For the long run, let the exponential term go to 0."
   ],
   "example": {
    "prompt": "A 100 litre tank of pure water receives brine with 0.1 kg of salt per litre at 5 litres per minute, and the mixture leaves at 5 litres per minute. Find the salt after 20 minutes and in the long run.",
    "steps": [
     "Rate in 5 × 0.1 = 0.5 kg per minute; rate out 5x ÷ 100 = 0.05x. So x′ + 0.05x = 0.5.",
     "x = 10 + Ce^(−0.05t) and x(0) = 0 gives C = −10.",
     "x(20) = 10 − 10e^(−1) = 6.321; as t grows, x approaches 10."
    ],
    "answer": "About 6.321 kg after 20 minutes, and 10 kg in the long run."
   },
   "pitfalls": [
    "Using the incoming concentration for the outflow. The liquid leaving has the tank's concentration, x ÷ V.",
    "Mixing units: the concentration is kg per litre and the flow litres per minute, so their product is kg per minute.",
    "Giving the starting amount as the long-run amount. The start only fixes the constant, which fades away."
   ]
  },
  "guidance": [
   {
    "prompt": "Brine brings in 4 litres per minute at 0.25 kg per litre. How many kg of salt come in per minute?",
    "answer": [
     1
    ],
    "labels": [
     "salt in per minute (kg)"
    ],
    "explanation": "4 × 0.25 = 1 kg of salt per minute."
   },
   {
    "prompt": "Salt leaves at 4 litres per minute at a concentration of x ÷ 200 kg per litre, so x′ = 1 − kx. What is k?",
    "answer": [
     0.02
    ],
    "labels": [
     "k (per minute)"
    ],
    "explanation": "The outflow carries 4 × x ÷ 200 = 0.02x kg per minute, so k = 0.02."
   },
   {
    "prompt": "The solution of x′ = 1 − 0.02x with x(0) = 10 is x = 50 − 40e^(−0.02t). What is x after 30 minutes, to 3 decimal places?",
    "answer": [
     28.048
    ],
    "labels": [
     "salt after the time (kg)"
    ],
    "explanation": "0.02 × 30 = 0.6, so x = 50 − 40e^(−0.6) = 28.048 kg."
   }
  ]
 },
 {
  "id": "q09",
  "title": "Where the coolant settles",
  "topic": "Autonomous equations: equilibria and stability",
  "tier": "Basic",
  "sector": "Coolant Loop",
  "brief": "The coolant loop has several temperatures where it could sit still, and Mira needs to know which of them it will actually hold.",
  "lesson": "In an autonomous equation y′ = f(y) the equilibria are the zeros of f; one is stable when nearby solutions move towards it on both sides.",
  "prompt": "The temperature y of the coolant loop, in degrees above its set point, obeys the autonomous equation y′ = 2(y + 1)(y − 3)(5 − y). Enter its three equilibrium values in increasing order. Then, for the middle one, enter 1 if it is stable or 0 if it is unstable.",
  "answer": [
   -1,
   3,
   5,
   0
  ],
  "labels": [
   "smallest equilibrium",
   "middle equilibrium",
   "largest equilibrium",
   "stable (1) or unstable (0)"
  ],
  "tolerance": 0.01,
  "hints": [
   "The equilibria are the constant values of y that make the right-hand side 0: set each factor to 0.",
   "Work out the sign of y′ just below and just above the equilibrium. It is stable when y rises towards it from below and falls towards it from above; otherwise it is unstable."
  ],
  "solution": "The right-hand side is 0 when one factor is 0, so the equilibria are y = −1, 3 and 5. Just below the middle one, at y = 2.5, y′ is negative, so y falls; just above, at y = 3.5, y′ is positive, so y rises. Solutions starting near y = 3 move away from it on at least one side, so it is unstable: enter 0.",
  "xp": 100,
  "prereqs": [
   "q04"
  ],
  "artifact": {
   "name": "Set-point chart",
   "description": "A line of temperatures with arrows showing which way the coolant drifts."
  },
  "sources": [
   source.s1_6
  ],
  "teaching": {
   "intuition": "An autonomous equation is one where the rate depends only on y itself, not on the time: y′ = f(y). Its slope field looks the same at every t, so all the information fits on one line, the y axis. Where f(y) = 0, the constant function is a solution: an equilibrium. Between two equilibria f keeps one sign, so y keeps rising or keeps falling there. Draw arrows on the y axis: up where f is positive, down where it is negative. An equilibrium with arrows pointing towards it from both sides is a stable equilibrium: a small nudge away dies out and the solution comes back. If the arrows point away on either side it is an unstable equilibrium: the smallest nudge sends the solution off. The coolant loop can rest only at a stable one.",
   "steps": [
    "Set f(y) = 0 and solve: the roots are the equilibria. Sort them in increasing order.",
    "Pick a test value of y between neighbouring equilibria (and beyond the outer ones) and find the sign of f there.",
    "Positive means y rises, negative means y falls.",
    "An equilibrium is stable if y rises towards it from below and falls towards it from above; otherwise it is unstable."
   ],
   "example": {
    "prompt": "Find and classify the equilibria of y′ = (y − 1)(y − 4).",
    "steps": [
     "The equilibria are y = 1 and y = 4.",
     "At y = 0, f = (−1)(−4) = 4 > 0; at y = 2, f = (1)(−2) = −2 < 0; at y = 5, f = (4)(1) = 4 > 0.",
     "Around 1: rising from below, falling from above, so stable. Around 4: falling below it and rising above it, so unstable."
    ],
    "answer": "y = 1 is stable and y = 4 is unstable."
   },
   "pitfalls": [
    "Ignoring a factor written the other way round: (5 − y) is negative when y is above 5, the opposite of (y − 5).",
    "Forgetting the number in front: a negative coefficient flips every sign, and with it every arrow.",
    "Testing only one side of an equilibrium. Stability needs both sides to point towards it."
   ]
  },
  "guidance": [
   {
    "prompt": "Set each factor of 2(y + 1)(y − 3)(5 − y) to 0. What is the smallest equilibrium?",
    "answer": [
     -1
    ],
    "labels": [
     "smallest equilibrium"
    ],
    "explanation": "The factors are 0 at y = −1, 3 and 5; the smallest is −1."
   },
   {
    "prompt": "Put y = 2.5, just below the middle equilibrium 3, into the right-hand side. Enter 1 if y′ is positive there or −1 if it is negative.",
    "answer": [
     -1
    ],
    "labels": [
     "sign just below (1 or −1)"
    ],
    "explanation": "y′ is negative, so y falls just below 3."
   },
   {
    "prompt": "Now put y = 3.5, just above 3. Enter 1 if y′ is positive there or −1 if it is negative.",
    "answer": [
     1
    ],
    "labels": [
     "sign just above (1 or −1)"
    ],
    "explanation": "y′ is positive, so y rises just above 3."
   },
   {
    "prompt": "Just below 3 y′ is negative, and just above it y′ is positive. Enter 1 if y = 3 is stable or 0 if it is unstable.",
    "answer": [
     0
    ],
    "labels": [
     "stable (1) or unstable (0)"
    ],
    "explanation": "On at least one side y moves away from 3, so it is unstable."
   }
  ]
 },
 {
  "id": "q10",
  "title": "The colony in the filter",
  "topic": "Logistic growth",
  "tier": "Basic",
  "sector": "Coolant Loop",
  "brief": "A colony of bacteria keeps the coolant filters clean, and Mira needs to know how big it can get and when it will be strong enough to do the job.",
  "lesson": "The logistic equation P′ = kP(1 − P ÷ K) grows almost exponentially at first and levels off at the carrying capacity K.",
  "prompt": "A colony of filter-cleaning bacteria in the coolant loop, P thousand cells, grows by the logistic equation P′ = 0.4P − 0.0005P², where t is in days, and P(0) = 100. Enter the carrying capacity in thousands of cells. Then enter the time, in days to 2 decimal places, when the colony first reaches 600 thousand cells.",
  "answer": [
   800,
   7.61
  ],
  "labels": [
   "carrying capacity (thousand cells)",
   "time (days)"
  ],
  "tolerance": 0.005,
  "hints": [
   "Factor the right-hand side as kP(1 − P ÷ K): the carrying capacity K is the nonzero equilibrium, where kP = (k ÷ K)P².",
   "The solution is P = K ÷ (1 + Ae^(−kt)) with A = (K − P(0)) ÷ P(0). Set P equal to the level and solve for t with a natural logarithm."
  ],
  "solution": "P′ = 0.4P − 0.0005P² = 0.4P(1 − P ÷ 800), because 0.4 ÷ 0.0005 = 800. So k = 0.4 and the carrying capacity is 800 thousand cells. The solution is P = 800 ÷ (1 + Ae^(−0.4t)) with A = (800 − 100) ÷ 100 = 7. Setting P = 600 gives 1 + 7e^(−0.4t) = 800 ÷ 600, so e^(0.4t) = 7 × 600 ÷ 200 = 21 and t = ln 21 ÷ 0.4 = 7.61 days to 2 decimal places.",
  "xp": 100,
  "prereqs": [
   "q09",
   "q06"
  ],
  "artifact": {
   "name": "Colony growth curve",
   "description": "An S-shaped curve that climbs and then flattens below a ceiling."
  },
  "sources": [
   source.s1_6
  ],
  "teaching": {
   "intuition": "Exponential growth, P′ = kP, cannot last: food and space run out. The logistic equation adds a brake: P′ = kP(1 − P ÷ K). When P is small the bracket is close to 1 and the growth is almost exponential; as P approaches K the bracket shrinks to 0 and the growth stops. It is autonomous, with equilibria P = 0 (unstable) and P = K (stable), and K is called the carrying capacity: the largest population the surroundings can support. Multiplied out, the equation reads P′ = kP − (k ÷ K)P², so K is k divided by the coefficient of P². The equation is separable, and with partial fractions it solves to P = K ÷ (1 + Ae^(−kt)), where A = (K − P(0)) ÷ P(0). Setting P equal to a level and taking a natural logarithm gives the time to reach it.",
   "steps": [
    "Write the equation as kP − bP². Then k is the growth rate and the carrying capacity is K = k ÷ b.",
    "Find A = (K − P(0)) ÷ P(0) from the starting population.",
    "Set K ÷ (1 + Ae^(−kt)) equal to the level L and rearrange: e^(kt) = A × L ÷ (K − L).",
    "Take the natural logarithm and divide by k."
   ],
   "example": {
    "prompt": "P′ = 0.5P − 0.001P² with P(0) = 100. Find the carrying capacity and the time to reach 250.",
    "steps": [
     "K = 0.5 ÷ 0.001 = 500 and A = (500 − 100) ÷ 100 = 4.",
     "e^(0.5t) = 4 × 250 ÷ 250 = 4, so t = ln 4 ÷ 0.5 = 2.77 to 2 decimal places."
    ],
    "answer": "The carrying capacity is 500, reached halfway at t ≈ 2.77."
   },
   "pitfalls": [
    "Taking the coefficient of P² as the carrying capacity. K is the growth rate divided by that coefficient.",
    "Using A = P(0) ÷ K, or K ÷ P(0), instead of (K − P(0)) ÷ P(0).",
    "Dividing by K − P(0) instead of K − L when solving for the time."
   ]
  },
  "guidance": [
   {
    "prompt": "Write 0.4P − 0.0005P² as 0.4P(1 − P ÷ K). What is K?",
    "answer": [
     800
    ],
    "labels": [
     "carrying capacity (thousand cells)"
    ],
    "explanation": "0.4P × P ÷ K must equal 0.0005P², so K = 0.4 ÷ 0.0005 = 800."
   },
   {
    "prompt": "The solution is P = 800 ÷ (1 + Ae^(−0.4t)), and at t = 0 it is 800 ÷ (1 + A) = 100. What is A?",
    "answer": [
     7
    ],
    "labels": [
     "A"
    ],
    "explanation": "1 + A = 800 ÷ 100 = 8, so A = 7."
   },
   {
    "prompt": "Set 800 ÷ (1 + 7e^(−0.4t)) = 600 and solve for t. What is t, in days to 2 decimal places?",
    "answer": [
     7.61
    ],
    "labels": [
     "time (days)"
    ],
    "explanation": "7e^(−0.4t) = 800 ÷ 600 − 1, so e^(0.4t) = 21 and t = ln 21 ÷ 0.4 = 7.61."
   }
  ]
 }
);
})();
