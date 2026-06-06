import React from 'react';
import { TUC_DOMAIN } from '../brand';

/**
 * Email entry for TUC accounts: the user types only the username; the fixed
 * @techbridge.edu.gh domain is shown as a non-editable suffix (FR-AUTH-009).
 * `value`/`onChange` carry the USERNAME part only; callers append the domain via
 * toTucEmail() at submit. Pasting a full ...@techbridge.edu.gh address strips the domain.
 */
export default function UsernameInput({ value, onChange, placeholder = 'username', autoFocus, style }: {
  value: string;
  onChange: (username: string) => void;
  placeholder?: string;
  autoFocus?: boolean;
  style?: React.CSSProperties;
}) {
  const handle = (raw: string) => {
    let v = raw;
    // If they paste/type the domain, drop it (and anything after @).
    const at = v.indexOf('@');
    if (at >= 0) v = v.slice(0, at);
    onChange(v.trim());
  };
  return (
    <div style={{ ...wrap, ...style }}>
      <input value={value} onChange={(e) => handle(e.target.value)} placeholder={placeholder}
        autoFocus={autoFocus} spellCheck={false} autoCapitalize="none" style={input} />
      <span style={suffix}>{TUC_DOMAIN}</span>
    </div>
  );
}

const wrap: React.CSSProperties = {
  display: 'flex', alignItems: 'stretch', border: '1px solid var(--border)',
  borderRadius: 8, overflow: 'hidden', background: 'var(--card)',
};
const input: React.CSSProperties = {
  flex: 1, minWidth: 0, padding: '9px 12px', border: 'none', outline: 'none',
  fontSize: 14, fontFamily: 'inherit', color: 'var(--text)', background: 'transparent',
};
const suffix: React.CSSProperties = {
  display: 'flex', alignItems: 'center', padding: '0 12px', fontSize: 13,
  color: 'var(--muted)', background: 'var(--bg)', borderLeft: '1px solid var(--border)', whiteSpace: 'nowrap',
};
