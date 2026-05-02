import { Router, type IRouter } from "express";
import { CreateNoteBody, DeleteNoteParams } from "@workspace/api-zod";

const router: IRouter = Router();

const INSFORGE_API_KEY = process.env.INSFORGE_API_KEY;
const INSFORGE_API_BASE_URL = process.env.INSFORGE_API_BASE_URL;

if (!INSFORGE_API_KEY || !INSFORGE_API_BASE_URL) {
  throw new Error(
    "INSFORGE_API_KEY and INSFORGE_API_BASE_URL environment variables are required."
  );
}

const baseHeaders = {
  "x-api-key": INSFORGE_API_KEY,
  "Content-Type": "application/json",
};

function notesUrl(suffix = "") {
  return `${INSFORGE_API_BASE_URL}/api/database/records/notes${suffix}`;
}

router.get("/notes", async (req, res) => {
  try {
    const response = await fetch(
      `${notesUrl()}?order=created_at.desc`,
      { headers: baseHeaders }
    );
    const raw = await response.json() as Array<Record<string, unknown>>;

    if (!response.ok) {
      req.log.error({ status: response.status, raw }, "Insforge GET notes failed");
      return res.status(500).json({ error: "Failed to fetch notes" });
    }

    const notes = (raw ?? []).map((n) => ({
      id: n["id"],
      title: n["title"],
      content: n["content"],
      createdAt: n["created_at"],
      updatedAt: n["updated_at"],
    }));

    res.json(notes);
  } catch (err) {
    req.log.error({ err }, "Error fetching notes");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/notes", async (req, res) => {
  try {
    const body = CreateNoteBody.parse(req.body);

    const response = await fetch(notesUrl(), {
      method: "POST",
      headers: {
        ...baseHeaders,
        "Prefer": "return=representation",
      },
      body: JSON.stringify([{ title: body.title, content: body.content }]),
    });

    const raw = await response.json() as Array<Record<string, unknown>>;

    if (!response.ok) {
      req.log.error({ status: response.status, raw }, "Insforge POST notes failed");
      return res.status(500).json({ error: "Failed to create note" });
    }

    const created = raw?.[0];
    if (!created) {
      return res.status(500).json({ error: "Note creation returned no data" });
    }

    res.status(201).json({
      id: created["id"],
      title: created["title"],
      content: created["content"],
      createdAt: created["created_at"],
      updatedAt: created["updated_at"],
    });
  } catch (err) {
    req.log.error({ err }, "Error creating note");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/notes/:id", async (req, res) => {
  try {
    const { id } = DeleteNoteParams.parse(req.params);

    const response = await fetch(`${notesUrl()}?id=eq.${encodeURIComponent(id)}`, {
      method: "DELETE",
      headers: baseHeaders,
    });

    if (!response.ok) {
      const raw = await response.text();
      req.log.error({ status: response.status, raw }, "Insforge DELETE note failed");
      return res.status(500).json({ error: "Failed to delete note" });
    }

    res.json({ success: true, id });
  } catch (err) {
    req.log.error({ err }, "Error deleting note");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
