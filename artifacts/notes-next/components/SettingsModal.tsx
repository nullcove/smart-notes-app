"use client";

import { useState, useCallback, useEffect } from "react";
import {
  X, Eye, EyeOff, CheckCircle, XCircle, Loader2,
  ExternalLink, Sparkles, Wifi, WifiOff, RefreshCw,
  Server, Brain, Globe, Cpu, AlertTriangle, Zap, ChevronRight,
} from "lucide-react";
import { getActiveProvider, setActiveProvider } from "@/lib/ai-engine";

interface Props { onClose: () => void; }

// ─── Provider registry ────────────────────────────────────────────────────────

const PROVIDERS = [
  {
    id: "openai", name: "OpenAI", emoji: "🤖", color: "#10b981",
    models: ["gpt-4o", "gpt-4o-mini", "gpt-4-turbo", "gpt-3.5-turbo"],
    testUrl: (_k: string) => "https://api.openai.com/v1/models",
    testHeaders: (k: string) => ({ Authorization: `Bearer ${k}` }),
    placeholder: "sk-...",
    docsUrl: "https://platform.openai.com/api-keys",
    desc: "GPT-4o, GPT-4 Turbo",
  },
  {
    id: "anthropic", name: "Anthropic", emoji: "✦", color: "#f59e0b",
    models: ["claude-3-5-sonnet-20241022", "claude-3-5-haiku-20241022", "claude-3-opus-20240229"],
    testUrl: (_k: string) => "https://api.anthropic.com/v1/models",
    testHeaders: (k: string) => ({ "x-api-key": k, "anthropic-version": "2023-06-01" }),
    placeholder: "sk-ant-...",
    docsUrl: "https://console.anthropic.com/settings/keys",
    desc: "Claude 3.5 Sonnet, Haiku",
  },
  {
    id: "gemini", name: "Gemini", emoji: "♊", color: "#6366f1",
    models: ["gemini-2.0-flash", "gemini-1.5-pro", "gemini-1.5-flash"],
    testUrl: (k: string) => `https://generativelanguage.googleapis.com/v1beta/models?key=${k}`,
    testHeaders: (_k: string) => ({} as Record<string, string>),
    placeholder: "AIza...",
    docsUrl: "https://aistudio.google.com/apikey",
    desc: "Gemini 2.0 Flash, 1.5 Pro",
  },
  {
    id: "groq", name: "Groq", emoji: "⚡", color: "#f97316",
    models: ["llama-3.3-70b-versatile", "llama-3.1-8b-instant", "mixtral-8x7b-32768"],
    testUrl: (_k: string) => "https://api.groq.com/openai/v1/models",
    testHeaders: (k: string) => ({ Authorization: `Bearer ${k}` }),
    placeholder: "gsk_...",
    docsUrl: "https://console.groq.com/keys",
    desc: "Llama 3.3 70B, Mixtral",
  },
  {
    id: "mistral", name: "Mistral", emoji: "🌊", color: "#8b5cf6",
    models: ["mistral-large-latest", "mistral-small-latest", "codestral-latest"],
    testUrl: (_k: string) => "https://api.mistral.ai/v1/models",
    testHeaders: (k: string) => ({ Authorization: `Bearer ${k}` }),
    placeholder: "...",
    docsUrl: "https://console.mistral.ai/api-keys",
    desc: "Mistral Large, Codestral",
  },
  {
    id: "openrouter", name: "OpenRouter", emoji: "🔀", color: "#ec4899",
    models: ["openai/gpt-4o", "anthropic/claude-3.5-sonnet", "meta-llama/llama-3.1-405b"],
    testUrl: (_k: string) => "https://openrouter.ai/api/v1/models",
    testHeaders: (k: string) => ({ Authorization: `Bearer ${k}` }),
    placeholder: "sk-or-...",
    docsUrl: "https://openrouter.ai/settings/keys",
    desc: "300+ models via one key",
  },
  {
    id: "xai", name: "xAI Grok", emoji: "𝕏", color: "#94a3b8",
    models: ["grok-2", "grok-2-vision-1212", "grok-beta"],
    testUrl: (_k: string) => "https://api.x.ai/v1/models",
    testHeaders: (k: string) => ({ Authorization: `Bearer ${k}` }),
    placeholder: "xai-...",
    docsUrl: "https://console.x.ai",
    desc: "Grok 2, Grok Beta",
  },
  {
    id: "cohere", name: "Cohere", emoji: "🌀", color: "#38bdf8",
    models: ["command-r-plus", "command-r", "command-light"],
    testUrl: (_k: string) => "https://api.cohere.com/v1/models",
    testHeaders: (k: string) => ({ Authorization: `Bearer ${k}` }),
    placeholder: "...",
    docsUrl: "https://dashboard.cohere.com/api-keys",
    desc: "Command R+, Command R",
  },
];

