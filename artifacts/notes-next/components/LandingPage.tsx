"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import {
  FileText, Star, Tag, Search, Moon, Download, Pin, Eye, Keyboard,
  Zap, Lock, Cloud, ArrowRight, CheckCircle, Sparkles, BookOpen,
  BarChart2, ChevronDown, Cpu, Wand2, Settings, LogIn, Globe,
  Shield, Bolt, Brain, PenLine, Hash, Archive, Trash2, Copy,
  AlignLeft, Layers, Timer, Twitter, Github, Command,
} from "lucide-react";

const APP_LINK = "/notes";
const AUTH_LINK = "/auth";

/* ─── Particle canvas ─── */
function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let animId: number;
    let W = 0, H = 0;
    const particles: { x: number; y: number; vx: number; vy: number; r: number; alpha: number; color: string }[] = [];
    const colors = ["99,102,241", "139,92,246", "168,85,247", "96,165,250", "232,121,249"];
    function resize() { W = canvas!.width = window.innerWidth; H = canvas!.height = window.innerHeight; }
    function init() {
      particles.length = 0;
      const n = Math.min(70, Math.floor(W * H / 15000));
      for (let i = 0; i < n; i++) particles.push({ x: Math.random() * W, y: Math.random() * H, vx: (Math.random() - 0.5) * 0.25, vy: (Math.random() - 0.5) * 0.25, r: Math.random() * 1.8 + 0.4, alpha: Math.random() * 0.45 + 0.08, color: colors[Math.floor(Math.random() * colors.length)] });
    }
    function draw() {
      ctx!.clearRect(0, 0, W, H);
      for (const p of particles) {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
        if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
        ctx!.beginPath(); ctx!.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(${p.color},${p.alpha})`; ctx!.fill();
      }
      for (let i = 0; i < particles.length; i++) for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x, dy = particles[i].y - particles[j].y;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < 110) { ctx!.beginPath(); ctx!.moveTo(particles[i].x, particles[i].y); ctx!.lineTo(particles[j].x, particles[j].y); ctx!.strokeStyle = `rgba(99,102,241,${0.1 * (1 - d / 110)})`; ctx!.lineWidth = 0.5; ctx!.stroke(); }
      }
      animId = requestAnimationFrame(draw);
    }
    resize(); init(); draw();
    window.addEventListener("resize", () => { resize(); init(); });
    return () => { cancelAnimationFrame(animId); };
  }, []);
  return <canvas ref={canvasRef} style={{ position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none" }} />;
}

/* ─── Grid dot background ─── */
function GridBg() {
  return (
    <div style={{ position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle, rgba(99,102,241,0.12) 1px, transparent 1px)", backgroundSize: "32px 32px", maskImage: "radial-gradient(ellipse 80% 80% at 50% 50%, black 30%, transparent 100%)" }} />
    </div>
  );
}

/* ─── Floating orbs ─── */
function FloatingOrbs({ variant = "hero" }: { variant?: "hero" | "cta" }) {
  if (variant === "cta") return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none", zIndex: 0 }}>
      <div style={{ position: "absolute", top: "-30%", left: "30%", width: 700, height: 700, borderRadius: "50%", background: "radial-gradient(circle,rgba(99,102,241,0.16),transparent 65%)", animation: "orbFloat1 14s ease-in-out infinite" }} />
      <div style={{ position: "absolute", bottom: "-20%", right: "20%", width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle,rgba(232,121,249,0.1),transparent 65%)", animation: "orbFloat3 18s ease-in-out infinite" }} />
    </div>
  );
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none", zIndex: 0 }}>
      <div style={{ position: "absolute", top: "-10%", left: "15%", width: 800, height: 800, borderRadius: "50%", background: "radial-gradient(circle,rgba(99,102,241,0.11),transparent 65%)", animation: "orbFloat1 13s ease-in-out infinite" }} />
      <div style={{ position: "absolute", top: "25%", right: "-18%", width: 650, height: 650, borderRadius: "50%", background: "radial-gradient(circle,rgba(139,92,246,0.09),transparent 65%)", animation: "orbFloat2 16s ease-in-out infinite" }} />
      <div style={{ position: "absolute", bottom: "-8%", left: "38%", width: 550, height: 550, borderRadius: "50%", background: "radial-gradient(circle,rgba(232,121,249,0.07),transparent 65%)", animation: "orbFloat3 19s ease-in-out infinite" }} />
    </div>
  );
}

/* ─── Scroll reveal ─── */
function useScrollReveal() {
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>("[data-reveal]");
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          (e.target as HTMLElement).style.opacity = "1";
          (e.target as HTMLElement).style.transform = "translateY(0) scale(1)";
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.08 });
    els.forEach(el => {
      el.style.opacity = "0";
      el.style.transform = "translateY(32px) scale(0.98)";
      el.style.transition = "opacity 0.7s ease, transform 0.7s ease";
      obs.observe(el);
    });
    return () => obs.disconnect();
  }, []);
}

/* ─── Count-up ─── */
function useCountUp(target: number, duration = 1800) {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      obs.disconnect();
      const start = performance.now();
      function tick(now: number) {
        const p = Math.min((now - start) / duration, 1);
        const ease = 1 - Math.pow(1 - p, 3);
        setVal(Math.floor(ease * target));
        if (p < 1) requestAnimationFrame(tick);
        else setVal(target);
      }
      requestAnimationFrame(tick);
    }, { threshold: 0.5 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [target, duration]);
  return { val, ref };
}

/* ─── Typewriter cycling ─── */
const WORDS = ["smarter", "faster", "privately", "beautifully", "powerfully"];
function TypewriterWord() {
  const [idx, setIdx] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [deleting, setDeleting] = useState(false);
  useEffect(() => {
    const word = WORDS[idx];
    if (!deleting) {
      if (displayed.length < word.length) {
        const t = setTimeout(() => setDisplayed(word.slice(0, displayed.length + 1)), 80);
        return () => clearTimeout(t);
      } else {
        const t = setTimeout(() => setDeleting(true), 2200);
        return () => clearTimeout(t);
      }
    } else {
      if (displayed.length > 0) {
        const t = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 45);
        return () => clearTimeout(t);
      } else {
        setDeleting(false);
        setIdx((i) => (i + 1) % WORDS.length);
      }
    }
  }, [displayed, deleting, idx]);
  return (
    <span style={{ background: "linear-gradient(135deg,#e879f9,#a78bfa,#60a5fa,#e879f9)", backgroundSize: "200% auto", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", animation: "gradShift 4s linear infinite", display: "inline-block", minWidth: "3ch" }}>
      {displayed}<span style={{ WebkitTextFillColor: "#a78bfa", animation: "cursorBlink 1s step-end infinite", marginLeft: 2 }}>|</span>
    </span>
  );
}

/* ─── Animated mockup ─── */
function AppMockup() {
  const [typed, setTyped] = useState("");
  const text = "# Smart Ins-Note Features\n\n## AI Integration\n- Gemini AI summarize ✓\n- Improve writing ✓\n- Generate titles ✓\n- Fix grammar ✓";
  useEffect(() => {
    if (typed.length >= text.length) return;
    const t = setTimeout(() => setTyped(text.slice(0, typed.length + 1)), 28);
    return () => clearTimeout(t);
  }, [typed, text]);

  const lines = typed.split("\n");
  function renderLine(line: string, i: number) {
    if (line.startsWith("## ")) return <div key={i} style={{ color: "#6ee7b7", fontFamily: "monospace", fontSize: 11 }}><span style={{ color: "#059669" }}>## </span>{line.slice(3)}</div>;
    if (line.startsWith("# ")) return <div key={i} style={{ color: "#c4b5fd", fontFamily: "monospace", fontSize: 12, fontWeight: 700 }}><span style={{ color: "#7c3aed" }}># </span>{line.slice(2)}</div>;
    if (line.startsWith("- ")) return <div key={i} style={{ color: "#d1d5db", fontFamily: "monospace", fontSize: 10.5 }}><span style={{ color: "#4b5563" }}>- </span>{line.slice(2)}</div>;
    return <div key={i} style={{ color: "#6b7280", fontFamily: "monospace", fontSize: 10 }}>{line || "\u00A0"}</div>;
  }

  return (
    <div style={{ width: "100%", maxWidth: 940, margin: "0 auto", borderRadius: 20, overflow: "hidden", border: "1px solid rgba(99,102,241,0.18)", boxShadow: "0 40px 120px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.03) inset, 0 0 80px rgba(99,102,241,0.08)", background: "#0a0a16", position: "relative" }}>
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom,transparent 50%,rgba(0,0,0,0.03) 50%)", backgroundSize: "100% 4px", zIndex: 2, pointerEvents: "none", opacity: 0.25 }} />
      {/* Window chrome */}
      <div style={{ padding: "11px 18px", background: "#0e0e1d", borderBottom: "1px solid rgba(255,255,255,0.05)", display: "flex", alignItems: "center", gap: 8, position: "relative", zIndex: 3 }}>
        {["#f87171", "#fbbf24", "#34d399"].map(c => <div key={c} style={{ width: 11, height: 11, borderRadius: "50%", background: c }} />)}
        <div style={{ marginLeft: 10, flex: 1, background: "rgba(255,255,255,0.05)", borderRadius: 5, padding: "3px 12px", fontSize: 10, color: "#6366f1", textAlign: "center" }}>smart-ins-note.app/notes</div>
        <Cpu size={11} color="#818cf8" />
        <span style={{ fontSize: 10, color: "#818cf8" }}>Gemini AI</span>
      </div>
      {/* 3-panel */}
      <div style={{ display: "grid", gridTemplateColumns: "155px 220px 1fr", height: 310, position: "relative", zIndex: 3 }}>
        {/* Sidebar */}
        <div style={{ borderRight: "1px solid rgba(255,255,255,0.04)", padding: "12px 8px", background: "#090916" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 14, padding: "0 4px" }}>
            <div style={{ width: 20, height: 20, borderRadius: 5, background: "linear-gradient(135deg,#6366f1,#8b5cf6)" }} />
            <span style={{ fontWeight: 800, fontSize: 10.5, background: "linear-gradient(90deg,#a5b4fc,#e879f9)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Smart Ins-Note</span>
          </div>
          {[["📄", "Notes", true, 12], ["📌", "Pinned", false, 3], ["⭐", "Starred", false, 5], ["📦", "Archived", false, 0], ["🗑", "Trash", false, 4]].map(([icon, v, active, count]) => (
            <div key={String(v)} style={{ padding: "5px 8px", borderRadius: 6, marginBottom: 2, background: active ? "rgba(99,102,241,0.18)" : "transparent", color: active ? "#a5b4fc" : "#374151", fontSize: 10.5, display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ fontSize: 9.5 }}>{icon}</span>
              <span style={{ flex: 1 }}>{v}</span>
              {Number(count) > 0 && <span style={{ fontSize: 9, background: active ? "rgba(99,102,241,0.35)" : "rgba(255,255,255,0.06)", padding: "1px 5px", borderRadius: 8, color: active ? "#c7d2fe" : "#475569" }}>{String(count)}</span>}
            </div>
          ))}
          <div style={{ margin: "12px 4px 6px", fontSize: 7.5, color: "#1e293b", textTransform: "uppercase", letterSpacing: 1 }}>Tags</div>
          {[["#f472b6", "Personal"], ["#34d399", "Work"], ["#60a5fa", "Ideas"]].map(([color, label]) => (
            <div key={label} style={{ padding: "4px 8px", borderRadius: 6, marginBottom: 2, display: "flex", alignItems: "center", gap: 6, fontSize: 10 }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: color as string }} />
              <span style={{ color: "#2d3748" }}>{label}</span>
            </div>
          ))}
          <div style={{ margin: "10px 4px 4px" }}>
            <div style={{ padding: "5px 8px", borderRadius: 6, background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.2)", color: "#818cf8", fontSize: 9.5, display: "flex", alignItems: "center", gap: 5 }}>
              <Settings size={8} /> Gemini AI ✓
            </div>
          </div>
        </div>
        {/* Note list */}
        <div style={{ borderRight: "1px solid rgba(255,255,255,0.04)", padding: "10px", background: "#0b0b19" }}>
          <div style={{ marginBottom: 8, padding: "5px 8px", background: "rgba(255,255,255,0.04)", borderRadius: 6, fontSize: 9.5, color: "#374151", display: "flex", gap: 5, alignItems: "center" }}>
            <Search size={8.5} /> Search notes… (⌘K)
          </div>
          {[
            { t: "📌 Q3 Planning", p: "Strategic goals and milestones…", sel: false, ai: false, tag: "#60a5fa" },
            { t: "✨ Project Ideas", p: "Build a markdown-first smart notes…", sel: true, ai: true, tag: "#34d399" },
            { t: "⭐ Research Notes", p: "Key findings from user interviews…", sel: false, ai: false, tag: "#f472b6" },
            { t: "Daily Journal", p: "Productive day. Finished the AI…", sel: false, ai: false, tag: "" },
          ].map((n, i) => (
            <div key={i} style={{ padding: "8px", borderRadius: 8, marginBottom: 4, background: n.sel ? "rgba(99,102,241,0.12)" : "rgba(255,255,255,0.015)", border: `1px solid ${n.sel ? "rgba(99,102,241,0.25)" : "rgba(255,255,255,0.03)"}` }}>
              <div style={{ fontSize: 9.5, fontWeight: 600, color: n.sel ? "#a5b4fc" : "#9ca3af", marginBottom: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", display: "flex", alignItems: "center", gap: 4 }}>
                {n.ai && <Sparkles size={7.5} color="#818cf8" />}{n.t}
                {n.tag && <div style={{ marginLeft: "auto", width: 5, height: 5, borderRadius: "50%", background: n.tag, flexShrink: 0 }} />}
              </div>
              <div style={{ fontSize: 8.5, color: "#374151", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{n.p}</div>
            </div>
          ))}
        </div>
        {/* Editor */}
        <div style={{ padding: "12px 16px", background: "#0d0d1d", overflow: "hidden" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10, paddingBottom: 8, borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
            <span style={{ fontSize: 8.5, color: "#1e293b" }}>Saturday, May 2 · 4:30 PM</span>
            <div style={{ display: "flex", gap: 5, alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 3, padding: "2px 7px", borderRadius: 5, background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.25)" }}>
                <Sparkles size={7} color="#818cf8" /><span style={{ fontSize: 8, color: "#818cf8", fontWeight: 700 }}>AI</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 3 }}>
                <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#34d399", animation: "savePulse 2s ease-in-out infinite" }} />
                <span style={{ fontSize: 8, color: "#34d399" }}>Saved</span>
              </div>
            </div>
          </div>
          <div style={{ fontSize: 14, fontWeight: 700, color: "#e2e8f0", marginBottom: 10 }}>Project Ideas</div>
          <div style={{ lineHeight: 1.9, overflow: "hidden" }}>
            {lines.map((l, i) => renderLine(l, i))}
            {typed.length < text.length && <span style={{ display: "inline-block", width: 2, height: 11, background: "#818cf8", animation: "cursorBlink 1s step-end infinite", verticalAlign: "middle" }} />}
          </div>
          <div style={{ marginTop: 12, padding: "7px 10px", borderRadius: 8, background: "rgba(99,102,241,0.06)", border: "1px solid rgba(99,102,241,0.15)", display: "flex", alignItems: "flex-start", gap: 6 }}>
            <Sparkles size={9} color="#818cf8" style={{ marginTop: 1, flexShrink: 0 }} />
            <div style={{ fontSize: 9, color: "#64748b", lineHeight: 1.6 }}>Smart Ins-Note seamlessly integrates Gemini AI to enhance your writing workflow with intelligent assistance…</div>
          </div>
          <div style={{ marginTop: 8, display: "flex", gap: 10, fontSize: 8.5, color: "#1e293b" }}>
            <span>52 words · 3 min read</span><span style={{ color: "#6366f1", marginLeft: "auto" }}>Auto-saved ✓</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Bento feature card ─── */
function BentoCard({ icon: Icon, title, desc, gradient, span = 1, tall = false, children }: { icon: React.ElementType; title: string; desc: string; gradient: string; span?: number; tall?: boolean; children?: React.ReactNode }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div data-reveal onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{ gridColumn: `span ${span}`, padding: 28, borderRadius: 20, border: `1px solid rgba(255,255,255,${hovered ? 0.1 : 0.05})`, background: hovered ? `rgba(99,102,241,0.05)` : "rgba(255,255,255,0.018)", transition: "all 0.3s", transform: hovered ? "translateY(-4px)" : "none", cursor: "default", minHeight: tall ? 240 : 160, display: "flex", flexDirection: "column", gap: 14, overflow: "hidden", position: "relative" }}>
      <div style={{ position: "absolute", top: 0, right: 0, width: 120, height: 120, borderRadius: "0 20px 0 50%", background: gradient, opacity: hovered ? 0.18 : 0.08, transition: "opacity 0.3s", pointerEvents: "none" }} />
      <div style={{ width: 44, height: 44, borderRadius: 12, background: gradient.replace(/0\.\d+\)/g, "0.15)"), border: `1px solid ${gradient.replace(/rgba\(/, "rgba(").replace(/,\s*[\d.]+\)$/, ",0.25)")}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        <Icon size={20} color="#a78bfa" />
      </div>
      <div>
        <h3 style={{ fontWeight: 700, fontSize: 15, color: "#e2e8f0", marginBottom: 6 }}>{title}</h3>
        <p style={{ fontSize: 13, color: "#475569", lineHeight: 1.65 }}>{desc}</p>
      </div>
      {children}
    </div>
  );
}

