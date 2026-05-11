import { useState, useCallback } from 'react'
import { PHASES } from './data/phases'
import TopBar from './components/TopBar'
import Sidebar from './components/Sidebar'
import PhaseCard from './components/PhaseCard'
import PhaseDots from './components/PhaseDots'
import NavButton from './components/NavButton'

export default function App() {
  const [active, setActive]       = useState(0)
  const [copied, setCopied]       = useState(false)
  const [completed, setCompleted] = useState({})
  const current  = PHASES[active]
  const doneCount = Object.values(completed).filter(Boolean).length

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(current.content).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2200)
    })
  }, [current.content])

  const handleToggleDone = useCallback(() => {
    setCompleted(p => ({ ...p, [current.id]: !p[current.id] }))
  }, [current.id])

  return (
    <div style={{ fontFamily:"'Segoe UI',system-ui,sans-serif", background:'#0b0b1a',
      height:'100vh', color:'#e2e8f0', display:'flex', flexDirection:'column',
      overflow:'hidden' }}>
      <TopBar doneCount={doneCount} total={PHASES.length}/>
      <div style={{ display:'flex', flex:1, overflow:'hidden' }}>
        <Sidebar phases={PHASES} active={active} completed={completed} onSelect={setActive}/>
        <main style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden' }}>
          <PhaseCard phase={current} isDone={!!completed[current.id]}
            onToggleDone={handleToggleDone} onCopy={handleCopy} copied={copied}/>
          <footer style={{ padding:'12px 28px', borderTop:'1px solid #1e1e3a',
            background:'#0e0e24', display:'flex', alignItems:'center',
            justifyContent:'space-between', flexShrink:0 }}>
            <NavButton label="Previous" direction="prev"
              onClick={() => setActive(a => Math.max(0,a-1))} disabled={active===0}/>
            <PhaseDots phases={PHASES} active={active} completed={completed} onSelect={setActive}/>
            <NavButton label="Next" direction="next"
              onClick={() => setActive(a => Math.min(PHASES.length-1,a+1))}
              disabled={active===PHASES.length-1}/>
          </footer>
        </main>
      </div>
    </div>
  )
}
