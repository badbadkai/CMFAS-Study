import { Routes, Route, Navigate } from 'react-router-dom'
import ModuleSelect from './screens/ModuleSelect'
import ModeSelect from './screens/ModeSelect'
import ChapterSelect from './screens/ChapterSelect'
import Study from './screens/Study'
import Quiz from './screens/Quiz'
import MockSelect from './screens/MockSelect'
import MockExam from './screens/MockExam'

export default function App() {
  return (
    <div className="mx-auto flex min-h-dvh max-w-md flex-col overflow-x-hidden safe-top safe-bottom">
      <Routes>
        <Route path="/" element={<ModuleSelect />} />
        <Route path="/m/:moduleId" element={<ModeSelect />} />
        <Route path="/m/:moduleId/study" element={<ChapterSelect />} />
        <Route path="/m/:moduleId/study/:chapterId" element={<Study />} />
        <Route path="/m/:moduleId/quiz" element={<Quiz />} />
        <Route path="/m/:moduleId/mock" element={<MockSelect />} />
        <Route path="/m/:moduleId/mock/:paper" element={<MockExam />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  )
}
