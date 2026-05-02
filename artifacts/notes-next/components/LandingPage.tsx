"use client";

import Link from "next/link";
import {
  FileText, Star, Tag, Search, Moon, Download, Pin,
  Eye, Keyboard, Zap, Lock, Cloud, ArrowRight,
  CheckCircle, Sparkles, BookOpen, BarChart2, Hash,
  ChevronDown
} from "lucide-react";

const NAV_FEATURES = "#features";
const NAV_PLUGINS = "#plugins";
const APP_LINK = "/notes-next/notes";

const features = [
  { icon: Eye, title: "Markdown Preview", desc: "Write in markdown, toggle live preview. Headings, bold, lists, code blocks, tables — all rendered beautifully." },
  { icon: Pin, title: "Pin Notes", desc: "Pin important notes to the top of your list so they're always the first thing you see." },
  { icon: Star, title: "Star & Archive", desc: "Star your favourites, archive old notes, move to trash. Full note lifecycle in one clean interface." },
  { icon: Tag, title: "Tags & Filters", desc: "Create tags to categorise notes. Click any tag in the sidebar to instantly filter your list." },
  { icon: Search, title: "Instant Search", desc: "Full-text search across every note. Results update as you type — find anything in milliseconds." },
  { icon: Download, title: "Export as Markdown", desc: "Download any note as a .md file with one click. Your notes are always yours to keep." },
  { icon: BarChart2, title: "Live Word Count", desc: "See word count, character count and estimated reading time update live as you write." },
  { icon: Moon, title: "Dark / Light Mode", desc: "Switch between a crisp light and a restful dark theme. Your preference is remembered." },
  { icon: Keyboard, title: "Keyboard Shortcuts", desc: "⌘N to create, ⌘K to search, ⌘P to toggle preview. Built for power users from day one." },
  { icon: Lock, title: "Privacy First", desc: "No ads, no tracking, no selling your data. Notes stored securely via Insforge." },
  { icon: Cloud, title: "Cloud Sync", desc: "Notes sync instantly across all devices through the cloud. Pick up exactly where you left off." },
  { icon: Zap, title: "Lightning Fast", desc: "Next.js 15 App Router with optimistic UI updates. No loading spinners, no waiting." },
];

const plugins = [
  "Markdown", "Word Count", "Pin Notes", "Dark Mode",
  "Export MD", "Keyboard Shortcuts", "Live Search", "Tags",
  "Auto-save", "Starred", "Archive", "Trash",
];

const testimonials = [
  { name: "Sarah K.", role: "Product Designer", text: "InsNote Smart replaced Notion for my daily notes. The markdown preview is flawless and it's incredibly fast." },
  { name: "James T.", role: "Software Engineer", text: "Finally a notes app that gets out of my way. Keyboard shortcuts and instant search make it a joy." },
  { name: "Amara D.", role: "Writer", text: "The clean 3-panel layout and tag system keep all my research perfectly organised. Never losing a note again." },
];

