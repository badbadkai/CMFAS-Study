import localforage from 'localforage'

localforage.config({ name: 'cmfas-study', storeName: 'progress' })

export interface QuizResult {
  moduleId: string
  chapterId: string
  score: number
  total: number
  ts: number
  wrongConceptIds: string[]
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

export async function getQuizResults(): Promise<QuizResult[]> {
  return (await localforage.getItem<QuizResult[]>(QUIZ_KEY)) ?? []
}

export async function getMockResults(): Promise<MockResult[]> {
  return (await localforage.getItem<MockResult[]>(MOCK_KEY)) ?? []
}

export interface ChapterStat {
  attempts: number
  bestPct: number
  lastPct: number
}

export async function getChapterStats(moduleId: string): Promise<Record<string, ChapterStat>> {
  const results = (await getQuizResults()).filter((r) => r.moduleId === moduleId)
  const out: Record<string, ChapterStat> = {}
  for (const r of results) {
    const pct = r.total ? Math.round((r.score / r.total) * 100) : 0
    const s = out[r.chapterId] ?? { attempts: 0, bestPct: 0, lastPct: 0 }
    s.attempts += 1
    s.bestPct = Math.max(s.bestPct, pct)
    s.lastPct = pct
    out[r.chapterId] = s
  }
  return out
}

/** Concept ids the user has recently gotten wrong, most frequent first. */
export async function getWeakConceptIds(moduleId: string): Promise<string[]> {
  const results = (await getQuizResults()).filter((r) => r.moduleId === moduleId).slice(-40)
  const freq = new Map<string, number>()
  for (const r of results) {
    for (const id of r.wrongConceptIds) freq.set(id, (freq.get(id) ?? 0) + 1)
  }
  return [...freq.entries()].sort((a, b) => b[1] - a[1]).map(([id]) => id)
}
