import { Link } from "wouter";
import { ArrowRight, BrainCircuit, Sparkles, Shield, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Landing() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-background pt-24 pb-32 lg:pt-36 lg:pb-40">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-primary opacity-20 blur-[100px]"></div>
        
        <div className="container mx-auto px-4 relative z-10 text-center">
          <div className="inline-flex items-center rounded-full border bg-muted/50 px-3 py-1 text-sm text-muted-foreground mb-8 backdrop-blur-sm">
            <Sparkles className="mr-2 h-4 w-4 text-accent" />
            Your new digital sanctuary
          </div>
          
          <h1 className="mx-auto max-w-4xl font-serif text-5xl font-medium tracking-tight sm:text-6xl md:text-7xl mb-6">
            Think clearly. <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Capture instantly.</span>
          </h1>
          
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground mb-10 leading-relaxed">
            A calm, purposeful workspace designed for your most important thoughts. 
            No clutter, no distractions—just you and your ideas.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/notes">
              <Button size="lg" className="h-12 px-8 text-base shadow-md w-full sm:w-auto">
                Open Workspace <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="h-12 px-8 text-base w-full sm:w-auto">
              See How It Works
            </Button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-serif text-3xl font-semibold tracking-tight md:text-4xl mb-4">
              Designed for focus
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Everything you need to capture ideas, without the complexity that gets in your way.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: BrainCircuit,
                title: "Frictionless Capture",
                description: "Open the app and start typing. Your thoughts are saved instantly, ready when you need them."
              },
              {
                icon: Zap,
                title: "Lightning Fast",
                description: "Built for speed. Navigate, create, and find your notes without waiting for slow loading screens."
              },
              {
                icon: Sparkles,
                title: "Calm Interface",
                description: "A meticulously crafted design that reduces cognitive load and makes writing a pleasure."
              },
              {
                icon: Shield,
                title: "Secure & Private",
                description: "Your data belongs to you. We employ modern security practices to keep your thoughts safe."
              }
            ].map((feature, i) => (
              <div key={i} className="rounded-2xl border bg-card p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <feature.icon className="h-5 w-5" />
                </div>
                <h3 className="font-semibold mb-2 text-xl">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="font-serif text-3xl font-semibold tracking-tight md:text-4xl mb-6">
                A simpler workflow
              </h2>
              <p className="text-muted-foreground text-lg mb-10">
                We believe tools should adapt to your mind, not the other way around. SmartNotes uses a straightforward process to keep you in flow.
              </p>
              
              <div className="space-y-8">
                {[
                  { step: "01", title: "Open the workspace", desc: "No complicated menus to navigate. Just a clean slate waiting for your input." },
                  { step: "02", title: "Capture the thought", desc: "Write down what matters right now. Add a title to give it context." },
                  { step: "03", title: "Review and refine", desc: "Access your ideas later in a beautifully formatted list that's easy to scan." }
                ].map((item, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="flex-shrink-0 mt-1">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-primary font-bold text-sm">
                        {item.step}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-xl font-medium mb-1">{item.title}</h4>
                      <p className="text-muted-foreground">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="relative rounded-2xl bg-slate-100 p-8 md:p-12 border shadow-inner">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 rounded-2xl"></div>
              <div className="relative bg-card rounded-xl border shadow-lg overflow-hidden">
                <div className="border-b px-4 py-3 flex items-center gap-2 bg-slate-50/50">
                  <div className="w-3 h-3 rounded-full bg-red-400"></div>
                  <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                  <div className="w-3 h-3 rounded-full bg-green-400"></div>
                </div>
                <div className="p-6 space-y-4">
                  <div className="h-6 w-1/3 bg-muted rounded animate-pulse"></div>
                  <div className="space-y-2">
                    <div className="h-4 w-full bg-muted rounded animate-pulse"></div>
                    <div className="h-4 w-5/6 bg-muted rounded animate-pulse"></div>
                    <div className="h-4 w-4/6 bg-muted rounded animate-pulse"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-primary text-primary-foreground relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="font-serif text-3xl font-semibold tracking-tight md:text-5xl mb-6">
            Ready to clear your mind?
          </h2>
          <p className="text-primary-foreground/80 text-lg max-w-2xl mx-auto mb-10">
            Join thousands of thinkers who use SmartNotes to capture their ideas.
          </p>
          <Link href="/notes">
            <Button size="lg" variant="secondary" className="h-12 px-8 text-base text-primary">
              Start Writing Now <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
