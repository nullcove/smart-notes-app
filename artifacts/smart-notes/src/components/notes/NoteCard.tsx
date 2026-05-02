import React, { useState } from "react";
import { format } from "date-fns";
import { Trash2, Pencil, Check, X } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { Note } from "@workspace/api-client-react";
import { useDeleteNote, useUpdateNote, getGetNotesQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

interface NoteCardProps {
  note: Note;
}

export function NoteCard({ note }: NoteCardProps) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(note.title);
  const [editContent, setEditContent] = useState(note.content);

  const deleteNote = useDeleteNote({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetNotesQueryKey() });
        toast({
          title: "Note deleted",
          description: "Your note has been successfully removed.",
        });
      },
      onError: () => {
        toast({
          title: "Error",
          description: "Failed to delete the note. Please try again.",
          variant: "destructive",
        });
      }
    }
  });

  const updateNote = useUpdateNote({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetNotesQueryKey() });
        setIsEditing(false);
        toast({
          title: "Note saved",
          description: "Your changes have been saved.",
        });
      },
      onError: () => {
        toast({
          title: "Error",
          description: "Failed to save the note. Please try again.",
          variant: "destructive",
        });
      }
    }
  });

  const handleDelete = () => {
    deleteNote.mutate({ id: note.id });
  };

  const handleEditStart = () => {
    setEditTitle(note.title);
    setEditContent(note.content);
    setIsEditing(true);
  };

  const handleEditCancel = () => {
    setEditTitle(note.title);
    setEditContent(note.content);
    setIsEditing(false);
  };

  const handleEditSave = () => {
    if (!editTitle.trim() || !editContent.trim()) return;
    updateNote.mutate({ id: note.id, data: { title: editTitle.trim(), content: editContent.trim() } });
  };

  if (isEditing) {
    return (
      <Card className="relative overflow-hidden flex flex-col h-full bg-card border-primary/40 shadow-md animate-in fade-in">
        <CardHeader className="pb-3 pt-5 px-5">
          <Input
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            className="font-serif text-xl font-semibold border-0 border-b rounded-none px-0 focus-visible:ring-0 focus-visible:border-primary"
            placeholder="Title"
          />
        </CardHeader>
        <CardContent className="px-5 pb-5 flex-1">
          <Textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            className="text-sm leading-relaxed resize-none border-0 rounded-none px-0 focus-visible:ring-0 min-h-[120px]"
            placeholder="Note content..."
          />
        </CardContent>
        <CardFooter className="px-5 pb-4 pt-0 flex items-center justify-end gap-2 border-t border-border/50 mt-auto bg-slate-50/50">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleEditCancel}
            disabled={updateNote.isPending}
            className="h-8 text-muted-foreground"
          >
            <X className="h-4 w-4 mr-1" />
            Cancel
          </Button>
          <Button
            size="sm"
            onClick={handleEditSave}
            disabled={updateNote.isPending || !editTitle.trim() || !editContent.trim()}
            className="h-8"
          >
            <Check className="h-4 w-4 mr-1" />
            {updateNote.isPending ? "Saving..." : "Save"}
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card
      className="group relative overflow-hidden flex flex-col h-full bg-card hover:shadow-md transition-all duration-300 border-border/50 animate-in fade-in slide-in-from-bottom-4 cursor-pointer"
      onClick={handleEditStart}
    >
      <CardHeader className="pb-3 pt-5 px-5">
        <h3 className="font-serif text-xl font-semibold leading-tight line-clamp-2">
          {note.title}
        </h3>
      </CardHeader>
      <CardContent className="px-5 pb-5 flex-1">
        <p className="text-muted-foreground text-sm leading-relaxed whitespace-pre-wrap line-clamp-6">
          {note.content}
        </p>
      </CardContent>
      <CardFooter className="px-5 pb-4 pt-0 flex items-center justify-between border-t border-border/50 mt-auto bg-slate-50/50">
        <span className="text-xs text-muted-foreground font-medium">
          {format(new Date(note.createdAt), "MMM d, yyyy")}
        </span>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
          <div
            className="h-8 w-8 flex items-center justify-center rounded-md text-muted-foreground hover:text-primary hover:bg-primary/10"
            aria-label="Edit note"
          >
            <Pencil className="h-4 w-4" />
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => { e.stopPropagation(); handleDelete(); }}
            disabled={deleteNote.isPending}
            className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
            aria-label="Delete note"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
