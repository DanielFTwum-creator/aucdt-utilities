import Badge from './Badge'
import CopyButton from './CopyButton'
import DoneButton from './DoneButton'
import DirectiveCode from './DirectiveCode'

export default function PhaseCard({ phase, isDone, onToggleDone, onCopy, copied }) {
  return (
    <div style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden' }}>
      <div style={{ padding:'22px 28px 18px', background:'#11112a',
        borderBottom:'1px solid #1e1e3a' }}>
        <div style={{ display:'flex', alignItems:'flex-start', gap:16 }}>
          <div style={{ width:52, height:52, borderRadius:14, flexShrink:0,
            background:phase.gradient, display:'flex', alignItems:'center',
            justifyContent:'center', fontSize:24,
            boxShadow:'0 8px 24px '+phase.color+'44' }}>
            {phase.icon}
          </div>
          <div style={{ flex:1 }}>
            <div style={{ display:'flex', gap:8, marginBottom:4 }}>
              <Badge label={phase.label} color={phase.color}/>
              <Badge label={phase.tag} color={phase.color}/>
            </div>
            <div style={{ fontSize:20, fontWeight:800, color:'#f1f5f9', marginBottom:2 }}>
              {phase.title}
            </div>
            <div style={{ fontSize:13, color:'#64748b' }}>{phase.subtitle}</div>
          </div>
          <div style={{ display:'flex', gap:8 }}>
            <DoneButton isDone={isDone} onToggle={onToggleDone}/>
            <CopyButton onCopy={onCopy} copied={copied}
              color={phase.color} gradient={phase.gradient}/>
          </div>
        </div>
      </div>
      <div style={{ flex:1, overflowY:'auto', padding:'22px 28px' }}>
        <DirectiveCode content={phase.content} color={phase.color}/>
      </div>
    </div>
  )
}
