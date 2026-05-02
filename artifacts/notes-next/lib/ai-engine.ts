"use client";
// ─── Active provider storage ──────────────────────────────────────────────────

const LS = "smart-ins-note-ai-";
const ACTIVE_KEY = `${LS}active`;

export interface ActiveProvider {
  provider: string; // "openai" | "anthropic" | "gemini" | "groq" | "mistral" | "openrouter" | "xai" | "cohere" | "ollama"
  model: string;
}

export function getActiveProvider(): ActiveProvider | null {
  if (typeof window === "undefined") return null;
  try { return JSON.parse(localStorage.getItem(ACTIVE_KEY) ?? "null"); } catch { return null; }
}

export function setActiveProvider(p: ActiveProvider) {
  localStorage.setItem(ACTIVE_KEY, JSON.stringify(p));
}

function getStoredKey(id: string): string {
  return localStorage.getItem(`${LS}${id}`) ?? "";
}

function getOllamaUrl(): string {
  return localStorage.getItem(`${LS}ollama-url`) ?? "";
}

// ─── Note tool types ──────────────────────────────────────────────────────────

export interface NoteRef { id: string; title: string; content: string; createdAt?: string; updatedAt?: string; starred?: boolean; pinned?: boolean; archived?: boolean; trashed?: boolean; }

export interface ToolCallbacks {
  listNotes: () => NoteRef[];
  createNote: (title: string, content: string) => Promise<NoteRef>;
  updateNote: (id: string, fields: Partial<NoteRef>) => Promise<NoteRef>;
  deleteNote: (id: string) => Promise<void>;
  openNote: (id: string) => void;
}

export interface AIResult {
  reply: string;
  toolCalls: string[];
  usage?: { prompt: number; completion: number; total: number };
  durationMs: number;
}

// ─── Tool definitions (OpenAI format) ────────────────────────────────────────

