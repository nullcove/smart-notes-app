"use client";

import { useState, useEffect } from "react";
import { X, Eye, EyeOff, CheckCircle, XCircle, Loader2, ExternalLink, Key, Sparkles } from "lucide-react";
import { getGeminiKey, setGeminiKey, testGeminiKey } from "@/lib/gemini";

interface Props {
  onClose: () => void;
}

export function SettingsModal({ onClose }: Props) {
  const [apiKey, setApiKey] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ ok: boolean; message: string } | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setApiKey(getGeminiKey());
  }, []);

  async function handleTest() {
    if (!apiKey.trim()) return;
    setTesting(true);
    setTestResult(null);
    const result = await testGeminiKey(apiKey.trim());
    setTestResult(result);
    setTesting(false);
  }

  function handleSave() {
    setGeminiKey(apiKey.trim());
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  function handleClear() {
    setApiKey("");
    setGeminiKey("");
    setTestResult(null);
  }

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div onClick={onClose} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }} />
      <div style={{ position: "relative", width: "100%", maxWidth: 480, background: "var(--bg-panel)", border: "1px solid var(--border)", borderRadius: 18, boxShadow: "0 25px 80px rgba(0,0,0,0.5)", padding: 28, margin: 16 }}>
        
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: "linear-gradient(135deg,#6366f1,#8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Sparkles size={17} color="white" />
            </div>
            <div>
              <h2 style={{ fontWeight: 800, fontSize: 17, color: "var(--text-primary)", margin: 0 }}>AI Settings</h2>
              <p style={{ fontSize: 12, color: "var(--text-muted)", margin: 0 }}>Powered by Google Gemini</p>
            </div>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", padding: 6, borderRadius: 8, color: "var(--text-muted)", display: "flex" }}>
            <X size={18} />
          </button>
        </div>

        {/* Info box */}
        <div style={{ padding: "12px 14px", borderRadius: 10, background: "rgba(99,102,241,0.07)", border: "1px solid rgba(99,102,241,0.2)", marginBottom: 20, fontSize: 13, color: "var(--text-muted)", lineHeight: 1.6 }}>
          Your API key is stored <strong style={{ color: "var(--text-primary)" }}>only in your browser</strong> (localStorage). It is never sent to our servers or GitHub.
          <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener" style={{ display: "inline-flex", alignItems: "center", gap: 4, color: "#818cf8", marginLeft: 6, textDecoration: "none", fontWeight: 600 }}>
            Get a free key <ExternalLink size={11} />
          </a>
        </div>

        {/* API Key input */}
        <label style={{ display: "block", marginBottom: 8, fontSize: 13, fontWeight: 600, color: "var(--text-primary)" }}>
          <Key size={12} style={{ display: "inline", marginRight: 6 }} />
          Gemini API Key
        </label>
        <div style={{ position: "relative", marginBottom: 14 }}>
          <input
            type={showKey ? "text" : "password"}
            value={apiKey}
            onChange={e => setApiKey(e.target.value)}
            placeholder="AIza..."
            style={{ width: "100%", background: "var(--bg-editor)", border: "1px solid var(--border)", borderRadius: 10, padding: "11px 44px 11px 14px", fontSize: 14, color: "var(--text-primary)", outline: "none", boxSizing: "border-box", fontFamily: "monospace" }}
            onFocus={e => (e.currentTarget.style.borderColor = "var(--accent)")}
            onBlur={e => (e.currentTarget.style.borderColor = "var(--border)")}
          />
          <button onClick={() => setShowKey(s => !s)} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", display: "flex" }}>
            {showKey ? <EyeOff size={15} /> : <Eye size={15} />}
          </button>
        </div>

        {/* Test result */}
        {testResult && (
          <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 14px", borderRadius: 8, marginBottom: 14, background: testResult.ok ? "rgba(16,185,129,0.08)" : "rgba(239,68,68,0.08)", border: `1px solid ${testResult.ok ? "rgba(16,185,129,0.25)" : "rgba(239,68,68,0.25)"}`, fontSize: 13, color: testResult.ok ? "#10b981" : "#f87171" }}>
            {testResult.ok ? <CheckCircle size={15} /> : <XCircle size={15} />}
            {testResult.message}
          </div>
        )}

        {/* Action buttons */}
        <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
          <button onClick={handleTest} disabled={!apiKey.trim() || testing}
            style={{ flex: 1, padding: "10px", borderRadius: 10, border: "1px solid var(--border)", background: "var(--bg-hover)", cursor: apiKey.trim() ? "pointer" : "not-allowed", color: "var(--text-primary)", fontSize: 13, fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, opacity: !apiKey.trim() ? 0.5 : 1 }}>
            {testing ? <Loader2 size={14} style={{ animation: "spin 1s linear infinite" }} /> : null}
            {testing ? "Testing…" : "Test Key"}
          </button>
          <button onClick={handleSave} disabled={!apiKey.trim()}
            style={{ flex: 1, padding: "10px", borderRadius: 10, border: "none", background: saved ? "#10b981" : "linear-gradient(135deg,#6366f1,#8b5cf6)", cursor: apiKey.trim() ? "pointer" : "not-allowed", color: "white", fontSize: 13, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, opacity: !apiKey.trim() ? 0.5 : 1, transition: "background 0.3s" }}>
            {saved ? <><CheckCircle size={14} /> Saved!</> : "Save Key"}
          </button>
          {apiKey && (
            <button onClick={handleClear}
              style={{ padding: "10px 14px", borderRadius: 10, border: "1px solid rgba(239,68,68,0.3)", background: "rgba(239,68,68,0.07)", cursor: "pointer", color: "#f87171", fontSize: 13, fontWeight: 600 }}>
              Clear
            </button>
          )}
        </div>

        <style>{`
          @keyframes spin { to { transform: rotate(360deg); } }
        `}</style>
      </div>
    </div>
  );
}
