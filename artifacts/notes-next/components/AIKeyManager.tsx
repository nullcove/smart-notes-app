"use client";
import { useState, useEffect, useCallback } from "react";
import { X, Plus, Trash2, Key, Settings, ChevronDown, Check, Zap, Brain, ToggleLeft, ToggleRight, Eye, EyeOff, Info, RefreshCw, Globe } from "lucide-react";
import {
  getAiKeys, addAiKey, deleteAiKey,
  getAiSettings, updateAiSettings,
  getAiMemory, clearAiMemory, clearAiConversation,
  PROVIDER_LABELS, PROVIDER_COLORS, DEFAULT_MODELS,
  type AiApiKey, type AiSettings, type AiMemory,
} from "@/lib/ai-api";

interface Props {
  open: boolean;
  onClose: () => void;
  onToast: (msg: string, type?: "success" | "error" | "info") => void;
}

const PROVIDERS = Object.keys(PROVIDER_LABELS);

function ProviderBadge({ provider }: { provider: string }) {
  const color = PROVIDER_COLORS[provider] ?? "#8b5cf6";
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 5,
      padding: "2px 8px", borderRadius: 6, fontSize: 11, fontWeight: 700,
      background: `${color}22`, border: `1px solid ${color}55`, color,
    }}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: color, boxShadow: `0 0 4px ${color}` }} />
      {PROVIDER_LABELS[provider] ?? provider}
    </span>
  );
}

