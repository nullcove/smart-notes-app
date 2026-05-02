"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import {
  Star, Archive, Trash2, FileText, Pin, Eye, EyeOff, Download, Type,
  Sparkles, Loader2, X, ChevronDown, Maximize2, Minimize2, ZoomIn, ZoomOut,
  AlignLeft, Hash, Quote, Code, Bold, Italic, Link2, Minus
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
function lineCount(t: string) { return t ? t.split("\n").length : 0; }
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

type AiAction = { label: string; emoji: string; desc: string; fn: (c: string) => Promise<string>; };

const AI_ACTIONS: AiAction[] = [
  { label: "Summarize", emoji: "📝", desc: "Get a concise summary", fn: aiSummarize },
  { label: "Improve Writing", emoji: "✨", desc: "Enhance clarity & flow", fn: aiImproveWriting },
  { label: "Fix Grammar", emoji: "🔧", desc: "Correct errors", fn: aiFixGrammar },
  { label: "Continue Writing", emoji: "➡️", desc: "AI continues your text", fn: aiContinueWriting },
  { label: "Make Shorter", emoji: "📉", desc: "Condense by ~40%", fn: aiMakeShorter },
  { label: "Make Longer", emoji: "📈", desc: "Expand with more detail", fn: aiMakeLonger },
  { label: "Brainstorm", emoji: "💡", desc: "Generate related ideas", fn: aiBrainstorm },
  { label: "Format Markdown", emoji: "📄", desc: "Structure as markdown", fn: aiFormatMarkdown },
  { label: "Generate Title", emoji: "🏷️", desc: "Suggest a note title", fn: aiGenerateTitle },
];

interface SelectionToolbar { x: number; y: number; }

interface Props {
  note: Note | null;
  onChange: (id: string, field: "title" | "content", value: string) => void;
  onToggleStar: (note: Note) => void;
  onTogglePin: (note: Note) => void;
  onTrash: (note: Note) => void;
  onArchive: (note: Note) => void;
  onOpenSettings: () => void;
  onToast?: (msg: string, type?: "success" | "info" | "warning" | "error") => void;
  focusMode?: boolean;
  onExitFocus?: () => void;
}

type SaveStatus = "idle" | "saving" | "saved";

