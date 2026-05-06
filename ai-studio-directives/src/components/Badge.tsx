export default function Badge({ label, color }) {
  return (
    <span style={{ fontSize:10, fontWeight:700, letterSpacing:1, textTransform:'uppercase',
      padding:'2px 8px', borderRadius:20, background:color+'22', color,
      border:'1px solid '+color+'44' }}>
      {label}
    </span>
  )
}
