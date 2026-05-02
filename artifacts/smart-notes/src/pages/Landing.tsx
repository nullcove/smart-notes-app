import { Link } from "wouter";
import { ArrowRight, BrainCircuit, Sparkles, Shield, Zap, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Landing() {
  return (
    <div className="flex min-h-screen flex-col bg-zinc-950">

      {/* Hero */}
      <section className="relative overflow-hidden pt-28 pb-36">
        {/* Grid background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff06_1px,transparent_1px),linear-gradient(to_bottom,#ffffff06_1px,transparent_1px)] bg-[size:32px_32px]" />
        {/* Glow blobs */}
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-violet-600/15 blur-[120px] pointer-events-none" />
        <div className="absolute top-10 right-10 w-64 h-64 rounded-full bg-indigo-600/10 blur-[80px] pointer-events-none" />

        <div className="container mx-auto px-4 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-medium text-zinc-400 mb-8 backdrop-blur-sm">
            <Sparkles className="h-3.5 w-3.5 text-violet-400" />
            Your new digital sanctuary
          </div>

          <h1 className="mx-auto max-w-4xl font-sans font-black text-5xl sm:text-6xl md:text-7xl tracking-tight text-white mb-6 leading-[1.05]">
            Think clearly.{" "}
            <span className="bg-gradient-to-r from-violet-400 via-indigo-400 to-violet-400 bg-clip-text text-transparent">
              Capture instantly.
            </span>
          </h1>

          <p className="mx-auto max-w-xl text-base sm:text-lg text-zinc-400 mb-10 leading-relaxed">
            A calm, purposeful workspace designed for your most important thoughts.
            No clutter, no distractions — just you and your ideas.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/notes">
              <Button size="lg" className="h-12 px-8 text-base bg-violet-600 hover:bg-violet-500 text-white border-0 shadow-xl shadow-violet-600/30 font-semibold w-full sm:w-auto">
                Open Workspace <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="h-12 px-8 text-base border-white/10 bg-white/5 text-zinc-300 hover:bg-white/10 hover:text-white w-full sm:w-auto">
              See How It Works
            </Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 bg-zinc-900/40">
        <div className="container mx-auto px-4">
          <div className="text-center mb-14">
            <h2 className="font-sans font-bold text-3xl md:text-4xl text-white mb-3 tracking-tight">
              Designed for focus
            </h2>
            <p className="text-zinc-400 text-base max-w-xl mx-auto">
              Everything you need to capture ideas, without the complexity that gets in your way.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: BrainCircuit, title: "Frictionless Capture", description: "Open the app and start typing. Your thoughts are saved instantly, ready when you need them.", color: "from-violet-500 to-indigo-600", glow: "shadow-violet-500/20" },
              { icon: Zap, title: "Lightning Fast", description: "Built for speed. Navigate, create, and find your notes without waiting for slow loading screens.", color: "from-amber-500 to-orange-500", glow: "shadow-amber-500/20" },
              { icon: Sparkles, title: "Calm Interface", description: "A meticulously crafted design that reduces cognitive load and makes writing a pleasure.", color: "from-emerald-500 to-teal-600", glow: "shadow-emerald-500/20" },
              { icon: Shield, title: "Secure & Private", description: "Your data belongs to you. We employ modern security practices to keep your thoughts safe.", color: "from-rose-500 to-pink-600", glow: "shadow-rose-500/20" },
            ].map((f, i) => (
              <div
                key={i}
                className="group rounded-2xl border border-white/5 bg-zinc-900 p-6 hover:border-white/10 hover:bg-zinc-800/80 transition-all duration-300"
              >
                <div className={`mb-5 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${f.color} shadow-lg ${f.glow}`}>
                  <f.icon className="h-5 w-5 text-white" />
                </div>
                <h3 className="font-semibold text-white mb-2 text-base">{f.title}</h3>
                <p className="text-zinc-400 text-sm leading-relaxed">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 bg-zinc-950">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-violet-500/20 bg-violet-500/10 px-3 py-1 text-xs font-medium text-violet-400 mb-6">
                <FileText className="h-3 w-3" />
                Simple workflow
              </div>
              <h2 className="font-sans font-bold text-3xl md:text-4xl text-white mb-5 tracking-tight">
                A simpler workflow
              </h2>
              <p className="text-zinc-400 text-base mb-10 leading-relaxed">
                We believe tools should adapt to your mind, not the other way around. SmartNotes uses a straightforward process to keep you in flow.
              </p>

              <div className="space-y-7">
                {[
                  { step: "01", title: "Open the workspace", desc: "No complicated menus. Just a clean slate waiting for your input." },
                  { step: "02", title: "Capture the thought", desc: "Write down what matters right now. Add a title to give it context." },
                  { step: "03", title: "Review and refine", desc: "Access your ideas in a beautifully formatted list that's easy to scan." },
                ].map((item, i) => (
                  <div key={i} className="flex gap-4 group">
                    <div className="flex-shrink-0 mt-1">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 font-bold text-xs">
                        {item.step}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-base font-semibold text-white mb-1">{item.title}</h4>
                      <p className="text-zinc-400 text-sm leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Mock editor */}
            <div className="relative rounded-2xl border border-white/5 bg-zinc-900/50 p-8 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 to-indigo-500/5 rounded-2xl" />
              <div className="relative rounded-xl border border-white/8 bg-zinc-900 shadow-2xl overflow-hidden">
                <div className="border-b border-white/5 px-4 py-3 flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/60" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/60" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/60" />
                  <div className="ml-2 flex-1 h-5 rounded bg-zinc-800" />
                </div>
                <div className="p-6 space-y-4">
                  <div className="h-5 w-1/3 bg-zinc-800 rounded animate-pulse" />
                  <div className="space-y-2.5">
                    <div className="h-3.5 w-full bg-zinc-800/70 rounded animate-pulse" />
                    <div className="h-3.5 w-5/6 bg-zinc-800/70 rounded animate-pulse" />
                    <div className="h-3.5 w-4/6 bg-zinc-800/70 rounded animate-pulse" />
                  </div>
                  <div className="pt-3 space-y-2">
                    <div className="h-3 w-full bg-zinc-800/50 rounded animate-pulse" />
                    <div className="h-3 w-3/4 bg-zinc-800/50 rounded animate-pulse" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-950 via-indigo-950 to-zinc-950" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff04_1px,transparent_1px),linear-gradient(to_bottom,#ffffff04_1px,transparent_1px)] bg-[size:32px_32px]" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] rounded-full bg-violet-600/20 blur-[100px]" />
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="font-sans font-black text-3xl md:text-5xl text-white mb-5 tracking-tight">
            Ready to clear your mind?
          </h2>
          <p className="text-zinc-400 text-base max-w-xl mx-auto mb-10 leading-relaxed">
            Join thousands of thinkers who use SmartNotes to capture and organize their ideas.
          </p>
          <Link href="/notes">
            <Button size="lg" className="h-12 px-10 text-base bg-white text-zinc-900 hover:bg-zinc-100 font-bold shadow-2xl">
              Start Writing Now <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

    </div>
  );
}
