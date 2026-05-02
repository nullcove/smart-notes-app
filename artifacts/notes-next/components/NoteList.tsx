"use client";

import { useState, useRef, useCallback } from "react";
import { Search, Plus, Star, Archive, Trash2, RotateCcw, Trash, Pin, FileText, X } from "lucide-react";
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
function wc(t: string) { return t.trim() ? t.trim().split(/\s+/).length : 0; }

function highlightText(text: string, query: string) {
  if (!query || !text) return <>{text}</>;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx < 0) return <>{text}</>;
  return (
    <>
      {text.slice(0, idx)}
      <span className="search-highlight">{text.slice(idx, idx + query.length)}</span>
      {text.slice(idx + query.length)}
    </>
  );
}

interface ContextMenuState { x: number; y: number; note: Note; }

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
  onToast?: (msg: string, type?: "success" | "info" | "warning" | "error") => void;
}

const viewLabel: Record<View, string> = {
  notes: "All Notes", starred: "Starred", archived: "Archived",
  trash: "Trash", pinned: "Pinned", tag: "Tag",
};

const emptyMessages: Record<View, string> = {
  notes: "No notes yet", starred: "No starred notes", archived: "Nothing archived",
  trash: "Trash is empty", pinned: "No pinned notes", tag: "No notes with this tag",
};

const emptyHints: Record<View, string> = {
  notes: "Click + or press ⌘N to create one",
  starred: "Star a note to find it here quickly",
  archived: "Archive notes to declutter your workspace",
  trash: "Deleted notes appear here",
  pinned: "Pin important notes for quick access",
  tag: "Assign tags to notes in the editor",
};

