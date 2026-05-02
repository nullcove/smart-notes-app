"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  FileText, Star, Tag, Search, Moon, Download, Pin, Eye, Keyboard,
  Zap, Lock, Cloud, ArrowRight, CheckCircle, Sparkles, BookOpen,
  BarChart2, ChevronDown, Cpu, Wand2, Settings, LogIn
} from "lucide-react";

const APP_LINK = "/notes";
const AUTH_LINK = "/auth";

const features = [
  { icon: Eye, title: "Markdown Preview", desc: "Instant markdown rendering with headings, bold, lists, tables, and code blocks." },
  { icon: Wand2, title: "Gemini AI", desc: "Summarize, improve, continue writing, generate titles, fix grammar — all via your Gemini key." },
  { icon: Pin, title: "Pin Notes", desc: "Pin important notes to the top so they're always the first thing you see." },
  { icon: Star, title: "Star & Archive", desc: "Star favourites, archive old notes, move to trash. Full note lifecycle in one UI." },
  { icon: Tag, title: "Tags & Filters", desc: "Create tags and instantly filter your note list with a single click." },
  { icon: Search, title: "Instant Search", desc: "Full-text search across every note. Results update as you type." },
  { icon: Download, title: "Export Markdown", desc: "Download any note as a .md file in one click. Your notes are always yours." },
  { icon: BarChart2, title: "Live Word Count", desc: "Words, characters, reading time — updating live as you write." },
  { icon: Moon, title: "Dark / Light Mode", desc: "Beautiful dark and light themes. Your preference is remembered." },
  { icon: Keyboard, title: "Keyboard Shortcuts", desc: "⌘N create · ⌘K search · ⌘P preview · ⌘, AI settings. Power-user ready." },
  { icon: Lock, title: "Privacy First", desc: "No ads, no tracking, no selling data. Your API key never leaves your browser." },
  { icon: Cloud, title: "Cloud Sync", desc: "Notes sync across all devices via Insforge backend instantly." },
];

const plugins = [
  "Gemini AI", "Markdown", "Word Count", "Pin Notes", "Dark Mode",
  "Export .md", "Keyboard Shortcuts", "Live Search", "Tags", "Auto-save",
  "Starred", "Archive", "Trash", "Improve Writing", "Summarize",
  "Fix Grammar", "Generate Title", "Continue Writing",
];

const testimonials = [
  { name: "Sarah K.", role: "Product Designer", text: "The AI writing features are incredible. Summarize + Improve Writing saved me hours every week." },
  { name: "James T.", role: "Software Engineer", text: "Finally a notes app that gets out of my way. Keyboard shortcuts and instant search are perfect." },
  { name: "Amara D.", role: "Writer", text: "Smart Ins-Note with Gemini AI is the best writing assistant I've ever used. The 3-panel layout is genius." },
];

