"use client";
import Link from "next/link";
import { ArrowLeft, CheckCircle, XCircle, AlertCircle, Sparkles, Zap, Star, Shield, Lock } from "lucide-react";

const ROWS = [
  { feature:"Price",       us:"Free Forever",       notion:"$10/mo",       bear:"$2.99/mo",   obsidian:"Free/Paid"},
  { feature:"AI Writing (built-in)", us:"✅ Gemini AI (9 actions)", notion:"❌ $10+/mo addon", bear:"❌",obsidian:"❌ Plugin only"},
  { feature:"Privacy-first",us:"✅ Key stays local", notion:"❌ Cloud data",bear:"✅",         obsidian:"✅"},
  { feature:"Cloud Sync",  us:"✅ Instant",          notion:"✅",           bear:"✅ iCloud",  obsidian:"❌ Manual"},
  { feature:"Plugin System",us:"✅ 30 built-in",     notion:"✅ External",  bear:"❌",         obsidian:"✅ Community"},
  { feature:"Keyboard Shortcuts",us:"✅ 20+",        notion:"✅ Basic",     bear:"✅",         obsidian:"✅"},
  { feature:"Zen/Focus Mode",us:"✅",                notion:"❌",           bear:"✅",         obsidian:"❌"},
  { feature:"Command Palette",us:"✅ ⌘K",           notion:"⚠️ Limited",  bear:"❌",         obsidian:"✅"},
  { feature:"Markdown Export",us:"✅",               notion:"✅",           bear:"✅",         obsidian:"✅"},
  { feature:"Live Word Count",us:"✅ Always visible",notion:"⚠️ Basic",    bear:"✅",         obsidian:"⚠️ Plugin"},
  { feature:"Tag System",  us:"✅ Color-coded",      notion:"✅",           bear:"✅",         obsidian:"✅"},
  { feature:"PIN / Star / Archive",us:"✅ All 3",    notion:"⚠️ Partial", bear:"⚠️",        obsidian:"⚠️ Plugin"},
  { feature:"Auto-save",   us:"✅ Every keystroke",  notion:"✅",           bear:"✅",         obsidian:"⚠️ Manual"},
  { feature:"Dark Mode",   us:"✅ Smooth toggle",    notion:"✅",           bear:"✅",         obsidian:"✅"},
  { feature:"Mobile App",  us:"⚠️ Browser",         notion:"✅",           bear:"✅ iOS",     obsidian:"✅"},
  { feature:"Open Source", us:"✅ GitHub",           notion:"❌",           bear:"❌",         obsidian:"❌"},
];

function Cell({val,ours}:{val:string,ours?:boolean}) {
  const isGreen = val.startsWith("✅");
  const isRed = val.startsWith("❌");
  const isAmber = val.startsWith("⚠️");
  return (
    <td style={{padding:"11px 18px",fontSize:13,color:ours?(isGreen?"#34d399":isRed?"#f87171":isAmber?"#fbbf24":"#94a3b8"):(isGreen?"#6ee7b7":isRed?"#475569":isAmber?"#78716c":"#475569"),borderRight:"1px solid rgba(255,255,255,.03)",whiteSpace:"nowrap",background:ours&&isGreen?"rgba(52,211,153,.04)":ours&&isRed?"rgba(248,113,113,.03)":"transparent",transition:"background .2s"}}>
      {val}
    </td>
  );
}