export function NoteList({ notes, view, search, selectedId, loading, onSelect, onSearch, onNew, onToggleStar, onTogglePin, onArchive, onTrash, onRestore, onDeleteForever, onToast }: Props) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [contextMenu, setContextMenu] = useState<ContextMenuState | null>(null);
  const [animatingNew, setAnimatingNew] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);

  function handleNew() {
    setAnimatingNew(true);
    setTimeout(() => setAnimatingNew(false), 400);
    onNew();
  }

  function handleContextMenu(e: React.MouseEvent, note: Note) {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY, note });
  }

  const closeContext = useCallback(() => setContextMenu(null), []);

  return (
    <div className="panel-list" style={{ width: 288, display: "flex", flexDirection: "column", flexShrink: 0, overflow: "hidden" }}
      onClick={closeContext}>

      {/* Header */}
      <div style={{ padding: "11px 14px 9px", borderBottom: "1px solid var(--border)", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 9 }}>
          <span style={{ fontWeight: 700, fontSize: 14, color: "var(--text-primary)", display: "flex", alignItems: "center", gap: 7 }}>
            {viewLabel[view]}
            {notes.length > 0 && (
              <span key={notes.length} className="count-badge" style={{ background: "var(--bg-hover)", color: "var(--text-muted)" }}>
                {notes.length}
              </span>
            )}
          </span>
          {view !== "trash" && (
            <button
              onClick={handleNew}
              className="new-note-btn"
              style={{ background: "linear-gradient(135deg,#6366f1,#8b5cf6)", border: "none", borderRadius: "50%", width: 27, height: 27, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "white", flexShrink: 0, boxShadow: "0 2px 10px rgba(99,102,241,0.4)", animation: animatingNew ? "bounceIn 0.4s ease" : "none" }}
              title="New note (⌘N)">
              <Plus size={14} strokeWidth={2.8} />
            </button>
          )}
        </div>
        <div style={{ position: "relative" }}>
          <Search size={13} style={{ position: "absolute", left: 9, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)", pointerEvents: "none" }} />
          <input
            ref={searchRef}
            className="search-input"
            type="search"
            placeholder="Search… (⌘K)"
            value={search}
            onChange={(e) => onSearch(e.target.value)}
          />
          {search && (
            <button onClick={() => onSearch("")}
              style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", display: "flex", padding: 2 }}>
              <X size={12} />
            </button>
          )}
        </div>
      </div>

      {/* List */}
      <div style={{ flex: 1, overflowY: "auto" }}>
        {/* Skeleton loaders */}
        {loading && (
          <div style={{ padding: "8px 0" }}>
            {[1, 2, 3, 4].map(i => (
              <div key={i} style={{ padding: "11px 16px", borderBottom: "1px solid var(--border)", opacity: 1 - i * 0.15 }}>
                <div className="skeleton" style={{ height: 13, width: `${65 + i * 7}%`, marginBottom: 8 }} />
                <div className="skeleton" style={{ height: 11, width: "85%", marginBottom: 5 }} />
                <div className="skeleton" style={{ height: 11, width: "60%", marginBottom: 8 }} />
                <div className="skeleton" style={{ height: 10, width: 50 }} />
              </div>
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && notes.length === 0 && (
          <div className="empty-state">
            <div className="empty-state-icon">
              {search ? <Search size={44} strokeWidth={1} /> : <FileText size={44} strokeWidth={1} />}
            </div>
            <p style={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)", opacity: 0.5 }}>
              {search ? `No results for "${search}"` : emptyMessages[view]}
            </p>
            <p style={{ fontSize: 12, color: "var(--text-muted)", textAlign: "center" }}>
              {search ? "Try a different search term" : emptyHints[view]}
            </p>
            {search && (
              <button onClick={() => onSearch("")}
                style={{ marginTop: 8, fontSize: 12, color: "var(--accent)", background: "none", border: "none", cursor: "pointer", textDecoration: "underline" }}>
                Clear search
              </button>
            )}
          </div>
        )}

        {/* Note cards */}
        {!loading && notes.map((note, i) => {
          const words = wc(note.content);
          return (
            <div
              key={note.id}
              className={`note-card ${selectedId === note.id ? "selected" : ""}`}
              style={{ "--card-index": Math.min(i, 12) } as React.CSSProperties}
              onClick={() => onSelect(note.id)}
              onContextMenu={(e) => handleContextMenu(e, note)}
              onMouseEnter={() => setHoveredId(note.id)}
              onMouseLeave={() => setHoveredId(null)}>

              {/* Title row */}
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 4, marginBottom: 4 }}>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 13, color: "var(--text-primary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", display: "flex", alignItems: "center", gap: 5 }}>
                    {note.pinned && <Pin size={9} style={{ color: "var(--pin)", fill: "var(--pin)", flexShrink: 0 }} />}
                    {note.title
                      ? highlightText(note.title, search)
                      : <span style={{ color: "var(--text-muted)", fontStyle: "italic", fontWeight: 400 }}>Untitled</span>}
                  </div>
                </div>
                <div style={{ display: "flex", gap: 3, alignItems: "center", flexShrink: 0 }}>
                  {note.starred && <Star size={10} style={{ color: "#f59e0b", fill: "#f59e0b" }} />}
                  {note.archived && !note.trashed && <Archive size={9} style={{ color: "var(--text-muted)", opacity: 0.6 }} />}
                </div>
              </div>

              {/* Preview */}
              <div style={{ fontSize: 12, color: "var(--note-preview)", lineHeight: 1.45, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden", marginBottom: 7 }}>
                {note.content
                  ? search ? highlightText(note.content.slice(0, 120), search) : note.content
                  : <span style={{ fontStyle: "italic", color: "var(--text-muted)" }}>No content</span>}
              </div>

              {/* Footer */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 4 }}>
                <span style={{ fontSize: 11, color: "var(--note-date)" }}>{formatDate(note.updatedAt || note.createdAt)}</span>
                <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  {words > 0 && hoveredId !== note.id && (
                    <span className="wc-badge">{words}w</span>
                  )}
                  {hoveredId === note.id && (
                    <div style={{ display: "flex", gap: 1, animation: "fadeIn 0.1s ease" }} onClick={e => e.stopPropagation()}>
                      {view === "trash" ? (
                        <>
                          <ActionBtn title="Restore" onClick={() => { onRestore(note); onToast?.("Note restored", "success"); }}><RotateCcw size={10} /></ActionBtn>
                          <ActionBtn title="Delete forever" onClick={() => { onDeleteForever(note.id); onToast?.("Deleted permanently", "warning"); }} danger><Trash size={10} /></ActionBtn>
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
                          <ActionBtn title="Move to trash" onClick={() => onTrash(note)} danger>
                            <Trash2 size={10} />
                          </ActionBtn>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div style={{ padding: "5px 14px", borderTop: "1px solid var(--border)", fontSize: 11, color: "var(--text-muted)", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
        <span>{notes.length} {notes.length === 1 ? "note" : "notes"}</span>
        {search && <span style={{ color: "var(--accent)", fontWeight: 500 }}>filtered</span>}
      </div>

      {/* Context menu */}
      {contextMenu && (
        <div className="context-menu"
          style={{ left: Math.min(contextMenu.x, window.innerWidth - 190), top: Math.min(contextMenu.y, window.innerHeight - 220) }}
          onClick={e => e.stopPropagation()}>
          <div style={{ padding: "4px 12px 6px", fontSize: 11, color: "var(--text-muted)", fontWeight: 600, letterSpacing: 0.3 }}>
            {contextMenu.note.title || "Untitled"}
          </div>
          <div className="context-divider" />
          <ContextItem icon={<Pin size={13} />} label={contextMenu.note.pinned ? "Unpin" : "Pin"} onClick={() => { onTogglePin(contextMenu.note); closeContext(); }} />
          <ContextItem icon={<Star size={13} />} label={contextMenu.note.starred ? "Unstar" : "Star"} onClick={() => { onToggleStar(contextMenu.note); closeContext(); }} />
          <ContextItem icon={<Archive size={13} />} label={contextMenu.note.archived ? "Unarchive" : "Archive"} onClick={() => { onArchive(contextMenu.note); closeContext(); }} />
          <div className="context-divider" />
          <ContextItem icon={<Trash2 size={13} />} label="Move to Trash" danger onClick={() => { onTrash(contextMenu.note); onToast?.("Moved to trash", "warning"); closeContext(); }} />
        </div>
      )}
    </div>
  );
}

function ActionBtn({ children, onClick, title, danger }: { children: React.ReactNode; onClick: () => void; title: string; danger?: boolean; }) {
  return (
    <button title={title} onClick={onClick}
      style={{ background: "none", border: "none", cursor: "pointer", padding: "3px 4px", borderRadius: 4, color: "var(--text-muted)", display: "flex", alignItems: "center", transition: "all 0.08s" }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLButtonElement;
        el.style.background = danger ? "rgba(248,113,113,0.12)" : "var(--bg-hover)";
        el.style.color = danger ? "#f87171" : "var(--text-primary)";
        el.style.transform = "scale(1.15)";
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLButtonElement;
        el.style.background = "none"; el.style.color = "var(--text-muted)"; el.style.transform = "none";
      }}>
      {children}
    </button>
  );
}

function ContextItem({ icon, label, onClick, danger }: { icon: React.ReactNode; label: string; onClick: () => void; danger?: boolean; }) {
  return (
    <div className={`context-item ${danger ? "danger" : ""}`} onClick={onClick}>
      {icon} {label}
    </div>
  );
}
