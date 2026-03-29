import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      const res = await api.post('/auth/login', form);
      localStorage.setItem('accessToken', res.data.accessToken);
      localStorage.setItem('refreshToken', res.data.refreshToken);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
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
          <h1>Your Gateway to<br /><em>Professional Growth</em></h1>
          <p>Join 2,847 students already learning, interning, and building their careers on LMS Portal.</p>
        </div>

        <div className="lp-stats">
          <div className="lp-stat-card">
            <div className="lp-stat-num">2,847</div>
            <div className="lp-stat-lbl">Active Students</div>
          </div>
          <div className="lp-stat-card">
            <div className="lp-stat-num">120+</div>
            <div className="lp-stat-lbl">Courses</div>
          </div>
          <div className="lp-stat-card">
            <div className="lp-stat-num">384</div>
            <div className="lp-stat-lbl">Internships</div>
          </div>
          <div className="lp-stat-card">
            <div className="lp-stat-num">68%</div>
            <div className="lp-stat-lbl">Completion Rate</div>
          </div>
        </div>

        <div className="lp-features">
          <div className="lp-feature">
            <div className="lp-feature-icon">🎓</div>
            <div>
              <div className="lp-feature-title">Learn at your own pace</div>
              <div className="lp-feature-desc">120+ courses across Data Science, Web Dev, ML & more</div>
            </div>
          </div>
          <div className="lp-feature">
            <div className="lp-feature-icon">💼</div>
            <div>
              <div className="lp-feature-title">Real internship opportunities</div>
              <div className="lp-feature-desc">384 openings updated daily from top companies</div>
            </div>
          </div>
          <div className="lp-feature">
            <div className="lp-feature-icon">🛡️</div>
            <div>
              <div className="lp-feature-title">Enterprise-grade security</div>
              <div className="lp-feature-desc">JWT auth, session management & login history</div>
            </div>
          </div>
        </div>
      </div>

      {/* ── RIGHT PANEL ── */}
      <div className="lp-right">
        <div className="lp-glass-card">

          <div className="lp-form-header">
            <h2>Welcome back</h2>
            <p>Sign in to your student portal</p>
          </div>

          {error && (
            <div className="alert alert-error">
              <svg viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg>
              {error}
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
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                />
              </div>
            </div>

            <div className="form-group">
              <label>
                Password
                <Link to="/forgot-password">Forgot password?</Link>
              </label>
              <div className="input-wrap">
                <span className="input-icon">
                  <svg viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"/></svg>
                </span>
                <input
                  type={showPw ? 'text' : 'password'}
                  placeholder="Your password" required
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                />
                <button type="button" className="eye-btn" onClick={() => setShowPw(!showPw)}>
                  {showPw
                    ? <svg viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd"/><path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z"/></svg>
                    : <svg viewBox="0 0 20 20" fill="currentColor"><path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/><path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"/></svg>
                  }
                </button>
              </div>
            </div>

            <button className="btn btn-primary btn-block" type="submit" disabled={loading}>
              {loading ? <span className="spinner" /> : 'Sign In to Portal'}
            </button>
          </form>

          <div className="divider">or continue with</div>

          <Link to="/login-otp" style={{ display: 'block' }}>
            <button className="btn btn-outline btn-block" type="button">
              🔑 Login with OTP
            </button>
          </Link>

          <div className="auth-footer">
            New student? <Link to="/register">Create your account</Link>
          </div>
        </div>
      </div>

    </div>
  );
}
