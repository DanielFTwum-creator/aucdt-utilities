export default function SidebarItem({ phase, isActive, isDone, onClick }) {
  return (
    <button onClick={onClick} style={{ display:'flex', alignItems:'center', gap:10,
      padding:'10px 14px', borderRadius:10, border:'none', cursor:'pointer',
      textAlign:'left', width:'100%',
      background:isActive ? phase.color+'18' : 'transparent',
      outline:isActive ? '1px solid '+phase.color+'44' : '1px solid transparent',
      transition:'all 0.18s' }}>
      <div style={{ width:36, height:36, borderRadius:10, flexShrink:0,
        background:isActive ? phase.gradient : '#1a1a30',
        display:'flex', alignItems:'center', justifyContent:'center', fontSize:16,
        boxShadow:isActive ? '0 4px 14px '+phase.color+'44' : 'none' }}>
        {phase.icon}
      </div>
      <div style={{ flex:1, minWidth:0 }}>
        <div style={{ fontSize:10, fontWeight:700,
          color:isActive ? phase.color : '#475569',
          letterSpacing:0.8, marginBottom:1 }}>{phase.label}</div>
        <div style={{ fontSize:12, fontWeight:500,
          color:isActive ? '#e2e8f0' : '#64748b',
          whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>
          {phase.title}
        </div>
      </div>
      {isDone && <span style={{ fontSize:14 }}>✅</span>}
    </button>
  )
}