export function AIKeyManager({ open, onClose, onToast }: Props) {
  const [tab, setTab] = useState<"keys" | "settings" | "memory">("keys");
  const [keys, setKeys] = useState<AiApiKey[]>([]);
  const [settings, setSettings] = useState<AiSettings>({ mode: "auto", conversationCount: 0 });
  const [memory, setMemory] = useState<AiMemory>({ facts: [] });
  const [loadingKeys, setLoadingKeys] = useState(false);

  const [newProvider, setNewProvider] = useState(PROVIDERS[0]);
  const [newModel, setNewModel] = useState("");
  const [newKey, setNewKey] = useState("");
  const [newLabel, setNewLabel] = useState("");
  const [showNewKey, setShowNewKey] = useState(false);
  const [adding, setAdding] = useState(false);
  const [showProviderDrop, setShowProviderDrop] = useState(false);
  const [showModelDrop, setShowModelDrop] = useState(false);

  const loadData = useCallback(async () => {
    if (!open) return;
    setLoadingKeys(true);
    try {
      const [k, s, m] = await Promise.all([getAiKeys(), getAiSettings(), getAiMemory()]);
      setKeys(k); setSettings(s); setMemory(m);
    } finally { setLoadingKeys(false); }
  }, [open]);

  useEffect(() => { loadData(); }, [loadData]);

  async function handleAddKey() {
    if (!newKey.trim()) { onToast("Enter an API key", "error"); return; }
    setAdding(true);
    try {
      const added = await addAiKey({ provider: newProvider, model: newModel || undefined, key: newKey.trim(), label: newLabel.trim() || undefined });
      setKeys(prev => [...prev, added]);
      setNewKey(""); setNewModel(""); setNewLabel("");
      onToast(`${PROVIDER_LABELS[newProvider] ?? newProvider} key added!`, "success");
    } catch (e: unknown) {
      onToast(e instanceof Error ? e.message : "Failed to add key", "error");
    } finally { setAdding(false); }
  }

  async function handleDeleteKey(id: string, provider: string) {
    try {
      await deleteAiKey(id);
      setKeys(prev => prev.filter(k => k.id !== id));
      onToast(`${PROVIDER_LABELS[provider] ?? provider} key removed`, "info");
    } catch { onToast("Failed to remove key", "error"); }
  }

  async function toggleMode() {
    const newMode = settings.mode === "auto" ? "fixed" : "auto";
    const updated = await updateAiSettings({ mode: newMode });
    setSettings(updated);
  }

  async function setFixedModel(provider: string, model: string) {
    const updated = await updateAiSettings({ fixedProvider: provider, fixedModel: model });
    setSettings(updated);
  }

  async function handleClearMemory() {
    await clearAiMemory();
    setMemory({ facts: [] });
    onToast("AI memory cleared", "info");
  }

  async function handleClearConversation() {
    await clearAiConversation();
    onToast("Conversation history cleared", "info");
  }

  if (!open) return null;

  const st: React.CSSProperties = { boxSizing: "border-box" };

  return (
    <>
      <style>{`
        @keyframes kmSlideIn { from { opacity: 0; transform: scale(0.96) translateY(8px); } to { opacity: 1; transform: scale(1) translateY(0); } }
        .km-tab { transition: background 0.15s, color 0.15s; }
        .km-tab:hover { background: rgba(139,92,246,0.1) !important; }
        .km-key-row:hover { background: rgba(255,255,255,0.04) !important; }
        .km-del-btn:hover { background: rgba(239,68,68,0.18) !important; color: #f87171 !important; }
        .km-add-btn:hover { background: linear-gradient(135deg,#5b5cf6,#8b5cf6) !important; }
        .km-drop { position: absolute; z-index: 100; min-width: 160px; background: rgba(18,10,40,0.98); border: 1px solid rgba(139,92,246,0.3); border-radius: 10px; box-shadow: 0 8px 32px rgba(0,0,0,0.6); overflow: hidden; max-height: 220px; overflow-y: auto; }
        .km-drop-item { padding: 8px 14px; cursor: pointer; font-size: 12px; color: rgba(255,255,255,0.8); transition: background 0.1s; display: flex; align-items: center; gap: 8px; }
        .km-drop-item:hover { background: rgba(139,92,246,0.18); }
        .km-input { background: rgba(255,255,255,0.06); border: 1px solid rgba(139,92,246,0.25); border-radius: 10px; color: #fff; font-size: 13px; padding: 9px 12px; width: 100%; outline: none; box-sizing: border-box; transition: border 0.2s; }
        .km-input:focus { border-color: rgba(139,92,246,0.6); }
        .km-input::placeholder { color: rgba(255,255,255,0.28); }
        .km-fact { padding: 5px 10px; border-radius: 8px; background: rgba(99,102,241,0.1); border: 1px solid rgba(99,102,241,0.2); color: rgba(255,255,255,0.75); font-size: 12px; line-height: 1.4; }
      `}</style>

      <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", backdropFilter: "blur(6px)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div onClick={e => e.stopPropagation()} style={{
          ...st,
          width: 520, maxHeight: "85vh", background: "linear-gradient(160deg,rgba(12,6,28,0.99),rgba(18,10,40,0.99))",
          border: "1px solid rgba(139,92,246,0.3)", borderRadius: 20,
          boxShadow: "0 24px 80px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.06)",
          animation: "kmSlideIn 0.25s ease", display: "flex", flexDirection: "column",
        }}>
          {/* Header */}
          <div style={{ padding: "18px 20px 0", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: "linear-gradient(135deg,rgba(99,102,241,0.3),rgba(168,85,247,0.3))", border: "1px solid rgba(139,92,246,0.4)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Brain size={18} color="#c4b5fd" />
              </div>
              <div>
                <div style={{ color: "#fff", fontWeight: 700, fontSize: 15 }}>AI Settings</div>
                <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 11 }}>{keys.length} key{keys.length !== 1 ? "s" : ""} · {settings.mode} mode</div>
              </div>
            </div>
            <button onClick={onClose} style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: "6px 8px", cursor: "pointer", color: "rgba(255,255,255,0.5)" }}>
              <X size={15} />
            </button>
          </div>

          {/* Tabs */}
          <div style={{ display: "flex", gap: 4, padding: "14px 20px 0", flexShrink: 0 }}>
            {(["keys", "settings", "memory"] as const).map(t => (
              <button key={t} onClick={() => setTab(t)} className="km-tab" style={{
                flex: 1, padding: "7px 0", borderRadius: 8, border: "none", cursor: "pointer", fontSize: 12, fontWeight: 600,
                background: tab === t ? "rgba(139,92,246,0.2)" : "transparent",
                color: tab === t ? "#c4b5fd" : "rgba(255,255,255,0.4)",
                borderBottom: tab === t ? "2px solid #8b5cf6" : "2px solid transparent",
              }}>
                {t === "keys" ? <><Key size={12} style={{ verticalAlign: "middle", marginRight: 4 }} />API Keys</> : t === "settings" ? <><Settings size={12} style={{ verticalAlign: "middle", marginRight: 4 }} />Model</>  : <><Brain size={12} style={{ verticalAlign: "middle", marginRight: 4 }} />Memory</>}
              </button>
            ))}
          </div>

          <div style={{ flex: 1, overflowY: "auto", padding: 20 }}>

            {/* ── KEYS TAB ── */}
            {tab === "keys" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <div style={{ background: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.2)", borderRadius: 12, padding: 12, display: "flex", gap: 8 }}>
                  <Globe size={14} color="#818cf8" style={{ flexShrink: 0, marginTop: 1 }} />
                  <p style={{ margin: 0, color: "rgba(255,255,255,0.55)", fontSize: 12, lineHeight: 1.5 }}>
                    Add API keys from multiple providers. In auto mode, the AI picks the best model for each task and rotates keys to avoid rate limits.
                  </p>
                </div>

                {/* Add key form */}
                <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(139,92,246,0.2)", borderRadius: 14, padding: 14 }}>
                  <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 11, fontWeight: 700, marginBottom: 10, textTransform: "uppercase", letterSpacing: 1 }}>Add New Key</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    <div style={{ display: "flex", gap: 8 }}>
                      <div style={{ position: "relative", flex: 1 }}>
                        <button onClick={() => { setShowProviderDrop(p => !p); setShowModelDrop(false); }} style={{ width: "100%", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(139,92,246,0.25)", borderRadius: 10, color: "#fff", fontSize: 12, padding: "9px 12px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 6 }}>
                          <ProviderBadge provider={newProvider} />
                          <ChevronDown size={12} color="rgba(255,255,255,0.4)" />
                        </button>
                        {showProviderDrop && (
                          <div className="km-drop" style={{ top: "calc(100% + 4px)", left: 0, right: 0 }}>
                            {PROVIDERS.map(p => (
                              <div key={p} className="km-drop-item" onClick={() => { setNewProvider(p); setNewModel(""); setShowProviderDrop(false); }}>
                                <span style={{ width: 8, height: 8, borderRadius: "50%", background: PROVIDER_COLORS[p] ?? "#8b5cf6", flexShrink: 0 }} />
                                {PROVIDER_LABELS[p] ?? p}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                      <div style={{ position: "relative", flex: 1 }}>
                        <button onClick={() => { setShowModelDrop(p => !p); setShowProviderDrop(false); }} style={{ width: "100%", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(139,92,246,0.25)", borderRadius: 10, color: newModel ? "#fff" : "rgba(255,255,255,0.35)", fontSize: 12, padding: "9px 12px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                          <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{newModel || "Auto (recommended)"}</span>
                          <ChevronDown size={12} color="rgba(255,255,255,0.4)" style={{ flexShrink: 0 }} />
                        </button>
                        {showModelDrop && (
                          <div className="km-drop" style={{ top: "calc(100% + 4px)", left: 0, right: 0 }}>
                            <div className="km-drop-item" onClick={() => { setNewModel(""); setShowModelDrop(false); }}><Zap size={10} color="#fbbf24" /> Auto-select</div>
                            {(DEFAULT_MODELS[newProvider] ?? []).map(m => (
                              <div key={m} className="km-drop-item" onClick={() => { setNewModel(m); setShowModelDrop(false); }}>{m}</div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    <input className="km-input" placeholder="Label (optional, e.g. 'Gemini Free 1')" value={newLabel} onChange={e => setNewLabel(e.target.value)} />

                    <div style={{ position: "relative" }}>
                      <input className="km-input" type={showNewKey ? "text" : "password"} placeholder="Paste your API key here" value={newKey} onChange={e => setNewKey(e.target.value)} style={{ paddingRight: 40 }} />
                      <button onClick={() => setShowNewKey(p => !p)} style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.4)" }}>
                        {showNewKey ? <EyeOff size={14} /> : <Eye size={14} />}
                      </button>
                    </div>

                    <button className="km-add-btn" onClick={handleAddKey} disabled={adding || !newKey.trim()} style={{
                      background: adding || !newKey.trim() ? "rgba(99,102,241,0.15)" : "linear-gradient(135deg,#4f46e5,#7c3aed)",
                      border: "none", borderRadius: 10, padding: "10px 0", color: adding || !newKey.trim() ? "rgba(255,255,255,0.3)" : "#fff",
                      fontWeight: 700, fontSize: 13, cursor: adding || !newKey.trim() ? "not-allowed" : "pointer",
                      display: "flex", alignItems: "center", justifyContent: "center", gap: 6, transition: "all 0.2s",
                    }}>
                      {adding ? <><RefreshCw size={13} style={{ animation: "ro01 1s linear infinite" }} /> Adding…</> : <><Plus size={13} /> Add Key</>}
                    </button>
                  </div>
                </div>

                {/* Keys list */}
                {loadingKeys ? (
                  <div style={{ textAlign: "center", color: "rgba(255,255,255,0.3)", padding: 20, fontSize: 12 }}>Loading…</div>
                ) : keys.length === 0 ? (
                  <div style={{ textAlign: "center", padding: "24px 0" }}>
                    <Key size={32} color="rgba(255,255,255,0.12)" />
                    <p style={{ color: "rgba(255,255,255,0.3)", fontSize: 13, marginTop: 8 }}>No keys added yet</p>
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, marginBottom: 2 }}>Your Keys ({keys.length})</div>
                    {keys.map(k => (
                      <div key={k.id} className="km-key-row" style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 10, border: "1px solid rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.02)", transition: "background 0.1s" }}>
                        <ProviderBadge provider={k.provider} />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          {k.label && <div style={{ color: "rgba(255,255,255,0.8)", fontSize: 12, fontWeight: 600 }}>{k.label}</div>}
                          <div style={{ color: "rgba(255,255,255,0.35)", fontSize: 11, fontFamily: "monospace" }}>{k.keyMasked}</div>
                          {k.model && <div style={{ color: "rgba(139,92,246,0.7)", fontSize: 10, marginTop: 1 }}>{k.model}</div>}
                        </div>
                        <button className="km-del-btn" onClick={() => handleDeleteKey(k.id, k.provider)} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8, padding: "5px 7px", cursor: "pointer", color: "rgba(255,255,255,0.3)", transition: "all 0.15s" }}>
                          <Trash2 size={13} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ── SETTINGS TAB ── */}
            {tab === "settings" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(139,92,246,0.2)", borderRadius: 14, padding: 16 }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                    <div>
                      <div style={{ color: "#fff", fontWeight: 700, fontSize: 14 }}>Auto Mode</div>
                      <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 12, marginTop: 2 }}>AI picks the best model for each message automatically</div>
                    </div>
                    <button onClick={toggleMode} style={{ background: "none", border: "none", cursor: "pointer" }}>
                      {settings.mode === "auto"
                        ? <ToggleRight size={32} color="#8b5cf6" />
                        : <ToggleLeft size={32} color="rgba(255,255,255,0.3)" />}
                    </button>
                  </div>

                  {settings.mode === "auto" && (
                    <div style={{ background: "rgba(99,102,241,0.1)", borderRadius: 8, padding: "8px 10px", display: "flex", gap: 6, alignItems: "flex-start" }}>
                      <Zap size={13} color="#818cf8" style={{ flexShrink: 0, marginTop: 1 }} />
                      <p style={{ margin: 0, color: "rgba(255,255,255,0.5)", fontSize: 11, lineHeight: 1.5 }}>
                        Simple messages → fast models (Groq llama, Gemini flash)<br />
                        Complex requests → powerful models (Gemini Pro, GPT-4o)<br />
                        Rate limited → automatically tries next available key
                      </p>
                    </div>
                  )}
                </div>

                {settings.mode === "fixed" && (
                  <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(139,92,246,0.2)", borderRadius: 14, padding: 16 }}>
                    <div style={{ color: "#fff", fontWeight: 700, fontSize: 14, marginBottom: 12 }}>Fixed Model</div>
                    {keys.length === 0 ? (
                      <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 12 }}>Add API keys first to choose a fixed model.</p>
                    ) : (
                      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                        {keys.map(k => (
                          (DEFAULT_MODELS[k.provider] ?? (k.model ? [k.model] : [])).map(m => {
                            const isActive = settings.fixedProvider === k.provider && settings.fixedModel === m;
                            return (
                              <button key={`${k.id}-${m}`} onClick={() => setFixedModel(k.provider, m)} style={{
                                display: "flex", alignItems: "center", gap: 8, padding: "9px 12px", borderRadius: 10, border: isActive ? "1px solid rgba(139,92,246,0.6)" : "1px solid rgba(255,255,255,0.06)",
                                background: isActive ? "rgba(139,92,246,0.15)" : "rgba(255,255,255,0.02)", cursor: "pointer",
                              }}>
                                <ProviderBadge provider={k.provider} />
                                <span style={{ flex: 1, color: isActive ? "#c4b5fd" : "rgba(255,255,255,0.6)", fontSize: 12, textAlign: "left" }}>{m}</span>
                                {isActive && <Check size={13} color="#8b5cf6" />}
                              </button>
                            );
                          })
                        ))}
                      </div>
                    )}
                  </div>
                )}

                <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 14, padding: 14 }}>
                  <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 12 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                      <span>Total conversations</span>
                      <span style={{ color: "#c4b5fd", fontWeight: 700 }}>{settings.conversationCount}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span>API keys loaded</span>
                      <span style={{ color: "#34d399", fontWeight: 700 }}>{keys.length}</span>
                    </div>
                  </div>
                </div>

                <button onClick={handleClearConversation} style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.25)", borderRadius: 10, padding: "10px 14px", color: "#f87171", fontSize: 13, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
                  <RefreshCw size={13} /> Clear Conversation History
                </button>
              </div>
            )}

            {/* ── MEMORY TAB ── */}
            {tab === "memory" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <div style={{ background: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.2)", borderRadius: 12, padding: 12, display: "flex", gap: 8 }}>
                  <Info size={14} color="#818cf8" style={{ flexShrink: 0, marginTop: 1 }} />
                  <p style={{ margin: 0, color: "rgba(255,255,255,0.55)", fontSize: 12, lineHeight: 1.5 }}>
                    The AI learns about you over time — your name, preferences, interests, and more. This memory is private to your account.
                  </p>
                </div>

                {memory.userName && (
                  <div style={{ display: "flex", gap: 8, alignItems: "center", padding: "8px 12px", background: "rgba(139,92,246,0.1)", borderRadius: 10, border: "1px solid rgba(139,92,246,0.2)" }}>
                    <Brain size={14} color="#c4b5fd" />
                    <span style={{ color: "rgba(255,255,255,0.7)", fontSize: 12 }}>Known as: <strong style={{ color: "#c4b5fd" }}>{memory.userName}</strong></span>
                  </div>
                )}

                {memory.facts.length === 0 ? (
                  <div style={{ textAlign: "center", padding: "24px 0" }}>
                    <Brain size={32} color="rgba(255,255,255,0.1)" />
                    <p style={{ color: "rgba(255,255,255,0.3)", fontSize: 13, marginTop: 8 }}>No memories yet. Chat with the AI to build your personal profile.</p>
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1 }}>Known Facts ({memory.facts.length})</div>
                    {memory.facts.map((f, i) => <div key={i} className="km-fact">• {f}</div>)}
                    {memory.lastUpdated && (
                      <div style={{ color: "rgba(255,255,255,0.25)", fontSize: 11, marginTop: 4 }}>Last updated: {new Date(memory.lastUpdated).toLocaleString()}</div>
                    )}
                  </div>
                )}

                <button onClick={handleClearMemory} style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.25)", borderRadius: 10, padding: "10px 14px", color: "#f87171", fontSize: 13, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
                  <Trash2 size={13} /> Clear All Memory
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
