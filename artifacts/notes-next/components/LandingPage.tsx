"use client";

import Link from "next/link";
import {
  FileText, Star, Tag, Search, Moon, Download, Pin,
  Eye, Hash, Keyboard, Zap, Lock, Cloud, ArrowRight,
  CheckCircle, Sparkles, BookOpen, BarChart2
} from "lucide-react";

const features = [
  { icon: Eye, title: "Markdown Preview", desc: "Write in markdown and toggle a live preview instantly. Format with headings, lists, code blocks, and tables." },
  { icon: Pin, title: "Pin Notes", desc: "Pin your most important notes to the top so they're always within reach, no matter how many notes you have." },
  { icon: Star, title: "Star & Organize", desc: "Star notes, archive old ones, and move to trash. Full note lifecycle management in a clean 3-panel layout." },
  { icon: Tag, title: "Tags System", desc: "Create color-coded tags to categorize your notes. Filter your note list instantly by any tag from the sidebar." },
  { icon: Search, title: "Instant Search", desc: "Full-text search across all note titles and content. Find anything in milliseconds as you type." },
  { icon: Download, title: "Export Notes", desc: "Export any note as a Markdown (.md) file with one click. Your notes, your files, always." },
  { icon: BarChart2, title: "Word & Char Count", desc: "See live word count, character count, and reading time in the editor status bar as you write." },
  { icon: Moon, title: "Dark Mode", desc: "Switch between a crisp light theme and a comfortable dark mode. Saved automatically for your next visit." },
  { icon: Keyboard, title: "Keyboard Shortcuts", desc: "Create notes with ⌘N, toggle preview with ⌘P, search with ⌘K. Power-user friendly from day one." },
  { icon: Lock, title: "Privacy First", desc: "Your notes are stored securely via Insforge. No ads, no tracking, no selling your data. Ever." },
  { icon: Cloud, title: "Sync Everywhere", desc: "Notes sync instantly across all your devices through the cloud. Pick up where you left off, always." },
  { icon: Zap, title: "Lightning Fast", desc: "Built with Next.js 15 App Router. Instant page loads, optimistic UI updates, no waiting around." },
];

const plugins = [
  "Markdown", "Word Count", "Pin Notes", "Dark Mode",
  "Export MD", "Keyboard Shortcuts", "Live Search", "Tags",
  "Auto-save", "Starred Notes", "Archive", "Trash"
];

const testimonials = [
  { name: "Sarah K.", role: "Product Designer", text: "InsNote Smart replaced Notion for my daily notes. The markdown preview is flawless and it's incredibly fast." },
  { name: "James T.", role: "Software Engineer", text: "Finally a notes app that gets out of my way. The keyboard shortcuts and search make it a joy to use." },
  { name: "Amara D.", role: "Writer", text: "The clean 3-panel layout and tag system keep all my research organized. I'm never losing a note again." },
];

