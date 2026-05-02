"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchNotes, createNote, updateNote, deleteNote, fetchTags, createTag, deleteTag, type Note, type Tag } from "@/lib/api";
import { isLoggedIn, getUser } from "@/lib/auth";
import { Sidebar } from "./Sidebar";
import { NoteList } from "./NoteList";
import { Editor } from "./Editor";
import { ShortcutsModal } from "./ShortcutsModal";
import { SettingsModal } from "./SettingsModal";
import { CommandPalette } from "./CommandPalette";
import { ChatBot } from "./ChatBot";
import { ToastContainer, type ToastItem, type ToastType } from "./Toast";
import { useTheme } from "@/lib/providers";
import Link from "next/link";

export type View = "notes" | "starred" | "archived" | "trash" | "pinned" | "tag";

export function AppShell() {
  const qc = useQueryClient();
  const { dark, toggle: toggleTheme } = useTheme();
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    setLoggedIn(isLoggedIn());
  }, []);

  const [view, setView] = useState<View>("notes");
  const [activeTagId, setActiveTagId] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showCommandPalette, setShowCommandPalette] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [focusMode, setFocusMode] = useState(false);
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const toastCounter = useRef(0);

  const { data: notes = [], isLoading: notesLoading } = useQuery({
    queryKey: ["notes"],
    queryFn: fetchNotes,
    enabled: loggedIn,
  });

  const { data: tags = [] } = useQuery({
    queryKey: ["tags"],
    queryFn: fetchTags,
    enabled: loggedIn,
  });

  function addToast(message: string, type: ToastType = "info") {
    const id = `toast-${++toastCounter.current}`;
    setToasts(prev => [...prev, { id, message, type }]);
  }

  function removeToast(id: string) {
    setToasts(prev => prev.filter(t => t.id !== id));
  }

  const createMutation = useMutation({
    mutationFn: createNote,
    onSuccess: (note) => {
      qc.invalidateQueries({ queryKey: ["notes"] });
      setSelectedId(note.id);
      setView("notes");
      addToast("New note created", "success");
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
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["tags"] }); addToast("Tag created", "success"); },
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
      if (meta && e.key === "k") { e.preventDefault(); setShowCommandPalette(s => !s); }
      if (meta && e.key === "/") { e.preventDefault(); setShowShortcuts(s => !s); }
      if (meta && e.key === ",") { e.preventDefault(); setShowSettings(s => !s); }
      if (meta && e.shiftKey && e.key === "F") { e.preventDefault(); setFocusMode(f => !f); }
      if (meta && e.key === "\\") { e.preventDefault(); setSidebarCollapsed(c => !c); }
      if (e.key === "Escape") {
        setShowShortcuts(false); setShowSettings(false);
        setShowCommandPalette(false); setFocusMode(false);
      }
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

  if (!loggedIn) {
    return (
      <div style={{ display: "flex", height: "100vh", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 24, background: "var(--bg-app)", color: "var(--text-primary)" }}>
        <div style={{ width: 56, height: 56, borderRadius: 16, background: "linear-gradient(135deg,#6366f1,#8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 0 40px rgba(99,102,241,0.4)" }}>
          <svg width="26" height="26" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
        </div>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 22, fontWeight: 700, marginBottom: 8 }}>Smart Ins-Note</div>
          <div style={{ fontSize: 14, color: "var(--text-muted)", maxWidth: 320 }}>Sign in to access your notes and sync across all your devices.</div>
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          <Link href="/auth" style={{ background: "linear-gradient(135deg,#6366f1,#8b5cf6)", color: "white", padding: "11px 28px", borderRadius: 10, fontWeight: 600, fontSize: 14, textDecoration: "none", boxShadow: "0 4px 20px rgba(99,102,241,0.35)" }}>
            Sign In
          </Link>
          <Link href="/auth" style={{ background: "var(--bg-hover)", color: "var(--text-primary)", padding: "11px 28px", borderRadius: 10, fontWeight: 600, fontSize: 14, textDecoration: "none", border: "1px solid var(--border)" }}>
            Create Account
          </Link>
        </div>
        <p style={{ fontSize: 12, color: "#1e293b", marginTop: 8 }}>Your notes sync securely across all devices</p>
      </div>
    );
  }

  return (
    <>
      <div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>
        <Sidebar
          view={view} activeTagId={activeTagId} tags={tags} counts={counts}
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(c => !c)}
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
          onToast={addToast}
        />
        <Editor
          note={selectedNote} onChange={handleNoteChange}
          onToggleStar={handleToggleStar} onTogglePin={handleTogglePin}
          onTrash={handleTrash} onArchive={handleToggleArchive}
          onOpenSettings={() => setShowSettings(true)}
          onToast={addToast}
          focusMode={focusMode}
          onExitFocus={() => setFocusMode(false)}
        />
      </div>

      {showShortcuts && <ShortcutsModal onClose={() => setShowShortcuts(false)} />}
      {showSettings && <SettingsModal onClose={() => setShowSettings(false)} />}
      {showCommandPalette && (
        <CommandPalette
          notes={notes}
          dark={dark}
          onClose={() => setShowCommandPalette(false)}
          onSelectNote={(id) => { setSelectedId(id); setView("notes"); }}
          onNewNote={handleNewNote}
          onOpenSettings={() => setShowSettings(true)}
          onToggleTheme={toggleTheme}
          onToggleFocus={() => setFocusMode(f => !f)}
          onShowShortcuts={() => setShowShortcuts(true)}
        />
      )}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
      <ChatBot
        notes={notes}
        onCreateNote={(title, content) => createMutation.mutateAsync({ title, content })}
        onUpdateNote={(id, fields) => updateMutation.mutateAsync({ id, ...fields })}
        onDeleteNote={(id) => deleteMutation.mutateAsync(id)}
        onOpenNote={(id) => { setSelectedId(id); setView("notes"); }}
        onToast={addToast}
      />
    </>
  );
}
