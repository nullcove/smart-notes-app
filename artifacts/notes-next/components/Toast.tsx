"use client";

import { useEffect, useState } from "react";
import { CheckCircle, Info, AlertTriangle, XCircle, X } from "lucide-react";

export type ToastType = "success" | "info" | "warning" | "error";

export interface ToastItem {
  id: string;
  message: string;
  type: ToastType;
  leaving?: boolean;
}

const icons = {
  success: <CheckCircle size={14} />,
  info: <Info size={14} />,
  warning: <AlertTriangle size={14} />,
  error: <XCircle size={14} />,
};

function Toast({ item, onRemove }: { item: ToastItem; onRemove: (id: string) => void }) {
  useEffect(() => {
    const t = setTimeout(() => onRemove(item.id), 3200);
    return () => clearTimeout(t);
  }, [item.id, onRemove]);

  return (
    <div className={`toast ${item.type} ${item.leaving ? "leaving" : ""}`}>
      <span className="toast-icon">{icons[item.type]}</span>
      <span style={{ flex: 1 }}>{item.message}</span>
      <button
        onClick={() => onRemove(item.id)}
        style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", display: "flex", padding: 2, borderRadius: 4 }}>
        <X size={12} />
      </button>
    </div>
  );
}

export function ToastContainer({ toasts, onRemove }: { toasts: ToastItem[]; onRemove: (id: string) => void }) {
  return (
    <div className="toast-container">
      {toasts.map(t => <Toast key={t.id} item={t} onRemove={onRemove} />)}
    </div>
  );
}