const LS = "smart-ins-note-ai-";
const GEMINI_COMPAT = "smart-ins-note-gemini-key";
const getKey = (id: string) => typeof window !== "undefined" ? localStorage.getItem(`${LS}${id}`) ?? "" : "";
const saveKey = (id: string, v: string) => v ? localStorage.setItem(`${LS}${id}`, v) : localStorage.removeItem(`${LS}${id}`);
const getOllamaUrl = () => typeof window !== "undefined" ? localStorage.getItem(`${LS}ollama-url`) ?? "" : "";
const saveOllamaUrl = (v: string) => v ? localStorage.setItem(`${LS}ollama-url`, v) : localStorage.removeItem(`${LS}ollama-url`);

type SelectedPanel = "openai" | "anthropic" | "gemini" | "groq" | "mistral" | "openrouter" | "xai" | "cohere" | "ollama";

interface OllamaModel { name: string; modified_at?: string; size?: number; details?: { parameter_size?: string; family?: string }; }

// ─── Cloud Provider Panel ─────────────────────────────────────────────────────
function CloudPanel({ p }: { p: typeof PROVIDERS[0] }) {
  const savedInit = p.id === "gemini"
    ? (getKey(p.id) || (typeof window !== "undefined" ? localStorage.getItem(GEMINI_COMPAT) ?? "" : ""))
    : getKey(p.id);

  const [key, setKey] = useState(savedInit);
  const [show, setShow] = useState(false);
  const [testing, setTesting] = useState(false);
  const [result, setResult] = useState<{ ok: boolean; msg: string; ms?: number } | null>(null);
  const [selectedModel, setSelectedModel] = useState(p.models[0]);
  const [active, setActive] = useState(() => getActiveProvider());

  const dirty = key !== savedInit;
  const isActive = active?.provider === p.id;

  function doSave() {
    saveKey(p.id, key.trim());
    if (p.id === "gemini") {
      if (key.trim()) localStorage.setItem(GEMINI_COMPAT, key.trim());
      else localStorage.removeItem(GEMINI_COMPAT);
    }
    setResult(null);
  }

  async function doTest() {
    if (!key.trim()) return;
    setTesting(true); setResult(null);
    const t0 = Date.now();
    try {
      const res = await fetch(p.testUrl(key.trim()), { headers: p.testHeaders(key.trim()) });
      const ms = Date.now() - t0;
      if (res.ok) setResult({ ok: true, msg: "Connected!", ms });
      else {
        const body = await res.json().catch(() => ({})) as { error?: { message?: string } };
        setResult({ ok: false, msg: body?.error?.message ?? `HTTP ${res.status}` });
      }
    } catch { setResult({ ok: false, msg: "Network error" }); }
    finally { setTesting(false); }
  }

  function handleSetActive() {
    doSave();
    const ap = { provider: p.id, model: selectedModel };
    setActiveProvider(ap);
    setActive(ap);
    window.dispatchEvent(new Event("ai-provider-changed"));
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", gap: 16 }}>
      {/* Provider header */}
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ width: 44, height: 44, borderRadius: 12, background: `${p.color}22`, border: `1.5px solid ${p.color}44`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>
          {p.emoji}
        </div>
        <div>
          <div style={{ fontSize: 16, fontWeight: 800, color: "var(--text-primary)" }}>{p.name}</div>
          <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{p.desc}</div>
        </div>
        {isActive && (
          <span style={{ marginLeft: "auto", fontSize: 11, fontWeight: 700, padding: "4px 10px", borderRadius: 20, background: "rgba(99,102,241,0.15)", color: "#818cf8", border: "1px solid rgba(99,102,241,0.3)", display: "flex", alignItems: "center", gap: 4 }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#818cf8" }} />
            Active
          </span>
        )}
      </div>

      {/* API Key */}
      <div>
        <label style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: 0.8, display: "block", marginBottom: 7 }}>API Key</label>
        <div style={{ display: "flex", gap: 8 }}>
          <div style={{ position: "relative", flex: 1 }}>
            <input
              type={show ? "text" : "password"}
              value={key}
              onChange={e => { setKey(e.target.value); setResult(null); }}
              placeholder={p.placeholder}
              style={{ width: "100%", background: "var(--bg-editor)", border: "1px solid var(--border)", borderRadius: 10, padding: "9px 38px 9px 12px", fontSize: 13, color: "var(--text-primary)", outline: "none", boxSizing: "border-box", fontFamily: "monospace" }}
            />
            <button onClick={() => setShow(s => !s)} style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", display: "flex", padding: 0 }}>
              {show ? <EyeOff size={14} /> : <Eye size={14} />}
            </button>
          </div>
          <button onClick={doSave} disabled={!key.trim() || !dirty}
            style={{ padding: "9px 14px", borderRadius: 10, border: "none", background: (!key.trim() || !dirty) ? "var(--bg-hover)" : "#6366f1", cursor: (!key.trim() || !dirty) ? "not-allowed" : "pointer", color: (!key.trim() || !dirty) ? "var(--text-muted)" : "white", fontSize: 12, fontWeight: 700, opacity: (!key.trim() || !dirty) ? 0.5 : 1, flexShrink: 0 }}>
            Save
          </button>
          <button onClick={doTest} disabled={testing || !key.trim()}
            style={{ padding: "9px 14px", borderRadius: 10, border: "1px solid var(--border)", background: "var(--bg-hover)", cursor: (testing || !key.trim()) ? "not-allowed" : "pointer", color: (testing || !key.trim()) ? "var(--text-muted)" : "var(--text-primary)", fontSize: 12, fontWeight: 600, display: "flex", alignItems: "center", gap: 5, flexShrink: 0, opacity: (testing || !key.trim()) ? 0.5 : 1 }}>
            {testing ? <Loader2 size={12} style={{ animation: "spin 1s linear infinite" }} /> : <Zap size={12} />}
            {testing ? "…" : "Test"}
          </button>
        </div>
        {result && (
          <div style={{ marginTop: 8, padding: "8px 12px", borderRadius: 9, display: "flex", alignItems: "center", gap: 8, background: result.ok ? "rgba(16,185,129,0.07)" : "rgba(239,68,68,0.07)", border: `1px solid ${result.ok ? "rgba(16,185,129,0.2)" : "rgba(239,68,68,0.2)"}` }}>
            {result.ok ? <CheckCircle size={13} color="#10b981" /> : <XCircle size={13} color="#f87171" />}
            <span style={{ fontSize: 12, color: result.ok ? "#10b981" : "#f87171", fontWeight: 600 }}>
              {result.ok ? `Connected · ${result.ms}ms` : result.msg}
            </span>
            {result.ok && (
              <a href={undefined} style={{ marginLeft: "auto", fontSize: 11, color: "var(--text-muted)", textDecoration: "none" }} />
            )}
          </div>
        )}
        <a href={p.docsUrl} target="_blank" rel="noopener noreferrer" style={{ fontSize: 11, color: "var(--text-muted)", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 3, marginTop: 8 }}>
          Get API key <ExternalLink size={10} />
        </a>
      </div>

      {/* Model selector */}
      <div>
        <label style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: 0.8, display: "block", marginBottom: 7 }}>Model</label>
        <select value={selectedModel} onChange={e => setSelectedModel(e.target.value)}
          style={{ width: "100%", background: "var(--bg-editor)", border: "1px solid var(--border)", borderRadius: 10, padding: "9px 12px", fontSize: 13, color: "var(--text-primary)", outline: "none" }}>
          {p.models.map(m => <option key={m} value={m}>{m}</option>)}
        </select>
      </div>

      {/* Set as active */}
      <button onClick={handleSetActive} disabled={!key.trim()}
        style={{ padding: "11px", borderRadius: 11, border: "none", background: !key.trim() ? "var(--bg-hover)" : "linear-gradient(135deg,#6366f1,#8b5cf6)", color: !key.trim() ? "var(--text-muted)" : "white", fontWeight: 700, fontSize: 13, cursor: !key.trim() ? "not-allowed" : "pointer", opacity: !key.trim() ? 0.5 : 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 7 }}>
        <Sparkles size={14} />
        {isActive ? "Active — Update Model" : "Use This Provider"}
      </button>
    </div>
  );
}

