import { type ApiKeyRecord, type AiMemory, type AiSettings, type StoredMessage } from "./store";

// ─── Tool Schemas ─────────────────────────────────────────────────────────────

const NOTE_TOOLS = [
  { type: "function", function: { name: "list_notes", description: "List all the user's notes. Returns id, title, content preview, and flags.", parameters: { type: "object", properties: {}, required: [] } } },
  { type: "function", function: { name: "create_note", description: "Create a new note with a title and content.", parameters: { type: "object", properties: { title: { type: "string" }, content: { type: "string" } }, required: ["title", "content"] } } },
  { type: "function", function: { name: "update_note", description: "Update an existing note's title, content, or flags.", parameters: { type: "object", properties: { id: { type: "string" }, title: { type: "string" }, content: { type: "string" }, starred: { type: "boolean" }, pinned: { type: "boolean" }, archived: { type: "boolean" }, trashed: { type: "boolean" } }, required: ["id"] } } },
  { type: "function", function: { name: "delete_note", description: "Permanently delete a note by ID.", parameters: { type: "object", properties: { id: { type: "string" } }, required: ["id"] } } },
  { type: "function", function: { name: "open_note", description: "Open/select a note in the editor panel.", parameters: { type: "object", properties: { id: { type: "string" } }, required: ["id"] } } },
  { type: "function", function: { name: "search_notes", description: "Search notes by keyword.", parameters: { type: "object", properties: { query: { type: "string" } }, required: ["query"] } } },
  { type: "function", function: { name: "get_note_stats", description: "Get statistics about all notes.", parameters: { type: "object", properties: {}, required: [] } } },
  { type: "function", function: { name: "duplicate_note", description: "Duplicate a note.", parameters: { type: "object", properties: { id: { type: "string" } }, required: ["id"] } } },
  { type: "function", function: { name: "bulk_update_notes", description: "Update multiple notes at once.", parameters: { type: "object", properties: { ids: { type: "array", items: { type: "string" } }, starred: { type: "boolean" }, pinned: { type: "boolean" }, archived: { type: "boolean" }, trashed: { type: "boolean" } }, required: ["ids"] } } },
];

const WEB_SEARCH_TOOL = {
  type: "function",
  function: {
    name: "web_search",
    description: "Search the web for real-time information. Use when the user asks about current events, recent news, live data, or anything that requires up-to-date information.",
    parameters: { type: "object", properties: { query: { type: "string", description: "The search query" } }, required: ["query"] },
  },
};

const ALL_TOOLS = [...NOTE_TOOLS, WEB_SEARCH_TOOL];

// ─── Model tiers ──────────────────────────────────────────────────────────────

const MODEL_TIERS: Record<string, { fast: string; balanced: string; powerful: string }> = {
  gemini: { fast: "gemini-2.0-flash", balanced: "gemini-1.5-flash", powerful: "gemini-1.5-pro" },
  groq: { fast: "llama-3.1-8b-instant", balanced: "llama3-8b-8192", powerful: "llama-3.3-70b-versatile" },
  openrouter: { fast: "google/gemma-2-9b-it:free", balanced: "mistralai/mistral-7b-instruct:free", powerful: "openai/gpt-4o-mini" },
  openai: { fast: "gpt-4o-mini", balanced: "gpt-4o-mini", powerful: "gpt-4o" },
  anthropic: { fast: "claude-3-haiku-20240307", balanced: "claude-3-5-haiku-20241022", powerful: "claude-3-5-sonnet-20241022" },
  mistral: { fast: "mistral-small-latest", balanced: "mistral-small-latest", powerful: "mistral-large-latest" },
  xai: { fast: "grok-2-1212", balanced: "grok-2-1212", powerful: "grok-2-1212" },
  cohere: { fast: "command-r", balanced: "command-r", powerful: "command-r-plus" },
};

