import { Router, type IRouter } from "express";
import { z } from "zod";
import { requireAuth } from "../middleware/auth";
import {
  getKeys, addKey, deleteKey,
  getSettings, updateSettings, touchLastSeen,
  getMemory, clearMemory, addMemoryFacts, clearConversation,
  appendConversation, getConversation,
  type StoredMessage,
} from "../lib/store";
import { routeAI, extractMemoryFacts, type ToolCallItem } from "../lib/aiRouter";

const router: IRouter = Router();

// ─── Schemas ──────────────────────────────────────────────────────────────────

const AddKeyBody = z.object({
  provider: z.string().min(1),
  model: z.string().optional(),
  key: z.string().min(1),
  label: z.string().optional(),
});

const UpdateSettingsBody = z.object({
  mode: z.enum(["auto", "fixed"]).optional(),
  fixedProvider: z.string().optional(),
  fixedModel: z.string().optional(),
});

const AiMessageSchema: z.ZodType<StoredMessage> = z.object({
  role: z.enum(["user", "assistant", "tool", "system"]),
  content: z.string().nullable(),
  tool_calls: z.array(z.object({
    id: z.string(),
    function: z.object({ name: z.string(), arguments: z.string() }),
  })).optional(),
  tool_call_id: z.string().optional(),
  name: z.string().optional(),
});

const ChatBody = z.object({
  message: z.string().optional(),
  history: z.array(AiMessageSchema).default([]),
  toolResults: z.array(z.object({
    id: z.string(),
    name: z.string(),
    result: z.string(),
  })).optional(),
});

// ─── POST /ai/chat ────────────────────────────────────────────────────────────

router.post("/ai/chat", requireAuth, async (req, res) => {
  try {
    const userId = req.user!.id;
    const userName = req.user!.name || "User";
    const body = ChatBody.parse(req.body);

    const keys = getKeys(userId);
    if (!keys.length) {
      res.status(400).json({ error: "NO_KEYS", message: "No API keys configured. Please add at least one API key in Settings." });
      return;
    }

    const settings = getSettings(userId);
    const memory = getMemory(userId);
    const daysSinceLastSeen = touchLastSeen(userId);

    let messages: StoredMessage[] = [...body.history];

    if (body.toolResults?.length) {
      for (const tr of body.toolResults) {
        messages.push({ role: "tool", content: tr.result, tool_call_id: tr.id, name: tr.name });
      }
    } else if (body.message) {
      messages.push({ role: "user", content: body.message });
    }

    let attempts = 0;
    const maxAttempts = 6;
    let lastError: Error | null = null;

    while (attempts < maxAttempts) {
      attempts++;
      try {
        const result = await routeAI({ messages, userName, memory, settings, keys, daysSinceLastSeen });

        if (result.nextMessages?.length) {
          messages = [...messages, ...result.nextMessages];
          continue;
        }

        if (result.done && result.reply !== undefined) {
          const userMsg = body.message;
          const aiReply = result.reply;
          if (userMsg && aiReply) {
            setImmediate(async () => {
              try {
                const newFacts = await extractMemoryFacts(userMsg, aiReply, memory.facts, keys[0]);
                if (newFacts.length > 0) addMemoryFacts(userId, newFacts);
                const nameMatch = newFacts.find(f => f.toLowerCase().includes("name"));
                if (nameMatch) {
                  const memUpdate: Record<string, string> = {};
                  const nm = nameMatch.match(/name[:\s]+([^\s,]+)/i);
                  if (nm?.[1]) memUpdate.userName = nm[1];
                  if (Object.keys(memUpdate).length) {
                    const { updateMemory } = await import("../lib/store");
                    updateMemory(userId, memUpdate);
                  }
                }
              } catch { }
            });
          }

          const toStore: StoredMessage[] = [];
          if (body.message && !body.toolResults?.length) toStore.push({ role: "user", content: body.message });
          if (result.reply) toStore.push({ role: "assistant", content: result.reply });
          if (toStore.length) appendConversation(userId, toStore);

          updateSettings(userId, { conversationCount: settings.conversationCount + 1 });
        }

        res.json({
          reply: result.reply,
          toolCalls: result.toolCalls,
          done: result.done,
          model: result.model,
          provider: result.provider,
          usage: result.usage,
        });
        return;
      } catch (e: unknown) {
        lastError = e instanceof Error ? e : new Error(String(e));
        const status = (e as { status?: number }).status ?? 0;
        const isRateLimit = status === 429 || lastError.message.toLowerCase().includes("rate limit") || lastError.message.toLowerCase().includes("quota");
        const isTokenLimit = lastError.message.toLowerCase().includes("token") || lastError.message.toLowerCase().includes("context length") || lastError.message.toLowerCase().includes("maximum context");
        if (isRateLimit || isTokenLimit) {
          req.log.warn({ err: lastError.message }, "Rate/token limit hit, trying next key if available");
          const usedProvider = keys[0]?.provider;
          const remainingKeys = keys.filter(k => k.provider !== usedProvider);
          if (!remainingKeys.length) break;
          messages = [...body.history];
          if (body.message) messages.push({ role: "user", content: body.message });
          continue;
        }
        break;
      }
    }

    const errMsg = lastError?.message ?? "AI call failed";
    res.status(502).json({
      error: "AI_ERROR",
      message: errMsg,
      provider: getKeys(userId)[0]?.provider ?? "unknown",
    });
  } catch (err) {
    req.log.error({ err }, "Error in AI chat");
    res.status(500).json({ error: "Internal server error" });
  }
});

