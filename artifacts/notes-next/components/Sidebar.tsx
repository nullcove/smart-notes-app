"use client";

import { useState } from "react";
import { FileText, Star, Archive, Trash2, Tag, Plus, X, Sun, Moon, Pin, Keyboard, Home, Settings } from "lucide-react";
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
}

export function Sidebar({ view, activeTagId, tags, counts, onViewChange, onTagClick, onCreateTag, onDeleteTag, onShowShortcuts, onOpenSettings }: Props) {
  const { dark, toggle } = useTheme();
  const [addingTag, setAddingTag] = useState(false);
  const [newTagName, setNewTagName] = useState("");
  const [hoveredTag, setHoveredTag] = useState<string | null>(null);

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

  return (
    <div className="panel-sidebar" style={{ width: 210, display: "flex", flexDirection: "column", flexShrink: 0, overflow: "hidden" }}>
      {/* Brand header */}
      <div style={{ padding: "12px 12px 10px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none" }}>
          <div style={{ width: 28, height: 28, borderRadius: 8, background: "linear-gradient(135deg,#6366f1,#8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <FileText size={13} color="white" />
          </div>
          <span style={{ fontWeight: 800, fontSize: 13, letterSpacing: -0.3, background: "linear-gradient(90deg,var(--accent),#8b5cf6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            Smart Ins-Note
          </span>
        </Link>
        <button onClick={toggle} style={{ background: "none", border: "none", cursor: "pointer", padding: 5, borderRadius: 6, color: "var(--text-muted)", display: "flex", alignItems: "center" }} title={dark ? "Light mode" : "Dark mode"}>
          {dark ? <Sun size={13} /> : <Moon size={13} />}
        </button>
      </div>

      {/* Nav items */}
      <div style={{ padding: "8px 8px 4px" }}>
        {navItems.map((item) => (
          <div key={item.id} className={`nav-item ${view === item.id ? "active" : ""}`} onClick={() => onViewChange(item.id)}>
            <item.icon size={13} strokeWidth={1.8} />
            <span style={{ flex: 1, fontSize: 13 }}>{item.label}</span>
            {item.count > 0 && (
              <span style={{ fontSize: 10, fontWeight: 700, background: view === item.id ? "rgba(99,102,241,0.2)" : "var(--bg-hover)", padding: "1px 6px", borderRadius: 10, color: view === item.id ? "var(--accent-text)" : "var(--text-muted)" }}>
                {item.count}
              </span>
            )}
          </div>
        ))}
      </div>

      <div style={{ height: 1, background: "var(--border)", margin: "4px 10px" }} />

      {/* Tags */}
      <div style={{ padding: "0 8px", flex: 1, overflow: "auto" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "6px 4px 4px 8px" }}>
          <span style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.9, color: "var(--text-muted)" }}>Tags</span>
          <button onClick={() => setAddingTag(true)} style={{ background: "none", border: "none", cursor: "pointer", padding: 3, borderRadius: 4, color: "var(--text-muted)", display: "flex" }} title="New tag">
            <Plus size={12} />
          </button>
        </div>

        {addingTag && (
          <div style={{ padding: "4px 4px 6px" }}>
            <input autoFocus value={newTagName}
              onChange={(e) => setNewTagName(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") submitTag(); if (e.key === "Escape") { setAddingTag(false); setNewTagName(""); } }}
              onBlur={submitTag}
              placeholder="Tag name…"
              style={{ width: "100%", background: "var(--bg-editor)", border: "1px solid var(--accent)", borderRadius: 5, padding: "5px 8px", fontSize: 12, color: "var(--text-primary)", outline: "none" }}
            />
          </div>
        )}

        {tags.length === 0 && !addingTag && (
          <div style={{ padding: "6px 8px 4px", fontSize: 11, color: "var(--text-muted)", fontStyle: "italic" }}>
            No tags yet — click + to add
          </div>
        )}

        {tags.map((tag) => (
          <div key={tag.id}
            className={`nav-item ${view === "tag" && activeTagId === tag.id ? "active" : ""}`}
            onClick={() => onTagClick(tag.id)}
            onMouseEnter={() => setHoveredTag(tag.id)}
            onMouseLeave={() => setHoveredTag(null)}
            style={{ justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 7, minWidth: 0 }}>
              <Tag size={11} strokeWidth={1.8} />
              <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontSize: 13 }}>{tag.name}</span>
            </div>
            {hoveredTag === tag.id && (
              <button onClick={(e) => { e.stopPropagation(); onDeleteTag(tag.id); }} style={{ background: "none", border: "none", cursor: "pointer", padding: 2, borderRadius: 3, color: "var(--text-muted)", display: "flex" }}>
                <X size={10} />
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Footer actions */}
      <div style={{ borderTop: "1px solid var(--border)", padding: "8px 10px", display: "flex", flexDirection: "column", gap: 3 }}>
        <button onClick={onOpenSettings}
          style={{ background: "linear-gradient(135deg,rgba(99,102,241,0.12),rgba(139,92,246,0.12))", border: "1px solid rgba(99,102,241,0.25)", borderRadius: 8, padding: "7px 10px", cursor: "pointer", color: "#818cf8", fontSize: 11, display: "flex", alignItems: "center", gap: 6, width: "100%", fontWeight: 600 }}>
          <Settings size={11} /> AI Settings (⌘,)
        </button>
        <button onClick={onShowShortcuts}
          style={{ background: "none", border: "1px solid var(--border)", borderRadius: 7, padding: "6px 10px", cursor: "pointer", color: "var(--text-muted)", fontSize: 11, display: "flex", alignItems: "center", gap: 6, width: "100%" }}>
          <Keyboard size={11} /> Shortcuts (⌘/)
        </button>
        <Link href="/"
          style={{ border: "none", borderRadius: 7, padding: "6px 10px", cursor: "pointer", color: "var(--text-muted)", fontSize: 11, display: "flex", alignItems: "center", gap: 6, textDecoration: "none", background: "none" }}>
          <Home size={11} /> Back to Home
        </Link>
      </div>
    </div>
  );
}
