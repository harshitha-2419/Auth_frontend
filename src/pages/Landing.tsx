import { Link } from 'react-router-dom';

const pages = [
  { label: 'Login', path: '/login', icon: '🔐', desc: 'Sign in with password', tag: 'badge-indigo' },
  { label: 'Register', path: '/register', icon: '📝', desc: 'Create a new account', tag: 'badge-indigo' },
  { label: 'Verify OTP', path: '/verify-otp', icon: '✉️', desc: 'Email OTP on signup', tag: 'badge-blue' },
  { label: 'Login with OTP', path: '/login-otp', icon: '🔑', desc: 'Passwordless OTP login', tag: 'badge-blue' },
  { label: 'Forgot Password', path: '/forgot-password', icon: '🔒', desc: 'Request password reset', tag: 'badge-violet' },
  { label: 'Reset Password', path: '/reset-password', icon: '🛡️', desc: 'Set a new password', tag: 'badge-violet' },
  { label: 'Dashboard', path: '/dashboard', icon: '📊', desc: 'Full student dashboard', tag: 'badge-green' },
];

const features = [
  { icon: '🎓', title: 'Course Management', desc: 'Enroll, track progress and complete courses across Web, Data, Design & more.' },
  { icon: '💼', title: 'Internship Board', desc: 'Browse and apply to real internship openings updated daily from top companies.' },
  { icon: '📓', title: 'Internship Diaries', desc: 'Log daily work, get mentor feedback and track your internship journey.' },
  { icon: '🚀', title: 'Project Spaces', desc: 'Collaborate with mentors and peers on real-world projects with progress tracking.' },
  { icon: '💬', title: 'Community Chat', desc: 'Connect with students, faculty and organizations in role-based group chats.' },
  { icon: '🛡️', title: 'Enterprise Auth', desc: 'JWT tokens, OTP login, session management, login history & role-based access.' },
];

const stack = ['React 19', 'TypeScript', 'Tailwind CSS', 'Node.js', 'Express', 'MongoDB', 'JWT', 'OTP Auth'];