// ─── GET /ai/keys ─────────────────────────────────────────────────────────────

router.get("/ai/keys", requireAuth, (req, res) => {
  const userId = req.user!.id;
  const keys = getKeys(userId);
  res.json(keys.map(k => ({
    id: k.id,
    provider: k.provider,
    model: k.model,
    label: k.label,
    keyMasked: k.key.slice(0, 6) + "••••••••" + k.key.slice(-4),
    createdAt: k.createdAt,
  })));
});

// ─── POST /ai/keys ────────────────────────────────────────────────────────────

router.post("/ai/keys", requireAuth, (req, res) => {
  try {
    const userId = req.user!.id;
    const body = AddKeyBody.parse(req.body);
    const record = addKey(userId, body);
    res.status(201).json({
      id: record.id,
      provider: record.provider,
      model: record.model,
      label: record.label,
      keyMasked: record.key.slice(0, 6) + "••••••••" + record.key.slice(-4),
      createdAt: record.createdAt,
    });
  } catch (err) {
    req.log.error({ err }, "Error adding AI key");
    res.status(400).json({ error: "Invalid key data" });
  }
});

// ─── DELETE /ai/keys/:id ──────────────────────────────────────────────────────

router.delete("/ai/keys/:id", requireAuth, (req, res) => {
  const userId = req.user!.id;
  const { id } = req.params;
  const deleted = deleteKey(userId, id);
  if (!deleted) { res.status(404).json({ error: "Key not found" }); return; }
  res.json({ success: true });
});

// ─── GET /ai/settings ────────────────────────────────────────────────────────

router.get("/ai/settings", requireAuth, (req, res) => {
  const settings = getSettings(req.user!.id);
  res.json(settings);
});

// ─── PATCH /ai/settings ───────────────────────────────────────────────────────

router.patch("/ai/settings", requireAuth, (req, res) => {
  try {
    const userId = req.user!.id;
    const body = UpdateSettingsBody.parse(req.body);
    const updated = updateSettings(userId, body);
    res.json(updated);
  } catch (err) {
    req.log.error({ err }, "Error updating AI settings");
    res.status(400).json({ error: "Invalid settings" });
  }
});

// ─── GET /ai/memory ───────────────────────────────────────────────────────────

router.get("/ai/memory", requireAuth, (req, res) => {
  res.json(getMemory(req.user!.id));
});

// ─── DELETE /ai/memory ────────────────────────────────────────────────────────

router.delete("/ai/memory", requireAuth, (req, res) => {
  clearMemory(req.user!.id);
  res.json({ success: true });
});

// ─── GET /ai/conversation ─────────────────────────────────────────────────────

router.get("/ai/conversation", requireAuth, (req, res) => {
  res.json(getConversation(req.user!.id));
});

// ─── DELETE /ai/conversation ──────────────────────────────────────────────────

router.delete("/ai/conversation", requireAuth, (req, res) => {
  clearConversation(req.user!.id);
  res.json({ success: true });
});

export default router;

// Re-export ToolCallItem for use in other files
export type { ToolCallItem };