const PROVIDER_URLS: Record<string, string> = {
  groq: "https://api.groq.com/openai/v1",
  openrouter: "https://openrouter.ai/api/v1",
  openai: "https://api.openai.com/v1",
  mistral: "https://api.mistral.ai/v1",
  xai: "https://api.x.ai/v1",
  cohere: "https://api.cohere.com/compatibility/v1",
};

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ToolCallItem {
  id: string;
  name: string;
  args: Record<string, unknown>;
}

export interface AiResponse {
  reply?: string;
  toolCalls?: ToolCallItem[];
  done: boolean;
  model: string;
  provider: string;
  usage?: { prompt: number; completion: number; total: number };
}

export interface ChatRequest {
  messages: StoredMessage[];
  userName: string;
  memory: AiMemory;
  settings: AiSettings;
  keys: ApiKeyRecord[];
  daysSinceLastSeen: number;
}

// ─── Complexity detection ──────────────────────────────────────────────────────

function detectComplexity(messages: StoredMessage[]): "fast" | "balanced" | "powerful" {
  const lastUser = [...messages].reverse().find(m => m.role === "user");
  if (!lastUser?.content) return "fast";
  const text = String(lastUser.content).toLowerCase();
  const wordCount = text.split(/\s+/).length;
  const complexKeywords = ["explain", "analyze", "write", "create", "generate", "code", "debug", "compare", "research", "summary", "translate", "essay", "detailed", "complex", "advanced"];
  const hasComplex = complexKeywords.some(k => text.includes(k));
  if (wordCount > 80 || hasComplex) return "powerful";
  if (wordCount > 30) return "balanced";
  return "fast";
}

// ─── Model selection ──────────────────────────────────────────────────────────

function selectKeyAndModel(
  keys: ApiKeyRecord[],
  settings: AiSettings,
  complexity: "fast" | "balanced" | "powerful",
): { key: ApiKeyRecord; model: string } | null {
  if (!keys.length) return null;

  if (settings.mode === "fixed" && settings.fixedProvider && settings.fixedModel) {
    const k = keys.find(k => k.provider === settings.fixedProvider);
    if (k) return { key: k, model: settings.fixedModel };
  }

  const shuffle = (arr: ApiKeyRecord[]) => [...arr].sort(() => Math.random() - 0.5);
  const shuffled = shuffle(keys);

  const priorityOrder: string[] = complexity === "powerful"
    ? ["gemini", "openai", "anthropic", "groq", "openrouter", "mistral", "xai", "cohere"]
    : complexity === "balanced"
      ? ["gemini", "groq", "openrouter", "openai", "anthropic", "mistral", "xai", "cohere"]
      : ["groq", "gemini", "openrouter", "mistral", "openai", "anthropic", "xai", "cohere"];

  for (const provider of priorityOrder) {
    const match = shuffled.find(k => k.provider === provider);
    if (match) {
      const model = match.model || MODEL_TIERS[provider]?.[complexity] || MODEL_TIERS[provider]?.fast || "unknown";
      return { key: match, model };
    }
  }

  const first = shuffled[0];
  const model = first.model || MODEL_TIERS[first.provider]?.[complexity] || "unknown";
  return { key: first, model };
}

// ─── System prompt ────────────────────────────────────────────────────────────

