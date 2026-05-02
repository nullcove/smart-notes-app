import { Router, type IRouter } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { z } from "zod";

const router: IRouter = Router();

const INSFORGE_API_KEY = process.env.INSFORGE_API_KEY!;
const INSFORGE_API_BASE_URL = process.env.INSFORGE_API_BASE_URL!;
const JWT_SECRET = process.env.SESSION_SECRET || "smart-ins-note-secret";

const baseHeaders = {
  "x-api-key": INSFORGE_API_KEY,
  "Content-Type": "application/json",
};

function usersUrl(suffix = "") {
  return `${INSFORGE_API_BASE_URL}/api/database/records/users${suffix}`;
}

const RegisterBody = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(1).default(""),
});

const LoginBody = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

router.post("/auth/register", async (req, res) => {
  try {
    const { email, password, name } = RegisterBody.parse(req.body);

    // Check if email already exists
    const checkRes = await fetch(`${usersUrl()}?email=eq.${encodeURIComponent(email)}`, { headers: baseHeaders });
    const existing = await checkRes.json() as Array<unknown>;
    if (existing.length > 0) {
      res.status(409).json({ error: "Email already registered" });
      return;
    }

    const password_hash = await bcrypt.hash(password, 12);

    const createRes = await fetch(usersUrl(), {
      method: "POST",
      headers: { ...baseHeaders, Prefer: "return=representation" },
      body: JSON.stringify([{ email, password_hash, name }]),
    });

    const raw = await createRes.json() as Array<Record<string, unknown>>;
    if (!createRes.ok) {
      req.log.error({ raw }, "Failed to create user");
      res.status(500).json({ error: "Failed to register" });
      return;
    }

    const user = raw[0];
    const token = jwt.sign({ id: user["id"], email, name }, JWT_SECRET, { expiresIn: "30d" });
    res.status(201).json({ token, user: { id: user["id"], email, name } });
  } catch (err) {
    req.log.error({ err }, "Register error");
    res.status(400).json({ error: err instanceof z.ZodError ? err.issues[0].message : "Registration failed" });
  }
});

router.post("/auth/login", async (req, res) => {
  try {
    const { email, password } = LoginBody.parse(req.body);

    const fetchRes = await fetch(`${usersUrl()}?email=eq.${encodeURIComponent(email)}`, { headers: baseHeaders });
    const rows = await fetchRes.json() as Array<Record<string, unknown>>;

    if (!rows.length) {
      res.status(401).json({ error: "Invalid email or password" });
      return;
    }

    const user = rows[0];
    const valid = await bcrypt.compare(password, user["password_hash"] as string);
    if (!valid) {
      res.status(401).json({ error: "Invalid email or password" });
      return;
    }

    const name = user["name"] as string;
    const token = jwt.sign({ id: user["id"], email, name }, JWT_SECRET, { expiresIn: "30d" });
    res.json({ token, user: { id: user["id"], email, name } });
  } catch (err) {
    req.log.error({ err }, "Login error");
    res.status(400).json({ error: "Login failed" });
  }
});

router.get("/auth/me", async (req, res) => {
  try {
    const auth = req.headers.authorization;
    if (!auth?.startsWith("Bearer ")) { res.status(401).json({ error: "Unauthorized" }); return; }
    const token = auth.slice(7);
    const payload = jwt.verify(token, JWT_SECRET) as { id: string; email: string; name: string };
    res.json({ user: { id: payload.id, email: payload.email, name: payload.name } });
  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
});

export default router;
