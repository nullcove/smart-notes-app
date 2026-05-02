"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import {
  MessageCircle, X, Send, Loader2, Bot, User,
  Sparkles, ChevronDown, Trash2, RotateCcw,
  FileText, Plus, Edit3, Star, Pin, Archive,
} from "lucide-react";
import { callAI, type ChatMessage, type NoteRef, type ToolCallbacks, getActiveProvider } from "@/lib/ai-engine";

// ─── Message display types ────────────────────────────────────────────────────

interface DisplayMessage {
  id: string;
  role: "user" | "assistant" | "action";
  content: string;
  error?: boolean;
  actionType?: string;
}

// ─── Action icon map ─────────────────────────────────────────────────────────

function ActionIcon({ type }: { type?: string }) {
  const props = { size: 13 };
  if (type === "create_note") return <Plus {...props} />;
  if (type === "delete_note") return <Trash2 {...props} />;
  if (type === "update_note" || type === "open_note") return <Edit3 {...props} />;
  if (type === "list_notes" || type === "search_notes") return <FileText {...props} />;
  return <Sparkles {...props} />;
}

// ─── ChatBot component ────────────────────────────────────────────────────────

interface Props {
  notes: NoteRef[];
  onCreateNote: (title: string, content: string) => Promise<NoteRef>;
  onUpdateNote: (id: string, fields: Partial<NoteRef>) => Promise<NoteRef>;
  onDeleteNote: (id: string) => Promise<void>;
  onOpenNote: (id: string) => void;
  onToast: (msg: string, type?: "success" | "error" | "info") => void;
}

