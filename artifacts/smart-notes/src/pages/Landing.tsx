import { Link } from "wouter";
import { ArrowRight, BrainCircuit, Sparkles, Shield, Zap, FileText, Star, Clock, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Landing() {
  return (
    <div className="flex min-h-screen flex-col bg-zinc-950 text-white overflow-x-hidden">

      {/* ── HERO ────────────────────────────────────────────────── */}
      <section className="relative min-h-[92vh] flex items-center">
        {/* layered backgrounds */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(124,58,237,0.18),transparent)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:40px_40px]" />
        {/* floating orbs */}
        <div className="absolute top-1/4 left-[15%] w-72 h-72 rounded-full bg-violet-600/12 blur-[90px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-[10%] w-64 h-64 rounded-full bg-indigo-600/12 blur-[80px] pointer-events-none" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-14 items-center">
            {/* Left — copy */}
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-violet-500/25 bg-violet-500/8 px-3.5 py-1.5 text-xs font-semibold text-violet-300 mb-8 tracking-wide uppercase">
                <Sparkles className="h-3 w-3" />
                Your new digital sanctuary
              </div>

              <h1 className="font-black text-5xl sm:text-6xl xl:text-7xl leading-[1.02] tracking-tight mb-6">
                Think{" "}
                <span className="relative inline-block">
                  <span className="relative z-10 bg-gradient-to-r from-violet-400 via-fuchsia-400 to-indigo-400 bg-clip-text text-transparent">
                    clearly.
                  </span>
                </span>
                <br />
                Capture{" "}
                <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
                  instantly.
                </span>
              </h1>

              <p className="text-zinc-400 text-lg leading-relaxed mb-10 max-w-lg">
                A calm, purposeful workspace designed for your most important thoughts.
                No clutter, no distractions — just you and your ideas.
              </p>

              <div className="flex flex-wrap gap-3 mb-10">
                <Link href="/notes">
                  <Button size="lg" className="h-12 px-8 bg-violet-600 hover:bg-violet-500 text-white border-0 shadow-xl shadow-violet-600/30 font-bold text-base">
                    Open Workspace <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Button size="lg" variant="outline" className="h-12 px-8 border-white/10 bg-white/5 text-zinc-300 hover:bg-white/10 hover:text-white font-medium text-base">
                  See How It Works
                </Button>
              </div>

              {/* mini stats */}
              <div className="flex items-center gap-6 text-sm text-zinc-500">
                {[
                  { icon: Star, label: "4.9 rating" },
                  { icon: Clock, label: "Instant sync" },
                  { icon: Lock, label: "Private & secure" },
                ].map(({ icon: Icon, label }) => (
                  <div key={label} className="flex items-center gap-1.5">
                    <Icon className="h-3.5 w-3.5 text-violet-400" />
                    <span>{label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — floating app mockup */}
            <div className="relative hidden lg:flex items-center justify-center">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(124,58,237,0.12),transparent_70%)]" />

              {/* Main card */}
              <div className="relative w-full max-w-sm rounded-2xl border border-white/8 bg-zinc-900/90 backdrop-blur-xl shadow-2xl overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-500/50 to-transparent" />
                {/* window chrome */}
                <div className="flex items-center gap-1.5 px-4 py-3 border-b border-white/5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-500/50" />
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/50" />
                  <div className="ml-3 flex-1 h-4 rounded-md bg-zinc-800" />
                </div>
                <div className="p-5 space-y-3">
                  {[
                    { title: "Product roadmap", lines: [1, 0.8, 0.6], color: "from-violet-500 to-indigo-500" },
                    { title: "Meeting notes", lines: [0.9, 0.7], color: "from-rose-500 to-pink-500" },
                    { title: "Ideas backlog", lines: [1, 0.85, 0.5], color: "from-amber-500 to-orange-400" },
                  ].map((card, i) => (
                    <div key={i} className="rounded-xl border border-white/5 bg-zinc-800/60 p-3.5">
                      <div className={`h-0.5 w-full rounded-full bg-gradient-to-r ${card.color} mb-3`} />
                      <div className="h-3 w-1/2 bg-zinc-600 rounded mb-2.5" style={{ width: `${card.lines[0] * 55}%` }} />
                      {card.lines.slice(1).map((w, j) => (
                        <div key={j} className="h-2 bg-zinc-700/70 rounded mb-1.5" style={{ width: `${w * 90}%` }} />
                      ))}
                    </div>
                  ))}
                </div>
              </div>

              {/* floating badge */}
              <div className="absolute -top-3 -right-4 rounded-xl border border-white/8 bg-zinc-900 px-3 py-2 text-xs font-semibold text-emerald-400 shadow-lg flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Saved instantly
              </div>
              <div className="absolute -bottom-4 -left-6 rounded-xl border border-white/8 bg-zinc-900 px-3 py-2 text-xs font-medium text-zinc-300 shadow-lg">
                ✦ 3 notes synced
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURES bento ──────────────────────────────────────── */}
      <section className="py-28 relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_50%,rgba(109,40,217,0.06),transparent)]" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <p className="text-xs font-bold uppercase tracking-widest text-violet-400 mb-3">Why SmartNotes</p>
            <h2 className="font-black text-4xl md:text-5xl text-white mb-4 tracking-tight">
              Designed for{" "}
              <span className="bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
                focus
              </span>
            </h2>
            <p className="text-zinc-400 max-w-lg mx-auto leading-relaxed">
              Everything you need to capture ideas, without the complexity that gets in your way.
            </p>
          </div>

          {/* bento grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
            {/* Large card */}
            <div className="lg:col-span-2 rounded-2xl border border-white/5 bg-zinc-900 p-8 relative overflow-hidden group hover:border-violet-500/20 transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-violet-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 shadow-lg shadow-violet-500/25 mb-5">
                <BrainCircuit className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-bold text-xl text-white mb-3">Frictionless Capture</h3>
              <p className="text-zinc-400 leading-relaxed">Open the app and start typing. Your thoughts are saved instantly, ready when you need them. No extra clicks, no loading screens, no friction.</p>
            </div>

            {/* Small card */}
            <div className="rounded-2xl border border-white/5 bg-zinc-900 p-8 relative overflow-hidden group hover:border-amber-500/20 transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-amber-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 shadow-lg shadow-amber-500/25 mb-5">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-bold text-xl text-white mb-3">Lightning Fast</h3>
              <p className="text-zinc-400 leading-relaxed text-sm">Built for speed. Navigate and find notes instantly.</p>
            </div>

            {/* Small card */}
            <div className="rounded-2xl border border-white/5 bg-zinc-900 p-8 relative overflow-hidden group hover:border-emerald-500/20 transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg shadow-emerald-500/25 mb-5">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-bold text-xl text-white mb-3">Calm Interface</h3>
              <p className="text-zinc-400 leading-relaxed text-sm">Reduces cognitive load and makes writing a pleasure.</p>
            </div>

            {/* Large card */}
            <div className="lg:col-span-2 rounded-2xl border border-white/5 bg-zinc-900 p-8 relative overflow-hidden group hover:border-rose-500/20 transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-rose-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-rose-500 to-pink-600 shadow-lg shadow-rose-500/25 mb-5">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-bold text-xl text-white mb-3">Secure & Private</h3>
              <p className="text-zinc-400 leading-relaxed">Your data belongs to you. We employ modern security practices to keep your thoughts safe. End-to-end protection for everything you write.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────────────── */}
      <section className="py-28 border-t border-white/5">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-20 items-center max-w-5xl mx-auto">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-violet-500/20 bg-violet-500/8 px-3 py-1 text-xs font-semibold text-violet-400 mb-6 uppercase tracking-wide">
                <FileText className="h-3 w-3" />
                Simple workflow
              </div>
              <h2 className="font-black text-3xl md:text-4xl text-white mb-5 tracking-tight">
                A simpler workflow
              </h2>
              <p className="text-zinc-400 mb-10 leading-relaxed">
                SmartNotes uses a straightforward process to keep you in flow. Capture ideas the moment they strike.
              </p>

              <div className="space-y-6">
                {[
                  { step: "01", title: "Open the workspace", desc: "No complicated menus. Clean slate, ready instantly.", color: "text-violet-400" },
                  { step: "02", title: "Capture the thought", desc: "Write the title and content. It's saved as you type.", color: "text-indigo-400" },
                  { step: "03", title: "Review and refine", desc: "Browse your notes anytime. Search, edit, or delete.", color: "text-fuchsia-400" },
                ].map((item) => (
                  <div key={item.step} className="flex gap-4 group">
                    <div className="flex-shrink-0 mt-0.5">
                      <div className={`flex h-9 w-9 items-center justify-center rounded-xl bg-zinc-900 border border-white/8 font-black text-xs ${item.color}`}>
                        {item.step}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-bold text-white mb-1">{item.title}</h4>
                      <p className="text-zinc-500 text-sm leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* mock editor */}
            <div className="relative">
              <div className="absolute -inset-4 rounded-3xl bg-violet-500/5 blur-2xl" />
              <div className="relative rounded-2xl border border-white/8 bg-zinc-900 overflow-hidden shadow-2xl">
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-500/40 to-transparent" />
                <div className="border-b border-white/5 px-4 py-3 flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-500/50" />
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/50" />
                  <div className="ml-2 flex-1 h-4 rounded bg-zinc-800" />
                </div>
                <div className="p-6 space-y-5">
                  <div>
                    <div className="h-5 w-2/5 bg-zinc-700 rounded mb-4" />
                    <div className="space-y-2.5">
                      <div className="h-3 w-full bg-zinc-800 rounded" />
                      <div className="h-3 w-4/5 bg-zinc-800 rounded" />
                      <div className="h-3 w-3/5 bg-zinc-800 rounded" />
                    </div>
                  </div>
                  <div className="border-t border-white/5 pt-5">
                    <div className="h-5 w-1/3 bg-zinc-700 rounded mb-4" />
                    <div className="space-y-2.5">
                      <div className="h-3 w-5/6 bg-zinc-800/60 rounded" />
                      <div className="h-3 w-full bg-zinc-800/60 rounded" />
                      <div className="h-3 w-2/3 bg-zinc-800/60 rounded" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────────────────── */}
      <section className="py-28 relative overflow-hidden border-t border-white/5">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_50%,rgba(109,40,217,0.15),transparent)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff04_1px,transparent_1px),linear-gradient(to_bottom,#ffffff04_1px,transparent_1px)] bg-[size:40px_40px]" />
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-violet-500/25 bg-violet-500/8 px-3.5 py-1.5 text-xs font-bold text-violet-300 mb-8 uppercase tracking-widest">
            <Star className="h-3 w-3" />
            Join thousands of thinkers
          </div>
          <h2 className="font-black text-4xl md:text-6xl text-white mb-5 tracking-tight">
            Ready to clear{" "}
            <span className="bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
              your mind?
            </span>
          </h2>
          <p className="text-zinc-400 text-lg max-w-lg mx-auto mb-10 leading-relaxed">
            Start capturing ideas instantly. No signup required — just open and write.
          </p>
          <Link href="/notes">
            <Button size="lg" className="h-14 px-12 text-lg bg-white text-zinc-900 hover:bg-zinc-100 font-black shadow-2xl rounded-xl">
              Start Writing Now <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

    </div>
  );
}