function buildSystemPrompt(memory: AiMemory, userName: string, daysSinceLastSeen: number): string {
  const base = `You are the sharpest, most intelligent AI assistant inside Smart Ins-Note — a personal notes app. You act immediately and decisively. You understand natural language perfectly — including Bengali/Bangla — and you never ask unnecessary questions.

## CORE RULES
1. **Act first, never ask.** Create notes right now with content you generate yourself. Don't ask "what should the content be?"
2. **Fill in everything with intelligence.** No title? Invent one. No content? Write something rich and relevant.
3. **Always call list_notes BEFORE deleting or updating** — get the current note IDs first, never assume.
4. **Understand temporal references perfectly:**
   - "first created" = note with the lowest index (sorted by createdAt ascending). Index 1 = oldest.
   - "last created" / "most recent" = note with the highest index. Last index = newest.
5. **Be concise.** One short sentence after acting. No lengthy explanations.
6. **Respond in the same language as the user.** If they write in Bengali, respond in Bengali.
7. **Use web_search** when the user asks about current events, news, live prices, or real-time data.

## TOOLS
- list_notes — always call before delete/update
- create_note(title, content) — create immediately
- update_note(id, fields) — update title/content/starred/pinned/archived/trashed
- delete_note(id) — permanently delete
- open_note(id) — open in editor
- search_notes(query) — search by keyword
- get_note_stats() — get statistics
- duplicate_note(id) — create a copy
- bulk_update_notes(ids, fields) — update multiple notes
- web_search(query) — search the web for real-time information`;

  const parts = [base];

  if (memory.facts.length > 0 || memory.userName) {
    parts.push("\n## What you know about this user:");
    if (memory.userName) parts.push(`- Name: ${memory.userName}`);
    if (memory.userAge) parts.push(`- Age: ${memory.userAge}`);
    for (const fact of memory.facts.slice(-40)) {
      parts.push(`- ${fact}`);
    }
  } else {
    parts.push("\n## About this user:");
    parts.push(`- Name: ${userName} (from their account)`);
    parts.push("- You are just getting to know them. Learn their preferences over time.");
  }

  if (daysSinceLastSeen >= 5) {
    parts.push(`\n## IMPORTANT — Activity Alert:`);
    parts.push(`This user has been away for ${daysSinceLastSeen} days! Start your response by warmly checking in — ask where they've been, if everything is okay, and express that you missed them. Be warm and personal, not robotic.`);
  }

  parts.push(`\nToday's date: ${new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}`);

  return parts.join("\n");
}

// ─── Web Search ───────────────────────────────────────────────────────────────

async function webSearch(query: string): Promise<string> {
  try {
    const url = `https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json&no_html=1&skip_disambig=1&no_redirect=1`;
    const res = await fetch(url, { headers: { "User-Agent": "SmartInsNote/1.0" } });
    if (!res.ok) return `Web search failed: HTTP ${res.status}`;
    const data = await res.json() as {
      Abstract?: string;
      AbstractText?: string;
      AbstractURL?: string;
      Answer?: string;
      Heading?: string;
      RelatedTopics?: Array<{ Text?: string; FirstURL?: string }>;
    };
    const parts: string[] = [];
    if (data.Answer) parts.push(`Answer: ${data.Answer}`);
    if (data.AbstractText) parts.push(`Summary: ${data.AbstractText}${data.AbstractURL ? ` (Source: ${data.AbstractURL})` : ""}`);
    if (data.RelatedTopics?.length) {
      const related = data.RelatedTopics.slice(0, 4).map(t => t.Text).filter(Boolean);
      if (related.length) parts.push(`Related: ${related.join(" | ")}`);
    }
    return parts.length > 0 ? parts.join("\n") : `No instant answer found for "${query}". Using knowledge up to training cutoff.`;
  } catch (e) {
    return `Search error: ${e instanceof Error ? e.message : "unknown"}`;
  }
}

// ─── Provider calls ───────────────────────────────────────────────────────────

