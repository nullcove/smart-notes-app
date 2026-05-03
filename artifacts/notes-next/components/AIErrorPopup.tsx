"use client";
import { useEffect, useState } from "react";
import { AlertTriangle, X, Key, RefreshCw, Wifi } from "lucide-react";
import { PROVIDER_LABELS, PROVIDER_COLORS } from "@/lib/ai-api";

export interface AiError {
  provider: string;
  model: string;
  message: string;
  code?: string;
  type?: "rate_limit" | "token_limit" | "invalid_key" | "no_keys" | "network" | "unknown";
}

interface Props {
  error: AiError | null;
  onDismiss: () => void;
  onOpenKeyManager?: () => void;
}

function classifyError(msg: string, code?: string): AiError["type"] {
  const m = msg.toLowerCase();
  if (m.includes("no api key") || m.includes("no_keys") || code === "NO_KEYS") return "no_keys";
  if (m.includes("invalid") && (m.includes("key") || m.includes("api"))) return "invalid_key";
  if (m.includes("rate limit") || m.includes("quota") || m.includes("429")) return "rate_limit";
  if (m.includes("token") || m.includes("context length") || m.includes("maximum context")) return "token_limit";
  if (m.includes("fetch") || m.includes("network") || m.includes("econnrefused")) return "network";
  return "unknown";
}

function getErrorTitle(type: AiError["type"]): string {
  switch (type) {
    case "no_keys": return "No API Keys Configured";
    case "invalid_key": return "Invalid API Key";
    case "rate_limit": return "Rate Limit Reached";
    case "token_limit": return "Token Limit Exceeded";
    case "network": return "Network Error";
    default: return "AI Error";
  }
}

function getErrorHint(type: AiError["type"], provider: string): string {
  switch (type) {
    case "no_keys": return "Go to Settings → AI Keys and add at least one API key to get started.";
    case "invalid_key": return `Your ${PROVIDER_LABELS[provider] ?? provider} API key is invalid or expired. Please update it in Settings → AI Keys.`;
    case "rate_limit": return `${PROVIDER_LABELS[provider] ?? provider} rate limit hit. Adding more API keys will let auto-mode rotate between them.`;
    case "token_limit": return "Message too long. Try clearing the conversation history or break your request into smaller parts.";
    case "network": return "Connection failed. Check your internet connection and try again.";
    default: return "Something went wrong with the AI request. Please try again.";
  }
}

function getErrorIcon(type: AiError["type"]) {
  switch (type) {
    case "no_keys":
    case "invalid_key":
      return <Key size={20} color="#fbbf24" />;
    case "rate_limit":
    case "token_limit":
      return <RefreshCw size={20} color="#f87171" />;
    case "network":
      return <Wifi size={20} color="#60a5fa" />;
    default:
      return <AlertTriangle size={20} color="#f87171" />;
  }
}

export function AIErrorPopup({ error, onDismiss, onOpenKeyManager }: Props) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (error) {
      setVisible(true);
      const timer = setTimeout(() => { setVisible(false); setTimeout(onDismiss, 300); }, 8000);
      return () => clearTimeout(timer);
    }
  }, [error, onDismiss]);

  if (!error) return null;

  const type = classifyError(error.message, error.code);
  const providerColor = PROVIDER_COLORS[error.provider] ?? "#8b5cf6";
  const providerLabel = PROVIDER_LABELS[error.provider] ?? error.provider;
  const showKeyAction = type === "no_keys" || type === "invalid_key" || type === "rate_limit";

  return (
    <>
      <style>{`
        @keyframes errSlideIn {
          from { opacity: 0; transform: translateY(20px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes errSlideOut {
          from { opacity: 1; transform: translateY(0) scale(1); }
          to { opacity: 0; transform: translateY(10px) scale(0.97); }
        }
        @keyframes errPulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(239,68,68,0.4); }
          50% { box-shadow: 0 0 0 8px rgba(239,68,68,0); }
        }
        @keyframes errProgress {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>
      <div
        role="alert"
        style={{
          position: "fixed",
          bottom: 90,
          right: 24,
          width: 340,
          background: "linear-gradient(135deg,rgba(17,10,35,0.98),rgba(24,14,46,0.98))",
          border: "1px solid rgba(239,68,68,0.35)",
          borderRadius: 16,
          boxShadow: "0 8px 40px rgba(0,0,0,0.6), 0 0 0 1px rgba(139,92,246,0.1)",
          backdropFilter: "blur(24px)",
          zIndex: 9999,
          overflow: "hidden",
          animation: `${visible ? "errSlideIn" : "errSlideOut"} 0.3s ease forwards`,
        }}
      >
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: "rgba(239,68,68,0.15)" }}>
          <div style={{ height: "100%", background: "linear-gradient(90deg,#f87171,#ef4444)", animation: "errProgress 8s linear forwards", borderRadius: 3 }} />
        </div>

        <div style={{ padding: "18px 16px 14px" }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
            <div style={{
              flexShrink: 0, width: 36, height: 36, borderRadius: 10,
              background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.25)",
              display: "flex", alignItems: "center", justifyContent: "center",
              animation: type === "no_keys" || type === "invalid_key" ? "errPulse 2s ease infinite" : "none",
            }}>
              {getErrorIcon(type)}
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
                <span style={{ color: "#f87171", fontWeight: 700, fontSize: 13 }}>{getErrorTitle(type)}</span>
                <button
                  onClick={() => { setVisible(false); setTimeout(onDismiss, 300); }}
                  style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.4)", padding: 2 }}
                >
                  <X size={14} />
                </button>
              </div>

              {error.provider && error.provider !== "unknown" && (
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: providerColor, boxShadow: `0 0 6px ${providerColor}` }} />
                  <span style={{ color: "rgba(255,255,255,0.5)", fontSize: 11 }}>{providerLabel} · {error.model}</span>
                </div>
              )}

              <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 12, lineHeight: 1.5, margin: 0 }}>
                {getErrorHint(type, error.provider)}
              </p>
            </div>
          </div>

          {showKeyAction && onOpenKeyManager && (
            <button
              onClick={() => { setVisible(false); setTimeout(() => { onDismiss(); onOpenKeyManager(); }, 300); }}
              style={{
                marginTop: 12, width: "100%",
                background: "linear-gradient(135deg,rgba(99,102,241,0.25),rgba(168,85,247,0.25))",
                border: "1px solid rgba(139,92,246,0.4)",
                borderRadius: 10, padding: "8px 12px",
                color: "#c4b5fd", fontSize: 12, fontWeight: 600,
                cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
              }}
            >
              <Key size={12} /> Manage API Keys
            </button>
          )}
        </div>
      </div>
    </>
  );
}
