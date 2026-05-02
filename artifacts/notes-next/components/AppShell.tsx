"use client";

import { useState, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchNotes, createNote, updateNote, deleteNote, fetchTags, createTag, deleteTag, type Note, type Tag } from "@/lib/api";
import { Sidebar } from "./Sidebar";
import { NoteList } from "./NoteList";
import { Editor } from "./Editor";

export type View = "notes" | "starred" | "archived" | "trash" | "tag";

export function AppShell() {
  const qc = useQueryClient();
  const [view, setView] = useState<View>("notes");
  const [activeTagId, setActiveTagId] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const { data: notes = [], isLoading: notesLoading } = useQuery({
    queryKey: ["notes"],
    queryFn: fetchNotes,
  });

  const { data: tags = [] } = useQuery({
    queryKey: ["tags"],
    queryFn: fetchTags,
  });

  const createMutation = useMutation({
    mutationFn: createNote,
    onSuccess: (note) => {
      qc.invalidateQueries({ queryKey: ["notes"] });
      setSelectedId(note.id);
      setView("notes");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, ...rest }: { id: string } & Parameters<typeof updateNote>[1]) =>
      updateNote(id, rest),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["notes"] }),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteNote,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["notes"] });
      setSelectedId(null);
    },
  });

  const createTagMutation = useMutation({
    mutationFn: ({ name, color }: { name: string; color?: string }) =>
      createTag(name, color),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["tags"] }),
  });

  const deleteTagMutation = useMutation({
    mutationFn: deleteTag,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["tags"] }),
  });

  const filteredNotes = notes.filter((n) => {
    const q = search.toLowerCase();
    const matchesSearch = !q || n.title.toLowerCase().includes(q) || n.content.toLowerCase().includes(q);
    if (!matchesSearch) return false;
    if (view === "starred") return !!n.starred && !n.trashed;
    if (view === "archived") return !!n.archived && !n.trashed;
    if (view === "trash") return !!n.trashed;
    return !n.trashed && !n.archived;
  });

  const selectedNote = notes.find((n) => n.id === selectedId) ?? null;

  const handleNewNote = useCallback(() => {
    createMutation.mutate({ title: "", content: "" });
  }, [createMutation]);

  const handleNoteChange = useCallback(
    (id: string, field: "title" | "content", value: string) => {
      updateMutation.mutate({ id, [field]: value });
    },
    [updateMutation]
  );

  const handleToggleStar = useCallback(
    (note: Note) => updateMutation.mutate({ id: note.id, starred: !note.starred }),
    [updateMutation]
  );

  const handleToggleArchive = useCallback(
    (note: Note) => updateMutation.mutate({ id: note.id, archived: !note.archived }),
    [updateMutation]
  );

  const handleTrash = useCallback(
    (note: Note) => {
      updateMutation.mutate({ id: note.id, trashed: true });
      if (selectedId === note.id) setSelectedId(null);
    },
    [updateMutation, selectedId]
  );

  const handleRestoreFromTrash = useCallback(
    (note: Note) => updateMutation.mutate({ id: note.id, trashed: false }),
    [updateMutation]
  );

  const handleDeleteForever = useCallback(
    (id: string) => deleteMutation.mutate(id),
    [deleteMutation]
  );

  const handleCreateTag = useCallback(
    (name: string) => createTagMutation.mutate({ name }),
    [createTagMutation]
  );

  const handleDeleteTag = useCallback(
    (id: string) => deleteTagMutation.mutate(id),
    [deleteTagMutation]
  );

  const counts = {
    notes: notes.filter((n) => !n.trashed && !n.archived).length,
    starred: notes.filter((n) => n.starred && !n.trashed).length,
    archived: notes.filter((n) => n.archived && !n.trashed).length,
    trash: notes.filter((n) => n.trashed).length,
  };

  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>
      <Sidebar
        view={view}
        activeTagId={activeTagId}
        tags={tags}
        counts={counts}
        onViewChange={(v) => { setView(v); setSelectedId(null); setActiveTagId(null); }}
        onTagClick={(id) => { setView("tag"); setActiveTagId(id); setSelectedId(null); }}
        onCreateTag={handleCreateTag}
        onDeleteTag={handleDeleteTag}
      />
      <NoteList
        notes={filteredNotes}
        view={view}
        search={search}
        selectedId={selectedId}
        loading={notesLoading}
        onSelect={(id) => setSelectedId(id)}
        onSearch={setSearch}
        onNew={handleNewNote}
        onToggleStar={handleToggleStar}
        onArchive={handleToggleArchive}
        onTrash={handleTrash}
        onRestore={handleRestoreFromTrash}
        onDeleteForever={handleDeleteForever}
      />
      <Editor
        note={selectedNote}
        onChange={handleNoteChange}
        onToggleStar={handleToggleStar}
        onTrash={handleTrash}
        onArchive={handleToggleArchive}
      />
    </div>
  );
}
