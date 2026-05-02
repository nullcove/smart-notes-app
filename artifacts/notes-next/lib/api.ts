import { getToken } from "./auth";

export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt?: string;
  starred?: boolean;
  archived?: boolean;
  trashed?: boolean;
  pinned?: boolean;
}

export interface Tag {
  id: string;
  name: string;
  color?: string;
  createdAt: string;
}

export interface CreateNoteInput { title: string; content: string; }
export interface UpdateNoteInput {
  title?: string; content?: string;
  starred?: boolean; archived?: boolean; trashed?: boolean; pinned?: boolean;
}

const API = "/api";

function authHeaders(): Record<string, string> {
  const token = getToken();
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export async function fetchNotes(): Promise<Note[]> {
  const res = await fetch(`${API}/notes`, { headers: authHeaders() });
  if (!res.ok) throw new Error("Failed to fetch notes");
  return res.json();
}

export async function createNote(input: CreateNoteInput): Promise<Note> {
  const res = await fetch(`${API}/notes`, {
    method: "POST", headers: authHeaders(), body: JSON.stringify(input),
  });
  if (!res.ok) throw new Error("Failed to create note");
  return res.json();
}

export async function updateNote(id: string, input: UpdateNoteInput): Promise<Note> {
  const res = await fetch(`${API}/notes/${id}`, {
    method: "PATCH", headers: authHeaders(), body: JSON.stringify(input),
  });
  if (!res.ok) throw new Error("Failed to update note");
  return res.json();
}

export async function deleteNote(id: string): Promise<void> {
  const res = await fetch(`${API}/notes/${id}`, { method: "DELETE", headers: authHeaders() });
  if (!res.ok) throw new Error("Failed to delete note");
}

export async function fetchTags(): Promise<Tag[]> {
  const res = await fetch(`${API}/tags`, { headers: authHeaders() });
  if (!res.ok) return [];
  return res.json();
}

export async function createTag(name: string, color?: string): Promise<Tag> {
  const res = await fetch(`${API}/tags`, {
    method: "POST", headers: authHeaders(), body: JSON.stringify({ name, color }),
  });
  if (!res.ok) throw new Error("Failed to create tag");
  return res.json();
}

export async function deleteTag(id: string): Promise<void> {
  const res = await fetch(`${API}/tags/${id}`, { method: "DELETE", headers: authHeaders() });
  if (!res.ok) throw new Error("Failed to delete tag");
}
