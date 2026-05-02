"use client";
import Link from "next/link";
import { ArrowLeft, CheckCircle, Sparkles, Zap, Package, Star, Brain, Command, PenLine, Tag, Cloud, Shield } from "lucide-react";
import { useState } from "react";

const CATEGORIES = [
  { name:"AI & Writing", icon:Brain, color:"#a78bfa", plugins:[
    { name:"Gemini AI Engine", desc:"Powers all 9 AI actions via your API key" },
    { name:"Improve Writing", desc:"Enhance clarity, flow and vocabulary" },
    { name:"Summarize", desc:"Generate concise summaries instantly" },
    { name:"Fix Grammar", desc:"Detect and correct all grammar errors" },
    { name:"Continue Writing", desc:"AI extends your text naturally" },
    { name:"Make Shorter", desc:"Condense content by ~40%" },
    { name:"Brainstorm", desc:"Generate related ideas & concepts" },
    { name:"Rewrite", desc:"Completely rephrase while keeping meaning" },
    { name:"Expand", desc:"Add depth and detail to any passage" },
    { name:"Generate Title", desc:"Create the perfect title for your note" },
  ]},
  { name:"Editor", icon:PenLine, color:"#818cf8", plugins:[
    { name:"Floating Toolbar", desc:"Format toolbar appears on text selection" },
    { name:"Markdown Engine", desc:"Full CommonMark + GFM support" },
    { name:"Font Size Control", desc:"⌘= / ⌘- resize editor text" },
    { name:"Reading Progress", desc:"Progress bar while reading long notes" },
    { name:"Live Word Count", desc:"Words, chars, lines, reading time" },
    { name:"Auto-save", desc:"Saves every keystroke, no manual save needed" },
    { name:"Rich Formatting", desc:"Bold, Italic, H1-H3, Code, Blockquote, List" },
    { name:"Code Blocks", desc:"Syntax-highlighted code blocks" },
  ]},
  { name:"Navigation", icon:Command, color:"#f0abfc", plugins:[
    { name:"Command Palette", desc:"⌘K — search notes & trigger actions" },
    { name:"Keyboard Shortcuts", desc:"20+ shortcuts for every action" },
    { name:"Zen Mode", desc:"⌘⇧F full-screen focus editor" },
    { name:"Collapsible Sidebar", desc:"⌘\\ — hide/show sidebar" },
    { name:"Live Search", desc:"Instant full-text search across all notes" },
    { name:"Quick New Note", desc:"⌘N anywhere creates a new note" },
  ]},
  { name:"Organization", icon:Tag, color:"#6ee7b7", plugins:[
    { name:"Tags System", desc:"Color-coded tags with filter" },
    { name:"Pin Notes", desc:"Pin important notes to the top" },
    { name:"Star Notes", desc:"Star favorites for quick access" },
    { name:"Archive", desc:"Archive notes without deleting" },
    { name:"Trash", desc:"Soft-delete with 30-day recovery" },
    { name:"Note Context Menu", desc:"Right-click for quick actions" },
  ]},
  { name:"Cloud & Sync", icon:Cloud, color:"#93c5fd", plugins:[
    { name:"Insforge Sync", desc:"Real-time cloud sync via Insforge" },
    { name:"Multi-device", desc:"Access from any browser/device" },
    { name:"JWT Auth", desc:"Secure authentication with JWT tokens" },
    { name:"Auto-merge", desc:"Conflict-free sync across sessions" },
  ]},
  { name:"Privacy & Security", icon:Shield, color:"#fde68a", plugins:[
    { name:"Local API Key", desc:"Gemini key stored only in your browser" },
    { name:"No Analytics", desc:"Zero tracking, zero telemetry" },
    { name:"No Ads", desc:"No advertising, ever" },
    { name:"Open Source", desc:"Full source code on GitHub" },
    { name:"Export .md", desc:"Own your data — download as Markdown" },
  ]},
  { name:"UI & Experience", icon:Sparkles, color:"#f9a8d4", plugins:[
    { name:"Dark Mode", desc:"Beautiful dark theme with smooth toggle" },
    { name:"Light Mode", desc:"Clean light theme for daytime use" },
    { name:"Toast Notifications", desc:"Non-intrusive action feedback" },
    { name:"Skeleton Loading", desc:"Smooth loading states throughout" },
    { name:"Stagger Animations", desc:"Polished list entrance animations" },
    { name:"Reading Progress Bar", desc:"Subtle progress indicator in editor" },
    { name:"Tag Color Dots", desc:"Visual tag indicators in note list" },
  ]},
];