/* ─── Auto-scroll testimonials ─── */
const testimonials = [
  { name: "Sarah K.", role: "Product Designer", avatar: "SK", text: "The AI writing features are incredible. Summarize + Improve Writing saved me hours every week." },
  { name: "James T.", role: "Software Engineer", avatar: "JT", text: "Finally a notes app that gets out of my way. Keyboard shortcuts and instant search are perfect." },
  { name: "Amara D.", role: "Writer", avatar: "AD", text: "Smart Ins-Note with Gemini AI is the best writing assistant I've ever used. The 3-panel layout is genius." },
  { name: "Lucas R.", role: "Researcher", avatar: "LR", text: "The tag system and instant search make it trivial to find anything. Cloud sync just works." },
  { name: "Mei L.", role: "Student", avatar: "ML", text: "Dark mode, privacy-first, and AI all in one free app? I switched from Notion and never looked back." },
  { name: "Arjun P.", role: "Startup Founder", avatar: "AP", text: "The zen focus mode is a game changer. I write my best notes distraction-free with Gemini suggestions." },
];

function TestimonialsTrack() {
  const trackRef = useRef<HTMLDivElement>(null);
  const doubled = [...testimonials, ...testimonials];
  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    let raf: number;
    let pos = 0;
    const speed = 0.5;
    const halfW = el.scrollWidth / 2;
    function tick() {
      pos += speed;
      if (pos >= halfW) pos -= halfW;
      el.style.transform = `translateX(-${pos}px)`;
      raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);
  return (
    <div style={{ overflow: "hidden", maskImage: "linear-gradient(to right,transparent,black 10%,black 90%,transparent)" }}>
      <div ref={trackRef} style={{ display: "flex", gap: 18, width: "max-content", willChange: "transform" }}>
        {doubled.map((t, i) => (
          <div key={i} style={{ width: 300, flexShrink: 0, padding: "22px 24px", borderRadius: 18, border: "1px solid rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.018)", display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={{ display: "flex", gap: 3 }}>{[1,2,3,4,5].map(s => <span key={s} style={{ color: "#fbbf24", fontSize: 13 }}>★</span>)}</div>
            <p style={{ color: "#64748b", fontSize: 13, lineHeight: 1.8, flex: 1 }}>&ldquo;{t.text}&rdquo;</p>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 34, height: 34, borderRadius: "50%", background: "linear-gradient(135deg,#6366f1,#8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: "white", flexShrink: 0 }}>{t.avatar}</div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 12.5, color: "#e2e8f0" }}>{t.name}</div>
                <div style={{ fontSize: 11, color: "#334155" }}>{t.role}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Comparison table ─── */
const compareRows = [
  ["Feature", "Smart Ins-Note", "Notion", "Bear", "Obsidian"],
  ["AI Writing (built-in)", "✅ Gemini AI", "❌ Paid add-on", "❌", "❌"],
  ["Privacy-first", "✅ Your key only", "❌ Cloud data", "✅", "✅"],
  ["Cloud Sync", "✅ Instant", "✅", "✅ iCloud only", "❌ Manual"],
  ["Free Forever", "✅", "⚠️ Limited", "⚠️ 1 device", "✅"],
  ["Plugin System", "✅ 18+ built-in", "✅ External", "❌", "✅ Community"],
  ["Keyboard Shortcuts", "✅ Full suite", "✅", "✅", "✅"],
  ["Zen / Focus Mode", "✅", "❌", "✅", "❌"],
  ["Open Source Friendly", "✅", "❌", "❌", "✅"],
];

function CompareTable() {
  return (
    <div style={{ overflowX: "auto", borderRadius: 18, border: "1px solid rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.012)" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
        <tbody>
          {compareRows.map((row, ri) => (
            <tr key={ri} style={{ borderBottom: ri < compareRows.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none", background: ri === 0 ? "rgba(99,102,241,0.06)" : ri % 2 === 0 ? "rgba(255,255,255,0.012)" : "transparent" }}>
              {row.map((cell, ci) => (
                <td key={ci} style={{ padding: "12px 18px", color: ri === 0 ? (ci === 1 ? "#a5b4fc" : "#64748b") : ci === 0 ? "#94a3b8" : ci === 1 ? (cell.startsWith("✅") ? "#34d399" : "#f87171") : "#4b5563", fontWeight: ri === 0 ? 700 : ci === 0 ? 500 : 400, fontSize: ri === 0 ? 12 : 13, whiteSpace: "nowrap", borderRight: ci < row.length - 1 ? "1px solid rgba(255,255,255,0.03)" : "none" }}>
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ─── Stat counter ─── */
function StatItem({ target, suffix, label }: { target: number; suffix: string; label: string }) {
  const { val, ref } = useCountUp(target);
  return (
    <div style={{ textAlign: "center", padding: "28px 24px", borderRadius: 18, border: "1px solid rgba(99,102,241,0.12)", background: "rgba(99,102,241,0.04)" }}>
      <div ref={ref as React.Ref<HTMLDivElement>} style={{ fontSize: 44, fontWeight: 900, background: "linear-gradient(135deg,#a5b4fc,#e879f9)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", lineHeight: 1 }}>
        {val}{suffix}
      </div>
      <div style={{ fontSize: 13, color: "#475569", marginTop: 8 }}>{label}</div>
    </div>
  );
}

/* ─── Keyboard shortcut pill ─── */
function Kbd({ children }: { children: React.ReactNode }) {
  return <kbd style={{ display: "inline-flex", alignItems: "center", gap: 2, padding: "3px 8px", borderRadius: 6, background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)", fontSize: 11, color: "#c7d2fe", fontFamily: "monospace", boxShadow: "0 1px 0 rgba(0,0,0,0.4)" }}>{children}</kbd>;
}

/* ─── Main LandingPage ─── */
export function LandingPage() {
  useScrollReveal();
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });
  const [announceDismissed, setAnnounceDismissed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    function onMove(e: MouseEvent) { setMousePos({ x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight }); }
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: "#07070f", color: "#f0f0ff", overflowX: "hidden", fontFamily: "-apple-system,BlinkMacSystemFont,'Inter',sans-serif" }}>
      <style>{`
        @keyframes orbFloat1{0%,100%{transform:translate(0,0) scale(1)} 33%{transform:translate(40px,-30px) scale(1.05)} 66%{transform:translate(-20px,20px) scale(0.97)}}
        @keyframes orbFloat2{0%,100%{transform:translate(0,0) scale(1)} 33%{transform:translate(-30px,40px) scale(1.03)} 66%{transform:translate(20px,-20px) scale(0.98)}}
        @keyframes orbFloat3{0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(-40px,-30px) scale(1.04)}}
        @keyframes gradShift{0%,100%{background-position:0% 50%} 50%{background-position:100% 50%}}
        @keyframes logoPulse{0%,100%{box-shadow:0 0 20px rgba(99,102,241,0.35)} 50%{box-shadow:0 0 40px rgba(99,102,241,0.6)}}
        @keyframes cursorBlink{0%,100%{opacity:1} 50%{opacity:0}}
        @keyframes savePulse{0%,100%{opacity:1} 50%{opacity:0.4}}
        @keyframes badgeBounce{0%,100%{transform:translateY(0)} 50%{transform:translateY(-3px)}}
        @keyframes glowRing{0%,100%{transform:scale(1);opacity:0.35} 50%{transform:scale(1.08);opacity:0.15}}
        @keyframes announcePop{0%{transform:translateY(-100%);opacity:0} 100%{transform:translateY(0);opacity:1}}
        @keyframes spinSlow{from{transform:rotate(0deg)} to{transform:rotate(360deg)}}
        @keyframes shimmerSlide{0%{background-position:-200% 0} 100%{background-position:200% 0}}
        .lp-nav-link{padding:7px 15px;border-radius:8px;color:#64748b;font-size:14px;text-decoration:none;transition:color 0.15s}
        .lp-nav-link:hover{color:#e2e8f0}
        .lp-cta-primary{padding:16px 38px;border-radius:14px;background:linear-gradient(135deg,#6366f1,#8b5cf6);color:white;font-size:17px;font-weight:700;text-decoration:none;display:inline-flex;align-items:center;gap:10px;box-shadow:0 0 40px rgba(99,102,241,0.45);transition:all 0.22s}
        .lp-cta-primary:hover{transform:translateY(-2px);box-shadow:0 0 70px rgba(99,102,241,0.65)!important}
        .lp-cta-secondary{padding:16px 38px;border-radius:14px;border:1px solid rgba(165,180,252,0.2);color:#c7d2fe;font-size:17px;font-weight:600;text-decoration:none;background:rgba(255,255,255,0.03);backdrop-filter:blur(10px);display:inline-flex;align-items:center;gap:10px;transition:all 0.2s}
        .lp-cta-secondary:hover{background:rgba(255,255,255,0.07)!important;border-color:rgba(165,180,252,0.35)!important}
        .compare-row:hover td{background:rgba(99,102,241,0.05)!important}
        *{box-sizing:border-box}
      `}</style>

      {/* Announcement banner */}
      {!announceDismissed && (
        <div style={{ background: "linear-gradient(90deg,rgba(99,102,241,0.12),rgba(139,92,246,0.12))", borderBottom: "1px solid rgba(99,102,241,0.2)", padding: "9px 24px", display: "flex", alignItems: "center", justifyContent: "center", gap: 12, position: "relative", animation: "announcePop 0.4s ease" }}>
          <Sparkles size={13} color="#a78bfa" />
          <span style={{ fontSize: 13, color: "#a5b4fc" }}>
            <strong>New:</strong> Command Palette, Zen Mode &amp; 20+ features just shipped —{" "}
            <Link href={APP_LINK} style={{ color: "#e879f9", textDecoration: "underline", fontWeight: 600 }}>Try them now →</Link>
          </span>
          <button onClick={() => setAnnounceDismissed(true)} style={{ position: "absolute", right: 16, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "#475569", cursor: "pointer", fontSize: 18, lineHeight: 1 }}>×</button>
        </div>
      )}

      {/* Navbar */}
      <header style={{ position: "sticky", top: 0, zIndex: 100, borderBottom: "1px solid rgba(255,255,255,0.06)", backdropFilter: "blur(28px)", background: "rgba(7,7,15,0.85)" }}>
        <div style={{ maxWidth: 1180, margin: "0 auto", padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 62 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 35, height: 35, borderRadius: 10, background: "linear-gradient(135deg,#6366f1,#8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", animation: "logoPulse 3s ease-in-out infinite" }}>
              <BookOpen size={17} color="white" strokeWidth={2} />
            </div>
            <span style={{ fontWeight: 900, fontSize: 18, letterSpacing: -0.5, background: "linear-gradient(90deg,#a5b4fc,#e879f9,#a5b4fc)", backgroundSize: "200% auto", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", animation: "gradShift 5s linear infinite" }}>
              Smart Ins-Note
            </span>
          </div>
          <nav style={{ display: "flex", alignItems: "center", gap: 2 }}>
            <a href="#features" className="lp-nav-link">Features</a>
            <a href="#compare" className="lp-nav-link">Compare</a>
            <a href="#plugins" className="lp-nav-link">Plugins</a>
            <Link href={AUTH_LINK} className="lp-nav-link" style={{ color: "#94a3b8", display: "flex", alignItems: "center", gap: 5 }}>
              <LogIn size={13} /> Sign In
            </Link>
            <Link href={APP_LINK}
              style={{ marginLeft: 8, padding: "8px 20px", borderRadius: 10, background: "linear-gradient(135deg,#6366f1,#8b5cf6)", color: "white", fontSize: 14, fontWeight: 700, textDecoration: "none", display: "flex", alignItems: "center", gap: 6, transition: "all 0.2s", boxShadow: "0 0 20px rgba(99,102,241,0.35)" }}
              onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 0 35px rgba(99,102,241,0.6)"; (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(-1px)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 0 20px rgba(99,102,241,0.35)"; (e.currentTarget as HTMLAnchorElement).style.transform = "none"; }}>
              Open App <ArrowRight size={13} />
            </Link>
          </nav>
        </div>
      </header>

      {/* ═══════════════ HERO ═══════════════ */}
      <section style={{ minHeight: "94vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "80px 24px 60px", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <ParticleCanvas />
        <FloatingOrbs />
        <GridBg />

        {/* Mouse parallax glow */}
        <div style={{ position: "absolute", width: 700, height: 700, borderRadius: "50%", background: "radial-gradient(circle,rgba(99,102,241,0.07),transparent 70%)", transform: `translate(${(mousePos.x - 0.5) * 45}px, ${(mousePos.y - 0.5) * 45}px)`, pointerEvents: "none", transition: "transform 0.4s ease-out", zIndex: 0 }} />

        <div style={{ position: "relative", zIndex: 1, width: "100%", maxWidth: 1000 }}>

          {/* Top badges */}
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center", marginBottom: 36 }}>
            {[
              { label: "Free Forever", color: "99,102,241", icon: <CheckCircle size={11} /> },
              { label: "Gemini AI Powered", color: "139,92,246", icon: <Sparkles size={11} /> },
              { label: "Privacy First", color: "232,121,249", icon: <Shield size={11} /> },
            ].map((b, i) => (
              <span key={b.label} style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "5px 15px", borderRadius: 20, background: `rgba(${b.color},0.1)`, border: `1px solid rgba(${b.color},0.3)`, fontSize: 12, color: `rgb(${b.color})`, animationDelay: `${i * 0.2}s` }}>
                {b.icon} {b.label}
              </span>
            ))}
          </div>

          {/* Headline with typewriter */}
          <h1 style={{ fontSize: "clamp(40px,7vw,88px)", fontWeight: 900, lineHeight: 1.02, letterSpacing: -2.5, marginBottom: 28, maxWidth: 920, margin: "0 auto 28px" }}>
            <span style={{ background: "linear-gradient(135deg,#ffffff 0%,#c7d2fe 50%,#a78bfa 100%)", backgroundSize: "200% auto", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", animation: "gradShift 7s linear infinite", display: "block" }}>
              Write notes
            </span>
            <span style={{ display: "block", minHeight: "1.08em" }}>
              <TypewriterWord />
            </span>
          </h1>

          <p style={{ fontSize: "clamp(15px,2vw,20px)", color: "#64748b", lineHeight: 1.75, maxWidth: 580, margin: "0 auto 50px" }}>
            Smart Ins-Note combines a beautiful 3-panel editor with Google Gemini AI, cloud sync, tags, and a full plugin system — all free, forever.
          </p>

          {/* CTAs */}
          <div style={{ display: "flex", gap: 14, flexWrap: "wrap", justifyContent: "center", marginBottom: 56 }}>
            <Link href={APP_LINK} className="lp-cta-primary"><Sparkles size={19} /> Start Writing Free</Link>
            <Link href={AUTH_LINK} className="lp-cta-secondary"><LogIn size={18} /> Create Account</Link>
          </div>

          {/* Keyboard shortcut hints */}
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap", marginBottom: 60 }}>
            {[["⌘K", "Search"], ["⌘N", "New Note"], ["⌘⇧F", "Zen Mode"], ["⌘\\", "Sidebar"], ["⌘,", "AI Settings"]].map(([key, label]) => (
              <div key={key} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#334155" }}>
                <Kbd>{key}</Kbd> <span>{label}</span>
              </div>
            ))}
          </div>

          {/* App mockup */}
          <AppMockup />

          <div style={{ marginTop: 40, display: "flex", flexDirection: "column", alignItems: "center", gap: 5, color: "#1e293b" }}>
            <span style={{ fontSize: 11 }}>Explore all features</span>
            <ChevronDown size={16} style={{ animation: "badgeBounce 2s ease-in-out infinite" }} />
          </div>
        </div>
      </section>

      {/* ═══════════════ STATS ═══════════════ */}
      <section style={{ padding: "60px 24px", borderTop: "1px solid rgba(255,255,255,0.04)" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 18 }}>
          <StatItem target={18} suffix="+" label="Built-in Plugins" />
          <StatItem target={9} suffix="" label="AI Actions" />
          <StatItem target={100} suffix="%" label="Privacy First" />
          <StatItem target={0} suffix="$" label="Cost — Free Forever" />
        </div>
      </section>

      {/* ═══════════════ BENTO FEATURES ═══════════════ */}
      <section id="features" style={{ padding: "90px 24px", maxWidth: 1180, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 64 }} data-reveal>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "5px 15px", borderRadius: 20, background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.25)", fontSize: 12, color: "#a5b4fc", marginBottom: 16 }}>
            <Zap size={11} /> Everything you need, nothing you don&apos;t
          </span>
          <h2 style={{ fontSize: "clamp(28px,4vw,52px)", fontWeight: 900, letterSpacing: -1.5, marginTop: 14, marginBottom: 14, color: "#f1f5f9" }}>
            Packed with <span style={{ background: "linear-gradient(135deg,#818cf8,#e879f9)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>powerful features</span>
          </h2>
          <p style={{ color: "#475569", fontSize: 17, maxWidth: 500, margin: "0 auto" }}>Every feature ships with the app. No subscriptions, no premium tiers.</p>
        </div>

        {/* Bento grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 18 }}>
          <BentoCard span={1} icon={Brain} title="Gemini AI" desc="9 AI actions: summarize, improve, rewrite, generate title, fix grammar, brainstorm, continue, shorten, expand — all powered by your own Gemini key." gradient="rgba(139,92,246,0.2)" />
          <BentoCard span={1} icon={Command} title="Command Palette" desc="⌘K opens a lightning-fast palette. Search notes, trigger any action, jump anywhere — all without leaving the keyboard." gradient="rgba(99,102,241,0.2)" />
          <BentoCard span={1} icon={Eye} title="Zen / Focus Mode" desc="⌘⇧F collapses everything to a full-screen, distraction-free editor. Your thoughts, nothing else." gradient="rgba(232,121,249,0.2)" />
          <BentoCard span={2} icon={Layers} title="3-Panel Layout" desc="Sidebar navigation · Note list with live search, tags, and filters · Full editor with floating format toolbar, font size controls, reading progress bar, and word count." gradient="rgba(96,165,250,0.2)" tall>
            <div style={{ display: "flex", gap: 8, marginTop: 6, flexWrap: "wrap" }}>
              {["Sidebar", "Note List", "Editor", "Format Bar", "AI Panel"].map(t => (
                <span key={t} style={{ padding: "3px 10px", borderRadius: 8, background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.2)", fontSize: 11, color: "#a5b4fc" }}>{t}</span>
              ))}
            </div>
          </BentoCard>
          <BentoCard span={1} icon={Cloud} title="Cloud Sync" desc="Notes sync instantly across all your devices via Insforge backend. Pick up exactly where you left off." gradient="rgba(52,211,153,0.2)" />
          <BentoCard span={1} icon={Lock} title="Privacy First" desc="Your Gemini API key stays in your browser — never sent to our servers. No ads, no tracking, no data selling." gradient="rgba(251,191,36,0.2)" />
          <BentoCard span={1} icon={Tag} title="Tags & Filters" desc="Create color-coded tags, filter notes instantly. The tag dot system makes it instantly visual." gradient="rgba(244,114,182,0.2)" />
          <BentoCard span={1} icon={Keyboard} title="20+ Shortcuts" desc="⌘N · ⌘K · ⌘B · ⌘I · ⌘⇧F · ⌘\\ · ⌘= · ⌘- · ⌘, · ⌘/ — every action at your fingertips." gradient="rgba(99,102,241,0.2)" />
          <BentoCard span={1} icon={Download} title="Export Markdown" desc="Download any note as a .md file. Your content is always yours — open standard, forever." gradient="rgba(52,211,153,0.2)" />
          <BentoCard span={1} icon={Timer} title="Live Stats" desc="Words, characters, lines, reading time — updating live as you write, right in the status bar." gradient="rgba(139,92,246,0.2)" />
          <BentoCard span={1} icon={Moon} title="Dark / Light Mode" desc="Beautiful dark and light themes with a smooth transition. Your preference is remembered." gradient="rgba(96,165,250,0.2)" />
          <BentoCard span={1} icon={PenLine} title="Rich Formatting" desc="Floating toolbar on text selection: Bold, Italic, Code, H1–H3, Blockquote, List, Divider — instant markdown." gradient="rgba(232,121,249,0.2)" />
        </div>
      </section>

      {/* ═══════════════ AI SECTION ═══════════════ */}
      <section style={{ padding: "80px 24px", position: "relative", overflow: "hidden", background: "linear-gradient(135deg,rgba(99,102,241,0.04) 0%,rgba(139,92,246,0.04) 50%,rgba(232,121,249,0.02) 100%)", borderTop: "1px solid rgba(255,255,255,0.04)", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "center" }}>
          <div data-reveal>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "5px 14px", borderRadius: 20, background: "rgba(139,92,246,0.12)", border: "1px solid rgba(139,92,246,0.3)", fontSize: 12, color: "#c4b5fd", marginBottom: 20 }}>
              <Cpu size={11} /> Google Gemini Integration
            </span>
            <h2 style={{ fontSize: "clamp(26px,3.5vw,46px)", fontWeight: 900, letterSpacing: -1.2, marginBottom: 18, color: "#f1f5f9", lineHeight: 1.12 }}>
              AI that lives inside<br />your notes
            </h2>
            <p style={{ color: "#64748b", fontSize: 16, lineHeight: 1.8, marginBottom: 28 }}>
              Add your Gemini API key once in Settings — it stays in your browser, <em style={{ color: "#94a3b8" }}>never on our servers</em>. Then unlock 9 AI actions right inside any note.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {[
                ["✨", "Improve Writing", "Enhance clarity, flow, and style"],
                ["📝", "Summarize", "Get a concise summary in seconds"],
                ["🏷️", "Generate Title", "AI suggests the perfect title"],
                ["🔧", "Fix Grammar", "Correct all errors automatically"],
                ["💡", "Brainstorm", "Generate related ideas instantly"],
                ["➡️", "Continue Writing", "AI picks up where you left off"],
                ["📉", "Make Shorter", "Condense by about 40%"],
                ["📈", "Expand", "Flesh out your notes with more detail"],
                ["🔄", "Rewrite", "Completely rephrase for a fresh take"],
              ].map(([emoji, label, desc]) => (
                <div key={label} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", borderRadius: 10, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", transition: "all 0.2s", cursor: "default" }}
                  onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.background = "rgba(99,102,241,0.07)"; (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(99,102,241,0.2)"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.background = "rgba(255,255,255,0.02)"; (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(255,255,255,0.05)"; }}>
                  <span style={{ fontSize: 18, flexShrink: 0, width: 28, textAlign: "center" }}>{emoji}</span>
                  <div>
                    <div style={{ fontSize: 13.5, fontWeight: 700, color: "#e2e8f0" }}>{label}</div>
                    <div style={{ fontSize: 12, color: "#475569" }}>{desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div data-reveal style={{ transitionDelay: "0.2s" }}>
            {/* Glow ring decorations */}
            <div style={{ position: "relative" }}>
              <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 400, height: 400, borderRadius: "50%", border: "1px solid rgba(99,102,241,0.1)", animation: "glowRing 4s ease-in-out infinite", pointerEvents: "none" }} />
              <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 300, height: 300, borderRadius: "50%", border: "1px solid rgba(139,92,246,0.12)", animation: "glowRing 4s ease-in-out infinite 1s", pointerEvents: "none" }} />
              <div style={{ borderRadius: 20, overflow: "hidden", border: "1px solid rgba(99,102,241,0.22)", boxShadow: "0 24px 80px rgba(0,0,0,0.5), 0 0 40px rgba(99,102,241,0.1)", background: "#0c0c1a", position: "relative", zIndex: 1 }}>
                <div style={{ padding: "13px 18px", background: "#0f0f1e", borderBottom: "1px solid rgba(255,255,255,0.05)", display: "flex", alignItems: "center", gap: 8 }}>
                  <Sparkles size={13} color="#818cf8" />
                  <span style={{ fontSize: 12.5, color: "#818cf8", fontWeight: 700 }}>AI Actions — Gemini</span>
                  <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 5, padding: "2px 8px", borderRadius: 6, background: "rgba(52,211,153,0.1)", border: "1px solid rgba(52,211,153,0.2)" }}>
                    <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#34d399" }} />
                    <span style={{ fontSize: 10, color: "#34d399" }}>Connected</span>
                  </div>
                </div>
                {[
                  { emoji: "✨", label: "Improve Writing", desc: "Enhance clarity & flow", hot: true },
                  { emoji: "📝", label: "Summarize", desc: "Get a concise summary", hot: false },
                  { emoji: "🔧", label: "Fix Grammar", desc: "Correct all errors", hot: false },
                  { emoji: "➡️", label: "Continue Writing", desc: "AI continues your text", hot: false },
                  { emoji: "📉", label: "Make Shorter", desc: "Condense by ~40%", hot: false },
                  { emoji: "💡", label: "Brainstorm", desc: "Generate related ideas", hot: false },
                ].map((action, ai) => (
                  <div key={action.label} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 18px", borderBottom: "1px solid rgba(255,255,255,0.03)", cursor: "pointer", background: action.hot ? "rgba(99,102,241,0.06)" : "transparent", transition: "background 0.15s" }}
                    onMouseEnter={e => (e.currentTarget.style.background = "rgba(99,102,241,0.1)")}
                    onMouseLeave={e => (e.currentTarget.style.background = action.hot ? "rgba(99,102,241,0.06)" : "transparent")}>
                    <span style={{ fontSize: 20, width: 28, textAlign: "center" }}>{action.emoji}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: "#e2e8f0" }}>{action.label}</div>
                      <div style={{ fontSize: 11, color: "#475569" }}>{action.desc}</div>
                    </div>
                    {action.hot && <span style={{ fontSize: 9, padding: "2px 7px", borderRadius: 6, background: "rgba(99,102,241,0.2)", color: "#a5b4fc", fontWeight: 700 }}>POPULAR</span>}
                  </div>
                ))}
                <div style={{ padding: "14px 18px", background: "rgba(99,102,241,0.03)", display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ flex: 1, fontSize: 11, color: "#334155" }}>API key stored locally · never uploaded</div>
                  <button style={{ padding: "7px 14px", borderRadius: 8, border: "none", background: "linear-gradient(135deg,#6366f1,#8b5cf6)", color: "white", fontSize: 11, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: 5 }}>
                    <Settings size={11} /> Set API Key
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════ COMPARE ═══════════════ */}
      <section id="compare" style={{ padding: "90px 24px", maxWidth: 1180, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 52 }} data-reveal>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "5px 14px", borderRadius: 20, background: "rgba(52,211,153,0.1)", border: "1px solid rgba(52,211,153,0.25)", fontSize: 12, color: "#34d399", marginBottom: 16 }}>
            <CheckCircle size={11} /> How we compare
          </span>
          <h2 style={{ fontSize: "clamp(26px,4vw,48px)", fontWeight: 900, letterSpacing: -1.5, color: "#f1f5f9", marginTop: 14, marginBottom: 12 }}>
            Why <span style={{ background: "linear-gradient(135deg,#a5b4fc,#e879f9)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Smart Ins-Note</span> wins
          </h2>
          <p style={{ color: "#475569", fontSize: 16 }}>We give you more — for less (nothing).</p>
        </div>
        <CompareTable />
      </section>

      {/* ═══════════════ PLUGINS ═══════════════ */}
      <section id="plugins" style={{ padding: "70px 24px", borderTop: "1px solid rgba(255,255,255,0.04)", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
        <div style={{ maxWidth: 860, margin: "0 auto", textAlign: "center" }}>
          <h2 style={{ fontSize: "clamp(24px,3.5vw,44px)", fontWeight: 900, letterSpacing: -1.2, marginBottom: 12, color: "#f1f5f9" }} data-reveal>
            All plugins — <span style={{ background: "linear-gradient(135deg,#818cf8,#e879f9)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>built-in</span>
          </h2>
          <p style={{ color: "#475569", marginBottom: 36, fontSize: 16 }}>No plugin store. No paid add-ons. Every capability ships built-in from day one.</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10, justifyContent: "center" }}>
            {[
              "Gemini AI", "Command Palette", "Zen Mode", "Markdown", "Word Count",
              "Pin Notes", "Dark Mode", "Export .md", "Keyboard Shortcuts", "Live Search",
              "Tags", "Auto-save", "Starred", "Archive", "Trash", "Improve Writing",
              "Summarize", "Fix Grammar", "Generate Title", "Continue Writing",
              "Make Shorter", "Brainstorm", "Expand", "Rewrite", "Floating Toolbar",
              "Font Size", "Reading Progress", "Toast Alerts", "Context Menu", "Skeleton Loading",
            ].map((p, i) => (
              <span key={p} style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 15px", borderRadius: 20, background: "rgba(99,102,241,0.07)", border: "1px solid rgba(99,102,241,0.2)", fontSize: 12.5, color: "#c7d2fe", animation: `badgeBounce ${2 + (i % 5) * 0.3}s ease-in-out infinite`, animationDelay: `${i * 0.12}s` }}>
                <CheckCircle size={11} /> {p}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ TESTIMONIALS ═══════════════ */}
      <section style={{ padding: "90px 0" }}>
        <div style={{ textAlign: "center", marginBottom: 52, padding: "0 24px" }} data-reveal>
          <h2 style={{ fontSize: "clamp(24px,3.5vw,44px)", fontWeight: 900, letterSpacing: -1.2, color: "#f1f5f9", marginBottom: 10 }}>
            Loved by note-takers
          </h2>
          <p style={{ color: "#475569", fontSize: 16 }}>Real people. Real productivity gains.</p>
        </div>
        <TestimonialsTrack />
      </section>

      {/* ═══════════════ FINAL CTA ═══════════════ */}
      <section style={{ padding: "110px 24px", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <FloatingOrbs variant="cta" />
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle at 50% 50%,rgba(99,102,241,0.14) 0%,transparent 65%)", pointerEvents: "none" }} />
        {/* Glow rings */}
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 600, height: 600, borderRadius: "50%", border: "1px solid rgba(99,102,241,0.08)", animation: "glowRing 5s ease-in-out infinite", pointerEvents: "none", zIndex: 0 }} />
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 440, height: 440, borderRadius: "50%", border: "1px solid rgba(139,92,246,0.1)", animation: "glowRing 5s ease-in-out infinite 1.5s", pointerEvents: "none", zIndex: 0 }} />
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 280, height: 280, borderRadius: "50%", border: "1px solid rgba(232,121,249,0.12)", animation: "glowRing 5s ease-in-out infinite 3s", pointerEvents: "none", zIndex: 0 }} />

        <div style={{ maxWidth: 660, margin: "0 auto", position: "relative", zIndex: 1 }} data-reveal>
          <div style={{ width: 72, height: 72, borderRadius: 20, background: "linear-gradient(135deg,#6366f1,#8b5cf6,#e879f9)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 28px", boxShadow: "0 0 50px rgba(99,102,241,0.5), 0 0 100px rgba(139,92,246,0.25)", animation: "logoPulse 2.5s ease-in-out infinite" }}>
            <BookOpen size={32} color="white" strokeWidth={2} />
          </div>
          <h2 style={{ fontSize: "clamp(30px,5vw,60px)", fontWeight: 900, letterSpacing: -1.8, marginBottom: 18, background: "linear-gradient(135deg,#ffffff,#a78bfa 50%,#e879f9)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            Start writing smarter today
          </h2>
          <p style={{ color: "#475569", fontSize: 18, marginBottom: 42, lineHeight: 1.7 }}>
            Free forever. Add your Gemini key for AI superpowers.<br />
            <span style={{ fontSize: 14, color: "#334155" }}>No credit card. No limits. Just better notes.</span>
          </p>
          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
            <Link href={APP_LINK} className="lp-cta-primary" style={{ padding: "18px 50px", fontSize: 18, animation: "logoPulse 3s ease-in-out infinite" }}>
              <Sparkles size={21} /> Open Smart Ins-Note
            </Link>
            <Link href={AUTH_LINK} className="lp-cta-secondary" style={{ padding: "18px 36px", fontSize: 18 }}>
              <LogIn size={19} /> Sign Up Free
            </Link>
          </div>
          <p style={{ marginTop: 24, fontSize: 12, color: "#1e293b" }}>
            <CheckCircle size={11} style={{ display: "inline", marginRight: 4 }} /> No credit card required &nbsp;·&nbsp;
            <Shield size={11} style={{ display: "inline", marginRight: 4 }} /> Privacy-first &nbsp;·&nbsp;
            <Globe size={11} style={{ display: "inline", marginRight: 4 }} /> Works everywhere
          </p>
        </div>
      </section>

      {/* ═══════════════ FOOTER ═══════════════ */}
      <footer style={{ borderTop: "1px solid rgba(255,255,255,0.05)", padding: "40px 32px 28px" }}>
        <div style={{ maxWidth: 1180, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 40, marginBottom: 40 }}>
            {/* Brand */}
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 14 }}>
                <div style={{ width: 30, height: 30, borderRadius: 8, background: "linear-gradient(135deg,#6366f1,#8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <BookOpen size={15} color="white" />
                </div>
                <span style={{ fontWeight: 800, fontSize: 16, background: "linear-gradient(90deg,#a5b4fc,#e879f9)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Smart Ins-Note</span>
              </div>
              <p style={{ fontSize: 13, color: "#334155", lineHeight: 1.7, maxWidth: 260 }}>A beautiful, AI-powered note-taking app. Free forever, privacy-first, powered by Insforge &amp; Google Gemini.</p>
              <div style={{ display: "flex", gap: 10, marginTop: 18 }}>
                <a href="#" style={{ width: 34, height: 34, borderRadius: 8, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", display: "flex", alignItems: "center", justifyContent: "center", color: "#475569", textDecoration: "none", transition: "all 0.2s" }}
                  onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background = "rgba(99,102,241,0.1)"; (e.currentTarget as HTMLAnchorElement).style.color = "#a5b4fc"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background = "rgba(255,255,255,0.04)"; (e.currentTarget as HTMLAnchorElement).style.color = "#475569"; }}>
                  <Twitter size={14} />
                </a>
                <a href="https://github.com/nullcove/smart-notes-app" target="_blank" rel="noopener noreferrer" style={{ width: 34, height: 34, borderRadius: 8, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", display: "flex", alignItems: "center", justifyContent: "center", color: "#475569", textDecoration: "none", transition: "all 0.2s" }}
                  onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background = "rgba(99,102,241,0.1)"; (e.currentTarget as HTMLAnchorElement).style.color = "#a5b4fc"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background = "rgba(255,255,255,0.04)"; (e.currentTarget as HTMLAnchorElement).style.color = "#475569"; }}>
                  <Github size={14} />
                </a>
              </div>
            </div>
            {/* Product */}
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#334155", textTransform: "uppercase", letterSpacing: 1, marginBottom: 16 }}>Product</div>
              {[["Features", "#features"], ["Compare", "#compare"], ["Plugins", "#plugins"], ["Open App", APP_LINK], ["Sign In", AUTH_LINK]].map(([label, href]) => (
                <div key={label} style={{ marginBottom: 10 }}>
                  <a href={href} style={{ fontSize: 13, color: "#334155", textDecoration: "none", transition: "color 0.15s" }}
                    onMouseEnter={e => ((e.currentTarget as HTMLAnchorElement).style.color = "#94a3b8")}
                    onMouseLeave={e => ((e.currentTarget as HTMLAnchorElement).style.color = "#334155")}>{label}</a>
                </div>
              ))}
            </div>
            {/* Tech */}
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#334155", textTransform: "uppercase", letterSpacing: 1, marginBottom: 16 }}>Built with</div>
              {["Next.js 15", "TypeScript", "Google Gemini", "Insforge DB", "Express API", "Tailwind CSS"].map(t => (
                <div key={t} style={{ marginBottom: 10, fontSize: 13, color: "#334155" }}>{t}</div>
              ))}
            </div>
            {/* Privacy */}
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#334155", textTransform: "uppercase", letterSpacing: 1, marginBottom: 16 }}>Privacy</div>
              {["No ads", "No tracking", "No data selling", "API key local only", "JWT auth", "Open GitHub"].map(t => (
                <div key={t} style={{ marginBottom: 10, fontSize: 13, color: "#334155", display: "flex", alignItems: "center", gap: 6 }}>
                  <CheckCircle size={10} color="#34d399" /> {t}
                </div>
              ))}
            </div>
          </div>
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.04)", paddingTop: 22, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
            <div style={{ fontSize: 12, color: "#1e293b" }}>© 2026 Smart Ins-Note · Powered by Insforge &amp; Google Gemini</div>
            <div style={{ display: "flex", gap: 20 }}>
              <a href="#" style={{ fontSize: 12, color: "#1e293b", textDecoration: "none" }}>Privacy Policy</a>
              <a href="#" style={{ fontSize: 12, color: "#1e293b", textDecoration: "none" }}>Terms</a>
              <Link href={APP_LINK} style={{ fontSize: 12, color: "#6366f1", textDecoration: "none", fontWeight: 600 }}>Open App →</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
