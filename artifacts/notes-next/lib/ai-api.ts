"use client";
import { getToken } from "./auth";

const API = "/api/ai";

function authHeaders(): Record<string, string> {
  const token = getToken();
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

// ─── Types ────────────────────────────────────────────────────────────────────

export interface AiMessage {
  role: "user" | "assistant" | "tool" | "system";
  content: string | null;
  tool_calls?: Array<{ id: string; function: { name: string; arguments: string } }>;
  tool_call_id?: string;
  name?: string;
}

export interface AiToolCall {
  id: string;
  name: string;
  args: Record<string, unknown>;
}

export interface AiChatResponse {
  reply?: string;
  toolCalls?: AiToolCall[];
  done: boolean;
  model: string;
  provider: string;
  usage?: { prompt: number; completion: number; total: number };
  nextMessages?: AiMessage[];
}

export interface AiApiKey {
  id: string;
  provider: string;
  model?: string;
  label?: string;
  keyMasked: string;
  createdAt: string;
}

export interface AiSettings {
  mode: "auto" | "fixed";
  fixedProvider?: string;
  fixedModel?: string;
  conversationCount: number;
}

export interface AiMemory {
  facts: string[];
  userName?: string;
  userAge?: string;
  lastUpdated?: string;
}

export interface AiErrorInfo {
  provider: string;
  model: string;
  message: string;
  code?: string;
}

// ─── Chat ─────────────────────────────────────────────────────────────────────

export async function aiChat(payload: {
  message?: string;
  history: AiMessage[];
  toolResults?: Array<{ id: string; name: string; result: string }>;
}): Promise<AiChatResponse> {
  const res = await fetch(`${API}/chat`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(payload),
  });
  const data = await res.json() as AiChatResponse & { error?: string };
  if (!res.ok) throw Object.assign(new Error(data.error ?? `HTTP ${res.status}`), data);
  return data;
}

// ─── Keys ─────────────────────────────────────────────────────────────────────

export async function getAiKeys(): Promise<AiApiKey[]> {
  const res = await fetch(`${API}/keys`, { headers: authHeaders() });
  if (!res.ok) return [];
  return res.json();
}

export async function addAiKey(data: { provider: string; model?: string; key: string; label?: string }): Promise<AiApiKey> {
  const res = await fetch(`${API}/keys`, { method: "POST", headers: authHeaders(), body: JSON.stringify(data) });
  const body = await res.json() as AiApiKey & { error?: string };
  if (!res.ok) throw new Error(body.error ?? "Failed to add key");
  return body;
}

export async function deleteAiKey(id: string): Promise<void> {
  const res = await fetch(`${API}/keys/${id}`, { method: "DELETE", headers: authHeaders() });
  if (!res.ok) throw new Error("Failed to delete key");
}

// ─── Settings ─────────────────────────────────────────────────────────────────

export async function getAiSettings(): Promise<AiSettings> {
  const res = await fetch(`${API}/settings`, { headers: authHeaders() });
  if (!res.ok) return { mode: "auto", conversationCount: 0 };
  return res.json();
}

export async function updateAiSettings(data: Partial<AiSettings>): Promise<AiSettings> {
  const res = await fetch(`${API}/settings`, { method: "PATCH", headers: authHeaders(), body: JSON.stringify(data) });
  const body = await res.json() as AiSettings & { error?: string };
  if (!res.ok) throw new Error(body.error ?? "Failed to update settings");
  return body;
}

// ─── Memory ───────────────────────────────────────────────────────────────────

export async function getAiMemory(): Promise<AiMemory> {
  const res = await fetch(`${API}/memory`, { headers: authHeaders() });
  if (!res.ok) return { facts: [] };
  return res.json();
}

export async function clearAiMemory(): Promise<void> {
  await fetch(`${API}/memory`, { method: "DELETE", headers: authHeaders() });
}

export async function clearAiConversation(): Promise<void> {
  await fetch(`${API}/conversation`, { method: "DELETE", headers: authHeaders() });
}

// ─── Provider display names ───────────────────────────────────────────────────

export const PROVIDER_LABELS: Record<string, string> = {
  gemini: "Gemini",
  groq: "Groq",
  openrouter: "OpenRouter",
  openai: "OpenAI",
  anthropic: "Anthropic",
  mistral: "Mistral",
  xai: "xAI Grok",
  cohere: "Cohere",
};

export const PROVIDER_COLORS: Record<string, string> = {
  gemini: "#4285f4",
  groq: "#f55036",
  openrouter: "#7c3aed",
  openai: "#10a37f",
  anthropic: "#d97706",
  mistral: "#0ea5e9",
  xai: "#1a1a1a",
  cohere: "#39d353",
};

export const DEFAULT_MODELS: Record<string, string[]> = {
  gemini: ["gemini-2.0-flash", "gemini-1.5-flash", "gemini-1.5-pro", "gemini-2.5-pro"],
  groq: ["llama-3.1-8b-instant", "llama3-8b-8192", "llama-3.3-70b-versatile", "gemma2-9b-it", "mixtral-8x7b-32768"],
  openrouter: ["google/gemma-2-9b-it:free", "mistralai/mistral-7b-instruct:free", "openai/gpt-4o-mini", "anthropic/claude-3.5-haiku"],
  openai: ["gpt-4o-mini", "gpt-4o", "gpt-4-turbo"],
  anthropic: ["claude-3-haiku-20240307", "claude-3-5-haiku-20241022", "claude-3-5-sonnet-20241022"],
  mistral: ["mistral-small-latest", "mistral-medium-latest", "mistral-large-latest"],
  xai: ["grok-2-1212", "grok-2-vision-1212"],
  cohere: ["command-r", "command-r-plus"],
};
