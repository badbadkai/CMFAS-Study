import type { CompTopic, FormulaGroup } from '../../types'

/**
 * M9 Computations — Chapter 9 (ILP computational aspects) plus the small
 * calculation content from Chapters 2 and 6. Figures cross-checked against
 * the SCI M9 study guide (v1.7), including worked Examples 9.1–9.5.
 */

export const compTopics: CompTopic[] = [
  {
    id: 'tvm',
    num: 1,
    title: 'Time Value of Money',
    tagline: 'The root formula behind every calculation in this chapter',
    teach: [
      'Every calculation here grows from one equation: FV = PV × (1 + i)ⁿ. Money grows because it earns a return, so a dollar today is worth more than a dollar later. Compounding moves money forward in time (PV → FV); discounting moves it back (FV → PV, divide instead of multiply).',
      'Simple interest applies the rate to the original principal only: S$100 at 6% earns a flat S$6 every year, S$130 after 5 years. Compound interest applies it to principal plus accumulated interest: the same S$100 becomes S$133.83. The extra S$3.83 is interest on interest. M9 uses compound interest throughout.',
      'Two directional rules get tested conceptually. In compounding, FV rises as i or n rises. In discounting, PV falls as i or n rises. Logic: if you can earn a higher rate, or have longer to earn it, you need less money today.',
    ],
    formulas: [
      'FV = PV × (1 + i)ⁿ',
      'PV = FV ÷ (1 + i)ⁿ',
      '"Beginning of Year X" → n = X − 1',
    ],
    examples: [
      {
        title: 'Future value',
        given: 'S$5,000 is deposited at 9% compound interest for 7 years. What is it worth at the end?',
        steps: [
          'FV = PV × (1 + i)ⁿ = 5,000 × (1.09)⁷',
          '(1.09)⁷ = 1.828039',
          'FV = 5,000 × 1.828039',
        ],
        answer: 'S$9,140.20',
      },
      {
        title: 'Future value, higher rate',
        given: 'Same S$5,000 for 7 years, but at 10%. (Watch FV rise with i.)',
        steps: [
          'FV = 5,000 × (1.10)⁷',
          '(1.10)⁷ = 1.948717',
          'FV = 5,000 × 1.948717 = 9,743.59 — higher i, higher FV, as the rule predicts',
        ],
        answer: 'S$9,743.59',
      },
      {
        title: 'Present value',
        given: 'You need S$100,000 in 4 years and can earn 4% compound. How much must you set aside today?',
        steps: [
          'PV = FV ÷ (1 + i)ⁿ = 100,000 ÷ (1.04)⁴',
          '(1.04)⁴ = 1.1699',
          'PV = 100,000 ÷ 1.1699',
        ],
        answer: 'S$85,477.39',
      },
      {
        title: 'Present value, shorter time',
        given: 'Same S$100,000 at 4%, but needed in 3 years instead of 4.',
        steps: [
          'PV = 100,000 ÷ (1.04)³',
          '(1.04)³ = 1.1249',
          'PV = 100,000 ÷ 1.1249 = 88,896.79 — less time to earn, so you must start with more',
        ],
        answer: 'S$88,896.79',
      },
    ],
    trap: 'The counting trap: "the beginning of Year 4" is the same moment as "the end of Year 3", so n = 3, not 4. Always translate "beginning of Year X" → n = X − 1.',
  },
  {
    id: 'effective-rate',
    num: 2,
    title: 'Effective Interest Rate',
    tagline: 'Why 8% compounded semi-annually is really 8.16%',
    teach: [
      'A nominal rate ignores how often interest compounds; the effective rate includes it, and is always higher than nominal (when compounding is more than annual). The more frequently interest compounds, the higher the effective rate and the higher the future value.',
      'Mechanics: split the year into m periods, apply r/m each period, compound m times. Effective rate = (1 + r/m)ᵐ − 1.',
    ],
    formulas: ['Effective rate = (1 + r/m)ᵐ − 1', 'r = nominal rate, m = compounding periods per year'],
    examples: [
      {
        title: 'Semi-annual, from first principles',
        given: 'S$500 earns 10% nominal, compounded twice a year. Find the effective rate.',
        steps: [
          'Each half-year applies 10% ÷ 2 = 5%',
          '500 × 1.05 × 1.05 = 551.25',
          'Interest earned = 51.25 → effective = 51.25 ÷ 500',
        ],
        answer: '10.25% effective (vs 10% nominal)',
      },
      {
        title: 'Semi-annual, by formula',
        given: '8% nominal compounded semi-annually. Effective rate?',
        steps: ['Effective = (1 + 0.08/2)² − 1', '= (1.04)² − 1 = 1.0816 − 1'],
        answer: '8.16%',
      },
      {
        title: 'Quarterly',
        given: '6% nominal compounded quarterly. Effective rate?',
        steps: [
          'Effective = (1 + 0.06/4)⁴ − 1',
          '= (1.015)⁴ − 1 = 1.06136 − 1',
          '= 6.14% — more frequent compounding pulls further above nominal',
        ],
        answer: '6.14%',
      },
      {
        title: 'Frequency comparison (study-guide illustration)',
        given: 'S$1,000 at 8% nominal for 2 years, compounded annually vs semi-annually vs monthly.',
        steps: [
          'Annual: 1,000 × (1.08)² = S$1,166.40',
          'Semi-annual: 1,000 × (1.04)⁴ = S$1,169.86',
          'Monthly: 1,000 × (1 + 0.08/12)²⁴ = S$1,172.89',
        ],
        answer: 'Same nominal rate, three different outcomes. Frequency matters.',
      },
    ],
    trap: 'Divide the nominal rate by m AND compound m times per year. Using (1 + r)ᵐ or forgetting to subtract 1 are the classic slips.',
  },
  {
    id: 'fvif',
    num: 3,
    title: 'The FVIF Table',
    tagline: 'Backing out an unknown interest rate',
    teach: [
      'A Future Value Interest Factor is just (1 + i)ⁿ pre-computed: the future value of S$1 after n periods at rate i. Multiply a present value by the factor to get the future value.',
      'The exam skill is running it backwards. Compute your own factor as FV ÷ PV, go to the correct n-row of the table, scan for the closest factor, and read the rate off the top of that column.',
    ],
    formulas: ['FVIF(i, n) = (1 + i)ⁿ', 'FV = PV × FVIF', 'Unknown rate: (1 + i)ⁿ = FV ÷ PV → match closest factor in the n row'],
    examples: [
      {
        title: 'Finding an unknown rate',
        given: 'S$100,000 grows to S$103,000 in 3 years. What annual compound rate was earned?',
        steps: [
          '(1 + i)³ = 103,000 ÷ 100,000 = 1.03',
          'Scan the n = 3 row of the FVIF table',
          'Closest factor is 1.0303, in the 1% column',
        ],
        answer: 'i ≈ 1% p.a.',
      },
      {
        title: 'Forward use of a factor',
        given: 'PV = S$20,000, i = 3%, n = 4. FVIF(3%, 4) = 1.1255.',
        steps: ['FV = PV × FVIF = 20,000 × 1.1255'],
        answer: 'S$22,510',
      },
    ],
    trap: 'Use the row for the right number of periods before scanning columns. Wrong row, wrong rate.',
  },
  {
    id: 'offer-price',
    num: 4,
    title: 'Offer Price Growth & Units Purchased',
    tagline: 'Grow the price first, then divide',
    teach: [
      'The offer price grows over time like any sum of money: Future OP = OP × (1 + i)ⁿ. Once you have the offer price on the purchase date, units bought = premium ÷ offer price.',
      'This is where the counting trap does its damage. "Beginning of Year 4" means the price has grown for 3 full years.',
    ],
    formulas: ['Future Offer Price = OP × (1 + i)ⁿ', 'Units purchased = Premium ÷ Offer Price'],
    examples: [
      {
        title: 'Beginning of Year 4 (n = 3)',
        given: 'Offer price S$1.50 at inception, growing 6% p.a. A S$2,000 premium buys units at the beginning of Year 4.',
        steps: [
          'Beginning of Year 4 → n = 3',
          'OP = 1.50 × (1.06)³ = 1.50 × 1.1910 = S$1.79',
          'Units = 2,000 ÷ 1.79',
        ],
        answer: '1,117.32 units',
      },
      {
        title: 'Beginning of Year 3 (n = 2)',
        given: 'OP S$2.00, growth 5%, premium S$3,000, at the beginning of Year 3.',
        steps: [
          'n = 2 → OP = 2.00 × (1.05)² = 2.00 × 1.1025 = S$2.2050',
          'Units = 3,000 ÷ 2.2050',
        ],
        answer: '1,360.54 units',
      },
      {
        title: 'End of Year 5 (n = 5)',
        given: 'OP S$1.20, growth 4%, premium S$5,000, at the end of Year 5.',
        steps: [
          'End of Year 5 → n = 5 (no subtraction for "end of")',
          'OP = 1.20 × (1.04)⁵ = 1.20 × 1.2167 = S$1.4600',
          'Units = 5,000 ÷ 1.4600',
        ],
        answer: '3,424.66 units',
      },
    ],
    trap: '"Beginning of Year X" → n = X − 1. "End of Year X" → n = X. Read the timing words before touching the calculator.',
  },
  {
    id: 'death-benefit',
    num: 5,
    title: 'Death Benefit — DB3 & DB4',
    tagline: 'Add them, or take the higher',
    teach: [
      'Let u = value of units (always valued at the bid price) and v = sum assured. The four methods: DB1 = u, DB2 = v, DB3 = u + v, DB4 = higher of (u, v). The exam works DB3 and DB4.',
      'DB3 always pays more for the same sum assured, because the units are paid on top of the sum assured. That also means higher mortality charges (next topic). Under DB4 the two amounts do not stack; you get whichever is larger.',
    ],
    formulas: [
      'u = units × bid price ; v = sum assured',
      'DB3 = u + v',
      'DB4 = higher of (u, v)',
    ],
    examples: [
      {
        title: 'Standard DB3 vs DB4',
        given: '5,000 units, bid price S$3.04, sum assured = 150% of a S$10,000 single premium.',
        steps: [
          'u = 5,000 × 3.04 = S$15,200',
          'v = 150% × 10,000 = S$15,000',
          'DB3 = 15,200 + 15,000 = S$30,200',
          'DB4 = higher of (15,200, 15,000) = S$15,200',
        ],
        answer: 'DB3 = S$30,200 ; DB4 = S$15,200',
      },
      {
        title: 'Sum assured wins under DB4',
        given: '4,000 units, bid price S$2.50, sum assured S$12,000.',
        steps: [
          'u = 4,000 × 2.50 = S$10,000 ; v = S$12,000',
          'DB3 = 10,000 + 12,000 = S$22,000',
          'DB4 = higher of (10,000, 12,000) = S$12,000',
        ],
        answer: 'DB3 = S$22,000 ; DB4 = S$12,000',
      },
      {
        title: 'Units win under DB4',
        given: '6,000 units, bid price S$3.00, sum assured S$15,000.',
        steps: [
          'u = 6,000 × 3.00 = S$18,000 ; v = S$15,000',
          'DB3 = 18,000 + 15,000 = S$33,000',
          'DB4 = higher of (18,000, 15,000) = S$18,000',
        ],
        answer: 'DB3 = S$33,000 ; DB4 = S$18,000',
      },
    ],
    trap: 'Units are valued at the BID price for death benefits, never the offer price.',
  },
  {
    id: 'mortality-charge',
    num: 6,
    title: 'Mortality Charges — DB3 & DB4',
    tagline: 'Charge the amount the insurer is actually at risk for',
    teach: [
      'The cost of life cover is quoted as S$q per S$1,000 of sum assured, per year. The charge is levied on the "amount at risk", and that base differs by death-benefit method. This is the conceptual heart of the section.',
      'Under DB3 the sum assured is paid on top of the units, so the insurer is at risk for the whole sum assured v. Under DB4 the units offset the benefit, so the insurer is only at risk for the shortfall (v − u). If the units already exceed the sum assured, nothing is at risk and the charge is zero.',
      'The same amount-at-risk logic applies to CI, TPD, and accidental-benefit charges.',
    ],
    formulas: [
      'Annual charge = (q ÷ 1,000) × amount at risk ; Monthly = Annual ÷ 12',
      'DB3: monthly = [(q ÷ 1,000) × v] ÷ 12',
      'DB4: monthly = [(q ÷ 1,000) × (v − u)] ÷ 12, but 0 if u ≥ v',
    ],
    examples: [
      {
        title: 'DB3',
        given: 'q = S$3.00 per S$1,000, sum assured S$200,000. Monthly mortality charge under DB3?',
        steps: [
          'Amount at risk = full sum assured = S$200,000',
          'Annual = (3.00 ÷ 1,000) × 200,000 = S$600',
          'Monthly = 600 ÷ 12',
        ],
        answer: 'S$50.00 per month',
      },
      {
        title: 'DB4, v > u',
        given: 'Same q = S$3.00 and sum assured S$200,000, but the units are worth S$80,000. Monthly under DB4?',
        steps: [
          'Amount at risk = v − u = 200,000 − 80,000 = S$120,000',
          'Annual = (3.00 ÷ 1,000) × 120,000 = S$360',
          'Monthly = 360 ÷ 12',
        ],
        answer: 'S$30.00 per month',
      },
      {
        title: 'DB4, u ≥ v → zero',
        given: 'Same q and sum assured, but the units are worth S$220,000.',
        steps: [
          'u (220,000) ≥ v (200,000)',
          'Amount at risk is nil',
        ],
        answer: 'S$0 monthly charge',
      },
      {
        title: 'DB3 with a different rate',
        given: 'q = S$1.80 per S$1,000, sum assured S$150,000. Monthly under DB3?',
        steps: [
          'Annual = (1.80 ÷ 1,000) × 150,000 = 1.80 × 150 = S$270',
          'Monthly = 270 ÷ 12',
        ],
        answer: 'S$22.50 per month',
      },
    ],
    trap: 'The base: DB3 charges on the full sum assured v; DB4 charges on (v − u), or zero once units reach the sum assured. Mixing the bases is one of the three most expensive mistakes in M9.',
  },
  {
    id: 'allocation-rate',
    num: 7,
    title: 'Allocation Rate',
    tagline: 'How much of the premium actually buys units',
    teach: [
      'Premium allocated to units = allocation % × premium. Single premiums and top-ups are usually 100% allocated.',
      'Regular premiums are front-end loaded: the allocation starts low and rises, e.g. 15% (Year 1), 30% (Year 2), 50% (Year 3), 100% (Years 4–9), 102% (Year 10 onwards). The unallocated portion defrays early expenses. Some insurers allocate more than 100% in later years as a persistency bonus.',
    ],
    formulas: ['Premium allocated = Allocation % × Premium', 'Typical schedule: 15 / 30 / 50 / 100 (Yrs 4–9) / 102 (Yr 10+)'],
    examples: [
      {
        title: 'Early year',
        given: 'Annual premium S$1,200, Year 1 allocation 15%. How much buys units?',
        steps: ['Allocated = 15% × 1,200'],
        answer: 'S$180 (the rest defrays early expenses)',
      },
      {
        title: 'Loyalty year',
        given: 'Annual premium S$1,200, Year 10 allocation 102%.',
        steps: ['Allocated = 102% × 1,200 = 1,224', 'S$24 of that is bonus units'],
        answer: 'S$1,224',
      },
    ],
    trap: 'Allocation applies to the premium BEFORE any units are bought. Do not apply it to the unit count.',
  },
  {
    id: 'units-allocated',
    num: 8,
    title: 'Units Allocated — the Full Routine',
    tagline: 'The five-step method the exam loves',
    teach: [
      'Charges are deducted after allocation, so they are converted to units at the bid price. The bid-offer spread bites, and slightly more units are cancelled than the raw charge suggests.',
      'The five steps: (1) units purchased = (allocation % × premium) ÷ offer price; (2) bid price = (1 − spread) × offer price; (3) total charges = policy fee + admin + mortality; (4) units cancelled = charges ÷ bid price; (5) units remaining = purchased − cancelled, plus any prior balance.',
    ],
    formulas: [
      '1. Purchased = (allocation % × premium) ÷ offer price',
      '2. Bid = (1 − spread) × offer price',
      '3. Charges = policy fee + admin + mortality',
      '4. Cancelled = charges ÷ bid price',
      '5. Remaining = purchased − cancelled (+ prior units)',
    ],
    examples: [
      {
        title: 'Single premium (study-guide Example 9.4)',
        given: 'Single premium S$10,000; offer price S$1.50; policy fee S$150; admin + mortality = 2.5% of premium; spread 5%.',
        steps: [
          'Units purchased = 10,000 ÷ 1.50 = 6,666.67',
          'Bid = 0.95 × 1.50 = S$1.43',
          'Charges = 150 + (2.5% × 10,000) = 150 + 250 = S$400',
          'Cancelled = 400 ÷ 1.43 = 279.72',
          'Remaining = 6,666.67 − 279.72',
        ],
        answer: '6,386.95 units',
      },
      {
        title: 'Regular premium with allocation rate',
        given: 'Annual premium S$3,600; Year 2 allocation 30%; offer price at Year 2 = S$1.60; policy fee S$100; admin + mortality S$140; spread 5%.',
        steps: [
          'Allocated = 30% × 3,600 = S$1,080',
          'Purchased = 1,080 ÷ 1.60 = 675',
          'Bid = 0.95 × 1.60 = S$1.52',
          'Charges = 100 + 140 = S$240 → cancelled = 240 ÷ 1.52 = 157.89',
          'Remaining = 675 − 157.89',
        ],
        answer: '517.11 units',
      },
      {
        title: 'The full exam routine (study-guide Example 9.5)',
        given: 'Regular premium S$2,000/yr; Year 1 offer price S$1.49 growing 4% p.a.; Year 3 allocation 75%; spread 5%; 380 units already held at end of Year 2; mortality S$1.50 per S$1,000; sum assured S$100,000; monthly policy fee S$5. Units at the beginning of Year 3, under DB3?',
        steps: [
          'Beginning of Year 3 → n = 2. OP = 1.49 × (1.04)² = 1.49 × 1.0816 = S$1.61',
          'Bid = 1.61 × 0.95 = S$1.53',
          'Purchased = (75% × 2,000) ÷ 1.61 = 1,500 ÷ 1.61 = 931.68',
          'Value of prior units u = 380 × 1.53 = S$581.40 (needed for DB4, not DB3)',
          'DB3 monthly mortality = (1.50 ÷ 1,000) × 100,000 ÷ 12 = S$12.50',
          'Total monthly charges = 12.50 + 5.00 = S$17.50 → cancelled = 17.50 ÷ 1.53 = 11.44',
          'Remaining = 380 + 931.68 − 11.44',
        ],
        answer: '1,300.24 units (under DB4 the charge base is v − u = 99,418.60 → S$12.43 + 5.00 → 11.39 cancelled → 1,300.29 units)',
      },
    ],
    trap: 'Buy at OFFER, cancel charges at BID. Swapping the prices is the second of the three most expensive mistakes.',
  },
  {
    id: 'top-ups',
    num: 9,
    title: 'Top-ups',
    tagline: 'Same routine, but grow the offer price first',
    teach: [
      'A top-up is the unit-allocation routine with one extra opening move: grow the offer price to the top-up date first. Top-ups are usually 100% allocated, with their own top-up fee and admin charge.',
    ],
    formulas: [
      'OP at top-up = OP × (1 + i)ⁿ',
      'Then the standard 5-step routine on the top-up amount',
    ],
    examples: [
      {
        title: 'End of Year 3 top-up',
        given: 'Top-up S$5,000 at end of Year 3; growth 7%; initial offer price S$1.50; top-up fee S$80; admin (incl. mortality) 1.5% of top-up; spread 5%.',
        steps: [
          'OP = 1.50 × (1.07)³ = 1.50 × 1.2250 = S$1.84',
          'Bid = 1.84 × 0.95 = S$1.75',
          'Bought = 5,000 ÷ 1.84 = 2,717.39',
          'Charges = 80 + (1.5% × 5,000) = 80 + 75 = S$155 → cancelled = 155 ÷ 1.75 = 88.57',
          'Added = 2,717.39 − 88.57',
        ],
        answer: '2,628.82 units added (a prior 6,386.95 balance would become 9,015.77)',
      },
      {
        title: 'End of Year 2 top-up',
        given: 'Top-up S$6,000 at end of Year 2; growth 6%; initial offer price S$2.00; top-up fee S$100; admin (incl. mortality) 1.5%; spread 5%.',
        steps: [
          'OP = 2.00 × (1.06)² = 2.00 × 1.1236 = S$2.2472',
          'Bid = 2.2472 × 0.95 = S$2.1348',
          'Bought = 6,000 ÷ 2.2472 = 2,670.08',
          'Charges = 100 + (1.5% × 6,000) = S$190 → cancelled = 190 ÷ 2.1348 = 89.00',
          'Added = 2,670.08 − 89.00',
        ],
        answer: '2,581.08 units added',
      },
    ],
    trap: 'Grow the offer price to the top-up date BEFORE dividing. Using the inception price undercounts the price and overcounts the units.',
  },
  {
    id: 'withdrawal',
    num: 10,
    title: 'Withdrawal',
    tagline: 'Cash out at bid',
    teach: [
      'Units cancelled = withdrawal amount ÷ bid price. Withdrawals are subject to a minimum remaining account balance. You cash out at the bid price, the recurring theme: buy at offer, cash out at bid.',
    ],
    formulas: ['Units cancelled = Withdrawal ÷ Bid price'],
    examples: [
      {
        title: 'Simple withdrawal',
        given: 'Withdraw S$3,000 when the bid price is S$2.00.',
        steps: ['Cancelled = 3,000 ÷ 2.00 = 1,500 units', 'A 9,015.77-unit account would drop to 7,515.77'],
        answer: '1,500 units cancelled',
      },
      {
        title: 'Another bid price',
        given: 'Withdraw S$4,500 at bid S$1.80.',
        steps: ['Cancelled = 4,500 ÷ 1.80'],
        answer: '2,500 units cancelled',
      },
    ],
    trap: 'Divide by BID, not offer. Dividing by the offer price cancels too few units.',
  },
  {
    id: 'surrender',
    num: 11,
    title: 'Surrender Value',
    tagline: 'Units times bid, minus any surrender charge',
    teach: [
      'Surrender value = units in the account × bid price, less surrender charges if any apply. Same theme again: you exit at the bid price.',
    ],
    formulas: ['Surrender value = Units × Bid price (− surrender charges)'],
    examples: [
      {
        title: 'With decimals',
        given: '9,015.77 units, bid price S$2.20 at surrender.',
        steps: ['SV = 9,015.77 × 2.20'],
        answer: 'S$19,834.69',
      },
      {
        title: 'Clean numbers',
        given: '8,200 units, bid price S$2.40, no surrender charges.',
        steps: ['SV = 8,200 × 2.40'],
        answer: 'S$19,680.00',
      },
    ],
    trap: 'Multiply by BID. Using the offer price overstates the surrender value.',
  },
  {
    id: 'return-gross',
    num: 12,
    title: 'Return on Gross Premium',
    tagline: 'TVM run backwards through the FVIF table',
    teach: [
      'The return on gross premium is the compound growth rate that turns the single premium into the eventual cash (surrender) value. Set up Premium × (1 + i)ⁿ = cash value, solve for the factor (1 + i)ⁿ, then find the closest factor in the n-row of the FVIF table and read the rate.',
    ],
    formulas: ['Premium × (1 + i)ⁿ = Cash value', '(1 + i)ⁿ = Cash value ÷ Premium → FVIF table, row n'],
    examples: [
      {
        title: 'Ten-year policy',
        given: 'A S$10,000 single premium grows to a S$17,947.33 surrender value over 10 years. Annual return?',
        steps: [
          '(1 + i)¹⁰ = 17,947.33 ÷ 10,000 = 1.7947',
          'FVIF row n = 10: closest factor is 1.7908, the 6% column',
        ],
        answer: 'i ≈ 6% p.a.',
      },
      {
        title: 'Five-year policy',
        given: 'S$15,000 grows to S$20,131.61 over 5 years. (FVIF at n = 5: 5% → 1.2763, 6% → 1.3382, 7% → 1.4026.)',
        steps: [
          '(1 + i)⁵ = 20,131.61 ÷ 15,000 = 1.3421',
          'Closest factor at n = 5 is 1.3382, the 6% column',
        ],
        answer: 'i ≈ 6% p.a.',
      },
    ],
    trap: 'The factor rarely matches the table exactly. Take the CLOSEST factor in the correct n-row, not the first one that looks near.',
  },
  {
    id: 'premium-components',
    num: 13,
    title: 'Premium Components',
    tagline: 'Net premium, loading, gross premium (Chapter 2)',
    teach: [
      'Net premium covers the expected cost of claims: mortality/morbidity cost, reduced by the investment income the insurer expects to earn on premiums. Investment income makes premiums cheaper, so it is subtracted.',
      'Gross premium = net premium + loading, where loading = expenses + profit margin.',
    ],
    formulas: [
      'Net premium = mortality/morbidity cost − investment income',
      'Loading = expenses + profit margin',
      'Gross premium = net premium + loading',
    ],
    examples: [
      {
        title: 'Building a gross premium',
        given: 'Mortality cost S$420; investment income offset S$70; expenses S$60; profit margin S$30.',
        steps: [
          'Net = 420 − 70 = S$350',
          'Loading = 60 + 30 = S$90',
          'Gross = 350 + 90',
        ],
        answer: 'Net S$350 ; Gross S$440',
      },
      {
        title: 'Larger numbers',
        given: 'Mortality cost S$800; investment income S$150; expenses S$90; profit S$40.',
        steps: [
          'Net = 800 − 150 = S$650',
          'Loading = 90 + 40 = S$130',
          'Gross = 650 + 130',
        ],
        answer: 'Net S$650 ; Gross S$780',
      },
    ],
    trap: 'Investment income REDUCES the net premium. Adding it instead of subtracting flips the answer.',
  },
  {
    id: 'bonuses',
    num: 14,
    title: 'Bonuses — SRB vs CRB',
    tagline: 'Level bonuses vs compounding bonuses (Chapter 6)',
    teach: [
      'A simple reversionary bonus (SRB) is the bonus rate applied to the sum assured only, so it is level each year. A compound reversionary bonus (CRB) applies the rate to the sum assured plus bonuses already attached, so each year\u2019s bonus grows.',
      'Death benefit = guaranteed death benefit + bonuses credited (including any terminal bonus). Surrender value = guaranteed surrender value + surrender value of bonuses.',
    ],
    formulas: [
      'SRB = rate × sum assured (level each year)',
      'CRB = rate × (sum assured + bonuses attached)',
      'Death benefit = guaranteed + bonuses credited',
    ],
    examples: [
      {
        title: 'Simple vs compound over 2 years',
        given: 'Sum assured S$100,000, 3% bonus declared in each of Years 1 and 2. Total under SRB vs CRB?',
        steps: [
          'SRB: Yr 1 = 3,000 ; Yr 2 = 3,000 → S$6,000',
          'CRB: Yr 1 = 3% × 100,000 = 3,000 (attached total 103,000)',
          'CRB: Yr 2 = 3% × 103,000 = 3,090 → S$6,090',
          'The S$90 difference is the compounding effect',
        ],
        answer: 'SRB S$6,000 ; CRB S$6,090',
      },
      {
        title: 'Death benefit with bonuses',
        given: 'Guaranteed death benefit S$100,000; reversionary bonuses credited S$8,500; terminal bonus S$4,000.',
        steps: ['DB = 100,000 + 8,500 + 4,000'],
        answer: 'S$112,500',
      },
    ],
    trap: 'CRB compounds on (sum assured + attached bonuses), not on the sum assured alone. Applying the rate to the SA both years gives the SRB answer.',
  },
]

