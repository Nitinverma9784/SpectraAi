import Link from "next/link";
import { ArrowRight, Brain, Shield, Zap, CheckCircle, FileText, Target, Sparkles } from "lucide-react";

const features = [
  { icon: Brain, title: "Decision Intelligence", desc: "AI evaluates competing options against constraints and builds an auditable reasoning trail for every product choice." },
  { icon: FileText, title: "Adaptive Specifications", desc: "Living documents that auto-sync when decisions change. Contradictions and gaps surface before they become technical debt." },
  { icon: Shield, title: "Conflict Scanner", desc: "Cross-references all specifications in real-time. Detects logic contradictions long before they reach engineering." },
  { icon: Zap, title: "Lightning Strategy Hints", desc: "Sub-second insights on every decision context using Groq, before you even trigger a full analysis." },
  { icon: Target, title: "Trade-off Matrix", desc: "Radar charts built from AI-scored option comparisons — Impact, Effort, Risk, and Feasibility — all visualized." },
  { icon: Sparkles, title: "Closed Feedback Loop", desc: "Decisions generate spec updates. Spec conflicts spawn decisions. One workspace that reasons across both." },
];

const marqueeItems = [
  "Decision Intelligence",
  "Spec Consistency",
  "Conflict Detection",
  "AI Trade-off Analysis",
  "Living Documentation",
  "Requirement Sync",
  "Product Reasoning",
  "Strategic Clarity",
];

const steps = [
  { step: "01", title: "Create a decision", desc: "Add your product dilemma with context and competing options." },
  { step: "02", title: "Run AI Analysis", desc: "The engine evaluates trade-offs, scores options, and visualizes the matrix." },
  { step: "03", title: "Write your specs", desc: "Create living specification documents tied to your decisions." },
  { step: "04", title: "Scan for conflicts", desc: "AI cross-validates documents and surfaces contradictions before they rot." },
];