async function callOpenAICompat(
  baseUrl: string, apiKey: string, model: string, messages: StoredMessage[], maxTokens = 2000
): Promise<AiResponse & { nextMessages?: StoredMessage[] }> {
  const res = await fetch(`${baseUrl}/chat/completions`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({ model, messages, tools: ALL_TOOLS, tool_choice: "auto", max_tokens: maxTokens }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({})) as { error?: { message?: string; code?: string } };
    const msg = err?.error?.message ?? `HTTP ${res.status}`;
    throw Object.assign(new Error(msg), { status: res.status, code: err?.error?.code });
  }
  const data = await res.json() as {
    choices: Array<{ message: { role: string; content: string | null; tool_calls?: Array<{ id: string; type: string; function: { name: string; arguments: string } }> }; finish_reason: string }>;
    usage?: { prompt_tokens: number; completion_tokens: number; total_tokens: number };
  };
  const msg = data.choices[0].message;
  const usage = data.usage ? { prompt: data.usage.prompt_tokens, completion: data.usage.completion_tokens, total: data.usage.total_tokens } : undefined;

  if (msg.tool_calls?.length) {
    const webSearchCalls = msg.tool_calls.filter(tc => tc.function.name === "web_search");
    const noteCalls = msg.tool_calls.filter(tc => tc.function.name !== "web_search");

    if (webSearchCalls.length > 0) {
      const assistantMsg: StoredMessage = { role: "assistant", content: msg.content, tool_calls: msg.tool_calls.map(tc => ({ id: tc.id, function: { name: tc.function.name, arguments: tc.function.arguments } })) };
      const toolResponses: StoredMessage[] = [];
      for (const tc of webSearchCalls) {
        let query = "";
        try { query = (JSON.parse(tc.function.arguments) as { query?: string }).query ?? ""; } catch { query = ""; }
        const result = await webSearch(query);
        toolResponses.push({ role: "tool", content: result, tool_call_id: tc.id, name: "web_search" });
      }
      return { done: false, model, provider: "", usage, nextMessages: [assistantMsg, ...toolResponses] };
    }

    if (noteCalls.length > 0) {
      return {
        done: false,
        model,
        provider: "",
        usage,
        toolCalls: noteCalls.map(tc => {
          let args: Record<string, unknown> = {};
          try { args = JSON.parse(tc.function.arguments) as Record<string, unknown>; } catch { args = {}; }
          return { id: tc.id, name: tc.function.name, args };
        }),
      };
    }
  }

  return { reply: msg.content ?? "", done: true, model, provider: "", usage };
}

async function callGemini(
  apiKey: string, model: string, messages: StoredMessage[]
): Promise<AiResponse & { nextMessages?: StoredMessage[] }> {
  const systemMsg = messages.find(m => m.role === "system");
  const systemInstruction = systemMsg ? { parts: [{ text: String(systemMsg.content) }] } : undefined;
  const functionDeclarations = ALL_TOOLS.map(t => ({ name: t.function.name, description: t.function.description, parameters: t.function.parameters }));

  const toGeminiPart = (msg: StoredMessage) => {
    if (msg.role === "tool") return { role: "user", parts: [{ functionResponse: { name: msg.name ?? "", response: { result: msg.content } } }] };
    if (msg.tool_calls?.length) return { role: "model", parts: [...(msg.content ? [{ text: msg.content }] : []), ...msg.tool_calls.map(tc => ({ functionCall: { name: tc.function.name, args: (() => { try { return JSON.parse(tc.function.arguments) as unknown; } catch { return {}; } })() } }))] };
    return { role: msg.role === "assistant" ? "model" : "user", parts: [{ text: String(msg.content ?? "") }] };
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const contents: any[] = messages.filter(m => m.role !== "system").map(toGeminiPart);
  const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ contents, tools: [{ functionDeclarations }], ...(systemInstruction ? { systemInstruction } : {}), generationConfig: { maxOutputTokens: 2000 } }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({})) as { error?: { message?: string; code?: number } };
    const msg = err?.error?.message ?? `HTTP ${res.status}`;
    throw Object.assign(new Error(msg), { status: res.status });
  }
  const data = await res.json() as {
    candidates: Array<{ content: { parts: Array<{ text?: string; functionCall?: { name: string; args: Record<string, unknown> } }> }; finishReason: string }>;
    usageMetadata?: { promptTokenCount: number; candidatesTokenCount: number; totalTokenCount: number };
  };
  const usage = data.usageMetadata ? { prompt: data.usageMetadata.promptTokenCount, completion: data.usageMetadata.candidatesTokenCount, total: data.usageMetadata.totalTokenCount } : undefined;
  const parts = data.candidates[0].content.parts;
  const textParts = parts.filter(p => p.text).map(p => p.text ?? "");
  const fnCalls = parts.filter(p => p.functionCall);

  if (fnCalls.length > 0) {
    const webCalls = fnCalls.filter(p => p.functionCall!.name === "web_search");
    const noteCalls = fnCalls.filter(p => p.functionCall!.name !== "web_search");

    const assistantMsg: StoredMessage = {
      role: "assistant", content: textParts.join("\n") || null,
      tool_calls: fnCalls.map((fc, i) => ({ id: `gemini-${i}`, function: { name: fc.functionCall!.name, arguments: JSON.stringify(fc.functionCall!.args) } })),
    };

    if (webCalls.length > 0) {
      const toolResponses: StoredMessage[] = [];
      for (let i = 0; i < webCalls.length; i++) {
        const fc = webCalls[i];
        const result = await webSearch(String((fc.functionCall!.args as { query?: string }).query ?? ""));
        toolResponses.push({ role: "tool", content: result, tool_call_id: `gemini-${fnCalls.indexOf(fc)}`, name: "web_search" });
      }
      return { done: false, model, provider: "", usage, nextMessages: [assistantMsg, ...toolResponses] };
    }

    if (noteCalls.length > 0) {
      return {
        done: false, model, provider: "", usage,
        toolCalls: noteCalls.map((fc, i) => ({ id: `gemini-${fnCalls.indexOf(fc)}`, name: fc.functionCall!.name, args: fc.functionCall!.args })),
      };
    }
  }

  return { reply: textParts.join("\n"), done: true, model, provider: "", usage };
}

