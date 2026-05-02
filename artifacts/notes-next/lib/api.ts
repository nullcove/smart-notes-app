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

export interface CreateNoteInput {
  title: string;
  content: string;
}

export interface UpdateNoteInput {
  title?: string;
  content?: string;
  starred?: boolean;
  archived?: boolean;
  trashed?: boolean;
  pinned?: boolean;
}

const API = "/api";

export async function fetchNotes(): Promise<Note[]> {
  const res = await fetch(`${API}/notes`);
  if (!res.ok) throw new Error("Failed to fetch notes");
  return res.json();
}

export async function createNote(input: CreateNoteInput): Promise<Note> {
  const res = await fetch(`${API}/notes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!res.ok) throw new Error("Failed to create note");
  return res.json();
}

export async function updateNote(id: string, input: UpdateNoteInput): Promise<Note> {
  const res = await fetch(`${API}/notes/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!res.ok) throw new Error("Failed to update note");
  return res.json();
}

export async function deleteNote(id: string): Promise<void> {
  const res = await fetch(`${API}/notes/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete note");
}

export async function fetchTags(): Promise<Tag[]> {
  const res = await fetch(`${API}/tags`);
  if (!res.ok) return [];
  return res.json();
}

export async function createTag(name: string, color?: string): Promise<Tag> {
  const res = await fetch(`${API}/tags`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, color }),
  });
  if (!res.ok) throw new Error("Failed to create tag");
  return res.json();
}

export async function deleteTag(id: string): Promise<void> {
  const res = await fetch(`${API}/tags/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete tag");
}
