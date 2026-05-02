import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Plus } from "lucide-react";
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
  title: z.string().min(1, "Title is required").max(100),
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
        toast({ title: "✦ Note saved", description: "Captured successfully." });
      },
      onError: () => {
        toast({ title: "Error", description: "Failed to create note.", variant: "destructive" });
      },
    },
  });

  const onSubmit = (data: FormValues) => createNote.mutate({ data });

  return (
    <div className="rounded-2xl border border-white/8 bg-zinc-900 overflow-hidden">
      {/* gradient header bar */}
      <div className="h-px bg-gradient-to-r from-violet-500/0 via-violet-500/60 to-violet-500/0" />
      <div className="p-5">
        <p className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-4">New Note</p>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder="Title…"
                      className="h-9 text-sm font-semibold bg-zinc-800/80 border-white/6 text-zinc-100 placeholder:text-zinc-600 focus-visible:ring-violet-500/40 focus-visible:border-violet-500/40 rounded-xl"
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
                      className="resize-none min-h-[120px] text-sm bg-zinc-800/80 border-white/6 text-zinc-200 placeholder:text-zinc-600 focus-visible:ring-violet-500/40 focus-visible:border-violet-500/40 leading-relaxed rounded-xl"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-xs text-red-400" />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              size="sm"
              disabled={createNote.isPending || !form.formState.isValid}
              className="w-full h-9 bg-violet-600 hover:bg-violet-500 text-white border-0 shadow-lg shadow-violet-600/20 font-bold text-sm rounded-xl"
            >
              {createNote.isPending ? (
                <><Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />Saving…</>
              ) : (
                <><Plus className="mr-2 h-3.5 w-3.5" />Save Note</>
              )}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
