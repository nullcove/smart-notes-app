import React, { useState } from "react";
import { PenLine, Search, X, StickyNote } from "lucide-react";
import { useGetNotes } from "@workspace/api-client-react";
import { CreateNoteForm } from "@/components/notes/CreateNoteForm";
import { NoteCard } from "@/components/notes/NoteCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function Notes() {
  const { data: notes, isLoading, isError } = useGetNotes();
  const [query, setQuery] = useState("");

  const trimmed = query.trim().toLowerCase();
  const filteredNotes = trimmed
    ? (notes ?? []).filter(
        (note) =>
          note.title.toLowerCase().includes(trimmed) ||
          note.content.toLowerCase().includes(trimmed)
      )
    : (notes ?? []);

  return (
    <div className="min-h-screen bg-zinc-950 pb-24">
      {/* Header */}
      <div className="relative border-b border-white/5 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_80%_at_50%_-20%,rgba(124,58,237,0.1),transparent)]" />
        <div className="container max-w-5xl mx-auto px-4 pt-12 pb-10 relative z-10">
          <div className="flex items-end justify-between">
            <div>
              <div className="flex items-center gap-2.5 mb-2">
                <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center">
                  <StickyNote className="h-4 w-4 text-white" />
                </div>
                <h1 className="text-3xl font-black tracking-tight text-white">My Notes</h1>
              </div>
              <p className="text-zinc-500 text-sm pl-[42px]">
                Capture your thoughts, ideas, and reminders.
              </p>
            </div>
            {notes && notes.length > 0 && (
              <div className="text-xs text-zinc-600 font-medium tabular-nums">
                {filteredNotes.length}{trimmed ? ` of ${notes.length}` : ""} note{filteredNotes.length !== 1 ? "s" : ""}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="container max-w-5xl mx-auto px-4 pt-10">
        <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-8 items-start">
          {/* Create form */}
          <div className="sticky top-[88px]">
            <CreateNoteForm />
          </div>

          {/* Notes area */}
          <div className="space-y-5">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-600 pointer-events-none" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search notes…"
                className="pl-9 pr-9 h-10 bg-zinc-900/80 border-white/6 text-zinc-200 placeholder:text-zinc-600 focus-visible:ring-violet-500/40 focus-visible:border-violet-500/40 rounded-xl"
              />
              {query && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setQuery("")}
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 text-zinc-600 hover:text-zinc-300"
                  aria-label="Clear search"
                >
                  <X className="h-3.5 w-3.5" />
                </Button>
              )}
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="bg-zinc-900 p-5 rounded-2xl border border-white/5 space-y-3 h-[180px]">
                    <Skeleton className="h-4 w-2/3 bg-zinc-800 rounded-lg" />
                    <Skeleton className="h-3 w-full bg-zinc-800/60 rounded-lg" />
                    <Skeleton className="h-3 w-5/6 bg-zinc-800/60 rounded-lg" />
                    <Skeleton className="h-3 w-4/6 bg-zinc-800/60 rounded-lg" />
                  </div>
                ))}
              </div>
            ) : isError ? (
              <div className="bg-red-950/20 text-red-400 border border-red-500/15 p-7 rounded-2xl text-center">
                <p className="font-semibold mb-1">Failed to load notes.</p>
                <p className="text-sm opacity-60">Please try refreshing the page.</p>
              </div>
            ) : filteredNotes.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {filteredNotes.map((note) => (
                  <NoteCard key={note.id} note={note} searchQuery={trimmed} />
                ))}
              </div>
            ) : trimmed ? (
              <EmptyState
                icon={Search}
                title="No notes found"
                desc={`Nothing matches "${query.trim()}". Try a different keyword.`}
              />
            ) : (
              <EmptyState
                icon={PenLine}
                title="No notes yet"
                desc="Your workspace is ready. Capture your first thought using the form."
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function EmptyState({ icon: Icon, title, desc }: { icon: React.ElementType; title: string; desc: string }) {
  return (
    <div className="border border-white/5 border-dashed rounded-2xl p-14 text-center flex flex-col items-center">
      <div className="h-14 w-14 rounded-2xl bg-zinc-900 border border-white/8 flex items-center justify-center mb-5">
        <Icon className="h-6 w-6 text-violet-400/50" />
      </div>
      <h3 className="text-base font-bold text-white mb-2">{title}</h3>
      <p className="text-zinc-500 text-sm max-w-[220px] mx-auto leading-relaxed">{desc}</p>
    </div>
  );
}
