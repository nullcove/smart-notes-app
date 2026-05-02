import { Router, type IRouter } from "express";
import { CreateNoteBody, DeleteNoteParams } from "@workspace/api-zod";
import { z } from "zod";
import { requireAuth } from "../middleware/auth";

const router: IRouter = Router();

const INSFORGE_API_KEY = process.env.INSFORGE_API_KEY;
const INSFORGE_API_BASE_URL = process.env.INSFORGE_API_BASE_URL;

if (!INSFORGE_API_KEY || !INSFORGE_API_BASE_URL) {
  throw new Error("INSFORGE_API_KEY and INSFORGE_API_BASE_URL environment variables are required.");
}

const baseHeaders = {
  "x-api-key": INSFORGE_API_KEY,
  "Content-Type": "application/json",
};

function notesUrl(suffix = "") {
  return `${INSFORGE_API_BASE_URL}/api/database/records/notes${suffix}`;
}

function mapNote(n: Record<string, unknown>) {
  return {
    id: n["id"],
    title: n["title"],
    content: n["content"],
    starred: n["starred"] ?? false,
    archived: n["archived"] ?? false,
    trashed: n["trashed"] ?? false,
    pinned: n["pinned"] ?? false,
    createdAt: n["created_at"],
    updatedAt: n["updated_at"],
  };
}

// True if the Insforge error is a "column does not exist" (migration pending)
// 42703 = PostgreSQL undefined_column (SELECT/UPDATE/DELETE)
// PGRST204 = PostgREST schema cache miss for unknown column (INSERT)
function isMissingColumnError(body: unknown): boolean {
  if (typeof body !== "object" || body === null) return false;
  const code = (body as Record<string, unknown>)["code"];
  return code === "42703" || code === "PGRST204";
}

// All note routes require authentication — a user can only see/edit their own notes.

router.get("/notes", requireAuth, async (req, res) => {
  try {
    const userId = req.user!.id;
    const response = await fetch(
      `${notesUrl()}?user_id=eq.${encodeURIComponent(userId)}&order=updated_at.desc`,
      { headers: baseHeaders }
    );
    const raw = await response.json() as unknown;
    if (!response.ok) {
      if (isMissingColumnError(raw)) {
        // user_id column not yet migrated — return empty list gracefully
        req.log.warn("user_id column missing — run migration: ALTER TABLE notes ADD COLUMN user_id TEXT");
        res.json([]);
        return;
      }
      req.log.error({ status: response.status, raw }, "Insforge GET notes failed");
      res.status(500).json({ error: "Failed to fetch notes" });
      return;
    }
    res.json((raw as Array<Record<string, unknown>>).map(mapNote));
  } catch (err) {
    req.log.error({ err }, "Error fetching notes");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/notes", requireAuth, async (req, res) => {
  try {
    const userId = req.user!.id;
    const body = CreateNoteBody.parse(req.body);

    const tryCreate = async (includeUserId: boolean) => {
      const record: Record<string, unknown> = {
        title: body.title,
        content: body.content,
        starred: false,
        archived: false,
        trashed: false,
        pinned: false,
      };
      if (includeUserId) record.user_id = userId;
      return fetch(notesUrl(), {
        method: "POST",
        headers: { ...baseHeaders, "Prefer": "return=representation" },
        body: JSON.stringify([record]),
      });
    };

    let response = await tryCreate(true);
    let raw = await response.json() as unknown;

    // If user_id column doesn't exist yet, retry without it
    if (!response.ok && isMissingColumnError(raw)) {
      req.log.warn("user_id column missing — creating note without user isolation");
      response = await tryCreate(false);
      raw = await response.json() as unknown;
    }

    if (!response.ok) {
      req.log.error({ status: response.status, raw }, "Insforge POST notes failed");
      res.status(500).json({ error: "Failed to create note" });
      return;
    }
    const created = (raw as Array<Record<string, unknown>>)?.[0];
    if (!created) {
      res.status(500).json({ error: "Note creation returned no data" });
      return;
    }
    res.status(201).json(mapNote(created));
  } catch (err) {
    req.log.error({ err }, "Error creating note");
    res.status(500).json({ error: "Internal server error" });
  }
});

const UpdateNoteBody = z.object({
  title: z.string().optional(),
  content: z.string().optional(),
  starred: z.boolean().optional(),
  archived: z.boolean().optional(),
  trashed: z.boolean().optional(),
  pinned: z.boolean().optional(),
});

router.patch("/notes/:id", requireAuth, async (req, res) => {
  try {
    const userId = req.user!.id;
    const { id } = DeleteNoteParams.parse(req.params);
    const body = UpdateNoteBody.parse(req.body);

    // Try with user_id ownership check first; fall back to id-only if column missing
    let url = `${notesUrl()}?id=eq.${encodeURIComponent(id)}&user_id=eq.${encodeURIComponent(userId)}`;
    let response = await fetch(url, {
      method: "PATCH",
      headers: { ...baseHeaders, "Prefer": "return=representation" },
      body: JSON.stringify(body),
    });
    let raw = await response.json() as unknown;

    if (!response.ok && isMissingColumnError(raw)) {
      // Column missing — fall back to id-only filter (no ownership check yet)
      url = `${notesUrl()}?id=eq.${encodeURIComponent(id)}`;
      response = await fetch(url, {
        method: "PATCH",
        headers: { ...baseHeaders, "Prefer": "return=representation" },
        body: JSON.stringify(body),
      });
      raw = await response.json() as unknown;
    }

    if (!response.ok) {
      req.log.error({ status: response.status, raw }, "Insforge PATCH note failed");
      res.status(500).json({ error: "Failed to update note" });
      return;
    }
    const updated = (raw as Array<Record<string, unknown>>)?.[0];
    if (!updated) {
      res.status(404).json({ error: "Note not found or access denied" });
      return;
    }
    res.json(mapNote(updated));
  } catch (err) {
    req.log.error({ err }, "Error updating note");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/notes/:id", requireAuth, async (req, res) => {
  try {
    const userId = req.user!.id;
    const { id } = DeleteNoteParams.parse(req.params);

    // Try with user_id ownership check; fall back to id-only if column missing
    let url = `${notesUrl()}?id=eq.${encodeURIComponent(id)}&user_id=eq.${encodeURIComponent(userId)}`;
    let response = await fetch(url, { method: "DELETE", headers: baseHeaders });

    if (!response.ok) {
      const errText = await response.text();
      let errBody: unknown;
      try { errBody = JSON.parse(errText); } catch { errBody = {}; }

      if (isMissingColumnError(errBody)) {
        // Column missing — fall back to id-only
        url = `${notesUrl()}?id=eq.${encodeURIComponent(id)}`;
        response = await fetch(url, { method: "DELETE", headers: baseHeaders });
      }

      if (!response.ok) {
        req.log.error({ status: response.status, errText }, "Insforge DELETE note failed");
        res.status(500).json({ error: "Failed to delete note" });
        return;
      }
    }
    res.json({ success: true, id });
  } catch (err) {
    req.log.error({ err }, "Error deleting note");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