export function ChatBot({ notes, onCreateNote, onUpdateNote, onDeleteNote, onOpenNote, onToast }: Props) {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<DisplayMessage[]>([]);
  const [history, setHistory] = useState<ChatMessage[]>([]);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const notesRef = useRef<NoteRef[]>(notes);
  notesRef.current = notes;

  const [active, setActive] = useState(() => getActiveProvider());

  // Re-read active provider whenever localStorage changes (e.g. after Settings save)
  useEffect(() => {
    function refresh() { setActive(getActiveProvider()); }
    window.addEventListener("storage", refresh);
    window.addEventListener("ai-provider-changed", refresh);
    return () => {
      window.removeEventListener("storage", refresh);
      window.removeEventListener("ai-provider-changed", refresh);
    };
  }, []);

  useEffect(() => {
    if (open) {
      setActive(getActiveProvider()); // always re-check when chat opens
      setTimeout(() => inputRef.current?.focus(), 100);
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [open, messages]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function addDisplay(msg: Omit<DisplayMessage, "id">) {
    const id = Math.random().toString(36).slice(2);
    setMessages(prev => [...prev, { ...msg, id }]);
  }

  const toolCallbacks: ToolCallbacks = {
    listNotes: () => notesRef.current,
    createNote: async (title, content) => {
      addDisplay({ role: "action", content: `Creating note: "${title}"`, actionType: "create_note" });
      const note = await onCreateNote(title, content);
      onToast(`Note created: "${title}"`, "success");
      return note;
    },
    updateNote: async (id, fields) => {
      const note = notesRef.current.find(n => n.id === id);
      const label = note?.title || id;
      addDisplay({ role: "action", content: `Updating: "${label}"`, actionType: "update_note" });
      const updated = await onUpdateNote(id, fields);
      return updated;
    },
    deleteNote: async (id) => {
      const note = notesRef.current.find(n => n.id === id);
      const label = note?.title || id;
      addDisplay({ role: "action", content: `Deleted: "${label}"`, actionType: "delete_note" });
      await onDeleteNote(id);
      onToast(`Note deleted: "${label}"`, "info");
    },
    openNote: (id) => {
      const note = notesRef.current.find(n => n.id === id);
      const label = note?.title || id;
      addDisplay({ role: "action", content: `Opened: "${label}"`, actionType: "open_note" });
      onOpenNote(id);
    },
  };

  const handleSend = useCallback(async () => {
    const text = input.trim();
    if (!text || loading) return;

    if (!active) {
      onToast("Select an AI model in Settings → AI Settings first", "error");
      return;
    }

    setInput("");
    addDisplay({ role: "user", content: text });
    setLoading(true);

    const newHistory: ChatMessage[] = [...history, { role: "user", content: text }];

    try {
      const reply = await callAI(text, history, toolCallbacks);
      addDisplay({ role: "assistant", content: reply });
      setHistory([...newHistory, { role: "assistant", content: reply }]);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Unknown error";
      addDisplay({ role: "assistant", content: msg, error: true });
    } finally {
      setLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [input, loading, history, active]);

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }
  }

  function clearChat() { setMessages([]); setHistory([]); }

  const providerLabel = active ? `${active.provider} / ${active.model}` : "No model selected";

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen(o => !o)}
        title="AI Assistant"
        style={{
          position: "fixed", bottom: 24, right: 24, zIndex: 500,
          width: 52, height: 52, borderRadius: "50%", border: "none",
          background: open ? "var(--bg-hover)" : "linear-gradient(135deg,#6366f1,#8b5cf6)",
          color: open ? "var(--text-muted)" : "white",
          display: "flex", alignItems: "center", justifyContent: "center",
          cursor: "pointer", boxShadow: open ? "0 4px 20px rgba(0,0,0,0.3)" : "0 6px 30px rgba(99,102,241,0.5)",
          transition: "all 0.2s",
        }}
      >
        {open ? <ChevronDown size={22} /> : <MessageCircle size={22} />}
        {!open && messages.length > 0 && (
          <span style={{ position: "absolute", top: 3, right: 3, width: 10, height: 10, borderRadius: "50%", background: "#10b981", border: "2px solid var(--bg-app)" }} />
        )}
      </button>

      {/* Chat window */}
      {open && (
        <div style={{
          position: "fixed", bottom: 88, right: 24, zIndex: 499,
          width: 380, height: 560, display: "flex", flexDirection: "column",
          background: "var(--bg-panel)", border: "1px solid var(--border)",
          borderRadius: 20, boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
          overflow: "hidden",
        }}>
          {/* Header */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "14px 16px", borderBottom: "1px solid var(--border)", flexShrink: 0 }}>
            <div style={{ width: 32, height: 32, borderRadius: 10, background: "linear-gradient(135deg,#6366f1,#8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <Bot size={16} color="white" />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 700, fontSize: 13, color: "var(--text-primary)" }}>AI Assistant</div>
              <div style={{ fontSize: 10, color: "var(--text-muted)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{providerLabel}</div>
            </div>
            <button onClick={clearChat} title="Clear chat" style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", padding: 6, borderRadius: 7, display: "flex" }}>
              <RotateCcw size={14} />
            </button>
            <button onClick={() => setOpen(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", padding: 6, borderRadius: 7, display: "flex" }}>
              <X size={16} />
            </button>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: "auto", padding: "12px 14px", display: "flex", flexDirection: "column", gap: 10 }}>
            {messages.length === 0 && (
              <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: 20 }}>
                <div style={{ width: 48, height: 48, borderRadius: 16, background: "linear-gradient(135deg,#6366f1,#8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14, boxShadow: "0 0 30px rgba(99,102,241,0.35)" }}>
                  <Sparkles size={22} color="white" />
                </div>
                <p style={{ fontSize: 14, fontWeight: 700, color: "var(--text-primary)", margin: "0 0 6px" }}>Full control AI</p>
                <p style={{ fontSize: 12, color: "var(--text-muted)", lineHeight: 1.7, margin: "0 0 16px" }}>
                  I can create, edit, delete, search and open your notes. Just tell me what to do.
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: 6, width: "100%" }}>
                  {[
                    "Create a note about today's tasks",
                    "List all my starred notes",
                    "Delete all notes in trash",
                    "Summarize my most recent note",
                  ].map(s => (
                    <button key={s} onClick={() => { setInput(s); setTimeout(() => inputRef.current?.focus(), 0); }}
                      style={{ padding: "8px 12px", borderRadius: 10, border: "1px solid var(--border)", background: "var(--bg-hover)", cursor: "pointer", color: "var(--text-muted)", fontSize: 12, textAlign: "left", lineHeight: 1.4 }}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map(msg => (
              <div key={msg.id}>
                {msg.role === "action" && (
                  <div style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 11, color: "var(--text-muted)", padding: "5px 0" }}>
                    <span style={{ width: 20, height: 20, borderRadius: 6, background: "rgba(99,102,241,0.15)", display: "flex", alignItems: "center", justifyContent: "center", color: "#818cf8", flexShrink: 0 }}>
                      <ActionIcon type={msg.actionType} />
                    </span>
                    <span style={{ fontStyle: "italic" }}>{msg.content}</span>
                  </div>
                )}

                {msg.role === "user" && (
                  <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
                    <div style={{ maxWidth: "78%", background: "linear-gradient(135deg,#6366f1,#8b5cf6)", color: "white", borderRadius: "16px 16px 4px 16px", padding: "9px 13px", fontSize: 13, lineHeight: 1.5, wordBreak: "break-word" }}>
                      {msg.content}
                    </div>
                    <div style={{ width: 28, height: 28, borderRadius: 9, background: "var(--bg-hover)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2 }}>
                      <User size={14} color="var(--text-muted)" />
                    </div>
                  </div>
                )}

                {msg.role === "assistant" && (
                  <div style={{ display: "flex", gap: 8 }}>
                    <div style={{ width: 28, height: 28, borderRadius: 9, background: msg.error ? "rgba(239,68,68,0.1)" : "rgba(99,102,241,0.15)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2 }}>
                      <Bot size={14} color={msg.error ? "#f87171" : "#818cf8"} />
                    </div>
                    <div style={{ maxWidth: "78%", background: "var(--bg-card)", border: `1px solid ${msg.error ? "rgba(239,68,68,0.2)" : "var(--border)"}`, color: msg.error ? "#f87171" : "var(--text-primary)", borderRadius: "4px 16px 16px 16px", padding: "9px 13px", fontSize: 13, lineHeight: 1.6, wordBreak: "break-word", whiteSpace: "pre-wrap" }}>
                      {msg.content}
                    </div>
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div style={{ display: "flex", gap: 8 }}>
                <div style={{ width: 28, height: 28, borderRadius: 9, background: "rgba(99,102,241,0.15)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Bot size={14} color="#818cf8" />
                </div>
                <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "4px 16px 16px 16px", padding: "10px 14px", display: "flex", alignItems: "center", gap: 6 }}>
                  <Loader2 size={14} color="#818cf8" style={{ animation: "spin 1s linear infinite" }} />
                  <span style={{ fontSize: 12, color: "var(--text-muted)" }}>Thinking…</span>
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div style={{ padding: "10px 12px", borderTop: "1px solid var(--border)", flexShrink: 0 }}>
            {!active && (
              <div style={{ marginBottom: 8, padding: "7px 10px", borderRadius: 8, background: "rgba(239,68,68,0.07)", border: "1px solid rgba(239,68,68,0.2)", fontSize: 11, color: "#f87171", textAlign: "center" }}>
                ⚠ No AI model selected — open Settings (⌘,) to configure
              </div>
            )}
            <div style={{ display: "flex", gap: 8, alignItems: "flex-end" }}>
              <textarea
                ref={inputRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask me anything about your notes…"
                rows={1}
                style={{
                  flex: 1, resize: "none", background: "var(--bg-editor)",
                  border: "1px solid var(--border)", borderRadius: 12, padding: "9px 12px",
                  fontSize: 13, color: "var(--text-primary)", outline: "none",
                  maxHeight: 100, overflowY: "auto", lineHeight: 1.5,
                  fontFamily: "inherit",
                }}
                onInput={e => {
                  const el = e.currentTarget;
                  el.style.height = "auto";
                  el.style.height = `${Math.min(el.scrollHeight, 100)}px`;
                }}
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || loading}
                style={{
                  width: 38, height: 38, borderRadius: 11, border: "none", flexShrink: 0,
                  background: !input.trim() || loading ? "var(--bg-hover)" : "linear-gradient(135deg,#6366f1,#8b5cf6)",
                  color: !input.trim() || loading ? "var(--text-muted)" : "white",
                  cursor: !input.trim() || loading ? "not-allowed" : "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  transition: "all 0.15s",
                }}
              >
                <Send size={16} />
              </button>
            </div>
            <p style={{ fontSize: 10, color: "var(--text-faint)", margin: "6px 0 0", textAlign: "center" }}>
              Enter to send · Shift+Enter for new line
            </p>
          </div>

          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      )}
    </>
  );
}
