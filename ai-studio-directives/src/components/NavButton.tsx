export default function NavButton({ label, onClick, disabled, direction }) {
  return (
    <button onClick={onClick} disabled={disabled} style={{ padding:'9px 20px',
      borderRadius:10, border:'1px solid #2d2d4e', background:'transparent',
      color:disabled ? '#334155' : '#94a3b8',
      cursor:disabled ? 'not-allowed' : 'pointer',
      fontSize:13, fontWeight:600 }}>
      {direction === 'prev' ? '← '+label : label+' →'}
    </button>
  )
}
