"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { BookMarked, Mail, Lock, User, Eye, EyeOff, Loader2, ArrowLeft, Sparkles, Zap } from "lucide-react";
import { apiLogin, apiRegister, saveAuth } from "@/lib/auth";
import Link from "next/link";

export function AuthPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const result = mode === "login"
        ? await apiLogin(email, password)
        : await apiRegister(email, password, name);
      saveAuth(result.token, result.user);
      router.push("/notes");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "12px 14px 12px 42px",
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.09)",
    borderRadius: 12, color: "#f1f5f9", fontSize: 14,
    outline: "none", boxSizing: "border-box",
    transition: "border-color 0.18s, box-shadow 0.18s",
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "#07070c",
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      padding: 24, position: "relative", overflow: "hidden"
    }}>
      {/* Ambient glow blobs */}
      <div style={{ position: "absolute", top: "-10%", left: "25%", width: 700, height: 700, borderRadius: "50%", background: "radial-gradient(circle,rgba(99,102,241,0.13),transparent 65%)", pointerEvents: "none", filter: "blur(2px)" }} />
      <div style={{ position: "absolute", bottom: "-15%", right: "15%", width: 550, height: 550, borderRadius: "50%", background: "radial-gradient(circle,rgba(168,85,247,0.09),transparent 65%)", pointerEvents: "none", filter: "blur(2px)" }} />
      <div style={{ position: "absolute", top: "40%", left: "-5%", width: 350, height: 350, borderRadius: "50%", background: "radial-gradient(circle,rgba(236,72,153,0.06),transparent 65%)", pointerEvents: "none" }} />

      {/* Back link */}
      <Link href="/" style={{ position: "absolute", top: 24, left: 24, display: "flex", alignItems: "center", gap: 7, color: "#475569", textDecoration: "none", fontSize: 13, fontWeight: 500, transition: "color 0.15s" }}
        onMouseEnter={(e: React.MouseEvent) => (e.currentTarget as HTMLElement).style.color = "#94a3b8"}
        onMouseLeave={(e: React.MouseEvent) => (e.currentTarget as HTMLElement).style.color = "#475569"}>
        <ArrowLeft size={14} /> Back to Home
      </Link>

      {/* Logo */}
      <div style={{ display: "flex", alignItems: "center", gap: 11, marginBottom: 40 }}>
        <div style={{
          width: 46, height: 46, borderRadius: 14,
          background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 0 40px rgba(99,102,241,0.45), 0 0 80px rgba(99,102,241,0.15)"
        }}>
          <BookMarked size={22} color="white" strokeWidth={2} />
        </div>
        <span style={{
          fontWeight: 900, fontSize: 24, letterSpacing: -0.6,
          background: "linear-gradient(90deg,#a5b4fc,#c084fc,#f0abfc)",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent"
        }}>
          Smart Ins-Note
        </span>
      </div>

      {/* Card */}
      <div style={{
        width: "100%", maxWidth: 420,
        background: "rgba(255,255,255,0.025)",
        border: "1px solid rgba(255,255,255,0.07)",
        borderRadius: 24, padding: "32px 32px 28px",
        backdropFilter: "blur(24px)",
        boxShadow: "0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04)"
      }}>
        {/* Mode tabs */}
        <div style={{ display: "flex", background: "rgba(255,255,255,0.04)", borderRadius: 12, padding: 4, marginBottom: 30 }}>
          {(["login", "register"] as const).map(m => (
            <button key={m} onClick={() => { setMode(m); setError(""); }}
              style={{
                flex: 1, padding: "9px", borderRadius: 9, border: "none", cursor: "pointer",
                fontSize: 13, fontWeight: 700, transition: "all 0.22s",
                background: mode === m ? "linear-gradient(135deg,#6366f1,#8b5cf6)" : "transparent",
                color: mode === m ? "white" : "#4b5563",
                boxShadow: mode === m ? "0 4px 14px rgba(99,102,241,0.4)" : "none"
              }}>
              {m === "login" ? "Sign In" : "Sign Up"}
            </button>
          ))}
        </div>

        {/* Heading */}
        <div style={{ textAlign: "center", marginBottom: 26 }}>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: "#f8fafc", marginBottom: 7, letterSpacing: -0.5 }}>
            {mode === "login" ? "Welcome back" : "Join Smart Ins-Note"}
          </h1>
          <p style={{ fontSize: 13, color: "#64748b" }}>
            {mode === "login" ? "Sign in to continue to your notes" : "Create your free account today"}
          </p>
        </div>

        {/* Error */}
        {error && (
          <div style={{
            padding: "11px 15px", borderRadius: 10,
            background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.22)",
            color: "#fca5a5", fontSize: 13, marginBottom: 18,
            display: "flex", alignItems: "center", gap: 9
          }}>
            <span style={{ fontSize: 15 }}>⚠</span> {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {mode === "register" && (
            <div style={{ marginBottom: 14 }}>
              <label style={{ display: "block", fontSize: 11.5, fontWeight: 600, color: "#64748b", marginBottom: 7, letterSpacing: 0.3, textTransform: "uppercase" }}>Name</label>
              <div style={{ position: "relative" }}>
                <User size={15} style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)", color: "#334155" }} />
                <input type="text" value={name} onChange={e => setName(e.target.value)} required
                  placeholder="Your full name"
                  style={inputStyle}
                  onFocus={e => { e.currentTarget.style.borderColor = "#6366f1"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(99,102,241,0.18)"; }}
                  onBlur={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.09)"; e.currentTarget.style.boxShadow = "none"; }} />
              </div>
            </div>
          )}

          <div style={{ marginBottom: 14 }}>
            <label style={{ display: "block", fontSize: 11.5, fontWeight: 600, color: "#64748b", marginBottom: 7, letterSpacing: 0.3, textTransform: "uppercase" }}>Email</label>
            <div style={{ position: "relative" }}>
              <Mail size={15} style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)", color: "#334155" }} />
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
                placeholder="you@example.com"
                style={inputStyle}
                onFocus={e => { e.currentTarget.style.borderColor = "#6366f1"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(99,102,241,0.18)"; }}
                onBlur={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.09)"; e.currentTarget.style.boxShadow = "none"; }} />
            </div>
          </div>

          <div style={{ marginBottom: 26 }}>
            <label style={{ display: "block", fontSize: 11.5, fontWeight: 600, color: "#64748b", marginBottom: 7, letterSpacing: 0.3, textTransform: "uppercase" }}>Password</label>
            <div style={{ position: "relative" }}>
              <Lock size={15} style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)", color: "#334155" }} />
              <input type={showPassword ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} required
                placeholder={mode === "register" ? "Min. 6 characters" : "••••••••••"}
                style={{ ...inputStyle, paddingRight: 44 }}
                onFocus={e => { e.currentTarget.style.borderColor = "#6366f1"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(99,102,241,0.18)"; }}
                onBlur={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.09)"; e.currentTarget.style.boxShadow = "none"; }} />
              <button type="button" onClick={() => setShowPassword(s => !s)}
                style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#334155", display: "flex", padding: 4, borderRadius: 6, transition: "color 0.15s" }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = "#94a3b8"}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = "#334155"}>
                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          <button type="submit" disabled={loading}
            style={{
              width: "100%", padding: "14px", borderRadius: 13,
              border: "none",
              background: loading ? "rgba(99,102,241,0.5)" : "linear-gradient(135deg,#6366f1,#8b5cf6)",
              color: "white", fontSize: 15, fontWeight: 700,
              cursor: loading ? "not-allowed" : "pointer",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 9,
              boxShadow: loading ? "none" : "0 0 30px rgba(99,102,241,0.5), 0 4px 20px rgba(99,102,241,0.3)",
              transition: "all 0.2s", letterSpacing: -0.2
            }}
            onMouseEnter={e => { if (!loading) { (e.currentTarget as HTMLElement).style.transform = "translateY(-1px)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 0 40px rgba(99,102,241,0.6), 0 8px 28px rgba(99,102,241,0.35)"; } }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = "none"; (e.currentTarget as HTMLElement).style.boxShadow = "0 0 30px rgba(99,102,241,0.5), 0 4px 20px rgba(99,102,241,0.3)"; }}>
            {loading
              ? <Loader2 size={17} style={{ animation: "spin 1s linear infinite" }} />
              : <Zap size={17} style={{ fill: "white" }} />}
            {loading ? "Please wait…" : mode === "login" ? "Sign In" : "Create Account"}
          </button>
        </form>

        <p style={{ textAlign: "center", fontSize: 12.5, color: "#334155", marginTop: 22 }}>
          {mode === "login" ? "Don't have an account? " : "Already have an account? "}
          <button onClick={() => { setMode(mode === "login" ? "register" : "login"); setError(""); }}
            style={{ background: "none", border: "none", cursor: "pointer", color: "#818cf8", fontWeight: 700, fontSize: 12.5, padding: 0, textDecoration: "underline", textUnderlineOffset: 2 }}>
            {mode === "login" ? "Sign up free" : "Sign in"}
          </button>
        </p>
      </div>

      <p style={{ marginTop: 22, fontSize: 12.5, color: "#1e293b" }}>
        Or <Link href="/notes" style={{ color: "#6366f1", textDecoration: "none", fontWeight: 600, borderBottom: "1px solid rgba(99,102,241,0.4)" }}>continue without account →</Link>
      </p>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
