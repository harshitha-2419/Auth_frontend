import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import api from '../api';

export default function VerifyOtp() {
  const navigate = useNavigate();
  const location = useLocation();
  const { email, type } = (location.state as any) || {};

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [countdown, setCountdown] = useState(60);
  const refs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (countdown <= 0) return;
    const t = setTimeout(() => setCountdown(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown]);

  const handleChange = (i: number, val: string) => {
    if (!/^\d?$/.test(val)) return;
    const next = [...otp]; next[i] = val; setOtp(next);
    if (val && i < 5) refs.current[i + 1]?.focus();
  };

  const handleKeyDown = (i: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[i] && i > 0) refs.current[i - 1]?.focus();
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const digits = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6).split('');
    if (digits.length === 6) { setOtp(digits); refs.current[5]?.focus(); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = otp.join('');
    if (code.length < 6) return setError('Please enter all 6 digits');
    setError(''); setLoading(true);
    try {
      const endpoint = type === 'login-otp' ? '/auth/login-otp/verify' : '/auth/verify-otp';
      const res = await api.post(endpoint, { email, otp: code });
      if (type === 'login-otp') {
        localStorage.setItem('accessToken', res.data.accessToken);
        localStorage.setItem('refreshToken', res.data.refreshToken);
        navigate('/dashboard');
      } else {
        setSuccess('Email verified! Redirecting to login...');
        setTimeout(() => navigate('/login'), 1500);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResending(true); setError(''); setSuccess('');
    try {
      await api.post('/auth/resend-otp', { email });
      setSuccess('OTP resent to your email!');
      setCountdown(60);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to resend OTP');
    } finally {
      setResending(false);
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
          <h1>One Step Away<br /><em>From Your Portal</em></h1>
          <p>Enter the 6-digit code we sent to your email to verify your identity and access your account.</p>
        </div>

        <div className="lp-features">
          <div className="lp-feature">
            <div className="lp-feature-dot" />
            <span>OTP sent instantly to your registered email address</span>
          </div>
          <div className="lp-feature">
            <div className="lp-feature-dot" />
            <span>Code expires in 5 minutes for your security</span>
          </div>
          <div className="lp-feature">
            <div className="lp-feature-dot" />
            <span>Paste support — copy & paste your OTP directly</span>
          </div>
          <div className="lp-feature">
            <div className="lp-feature-dot" />
            <span>Didn't receive it? Resend after 60 seconds</span>
          </div>
        </div>
      </div>

      {/* ── RIGHT PANEL ── */}
      <div className="lp-right">
        <div className="lp-glass-card">

          <div className="otp-icon-wrap">
            <div className="otp-icon">✉️</div>
          </div>

          <div className="lp-form-header" style={{ textAlign: 'center' }}>
            <h2>Enter OTP</h2>
            <p>Code sent to <span className="otp-email-highlight">{email || 'your email'}</span></p>
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
            <div className="otp-group" onPaste={handlePaste}>
              {otp.map((d, i) => (
                <input
                  key={i} maxLength={1} value={d}
                  className={d ? 'filled' : ''}
                  ref={el => { refs.current[i] = el; }}
                  onChange={e => handleChange(i, e.target.value)}
                  onKeyDown={e => handleKeyDown(i, e)}
                />
              ))}
            </div>

            <button className="btn btn-primary btn-block" type="submit" disabled={loading}>
              {loading ? <span className="spinner" /> : 'Verify & Continue'}
            </button>
          </form>

          <div className="otp-resend-row">
            {countdown > 0
              ? <span>Resend code in <strong className="otp-countdown">{countdown}s</strong></span>
              : (
                <button className="otp-resend-btn" onClick={handleResend} disabled={resending}>
                  {resending ? 'Resending...' : '↺ Resend OTP'}
                </button>
              )
            }
          </div>

          <div className="auth-footer">
            <Link to="/login">← Back to Login</Link>
          </div>
        </div>
      </div>

    </div>
  );
}
