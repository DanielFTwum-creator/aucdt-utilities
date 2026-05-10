import { BrowserRouter, Routes, Route } from 'react-router-dom'
import ThesisAILanding from './components/ThesisAILanding'
import ProctoringDashboard from './components/proctoring/ProctoringDashboard'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ThesisAILanding />} />
        <Route path="/proctoring" element={<ProctoringDashboard />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
