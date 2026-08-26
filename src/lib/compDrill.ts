/**
 * Infinite practice-problem generators for the M9 Computations drill.
 * One generator per calculation type. Parameters are randomised so the
 * method must be applied, not the answer memorised. Each problem carries
 * its own fully worked solution; all displayed roundings are consistent
 * with the steps shown.
 */

export interface DrillProblem {
  topicId: string
  topicTitle: string
  prompt: string
  steps: string[]
  answer: string
}

// ---------- helpers ----------

function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function pick<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

function round2(x: number): number {
  // Snap away float artifacts (0.95 × 1.50 = 1.4249999...) before rounding.
  return Math.round(Number((x * 100).toFixed(6))) / 100
}

/** S$ with thousands separators, always 2dp. */
function money(x: number): string {
  return (
    'S$' +
    x.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  )
}

/** Plain number with thousands separators, 2dp. */
function num2(x: number): string {
  return x.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

/** Factor like (1.06)^3 shown to 6dp. */
function factor(x: number): string {
  return x.toFixed(6)
}

function pct(x: number): string {
  return `${x}%`
}

// ---------- generators ----------

function genFutureValue(): DrillProblem {
  const pv = randInt(2, 12) * 1000
  const i = randInt(3, 10)
  const n = randInt(3, 8)
  const f = Math.pow(1 + i / 100, n)
  const fv = round2(pv * f)
  return {
    topicId: 'tvm',
    topicTitle: 'Time Value of Money',
    prompt: `${money(pv)} is invested at ${pct(i)} compound interest per annum. What is it worth at the end of Year ${n}?`,
    steps: [
      `FV = PV × (1 + i)ⁿ = ${num2(pv)} × (1.${String(i).padStart(2, '0')})^${n}`,
      `(1 + ${i / 100})^${n} = ${factor(f)}`,
      `FV = ${num2(pv)} × ${factor(f)} = ${num2(fv)}`,
    ],
    answer: money(fv),
  }
}

function genPresentValue(): DrillProblem {
  const fv = randInt(3, 20) * 5000
  const i = randInt(3, 8)
  const n = randInt(3, 8)
  const f = Math.pow(1 + i / 100, n)
  const pv = round2(fv / f)
  return {
    topicId: 'tvm',
    topicTitle: 'Time Value of Money',
    prompt: `You need ${money(fv)} in ${n} years and can earn ${pct(i)} compound interest. How much must you set aside today?`,
    steps: [
      `PV = FV ÷ (1 + i)ⁿ = ${num2(fv)} ÷ (1 + ${i / 100})^${n}`,
      `(1 + ${i / 100})^${n} = ${factor(f)}`,
      `PV = ${num2(fv)} ÷ ${factor(f)} = ${num2(pv)}`,
    ],
    answer: money(pv),
  }
}

function genEffectiveRate(): DrillProblem {
  const r = pick([4, 6, 8, 10, 12])
  const m = pick([2, 4, 12] as const)
  const label = m === 2 ? 'semi-annually' : m === 4 ? 'quarterly' : 'monthly'
  const eff = (Math.pow(1 + r / 100 / m, m) - 1) * 100
  return {
    topicId: 'effective-rate',
    topicTitle: 'Effective Interest Rate',
    prompt: `A deposit pays ${pct(r)} nominal interest per annum, compounded ${label}. What is the effective annual interest rate?`,
    steps: [
      `Effective = (1 + r/m)ᵐ − 1 with r = ${r / 100}, m = ${m}`,
      `= (1 + ${(r / 100 / m).toFixed(4)})^${m} − 1`,
      `= ${factor(Math.pow(1 + r / 100 / m, m))} − 1 = ${(eff / 100).toFixed(4)}`,
    ],
    answer: `${eff.toFixed(2)}% effective (vs ${pct(r)} nominal)`,
  }
}

function genReturnOnPremium(): DrillProblem {
  const premium = randInt(2, 8) * 5000
  const i = randInt(2, 8)
  const n = pick([5, 8, 10] as const)
  // Perturb the cash value slightly so the computed factor is near, not equal
  const wobble = 1 + (Math.random() * 0.006 - 0.003)
  const cash = round2(premium * Math.pow(1 + i / 100, n) * wobble)
  const myFactor = cash / premium
  const table = [i - 1, i, i + 1].map(
    (rate) => `${rate}% → ${Math.pow(1 + rate / 100, n).toFixed(4)}`,
  )
  return {
    topicId: 'return-gross',
    topicTitle: 'Return on Gross Premium',
    prompt: `A single premium of ${money(premium)} grows to a cash value of ${money(cash)} after ${n} years. Using the FVIF extract for n = ${n} [${table.join(' ; ')}], what is the approximate annual return?`,
    steps: [
      `(1 + i)^${n} = ${num2(cash)} ÷ ${num2(premium)} = ${myFactor.toFixed(4)}`,
      `Scan the n = ${n} row: ${table.join(' ; ')}`,
      `Closest factor is ${Math.pow(1 + i / 100, n).toFixed(4)}, the ${i}% column`,
    ],
    answer: `i ≈ ${i}% p.a.`,
  }
}

function genOfferPriceUnits(): DrillProblem {
  const op = pick([1.2, 1.5, 1.8, 2.0, 2.5])
  const g = randInt(3, 8)
  const premium = randInt(2, 10) * 1000
  const beginning = Math.random() < 0.6
  const year = randInt(3, 6)
  const n = beginning ? year - 1 : year
  const f = Math.pow(1 + g / 100, n)
  const grownOp = round2(op * f)
  const units = round2(premium / grownOp)
  const timing = beginning ? `the beginning of Year ${year}` : `the end of Year ${year}`
  return {
    topicId: 'offer-price',
    topicTitle: 'Offer Price Growth & Units Purchased',
    prompt: `An ILP's offer price is ${money(op)} at inception and grows at ${pct(g)} per annum. How many units does a ${money(premium)} premium buy at ${timing}?`,
    steps: [
      beginning
        ? `Beginning of Year ${year} → n = ${year} − 1 = ${n}`
        : `End of Year ${year} → n = ${n}`,
      `OP = ${op.toFixed(2)} × (1 + ${g / 100})^${n} = ${op.toFixed(2)} × ${factor(f)} = ${grownOp.toFixed(2)}`,
      `Units = ${num2(premium)} ÷ ${grownOp.toFixed(2)} = ${num2(units)}`,
    ],
    answer: `${num2(units)} units`,
  }
}

function genDeathBenefit(): DrillProblem {
  const units = randInt(3, 8) * 1000
  const bid = pick([2.0, 2.4, 2.5, 3.0, 3.2])
  const u = round2(units * bid)
  // Place the sum assured near u so DB4 is a genuine comparison
  const v = Math.round((u * (0.75 + Math.random() * 0.5)) / 1000) * 1000
  const db3 = round2(u + v)
  const db4 = Math.max(u, v)
  const winner = u >= v ? 'the value of units' : 'the sum assured'
  return {
    topicId: 'death-benefit',
    topicTitle: 'Death Benefit — DB3 & DB4',
    prompt: `A policyholder dies holding ${units.toLocaleString('en-US')} units at a bid price of ${money(bid)}, with a sum assured of ${money(v)}. What is the death benefit under DB3 and under DB4?`,
    steps: [
      `u = ${units.toLocaleString('en-US')} × ${bid.toFixed(2)} = ${num2(u)}`,
      `v = ${num2(v)}`,
      `DB3 = u + v = ${num2(u)} + ${num2(v)} = ${num2(db3)}`,
      `DB4 = higher of (u, v) = ${num2(db4)} (${winner} wins)`,
    ],
    answer: `DB3 = ${money(db3)} ; DB4 = ${money(db4)}`,
  }
}

function genMortalityCharge(): DrillProblem {
  const q = pick([1.2, 1.5, 1.8, 2.4, 3.0, 3.6])
  const v = randInt(10, 30) * 10000
  const variant = pick(['db3', 'db4', 'db4zero'] as const)
  if (variant === 'db3') {
    const annual = round2((q / 1000) * v)
    const monthly = round2(annual / 12)
    return {
      topicId: 'mortality-charge',
      topicTitle: 'Mortality Charges — DB3 & DB4',
      prompt: `Mortality is charged at ${money(q)} per S$1,000 of sum assured. The sum assured is ${money(v)}. What is the monthly mortality charge under DB3?`,
      steps: [
        `DB3 charges on the full sum assured v`,
        `Annual = (${q.toFixed(2)} ÷ 1,000) × ${num2(v)} = ${num2(annual)}`,
        `Monthly = ${num2(annual)} ÷ 12 = ${num2(monthly)}`,
      ],
      answer: `${money(monthly)} per month`,
    }
  }
  if (variant === 'db4zero') {
    const u = v + randInt(1, 5) * 10000
    return {
      topicId: 'mortality-charge',
      topicTitle: 'Mortality Charges — DB3 & DB4',
      prompt: `Mortality is charged at ${money(q)} per S$1,000. Sum assured ${money(v)}; the units are worth ${money(u)}. What is the monthly mortality charge under DB4?`,
      steps: [
        `DB4 charges on (v − u), but only when v > u`,
        `Here u (${num2(u)}) ≥ v (${num2(v)}) → nothing at risk`,
      ],
      answer: 'S$0 per month',
    }
  }
  const u = Math.round((v * (0.2 + Math.random() * 0.5)) / 10000) * 10000
  const risk = v - u
  const annual = round2((q / 1000) * risk)
  const monthly = round2(annual / 12)
  return {
    topicId: 'mortality-charge',
    topicTitle: 'Mortality Charges — DB3 & DB4',
    prompt: `Mortality is charged at ${money(q)} per S$1,000. Sum assured ${money(v)}; the units are worth ${money(u)}. What is the monthly mortality charge under DB4?`,
    steps: [
      `Amount at risk = v − u = ${num2(v)} − ${num2(u)} = ${num2(risk)}`,
      `Annual = (${q.toFixed(2)} ÷ 1,000) × ${num2(risk)} = ${num2(annual)}`,
      `Monthly = ${num2(annual)} ÷ 12 = ${num2(monthly)}`,
    ],
    answer: `${money(monthly)} per month`,
  }
}

function genAllocation(): DrillProblem {
  const premium = randInt(10, 48) * 100
  const [year, rate] = pick([
    [1, 15],
    [2, 30],
    [3, 50],
    [5, 100],
    [10, 102],
  ] as const)
  const allocated = round2((rate / 100) * premium)
  return {
    topicId: 'allocation-rate',
    topicTitle: 'Allocation Rate',
    prompt: `A regular-premium ILP charges an annual premium of ${money(premium)}. The Year ${year} allocation rate is ${pct(rate)}. How much of the premium is allocated to purchase units?`,
    steps: [
      `Allocated = ${pct(rate)} × ${num2(premium)} = ${num2(allocated)}`,
      rate < 100
        ? 'The unallocated portion defrays early expenses'
        : rate > 100
          ? `${money(round2(allocated - premium))} of that is bonus units`
          : 'Full allocation from Year 4 onwards is typical',
    ],
    answer: money(allocated),
  }
}

function genUnitsRoutine(): DrillProblem {
  const premium = randInt(2, 6) * 5000
  const op = pick([1.25, 1.5, 1.6, 2.0, 2.5])
  const fee = pick([100, 150, 200])
  const adminPct = pick([1.5, 2, 2.5, 3])
  const spread = 5
  const bought = round2(premium / op)
  const bid = round2(0.95 * op)
  const admin = round2((adminPct / 100) * premium)
  const charges = round2(fee + admin)
  const cancelled = round2(charges / bid)
  const remaining = round2(bought - cancelled)
  return {
    topicId: 'units-allocated',
    topicTitle: 'Units Allocated — the Full Routine',
    prompt: `A single premium of ${money(premium)} buys units at an offer price of ${money(op)}. Policy fee ${money(fee)}; administrative and mortality charge ${adminPct}% of the premium; bid-offer spread ${pct(spread)}. How many units remain after charges?`,
    steps: [
      `Units purchased = ${num2(premium)} ÷ ${op.toFixed(2)} = ${num2(bought)}`,
      `Bid = 0.95 × ${op.toFixed(2)} = ${bid.toFixed(2)}`,
      `Charges = ${num2(fee)} + (${adminPct}% × ${num2(premium)} = ${num2(admin)}) = ${num2(charges)}`,
      `Cancelled = ${num2(charges)} ÷ ${bid.toFixed(2)} = ${num2(cancelled)}`,
      `Remaining = ${num2(bought)} − ${num2(cancelled)} = ${num2(remaining)}`,
    ],
    answer: `${num2(remaining)} units`,
  }
}

function genTopUp(): DrillProblem {
  const amount = randInt(2, 8) * 1000
  const g = randInt(4, 8)
  const op0 = pick([1.5, 1.8, 2.0])
  const year = randInt(2, 4)
  const fee = pick([50, 80, 100])
  const adminPct = 1.5
  const f = Math.pow(1 + g / 100, year)
  const op = round2(op0 * f)
  const bid = round2(op * 0.95)
  const bought = round2(amount / op)
  const admin = round2((adminPct / 100) * amount)
  const charges = round2(fee + admin)
  const cancelled = round2(charges / bid)
  const added = round2(bought - cancelled)
  return {
    topicId: 'top-ups',
    topicTitle: 'Top-ups',
    prompt: `A ${money(amount)} top-up is made at the end of Year ${year}. The offer price was ${money(op0)} at inception, growing ${pct(g)} p.a. Top-up fee ${money(fee)}; admin (incl. mortality) ${adminPct}% of the top-up; spread 5%. How many units are added?`,
    steps: [
      `End of Year ${year} → n = ${year}. OP = ${op0.toFixed(2)} × ${factor(f)} = ${op.toFixed(2)}`,
      `Bid = ${op.toFixed(2)} × 0.95 = ${bid.toFixed(2)}`,
      `Bought = ${num2(amount)} ÷ ${op.toFixed(2)} = ${num2(bought)}`,
      `Charges = ${num2(fee)} + (${adminPct}% × ${num2(amount)} = ${num2(admin)}) = ${num2(charges)} → cancelled = ${num2(charges)} ÷ ${bid.toFixed(2)} = ${num2(cancelled)}`,
      `Added = ${num2(bought)} − ${num2(cancelled)} = ${num2(added)}`,
    ],
    answer: `${num2(added)} units added`,
  }
}

function genWithdrawal(): DrillProblem {
  const amount = randInt(4, 20) * 500
  const bid = pick([1.5, 1.8, 2.0, 2.25, 2.5])
  const cancelled = round2(amount / bid)
  return {
    topicId: 'withdrawal',
    topicTitle: 'Withdrawal',
    prompt: `A policyholder withdraws ${money(amount)} when the bid price is ${money(bid)}. How many units are cancelled?`,
    steps: [`Cancelled = withdrawal ÷ bid = ${num2(amount)} ÷ ${bid.toFixed(2)} = ${num2(cancelled)}`],
    answer: `${num2(cancelled)} units cancelled`,
  }
}

function genSurrender(): DrillProblem {
  const units = round2(randInt(4000, 12000) + randInt(0, 99) / 100)
  const bid = pick([1.8, 2.0, 2.2, 2.4, 2.6])
  const sv = round2(units * bid)
  return {
    topicId: 'surrender',
    topicTitle: 'Surrender Value',
    prompt: `A policy is surrendered with ${num2(units)} units in the account. The bid price is ${money(bid)} and there are no surrender charges. What is the surrender value?`,
    steps: [`SV = units × bid = ${num2(units)} × ${bid.toFixed(2)} = ${num2(sv)}`],
    answer: money(sv),
  }
}

function genPremiumComponents(): DrillProblem {
  const mortality = randInt(30, 90) * 10
  const invIncome = randInt(5, Math.floor(mortality / 20)) * 10
  const expenses = randInt(4, 12) * 10
  const profit = randInt(2, 6) * 10
  const net = mortality - invIncome
  const loading = expenses + profit
  const gross = net + loading
  return {
    topicId: 'premium-components',
    topicTitle: 'Premium Components',
    prompt: `An insurer prices a policy with: mortality cost ${money(mortality)}, expected investment income ${money(invIncome)}, expenses ${money(expenses)}, profit margin ${money(profit)}. Find the net premium and the gross premium.`,
    steps: [
      `Net = mortality − investment income = ${num2(mortality)} − ${num2(invIncome)} = ${num2(net)}`,
      `Loading = expenses + profit = ${num2(expenses)} + ${num2(profit)} = ${num2(loading)}`,
      `Gross = net + loading = ${num2(net)} + ${num2(loading)} = ${num2(gross)}`,
    ],
    answer: `Net = ${money(net)} ; Gross = ${money(gross)}`,
  }
}

function genBonuses(): DrillProblem {
  const sa = randInt(5, 20) * 10000
  const rate = pick([2, 2.5, 3, 4])
  const yr1 = round2((rate / 100) * sa)
  const attached = sa + yr1
  const yr2 = round2((rate / 100) * attached)
  const srbTotal = round2(yr1 * 2)
  const crbTotal = round2(yr1 + yr2)
  return {
    topicId: 'bonuses',
    topicTitle: 'Bonuses — SRB vs CRB',
    prompt: `A participating policy has a sum assured of ${money(sa)}. A ${rate}% reversionary bonus is declared in each of Years 1 and 2. What is the total bonus attached after Year 2 under SRB, and under CRB?`,
    steps: [
      `SRB: ${rate}% × ${num2(sa)} = ${num2(yr1)} each year → total ${num2(srbTotal)}`,
      `CRB Yr 1 = ${rate}% × ${num2(sa)} = ${num2(yr1)} (attached total ${num2(attached)})`,
      `CRB Yr 2 = ${rate}% × ${num2(attached)} = ${num2(yr2)}`,
      `CRB total = ${num2(yr1)} + ${num2(yr2)} = ${num2(crbTotal)}`,
    ],
    answer: `SRB = ${money(srbTotal)} ; CRB = ${money(crbTotal)}`,
  }
}

// ---------- registry & sampler ----------

const generators: Record<string, Array<() => DrillProblem>> = {
  tvm: [genFutureValue, genPresentValue],
  'effective-rate': [genEffectiveRate],
  fvif: [genReturnOnPremium],
  'offer-price': [genOfferPriceUnits],
  'death-benefit': [genDeathBenefit],
  'mortality-charge': [genMortalityCharge],
  'allocation-rate': [genAllocation],
  'units-allocated': [genUnitsRoutine],
  'top-ups': [genTopUp],
  withdrawal: [genWithdrawal],
  surrender: [genSurrender],
  'return-gross': [genReturnOnPremium],
  'premium-components': [genPremiumComponents],
  bonuses: [genBonuses],
}

const allGenerators: Array<() => DrillProblem> = [
  genFutureValue,
  genPresentValue,
  genEffectiveRate,
  genOfferPriceUnits,
  genDeathBenefit,
  genMortalityCharge,
  genAllocation,
  genUnitsRoutine,
  genTopUp,
  genWithdrawal,
  genSurrender,
  genReturnOnPremium,
  genPremiumComponents,
  genBonuses,
]

/** Generate a problem for a specific topic, or a random one when topicId is omitted. */
export function generateProblem(topicId?: string): DrillProblem {
  if (topicId && generators[topicId]) return pick(generators[topicId])()
  return pick(allGenerators)()
}
