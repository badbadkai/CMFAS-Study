import localforage from 'localforage'

localforage.config({ name: 'cmfas-study', storeName: 'progress' })

export interface QuizResult {
  moduleId: string
  chapterId: string
  score: number
  total: number
  ts: number
}

export interface MockResult {
  moduleId: string
  paper: number | 'random'
  score: number
  total: number
  ts: number
}

const QUIZ_KEY = 'quizResults'
const MOCK_KEY = 'mockResults'

export async function saveQuizResult(r: QuizResult): Promise<void> {
  const all = (await localforage.getItem<QuizResult[]>(QUIZ_KEY)) ?? []
  all.push(r)
  await localforage.setItem(QUIZ_KEY, all.slice(-500))
}

export async function saveMockResult(r: MockResult): Promise<void> {
  const all = (await localforage.getItem<MockResult[]>(MOCK_KEY)) ?? []
  all.push(r)
  await localforage.setItem(MOCK_KEY, all.slice(-200))
}

export async function getMockResults(): Promise<MockResult[]> {
  return (await localforage.getItem<MockResult[]>(MOCK_KEY)) ?? []
}
