import { EnhancedDashboard } from './components/EnhancedDashboard'
import { ThemeProvider } from './context/ThemeContext'
import './App.css'

function App() {
  return (
    <ThemeProvider>
      <EnhancedDashboard />
    </ThemeProvider>
  )
}

export default App
