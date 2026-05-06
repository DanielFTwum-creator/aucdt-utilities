export default function CopyButton({ onCopy, copied, color, gradient }) {
  return (
    <button onClick={onCopy} style={{ display:'flex', alignItems:'center', gap:8,
      padding:'10px 22px', borderRadius:10, border:'none',
      background:copied ? 'linear-gradient(135deg,#34d399,#059669)' : gradient,
      color:'#fff', cursor:'pointer', fontWeight:700, fontSize:14,
      transition:'all 0.25s' }}>
      <span>{copied ? '✓' : '📋'}</span>
      {copied ? 'Copied!' : 'Copy Directive'}
    </button>
  )
}
