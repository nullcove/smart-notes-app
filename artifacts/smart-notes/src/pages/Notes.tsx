import React from "react";
import { PenLine, FileQuestion } from "lucide-react";
import { useGetNotes } from "@workspace/api-client-react";
import { CreateNoteForm } from "@/components/notes/CreateNoteForm";
import { NoteCard } from "@/components/notes/NoteCard";
import { Skeleton } from "@/components/ui/skeleton";

export default function Notes() {
  const { data: notes, isLoading, isError } = useGetNotes();

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20">
      {/* Header */}
      <div className="bg-background border-b pt-10 pb-10">
        <div className="container max-w-5xl mx-auto px-4">
          <h1 className="text-4xl font-serif font-medium tracking-tight mb-2 text-foreground">
            My Notes
          </h1>
          <p className="text-muted-foreground">
            Capture your thoughts, ideas, and reminders.
          </p>
        </div>
      </div>

      <div className="container max-w-5xl mx-auto px-4 pt-10">
        <div className="grid grid-cols-1 lg:grid-cols-[350px_1fr] gap-8 items-start">
          {/* Sidebar / Form */}
          <div className="sticky top-24">
            <CreateNoteForm />
          </div>

          {/* Content Area */}
          <div className="space-y-6">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="bg-card p-5 rounded-xl border shadow-sm space-y-3 h-[200px]">
                    <Skeleton className="h-6 w-2/3" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-4/5" />
                    <div className="mt-auto pt-4">
                      <Skeleton className="h-3 w-24" />
                    </div>
                  </div>
                ))}
              </div>
            ) : isError ? (
              <div className="bg-destructive/10 text-destructive border border-destructive/20 p-6 rounded-xl text-center">
                <p className="font-medium">Failed to load notes.</p>
                <p className="text-sm opacity-80 mt-1">Please try refreshing the page.</p>
              </div>
            ) : notes && notes.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {notes.map((note) => (
                  <NoteCard key={note.id} note={note} />
                ))}
              </div>
            ) : (
              <div className="bg-card border border-dashed rounded-xl p-12 text-center flex flex-col items-center justify-center animate-in fade-in">
                <div className="h-16 w-16 bg-slate-100 rounded-full flex items-center justify-center mb-6">
                  <PenLine className="h-8 w-8 text-primary/60" />
                </div>
                <h3 className="text-xl font-serif font-medium mb-2">No notes yet</h3>
                <p className="text-muted-foreground max-w-[250px] mx-auto">
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
