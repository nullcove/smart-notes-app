import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Sparkles } from "lucide-react";
import { useCreateNote, getGetNotesQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

const formSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title is too long"),
  content: z.string().min(1, "Content is required"),
});

type FormValues = z.infer<typeof formSchema>;

export function CreateNoteForm() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { title: "", content: "" },
  });

  const createNote = useCreateNote({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetNotesQueryKey() });
        form.reset();
        toast({ title: "Note created", description: "Your note has been successfully captured." });
      },
      onError: () => {
        toast({ title: "Error", description: "Failed to create note. Please try again.", variant: "destructive" });
      },
    },
  });

  const onSubmit = (data: FormValues) => createNote.mutate({ data });

  return (
    <div className="rounded-xl border border-white/8 bg-zinc-900 p-5 relative overflow-hidden">
      {/* Accent top bar */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-violet-500 via-indigo-500 to-violet-500" />

      <div className="flex items-center gap-2 mb-5">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-violet-500/10 border border-violet-500/20">
          <Sparkles className="h-3.5 w-3.5 text-violet-400" />
        </div>
        <h2 className="text-sm font-semibold text-zinc-200">Capture a thought</h2>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    placeholder="Note title..."
                    className="text-sm font-medium bg-zinc-800/60 border-white/5 text-zinc-200 placeholder:text-zinc-600 focus-visible:ring-violet-500/40 focus-visible:border-violet-500/40 h-9"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-xs text-red-400" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Textarea
                    placeholder="What's on your mind?"
                    className="resize-none min-h-[110px] text-sm bg-zinc-800/60 border-white/5 text-zinc-200 placeholder:text-zinc-600 focus-visible:ring-violet-500/40 focus-visible:border-violet-500/40 leading-relaxed"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-xs text-red-400" />
              </FormItem>
            )}
          />
          <div className="flex justify-end pt-1">
            <Button
              type="submit"
              size="sm"
              disabled={createNote.isPending || !form.formState.isValid}
              className="bg-violet-600 hover:bg-violet-500 text-white border-0 shadow-lg shadow-violet-600/20 font-medium px-5"
            >
              {createNote.isPending ? (
                <><Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" /> Saving...</>
              ) : (
                <><Sparkles className="mr-2 h-3.5 w-3.5" /> Save Note</>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
