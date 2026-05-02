import { Link } from "wouter";
import { BookMarked } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-white/5 bg-zinc-950 py-10 mt-auto">
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-gradient-to-br from-violet-500 to-indigo-600">
            <BookMarked className="h-3.5 w-3.5 text-white" />
          </div>
          <span className="text-sm font-bold text-zinc-400">
            Smart<span className="text-violet-400">Notes</span>
          </span>
        </div>
        <p className="text-xs text-zinc-600">
          &copy; {new Date().getFullYear()} SmartNotes. Crafted with intention.
        </p>
        <div className="flex gap-5">
          <Link href="/" className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors">Home</Link>
          <Link href="/notes" className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors">Workspace</Link>
        </div>
      </div>
    </footer>
  );
}
