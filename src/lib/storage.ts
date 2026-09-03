import localforage from 'localforage'
import type { Letter } from '../types'

localforage.config({ name: 'cmfas-study', storeName: 'progress' })

export interface QuizResult {
  moduleId: string
  chapterId: string
  score: number
  total: number
  ts: number
}

export interface MockResult {
  /** Unique per attempt. Older saved results may not have one. */
  id?: string
  moduleId: string
  paper: number | 'random'
  score: number
  total: number
  ts: number
  /** Question order for this sitting, kept so the attempt can be reviewed later. */
  questionIds?: string[]
  /** The letters picked, keyed by question id. */
  answers?: Record<string, Letter>
}

/** An unfinished mock sitting, resumable from where it stopped. */
export interface MockSession {
  moduleId: string
  paper: number | 'random'
  questionIds: string[]
  answers: Record<string, Letter>
  idx: number
  remaining: number
  ts: number
}

const QUIZ_KEY = 'quizResults'
const MOCK_KEY = 'mockResults'
const SESSION_KEY = 'mockSessions'

type SessionMap = Record<string, MockSession>

const sessionKey = (moduleId: string, paper: number | 'random') => `${moduleId}:${paper}`

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

export async function getMockSessions(moduleId: string): Promise<MockSession[]> {
  const all = (await localforage.getItem<SessionMap>(SESSION_KEY)) ?? {}
  return Object.values(all).filter((s) => s.moduleId === moduleId)
}

export async function getMockSession(moduleId: string, paper: number | 'random'): Promise<MockSession | null> {
  const all = (await localforage.getItem<SessionMap>(SESSION_KEY)) ?? {}
  return all[sessionKey(moduleId, paper)] ?? null
}

export async function saveMockSession(s: MockSession): Promise<void> {
  const all = (await localforage.getItem<SessionMap>(SESSION_KEY)) ?? {}
  all[sessionKey(s.moduleId, s.paper)] = s
  await localforage.setItem(SESSION_KEY, all)
}

export async function clearMockSession(moduleId: string, paper: number | 'random'): Promise<void> {
  const all = (await localforage.getItem<SessionMap>(SESSION_KEY)) ?? {}
  delete all[sessionKey(moduleId, paper)]
  await localforage.setItem(SESSION_KEY, all)
}
