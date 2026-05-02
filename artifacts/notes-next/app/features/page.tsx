"use client";
import Link from "next/link";
import { useState } from "react";
import { Brain,Command,Eye,Layers,Cloud,Shield,Tag,Keyboard,Download,Timer,Moon,PenLine,ArrowLeft,CheckCircle,Sparkles,Star,Zap,Lock } from "lucide-react";

const FEATS = [
  { icon:Brain, color:"#a78bfa", grad:"rgba(139,92,246,0.15)", title:"Gemini AI", sub:"9 AI actions built-in",
    points:["Improve Writing — enhance clarity & flow","Summarize — concise summary instantly","Fix Grammar — correct all errors","Continue Writing — AI continues your text","Make Shorter — condense by ~40%","Brainstorm — generate related ideas","Rewrite — completely rephrase content","Expand — add more detail & depth","Generate Title — perfect note titles"],
    kbd:"⌘ + , → AI Settings" },
  { icon:Command, color:"#818cf8", grad:"rgba(99,102,241,0.15)", title:"Command Palette", sub:"Find anything instantly",
    points:["Search all notes by title or content","Trigger any app action from one place","Jump to Starred, Pinned, Archived views","Create new note without mouse","Navigate with ↑↓ keys + Enter"],
    kbd:"⌘K" },
  { icon:Eye, color:"#f0abfc", grad:"rgba(232,121,249,0.15)", title:"Zen / Focus Mode", sub:"Distraction-free writing",
    points:["Collapses sidebar + note list completely","Full-screen editor, nothing else","Typing indicator in bottom-right","Escape or ⌘⇧F to exit","Saves focus state between sessions"],
    kbd:"⌘⇧F" },
  { icon:Layers, color:"#93c5fd", grad:"rgba(96,165,250,0.15)", title:"3-Panel Layout", sub:"Perfectly organized workspace",
    points:["Sidebar: navigation, tags, quick filters","Note list: live search, sort, tag filters","Editor: full markdown with live preview","Floating format toolbar on text select","Collapsible sidebar for more space"],
    kbd:"⌘\\" },
  { icon:Cloud, color:"#6ee7b7", grad:"rgba(52,211,153,0.15)", title:"Cloud Sync", sub:"Your notes, everywhere",
    points:["Instant sync via Insforge backend","Works across all devices & browsers","Offline-capable with local state","Auto-save every keystroke","No setup needed — just log in"],
    kbd:"Auto" },
  { icon:Shield, color:"#fde68a", grad:"rgba(251,191,36,0.15)", title:"Privacy First", sub:"Your data stays yours",
    points:["Gemini API key stored only in your browser","Never sent to Smart Ins-Note servers","No ads, no tracking, no analytics","No data selling — ever","Open source architecture"],
    kbd:"100% Local" },
  { icon:Tag, color:"#f9a8d4", grad:"rgba(244,114,182,0.15)", title:"Tags & Filters", sub:"Organize visually",
    points:["Create unlimited color-coded tags","Filter notes by one or multiple tags","Tag dot indicator in note list","Click tag in editor to filter instantly","Manage tags from Settings"],
    kbd:"Sidebar" },
  { icon:Keyboard, color:"#818cf8", grad:"rgba(99,102,241,0.15)", title:"20+ Shortcuts", sub:"Keyboard-first workflow",
    points:["⌘N — New note","⌘K — Command palette","⌘B / ⌘I — Bold / Italic","⌘⇧F — Zen mode","⌘\\ — Toggle sidebar","⌘= / ⌘- — Font size up/down","⌘, — Open settings","⌘/ — Show shortcuts","⌘S — Save note","⌘D — Duplicate note"],
    kbd:"⌘/" },
  { icon:Download, color:"#6ee7b7", grad:"rgba(52,211,153,0.15)", title:"Export Markdown", sub:"Own your content",
    points:["Export any note as .md file","Compatible with every text editor","Open standard — no lock-in","Preserves all formatting","Bulk export coming soon"],
    kbd:"⋯ menu" },
  { icon:Timer, color:"#c4b5fd", grad:"rgba(139,92,246,0.15)", title:"Live Stats", sub:"Know your writing",
    points:["Word count — updates live","Character count with/without spaces","Line count","Estimated reading time","Updates as you type — no delay"],
    kbd:"Status bar" },
  { icon:Moon, color:"#93c5fd", grad:"rgba(96,165,250,0.15)", title:"Dark / Light Mode", sub:"Beautiful in any light",
    points:["Smooth animated theme transition","System preference detection","Manual toggle in settings","Custom accent colors","All panels adapt instantly"],
    kbd:"⌘," },
  { icon:PenLine, color:"#f0abfc", grad:"rgba(232,121,249,0.15)", title:"Rich Formatting", sub:"Markdown supercharged",
    points:["Floating toolbar on text selection","Bold, Italic, Strikethrough, Code","H1, H2, H3 headings","Blockquote, Bullet list","Horizontal divider","All via markdown shorthand too"],
    kbd:"Select text" },
];

