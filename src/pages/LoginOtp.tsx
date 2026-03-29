import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';

export default function LoginOtp() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      await api.post('/auth/login-otp', { email });
      setSuccess('OTP sent! Redirecting...');
      setTimeout(() => navigate('/verify-otp', { state: { email, type: 'login-otp' } }), 1000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="lp-shell">

      {/* ── LEFT PANEL ── */}
      <div className="lp-left">
        <div className="lp-left-glow" />
        <div className="lp-left-glow2" />

        <div className="lp-brand">
          <div className="lp-brand-icon">L</div>
          <div className="lp-brand-name">LMS<span>Portal</span></div>
        </div>

        <div className="lp-headline">
          <h1>Passwordless<br /><em>Secure Login</em></h1>
          <p>No password needed. Enter your email and we'll send a one-time code straight to your inbox.</p>
        </div>

        <div className="lp-features">
          <div className="lp-feature">
            <div className="lp-feature-dot" />
            <span>No password required — just your email address</span>
          </div>
          <div className="lp-feature">
            <div className="lp-feature-dot" />
            <span>One-time code expires in 5 minutes for maximum security</span>
          </div>
          <div className="lp-feature">
            <div className="lp-feature-dot" />
            <span>Works on any device, any browser, anywhere</span>
          </div>
          <div className="lp-feature">
            <div className="lp-feature-dot" />
            <span>Prefer a password? Switch to standard login anytime</span>
          </div>
        </div>
      </div>

      {/* ── RIGHT PANEL ── */}
      <div className="lp-right">
        <div className="lp-glass-card">

          <div className="otp-icon-wrap">
            <div className="otp-icon">🔑</div>
          </div>

          <div className="lp-form-header" style={{ textAlign: 'center' }}>
            <h2>Login with OTP</h2>
            <p>We'll send a 6-digit code to your email</p>
          </div>

          {error && (
            <div className="alert alert-error">
              <svg viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg>
              {error}
            </div>
          )}
          {success && (
            <div className="alert alert-success">
              <svg viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Email Address</label>
              <div className="input-wrap">
                <span className="input-icon">
                  <svg viewBox="0 0 20 20" fill="currentColor"><path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/><path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/></svg>
                </span>
                <input
                  type="email" placeholder="you@example.com" required
                  value={email} onChange={e => setEmail(e.target.value)}
                />
              </div>
            </div>

            <button className="btn btn-primary btn-block" type="submit" disabled={loading}>
              {loading ? <span className="spinner" /> : 'Send OTP'}
            </button>
          </form>

          <div className="divider">or</div>

          <Link to="/login" style={{ display: 'block' }}>
            <button className="btn btn-outline btn-block" type="button">
              Login with Password
            </button>
          </Link>

          <div className="auth-footer">
            Don't have an account? <Link to="/register">Create one</Link>
          </div>
        </div>
      </div>

    </div>
  );
}
