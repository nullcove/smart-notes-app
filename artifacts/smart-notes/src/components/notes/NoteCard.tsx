import React from "react";
import { format } from "date-fns";
import { Trash2 } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Note } from "@workspace/api-client-react";
import { useDeleteNote, getGetNotesQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

interface NoteCardProps {
  note: Note;
}

export function NoteCard({ note }: NoteCardProps) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
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

  const handleDelete = () => {
    deleteNote.mutate({ id: note.id });
  };

  return (
    <Card className="group relative overflow-hidden flex flex-col h-full bg-card hover:shadow-md transition-all duration-300 border-border/50 animate-in fade-in slide-in-from-bottom-4">
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
        <Button
          variant="ghost"
          size="icon"
          onClick={handleDelete}
          disabled={deleteNote.isPending}
          className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity"
          aria-label="Delete note"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}