function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let W = 0, H = 0;

    const particles: Array<{ x: number; y: number; vx: number; vy: number; r: number; alpha: number; color: string }> = [];
    const colors = ["99,102,241", "139,92,246", "168,85,247", "96,165,250", "232,121,249"];

    function resize() {
      W = canvas!.width = window.innerWidth;
      H = canvas!.height = window.innerHeight;
    }

    function init() {
      particles.length = 0;
      const count = Math.min(80, Math.floor(W * H / 14000));
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * W, y: Math.random() * H,
          vx: (Math.random() - 0.5) * 0.3, vy: (Math.random() - 0.5) * 0.3,
          r: Math.random() * 2 + 0.5,
          alpha: Math.random() * 0.5 + 0.1,
          color: colors[Math.floor(Math.random() * colors.length)],
        });
      }
    }

    function draw() {
      ctx!.clearRect(0, 0, W, H);
      for (const p of particles) {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
        if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;

        ctx!.beginPath();
        ctx!.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(${p.color},${p.alpha})`;
        ctx!.fill();
      }

      // Draw connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx!.beginPath();
            ctx!.moveTo(particles[i].x, particles[i].y);
            ctx!.lineTo(particles[j].x, particles[j].y);
            ctx!.strokeStyle = `rgba(99,102,241,${0.12 * (1 - dist / 120)})`;
            ctx!.lineWidth = 0.5;
            ctx!.stroke();
          }
        }
      }

      animId = requestAnimationFrame(draw);
    }

    resize();
    init();
    draw();
    window.addEventListener("resize", () => { resize(); init(); });

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas ref={canvasRef} style={{ position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none" }} />
  );
}

function useScrollReveal() {
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>("[data-reveal]");
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            (e.target as HTMLElement).style.opacity = "1";
            (e.target as HTMLElement).style.transform = "translateY(0)";
            obs.unobserve(e.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    els.forEach(el => {
      el.style.opacity = "0";
      el.style.transform = "translateY(28px)";
      el.style.transition = "opacity 0.65s ease, transform 0.65s ease";
      obs.observe(el);
    });
    return () => obs.disconnect();
  }, []);
}

function FloatingOrbs() {
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none", zIndex: 0 }}>
      <div style={{ position: "absolute", top: "-10%", left: "20%", width: 700, height: 700, borderRadius: "50%", background: "radial-gradient(circle,rgba(99,102,241,0.14),transparent 65%)", animation: "orbFloat1 12s ease-in-out infinite" }} />
      <div style={{ position: "absolute", top: "30%", right: "-15%", width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(circle,rgba(139,92,246,0.10),transparent 65%)", animation: "orbFloat2 15s ease-in-out infinite" }} />
      <div style={{ position: "absolute", bottom: "-5%", left: "40%", width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle,rgba(232,121,249,0.08),transparent 65%)", animation: "orbFloat3 18s ease-in-out infinite" }} />
    </div>
  );
}

export function LandingPage() {
  useScrollReveal();
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });

  useEffect(() => {
    function onMove(e: MouseEvent) {
      setMousePos({ x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight });
    }
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: "#07070f", color: "#f0f0ff", overflowX: "hidden", fontFamily: "-apple-system,BlinkMacSystemFont,'Inter',sans-serif" }}>
      <style>{`
        @keyframes orbFloat1 { 0%,100%{transform:translate(0,0) scale(1)} 33%{transform:translate(40px,-30px) scale(1.05)} 66%{transform:translate(-20px,20px) scale(0.97)} }
        @keyframes orbFloat2 { 0%,100%{transform:translate(0,0) scale(1)} 33%{transform:translate(-30px,40px) scale(1.03)} 66%{transform:translate(20px,-20px) scale(0.98)} }
        @keyframes orbFloat3 { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(-40px,-30px) scale(1.04)} }
        @keyframes gradShift { 0%,100%{background-position:0% 50%} 50%{background-position:100% 50%} }
        @keyframes pulse { 0%,100%{box-shadow:0 0 30px rgba(99,102,241,0.4)} 50%{box-shadow:0 0 60px rgba(99,102,241,0.7)} }
        @keyframes badgeBounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-3px)} }
        @keyframes scanline { 0%{transform:translateY(-100%)} 100%{transform:translateY(100%)} }
        @keyframes borderGlow { 0%,100%{border-color:rgba(99,102,241,0.2)} 50%{border-color:rgba(139,92,246,0.5)} }
        .hero-cta-primary:hover { transform:translateY(-2px); box-shadow:0 0 60px rgba(99,102,241,0.65)!important; }
        .hero-cta-secondary:hover { background:rgba(255,255,255,0.07)!important; }
        .feat-card:hover { border-color:rgba(99,102,241,0.4)!important; background:rgba(99,102,241,0.06)!important; transform:translateY(-5px); }
        .nav-link:hover { color:#e2e8f0!important; }
        .testi-card:hover { border-color:rgba(99,102,241,0.3)!important; }
        .plugin-badge { animation:badgeBounce 3s ease-in-out infinite; }
        .plugin-badge:nth-child(2n){animation-delay:0.3s} .plugin-badge:nth-child(3n){animation-delay:0.6s} .plugin-badge:nth-child(4n){animation-delay:0.9s}
        * { box-sizing:border-box; }
      `}</style>

      {/* Navbar */}
      <header style={{ position: "sticky", top: 0, zIndex: 100, borderBottom: "1px solid rgba(255,255,255,0.06)", backdropFilter: "blur(24px)", background: "rgba(7,7,15,0.88)" }}>
        <div style={{ maxWidth: 1180, margin: "0 auto", padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 62 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 34, height: 34, borderRadius: 9, background: "linear-gradient(135deg,#6366f1,#8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", animation: "pulse 3s ease-in-out infinite" }}>
              <BookOpen size={17} color="white" strokeWidth={2} />
            </div>
            <span style={{ fontWeight: 900, fontSize: 18, letterSpacing: -0.5, background: "linear-gradient(90deg,#a5b4fc,#e879f9,#a5b4fc)", backgroundSize: "200% auto", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", animation: "gradShift 5s linear infinite" }}>
              Smart Ins-Note
            </span>
          </div>
          <nav style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <a href="#features" className="nav-link" style={{ padding: "7px 16px", borderRadius: 8, color: "#64748b", fontSize: 14, textDecoration: "none", transition: "color 0.15s" }}>Features</a>
            <a href="#plugins" className="nav-link" style={{ padding: "7px 16px", borderRadius: 8, color: "#64748b", fontSize: 14, textDecoration: "none", transition: "color 0.15s" }}>Plugins</a>
            <Link href={AUTH_LINK} style={{ padding: "7px 16px", borderRadius: 8, color: "#94a3b8", fontSize: 14, textDecoration: "none", display: "flex", alignItems: "center", gap: 6, transition: "color 0.15s" }}
              onMouseEnter={e => ((e.currentTarget as HTMLAnchorElement).style.color = "#e2e8f0")}
              onMouseLeave={e => ((e.currentTarget as HTMLAnchorElement).style.color = "#94a3b8")}>
              <LogIn size={13} /> Sign In
            </Link>
            <Link href={APP_LINK} style={{ marginLeft: 6, padding: "8px 20px", borderRadius: 10, background: "linear-gradient(135deg,#6366f1,#8b5cf6)", color: "white", fontSize: 14, fontWeight: 700, textDecoration: "none", display: "flex", alignItems: "center", gap: 6, transition: "box-shadow 0.2s,transform 0.2s", boxShadow: "0 0 20px rgba(99,102,241,0.35)" }}
              onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 0 35px rgba(99,102,241,0.6)"; (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(-1px)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 0 20px rgba(99,102,241,0.35)"; (e.currentTarget as HTMLAnchorElement).style.transform = "none"; }}>
              Open App <ArrowRight size={13} />
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section style={{ minHeight: "92vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "80px 24px 60px", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <ParticleCanvas />
        <FloatingOrbs />

        {/* Parallax mouse highlight */}
        <div style={{ position: "absolute", width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(circle,rgba(99,102,241,0.08),transparent 70%)", transform: `translate(${(mousePos.x - 0.5) * 40}px, ${(mousePos.y - 0.5) * 40}px)`, pointerEvents: "none", transition: "transform 0.3s ease-out", zIndex: 0 }} />

        <div style={{ position: "relative", zIndex: 1 }}>
          {/* Badges */}
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center", marginBottom: 36 }}>
            {[
              { label: "Free Forever", color: "99,102,241" },
              { label: "AI-Powered", color: "139,92,246" },
              { label: "Privacy First", color: "232,121,249" },
            ].map((b, i) => (
              <span key={b.label} style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "5px 14px", borderRadius: 20, background: `rgba(${b.color},0.1)`, border: `1px solid rgba(${b.color},0.3)`, fontSize: 12, color: `rgb(${b.color})`, animationDelay: `${i * 0.2}s` }}>
                <CheckCircle size={11} /> {b.label}
              </span>
            ))}
          </div>

          {/* Headline */}
          <h1 style={{ fontSize: "clamp(42px,7.5vw,88px)", fontWeight: 900, lineHeight: 1.03, letterSpacing: -2.5, marginBottom: 26, maxWidth: 900 }}>
            <span style={{ background: "linear-gradient(135deg,#ffffff 0%,#c7d2fe 40%,#a78bfa 100%)", backgroundSize: "200% auto", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", animation: "gradShift 6s linear infinite", display: "block" }}>
              Notes powered
            </span>
            <span style={{ background: "linear-gradient(135deg,#e879f9,#a78bfa,#60a5fa,#e879f9)", backgroundSize: "200% auto", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", animation: "gradShift 4s linear infinite reverse", display: "block" }}>
              by AI intelligence
            </span>
          </h1>

          <p style={{ fontSize: "clamp(16px,2.2vw,21px)", color: "#64748b", lineHeight: 1.75, maxWidth: 580, marginBottom: 50, margin: "0 auto 50px" }}>
            Smart Ins-Note combines a beautiful Standard Notes-style editor with Google Gemini AI features, cloud sync, tags, and a powerful plugin system.
          </p>

          {/* CTAs */}
          <div style={{ display: "flex", gap: 14, flexWrap: "wrap", justifyContent: "center", marginBottom: 68 }}>
            <Link href={APP_LINK} className="hero-cta-primary"
              style={{ padding: "16px 38px", borderRadius: 14, background: "linear-gradient(135deg,#6366f1,#8b5cf6)", color: "white", fontSize: 17, fontWeight: 700, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 10, boxShadow: "0 0 40px rgba(99,102,241,0.45)", transition: "all 0.2s" }}>
              <Sparkles size={20} /> Start Writing Free
            </Link>
            <Link href={AUTH_LINK} className="hero-cta-secondary"
              style={{ padding: "16px 38px", borderRadius: 14, border: "1px solid rgba(165,180,252,0.2)", color: "#c7d2fe", fontSize: 17, fontWeight: 600, textDecoration: "none", background: "rgba(255,255,255,0.03)", backdropFilter: "blur(10px)", display: "inline-flex", alignItems: "center", gap: 10, transition: "background 0.2s" }}>
              <LogIn size={18} /> Create Account
            </Link>
          </div>

          {/* Stats */}
          <div style={{ display: "flex", gap: 32, justifyContent: "center", marginBottom: 64, flexWrap: "wrap" }}>
            {[["12+", "Built-in Features"], ["AI", "Gemini Powered"], ["100%", "Privacy First"]].map(([val, label]) => (
              <div key={label} style={{ textAlign: "center" }}>
                <div style={{ fontSize: 28, fontWeight: 900, background: "linear-gradient(135deg,#a5b4fc,#e879f9)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{val}</div>
                <div style={{ fontSize: 12, color: "#334155", marginTop: 2 }}>{label}</div>
              </div>
            ))}
          </div>

          {/* App preview */}
          <div style={{ width: "100%", maxWidth: 920, margin: "0 auto", borderRadius: 20, overflow: "hidden", border: "1px solid rgba(99,102,241,0.15)", boxShadow: "0 40px 120px rgba(0,0,0,0.65), 0 0 0 1px rgba(255,255,255,0.03) inset", background: "#0c0c1a", animation: "borderGlow 4s ease-in-out infinite", position: "relative" }}>
            {/* Scanline effect */}
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom,transparent 50%,rgba(0,0,0,0.03) 50%)", backgroundSize: "100% 4px", zIndex: 2, pointerEvents: "none", opacity: 0.3 }} />
            {/* Window bar */}
            <div style={{ padding: "11px 18px", background: "#0f0f1e", borderBottom: "1px solid rgba(255,255,255,0.05)", display: "flex", alignItems: "center", gap: 8, position: "relative", zIndex: 3 }}>
              {["#f87171","#fbbf24","#34d399"].map(c => <div key={c} style={{ width: 11, height: 11, borderRadius: "50%", background: c, flexShrink: 0 }} />)}
              <div style={{ marginLeft: 10, flex: 1, background: "rgba(255,255,255,0.05)", borderRadius: 5, padding: "3px 12px", fontSize: 10, color: "#6366f1", textAlign: "center" }}>smart-ins-note.app/notes</div>
              <Cpu size={11} color="#818cf8" />
              <span style={{ fontSize: 10, color: "#818cf8" }}>Gemini AI</span>
            </div>
            {/* 3-panel */}
            <div style={{ display: "grid", gridTemplateColumns: "160px 230px 1fr", height: 320, position: "relative", zIndex: 3 }}>
              {/* Sidebar */}
              <div style={{ borderRight: "1px solid rgba(255,255,255,0.04)", padding: "12px 8px", background: "#0a0a17" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 14, padding: "0 4px" }}>
                  <div style={{ width: 20, height: 20, borderRadius: 5, background: "linear-gradient(135deg,#6366f1,#8b5cf6)" }} />
                  <span style={{ fontWeight: 800, fontSize: 11, background: "linear-gradient(90deg,#a5b4fc,#e879f9)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Smart Ins-Note</span>
                </div>
                {[["📄","Notes",true],["📌","Pinned",false],["⭐","Starred",false],["📦","Archived",false],["🗑","Trash",false]].map(([icon,v,active]) => (
                  <div key={String(v)} style={{ padding: "5px 8px", borderRadius: 6, marginBottom: 2, background: active ? "rgba(99,102,241,0.18)" : "transparent", color: active ? "#a5b4fc" : "#374151", fontSize: 11, display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{ fontSize: 10 }}>{icon}</span>{v}
                  </div>
                ))}
                <div style={{ margin: "10px 4px 6px", fontSize: 8, color: "#1e293b", textTransform: "uppercase", letterSpacing: 1 }}>AI Settings</div>
                <div style={{ padding: "5px 8px", borderRadius: 6, background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.2)", color: "#818cf8", fontSize: 10, display: "flex", alignItems: "center", gap: 5 }}>
                  <Settings size={9} /> Gemini AI ✓
                </div>
              </div>
              {/* Note list */}
              <div style={{ borderRight: "1px solid rgba(255,255,255,0.04)", padding: "10px", background: "#0c0c1a" }}>
                <div style={{ marginBottom: 8, padding: "5px 8px", background: "rgba(255,255,255,0.04)", borderRadius: 6, fontSize: 10, color: "#374151", display: "flex", gap: 5, alignItems: "center" }}>
                  <Search size={9} /> Search notes…
                </div>
                {[
                  { t: "📌 Q3 Planning", p: "Strategic goals and milestones for Q3…", sel: false, ai: false },
                  { t: "AI: Project Ideas", p: "Build a markdown-first smart notes app…", sel: true, ai: true },
                  { t: "⭐ Research Notes", p: "Key findings from the user interviews…", sel: false, ai: false },
                  { t: "Daily Journal", p: "Productive day. Finished the AI integr…", sel: false, ai: false },
                ].map((n, i) => (
                  <div key={i} style={{ padding: "8px 8px", borderRadius: 8, marginBottom: 4, background: n.sel ? "rgba(99,102,241,0.12)" : "rgba(255,255,255,0.015)", border: `1px solid ${n.sel ? "rgba(99,102,241,0.22)" : "rgba(255,255,255,0.03)"}` }}>
                    <div style={{ fontSize: 10, fontWeight: 600, color: n.sel ? "#a5b4fc" : "#9ca3af", marginBottom: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", display: "flex", alignItems: "center", gap: 4 }}>
                      {n.ai && <Sparkles size={8} color="#818cf8" />}{n.t}
                    </div>
                    <div style={{ fontSize: 9, color: "#374151", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{n.p}</div>
                  </div>
                ))}
              </div>
              {/* Editor */}
              <div style={{ padding: "14px 18px", background: "#0d0d1c" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10, paddingBottom: 8, borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                  <span style={{ fontSize: 9, color: "#1e293b" }}>Saturday, May 2 · 4:30 PM</span>
                  <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 4, padding: "3px 8px", borderRadius: 5, background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.25)" }}>
                      <Sparkles size={8} color="#818cf8" />
                      <span style={{ fontSize: 9, color: "#818cf8", fontWeight: 700 }}>AI</span>
                    </div>
                    <span style={{ fontSize: 9, color: "#374151" }}>👁 📥 📌 ⭐</span>
                  </div>
                </div>
                <div style={{ fontSize: 15, fontWeight: 700, color: "#e2e8f0", marginBottom: 10 }}>Project Ideas</div>
                <div style={{ fontSize: 11, color: "#6b7280", fontFamily: "monospace", lineHeight: 1.9 }}>
                  <span style={{ color: "#7c3aed" }}># </span><span style={{ color: "#c4b5fd" }}>Smart Ins-Note Features</span><br />
                  <span style={{ color: "#059669" }}>## </span><span style={{ color: "#6ee7b7" }}>AI Integration</span><br />
                  <span style={{ color: "#4b5563" }}>- </span><span style={{ color: "#d1d5db" }}>Gemini AI summarize ✓</span><br />
                  <span style={{ color: "#4b5563" }}>- </span><span style={{ color: "#d1d5db" }}>Improve writing ✓</span><br />
                  <span style={{ color: "#4b5563" }}>- </span><span style={{ color: "#d1d5db" }}>Generate titles ✓</span>
                </div>
                <div style={{ marginTop: 14, padding: "8px 10px", borderRadius: 8, background: "rgba(99,102,241,0.06)", border: "1px solid rgba(99,102,241,0.15)" }}>
                  <div style={{ fontSize: 9, color: "#818cf8", fontWeight: 700, marginBottom: 4, display: "flex", alignItems: "center", gap: 4 }}>
                    <Sparkles size={9} /> AI: Improve Writing
                  </div>
                  <div style={{ fontSize: 9, color: "#64748b", lineHeight: 1.6 }}>Smart Ins-Note seamlessly integrates Gemini AI to enhance your writing workflow…</div>
                </div>
                <div style={{ marginTop: 10, display: "flex", gap: 10, fontSize: 9, color: "#374151" }}>
                  <span>52 words</span><span>✨ AI enabled</span><span style={{ color: "#6366f1", marginLeft: "auto" }}>Auto-saved</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div style={{ marginTop: 48, display: "flex", flexDirection: "column", alignItems: "center", gap: 6, color: "#1e293b", position: "relative", zIndex: 1 }}>
          <span style={{ fontSize: 11 }}>Discover all features</span>
          <ChevronDown size={16} style={{ animation: "badgeBounce 2s ease-in-out infinite" }} />
        </div>
      </section>

      {/* Features */}
      <section id="features" style={{ padding: "90px 24px", maxWidth: 1180, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 64 }} data-reveal>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "5px 14px", borderRadius: 20, background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.25)", fontSize: 12, color: "#a5b4fc", marginBottom: 16 }}>
            <Zap size={11} /> Everything you need, nothing you don&apos;t
          </span>
          <h2 style={{ fontSize: "clamp(28px,4vw,50px)", fontWeight: 900, letterSpacing: -1.5, marginTop: 14, marginBottom: 16, color: "#f1f5f9" }}>
            Packed with{" "}
            <span style={{ background: "linear-gradient(135deg,#818cf8,#e879f9)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              powerful features
            </span>
          </h2>
          <p style={{ color: "#475569", fontSize: 18, maxWidth: 500, margin: "0 auto" }}>Every feature ships with the app. No subscriptions, no premium tiers.</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(265px,1fr))", gap: 18 }}>
          {features.map(({ icon: Icon, title, desc }, i) => (
            <div key={title} className="feat-card" data-reveal
              style={{ padding: 26, borderRadius: 18, border: "1px solid rgba(255,255,255,0.05)", background: "rgba(255,255,255,0.015)", transition: "all 0.25s", cursor: "default", transitionDelay: `${i * 0.04}s` }}>
              <div style={{ width: 48, height: 48, borderRadius: 13, background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.18)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 18 }}>
                <Icon size={22} color="#818cf8" />
              </div>
              <h3 style={{ fontWeight: 700, fontSize: 15, marginBottom: 8, color: "#e2e8f0" }}>{title}</h3>
              <p style={{ fontSize: 13.5, color: "#475569", lineHeight: 1.65 }}>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* AI Highlight */}
      <section style={{ padding: "80px 24px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg,rgba(99,102,241,0.05) 0%,rgba(139,92,246,0.05) 50%,rgba(232,121,249,0.03) 100%)" }} />
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "center", position: "relative" }}>
          <div data-reveal>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "5px 14px", borderRadius: 20, background: "rgba(139,92,246,0.12)", border: "1px solid rgba(139,92,246,0.3)", fontSize: 12, color: "#c4b5fd", marginBottom: 20 }}>
              <Cpu size={11} /> Google Gemini Integration
            </span>
            <h2 style={{ fontSize: "clamp(26px,3.5vw,44px)", fontWeight: 900, letterSpacing: -1, marginBottom: 18, color: "#f1f5f9", lineHeight: 1.15 }}>
              AI that works inside your notes
            </h2>
            <p style={{ color: "#64748b", fontSize: 16, lineHeight: 1.75, marginBottom: 28 }}>
              Add your Gemini API key once in Settings — it stays in your browser, never on our servers. Then use 9 AI actions right inside any note.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {[
                ["✨", "Improve Writing", "Enhance clarity, flow, and style"],
                ["📝", "Summarize", "Get a concise summary in seconds"],
                ["🏷️", "Generate Title", "AI suggests the perfect title"],
                ["🔧", "Fix Grammar", "Correct all errors automatically"],
                ["💡", "Brainstorm", "Generate related ideas and questions"],
              ].map(([emoji, label, desc]) => (
                <div key={label} style={{ display: "flex", alignItems: "center", gap: 14, padding: "12px 16px", borderRadius: 12, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}>
                  <span style={{ fontSize: 20, flexShrink: 0 }}>{emoji}</span>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: "#e2e8f0" }}>{label}</div>
                    <div style={{ fontSize: 12, color: "#475569" }}>{desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div data-reveal style={{ transitionDelay: "0.2s" }}>
            <div style={{ borderRadius: 18, overflow: "hidden", border: "1px solid rgba(99,102,241,0.2)", boxShadow: "0 20px 80px rgba(0,0,0,0.4)", background: "#0c0c1a" }}>
              <div style={{ padding: "12px 16px", background: "#0f0f1e", borderBottom: "1px solid rgba(255,255,255,0.05)", display: "flex", alignItems: "center", gap: 8 }}>
                <Sparkles size={13} color="#818cf8" />
                <span style={{ fontSize: 12, color: "#818cf8", fontWeight: 700 }}>AI Actions — Gemini</span>
              </div>
              {[
                { emoji: "✨", label: "Improve Writing", desc: "Enhance clarity & flow" },
                { emoji: "📝", label: "Summarize", desc: "Get a concise summary" },
                { emoji: "🔧", label: "Fix Grammar", desc: "Correct errors" },
                { emoji: "➡️", label: "Continue Writing", desc: "AI continues your text" },
                { emoji: "📉", label: "Make Shorter", desc: "Condense by ~40%" },
              ].map(action => (
                <div key={action.label} style={{ display: "flex", alignItems: "center", gap: 12, padding: "11px 16px", borderBottom: "1px solid rgba(255,255,255,0.03)", cursor: "pointer" }}
                  onMouseEnter={e => (e.currentTarget.style.background = "rgba(99,102,241,0.07)")}
                  onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                  <span style={{ fontSize: 18 }}>{action.emoji}</span>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "#e2e8f0" }}>{action.label}</div>
                    <div style={{ fontSize: 11, color: "#475569" }}>{action.desc}</div>
                  </div>
                </div>
              ))}
              <div style={{ padding: "14px 16px", display: "flex", alignItems: "center", gap: 10, background: "rgba(99,102,241,0.04)" }}>
                <div style={{ flex: 1, height: 1, background: "var(--border, rgba(255,255,255,0.06))" }} />
                <button style={{ padding: "7px 14px", borderRadius: 8, border: "none", background: "linear-gradient(135deg,#6366f1,#8b5cf6)", color: "white", fontSize: 11, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: 5 }}>
                  <Settings size={11} /> Set API Key
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Plugins */}
      <section id="plugins" style={{ padding: "70px 24px", borderTop: "1px solid rgba(255,255,255,0.04)", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
        <div style={{ maxWidth: 860, margin: "0 auto", textAlign: "center" }}>
          <h2 style={{ fontSize: "clamp(24px,3.5vw,42px)", fontWeight: 900, letterSpacing: -1, marginBottom: 14, color: "#f1f5f9" }} data-reveal>
            All plugins included
          </h2>
          <p style={{ color: "#475569", marginBottom: 36, fontSize: 16 }}>No plugin store. No paid add-ons. Every capability ships built-in.</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10, justifyContent: "center" }}>
            {plugins.map((p, i) => (
              <span key={p} className="plugin-badge"
                style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "7px 16px", borderRadius: 20, background: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.22)", fontSize: 13, color: "#c7d2fe", animationDelay: `${i * 0.15}s` }}>
                <CheckCircle size={12} /> {p}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section style={{ padding: "90px 24px", maxWidth: 1100, margin: "0 auto" }}>
        <h2 style={{ fontSize: "clamp(24px,3.5vw,42px)", fontWeight: 900, letterSpacing: -1, textAlign: "center", marginBottom: 52, color: "#f1f5f9" }} data-reveal>
          Loved by note-takers
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))", gap: 22 }}>
          {testimonials.map((t, i) => (
            <div key={t.name} className="testi-card" data-reveal
              style={{ padding: 28, borderRadius: 18, border: "1px solid rgba(255,255,255,0.05)", background: "rgba(255,255,255,0.015)", transition: "border-color 0.2s", transitionDelay: `${i * 0.1}s` }}>
              <div style={{ display: "flex", gap: 3, marginBottom: 16 }}>
                {[1,2,3,4,5].map(i => <span key={i} style={{ color: "#fbbf24", fontSize: 15 }}>★</span>)}
              </div>
              <p style={{ color: "#64748b", fontSize: 14, lineHeight: 1.8, marginBottom: 20 }}>"{t.text}"</p>
              <div style={{ fontWeight: 700, fontSize: 13, color: "#e2e8f0" }}>{t.name}</div>
              <div style={{ fontSize: 12, color: "#334155" }}>{t.role}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: "90px 24px", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle at 50% 50%, rgba(99,102,241,0.12) 0%, transparent 60%)", pointerEvents: "none" }} />
        <FloatingOrbs />
        <div style={{ maxWidth: 620, margin: "0 auto", position: "relative", zIndex: 1 }} data-reveal>
          <h2 style={{ fontSize: "clamp(30px,4.5vw,56px)", fontWeight: 900, letterSpacing: -1.5, marginBottom: 18, background: "linear-gradient(135deg,#ffffff,#a78bfa,#e879f9)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            Start writing smarter today
          </h2>
          <p style={{ color: "#475569", fontSize: 18, marginBottom: 36 }}>
            Free forever. Add your Gemini key for AI superpowers.
          </p>
          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
            <Link href={APP_LINK}
              style={{ padding: "17px 44px", borderRadius: 14, background: "linear-gradient(135deg,#6366f1,#8b5cf6)", color: "white", fontSize: 17, fontWeight: 700, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 10, boxShadow: "0 0 50px rgba(99,102,241,0.45)", animation: "pulse 3s ease-in-out infinite" }}>
              <Sparkles size={20} /> Open Smart Ins-Note
            </Link>
            <Link href={AUTH_LINK}
              style={{ padding: "17px 32px", borderRadius: 14, border: "1px solid rgba(165,180,252,0.2)", color: "#c7d2fe", fontSize: 17, fontWeight: 600, textDecoration: "none", background: "rgba(255,255,255,0.03)", display: "inline-flex", alignItems: "center", gap: 10 }}>
              <LogIn size={18} /> Sign Up Free
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: "1px solid rgba(255,255,255,0.05)", padding: "24px 32px" }}>
        <div style={{ maxWidth: 1180, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
            <div style={{ width: 26, height: 26, borderRadius: 7, background: "linear-gradient(135deg,#6366f1,#8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <BookOpen size={13} color="white" />
            </div>
            <span style={{ fontWeight: 800, fontSize: 14, background: "linear-gradient(90deg,#a5b4fc,#e879f9)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Smart Ins-Note</span>
          </div>
          <div style={{ display: "flex", gap: 24 }}>
            <a href="#features" style={{ fontSize: 13, color: "#334155", textDecoration: "none" }}>Features</a>
            <a href="#plugins" style={{ fontSize: 13, color: "#334155", textDecoration: "none" }}>Plugins</a>
            <Link href={AUTH_LINK} style={{ fontSize: 13, color: "#334155", textDecoration: "none" }}>Sign In</Link>
            <Link href={APP_LINK} style={{ fontSize: 13, color: "#6366f1", textDecoration: "none", fontWeight: 600 }}>Open App →</Link>
          </div>
          <div style={{ fontSize: 12, color: "#1e293b" }}>© 2026 Smart Ins-Note · Powered by Insforge & Gemini</div>
        </div>
      </footer>
    </div>
  );
}