export function LandingPage() {
  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0f", color: "#f0f0ff", overflowX: "hidden" }}>

      {/* Nav */}
      <nav style={{ position: "sticky", top: 0, zIndex: 100, borderBottom: "1px solid rgba(255,255,255,0.07)", backdropFilter: "blur(20px)", background: "rgba(10,10,15,0.85)", padding: "0 32px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: 64 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: "linear-gradient(135deg,#6366f1,#8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <BookOpen size={16} color="white" />
            </div>
            <span style={{ fontWeight: 800, fontSize: 18, background: "linear-gradient(135deg,#a5b4fc,#c4b5fd)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              InsNote Smart
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <a href="#features" style={{ padding: "6px 14px", borderRadius: 8, color: "#c7d2fe", fontSize: 14, textDecoration: "none", opacity: 0.8 }}>Features</a>
            <a href="#plugins" style={{ padding: "6px 14px", borderRadius: 8, color: "#c7d2fe", fontSize: 14, textDecoration: "none", opacity: 0.8 }}>Plugins</a>
            <Link href="/notes-next/app" style={{ padding: "8px 20px", borderRadius: 8, background: "linear-gradient(135deg,#6366f1,#8b5cf6)", color: "white", fontSize: 14, fontWeight: 600, textDecoration: "none", display: "flex", alignItems: "center", gap: 6 }}>
              Open App <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="landing-gradient" style={{ padding: "100px 32px 80px", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle at 50% 0%, rgba(99,102,241,0.3) 0%, transparent 60%)", pointerEvents: "none" }} />
        <div style={{ maxWidth: 800, margin: "0 auto", position: "relative" }}>
          <div style={{ display: "flex", justifyContent: "center", gap: 8, flexWrap: "wrap", marginBottom: 28 }}>
            {["Free Forever", "Open Source", "Privacy First"].map(t => (
              <span key={t} className="plugin-badge">
                <CheckCircle size={11} /> {t}
              </span>
            ))}
          </div>

          <h1 style={{ fontSize: "clamp(36px,6vw,68px)", fontWeight: 900, lineHeight: 1.1, marginBottom: 24, background: "linear-gradient(135deg,#ffffff 0%,#c7d2fe 50%,#a5b4fc 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            Notes that think<br />as fast as you do
          </h1>

          <p style={{ fontSize: "clamp(16px,2vw,20px)", color: "#c7d2fe", lineHeight: 1.7, marginBottom: 40, opacity: 0.85 }}>
            InsNote Smart is a beautifully crafted, privacy-first note-taking app with full markdown support, tags, instant search, and powerful plugins — all in an elegant 3-panel interface.
          </p>

          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/notes-next/app" className="glow-btn" style={{ padding: "14px 32px", borderRadius: 12, color: "white", fontSize: 16, fontWeight: 700, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 8 }}>
              <Sparkles size={18} /> Start Writing Free
            </Link>
            <a href="#features" style={{ padding: "14px 32px", borderRadius: 12, border: "1px solid rgba(165,180,252,0.3)", color: "#c7d2fe", fontSize: 16, fontWeight: 600, textDecoration: "none", backdropFilter: "blur(10px)", background: "rgba(255,255,255,0.04)" }}>
              See Features
            </a>
          </div>

          {/* App mockup */}
          <div style={{ marginTop: 60, borderRadius: 16, overflow: "hidden", border: "1px solid rgba(165,180,252,0.15)", boxShadow: "0 40px 120px rgba(99,102,241,0.3)", background: "#141420" }}>
            <div style={{ padding: "12px 16px", background: "#1a1a2e", borderBottom: "1px solid rgba(165,180,252,0.1)", display: "flex", alignItems: "center", gap: 8 }}>
              {["#f87171","#fbbf24","#34d399"].map(c => (
                <div key={c} style={{ width: 12, height: 12, borderRadius: "50%", background: c }} />
              ))}
              <span style={{ marginLeft: 8, fontSize: 12, color: "#6366f1", fontFamily: "monospace" }}>insnote.app</span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "160px 240px 1fr", height: 320, textAlign: "left" }}>
              <div style={{ borderRight: "1px solid rgba(165,180,252,0.08)", padding: 12 }}>
                {["Notes","Starred","Archived","Trash"].map((v,i) => (
                  <div key={v} style={{ padding: "6px 8px", borderRadius: 6, marginBottom: 2, background: i===0 ? "rgba(99,102,241,0.2)" : "transparent", color: i===0 ? "#a5b4fc" : "#6b7280", fontSize: 12, display: "flex", alignItems: "center", gap: 6 }}>
                    <div style={{ width: 6, height: 6, borderRadius: "50%", background: i===0 ? "#6366f1" : "transparent" }} /> {v}
                  </div>
                ))}
                <div style={{ marginTop: 16, marginBottom: 6, fontSize: 10, color: "#4b5563", textTransform: "uppercase", letterSpacing: 1 }}>Tags</div>
                {["Work","Personal","Ideas"].map((t,i) => (
                  <div key={t} style={{ padding: "4px 8px", borderRadius: 6, marginBottom: 2, fontSize: 11, color: "#6b7280", display: "flex", alignItems: "center", gap: 5 }}>
                    <div style={{ width: 6, height: 6, borderRadius: "50%", background: ["#6366f1","#10b981","#f59e0b"][i] }} />{t}
                  </div>
                ))}
              </div>
              <div style={{ borderRight: "1px solid rgba(165,180,252,0.08)", padding: 12 }}>
                <div style={{ marginBottom: 10, padding: "6px 8px", background: "rgba(165,180,252,0.06)", borderRadius: 6, fontSize: 11, color: "#9ca3af", display: "flex", gap: 6, alignItems: "center" }}>
                  <Search size={10} /> Search notes...
                </div>
                {[
                  { t: "📌 Meeting Notes", p: "Q3 planning session with the team...", star: true },
                  { t: "Project Ideas", p: "Build a markdown-first notes app...", star: false },
                  { t: "Reading List", p: "Books to read this quarter...", star: false },
                ].map((n,i) => (
                  <div key={i} style={{ padding: "8px 10px", borderRadius: 8, marginBottom: 6, background: i===1 ? "rgba(99,102,241,0.15)" : "transparent", border: i===1 ? "1px solid rgba(99,102,241,0.2)" : "1px solid transparent" }}>
                    <div style={{ fontSize: 11, fontWeight: 600, color: i===1 ? "#a5b4fc" : "#d1d5db", marginBottom: 2 }}>{n.t}</div>
                    <div style={{ fontSize: 10, color: "#6b7280" }}>{n.p}</div>
                  </div>
                ))}
              </div>
              <div style={{ padding: 20 }}>
                <div style={{ fontSize: 16, fontWeight: 700, color: "#e2e8f0", marginBottom: 8 }}>Project Ideas</div>
                <div style={{ fontSize: 11, color: "#4f46e5", marginBottom: 14, fontFamily: "monospace", lineHeight: 1.9 }}>
                  <span style={{ color: "#7c3aed" }}># </span><span style={{ color: "#c4b5fd" }}>InsNote Smart</span><br />
                  <span style={{ color: "#10b981" }}>## </span><span style={{ color: "#6ee7b7" }}>Features</span><br />
                  <span style={{ color: "#6b7280" }}>- </span><span style={{ color: "#d1d5db" }}>Markdown preview</span><br />
                  <span style={{ color: "#6b7280" }}>- </span><span style={{ color: "#d1d5db" }}>Tag system</span><br />
                  <span style={{ color: "#6b7280" }}>- </span><span style={{ color: "#d1d5db" }}>Export to .md</span>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <span style={{ fontSize: 10, color: "#4f46e5", background: "rgba(99,102,241,0.1)", padding: "2px 8px", borderRadius: 10 }}>PREVIEW</span>
                  <span style={{ fontSize: 10, color: "#6b7280" }}>47 words · 2 min read</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" style={{ padding: "80px 32px", maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <span className="plugin-badge" style={{ marginBottom: 16, display: "inline-flex" }}>
            <Zap size={11} /> Everything you need
          </span>
          <h2 style={{ fontSize: "clamp(28px,4vw,44px)", fontWeight: 800, marginTop: 12, marginBottom: 14 }}>
            Packed with powerful features
          </h2>
          <p style={{ color: "#9ca3af", fontSize: 18, maxWidth: 520, margin: "0 auto" }}>
            InsNote Smart comes with everything built-in. No subscriptions, no premium tiers, no limits.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: 20 }}>
          {features.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="feature-card" style={{ padding: 24 }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: "rgba(99,102,241,0.15)", border: "1px solid rgba(99,102,241,0.2)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
                <Icon size={20} color="#818cf8" />
              </div>
              <h3 style={{ fontWeight: 700, fontSize: 15, marginBottom: 8, color: "#e2e8f0" }}>{title}</h3>
              <p style={{ fontSize: 13.5, color: "#6b7280", lineHeight: 1.6 }}>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Plugin Badges */}
      <section id="plugins" style={{ padding: "60px 32px", background: "rgba(99,102,241,0.04)", borderTop: "1px solid rgba(255,255,255,0.05)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", textAlign: "center" }}>
          <h2 style={{ fontSize: "clamp(24px,3.5vw,38px)", fontWeight: 800, marginBottom: 12 }}>All plugins included</h2>
          <p style={{ color: "#9ca3af", marginBottom: 36, fontSize: 16 }}>No plugin store. No paid add-ons. Every feature ships with the app.</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10, justifyContent: "center" }}>
            {plugins.map(p => (
              <span key={p} className="plugin-badge" style={{ fontSize: 13, padding: "6px 16px" }}>
                <CheckCircle size={12} /> {p}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section style={{ padding: "80px 32px", maxWidth: 1100, margin: "0 auto" }}>
        <h2 style={{ fontSize: "clamp(24px,3.5vw,38px)", fontWeight: 800, textAlign: "center", marginBottom: 48 }}>
          Loved by note-takers
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))", gap: 24 }}>
          {testimonials.map(t => (
            <div key={t.name} className="feature-card" style={{ padding: 28 }}>
              <div style={{ display: "flex", gap: 4, marginBottom: 16 }}>
                {[1,2,3,4,5].map(i => <span key={i} style={{ color: "#fbbf24", fontSize: 14 }}>★</span>)}
              </div>
              <p style={{ color: "#d1d5db", fontSize: 14, lineHeight: 1.7, marginBottom: 20 }}>"{t.text}"</p>
              <div>
                <div style={{ fontWeight: 700, fontSize: 13, color: "#e2e8f0" }}>{t.name}</div>
                <div style={{ fontSize: 12, color: "#6b7280" }}>{t.role}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="landing-gradient" style={{ padding: "80px 32px", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle at 50% 100%, rgba(139,92,246,0.3) 0%, transparent 60%)", pointerEvents: "none" }} />
        <div style={{ maxWidth: 600, margin: "0 auto", position: "relative" }}>
          <h2 style={{ fontSize: "clamp(28px,4vw,48px)", fontWeight: 900, marginBottom: 16 }}>
            Start writing smarter today
          </h2>
          <p style={{ color: "#c7d2fe", fontSize: 18, marginBottom: 36, opacity: 0.85 }}>
            Free forever. No account needed. Just open the app and start writing.
          </p>
          <Link href="/notes-next/app" className="glow-btn" style={{ padding: "16px 40px", borderRadius: 14, color: "white", fontSize: 17, fontWeight: 700, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 10 }}>
            <Sparkles size={20} /> Open InsNote Smart
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: "1px solid rgba(255,255,255,0.07)", padding: "28px 32px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 24, height: 24, borderRadius: 6, background: "linear-gradient(135deg,#6366f1,#8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <BookOpen size={12} color="white" />
          </div>
          <span style={{ fontWeight: 700, fontSize: 14, color: "#a5b4fc" }}>InsNote Smart</span>
        </div>
        <div style={{ fontSize: 13, color: "#4b5563" }}>Powered by Insforge · Built with Next.js 15</div>
        <Link href="/notes-next/app" style={{ fontSize: 13, color: "#6366f1", textDecoration: "none", fontWeight: 600 }}>Open App →</Link>
      </footer>
    </div>
  );
}
