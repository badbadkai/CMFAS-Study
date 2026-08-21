import type { Module, MockPaper } from '../types'
import { m9Chapters } from './m9/factbank'
import { m9aChapters } from './m9a/factbank'
import mockData from './m9/mocks.json'
import m9aMockData from './m9a/mocks.json'
import hiMockData from './hi/mocks.json'
import res5MockData from './res5/mocks.json'

const m9Mocks = (mockData as { papers: MockPaper[] }).papers
const m9aMocks = (m9aMockData as { papers: MockPaper[] }).papers
const hiMocks = (hiMockData as { papers: MockPaper[] }).papers
const res5Mocks = (res5MockData as { papers: MockPaper[] }).papers

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
    mocks: m9aMocks,
  },
  {
    id: 'HI',
    name: 'HI',
    subtitle: 'Health Insurance',
    available: true,
    chapters: [],
    mocks: hiMocks,
  },
  {
    id: 'RES5',
    name: 'RES5',
    subtitle: 'Rules & Regulations for Financial Advisory Services',
    available: true,
    chapters: [],
    mocks: res5Mocks,
  },
]

export function getModule(id: string): Module | undefined {
  return modules.find((m) => m.id === id)
}