// ─── Ollama Panel ─────────────────────────────────────────────────────────────
function OllamaPanel() {
  const [url, setUrl] = useState(() => getOllamaUrl());
  const [savedUrl, setSavedUrl] = useState(() => getOllamaUrl());
  const [testing, setTesting] = useState(false);
  const [status, setStatus] = useState<"idle" | "ok" | "error">("idle");
  const [pingMs, setPingMs] = useState<number | null>(null);
  const [version, setVersion] = useState<string | null>(null);
  const [models, setModels] = useState<OllamaModel[]>([]);
  const [selectedModel, setSelectedModel] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const [active, setActive] = useState(() => getActiveProvider());
  const dirty = url !== savedUrl;
  const isActive = active?.provider === "ollama";

  const doTest = useCallback(async () => {
    const base = url.trim().replace(/\/+$/, "");
    if (!base) return;
    setTesting(true); setStatus("idle"); setModels([]); setPingMs(null); setVersion(null); setErrMsg("");
    try {
      const t0 = Date.now();
      const vRes = await fetch(`${base}/api/version`, { signal: AbortSignal.timeout(8000) });
      const ms = Date.now() - t0;
      if (!vRes.ok) throw new Error(`HTTP ${vRes.status}`);
      const vData = await vRes.json() as { version?: string };
      setPingMs(ms); setVersion(vData.version ?? "unknown");
      let detectedModels: OllamaModel[] = [];
      const mRes = await fetch(`${base}/api/tags`, { signal: AbortSignal.timeout(10000) });
      if (mRes.ok) { const md = await mRes.json() as { models?: OllamaModel[] }; detectedModels = md.models ?? []; }
      setModels(detectedModels);
      const firstModel = detectedModels[0]?.name ?? "llama3";
      setSelectedModel(firstModel);
      const ap = { provider: "ollama", model: firstModel };
      setActiveProvider(ap);
      setActive(ap);
      window.dispatchEvent(new Event("ai-provider-changed"));
      setStatus("ok"); saveOllamaUrl(base); setSavedUrl(base); setUrl(base);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Connection failed";
      setStatus("error"); setErrMsg(msg.includes("timeout") ? "Timed out — check URL / Cloudflare tunnel" : msg);
    } finally { setTesting(false); }
  }, [url]);

  function handleSetModel(name: string) {
    setSelectedModel(name);
    const ap = { provider: "ollama", model: name };
    setActiveProvider(ap);
    setActive(ap);
    window.dispatchEvent(new Event("ai-provider-changed"));
  }

  function fmtSize(b?: number) {
    if (!b) return "";
    const gb = b / 1073741824;
    return gb > 1 ? `${gb.toFixed(1)} GB` : `${(b / 1048576).toFixed(0)} MB`;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", gap: 16 }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ width: 44, height: 44, borderRadius: 12, background: "rgba(99,102,241,0.1)", border: "1.5px solid rgba(99,102,241,0.25)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>
          🖥
        </div>
        <div>
          <div style={{ fontSize: 16, fontWeight: 800, color: "var(--text-primary)" }}>Ollama</div>
          <div style={{ fontSize: 12, color: "var(--text-muted)" }}>Local or cloud GPU — no API key needed</div>
        </div>
        {isActive && (
          <span style={{ marginLeft: "auto", fontSize: 11, fontWeight: 700, padding: "4px 10px", borderRadius: 20, background: "rgba(99,102,241,0.15)", color: "#818cf8", border: "1px solid rgba(99,102,241,0.3)", display: "flex", alignItems: "center", gap: 4 }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#818cf8" }} />
            Active
          </span>
        )}
      </div>

      {/* URL input */}
      <div>
        <label style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: 0.8, display: "block", marginBottom: 7 }}>Base URL</label>
        <div style={{ display: "flex", gap: 8 }}>
          <input
            value={url}
            onChange={e => { setUrl(e.target.value); setStatus("idle"); }}
            placeholder="http://localhost:11434  or  https://my-tunnel.trycloudflare.com"
            style={{ flex: 1, background: "var(--bg-editor)", border: "1px solid var(--border)", borderRadius: 10, padding: "9px 12px", fontSize: 13, color: "var(--text-primary)", outline: "none", fontFamily: "monospace" }}
          />
          <button onClick={doTest} disabled={testing || !url.trim()}
            style={{ padding: "9px 14px", borderRadius: 10, border: "none", background: (testing || !url.trim()) ? "var(--bg-hover)" : "#6366f1", cursor: (testing || !url.trim()) ? "not-allowed" : "pointer", color: (testing || !url.trim()) ? "var(--text-muted)" : "white", fontSize: 12, fontWeight: 700, display: "flex", alignItems: "center", gap: 6, flexShrink: 0, opacity: (testing || !url.trim()) ? 0.5 : 1 }}>
            {testing ? <Loader2 size={13} style={{ animation: "spin 1s linear infinite" }} /> : <RefreshCw size={13} />}
            {testing ? "Testing…" : "Connect"}
          </button>
        </div>
        {dirty && savedUrl && (
          <button onClick={() => { saveOllamaUrl(url.trim()); setSavedUrl(url.trim()); }} style={{ marginTop: 6, fontSize: 11, color: "#818cf8", background: "none", border: "none", cursor: "pointer", padding: 0 }}>
            Save URL without testing
          </button>
        )}
        <p style={{ fontSize: 11, color: "var(--text-muted)", margin: "7px 0 0", lineHeight: 1.6 }}>
          Expose local Ollama with: <code style={{ fontSize: 10, background: "var(--bg-editor)", padding: "1px 5px", borderRadius: 4 }}>cloudflared tunnel --url http://localhost:11434</code>
        </p>
      </div>

      {/* Connection status */}
      {status !== "idle" && (
        <div style={{ padding: "10px 14px", borderRadius: 11, display: "flex", alignItems: "center", gap: 10, background: status === "ok" ? "rgba(16,185,129,0.07)" : "rgba(239,68,68,0.07)", border: `1px solid ${status === "ok" ? "rgba(16,185,129,0.2)" : "rgba(239,68,68,0.2)"}` }}>
          {status === "ok" ? <Wifi size={16} color="#10b981" /> : <WifiOff size={16} color="#f87171" />}
          <div style={{ flex: 1 }}>
            {status === "ok" ? (
              <>
                <div style={{ fontSize: 12, fontWeight: 700, color: "#10b981" }}>Connected!</div>
                <div style={{ fontSize: 11, color: "var(--text-muted)" }}>Ollama {version} · {pingMs}ms · {models.length} model{models.length !== 1 ? "s" : ""} found</div>
              </>
            ) : (
              <>
                <div style={{ fontSize: 12, fontWeight: 700, color: "#f87171" }}>Connection failed</div>
                <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{errMsg}</div>
              </>
            )}
          </div>
          {status === "ok" && <span style={{ fontSize: 11, fontWeight: 800, color: "#10b981", background: "rgba(16,185,129,0.12)", padding: "3px 10px", borderRadius: 20 }}>{pingMs}ms</span>}
        </div>
      )}

      {/* Models list */}
      {models.length > 0 && (
        <div style={{ flex: 1, minHeight: 0 }}>
          <label style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: 0.8, display: "block", marginBottom: 7 }}>
            Detected Models — click to activate
          </label>
          <div style={{ border: "1px solid var(--border)", borderRadius: 11, overflow: "hidden", overflowY: "auto", maxHeight: 220 }}>
            {models.map((m, i) => {
              const family = m.details?.family ?? m.name.split(":")[0];
              const tag = m.name.includes(":") ? m.name.split(":")[1] : "latest";
              const isSel = (selectedModel || active?.model) === m.name;
              return (
                <button key={m.name} onClick={() => handleSetModel(m.name)}
                  style={{ width: "100%", display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", background: isSel ? "rgba(99,102,241,0.08)" : "transparent", border: "none", borderTop: i > 0 ? "1px solid var(--border)" : "none", cursor: "pointer", textAlign: "left" }}>
                  <div style={{ width: 30, height: 30, borderRadius: 8, background: isSel ? "rgba(99,102,241,0.15)" : "var(--bg-hover)", border: `1px solid ${isSel ? "rgba(99,102,241,0.4)" : "var(--border)"}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Brain size={13} color={isSel ? "#818cf8" : "var(--text-muted)"} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 12, fontWeight: isSel ? 700 : 600, color: isSel ? "#818cf8" : "var(--text-primary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{m.name}</div>
                    <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{family}{m.details?.parameter_size ? ` · ${m.details.parameter_size}` : ""}{fmtSize(m.size) ? ` · ${fmtSize(m.size)}` : ""}</div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
                    <code style={{ fontSize: 10, background: "var(--bg-editor)", padding: "2px 5px", borderRadius: 4, color: "var(--text-muted)" }}>{tag}</code>
                    {isSel && <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#818cf8" }} />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Empty state */}
      {!savedUrl && status === "idle" && (
        <div style={{ textAlign: "center", padding: "30px 20px", border: "1px dashed var(--border)", borderRadius: 12 }}>
          <Server size={28} color="var(--text-faint)" style={{ margin: "0 auto 10px" }} />
          <p style={{ fontSize: 13, fontWeight: 600, color: "var(--text-muted)", margin: "0 0 4px" }}>No Ollama URL set</p>
          <p style={{ fontSize: 12, color: "var(--text-faint)", margin: 0, lineHeight: 1.6 }}>Enter a URL above and click Connect to detect models.</p>
        </div>
      )}
    </div>
  );
}

// ─── Sidebar item ─────────────────────────────────────────────────────────────
function SidebarItem({
  id, emoji, name, color, selected, hasKey, isActive, onClick,
}: {
  id: string; emoji: string; name: string; color: string;
  selected: boolean; hasKey: boolean; isActive: boolean; onClick: () => void;
}) {
  return (
    <button onClick={onClick}
      style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "9px 12px", borderRadius: 9, border: "none", background: selected ? "rgba(99,102,241,0.12)" : "transparent", cursor: "pointer", textAlign: "left", transition: "background 0.12s" }}>
      <div style={{ width: 30, height: 30, borderRadius: 8, background: selected ? `${color}22` : "var(--bg-hover)", border: `1px solid ${selected ? color + "55" : "var(--border)"}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, flexShrink: 0 }}>
        {emoji}
      </div>
      <span style={{ flex: 1, fontSize: 12, fontWeight: selected ? 700 : 500, color: selected ? "var(--text-primary)" : "var(--text-muted)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{name}</span>
      {isActive && <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#818cf8", flexShrink: 0 }} title="Active" />}
      {!isActive && hasKey && <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#10b981", flexShrink: 0 }} title="Key saved" />}
    </button>
  );
}

// ─── Main Modal ───────────────────────────────────────────────────────────────
export function SettingsModal({ onClose }: Props) {
  const [selected, setSelected] = useState<SelectedPanel>("ollama");
  const [active, setActive] = useState(() => getActiveProvider());

  useEffect(() => {
    function refresh() { setActive(getActiveProvider()); }
    window.addEventListener("ai-provider-changed", refresh);
    return () => window.removeEventListener("ai-provider-changed", refresh);
  }, []);

  // Check which providers have keys
  const hasKey = (id: string) => {
    if (id === "ollama") return !!getOllamaUrl();
    if (id === "gemini") return !!(getKey(id) || (typeof window !== "undefined" ? localStorage.getItem(GEMINI_COMPAT) : ""));
    return !!getKey(id);
  };

  const selectedProvider = PROVIDERS.find(p => p.id === selected);

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 300, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div onClick={onClose} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.65)", backdropFilter: "blur(6px)" }} />

      <div style={{ position: "relative", width: "100%", maxWidth: 700, maxHeight: "90vh", display: "flex", flexDirection: "column", background: "var(--bg-panel)", border: "1px solid var(--border)", borderRadius: 20, boxShadow: "0 30px 90px rgba(0,0,0,0.6)", margin: 16, overflow: "hidden" }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 20px 14px", borderBottom: "1px solid var(--border)", flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 34, height: 34, borderRadius: 10, background: "linear-gradient(135deg,#6366f1,#8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Sparkles size={15} color="white" />
            </div>
            <div>
              <h2 style={{ fontWeight: 800, fontSize: 16, color: "var(--text-primary)", margin: 0 }}>AI Settings</h2>
              {active ? (
                <p style={{ fontSize: 11, color: "var(--text-muted)", margin: 0 }}>
                  Active: <strong style={{ color: "#818cf8" }}>{active.provider === "ollama" ? "Ollama" : PROVIDERS.find(p => p.id === active.provider)?.name ?? active.provider}</strong> · {active.model}
                </p>
              ) : (
                <p style={{ fontSize: 11, color: "#f87171", margin: 0 }}>⚠ No active model — select a provider below</p>
              )}
            </div>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", padding: 6, borderRadius: 8, color: "var(--text-muted)", display: "flex" }}>
            <X size={18} />
          </button>
        </div>

        {/* Body: sidebar + right panel */}
        <div style={{ display: "flex", flex: 1, minHeight: 0, overflow: "hidden" }}>

          {/* Sidebar */}
          <div style={{ width: 180, borderRight: "1px solid var(--border)", padding: "12px 10px", display: "flex", flexDirection: "column", gap: 2, overflowY: "auto", flexShrink: 0 }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: "var(--text-faint)", textTransform: "uppercase", letterSpacing: 1, padding: "4px 8px 6px" }}>Cloud</div>
            {PROVIDERS.map(p => (
              <SidebarItem key={p.id} id={p.id} emoji={p.emoji} name={p.name} color={p.color}
                selected={selected === p.id} hasKey={hasKey(p.id)} isActive={active?.provider === p.id}
                onClick={() => setSelected(p.id as SelectedPanel)} />
            ))}
            <div style={{ height: 1, background: "var(--border)", margin: "8px 4px" }} />
            <div style={{ fontSize: 10, fontWeight: 700, color: "var(--text-faint)", textTransform: "uppercase", letterSpacing: 1, padding: "4px 8px 6px" }}>Local</div>
            <SidebarItem id="ollama" emoji="🖥" name="Ollama" color="#818cf8"
              selected={selected === "ollama"} hasKey={hasKey("ollama")} isActive={active?.provider === "ollama"}
              onClick={() => setSelected("ollama")} />

            {/* Privacy note */}
            <div style={{ marginTop: "auto", padding: "10px 8px 4px" }}>
              <div style={{ fontSize: 10, color: "var(--text-faint)", lineHeight: 1.6 }}>
                🔒 Keys stored in your browser only
              </div>
            </div>
          </div>

          {/* Right panel */}
          <div style={{ flex: 1, padding: "20px 22px", overflowY: "auto" }}>
            {selected === "ollama"
              ? <OllamaPanel />
              : selectedProvider
                ? <CloudPanel key={selectedProvider.id} p={selectedProvider} />
                : null
            }
          </div>
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
