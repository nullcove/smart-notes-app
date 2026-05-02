"use client";

import { useEffect, useRef, useState } from "react";
import { FileText, Plus, Star, Archive, Trash2, Pin, Settings, Search, Keyboard, Sun, Moon, Eye, Zap, Focus } from "lucide-react";
import type { Note } from "@/lib/api";

interface Action {
  id: string;
  label: string;
  icon: React.ReactNode;
  section: string;
  onSelect: () => void;
  keywords?: string;
}

interface Props {
  notes: Note[];
  dark: boolean;
  onClose: () => void;
  onSelectNote: (id: string) => void;
  onNewNote: () => void;
  onOpenSettings: () => void;
  onToggleTheme: () => void;
  onToggleFocus: () => void;
  onShowShortcuts: () => void;
}

function highlight(text: string, query: string) {
  if (!query) return <>{text}</>;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx < 0) return <>{text}</>;
  return (
    <>
      {text.slice(0, idx)}
      <mark style={{ background: "rgba(99,102,241,0.25)", borderRadius: 2, color: "var(--accent-text)", fontWeight: 700, padding: 0 }}>
        {text.slice(idx, idx + query.length)}
      </mark>
      {text.slice(idx + query.length)}
    </>
  );
}

export function CommandPalette({ notes, dark, onClose, onSelectNote, onNewNote, onOpenSettings, onToggleTheme, onToggleFocus, onShowShortcuts }: Props) {
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const actions: Action[] = [
    { id: "new", label: "New Note", icon: <Plus size={14} />, section: "Actions", keywords: "create add", onSelect: () => { onNewNote(); onClose(); } },
    { id: "settings", label: "AI Settings", icon: <Settings size={14} />, section: "Actions", keywords: "gemini api key", onSelect: () => { onOpenSettings(); onClose(); } },
    { id: "theme", label: dark ? "Switch to Light Mode" : "Switch to Dark Mode", icon: dark ? <Sun size={14} /> : <Moon size={14} />, section: "Actions", keywords: "theme dark light", onSelect: () => { onToggleTheme(); onClose(); } },
    { id: "focus", label: "Focus Mode", icon: <Focus size={14} />, section: "Actions", keywords: "zen distraction free", onSelect: () => { onToggleFocus(); onClose(); } },
    { id: "shortcuts", label: "Keyboard Shortcuts", icon: <Keyboard size={14} />, section: "Actions", keywords: "hotkey", onSelect: () => { onShowShortcuts(); onClose(); } },
  ];

  const matchedNotes = notes
    .filter(n => !n.trashed)
    .filter(n => !query || n.title.toLowerCase().includes(query.toLowerCase()) || n.content.toLowerCase().includes(query.toLowerCase()))
    .slice(0, 8);

  const allItems: Array<{ type: "action"; item: Action } | { type: "note"; item: Note }> = [
    ...actions
      .filter(a => !query || a.label.toLowerCase().includes(query.toLowerCase()) || (a.keywords || "").toLowerCase().includes(query.toLowerCase()))
      .map(a => ({ type: "action" as const, item: a })),
    ...matchedNotes.map(n => ({ type: "note" as const, item: n })),
  ];

  useEffect(() => { inputRef.current?.focus(); }, []);
  useEffect(() => { setFocused(0); }, [query]);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowDown") { e.preventDefault(); setFocused(f => Math.min(f + 1, allItems.length - 1)); }
      if (e.key === "ArrowUp") { e.preventDefault(); setFocused(f => Math.max(f - 1, 0)); }
      if (e.key === "Enter") {
        e.preventDefault();
        const item = allItems[focused];
        if (!item) return;
        if (item.type === "action") item.item.onSelect();
        else { onSelectNote(item.item.id); onClose(); }
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [allItems, focused, onClose, onSelectNote]);

  useEffect(() => {
    const el = listRef.current?.children[focused] as HTMLElement | undefined;
    el?.scrollIntoView({ block: "nearest" });
  }, [focused]);

  let itemIndex = 0;
  let lastSection = "";

  return (
    <div className="cmd-backdrop" onClick={onClose}>
      <div className="cmd-palette" onClick={e => e.stopPropagation()}>
        <div style={{ position: "relative" }}>
          <Search size={16} style={{ position: "absolute", left: 20, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)", pointerEvents: "none" }} />
          <input
            ref={inputRef}
            className="cmd-input"
            style={{ paddingLeft: 46 }}
            placeholder="Search notes or type a command…"
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
        </div>
        <div className="cmd-results" ref={listRef}>
          {allItems.length === 0 && (
            <div style={{ padding: "24px 20px", textAlign: "center", color: "var(--text-muted)", fontSize: 13 }}>
              No results for &ldquo;{query}&rdquo;
            </div>
          )}
          {allItems.map((entry, i) => {
            const section = entry.type === "action" ? entry.item.section : "Notes";
            const showSection = section !== lastSection;
            lastSection = section;
            const idx = itemIndex++;
            return (
              <div key={entry.type === "action" ? entry.item.id : (entry.item as Note).id}>
                {showSection && <div className="cmd-section">{section}</div>}
                <div
                  className={`cmd-item ${idx === focused ? "focused" : ""}`}
                  style={{ "--i": i } as React.CSSProperties}
                  onClick={() => {
                    if (entry.type === "action") entry.item.onSelect();
                    else { onSelectNote((entry.item as Note).id); onClose(); }
                  }}
                  onMouseEnter={() => setFocused(idx)}>
                  <span style={{ color: "var(--text-muted)", display: "flex", flexShrink: 0 }}>
                    {entry.type === "action" ? entry.item.icon : <FileText size={14} />}
                  </span>
                  <span style={{ flex: 1, fontSize: 14, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {entry.type === "note"
                      ? highlight((entry.item as Note).title || "Untitled", query)
                      : entry.item.label}
                  </span>
                  {entry.type === "note" && (entry.item as Note).starred && <Star size={10} style={{ color: "#f59e0b", fill: "#f59e0b", flexShrink: 0 }} />}
                  {entry.type === "note" && (entry.item as Note).pinned && <Pin size={10} style={{ color: "var(--pin)", fill: "var(--pin)", flexShrink: 0 }} />}
                </div>
              </div>
            );
          })}
        </div>
        <div style={{ borderTop: "1px solid var(--border)", padding: "8px 16px", display: "flex", gap: 16, alignItems: "center" }}>
          <span style={{ fontSize: 11, color: "var(--text-muted)", display: "flex", gap: 6, alignItems: "center" }}>
            <kbd style={{ background: "var(--bg-hover)", border: "1px solid var(--border)", borderRadius: 4, padding: "1px 5px", fontSize: 10 }}>↑↓</kbd> navigate
          </span>
          <span style={{ fontSize: 11, color: "var(--text-muted)", display: "flex", gap: 6, alignItems: "center" }}>
            <kbd style={{ background: "var(--bg-hover)", border: "1px solid var(--border)", borderRadius: 4, padding: "1px 5px", fontSize: 10 }}>↵</kbd> select
          </span>
          <span style={{ fontSize: 11, color: "var(--text-muted)", display: "flex", gap: 6, alignItems: "center" }}>
            <kbd style={{ background: "var(--bg-hover)", border: "1px solid var(--border)", borderRadius: 4, padding: "1px 5px", fontSize: 10 }}>Esc</kbd> close
          </span>
        </div>
      </div>
    </div>
  );
}
