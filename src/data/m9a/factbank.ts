import type { Chapter } from '../../types'

// M9A fact bank. Seeded from the M9A study text outline; grows over time.
export const m9aChapters: Chapter[] = [
  {
    id: 'ch1',
    num: 1,
    title: 'Introduction To Structured Products',
    page: 1,
    concepts: [
      { id: 'a1-01', term: 'What is a structured product?', fact: 'A pre-packaged investment combining a bond or deposit with a derivative, giving a return linked to an underlying asset. It is delivered through a \u201Cwrapper\u201D such as a note, deposit, or ILP.' },
      { id: 'a1-02', term: 'What is a wrapper?', fact: 'The legal form a structured product takes (note, deposit, fund, or insurance policy), which determines its regulation and investor protection.' },
      { id: 'a1-03', term: 'Components of a structured product', fact: 'Principal risk versus return risk, and the trade-off between protecting capital and enhancing return.' },
      { id: 'a1-04', term: 'Types of structured products', fact: 'Capital-protected products, yield-enhancement products (reverse convertible bonds, discount certificates), and participation products (tracker, bonus, airbag certificates).' },
      { id: 'a1-05', term: 'Suitability (KYC/KYP)', fact: 'Know your client (objectives, time horizon, knowledge and experience) and know your products (understand them and explain them clearly).' },
    ],
  },
  {
    id: 'ch2',
    num: 2,
    title: 'Risk Considerations Of Structured Products',
    page: 27,
    concepts: [
      { id: 'a2-01', term: 'Market risk', fact: 'General market risk plus issuer-specific risk affecting the value of the underlying.' },
      { id: 'a2-02', term: 'Issuer / counterparty credit risk', fact: 'The risk the issuer or swap counterparty defaults; the product\u2019s principal depends on their creditworthiness.' },
      { id: 'a2-03', term: 'Liquidity risk', fact: 'The difficulty of selling before maturity at a fair price.' },
      { id: 'a2-04', term: 'Structural risk', fact: 'Risk from leverage, use of derivatives, investment concentration, collateral quality, and safety of principal.' },
    ],
  },
  {
    id: 'ch3',
    num: 3,
    title: 'Understanding Derivatives',
    page: 39,
    concepts: [
      { id: 'a3-01', term: 'What are derivatives?', fact: 'Instruments that derive their value from an underlying asset: futures/forwards, options/warrants, swaps, and contracts for differences.' },
      { id: 'a3-02', term: 'Futures vs forwards', fact: 'Forwards are over-the-counter and customised; futures are exchange-traded, standardised and margined.', trap: 'Futures are standardised and exchange-traded; forwards are customised OTC contracts.' },
      { id: 'a3-03', term: 'Options and warrants', fact: 'The right, not the obligation, to buy (call) or sell (put) at a strike price. The buyer\u2019s maximum loss is the premium paid.' },
      { id: 'a3-04', term: 'Swaps', fact: 'An exchange of cash flows: interest rate, currency, credit default (CDS), equity, and commodity swaps.' },
    ],
  },
  {
    id: 'ch4',
    num: 4,
    title: 'Introduction To Structured ILPs',
    page: 73,
    concepts: [
      { id: 'a4-01', term: 'What is a structured ILP?', fact: 'An ILP wrapper around a structured product; the payout is linked to an underlying asset within an insurance policy.' },
      { id: 'a4-02', term: 'Advantages & disadvantages', fact: 'Access to structured payoffs plus an insurance element, against complexity, limited liquidity, and issuer risk.' },
      { id: 'a4-03', term: 'Governance & documentation', fact: 'Point-of-sale disclosure (product summary, benefit illustration, product highlights sheet), policy documents, and after-sales statements and fund reports.' },
    ],
  },
  {
    id: 'ch5',
    num: 5,
    title: 'Portfolio Of Investments With An Insurance Element',
    page: 98,
    concepts: [
      { id: 'a5-01', term: 'Portfolio with an insurance element', fact: 'A portfolio bond wrapping a portfolio of investments inside an insurance policy, such as portfolio bonds marketed in the UK.' },
      { id: 'a5-02', term: 'Suitability', fact: 'Who would invest, and when it is unsuitable, depends on the client\u2019s objectives, sophistication and liquidity needs.' },
    ],
  },
  {
    id: 'ch6',
    num: 6,
    title: 'Case Studies',
    page: 104,
    concepts: [
      { id: 'a6-01', term: 'Case study approach', fact: 'Applied analysis of each product: product features, selling points, risk analysis, and performance under different market conditions.' },
    ],
  },
]
