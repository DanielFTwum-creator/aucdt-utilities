export default function DoneButton({ isDone, onToggle }) {
  return (
    <button onClick={onToggle} style={{ display:'flex', alignItems:'center', gap:6,
      padding:'10px 18px', borderRadius:10,
      border:'1px solid '+(isDone ? '#34d399' : '#2d2d4e'),
      background:isDone ? '#34d39918' : 'transparent',
      color:isDone ? '#34d399' : '#64748b',
      cursor:'pointer', fontWeight:600, fontSize:13, transition:'all 0.2s' }}>
      {isDone ? '✅ Completed' : '⬜ Mark Done'}
    </button>
  )
}