async function callAnthropic(
  apiKey: string, model: string, messages: StoredMessage[]
): Promise<AiResponse & { nextMessages?: StoredMessage[] }> {
  const systemMsg = messages.find(m => m.role === "system");
  const anthropicTools = ALL_TOOLS.map(t => ({ name: t.function.name, description: t.function.description, input_schema: t.function.parameters }));
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const msgs: any[] = messages.filter(m => m.role !== "system").map(m => {
    if (m.role === "tool") return { role: "user", content: [{ type: "tool_result", tool_use_id: m.tool_call_id, content: m.content ?? "" }] };
    if (m.tool_calls?.length) return { role: "assistant", content: [...(m.content ? [{ type: "text", text: m.content }] : []), ...m.tool_calls.map(tc => ({ type: "tool_use", id: tc.id, name: tc.function.name, input: (() => { try { return JSON.parse(tc.function.arguments) as unknown; } catch { return {}; } })() }))] };
    return { role: m.role, content: m.content ?? "" };
  });

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-api-key": apiKey, "anthropic-version": "2023-06-01" },
    body: JSON.stringify({ model, max_tokens: 2000, ...(systemMsg ? { system: systemMsg.content } : {}), messages: msgs, tools: anthropicTools }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({})) as { error?: { message?: string } };
    throw new Error(err?.error?.message ?? `HTTP ${res.status}`);
  }
  const data = await res.json() as { content: Array<{ type: string; text?: string; id?: string; name?: string; input?: Record<string, unknown> }>; stop_reason: string; usage?: { input_tokens: number; output_tokens: number } };
  const usage = data.usage ? { prompt: data.usage.input_tokens, completion: data.usage.output_tokens, total: data.usage.input_tokens + data.usage.output_tokens } : undefined;
  const textParts = data.content.filter(c => c.type === "text").map(c => c.text ?? "");
  const toolUses = data.content.filter(c => c.type === "tool_use");

  if (toolUses.length > 0) {
    const webCalls = toolUses.filter(tu => tu.name === "web_search");
    const noteCalls = toolUses.filter(tu => tu.name !== "web_search");
    const assistantMsg: StoredMessage = { role: "assistant", content: textParts.join("\n") || null, tool_calls: toolUses.map(tu => ({ id: tu.id!, function: { name: tu.name!, arguments: JSON.stringify(tu.input) } })) };

    if (webCalls.length > 0) {
      const toolResponses: StoredMessage[] = [];
      for (const tu of webCalls) {
        const result = await webSearch(String((tu.input as { query?: string })?.query ?? ""));
        toolResponses.push({ role: "tool", content: result, tool_call_id: tu.id, name: "web_search" });
      }
      return { done: false, model, provider: "", usage, nextMessages: [assistantMsg, ...toolResponses] };
    }

    if (noteCalls.length > 0) {
      return {
        done: false, model, provider: "", usage,
        toolCalls: noteCalls.map(tu => ({ id: tu.id!, name: tu.name!, args: tu.input ?? {} })),
      };
    }
  }

  return { reply: textParts.join("\n"), done: true, model, provider: "", usage };
}

