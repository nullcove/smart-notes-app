import { Link, useLocation } from "wouter";
import { PenSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function Navbar() {
  const [location] = useLocation();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 transition-opacity hover:opacity-80">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <PenSquare className="h-5 w-5" />
          </div>
          <span className="font-serif text-xl font-semibold tracking-tight">SmartNotes</span>
        </Link>
        
        <nav className="flex items-center gap-6">
          <Link 
            href="/" 
            className={cn(
              "text-sm font-medium transition-colors hover:text-primary",
              location === "/" ? "text-foreground" : "text-muted-foreground"
            )}
          >
            Home
          </Link>
          <Link 
            href="/notes" 
            className={cn(
              "text-sm font-medium transition-colors hover:text-primary",
              location === "/notes" ? "text-foreground" : "text-muted-foreground"
            )}
          >
            My Notes
          </Link>
          <Link href="/notes" className="ml-2 hidden sm:inline-flex">
            <Button variant={location === "/notes" ? "secondary" : "default"} size="sm">
              Open Workspace
            </Button>
          </Link>
        </nav>
      </div>
    </header>
  );
}
