"use client";

import { useState, useEffect } from "react";
import {
  FileText, Star, Archive, Trash2, Tag, Plus, X,
  Sun, Moon, Pin, Keyboard, Home, Settings,
  ChevronLeft, ChevronRight, Hash, PanelLeft,
  StickyNote, BookMarked, FolderArchive, Layers
} from "lucide-react";
import { useTheme } from "@/lib/providers";
import Link from "next/link";
import type { View } from "./AppShell";
import type { Tag as TagType } from "@/lib/api";

interface Props {
  view: View;
  activeTagId: string | null;
  tags: TagType[];
  counts: Record<string, number>;
  onViewChange: (v: View) => void;
  onTagClick: (id: string) => void;
  onCreateTag: (name: string) => void;
  onDeleteTag: (id: string) => void;
  onShowShortcuts: () => void;
  onOpenSettings: () => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

const TAG_COLORS = ["#818cf8", "#34d399", "#f59e0b", "#f87171", "#60a5fa", "#c084fc", "#fb923c", "#4ade80"];

export function Sidebar({ view, activeTagId, tags, counts, onViewChange, onTagClick, onCreateTag, onDeleteTag, onShowShortcuts, onOpenSettings, collapsed, onToggleCollapse }: Props) {
  const { dark, toggle } = useTheme();
  const [addingTag, setAddingTag] = useState(false);
  const [newTagName, setNewTagName] = useState("");
  const [newTagColor, setNewTagColor] = useState(TAG_COLORS[0]);
  const [hoveredTag, setHoveredTag] = useState<string | null>(null);

  function submitTag() {
    const name = newTagName.trim();
    if (!name) { setAddingTag(false); return; }
    onCreateTag(name);
    setNewTagName("");
    setAddingTag(false);
  }

  const navItems = [
    { id: "notes" as View,    label: "Notes",    icon: StickyNote,     count: counts.notes },
    { id: "pinned" as View,   label: "Pinned",   icon: Pin,            count: counts.pinned },
    { id: "starred" as View,  label: "Starred",  icon: Star,           count: counts.starred },
    { id: "archived" as View, label: "Archived", icon: FolderArchive,  count: counts.archived },
    { id: "trash" as View,    label: "Trash",    icon: Trash2,         count: counts.trash },
  ];

  /* ── Collapsed rail ── */
  if (collapsed) {
    return (
      <div className="panel-sidebar" style={{ width: 52, display: "flex", flexDirection: "column", alignItems: "center", padding: "12px 0 10px", gap: 2 }}>
        {/* Logo */}
        <div style={{ width: 32, height: 32, borderRadius: 10, background: "linear-gradient(135deg,#6366f1,#8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 8, boxShadow: "0 0 20px rgba(99,102,241,0.35)" }}>
          <BookMarked size={14} color="white" strokeWidth={2} />
        </div>

        <button onClick={onToggleCollapse} className="sidebar-collapse-btn" title="Expand sidebar" style={{ marginBottom: 6 }}>
          <ChevronRight size={14} />
        </button>

        {navItems.map(item => (
          <button key={item.id}
            title={`${item.label}${item.count ? ` (${item.count})` : ""}`}
            onClick={() => onViewChange(item.id)}
            style={{
              background: view === item.id ? "var(--accent-light)" : "none",
              border: "none", cursor: "pointer", padding: "9px",
              borderRadius: 9, color: view === item.id ? "var(--accent)" : "var(--text-faint)",
              display: "flex", alignItems: "center", justifyContent: "center",
              transition: "all 0.13s", width: 36, height: 36, position: "relative"
            }}
            onMouseEnter={e => { if (view !== item.id) (e.currentTarget as HTMLElement).style.background = "var(--bg-hover)"; }}
            onMouseLeave={e => { if (view !== item.id) (e.currentTarget as HTMLElement).style.background = "none"; }}>
            <item.icon size={15} strokeWidth={view === item.id ? 2.2 : 1.8} />
            {item.count > 0 && (
              <span style={{ position: "absolute", top: 4, right: 4, width: 6, height: 6, borderRadius: "50%", background: "var(--accent)", boxShadow: "0 0 6px var(--accent)" }} />
            )}
          </button>
        ))}

        <div style={{ flex: 1 }} />
        <button onClick={toggle} title={dark ? "Light mode" : "Dark mode"}
          style={{ background: "none", border: "none", cursor: "pointer", padding: 8, borderRadius: 8, color: "var(--text-faint)", display: "flex", transition: "all 0.13s" }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "var(--bg-hover)"; (e.currentTarget as HTMLElement).style.color = "var(--text-muted)"; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "none"; (e.currentTarget as HTMLElement).style.color = "var(--text-faint)"; }}>
          {dark ? <Sun size={14} /> : <Moon size={14} />}
        </button>
      </div>
    );
  }

  /* ── Full sidebar ── */
  return (
    <div className="panel-sidebar" style={{ width: 220, display: "flex", flexDirection: "column", flexShrink: 0, overflow: "hidden" }}>

      {/* Brand header */}
      <div style={{ padding: "14px 14px 12px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 9, textDecoration: "none", flex: 1, minWidth: 0 }}>
          <div style={{
            width: 30, height: 30, borderRadius: 10,
            background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
            display: "flex", alignItems: "center", justifyContent: "center",
            flexShrink: 0, boxShadow: "0 0 18px rgba(99,102,241,0.4)",
            transition: "transform 0.2s, box-shadow 0.2s"
          }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = "rotate(8deg) scale(1.08)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 0 28px rgba(99,102,241,0.6)"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = "none"; (e.currentTarget as HTMLElement).style.boxShadow = "0 0 18px rgba(99,102,241,0.4)"; }}>
            <BookMarked size={13} color="white" strokeWidth={2} />
          </div>
          <span style={{
            fontWeight: 800, fontSize: 13, letterSpacing: -0.4,
            background: "linear-gradient(90deg,var(--accent),var(--accent-2))",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap"
          }}>
            Smart Ins-Note
          </span>
        </Link>
        <div style={{ display: "flex", gap: 1, flexShrink: 0 }}>
          <button onClick={toggle} title={dark ? "Light mode" : "Dark mode"}
            style={{ background: "none", border: "none", cursor: "pointer", padding: "5px 6px", borderRadius: 7, color: "var(--text-faint)", display: "flex", alignItems: "center", transition: "all 0.13s" }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "var(--bg-hover)"; (e.currentTarget as HTMLElement).style.color = "var(--text-muted)"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "none"; (e.currentTarget as HTMLElement).style.color = "var(--text-faint)"; }}>
            {dark ? <Sun size={13} /> : <Moon size={13} />}
          </button>
          <button onClick={onToggleCollapse} className="sidebar-collapse-btn" title="Collapse sidebar">
            <ChevronLeft size={13} />
          </button>
        </div>
      </div>

      {/* Nav items */}
      <div style={{ padding: "0 8px 4px" }}>
        {navItems.map((item) => (
          <div key={item.id}
            className={`nav-item ${view === item.id ? "active" : ""}`}
            onClick={() => onViewChange(item.id)}>
            <span className="nav-icon-wrap" style={{ display: "flex", alignItems: "center", color: view === item.id ? "var(--accent)" : "var(--text-faint)", transition: "color 0.13s" }}>
              <item.icon size={14} strokeWidth={view === item.id ? 2.2 : 1.8} />
            </span>
            <span style={{ flex: 1, fontSize: 13 }}>{item.label}</span>
            {item.count > 0 && (
              <span className="count-badge"
                style={{
                  background: view === item.id ? "rgba(99,102,241,0.18)" : "var(--bg-hover)",
                  color: view === item.id ? "var(--accent)" : "var(--text-faint)",
                }}>
                {item.count}
              </span>
            )}
          </div>
        ))}
      </div>

      {/* Divider */}
      <div style={{ height: 1, background: "var(--border)", margin: "4px 14px 8px" }} />

      {/* Tags section */}
      <div style={{ padding: "0 8px", flex: 1, overflow: "auto" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "2px 4px 6px 6px" }}>
          <span style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1.1, color: "var(--text-faint)", display: "flex", alignItems: "center", gap: 5 }}>
            <Hash size={9} strokeWidth={2.5} /> Tags
          </span>
          <button onClick={() => setAddingTag(true)}
            style={{ background: "none", border: "none", cursor: "pointer", padding: "3px 4px", borderRadius: 6, color: "var(--text-faint)", display: "flex", transition: "all 0.13s" }}
            title="New tag"
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "var(--bg-hover)"; (e.currentTarget as HTMLElement).style.color = "var(--accent)"; (e.currentTarget as HTMLElement).style.transform = "rotate(45deg) scale(1.1)"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "none"; (e.currentTarget as HTMLElement).style.color = "var(--text-faint)"; (e.currentTarget as HTMLElement).style.transform = "none"; }}>
            <Plus size={12} />
          </button>
        </div>

        {addingTag && (
          <div style={{ padding: "4px 4px 8px", animation: "fadeInUp 0.15s ease" }}>
            <input autoFocus value={newTagName}
              onChange={(e) => setNewTagName(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") submitTag(); if (e.key === "Escape") { setAddingTag(false); setNewTagName(""); } }}
              onBlur={submitTag}
              placeholder="Tag name…"
              style={{ width: "100%", background: "var(--bg-hover)", border: "1px solid var(--accent)", borderRadius: 7, padding: "6px 10px", fontSize: 12, color: "var(--text-primary)", outline: "none", boxShadow: "0 0 0 3px rgba(99,102,241,0.15)" }}
            />
            <div style={{ display: "flex", gap: 5, marginTop: 7, paddingLeft: 2, flexWrap: "wrap" }}>
              {TAG_COLORS.map(c => (
                <button key={c} onClick={() => setNewTagColor(c)}
                  style={{ width: 14, height: 14, borderRadius: "50%", background: c, border: newTagColor === c ? "2px solid var(--text-primary)" : "2px solid transparent", cursor: "pointer", padding: 0, transition: "transform 0.1s", transform: newTagColor === c ? "scale(1.35)" : "none" }} />
              ))}
            </div>
          </div>
        )}

        {tags.length === 0 && !addingTag && (
          <div style={{ padding: "6px 8px 4px", fontSize: 11.5, color: "var(--text-faint)", fontStyle: "italic" }}>
            No tags — click + to add
          </div>
        )}

        {tags.map((tag, i) => (
          <div key={tag.id}
            className={`nav-item ${view === "tag" && activeTagId === tag.id ? "active" : ""}`}
            onClick={() => onTagClick(tag.id)}
            onMouseEnter={() => setHoveredTag(tag.id)}
            onMouseLeave={() => setHoveredTag(null)}
            style={{ animation: `fadeInUp 0.15s ease both`, animationDelay: `${i * 25}ms` }}>
            <div className="tag-dot" style={{ background: TAG_COLORS[i % TAG_COLORS.length], boxShadow: view === "tag" && activeTagId === tag.id ? `0 0 6px ${TAG_COLORS[i % TAG_COLORS.length]}` : "none" }} />
            <span style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontSize: 12.5 }}>{tag.name}</span>
            {hoveredTag === tag.id && (
              <button onClick={(e) => { e.stopPropagation(); onDeleteTag(tag.id); }}
                style={{ background: "none", border: "none", cursor: "pointer", padding: "2px 3px", borderRadius: 5, color: "var(--text-faint)", display: "flex", transition: "all 0.1s" }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(248,113,113,0.14)"; (e.currentTarget as HTMLElement).style.color = "#f87171"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "none"; (e.currentTarget as HTMLElement).style.color = "var(--text-faint)"; }}>
                <X size={10} />
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Footer */}
      <div style={{ padding: "10px 10px 12px", display: "flex", flexDirection: "column", gap: 3, borderTop: "1px solid var(--border)" }}>
        <button onClick={onOpenSettings}
          style={{
            background: "linear-gradient(135deg,rgba(99,102,241,0.12),rgba(139,92,246,0.12))",
            border: "1px solid rgba(99,102,241,0.22)", borderRadius: 9,
            padding: "8px 11px", cursor: "pointer", color: "var(--accent)",
            fontSize: 11.5, display: "flex", alignItems: "center", gap: 7,
            width: "100%", fontWeight: 600, transition: "all 0.15s"
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "linear-gradient(135deg,rgba(99,102,241,0.2),rgba(139,92,246,0.2))"; (e.currentTarget as HTMLElement).style.boxShadow = "0 0 16px rgba(99,102,241,0.2)"; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "linear-gradient(135deg,rgba(99,102,241,0.12),rgba(139,92,246,0.12))"; (e.currentTarget as HTMLElement).style.boxShadow = "none"; }}>
          <Settings size={12} strokeWidth={2} /> AI Settings
          <span style={{ marginLeft: "auto", fontSize: 10, opacity: 0.6, fontWeight: 400 }}>⌘,</span>
        </button>

        <button onClick={onShowShortcuts}
          style={{ background: "none", border: "none", borderRadius: 8, padding: "7px 11px", cursor: "pointer", color: "var(--text-faint)", fontSize: 11.5, display: "flex", alignItems: "center", gap: 7, width: "100%", transition: "all 0.12s" }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "var(--bg-hover)"; (e.currentTarget as HTMLElement).style.color = "var(--text-muted)"; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "none"; (e.currentTarget as HTMLElement).style.color = "var(--text-faint)"; }}>
          <Keyboard size={12} strokeWidth={1.8} /> Shortcuts
          <span style={{ marginLeft: "auto", fontSize: 10, opacity: 0.6 }}>⌘/</span>
        </button>

        <Link href="/"
          style={{ border: "none", borderRadius: 8, padding: "7px 11px", cursor: "pointer", color: "var(--text-faint)", fontSize: 11.5, display: "flex", alignItems: "center", gap: 7, textDecoration: "none", background: "none", transition: "all 0.12s" }}
          onMouseEnter={(e: React.MouseEvent) => { (e.currentTarget as HTMLElement).style.background = "var(--bg-hover)"; (e.currentTarget as HTMLElement).style.color = "var(--text-muted)"; }}
          onMouseLeave={(e: React.MouseEvent) => { (e.currentTarget as HTMLElement).style.background = "none"; (e.currentTarget as HTMLElement).style.color = "var(--text-faint)"; }}>
          <Home size={12} strokeWidth={1.8} /> Back to Home
        </Link>
      </div>
    </div>
  );
}
