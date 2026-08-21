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

export interface Module {
  id: string
  name: string
  subtitle: string
  available: boolean
  chapters: Chapter[]
  mocks: MockPaper[]
  /** Authored quiz bank. When present, Quiz Me uses this instead of mock questions. */
  quiz?: QuizItem[]
}

