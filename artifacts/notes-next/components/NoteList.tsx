"use client";

import { useState } from "react";
import { Search, Plus, Star, Archive, Trash2, RotateCcw, Trash, Pin } from "lucide-react";
import type { Note } from "@/lib/api";
import type { View } from "./AppShell";

function formatDate(iso: string) {
  const d = new Date(iso);
  const diff = Date.now() - d.getTime();
  if (diff < 60_000) return "Just now";
  if (diff < 3_600_000) return `${Math.floor(diff / 60_000)}m ago`;
  if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)}h ago`;
  if (diff < 604_800_000) return d.toLocaleDateString(undefined, { weekday: "short" });
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

interface Props {
  notes: Note[];
  view: View;
  search: string;
  selectedId: string | null;
  loading: boolean;
  onSelect: (id: string) => void;
  onSearch: (q: string) => void;
  onNew: () => void;
  onToggleStar: (note: Note) => void;
  onTogglePin: (note: Note) => void;
  onArchive: (note: Note) => void;
  onTrash: (note: Note) => void;
  onRestore: (note: Note) => void;
  onDeleteForever: (id: string) => void;
}

const viewLabel: Record<View, string> = {
  notes: "All Notes", starred: "Starred", archived: "Archived",
  trash: "Trash", pinned: "Pinned", tag: "Tag",
};

export function NoteList({ notes, view, search, selectedId, loading, onSelect, onSearch, onNew, onToggleStar, onTogglePin, onArchive, onTrash, onRestore, onDeleteForever }: Props) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <div className="panel-list" style={{ width: 290, display: "flex", flexDirection: "column", flexShrink: 0, overflow: "hidden" }}>
      {/* Header */}
      <div style={{ padding: "12px 14px 10px", borderBottom: "1px solid var(--border)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
          <span style={{ fontWeight: 700, fontSize: 14, color: "var(--text-primary)" }}>
            {viewLabel[view]}
          </span>
          {view !== "trash" && (
            <button onClick={onNew} style={{ background: "linear-gradient(135deg,#6366f1,#8b5cf6)", border: "none", borderRadius: "50%", width: 26, height: 26, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "white", flexShrink: 0, boxShadow: "0 2px 8px rgba(99,102,241,0.4)" }} title="New note (⌘N)">
              <Plus size={15} strokeWidth={2.5} />
            </button>
          )}
        </div>
        <div style={{ position: "relative" }}>
          <Search size={13} style={{ position: "absolute", left: 9, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)", pointerEvents: "none" }} />
          <input className="search-input" type="search" placeholder="Search… (⌘K)" value={search} onChange={(e) => onSearch(e.target.value)} />
        </div>
      </div>

      {/* List */}
      <div style={{ flex: 1, overflowY: "auto" }}>
        {loading && <div style={{ padding: 20, textAlign: "center", color: "var(--text-muted)", fontSize: 13 }}>Loading…</div>}

        {!loading && notes.length === 0 && (
          <div style={{ padding: 24, textAlign: "center", color: "var(--text-muted)", fontSize: 13 }}>
            {search ? "No notes match your search." : view === "trash" ? "Trash is empty." : "No notes yet. Click + to create one."}
          </div>
        )}

        {notes.map((note) => (
          <div
            key={note.id}
            className={`note-card ${selectedId === note.id ? "selected" : ""}`}
            onClick={() => onSelect(note.id)}
            onMouseEnter={() => setHoveredId(note.id)}
            onMouseLeave={() => setHoveredId(null)}
          >
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 4, marginBottom: 4 }}>
              <div style={{ minWidth: 0, flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 13, color: "var(--text-primary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", display: "flex", alignItems: "center", gap: 5 }}>
                  {note.pinned && <Pin size={10} style={{ color: "var(--pin)", fill: "var(--pin)", flexShrink: 0 }} />}
                  {note.title || <span style={{ color: "var(--text-muted)", fontStyle: "italic", fontWeight: 400 }}>Untitled</span>}
                </div>
              </div>
              {note.starred && <Star size={10} style={{ color: "#f59e0b", fill: "#f59e0b", flexShrink: 0, marginTop: 2 }} />}
            </div>

            <div style={{ fontSize: 12, color: "var(--note-preview)", lineHeight: 1.4, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden", marginBottom: 6 }}>
              {note.content || <span style={{ fontStyle: "italic", color: "var(--text-muted)" }}>No content</span>}
            </div>

            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontSize: 11, color: "var(--note-date)" }}>{formatDate(note.updatedAt || note.createdAt)}</span>
              {hoveredId === note.id && (
                <div style={{ display: "flex", gap: 1 }} onClick={(e) => e.stopPropagation()}>
                  {view === "trash" ? (
                    <>
                      <ActionBtn title="Restore" onClick={() => onRestore(note)}><RotateCcw size={10} /></ActionBtn>
                      <ActionBtn title="Delete forever" onClick={() => onDeleteForever(note.id)}><Trash size={10} /></ActionBtn>
                    </>
                  ) : (
                    <>
                      <ActionBtn title={note.pinned ? "Unpin" : "Pin"} onClick={() => onTogglePin(note)}>
                        <Pin size={10} style={note.pinned ? { color: "var(--pin)" } : {}} />
                      </ActionBtn>
                      <ActionBtn title={note.starred ? "Unstar" : "Star"} onClick={() => onToggleStar(note)}>
                        <Star size={10} style={note.starred ? { fill: "#f59e0b", color: "#f59e0b" } : {}} />
                      </ActionBtn>
                      <ActionBtn title={note.archived ? "Unarchive" : "Archive"} onClick={() => onArchive(note)}>
                        <Archive size={10} />
                      </ActionBtn>
                      <ActionBtn title="Move to trash" onClick={() => onTrash(note)}>
                        <Trash2 size={10} />
                      </ActionBtn>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div style={{ padding: "6px 14px", borderTop: "1px solid var(--border)", fontSize: 11, color: "var(--text-muted)" }}>
        {notes.length} {notes.length === 1 ? "note" : "notes"}
      </div>
    </div>
  );
}

function ActionBtn({ children, onClick, title }: { children: React.ReactNode; onClick: () => void; title: string }) {
  return (
    <button title={title} onClick={onClick}
      style={{ background: "none", border: "none", cursor: "pointer", padding: "3px 4px", borderRadius: 4, color: "var(--text-muted)", display: "flex", alignItems: "center" }}
      onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "var(--bg-hover)"; (e.currentTarget as HTMLButtonElement).style.color = "var(--text-primary)"; }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "none"; (e.currentTarget as HTMLButtonElement).style.color = "var(--text-muted)"; }}
    >
      {children}
    </button>
  );
}
