"use client";

import { useState } from "react";
import { FileText, Star, Archive, Trash2, Tag, Plus, X, Sun, Moon, Pin, Keyboard, Home } from "lucide-react";
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
}

export function Sidebar({ view, activeTagId, tags, counts, onViewChange, onTagClick, onCreateTag, onDeleteTag, onShowShortcuts }: Props) {
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
      {/* Header */}
      <div style={{ padding: "14px 12px 8px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid var(--border)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 26, height: 26, borderRadius: 7, background: "linear-gradient(135deg,#6366f1,#8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <FileText size={13} color="white" />
          </div>
          <span style={{ fontWeight: 800, fontSize: 14, background: "linear-gradient(135deg,var(--accent),#8b5cf6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            InsNote
          </span>
        </div>
        <div style={{ display: "flex", gap: 2 }}>
          <button onClick={toggle} style={{ background: "none", border: "none", cursor: "pointer", padding: 4, borderRadius: 5, color: "var(--text-muted)", display: "flex", alignItems: "center" }} title="Toggle theme">
            {dark ? <Sun size={13} /> : <Moon size={13} />}
          </button>
          <Link href="/notes-next/" style={{ background: "none", border: "none", cursor: "pointer", padding: 4, borderRadius: 5, color: "var(--text-muted)", display: "flex", alignItems: "center", textDecoration: "none" }} title="Home">
            <Home size={13} />
          </Link>
        </div>
      </div>

      {/* Nav */}
      <div style={{ padding: "8px 8px 4px" }}>
        {navItems.map((item) => (
          <div key={item.id} className={`nav-item ${view === item.id ? "active" : ""}`} onClick={() => onViewChange(item.id)}>
            <item.icon size={13} strokeWidth={1.8} />
            <span style={{ flex: 1 }}>{item.label}</span>
            {item.count > 0 && (
              <span style={{ fontSize: 10, fontWeight: 600, background: view === item.id ? "rgba(99,102,241,0.15)" : "var(--bg-hover)", padding: "1px 6px", borderRadius: 10, color: view === item.id ? "var(--accent-text)" : "var(--text-muted)" }}>
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
          <button onClick={() => setAddingTag(true)} style={{ background: "none", border: "none", cursor: "pointer", padding: 3, borderRadius: 4, color: "var(--text-muted)", display: "flex", alignItems: "center" }} title="Add tag">
            <Plus size={12} />
          </button>
        </div>

        {addingTag && (
          <div style={{ padding: "4px 4px 6px" }}>
            <input
              autoFocus
              value={newTagName}
              onChange={(e) => setNewTagName(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") submitTag(); if (e.key === "Escape") { setAddingTag(false); setNewTagName(""); } }}
              onBlur={submitTag}
              placeholder="Tag name..."
              style={{ width: "100%", background: "var(--bg-editor)", border: "1px solid var(--accent)", borderRadius: 5, padding: "4px 8px", fontSize: 12, color: "var(--text-primary)", outline: "none" }}
            />
          </div>
        )}

        {tags.length === 0 && !addingTag && (
          <div style={{ padding: "6px 8px", fontSize: 11, color: "var(--text-muted)", fontStyle: "italic" }}>No tags yet</div>
        )}

        {tags.map((tag) => (
          <div
            key={tag.id}
            className={`nav-item ${view === "tag" && activeTagId === tag.id ? "active" : ""}`}
            onClick={() => onTagClick(tag.id)}
            onMouseEnter={() => setHoveredTag(tag.id)}
            onMouseLeave={() => setHoveredTag(null)}
            style={{ justifyContent: "space-between" }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 7, minWidth: 0 }}>
              <Tag size={12} strokeWidth={1.8} />
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

      {/* Footer */}
      <div style={{ borderTop: "1px solid var(--border)", padding: "8px 10px" }}>
        <button onClick={onShowShortcuts} style={{ width: "100%", background: "none", border: "1px solid var(--border)", borderRadius: 6, padding: "5px 10px", cursor: "pointer", color: "var(--text-muted)", fontSize: 11, display: "flex", alignItems: "center", gap: 6 }}>
          <Keyboard size={11} /> Keyboard shortcuts
        </button>
      </div>
    </div>
  );
}
