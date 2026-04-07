import { login, signInWithGoogle } from "@/actions/auth";
import Link from "next/link";

function AuthCard({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--bg-base)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
      }}
    >
      {/* Logo */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 40 }}>
        <svg width="20" height="20" viewBox="0 0 18 18" fill="none">
          <path d="M9 1L17 9L9 17L1 9L9 1Z" fill="var(--accent)" opacity="0.5" />
          <path d="M9 4L14 9L9 14L4 9L9 4Z" fill="var(--accent)" />
        </svg>
        <span style={{ fontWeight: 600, fontSize: 17, fontFamily: "var(--font-geist)", letterSpacing: "-0.01em" }}>
          Spectra<span style={{ color: "var(--accent)" }}>AI</span>
        </span>
      </div>

      <div
        style={{
          width: "100%",
          maxWidth: 400,
          background: "var(--bg-surface)",
          border: "1px solid var(--border-default)",
          borderRadius: "var(--radius-xl)",
          padding: 32,
          boxShadow: "var(--shadow-lg)",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <h1
            style={{
              fontFamily: "var(--font-instrument)",
              fontStyle: "italic",
              fontSize: 30,
              fontWeight: 400,
              color: "var(--text-primary)",
              marginBottom: 6,
              lineHeight: 1.15,
            }}
          >
            {title}
          </h1>
          <p style={{ fontSize: 14, color: "var(--text-secondary)", fontFamily: "var(--font-geist)" }}>
            {subtitle}
          </p>
        </div>

        {children}
      </div>

      <p style={{ marginTop: 24, fontSize: 12, color: "var(--text-muted)", textAlign: "center", maxWidth: 320, lineHeight: 1.5 }}>
        By continuing, you agree to SpectraAI's Terms and Privacy Policy.
      </p>
    </div>
  );
}

export default function LoginPage({ searchParams }: { searchParams: { error?: string } }) {
  return (
    <AuthCard title="Welcome back" subtitle="Sign in to continue to SpectraAI">
      {searchParams?.error && (
        <div
          style={{
            background: "var(--danger-muted)",
            border: "1px solid var(--danger-border)",
            borderRadius: "var(--radius-md)",
            padding: "10px 14px",
            fontSize: 13,
            color: "var(--danger)",
            marginBottom: 20,
          }}
        >
          {searchParams.error}
        </div>
      )}

      {/* Google */}
      <form action={signInWithGoogle}>
        <button
          type="submit"
          style={{
            width: "100%",
            height: 40,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
            background: "#fff",
            border: "1px solid #E0E0E0",
            borderRadius: "var(--radius-md)",
            fontSize: 14,
            fontWeight: 500,
            color: "#1A1A1A",
            cursor: "pointer",
            fontFamily: "var(--font-geist)",
            marginBottom: 20,
            transition: "background var(--transition-fast)",
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
          </svg>
          Continue with Google
        </button>
      </form>

      {/* Divider */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
        <div style={{ flex: 1, height: 1, background: "var(--border-subtle)" }} />
        <span style={{ fontSize: 12, color: "var(--text-muted)", fontFamily: "var(--font-geist)", whiteSpace: "nowrap" }}>
          or with email
        </span>
        <div style={{ flex: 1, height: 1, background: "var(--border-subtle)" }} />
      </div>

      {/* Email form */}
      <form style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <div>
          <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>
            Email
          </label>
          <input
            name="email"
            type="email"
            placeholder="you@example.com"
            required
            style={{
              width: "100%",
              height: 40,
              background: "var(--bg-elevated)",
              border: "1px solid var(--border-default)",
              borderRadius: "var(--radius-md)",
              padding: "0 12px",
              fontSize: 14,
              color: "var(--text-primary)",
              fontFamily: "var(--font-geist)",
              outline: "none",
              transition: "border-color var(--transition-fast)",
            }}
          />
        </div>
        <div>
          <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>
            Password
          </label>
          <input
            name="password"
            type="password"
            placeholder="••••••••"
            required
            style={{
              width: "100%",
              height: 40,
              background: "var(--bg-elevated)",
              border: "1px solid var(--border-default)",
              borderRadius: "var(--radius-md)",
              padding: "0 12px",
              fontSize: 14,
              color: "var(--text-primary)",
              fontFamily: "var(--font-geist)",
              outline: "none",
            }}
          />
        </div>
        <button
          formAction={login}
          style={{
            width: "100%",
            height: 40,
            background: "var(--accent)",
            color: "var(--text-inverse)",
            border: "none",
            borderRadius: "var(--radius-md)",
            fontSize: 14,
            fontWeight: 500,
            fontFamily: "var(--font-geist)",
            cursor: "pointer",
            marginTop: 4,
            transition: "background var(--transition-fast)",
          }}
        >
          Sign In
        </button>
      </form>

      <p style={{ textAlign: "center", fontSize: 13, color: "var(--text-muted)", marginTop: 20, fontFamily: "var(--font-geist)" }}>
        No account?{" "}
        <Link href="/signup" style={{ color: "var(--accent)", textDecoration: "none" }}>
          Sign up
        </Link>
      </p>
    </AuthCard>
  );
}
