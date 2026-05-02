import { Link } from "wouter";
import { PenSquare } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t bg-slate-50 py-12 mt-auto">
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2">
          <PenSquare className="h-5 w-5 text-muted-foreground" />
          <span className="font-serif text-lg font-medium text-muted-foreground">SmartNotes</span>
        </div>
        <p className="text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} SmartNotes. Crafted with intention.
        </p>
        <div className="flex gap-4">
          <Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Home</Link>
          <Link href="/notes" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Workspace</Link>
        </div>
      </div>
    </footer>
  );
}