// ─── Main router ──────────────────────────────────────────────────────────────

export async function routeAI(req: ChatRequest): Promise<AiResponse & { nextMessages?: StoredMessage[] }> {
  const { messages, userName, memory, settings, keys, daysSinceLastSeen } = req;
  if (!keys.length) throw new Error("NO_KEYS");

  const complexity = detectComplexity(messages);
  const selected = selectKeyAndModel(keys, settings, complexity);
  if (!selected) throw new Error("NO_KEYS");

  const { key, model } = selected;
  const provider = key.provider;

  const systemPrompt = buildSystemPrompt(memory, userName, daysSinceLastSeen);
  const messagesWithSystem: StoredMessage[] = [{ role: "system", content: systemPrompt }, ...messages.filter(m => m.role !== "system")];

  let result: AiResponse & { nextMessages?: StoredMessage[] };

  if (provider === "gemini") {
    result = await callGemini(key.key, model, messagesWithSystem);
  } else if (provider === "anthropic") {
    result = await callAnthropic(key.key, model, messagesWithSystem);
  } else {
    const baseUrl = PROVIDER_URLS[provider] ?? "https://api.openai.com/v1";
    result = await callOpenAICompat(baseUrl, key.key, model, messagesWithSystem);
  }

  result.provider = provider;
  result.model = model;
  return result;
}

// ─── Memory extraction ────────────────────────────────────────────────────────

export async function extractMemoryFacts(
  userMessage: string,
  aiReply: string,
  existingFacts: string[],
  key: ApiKeyRecord,
): Promise<string[]> {
  try {
    const prompt = `You are a memory extractor. Given a conversation snippet, extract NEW facts about the USER (not the AI). Focus on: name, age, location, profession, hobbies, preferences, relationships, goals, struggles, language preference, etc.

Existing known facts:
${existingFacts.slice(-20).map(f => `- ${f}`).join("\n") || "(none yet)"}

Conversation:
User: ${userMessage}
Assistant: ${aiReply}

Output ONLY a JSON array of NEW facts not already in the existing list. If nothing new, return [].
Example: ["User prefers Bengali responses", "User is a student", "User likes music"]
Return ONLY the JSON array, no explanation.`;

    let raw = "";
    if (key.provider === "gemini") {
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${key.key}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents: [{ role: "user", parts: [{ text: prompt }] }], generationConfig: { maxOutputTokens: 500 } }),
      });
      if (res.ok) {
        const data = await res.json() as { candidates: Array<{ content: { parts: Array<{ text?: string }> } }> };
        raw = data.candidates[0]?.content?.parts?.[0]?.text ?? "[]";
      }
    } else {
      const baseUrl = PROVIDER_URLS[key.provider] ?? "https://api.openai.com/v1";
      const model = MODEL_TIERS[key.provider]?.fast ?? key.model ?? "unknown";
      const res = await fetch(`${baseUrl}/chat/completions`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${key.key}` },
        body: JSON.stringify({ model, messages: [{ role: "user", content: prompt }], max_tokens: 300 }),
      });
      if (res.ok) {
        const data = await res.json() as { choices: Array<{ message: { content: string } }> };
        raw = data.choices[0]?.message?.content ?? "[]";
      }
    }

    const match = raw.match(/\[[\s\S]*\]/);
    if (!match) return [];
    const facts = JSON.parse(match[0]) as unknown[];
    return facts.filter(f => typeof f === "string") as string[];
  } catch {
    return [];
  }
}
