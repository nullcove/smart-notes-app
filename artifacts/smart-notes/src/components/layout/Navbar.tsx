import { useState } from "react";
import { Link, useLocation } from "wouter";
import { BookMarked, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SettingsModal } from "@/components/settings/SettingsModal";
import { cn } from "@/lib/utils";

export function Navbar() {
  const [location] = useLocation();
  const [settingsOpen, setSettingsOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-zinc-950/80 backdrop-blur-xl">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 shadow-lg shadow-violet-500/20 group-hover:shadow-violet-500/40 transition-shadow">
              <BookMarked className="h-4 w-4 text-white" />
            </div>
            <span className="font-sans text-lg font-bold tracking-tight text-white">
              Smart<span className="text-violet-400">Notes</span>
            </span>
          </Link>

          <nav className="flex items-center gap-1">
            <Link href="/">
              <span className={cn(
                "px-3 py-1.5 rounded-md text-sm font-medium transition-colors cursor-pointer",
                location === "/" ? "text-white bg-white/8" : "text-zinc-400 hover:text-white hover:bg-white/5"
              )}>
                Home
              </span>
            </Link>
            <Link href="/notes">
              <span className={cn(
                "px-3 py-1.5 rounded-md text-sm font-medium transition-colors cursor-pointer",
                location === "/notes" ? "text-white bg-white/8" : "text-zinc-400 hover:text-white hover:bg-white/5"
              )}>
                My Notes
              </span>
            </Link>

            {/* Settings gear */}
            <button
              onClick={() => setSettingsOpen(true)}
              className="ml-1 h-8 w-8 flex items-center justify-center rounded-md text-zinc-500 hover:text-zinc-200 hover:bg-white/5 transition-colors"
              title="AI Settings"
            >
              <Settings className="h-4 w-4" />
            </button>

            <Link href="/notes" className="ml-2 hidden sm:inline-flex">
              <Button size="sm" className="bg-violet-600 hover:bg-violet-500 text-white border-0 shadow-lg shadow-violet-600/25 font-medium">
                Open Workspace
              </Button>
            </Link>
          </nav>
        </div>
      </header>

      <SettingsModal open={settingsOpen} onOpenChange={setSettingsOpen} />
    </>
  );
}