export function Editor({ note, onChange, onToggleStar, onTogglePin, onTrash, onArchive, onOpenSettings, onToast, focusMode, onExitFocus }: Props) {
  const [localTitle, setLocalTitle] = useState("");
  const [localContent, setLocalContent] = useState("");
  const [preview, setPreview] = useState(false);
  const [showWordCount, setShowWordCount] = useState(true);
  const [showAiMenu, setShowAiMenu] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState<{ label: string; text: string } | null>(null);
  const [aiError, setAiError] = useState("");
  const [geminiEnabled, setGeminiEnabled] = useState(false);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const [readingProgress, setReadingProgress] = useState(0);
  const [fontSize, setFontSize] = useState(15);
  const [selBar, setSelBar] = useState<SelectionToolbar | null>(null);
  const [zenMode, setZenMode] = useState(false);
  const [copiedAi, setCopiedAi] = useState(false);

  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const savedTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastSavedId = useRef<string | null>(null);
  const contentRef = useRef<HTMLTextAreaElement>(null);
  const contentScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => { setGeminiEnabled(hasGeminiKey()); }, [showAiMenu]);

  useEffect(() => {
    if (!note) return;
    if (note.id !== lastSavedId.current) {
      setLocalTitle(note.title);
      setLocalContent(note.content);
      lastSavedId.current = note.id;
      setAiResult(null);
      setAiError("");
      setSaveStatus("idle");
      setReadingProgress(0);
    }
  }, [note]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const meta = e.metaKey || e.ctrlKey;
      if (meta && e.key === "p") { e.preventDefault(); setPreview(p => !p); }
      if (meta && e.shiftKey && e.key === "F") { e.preventDefault(); setZenMode(z => !z); }
      if (meta && e.key === "=") { e.preventDefault(); setFontSize(f => Math.min(f + 1, 24)); }
      if (meta && e.key === "-") { e.preventDefault(); setFontSize(f => Math.max(f - 1, 11)); }
      if (e.key === "Escape") {
        setShowAiMenu(false); setAiResult(null); setAiError("");
        setSelBar(null);
        if (zenMode) setZenMode(false);
      }
      // Format shortcuts in editor
      if (meta && e.key === "b" && document.activeElement === contentRef.current) {
        e.preventDefault(); wrapSelection("**", "**");
      }
      if (meta && e.key === "i" && document.activeElement === contentRef.current) {
        e.preventDefault(); wrapSelection("*", "*");
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [zenMode]);

  function wrapSelection(before: string, after: string = before) {
    const ta = contentRef.current;
    if (!ta) return;
    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    const selected = ta.value.slice(start, end);
    const newContent = ta.value.slice(0, start) + before + selected + after + ta.value.slice(end);
    setLocalContent(newContent);
    scheduleSave("content", newContent);
    setSelBar(null);
    setTimeout(() => {
      ta.focus();
      ta.setSelectionRange(start + before.length, end + before.length);
    }, 0);
  }

  function insertAtCursor(text: string) {
    const ta = contentRef.current;
    if (!ta) return;
    const start = ta.selectionStart;
    const newContent = ta.value.slice(0, start) + text + ta.value.slice(ta.selectionEnd);
    setLocalContent(newContent);
    scheduleSave("content", newContent);
    setSelBar(null);
    setTimeout(() => { ta.focus(); ta.setSelectionRange(start + text.length, start + text.length); }, 0);
  }

  function onTextareaMouseUp(e: React.MouseEvent<HTMLTextAreaElement>) {
    const ta = contentRef.current;
    if (!ta) return;
    const sel = ta.value.slice(ta.selectionStart, ta.selectionEnd).trim();
    if (!sel) { setSelBar(null); return; }
    const rect = (e.target as HTMLTextAreaElement).getBoundingClientRect();
    const x = Math.min(Math.max(e.clientX, rect.left + 80), rect.right - 80);
    const y = e.clientY - 46;
    setSelBar({ x, y });
  }

  const scheduleSave = useCallback(
    (field: "title" | "content", value: string) => {
      if (!note) return;
      setSaveStatus("saving");
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
      if (savedTimerRef.current) clearTimeout(savedTimerRef.current);
      saveTimerRef.current = setTimeout(() => {
        onChange(note.id, field, value);
        setSaveStatus("saved");
        savedTimerRef.current = setTimeout(() => setSaveStatus("idle"), 2000);
      }, 600);
    },
    [note, onChange]
  );

  function onContentScroll(e: React.UIEvent<HTMLDivElement>) {
    const el = e.currentTarget;
    const max = el.scrollHeight - el.clientHeight;
    setReadingProgress(max > 0 ? Math.round((el.scrollTop / max) * 100) : 0);
  }

  async function runAiAction(action: AiAction) {
    if (!note) return;
    setShowAiMenu(false);
    setAiLoading(true);
    setAiError("");
    setAiResult(null);
    try {
      const text = await action.fn(localContent || "(empty note)");
      setAiResult({ label: action.label, text });
      onToast?.(`✨ ${action.label} complete`, "success");
    } catch (err) {
      setAiError(err instanceof Error ? err.message : "AI error");
      onToast?.("AI error — check your API key", "error");
    } finally {
      setAiLoading(false);
    }
  }

  function applyAiResult(field: "title" | "content") {
    if (!aiResult || !note) return;
    if (field === "title") {
      setLocalTitle(aiResult.text);
      onChange(note.id, "title", aiResult.text);
      onToast?.("Title applied", "success");
    } else {
      setLocalContent(aiResult.text);
      onChange(note.id, "content", aiResult.text);
      onToast?.("Content replaced", "success");
    }
    setAiResult(null);
  }

  function copyAiResult() {
    if (!aiResult) return;
    navigator.clipboard.writeText(aiResult.text);
    setCopiedAi(true);
    setTimeout(() => setCopiedAi(false), 1500);
    onToast?.("Copied to clipboard", "info");
  }

  if (!note) {
    return (
      <div className="panel-editor" style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 14, color: "var(--text-muted)" }}>
        <div style={{ animation: "floatIcon 3s ease-in-out infinite" }}>
          <FileText size={52} strokeWidth={1} style={{ opacity: 0.12 }} />
        </div>
        <p style={{ fontSize: 15, fontWeight: 500 }}>Select a note or create a new one</p>
        <p style={{ fontSize: 12, opacity: 0.5 }}>⌘N to create · ⌘K to search</p>
        <div style={{ marginTop: 8, display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center", maxWidth: 320 }}>
          {["⌘N New note", "⌘K Search", "⌘/ Shortcuts", "⌘, Settings"].map(hint => (
            <span key={hint} style={{ fontSize: 11, background: "var(--bg-hover)", border: "1px solid var(--border)", borderRadius: 6, padding: "3px 9px", color: "var(--text-muted)" }}>{hint}</span>
          ))}
        </div>
      </div>
    );
  }

  const wc = wordCount(localContent);
  const cc = charCount(localContent);
  const rt = readingTime(localContent);
  const lc = lineCount(localContent);

  const editorContent = (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", position: "relative" }}
      onClick={() => { setShowAiMenu(false); setSelBar(null); }}>

      {/* Reading progress */}
      <div className="reading-progress">
        <div className="reading-progress-fill" style={{ width: `${readingProgress}%` }} />
      </div>

      {/* Toolbar */}
      <div style={{ borderBottom: "1px solid var(--border)", padding: "8px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 6, flexShrink: 0, marginTop: 2 }}>
        <span style={{ fontSize: 11, color: "var(--text-muted)", flexShrink: 0, display: "flex", alignItems: "center", gap: 8 }}>
          {formatFullDate(note.updatedAt || note.createdAt)}
          {/* Save status */}
          <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <span className={`save-dot ${saveStatus}`} />
            {saveStatus === "saving" && <span style={{ fontSize: 10, color: "#f59e0b", animation: "fadeIn 0.2s ease" }}>Saving…</span>}
            {saveStatus === "saved" && <span style={{ fontSize: 10, color: "#10b981", animation: "fadeIn 0.2s ease" }}>Saved ✓</span>}
          </span>
        </span>

        <div style={{ display: "flex", gap: 2, alignItems: "center" }}>
          {/* AI Button */}
          <div style={{ position: "relative" }} onClick={e => e.stopPropagation()}>
            <button onClick={() => setShowAiMenu(m => !m)}
              style={{ display: "flex", alignItems: "center", gap: 5, padding: "5px 10px", borderRadius: 7, border: `1px solid ${geminiEnabled ? "rgba(99,102,241,0.4)" : "var(--border)"}`, background: showAiMenu ? "rgba(99,102,241,0.12)" : geminiEnabled ? "rgba(99,102,241,0.06)" : "none", cursor: "pointer", color: geminiEnabled ? "#818cf8" : "var(--text-muted)", fontSize: 12, fontWeight: 600, transition: "all 0.15s" }}>
              {aiLoading
                ? <Loader2 size={12} style={{ animation: "spin 1s linear infinite", color: "#818cf8" }} />
                : <span className="ai-sparkle"><Sparkles size={12} /></span>}
              AI
              <ChevronDown size={10} style={{ transition: "transform 0.15s", transform: showAiMenu ? "rotate(180deg)" : "none" }} />
            </button>

            {showAiMenu && (
              <div style={{ position: "absolute", top: "calc(100% + 8px)", right: 0, background: "var(--bg-editor)", border: "1px solid var(--border)", borderRadius: 13, padding: 7, zIndex: 50, width: 248, boxShadow: "0 16px 50px rgba(0,0,0,0.28)", animation: "scaleIn 0.12s ease" }}>
                {!geminiEnabled ? (
                  <div style={{ padding: "14px 16px", textAlign: "center" }}>
                    <Sparkles size={24} style={{ color: "#818cf8", display: "block", margin: "0 auto 10px" }} />
                    <p style={{ fontSize: 13, color: "var(--text-primary)", fontWeight: 700, marginBottom: 6 }}>AI not set up</p>
                    <p style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 12 }}>Add your Gemini API key to enable AI.</p>
                    <button onClick={() => { setShowAiMenu(false); onOpenSettings(); }}
                      style={{ padding: "8px 18px", borderRadius: 8, border: "none", background: "linear-gradient(135deg,#6366f1,#8b5cf6)", color: "white", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>
                      Open Settings
                    </button>
                  </div>
                ) : (
                  <>
                    <div style={{ padding: "4px 10px 8px", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.8, color: "var(--text-muted)" }}>
                      ✨ Gemini AI
                    </div>
                    {AI_ACTIONS.map((action, i) => (
                      <button key={action.label} onClick={() => runAiAction(action)}
                        style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "9px 10px", borderRadius: 8, border: "none", background: "none", cursor: "pointer", textAlign: "left", transition: "background 0.08s", animation: `fadeInUp 0.15s ease both`, animationDelay: `${i * 25}ms` }}
                        onMouseEnter={e => (e.currentTarget.style.background = "var(--bg-hover)")}
                        onMouseLeave={e => (e.currentTarget.style.background = "none")}>
                        <span style={{ fontSize: 16, flexShrink: 0 }}>{action.emoji}</span>
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

          <div style={{ width: 1, height: 16, background: "var(--border)", margin: "0 1px" }} />

          {/* Font size */}
          <button className="font-ctrl-btn" onClick={() => setFontSize(f => Math.max(f - 1, 11))} title="Decrease font size (⌘-)"><ZoomOut size={12} /></button>
          <span style={{ fontSize: 10, color: "var(--text-muted)", minWidth: 22, textAlign: "center" }}>{fontSize}</span>
          <button className="font-ctrl-btn" onClick={() => setFontSize(f => Math.min(f + 1, 24))} title="Increase font size (⌘=)"><ZoomIn size={12} /></button>

          <div style={{ width: 1, height: 16, background: "var(--border)", margin: "0 1px" }} />

          <EditorBtn title="Toggle preview (⌘P)" active={preview} activeColor="var(--accent)" onClick={() => setPreview(p => !p)}>
            {preview ? <EyeOff size={14} /> : <Eye size={14} />}
          </EditorBtn>
          <EditorBtn title="Toggle stats" active={showWordCount} activeColor="var(--accent)" onClick={() => setShowWordCount(s => !s)}>
            <Type size={14} />
          </EditorBtn>
          <EditorBtn title="Zen mode (⌘⇧F)" active={zenMode} activeColor="#8b5cf6" onClick={() => setZenMode(z => !z)}>
            {zenMode ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
          </EditorBtn>
          <EditorBtn title="Export as Markdown" active={false} activeColor="var(--accent)" onClick={() => { exportNote(localTitle, localContent); onToast?.("Exported as .md", "info"); }}>
            <Download size={14} />
          </EditorBtn>

          <div style={{ width: 1, height: 16, background: "var(--border)", margin: "0 1px" }} />

          <EditorBtn title={note.pinned ? "Unpin" : "Pin"} active={!!note.pinned} activeColor="var(--pin)" onClick={() => { onTogglePin(note); onToast?.(note.pinned ? "Unpinned" : "Pinned 📌", "info"); }}>
            <Pin size={14} style={note.pinned ? { fill: "var(--pin)" } : {}} />
          </EditorBtn>
          <EditorBtn title={note.starred ? "Unstar" : "Star"} active={!!note.starred} activeColor="#f59e0b" onClick={() => { onToggleStar(note); onToast?.(note.starred ? "Unstarred" : "Starred ⭐", "info"); }}>
            <Star size={14} style={note.starred ? { fill: "#f59e0b" } : {}} />
          </EditorBtn>
          <EditorBtn title={note.archived ? "Unarchive" : "Archive"} active={!!note.archived} activeColor="var(--accent)" onClick={() => { onArchive(note); onToast?.(note.archived ? "Unarchived" : "Archived", "info"); }}>
            <Archive size={14} />
          </EditorBtn>
          <EditorBtn title="Move to trash" active={false} activeColor="#f87171" onClick={() => { onTrash(note); onToast?.("Moved to trash", "warning"); }}>
            <Trash2 size={14} />
          </EditorBtn>
        </div>
      </div>

      {/* AI loading bar */}
      {aiLoading && <div className="ai-loading-bar" />}

      {/* AI Result Panel */}
      {(aiLoading || aiResult || aiError) && (
        <div className="ai-result-panel" style={{ borderBottom: "1px solid var(--border)", padding: "12px 20px", background: "rgba(99,102,241,0.04)", flexShrink: 0 }}>
          {aiLoading && (
            <div style={{ display: "flex", alignItems: "center", gap: 10, color: "#818cf8", fontSize: 13 }}>
              <Loader2 size={15} style={{ animation: "spin 1s linear infinite" }} />
              <span>Gemini is thinking…</span>
              <span style={{ fontSize: 11, color: "var(--text-muted)", marginLeft: "auto" }}>This may take a few seconds</span>
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
                <span style={{ fontSize: 12, fontWeight: 700, color: "#818cf8", display: "flex", alignItems: "center", gap: 6 }}>
                  <Sparkles size={12} /> {aiResult.label}
                </span>
                <button onClick={() => setAiResult(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", display: "flex", padding: 3, borderRadius: 4, transition: "background 0.1s" }}
                  onMouseEnter={e => (e.currentTarget.style.background = "var(--bg-hover)")}
                  onMouseLeave={e => (e.currentTarget.style.background = "none")}>
                  <X size={13} />
                </button>
              </div>
              <div style={{ background: "var(--bg-editor)", border: "1px solid rgba(99,102,241,0.2)", borderRadius: 8, padding: "10px 14px", fontSize: 13, color: "var(--text-primary)", lineHeight: 1.65, maxHeight: 150, overflowY: "auto", marginBottom: 10, fontFamily: "inherit", animation: "fadeInUp 0.18s ease" }}>
                {aiResult.text}
              </div>
              <div style={{ display: "flex", gap: 7 }}>
                {aiResult.label === "Generate Title" ? (
                  <button onClick={() => applyAiResult("title")}
                    style={{ padding: "6px 14px", borderRadius: 7, border: "none", background: "linear-gradient(135deg,#6366f1,#8b5cf6)", color: "white", fontSize: 12, fontWeight: 700, cursor: "pointer", transition: "all 0.15s" }}
                    onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.03)"; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = "none"; }}>
                    Apply as Title
                  </button>
                ) : (
                  <button onClick={() => applyAiResult("content")}
                    style={{ padding: "6px 14px", borderRadius: 7, border: "none", background: "linear-gradient(135deg,#6366f1,#8b5cf6)", color: "white", fontSize: 12, fontWeight: 700, cursor: "pointer", transition: "all 0.15s" }}
                    onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.03)"; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = "none"; }}>
                    Replace Content
                  </button>
                )}
                <button onClick={() => {
                  const appended = localContent + "\n\n---\n\n**AI — " + aiResult.label + "**\n\n" + aiResult.text;
                  setLocalContent(appended); onChange(note.id, "content", appended); setAiResult(null);
                  onToast?.("AI result appended", "success");
                }}
                  style={{ padding: "6px 14px", borderRadius: 7, border: "1px solid var(--border)", background: "none", color: "var(--text-primary)", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
                  Append
                </button>
                <button onClick={copyAiResult}
                  style={{ padding: "6px 14px", borderRadius: 7, border: "1px solid var(--border)", background: copiedAi ? "rgba(16,185,129,0.1)" : "none", color: copiedAi ? "#10b981" : "var(--text-muted)", fontSize: 12, cursor: "pointer", transition: "all 0.2s" }}>
                  {copiedAi ? "Copied ✓" : "Copy"}
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Floating Format Toolbar */}
      {selBar && (
        <div className="format-toolbar" style={{ left: selBar.x - 140, top: selBar.y - 52 }}
          onMouseDown={e => e.preventDefault()}>
          <button className="format-toolbar-btn" title="Bold (⌘B)" onClick={() => wrapSelection("**", "**")}><Bold size={12} /></button>
          <button className="format-toolbar-btn" title="Italic (⌘I)" onClick={() => wrapSelection("*", "*")}><Italic size={12} /></button>
          <button className="format-toolbar-btn" title="Code" onClick={() => wrapSelection("`", "`")}><Code size={12} /></button>
          <div className="format-toolbar-divider" />
          <button className="format-toolbar-btn" title="Heading 1" onClick={() => insertAtCursor("\n# ")} style={{ fontSize: 11 }}>H1</button>
          <button className="format-toolbar-btn" title="Heading 2" onClick={() => insertAtCursor("\n## ")} style={{ fontSize: 11 }}>H2</button>
          <button className="format-toolbar-btn" title="Heading 3" onClick={() => insertAtCursor("\n### ")} style={{ fontSize: 11 }}>H3</button>
          <div className="format-toolbar-divider" />
          <button className="format-toolbar-btn" title="Quote" onClick={() => wrapSelection("\n> ", "")}><Quote size={12} /></button>
          <button className="format-toolbar-btn" title="Bullet list" onClick={() => insertAtCursor("\n- ")}><AlignLeft size={12} /></button>
          <button className="format-toolbar-btn" title="Divider" onClick={() => insertAtCursor("\n\n---\n\n")}><Minus size={12} /></button>
        </div>
      )}

      {/* Content Area */}
      <div ref={contentScrollRef} onScroll={onContentScroll}
        style={{ flex: 1, display: "flex", flexDirection: "column", padding: zenMode ? "32px 20% 0" : "20px 32px 0", overflow: "hidden", transition: "padding 0.3s ease" }}
        onClick={() => setShowAiMenu(false)}>
        <textarea
          className="editor-title"
          value={localTitle}
          onChange={(e) => { setLocalTitle(e.target.value); scheduleSave("title", e.target.value); }}
          placeholder="Title"
          rows={1}
          style={{ minHeight: 36, overflow: "hidden", marginBottom: 10, fontSize: Math.max(fontSize + 7, 18) }}
          onInput={(e) => { const el = e.currentTarget; el.style.height = "auto"; el.style.height = el.scrollHeight + "px"; }}
        />
        <div style={{ height: 1, background: "var(--border)", marginBottom: 14 }} />

        {preview ? (
          <div className="markdown-preview" style={{ flex: 1, overflowY: "auto", paddingBottom: 24 }}
            dangerouslySetInnerHTML={{ __html: parseMarkdown(localContent) || '<p style="color:var(--text-muted);font-style:italic">Nothing to preview.</p>' }} />
        ) : (
          <textarea
            ref={contentRef}
            className="editor-content"
            value={localContent}
            onChange={(e) => { setLocalContent(e.target.value); scheduleSave("content", e.target.value); }}
            placeholder={"Start writing… (supports Markdown)\n\nTip: Select text for format toolbar · ⌘B bold · ⌘I italic"}
            style={{ flex: 1, paddingBottom: 24, fontSize }}
            onMouseUp={onTextareaMouseUp}
            onKeyUp={(e) => { if (!(e.metaKey || e.ctrlKey)) setSelBar(null); }}
          />
        )}
      </div>

      {/* Status bar */}
      {showWordCount && (
        <div style={{ borderTop: "1px solid var(--border)", padding: "5px 32px", display: "flex", gap: 14, alignItems: "center", flexShrink: 0, flexWrap: "wrap" }}>
          <StatusStat label="words" value={wc} />
          <StatusStat label="chars" value={cc} />
          <StatusStat label="lines" value={lc} />
          <StatusStat label="min read" value={rt} />
          {preview && <span style={{ fontSize: 11, color: "var(--accent)", fontWeight: 600, letterSpacing: 0.3 }}>PREVIEW</span>}
          {zenMode && <span style={{ fontSize: 11, color: "#8b5cf6", fontWeight: 600, letterSpacing: 0.3 }}>ZEN MODE</span>}
          {geminiEnabled && (
            <span style={{ fontSize: 11, color: "#818cf8", display: "flex", alignItems: "center", gap: 4, marginLeft: "auto" }}>
              <Sparkles size={9} /> AI ready
            </span>
          )}
          {readingProgress > 0 && (
            <span style={{ fontSize: 11, color: "var(--text-muted)", marginLeft: geminiEnabled ? 0 : "auto" }}>
              {readingProgress}% read
            </span>
          )}
        </div>
      )}
    </div>
  );

  if (zenMode || focusMode) {
    return (
      <div className="focus-mode-overlay">
        <button className="focus-exit-btn" onClick={() => { setZenMode(false); onExitFocus?.(); }}>
          <Minimize2 size={12} /> Exit {zenMode ? "Zen" : "Focus"} Mode
          <span style={{ opacity: 0.6, fontSize: 10 }}>Esc</span>
        </button>
        {editorContent}
      </div>
    );
  }

  return (
    <div className="panel-editor" style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", position: "relative" }}>
      {editorContent}
      <style>{`@keyframes floatIcon { 0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)} }`}</style>
    </div>
  );
}

function StatusStat({ label, value }: { label: string; value: number }) {
  return (
    <span style={{ fontSize: 11, color: "var(--text-muted)", display: "flex", alignItems: "center", gap: 3 }}>
      <span style={{ fontWeight: 600, color: "var(--text-primary)", opacity: 0.7 }}>{value.toLocaleString()}</span> {label}
    </span>
  );
}

function EditorBtn({ children, onClick, title, active, activeColor }: {
  children: React.ReactNode; onClick: () => void; title: string; active: boolean; activeColor: string;
}) {
  return (
    <button title={title} onClick={onClick}
      style={{ background: active ? `${activeColor}18` : "none", border: "none", cursor: "pointer", padding: "5px 7px", borderRadius: 6, color: active ? activeColor : "var(--text-muted)", display: "flex", alignItems: "center", transition: "all 0.12s" }}
      onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "var(--bg-hover)"; (e.currentTarget as HTMLButtonElement).style.transform = "scale(1.1)"; }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = active ? `${activeColor}18` : "none"; (e.currentTarget as HTMLButtonElement).style.transform = "none"; }}>
      {children}
    </button>
  );
}