export function LandingPage() {
  return (
    <div style={{ minHeight: "100vh", background: "#07070f", color: "#f0f0ff", overflowX: "hidden", fontFamily: "-apple-system, BlinkMacSystemFont, 'Inter', sans-serif" }}>

      {/* ── Navbar ── */}
      <header style={{ position: "sticky", top: 0, zIndex: 100, borderBottom: "1px solid rgba(255,255,255,0.07)", backdropFilter: "blur(20px)", background: "rgba(7,7,15,0.85)" }}>
        <div style={{ maxWidth: 1180, margin: "0 auto", padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 62 }}>
          {/* Logo */}
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 34, height: 34, borderRadius: 9, background: "linear-gradient(135deg,#6366f1,#8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 0 18px rgba(99,102,241,0.4)" }}>
              <BookOpen size={17} color="white" strokeWidth={2} />
            </div>
            <span style={{ fontWeight: 800, fontSize: 19, letterSpacing: -0.5, background: "linear-gradient(90deg,#a5b4fc,#e879f9)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              InsNote Smart
            </span>
          </div>

          {/* Nav links */}
          <nav style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <a href={NAV_FEATURES} style={{ padding: "7px 16px", borderRadius: 8, color: "#94a3b8", fontSize: 14, textDecoration: "none", transition: "color 0.15s" }}
               onMouseEnter={e => (e.currentTarget.style.color = "#e2e8f0")}
               onMouseLeave={e => (e.currentTarget.style.color = "#94a3b8")}>
              Features
            </a>
            <a href={NAV_PLUGINS} style={{ padding: "7px 16px", borderRadius: 8, color: "#94a3b8", fontSize: 14, textDecoration: "none", transition: "color 0.15s" }}
               onMouseEnter={e => (e.currentTarget.style.color = "#e2e8f0")}
               onMouseLeave={e => (e.currentTarget.style.color = "#94a3b8")}>
              Plugins
            </a>
            <Link href={APP_LINK}
              style={{ marginLeft: 8, padding: "8px 20px", borderRadius: 10, background: "linear-gradient(135deg,#6366f1,#8b5cf6)", color: "white", fontSize: 14, fontWeight: 700, textDecoration: "none", display: "flex", alignItems: "center", gap: 6, boxShadow: "0 0 20px rgba(99,102,241,0.35)", transition: "box-shadow 0.2s" }}
              onMouseEnter={e => ((e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 0 30px rgba(99,102,241,0.55)")}
              onMouseLeave={e => ((e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 0 20px rgba(99,102,241,0.35)")}>
              Open App <ArrowRight size={14} />
            </Link>
          </nav>
        </div>
      </header>

      {/* ── Hero ── */}
      <section style={{ minHeight: "90vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "80px 24px 60px", textAlign: "center", position: "relative", overflow: "hidden" }}>
        {/* background glow */}
        <div style={{ position: "absolute", top: "-20%", left: "50%", transform: "translateX(-50%)", width: 900, height: 600, borderRadius: "50%", background: "radial-gradient(circle, rgba(99,102,241,0.18) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: "10%", right: "-10%", width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle, rgba(139,92,246,0.12) 0%, transparent 70%)", pointerEvents: "none" }} />

        {/* Badges */}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center", marginBottom: 32 }}>
          {["Free Forever", "No Account Needed", "Privacy First"].map(b => (
            <span key={b} style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "5px 14px", borderRadius: 20, background: "rgba(99,102,241,0.12)", border: "1px solid rgba(99,102,241,0.3)", fontSize: 12, color: "#a5b4fc" }}>
              <CheckCircle size={11} /> {b}
            </span>
          ))}
        </div>

        {/* Headline */}
        <h1 style={{ fontSize: "clamp(40px,7vw,80px)", fontWeight: 900, lineHeight: 1.05, letterSpacing: -2, marginBottom: 24, maxWidth: 860 }}>
          <span style={{ background: "linear-gradient(135deg,#ffffff 0%,#c7d2fe 50%,#a78bfa 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            Notes that think
          </span>
          <br />
          <span style={{ background: "linear-gradient(135deg,#e879f9,#a78bfa,#60a5fa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            as fast as you do
          </span>
        </h1>

        <p style={{ fontSize: "clamp(16px,2.2vw,20px)", color: "#94a3b8", lineHeight: 1.75, maxWidth: 580, marginBottom: 44 }}>
          InsNote Smart is a beautifully crafted, privacy-first note-taking app with full markdown support, tags, instant search, and powerful built-in plugins.
        </p>

        {/* CTAs */}
        <div style={{ display: "flex", gap: 14, flexWrap: "wrap", justifyContent: "center", marginBottom: 64 }}>
          <Link href={APP_LINK}
            style={{ padding: "15px 36px", borderRadius: 14, background: "linear-gradient(135deg,#6366f1,#8b5cf6)", color: "white", fontSize: 17, fontWeight: 700, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 10, boxShadow: "0 0 40px rgba(99,102,241,0.45)" }}>
            <Sparkles size={20} /> Start Writing Free
          </Link>
          <a href={NAV_FEATURES}
            style={{ padding: "15px 36px", borderRadius: 14, border: "1px solid rgba(165,180,252,0.25)", color: "#c7d2fe", fontSize: 17, fontWeight: 600, textDecoration: "none", background: "rgba(255,255,255,0.04)", backdropFilter: "blur(10px)" }}>
            See All Features
          </a>
        </div>

        {/* App Preview Card */}
        <div style={{ width: "100%", maxWidth: 900, borderRadius: 18, overflow: "hidden", border: "1px solid rgba(165,180,252,0.12)", boxShadow: "0 40px 120px rgba(0,0,0,0.6)", background: "#0f0f1a" }}>
          {/* Window bar */}
          <div style={{ padding: "11px 18px", background: "#13131f", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", gap: 8 }}>
            {["#f87171","#fbbf24","#34d399"].map(c => <div key={c} style={{ width: 11, height: 11, borderRadius: "50%", background: c }} />)}
            <div style={{ marginLeft: 12, flex: 1, background: "rgba(255,255,255,0.06)", borderRadius: 6, padding: "3px 12px", fontSize: 11, color: "#6366f1", textAlign: "center" }}>insnote.app/notes</div>
          </div>
          {/* 3-panel mockup */}
          <div style={{ display: "grid", gridTemplateColumns: "170px 240px 1fr", height: 340, textAlign: "left" }}>
            {/* Sidebar */}
            <div style={{ borderRight: "1px solid rgba(255,255,255,0.05)", padding: "14px 10px", background: "#0c0c18" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 16, padding: "0 4px" }}>
                <div style={{ width: 22, height: 22, borderRadius: 6, background: "linear-gradient(135deg,#6366f1,#8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <BookOpen size={11} color="white" />
                </div>
                <span style={{ fontWeight: 700, fontSize: 13, color: "#a5b4fc" }}>InsNote</span>
              </div>
              {[["Notes","📄",true],["Pinned","📌",false],["Starred","⭐",false],["Archived","📦",false],["Trash","🗑",false]].map(([v,icon,active]) => (
                <div key={String(v)} style={{ padding: "6px 8px", borderRadius: 7, marginBottom: 2, background: active ? "rgba(99,102,241,0.2)" : "transparent", color: active ? "#a5b4fc" : "#6b7280", fontSize: 12, display: "flex", alignItems: "center", gap: 7 }}>
                  <span style={{ fontSize: 11 }}>{icon}</span>{v}
                </div>
              ))}
              <div style={{ marginTop: 14, marginBottom: 6, fontSize: 9, color: "#374151", textTransform: "uppercase", letterSpacing: 1, padding: "0 4px" }}>Tags</div>
              {[["Work","#6366f1"],["Personal","#10b981"],["Ideas","#f59e0b"]].map(([t,c]) => (
                <div key={t} style={{ padding: "4px 8px", borderRadius: 6, marginBottom: 2, fontSize: 11, color: "#6b7280", display: "flex", alignItems: "center", gap: 6 }}>
                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: c }} />{t}
                </div>
              ))}
            </div>
            {/* Note list */}
            <div style={{ borderRight: "1px solid rgba(255,255,255,0.05)", padding: "12px", background: "#0e0e1a" }}>
              <div style={{ marginBottom: 10, padding: "6px 10px", background: "rgba(255,255,255,0.05)", borderRadius: 7, fontSize: 11, color: "#4b5563", display: "flex", gap: 6, alignItems: "center" }}>
                <Search size={10} /> Search notes… (⌘K)
              </div>
              {[
                { t: "📌 Meeting Notes", p: "Q3 planning session with the team and stakeholders…", sel: false },
                { t: "Project Ideas", p: "Build a markdown-first smart notes app…", sel: true },
                { t: "Reading List", p: "Books to read this quarter: Deep Work, Atomic…", sel: false },
                { t: "Daily Journal", p: "Today was productive. Finished the landing page…", sel: false },
              ].map((n, i) => (
                <div key={i} style={{ padding: "9px 10px", borderRadius: 9, marginBottom: 5, background: n.sel ? "rgba(99,102,241,0.15)" : "rgba(255,255,255,0.02)", border: `1px solid ${n.sel ? "rgba(99,102,241,0.25)" : "rgba(255,255,255,0.04)"}` }}>
                  <div style={{ fontSize: 11, fontWeight: 600, color: n.sel ? "#a5b4fc" : "#d1d5db", marginBottom: 3, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{n.t}</div>
                  <div style={{ fontSize: 10, color: "#6b7280", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{n.p}</div>
                </div>
              ))}
            </div>
            {/* Editor */}
            <div style={{ padding: "16px 22px", background: "#0e0e1a" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12, paddingBottom: 10, borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                <span style={{ fontSize: 10, color: "#374151" }}>Saturday, May 2 · 4:28 PM</span>
                <div style={{ display: "flex", gap: 8, fontSize: 10, color: "#374151" }}>
                  <span>👁 PREVIEW</span><span>📥</span><span>📌</span><span>⭐</span>
                </div>
              </div>
              <div style={{ fontSize: 18, fontWeight: 700, color: "#e2e8f0", marginBottom: 10 }}>Project Ideas</div>
              <div style={{ fontSize: 12, color: "#6b7280", fontFamily: "monospace", lineHeight: 2 }}>
                <span style={{ color: "#7c3aed" }}># </span><span style={{ color: "#c4b5fd" }}>InsNote Smart</span><br />
                <span style={{ color: "#059669" }}>## </span><span style={{ color: "#6ee7b7" }}>Features</span><br />
                <span style={{ color: "#4b5563" }}>- </span><span style={{ color: "#d1d5db" }}>Markdown preview ✓</span><br />
                <span style={{ color: "#4b5563" }}>- </span><span style={{ color: "#d1d5db" }}>Pin & star notes ✓</span><br />
                <span style={{ color: "#4b5563" }}>- </span><span style={{ color: "#d1d5db" }}>Export as .md ✓</span>
              </div>
              <div style={{ marginTop: 16, paddingTop: 10, borderTop: "1px solid rgba(255,255,255,0.05)", display: "flex", gap: 14, fontSize: 10, color: "#374151" }}>
                <span>47 words</span><span>230 chars</span><span>1 min read</span><span style={{ color: "#6366f1", marginLeft: "auto" }}>Auto-saved</span>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div style={{ marginTop: 40, display: "flex", flexDirection: "column", alignItems: "center", gap: 6, color: "#374151" }}>
          <span style={{ fontSize: 11 }}>Scroll to explore</span>
          <ChevronDown size={16} />
        </div>
      </section>

      {/* ── Features ── */}
      <section id="features" style={{ padding: "80px 24px", maxWidth: 1180, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "5px 14px", borderRadius: 20, background: "rgba(99,102,241,0.12)", border: "1px solid rgba(99,102,241,0.3)", fontSize: 12, color: "#a5b4fc", marginBottom: 16 }}>
            <Zap size={11} /> Everything you need, nothing you don't
          </span>
          <h2 style={{ fontSize: "clamp(28px,4vw,46px)", fontWeight: 800, letterSpacing: -1, marginTop: 14, marginBottom: 16, color: "#f1f5f9" }}>
            Packed with powerful features
          </h2>
          <p style={{ color: "#64748b", fontSize: 18, maxWidth: 500, margin: "0 auto" }}>
            Every feature ships with the app. No subscriptions, no premium tiers, no limits.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(270px,1fr))", gap: 18 }}>
          {features.map(({ icon: Icon, title, desc }) => (
            <div key={title}
              style={{ padding: 24, borderRadius: 16, border: "1px solid rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.02)", transition: "all 0.2s", cursor: "default" }}
              onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(99,102,241,0.35)"; (e.currentTarget as HTMLDivElement).style.background = "rgba(99,102,241,0.05)"; (e.currentTarget as HTMLDivElement).style.transform = "translateY(-3px)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(255,255,255,0.06)"; (e.currentTarget as HTMLDivElement).style.background = "rgba(255,255,255,0.02)"; (e.currentTarget as HTMLDivElement).style.transform = "none"; }}>
              <div style={{ width: 46, height: 46, borderRadius: 12, background: "rgba(99,102,241,0.12)", border: "1px solid rgba(99,102,241,0.2)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
                <Icon size={21} color="#818cf8" />
              </div>
              <h3 style={{ fontWeight: 700, fontSize: 15, marginBottom: 8, color: "#e2e8f0" }}>{title}</h3>
              <p style={{ fontSize: 13.5, color: "#64748b", lineHeight: 1.65 }}>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Plugins ── */}
      <section id="plugins" style={{ padding: "64px 24px", background: "rgba(99,102,241,0.04)", borderTop: "1px solid rgba(255,255,255,0.04)", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
        <div style={{ maxWidth: 860, margin: "0 auto", textAlign: "center" }}>
          <h2 style={{ fontSize: "clamp(24px,3.5vw,40px)", fontWeight: 800, letterSpacing: -0.8, marginBottom: 12, color: "#f1f5f9" }}>
            All plugins included
          </h2>
          <p style={{ color: "#64748b", marginBottom: 36, fontSize: 16 }}>
            No plugin store. No paid add-ons. Every capability ships with the app.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10, justifyContent: "center" }}>
            {plugins.map(p => (
              <span key={p} style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "7px 16px", borderRadius: 20, background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.25)", fontSize: 13, color: "#c7d2fe" }}>
                <CheckCircle size={12} /> {p}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section style={{ padding: "80px 24px", maxWidth: 1100, margin: "0 auto" }}>
        <h2 style={{ fontSize: "clamp(24px,3.5vw,40px)", fontWeight: 800, letterSpacing: -0.8, textAlign: "center", marginBottom: 48, color: "#f1f5f9" }}>
          Loved by note-takers
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))", gap: 22 }}>
          {testimonials.map(t => (
            <div key={t.name} style={{ padding: 28, borderRadius: 16, border: "1px solid rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.02)" }}>
              <div style={{ display: "flex", gap: 3, marginBottom: 16 }}>
                {[1,2,3,4,5].map(i => <span key={i} style={{ color: "#fbbf24", fontSize: 15 }}>★</span>)}
              </div>
              <p style={{ color: "#94a3b8", fontSize: 14, lineHeight: 1.75, marginBottom: 20 }}>"{t.text}"</p>
              <div style={{ fontWeight: 700, fontSize: 13, color: "#e2e8f0" }}>{t.name}</div>
              <div style={{ fontSize: 12, color: "#4b5563" }}>{t.role}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ padding: "80px 24px", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle at 50% 50%, rgba(99,102,241,0.15) 0%, transparent 65%)", pointerEvents: "none" }} />
        <div style={{ maxWidth: 600, margin: "0 auto", position: "relative" }}>
          <h2 style={{ fontSize: "clamp(28px,4vw,50px)", fontWeight: 900, letterSpacing: -1.5, marginBottom: 16, background: "linear-gradient(135deg,#ffffff,#a78bfa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            Start writing smarter today
          </h2>
          <p style={{ color: "#64748b", fontSize: 18, marginBottom: 36 }}>
            Free forever. No account needed. Open the app and start writing.
          </p>
          <Link href={APP_LINK}
            style={{ padding: "17px 44px", borderRadius: 14, background: "linear-gradient(135deg,#6366f1,#8b5cf6)", color: "white", fontSize: 17, fontWeight: 700, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 10, boxShadow: "0 0 50px rgba(99,102,241,0.45)" }}>
            <Sparkles size={20} /> Open InsNote Smart
          </Link>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer style={{ borderTop: "1px solid rgba(255,255,255,0.06)", padding: "24px 32px" }}>
        <div style={{ maxWidth: 1180, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
            <div style={{ width: 26, height: 26, borderRadius: 7, background: "linear-gradient(135deg,#6366f1,#8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <BookOpen size={13} color="white" />
            </div>
            <span style={{ fontWeight: 800, fontSize: 15, background: "linear-gradient(90deg,#a5b4fc,#e879f9)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>InsNote Smart</span>
          </div>
          <div style={{ display: "flex", gap: 24 }}>
            <a href={NAV_FEATURES} style={{ fontSize: 13, color: "#4b5563", textDecoration: "none" }}>Features</a>
            <a href={NAV_PLUGINS} style={{ fontSize: 13, color: "#4b5563", textDecoration: "none" }}>Plugins</a>
            <Link href={APP_LINK} style={{ fontSize: 13, color: "#6366f1", textDecoration: "none", fontWeight: 600 }}>Open App →</Link>
          </div>
          <div style={{ fontSize: 12, color: "#1e293b" }}>© 2026 InsNote Smart · Powered by Insforge & Next.js</div>
        </div>
      </footer>

    </div>
  );
}
