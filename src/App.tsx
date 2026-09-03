import { Routes, Route, Navigate } from 'react-router-dom'
import ModuleSelect from './screens/ModuleSelect'
import ModeSelect from './screens/ModeSelect'
import ChapterSelect from './screens/ChapterSelect'
import Study from './screens/Study'
import Quiz from './screens/Quiz'
import MockSelect from './screens/MockSelect'
import MockExam from './screens/MockExam'
import MockHistory from './screens/MockHistory'
import CompHome from './screens/comp/CompHome'
import CompTopics from './screens/comp/CompTopics'
import CompLearn from './screens/comp/CompLearn'
import CompFormulas from './screens/comp/CompFormulas'
import CompDrill from './screens/comp/CompDrill'

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
        <Route path="/m/:moduleId/mock/history" element={<MockHistory />} />
        <Route path="/m/:moduleId/mock/:paper" element={<MockExam />} />
        <Route path="/m/:moduleId/comp" element={<CompHome />} />
        <Route path="/m/:moduleId/comp/learn" element={<CompTopics />} />
        <Route path="/m/:moduleId/comp/learn/:topicId" element={<CompLearn />} />
        <Route path="/m/:moduleId/comp/formulas" element={<CompFormulas />} />
        <Route path="/m/:moduleId/comp/drill" element={<CompDrill />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  )
}