export default function LandingPage() {
  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-base)", color: "var(--text-primary)", overflowX: "hidden" }}>

      {/* ── NAVBAR ──────────────────────────────────────────── */}
      <nav className="landing-nav">
        <div className="landing-logo">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M9 1L17 9L9 17L1 9L9 1Z" fill="var(--accent)" opacity="0.5" />
            <path d="M9 4L14 9L9 14L4 9L9 4Z" fill="var(--accent)" />
          </svg>
          <span>Spectra<span style={{ color: "var(--accent)" }}>AI</span></span>
        </div>
        <div className="landing-nav-links">
          <Link href="/login" className="nav-link-ghost">Log in</Link>
          <Link href="/signup" className="nav-link-accent">Get started <ArrowRight size={14} /></Link>
        </div>
      </nav>

      {/* ── HERO ────────────────────────────────────────────── */}
      <section className="hero-section">
        {/* Animated background orbs */}
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />

        {/* Grid overlay */}
        <div className="hero-grid" />

        <div className="hero-inner">
          <div className="hero-badge animate-slide-up">
            <span className="badge-dot" />
            AI Engine Active · Two models running
          </div>

          <h1 className="hero-title animate-slide-up" style={{ animationDelay: "0.1s" }}>
            Product decisions,<br />
            <span className="hero-accent">finally reasoned.</span>
          </h1>

          <p className="hero-sub animate-slide-up" style={{ animationDelay: "0.2s" }}>
            Close the loop between decisions and living specs.<br className="hidden-mobile" />
            AI reasoning that never lets your documentation rot.
          </p>

          <div className="hero-ctas animate-slide-up" style={{ animationDelay: "0.3s" }}>
            <Link href="/signup" className="cta-primary">
              Start building free <ArrowRight size={15} />
            </Link>
            <Link href="/login" className="cta-ghost">
              Sign in
            </Link>
          </div>

          <div className="hero-trust animate-slide-up" style={{ animationDelay: "0.4s" }}>
            {["No credit card", "Free forever", "2 AI models"].map((t) => (
              <div key={t} className="trust-item">
                <CheckCircle size={12} style={{ color: "var(--success)" }} />
                {t}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── INFINITY MARQUEE ────────────────────────────────── */}
      <div className="marquee-wrapper">
        <div className="marquee-track">
          {[...marqueeItems, ...marqueeItems, ...marqueeItems].map((item, i) => (
            <div key={i} className="marquee-item">
              <span className="marquee-dot" />
              {item}
            </div>
          ))}
        </div>
      </div>

      {/* ── FEATURES GRID ───────────────────────────────────── */}
      <section className="section">
        <div className="section-inner">
          <div className="section-label">Capabilities</div>
          <h2 className="section-title">Everything your product team needs</h2>
          <p className="section-sub">Built around two unsolved product problems — decision logic and spec consistency.</p>

          <div className="features-grid">
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <div key={f.title} className="feature-card" style={{ animationDelay: `${i * 0.08}s` }}>
                  <div className="feature-icon">
                    <Icon size={16} style={{ color: "var(--accent)" }} />
                  </div>
                  <h3 className="feature-title text-[--text-primary]">{f.title}</h3>
                  <p className="feature-desc">{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ────────────────────────────────────── */}
      <section className="section section-alt">
        <div className="section-inner">
          <div className="section-label">Workflow</div>
          <h2 className="section-title">From uncertainty to clarity in four steps</h2>

          <div className="steps-grid">
            {steps.map((s, i) => (
              <div key={s.step} className="step-card">
                <div className="step-number">{s.step}</div>
                {i < steps.length - 1 && <div className="step-connector" />}
                <h3 className="step-title text-[--text-primary]">{s.title}</h3>
                <p className="step-desc">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── DUAL MODULE SECTION ─────────────────────────────── */}
      <section className="section">
        <div className="section-inner">
          <div className="modules-grid">
            <div className="module-card module-card-accent">
              <div className="module-tag" style={{ color: "var(--accent)", background: "var(--accent-muted)", borderColor: "var(--accent-border)" }}>
                Decision Engine
              </div>
              <h3 className="module-title text-[--text-primary]">Stop making decisions on gut feeling</h3>
              <p className="module-desc">
                Structure options. Score trade-offs. Get explainable recommendations backed by AI reasoning — Impact, Effort, Risk, and Strategic Alignment visualized.
              </p>
              <ul className="module-list">
                {["Multi-option comparison", "AI-scored trade-off matrix", "Auditable reasoning trail", "Groq lightning hints"].map(item => (
                  <li key={item}><CheckCircle size={12} style={{ color: "var(--success)" }} /> {item}</li>
                ))}
              </ul>
            </div>

            <div className="module-card module-card-info">
              <div className="module-tag" style={{ color: "var(--info)", background: "var(--info-muted)", borderColor: "var(--info-border)" }}>
                Spec Engine
              </div>
              <h3 className="module-title text-[--text-primary]">Specs that never go stale</h3>
              <p className="module-desc">
                Cross-validate PRDs, technical docs, and security specs in real-time. When a requirement in Document A conflicts with Document B, the AI surfaces it instantly.
              </p>
              <ul className="module-list">
                {["Real-time cross-validation", "Conflict severity scoring", "AI resolution strategies", "Mermaid architecture diagrams"].map(item => (
                  <li key={item}><CheckCircle size={12} style={{ color: "var(--success)" }} /> {item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────────────── */}
      <section className="section cta-section">
        <div className="cta-orb" />
        <div className="cta-inner">
          <div className="section-label">Get started</div>
          <h2 className="cta-headline">Ready to reason through<br />your next big decision?</h2>
          <p className="cta-sub">Free to start. No credit card required. AI models pre-configured.</p>
          <div className="hero-ctas">
            <Link href="/signup" className="cta-primary">
              Start building <ArrowRight size={15} />
            </Link>
            <Link href="/login" className="cta-ghost">Sign in</Link>
          </div>
        </div>
      </section>

      {/* ── FOOTER ──────────────────────────────────────────── */}
      <footer className="landing-footer">
        <div className="footer-logo">
          <svg width="14" height="14" viewBox="0 0 18 18" fill="none">
            <path d="M9 1L17 9L9 17L1 9L9 1Z" fill="var(--accent)" opacity="0.5" />
            <path d="M9 4L14 9L9 14L4 9L9 4Z" fill="var(--accent)" />
          </svg>
          <span>Spectra<span style={{ color: "var(--accent)" }}>AI</span></span>
        </div>
        <p className="footer-copy">© {new Date().getFullYear()} SpectraAI. Built for modern product teams.</p>
      </footer>
    </div>
  );
}