export default function PluginsPage() {
  const [active, setActive] = useState(0);
  const cat = CATEGORIES[active];
  const CatIcon = cat.icon;

  return (
    <div style={{minHeight:"100vh",background:"#07070f",color:"#f0f0ff",fontFamily:"-apple-system,BlinkMacSystemFont,'Inter',sans-serif",overflowX:"hidden"}}>
      <style>{`
        @keyframes plugReveal{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
        @keyframes tabGlow{0%,100%{box-shadow:none}50%{box-shadow:0 0 20px rgba(99,102,241,.3)}}
        @keyframes countUp{from{opacity:0;transform:scale(.8)}to{opacity:1;transform:scale(1)}}
        @keyframes orbP{0%,100%{transform:translate(0,0)}50%{transform:translate(40px,-30px)}}
        .plugin-card{padding:14px 16px;border-radius:12px;border:1px solid rgba(255,255,255,.05);background:rgba(255,255,255,.018);transition:all .25s;cursor:default}
        .plugin-card:hover{background:rgba(99,102,241,.07);border-color:rgba(99,102,241,.25);transform:translateY(-2px)}
        .tab-btn{padding:9px 18px;border-radius:10px;border:1px solid transparent;font-size:13.5px;font-weight:600;cursor:pointer;transition:all .2s;display:flex;align-items:center;gap:8px;background:transparent}
        .tab-btn.active{border-color:rgba(99,102,241,.4);background:rgba(99,102,241,.12);color:#a5b4fc}
        .tab-btn:not(.active){color:#475569}
        .tab-btn:not(.active):hover{color:#94a3b8;background:rgba(255,255,255,.04)}
        .back-btn{display:inline-flex;align-items:center;gap:6px;padding:8px 16px;border-radius:10px;border:1px solid rgba(99,102,241,.2);color:#818cf8;font-size:13px;text-decoration:none;transition:all .2s;background:rgba(99,102,241,.06)}
        .back-btn:hover{background:rgba(99,102,241,.15);border-color:rgba(99,102,241,.5)}
      `}</style>

      {/* Bg */}
      <div style={{position:"fixed",inset:0,pointerEvents:"none",zIndex:0,overflow:"hidden"}}>
        <div style={{position:"absolute",top:"-10%",left:"10%",width:600,height:600,borderRadius:"50%",background:"radial-gradient(circle,rgba(139,92,246,.06),transparent 65%)",animation:"orbP 20s ease-in-out infinite"}}/>
        <div style={{position:"absolute",bottom:"-10%",right:"8%",width:500,height:500,borderRadius:"50%",background:"radial-gradient(circle,rgba(232,121,249,.05),transparent 65%)",animation:"orbP 25s ease-in-out infinite reverse"}}/>
        <div style={{position:"absolute",inset:0,backgroundImage:"radial-gradient(circle,rgba(99,102,241,.035) 1px,transparent 1px)",backgroundSize:"36px 36px"}}/>
      </div>

      {/* Header */}
      <header style={{position:"sticky",top:0,zIndex:50,borderBottom:"1px solid rgba(255,255,255,.06)",backdropFilter:"blur(24px)",background:"rgba(7,7,15,.88)"}}>
        <div style={{maxWidth:1200,margin:"0 auto",padding:"0 24px",height:60,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <div style={{display:"flex",alignItems:"center",gap:14}}>
            <Link href="/notes-next" className="back-btn"><ArrowLeft size={14}/>Home</Link>
            <div style={{width:1,height:20,background:"rgba(255,255,255,.08)"}}/>
            <span style={{fontWeight:800,fontSize:17,background:"linear-gradient(90deg,#c4b5fd,#e879f9)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>All Plugins</span>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:6,padding:"5px 14px",borderRadius:20,background:"rgba(99,102,241,.08)",border:"1px solid rgba(99,102,241,.2)",fontSize:12,color:"#a5b4fc"}}>
            <Package size={11}/>50+ plugins · All built-in · All free
          </div>
        </div>
      </header>

      <div style={{position:"relative",zIndex:1,maxWidth:1200,margin:"0 auto",padding:"60px 24px 100px"}}>
        {/* Hero */}
        <div style={{textAlign:"center",marginBottom:52,animation:"plugReveal .8s ease backwards"}}>
          <span style={{display:"inline-flex",alignItems:"center",gap:6,padding:"5px 15px",borderRadius:20,background:"rgba(139,92,246,.1)",border:"1px solid rgba(139,92,246,.25)",fontSize:12,color:"#c4b5fd",marginBottom:20}}>
            <Zap size={11}/>No Plugin Store · No Paid Add-ons
          </span>
          <h1 style={{fontSize:"clamp(32px,5vw,60px)",fontWeight:900,letterSpacing:-2,color:"#f1f5f9",marginBottom:14,lineHeight:1.05}}>
            50+ plugins.<br/><span style={{background:"linear-gradient(135deg,#c4b5fd,#e879f9)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>All built-in. All free.</span>
          </h1>
          <p style={{color:"#475569",fontSize:17,maxWidth:500,margin:"0 auto"}}>Every capability ships built-in from day one. No marketplace. No subscriptions.</p>
        </div>

        {/* Stats */}
        <div style={{display:"flex",gap:16,justifyContent:"center",flexWrap:"wrap",marginBottom:52}}>
          {[["50+","Total Plugins"],["7","Categories"],["9","AI Actions"],["100%","Free Forever"]].map(([n,l],i)=>(
            <div key={l} style={{padding:"18px 28px",borderRadius:16,border:"1px solid rgba(255,255,255,.06)",background:"rgba(255,255,255,.018)",textAlign:"center",animation:`countUp ${.5+i*.1}s ease backwards`,minWidth:120}}>
              <div style={{fontSize:32,fontWeight:900,background:"linear-gradient(135deg,#a5b4fc,#e879f9)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",lineHeight:1}}>{n}</div>
              <div style={{fontSize:12,color:"#475569",marginTop:6}}>{l}</div>
            </div>
          ))}
        </div>

        {/* Layout */}
        <div style={{display:"grid",gridTemplateColumns:"220px 1fr",gap:24,alignItems:"start"}}>
          {/* Tabs */}
          <div style={{display:"flex",flexDirection:"column",gap:4,position:"sticky",top:80}}>
            {CATEGORIES.map((c,i)=>{
              const Icon=c.icon;
              return (
                <button key={c.name} className={`tab-btn${active===i?" active":""}`} onClick={()=>setActive(i)}>
                  <Icon size={14} color={active===i?c.color:"#475569"}/>{c.name}
                  <span style={{marginLeft:"auto",fontSize:11,fontWeight:700,color:active===i?c.color:"#334155"}}>{c.plugins.length}</span>
                </button>
              );
            })}
          </div>

          {/* Plugin grid */}
          <div>
            <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:24,paddingBottom:16,borderBottom:"1px solid rgba(255,255,255,.06)"}}>
              <div style={{width:46,height:46,borderRadius:13,background:`${cat.color}20`,border:`1px solid ${cat.color}40`,display:"flex",alignItems:"center",justifyContent:"center"}}>
                <CatIcon size={22} color={cat.color}/>
              </div>
              <div>
                <h2 style={{fontWeight:800,fontSize:22,color:"#e2e8f0",letterSpacing:-.5}}>{cat.name}</h2>
                <p style={{fontSize:12.5,color:"#475569"}}>{cat.plugins.length} plugins · All free</p>
              </div>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))",gap:12}}>
              {cat.plugins.map((p,pi)=>(
                <div key={p.name} className="plugin-card" style={{animationDelay:`${pi*.04}s`,animation:"plugReveal .5s ease backwards"}}>
                  <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}>
                    <CheckCircle size={14} color={cat.color} style={{flexShrink:0}}/>
                    <span style={{fontWeight:700,fontSize:14,color:"#e2e8f0"}}>{p.name}</span>
                  </div>
                  <p style={{fontSize:12.5,color:"#475569",paddingLeft:22,lineHeight:1.6}}>{p.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA */}
        <div style={{textAlign:"center",marginTop:72,padding:"48px 24px",borderRadius:24,background:"rgba(139,92,246,.04)",border:"1px solid rgba(139,92,246,.12)"}}>
          <Package size={32} color="#c4b5fd" style={{margin:"0 auto 16px"}}/>
          <h2 style={{fontSize:32,fontWeight:900,letterSpacing:-1,color:"#f1f5f9",marginBottom:12}}>Everything built-in. Nothing extra.</h2>
          <p style={{color:"#475569",marginBottom:28}}>No plugin store. No paid add-ons. All 50+ capabilities included from day one.</p>
          <Link href="/notes" style={{display:"inline-flex",alignItems:"center",gap:8,padding:"14px 36px",borderRadius:12,background:"linear-gradient(135deg,#7c3aed,#a855f7)",color:"white",fontWeight:700,fontSize:16,textDecoration:"none",boxShadow:"0 0 40px rgba(139,92,246,.4)"}}>
            <Star size={18}/>Start Using All Plugins Free
          </Link>
        </div>
      </div>
    </div>
  );
}
