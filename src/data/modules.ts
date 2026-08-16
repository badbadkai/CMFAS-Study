import type { Module, MockPaper } from '../types'
import { m9Chapters } from './m9/factbank'
import { m9aChapters } from './m9a/factbank'
import mockData from './m9/mocks.json'

const m9Mocks = (mockData as { papers: MockPaper[] }).papers

export const modules: Module[] = [
  {
    id: 'M9',
    name: 'M9',
    subtitle: 'Life Insurance & Investment-Linked Policies',
    available: true,
    chapters: m9Chapters,
    mocks: m9Mocks,
  },
  {
    id: 'M9A',
    name: 'M9A',
    subtitle: 'Life Insurance & ILPs II (Structured Products)',
    available: true,
    chapters: m9aChapters,
    mocks: [],
  },
  {
    id: 'HI',
    name: 'HI',
    subtitle: 'Health Insurance (coming soon)',
    available: false,
    chapters: [],
    mocks: [],
  },
  {
    id: 'RES5',
    name: 'RES5',
    subtitle: 'Rules & Regulations for FA (coming soon)',
    available: false,
    chapters: [],
    mocks: [],
  },
]

export function getModule(id: string): Module | undefined {
  return modules.find((m) => m.id === id)
}

/** All concepts in a module, used as a distractor fallback pool for small chapters. */
export function moduleConceptPool(id: string) {
  const m = getModule(id)
  if (!m) return []
  return m.chapters.flatMap((c) => c.concepts)
}
