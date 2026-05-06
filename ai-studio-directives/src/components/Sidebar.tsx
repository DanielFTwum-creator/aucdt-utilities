import SidebarItem from './SidebarItem'
export default function Sidebar({ phases, active, completed, onSelect }) {
  return (
    <aside style={{ width:220, background:'#0d0d22', borderRight:'1px solid #1e1e3a',
      overflowY:'auto', padding:'14px 10px', display:'flex',
      flexDirection:'column', gap:3, flexShrink:0 }}>
      <div style={{ fontSize:10, fontWeight:700, color:'#334155',
        letterSpacing:1.2, padding:'4px 8px 8px', textTransform:'uppercase' }}>
        Workflow Phases
      </div>
      {phases.map((p,i) =>
        <SidebarItem key={p.id} phase={p} isActive={active===i}
          isDone={!!completed[p.id]} onClick={() => onSelect(i)}/>
      )}
    </aside>
  )
}
