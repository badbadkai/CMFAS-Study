export type Letter = 'A' | 'B' | 'C' | 'D'

/** A single studyable unit. Feeds both Study flashcards and generated quiz questions. */
export interface Concept {
  id: string
  /** Flashcard front: the concept name or a short prompt. */
  term: string
  /** Flashcard back: the key fact to learn. Kept concise. */
  fact: string
  /** Optional common confusion. Used as a strong quiz distractor and a study hint. */
  trap?: string
}

export interface Chapter {
  id: string
  num: number
  title: string
  page?: number
  concepts: Concept[]
}

export interface MockQuestion {
  id: string
  num: number
  stem: string
  options: Record<Letter, string>
  answer: Letter
  /** Present on authored (non-official) papers; shown in the review screen. */
  explanation?: string
}

export interface MockPaper {
  paper: number
  questions: MockQuestion[]
}

/** An authored Quiz Me question: exam-style stem, four options, and a real explanation. */
export interface QuizItem {
  id: string
  /** Source concept this was authored from, if any. */
  conceptId?: string
  stem: string
  options: Record<Letter, string>
  answer: Letter
  /** Why the correct answer is right and the tempting wrong one is wrong. */
  explanation: string
  /** True for calculation word-problems. */
  calc?: boolean
}

/** A question the Quiz Me screen can play: authored QuizItem or a raw mock question. */
export type PlayableQuestion = {
  id: string
  stem: string
  options: Record<Letter, string>
  answer: Letter
  explanation?: string
}

/** A fully worked calculation example shown step by step in Computations > Learn. */
export interface CompExample {
  title: string
  /** The scenario: what is given and what is asked. */
  given: string
  /** Worked lines, revealed one at a time. */
  steps: string[]
  /** The final answer, shown boxed. */
  answer: string
}

/** One computation topic: concept, formulas, and worked examples. */
export interface CompTopic {
  id: string
  num: number
  title: string
  /** One-line hook shown on the topic list. */
  tagline: string
  /** Teaching paragraphs. */
  teach: string[]
  /** Formulas for this topic, one per line. */
  formulas: string[]
  examples: CompExample[]
  /** The mistake that costs marks on this topic. */
  trap?: string
}

/** A group of formulas for the quick-recall reference sheet. */
export interface FormulaGroup {
  title: string
  items: string[]
}

export interface Module {
  id: string
  name: string
  subtitle: string
  available: boolean
  chapters: Chapter[]
  mocks: MockPaper[]
  /** Authored quiz bank. When present, Quiz Me uses this instead of mock questions. */
  quiz?: QuizItem[]
  /** True when the module has a Computations section. */
  comp?: boolean
  /** Mock-exam duration in minutes. Defaults to 120 when unset. */
  examMinutes?: number
}