/** Part 2 — the quick-recall reference sheet. */
export const formulaGroups: FormulaGroup[] = [
  {
    title: 'Time Value of Money',
    items: [
      'FV = PV × (1 + i)ⁿ',
      'PV = FV ÷ (1 + i)ⁿ',
      'Effective rate = (1 + r/m)ᵐ − 1',
      '"Beginning of Year X" → n = X − 1',
      'Compounding: FV rises with i, n. Discounting: PV falls with i, n.',
    ],
  },
  {
    title: 'ILP Units',
    items: [
      'Future offer price = OP × (1 + i)ⁿ',
      'Units purchased = Premium ÷ Offer price',
      'Bid price = (1 − spread) × Offer price',
      'Premium allocated = Allocation % × Premium',
    ],
  },
  {
    title: 'Death Benefit (u = units × bid, v = sum assured)',
    items: [
      'DB1 = u ; DB2 = v',
      'DB3 = u + v',
      'DB4 = higher of (u, v)',
    ],
  },
  {
    title: 'Mortality Charge (q = S$ per S$1,000)',
    items: [
      'DB3 monthly = [(q ÷ 1,000) × v] ÷ 12',
      'DB4 monthly = [(q ÷ 1,000) × (v − u)] ÷ 12 if v > u',
      'DB4 monthly = 0 if u ≥ v',
    ],
  },
  {
    title: 'Units Allocated (5 steps)',
    items: [
      '1. Purchased = (allocation % × premium) ÷ offer price',
      '2. Bid = (1 − spread) × offer price',
      '3. Charges = policy fee + admin + mortality',
      '4. Cancelled = charges ÷ bid price',
      '5. Remaining = purchased − cancelled (+ prior)',
    ],
  },
  {
    title: 'Withdrawal / Surrender / Return',
    items: [
      'Units cancelled = withdrawal ÷ bid price',
      'Surrender value = units × bid price (− charges)',
      'Return: Premium × (1 + i)ⁿ = cash value → FVIF table',
    ],
  },
  {
    title: 'Premiums & Bonuses',
    items: [
      'Net premium = mortality cost − investment income',
      'Gross = net + loading (loading = expenses + profit)',
      'SRB = rate × SA ; CRB = rate × (SA + bonuses attached)',
      'Death benefit = guaranteed + bonuses credited',
    ],
  },
]

/** The three mistakes that cost the most marks. */
export const topTraps: string[] = [
  'Miscounting periods — "beginning of Year X" means n = X − 1.',
  'Wrong price — you buy at OFFER, cash out at BID; charges convert at BID.',
  'Mortality-charge base — DB3 charges on the full sum assured (v); DB4 charges on (v − u), or zero once units ≥ sum assured.',
]
