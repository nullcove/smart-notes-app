const TOKEN_KEY = "smart-ins-note-token";
const USER_KEY = "smart-ins-note-user";

export interface AuthUser {
  id: string;
  email: string;
  name: string;
}

export function getToken(): string {
  if (typeof window === "undefined") return "";
  return localStorage.getItem(TOKEN_KEY) || "";
}

export function getUser(): AuthUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? (JSON.parse(raw) as AuthUser) : null;
  } catch { return null; }
}

export function saveAuth(token: string, user: AuthUser) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function clearAuth() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export function isLoggedIn(): boolean {
  return !!getToken();
}

const API = "/api";

export async function apiRegister(email: string, password: string, name: string): Promise<{ token: string; user: AuthUser }> {
  const res = await fetch(`${API}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, name }),
  });
  const data = await res.json() as { token?: string; user?: AuthUser; error?: string };
  if (!res.ok) throw new Error(data.error || "Registration failed");
  return { token: data.token!, user: data.user! };
}

export async function apiLogin(email: string, password: string): Promise<{ token: string; user: AuthUser }> {
  const res = await fetch(`${API}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json() as { token?: string; user?: AuthUser; error?: string };
  if (!res.ok) throw new Error(data.error || "Login failed");
  return { token: data.token!, user: data.user! };
}
