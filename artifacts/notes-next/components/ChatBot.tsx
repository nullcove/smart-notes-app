"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import {
  MessageCircle, X, Send, Loader2, Bot, User,
  Sparkles, ChevronDown, Trash2, RotateCcw,
  FileText, Plus, Edit3, Star, ChevronRight,
  Zap, Clock, Hash, Wrench,
} from "lucide-react";
import { callAI, type ChatMessage, type NoteRef, type ToolCallbacks, getActiveProvider } from "@/lib/ai-engine";

interface DisplayMessage {
  id: string;
  role: "user" | "assistant" | "action";
  content: string;
  error?: boolean;
  actionType?: string;
  toolCalls?: string[];
  usage?: { prompt: number; completion: number; total: number };
  durationMs?: number;
}

function ActionIcon({ type }: { type?: string }) {
  const props = { size: 12 };
  if (type === "create_note") return <Plus {...props} />;
  if (type === "delete_note") return <Trash2 {...props} />;
  if (type === "update_note" || type === "open_note") return <Edit3 {...props} />;
  if (type === "list_notes" || type === "search_notes") return <FileText {...props} />;
  return <Sparkles {...props} />;
}

function ToolLabel({ name }: { name: string }) {
  const map: Record<string, string> = {
    list_notes: "list_notes", create_note: "create_note", update_note: "update_note",
    delete_note: "delete_note", open_note: "open_note", search_notes: "search_notes",
  };
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 3, padding: "1px 7px", borderRadius: 5, background: "rgba(99,102,241,0.15)", border: "1px solid rgba(99,102,241,0.25)", color: "#a5b4fc", fontSize: 10, fontFamily: "monospace", fontWeight: 600 }}>
      {map[name] ?? name}
    </span>
  );
}

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
  const [expandedDetails, setExpandedDetails] = useState<Set<string>>(new Set());
  const [totalTokens, setTotalTokens] = useState(0);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const notesRef = useRef<NoteRef[]>(notes);
  notesRef.current = notes;

  const [active, setActive] = useState(() => getActiveProvider());

  useEffect(() => {
    function refresh() { setActive(getActiveProvider()); }
    window.addEventListener("storage", refresh);
    window.addEventListener("ai-provider-changed", refresh);
    return () => { window.removeEventListener("storage", refresh); window.removeEventListener("ai-provider-changed", refresh); };
  }, []);

  useEffect(() => {
    if (open) { setActive(getActiveProvider()); setTimeout(() => inputRef.current?.focus(), 100); }
  }, [open]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function addDisplay(msg: Omit<DisplayMessage, "id">) {
    const id = Math.random().toString(36).slice(2);
    setMessages(prev => [...prev, { ...msg, id }]);
  }

  function toggleDetails(id: string) {
    setExpandedDetails(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }

  const onCreateNoteRef = useRef(onCreateNote);
  const onUpdateNoteRef = useRef(onUpdateNote);
  const onDeleteNoteRef = useRef(onDeleteNote);
  const onOpenNoteRef = useRef(onOpenNote);
  const onToastRef = useRef(onToast);
  onCreateNoteRef.current = onCreateNote;
  onUpdateNoteRef.current = onUpdateNote;
  onDeleteNoteRef.current = onDeleteNote;
  onOpenNoteRef.current = onOpenNote;
  onToastRef.current = onToast;

  const toolCallbacks: ToolCallbacks = {
    listNotes: () => notesRef.current,
    createNote: async (title, content) => {
      addDisplay({ role: "action", content: `Creating: "${title}"`, actionType: "create_note" });
      const note = await onCreateNoteRef.current(title, content);
      onToastRef.current(`Created: "${title}"`, "success");
      return note;
    },
    updateNote: async (id, fields) => {
      const label = notesRef.current.find(n => n.id === id)?.title || id;
      addDisplay({ role: "action", content: `Updating: "${label}"`, actionType: "update_note" });
      return await onUpdateNoteRef.current(id, fields);
    },
    deleteNote: async (id) => {
      const label = notesRef.current.find(n => n.id === id)?.title || id;
      await onDeleteNoteRef.current(id);
      addDisplay({ role: "action", content: `Deleted: "${label}"`, actionType: "delete_note" });
      onToastRef.current(`Deleted: "${label}"`, "info");
    },
    openNote: (id) => {
      const label = notesRef.current.find(n => n.id === id)?.title || id;
      addDisplay({ role: "action", content: `Opened: "${label}"`, actionType: "open_note" });
      onOpenNoteRef.current(id);
    },
  };

  const toolCallbacksRef = useRef(toolCallbacks);
  toolCallbacksRef.current = toolCallbacks;

  const handleSend = useCallback(async () => {
    const text = input.trim();
    if (!text || loading) return;
    const currentActive = getActiveProvider();
    if (!currentActive) {
      onToastRef.current("Select an AI model in Settings → AI Settings first", "error");
      return;
    }
    setInput("");
    addDisplay({ role: "user", content: text });
    setLoading(true);
    const newHistory: ChatMessage[] = [...history, { role: "user", content: text }];
    try {
      const result = await callAI(text, history, toolCallbacksRef.current);
      addDisplay({
        role: "assistant",
        content: result.reply,
        toolCalls: result.toolCalls.length ? result.toolCalls : undefined,
        usage: result.usage,
        durationMs: result.durationMs,
      });
      setHistory([...newHistory, { role: "assistant", content: result.reply }]);
      setTotalTokens(prev => prev + (result.usage?.total ?? 0));
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Unknown error";
      addDisplay({ role: "assistant", content: msg, error: true });
    } finally {
      setLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [input, loading, history]);

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }
  }

  function clearChat() { setMessages([]); setHistory([]); setTotalTokens(0); setExpandedDetails(new Set()); }

  const providerLabel = active ? `${active.provider} / ${active.model}` : "No model selected";

  return (
    <>
      {/* ── Floating button ── */}
      <button
        onClick={() => setOpen(o => !o)}
        title="AI Assistant"
        style={{
          position: "fixed", bottom: 24, right: 24, zIndex: 500,
          width: 54, height: 54, borderRadius: "50%", border: "none",
          background: open ? "var(--bg-hover)" : "linear-gradient(135deg,#6366f1,#8b5cf6)",
          color: open ? "var(--text-muted)" : "white",
          display: "flex", alignItems: "center", justifyContent: "center",
          cursor: "pointer", transition: "all 0.3s cubic-bezier(0.16,1,0.3,1)",
          boxShadow: open ? "none" : "0 0 0 0 rgba(99,102,241,0.5)",
          animation: open ? "none" : "btnPulse 2.5s ease-in-out infinite",
        }}
      >
        {open ? <ChevronDown size={22} /> : <Bot size={22} />}
        {!open && messages.length > 0 && (
          <span style={{ position: "absolute", top: 3, right: 3, width: 11, height: 11, borderRadius: "50%", background: "#10b981", border: "2px solid var(--bg-app)", animation: "breatheDot 2s ease-in-out infinite" }} />
        )}
      </button>

      {/* ── Chat window ── */}
      {open && (
        <div style={{
          position: "fixed", bottom: 92, right: 24, zIndex: 499,
          width: 420, height: 640, display: "flex", flexDirection: "column",
          borderRadius: 22, overflow: "hidden",
          animation: "chatSlideIn 0.35s cubic-bezier(0.16,1,0.3,1)",
          boxShadow: "0 30px 90px rgba(0,0,0,0.6), 0 0 0 1px rgba(99,102,241,0.12)",
        }}>
          {/* Gradient border wrapper */}
          <div style={{ position: "absolute", inset: 0, borderRadius: 22, padding: 1, background: "linear-gradient(135deg, rgba(99,102,241,0.5) 0%, rgba(168,85,247,0.2) 50%, rgba(99,102,241,0.5) 100%)", animation: "borderPulse 4s ease-in-out infinite", zIndex: 0, pointerEvents: "none" }} />

          {/* Inner panel */}
          <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", height: "100%", background: "rgba(8,8,20,0.97)", backdropFilter: "blur(30px)", borderRadius: 21 }}>

            {/* Header */}
            <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "13px 16px 12px", borderBottom: "1px solid rgba(99,102,241,0.12)", flexShrink: 0, background: "rgba(99,102,241,0.04)" }}>
              <div style={{ width: 34, height: 34, borderRadius: 11, background: "linear-gradient(135deg,#6366f1,#8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, boxShadow: "0 0 20px rgba(99,102,241,0.4)", animation: "headerGlow 3s ease-in-out infinite" }}>
                <Bot size={17} color="white" />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 700, fontSize: 13, color: "#e2e8f0", letterSpacing: -0.2 }}>AI Assistant</div>
                <div style={{ fontSize: 10, color: "#475569", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{providerLabel}</div>
              </div>
              {totalTokens > 0 && (
                <div style={{ display: "flex", alignItems: "center", gap: 4, padding: "3px 8px", borderRadius: 7, background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.2)" }}>
                  <Hash size={9} color="#818cf8" />
                  <span style={{ fontSize: 10, color: "#818cf8", fontWeight: 700, fontFamily: "monospace" }}>{totalTokens.toLocaleString()}</span>
                </div>
              )}
              <button onClick={clearChat} title="Clear" style={{ background: "none", border: "none", cursor: "pointer", color: "#334155", padding: 6, borderRadius: 8, display: "flex", transition: "all 0.2s" }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "#94a3b8"; (e.currentTarget as HTMLElement).style.background = "rgba(99,102,241,0.1)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "#334155"; (e.currentTarget as HTMLElement).style.background = "none"; }}>
                <RotateCcw size={14} />
              </button>
              <button onClick={() => setOpen(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "#334155", padding: 6, borderRadius: 8, display: "flex", transition: "all 0.2s" }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "#94a3b8"; (e.currentTarget as HTMLElement).style.background = "rgba(239,68,68,0.08)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "#334155"; (e.currentTarget as HTMLElement).style.background = "none"; }}>
                <X size={16} />
              </button>
            </div>

            {/* Messages */}
            <div style={{ flex: 1, overflowY: "auto", padding: "14px 14px 8px", display: "flex", flexDirection: "column", gap: 12 }}
              className="chat-messages">
              {messages.length === 0 && (
                <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "20px 16px", animation: "fadeIn 0.4s ease" }}>
                  <div style={{ width: 52, height: 52, borderRadius: 18, background: "linear-gradient(135deg,#6366f1,#8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16, boxShadow: "0 0 40px rgba(99,102,241,0.4)", animation: "headerGlow 3s ease-in-out infinite" }}>
                    <Sparkles size={24} color="white" />
                  </div>
                  <p style={{ fontSize: 15, fontWeight: 700, color: "#e2e8f0", margin: "0 0 6px" }}>Full Control AI</p>
                  <p style={{ fontSize: 12.5, color: "#475569", lineHeight: 1.7, margin: "0 0 20px", maxWidth: 280 }}>
                    Create, edit, delete, search your notes. Speak in Bengali or English.
                  </p>
                  <div style={{ display: "flex", flexDirection: "column", gap: 7, width: "100%" }}>
                    {[
                      "Create a note about today's tasks",
                      "আমার সব starred note দেখাও",
                      "Delete the first created note",
                      "Summarize my most recent note",
                    ].map(s => (
                      <button key={s} onClick={() => { setInput(s); setTimeout(() => inputRef.current?.focus(), 0); }}
                        style={{ padding: "9px 13px", borderRadius: 11, border: "1px solid rgba(99,102,241,0.15)", background: "rgba(99,102,241,0.06)", cursor: "pointer", color: "#64748b", fontSize: 12, textAlign: "left", lineHeight: 1.4, transition: "all 0.2s", fontFamily: "inherit" }}
                        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(99,102,241,0.35)"; (e.currentTarget as HTMLElement).style.color = "#94a3b8"; (e.currentTarget as HTMLElement).style.background = "rgba(99,102,241,0.1)"; }}
                        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(99,102,241,0.15)"; (e.currentTarget as HTMLElement).style.color = "#64748b"; (e.currentTarget as HTMLElement).style.background = "rgba(99,102,241,0.06)"; }}>
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {messages.map((msg, idx) => (
                <div key={msg.id} style={{ animation: `msgIn 0.3s ${idx < 2 ? 0 : 0.05}s cubic-bezier(0.16,1,0.3,1) both` }}>
                  {msg.role === "action" && (
                    <div style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 11, color: "#475569", padding: "4px 0" }}>
                      <span style={{ width: 20, height: 20, borderRadius: 6, background: "rgba(99,102,241,0.12)", display: "flex", alignItems: "center", justifyContent: "center", color: "#6366f1", flexShrink: 0, border: "1px solid rgba(99,102,241,0.2)" }}>
                        <ActionIcon type={msg.actionType} />
                      </span>
                      <span style={{ fontStyle: "italic", color: "#4b5563" }}>{msg.content}</span>
                    </div>
                  )}

                  {msg.role === "user" && (
                    <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, alignItems: "flex-start" }}>
                      <div style={{ maxWidth: "80%", background: "linear-gradient(135deg,#4f46e5,#7c3aed)", color: "white", borderRadius: "18px 18px 5px 18px", padding: "10px 14px", fontSize: 13, lineHeight: 1.6, wordBreak: "break-word", boxShadow: "0 4px 20px rgba(79,70,229,0.3)" }}>
                        {msg.content}
                      </div>
                      <div style={{ width: 30, height: 30, borderRadius: 10, background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.2)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>
                        <User size={14} color="#6366f1" />
                      </div>
                    </div>
                  )}

                  {msg.role === "assistant" && (
                    <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                      <div style={{ width: 30, height: 30, borderRadius: 10, background: msg.error ? "rgba(239,68,68,0.1)" : "rgba(99,102,241,0.12)", border: `1px solid ${msg.error ? "rgba(239,68,68,0.2)" : "rgba(99,102,241,0.2)"}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>
                        <Bot size={14} color={msg.error ? "#f87171" : "#818cf8"} />
                      </div>
                      <div style={{ maxWidth: "82%", minWidth: 0 }}>
                        <div style={{ background: msg.error ? "rgba(239,68,68,0.06)" : "rgba(30,27,60,0.8)", border: `1px solid ${msg.error ? "rgba(239,68,68,0.2)" : "rgba(99,102,241,0.15)"}`, color: msg.error ? "#fca5a5" : "#e2e8f0", borderRadius: "5px 18px 18px 18px", padding: "10px 14px", fontSize: 13, lineHeight: 1.65, wordBreak: "break-word", whiteSpace: "pre-wrap" }}>
                          {msg.content}
                        </div>

                        {/* Details toggle */}
                        {!msg.error && (msg.toolCalls?.length || msg.usage) && (
                          <div style={{ marginTop: 5 }}>
                            <button
                              onClick={() => toggleDetails(msg.id)}
                              style={{ display: "flex", alignItems: "center", gap: 5, background: "none", border: "none", cursor: "pointer", color: "#374151", fontSize: 10.5, padding: "3px 6px", borderRadius: 6, transition: "all 0.2s", fontFamily: "inherit" }}
                              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "#818cf8"; (e.currentTarget as HTMLElement).style.background = "rgba(99,102,241,0.08)"; }}
                              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "#374151"; (e.currentTarget as HTMLElement).style.background = "none"; }}>
                              <ChevronRight size={11} style={{ transition: "transform 0.2s", transform: expandedDetails.has(msg.id) ? "rotate(90deg)" : "none" }} />
                              Details
                              {msg.usage && <span style={{ marginLeft: 2, color: "#4b5563" }}>· {msg.usage.total} tokens</span>}
                              {msg.durationMs && <span style={{ color: "#374151" }}>· {(msg.durationMs / 1000).toFixed(1)}s</span>}
                            </button>

                            {expandedDetails.has(msg.id) && (
                              <div style={{ marginTop: 6, padding: "10px 12px", borderRadius: 10, background: "rgba(15,12,35,0.9)", border: "1px solid rgba(99,102,241,0.15)", animation: "detailsOpen 0.2s ease" }}>
                                {msg.toolCalls?.length ? (
                                  <div style={{ marginBottom: msg.usage ? 8 : 0 }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 6 }}>
                                      <Wrench size={10} color="#6366f1" />
                                      <span style={{ fontSize: 10, fontWeight: 700, color: "#475569", textTransform: "uppercase", letterSpacing: 0.5 }}>Tools Used</span>
                                    </div>
                                    <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                                      {msg.toolCalls.map((tc, i) => <ToolLabel key={i} name={tc} />)}
                                    </div>
                                  </div>
                                ) : null}

                                {msg.usage && (
                                  <div>
                                    <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 6 }}>
                                      <Hash size={10} color="#6366f1" />
                                      <span style={{ fontSize: 10, fontWeight: 700, color: "#475569", textTransform: "uppercase", letterSpacing: 0.5 }}>Token Usage</span>
                                    </div>
                                    <div style={{ display: "flex", gap: 10, fontSize: 11, fontFamily: "monospace" }}>
                                      <span style={{ color: "#60a5fa" }}>↑ {msg.usage.prompt} prompt</span>
                                      <span style={{ color: "#a78bfa" }}>↓ {msg.usage.completion} completion</span>
                                      <span style={{ color: "#34d399", fontWeight: 700 }}>= {msg.usage.total} total</span>
                                    </div>
                                  </div>
                                )}

                                {msg.durationMs && (
                                  <div style={{ display: "flex", alignItems: "center", gap: 5, marginTop: 8 }}>
                                    <Clock size={10} color="#6366f1" />
                                    <span style={{ fontSize: 10, color: "#475569" }}>Response time: <strong style={{ color: "#94a3b8" }}>{(msg.durationMs / 1000).toFixed(2)}s</strong></span>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {loading && (
                <div style={{ display: "flex", gap: 8, alignItems: "flex-start", animation: "msgIn 0.3s ease" }}>
                  <div style={{ width: 30, height: 30, borderRadius: 10, background: "rgba(99,102,241,0.12)", border: "1px solid rgba(99,102,241,0.2)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Bot size={14} color="#818cf8" />
                  </div>
                  <div style={{ background: "rgba(30,27,60,0.8)", border: "1px solid rgba(99,102,241,0.15)", borderRadius: "5px 18px 18px 18px", padding: "14px 16px", display: "flex", alignItems: "center", gap: 5 }}>
                    <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#6366f1", animation: "dotBounce 1.2s 0s ease-in-out infinite", display: "block" }} />
                    <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#8b5cf6", animation: "dotBounce 1.2s 0.15s ease-in-out infinite", display: "block" }} />
                    <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#a855f7", animation: "dotBounce 1.2s 0.3s ease-in-out infinite", display: "block" }} />
                  </div>
                </div>
              )}

              <div ref={bottomRef} />
            </div>

            {/* Input area */}
            <div style={{ padding: "10px 12px 12px", borderTop: "1px solid rgba(99,102,241,0.1)", flexShrink: 0, background: "rgba(99,102,241,0.02)" }}>
              {!active && (
                <div style={{ marginBottom: 9, padding: "8px 12px", borderRadius: 9, background: "rgba(239,68,68,0.07)", border: "1px solid rgba(239,68,68,0.18)", fontSize: 11.5, color: "#fca5a5", textAlign: "center", display: "flex", alignItems: "center", justifyContent: "center", gap: 7 }}>
                  <Zap size={11} />
                  No AI model selected — open Settings (⌘,) to configure
                </div>
              )}
              <div style={{ display: "flex", gap: 8, alignItems: "flex-end" }}>
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask anything about your notes…"
                  rows={1}
                  style={{
                    flex: 1, resize: "none", background: "rgba(30,27,60,0.6)",
                    border: "1px solid rgba(99,102,241,0.2)", borderRadius: 13, padding: "10px 13px",
                    fontSize: 13, color: "#e2e8f0", outline: "none",
                    maxHeight: 110, overflowY: "auto", lineHeight: 1.5,
                    fontFamily: "inherit", transition: "all 0.2s",
                    boxShadow: "none",
                  }}
                  onFocus={e => { e.currentTarget.style.borderColor = "rgba(99,102,241,0.5)"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(99,102,241,0.12)"; }}
                  onBlur={e => { e.currentTarget.style.borderColor = "rgba(99,102,241,0.2)"; e.currentTarget.style.boxShadow = "none"; }}
                  onInput={e => {
                    const el = e.currentTarget;
                    el.style.height = "auto";
                    el.style.height = `${Math.min(el.scrollHeight, 110)}px`;
                  }}
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || loading}
                  style={{
                    width: 40, height: 40, borderRadius: 12, border: "none", flexShrink: 0,
                    background: !input.trim() || loading ? "rgba(99,102,241,0.1)" : "linear-gradient(135deg,#6366f1,#8b5cf6)",
                    color: !input.trim() || loading ? "#374151" : "white",
                    cursor: !input.trim() || loading ? "not-allowed" : "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    transition: "all 0.2s", boxShadow: !input.trim() || loading ? "none" : "0 4px 20px rgba(99,102,241,0.4)",
                  }}
                  onMouseEnter={e => { if (input.trim() && !loading) { (e.currentTarget as HTMLElement).style.transform = "scale(1.08)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 6px 28px rgba(99,102,241,0.6)"; } }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = "none"; (e.currentTarget as HTMLElement).style.boxShadow = input.trim() && !loading ? "0 4px 20px rgba(99,102,241,0.4)" : "none"; }}>
                  {loading ? <Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} /> : <Send size={15} />}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes btnPulse {
          0%, 100% { box-shadow: 0 6px 30px rgba(99,102,241,0.5), 0 0 0 0 rgba(99,102,241,0.35); }
          50% { box-shadow: 0 6px 30px rgba(99,102,241,0.5), 0 0 0 10px rgba(99,102,241,0); }
        }
        @keyframes breatheDot {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.4); opacity: 0.7; }
        }
        @keyframes chatSlideIn {
          from { opacity: 0; transform: translateY(20px) scale(0.96); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes borderPulse {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }
        @keyframes headerGlow {
          0%, 100% { box-shadow: 0 0 15px rgba(99,102,241,0.35); }
          50% { box-shadow: 0 0 30px rgba(168,85,247,0.55); }
        }
        @keyframes msgIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes dotBounce {
          0%, 80%, 100% { transform: translateY(0) scale(1); opacity: 0.5; }
          40% { transform: translateY(-8px) scale(1.2); opacity: 1; }
        }
        @keyframes detailsOpen {
          from { opacity: 0; transform: translateY(-4px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        .chat-messages::-webkit-scrollbar { width: 4px; }
        .chat-messages::-webkit-scrollbar-track { background: transparent; }
        .chat-messages::-webkit-scrollbar-thumb { background: rgba(99,102,241,0.2); border-radius: 4px; }
        .chat-messages::-webkit-scrollbar-thumb:hover { background: rgba(99,102,241,0.4); }
      `}</style>
    </>
  );
}
