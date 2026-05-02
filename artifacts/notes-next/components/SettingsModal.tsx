"use client";

import { useState, useCallback } from "react";
import {
  X, Eye, EyeOff, CheckCircle, XCircle, Loader2,
  ExternalLink, Sparkles, Wifi, WifiOff, RefreshCw,
  Server, Brain, Globe, Cpu, AlertTriangle, Zap, ChevronDown,
} from "lucide-react";
import { getActiveProvider, setActiveProvider } from "@/lib/ai-engine";

interface Props { onClose: () => void; }

// ─── All providers with their models ─────────────────────────────────────────

const ALL_PROVIDERS_MODELS: Record<string, string[]> = {
  openai: ["gpt-4o", "gpt-4o-mini", "gpt-4-turbo", "gpt-3.5-turbo"],
  anthropic: ["claude-3-5-sonnet-20241022", "claude-3-5-haiku-20241022", "claude-3-opus-20240229"],
  gemini: ["gemini-2.0-flash", "gemini-1.5-pro", "gemini-1.5-flash"],
  groq: ["llama-3.3-70b-versatile", "llama-3.1-8b-instant", "mixtral-8x7b-32768"],
  mistral: ["mistral-large-latest", "mistral-small-latest", "codestral-latest"],
  openrouter: ["openai/gpt-4o", "anthropic/claude-3.5-sonnet", "meta-llama/llama-3.1-405b"],
  xai: ["grok-2", "grok-2-vision-1212", "grok-beta"],
  cohere: ["command-r-plus", "command-r", "command-light"],
  ollama: [],
};

const PROVIDER_NAMES: Record<string, string> = {
  openai: "OpenAI", anthropic: "Anthropic", gemini: "Google Gemini",
  groq: "Groq", mistral: "Mistral AI", openrouter: "OpenRouter",
  xai: "xAI (Grok)", cohere: "Cohere", ollama: "Ollama",
};

const PROVIDER_EMOJIS: Record<string, string> = {
  openai: "🤖", anthropic: "✦", gemini: "♊", groq: "⚡",
  mistral: "🌊", openrouter: "🔀", xai: "𝕏", cohere: "🌀", ollama: "🖥",
};

// ─── Active Provider Selector ─────────────────────────────────────────────────

