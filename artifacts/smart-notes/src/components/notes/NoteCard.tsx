import React, { useState } from "react";
import { format } from "date-fns";
import { Trash2, Pencil, Check, X } from "lucide-react";
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

const ACCENTS = [
  "from-violet-500 to-indigo-500",
  "from-rose-500 to-pink-500",
  "from-amber-500 to-orange-400",
  "from-emerald-500 to-teal-400",
  "from-sky-500 to-blue-500",
  "from-fuchsia-500 to-violet-500",
];

const GLOW = [
  "group-hover:shadow-violet-500/10",
  "group-hover:shadow-rose-500/10",
  "group-hover:shadow-amber-500/10",
  "group-hover:shadow-emerald-500/10",
  "group-hover:shadow-sky-500/10",
  "group-hover:shadow-fuchsia-500/10",
];

function getIdx(id: string) {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = id.charCodeAt(i) + ((h << 5) - h);
  return Math.abs(h) % ACCENTS.length;
}

function highlightText(text: string, query: string) {
  if (!query) return <>{text}</>;
  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi");
  const parts = text.split(regex);
  return (
    <>
      {parts.map((part, i) =>
        regex.test(part) ? (
          <mark key={i} className="bg-violet-500/20 text-violet-300 rounded-sm px-0.5">{part}</mark>
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
  const idx = getIdx(note.id);
  const accent = ACCENTS[idx];
  const glow = GLOW[idx];

  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(note.title);
  const [editContent, setEditContent] = useState(note.content);

  const deleteNote = useDeleteNote({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetNotesQueryKey() });
        toast({ title: "Note deleted" });
      },
      onError: () => {
        toast({ title: "Error", description: "Failed to delete.", variant: "destructive" });
      },
    },
  });

  const updateNote = useUpdateNote({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetNotesQueryKey() });
        setIsEditing(false);
        toast({ title: "Note saved" });
      },
      onError: () => {
        toast({ title: "Error", description: "Failed to save.", variant: "destructive" });
      },
    },
  });

  const handleEditStart = () => { setEditTitle(note.title); setEditContent(note.content); setIsEditing(true); };
  const handleEditCancel = () => { setEditTitle(note.title); setEditContent(note.content); setIsEditing(false); };
  const handleEditSave = () => {
    if (!editTitle.trim() || !editContent.trim()) return;
    updateNote.mutate({ id: note.id, data: { title: editTitle.trim(), content: editContent.trim() } });
  };

  if (isEditing) {
    return (
      <div className="relative rounded-2xl border border-violet-500/25 bg-zinc-900 overflow-hidden flex flex-col shadow-lg animate-in fade-in">
        <div className={`h-0.5 bg-gradient-to-r ${accent}`} />
        <div className="px-4 pt-4 pb-2">
          <Input
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            className="font-bold text-sm text-white bg-zinc-800/60 border-white/8 rounded-lg focus-visible:ring-violet-500/40 focus-visible:border-violet-500/40 h-8"
            placeholder="Title"
          />
        </div>
        <div className="px-4 pb-3 flex-1">
          <Textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            className="text-xs text-zinc-300 leading-relaxed resize-none bg-zinc-800/60 border-white/8 rounded-lg focus-visible:ring-violet-500/40 min-h-[90px] placeholder:text-zinc-600"
            placeholder="Note content..."
          />
        </div>
        <div className="px-4 pb-3 flex items-center justify-end gap-2 border-t border-white/5">
          <Button variant="ghost" size="sm" onClick={handleEditCancel} disabled={updateNote.isPending} className="h-7 text-xs text-zinc-500 hover:text-zinc-300 px-3">
            <X className="h-3 w-3 mr-1" /> Cancel
          </Button>
          <Button size="sm" onClick={handleEditSave} disabled={updateNote.isPending || !editTitle.trim() || !editContent.trim()} className="h-7 text-xs bg-violet-600 hover:bg-violet-500 text-white border-0 px-3">
            <Check className="h-3 w-3 mr-1" /> {updateNote.isPending ? "Saving…" : "Save"}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`group relative rounded-2xl border border-white/5 bg-zinc-900 overflow-hidden flex flex-col cursor-pointer hover:border-white/10 hover:bg-zinc-800/80 transition-all duration-200 shadow-lg ${glow} hover:shadow-lg animate-in fade-in`}
      onClick={handleEditStart}
    >
      {/* accent top bar */}
      <div className={`h-0.5 bg-gradient-to-r ${accent}`} />

      <div className="px-4 pt-4 pb-2">
        <h3 className="font-bold text-sm text-white leading-snug line-clamp-2">
          {highlightText(note.title, searchQuery)}
        </h3>
      </div>

      <div className="px-4 pb-4 flex-1">
        <p className="text-zinc-500 text-xs leading-relaxed whitespace-pre-wrap line-clamp-5">
          {highlightText(note.content, searchQuery)}
        </p>
      </div>

      <div className="px-4 pb-3 pt-2 flex items-center justify-between border-t border-white/5">
        <span className="text-[10px] text-zinc-700 font-medium tabular-nums">
          {format(new Date(note.createdAt), "MMM d, yyyy")}
        </span>
        <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            className="h-6 w-6 flex items-center justify-center rounded-lg text-zinc-600 hover:text-violet-400 hover:bg-violet-500/10 transition-colors"
            aria-label="Edit"
          >
            <Pencil className="h-3 w-3" />
          </button>
          <button
            className="h-6 w-6 flex items-center justify-center rounded-lg text-zinc-600 hover:text-red-400 hover:bg-red-500/10 transition-colors"
            onClick={(e) => { e.stopPropagation(); deleteNote.mutate({ id: note.id }); }}
            disabled={deleteNote.isPending}
            aria-label="Delete"
          >
            <Trash2 className="h-3 w-3" />
          </button>
        </div>
      </div>
    </div>
  );
}
