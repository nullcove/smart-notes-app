"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  BookMarked, Mail, Lock, User, Eye, EyeOff,
  Loader2, ArrowLeft, Zap, Shield, Sparkles, Star,
} from "lucide-react";
import { apiLogin, apiRegister, saveAuth } from "@/lib/auth";
import Link from "next/link";

const STARS = [
  { top: "3%", left: "7%", s: 1.5, d: 0, dur: 3.2 },
  { top: "8%", left: "34%", s: 1, d: 0.8, dur: 4.1 },
  { top: "6%", left: "68%", s: 2, d: 1.5, dur: 3.7 },
  { top: "11%", left: "85%", s: 1, d: 0.3, dur: 5 },
  { top: "18%", left: "22%", s: 1.5, d: 2.1, dur: 3.5 },
  { top: "15%", left: "52%", s: 1, d: 1, dur: 4.5 },
  { top: "24%", left: "90%", s: 2, d: 0.6, dur: 3.8 },
  { top: "31%", left: "13%", s: 1, d: 2.5, dur: 4.2 },
  { top: "28%", left: "74%", s: 1.5, d: 0.9, dur: 3.3 },
  { top: "38%", left: "42%", s: 1, d: 1.7, dur: 5.1 },
  { top: "42%", left: "8%", s: 2, d: 0.2, dur: 3.6 },
  { top: "45%", left: "95%", s: 1, d: 2.8, dur: 4 },
  { top: "52%", left: "29%", s: 1.5, d: 1.2, dur: 3.9 },
  { top: "55%", left: "61%", s: 1, d: 0.5, dur: 4.7 },
  { top: "61%", left: "16%", s: 2, d: 2.2, dur: 3.4 },
  { top: "68%", left: "82%", s: 1, d: 0.7, dur: 5.2 },
  { top: "65%", left: "47%", s: 1.5, d: 1.9, dur: 3.8 },
  { top: "73%", left: "5%", s: 1, d: 0.4, dur: 4.3 },
  { top: "78%", left: "70%", s: 2, d: 1.6, dur: 3.7 },
  { top: "82%", left: "38%", s: 1, d: 2.4, dur: 4.8 },
  { top: "88%", left: "88%", s: 1.5, d: 0.1, dur: 3.5 },
  { top: "84%", left: "20%", s: 1, d: 2, dur: 4.6 },
  { top: "92%", left: "55%", s: 2, d: 0.8, dur: 3.9 },
  { top: "95%", left: "10%", s: 1, d: 1.4, dur: 4.4 },
  { top: "97%", left: "77%", s: 1.5, d: 2.6, dur: 3.6 },
];

const CYBER_PARTICLES = [
  { top: "8%", left: "15%", d: 0, dur: 7 },
  { top: "22%", left: "88%", d: 1.2, dur: 6 },
  { top: "40%", left: "6%", d: 0.5, dur: 8 },
  { top: "58%", left: "78%", d: 2, dur: 5 },
  { top: "75%", left: "25%", d: 1.5, dur: 7 },
  { top: "88%", left: "91%", d: 0.8, dur: 6 },
  { top: "33%", left: "52%", d: 2.5, dur: 8 },
  { top: "67%", left: "10%", d: 1.8, dur: 5 },
];

