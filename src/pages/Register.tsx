import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
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

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const strength = getStrength(form.password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      const pwRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
      if (!pwRegex.test(form.password)) {
        setLoading(false);
        return setError('Password must be 8+ chars with uppercase, lowercase, number & special char (@$!%*?&)');
      }
      await api.post('/auth/register', form);
      navigate('/verify-otp', { state: { email: form.email, type: 'register' } });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="lp-shell">

      {/* ── LEFT PANEL ── */}
      <div className="lp-left rp-left">
        <div className="lp-left-glow" />
        <div className="lp-left-glow2" />

        {/* Brand */}
        <div className="lp-brand">
          <div className="lp-brand-icon">L</div>
          <div className="lp-brand-name">LMS<span>Portal</span></div>
        </div>

        {/* Headline */}
        <div className="lp-headline">
          <h1>Start Your<br /><em>Learning Journey</em></h1>
          <p>Join 2,847 students already learning, interning and building real careers.</p>
        </div>

        {/* LMS Visual Card */}
        <div className="rp-visual">

          {/* Course progress rows */}
          <div className="rp-visual-header">
            <span className="rp-visual-title">📚 My Courses</span>
            <span className="rp-visual-sub">3 active</span>
          </div>

          <div className="rp-course-row">
            <div className="rp-course-thumb" style={{ background: 'linear-gradient(135deg,#1e3a5f,#3b82f6)' }}>🐍</div>
            <div className="rp-course-info">
              <div className="rp-course-name">Python for Data Science</div>
              <div className="rp-course-prog-wrap">
                <div className="rp-course-prog-track">
                  <div className="rp-course-prog-fill" style={{ width: '62%', background: 'var(--primary)' }} />
                </div>
                <span>62%</span>
              </div>
            </div>
          </div>

          <div className="rp-course-row">
            <div className="rp-course-thumb" style={{ background: 'linear-gradient(135deg,#1a2744,#a855f7)' }}>🤖</div>
            <div className="rp-course-info">
              <div className="rp-course-name">Machine Learning Fundamentals</div>
              <div className="rp-course-prog-wrap">
                <div className="rp-course-prog-track">
                  <div className="rp-course-prog-fill" style={{ width: '28%', background: 'var(--violet)' }} />
                </div>
                <span>28%</span>
              </div>
            </div>
          </div>

          <div className="rp-course-row">
            <div className="rp-course-thumb" style={{ background: 'linear-gradient(135deg,#0d2136,#0ea5e9)' }}>🌐</div>
            <div className="rp-course-info">
              <div className="rp-course-name">Web Development Bootcamp</div>
              <div className="rp-course-prog-wrap">
                <div className="rp-course-prog-track">
                  <div className="rp-course-prog-fill" style={{ width: '88%', background: 'var(--green)' }} />
                </div>
                <span>88%</span>
              </div>
            </div>
          </div>

          <div className="rp-visual-divider" />

          {/* Internship strip */}
          <div className="rp-intern-strip">
            <div className="rp-intern-item">
              <span className="rp-intern-emoji">🏢</span>
              <div>
                <div className="rp-intern-role">ML Engineer Intern</div>
                <div className="rp-intern-company">TechCorp · ₹25k/mo</div>
              </div>
              <span className="badge badge-green" style={{ marginLeft: 'auto' }}>Open</span>
            </div>
            <div className="rp-intern-item">
              <span className="rp-intern-emoji">💡</span>
              <div>
                <div className="rp-intern-role">Frontend Developer Intern</div>
                <div className="rp-intern-company">InnoTech · ₹20k/mo</div>
              </div>
              <span className="badge badge-green" style={{ marginLeft: 'auto' }}>Open</span>
            </div>
          </div>

          <div className="rp-visual-divider" />

          {/* Student avatars */}
          <div className="rp-avatars-row">
            <div className="rp-avatars">
              {['PK','RM','SA','VN','KR'].map((i, idx) => (
                <div key={idx} className={`rp-av rp-av-${idx}`}>{i}</div>
              ))}
            </div>
            <span className="rp-avatars-label">2,847 students joined</span>
          </div>

        </div>
      </div>

      {/* ── RIGHT PANEL ── */}
      <div className="lp-right">
        <div className="lp-glass-card">

          <div className="lp-form-header">
            <h2>Create Account</h2>
            <p>Fill in your details to get started</p>
          </div>

          {error && (
            <div className="alert alert-error">
              <svg viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="rp-row">
              <div className="form-group">
                <label>Full Name</label>
                <div className="input-wrap">
                  <span className="input-icon">
                    <svg viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"/></svg>
                  </span>
                  <input type="text" placeholder="John Doe" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                </div>
              </div>
              <div className="form-group">
                <label>Phone</label>
                <div className="input-wrap">
                  <span className="input-icon">
                    <svg viewBox="0 0 20 20" fill="currentColor"><path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"/></svg>
                  </span>
                  <input type="tel" placeholder="10-digit number" required value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
                </div>
              </div>
            </div>

            <div className="form-group">
              <label>Email Address</label>
              <div className="input-wrap">
                <span className="input-icon">
                  <svg viewBox="0 0 20 20" fill="currentColor"><path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/><path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/></svg>
                </span>
                <input type="email" placeholder="you@example.com" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
              </div>
            </div>

            <div className="form-group">
              <label>Password</label>
              <div className="input-wrap">
                <span className="input-icon">
                  <svg viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"/></svg>
                </span>
                <input
                  type={showPw ? 'text' : 'password'} placeholder="Min. 8 characters" required
                  value={form.password} onChange={e => setForm({ ...form, password: e.target.value })}
                />
                <button type="button" className="eye-btn" onClick={() => setShowPw(!showPw)}>
                  {showPw
                    ? <svg viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd"/><path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z"/></svg>
                    : <svg viewBox="0 0 20 20" fill="currentColor"><path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/><path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"/></svg>
                  }
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

            <button className="btn btn-primary btn-block" type="submit" disabled={loading}>
              {loading ? <span className="spinner" /> : 'Create My Account'}
            </button>
          </form>

          <div className="auth-footer">
            Already have an account? <Link to="/login">Sign in</Link>
          </div>
        </div>
      </div>

    </div>
  );
}
