interface Props {
  title: string;
  titleAccent?: string;
  subtitle: string;
  features: string[];
}

export default function AuthLeft({ title, titleAccent, subtitle, features }: Props) {
  return (
    <div className="auth-left">
      <div className="auth-left-glow" />
      <div className="auth-left-glow2" />

      <div className="auth-brand">
        <div className="auth-brand-icon">L</div>
        <div className="auth-brand-name">LMS<span>Portal</span></div>
      </div>

      <div className="auth-left-body">
        <h1>
          {title}{titleAccent && <> <em>{titleAccent}</em></>}
        </h1>
        <p>{subtitle}</p>

        <div className="auth-hero-img-wrap">
          <img src="/src/assets/hero.png" alt="hero" className="auth-hero-img" />
          <div className="auth-hero-stats">
            {features.map((f, i) => (
              <div className="auth-hero-stat" key={i}>
                <div className="auth-feature-dot" />
                <span>{f}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
