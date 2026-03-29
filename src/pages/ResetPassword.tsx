import { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import api from '../api';

function getStrength(p: string) {
  let s = 0;
  if (p.length >= 8) s++;
  if (/[A-Z]/.test(p) && /[a-z]/.test(p)) s++;
  if (/[0-9]/.test(p)) s++;
  if (/[@$!%*?&]/.test(p)) s++;
  return s;
}
const strengthLabels = ['', 'Weak', 'Fair', 'Good', 'Strong'];
const PW_HINT = 'Min 8 chars, uppercase, lowercase, number & special char';

const EyeIcon = () => <svg viewBox="0 0 20 20" fill="currentColor"><path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/><path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"/></svg>;
const EyeOffIcon = () => <svg viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd"/><path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z"/></svg>;
const LockIcon = () => <svg viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"/></svg>;

export default function ResetPassword() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const token = params.get('token') || '';

  const [form, setForm] = useState({ password: '', confirm: '' });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const strength = getStrength(form.password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirm) return setError('Passwords do not match');
    setError(''); setLoading(true);
    try {
      await api.post('/auth/reset-password', { token, newPassword: form.password });
      setSuccess(true);
      setTimeout(() => navigate('/login'), 2000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Reset failed. Link may have expired.');
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
          <h1>Set a Strong<br /><em>New Password</em></h1>
          <p>Almost there! Choose a strong password to keep your student account safe and secure.</p>
        </div>

        <div className="lp-features">
          <div className="lp-feature">
            <div className="lp-feature-dot" />
            <span>Minimum 8 characters with mixed case letters</span>
          </div>
          <div className="lp-feature">
            <div className="lp-feature-dot" />
            <span>Include at least one number and special character</span>
          </div>
          <div className="lp-feature">
            <div className="lp-feature-dot" />
            <span>Password is bcrypt hashed with 12 salt rounds</span>
          </div>
          <div className="lp-feature">
            <div className="lp-feature-dot" />
            <span>Reset token is one-time use and expires immediately after</span>
          </div>
        </div>
      </div>

      {/* ── RIGHT PANEL ── */}
      <div className="lp-right">
        <div className="lp-glass-card">

          <div className="otp-icon-wrap">
            <div className="otp-icon">🛡️</div>
          </div>

          <div className="lp-form-header" style={{ textAlign: 'center' }}>
            <h2>Reset Password</h2>
            <p>Enter and confirm your new password</p>
          </div>

          {error && (
            <div className="alert alert-error">
              <svg viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg>
              {error}
            </div>
          )}

          {success ? (
            <div className="fp-success-card">
              <div className="fp-success-icon">✅</div>
              <div className="fp-success-title">Password reset!</div>
              <div className="fp-success-desc">Your password has been updated successfully. Redirecting to login...</div>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>New Password</label>
                <div className="input-wrap">
                  <span className="input-icon"><LockIcon /></span>
                  <input
                    type={showPw ? 'text' : 'password'}
                    placeholder="Min. 8 characters" required
                    value={form.password}
                    onChange={e => setForm({ ...form, password: e.target.value })}
                  />
                  <button type="button" className="eye-btn" onClick={() => setShowPw(!showPw)}>
                    {showPw ? <EyeOffIcon /> : <EyeIcon />}
                  </button>
                </div>
                {form.password && (
                  <>
                    <div className={`strength-bar s${strength}`}><span /><span /><span /><span /></div>
                    <div className="strength-label">
                      {strength < 4 ? `${strengthLabels[strength]} — ${PW_HINT}` : 'Strong password ✓'}
                    </div>
                  </>
                )}
              </div>

              <div className="form-group">
                <label>Confirm Password</label>
                <div className="input-wrap">
                  <span className="input-icon"><LockIcon /></span>
                  <input
                    type={showPw ? 'text' : 'password'}
                    placeholder="Repeat your password" required
                    value={form.confirm}
                    onChange={e => setForm({ ...form, confirm: e.target.value })}
                  />
                </div>
              </div>

              <button className="btn btn-primary btn-block" type="submit" disabled={loading}>
                {loading ? <span className="spinner" /> : 'Reset Password'}
              </button>
            </form>
          )}

          <div className="auth-footer">
            <Link to="/login">← Back to Login</Link>
          </div>
        </div>
      </div>

    </div>
  );
}
