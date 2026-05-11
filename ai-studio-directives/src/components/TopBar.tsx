import ProgressBar from './ProgressBar'
export default function TopBar({ doneCount, total }) {
  return (
    <header style={{ background:'#0e0e24', borderBottom:'1px solid #1e1e3a',
      padding:'13px 24px', display:'flex', alignItems:'center', gap:14, flexShrink:0 }}>
      <div style={{ width:36, height:36, borderRadius:10,
        background:'linear-gradient(135deg,#a78bfa,#6d28d9)',
        display:'flex', alignItems:'center', justifyContent:'center', fontSize:18 }}>🤖</div>
      <div>
        <div style={{ fontWeight:800, fontSize:15 }}>AI Studio Directive Workflow</div>
        <div style={{ fontSize:11, color:'#64748b' }}>Copy → Paste → Confirm → Advance</div>
      </div>
      <div style={{ marginLeft:'auto', minWidth:180 }}>
        <div style={{ fontSize:11, color:'#64748b', marginBottom:5, textAlign:'right' }}>
          {doneCount} / {total} phases completed
        </div>
        <ProgressBar total={total} done={doneCount}/>
      </div>
    </header>
  )
}
