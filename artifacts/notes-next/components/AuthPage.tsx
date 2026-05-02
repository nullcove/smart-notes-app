"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { BookOpen, Mail, Lock, User, Eye, EyeOff, Loader2, ArrowLeft, Sparkles } from "lucide-react";
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
      router.push("/notes-next/notes");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ minHeight: "100vh", background: "#07070f", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24, position: "relative", overflow: "hidden" }}>
      {/* Background blobs */}
      <div style={{ position: "absolute", top: "-20%", left: "30%", width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(circle,rgba(99,102,241,0.15),transparent 70%)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: "-20%", right: "20%", width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle,rgba(139,92,246,0.1),transparent 70%)", pointerEvents: "none" }} />

      {/* Back to home */}
      <Link href="/notes-next/" style={{ position: "absolute", top: 24, left: 24, display: "flex", alignItems: "center", gap: 7, color: "#64748b", textDecoration: "none", fontSize: 13, fontWeight: 500 }}>
        <ArrowLeft size={14} /> Back to Home
      </Link>

      {/* Logo */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 36 }}>
        <div style={{ width: 42, height: 42, borderRadius: 12, background: "linear-gradient(135deg,#6366f1,#8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 0 30px rgba(99,102,241,0.4)" }}>
          <BookOpen size={20} color="white" />
        </div>
        <span style={{ fontWeight: 900, fontSize: 22, background: "linear-gradient(90deg,#a5b4fc,#e879f9)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
          Smart Ins-Note
        </span>
      </div>

      {/* Card */}
      <div style={{ width: "100%", maxWidth: 400, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 20, padding: 32, backdropFilter: "blur(20px)" }}>
        {/* Tabs */}
        <div style={{ display: "flex", background: "rgba(255,255,255,0.04)", borderRadius: 10, padding: 4, marginBottom: 28 }}>
          {(["login", "register"] as const).map(m => (
            <button key={m} onClick={() => { setMode(m); setError(""); }}
              style={{ flex: 1, padding: "8px", borderRadius: 7, border: "none", cursor: "pointer", fontSize: 13, fontWeight: 700, transition: "all 0.2s",
                background: mode === m ? "linear-gradient(135deg,#6366f1,#8b5cf6)" : "transparent",
                color: mode === m ? "white" : "#64748b", boxShadow: mode === m ? "0 2px 12px rgba(99,102,241,0.35)" : "none" }}>
              {m === "login" ? "Sign In" : "Sign Up"}
            </button>
          ))}
        </div>

        <h1 style={{ fontSize: 22, fontWeight: 800, color: "#f1f5f9", marginBottom: 6, textAlign: "center" }}>
          {mode === "login" ? "Welcome back" : "Create account"}
        </h1>
        <p style={{ fontSize: 13, color: "#64748b", textAlign: "center", marginBottom: 24 }}>
          {mode === "login" ? "Sign in to access your notes" : "Start your note-taking journey"}
        </p>

        {error && (
          <div style={{ padding: "10px 14px", borderRadius: 8, background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)", color: "#f87171", fontSize: 13, marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
            ⚠ {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {mode === "register" && (
            <div style={{ marginBottom: 14 }}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#94a3b8", marginBottom: 6 }}>Your Name</label>
              <div style={{ position: "relative" }}>
                <User size={14} style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)", color: "#475569" }} />
                <input type="text" value={name} onChange={e => setName(e.target.value)} required
                  placeholder="John Doe"
                  style={{ width: "100%", padding: "11px 14px 11px 38px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, color: "#f1f5f9", fontSize: 14, outline: "none", boxSizing: "border-box" }}
                  onFocus={e => (e.currentTarget.style.borderColor = "#6366f1")}
                  onBlur={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)")} />
              </div>
            </div>
          )}

          <div style={{ marginBottom: 14 }}>
            <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#94a3b8", marginBottom: 6 }}>Email</label>
            <div style={{ position: "relative" }}>
              <Mail size={14} style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)", color: "#475569" }} />
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
                placeholder="you@example.com"
                style={{ width: "100%", padding: "11px 14px 11px 38px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, color: "#f1f5f9", fontSize: 14, outline: "none", boxSizing: "border-box" }}
                onFocus={e => (e.currentTarget.style.borderColor = "#6366f1")}
                onBlur={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)")} />
            </div>
          </div>

          <div style={{ marginBottom: 22 }}>
            <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#94a3b8", marginBottom: 6 }}>Password</label>
            <div style={{ position: "relative" }}>
              <Lock size={14} style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)", color: "#475569" }} />
              <input type={showPassword ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} required
                placeholder={mode === "register" ? "Minimum 6 characters" : "••••••••"}
                style={{ width: "100%", padding: "11px 44px 11px 38px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, color: "#f1f5f9", fontSize: 14, outline: "none", boxSizing: "border-box" }}
                onFocus={e => (e.currentTarget.style.borderColor = "#6366f1")}
                onBlur={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)")} />
              <button type="button" onClick={() => setShowPassword(s => !s)}
                style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#475569", display: "flex" }}>
                {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
          </div>

          <button type="submit" disabled={loading}
            style={{ width: "100%", padding: "13px", borderRadius: 12, border: "none", background: "linear-gradient(135deg,#6366f1,#8b5cf6)", color: "white", fontSize: 15, fontWeight: 700, cursor: loading ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, boxShadow: "0 0 30px rgba(99,102,241,0.4)", opacity: loading ? 0.7 : 1 }}>
            {loading ? <Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} /> : <Sparkles size={16} />}
            {loading ? "Please wait…" : mode === "login" ? "Sign In" : "Create Account"}
          </button>
        </form>

        <p style={{ textAlign: "center", fontSize: 12, color: "#475569", marginTop: 20 }}>
          {mode === "login" ? "No account? " : "Already have an account? "}
          <button onClick={() => { setMode(mode === "login" ? "register" : "login"); setError(""); }}
            style={{ background: "none", border: "none", cursor: "pointer", color: "#818cf8", fontWeight: 600, fontSize: 12, padding: 0 }}>
            {mode === "login" ? "Sign up free" : "Sign in"}
          </button>
        </p>
      </div>

      <p style={{ marginTop: 20, fontSize: 12, color: "#1e293b" }}>
        Or <Link href="/notes-next/notes" style={{ color: "#6366f1", textDecoration: "none" }}>continue without account →</Link>
      </p>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
