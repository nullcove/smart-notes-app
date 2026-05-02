import React, { useState } from "react";
import { PenLine, Search, X } from "lucide-react";
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
    <div className="min-h-screen bg-zinc-950 pb-20">
      {/* Header */}
      <div className="border-b border-white/5 bg-zinc-900/40 backdrop-blur-sm pt-10 pb-10">
        <div className="container max-w-5xl mx-auto px-4">
          <h1 className="text-3xl font-bold tracking-tight mb-1 text-white">
            My Notes
          </h1>
          <p className="text-zinc-500 text-sm">
            Capture your thoughts, ideas, and reminders.
          </p>
        </div>
      </div>

      <div className="container max-w-5xl mx-auto px-4 pt-10">
        <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-8 items-start">
          {/* Create form */}
          <div className="sticky top-24">
            <CreateNoteForm />
          </div>

          {/* Notes area */}
          <div className="space-y-5">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500 pointer-events-none" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search notes by title or content…"
                className="pl-9 pr-9 bg-zinc-900 border-white/8 text-zinc-200 placeholder:text-zinc-600 focus-visible:ring-violet-500/50 focus-visible:border-violet-500/50"
              />
              {query && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setQuery("")}
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 text-zinc-500 hover:text-zinc-300"
                  aria-label="Clear search"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="bg-zinc-900 p-5 rounded-xl border border-white/5 space-y-3 h-[200px]">
                    <Skeleton className="h-5 w-2/3 bg-zinc-800" />
                    <Skeleton className="h-3.5 w-full bg-zinc-800/60" />
                    <Skeleton className="h-3.5 w-full bg-zinc-800/60" />
                    <Skeleton className="h-3.5 w-4/5 bg-zinc-800/60" />
                    <div className="mt-auto pt-4">
                      <Skeleton className="h-3 w-24 bg-zinc-800/40" />
                    </div>
                  </div>
                ))}
              </div>
            ) : isError ? (
              <div className="bg-red-950/30 text-red-400 border border-red-500/20 p-6 rounded-xl text-center">
                <p className="font-medium">Failed to load notes.</p>
                <p className="text-sm opacity-70 mt-1">Please try refreshing the page.</p>
              </div>
            ) : filteredNotes.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredNotes.map((note) => (
                  <NoteCard key={note.id} note={note} searchQuery={trimmed} />
                ))}
              </div>
            ) : trimmed ? (
              <div className="border border-white/5 border-dashed rounded-xl p-12 text-center flex flex-col items-center justify-center">
                <div className="h-14 w-14 bg-zinc-900 rounded-full flex items-center justify-center mb-5 border border-white/5">
                  <Search className="h-6 w-6 text-violet-400/60" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">No notes found</h3>
                <p className="text-zinc-500 text-sm max-w-[240px] mx-auto">
                  No notes match &ldquo;{query.trim()}&rdquo;. Try a different keyword.
                </p>
              </div>
            ) : (
              <div className="border border-white/5 border-dashed rounded-xl p-12 text-center flex flex-col items-center justify-center">
                <div className="h-14 w-14 bg-zinc-900 rounded-full flex items-center justify-center mb-5 border border-white/5">
                  <PenLine className="h-6 w-6 text-violet-400/60" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">No notes yet</h3>
                <p className="text-zinc-500 text-sm max-w-[240px] mx-auto">
                  Your workspace is ready. Capture your first thought using the form.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