export default function FeaturesPage() {
  const [hov, setHov] = useState(-1);
  return (
    <div style={{minHeight:"100vh",background:"#07070f",color:"#f0f0ff",fontFamily:"-apple-system,BlinkMacSystemFont,'Inter',sans-serif",overflowX:"hidden"}}>
      <style>{`
        @keyframes headerGlow{0%,100%{box-shadow:0 0 20px rgba(99,102,241,.15)}50%{box-shadow:0 0 40px rgba(99,102,241,.35)}}
        @keyframes dotPulse{0%,100%{transform:scale(1);opacity:.7}50%{transform:scale(1.4);opacity:1}}
        @keyframes cardReveal{from{opacity:0;transform:translateY(24px) scale(.97)}to{opacity:1;transform:translateY(0) scale(1)}}
        @keyframes shimBar{0%{transform:scaleX(0);transform-origin:left}100%{transform:scaleX(1);transform-origin:left}}
        @keyframes kbdBounce{0%,100%{transform:translateY(0)}50%{transform:translateY(-3px)}}
        @keyframes orbF{0%,100%{transform:translate(0,0)}50%{transform:translate(30px,-20px)}}
        .feat-card:hover .feat-icon{transform:scale(1.15) rotate(-8deg)!important;box-shadow:0 0 30px var(--fc,rgba(99,102,241,.5))!important}
        .feat-card:hover .feat-bar{animation:shimBar .5s ease forwards}
        .feat-card:hover{border-color:rgba(99,102,241,.3)!important;background:rgba(99,102,241,.05)!important}
        .point-item{display:flex;align-items:flex-start;gap:8px;padding:6px 0;border-bottom:1px solid rgba(255,255,255,.04);font-size:13px;color:#64748b;transition:color .2s}
        .point-item:hover{color:#c7d2fe}
        .back-btn{display:inline-flex;align-items:center;gap:6px;padding:8px 16px;border-radius:10px;border:1px solid rgba(99,102,241,.2);color:#818cf8;font-size:13px;text-decoration:none;transition:all .2s;background:rgba(99,102,241,.06)}
        .back-btn:hover{background:rgba(99,102,241,.15);border-color:rgba(99,102,241,.5)}
      `}</style>

      {/* Bg orbs */}
      <div style={{position:"fixed",inset:0,pointerEvents:"none",zIndex:0,overflow:"hidden"}}>
        <div style={{position:"absolute",top:"-15%",left:"5%",width:600,height:600,borderRadius:"50%",background:"radial-gradient(circle,rgba(99,102,241,.07),transparent 65%)",animation:"orbF 16s ease-in-out infinite"}}/>
        <div style={{position:"absolute",bottom:"-10%",right:"5%",width:500,height:500,borderRadius:"50%",background:"radial-gradient(circle,rgba(232,121,249,.05),transparent 65%)",animation:"orbF 20s ease-in-out infinite reverse"}}/>
        <div style={{position:"absolute",inset:0,backgroundImage:"radial-gradient(circle,rgba(99,102,241,.04) 1px,transparent 1px)",backgroundSize:"32px 32px",maskImage:"radial-gradient(ellipse 80% 80% at 50% 50%,black 30%,transparent 100%)"}}/>
      </div>

      {/* Header */}
      <header style={{position:"sticky",top:0,zIndex:50,borderBottom:"1px solid rgba(255,255,255,.06)",backdropFilter:"blur(24px)",background:"rgba(7,7,15,.88)",animation:"headerGlow 4s ease-in-out infinite"}}>
        <div style={{maxWidth:1180,margin:"0 auto",padding:"0 24px",height:60,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <div style={{display:"flex",alignItems:"center",gap:14}}>
            <Link href="/notes-next" className="back-btn"><ArrowLeft size={14}/>Home</Link>
            <div style={{width:1,height:20,background:"rgba(255,255,255,.08)"}}/>
            <div style={{display:"flex",alignItems:"center",gap:8}}>
              <div style={{width:8,height:8,borderRadius:"50%",background:"#818cf8",animation:"dotPulse 2s ease-in-out infinite"}}/>
              <span style={{fontWeight:800,fontSize:17,background:"linear-gradient(90deg,#a5b4fc,#e879f9)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>All Features</span>
            </div>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:6,padding:"5px 14px",borderRadius:20,background:"rgba(52,211,153,.08)",border:"1px solid rgba(52,211,153,.2)",fontSize:12,color:"#34d399"}}>
            <CheckCircle size={11}/>Free Forever — All Features Included
          </div>
        </div>
      </header>

      <div style={{position:"relative",zIndex:1,maxWidth:1180,margin:"0 auto",padding:"60px 24px 100px"}}>
        {/* Hero */}
        <div style={{textAlign:"center",marginBottom:64,animation:"cardReveal .8s ease backwards"}}>
          <span style={{display:"inline-flex",alignItems:"center",gap:6,padding:"5px 15px",borderRadius:20,background:"rgba(99,102,241,.1)",border:"1px solid rgba(99,102,241,.25)",fontSize:12,color:"#a5b4fc",marginBottom:20}}>
            <Zap size={11}/>12 Powerful Features · All Free
          </span>
          <h1 style={{fontSize:"clamp(32px,5vw,64px)",fontWeight:900,letterSpacing:-2,color:"#f1f5f9",marginBottom:16,lineHeight:1.05}}>
            Everything you need,<br/><span style={{background:"linear-gradient(135deg,#818cf8,#e879f9)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>built right in</span>
          </h1>
          <p style={{color:"#475569",fontSize:18,maxWidth:500,margin:"0 auto"}}>No subscriptions. No premium tiers. Every feature ships free, forever.</p>
        </div>

        {/* Feature grid */}
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(340px,1fr))",gap:24}}>
          {FEATS.map((f,i)=>{
            const Icon=f.icon;
            return (
              <div key={f.title} className="feat-card" onMouseEnter={()=>setHov(i)} onMouseLeave={()=>setHov(-1)}
                style={{padding:28,borderRadius:20,border:"1px solid rgba(255,255,255,.06)",background:"rgba(255,255,255,.018)",transition:"all .3s",cursor:"default",position:"relative",overflow:"hidden",animationDelay:`${i*.05}s`,animation:"cardReveal .7s ease backwards"}}>
                {/* Shimmer bar */}
                <div className="feat-bar" style={{position:"absolute",top:0,left:0,right:0,height:2,background:`linear-gradient(90deg,transparent,${f.color},transparent)`,transform:"scaleX(0)",transformOrigin:"left"}}/>
                {/* Corner glow */}
                <div style={{position:"absolute",top:0,right:0,width:120,height:120,background:f.grad,borderRadius:"0 20px 0 60%",opacity:hov===i?.3:.08,transition:"opacity .3s",pointerEvents:"none"}}/>
                {/* Icon */}
                <div className="feat-icon" style={{"--fc":f.color,width:52,height:52,borderRadius:14,background:f.grad,border:`1px solid ${f.grad.replace("0.15","0.4")}`,display:"flex",alignItems:"center",justifyContent:"center",marginBottom:16,transition:"all .3s",flexShrink:0} as React.CSSProperties}>
                  <Icon size={24} color={f.color}/>
                </div>
                <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:8}}>
                  <div>
                    <h3 style={{fontWeight:800,fontSize:17,color:"#e2e8f0",marginBottom:3}}>{f.title}</h3>
                    <p style={{fontSize:12.5,color:"#475569"}}>{f.sub}</p>
                  </div>
                  <kbd style={{padding:"3px 9px",borderRadius:7,background:"rgba(255,255,255,.06)",border:"1px solid rgba(255,255,255,.1)",fontSize:11,color:"#818cf8",fontFamily:"monospace",flexShrink:0,marginLeft:8,animation:"kbdBounce 3s ease-in-out infinite",animationDelay:`${i*.2}s`}}>{f.kbd}</kbd>
                </div>
                <div style={{marginTop:14}}>
                  {f.points.map((pt,pi)=>(
                    <div key={pi} className="point-item">
                      <CheckCircle size={11} color={f.color} style={{flexShrink:0,marginTop:2}}/><span>{pt}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div style={{textAlign:"center",marginTop:72,padding:"48px 24px",borderRadius:24,background:"rgba(99,102,241,.04)",border:"1px solid rgba(99,102,241,.12)"}}>
          <Sparkles size={32} color="#818cf8" style={{margin:"0 auto 16px"}}/>
          <h2 style={{fontSize:32,fontWeight:900,letterSpacing:-1,color:"#f1f5f9",marginBottom:12}}>All features. Zero cost.</h2>
          <p style={{color:"#475569",marginBottom:28}}>Smart Ins-Note is free forever. No credit card required.</p>
          <Link href="/notes" style={{display:"inline-flex",alignItems:"center",gap:8,padding:"14px 36px",borderRadius:12,background:"linear-gradient(135deg,#6366f1,#8b5cf6)",color:"white",fontWeight:700,fontSize:16,textDecoration:"none",boxShadow:"0 0 40px rgba(99,102,241,.4)"}}>
            <Star size={18}/>Start Writing Free
          </Link>
        </div>
      </div>
    </div>
  );
}
