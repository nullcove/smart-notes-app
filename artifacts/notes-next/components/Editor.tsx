"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Star, Archive, Trash2, FileText, Pin, Eye, EyeOff, Download, Type } from "lucide-react";
import type { Note } from "@/lib/api";

function formatFullDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

function wordCount(text: string) {
  return text.trim() ? text.trim().split(/\s+/).length : 0;
}
function charCount(text: string) { return text.length; }
function readingTime(text: string) { return Math.max(1, Math.ceil(wordCount(text) / 200)); }

function parseMarkdown(md: string): string {
  return md
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/^### (.+)$/gm, "<h3>$1</h3>")
    .replace(/^## (.+)$/gm, "<h2>$1</h2>")
    .replace(/^# (.+)$/gm, "<h1>$1</h1>")
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/^> (.+)$/gm, "<blockquote>$1</blockquote>")
    .replace(/^---$/gm, "<hr />")
    .replace(/^\- (.+)$/gm, "<li>$1</li>")
    .replace(/(<li>.*<\/li>\n?)+/g, (m) => `<ul>${m}</ul>`)
    .replace(/^\d+\. (.+)$/gm, "<li>$1</li>")
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>')
    .replace(/\n\n/g, "</p><p>")
    .replace(/^(?!<[hH\d]|<ul|<ol|<li|<blockquote|<hr|<pre)(.+)$/gm, (line) =>
      line.startsWith("<") ? line : `<p>${line}</p>`
    );
}

function exportNote(title: string, content: string) {
  const filename = (title || "untitled").replace(/[^a-z0-9]/gi, "_").toLowerCase() + ".md";
  const text = title ? `# ${title}\n\n${content}` : content;
  const blob = new Blob([text], { type: "text/markdown" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}

interface Props {
  note: Note | null;
  onChange: (id: string, field: "title" | "content", value: string) => void;
  onToggleStar: (note: Note) => void;
  onTogglePin: (note: Note) => void;
  onTrash: (note: Note) => void;
  onArchive: (note: Note) => void;
}

export function Editor({ note, onChange, onToggleStar, onTogglePin, onTrash, onArchive }: Props) {
  const [localTitle, setLocalTitle] = useState("");
  const [localContent, setLocalContent] = useState("");
  const [preview, setPreview] = useState(false);
  const [showWordCount, setShowWordCount] = useState(true);
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

  // Keyboard shortcut: ⌘P for preview
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "p") { e.preventDefault(); setPreview(p => !p); }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const scheduleSave = useCallback(
    (field: "title" | "content", value: string) => {
      if (!note) return;
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
      saveTimerRef.current = setTimeout(() => onChange(note.id, field, value), 600);
    },
    [note, onChange]
  );

  if (!note) {
    return (
      <div className="panel-editor" style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 12, color: "var(--text-muted)" }}>
        <FileText size={48} strokeWidth={1} style={{ opacity: 0.2 }} />
        <p style={{ fontSize: 15 }}>Select a note or create a new one</p>
        <p style={{ fontSize: 12, opacity: 0.6 }}>⌘N to create · ⌘K to search</p>
      </div>
    );
  }

  const wc = wordCount(localContent);
  const cc = charCount(localContent);
  const rt = readingTime(localContent);

  return (
    <div className="panel-editor" style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
      {/* Toolbar */}
      <div style={{ borderBottom: "1px solid var(--border)", padding: "8px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
        <span style={{ fontSize: 11, color: "var(--text-muted)", flexShrink: 0 }}>
          {formatFullDate(note.updatedAt || note.createdAt)}
        </span>
        <div style={{ display: "flex", gap: 2, alignItems: "center" }}>
          <EditorBtn title="Toggle preview (⌘P)" active={preview} activeColor="var(--accent)" onClick={() => setPreview(p => !p)}>
            {preview ? <EyeOff size={14} /> : <Eye size={14} />}
          </EditorBtn>
          <EditorBtn title="Toggle word count" active={showWordCount} activeColor="var(--accent)" onClick={() => setShowWordCount(s => !s)}>
            <Type size={14} />
          </EditorBtn>
          <EditorBtn title="Export as Markdown" active={false} activeColor="var(--accent)" onClick={() => exportNote(localTitle, localContent)}>
            <Download size={14} />
          </EditorBtn>
          <div style={{ width: 1, height: 16, background: "var(--border)", margin: "0 4px" }} />
          <EditorBtn title={note.pinned ? "Unpin" : "Pin"} active={!!note.pinned} activeColor="var(--pin)" onClick={() => onTogglePin(note)}>
            <Pin size={14} style={note.pinned ? { fill: "var(--pin)" } : {}} />
          </EditorBtn>
          <EditorBtn title={note.starred ? "Unstar" : "Star"} active={!!note.starred} activeColor="#f59e0b" onClick={() => onToggleStar(note)}>
            <Star size={14} style={note.starred ? { fill: "#f59e0b" } : {}} />
          </EditorBtn>
          <EditorBtn title={note.archived ? "Unarchive" : "Archive"} active={!!note.archived} activeColor="var(--accent)" onClick={() => onArchive(note)}>
            <Archive size={14} />
          </EditorBtn>
          <EditorBtn title="Move to trash" active={false} activeColor="var(--accent)" onClick={() => onTrash(note)}>
            <Trash2 size={14} />
          </EditorBtn>
        </div>
      </div>

      {/* Content */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: "20px 32px 0", overflow: "hidden" }}>
        <textarea
          className="editor-title"
          value={localTitle}
          onChange={(e) => { setLocalTitle(e.target.value); scheduleSave("title", e.target.value); }}
          placeholder="Title"
          rows={1}
          style={{ minHeight: 36, overflow: "hidden", marginBottom: 10 }}
          onInput={(e) => { const el = e.currentTarget; el.style.height = "auto"; el.style.height = el.scrollHeight + "px"; }}
        />
        <div style={{ height: 1, background: "var(--border)", marginBottom: 14 }} />

        {preview ? (
          <div
            className="markdown-preview"
            style={{ flex: 1, overflowY: "auto", paddingBottom: 24 }}
            dangerouslySetInnerHTML={{ __html: parseMarkdown(localContent) || '<p style="color:var(--text-muted);font-style:italic">Nothing to preview.</p>' }}
          />
        ) : (
          <textarea
            className="editor-content"
            value={localContent}
            onChange={(e) => { setLocalContent(e.target.value); scheduleSave("content", e.target.value); }}
            placeholder="Start writing… (supports Markdown)"
            style={{ flex: 1, paddingBottom: 24 }}
          />
        )}
      </div>

      {/* Status bar */}
      {showWordCount && (
        <div style={{ borderTop: "1px solid var(--border)", padding: "5px 32px", display: "flex", gap: 16, alignItems: "center" }}>
          <span style={{ fontSize: 11, color: "var(--text-muted)" }}>{wc} words</span>
          <span style={{ fontSize: 11, color: "var(--text-muted)" }}>{cc} chars</span>
          <span style={{ fontSize: 11, color: "var(--text-muted)" }}>{rt} min read</span>
          {preview && <span style={{ fontSize: 11, color: "var(--accent)", fontWeight: 600 }}>PREVIEW</span>}
          <span style={{ fontSize: 11, color: "var(--text-muted)", marginLeft: "auto", opacity: 0.6 }}>Auto-saved</span>
        </div>
      )}
    </div>
  );
}

function EditorBtn({ children, onClick, title, active, activeColor }: {
  children: React.ReactNode; onClick: () => void; title: string; active: boolean; activeColor: string;
}) {
  return (
    <button title={title} onClick={onClick}
      style={{ background: active ? `${activeColor}15` : "none", border: "none", cursor: "pointer", padding: "5px 7px", borderRadius: 6, color: active ? activeColor : "var(--text-muted)", display: "flex", alignItems: "center", transition: "all 0.1s" }}
      onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "var(--bg-hover)"; }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = active ? `${activeColor}15` : "none"; }}
    >
      {children}
    </button>
  );
}
