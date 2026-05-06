export default function PhaseDots({ phases, active, completed, onSelect }) {
  return (
    <div style={{ display:'flex', gap:6, alignItems:'center' }}>
      {phases.map((p,i) => (
        <div key={p.id} onClick={() => onSelect(i)} style={{
          width:i===active ? 28 : 8, height:8, borderRadius:4,
          background:completed[p.id] ? '#34d399' : i===active ? p.color : '#1e1e3a',
          cursor:'pointer', transition:'all 0.3s ease',
          boxShadow:i===active ? '0 0 10px '+p.color+'88' : 'none' }}/>
      ))}
    </div>
  )
}
