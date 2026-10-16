# RES5 Hard Mock Paper — Authoring Blueprint

You are authoring ONE full CMFAS RES5 mock exam paper: **150 exam-style MCQs**, harder
than a typical practice paper, each with FOUR options (A-D), a single correct answer, and
a grounded explanation. RES5 = "Rules and Regulations for Financial Advisory Services".

## GROUND EVERY QUESTION IN THE REAL SOURCE. Do not invent facts.
Primary source = the official study text, already extracted to plain text with page markers:
`E:/Kairos Home/Projects/Personal/CMFAS-Study/tmp/res5_ebook.txt`
(each page delimited by a line `===== PDF PAGE N =====`). READ the relevant page ranges
below with the Read/Grep tools before writing that chapter's questions. Every figure,
threshold, timeframe, notice number, penalty and requirement MUST come from the text.

Supporting (already fact-checked against the ebook) — use to sharpen distractors:
- `src/data/res5/factbank.ts` (282 concepts: term + fact + trap)
- `src/data/res5/quiz.json` (595 authored Q&A with explanations) — do NOT copy these
  verbatim; author NEW, harder items, but you may mine them for correct figures.
- Hub reference notes (verbatim source figures, worked examples):
  `E:/Kairos Home/References & Kairos/References/CMFAS/RES5 - *.md`

## Chapter -> PDF page ranges in tmp/res5_ebook.txt
ch1 FAA/FAR: Financial Advisers & Representatives .......... pdf 12-46
ch2 FAA/FAR: Conduct of Business, Powers, Offences ........ pdf 47-68
ch3 MAS Notices Part I (FAA-N16 BSC, FAA-N03, FAA-N11) .... pdf 69-126
ch4 MAS Notices Part II (N02,N10,N12,N14,N20,N26) ......... pdf 127-250
ch5 FAA-N06 AML / CFT ..................................... pdf 251-277
ch6 MAS Notices Part III (N17, FSM-N23, N19, FSM-N24) ..... pdf 278-300
ch7 Notice MAS 307 Investment-Linked Policies ............. pdf 301-357
ch8 MAS Guidelines Part I (G01,FSG-G01,G04,G05,CMI01/2011). pdf 358-403
ch9 MAS Guidelines Part II (G09,G10,FSG-G04,FAA-G14) ...... pdf 404-483
ch10 MAS Guidelines Part III (G13,G15,G16,CMG-G02,FSG-G02). pdf 484-539
ch11 The Code on Collective Investment Schemes ............ pdf 540-623
ch12 Securities Dealing - Market Conduct .................. pdf 624-653
ch13 Central Provident Fund ............................... pdf 654-692
ch14 Why Professional Ethics Matter ....................... pdf 693-703
ch15 Professionalism ...................................... pdf 704-712
ch16 Ethical Behavior ..................................... pdf 713-726
ch17 Unethical Behavior ................................... pdf 727-731
ch18 Conflict of Interest ................................. pdf 732-744
ch19 Fair Dealing ......................................... pdf 745-751
ch20 Ethical Marketing & Sale of Financial Products ....... pdf 752-766
ch21 Developing Client-Representative Relationships ....... pdf 767-787
ch22 Fact Finding and Needs Analysis ...................... pdf 788-826
ch23 Analysing & Evaluating a Client's Financial Status .... pdf 827-836
ch24 Developing Appropriate Strategies and Solutions ...... pdf 837-845
ch25 Presentation of Analysis and Solutions .............. pdf 846-852
ch26 Reviewing Clients' Portfolios ........................ pdf 853-859
ch27 Basic Financial Planning Guide ....................... pdf 860-912

## Question count per chapter (TOTAL = 150)
ch1:11 ch2:8 ch3:8 ch4:12 ch5:12 ch6:6 ch7:7 ch8:5 ch9:7 ch10:5 ch11:6 ch12:4 ch13:4
(Part I subtotal 95)
ch14:3 ch15:3 ch16:4 ch17:4 ch18:4 ch19:4 ch20:4 ch21:4 ch22:5 ch23:5 ch24:4 ch25:3 ch26:2 ch27:6
(Part II subtotal 55)

## DIFFICULTY — this is the whole point. Make it hard, exam-realistic.
The existing practice papers were too easy. Every question must make a well-prepared
candidate think. Use this MIX per chapter (roughly):
- ~45% APPLICATION / SCENARIO: "Rep X does Y in situation Z — what is the correct/required
  action?" Test judgement against a specific rule, not vocabulary recall.
- ~25% PRECISE-FIGURE recall: exact thresholds, timeframes, penalties, limits, grades —
  e.g. cooling-off / free-look periods, record-retention years, AML transaction thresholds,
  BSC grades and non-sales KPI weightings, penalty amounts/jail terms, CPF limits, CIS
  investment restrictions. Distractors must be plausible near-misses (adjacent numbers).
- ~20% DISCRIMINATION: "Which of the following is/is NOT ...", "All EXCEPT ...", "Which
  best describes ..." with three genuinely tempting options.
- ~10% TWO-STEP: combine two rules, or a short ratio/needs calculation (ch22/23/27) with
  hand-verifiable arithmetic (show the numbers in the explanation).
Aim for 8-12 EXCEPT/NOT questions and 6-10 calculation questions across the paper (mostly
ch22/23/27 financial ratios, needs analysis, CPF).

## OUTPUT — write exactly this file:
`E:/Kairos Home/Projects/Personal/CMFAS-Study/tmp/res5_p{PAPER}.json`
A JSON ARRAY of 150 objects, in chapter order, each:
{
  "id": "RES5-P{PAPER}-Q{n}",     // n = 1..150
  "num": {n},
  "stem": "…",
  "options": { "A": "…", "B": "…", "C": "…", "D": "…" },
  "answer": "A" | "B" | "C" | "D",
  "explanation": "…"
}

## HARD RULES (violations get the paper rejected)
1. Explanations must reference the CONTENT/VALUE of options, NEVER a letter. The app
   SHUFFLES option positions, so "Option A is correct" becomes false. Say WHY the right
   fact is right and name the tempting wrong fact and why it's wrong. Cite the rule/notice
   (e.g. "FAA-N06 requires…", "under MAS Notice 307…") where natural.
2. All four options must be DISTINCT and non-overlapping. Exactly one unambiguously correct.
3. Spread the correct answer across A/B/C/D roughly evenly (~37-38 each). Do not park the
   answer on C.
4. ASCII ONLY. No smart quotes, en/em dashes, or unicode. Use plain hyphen -, straight
   quotes, and write "S$" for Singapore dollars, "percent" or "%" consistently.
5. No "(CALCULATION)" or meta tags in stems. No "According to the study text" filler.
6. Every calculation must be arithmetically correct — show the working in the explanation.
7. Do NOT duplicate stems within your paper; keep scenarios varied (different names, firms,
   products, amounts). Names: use a diverse realistic Singapore mix.
8. Stems self-contained and answerable from the stem alone. Options 3-18 words each.

Write ONLY the JSON file. When done, reply with: paper number, count, answer distribution
(A/B/C/D tallies), and how many EXCEPT and calc questions you included.
