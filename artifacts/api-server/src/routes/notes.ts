import { Router, type IRouter } from "express";
import {
  GetNotesResponse,
  CreateNoteBody,
  DeleteNoteParams,
} from "@workspace/api-zod";

const router: IRouter = Router();

const INSFORGE_API_KEY = process.env.INSFORGE_API_KEY;
const INSFORGE_API_BASE_URL = process.env.INSFORGE_API_BASE_URL;

if (!INSFORGE_API_KEY || !INSFORGE_API_BASE_URL) {
  throw new Error(
    "INSFORGE_API_KEY and INSFORGE_API_BASE_URL environment variables are required."
  );
}

const insforgeHeaders = {
  "Content-Type": "application/json",
  Authorization: `Bearer ${INSFORGE_API_KEY}`,
  "x-api-key": INSFORGE_API_KEY,
};

async function insforgeRequest(
  path: string,
  options: RequestInit = {}
): Promise<Response> {
  const url = `${INSFORGE_API_BASE_URL}${path}`;
  return fetch(url, {
    ...options,
    headers: {
      ...insforgeHeaders,
      ...(options.headers || {}),
    },
  });
}

router.get("/notes", async (req, res) => {
  try {
    const response = await insforgeRequest("/notes");
    if (!response.ok) {
      const text = await response.text();
      req.log.error({ status: response.status, body: text }, "Insforge GET /notes failed");
      return res.status(response.status).json({ error: "Failed to fetch notes from backend" });
    }
    const raw = await response.json();
    const notes = GetNotesResponse.parse(raw);
    res.json(notes);
  } catch (err) {
    req.log.error({ err }, "Error fetching notes");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/notes", async (req, res) => {
  try {
    const body = CreateNoteBody.parse(req.body);
    const response = await insforgeRequest("/notes", {
      method: "POST",
      body: JSON.stringify(body),
    });
    if (!response.ok) {
      const text = await response.text();
      req.log.error({ status: response.status, body: text }, "Insforge POST /notes failed");
      return res.status(response.status).json({ error: "Failed to create note" });
    }
    const note = await response.json();
    res.status(201).json(note);
  } catch (err) {
    req.log.error({ err }, "Error creating note");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/notes/:id", async (req, res) => {
  try {
    const { id } = DeleteNoteParams.parse(req.params);
    const response = await insforgeRequest(`/notes/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      const text = await response.text();
      req.log.error({ status: response.status, body: text }, "Insforge DELETE /notes/:id failed");
      return res.status(response.status).json({ error: "Failed to delete note" });
    }
    res.json({ success: true, id });
  } catch (err) {
    req.log.error({ err }, "Error deleting note");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