export function AuthPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [focused, setFocused] = useState<string | null>(null);

  const isLogin = mode === "login";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const result = isLogin
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

  const accent = isLogin ? "#6366f1" : "#06b6d4";
  const accentEnd = isLogin ? "#8b5cf6" : "#10b981";
  const bg = isLogin ? "#030308" : "#020a10";
  const cardBg = isLogin ? "rgba(15,10,30,0.85)" : "rgba(2,14,25,0.88)";
  const borderColor = isLogin ? "rgba(99,102,241,0.22)" : "rgba(6,182,212,0.28)";
  const glowColor = isLogin ? "rgba(99,102,241,0.35)" : "rgba(6,182,212,0.35)";
  const inputBg = isLogin ? "rgba(99,102,241,0.05)" : "rgba(6,182,212,0.05)";
  const inputBorder = isLogin ? "rgba(99,102,241,0.15)" : "rgba(6,182,212,0.15)";
  const inputFocusBorder = accent;
  const inputFocusShadow = isLogin ? "0 0 0 3px rgba(99,102,241,0.2), 0 0 20px rgba(99,102,241,0.15)" : "0 0 0 3px rgba(6,182,212,0.2), 0 0 20px rgba(6,182,212,0.12)";
  const labelColor = isLogin ? "#7c86a2" : "#2d9fb5";
  const textMuted = isLogin ? "#475569" : "#0e7490";
  const textPrimary = isLogin ? "#f1f5f9" : "#e0feff";
  const logoAnim = isLogin ? "pulseLogoBg 3s ease-in-out infinite" : "neonLogoBg 3s ease-in-out infinite";

  const inputStyle = (field: string): React.CSSProperties => ({
    width: "100%",
    padding: "13px 14px 13px 44px",
    background: focused === field ? (isLogin ? "rgba(99,102,241,0.08)" : "rgba(6,182,212,0.08)") : inputBg,
    border: `1px solid ${focused === field ? inputFocusBorder : inputBorder}`,
    borderRadius: 12,
    color: textPrimary,
    fontSize: 14,
    outline: "none",
    boxSizing: "border-box",
    transition: "all 0.25s",
    boxShadow: focused === field ? inputFocusShadow : "none",
    fontFamily: "inherit",
    letterSpacing: "0.01em",
  });

  return (
    <div style={{ minHeight: "100vh", background: bg, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24, position: "relative", overflow: "hidden" }}>

      {/* ── LOGIN BACKGROUND ── */}
      {isLogin && (
        <>
          <div className="orb-1" style={{ position: "absolute", top: "-15%", left: "-10%", width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(circle, rgba(99,102,241,0.18) 0%, transparent 65%)", filter: "blur(10px)", pointerEvents: "none", animation: "floatOrbA 10s ease-in-out infinite" }} />
          <div style={{ position: "absolute", bottom: "-20%", right: "-8%", width: 700, height: 700, borderRadius: "50%", background: "radial-gradient(circle, rgba(168,85,247,0.14) 0%, transparent 65%)", filter: "blur(15px)", pointerEvents: "none", animation: "floatOrbB 13s ease-in-out infinite" }} />
          <div style={{ position: "absolute", top: "35%", right: "8%", width: 280, height: 280, borderRadius: "50%", background: "radial-gradient(circle, rgba(236,72,153,0.09) 0%, transparent 70%)", filter: "blur(8px)", pointerEvents: "none", animation: "floatOrbA 7s ease-in-out infinite reverse" }} />
          <div style={{ position: "absolute", top: "42%", left: "50%", transform: "translateX(-50%)", width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle, rgba(99,102,241,0.05) 0%, transparent 70%)", filter: "blur(30px)", pointerEvents: "none" }} />
          {STARS.map((star, i) => (
            <div key={i} style={{ position: "absolute", top: star.top, left: star.left, width: star.s, height: star.s, borderRadius: "50%", background: "white", animation: `twinkle ${star.dur}s ${star.d}s ease-in-out infinite`, pointerEvents: "none", opacity: 0 }} />
          ))}
          <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(99,102,241,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.03) 1px, transparent 1px)", backgroundSize: "60px 60px", pointerEvents: "none" }} />
        </>
      )}

      {/* ── REGISTER BACKGROUND ── */}
      {!isLogin && (
        <>
          <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(6,182,212,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(6,182,212,0.07) 1px, transparent 1px)", backgroundSize: "44px 44px", animation: "gridScroll 25s linear infinite", pointerEvents: "none" }} />
          <div style={{ position: "absolute", top: "-10%", right: "-5%", width: 450, height: 450, borderRadius: "50%", background: "radial-gradient(circle, rgba(6,182,212,0.16) 0%, transparent 65%)", filter: "blur(10px)", pointerEvents: "none", animation: "floatOrbA 9s ease-in-out infinite" }} />
          <div style={{ position: "absolute", bottom: "-15%", left: "-8%", width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle, rgba(16,185,129,0.12) 0%, transparent 65%)", filter: "blur(12px)", pointerEvents: "none", animation: "floatOrbB 12s ease-in-out infinite" }} />
          <div style={{ position: "absolute", top: "40%", left: "5%", width: 200, height: 200, borderRadius: "50%", background: "radial-gradient(circle, rgba(20,184,166,0.1) 0%, transparent 70%)", filter: "blur(8px)", pointerEvents: "none", animation: "floatOrbA 6s ease-in-out infinite reverse" }} />
          {CYBER_PARTICLES.map((p, i) => (
            <div key={i} style={{ position: "absolute", top: p.top, left: p.left, width: 3, height: 3, borderRadius: "50%", background: "#06b6d4", animation: `cyberParticle ${p.dur}s ${p.d}s ease-in-out infinite`, pointerEvents: "none", opacity: 0, boxShadow: "0 0 6px rgba(6,182,212,0.8)" }} />
          ))}
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(6,182,212,0.02) 0%, transparent 40%, rgba(16,185,129,0.02) 100%)", pointerEvents: "none", animation: "scanDown 8s linear infinite", opacity: 0.5 }} />
          <div style={{ position: "absolute", top: "10%", left: "5%", width: 60, height: 60, border: "1px solid rgba(6,182,212,0.15)", borderRadius: 8, animation: "rotateSlow 20s linear infinite", pointerEvents: "none" }} />
          <div style={{ position: "absolute", bottom: "12%", right: "6%", width: 80, height: 80, border: "1px solid rgba(16,185,129,0.12)", borderRadius: "50%", animation: "rotateSlow 15s linear infinite reverse", pointerEvents: "none" }} />
          <div style={{ position: "absolute", top: "50%", right: "3%", width: 40, height: 40, border: "1px solid rgba(6,182,212,0.12)", transform: "rotate(45deg)", animation: "rotateSlow 12s linear infinite", pointerEvents: "none" }} />
        </>
      )}

      {/* Back */}
      <Link href="/" style={{ position: "absolute", top: 24, left: 24, display: "flex", alignItems: "center", gap: 7, color: textMuted, textDecoration: "none", fontSize: 13, fontWeight: 500, transition: "all 0.2s", zIndex: 10 }}
        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = textPrimary; (e.currentTarget as HTMLElement).style.transform = "translateX(-3px)"; }}
        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = textMuted; (e.currentTarget as HTMLElement).style.transform = "none"; }}>
        <ArrowLeft size={14} /> Back
      </Link>

      {/* Logo */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 36, animation: "slideUpCard 0.7s cubic-bezier(0.16,1,0.3,1) forwards", opacity: 0, zIndex: 10 }}>
        <div style={{ width: 50, height: 50, borderRadius: 15, background: `linear-gradient(135deg,${accent},${accentEnd})`, display: "flex", alignItems: "center", justifyContent: "center", animation: logoAnim, boxShadow: `0 0 30px ${glowColor}` }}>
          {isLogin ? <BookMarked size={23} color="white" strokeWidth={2} /> : <Shield size={23} color="white" strokeWidth={2} />}
        </div>
        <span style={{ fontWeight: 900, fontSize: 26, letterSpacing: -0.8, background: isLogin ? "linear-gradient(90deg,#a5b4fc,#c084fc,#f0abfc)" : "linear-gradient(90deg,#67e8f9,#34d399,#a7f3d0)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
          Smart Ins-Note
        </span>
      </div>

      {/* Card */}
      <div style={{ position: "relative", width: "100%", maxWidth: 430, animation: "slideUpCard 0.75s 0.1s cubic-bezier(0.16,1,0.3,1) forwards", opacity: 0, zIndex: 10 }}>
        <div style={{ borderRadius: 26, padding: 2, background: isLogin ? `linear-gradient(135deg, rgba(99,102,241,0.4), rgba(168,85,247,0.2), rgba(99,102,241,0.4))` : `linear-gradient(135deg, rgba(6,182,212,0.4), rgba(16,185,129,0.2), rgba(6,182,212,0.4))`, animation: isLogin ? "loginBorderGlow 4s ease-in-out infinite" : "cyanBorderGlow 3.5s ease-in-out infinite" }}>
          <div style={{ background: cardBg, borderRadius: 24, padding: "32px 32px 28px", backdropFilter: "blur(40px)", boxShadow: isLogin ? "0 40px 100px rgba(0,0,0,0.7)" : "0 40px 100px rgba(0,0,0,0.8)" }}>

            {/* Mode tabs */}
            <div style={{ display: "flex", background: isLogin ? "rgba(99,102,241,0.06)" : "rgba(6,182,212,0.06)", borderRadius: 13, padding: 4, marginBottom: 30, border: `1px solid ${borderColor}` }}>
              {(["login", "register"] as const).map(m => (
                <button key={m} onClick={() => { setMode(m); setError(""); }}
                  style={{ flex: 1, padding: "10px", borderRadius: 10, border: "none", cursor: "pointer", fontSize: 13, fontWeight: 700, transition: "all 0.3s cubic-bezier(0.16,1,0.3,1)", background: mode === m ? `linear-gradient(135deg,${accent},${accentEnd})` : "transparent", color: mode === m ? "white" : labelColor, boxShadow: mode === m ? `0 4px 16px ${glowColor}` : "none", letterSpacing: 0.2 }}>
                  {m === "login" ? "Sign In" : "Create Account"}
                </button>
              ))}
            </div>

            {/* Heading */}
            <div style={{ textAlign: "center", marginBottom: 28, animation: "fadeSlideIn 0.5s 0.3s ease forwards", opacity: 0 }}>
              <h1 style={{ fontSize: 26, fontWeight: 800, color: textPrimary, marginBottom: 8, letterSpacing: -0.6 }}>
                {isLogin ? "Welcome back" : "Join Smart Ins-Note"}
              </h1>
              <p style={{ fontSize: 13, color: labelColor, lineHeight: 1.6 }}>
                {isLogin ? "Sign in to access your notes" : "Create your free account and start noting"}
              </p>
              {!isLogin && (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, marginTop: 10 }}>
                  {[0, 1, 2].map(i => <Star key={i} size={11} style={{ color: "#10b981", fill: "#10b981", animation: `starPop 0.4s ${i * 0.1}s ease-out both` }} />)}
                  <span style={{ fontSize: 11, color: "#10b981", fontWeight: 600 }}>Free forever</span>
                </div>
              )}
            </div>

            {/* Error */}
            {error && (
              <div style={{ padding: "11px 15px", borderRadius: 11, background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)", color: "#fca5a5", fontSize: 13, marginBottom: 18, display: "flex", alignItems: "center", gap: 9, animation: "shakeError 0.4s ease" }}>
                <span style={{ fontSize: 16 }}>⚠</span> {error}
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ animation: "fadeSlideIn 0.5s 0.4s ease forwards", opacity: 0 }}>
              {!isLogin && (
                <div style={{ marginBottom: 16 }}>
                  <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: labelColor, marginBottom: 7, letterSpacing: 0.8, textTransform: "uppercase" }}>Full Name</label>
                  <div style={{ position: "relative" }}>
                    <User size={15} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: focused === "name" ? accent : labelColor, transition: "color 0.2s" }} />
                    <input type="text" value={name} onChange={e => setName(e.target.value)} required placeholder="Your full name"
                      style={inputStyle("name")}
                      onFocus={() => setFocused("name")} onBlur={() => setFocused(null)} />
                  </div>
                </div>
              )}

              <div style={{ marginBottom: 16 }}>
                <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: labelColor, marginBottom: 7, letterSpacing: 0.8, textTransform: "uppercase" }}>Email Address</label>
                <div style={{ position: "relative" }}>
                  <Mail size={15} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: focused === "email" ? accent : labelColor, transition: "color 0.2s" }} />
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="you@example.com"
                    style={inputStyle("email")}
                    onFocus={() => setFocused("email")} onBlur={() => setFocused(null)} />
                </div>
              </div>

              <div style={{ marginBottom: 28 }}>
                <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: labelColor, marginBottom: 7, letterSpacing: 0.8, textTransform: "uppercase" }}>Password</label>
                <div style={{ position: "relative" }}>
                  <Lock size={15} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: focused === "pass" ? accent : labelColor, transition: "color 0.2s" }} />
                  <input type={showPassword ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} required
                    placeholder={isLogin ? "••••••••••" : "Min. 6 characters"}
                    style={{ ...inputStyle("pass"), paddingRight: 46 }}
                    onFocus={() => setFocused("pass")} onBlur={() => setFocused(null)} />
                  <button type="button" onClick={() => setShowPassword(s => !s)}
                    style={{ position: "absolute", right: 13, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: labelColor, display: "flex", padding: 5, borderRadius: 7, transition: "all 0.2s" }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = accent; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = labelColor; }}>
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              <button type="submit" disabled={loading}
                className="submit-btn"
                style={{
                  width: "100%", padding: "15px", borderRadius: 14, border: "none",
                  background: loading ? (isLogin ? "rgba(99,102,241,0.4)" : "rgba(6,182,212,0.4)") : `linear-gradient(135deg,${accent},${accentEnd})`,
                  color: "white", fontSize: 15, fontWeight: 700, cursor: loading ? "not-allowed" : "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 9,
                  boxShadow: loading ? "none" : `0 0 30px ${glowColor}, 0 4px 20px ${glowColor}`,
                  transition: "all 0.25s", letterSpacing: -0.2, position: "relative", overflow: "hidden",
                  animation: isLogin ? "none" : "electricPulse 3s ease-in-out infinite",
                }}>
                {!loading && <span className="btn-shimmer" />}
                {loading ? <Loader2 size={17} style={{ animation: "spin 1s linear infinite" }} /> : (isLogin ? <Zap size={17} style={{ fill: "white" }} /> : <Sparkles size={17} />)}
                {loading ? "Please wait…" : (isLogin ? "Sign In" : "Create Account")}
              </button>
            </form>

            <p style={{ textAlign: "center", fontSize: 13, color: textMuted, marginTop: 22 }}>
              {isLogin ? "No account? " : "Already registered? "}
              <button onClick={() => { setMode(isLogin ? "register" : "login"); setError(""); }}
                style={{ background: "none", border: "none", cursor: "pointer", color: accent, fontWeight: 700, fontSize: 13, padding: 0, textDecoration: "underline", textUnderlineOffset: 3, transition: "opacity 0.2s" }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.opacity = "0.7"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.opacity = "1"; }}>
                {isLogin ? "Sign up free →" : "Sign in →"}
              </button>
            </p>
          </div>
        </div>
      </div>

      {/* Bottom badge */}
      <div style={{ marginTop: 30, display: "flex", alignItems: "center", gap: 8, animation: "slideUpCard 0.7s 0.5s cubic-bezier(0.16,1,0.3,1) forwards", opacity: 0, zIndex: 10 }}>
        <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#10b981", animation: "breathe 2s ease-in-out infinite", boxShadow: "0 0 8px rgba(16,185,129,0.7)" }} />
        <span style={{ fontSize: 12, color: textMuted }}>Encrypted & synced with Insforge</span>
      </div>

      <style>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.1; transform: scale(0.8); }
          50% { opacity: 0.9; transform: scale(1.3); }
        }
        @keyframes floatOrbA {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -40px) scale(1.05); }
          66% { transform: translate(-20px, 20px) scale(0.97); }
        }
        @keyframes floatOrbB {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(-40px, 30px) scale(1.04); }
          66% { transform: translate(25px, -20px) scale(0.98); }
        }
        @keyframes slideUpCard {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulseLogoBg {
          0%, 100% { box-shadow: 0 0 25px rgba(99,102,241,0.45); }
          50% { box-shadow: 0 0 50px rgba(168,85,247,0.7), 0 0 80px rgba(99,102,241,0.3); }
        }
        @keyframes neonLogoBg {
          0%, 100% { box-shadow: 0 0 20px rgba(6,182,212,0.5); }
          50% { box-shadow: 0 0 45px rgba(6,182,212,0.8), 0 0 70px rgba(16,185,129,0.3); }
        }
        @keyframes loginBorderGlow {
          0%, 100% { opacity: 0.7; }
          50% { opacity: 1; }
        }
        @keyframes cyanBorderGlow {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }
        @keyframes gridScroll {
          from { background-position: 0 0; }
          to { background-position: 0 44px; }
        }
        @keyframes cyberParticle {
          0%, 100% { opacity: 0; transform: translateY(0) scale(0.5); }
          10% { opacity: 1; }
          50% { opacity: 0.7; transform: translateY(-40px) scale(1.2); }
          90% { opacity: 0.3; }
        }
        @keyframes scanDown {
          0% { background-position: 0 -100vh; }
          100% { background-position: 0 100vh; }
        }
        @keyframes rotateSlow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes shakeError {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-6px); }
          40% { transform: translateX(6px); }
          60% { transform: translateX(-4px); }
          80% { transform: translateX(4px); }
        }
        @keyframes breathe {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.5); opacity: 0.7; }
        }
        @keyframes starPop {
          from { opacity: 0; transform: scale(0) rotate(-30deg); }
          to { opacity: 1; transform: scale(1) rotate(0); }
        }
        @keyframes electricPulse {
          0%, 100% { box-shadow: 0 0 20px rgba(6,182,212,0.3), 0 4px 15px rgba(6,182,212,0.2); }
          50% { box-shadow: 0 0 40px rgba(6,182,212,0.5), 0 4px 25px rgba(16,185,129,0.3), 0 0 60px rgba(6,182,212,0.2); }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        .btn-shimmer {
          position: absolute;
          top: 0; left: -100%;
          width: 80%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.18), transparent);
          animation: shimmerSweep 3s 1s ease-in-out infinite;
          pointer-events: none;
        }
        @keyframes shimmerSweep {
          0% { left: -100%; }
          40%, 100% { left: 200%; }
        }
        .submit-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          filter: brightness(1.1);
        }
        .submit-btn:active:not(:disabled) {
          transform: translateY(0px) scale(0.98);
        }
      `}</style>
    </div>
  );
}
