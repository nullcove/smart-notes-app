import React, { useState, useEffect, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Eye, EyeOff, Check, X, Loader2, Wifi, WifiOff,
  Zap, Brain, ChevronRight, Server, Globe, Cpu,
  RefreshCw, AlertTriangle,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

interface CloudProvider {
  id: string;
  name: string;
  logo: string;
  color: string;
  models: string[];
  testUrl: (key: string) => string;
  testHeaders: (key: string) => Record<string, string>;
  docsUrl: string;
}

interface OllamaModel {
  name: string;
  modified_at?: string;
  size?: number;
  details?: { parameter_size?: string; family?: string };
}

interface TestResult {
  ok: boolean;
  message: string;
  latency?: number;
}

// ─── Cloud provider definitions ───────────────────────────────────────────────

const PROVIDERS: CloudProvider[] = [
  {
    id: "openai",
    name: "OpenAI",
    logo: "🤖",
    color: "from-emerald-500 to-teal-500",
    models: ["gpt-4o", "gpt-4o-mini", "gpt-4-turbo", "gpt-3.5-turbo"],
    testUrl: () => "https://api.openai.com/v1/models",
    testHeaders: (k) => ({ Authorization: `Bearer ${k}` }),
    docsUrl: "https://platform.openai.com/api-keys",
  },
  {
    id: "anthropic",
    name: "Anthropic",
    logo: "✦",
    color: "from-amber-500 to-orange-500",
    models: ["claude-3-5-sonnet", "claude-3-5-haiku", "claude-3-opus"],
    testUrl: () => "https://api.anthropic.com/v1/models",
    testHeaders: (k) => ({ "x-api-key": k, "anthropic-version": "2023-06-01" }),
    docsUrl: "https://console.anthropic.com/settings/keys",
  },
  {
    id: "gemini",
    name: "Google Gemini",
    logo: "♊",
    color: "from-blue-500 to-indigo-500",
    models: ["gemini-2.0-flash", "gemini-1.5-pro", "gemini-1.5-flash"],
    testUrl: (k) => `https://generativelanguage.googleapis.com/v1beta/models?key=${k}`,
    testHeaders: () => ({}),
    docsUrl: "https://aistudio.google.com/apikey",
  },
  {
    id: "groq",
    name: "Groq",
    logo: "⚡",
    color: "from-orange-500 to-red-500",
    models: ["llama-3.3-70b", "llama-3.1-8b", "mixtral-8x7b"],
    testUrl: () => "https://api.groq.com/openai/v1/models",
    testHeaders: (k) => ({ Authorization: `Bearer ${k}` }),
    docsUrl: "https://console.groq.com/keys",
  },
  {
    id: "mistral",
    name: "Mistral AI",
    logo: "🌊",
    color: "from-violet-500 to-purple-500",
    models: ["mistral-large", "mistral-small", "codestral"],
    testUrl: () => "https://api.mistral.ai/v1/models",
    testHeaders: (k) => ({ Authorization: `Bearer ${k}` }),
    docsUrl: "https://console.mistral.ai/api-keys",
  },
  {
    id: "openrouter",
    name: "OpenRouter",
    logo: "🔀",
    color: "from-rose-500 to-pink-500",
    models: ["openai/gpt-4o", "anthropic/claude-3.5-sonnet", "meta-llama/llama-3.1-405b"],
    testUrl: () => "https://openrouter.ai/api/v1/models",
    testHeaders: (k) => ({ Authorization: `Bearer ${k}` }),
    docsUrl: "https://openrouter.ai/settings/keys",
  },
  {
    id: "xai",
    name: "xAI (Grok)",
    logo: "𝕏",
    color: "from-zinc-400 to-zinc-600",
    models: ["grok-2", "grok-2-vision", "grok-beta"],
    testUrl: () => "https://api.x.ai/v1/models",
    testHeaders: (k) => ({ Authorization: `Bearer ${k}` }),
    docsUrl: "https://console.x.ai",
  },
  {
    id: "cohere",
    name: "Cohere",
    logo: "🌀",
    color: "from-sky-500 to-blue-500",
    models: ["command-r-plus", "command-r", "command"],
    testUrl: () => "https://api.cohere.com/v1/models",
    testHeaders: (k) => ({ Authorization: `Bearer ${k}` }),
    docsUrl: "https://dashboard.cohere.com/api-keys",
  },
];

// ─── localStorage helpers ─────────────────────────────────────────────────────

const LS_PREFIX = "smartnotes_ai_";
const getKey = (id: string) => localStorage.getItem(`${LS_PREFIX}${id}_key`) ?? "";
const setKey = (id: string, val: string) => localStorage.setItem(`${LS_PREFIX}${id}_key`, val);
const getOllamaUrl = () => localStorage.getItem(`${LS_PREFIX}ollama_url`) ?? "";
const setOllamaUrl = (v: string) => localStorage.setItem(`${LS_PREFIX}ollama_url`, v);

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatusBadge({ result }: { result: TestResult | null }) {
  if (!result) return null;
  return (
    <span className={cn(
      "inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full",
      result.ok
        ? "bg-emerald-500/15 text-emerald-400"
        : "bg-red-500/15 text-red-400"
    )}>
      {result.ok ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
      {result.ok ? "Connected" : "Failed"}
      {result.latency && result.ok ? ` · ${result.latency}ms` : ""}
    </span>
  );
}

// ─── Cloud provider card ──────────────────────────────────────────────────────

function ProviderCard({ provider }: { provider: CloudProvider }) {
  const [apiKey, setApiKey] = useState(() => getKey(provider.id));
  const [show, setShow] = useState(false);
  const [saved, setSaved] = useState(!!getKey(provider.id));
  const [testing, setTesting] = useState(false);
  const [result, setResult] = useState<TestResult | null>(null);

  const handleSave = () => {
    setKey(provider.id, apiKey);
    setSaved(true);
    setResult(null);
  };

  const handleTest = async () => {
    if (!apiKey.trim()) return;
    setTesting(true);
    setResult(null);
    const t0 = Date.now();
    try {
      const res = await fetch(provider.testUrl(apiKey), {
        headers: provider.testHeaders(apiKey),
      });
      const latency = Date.now() - t0;
      if (res.ok) {
        setResult({ ok: true, message: "API key is valid", latency });
      } else {
        const body = await res.json().catch(() => ({}));
        setResult({ ok: false, message: body?.error?.message ?? `HTTP ${res.status}` });
      }
    } catch {
      setResult({ ok: false, message: "Network error — check CORS or key" });
    } finally {
      setTesting(false);
    }
  };

  const dirty = apiKey !== getKey(provider.id);

  return (
    <div className="rounded-xl border border-white/6 bg-zinc-900 overflow-hidden">
      {/* header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-white/5">
        <div className={cn(
          "flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br text-lg font-bold text-white shadow-md",
          provider.color
        )}>
          {provider.logo}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-white">{provider.name}</p>
          <p className="text-[10px] text-zinc-600 truncate">
            {provider.models.slice(0, 2).join(" · ")}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <StatusBadge result={result} />
          {saved && !dirty && !result && (
            <span className="text-[10px] font-medium text-zinc-600 flex items-center gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Saved
            </span>
          )}
        </div>
      </div>

      {/* body */}
      <div className="px-4 py-3 space-y-3">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Input
              type={show ? "text" : "password"}
              value={apiKey}
              onChange={(e) => { setApiKey(e.target.value); setSaved(false); setResult(null); }}
              placeholder={`${provider.name} API key…`}
              className="h-8 text-xs bg-zinc-800/80 border-white/6 text-zinc-200 placeholder:text-zinc-600 pr-8 focus-visible:ring-violet-500/40 focus-visible:border-violet-500/40 font-mono"
            />
            <button
              type="button"
              onClick={() => setShow(!show)}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-zinc-300 transition-colors"
            >
              {show ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
            </button>
          </div>
          <Button
            size="sm"
            onClick={handleSave}
            disabled={!apiKey.trim() || !dirty}
            className="h-8 px-3 text-xs bg-violet-600 hover:bg-violet-500 text-white border-0 shrink-0"
          >
            Save
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={handleTest}
            disabled={testing || !apiKey.trim()}
            className="h-8 px-3 text-xs border-white/8 bg-zinc-800 text-zinc-300 hover:bg-zinc-700 hover:text-white shrink-0"
          >
            {testing ? <Loader2 className="h-3 w-3 animate-spin" /> : <Zap className="h-3 w-3" />}
            {testing ? "" : "Test"}
          </Button>
        </div>

        {result && !result.ok && (
          <p className="text-[11px] text-red-400 flex items-center gap-1">
            <AlertTriangle className="h-3 w-3 shrink-0" />
            {result.message}
          </p>
        )}

        <a
          href={provider.docsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[10px] text-zinc-600 hover:text-violet-400 transition-colors flex items-center gap-1"
        >
          Get API key <ChevronRight className="h-2.5 w-2.5" />
        </a>
      </div>
    </div>
  );
}

// ─── Ollama panel ─────────────────────────────────────────────────────────────

function OllamaPanel() {
  const [url, setUrl] = useState(() => getOllamaUrl());
  const [savedUrl, setSavedUrl] = useState(() => getOllamaUrl());
  const [testing, setTesting] = useState(false);
  const [pingMs, setPingMs] = useState<number | null>(null);
  const [models, setModels] = useState<OllamaModel[]>([]);
  const [version, setVersion] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "ok" | "error">("idle");
  const [errMsg, setErrMsg] = useState("");

  const handleSave = () => {
    setOllamaUrl(url.trim());
    setSavedUrl(url.trim());
    setStatus("idle");
    setModels([]);
    setPingMs(null);
    setVersion(null);
  };

  const handleTest = useCallback(async () => {
    const baseUrl = url.trim().replace(/\/+$/, "");
    if (!baseUrl) return;
    setTesting(true);
    setStatus("idle");
    setModels([]);
    setPingMs(null);
    setVersion(null);
    setErrMsg("");

    try {
      // 1. Ping version endpoint
      const t0 = Date.now();
      const vRes = await fetch(`${baseUrl}/api/version`, {
        signal: AbortSignal.timeout(8000),
      });
      const latency = Date.now() - t0;

      if (!vRes.ok) throw new Error(`HTTP ${vRes.status}`);

      const vData = await vRes.json() as { version?: string };
      setPingMs(latency);
      setVersion(vData.version ?? "unknown");

      // 2. Fetch models
      const mRes = await fetch(`${baseUrl}/api/tags`, {
        signal: AbortSignal.timeout(10000),
      });
      if (mRes.ok) {
        const mData = await mRes.json() as { models?: OllamaModel[] };
        setModels(mData.models ?? []);
      }

      setStatus("ok");
      // auto-save URL on success
      setOllamaUrl(baseUrl);
      setSavedUrl(baseUrl);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Connection failed";
      setStatus("error");
      setErrMsg(msg.includes("timeout") ? "Timed out — check URL / tunnel" : msg);
    } finally {
      setTesting(false);
    }
  }, [url]);

  const dirty = url !== savedUrl;

  function formatSize(bytes?: number) {
    if (!bytes) return "";
    const gb = bytes / 1_073_741_824;
    return gb > 1 ? `${gb.toFixed(1)} GB` : `${(bytes / 1_048_576).toFixed(0)} MB`;
  }

  return (
    <div className="space-y-4">
      {/* info card */}
      <div className="rounded-xl border border-violet-500/15 bg-violet-500/5 p-4 flex gap-3">
        <Cpu className="h-5 w-5 text-violet-400 mt-0.5 shrink-0" />
        <div className="text-xs text-zinc-400 leading-relaxed">
          <p className="font-semibold text-violet-300 mb-1">Ollama — Local or Cloud GPU</p>
          <p>Run Ollama on your machine or cloud GPU. Use <span className="text-zinc-300 font-mono">cloudflared tunnel</span> to expose it as a public HTTPS URL, then paste it below. No API key needed.</p>
        </div>
      </div>

      {/* URL input */}
      <div className="rounded-xl border border-white/6 bg-zinc-900 p-4 space-y-3">
        <div className="flex items-center gap-2 mb-1">
          <Globe className="h-4 w-4 text-zinc-500" />
          <p className="text-xs font-bold text-zinc-300 uppercase tracking-widest">Base URL</p>
        </div>
        <div className="flex gap-2">
          <Input
            value={url}
            onChange={(e) => { setUrl(e.target.value); setStatus("idle"); }}
            placeholder="http://localhost:11434  or  https://my-tunnel.trycloudflare.com"
            className="h-9 text-xs bg-zinc-800/80 border-white/6 text-zinc-200 placeholder:text-zinc-600 font-mono focus-visible:ring-violet-500/40 focus-visible:border-violet-500/40"
          />
          <Button
            size="sm"
            onClick={handleSave}
            disabled={!url.trim() || !dirty}
            className="h-9 px-3 text-xs bg-zinc-700 hover:bg-zinc-600 text-white border-0 shrink-0"
          >
            Save
          </Button>
          <Button
            size="sm"
            onClick={handleTest}
            disabled={testing || !url.trim()}
            className={cn(
              "h-9 px-4 text-xs border-0 font-bold shrink-0 gap-2",
              testing
                ? "bg-zinc-700 text-zinc-300"
                : "bg-violet-600 hover:bg-violet-500 text-white shadow-lg shadow-violet-600/20"
            )}
          >
            {testing ? (
              <><Loader2 className="h-3.5 w-3.5 animate-spin" /> Testing…</>
            ) : (
              <><RefreshCw className="h-3.5 w-3.5" /> Test & Detect</>
            )}
          </Button>
        </div>

        {/* Status row */}
        {status !== "idle" && (
          <div className={cn(
            "rounded-lg px-3 py-2.5 flex items-center gap-3",
            status === "ok" ? "bg-emerald-500/8 border border-emerald-500/15" : "bg-red-500/8 border border-red-500/15"
          )}>
            {status === "ok" ? (
              <>
                <Wifi className="h-4 w-4 text-emerald-400 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-emerald-400">Connected!</p>
                  <p className="text-[11px] text-zinc-500 mt-0.5">
                    Ollama {version} · Ping {pingMs}ms · {models.length} model{models.length !== 1 ? "s" : ""} found
                  </p>
                </div>
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/15 px-2 py-0.5 rounded-full">
                  {pingMs}ms
                </span>
              </>
            ) : (
              <>
                <WifiOff className="h-4 w-4 text-red-400 shrink-0" />
                <div>
                  <p className="text-xs font-semibold text-red-400">Connection failed</p>
                  <p className="text-[11px] text-zinc-500">{errMsg}</p>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* Models list */}
      {models.length > 0 && (
        <div className="rounded-xl border border-white/6 bg-zinc-900 overflow-hidden">
          <div className="px-4 py-3 border-b border-white/5 flex items-center gap-2">
            <Server className="h-4 w-4 text-zinc-500" />
            <p className="text-xs font-bold text-zinc-300 uppercase tracking-widest">
              Detected Models
            </p>
            <span className="ml-auto text-[10px] font-semibold text-violet-400 bg-violet-500/10 px-2 py-0.5 rounded-full">
              {models.length} found
            </span>
          </div>
          <ScrollArea className="max-h-[280px]">
            <div className="divide-y divide-white/4">
              {models.map((m) => {
                const family = m.details?.family ?? m.name.split(":")[0];
                const paramSize = m.details?.parameter_size;
                const tag = m.name.includes(":") ? m.name.split(":")[1] : "latest";
                return (
                  <div key={m.name} className="flex items-center gap-3 px-4 py-3 hover:bg-white/2 transition-colors">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500/20 to-indigo-500/20 border border-violet-500/15 shrink-0">
                      <Brain className="h-4 w-4 text-violet-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-white truncate">{m.name}</p>
                      <p className="text-[10px] text-zinc-600">
                        {family}{paramSize ? ` · ${paramSize}` : ""}
                        {formatSize(m.size) ? ` · ${formatSize(m.size)}` : ""}
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className="text-[10px] font-mono text-zinc-600 bg-zinc-800 px-1.5 py-0.5 rounded">
                        {tag}
                      </span>
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" title="Available" />
                    </div>
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        </div>
      )}

      {/* No URL saved hint */}
      {!savedUrl && status === "idle" && (
        <div className="rounded-xl border border-white/5 border-dashed p-8 text-center">
          <Server className="h-8 w-8 text-zinc-700 mx-auto mb-3" />
          <p className="text-sm font-semibold text-zinc-500 mb-1">No Ollama URL configured</p>
          <p className="text-xs text-zinc-700 max-w-xs mx-auto leading-relaxed">
            Enter your Ollama base URL above and click "Test & Detect" to discover available models.
          </p>
          <div className="mt-4 text-[11px] font-mono text-zinc-700 bg-zinc-900 border border-white/5 rounded-lg px-4 py-2 inline-block">
            cloudflared tunnel --url http://localhost:11434
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main modal ───────────────────────────────────────────────────────────────

interface SettingsModalProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}

export function SettingsModal({ open, onOpenChange }: SettingsModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl w-full bg-zinc-950 border-white/8 text-white p-0 gap-0 overflow-hidden">
        {/* header */}
        <DialogHeader className="px-6 py-4 border-b border-white/6">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600">
              <Cpu className="h-4 w-4 text-white" />
            </div>
            <div>
              <DialogTitle className="text-base font-bold text-white">AI Settings</DialogTitle>
              <p className="text-xs text-zinc-500">Configure cloud providers and local models</p>
            </div>
          </div>
        </DialogHeader>

        <Tabs defaultValue="cloud" className="flex-1">
          <div className="px-6 pt-4 border-b border-white/5">
            <TabsList className="bg-zinc-900 border border-white/6 h-9 p-1 gap-1">
              <TabsTrigger
                value="cloud"
                className="data-[state=active]:bg-violet-600 data-[state=active]:text-white text-zinc-400 text-xs font-semibold h-7 px-4 rounded-md"
              >
                ☁ Cloud Providers
              </TabsTrigger>
              <TabsTrigger
                value="ollama"
                className="data-[state=active]:bg-violet-600 data-[state=active]:text-white text-zinc-400 text-xs font-semibold h-7 px-4 rounded-md"
              >
                🖥 Ollama (Local / Cloud)
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Cloud providers */}
          <TabsContent value="cloud" className="mt-0 focus-visible:outline-none">
            <ScrollArea className="h-[520px]">
              <div className="px-6 py-4 grid grid-cols-1 gap-3">
                {PROVIDERS.map((p) => (
                  <ProviderCard key={p.id} provider={p} />
                ))}
              </div>
            </ScrollArea>
          </TabsContent>

          {/* Ollama */}
          <TabsContent value="ollama" className="mt-0 focus-visible:outline-none">
            <ScrollArea className="h-[520px]">
              <div className="px-6 py-4">
                <OllamaPanel />
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
