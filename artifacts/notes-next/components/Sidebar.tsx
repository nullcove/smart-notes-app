"use client";

import { useState, useEffect, useRef } from "react";
import { FileText, Star, Archive, Trash2, Tag, Plus, X, Sun, Moon, Pin, Keyboard, Home, Settings, ChevronLeft, ChevronRight, Hash } from "lucide-react";
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
  const [prevCounts, setPrevCounts] = useState<Record<string, number>>({});
  const [bouncingKey, setBouncingKey] = useState<string | null>(null);

  useEffect(() => {
    for (const key of Object.keys(counts)) {
      if (counts[key] !== prevCounts[key] && prevCounts[key] !== undefined) {
        setBouncingKey(key);
        setTimeout(() => setBouncingKey(null), 400);
      }
    }
    setPrevCounts(counts);
  }, [counts]);

  function submitTag() {
    const name = newTagName.trim();
    if (!name) { setAddingTag(false); return; }
    onCreateTag(name);
    setNewTagName("");
    setAddingTag(false);
  }

  const navItems = [
    { id: "notes" as View, label: "Notes", icon: FileText, count: counts.notes },
    { id: "pinned" as View, label: "Pinned", icon: Pin, count: counts.pinned },
    { id: "starred" as View, label: "Starred", icon: Star, count: counts.starred },
    { id: "archived" as View, label: "Archived", icon: Archive, count: counts.archived },
    { id: "trash" as View, label: "Trash", icon: Trash2, count: counts.trash },
  ];

  if (collapsed) {
    return (
      <div className="panel-sidebar" style={{ width: 48, display: "flex", flexDirection: "column", alignItems: "center", padding: "10px 0", gap: 2, overflow: "hidden" }}>
        <button onClick={onToggleCollapse} className="sidebar-collapse-btn" style={{ margin: "4px 0 10px" }} title="Expand sidebar">
          <ChevronRight size={15} />
        </button>
        {navItems.map(item => (
          <button key={item.id}
            title={`${item.label}${item.count ? ` (${item.count})` : ""}`}
            onClick={() => onViewChange(item.id)}
            style={{ background: view === item.id ? "var(--bg-selected)" : "none", border: "none", cursor: "pointer", padding: "8px", borderRadius: 7, color: view === item.id ? "var(--accent-text)" : "var(--text-muted)", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.12s", position: "relative" }}>
            <item.icon size={15} strokeWidth={1.8} />
            {item.count > 0 && (
              <span style={{ position: "absolute", top: 3, right: 3, width: 7, height: 7, borderRadius: "50%", background: "var(--accent)" }} />
            )}
          </button>
        ))}
        <div style={{ flex: 1 }} />
        <button onClick={toggle} style={{ background: "none", border: "none", cursor: "pointer", padding: 8, borderRadius: 7, color: "var(--text-muted)", display: "flex" }} title={dark ? "Light mode" : "Dark mode"}>
          {dark ? <Sun size={14} /> : <Moon size={14} />}
        </button>
        <button onClick={onOpenSettings} style={{ background: "none", border: "none", cursor: "pointer", padding: 8, borderRadius: 7, color: "#818cf8", display: "flex" }} title="AI Settings">
          <Settings size={14} />
        </button>
      </div>
    );
  }

  return (
    <div className="panel-sidebar" style={{ width: 210, display: "flex", flexDirection: "column", flexShrink: 0, overflow: "hidden" }}>
      {/* Brand header */}
      <div style={{ padding: "10px 10px 9px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none", flex: 1, minWidth: 0 }}>
          <div style={{ width: 27, height: 27, borderRadius: 8, background: "linear-gradient(135deg,#6366f1,#8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "transform 0.2s" }}
            onMouseEnter={e => (e.currentTarget.style.transform = "rotate(8deg) scale(1.1)")}
            onMouseLeave={e => (e.currentTarget.style.transform = "none")}>
            <FileText size={12} color="white" />
          </div>
          <span style={{ fontWeight: 800, fontSize: 12.5, letterSpacing: -0.3, background: "linear-gradient(90deg,var(--accent),#8b5cf6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            Smart Ins-Note
          </span>
        </Link>
        <div style={{ display: "flex", gap: 1 }}>
          <button onClick={toggle}
            style={{ background: "none", border: "none", cursor: "pointer", padding: 5, borderRadius: 6, color: "var(--text-muted)", display: "flex", alignItems: "center", transition: "all 0.15s" }}
            title={dark ? "Light mode" : "Dark mode"}
            onMouseEnter={e => { e.currentTarget.style.background = "var(--bg-hover)"; e.currentTarget.style.transform = "rotate(20deg)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "none"; e.currentTarget.style.transform = "none"; }}>
            {dark ? <Sun size={13} /> : <Moon size={13} />}
          </button>
          <button onClick={onToggleCollapse} className="sidebar-collapse-btn" title="Collapse sidebar">
            <ChevronLeft size={13} />
          </button>
        </div>
      </div>

      {/* Nav items */}
      <div style={{ padding: "7px 7px 3px" }}>
        {navItems.map((item) => (
          <div key={item.id}
            className={`nav-item ${view === item.id ? "active" : ""}`}
            onClick={() => onViewChange(item.id)}>
            <item.icon size={13} strokeWidth={1.8} />
            <span style={{ flex: 1, fontSize: 13 }}>{item.label}</span>
            {item.count > 0 && (
              <span
                key={`${item.id}-${item.count}`}
                className="count-badge"
                style={{
                  background: view === item.id ? "rgba(99,102,241,0.2)" : "var(--bg-hover)",
                  color: view === item.id ? "var(--accent-text)" : "var(--text-muted)",
                  animation: bouncingKey === item.id ? "badgePop 0.4s ease" : "countUp 0.2s ease",
                }}>
                {item.count}
              </span>
            )}
          </div>
        ))}
      </div>

      <div style={{ height: 1, background: "var(--border)", margin: "4px 10px" }} />

      {/* Tags */}
      <div style={{ padding: "0 7px", flex: 1, overflow: "auto" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "5px 5px 3px 7px" }}>
          <span style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, color: "var(--text-muted)", display: "flex", alignItems: "center", gap: 4 }}>
            <Hash size={9} /> Tags
          </span>
          <button onClick={() => setAddingTag(true)}
            style={{ background: "none", border: "none", cursor: "pointer", padding: 3, borderRadius: 4, color: "var(--text-muted)", display: "flex", transition: "all 0.12s" }}
            title="New tag"
            onMouseEnter={e => { e.currentTarget.style.background = "var(--bg-hover)"; e.currentTarget.style.transform = "scale(1.2) rotate(45deg)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "none"; e.currentTarget.style.transform = "none"; }}>
            <Plus size={12} />
          </button>
        </div>

        {addingTag && (
          <div style={{ padding: "4px 4px 6px", animation: "fadeInUp 0.15s ease" }}>
            <input autoFocus value={newTagName}
              onChange={(e) => setNewTagName(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") submitTag(); if (e.key === "Escape") { setAddingTag(false); setNewTagName(""); } }}
              onBlur={submitTag}
              placeholder="Tag name…"
              style={{ width: "100%", background: "var(--bg-editor)", border: "1px solid var(--accent)", borderRadius: 5, padding: "5px 8px", fontSize: 12, color: "var(--text-primary)", outline: "none", boxShadow: "0 0 0 3px rgba(99,102,241,0.12)" }}
            />
            <div style={{ display: "flex", gap: 4, marginTop: 5, paddingLeft: 2 }}>
              {TAG_COLORS.map(c => (
                <button key={c} onClick={() => setNewTagColor(c)}
                  style={{ width: 14, height: 14, borderRadius: "50%", background: c, border: newTagColor === c ? "2px solid var(--text-primary)" : "2px solid transparent", cursor: "pointer", padding: 0, transition: "transform 0.1s", transform: newTagColor === c ? "scale(1.3)" : "none" }} />
              ))}
            </div>
          </div>
        )}

        {tags.length === 0 && !addingTag && (
          <div style={{ padding: "6px 8px 4px", fontSize: 11, color: "var(--text-muted)", fontStyle: "italic", opacity: 0.7 }}>
            No tags yet — click + to add
          </div>
        )}

        {tags.map((tag, i) => (
          <div key={tag.id}
            className={`nav-item ${view === "tag" && activeTagId === tag.id ? "active" : ""}`}
            onClick={() => onTagClick(tag.id)}
            onMouseEnter={() => setHoveredTag(tag.id)}
            onMouseLeave={() => setHoveredTag(null)}
            style={{ justifyContent: "space-between", animation: `fadeInUp 0.15s ease both`, animationDelay: `${i * 30}ms` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 7, minWidth: 0 }}>
              <div className="tag-dot" style={{ background: TAG_COLORS[i % TAG_COLORS.length] }} />
              <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontSize: 12.5 }}>{tag.name}</span>
            </div>
            {hoveredTag === tag.id && (
              <button onClick={(e) => { e.stopPropagation(); onDeleteTag(tag.id); }}
                style={{ background: "none", border: "none", cursor: "pointer", padding: "2px 3px", borderRadius: 3, color: "var(--text-muted)", display: "flex", transition: "all 0.1s" }}
                onMouseEnter={e => { e.currentTarget.style.background = "rgba(248,113,113,0.12)"; e.currentTarget.style.color = "#f87171"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "none"; e.currentTarget.style.color = "var(--text-muted)"; }}>
                <X size={10} />
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Footer actions */}
      <div style={{ borderTop: "1px solid var(--border)", padding: "7px 9px", display: "flex", flexDirection: "column", gap: 3 }}>
        <button onClick={onOpenSettings}
          style={{ background: "linear-gradient(135deg,rgba(99,102,241,0.12),rgba(139,92,246,0.12))", border: "1px solid rgba(99,102,241,0.25)", borderRadius: 8, padding: "7px 10px", cursor: "pointer", color: "#818cf8", fontSize: 11, display: "flex", alignItems: "center", gap: 6, width: "100%", fontWeight: 600, transition: "all 0.15s" }}
          onMouseEnter={e => { e.currentTarget.style.background = "linear-gradient(135deg,rgba(99,102,241,0.2),rgba(139,92,246,0.2))"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "linear-gradient(135deg,rgba(99,102,241,0.12),rgba(139,92,246,0.12))"; }}>
          <Settings size={11} /> AI Settings (⌘,)
        </button>
        <button onClick={onShowShortcuts}
          style={{ background: "none", border: "1px solid var(--border)", borderRadius: 7, padding: "6px 10px", cursor: "pointer", color: "var(--text-muted)", fontSize: 11, display: "flex", alignItems: "center", gap: 6, width: "100%", transition: "all 0.12s" }}
          onMouseEnter={e => { e.currentTarget.style.background = "var(--bg-hover)"; e.currentTarget.style.color = "var(--text-primary)"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "none"; e.currentTarget.style.color = "var(--text-muted)"; }}>
          <Keyboard size={11} /> Shortcuts (⌘/)
        </button>
        <Link href="/"
          style={{ border: "none", borderRadius: 7, padding: "6px 10px", cursor: "pointer", color: "var(--text-muted)", fontSize: 11, display: "flex", alignItems: "center", gap: 6, textDecoration: "none", background: "none", transition: "all 0.12s" }}
          onMouseEnter={(e: React.MouseEvent) => { (e.currentTarget as HTMLElement).style.background = "var(--bg-hover)"; (e.currentTarget as HTMLElement).style.color = "var(--text-primary)"; }}
          onMouseLeave={(e: React.MouseEvent) => { (e.currentTarget as HTMLElement).style.background = "none"; (e.currentTarget as HTMLElement).style.color = "var(--text-muted)"; }}>
          <Home size={11} /> Back to Home
        </Link>
      </div>
    </div>
  );
}
