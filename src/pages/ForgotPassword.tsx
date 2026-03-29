import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      await api.post('/auth/forgot-password', { email });
      setSent(true);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to send reset email');
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
          <h1>Recover Your<br /><em>Account Access</em></h1>
          <p>No worries — it happens to everyone. Enter your email and we'll send a secure reset link straight to your inbox.</p>
        </div>

        <div className="lp-features">
          <div className="lp-feature">
            <div className="lp-feature-dot" />
            <span>Reset link sent directly to your registered email</span>
          </div>
          <div className="lp-feature">
            <div className="lp-feature-dot" />
            <span>Link expires in 15 minutes for your security</span>
          </div>
          <div className="lp-feature">
            <div className="lp-feature-dot" />
            <span>SHA-256 hashed token — one-time use only</span>
          </div>
          <div className="lp-feature">
            <div className="lp-feature-dot" />
            <span>Back to learning in under 2 minutes</span>
          </div>
        </div>
      </div>

      {/* ── RIGHT PANEL ── */}
      <div className="lp-right">
        <div className="lp-glass-card">

          <div className="otp-icon-wrap">
            <div className="otp-icon">🔒</div>
          </div>

          <div className="lp-form-header" style={{ textAlign: 'center' }}>
            <h2>Forgot Password?</h2>
            <p>Enter your registered email address</p>
          </div>

          {error && (
            <div className="alert alert-error">
              <svg viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg>
              {error}
            </div>
          )}

          {sent ? (
            <div className="fp-success-card">
              <div className="fp-success-icon">✅</div>
              <div className="fp-success-title">Reset email sent!</div>
              <div className="fp-success-desc">
                Check your inbox at <strong>{email}</strong>.<br />The link expires in 15 minutes.
              </div>
              <Link to="/login">
                <button className="btn btn-primary btn-block" style={{ marginTop: '1.25rem' }}>
                  Back to Login
                </button>
              </Link>
            </div>
          ) : (
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
                {loading ? <span className="spinner" /> : 'Send Reset Link'}
              </button>
            </form>
          )}

          {!sent && (
            <div className="auth-footer">
              <Link to="/login">← Back to Login</Link>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
