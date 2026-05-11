export default function ProgressBar({ total, done }) {
  const pct = total === 0 ? 0 : Math.round((done/total)*100)
  return (
    <div style={{ display:'flex', alignItems:'center', gap:10 }}>
      <div style={{ flex:1, height:5, borderRadius:10, background:'#1e1e3a', overflow:'hidden' }}>
        <div style={{ height:'100%', borderRadius:10,
          background:'linear-gradient(90deg,#a78bfa,#34d399)',
          width:pct+'%', transition:'width 0.5s ease' }}/>
      </div>
      <span style={{ fontSize:11, color:'#94a3b8', minWidth:32 }}>{pct}%</span>
    </div>
  )
}
