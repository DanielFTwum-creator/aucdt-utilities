import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { TUC_LOGO } from '../logo_b64';
import toast from 'react-hot-toast';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      toast.success('Welcome back!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed. Check credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-logo-container">
          <img src={TUC_LOGO} alt="TUC Logo" className="login-logo" />
          <div className="login-school-name">Techbridge University College</div>
          <div className="login-system-name">Results Management System</div>
        </div>
        <div className="login-divider" />

        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 19, fontWeight: 800, color: 'var(--tuc-maroon)' }}>Sign In</div>
          <div style={{ fontSize: 12.5, color: 'var(--tuc-muted)', marginTop: 3 }}>Enter your staff credentials to continue</div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input className="form-control" type="email" placeholder="staff@tuc.edu.gh" value={email}
              onChange={e => setEmail(e.target.value)} required />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <div style={{ position: 'relative' }}>
              <input className="form-control" type={showPass ? 'text' : 'password'} placeholder="Password"
                value={password} onChange={e => setPassword(e.target.value)} required style={{ paddingRight: 40 }} />
              <button type="button" onClick={() => setShowPass(!showPass)}
                style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--tuc-muted)', fontSize: 12 }}>
                {showPass ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>

          <button className="btn btn-primary" type="submit" disabled={loading}
            style={{ width: '100%', justifyContent: 'center', padding: '11px', fontSize: 14, marginTop: 8 }}>
            {loading ? <><div className="spinner" style={{ width: 18, height: 18, borderWidth: 2, borderTopColor: 'white' }} /> Signing in...</> : 'Sign In'}
          </button>
        </form>

        <div style={{ marginTop: 20, padding: '12px 14px', background: 'rgba(107,0,32,0.04)', borderRadius: 8, border: '1px solid rgba(107,0,32,0.1)' }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--tuc-maroon)', marginBottom: 6 }}>DEMO CREDENTIALS</div>
          <div style={{ fontSize: 11, color: 'var(--tuc-muted)', lineHeight: 1.8 }}>
            <strong>Registrar:</strong> registrar@tuc.edu.gh<br />
            <strong>QA Officer:</strong> qa@tuc.edu.gh<br />
            <strong>Lecturer:</strong> buchag@tuc.edu.gh<br />
            <span style={{ opacity: 0.7 }}>Password: password</span>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: 16, fontSize: 11, color: '#bbb' }}>
          © {new Date().getFullYear()} Techbridge University College · Design and Build a Nation
        </div>
      </div>
    </div>
  );
}
