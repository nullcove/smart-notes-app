import { Router, type IRouter } from "express";
import { requireAuth } from "../middleware/auth";

const router: IRouter = Router();

const INSFORGE_API_KEY = process.env.INSFORGE_API_KEY!;
const INSFORGE_API_BASE_URL = process.env.INSFORGE_API_BASE_URL!;

const baseHeaders = {
  "x-api-key": INSFORGE_API_KEY,
  "Content-Type": "application/json",
};

function tagsUrl(suffix = "") {
  return `${INSFORGE_API_BASE_URL}/api/database/records/tags${suffix}`;
}

function mapTag(n: Record<string, unknown>) {
  return { id: n["id"], name: n["name"], color: n["color"], createdAt: n["created_at"] };
}

// 42703 = PostgreSQL undefined_column (SELECT/UPDATE/DELETE)
// PGRST204 = PostgREST schema cache miss for unknown column (INSERT)
function isMissingColumnError(body: unknown): boolean {
  if (typeof body !== "object" || body === null) return false;
  const code = (body as Record<string, unknown>)["code"];
  return code === "42703" || code === "PGRST204";
}

// All tag routes require auth — users only see their own tags.

router.get("/tags", requireAuth, async (req, res) => {
  try {
    const userId = req.user!.id;
    const response = await fetch(
      `${tagsUrl()}?user_id=eq.${encodeURIComponent(userId)}&order=name.asc`,
      { headers: baseHeaders }
    );
    const raw = await response.json() as unknown;
    if (!response.ok) {
      if (isMissingColumnError(raw)) {
        req.log.warn("user_id column missing in tags table — migration pending");
        res.json([]);
        return;
      }
      res.status(500).json({ error: "Failed to fetch tags" });
      return;
    }
    res.json((raw as Array<Record<string, unknown>>).map(mapTag));
  } catch (err) {
    req.log.error({ err }, "Error fetching tags");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/tags", requireAuth, async (req, res) => {
  try {
    const userId = req.user!.id;
    const { name, color } = req.body as { name: string; color?: string };
    if (!name?.trim()) {
      res.status(400).json({ error: "name is required" });
      return;
    }

    const tryCreate = async (includeUserId: boolean) => {
      const record: Record<string, unknown> = { name: name.trim(), color: color ?? null };
      if (includeUserId) record.user_id = userId;
      return fetch(tagsUrl(), {
        method: "POST",
        headers: { ...baseHeaders, "Prefer": "return=representation" },
        body: JSON.stringify([record]),
      });
    };

    let response = await tryCreate(true);
    let raw = await response.json() as unknown;

    if (!response.ok && isMissingColumnError(raw)) {
      response = await tryCreate(false);
      raw = await response.json() as unknown;
    }

    if (!response.ok) {
      res.status(500).json({ error: "Failed to create tag" });
      return;
    }
    res.status(201).json(mapTag((raw as Array<Record<string, unknown>>)[0]));
  } catch (err) {
    req.log.error({ err }, "Error creating tag");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/tags/:id", requireAuth, async (req, res) => {
  try {
    const userId = req.user!.id;
    const id = req.params["id"] as string;

    let url = `${tagsUrl()}?id=eq.${encodeURIComponent(id)}&user_id=eq.${encodeURIComponent(userId)}`;
    let response = await fetch(url, { method: "DELETE", headers: baseHeaders });

    if (!response.ok) {
      const errText = await response.text();
      let errBody: unknown;
      try { errBody = JSON.parse(errText); } catch { errBody = {}; }

      if (isMissingColumnError(errBody)) {
        url = `${tagsUrl()}?id=eq.${encodeURIComponent(id)}`;
        response = await fetch(url, { method: "DELETE", headers: baseHeaders });
      }

      if (!response.ok) {
        res.status(500).json({ error: "Failed to delete tag" });
        return;
      }
    }
    res.json({ success: true, id });
  } catch (err) {
    req.log.error({ err }, "Error deleting tag");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
