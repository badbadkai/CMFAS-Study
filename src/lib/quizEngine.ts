import type { Chapter, Concept, QuizQuestion, QuizOption } from '../types'
import { shuffle, sample, pick } from './shuffle'

const QUESTIONS_PER_SESSION = 10

/**
 * Build one MCQ from a target concept, drawing distractors from a pool.
 * Two question shapes, chosen at random, so repeated sessions vary:
 *  - describe: given the term, pick the correct fact
 *  - identify: given the fact, pick the correct term
 */
function buildQuestion(concept: Concept, pool: Concept[], index: number): QuizQuestion {
  const distractorPool = pool.filter((c) => c.id !== concept.id)
  const distractors = sample(distractorPool, 3)

  // If the concept has a "trap", swap it in as one distractor to sharpen the test.
  const useTrap = !!concept.trap && Math.random() < 0.5

  const shape = Math.random() < 0.5 ? 'describe' : 'identify'

  let prompt: string
  let correctText: string
  let distractorTexts: string[]
  let explanation: string

  if (shape === 'describe') {
    prompt = `Which statement best describes "${concept.term}"?`
    correctText = concept.fact
    distractorTexts = distractors.map((d) => d.fact)
    if (useTrap) distractorTexts[0] = concept.trap as string
    explanation = `${concept.term}: ${concept.fact}${concept.trap ? `\n\nWatch out: ${concept.trap}` : ''}`
  } else {
    prompt = `${concept.fact}\n\nWhich concept does this describe?`
    correctText = concept.term
    distractorTexts = distractors.map((d) => d.term)
    explanation = `${concept.term}: ${concept.fact}${concept.trap ? `\n\nWatch out: ${concept.trap}` : ''}`
  }

  // Ensure four distinct options.
  const seen = new Set([correctText])
  const cleanDistractors: string[] = []
  for (const t of distractorTexts) {
    if (!seen.has(t) && cleanDistractors.length < 3) {
      seen.add(t)
      cleanDistractors.push(t)
    }
  }
  // Backfill if we came up short (small chapters).
  for (const d of shuffle(distractorPool)) {
    if (cleanDistractors.length >= 3) break
    const t = shape === 'describe' ? d.fact : d.term
    if (!seen.has(t)) {
      seen.add(t)
      cleanDistractors.push(t)
    }
  }

  const options: QuizOption[] = shuffle([
    { text: correctText, correct: true },
    ...cleanDistractors.map((t) => ({ text: t, correct: false })),
  ])

  return {
    id: `${concept.id}-${shape}-${index}`,
    conceptId: concept.id,
    prompt,
    options,
    explanation,
  }
}

/** Generate a randomised 10-question quiz for a chapter. */
export function generateQuiz(chapter: Chapter, fallbackPool: Concept[] = []): QuizQuestion[] {
  const concepts = chapter.concepts
  if (concepts.length === 0) return []
  const pool = concepts.length >= 4 ? concepts : [...concepts, ...fallbackPool]
  const chosen = sample(concepts, Math.min(QUESTIONS_PER_SESSION, concepts.length))
  // If the chapter has fewer than 10 concepts, pad by re-sampling with fresh shapes.
  const targets =
    chosen.length >= QUESTIONS_PER_SESSION
      ? chosen
      : [...chosen, ...sample(concepts, QUESTIONS_PER_SESSION - chosen.length)]
  return targets.map((c, i) => buildQuestion(c, pool, i))
}

/** Generate a quiz focused on a specific set of concepts (weak spots). */
export function generateFocusedQuiz(concepts: Concept[], fullPool: Concept[]): QuizQuestion[] {
  if (concepts.length === 0) return []
  const targets = sample(concepts, Math.min(QUESTIONS_PER_SESSION, concepts.length))
  const padded =
    targets.length >= QUESTIONS_PER_SESSION
      ? targets
      : [...targets, ...sample(concepts, QUESTIONS_PER_SESSION - targets.length)]
  return padded.map((c, i) => buildQuestion(c, fullPool, i))
}

export function randomMockOrder<T>(questions: readonly T[]): T[] {
  return shuffle(questions)
}

export { pick }
