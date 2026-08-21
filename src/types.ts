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

export interface Module {
  id: string
  name: string
  subtitle: string
  available: boolean
  chapters: Chapter[]
  mocks: MockPaper[]
}

