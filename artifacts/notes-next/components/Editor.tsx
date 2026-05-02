"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import {
  Star, Archive, Trash2, FileText, Pin, Eye, EyeOff, Download, Type,
  Sparkles, Loader2, X, ChevronDown, RotateCcw
} from "lucide-react";
import type { Note } from "@/lib/api";
import { hasGeminiKey, aiSummarize, aiImproveWriting, aiGenerateTitle, aiContinueWriting, aiFixGrammar, aiMakeShorter, aiMakeLonger, aiBrainstorm, aiFormatMarkdown } from "@/lib/gemini";

function formatFullDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}
function wordCount(t: string) { return t.trim() ? t.trim().split(/\s+/).length : 0; }
function charCount(t: string) { return t.length; }
function readingTime(t: string) { return Math.max(1, Math.ceil(wordCount(t) / 200)); }

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
  const blob = new Blob([title ? `# ${title}\n\n${content}` : content], { type: "text/markdown" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}

type AiAction = {
  label: string;
  emoji: string;
  desc: string;
  fn: (content: string) => Promise<string>;
  appliesTo: "content" | "both";
};

const AI_ACTIONS: AiAction[] = [
  { label: "Summarize", emoji: "📝", desc: "Get a concise summary", fn: aiSummarize, appliesTo: "content" },
  { label: "Improve Writing", emoji: "✨", desc: "Enhance clarity & flow", fn: aiImproveWriting, appliesTo: "content" },
  { label: "Fix Grammar", emoji: "🔧", desc: "Correct errors", fn: aiFixGrammar, appliesTo: "content" },
  { label: "Continue Writing", emoji: "➡️", desc: "AI continues your text", fn: aiContinueWriting, appliesTo: "content" },
  { label: "Make Shorter", emoji: "📉", desc: "Condense by ~40%", fn: aiMakeShorter, appliesTo: "content" },
  { label: "Make Longer", emoji: "📈", desc: "Expand with more detail", fn: aiMakeLonger, appliesTo: "content" },
  { label: "Brainstorm", emoji: "💡", desc: "Generate related ideas", fn: aiBrainstorm, appliesTo: "content" },
  { label: "Format Markdown", emoji: "📄", desc: "Structure as markdown", fn: aiFormatMarkdown, appliesTo: "content" },
  { label: "Generate Title", emoji: "🏷️", desc: "Suggest a note title", fn: aiGenerateTitle, appliesTo: "content" },
];

interface Props {
  note: Note | null;
  onChange: (id: string, field: "title" | "content", value: string) => void;
  onToggleStar: (note: Note) => void;
  onTogglePin: (note: Note) => void;
  onTrash: (note: Note) => void;
  onArchive: (note: Note) => void;
  onOpenSettings: () => void;
}

export function Editor({ note, onChange, onToggleStar, onTogglePin, onTrash, onArchive, onOpenSettings }: Props) {
  const [localTitle, setLocalTitle] = useState("");
  const [localContent, setLocalContent] = useState("");
  const [preview, setPreview] = useState(false);
  const [showWordCount, setShowWordCount] = useState(true);
  const [showAiMenu, setShowAiMenu] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState<{ label: string; text: string } | null>(null);
  const [aiError, setAiError] = useState("");
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastSavedId = useRef<string | null>(null);
  const [geminiEnabled, setGeminiEnabled] = useState(false);

  useEffect(() => {
    setGeminiEnabled(hasGeminiKey());
  }, [showAiMenu]);

  useEffect(() => {
    if (!note) return;
    if (note.id !== lastSavedId.current) {
      setLocalTitle(note.title);
      setLocalContent(note.content);
      lastSavedId.current = note.id;
      setAiResult(null);
      setAiError("");
    }
  }, [note]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "p") { e.preventDefault(); setPreview(p => !p); }
      if (e.key === "Escape") { setShowAiMenu(false); setAiResult(null); setAiError(""); }
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

  async function runAiAction(action: AiAction) {
    if (!note) return;
    setShowAiMenu(false);
    setAiLoading(true);
    setAiError("");
    setAiResult(null);
    try {
      const text = await action.fn(localContent || "(empty note)");
      setAiResult({ label: action.label, text });
    } catch (err) {
      setAiError(err instanceof Error ? err.message : "AI error");
    } finally {
      setAiLoading(false);
    }
  }

  function applyAiResult(field: "title" | "content") {
    if (!aiResult || !note) return;
    if (field === "title") {
      setLocalTitle(aiResult.text);
      onChange(note.id, "title", aiResult.text);
    } else {
      setLocalContent(aiResult.text);
      onChange(note.id, "content", aiResult.text);
    }
    setAiResult(null);
  }

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
    <div className="panel-editor" style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", position: "relative" }}>
      {/* Toolbar */}
      <div style={{ borderBottom: "1px solid var(--border)", padding: "8px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
        <span style={{ fontSize: 11, color: "var(--text-muted)", flexShrink: 0 }}>
          {formatFullDate(note.updatedAt || note.createdAt)}
        </span>
        <div style={{ display: "flex", gap: 2, alignItems: "center" }}>
          {/* AI Button */}
          <div style={{ position: "relative" }}>
            <button onClick={() => setShowAiMenu(m => !m)}
              style={{ display: "flex", alignItems: "center", gap: 5, padding: "5px 10px", borderRadius: 7, border: `1px solid ${geminiEnabled ? "rgba(99,102,241,0.35)" : "var(--border)"}`, background: geminiEnabled ? "rgba(99,102,241,0.08)" : "none", cursor: "pointer", color: geminiEnabled ? "#818cf8" : "var(--text-muted)", fontSize: 12, fontWeight: 600, transition: "all 0.15s" }}>
              {aiLoading ? <Loader2 size={12} style={{ animation: "spin 1s linear infinite" }} /> : <Sparkles size={12} />}
              AI
              <ChevronDown size={10} />
            </button>

            {showAiMenu && (
              <div style={{ position: "absolute", top: "calc(100% + 8px)", right: 0, background: "var(--bg-panel)", border: "1px solid var(--border)", borderRadius: 12, padding: 8, zIndex: 50, width: 240, boxShadow: "0 12px 40px rgba(0,0,0,0.3)" }}>
                {!geminiEnabled ? (
                  <div style={{ padding: "12px 14px", textAlign: "center" }}>
                    <Sparkles size={22} style={{ color: "#818cf8", marginBottom: 8, display: "block", margin: "0 auto 8px" }} />
                    <p style={{ fontSize: 13, color: "var(--text-primary)", fontWeight: 700, marginBottom: 6 }}>AI not set up</p>
                    <p style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 12 }}>Add your Gemini API key in Settings to enable AI features.</p>
                    <button onClick={() => { setShowAiMenu(false); onOpenSettings(); }}
                      style={{ padding: "8px 16px", borderRadius: 8, border: "none", background: "linear-gradient(135deg,#6366f1,#8b5cf6)", color: "white", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>
                      Open Settings
                    </button>
                  </div>
                ) : (
                  <>
                    <div style={{ padding: "4px 8px 8px", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.8, color: "var(--text-muted)" }}>
                      AI Actions — Gemini
                    </div>
                    {AI_ACTIONS.map(action => (
                      <button key={action.label} onClick={() => runAiAction(action)}
                        style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "9px 10px", borderRadius: 8, border: "none", background: "none", cursor: "pointer", textAlign: "left", transition: "background 0.1s" }}
                        onMouseEnter={e => (e.currentTarget.style.background = "var(--bg-hover)")}
                        onMouseLeave={e => (e.currentTarget.style.background = "none")}>
                        <span style={{ fontSize: 16 }}>{action.emoji}</span>
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)" }}>{action.label}</div>
                          <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{action.desc}</div>
                        </div>
                      </button>
                    ))}
                  </>
                )}
              </div>
            )}
          </div>

          <div style={{ width: 1, height: 16, background: "var(--border)", margin: "0 2px" }} />
          <EditorBtn title="Toggle preview (⌘P)" active={preview} activeColor="var(--accent)" onClick={() => setPreview(p => !p)}>
            {preview ? <EyeOff size={14} /> : <Eye size={14} />}
          </EditorBtn>
          <EditorBtn title="Toggle word count" active={showWordCount} activeColor="var(--accent)" onClick={() => setShowWordCount(s => !s)}>
            <Type size={14} />
          </EditorBtn>
          <EditorBtn title="Export as Markdown" active={false} activeColor="var(--accent)" onClick={() => exportNote(localTitle, localContent)}>
            <Download size={14} />
          </EditorBtn>
          <div style={{ width: 1, height: 16, background: "var(--border)", margin: "0 2px" }} />
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

      {/* AI Result Panel */}
      {(aiLoading || aiResult || aiError) && (
        <div style={{ borderBottom: "1px solid var(--border)", padding: "12px 20px", background: "rgba(99,102,241,0.04)" }}>
          {aiLoading && (
            <div style={{ display: "flex", alignItems: "center", gap: 10, color: "#818cf8", fontSize: 13 }}>
              <Loader2 size={15} style={{ animation: "spin 1s linear infinite" }} />
              Gemini is thinking…
            </div>
          )}
          {aiError && (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", color: "#f87171", fontSize: 13 }}>
              <span>⚠ {aiError}</span>
              <button onClick={() => setAiError("")} style={{ background: "none", border: "none", cursor: "pointer", color: "#f87171", display: "flex" }}><X size={14} /></button>
            </div>
          )}
          {aiResult && (
            <div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: "#818cf8" }}>✨ {aiResult.label}</span>
                <button onClick={() => setAiResult(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", display: "flex" }}><X size={13} /></button>
              </div>
              <div style={{ background: "var(--bg-editor)", border: "1px solid var(--border)", borderRadius: 8, padding: "10px 12px", fontSize: 13, color: "var(--text-primary)", lineHeight: 1.65, maxHeight: 160, overflowY: "auto", marginBottom: 10, fontFamily: "inherit" }}>
                {aiResult.text}
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                {aiResult.label === "Generate Title" ? (
                  <button onClick={() => applyAiResult("title")}
                    style={{ padding: "6px 14px", borderRadius: 7, border: "none", background: "linear-gradient(135deg,#6366f1,#8b5cf6)", color: "white", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>
                    Apply as Title
                  </button>
                ) : (
                  <button onClick={() => applyAiResult("content")}
                    style={{ padding: "6px 14px", borderRadius: 7, border: "none", background: "linear-gradient(135deg,#6366f1,#8b5cf6)", color: "white", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>
                    Replace Content
                  </button>
                )}
                <button onClick={() => {
                  const appended = localContent + "\n\n---\n\n**AI: " + aiResult.label + "**\n\n" + aiResult.text;
                  setLocalContent(appended);
                  onChange(note.id, "content", appended);
                  setAiResult(null);
                }}
                  style={{ padding: "6px 14px", borderRadius: 7, border: "1px solid var(--border)", background: "none", color: "var(--text-primary)", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
                  Append
                </button>
                <button onClick={() => navigator.clipboard.writeText(aiResult.text)}
                  style={{ padding: "6px 14px", borderRadius: 7, border: "1px solid var(--border)", background: "none", color: "var(--text-muted)", fontSize: 12, cursor: "pointer" }}>
                  Copy
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Content */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: "20px 32px 0", overflow: "hidden" }} onClick={() => setShowAiMenu(false)}>
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
          <div className="markdown-preview" style={{ flex: 1, overflowY: "auto", paddingBottom: 24 }}
            dangerouslySetInnerHTML={{ __html: parseMarkdown(localContent) || '<p style="color:var(--text-muted);font-style:italic">Nothing to preview.</p>' }} />
        ) : (
          <textarea className="editor-content" value={localContent}
            onChange={(e) => { setLocalContent(e.target.value); scheduleSave("content", e.target.value); }}
            placeholder="Start writing… (supports Markdown)"
            style={{ flex: 1, paddingBottom: 24 }} />
        )}
      </div>

      {/* Status bar */}
      {showWordCount && (
        <div style={{ borderTop: "1px solid var(--border)", padding: "5px 32px", display: "flex", gap: 16, alignItems: "center" }}>
          <span style={{ fontSize: 11, color: "var(--text-muted)" }}>{wc} words</span>
          <span style={{ fontSize: 11, color: "var(--text-muted)" }}>{cc} chars</span>
          <span style={{ fontSize: 11, color: "var(--text-muted)" }}>{rt} min read</span>
          {preview && <span style={{ fontSize: 11, color: "var(--accent)", fontWeight: 600 }}>PREVIEW</span>}
          {geminiEnabled && <span style={{ fontSize: 11, color: "#818cf8", display: "flex", alignItems: "center", gap: 4 }}><Sparkles size={9} /> AI enabled</span>}
          <span style={{ fontSize: 11, color: "var(--text-muted)", marginLeft: "auto", opacity: 0.6 }}>Auto-saved</span>
        </div>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
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
      onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = active ? `${activeColor}15` : "none"; }}>
      {children}
    </button>
  );
}
