import { Router, type IRouter } from "express";
import { optionalAuth } from "../middleware/auth";

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

router.get("/tags", optionalAuth, async (req, res) => {
  try {
    const response = await fetch(
      `${tagsUrl()}?order=name.asc`,
      { headers: baseHeaders }
    );
    const raw = await response.json() as Array<Record<string, unknown>>;
    if (!response.ok) return res.status(500).json({ error: "Failed to fetch tags" });
    res.json((raw ?? []).map(mapTag));
  } catch (err) {
    req.log.error({ err }, "Error fetching tags");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/tags", optionalAuth, async (req, res) => {
  try {
    const { name, color } = req.body as { name: string; color?: string };
    if (!name?.trim()) return res.status(400).json({ error: "name is required" });
    const response = await fetch(tagsUrl(), {
      method: "POST",
      headers: { ...baseHeaders, "Prefer": "return=representation" },
      body: JSON.stringify([{ name: name.trim(), color: color ?? null }]),
    });
    const raw = await response.json() as Array<Record<string, unknown>>;
    if (!response.ok) return res.status(500).json({ error: "Failed to create tag" });
    res.status(201).json(mapTag(raw[0]));
  } catch (err) {
    req.log.error({ err }, "Error creating tag");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/tags/:id", optionalAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const response = await fetch(
      `${tagsUrl()}?id=eq.${encodeURIComponent(id)}`,
      { method: "DELETE", headers: baseHeaders }
    );
    if (!response.ok) return res.status(500).json({ error: "Failed to delete tag" });
    res.json({ success: true, id });
  } catch (err) {
    req.log.error({ err }, "Error deleting tag");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
