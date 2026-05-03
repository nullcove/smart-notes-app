import fs from "fs";
import path from "path";
import crypto from "crypto";

const DATA_DIR = path.join(process.cwd(), ".ai-data");

function ensureDir() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
}

function readJson<T>(file: string, fallback: T): T {
  try {
    const p = path.join(DATA_DIR, file);
    if (!fs.existsSync(p)) return fallback;
    return JSON.parse(fs.readFileSync(p, "utf-8")) as T;
  } catch { return fallback; }
}

function writeJson(file: string, data: unknown) {
  ensureDir();
  fs.writeFileSync(path.join(DATA_DIR, file), JSON.stringify(data, null, 2), "utf-8");
}

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ApiKeyRecord {
  id: string;
  provider: string;
  model?: string;
  key: string;
  label?: string;
  createdAt: string;
}

export interface AiSettings {
  mode: "auto" | "fixed";
  fixedProvider?: string;
  fixedModel?: string;
  lastSeen?: string;
  conversationCount: number;
}

export interface AiMemory {
  facts: string[];
  userName?: string;
  userAge?: string;
  lastUpdated?: string;
}

export interface StoredMessage {
  role: "user" | "assistant" | "tool" | "system";
  content: string | null;
  tool_calls?: Array<{ id: string; function: { name: string; arguments: string } }>;
  tool_call_id?: string;
  name?: string;
}

type KeyStore = Record<string, ApiKeyRecord[]>;
type SettingsStore = Record<string, AiSettings>;
type MemoryStore = Record<string, AiMemory>;
type ConversationStore = Record<string, StoredMessage[]>;

const MAX_STORED_MESSAGES = 60;

// ─── API Keys ─────────────────────────────────────────────────────────────────

export function getKeys(userId: string): ApiKeyRecord[] {
  const store = readJson<KeyStore>("keys.json", {});
  return store[userId] ?? [];
}

export function addKey(userId: string, record: Omit<ApiKeyRecord, "id" | "createdAt">): ApiKeyRecord {
  const store = readJson<KeyStore>("keys.json", {});
  if (!store[userId]) store[userId] = [];
  const entry: ApiKeyRecord = { ...record, id: crypto.randomUUID(), createdAt: new Date().toISOString() };
  store[userId].push(entry);
  writeJson("keys.json", store);
  return entry;
}

export function deleteKey(userId: string, keyId: string): boolean {
  const store = readJson<KeyStore>("keys.json", {});
  const before = (store[userId] ?? []).length;
  store[userId] = (store[userId] ?? []).filter(k => k.id !== keyId);
  writeJson("keys.json", store);
  return store[userId].length < before;
}

// ─── Settings ─────────────────────────────────────────────────────────────────

const DEFAULT_SETTINGS: AiSettings = { mode: "auto", conversationCount: 0 };

export function getSettings(userId: string): AiSettings {
  const store = readJson<SettingsStore>("settings.json", {});
  return { ...DEFAULT_SETTINGS, ...(store[userId] ?? {}) };
}

export function updateSettings(userId: string, patch: Partial<AiSettings>): AiSettings {
  const store = readJson<SettingsStore>("settings.json", {});
  store[userId] = { ...DEFAULT_SETTINGS, ...(store[userId] ?? {}), ...patch };
  writeJson("settings.json", store);
  return store[userId];
}

/** Returns days since last seen (0 if first visit), then updates lastSeen */
export function touchLastSeen(userId: string): number {
  const settings = getSettings(userId);
  const now = new Date();
  let daysSince = 0;
  if (settings.lastSeen) {
    const diff = now.getTime() - new Date(settings.lastSeen).getTime();
    daysSince = Math.floor(diff / (1000 * 60 * 60 * 24));
  }
  updateSettings(userId, { lastSeen: now.toISOString() });
  return daysSince;
}

// ─── Memory ───────────────────────────────────────────────────────────────────

export function getMemory(userId: string): AiMemory {
  const store = readJson<MemoryStore>("memory.json", {});
  return store[userId] ?? { facts: [] };
}

export function updateMemory(userId: string, patch: Partial<AiMemory>): AiMemory {
  const store = readJson<MemoryStore>("memory.json", {});
  store[userId] = { ...(store[userId] ?? { facts: [] }), ...patch, lastUpdated: new Date().toISOString() };
  writeJson("memory.json", store);
  return store[userId];
}

export function addMemoryFacts(userId: string, newFacts: string[]): AiMemory {
  const mem = getMemory(userId);
  const all = [...mem.facts];
  for (const f of newFacts) {
    const cleaned = f.trim();
    if (cleaned && !all.some(existing => existing.toLowerCase() === cleaned.toLowerCase())) {
      all.push(cleaned);
    }
  }
  if (all.length > 80) all.splice(0, all.length - 80);
  return updateMemory(userId, { facts: all });
}

export function clearMemory(userId: string) {
  const store = readJson<MemoryStore>("memory.json", {});
  delete store[userId];
  writeJson("memory.json", store);
}

// ─── Conversation History ─────────────────────────────────────────────────────

export function getConversation(userId: string): StoredMessage[] {
  const store = readJson<ConversationStore>("conversations.json", {});
  return store[userId] ?? [];
}

export function appendConversation(userId: string, messages: StoredMessage[]) {
  const store = readJson<ConversationStore>("conversations.json", {});
  const existing = store[userId] ?? [];
  const updated = [...existing, ...messages];
  store[userId] = updated.slice(-MAX_STORED_MESSAGES);
  writeJson("conversations.json", store);
}

export function clearConversation(userId: string) {
  const store = readJson<ConversationStore>("conversations.json", {});
  delete store[userId];
  writeJson("conversations.json", store);
}
