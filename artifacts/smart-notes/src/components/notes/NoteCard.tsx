import React, { useState } from "react";
import { format } from "date-fns";
import { Trash2, Pencil, Check, X, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { Note } from "@workspace/api-client-react";
import { useDeleteNote, useUpdateNote, getGetNotesQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

interface NoteCardProps {
  note: Note;
  searchQuery?: string;
}

const ACCENT_COLORS = [
  "from-violet-500 to-indigo-500",
  "from-rose-500 to-pink-500",
  "from-amber-500 to-orange-400",
  "from-emerald-500 to-teal-500",
  "from-sky-500 to-blue-500",
  "from-fuchsia-500 to-violet-500",
];

function getAccentColor(id: string): string {
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = id.charCodeAt(i) + ((hash << 5) - hash);
  return ACCENT_COLORS[Math.abs(hash) % ACCENT_COLORS.length];
}

function highlightText(text: string, query: string) {
  if (!query) return <>{text}</>;
  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi");
  const parts = text.split(regex);
  return (
    <>
      {parts.map((part, i) =>
        regex.test(part) ? (
          <mark key={i} className="bg-violet-500/25 text-violet-300 rounded-sm px-0.5">
            {part}
          </mark>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  );
}

export function NoteCard({ note, searchQuery = "" }: NoteCardProps) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const accent = getAccentColor(note.id);

  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(note.title);
  const [editContent, setEditContent] = useState(note.content);

  const deleteNote = useDeleteNote({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetNotesQueryKey() });
        toast({ title: "Note deleted", description: "Your note has been removed." });
      },
      onError: () => {
        toast({ title: "Error", description: "Failed to delete the note.", variant: "destructive" });
      },
    },
  });

  const updateNote = useUpdateNote({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetNotesQueryKey() });
        setIsEditing(false);
        toast({ title: "Note saved", description: "Your changes have been saved." });
      },
      onError: () => {
        toast({ title: "Error", description: "Failed to save the note.", variant: "destructive" });
      },
    },
  });

  const handleDelete = () => deleteNote.mutate({ id: note.id });
  const handleEditStart = () => { setEditTitle(note.title); setEditContent(note.content); setIsEditing(true); };
  const handleEditCancel = () => { setEditTitle(note.title); setEditContent(note.content); setIsEditing(false); };
  const handleEditSave = () => {
    if (!editTitle.trim() || !editContent.trim()) return;
    updateNote.mutate({ id: note.id, data: { title: editTitle.trim(), content: editContent.trim() } });
  };

  if (isEditing) {
    return (
      <div className="relative rounded-xl border border-violet-500/30 bg-zinc-900 overflow-hidden flex flex-col animate-in fade-in shadow-lg shadow-violet-500/10">
        <div className={`absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r ${accent}`} />
        <div className="px-5 pt-5 pb-3">
          <Input
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            className="font-semibold text-base text-white bg-transparent border-0 border-b border-white/10 rounded-none px-0 focus-visible:ring-0 focus-visible:border-violet-500/50 placeholder:text-zinc-600"
            placeholder="Title"
          />
        </div>
        <div className="px-5 pb-4 flex-1">
          <Textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            className="text-sm text-zinc-300 leading-relaxed resize-none bg-transparent border-0 rounded-none px-0 focus-visible:ring-0 min-h-[110px] placeholder:text-zinc-600"
            placeholder="Note content..."
          />
        </div>
        <div className="px-5 pb-4 pt-2 flex items-center justify-end gap-2 border-t border-white/5">
          <Button variant="ghost" size="sm" onClick={handleEditCancel} disabled={updateNote.isPending} className="h-7 text-xs text-zinc-500 hover:text-zinc-300">
            <X className="h-3.5 w-3.5 mr-1" /> Cancel
          </Button>
          <Button size="sm" onClick={handleEditSave} disabled={updateNote.isPending || !editTitle.trim() || !editContent.trim()} className="h-7 text-xs bg-violet-600 hover:bg-violet-500 text-white border-0">
            <Check className="h-3.5 w-3.5 mr-1" /> {updateNote.isPending ? "Saving..." : "Save"}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="group relative rounded-xl border border-white/5 bg-zinc-900 overflow-hidden flex flex-col hover:border-white/10 hover:bg-zinc-800/80 transition-all duration-200 cursor-pointer animate-in fade-in"
      onClick={handleEditStart}
    >
      {/* Top accent bar */}
      <div className={`absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r ${accent}`} />

      <div className="px-5 pt-5 pb-3">
        <h3 className="font-semibold text-base text-white leading-snug line-clamp-2">
          {highlightText(note.title, searchQuery)}
        </h3>
      </div>

      <div className="px-5 pb-4 flex-1">
        <p className="text-zinc-400 text-sm leading-relaxed whitespace-pre-wrap line-clamp-5">
          {highlightText(note.content, searchQuery)}
        </p>
      </div>

      <div className="px-5 pb-4 pt-2 flex items-center justify-between border-t border-white/5">
        <span className="flex items-center gap-1.5 text-xs text-zinc-600 font-medium">
          <Calendar className="h-3 w-3" />
          {format(new Date(note.createdAt), "MMM d, yyyy")}
        </span>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            className="h-7 w-7 flex items-center justify-center rounded-md text-zinc-500 hover:text-violet-400 hover:bg-violet-500/10 transition-colors"
            aria-label="Edit note"
          >
            <Pencil className="h-3.5 w-3.5" />
          </button>
          <button
            className="h-7 w-7 flex items-center justify-center rounded-md text-zinc-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
            onClick={(e) => { e.stopPropagation(); handleDelete(); }}
            disabled={deleteNote.isPending}
            aria-label="Delete note"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
