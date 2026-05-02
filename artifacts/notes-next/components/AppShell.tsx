"use client";

import { useState, useCallback, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchNotes, createNote, updateNote, deleteNote, fetchTags, createTag, deleteTag, type Note, type Tag } from "@/lib/api";
import { Sidebar } from "./Sidebar";
import { NoteList } from "./NoteList";
import { Editor } from "./Editor";
import { ShortcutsModal } from "./ShortcutsModal";
import { SettingsModal } from "./SettingsModal";

export type View = "notes" | "starred" | "archived" | "trash" | "pinned" | "tag";

export function AppShell() {
  const qc = useQueryClient();
  const [view, setView] = useState<View>("notes");
  const [activeTagId, setActiveTagId] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

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
    mutationFn: ({ name, color }: { name: string; color?: string }) => createTag(name, color),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["tags"] }),
  });

  const deleteTagMutation = useMutation({
    mutationFn: deleteTag,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["tags"] }),
  });

  const handleNewNote = useCallback(() => {
    createMutation.mutate({ title: "", content: "" });
  }, [createMutation]);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      const meta = e.metaKey || e.ctrlKey;
      if (meta && e.key === "n") { e.preventDefault(); handleNewNote(); }
      if (meta && e.key === "k") { e.preventDefault(); document.querySelector<HTMLInputElement>(".search-input")?.focus(); }
      if (meta && e.key === "/") { e.preventDefault(); setShowShortcuts(s => !s); }
      if (meta && e.key === ",") { e.preventDefault(); setShowSettings(s => !s); }
      if (e.key === "Escape") { setShowShortcuts(false); setShowSettings(false); }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [handleNewNote]);

  const filteredNotes = notes.filter((n) => {
    const q = search.toLowerCase();
    const matchesSearch = !q || n.title.toLowerCase().includes(q) || n.content.toLowerCase().includes(q);
    if (!matchesSearch) return false;
    if (view === "starred") return !!n.starred && !n.trashed;
    if (view === "archived") return !!n.archived && !n.trashed;
    if (view === "trash") return !!n.trashed;
    if (view === "pinned") return !!n.pinned && !n.trashed;
    if (view === "tag") return !n.trashed && !n.archived;
    return !n.trashed && !n.archived;
  });

  const sortedNotes = view === "notes"
    ? [...filteredNotes].sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0))
    : filteredNotes;

  const selectedNote = notes.find((n) => n.id === selectedId) ?? null;

  const handleNoteChange = useCallback(
    (id: string, field: "title" | "content", value: string) => {
      updateMutation.mutate({ id, [field]: value });
    },
    [updateMutation]
  );

  const handleToggleStar = useCallback((note: Note) => updateMutation.mutate({ id: note.id, starred: !note.starred }), [updateMutation]);
  const handleTogglePin = useCallback((note: Note) => updateMutation.mutate({ id: note.id, pinned: !note.pinned }), [updateMutation]);
  const handleToggleArchive = useCallback((note: Note) => updateMutation.mutate({ id: note.id, archived: !note.archived }), [updateMutation]);
  const handleTrash = useCallback((note: Note) => {
    updateMutation.mutate({ id: note.id, trashed: true });
    if (selectedId === note.id) setSelectedId(null);
  }, [updateMutation, selectedId]);
  const handleRestoreFromTrash = useCallback((note: Note) => updateMutation.mutate({ id: note.id, trashed: false }), [updateMutation]);
  const handleDeleteForever = useCallback((id: string) => deleteMutation.mutate(id), [deleteMutation]);

  const counts = {
    notes: notes.filter((n) => !n.trashed && !n.archived).length,
    starred: notes.filter((n) => n.starred && !n.trashed).length,
    archived: notes.filter((n) => n.archived && !n.trashed).length,
    trash: notes.filter((n) => n.trashed).length,
    pinned: notes.filter((n) => n.pinned && !n.trashed).length,
  };

  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>
      <Sidebar
        view={view} activeTagId={activeTagId} tags={tags} counts={counts}
        onViewChange={(v) => { setView(v); setSelectedId(null); setActiveTagId(null); }}
        onTagClick={(id) => { setView("tag"); setActiveTagId(id); setSelectedId(null); }}
        onCreateTag={(name) => createTagMutation.mutate({ name })}
        onDeleteTag={(id) => deleteTagMutation.mutate(id)}
        onShowShortcuts={() => setShowShortcuts(true)}
        onOpenSettings={() => setShowSettings(true)}
      />
      <NoteList
        notes={sortedNotes} view={view} search={search} selectedId={selectedId} loading={notesLoading}
        onSelect={(id) => setSelectedId(id)} onSearch={setSearch} onNew={handleNewNote}
        onToggleStar={handleToggleStar} onTogglePin={handleTogglePin}
        onArchive={handleToggleArchive} onTrash={handleTrash}
        onRestore={handleRestoreFromTrash} onDeleteForever={handleDeleteForever}
      />
      <Editor
        note={selectedNote} onChange={handleNoteChange}
        onToggleStar={handleToggleStar} onTogglePin={handleTogglePin}
        onTrash={handleTrash} onArchive={handleToggleArchive}
        onOpenSettings={() => setShowSettings(true)}
      />
      {showShortcuts && <ShortcutsModal onClose={() => setShowShortcuts(false)} />}
      {showSettings && <SettingsModal onClose={() => setShowSettings(false)} />}
    </div>
  );
}