export const TOOLS_OPENAI = [
  {
    type: "function",
    function: {
      name: "list_notes",
      description: "List all the user's notes. Returns id, title, content preview, and flags.",
      parameters: { type: "object", properties: {}, required: [] },
    },
  },
  {
    type: "function",
    function: {
      name: "create_note",
      description: "Create a new note with a title and content.",
      parameters: {
        type: "object",
        properties: {
          title: { type: "string", description: "The note title" },
          content: { type: "string", description: "The note content (plain text or markdown)" },
        },
        required: ["title", "content"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "update_note",
      description: "Update an existing note's title, content, or flags (starred, pinned, archived, trashed).",
      parameters: {
        type: "object",
        properties: {
          id: { type: "string", description: "The note ID" },
          title: { type: "string" },
          content: { type: "string" },
          starred: { type: "boolean" },
          pinned: { type: "boolean" },
          archived: { type: "boolean" },
          trashed: { type: "boolean" },
        },
        required: ["id"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "delete_note",
      description: "Permanently delete a note by ID.",
      parameters: {
        type: "object",
        properties: { id: { type: "string", description: "The note ID to delete" } },
        required: ["id"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "open_note",
      description: "Open/select a note in the editor panel.",
      parameters: {
        type: "object",
        properties: { id: { type: "string", description: "The note ID to open" } },
        required: ["id"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "search_notes",
      description: "Search notes by keyword in title or content.",
      parameters: {
        type: "object",
        properties: { query: { type: "string" } },
        required: ["query"],
      },
    },
  },
];

// ─── Tool executor ────────────────────────────────────────────────────────────

export async function executeTool(
  name: string,
  args: Record<string, unknown>,
  cb: ToolCallbacks,
): Promise<string> {
  try {
    if (name === "list_notes") {
      const notes = cb.listNotes();
      if (notes.length === 0) return "No notes found.";
      // Sort by createdAt ascending so index 0 = oldest (first created)
      const sorted = [...notes].sort((a, b) => {
        if (!a.createdAt && !b.createdAt) return 0;
        if (!a.createdAt) return 1;
        if (!b.createdAt) return -1;
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      });
      return JSON.stringify(sorted.map((n, i) => ({
        index: i + 1, // 1 = first/oldest created
        id: n.id,
        title: n.title || "(Untitled)",
        preview: n.content.slice(0, 80),
        createdAt: n.createdAt ?? null,
        starred: n.starred,
        pinned: n.pinned,
        archived: n.archived,
        trashed: n.trashed,
      })));
    }
    if (name === "create_note") {
      const note = await cb.createNote(String(args.title ?? ""), String(args.content ?? ""));
      return JSON.stringify({ success: true, id: note.id, title: note.title });
    }
    if (name === "update_note") {
      const { id, ...fields } = args as { id: string } & Partial<NoteRef>;
      const note = await cb.updateNote(id, fields);
      return JSON.stringify({ success: true, id: note.id, title: note.title });
    }
    if (name === "delete_note") {
      await cb.deleteNote(String(args.id));
      return JSON.stringify({ success: true });
    }
    if (name === "open_note") {
      cb.openNote(String(args.id));
      return JSON.stringify({ success: true });
    }
    if (name === "search_notes") {
      const q = String(args.query ?? "").toLowerCase();
      const results = cb.listNotes().filter(n =>
        n.title.toLowerCase().includes(q) || n.content.toLowerCase().includes(q)
      );
      return results.length === 0
        ? "No matching notes."
        : JSON.stringify(results.map(n => ({ id: n.id, title: n.title || "(Untitled)", preview: n.content.slice(0, 80) })));
    }
    return "Unknown tool.";
  } catch (e: unknown) {
    return `Error: ${e instanceof Error ? e.message : String(e)}`;
  }
}

// ─── Message types ────────────────────────────────────────────────────────────

export type Role = "system" | "user" | "assistant" | "tool";
export interface ChatMessage {
  role: Role;
  content: string | null;
  tool_calls?: Array<{ id: string; function: { name: string; arguments: string } }>;
  tool_call_id?: string;
  name?: string;
}

const SYSTEM_PROMPT = `You are the sharpest, most intelligent AI assistant inside Smart Ins-Note. You act immediately and decisively. You understand natural language perfectly — including Bengali/Bangla — and you never ask unnecessary questions.

## CORE RULES

1. **Act first, never ask.** Create notes right now with content you generate yourself. Don't ask "what should the content be?"
2. **Fill in everything with intelligence.** No title? Invent one. No content? Write something rich and relevant. You are smart.
3. **Always call list_notes BEFORE deleting or updating** — get the current note IDs first, never assume.
4. **Understand temporal references perfectly:**
   - "first created" / "1st create kora" / "প্রথম তৈরি" = note with the lowest index (sorted by createdAt ascending). Index 1 = oldest.
   - "last created" / "most recent" / "সর্বশেষ" = note with the highest index. Last index = newest.
   - "first 2 created" / "প্রথম ২টা" = index 1 and index 2.
   - "this session এ create kora" = notes created recently (check createdAt timestamps).
5. **Be concise.** One short sentence after acting. No lengthy explanations.
6. **Respond in the same language as the user.** If they write in Bengali, respond in Bengali.
7. **Only ask a question if TRULY unresolvable** — e.g. "delete it" with absolutely zero context.

## HOW TO HANDLE REQUESTS

### Creating notes
- "create note bangladesh" → create_note(title="Bangladesh", content="...generated content...") immediately
- "random note" → invent creative title and content, create immediately
- "bangla te gorur rochona" → create a full Bengali cow essay as note content
- Never ask for content or title — generate them yourself

### Deleting notes
- ALWAYS call list_notes first to get current IDs and their index
- "1st create kora note delete koro" → list_notes → pick index:1 note → delete_note(id)
- "first 2 ta delete koro" → list_notes → pick index:1 and index:2 → delete both
- "last note delete koro" → list_notes → pick highest index → delete_note(id)
- After deleting, confirm with the note title

### Searching/finding notes
- "X note ta khuj" → search_notes(query="X")
- "starred notes" → list_notes, filter where starred=true

### Updating
- "star koro" / "star daw" → find note, update_note(id, starred=true)
- "pin koro" → update_note(id, pinned=true)

## DATA FORMAT from list_notes
Each note has: { index, id, title, preview, createdAt, starred, pinned, archived, trashed }
- index: 1 = first/oldest created, highest = most recently created
- Use index to understand "first", "second", "last" references

## TOOLS
- list_notes — always call this before delete/update to get fresh IDs
- create_note(title, content) — create immediately with generated content
- update_note(id, fields) — update title/content/starred/pinned/archived/trashed
- delete_note(id) — permanently delete; call list_notes first to get the right ID
- open_note(id) — open in editor
- search_notes(query) — search by keyword

Always take real action via tools. Never claim to do something without calling the tool.`;

// ─── OpenAI-compatible call ────────────────────────────────────────────────────

async function callOpenAICompat(
  baseUrl: string,
  apiKey: string,
  model: string,
  messages: ChatMessage[],
  cb: ToolCallbacks,
): Promise<AIResult> {
  const startMs = Date.now();
  const toolCallNames: string[] = [];
  let totalPrompt = 0, totalCompletion = 0, totalTokens = 0;
  let msgs = [...messages];
  for (let i = 0; i < 8; i++) {
    const res = await fetch(`${baseUrl}/chat/completions`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({ model, messages: msgs, tools: TOOLS_OPENAI, tool_choice: "auto", max_tokens: 2000 }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({})) as { error?: { message?: string } };
      throw new Error(err?.error?.message ?? `HTTP ${res.status}`);
    }
    const data = await res.json() as {
      choices: Array<{ message: { role: string; content: string | null; tool_calls?: Array<{ id: string; type: string; function: { name: string; arguments: string } }> }; finish_reason: string }>;
      usage?: { prompt_tokens: number; completion_tokens: number; total_tokens: number };
    };
    if (data.usage) { totalPrompt += data.usage.prompt_tokens; totalCompletion += data.usage.completion_tokens; totalTokens += data.usage.total_tokens; }
    const msg = data.choices[0].message;
    msgs.push({ role: "assistant", content: msg.content, tool_calls: msg.tool_calls });
    if (!msg.tool_calls?.length) {
      return { reply: msg.content ?? "", toolCalls: toolCallNames, usage: totalTokens ? { prompt: totalPrompt, completion: totalCompletion, total: totalTokens } : undefined, durationMs: Date.now() - startMs };
    }
    for (const tc of msg.tool_calls) {
      toolCallNames.push(tc.function.name);
      let args: Record<string, unknown> = {};
      try { args = JSON.parse(tc.function.arguments); } catch { args = {}; }
      const result = await executeTool(tc.function.name, args, cb);
      msgs.push({ role: "tool", content: result, tool_call_id: tc.id, name: tc.function.name });
    }
  }
  return { reply: "Reached maximum tool call depth.", toolCalls: toolCallNames, usage: totalTokens ? { prompt: totalPrompt, completion: totalCompletion, total: totalTokens } : undefined, durationMs: Date.now() - startMs };
}

// ─── Anthropic call ────────────────────────────────────────────────────────────

async function callAnthropic(
  apiKey: string,
  model: string,
  messages: ChatMessage[],
  cb: ToolCallbacks,
): Promise<AIResult> {
  const startMs = Date.now();
  const toolCallNames: string[] = [];
  let totalPrompt = 0, totalCompletion = 0;
  const anthropicTools = TOOLS_OPENAI.map(t => ({ name: t.function.name, description: t.function.description, input_schema: t.function.parameters }));
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const msgs: any[] = messages.filter(m => m.role !== "system").map(m => {
    if (m.role === "tool") return { role: "user", content: [{ type: "tool_result", tool_use_id: m.tool_call_id, content: m.content ?? "" }] };
    if (m.tool_calls?.length) return { role: "assistant", content: [...(m.content ? [{ type: "text", text: m.content }] : []), ...m.tool_calls.map(tc => ({ type: "tool_use", id: tc.id, name: tc.function.name, input: JSON.parse(tc.function.arguments || "{}") }))] };
    return { role: m.role, content: m.content ?? "" };
  });
  for (let i = 0; i < 8; i++) {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-api-key": apiKey, "anthropic-version": "2023-06-01" },
      body: JSON.stringify({ model, max_tokens: 2000, system: SYSTEM_PROMPT, messages: msgs, tools: anthropicTools }),
    });
    if (!res.ok) { const err = await res.json().catch(() => ({})) as { error?: { message?: string } }; throw new Error(err?.error?.message ?? `HTTP ${res.status}`); }
    const data = await res.json() as { content: Array<{ type: string; text?: string; id?: string; name?: string; input?: Record<string, unknown> }>; stop_reason: string; usage?: { input_tokens: number; output_tokens: number } };
    if (data.usage) { totalPrompt += data.usage.input_tokens; totalCompletion += data.usage.output_tokens; }
    const textParts = data.content.filter(c => c.type === "text").map(c => c.text ?? "");
    const toolUses = data.content.filter(c => c.type === "tool_use");
    msgs.push({ role: "assistant", content: data.content });
    if (!toolUses.length) {
      const total = totalPrompt + totalCompletion;
      return { reply: textParts.join("\n"), toolCalls: toolCallNames, usage: total ? { prompt: totalPrompt, completion: totalCompletion, total } : undefined, durationMs: Date.now() - startMs };
    }
    const toolResults = [];
    for (const tu of toolUses) {
      toolCallNames.push(tu.name ?? "");
      const result = await executeTool(tu.name ?? "", tu.input ?? {}, cb);
      toolResults.push({ type: "tool_result", tool_use_id: tu.id, content: result });
    }
    msgs.push({ role: "user", content: toolResults });
  }
  const total = totalPrompt + totalCompletion;
  return { reply: "Reached maximum tool call depth.", toolCalls: toolCallNames, usage: total ? { prompt: totalPrompt, completion: totalCompletion, total } : undefined, durationMs: Date.now() - startMs };
}

// ─── Gemini call ──────────────────────────────────────────────────────────────

async function callGemini(
  apiKey: string,
  model: string,
  messages: ChatMessage[],
  cb: ToolCallbacks,
): Promise<AIResult> {
  const startMs = Date.now();
  const toolCallNames: string[] = [];
  let totalPrompt = 0, totalCompletion = 0, totalTokens = 0;
  const functionDeclarations = TOOLS_OPENAI.map(t => ({ name: t.function.name, description: t.function.description, parameters: t.function.parameters }));
  const toGeminiParts = (msg: ChatMessage) => {
    if (msg.role === "tool") return { role: "user", parts: [{ functionResponse: { name: msg.name ?? "", response: { result: msg.content } } }] };
    if (msg.tool_calls?.length) return { role: "model", parts: [...(msg.content ? [{ text: msg.content }] : []), ...msg.tool_calls.map(tc => ({ functionCall: { name: tc.function.name, args: JSON.parse(tc.function.arguments || "{}") } }))] };
    return { role: msg.role === "assistant" ? "model" : "user", parts: [{ text: msg.content ?? "" }] };
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const contents: any[] = messages.filter(m => m.role !== "system").map(toGeminiParts);
  for (let i = 0; i < 8; i++) {
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents, tools: [{ functionDeclarations }], systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] }, generationConfig: { maxOutputTokens: 2000 } }),
    });
    if (!res.ok) { const err = await res.json().catch(() => ({})) as { error?: { message?: string } }; throw new Error(err?.error?.message ?? `HTTP ${res.status}`); }
    const data = await res.json() as { candidates: Array<{ content: { parts: Array<{ text?: string; functionCall?: { name: string; args: Record<string, unknown> } }> }; finishReason: string }>; usageMetadata?: { promptTokenCount: number; candidatesTokenCount: number; totalTokenCount: number } };
    if (data.usageMetadata) { totalPrompt += data.usageMetadata.promptTokenCount; totalCompletion += data.usageMetadata.candidatesTokenCount; totalTokens += data.usageMetadata.totalTokenCount; }
    const parts = data.candidates[0].content.parts;
    const textParts = parts.filter(p => p.text).map(p => p.text ?? "");
    const fnCalls = parts.filter(p => p.functionCall);
    contents.push({ role: "model", parts });
    if (!fnCalls.length) return { reply: textParts.join("\n"), toolCalls: toolCallNames, usage: totalTokens ? { prompt: totalPrompt, completion: totalCompletion, total: totalTokens } : undefined, durationMs: Date.now() - startMs };
    const fnResponses = [];
    for (const fc of fnCalls) {
      toolCallNames.push(fc.functionCall!.name);
      const result = await executeTool(fc.functionCall!.name, fc.functionCall!.args, cb);
      fnResponses.push({ functionResponse: { name: fc.functionCall!.name, response: { result } } });
    }
    contents.push({ role: "user", parts: fnResponses });
  }
  return { reply: "Reached maximum tool call depth.", toolCalls: toolCallNames, usage: totalTokens ? { prompt: totalPrompt, completion: totalCompletion, total: totalTokens } : undefined, durationMs: Date.now() - startMs };
}

// ─── Ollama call ──────────────────────────────────────────────────────────────

async function callOllama(
  baseUrl: string,
  model: string,
  messages: ChatMessage[],
  cb: ToolCallbacks,
): Promise<AIResult> {
  const startMs = Date.now();
  const toolCallNames: string[] = [];
  const url = baseUrl.replace(/\/+$/, "");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ollamaMsgs: any[] = messages.map(m => {
    if (m.role === "tool") return { role: "tool", content: m.content ?? "" };
    if (m.tool_calls?.length) return { role: "assistant", content: m.content ?? "", tool_calls: m.tool_calls.map(tc => ({ id: tc.id, type: "function", function: { name: tc.function.name, arguments: tc.function.arguments } })) };
    return { role: m.role, content: m.content ?? "" };
  });
  for (let i = 0; i < 8; i++) {
    const res = await fetch(`${url}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ model, messages: ollamaMsgs, tools: TOOLS_OPENAI, stream: false }),
    });
    if (!res.ok) throw new Error(`Ollama HTTP ${res.status}`);
    const data = await res.json() as { message: { role: string; content: string; tool_calls?: Array<{ function: { name: string; arguments: Record<string, unknown> | string } }> }; prompt_eval_count?: number; eval_count?: number };
    const msg = data.message;
    const prompt = data.prompt_eval_count ?? 0;
    const completion = data.eval_count ?? 0;
    if (!msg.tool_calls?.length) return { reply: msg.content, toolCalls: toolCallNames, usage: (prompt || completion) ? { prompt, completion, total: prompt + completion } : undefined, durationMs: Date.now() - startMs };
    ollamaMsgs.push({ role: "assistant", content: msg.content ?? "", tool_calls: msg.tool_calls });
    for (const tc of msg.tool_calls) {
      toolCallNames.push(tc.function.name);
      const args = typeof tc.function.arguments === "string" ? JSON.parse(tc.function.arguments) : tc.function.arguments;
      const result = await executeTool(tc.function.name, args as Record<string, unknown>, cb);
      ollamaMsgs.push({ role: "tool", content: result });
    }
  }
  return { reply: "Reached maximum tool call depth.", toolCalls: toolCallNames, durationMs: Date.now() - startMs };
}

// ─── Main call function ───────────────────────────────────────────────────────

export async function callAI(
  userMessage: string,
  history: ChatMessage[],
  cb: ToolCallbacks,
): Promise<AIResult> {
  const active = getActiveProvider();
  if (!active) throw new Error("No AI provider selected. Open Settings → AI Settings and pick a provider.");

  const messages: ChatMessage[] = [
    { role: "system", content: SYSTEM_PROMPT },
    ...history,
    { role: "user", content: userMessage },
  ];

  const { provider, model } = active;

  if (provider === "ollama") {
    const url = getOllamaUrl();
    if (!url) throw new Error("Ollama URL not configured. Go to Settings → AI Settings → Ollama.");
    return callOllama(url, model, messages, cb);
  }

  const key = getStoredKey(provider);
  if (!key) throw new Error(`No API key for ${provider}. Go to Settings → AI Settings and add it.`);

  if (provider === "anthropic") return callAnthropic(key, model, messages, cb);
  if (provider === "gemini") {
    // also check compat key
    const geminiKey = key || localStorage.getItem("smart-ins-note-gemini-key") || "";
    return callGemini(geminiKey, model, messages, cb);
  }

  const baseUrls: Record<string, string> = {
    openai: "https://api.openai.com/v1",
    groq: "https://api.groq.com/openai/v1",
    mistral: "https://api.mistral.ai/v1",
    openrouter: "https://openrouter.ai/api/v1",
    xai: "https://api.x.ai/v1",
    cohere: "https://api.cohere.com/compatibility/v1",
  };
  const base = baseUrls[provider];
  if (!base) throw new Error(`Unknown provider: ${provider}`);
  return callOpenAICompat(base, key, model, messages, cb);
}
