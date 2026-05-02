"use client";

import { X } from "lucide-react";

const shortcuts = [
  { keys: ["⌘", "N"], desc: "New note" },
  { keys: ["⌘", "K"], desc: "Focus search" },
  { keys: ["⌘", "P"], desc: "Toggle markdown preview" },
  { keys: ["⌘", "/"], desc: "Show/hide shortcuts" },
  { keys: ["Esc"], desc: "Close this panel" },
];

export function ShortcutsModal({ onClose }: { onClose: () => void }) {
  return (
    <div
      style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 999, backdropFilter: "blur(4px)" }}
      onClick={onClose}
    >
      <div
        style={{ background: "var(--bg-editor)", border: "1px solid var(--border)", borderRadius: 14, padding: 28, width: 380, boxShadow: "0 20px 60px rgba(0,0,0,0.3)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
          <span style={{ fontWeight: 700, fontSize: 16, color: "var(--text-primary)" }}>Keyboard Shortcuts</span>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", display: "flex", padding: 4, borderRadius: 6 }}>
            <X size={16} />
          </button>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {shortcuts.map(({ keys, desc }) => (
            <div key={desc} style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontSize: 13, color: "var(--text-muted)" }}>{desc}</span>
              <div style={{ display: "flex", gap: 4 }}>
                {keys.map((k) => (
                  <kbd key={k} style={{ background: "var(--bg-hover)", border: "1px solid var(--border)", borderRadius: 5, padding: "2px 7px", fontSize: 12, fontFamily: "monospace", color: "var(--text-primary)", fontWeight: 600 }}>
                    {k}
                  </kbd>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 20, paddingTop: 16, borderTop: "1px solid var(--border)", fontSize: 11, color: "var(--text-muted)", textAlign: "center" }}>
          InsNote Smart · Powered by Insforge
        </div>
      </div>
    </div>
  );
}
