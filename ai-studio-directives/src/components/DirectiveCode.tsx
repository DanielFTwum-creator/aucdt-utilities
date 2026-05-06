export default function DirectiveCode({ content, color }) {
  const lines = content.split('\n')
  return (
    <div style={{ background:'#08081a', borderRadius:12,
      border:'1px solid '+color+'22', overflow:'hidden' }}>
      <div style={{ display:'flex', alignItems:'center', gap:6,
        padding:'10px 16px', background:'#0e0e22',
        borderBottom:'1px solid '+color+'18' }}>
        {['#ff5f57','#febc2e','#28c840'].map((c,i) =>
          <div key={i} style={{ width:10, height:10, borderRadius:'50%', background:c }}/>
        )}
        <span style={{ fontSize:11, color:'#475569', marginLeft:6, fontFamily:'monospace' }}>
          directive.txt — {lines.length} lines
        </span>
      </div>
      <pre style={{ margin:0, padding:'20px 22px', fontSize:13, lineHeight:1.75,
        color:'#cbd5e1', whiteSpace:'pre-wrap', wordBreak:'break-word',
        fontFamily:"'Cascadia Code','Fira Code',monospace",
        maxHeight:'calc(100vh - 340px)', overflowY:'auto' }}>
        {lines.map((line,i) => {
          const ok  = line.trimStart().startsWith('✅')
          const box = line.trimStart().startsWith('☐')
          const hdr = !ok && !box && line === line.toUpperCase() && line.trim().length > 4
          return (
            <span key={i} style={{ display:'block',
              color:ok ? '#34d399' : box ? '#94a3b8' : hdr ? color : '#cbd5e1',
              fontWeight:hdr ? 700 : 400 }}>
              {line || '\u00A0'}
            </span>
          )
        })}
      </pre>
    </div>
  )
}