export default function Landing() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--t1)' }}>

      {/* ── NAVBAR ── */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 50,
        background: 'rgba(15,17,23,0.85)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--border)',
        padding: '0 2rem', height: 60,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div className="lp-brand-icon">L</div>
          <div className="lp-brand-name">LMS<span>Portal</span></div>
        </div>
        <div style={{ display: 'flex', gap: '0.6rem' }}>
          <Link to="/login">
            <button className="btn btn-outline" style={{ padding: '0.45rem 1rem', fontSize: '0.82rem' }}>Sign In</button>
          </Link>
          <Link to="/register">
            <button className="btn btn-primary" style={{ padding: '0.45rem 1rem', fontSize: '0.82rem' }}>Get Started</button>
          </Link>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section style={{ position: 'relative', overflow: 'hidden', padding: '5rem 2rem 4rem', textAlign: 'center' }}>
        {/* glow blobs */}
        <div style={{ position: 'absolute', top: -120, left: '50%', transform: 'translateX(-50%)', width: 600, height: 600, background: 'radial-gradient(circle, rgba(79,70,229,0.12) 0%, transparent 65%)', borderRadius: '50%', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: 80, right: '10%', width: 300, height: 300, background: 'radial-gradient(circle, rgba(139,92,246,0.08) 0%, transparent 65%)', borderRadius: '50%', pointerEvents: 'none' }} />

        <div style={{ position: 'relative', maxWidth: 700, margin: '0 auto' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'var(--primary-light)', border: '1px solid var(--primary-border)', borderRadius: 999, padding: '0.3rem 0.9rem', fontSize: '0.78rem', color: '#a5b4fc', marginBottom: '1.5rem' }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#a5b4fc', display: 'inline-block' }} />
            UI Showcase — Static Preview
          </div>

          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.2rem)', fontWeight: 800, lineHeight: 1.15, letterSpacing: '-1px', marginBottom: '1.25rem' }}>
            A Full-Stack{' '}
            <span style={{ background: 'linear-gradient(135deg, var(--primary), var(--violet))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Authentication System
            </span>
            {' '}for LMS Portal
          </h1>

          <p style={{ fontSize: '1rem', color: 'var(--t3)', lineHeight: 1.8, marginBottom: '2rem', maxWidth: 560, margin: '0 auto 2rem' }}>
            Built with React + TypeScript on the frontend and Node.js + Express + MongoDB on the backend. Featuring JWT auth, OTP login, session management and a full student dashboard.
          </p>

          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '2.5rem' }}>
            <Link to="/login">
              <button className="btn btn-primary" style={{ padding: '0.7rem 1.6rem', fontSize: '0.9rem' }}>
                View Login Page →
              </button>
            </Link>
            <Link to="/dashboard">
              <button className="btn btn-outline" style={{ padding: '0.7rem 1.6rem', fontSize: '0.9rem' }}>
                View Dashboard
              </button>
            </Link>
          </div>

          {/* stats row */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '2.5rem', flexWrap: 'wrap' }}>
            {[['7', 'Auth Pages'], ['6+', 'Dashboard Tabs'], ['3', 'User Roles'], ['100%', 'TypeScript']].map(([val, lbl]) => (
              <div key={lbl} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--t1)', letterSpacing: '-0.5px' }}>{val}</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--t4)', marginTop: 2, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{lbl}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── NOTICE BANNER ── */}
      <div style={{ maxWidth: 700, margin: '0 auto', padding: '0 2rem 2.5rem' }}>
        <div style={{ background: 'rgba(245,158,11,0.07)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: 12, padding: '0.85rem 1.25rem', fontSize: '0.82rem', color: '#fcd34d', lineHeight: 1.7, textAlign: 'center' }}>
          ⚠️ Backend runs locally — API calls won't work here. The Dashboard is a <strong>protected route</strong> in the real app, temporarily unprotected for this preview.
        </div>
      </div>

      {/* ── DEMO DASHBOARD ── */}
      <section style={{ maxWidth: 960, margin: '0 auto', padding: '0 2rem 4rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, letterSpacing: '-0.3px', marginBottom: '0.4rem' }}>Try the Dashboard</h2>
          <p style={{ color: 'var(--t4)', fontSize: '0.85rem' }}>Preview as different roles — each has different tabs and permissions</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1rem' }}>
          {[
            { role: 'user',        label: 'Student',    icon: '🎓', desc: 'Courses, Assignments, Internships, Diaries, Projects, Community', color: '#4f46e5', badge: 'badge-indigo' },
            { role: 'admin',       label: 'Admin',      icon: '🛠️', desc: 'All student tabs + Manage Users, Post Courses & Assignments, Analytics', color: '#22c55e', badge: 'badge-green' },
            { role: 'super_admin', label: 'Super Admin', icon: '👑', desc: 'Full access + Sessions, Login History, Role Management, Delete Users', color: '#8b5cf6', badge: 'badge-violet' },
          ].map(d => (
            <a key={d.role} href={`#/dashboard?role=${d.role}`} style={{ textDecoration: 'none' }}>
              <div style={{
                background: 'var(--bg2)', border: `1px solid var(--border)`,
                borderRadius: 14, padding: '1.5rem',
                transition: 'all 0.2s', cursor: 'pointer',
              }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLDivElement).style.borderColor = d.color + '55';
                  (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-3px)';
                  (e.currentTarget as HTMLDivElement).style.boxShadow = `0 8px 24px rgba(0,0,0,0.3)`;
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--border)';
                  (e.currentTarget as HTMLDivElement).style.transform = 'none';
                  (e.currentTarget as HTMLDivElement).style.boxShadow = 'none';
                }}
              >
                <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>{d.icon}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <span style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--t1)' }}>{d.label}</span>
                  <span className={`badge ${d.badge}`} style={{ fontSize: '0.65rem' }}>{d.role}</span>
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--t4)', lineHeight: 1.6, marginBottom: '1rem' }}>{d.desc}</div>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: d.color + '18', border: `1px solid ${d.color}44`, borderRadius: 8, padding: '0.4rem 0.85rem', fontSize: '0.8rem', fontWeight: 600, color: d.color }}>
                  Open as {d.label} →
                </div>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* ── ALL PAGES ── */}
      <section style={{ maxWidth: 960, margin: '0 auto', padding: '0 2rem 4rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, letterSpacing: '-0.3px', marginBottom: '0.4rem' }}>All Pages</h2>
          <p style={{ color: 'var(--t4)', fontSize: '0.85rem' }}>Click any card to preview the page</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '0.85rem' }}>
          {pages.map(p => (
            <Link key={p.path} to={p.path} style={{ textDecoration: 'none' }}>
              <div style={{
                background: 'var(--bg2)', border: '1px solid var(--border)',
                borderRadius: 14, padding: '1.25rem',
                transition: 'all 0.2s', cursor: 'pointer',
                display: 'flex', flexDirection: 'column', gap: '0.5rem',
              }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--primary-border)';
                  (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-3px)';
                  (e.currentTarget as HTMLDivElement).style.boxShadow = '0 8px 24px rgba(0,0,0,0.3)';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--border)';
                  (e.currentTarget as HTMLDivElement).style.transform = 'none';
                  (e.currentTarget as HTMLDivElement).style.boxShadow = 'none';
                }}
              >
                <div style={{ fontSize: '1.5rem' }}>{p.icon}</div>
                <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--t1)' }}>{p.label}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--t4)', lineHeight: 1.5 }}>{p.desc}</div>
                <div style={{ marginTop: 'auto', paddingTop: '0.5rem' }}>
                  <span className={`badge ${p.tag}`} style={{ fontSize: '0.68rem' }}>View Page →</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section style={{ background: 'var(--bg2)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', padding: '4rem 2rem' }}>
        <div style={{ maxWidth: 960, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, letterSpacing: '-0.3px', marginBottom: '0.4rem' }}>What's Inside</h2>
            <p style={{ color: 'var(--t4)', fontSize: '0.85rem' }}>A complete LMS platform with all the features</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1rem' }}>
            {features.map(f => (
              <div key={f.title} style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 12, padding: '1.25rem', display: 'flex', gap: '0.85rem', alignItems: 'flex-start' }}>
                <div style={{ fontSize: '1.3rem', flexShrink: 0, marginTop: 2 }}>{f.icon}</div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--t1)', marginBottom: '0.3rem' }}>{f.title}</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--t4)', lineHeight: 1.6 }}>{f.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TECH STACK ── */}
      <section style={{ maxWidth: 960, margin: '0 auto', padding: '4rem 2rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, letterSpacing: '-0.3px', marginBottom: '0.4rem' }}>Tech Stack</h2>
          <p style={{ color: 'var(--t4)', fontSize: '0.85rem' }}>Technologies used to build this project</p>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem', justifyContent: 'center' }}>
          {stack.map(t => (
            <span key={t} className="badge badge-indigo" style={{ fontSize: '0.82rem', padding: '0.4rem 1rem' }}>{t}</span>
          ))}
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ borderTop: '1px solid var(--border)', padding: '1.5rem 2rem', textAlign: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: '0.5rem' }}>
          <div className="lp-brand-icon" style={{ width: 28, height: 28, fontSize: 13 }}>L</div>
          <div className="lp-brand-name" style={{ fontSize: 14 }}>LMS<span>Portal</span></div>
        </div>
        <p style={{ fontSize: '0.78rem', color: 'var(--t4)' }}>
          Built by <strong style={{ color: 'var(--t2)' }}>Harshitha</strong> · Full Stack Authentication Project
        </p>
      </footer>

    </div>
  );
}