function ActiveProviderSection() {
  const [active, setActive] = useState(() => getActiveProvider());
  const [expanded, setExpanded] = useState(!getActiveProvider());
  const [selectedProvider, setSelectedProvider] = useState(active?.provider ?? "gemini");
  const [selectedModel, setSelectedModel] = useState(active?.model ?? "");
  const [customModel, setCustomModel] = useState("");

  const providerModels = selectedProvider === "ollama"
    ? ((): string[] => {
        try { return JSON.parse(localStorage.getItem("smart-ins-note-ai-ollama-models") ?? "[]") as string[]; } catch { return []; }
      })()
    : ALL_PROVIDERS_MODELS[selectedProvider] ?? [];

  function handleSave() {
    const model = selectedProvider === "ollama"
      ? (customModel || selectedModel || providerModels[0] || "llama3")
      : (selectedModel || providerModels[0] || "");
    const p = { provider: selectedProvider, model };
    setActiveProvider(p);
    setActive(p);
    setExpanded(false);
    window.dispatchEvent(new Event("ai-provider-changed"));
  }

  if (!expanded && active) {
    return (
      <div style={{ margin: "14px 24px 0", padding: "12px 16px", borderRadius: 12, background: "linear-gradient(135deg, rgba(99,102,241,0.1), rgba(139,92,246,0.08))", border: "1px solid rgba(99,102,241,0.25)", display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ width: 34, height: 34, borderRadius: 9, background: "linear-gradient(135deg,#6366f1,#8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}>
          {PROVIDER_EMOJIS[active.provider] ?? "🤖"}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 11, color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase", letterSpacing: 1 }}>Active AI Model</div>
          <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text-primary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {PROVIDER_NAMES[active.provider]} — {active.model}
          </div>
        </div>
        <button onClick={() => setExpanded(true)} style={{ padding: "6px 12px", borderRadius: 8, border: "1px solid rgba(99,102,241,0.3)", background: "rgba(99,102,241,0.1)", color: "#818cf8", fontSize: 12, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}>
          Change <ChevronDown size={12} />
        </button>
      </div>
    );
  }

  return (
    <div style={{ margin: "14px 24px 0", padding: "16px", borderRadius: 12, background: "rgba(99,102,241,0.05)", border: "1px solid rgba(99,102,241,0.2)" }}>
      <div style={{ fontSize: 12, fontWeight: 700, color: "var(--text-primary)", marginBottom: 12, display: "flex", alignItems: "center", gap: 6 }}>
        <Sparkles size={14} color="#818cf8" /> Choose Active AI Model
      </div>

      {/* Provider grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 6, marginBottom: 12 }}>
        {Object.keys(ALL_PROVIDERS_MODELS).map(pid => (
          <button key={pid} onClick={() => { setSelectedProvider(pid); setSelectedModel(""); }}
            style={{ padding: "8px 6px", borderRadius: 9, border: `1px solid ${selectedProvider === pid ? "rgba(99,102,241,0.5)" : "var(--border)"}`, background: selectedProvider === pid ? "rgba(99,102,241,0.12)" : "var(--bg-hover)", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 3, transition: "all 0.12s" }}>
            <span style={{ fontSize: 18 }}>{PROVIDER_EMOJIS[pid]}</span>
            <span style={{ fontSize: 10, fontWeight: 600, color: selectedProvider === pid ? "#818cf8" : "var(--text-muted)" }}>{PROVIDER_NAMES[pid]}</span>
          </button>
        ))}
      </div>

      {/* Model selector */}
      {selectedProvider !== "ollama" && providerModels.length > 0 && (
        <div style={{ marginBottom: 10 }}>
          <label style={{ fontSize: 11, fontWeight: 600, color: "var(--text-muted)", display: "block", marginBottom: 5 }}>Model</label>
          <select value={selectedModel || providerModels[0]} onChange={e => setSelectedModel(e.target.value)}
            style={{ width: "100%", background: "var(--bg-editor)", border: "1px solid var(--border)", borderRadius: 9, padding: "8px 10px", fontSize: 13, color: "var(--text-primary)", outline: "none" }}>
            {providerModels.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
        </div>
      )}

      {selectedProvider === "ollama" && (
        <div style={{ marginBottom: 10 }}>
          <label style={{ fontSize: 11, fontWeight: 600, color: "var(--text-muted)", display: "block", marginBottom: 5 }}>Model name (e.g. llama3, mistral)</label>
          <input value={customModel} onChange={e => setCustomModel(e.target.value)}
            placeholder="llama3"
            style={{ width: "100%", background: "var(--bg-editor)", border: "1px solid var(--border)", borderRadius: 9, padding: "8px 10px", fontSize: 13, color: "var(--text-primary)", outline: "none", boxSizing: "border-box", fontFamily: "monospace" }} />
          {providerModels.length > 0 && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginTop: 6 }}>
              {providerModels.map(m => (
                <button key={m} onClick={() => setCustomModel(m)} style={{ padding: "3px 8px", borderRadius: 6, border: "1px solid var(--border)", background: "var(--bg-hover)", cursor: "pointer", fontSize: 11, color: "var(--text-muted)", fontFamily: "monospace" }}>{m}</button>
              ))}
            </div>
          )}
        </div>
      )}

      <div style={{ display: "flex", gap: 8 }}>
        <button onClick={handleSave}
          style={{ flex: 1, padding: "9px", borderRadius: 9, border: "none", background: "linear-gradient(135deg,#6366f1,#8b5cf6)", color: "white", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>
          Set as Active
        </button>
        {active && <button onClick={() => setExpanded(false)}
          style={{ padding: "9px 14px", borderRadius: 9, border: "1px solid var(--border)", background: "var(--bg-hover)", color: "var(--text-muted)", fontSize: 13, cursor: "pointer" }}>Cancel</button>}
      </div>
    </div>
  );
}

// ─── Provider definitions ────────────────────────────────────────────────────

const PROVIDERS = [
  {
    id: "openai", name: "OpenAI", emoji: "🤖", color: "#10b981",
    models: ["gpt-4o", "gpt-4o-mini", "gpt-4-turbo", "gpt-3.5-turbo"],
    testUrl: (_k: string) => "https://api.openai.com/v1/models",
    testHeaders: (k: string) => ({ Authorization: `Bearer ${k}` }),
    placeholder: "sk-...",
    docsUrl: "https://platform.openai.com/api-keys",
  },
  {
    id: "anthropic", name: "Anthropic", emoji: "✦", color: "#f59e0b",
    models: ["claude-3-5-sonnet", "claude-3-5-haiku", "claude-3-opus"],
    testUrl: (_k: string) => "https://api.anthropic.com/v1/models",
    testHeaders: (k: string) => ({ "x-api-key": k, "anthropic-version": "2023-06-01" }),
    placeholder: "sk-ant-...",
    docsUrl: "https://console.anthropic.com/settings/keys",
  },
  {
    id: "gemini", name: "Google Gemini", emoji: "♊", color: "#6366f1",
    models: ["gemini-2.0-flash", "gemini-1.5-pro", "gemini-1.5-flash"],
    testUrl: (k: string) => `https://generativelanguage.googleapis.com/v1beta/models?key=${k}`,
    testHeaders: (_k: string) => ({} as Record<string,string>),
    placeholder: "AIza...",
    docsUrl: "https://aistudio.google.com/apikey",
  },
  {
    id: "groq", name: "Groq", emoji: "⚡", color: "#f97316",
    models: ["llama-3.3-70b-versatile", "llama-3.1-8b-instant", "mixtral-8x7b-32768"],
    testUrl: (_k: string) => "https://api.groq.com/openai/v1/models",
    testHeaders: (k: string) => ({ Authorization: `Bearer ${k}` }),
    placeholder: "gsk_...",
    docsUrl: "https://console.groq.com/keys",
  },
  {
    id: "mistral", name: "Mistral AI", emoji: "🌊", color: "#8b5cf6",
    models: ["mistral-large-latest", "mistral-small-latest", "codestral-latest"],
    testUrl: (_k: string) => "https://api.mistral.ai/v1/models",
    testHeaders: (k: string) => ({ Authorization: `Bearer ${k}` }),
    placeholder: "...",
    docsUrl: "https://console.mistral.ai/api-keys",
  },
  {
    id: "openrouter", name: "OpenRouter", emoji: "🔀", color: "#ec4899",
    models: ["openai/gpt-4o", "anthropic/claude-3.5-sonnet", "meta-llama/llama-3.1-405b"],
    testUrl: (_k: string) => "https://openrouter.ai/api/v1/models",
    testHeaders: (k: string) => ({ Authorization: `Bearer ${k}` }),
    placeholder: "sk-or-...",
    docsUrl: "https://openrouter.ai/settings/keys",
  },
  {
    id: "xai", name: "xAI (Grok)", emoji: "𝕏", color: "#94a3b8",
    models: ["grok-2", "grok-2-vision-1212", "grok-beta"],
    testUrl: (_k: string) => "https://api.x.ai/v1/models",
    testHeaders: (k: string) => ({ Authorization: `Bearer ${k}` }),
    placeholder: "xai-...",
    docsUrl: "https://console.x.ai",
  },
  {
    id: "cohere", name: "Cohere", emoji: "🌀", color: "#38bdf8",
    models: ["command-r-plus", "command-r", "command-light"],
    testUrl: (_k: string) => "https://api.cohere.com/v1/models",
    testHeaders: (k: string) => ({ Authorization: `Bearer ${k}` }),
    placeholder: "...",
    docsUrl: "https://dashboard.cohere.com/api-keys",
  },
];

// ─── localStorage helpers ────────────────────────────────────────────────────
const LS = "smart-ins-note-ai-";
const getKey = (id: string) => (typeof window !== "undefined" ? localStorage.getItem(`${LS}${id}`) ?? "" : "");
const saveKey = (id: string, v: string) => v ? localStorage.setItem(`${LS}${id}`, v) : localStorage.removeItem(`${LS}${id}`);
const getOllamaUrl = () => (typeof window !== "undefined" ? localStorage.getItem(`${LS}ollama-url`) ?? "" : "");
const saveOllamaUrl = (v: string) => v ? localStorage.setItem(`${LS}ollama-url`, v) : localStorage.removeItem(`${LS}ollama-url`);

// Also keep backward compat with gemini key used by gemini.ts
const GEMINI_COMPAT = "smart-ins-note-gemini-key";

// ─── Styles ─────────────────────────────────────────────────────────────────
const S = {
  overlay: { position: "fixed" as const, inset: 0, zIndex: 300, display: "flex", alignItems: "center", justifyContent: "center" },
  backdrop: { position: "absolute" as const, inset: 0, background: "rgba(0,0,0,0.65)", backdropFilter: "blur(6px)" },
  modal: { position: "relative" as const, width: "100%", maxWidth: 620, maxHeight: "90vh", display: "flex", flexDirection: "column" as const, background: "var(--bg-panel)", border: "1px solid var(--border)", borderRadius: 20, boxShadow: "0 30px 90px rgba(0,0,0,0.6)", margin: 16, overflow: "hidden" },
  header: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 24px 0", flexShrink: 0 },
  tabs: { display: "flex", gap: 4, padding: "16px 24px 0", borderBottom: "1px solid var(--border)", flexShrink: 0 },
  body: { flex: 1, overflowY: "auto" as const, padding: "20px 24px" },
  card: { borderRadius: 14, border: "1px solid var(--border)", background: "var(--bg-card)", overflow: "hidden", marginBottom: 10 },
  cardHead: { display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", borderBottom: "1px solid var(--border)" },
  cardBody: { padding: "12px 16px" },
  input: { width: "100%", background: "var(--bg-editor)", border: "1px solid var(--border)", borderRadius: 10, padding: "9px 40px 9px 12px", fontSize: 13, color: "var(--text-primary)", outline: "none", boxSizing: "border-box" as const, fontFamily: "monospace" },
  btn: (bg: string, disabled?: boolean): React.CSSProperties => ({ padding: "8px 14px", borderRadius: 8, border: "none", background: disabled ? "var(--bg-hover)" : bg, cursor: disabled ? "not-allowed" : "pointer", color: disabled ? "var(--text-muted)" : "white", fontSize: 12, fontWeight: 700, display: "inline-flex", alignItems: "center", gap: 5, opacity: disabled ? 0.5 : 1, whiteSpace: "nowrap" as const, flexShrink: 0 }),
  outlineBtn: (disabled?: boolean): React.CSSProperties => ({ padding: "8px 14px", borderRadius: 8, border: "1px solid var(--border)", background: "var(--bg-hover)", cursor: disabled ? "not-allowed" : "pointer", color: disabled ? "var(--text-muted)" : "var(--text-primary)", fontSize: 12, fontWeight: 600, display: "inline-flex", alignItems: "center", gap: 5, opacity: disabled ? 0.5 : 1, whiteSpace: "nowrap" as const, flexShrink: 0 }),
};

// ─── ProviderCard ────────────────────────────────────────────────────────────
function ProviderCard({ p }: { p: typeof PROVIDERS[0] }) {
  const [key, setKey] = useState(() => p.id === "gemini" ? (getKey(p.id) || (typeof window !== "undefined" ? localStorage.getItem(GEMINI_COMPAT) ?? "" : "")) : getKey(p.id));
  const [show, setShow] = useState(false);
  const [testing, setTesting] = useState(false);
  const [result, setResult] = useState<{ ok: boolean; msg: string; ms?: number } | null>(null);
  const savedKey = p.id === "gemini" ? (getKey(p.id) || (typeof window !== "undefined" ? localStorage.getItem(GEMINI_COMPAT) ?? "" : "")) : getKey(p.id);
  const dirty = key !== savedKey;

  function doSave() {
    saveKey(p.id, key.trim());
    if (p.id === "gemini") { // keep backward compat
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
    } catch { setResult({ ok: false, msg: "Network error — check CORS or key" }); }
    finally { setTesting(false); }
  }

  return (
    <div style={S.card}>
      <div style={S.cardHead}>
        <div style={{ width: 34, height: 34, borderRadius: 9, background: `${p.color}22`, border: `1px solid ${p.color}44`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}>
          {p.emoji}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 700, fontSize: 13, color: "var(--text-primary)" }}>{p.name}</div>
          <div style={{ fontSize: 11, color: "var(--text-muted)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {p.models.slice(0, 2).join(" · ")}
          </div>
        </div>
        {result && (
          <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 8px", borderRadius: 20, background: result.ok ? "rgba(16,185,129,0.12)" : "rgba(239,68,68,0.12)", color: result.ok ? "#10b981" : "#f87171", display: "inline-flex", alignItems: "center", gap: 4, flexShrink: 0 }}>
            {result.ok ? <CheckCircle size={11} /> : <XCircle size={11} />}
            {result.ok ? `OK · ${result.ms}ms` : "Failed"}
          </span>
        )}
        {!result && !!savedKey && !dirty && (
          <span style={{ fontSize: 11, color: "var(--text-muted)", display: "inline-flex", alignItems: "center", gap: 4 }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#10b981", display: "inline-block" }} />Saved
          </span>
        )}
      </div>
      <div style={S.cardBody}>
        <div style={{ display: "flex", gap: 8, marginBottom: result && !result.ok ? 8 : 0 }}>
          <div style={{ position: "relative", flex: 1 }}>
            <input
              type={show ? "text" : "password"}
              value={key}
              onChange={e => { setKey(e.target.value); setResult(null); }}
              placeholder={p.placeholder}
              style={S.input}
            />
            <button onClick={() => setShow(s => !s)} style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", display: "flex", padding: 0 }}>
              {show ? <EyeOff size={14} /> : <Eye size={14} />}
            </button>
          </div>
          <button onClick={doSave} disabled={!key.trim() || !dirty} style={S.btn("#6366f1", !key.trim() || !dirty)}>Save</button>
          <button onClick={doTest} disabled={testing || !key.trim()} style={S.outlineBtn(testing || !key.trim())}>
            {testing ? <Loader2 size={12} style={{ animation: "spin 1s linear infinite" }} /> : <Zap size={12} />}
            {testing ? "" : "Test"}
          </button>
        </div>
        {result && !result.ok && (
          <p style={{ fontSize: 11, color: "#f87171", display: "flex", alignItems: "center", gap: 5, margin: 0 }}>
            <AlertTriangle size={11} />{result.msg}
          </p>
        )}
        <a href={p.docsUrl} target="_blank" rel="noopener noreferrer" style={{ fontSize: 11, color: "var(--text-muted)", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 3, marginTop: 8 }}>
          Get API key <ExternalLink size={10} />
        </a>
      </div>
    </div>
  );
}

// ─── OllamaPanel ─────────────────────────────────────────────────────────────
interface OllamaModel { name: string; modified_at?: string; size?: number; details?: { parameter_size?: string; family?: string }; }

function OllamaPanel() {
  const [url, setUrl] = useState(() => getOllamaUrl());
  const [savedUrl, setSavedUrl] = useState(() => getOllamaUrl());
  const [testing, setTesting] = useState(false);
  const [status, setStatus] = useState<"idle"|"ok"|"error">("idle");
  const [pingMs, setPingMs] = useState<number|null>(null);
  const [version, setVersion] = useState<string|null>(null);
  const [models, setModels] = useState<OllamaModel[]>([]);
  const [errMsg, setErrMsg] = useState("");
  const dirty = url !== savedUrl;

  function doSave() { saveOllamaUrl(url.trim()); setSavedUrl(url.trim()); setStatus("idle"); setModels([]); }

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
      // Auto-set Ollama as active provider with first detected model
      const firstModel = detectedModels[0]?.name ?? "llama3";
      setActiveProvider({ provider: "ollama", model: firstModel });
      window.dispatchEvent(new Event("ai-provider-changed"));
      setStatus("ok"); saveOllamaUrl(base); setSavedUrl(base); setUrl(base);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Connection failed";
      setStatus("error"); setErrMsg(msg.includes("timeout") ? "Timed out — check URL / Cloudflare tunnel" : msg);
    } finally { setTesting(false); }
  }, [url]);

  function fmtSize(b?: number) { if (!b) return ""; const gb = b/1073741824; return gb>1?`${gb.toFixed(1)} GB`:`${(b/1048576).toFixed(0)} MB`; }

  return (
    <div>
      {/* Info */}
      <div style={{ borderRadius: 12, border: "1px solid rgba(99,102,241,0.25)", background: "rgba(99,102,241,0.06)", padding: "12px 16px", marginBottom: 14, display: "flex", gap: 12 }}>
        <Cpu size={18} color="#818cf8" style={{ flexShrink: 0, marginTop: 2 }} />
        <div style={{ fontSize: 12, color: "var(--text-muted)", lineHeight: 1.7 }}>
          <strong style={{ color: "var(--text-primary)" }}>Ollama — Local or Cloud GPU</strong><br />
          Run Ollama locally or on a cloud GPU. Use <code style={{ fontSize: 11, background: "var(--bg-editor)", padding: "1px 5px", borderRadius: 4 }}>cloudflared tunnel --url http://localhost:11434</code> to expose it, then paste the URL below. No API key needed.
        </div>
      </div>

      {/* URL input */}
      <div style={{ ...S.card, marginBottom: 14 }}>
        <div style={{ ...S.cardHead, borderBottom: "1px solid var(--border)" }}>
          <Globe size={15} color="var(--text-muted)" />
          <span style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: 1 }}>Base URL</span>
        </div>
        <div style={S.cardBody}>
          <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
            <input
              value={url}
              onChange={e => { setUrl(e.target.value); setStatus("idle"); }}
              placeholder="http://localhost:11434  or  https://my-tunnel.trycloudflare.com"
              style={{ ...S.input, fontFamily: "monospace", paddingRight: 12 }}
            />
            <button onClick={doSave} disabled={!url.trim() || !dirty} style={S.btn("var(--bg-hover)", !url.trim() || !dirty) as React.CSSProperties}>Save</button>
            <button
              onClick={doTest} disabled={testing || !url.trim()}
              style={S.btn(testing ? "var(--bg-hover)" : "#6366f1", testing || !url.trim())}
            >
              {testing ? <Loader2 size={13} style={{ animation: "spin 1s linear infinite" }} /> : <RefreshCw size={13} />}
              {testing ? "Testing…" : "Test & Detect"}
            </button>
          </div>

          {/* Status */}
          {status !== "idle" && (
            <div style={{ borderRadius: 10, padding: "10px 14px", display: "flex", alignItems: "center", gap: 10, background: status === "ok" ? "rgba(16,185,129,0.07)" : "rgba(239,68,68,0.07)", border: `1px solid ${status === "ok" ? "rgba(16,185,129,0.2)" : "rgba(239,68,68,0.2)"}` }}>
              {status === "ok" ? <Wifi size={16} color="#10b981" /> : <WifiOff size={16} color="#f87171" />}
              <div style={{ flex: 1 }}>
                {status === "ok" ? (
                  <>
                    <div style={{ fontSize: 12, fontWeight: 700, color: "#10b981" }}>Connected!</div>
                    <div style={{ fontSize: 11, color: "var(--text-muted)" }}>
                      Ollama {version} · Ping {pingMs}ms · {models.length} model{models.length !== 1 ? "s" : ""} detected
                    </div>
                  </>
                ) : (
                  <>
                    <div style={{ fontSize: 12, fontWeight: 700, color: "#f87171" }}>Connection failed</div>
                    <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{errMsg}</div>
                  </>
                )}
              </div>
              {status === "ok" && (
                <span style={{ fontSize: 11, fontWeight: 800, color: "#10b981", background: "rgba(16,185,129,0.12)", padding: "3px 10px", borderRadius: 20 }}>{pingMs}ms</span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Models list */}
      {models.length > 0 && (
        <div style={S.card}>
          <div style={{ ...S.cardHead, borderBottom: "1px solid var(--border)" }}>
            <Server size={15} color="var(--text-muted)" />
            <span style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: 1 }}>Detected Models</span>
            <span style={{ marginLeft: "auto", fontSize: 11, fontWeight: 700, color: "#818cf8", background: "rgba(99,102,241,0.1)", padding: "2px 10px", borderRadius: 20 }}>{models.length} found</span>
          </div>
          <div style={{ maxHeight: 260, overflowY: "auto" }}>
            {models.map((m, i) => {
              const family = m.details?.family ?? m.name.split(":")[0];
              const tag = m.name.includes(":") ? m.name.split(":")[1] : "latest";
              return (
                <div key={m.name} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 16px", borderTop: i > 0 ? "1px solid var(--border)" : undefined }}>
                  <div style={{ width: 32, height: 32, borderRadius: 9, background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.2)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Brain size={15} color="#818cf8" />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: "var(--text-primary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{m.name}</div>
                    <div style={{ fontSize: 11, color: "var(--text-muted)" }}>
                      {family}{m.details?.parameter_size ? ` · ${m.details.parameter_size}` : ""}{fmtSize(m.size) ? ` · ${fmtSize(m.size)}` : ""}
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
                    <code style={{ fontSize: 10, background: "var(--bg-editor)", padding: "2px 6px", borderRadius: 5, color: "var(--text-muted)" }}>{tag}</code>
                    <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#10b981" }} title="Available" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Empty state */}
      {!savedUrl && status === "idle" && (
        <div style={{ textAlign: "center", padding: "36px 20px", border: "1px dashed var(--border)", borderRadius: 14 }}>
          <Server size={32} color="var(--text-faint)" style={{ margin: "0 auto 12px" }} />
          <p style={{ fontSize: 13, fontWeight: 600, color: "var(--text-muted)", margin: "0 0 6px" }}>No Ollama URL configured</p>
          <p style={{ fontSize: 12, color: "var(--text-faint)", margin: "0 0 16px", lineHeight: 1.6 }}>Enter your Ollama base URL above and click "Test & Detect" to discover available models.</p>
          <code style={{ fontSize: 11, background: "var(--bg-editor)", border: "1px solid var(--border)", padding: "6px 14px", borderRadius: 8, color: "var(--text-muted)" }}>
            cloudflared tunnel --url http://localhost:11434
          </code>
        </div>
      )}
    </div>
  );
}

// ─── Main Modal ───────────────────────────────────────────────────────────────
type Tab = "cloud" | "ollama";

export function SettingsModal({ onClose }: Props) {
  const [tab, setTab] = useState<Tab>("cloud");

  const tabStyle = (active: boolean): React.CSSProperties => ({
    padding: "8px 18px", border: "none", background: "none", cursor: "pointer",
    fontSize: 13, fontWeight: 600, color: active ? "var(--accent)" : "var(--text-muted)",
    borderBottom: active ? "2px solid var(--accent)" : "2px solid transparent",
    marginBottom: -1, transition: "color 0.15s",
  });

  return (
    <div style={S.overlay}>
      <div onClick={onClose} style={S.backdrop} />
      <div style={S.modal}>
        {/* Header */}
        <div style={S.header}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: "linear-gradient(135deg,#6366f1,#8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Sparkles size={17} color="white" />
            </div>
            <div>
              <h2 style={{ fontWeight: 800, fontSize: 17, color: "var(--text-primary)", margin: 0 }}>AI Settings</h2>
              <p style={{ fontSize: 12, color: "var(--text-muted)", margin: 0 }}>Configure cloud providers and local Ollama models</p>
            </div>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", padding: 6, borderRadius: 8, color: "var(--text-muted)", display: "flex" }}>
            <X size={18} />
          </button>
        </div>

        {/* Active Provider */}
        <ActiveProviderSection />

        {/* Privacy note */}
        <div style={{ margin: "10px 24px 0", padding: "9px 14px", borderRadius: 10, background: "rgba(99,102,241,0.06)", border: "1px solid rgba(99,102,241,0.15)", fontSize: 11, color: "var(--text-muted)" }}>
          🔒 API keys stored <strong style={{ color: "var(--text-primary)" }}>only in your browser</strong> — never sent to our servers.
        </div>

        {/* Tabs */}
        <div style={S.tabs}>
          <button style={tabStyle(tab === "cloud")} onClick={() => setTab("cloud")}>☁ Cloud Providers</button>
          <button style={tabStyle(tab === "ollama")} onClick={() => setTab("ollama")}>🖥 Ollama (Local / Cloud)</button>
        </div>

        {/* Body */}
        <div style={S.body}>
          {tab === "cloud" && (
            <div>
              <p style={{ fontSize: 12, color: "var(--text-muted)", margin: "0 0 14px", lineHeight: 1.6 }}>
                Add API keys for any cloud AI provider. Keys are tested directly from your browser.
              </p>
              {PROVIDERS.map(p => <ProviderCard key={p.id} p={p} />)}
            </div>
          )}
          {tab === "ollama" && <OllamaPanel />}
        </div>

        <style>{`
          @keyframes spin { to { transform: rotate(360deg); } }
        `}</style>
      </div>
    </div>
  );
}
