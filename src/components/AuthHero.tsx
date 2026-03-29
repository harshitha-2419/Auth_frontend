interface Props {
  title: string;
  subtitle: string;
  features: { icon: string; text: string }[];
}

export default function AuthHero({ title, subtitle, features }: Props) {
  return (
    <div className="auth-hero">
      <div className="hero-content">
        <div className="hero-logo">🔐</div>
        <h1>{title}</h1>
        <p>{subtitle}</p>
        <div className="hero-features">
          {features.map((f, i) => (
            <div className="hero-feature" key={i}>
              <span>{f.icon}</span>
              <span>{f.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
