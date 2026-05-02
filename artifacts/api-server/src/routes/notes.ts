import { Router, type IRouter } from "express";
import { CreateNoteBody, DeleteNoteParams, UpdateNoteParams } from "@workspace/api-zod";
import { z } from "zod";
import { requireAuth, optionalAuth } from "../middleware/auth";

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

router.get("/notes", optionalAuth, async (req, res) => {
  try {
    const response = await fetch(
      `${notesUrl()}?order=updated_at.desc`,
      { headers: baseHeaders }
    );
    const raw = await response.json() as Array<Record<string, unknown>>;
    if (!response.ok) {
      req.log.error({ status: response.status, raw }, "Insforge GET notes failed");
      res.status(500).json({ error: "Failed to fetch notes" });
      return;
    }
    res.json((raw ?? []).map(mapNote));
  } catch (err) {
    req.log.error({ err }, "Error fetching notes");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/notes", optionalAuth, async (req, res) => {
  try {
    const body = CreateNoteBody.parse(req.body);
    const response = await fetch(notesUrl(), {
      method: "POST",
      headers: { ...baseHeaders, "Prefer": "return=representation" },
      body: JSON.stringify([{
        title: body.title,
        content: body.content,
        starred: false,
        archived: false,
        trashed: false,
        pinned: false,
      }]),
    });
    const raw = await response.json() as Array<Record<string, unknown>>;
    if (!response.ok) {
      req.log.error({ status: response.status, raw }, "Insforge POST notes failed");
      res.status(500).json({ error: "Failed to create note" });
      return;
    }
    const created = raw?.[0];
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

router.patch("/notes/:id", optionalAuth, async (req, res) => {
  try {
    const { id } = UpdateNoteParams.parse(req.params);
    const body = UpdateNoteBody.parse(req.body);
    const response = await fetch(
      `${notesUrl()}?id=eq.${encodeURIComponent(id)}`,
      {
        method: "PATCH",
        headers: { ...baseHeaders, "Prefer": "return=representation" },
        body: JSON.stringify(body),
      }
    );
    const raw = await response.json() as Array<Record<string, unknown>>;
    if (!response.ok) {
      req.log.error({ status: response.status, raw }, "Insforge PATCH note failed");
      res.status(500).json({ error: "Failed to update note" });
      return;
    }
    const updated = raw?.[0];
    if (!updated) {
      res.status(404).json({ error: "Note not found" });
      return;
    }
    res.json(mapNote(updated));
  } catch (err) {
    req.log.error({ err }, "Error updating note");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/notes/:id", optionalAuth, async (req, res) => {
  try {
    const { id } = DeleteNoteParams.parse(req.params);
    const response = await fetch(
      `${notesUrl()}?id=eq.${encodeURIComponent(id)}`,
      { method: "DELETE", headers: baseHeaders }
    );
    if (!response.ok) {
      const raw = await response.text();
      req.log.error({ status: response.status, raw }, "Insforge DELETE note failed");
      res.status(500).json({ error: "Failed to delete note" });
      return;
    }
    res.json({ success: true, id });
  } catch (err) {
    req.log.error({ err }, "Error deleting note");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
