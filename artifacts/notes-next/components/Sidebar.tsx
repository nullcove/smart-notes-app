"use client";

import { useState } from "react";
import { FileText, Star, Archive, Trash2, Tag, Plus, X, Sun, Moon } from "lucide-react";
import { useTheme } from "@/lib/providers";
import type { View } from "./AppShell";
import type { Tag as TagType } from "@/lib/api";

const TAG_COLORS = ["#e74c3c", "#e67e22", "#f1c40f", "#2ecc71", "#3498db", "#9b59b6", "#1abc9c"];

interface Props {
  view: View;
  activeTagId: string | null;
  tags: TagType[];
  counts: Record<string, number>;
  onViewChange: (v: View) => void;
  onTagClick: (id: string) => void;
  onCreateTag: (name: string) => void;
  onDeleteTag: (id: string) => void;
}

export function Sidebar({ view, activeTagId, tags, counts, onViewChange, onTagClick, onCreateTag, onDeleteTag }: Props) {
  const { dark, toggle } = useTheme();
  const [addingTag, setAddingTag] = useState(false);
  const [newTagName, setNewTagName] = useState("");
  const [hoveredTag, setHoveredTag] = useState<string | null>(null);

  function submitTag() {
    const name = newTagName.trim();
    if (!name) return;
    onCreateTag(name);
    setNewTagName("");
    setAddingTag(false);
  }

  const navItems = [
    { id: "notes" as View, label: "Notes", icon: FileText, count: counts.notes },
    { id: "starred" as View, label: "Starred", icon: Star, count: counts.starred },
    { id: "archived" as View, label: "Archived", icon: Archive, count: counts.archived },
    { id: "trash" as View, label: "Trash", icon: Trash2, count: counts.trash },
  ];

  return (
    <div
      className="panel-sidebar"
      style={{ width: 200, display: "flex", flexDirection: "column", flexShrink: 0, overflow: "hidden" }}
    >
      <div style={{ padding: "16px 10px 8px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontWeight: 700, fontSize: 15, color: "var(--text-primary)", letterSpacing: -0.3 }}>Notes</span>
        <button
          onClick={toggle}
          style={{ background: "none", border: "none", cursor: "pointer", padding: 4, borderRadius: 6, color: "var(--text-muted)", display: "flex", alignItems: "center" }}
          title="Toggle theme"
        >
          {dark ? <Sun size={14} /> : <Moon size={14} />}
        </button>
      </div>

      <div style={{ padding: "4px 8px" }}>
        {navItems.map((item) => (
          <div
            key={item.id}
            className={`nav-item ${view === item.id ? "active" : ""}`}
            onClick={() => onViewChange(item.id)}
          >
            <item.icon size={14} strokeWidth={1.8} />
            <span style={{ flex: 1 }}>{item.label}</span>
            {item.count > 0 && (
              <span style={{ fontSize: 11, color: view === item.id ? "var(--accent-text)" : "var(--text-muted)" }}>
                {item.count}
              </span>
            )}
          </div>
        ))}
      </div>

      <div style={{ height: 1, background: "var(--border)", margin: "8px 12px" }} />

      <div style={{ padding: "0 8px", flex: 1, overflow: "auto" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "4px 4px 4px 8px", marginBottom: 2 }}>
          <span style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.8, color: "var(--text-muted)" }}>
            Tags
          </span>
          <button
            onClick={() => setAddingTag(true)}
            style={{ background: "none", border: "none", cursor: "pointer", padding: 3, borderRadius: 4, color: "var(--text-muted)", display: "flex", alignItems: "center" }}
            title="Add tag"
          >
            <Plus size={13} />
          </button>
        </div>

        {addingTag && (
          <div style={{ padding: "4px 4px" }}>
            <input
              autoFocus
              value={newTagName}
              onChange={(e) => setNewTagName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") submitTag();
                if (e.key === "Escape") { setAddingTag(false); setNewTagName(""); }
              }}
              onBlur={submitTag}
              placeholder="Tag name..."
              style={{ width: "100%", background: "var(--bg-editor)", border: "1px solid var(--accent)", borderRadius: 5, padding: "4px 8px", fontSize: 13, color: "var(--text-primary)", outline: "none" }}
            />
          </div>
        )}

        {tags.length === 0 && !addingTag && (
          <div style={{ padding: "6px 8px", fontSize: 12, color: "var(--text-muted)" }}>No tags yet</div>
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
              <Tag size={13} strokeWidth={1.8} />
              <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{tag.name}</span>
            </div>
            {hoveredTag === tag.id && (
              <button
                onClick={(e) => { e.stopPropagation(); onDeleteTag(tag.id); }}
                style={{ background: "none", border: "none", cursor: "pointer", padding: 2, borderRadius: 3, color: "var(--text-muted)", display: "flex", alignItems: "center" }}
              >
                <X size={11} />
              </button>
            )}
          </div>
        ))}
      </div>

      <div style={{ padding: "8px 12px", borderTop: "1px solid var(--border)", fontSize: 11, color: "var(--text-muted)", textAlign: "center" }}>
        Powered by Insforge
      </div>
    </div>
  );
}