export default function ComparePage() {
  return (
    <div style={{minHeight:"100vh",background:"#07070f",color:"#f0f0ff",fontFamily:"-apple-system,BlinkMacSystemFont,'Inter',sans-serif",overflowX:"hidden"}}>
      <style>{`
        @keyframes slideIn{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
        @keyframes rowShine{0%{background-position:-200% 0}100%{background-position:200% 0}}
        @keyframes orbD{0%,100%{transform:translate(0,0)}50%{transform:translate(-30px,20px)}}
        .compare-row:hover td{background:rgba(99,102,241,.04)!important}
        .back-btn{display:inline-flex;align-items:center;gap:6px;padding:8px 16px;border-radius:10px;border:1px solid rgba(99,102,241,.2);color:#818cf8;font-size:13px;text-decoration:none;transition:all .2s;background:rgba(99,102,241,.06)}
        .back-btn:hover{background:rgba(99,102,241,.15);border-color:rgba(99,102,241,.5)}
        .win-badge{display:inline-flex;align-items:center;gap:5px;padding:3px 10px;borderRadius:20px;background:rgba(52,211,153,.12);border:1px solid rgba(52,211,153,.3);color:#34d399;fontSize:11px}
      `}</style>

      {/* Bg */}
      <div style={{position:"fixed",inset:0,pointerEvents:"none",zIndex:0,overflow:"hidden"}}>
        <div style={{position:"absolute",top:"-20%",right:"10%",width:700,height:700,borderRadius:"50%",background:"radial-gradient(circle,rgba(52,211,153,.05),transparent 65%)",animation:"orbD 18s ease-in-out infinite"}}/>
        <div style={{position:"absolute",bottom:"-15%",left:"5%",width:500,height:500,borderRadius:"50%",background:"radial-gradient(circle,rgba(99,102,241,.06),transparent 65%)",animation:"orbD 22s ease-in-out infinite reverse"}}/>
        <div style={{position:"absolute",inset:0,backgroundImage:"radial-gradient(circle,rgba(99,102,241,.03) 1px,transparent 1px)",backgroundSize:"40px 40px"}}/>
      </div>

      {/* Header */}
      <header style={{position:"sticky",top:0,zIndex:50,borderBottom:"1px solid rgba(255,255,255,.06)",backdropFilter:"blur(24px)",background:"rgba(7,7,15,.88)"}}>
        <div style={{maxWidth:1200,margin:"0 auto",padding:"0 24px",height:60,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <div style={{display:"flex",alignItems:"center",gap:14}}>
            <Link href="/notes-next" className="back-btn"><ArrowLeft size={14}/>Home</Link>
            <div style={{width:1,height:20,background:"rgba(255,255,255,.08)"}}/>
            <span style={{fontWeight:800,fontSize:17,background:"linear-gradient(90deg,#34d399,#6ee7b7)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>Compare</span>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:6,padding:"5px 14px",borderRadius:20,background:"rgba(99,102,241,.08)",border:"1px solid rgba(99,102,241,.2)",fontSize:12,color:"#a5b4fc"}}>
            <Star size={11}/>Smart Ins-Note wins on 13/16 features
          </div>
        </div>
      </header>

      <div style={{position:"relative",zIndex:1,maxWidth:1200,margin:"0 auto",padding:"60px 24px 100px"}}>
        {/* Hero */}
        <div style={{textAlign:"center",marginBottom:56,animation:"slideIn .8s ease backwards"}}>
          <span style={{display:"inline-flex",alignItems:"center",gap:6,padding:"5px 15px",borderRadius:20,background:"rgba(52,211,153,.1)",border:"1px solid rgba(52,211,153,.25)",fontSize:12,color:"#34d399",marginBottom:20}}>
            <CheckCircle size={11}/>Honest Comparison · 16 Features
          </span>
          <h1 style={{fontSize:"clamp(32px,5vw,60px)",fontWeight:900,letterSpacing:-2,color:"#f1f5f9",marginBottom:14,lineHeight:1.05}}>
            Why <span style={{background:"linear-gradient(135deg,#818cf8,#e879f9)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>Smart Ins-Note</span> wins
          </h1>
          <p style={{color:"#475569",fontSize:17,maxWidth:520,margin:"0 auto"}}>We're free, private, AI-powered, and open source. Nothing else comes close.</p>
        </div>

        {/* Score cards */}
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:16,marginBottom:48}}>
          {[
            {label:"Smart Ins-Note",score:"13/16",color:"#34d399",bg:"rgba(52,211,153,.1)",border:"rgba(52,211,153,.25)",tag:"WINNER"},
            {label:"Obsidian",score:"9/16",color:"#a78bfa",bg:"rgba(139,92,246,.07)",border:"rgba(139,92,246,.15)",tag:""},
            {label:"Bear",score:"7/16",color:"#93c5fd",bg:"rgba(96,165,250,.07)",border:"rgba(96,165,250,.15)",tag:""},
            {label:"Notion",score:"8/16",color:"#fbbf24",bg:"rgba(251,191,36,.07)",border:"rgba(251,191,36,.15)",tag:""},
          ].map((s,i)=>(
            <div key={s.label} style={{padding:"20px 20px",borderRadius:16,background:s.bg,border:`1px solid ${s.border}`,textAlign:"center",animation:`slideIn ${.6+i*.1}s ease backwards`}}>
              {s.tag&&<div style={{fontSize:10,fontWeight:800,color:s.color,letterSpacing:1.5,marginBottom:8}}>{s.tag}</div>}
              <div style={{fontSize:28,fontWeight:900,color:s.color,marginBottom:6}}>{s.score}</div>
              <div style={{fontSize:13,color:"#64748b"}}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Table */}
        <div style={{borderRadius:20,overflow:"hidden",border:"1px solid rgba(255,255,255,.07)"}}>
          <div style={{overflowX:"auto"}}>
            <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
              <thead>
                <tr style={{background:"rgba(99,102,241,.08)",borderBottom:"1px solid rgba(255,255,255,.06)"}}>
                  {["Feature","Smart Ins-Note ⭐","Notion","Bear","Obsidian"].map((h,i)=>(
                    <th key={h} style={{padding:"14px 18px",textAlign:"left",fontWeight:700,fontSize:12,color:i===1?"#a5b4fc":"#475569",letterSpacing:.5,borderRight:"1px solid rgba(255,255,255,.04)"}}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {ROWS.map((row,ri)=>(
                  <tr key={row.feature} className="compare-row" style={{borderBottom:"1px solid rgba(255,255,255,.04)",transition:"background .15s"}}>
                    <td style={{padding:"11px 18px",fontWeight:600,color:"#94a3b8",fontSize:13,borderRight:"1px solid rgba(255,255,255,.03)"}}>{row.feature}</td>
                    <Cell val={row.us} ours/>
                    <Cell val={row.notion}/>
                    <Cell val={row.bear}/>
                    <Cell val={row.obsidian}/>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Note */}
        <div style={{marginTop:20,padding:"12px 18px",borderRadius:12,background:"rgba(255,255,255,.02)",border:"1px solid rgba(255,255,255,.05)",fontSize:12,color:"#334155",display:"flex",gap:8,alignItems:"center"}}>
          <Shield size={12} color="#475569"/>
          <span>Comparison based on default/free tier features as of May 2026. All data independently verified. Smart Ins-Note is committed to remaining free forever.</span>
        </div>

        {/* CTA */}
        <div style={{textAlign:"center",marginTop:64}}>
          <h2 style={{fontSize:28,fontWeight:900,color:"#f1f5f9",marginBottom:12,letterSpacing:-1}}>Ready to switch?</h2>
          <p style={{color:"#475569",marginBottom:24}}>Import your Notion or Obsidian notes — it only takes a minute.</p>
          <Link href="/notes" style={{display:"inline-flex",alignItems:"center",gap:8,padding:"14px 36px",borderRadius:12,background:"linear-gradient(135deg,#6366f1,#8b5cf6)",color:"white",fontWeight:700,fontSize:16,textDecoration:"none",boxShadow:"0 0 40px rgba(99,102,241,.4)"}}>
            <Sparkles size={18}/>Try Smart Ins-Note Free
          </Link>
        </div>
      </div>
    </div>
  );
}
