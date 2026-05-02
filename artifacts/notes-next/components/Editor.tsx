"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Star, Archive, Trash2, FileText } from "lucide-react";
import type { Note } from "@/lib/api";

function formatFullDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

interface Props {
  note: Note | null;
  onChange: (id: string, field: "title" | "content", value: string) => void;
  onToggleStar: (note: Note) => void;
  onTrash: (note: Note) => void;
  onArchive: (note: Note) => void;
}

export function Editor({ note, onChange, onToggleStar, onTrash, onArchive }: Props) {
  const [localTitle, setLocalTitle] = useState("");
  const [localContent, setLocalContent] = useState("");
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastSavedId = useRef<string | null>(null);

  useEffect(() => {
    if (!note) return;
    if (note.id !== lastSavedId.current) {
      setLocalTitle(note.title);
      setLocalContent(note.content);
      lastSavedId.current = note.id;
    }
  }, [note]);

  const scheduleSave = useCallback(
    (field: "title" | "content", value: string) => {
      if (!note) return;
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
      saveTimerRef.current = setTimeout(() => {
        onChange(note.id, field, value);
      }, 600);
    },
    [note, onChange]
  );

  if (!note) {
    return (
      <div
        className="panel-editor"
        style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 10, color: "var(--text-muted)" }}
      >
        <FileText size={40} strokeWidth={1} style={{ opacity: 0.3 }} />
        <p style={{ fontSize: 14 }}>Select a note or create a new one</p>
      </div>
    );
  }

  return (
    <div className="panel-editor" style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
      <div style={{ borderBottom: "1px solid var(--border)", padding: "10px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontSize: 12, color: "var(--text-muted)" }}>
          {formatFullDate(note.updatedAt || note.createdAt)}
        </span>
        <div style={{ display: "flex", gap: 4 }}>
          <EditorActionBtn
            title={note.starred ? "Unstar" : "Star"}
            onClick={() => onToggleStar(note)}
            active={!!note.starred}
            activeColor="#f59e0b"
            Icon={Star}
          />
          <EditorActionBtn
            title={note.archived ? "Unarchive" : "Archive"}
            onClick={() => onArchive(note)}
            active={!!note.archived}
            activeColor="var(--accent)"
            Icon={Archive}
          />
          <EditorActionBtn
            title="Move to trash"
            onClick={() => onTrash(note)}
            active={false}
            activeColor="var(--accent)"
            Icon={Trash2}
          />
        </div>
      </div>

      <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: "20px 32px 20px", overflow: "auto", gap: 12 }}>
        <textarea
          className="editor-title"
          value={localTitle}
          onChange={(e) => {
            setLocalTitle(e.target.value);
            scheduleSave("title", e.target.value);
          }}
          placeholder="Title"
          rows={1}
          style={{ minHeight: 36, overflow: "hidden" }}
          onInput={(e) => {
            const el = e.currentTarget;
            el.style.height = "auto";
            el.style.height = el.scrollHeight + "px";
          }}
        />

        <div style={{ height: 1, background: "var(--border)" }} />

        <textarea
          className="editor-content"
          value={localContent}
          onChange={(e) => {
            setLocalContent(e.target.value);
            scheduleSave("content", e.target.value);
          }}
          placeholder="Start writing..."
          style={{ flex: 1, minHeight: "calc(100vh - 220px)" }}
        />
      </div>
    </div>
  );
}

function EditorActionBtn({
  title, onClick, active, activeColor, Icon
}: {
  title: string;
  onClick: () => void;
  active: boolean;
  activeColor: string;
  Icon: React.FC<{ size?: number; style?: React.CSSProperties; strokeWidth?: number }>;
}) {
  return (
    <button
      title={title}
      onClick={onClick}
      style={{
        background: "none",
        border: "none",
        cursor: "pointer",
        padding: "5px 7px",
        borderRadius: 6,
        color: active ? activeColor : "var(--text-muted)",
        display: "flex",
        alignItems: "center",
      }}
      onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "var(--bg-hover)"; }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "none"; }}
    >
      <Icon
        size={15}
        strokeWidth={1.8}
        style={active && Icon === Star ? { fill: activeColor, color: activeColor } : {}}
      />
    </button>
  );
}
