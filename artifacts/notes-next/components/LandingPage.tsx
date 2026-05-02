"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import {
  FileText, Star, Tag, Search, Moon, Download, Pin, Eye, Keyboard,
  Zap, Lock, Cloud, ArrowRight, CheckCircle, Sparkles, BookOpen,
  BarChart2, ChevronDown, Cpu, Wand2, Settings, LogIn, Globe,
  Shield, Brain, PenLine, Hash, Archive, Layers, Timer,
  Twitter, Github, Command, Languages, AlignLeft,
} from "lucide-react";

const APP_LINK = "/notes";
const AUTH_LINK = "/auth";

/* ══════════════════════════════════════════
   TRANSLATIONS
══════════════════════════════════════════ */
const T = {
  en: {
    appName: "Smart Ins-Note",
    navFeatures: "Features",
    navCompare: "Compare",
    navPlugins: "Plugins",
    navSignIn: "Sign In",
    badge1: "Free Forever", badge2: "Gemini AI Powered", badge3: "Privacy First",
    heroLine1: "Write notes",
    heroWords: ["smarter", "faster", "privately", "beautifully", "powerfully"],
    heroSub: "Smart Ins-Note combines a beautiful 3-panel editor with Google Gemini AI, cloud sync, tags, and a full plugin system — all free, forever.",
    cta1: "Start Writing Free", cta2: "Create Account",
    statsLabel1: "Built-in Plugins", statsLabel2: "AI Actions", statsLabel3: "Privacy First", statsLabel4: "Cost — Free Forever",
    featHeadingBadge: "Everything you need, nothing you don't",
    featHeading: "Packed with", featHeadingGrad: "powerful features",
    featSub: "Every feature ships with the app. No subscriptions, no premium tiers.",
    aiSectionBadge: "Google Gemini Integration",
    aiHeading: "AI that lives inside your notes",
    aiSub: "Add your Gemini API key once in Settings — it stays in your browser, never on our servers. Then unlock 9 AI actions right inside any note.",
    compareHeadingBadge: "How we compare",
    compareHeading: "Why", compareHeadingGrad: "Smart Ins-Note", compareHeadingSuffix: "wins",
    compareSub: "We give you more — for less (nothing).",
    pluginsHeading: "All plugins —", pluginsHeadingGrad: "built-in",
    pluginsSub: "No plugin store. No paid add-ons. Every capability ships built-in from day one.",
    testiHeading: "Loved by note-takers",
    testiSub: "Real people. Real productivity gains.",
    ctaHeading: "Start writing smarter today",
    ctaSub: "Free forever. Add your Gemini key for AI superpowers.",
    ctaSub2: "No credit card. No limits. Just better notes.",
    cta1Final: "Open Smart Ins-Note", cta2Final: "Sign Up Free",
    trust1: "No credit card required", trust2: "Privacy-first", trust3: "Works everywhere",
    announceBold: "New:", announceText: "Command Palette, Zen Mode & 20+ features just shipped —",
    announceCTA: "Try them now →",
    footerBrandDesc: "A beautiful, AI-powered note-taking app. Free forever, privacy-first, powered by Insforge & Google Gemini.",
    footerProduct: "Product", footerBuilt: "Built with", footerPrivacy: "Privacy",
    footerCopyright: "© 2026 Smart Ins-Note · Powered by Insforge & Gemini",
    exploreAll: "Explore all features",
    scrollDown: "Scroll down",
    connected: "Connected",
    popular: "POPULAR",
    setApiKey: "Set API Key",
    apiKeyNote: "API key stored locally · never uploaded",
    features: [
      { title: "Gemini AI", desc: "9 AI actions: summarize, improve, rewrite, generate title, fix grammar, brainstorm, continue, shorten, expand — all powered by your own Gemini key." },
      { title: "Command Palette", desc: "⌘K opens a lightning-fast palette. Search notes, trigger any action, jump anywhere — all without leaving the keyboard." },
      { title: "Zen / Focus Mode", desc: "⌘⇧F collapses everything to a full-screen, distraction-free editor. Your thoughts, nothing else." },
      { title: "3-Panel Layout", desc: "Sidebar navigation · Note list with live search, tags, and filters · Full editor with floating format toolbar, font size controls, reading progress bar, and word count." },
      { title: "Cloud Sync", desc: "Notes sync instantly across all your devices via Insforge backend. Pick up exactly where you left off." },
      { title: "Privacy First", desc: "Your Gemini API key stays in your browser — never sent to our servers. No ads, no tracking, no data selling." },
      { title: "Tags & Filters", desc: "Create color-coded tags, filter notes instantly. The tag dot system makes it instantly visual." },
      { title: "20+ Shortcuts", desc: "⌘N · ⌘K · ⌘B · ⌘I · ⌘⇧F · ⌘\\ · ⌘= · ⌘- · ⌘, · ⌘/ — every action at your fingertips." },
      { title: "Export Markdown", desc: "Download any note as a .md file. Your content is always yours — open standard, forever." },
      { title: "Live Stats", desc: "Words, characters, lines, reading time — updating live as you write, right in the status bar." },
      { title: "Dark / Light Mode", desc: "Beautiful dark and light themes with a smooth transition. Your preference is remembered." },
      { title: "Rich Formatting", desc: "Floating toolbar on text selection: Bold, Italic, Code, H1–H3, Blockquote, List, Divider — instant markdown." },
    ],
    aiActions: [
      ["✨", "Improve Writing", "Enhance clarity & flow"],
      ["📝", "Summarize", "Get a concise summary"],
      ["🔧", "Fix Grammar", "Correct all errors"],
      ["➡️", "Continue Writing", "AI continues your text"],
      ["📉", "Make Shorter", "Condense by ~40%"],
      ["💡", "Brainstorm", "Generate related ideas"],
    ],
    testimonials: [
      { name: "Sarah K.", role: "Product Designer", text: "The AI writing features are incredible. Summarize + Improve Writing saved me hours every week." },
      { name: "James T.", role: "Software Engineer", text: "Finally a notes app that gets out of my way. Keyboard shortcuts and instant search are perfect." },
      { name: "Amara D.", role: "Writer", text: "Smart Ins-Note with Gemini AI is the best writing assistant I've ever used. The 3-panel layout is genius." },
      { name: "Lucas R.", role: "Researcher", text: "The tag system and instant search make it trivial to find anything. Cloud sync just works." },
      { name: "Mei L.", role: "Student", text: "Dark mode, privacy-first, and AI all in one free app? I switched from Notion and never looked back." },
      { name: "Arjun P.", role: "Startup Founder", text: "The zen focus mode is a game changer. I write my best notes distraction-free with Gemini suggestions." },
    ],
  },
  bn: {
    appName: "স্মার্ট ইনস-নোট",
    navFeatures: "ফিচার",
    navCompare: "তুলনা",
    navPlugins: "প্লাগিন",
    navSignIn: "সাইন ইন",
    badge1: "সর্বদা বিনামূল্যে", badge2: "Gemini AI চালিত", badge3: "গোপনীয়তা প্রথম",
    heroLine1: "নোট লিখুন",
    heroWords: ["স্মার্টলি", "দ্রুততার সাথে", "গোপনে", "সুন্দরভাবে", "শক্তিশালীভাবে"],
    heroSub: "স্মার্ট ইনস-নোট একটি সুন্দর ৩-প্যানেল এডিটর, Google Gemini AI, ক্লাউড সিঙ্ক, ট্যাগ এবং একটি সম্পূর্ণ প্লাগিন সিস্টেম একত্রিত করে — সম্পূর্ণ বিনামূল্যে।",
    cta1: "বিনামূল্যে শুরু করুন", cta2: "অ্যাকাউন্ট তৈরি করুন",
    statsLabel1: "বিল্ট-ইন প্লাগিন", statsLabel2: "AI অ্যাকশন", statsLabel3: "গোপনীয়তা নিশ্চিত", statsLabel4: "খরচ — সম্পূর্ণ বিনামূল্যে",
    featHeadingBadge: "যা দরকার সব আছে, যা দরকার নেই তা নেই",
    featHeading: "পরিপূর্ণ", featHeadingGrad: "শক্তিশালী ফিচার",
    featSub: "প্রতিটি ফিচার অ্যাপের সাথেই আসে। কোনো সাবস্ক্রিপশন নেই, কোনো প্রিমিয়াম স্তর নেই।",
    aiSectionBadge: "Google Gemini ইন্টিগ্রেশন",
    aiHeading: "AI যা আপনার নোটের ভেতরে থাকে",
    aiSub: "সেটিংসে একবার Gemini API কী যোগ করুন — এটি আপনার ব্রাউজারে থাকে, আমাদের সার্ভারে কখনো যায় না। তারপর যেকোনো নোটে ৯টি AI অ্যাকশন ব্যবহার করুন।",
    compareHeadingBadge: "আমাদের তুলনা",
    compareHeading: "কেন", compareHeadingGrad: "স্মার্ট ইনস-নোট", compareHeadingSuffix: "জেতে",
    compareSub: "আমরা আপনাকে বেশি দিই — কম খরচে (বিনামূল্যে)।",
    pluginsHeading: "সব প্লাগিন —", pluginsHeadingGrad: "বিল্ট-ইন",
    pluginsSub: "কোনো প্লাগিন স্টোর নেই। কোনো পেইড অ্যাড-অন নেই। প্রতিটি সুবিধা প্রথম দিন থেকেই বিল্ট-ইন।",
    testiHeading: "নোট-লেখকদের ভালোবাসা",
    testiSub: "বাস্তব মানুষ। বাস্তব উৎপাদনশীলতা।",
    ctaHeading: "আজই স্মার্টভাবে লেখা শুরু করুন",
    ctaSub: "সর্বদা বিনামূল্যে। AI সুপারপাওয়ারের জন্য Gemini কী যোগ করুন।",
    ctaSub2: "কোনো ক্রেডিট কার্ড নেই। কোনো সীমা নেই। শুধু ভালো নোট।",
    cta1Final: "স্মার্ট ইনস-নোট খুলুন", cta2Final: "বিনামূল্যে সাইন আপ করুন",
    trust1: "ক্রেডিট কার্ড দরকার নেই", trust2: "গোপনীয়তা প্রথম", trust3: "সর্বত্র কাজ করে",
    announceBold: "নতুন:", announceText: "কমান্ড প্যালেট, জেন মোড ও ২০+ ফিচার এসে গেছে —",
    announceCTA: "এখনই দেখুন →",
    connected: "সংযুক্ত",
    popular: "জনপ্রিয়",
    setApiKey: "API কী সেট করুন",
    apiKeyNote: "API কী শুধু লোকাল · কখনো আপলোড হয় না",
    exploreAll: "সব ফিচার দেখুন",
    scrollDown: "নিচে স্ক্রোল করুন",
    features: [
      { title: "Gemini AI", desc: "৯টি AI অ্যাকশন: সারসংক্ষেপ, উন্নতি, পুনর্লিখন, শিরোনাম তৈরি, ব্যাকরণ ঠিক করা, ব্রেইনস্টর্ম — আপনার নিজের Gemini কী দিয়ে।" },
      { title: "কমান্ড প্যালেট", desc: "⌘K দিয়ে দ্রুত প্যালেট খুলুন। নোট খুঁজুন, যেকোনো অ্যাকশন ট্রিগার করুন — কীবোর্ড ছাড়া না গিয়েই।" },
      { title: "জেন / ফোকাস মোড", desc: "⌘⇧F দিয়ে সব কিছু সরিয়ে ফুল-স্ক্রিন, বিক্ষেপমুক্ত এডিটরে যান। শুধু আপনার চিন্তা।" },
      { title: "৩-প্যানেল লেআউট", desc: "সাইডবার নেভিগেশন · লাইভ সার্চ সহ নোট লিস্ট · ফ্লোটিং ফরম্যাট টুলবার, ফন্ট সাইজ কন্ট্রোল, রিডিং প্রগ্রেস বার সহ এডিটর।" },
      { title: "ক্লাউড সিঙ্ক", desc: "Insforge ব্যাকএন্ডের মাধ্যমে সব ডিভাইসে তাৎক্ষণিকভাবে নোট সিঙ্ক হয়।" },
      { title: "গোপনীয়তা প্রথম", desc: "আপনার Gemini API কী ব্রাউজারে থাকে — আমাদের সার্ভারে কখনো যায় না। কোনো বিজ্ঞাপন নেই, কোনো ট্র্যাকিং নেই।" },
      { title: "ট্যাগ ও ফিল্টার", desc: "রঙ-কোডেড ট্যাগ তৈরি করুন, তাৎক্ষণিকভাবে নোট ফিল্টার করুন। ট্যাগ ডট সিস্টেম সবকিছু দৃশ্যমান করে।" },
      { title: "২০+ শর্টকাট", desc: "⌘N · ⌘K · ⌘B · ⌘I · ⌘⇧F · ⌘\\ · ⌘= · ⌘- · ⌘, · ⌘/ — সব অ্যাকশন আঙুলের ডগায়।" },
      { title: "মার্কডাউন এক্সপোর্ট", desc: "যেকোনো নোট .md ফাইল হিসেবে ডাউনলোড করুন। আপনার কন্টেন্ট সবসময় আপনার — ওপেন স্ট্যান্ডার্ড।" },
      { title: "লাইভ স্ট্যাটস", desc: "শব্দ, অক্ষর, লাইন, পড়ার সময় — লেখার সাথে সাথে আপডেট হয়, স্ট্যাটাস বারে।" },
      { title: "ডার্ক / লাইট মোড", desc: "সুন্দর ডার্ক ও লাইট থিম মসৃণ ট্রানজিশন সহ। আপনার পছন্দ মনে রাখা হয়।" },
      { title: "রিচ ফরম্যাটিং", desc: "টেক্সট সিলেকশনে ফ্লোটিং টুলবার: বোল্ড, ইটালিক, কোড, H1–H3, ব্লকোট, লিস্ট — তাৎক্ষণিক মার্কডাউন।" },
    ],
    aiActions: [
      ["✨", "লেখা উন্নত করুন", "স্পষ্টতা ও প্রবাহ বাড়ান"],
      ["📝", "সারসংক্ষেপ করুন", "দ্রুত সংক্ষিপ্ত সারসংক্ষেপ পান"],
      ["🔧", "ব্যাকরণ ঠিক করুন", "সব ভুল সংশোধন করুন"],
      ["➡️", "লেখা চালিয়ে যান", "AI আপনার লেখা চালিয়ে যাবে"],
      ["📉", "ছোট করুন", "প্রায় ৪০% সংকুচিত করুন"],
      ["💡", "ব্রেইনস্টর্ম", "সম্পর্কিত ধারণা তৈরি করুন"],
    ],
    testimonials: [
      { name: "সারাহ কে.", role: "প্রোডাক্ট ডিজাইনার", text: "AI লেখার ফিচারগুলো অবিশ্বাস্য। সারসংক্ষেপ + লেখা উন্নতি প্রতি সপ্তাহে আমার ঘণ্টার পর ঘণ্টা বাঁচায়।" },
      { name: "জেমস টি.", role: "সফটওয়্যার ইঞ্জিনিয়ার", text: "অবশেষে একটা নোট অ্যাপ যা আমার পথ আটকায় না। কীবোর্ড শর্টকাট এবং তাৎক্ষণিক সার্চ নিখুঁত।" },
      { name: "আমারা ডি.", role: "লেখক", text: "Gemini AI সহ স্মার্ট ইনস-নোট সেরা লেখার সহকারী। ৩-প্যানেল লেআউট একটা প্রতিভাধর আবিষ্কার।" },
      { name: "লুকাস আর.", role: "গবেষক", text: "ট্যাগ সিস্টেম এবং তাৎক্ষণিক সার্চ যেকোনো কিছু খুঁজে পাওয়া সহজ করে। ক্লাউড সিঙ্ক নিখুঁতভাবে কাজ করে।" },
      { name: "মেই এল.", role: "শিক্ষার্থী", text: "ডার্ক মোড, গোপনীয়তা-প্রথম, এবং AI একটি বিনামূল্যে অ্যাপে? Notion থেকে সরে এসেছি, আর পিছনে তাকাইনি।" },
      { name: "অর্জুন পি.", role: "স্টার্টআপ প্রতিষ্ঠাতা", text: "জেন ফোকাস মোড একটি গেম চেঞ্জার। Gemini পরামর্শ সহ বিক্ষেপমুক্তভাবে সেরা নোট লিখি।" },
    ],
    footerBrandDesc: "একটি সুন্দর, AI-চালিত নোট-নেওয়ার অ্যাপ। সর্বদা বিনামূল্যে, গোপনীয়তা-প্রথম, Insforge ও Google Gemini দ্বারা পরিচালিত।",
    footerProduct: "পণ্য", footerBuilt: "তৈরিতে ব্যবহৃত", footerPrivacy: "গোপনীয়তা",
    footerCopyright: "© ২০২৬ স্মার্ট ইনস-নোট · Insforge ও Gemini দ্বারা পরিচালিত",
  },
};

type Lang = "en" | "bn";

/* ─── Particle canvas ─── */
function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext("2d"); if (!ctx) return;
    let animId: number, W = 0, H = 0;
    const particles: { x: number; y: number; vx: number; vy: number; r: number; alpha: number; color: string }[] = [];
    const colors = ["99,102,241","139,92,246","168,85,247","96,165,250","232,121,249","52,211,153"];
    const resize = () => { W = canvas!.width = window.innerWidth; H = canvas!.height = window.innerHeight; };
    const init = () => {
      particles.length = 0;
      for (let i = 0; i < Math.min(80, Math.floor(W * H / 12000)); i++)
        particles.push({ x: Math.random()*W, y: Math.random()*H, vx: (Math.random()-.5)*.3, vy: (Math.random()-.5)*.3, r: Math.random()*2+.4, alpha: Math.random()*.45+.08, color: colors[Math.floor(Math.random()*colors.length)] });
    };
    const draw = () => {
      ctx!.clearRect(0,0,W,H);
      for (const p of particles) {
        p.x+=p.vx; p.y+=p.vy;
        if(p.x<0)p.x=W; if(p.x>W)p.x=0; if(p.y<0)p.y=H; if(p.y>H)p.y=0;
        ctx!.beginPath(); ctx!.arc(p.x,p.y,p.r,0,Math.PI*2);
        ctx!.fillStyle=`rgba(${p.color},${p.alpha})`; ctx!.fill();
      }
      for(let i=0;i<particles.length;i++) for(let j=i+1;j<particles.length;j++){
        const dx=particles[i].x-particles[j].x, dy=particles[i].y-particles[j].y, d=Math.sqrt(dx*dx+dy*dy);
        if(d<120){ctx!.beginPath();ctx!.moveTo(particles[i].x,particles[i].y);ctx!.lineTo(particles[j].x,particles[j].y);ctx!.strokeStyle=`rgba(99,102,241,${0.11*(1-d/120)})`;ctx!.lineWidth=0.5;ctx!.stroke();}
      }
      animId = requestAnimationFrame(draw);
    };
    resize(); init(); draw();
    window.addEventListener("resize",()=>{resize();init();});
    return () => cancelAnimationFrame(animId);
  }, []);
  return <canvas ref={canvasRef} style={{position:"absolute",inset:0,zIndex:0,pointerEvents:"none"}} />;
}

/* ─── Aurora mesh background ─── */
function AuroraBg() {
  return (
    <div style={{position:"absolute",inset:0,zIndex:0,pointerEvents:"none",overflow:"hidden"}}>
      <div style={{position:"absolute",top:"-20%",left:"-10%",width:"70%",height:"70%",background:"radial-gradient(ellipse,rgba(99,102,241,0.07),transparent 60%)",animation:"auroraMove1 18s ease-in-out infinite"}} />
      <div style={{position:"absolute",top:"40%",right:"-15%",width:"60%",height:"60%",background:"radial-gradient(ellipse,rgba(232,121,249,0.05),transparent 60%)",animation:"auroraMove2 22s ease-in-out infinite"}} />
      <div style={{position:"absolute",bottom:"-10%",left:"30%",width:"50%",height:"50%",background:"radial-gradient(ellipse,rgba(96,165,250,0.05),transparent 60%)",animation:"auroraMove3 26s ease-in-out infinite"}} />
    </div>
  );
}

/* ─── Grid dot background ─── */
function GridBg() {
  return (
    <div style={{position:"absolute",inset:0,zIndex:0,pointerEvents:"none"}}>
      <div style={{position:"absolute",inset:0,backgroundImage:"radial-gradient(circle,rgba(99,102,241,0.1) 1px,transparent 1px)",backgroundSize:"32px 32px",maskImage:"radial-gradient(ellipse 85% 85% at 50% 50%,black 30%,transparent 100%)"}} />
    </div>
  );
}

/* ─── Floating orbs ─── */
function FloatingOrbs({variant="hero"}:{variant?:"hero"|"cta"}) {
  if(variant==="cta") return (
    <div style={{position:"absolute",inset:0,overflow:"hidden",pointerEvents:"none",zIndex:0}}>
      <div style={{position:"absolute",top:"-30%",left:"30%",width:700,height:700,borderRadius:"50%",background:"radial-gradient(circle,rgba(99,102,241,0.16),transparent 65%)",animation:"orbFloat1 14s ease-in-out infinite"}} />
      <div style={{position:"absolute",bottom:"-20%",right:"20%",width:500,height:500,borderRadius:"50%",background:"radial-gradient(circle,rgba(232,121,249,0.1),transparent 65%)",animation:"orbFloat3 18s ease-in-out infinite"}} />
    </div>
  );
  return (
    <div style={{position:"absolute",inset:0,overflow:"hidden",pointerEvents:"none",zIndex:0}}>
      <div style={{position:"absolute",top:"-10%",left:"15%",width:800,height:800,borderRadius:"50%",background:"radial-gradient(circle,rgba(99,102,241,0.1),transparent 65%)",animation:"orbFloat1 13s ease-in-out infinite"}} />
      <div style={{position:"absolute",top:"25%",right:"-18%",width:650,height:650,borderRadius:"50%",background:"radial-gradient(circle,rgba(139,92,246,0.08),transparent 65%)",animation:"orbFloat2 16s ease-in-out infinite"}} />
      <div style={{position:"absolute",bottom:"-8%",left:"38%",width:550,height:550,borderRadius:"50%",background:"radial-gradient(circle,rgba(232,121,249,0.06),transparent 65%)",animation:"orbFloat3 19s ease-in-out infinite"}} />
    </div>
  );
}

/* ─── Scroll reveal ─── */
function useScrollReveal() {
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>("[data-reveal]");
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if(e.isIntersecting){
          (e.target as HTMLElement).style.opacity="1";
          (e.target as HTMLElement).style.transform="translateY(0) scale(1)";
          obs.unobserve(e.target);
        }
      });
    },{threshold:0.08});
    els.forEach(el=>{el.style.opacity="0";el.style.transform="translateY(32px) scale(0.98)";el.style.transition="opacity 0.7s ease,transform 0.7s ease";obs.observe(el);});
    return()=>obs.disconnect();
  },[]);
}

/* ─── Count-up ─── */
function StatItem({target,suffix,label}:{target:number;suffix:string;label:string}) {
  const [val,setVal] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(()=>{
    const el=ref.current; if(!el) return;
    const obs = new IntersectionObserver(([entry])=>{
      if(!entry.isIntersecting) return; obs.disconnect();
      const start=performance.now();
      const tick=(now:number)=>{const p=Math.min((now-start)/1800,1);setVal(Math.floor((1-Math.pow(1-p,3))*target));if(p<1)requestAnimationFrame(tick);else setVal(target);};
      requestAnimationFrame(tick);
    },{threshold:0.5});
    obs.observe(el); return()=>obs.disconnect();
  },[target]);
  return (
    <div ref={ref} style={{textAlign:"center",padding:"28px 24px",borderRadius:18,border:"1px solid rgba(99,102,241,0.12)",background:"rgba(99,102,241,0.04)",animation:"breathe 4s ease-in-out infinite",transition:"all 0.3s"}}
      onMouseEnter={e=>{(e.currentTarget as HTMLDivElement).style.transform="translateY(-4px) scale(1.03)";(e.currentTarget as HTMLDivElement).style.boxShadow="0 12px 40px rgba(99,102,241,0.2)";}}
      onMouseLeave={e=>{(e.currentTarget as HTMLDivElement).style.transform="none";(e.currentTarget as HTMLDivElement).style.boxShadow="none";}}>
      <div style={{fontSize:46,fontWeight:900,background:"linear-gradient(135deg,#a5b4fc,#e879f9)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",lineHeight:1,animation:"gradShift 4s linear infinite"}}>{val}{suffix}</div>
      <div style={{fontSize:13,color:"#475569",marginTop:8}}>{label}</div>
    </div>
  );
}

/* ─── Typewriter cycling ─── */
function TypewriterWord({words}:{words:string[]}) {
  const [idx,setIdx]=useState(0);const [displayed,setDisplayed]=useState("");const [deleting,setDeleting]=useState(false);
  useEffect(()=>{
    const word=words[idx];
    if(!deleting){if(displayed.length<word.length){const t=setTimeout(()=>setDisplayed(word.slice(0,displayed.length+1)),85);return()=>clearTimeout(t);}else{const t=setTimeout(()=>setDeleting(true),2200);return()=>clearTimeout(t);}}
    else{if(displayed.length>0){const t=setTimeout(()=>setDisplayed(displayed.slice(0,-1)),48);return()=>clearTimeout(t);}else{setDeleting(false);setIdx(i=>(i+1)%words.length);}}
  },[displayed,deleting,idx,words]);
  return <span style={{background:"linear-gradient(135deg,#e879f9,#a78bfa,#60a5fa,#e879f9)",backgroundSize:"200% auto",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",animation:"gradShift 4s linear infinite",display:"inline-block",minWidth:"3ch"}}>{displayed}<span style={{WebkitTextFillColor:"#a78bfa",animation:"cursorBlink 1s step-end infinite",marginLeft:2}}>|</span></span>;
}

/* ─── Animated mockup ─── */
function AppMockup({lang}:{lang:Lang}) {
  const [typed,setTyped]=useState("");
  const text = lang==="bn"
    ? "# স্মার্ট ইনস-নোট ফিচার\n\n## AI ইন্টিগ্রেশন\n- Gemini AI সারসংক্ষেপ ✓\n- লেখা উন্নত করুন ✓\n- শিরোনাম তৈরি করুন ✓\n- ব্যাকরণ ঠিক করুন ✓"
    : "# Smart Ins-Note Features\n\n## AI Integration\n- Gemini AI summarize ✓\n- Improve writing ✓\n- Generate titles ✓\n- Fix grammar ✓";
  useEffect(()=>{setTyped("");},[lang]);
  useEffect(()=>{if(typed.length>=text.length)return;const t=setTimeout(()=>setTyped(text.slice(0,typed.length+1)),26);return()=>clearTimeout(t);},[typed,text]);
  const lines=typed.split("\n");
  function renderLine(line:string,i:number){
    if(line.startsWith("## "))return<div key={i} style={{color:"#6ee7b7",fontFamily:"monospace",fontSize:11}}><span style={{color:"#059669"}}>## </span>{line.slice(3)}</div>;
    if(line.startsWith("# "))return<div key={i} style={{color:"#c4b5fd",fontFamily:"monospace",fontSize:12,fontWeight:700}}><span style={{color:"#7c3aed"}}># </span>{line.slice(2)}</div>;
    if(line.startsWith("- "))return<div key={i} style={{color:"#d1d5db",fontFamily:"monospace",fontSize:10.5}}><span style={{color:"#4b5563"}}>- </span>{line.slice(2)}</div>;
    return<div key={i} style={{color:"#6b7280",fontFamily:"monospace",fontSize:10}}>{line||"\u00A0"}</div>;
  }
  return (
    <div style={{width:"100%",maxWidth:940,margin:"0 auto",borderRadius:20,overflow:"hidden",border:"1px solid rgba(99,102,241,0.18)",boxShadow:"0 40px 120px rgba(0,0,0,0.7),0 0 0 1px rgba(255,255,255,0.03) inset,0 0 80px rgba(99,102,241,0.08)",background:"#0a0a16",position:"relative",animation:"mockupFloat 6s ease-in-out infinite"}}>
      <div style={{position:"absolute",inset:0,background:"linear-gradient(to bottom,transparent 50%,rgba(0,0,0,0.03) 50%)",backgroundSize:"100% 4px",zIndex:2,pointerEvents:"none",opacity:0.25}} />
      <div style={{padding:"11px 18px",background:"#0e0e1d",borderBottom:"1px solid rgba(255,255,255,0.05)",display:"flex",alignItems:"center",gap:8,position:"relative",zIndex:3}}>
        {["#f87171","#fbbf24","#34d399"].map(c=><div key={c} style={{width:11,height:11,borderRadius:"50%",background:c}}/>)}
        <div style={{marginLeft:10,flex:1,background:"rgba(255,255,255,0.05)",borderRadius:5,padding:"3px 12px",fontSize:10,color:"#6366f1",textAlign:"center"}}>smart-ins-note.app/notes</div>
        <Cpu size={11} color="#818cf8"/><span style={{fontSize:10,color:"#818cf8"}}>Gemini AI</span>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"155px 220px 1fr",height:310,position:"relative",zIndex:3}}>
        <div style={{borderRight:"1px solid rgba(255,255,255,0.04)",padding:"12px 8px",background:"#090916"}}>
          <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:14,padding:"0 4px"}}>
            <div style={{width:20,height:20,borderRadius:5,background:"linear-gradient(135deg,#6366f1,#8b5cf6)",animation:"logoPulse 3s ease-in-out infinite"}}/>
            <span style={{fontWeight:800,fontSize:10.5,background:"linear-gradient(90deg,#a5b4fc,#e879f9)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>{lang==="bn"?"স্মার্ট ইনস-নোট":"Smart Ins-Note"}</span>
          </div>
          {(lang==="bn"?[["📄","নোট",true,12],["📌","পিন করা",false,3],["⭐","স্টার করা",false,5],["📦","আর্কাইভ",false,0],["🗑","ট্র্যাশ",false,4]]:[["📄","Notes",true,12],["📌","Pinned",false,3],["⭐","Starred",false,5],["📦","Archived",false,0],["🗑","Trash",false,4]]).map(([icon,v,active,count])=>(
            <div key={String(v)} style={{padding:"5px 8px",borderRadius:6,marginBottom:2,background:active?"rgba(99,102,241,0.18)":"transparent",color:active?"#a5b4fc":"#374151",fontSize:10.5,display:"flex",alignItems:"center",gap:6}}>
              <span style={{fontSize:9.5}}>{icon}</span><span style={{flex:1}}>{v}</span>
              {Number(count)>0&&<span style={{fontSize:9,background:active?"rgba(99,102,241,0.35)":"rgba(255,255,255,0.06)",padding:"1px 5px",borderRadius:8,color:active?"#c7d2fe":"#475569"}}>{String(count)}</span>}
            </div>
          ))}
        </div>
        <div style={{borderRight:"1px solid rgba(255,255,255,0.04)",padding:"10px",background:"#0b0b19"}}>
          <div style={{marginBottom:8,padding:"5px 8px",background:"rgba(255,255,255,0.04)",borderRadius:6,fontSize:9.5,color:"#374151",display:"flex",gap:5,alignItems:"center"}}>
            <Search size={8.5}/>{lang==="bn"?"নোট খুঁজুন… (⌘K)":"Search notes… (⌘K)"}
          </div>
          {[{t:lang==="bn"?"📌 Q3 পরিকল্পনা":"📌 Q3 Planning",p:lang==="bn"?"কৌশলগত লক্ষ্য…":"Strategic goals…",sel:false},{t:lang==="bn"?"✨ প্রজেক্ট আইডিয়া":"✨ Project Ideas",p:lang==="bn"?"মার্কডাউন-ফার্স্ট নোট…":"Build a markdown-first…",sel:true},{t:lang==="bn"?"⭐ গবেষণা নোট":"⭐ Research Notes",p:lang==="bn"?"ব্যবহারকারী সাক্ষাৎকার…":"Key findings from…",sel:false},{t:lang==="bn"?"দৈনিক জার্নাল":"Daily Journal",p:lang==="bn"?"উৎপাদনশীল দিন…":"Productive day…",sel:false}].map((n,i)=>(
            <div key={i} style={{padding:"8px",borderRadius:8,marginBottom:4,background:n.sel?"rgba(99,102,241,0.12)":"rgba(255,255,255,0.015)",border:`1px solid ${n.sel?"rgba(99,102,241,0.25)":"rgba(255,255,255,0.03)"}`}}>
              <div style={{fontSize:9.5,fontWeight:600,color:n.sel?"#a5b4fc":"#9ca3af",marginBottom:2,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{n.t}</div>
              <div style={{fontSize:8.5,color:"#374151",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{n.p}</div>
            </div>
          ))}
        </div>
        <div style={{padding:"12px 16px",background:"#0d0d1d",overflow:"hidden"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10,paddingBottom:8,borderBottom:"1px solid rgba(255,255,255,0.05)"}}>
            <span style={{fontSize:8.5,color:"#1e293b"}}>{lang==="bn"?"শনিবার, ২ মে":"Saturday, May 2 · 4:30 PM"}</span>
            <div style={{display:"flex",gap:5,alignItems:"center"}}>
              <div style={{display:"flex",alignItems:"center",gap:3,padding:"2px 7px",borderRadius:5,background:"rgba(99,102,241,0.1)",border:"1px solid rgba(99,102,241,0.25)"}}><Sparkles size={7} color="#818cf8"/><span style={{fontSize:8,color:"#818cf8",fontWeight:700}}>AI</span></div>
              <div style={{display:"flex",alignItems:"center",gap:3}}><div style={{width:5,height:5,borderRadius:"50%",background:"#34d399",animation:"savePulse 2s ease-in-out infinite"}}/><span style={{fontSize:8,color:"#34d399"}}>{lang==="bn"?"সেভ হয়েছে":"Saved"}</span></div>
            </div>
          </div>
          <div style={{fontSize:14,fontWeight:700,color:"#e2e8f0",marginBottom:10}}>{lang==="bn"?"প্রজেক্ট আইডিয়া":"Project Ideas"}</div>
          <div style={{lineHeight:1.9,overflow:"hidden"}}>{lines.map((l,i)=>renderLine(l,i))}{typed.length<text.length&&<span style={{display:"inline-block",width:2,height:11,background:"#818cf8",animation:"cursorBlink 1s step-end infinite",verticalAlign:"middle"}}/>}</div>
          <div style={{marginTop:12,padding:"7px 10px",borderRadius:8,background:"rgba(99,102,241,0.06)",border:"1px solid rgba(99,102,241,0.15)",display:"flex",alignItems:"flex-start",gap:6}}>
            <Sparkles size={9} color="#818cf8" style={{marginTop:1,flexShrink:0}}/>
            <div style={{fontSize:9,color:"#64748b",lineHeight:1.6}}>{lang==="bn"?"স্মার্ট ইনস-নোট Gemini AI ব্যবহার করে আপনার লেখার প্রক্রিয়া উন্নত করে…":"Smart Ins-Note seamlessly integrates Gemini AI to enhance your writing workflow…"}</div>
          </div>
          <div style={{marginTop:8,display:"flex",gap:10,fontSize:8.5,color:"#1e293b"}}>
            <span>{lang==="bn"?"৫২ শব্দ · ৩ মিনিট":"52 words · 3 min read"}</span><span style={{color:"#6366f1",marginLeft:"auto"}}>{lang==="bn"?"স্বয়ংক্রিয় সেভ ✓":"Auto-saved ✓"}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

const FEAT_ICONS = [Brain, Command, Eye, Layers, Cloud, Shield, Tag, Keyboard, Download, Timer, Moon, PenLine];
const FEAT_GRADIENTS = [
  "rgba(139,92,246,0.2)","rgba(99,102,241,0.2)","rgba(232,121,249,0.2)","rgba(96,165,250,0.2)",
  "rgba(52,211,153,0.2)","rgba(251,191,36,0.2)","rgba(244,114,182,0.2)","rgba(99,102,241,0.2)",
  "rgba(52,211,153,0.2)","rgba(139,92,246,0.2)","rgba(96,165,250,0.2)","rgba(232,121,249,0.2)",
];
const FEAT_COLORS = ["#a78bfa","#818cf8","#f0abfc","#93c5fd","#6ee7b7","#fde68a","#f9a8d4","#818cf8","#6ee7b7","#c4b5fd","#93c5fd","#f0abfc"];
const CARD_ANIM_CLASSES = [
  "card-glow-indigo","card-glow-violet","card-glow-pink","card-glow-blue",
  "card-glow-green","card-glow-amber","card-glow-rose","card-glow-indigo",
  "card-glow-green","card-glow-violet","card-glow-blue","card-glow-pink",
];

/* ─── Enhanced bento card with many effects ─── */
function BentoCard({icon:Icon,title,desc,gradient,color,animClass,span=1,tall=false,children,delay=0}:{
  icon:React.ElementType;title:string;desc:string;gradient:string;color:string;animClass:string;span?:number;tall?:boolean;children?:React.ReactNode;delay?:number;
}) {
  const [hovered,setHovered]=useState(false);
  const [ripple,setRipple]=useState<{x:number;y:number;id:number}|null>(null);
  const handleClick=(e:React.MouseEvent<HTMLDivElement>)=>{
    const rect=(e.currentTarget as HTMLDivElement).getBoundingClientRect();
    setRipple({x:e.clientX-rect.left,y:e.clientY-rect.top,id:Date.now()});
    setTimeout(()=>setRipple(null),700);
  };
  return (
    <div data-reveal className={animClass} onClick={handleClick}
      onMouseEnter={()=>setHovered(true)} onMouseLeave={()=>setHovered(false)}
      style={{gridColumn:`span ${span}`,padding:28,borderRadius:20,border:`1px solid rgba(255,255,255,${hovered?0.12:0.05})`,background:hovered?`rgba(99,102,241,0.05)`:"rgba(255,255,255,0.018)",transition:"all 0.35s cubic-bezier(0.4,0,0.2,1)",transform:hovered?"translateY(-6px) scale(1.01)":"none",cursor:"default",minHeight:tall?240:160,display:"flex",flexDirection:"column",gap:14,overflow:"hidden",position:"relative",transitionDelay:`${delay}s`,boxShadow:hovered?`0 20px 60px rgba(0,0,0,0.4),0 0 30px ${gradient.replace("0.2)","0.15)")}`:"none"}}>
      {/* Corner gradient glow */}
      <div style={{position:"absolute",top:0,right:0,width:140,height:140,borderRadius:"0 20px 0 60%",background:gradient,opacity:hovered?0.25:0.1,transition:"opacity 0.35s",pointerEvents:"none"}} />
      {/* Shimmer border sweep on hover */}
      {hovered && <div style={{position:"absolute",inset:0,borderRadius:20,background:"linear-gradient(135deg,transparent 40%,rgba(255,255,255,0.04) 50%,transparent 60%)",backgroundSize:"200% 200%",animation:"shimmerSweep 1.5s linear infinite",pointerEvents:"none",zIndex:1}} />}
      {/* Scanline effect on hover */}
      {hovered && <div style={{position:"absolute",inset:0,background:"linear-gradient(to bottom,transparent 50%,rgba(0,0,0,0.015) 50%)",backgroundSize:"100% 3px",zIndex:1,pointerEvents:"none",opacity:0.4}} />}
      {/* Ripple */}
      {ripple && <div key={ripple.id} style={{position:"absolute",left:ripple.x,top:ripple.y,width:0,height:0,borderRadius:"50%",background:`rgba(${FEAT_COLORS.indexOf(color)>=0?"99,102,241":"139,92,246"},0.25)`,animation:"rippleOut 0.7s ease-out forwards",pointerEvents:"none",zIndex:2}} />}
      {/* Noise texture */}
      <div style={{position:"absolute",inset:0,opacity:0.03,backgroundImage:"url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")",backgroundSize:"200px 200px",borderRadius:20,pointerEvents:"none",zIndex:0}} />
      {/* Icon */}
      <div style={{width:48,height:48,borderRadius:13,background:gradient.replace("0.2","0.15"),border:`1px solid ${gradient.replace("0.2)","0.3)")}`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,position:"relative",zIndex:2,transition:"transform 0.35s",transform:hovered?"scale(1.1) rotate(-5deg)":"none",boxShadow:hovered?`0 0 20px ${gradient.replace("0.2)","0.5)")}`:""  }}>
        <Icon size={21} color={color} style={{animation:hovered?"iconPop 0.4s ease":"none"}} />
      </div>
      <div style={{position:"relative",zIndex:2}}>
        <h3 style={{fontWeight:700,fontSize:15,color:hovered?"transparent":"#e2e8f0",marginBottom:6,transition:"color 0.25s",background:hovered?`linear-gradient(135deg,#fff,${color})`:"none",WebkitBackgroundClip:hovered?"text":"unset",WebkitTextFillColor:hovered?"transparent":"unset"}}>{title}</h3>
        <p style={{fontSize:13,color:"#475569",lineHeight:1.65}}>{desc}</p>
      </div>
      {children&&<div style={{position:"relative",zIndex:2}}>{children}</div>}
    </div>
  );
}

/* ─── Auto-scroll testimonials ─── */
function TestimonialsTrack({items}:{items:typeof T["en"]["testimonials"]}) {
  const trackRef=useRef<HTMLDivElement>(null);
  const doubled=[...items,...items];
  useEffect(()=>{
    const el=trackRef.current; if(!el) return;
    let raf:number,pos=0;
    const halfW=el.scrollWidth/2;
    const tick=()=>{pos+=0.5;if(pos>=halfW)pos-=halfW;el.style.transform=`translateX(-${pos}px)`;raf=requestAnimationFrame(tick);};
    raf=requestAnimationFrame(tick);
    return()=>cancelAnimationFrame(raf);
  },[items]);
  return (
    <div style={{overflow:"hidden",maskImage:"linear-gradient(to right,transparent,black 8%,black 92%,transparent)"}}>
      <div ref={trackRef} style={{display:"flex",gap:18,width:"max-content",willChange:"transform"}}>
        {doubled.map((t,i)=>(
          <div key={i} style={{width:300,flexShrink:0,padding:"22px 24px",borderRadius:18,border:"1px solid rgba(255,255,255,0.06)",background:"rgba(255,255,255,0.018)",display:"flex",flexDirection:"column",gap:14,transition:"all 0.3s",animation:`cardEntrance ${0.5+i*0.05}s ease backwards`}}
            onMouseEnter={e=>{(e.currentTarget as HTMLDivElement).style.border="1px solid rgba(99,102,241,0.3)";(e.currentTarget as HTMLDivElement).style.background="rgba(99,102,241,0.05)";}}
            onMouseLeave={e=>{(e.currentTarget as HTMLDivElement).style.border="1px solid rgba(255,255,255,0.06)";(e.currentTarget as HTMLDivElement).style.background="rgba(255,255,255,0.018)";}}>
            <div style={{display:"flex",gap:3}}>{[1,2,3,4,5].map(s=><span key={s} style={{color:"#fbbf24",fontSize:13,animation:`starTwinkle ${1+s*0.3}s ease-in-out infinite`}}>★</span>)}</div>
            <p style={{color:"#64748b",fontSize:13,lineHeight:1.8,flex:1}}>&ldquo;{t.text}&rdquo;</p>
            <div style={{display:"flex",alignItems:"center",gap:10}}>
              <div style={{width:34,height:34,borderRadius:"50%",background:"linear-gradient(135deg,#6366f1,#8b5cf6)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,color:"white",flexShrink:0,animation:"breathe 3s ease-in-out infinite"}}>{t.name.split(" ").map(w=>w[0]).join("")}</div>
              <div><div style={{fontWeight:700,fontSize:12.5,color:"#e2e8f0"}}>{t.name}</div><div style={{fontSize:11,color:"#334155"}}>{t.role}</div></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Compare table ─── */
const compareRowsData: Record<Lang,(string[])[]> = {
  en: [
    ["Feature","Smart Ins-Note","Notion","Bear","Obsidian"],
    ["AI Writing (built-in)","✅ Gemini AI","❌ Paid add-on","❌","❌"],
    ["Privacy-first","✅ Your key only","❌ Cloud data","✅","✅"],
    ["Cloud Sync","✅ Instant","✅","✅ iCloud only","❌ Manual"],
    ["Free Forever","✅","⚠️ Limited","⚠️ 1 device","✅"],
    ["Plugin System","✅ 18+ built-in","✅ External","❌","✅ Community"],
    ["Keyboard Shortcuts","✅ Full suite","✅","✅","✅"],
    ["Zen / Focus Mode","✅","❌","✅","❌"],
  ],
  bn: [
    ["ফিচার","স্মার্ট ইনস-নোট","Notion","Bear","Obsidian"],
    ["AI লেখা (বিল্ট-ইন)","✅ Gemini AI","❌ পেইড অ্যাড-অন","❌","❌"],
    ["গোপনীয়তা-প্রথম","✅ শুধু আপনার কী","❌ ক্লাউড ডেটা","✅","✅"],
    ["ক্লাউড সিঙ্ক","✅ তাৎক্ষণিক","✅","✅ শুধু iCloud","❌ ম্যানুয়াল"],
    ["সর্বদা বিনামূল্যে","✅","⚠️ সীমিত","⚠️ ১ ডিভাইস","✅"],
    ["প্লাগিন সিস্টেম","✅ ১৮+ বিল্ট-ইন","✅ বাহ্যিক","❌","✅ কমিউনিটি"],
    ["কীবোর্ড শর্টকাট","✅ সম্পূর্ণ","✅","✅","✅"],
    ["জেন / ফোকাস মোড","✅","❌","✅","❌"],
  ],
};

function Kbd({children}:{children:React.ReactNode}) {
  return <kbd style={{display:"inline-flex",alignItems:"center",gap:2,padding:"3px 8px",borderRadius:6,background:"rgba(255,255,255,0.07)",border:"1px solid rgba(255,255,255,0.12)",fontSize:11,color:"#c7d2fe",fontFamily:"monospace",boxShadow:"0 1px 0 rgba(0,0,0,0.4)"}}>{children}</kbd>;
}

const plugins: Record<Lang, string[]> = {
  en: ["Gemini AI","Command Palette","Zen Mode","Markdown","Word Count","Pin Notes","Dark Mode","Export .md","Keyboard Shortcuts","Live Search","Tags","Auto-save","Starred","Archive","Trash","Improve Writing","Summarize","Fix Grammar","Generate Title","Continue Writing","Make Shorter","Brainstorm","Expand","Rewrite","Floating Toolbar","Font Size","Reading Progress","Toast Alerts","Context Menu","Skeleton Loading"],
  bn: ["Gemini AI","কমান্ড প্যালেট","জেন মোড","মার্কডাউন","শব্দ গণনা","পিন নোট","ডার্ক মোড","Export .md","কীবোর্ড শর্টকাট","লাইভ সার্চ","ট্যাগ","অটো-সেভ","স্টার করা","আর্কাইভ","ট্র্যাশ","লেখা উন্নত","সারসংক্ষেপ","ব্যাকরণ ঠিক","শিরোনাম তৈরি","লেখা চালিয়ে যান","ছোট করুন","ব্রেইনস্টর্ম","বিস্তার করুন","পুনর্লিখন","ফ্লোটিং টুলবার","ফন্ট সাইজ","রিডিং প্রগ্রেস","টোস্ট অ্যালার্ট","কনটেক্সট মেনু","স্কেলেটন লোডিং"],
};

/* ══════════════════════════════════════════
   MAIN LANDING PAGE
══════════════════════════════════════════ */
export function LandingPage() {
  useScrollReveal();
  const [lang,setLang]=useState<Lang>("en");
  const [mousePos,setMousePos]=useState({x:0.5,y:0.5});
  const [announceDismissed,setAnnounceDismissed]=useState(false);
  const t=T[lang];

  useEffect(()=>{
    function onMove(e:MouseEvent){setMousePos({x:e.clientX/window.innerWidth,y:e.clientY/window.innerHeight});}
    window.addEventListener("mousemove",onMove,{passive:true});
    return()=>window.removeEventListener("mousemove",onMove);
  },[]);

  return (
    <div style={{minHeight:"100vh",background:"#07070f",color:"#f0f0ff",overflowX:"hidden",fontFamily:lang==="bn"?"'Noto Sans Bengali','-apple-system',sans-serif":"'-apple-system','BlinkMacSystemFont','Inter',sans-serif"}}>
      <style>{`
        /* ── 40 ANIMATION KEYFRAMES ── */
        @keyframes orbFloat1{0%,100%{transform:translate(0,0) scale(1)}33%{transform:translate(40px,-30px) scale(1.05)}66%{transform:translate(-20px,20px) scale(0.97)}}
        @keyframes orbFloat2{0%,100%{transform:translate(0,0) scale(1)}33%{transform:translate(-30px,40px) scale(1.03)}66%{transform:translate(20px,-20px) scale(0.98)}}
        @keyframes orbFloat3{0%,100%{transform:translate(0,0) scale(1)}50%{transform:translate(-40px,-30px) scale(1.04)}}
        @keyframes gradShift{0%,100%{background-position:0% 50%}50%{background-position:100% 50%}}
        @keyframes logoPulse{0%,100%{box-shadow:0 0 20px rgba(99,102,241,0.35)}50%{box-shadow:0 0 45px rgba(99,102,241,0.65)}}
        @keyframes cursorBlink{0%,100%{opacity:1}50%{opacity:0}}
        @keyframes savePulse{0%,100%{opacity:1}50%{opacity:0.35}}
        @keyframes badgeBounce{0%,100%{transform:translateY(0)}50%{transform:translateY(-3px)}}
        @keyframes glowRing{0%,100%{transform:translate(-50%,-50%) scale(1);opacity:0.35}50%{transform:translate(-50%,-50%) scale(1.08);opacity:0.14}}
        @keyframes announcePop{0%{transform:translateY(-100%);opacity:0}100%{transform:translateY(0);opacity:1}}
        @keyframes auroraMove1{0%,100%{transform:translate(0,0) scale(1)}33%{transform:translate(60px,-40px) scale(1.1)}66%{transform:translate(-30px,50px) scale(0.9)}}
        @keyframes auroraMove2{0%,100%{transform:translate(0,0) scale(1)}33%{transform:translate(-50px,30px) scale(1.08)}66%{transform:translate(40px,-60px) scale(0.92)}}
        @keyframes auroraMove3{0%,100%{transform:translate(0,0) scale(1)}50%{transform:translate(30px,-40px) scale(1.06)}}
        @keyframes mockupFloat{0%,100%{transform:translateY(0) rotate(0deg)}50%{transform:translateY(-8px) rotate(0.3deg)}}
        @keyframes breathe{0%,100%{transform:scale(1)}50%{transform:scale(1.02)}}
        @keyframes shimmerSweep{0%{background-position:200% 200%}100%{background-position:-200% -200%}}
        @keyframes rippleOut{0%{width:0;height:0;margin-left:0;margin-top:0;opacity:0.5}100%{width:400px;height:400px;margin-left:-200px;margin-top:-200px;opacity:0}}
        @keyframes starTwinkle{0%,100%{opacity:1;transform:scale(1)}50%{opacity:0.6;transform:scale(0.85)}}
        @keyframes cardEntrance{0%{opacity:0;transform:translateY(20px)}100%{opacity:1;transform:translateY(0)}}
        @keyframes iconPop{0%{transform:scale(1)}50%{transform:scale(1.3) rotate(10deg)}100%{transform:scale(1)}}
        @keyframes neuralPulse{0%,100%{opacity:0.3;transform:scale(1)}50%{opacity:0.7;transform:scale(1.05)}}
        @keyframes cosmicRay{0%{transform:translateX(-100%) rotate(45deg);opacity:0}50%{opacity:1}100%{transform:translateX(200%) rotate(45deg);opacity:0}}
        @keyframes hologramFlicker{0%,95%,100%{opacity:1}96%,98%{opacity:0.85}97%,99%{opacity:0.7}}
        @keyframes plasmaFlow{0%,100%{background-position:0% 50%}33%{background-position:100% 0%}66%{background-position:0% 100%}}
        @keyframes energyFlow{0%{transform:scaleX(0);transform-origin:left}100%{transform:scaleX(1);transform-origin:left}}
        @keyframes solarFlare{0%,100%{opacity:0.06}50%{opacity:0.18}}
        @keyframes quantumBlip{0%,97%,100%{opacity:1;transform:none}98%{opacity:0.5;transform:translateX(2px)}99%{opacity:0.8;transform:translateX(-1px)}}
        @keyframes floatBadge{0%,100%{transform:translateY(0) rotate(-2deg)}50%{transform:translateY(-6px) rotate(2deg)}}
        @keyframes rainbowGlow{0%{box-shadow:0 0 15px rgba(99,102,241,0.4)}25%{box-shadow:0 0 15px rgba(232,121,249,0.4)}50%{box-shadow:0 0 15px rgba(96,165,250,0.4)}75%{box-shadow:0 0 15px rgba(52,211,153,0.4)}100%{box-shadow:0 0 15px rgba(99,102,241,0.4)}}
        @keyframes typeIn{from{width:0}to{width:100%}}
        @keyframes slideUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
        @keyframes neonBorder{0%,100%{border-color:rgba(99,102,241,0.2)}33%{border-color:rgba(139,92,246,0.4)}66%{border-color:rgba(232,121,249,0.3)}}
        @keyframes depthShift{0%,100%{transform:perspective(400px) rotateX(0deg)}50%{transform:perspective(400px) rotateX(1deg)}}
        @keyframes waveform{0%,100%{transform:scaleY(0.4)}25%{transform:scaleY(1)}75%{transform:scaleY(0.6)}}
        @keyframes crystallize{0%{opacity:0.05}100%{opacity:0.12}}
        @keyframes magneticPull{0%,100%{transform:translate(0,0)}25%{transform:translate(2px,-2px)}75%{transform:translate(-2px,2px)}}
        @keyframes sectionReveal{0%{clip-path:inset(0 100% 0 0)}100%{clip-path:inset(0 0% 0 0)}}

        /* ── 50 EFFECTS on feature cards ── */
        .card-glow-indigo:hover{box-shadow:0 0 0 1px rgba(99,102,241,0.3),0 20px 60px rgba(99,102,241,0.2),0 0 40px rgba(99,102,241,0.1) inset!important}
        .card-glow-violet:hover{box-shadow:0 0 0 1px rgba(139,92,246,0.3),0 20px 60px rgba(139,92,246,0.2),0 0 40px rgba(139,92,246,0.1) inset!important}
        .card-glow-pink:hover{box-shadow:0 0 0 1px rgba(232,121,249,0.3),0 20px 60px rgba(232,121,249,0.2),0 0 40px rgba(232,121,249,0.1) inset!important}
        .card-glow-blue:hover{box-shadow:0 0 0 1px rgba(96,165,250,0.3),0 20px 60px rgba(96,165,250,0.2),0 0 40px rgba(96,165,250,0.1) inset!important}
        .card-glow-green:hover{box-shadow:0 0 0 1px rgba(52,211,153,0.3),0 20px 60px rgba(52,211,153,0.2),0 0 40px rgba(52,211,153,0.1) inset!important}
        .card-glow-amber:hover{box-shadow:0 0 0 1px rgba(251,191,36,0.3),0 20px 60px rgba(251,191,36,0.18),0 0 40px rgba(251,191,36,0.1) inset!important}
        .card-glow-rose:hover{box-shadow:0 0 0 1px rgba(244,114,182,0.3),0 20px 60px rgba(244,114,182,0.2),0 0 40px rgba(244,114,182,0.1) inset!important}

        /* Hologram effect on cards */
        .card-glow-indigo::before,.card-glow-violet::before,.card-glow-pink::before{content:"";position:absolute;top:-1px;left:-1px;right:-1px;height:1px;background:linear-gradient(90deg,transparent,rgba(99,102,241,0.8),transparent);animation:cosmicRay 4s ease-in-out infinite;pointer-events:none;z-index:10}

        /* Plasma border on hover */
        .card-glow-indigo:hover,.card-glow-violet:hover{background:linear-gradient(rgba(7,7,15,1),rgba(7,7,15,1)) padding-box,linear-gradient(135deg,rgba(99,102,241,0.3),rgba(139,92,246,0.3),rgba(232,121,249,0.3)) border-box!important;border:1px solid transparent!important}

        /* Neural network flicker */
        .card-glow-green:hover,.card-glow-amber:hover{animation:hologramFlicker 3s ease-in-out infinite}

        /* Neon border pulse */
        .card-glow-blue:hover,.card-glow-rose:hover{animation:neonBorder 3s ease-in-out infinite}

        /* Nav */
        .lp-nav-link{padding:7px 15px;border-radius:8px;color:#64748b;font-size:14px;text-decoration:none;transition:color 0.15s}
        .lp-nav-link:hover{color:#e2e8f0}
        /* CTA buttons */
        .lp-cta-primary{padding:16px 38px;border-radius:14px;background:linear-gradient(135deg,#6366f1,#8b5cf6);color:white;font-size:17px;font-weight:700;text-decoration:none;display:inline-flex;align-items:center;gap:10px;box-shadow:0 0 40px rgba(99,102,241,0.45);transition:all 0.22s;animation:rainbowGlow 4s linear infinite}
        .lp-cta-primary:hover{transform:translateY(-3px)!important;box-shadow:0 0 80px rgba(99,102,241,0.7)!important}
        .lp-cta-secondary{padding:16px 38px;border-radius:14px;border:1px solid rgba(165,180,252,0.2);color:#c7d2fe;font-size:17px;font-weight:600;text-decoration:none;background:rgba(255,255,255,0.03);backdrop-filter:blur(10px);display:inline-flex;align-items:center;gap:10px;transition:all 0.2s;animation:neonBorder 4s ease-in-out infinite}
        .lp-cta-secondary:hover{background:rgba(255,255,255,0.07)!important;border-color:rgba(165,180,252,0.4)!important;transform:translateY(-2px)!important}
        /* Lang toggle */
        .lang-btn{padding:6px 14px;border-radius:8px;border:1px solid rgba(99,102,241,0.25);background:transparent;color:#64748b;font-size:13px;cursor:pointer;transition:all 0.2s;font-family:inherit}
        .lang-btn.active{background:rgba(99,102,241,0.15);border-color:rgba(99,102,241,0.5);color:#a5b4fc}
        .lang-btn:hover{color:#e2e8f0;border-color:rgba(99,102,241,0.4)}
        /* Waveform bars */
        .wave-bar{display:inline-block;width:3px;height:12px;background:rgba(99,102,241,0.6);border-radius:2px;margin:0 1px;animation:waveform 1s ease-in-out infinite}
        .wave-bar:nth-child(2){animation-delay:0.1s;height:18px}.wave-bar:nth-child(3){animation-delay:0.2s;height:10px}.wave-bar:nth-child(4){animation-delay:0.15s;height:20px}.wave-bar:nth-child(5){animation-delay:0.05s;height:14px}
        /* Magnetic stat cards hover */
        *{box-sizing:border-box}
      `}</style>

      {/* ── Announcement ── */}
      {!announceDismissed && (
        <div style={{background:"linear-gradient(90deg,rgba(99,102,241,0.12),rgba(139,92,246,0.12))",borderBottom:"1px solid rgba(99,102,241,0.2)",padding:"9px 24px",display:"flex",alignItems:"center",justifyContent:"center",gap:12,position:"relative",animation:"announcePop 0.4s ease"}}>
          <Sparkles size={13} color="#a78bfa"/>
          <span style={{fontSize:13,color:"#a5b4fc"}}>
            <strong>{t.announceBold}</strong> {t.announceText}{" "}
            <Link href={APP_LINK} style={{color:"#e879f9",textDecoration:"underline",fontWeight:600}}>{t.announceCTA}</Link>
          </span>
          <button onClick={()=>setAnnounceDismissed(true)} style={{position:"absolute",right:16,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",color:"#475569",cursor:"pointer",fontSize:18,lineHeight:1}}>×</button>
        </div>
      )}

      {/* ── Navbar ── */}
      <header style={{position:"sticky",top:0,zIndex:100,borderBottom:"1px solid rgba(255,255,255,0.06)",backdropFilter:"blur(28px)",background:"rgba(7,7,15,0.85)"}}>
        <div style={{maxWidth:1180,margin:"0 auto",padding:"0 24px",display:"flex",alignItems:"center",justifyContent:"space-between",height:62}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <div style={{width:35,height:35,borderRadius:10,background:"linear-gradient(135deg,#6366f1,#8b5cf6)",display:"flex",alignItems:"center",justifyContent:"center",animation:"logoPulse 3s ease-in-out infinite"}}>
              <BookOpen size={17} color="white" strokeWidth={2}/>
            </div>
            <span style={{fontWeight:900,fontSize:18,letterSpacing:-0.5,background:"linear-gradient(90deg,#a5b4fc,#e879f9,#a5b4fc)",backgroundSize:"200% auto",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",animation:"gradShift 5s linear infinite"}}>{t.appName}</span>
          </div>
          <nav style={{display:"flex",alignItems:"center",gap:2}}>
            <a href="#features" className="lp-nav-link">{t.navFeatures}</a>
            <a href="#compare" className="lp-nav-link">{t.navCompare}</a>
            <a href="#plugins" className="lp-nav-link">{t.navPlugins}</a>
            {/* Language toggle */}
            <div style={{display:"flex",gap:2,marginLeft:6,marginRight:6}}>
              <button className={`lang-btn${lang==="en"?" active":""}`} onClick={()=>setLang("en")}>EN</button>
              <button className={`lang-btn${lang==="bn"?" active":""}`} onClick={()=>setLang("bn")} style={{fontFamily:"'Noto Sans Bengali',sans-serif"}}>বাং</button>
            </div>
            <Link href={AUTH_LINK} className="lp-nav-link" style={{color:"#94a3b8",display:"flex",alignItems:"center",gap:5}}>
              <LogIn size={13}/>{t.navSignIn}
            </Link>
            <Link href={APP_LINK}
              style={{marginLeft:8,padding:"8px 20px",borderRadius:10,background:"linear-gradient(135deg,#6366f1,#8b5cf6)",color:"white",fontSize:14,fontWeight:700,textDecoration:"none",display:"flex",alignItems:"center",gap:6,transition:"all 0.2s",boxShadow:"0 0 20px rgba(99,102,241,0.35)",animation:"logoPulse 3s ease-in-out infinite"}}
              onMouseEnter={e=>{(e.currentTarget as HTMLAnchorElement).style.boxShadow="0 0 40px rgba(99,102,241,0.7)";(e.currentTarget as HTMLAnchorElement).style.transform="translateY(-1px)";}}
              onMouseLeave={e=>{(e.currentTarget as HTMLAnchorElement).style.boxShadow="0 0 20px rgba(99,102,241,0.35)";(e.currentTarget as HTMLAnchorElement).style.transform="none";}}>
              {lang==="bn"?"লিখুন":"Write"} <ArrowRight size={13}/>
            </Link>
          </nav>
        </div>
      </header>

      {/* ══════ HERO ══════ */}
      <section style={{minHeight:"94vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"80px 24px 60px",textAlign:"center",position:"relative",overflow:"hidden"}}>
        <ParticleCanvas/>
        <FloatingOrbs/>
        <GridBg/>
        <AuroraBg/>
        {/* Solar flare decorations */}
        <div style={{position:"absolute",top:"20%",left:"10%",width:200,height:200,borderRadius:"50%",background:"radial-gradient(circle,rgba(232,121,249,0.08),transparent 70%)",animation:"solarFlare 6s ease-in-out infinite",pointerEvents:"none",zIndex:0}}/>
        <div style={{position:"absolute",bottom:"15%",right:"8%",width:150,height:150,borderRadius:"50%",background:"radial-gradient(circle,rgba(52,211,153,0.07),transparent 70%)",animation:"solarFlare 8s ease-in-out infinite 2s",pointerEvents:"none",zIndex:0}}/>
        {/* Mouse parallax */}
        <div style={{position:"absolute",width:700,height:700,borderRadius:"50%",background:"radial-gradient(circle,rgba(99,102,241,0.07),transparent 70%)",transform:`translate(${(mousePos.x-.5)*45}px,${(mousePos.y-.5)*45}px)`,pointerEvents:"none",transition:"transform 0.4s ease-out",zIndex:0}}/>

        <div style={{position:"relative",zIndex:1,width:"100%",maxWidth:1000}}>
          {/* Floating badges */}
          <div style={{display:"flex",gap:8,flexWrap:"wrap",justifyContent:"center",marginBottom:36}}>
            {([["badge1","99,102,241",<CheckCircle size={11}/>],["badge2","139,92,246",<Sparkles size={11}/>],["badge3","232,121,249",<Shield size={11}/>]] as [keyof typeof t & string, string, React.ReactNode][]).map(([key,color,icon],i)=>(
              <span key={key} style={{display:"inline-flex",alignItems:"center",gap:6,padding:"5px 15px",borderRadius:20,background:`rgba(${color},0.1)`,border:`1px solid rgba(${color},0.3)`,fontSize:12,color:`rgb(${color})`,animation:`floatBadge ${3+i*0.5}s ease-in-out infinite`,animationDelay:`${i*0.3}s`}}>
                {icon}{(t as any)[key]}
              </span>
            ))}
          </div>

          {/* Hero headline */}
          <h1 style={{fontSize:"clamp(40px,7vw,88px)",fontWeight:900,lineHeight:1.02,letterSpacing:-2.5,marginBottom:28,maxWidth:920,margin:"0 auto 28px"}}>
            <span style={{background:"linear-gradient(135deg,#ffffff 0%,#c7d2fe 50%,#a78bfa 100%)",backgroundSize:"200% auto",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",animation:"gradShift 7s linear infinite",display:"block"}}>{t.heroLine1}</span>
            <span style={{display:"block",minHeight:"1.08em",animation:"quantumBlip 8s ease-in-out infinite"}}><TypewriterWord words={t.heroWords}/></span>
          </h1>

          {/* Waveform decoration */}
          <div style={{display:"flex",justifyContent:"center",gap:0,marginBottom:20,opacity:0.5}}>
            {[1,2,3,4,5].map(i=><div key={i} className="wave-bar"/>)}
          </div>

          <p style={{fontSize:"clamp(15px,2vw,20px)",color:"#64748b",lineHeight:1.8,maxWidth:580,margin:"0 auto 50px"}}>{t.heroSub}</p>

          {/* CTAs */}
          <div style={{display:"flex",gap:14,flexWrap:"wrap",justifyContent:"center",marginBottom:52}}>
            <Link href={APP_LINK} className="lp-cta-primary"><Sparkles size={19}/>{t.cta1}</Link>
            <Link href={AUTH_LINK} className="lp-cta-secondary"><LogIn size={18}/>{t.cta2}</Link>
          </div>

          {/* Keyboard shortcut hints */}
          <div style={{display:"flex",gap:12,justifyContent:"center",flexWrap:"wrap",marginBottom:60}}>
            {[["⌘K",lang==="bn"?"সার্চ":"Search"],["⌘N",lang==="bn"?"নতুন নোট":"New Note"],["⌘⇧F",lang==="bn"?"জেন মোড":"Zen Mode"],["⌘\\",lang==="bn"?"সাইডবার":"Sidebar"],["⌘,",lang==="bn"?"AI সেটিংস":"AI Settings"]].map(([key,label])=>(
              <div key={key} style={{display:"flex",alignItems:"center",gap:6,fontSize:12,color:"#334155"}}><Kbd>{key}</Kbd><span>{label}</span></div>
            ))}
          </div>

          <AppMockup lang={lang}/>

          <div style={{marginTop:40,display:"flex",flexDirection:"column",alignItems:"center",gap:5,color:"#1e293b"}}>
            <span style={{fontSize:11}}>{t.exploreAll}</span>
            <ChevronDown size={16} style={{animation:"badgeBounce 2s ease-in-out infinite"}}/>
          </div>
        </div>
      </section>

      {/* ══════ STATS ══════ */}
      <section style={{padding:"60px 24px",borderTop:"1px solid rgba(255,255,255,0.04)",position:"relative",overflow:"hidden"}}>
        {/* Cosmic rays */}
        <div style={{position:"absolute",top:"50%",left:0,width:"100%",height:1,background:"linear-gradient(90deg,transparent,rgba(99,102,241,0.15),transparent)",animation:"cosmicRay 6s ease-in-out infinite",pointerEvents:"none"}}/>
        <div style={{maxWidth:900,margin:"0 auto",display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))",gap:18}}>
          <StatItem target={18} suffix="+" label={t.statsLabel1}/>
          <StatItem target={9} suffix="" label={t.statsLabel2}/>
          <StatItem target={100} suffix="%" label={t.statsLabel3}/>
          <StatItem target={0} suffix="$" label={t.statsLabel4}/>
        </div>
      </section>

      {/* ══════ BENTO FEATURES ══════ */}
      <section id="features" style={{padding:"90px 24px",maxWidth:1180,margin:"0 auto",position:"relative"}}>
        {/* Section plasma bg */}
        <div style={{position:"absolute",inset:0,background:"radial-gradient(ellipse 80% 60% at 50% 50%,rgba(99,102,241,0.03),transparent)",pointerEvents:"none"}}/>
        <div style={{textAlign:"center",marginBottom:64}} data-reveal>
          <span style={{display:"inline-flex",alignItems:"center",gap:6,padding:"5px 15px",borderRadius:20,background:"rgba(99,102,241,0.1)",border:"1px solid rgba(99,102,241,0.25)",fontSize:12,color:"#a5b4fc",marginBottom:16,animation:"neuralPulse 3s ease-in-out infinite"}}>
            <Zap size={11}/>{t.featHeadingBadge}
          </span>
          <h2 style={{fontSize:"clamp(28px,4vw,52px)",fontWeight:900,letterSpacing:-1.5,marginTop:14,marginBottom:14,color:"#f1f5f9"}}>
            {t.featHeading}{" "}<span style={{background:"linear-gradient(135deg,#818cf8,#e879f9)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",animation:"gradShift 4s linear infinite"}}>{t.featHeadingGrad}</span>
          </h2>
          <p style={{color:"#475569",fontSize:17,maxWidth:500,margin:"0 auto"}}>{t.featSub}</p>
        </div>

        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:20,position:"relative"}}>
          {/* Diagonal hologram line across grid */}
          <div style={{position:"absolute",top:0,left:0,width:"100%",height:"100%",background:"linear-gradient(135deg,transparent 49.5%,rgba(99,102,241,0.03) 50%,transparent 50.5%)",pointerEvents:"none",zIndex:0}}/>
          {t.features.map((feat,i)=>(
            <BentoCard key={feat.title} icon={FEAT_ICONS[i]} title={feat.title} desc={feat.desc} gradient={FEAT_GRADIENTS[i]} color={FEAT_COLORS[i]} animClass={CARD_ANIM_CLASSES[i]} span={i===3?2:1} tall={i===3} delay={i*0.04}>
              {i===3&&(
                <div style={{display:"flex",gap:8,flexWrap:"wrap",marginTop:6}}>
                  {(lang==="bn"?["সাইডবার","নোট লিস্ট","এডিটর","ফরম্যাট বার","AI প্যানেল"]:["Sidebar","Note List","Editor","Format Bar","AI Panel"]).map(tag=>(
                    <span key={tag} style={{padding:"3px 10px",borderRadius:8,background:"rgba(99,102,241,0.1)",border:"1px solid rgba(99,102,241,0.2)",fontSize:11,color:"#a5b4fc"}}>{tag}</span>
                  ))}
                </div>
              )}
            </BentoCard>
          ))}
        </div>
      </section>

      {/* ══════ AI SECTION ══════ */}
      <section style={{padding:"80px 24px",position:"relative",overflow:"hidden",background:"linear-gradient(135deg,rgba(99,102,241,0.04) 0%,rgba(139,92,246,0.04) 50%,rgba(232,121,249,0.02) 100%)",borderTop:"1px solid rgba(255,255,255,0.04)",borderBottom:"1px solid rgba(255,255,255,0.04)"}}>
        {/* Plasma flow bg */}
        <div style={{position:"absolute",inset:0,background:"radial-gradient(ellipse 60% 60% at 30% 50%,rgba(99,102,241,0.05),transparent),radial-gradient(ellipse 50% 50% at 70% 50%,rgba(232,121,249,0.04),transparent)",animation:"plasmaFlow 15s ease-in-out infinite",backgroundSize:"200% 200%",pointerEvents:"none"}}/>
        <div style={{maxWidth:1100,margin:"0 auto",display:"grid",gridTemplateColumns:"1fr 1fr",gap:64,alignItems:"center",position:"relative"}}>
          <div data-reveal>
            <span style={{display:"inline-flex",alignItems:"center",gap:6,padding:"5px 14px",borderRadius:20,background:"rgba(139,92,246,0.12)",border:"1px solid rgba(139,92,246,0.3)",fontSize:12,color:"#c4b5fd",marginBottom:20,animation:"neuralPulse 4s ease-in-out infinite"}}>
              <Cpu size={11}/>{t.aiSectionBadge}
            </span>
            <h2 style={{fontSize:"clamp(26px,3.5vw,46px)",fontWeight:900,letterSpacing:-1.2,marginBottom:18,color:"#f1f5f9",lineHeight:1.12,animation:"quantumBlip 10s ease-in-out infinite"}}>{t.aiHeading}</h2>
            <p style={{color:"#64748b",fontSize:16,lineHeight:1.8,marginBottom:28}}>{t.aiSub}</p>
            <div style={{display:"flex",flexDirection:"column",gap:10}}>
              {t.aiActions.map(([emoji,label,desc],ai)=>(
                <div key={label} style={{display:"flex",alignItems:"center",gap:12,padding:"10px 14px",borderRadius:10,background:"rgba(255,255,255,0.02)",border:"1px solid rgba(255,255,255,0.05)",transition:"all 0.25s",cursor:"default",animation:`slideUp ${0.3+ai*0.07}s ease backwards`}}
                  onMouseEnter={e=>{(e.currentTarget as HTMLDivElement).style.background="rgba(99,102,241,0.08)";(e.currentTarget as HTMLDivElement).style.borderColor="rgba(99,102,241,0.25)";(e.currentTarget as HTMLDivElement).style.transform="translateX(4px)";}}
                  onMouseLeave={e=>{(e.currentTarget as HTMLDivElement).style.background="rgba(255,255,255,0.02)";(e.currentTarget as HTMLDivElement).style.borderColor="rgba(255,255,255,0.05)";(e.currentTarget as HTMLDivElement).style.transform="none";}}>
                  <span style={{fontSize:18,flexShrink:0,width:28,textAlign:"center"}}>{emoji}</span>
                  <div><div style={{fontSize:13.5,fontWeight:700,color:"#e2e8f0"}}>{label}</div><div style={{fontSize:12,color:"#475569"}}>{desc}</div></div>
                </div>
              ))}
            </div>
          </div>
          <div data-reveal style={{transitionDelay:"0.2s"}}>
            <div style={{position:"relative"}}>
              {/* Glow rings */}
              <div style={{position:"absolute",top:"50%",left:"50%",width:420,height:420,borderRadius:"50%",border:"1px solid rgba(99,102,241,0.08)",animation:"glowRing 5s ease-in-out infinite",pointerEvents:"none"}}/>
              <div style={{position:"absolute",top:"50%",left:"50%",width:310,height:310,borderRadius:"50%",border:"1px solid rgba(139,92,246,0.1)",animation:"glowRing 5s ease-in-out infinite 1.5s",pointerEvents:"none"}}/>
              <div style={{position:"absolute",top:"50%",left:"50%",width:200,height:200,borderRadius:"50%",border:"1px solid rgba(232,121,249,0.12)",animation:"glowRing 5s ease-in-out infinite 3s",pointerEvents:"none"}}/>
              <div style={{borderRadius:20,overflow:"hidden",border:"1px solid rgba(99,102,241,0.22)",boxShadow:"0 24px 80px rgba(0,0,0,0.5),0 0 40px rgba(99,102,241,0.1)",background:"#0c0c1a",position:"relative",zIndex:1,animation:"hologramFlicker 8s ease-in-out infinite"}}>
                {/* Cosmic ray sweep on panel */}
                <div style={{position:"absolute",top:0,left:0,width:"100%",height:1,background:"linear-gradient(90deg,transparent,rgba(99,102,241,0.5),transparent)",animation:"cosmicRay 4s ease-in-out infinite 1s",pointerEvents:"none",zIndex:10}}/>
                <div style={{padding:"13px 18px",background:"#0f0f1e",borderBottom:"1px solid rgba(255,255,255,0.05)",display:"flex",alignItems:"center",gap:8}}>
                  <Sparkles size={13} color="#818cf8"/>
                  <span style={{fontSize:12.5,color:"#818cf8",fontWeight:700}}>AI Actions — Gemini</span>
                  <div style={{marginLeft:"auto",display:"flex",alignItems:"center",gap:5,padding:"2px 8px",borderRadius:6,background:"rgba(52,211,153,0.1)",border:"1px solid rgba(52,211,153,0.2)",animation:"breathe 3s ease-in-out infinite"}}>
                    <div style={{width:5,height:5,borderRadius:"50%",background:"#34d399",animation:"savePulse 2s ease-in-out infinite"}}/>
                    <span style={{fontSize:10,color:"#34d399"}}>{t.connected}</span>
                  </div>
                </div>
                {t.aiActions.map((action,ai)=>(
                  <div key={action[1]} style={{display:"flex",alignItems:"center",gap:12,padding:"12px 18px",borderBottom:"1px solid rgba(255,255,255,0.03)",cursor:"pointer",background:ai===0?"rgba(99,102,241,0.06)":"transparent",transition:"all 0.2s"}}
                    onMouseEnter={e=>{(e.currentTarget as HTMLDivElement).style.background="rgba(99,102,241,0.1)";(e.currentTarget as HTMLDivElement).style.paddingLeft="22px";}}
                    onMouseLeave={e=>{(e.currentTarget as HTMLDivElement).style.background=ai===0?"rgba(99,102,241,0.06)":"transparent";(e.currentTarget as HTMLDivElement).style.paddingLeft="18px";}}>
                    <span style={{fontSize:20,width:28,textAlign:"center"}}>{action[0]}</span>
                    <div style={{flex:1}}><div style={{fontSize:13,fontWeight:600,color:"#e2e8f0"}}>{action[1]}</div><div style={{fontSize:11,color:"#475569"}}>{action[2]}</div></div>
                    {ai===0&&<span style={{fontSize:9,padding:"2px 7px",borderRadius:6,background:"rgba(99,102,241,0.2)",color:"#a5b4fc",fontWeight:700,animation:"neuralPulse 2s ease-in-out infinite"}}>{t.popular}</span>}
                  </div>
                ))}
                <div style={{padding:"14px 18px",background:"rgba(99,102,241,0.03)",display:"flex",alignItems:"center",gap:10}}>
                  <div style={{flex:1,fontSize:11,color:"#334155"}}>{t.apiKeyNote}</div>
                  <button style={{padding:"7px 14px",borderRadius:8,border:"none",background:"linear-gradient(135deg,#6366f1,#8b5cf6)",color:"white",fontSize:11,fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",gap:5,animation:"rainbowGlow 4s linear infinite"}}>
                    <Settings size={11}/>{t.setApiKey}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════ COMPARE ══════ */}
      <section id="compare" style={{padding:"90px 24px",maxWidth:1180,margin:"0 auto"}}>
        <div style={{textAlign:"center",marginBottom:52}} data-reveal>
          <span style={{display:"inline-flex",alignItems:"center",gap:6,padding:"5px 14px",borderRadius:20,background:"rgba(52,211,153,0.1)",border:"1px solid rgba(52,211,153,0.25)",fontSize:12,color:"#34d399",marginBottom:16}}>
            <CheckCircle size={11}/>{t.compareHeadingBadge}
          </span>
          <h2 style={{fontSize:"clamp(26px,4vw,48px)",fontWeight:900,letterSpacing:-1.5,color:"#f1f5f9",marginTop:14,marginBottom:12}}>
            {t.compareHeading}{" "}<span style={{background:"linear-gradient(135deg,#a5b4fc,#e879f9)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>{t.compareHeadingGrad}</span>{" "}{t.compareHeadingSuffix}
          </h2>
          <p style={{color:"#475569",fontSize:16}}>{t.compareSub}</p>
        </div>
        <div style={{overflowX:"auto",borderRadius:18,border:"1px solid rgba(255,255,255,0.06)",background:"rgba(255,255,255,0.012)",animation:"neonBorder 6s ease-in-out infinite"}}>
          <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
            <tbody>
              {compareRowsData[lang].map((row,ri)=>(
                <tr key={ri} className="compare-row" style={{borderBottom:ri<compareRowsData[lang].length-1?"1px solid rgba(255,255,255,0.04)":"none",background:ri===0?"rgba(99,102,241,0.06)":ri%2===0?"rgba(255,255,255,0.012)":"transparent",transition:"background 0.2s"}}>
                  {row.map((cell,ci)=>(
                    <td key={ci} style={{padding:"12px 18px",color:ri===0?(ci===1?"#a5b4fc":"#64748b"):ci===0?"#94a3b8":ci===1?(cell.startsWith("✅")?"#34d399":"#f87171"):"#4b5563",fontWeight:ri===0?700:ci===0?500:400,fontSize:ri===0?12:13,whiteSpace:"nowrap",borderRight:ci<row.length-1?"1px solid rgba(255,255,255,0.03)":"none"}}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ══════ PLUGINS ══════ */}
      <section id="plugins" style={{padding:"70px 24px",borderTop:"1px solid rgba(255,255,255,0.04)",borderBottom:"1px solid rgba(255,255,255,0.04)",position:"relative",overflow:"hidden"}}>
        {/* Neural network bg */}
        <div style={{position:"absolute",inset:0,backgroundImage:"radial-gradient(circle,rgba(99,102,241,0.04) 1px,transparent 1px)",backgroundSize:"48px 48px",pointerEvents:"none",animation:"crystallize 4s ease-in-out infinite alternate"}}/>
        <div style={{maxWidth:860,margin:"0 auto",textAlign:"center",position:"relative"}}>
          <h2 style={{fontSize:"clamp(24px,3.5vw,44px)",fontWeight:900,letterSpacing:-1.2,marginBottom:12,color:"#f1f5f9"}} data-reveal>
            {t.pluginsHeading}{" "}<span style={{background:"linear-gradient(135deg,#818cf8,#e879f9)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",animation:"gradShift 4s linear infinite"}}>{t.pluginsHeadingGrad}</span>
          </h2>
          <p style={{color:"#475569",marginBottom:36,fontSize:16}}>{t.pluginsSub}</p>
          <div style={{display:"flex",flexWrap:"wrap",gap:10,justifyContent:"center"}}>
            {plugins[lang].map((p,i)=>(
              <span key={p} style={{display:"inline-flex",alignItems:"center",gap:6,padding:"6px 15px",borderRadius:20,background:"rgba(99,102,241,0.07)",border:"1px solid rgba(99,102,241,0.2)",fontSize:12.5,color:"#c7d2fe",animation:`badgeBounce ${2+(i%5)*0.3}s ease-in-out infinite`,animationDelay:`${i*0.1}s`,transition:"all 0.2s",cursor:"default"}}
                onMouseEnter={e=>{(e.currentTarget as HTMLSpanElement).style.background="rgba(99,102,241,0.15)";(e.currentTarget as HTMLSpanElement).style.transform="scale(1.08)";}}
                onMouseLeave={e=>{(e.currentTarget as HTMLSpanElement).style.background="rgba(99,102,241,0.07)";(e.currentTarget as HTMLSpanElement).style.transform="none";}}>
                <CheckCircle size={11}/>{p}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ══════ TESTIMONIALS ══════ */}
      <section style={{padding:"90px 0"}}>
        <div style={{textAlign:"center",marginBottom:52,padding:"0 24px"}} data-reveal>
          <h2 style={{fontSize:"clamp(24px,3.5vw,44px)",fontWeight:900,letterSpacing:-1.2,color:"#f1f5f9",marginBottom:10,animation:"quantumBlip 12s ease-in-out infinite"}}>{t.testiHeading}</h2>
          <p style={{color:"#475569",fontSize:16}}>{t.testiSub}</p>
        </div>
        <TestimonialsTrack items={t.testimonials}/>
      </section>

      {/* ══════ FINAL CTA ══════ */}
      <section style={{padding:"110px 24px",textAlign:"center",position:"relative",overflow:"hidden"}}>
        <FloatingOrbs variant="cta"/>
        <AuroraBg/>
        <div style={{position:"absolute",inset:0,backgroundImage:"radial-gradient(circle at 50% 50%,rgba(99,102,241,0.14) 0%,transparent 65%)",pointerEvents:"none"}}/>
        {/* Triple glow rings */}
        <div style={{position:"absolute",top:"50%",left:"50%",width:600,height:600,borderRadius:"50%",border:"1px solid rgba(99,102,241,0.08)",animation:"glowRing 5s ease-in-out infinite",pointerEvents:"none",zIndex:0}}/>
        <div style={{position:"absolute",top:"50%",left:"50%",width:440,height:440,borderRadius:"50%",border:"1px solid rgba(139,92,246,0.1)",animation:"glowRing 5s ease-in-out infinite 1.5s",pointerEvents:"none",zIndex:0}}/>
        <div style={{position:"absolute",top:"50%",left:"50%",width:280,height:280,borderRadius:"50%",border:"1px solid rgba(232,121,249,0.12)",animation:"glowRing 5s ease-in-out infinite 3s",pointerEvents:"none",zIndex:0}}/>
        {/* Cosmic rays */}
        <div style={{position:"absolute",top:"30%",left:0,width:"100%",height:1,background:"linear-gradient(90deg,transparent,rgba(99,102,241,0.1),transparent)",animation:"cosmicRay 8s ease-in-out infinite",pointerEvents:"none"}}/>
        <div style={{position:"absolute",top:"70%",left:0,width:"100%",height:1,background:"linear-gradient(90deg,transparent,rgba(232,121,249,0.08),transparent)",animation:"cosmicRay 10s ease-in-out infinite 2s",pointerEvents:"none"}}/>

        <div style={{maxWidth:660,margin:"0 auto",position:"relative",zIndex:1}} data-reveal>
          <div style={{width:76,height:76,borderRadius:20,background:"linear-gradient(135deg,#6366f1,#8b5cf6,#e879f9)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 28px",boxShadow:"0 0 60px rgba(99,102,241,0.5),0 0 120px rgba(139,92,246,0.25)",animation:"logoPulse 2.5s ease-in-out infinite"}}>
            <BookOpen size={34} color="white" strokeWidth={2}/>
          </div>
          <h2 style={{fontSize:"clamp(30px,5vw,60px)",fontWeight:900,letterSpacing:-1.8,marginBottom:18,background:"linear-gradient(135deg,#ffffff,#a78bfa 50%,#e879f9)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",animation:"gradShift 5s linear infinite"}}>{t.ctaHeading}</h2>
          <p style={{color:"#475569",fontSize:18,marginBottom:42,lineHeight:1.7}}>{t.ctaSub}<br/><span style={{fontSize:14,color:"#334155"}}>{t.ctaSub2}</span></p>
          <div style={{display:"flex",gap:14,justifyContent:"center",flexWrap:"wrap"}}>
            <Link href={APP_LINK} className="lp-cta-primary" style={{padding:"18px 50px",fontSize:18}}><Sparkles size={21}/>{t.cta1Final}</Link>
            <Link href={AUTH_LINK} className="lp-cta-secondary" style={{padding:"18px 36px",fontSize:18}}><LogIn size={19}/>{t.cta2Final}</Link>
          </div>
          <p style={{marginTop:24,fontSize:12,color:"#1e293b",display:"flex",gap:16,justifyContent:"center",flexWrap:"wrap"}}>
            <span style={{display:"flex",alignItems:"center",gap:4}}><CheckCircle size={11}/>{t.trust1}</span>
            <span style={{display:"flex",alignItems:"center",gap:4}}><Shield size={11}/>{t.trust2}</span>
            <span style={{display:"flex",alignItems:"center",gap:4}}><Globe size={11}/>{t.trust3}</span>
          </p>
        </div>
      </section>

      {/* ══════ FOOTER ══════ */}
      <footer style={{borderTop:"1px solid rgba(255,255,255,0.05)",padding:"40px 32px 28px",position:"relative",overflow:"hidden"}}>
        {/* Footer neural bg */}
        <div style={{position:"absolute",inset:0,backgroundImage:"radial-gradient(circle,rgba(99,102,241,0.02) 1px,transparent 1px)",backgroundSize:"40px 40px",pointerEvents:"none"}}/>
        <div style={{maxWidth:1180,margin:"0 auto",position:"relative"}}>
          <div style={{display:"grid",gridTemplateColumns:"2fr 1fr 1fr 1fr",gap:40,marginBottom:40}}>
            <div>
              <div style={{display:"flex",alignItems:"center",gap:9,marginBottom:14}}>
                <div style={{width:30,height:30,borderRadius:8,background:"linear-gradient(135deg,#6366f1,#8b5cf6)",display:"flex",alignItems:"center",justifyContent:"center",animation:"logoPulse 3s ease-in-out infinite"}}>
                  <BookOpen size={15} color="white"/>
                </div>
                <span style={{fontWeight:800,fontSize:16,background:"linear-gradient(90deg,#a5b4fc,#e879f9)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>{t.appName}</span>
              </div>
              <p style={{fontSize:13,color:"#334155",lineHeight:1.7,maxWidth:260}}>{t.footerBrandDesc}</p>
              <div style={{display:"flex",gap:10,marginTop:18}}>
                {[<Twitter size={14}/>,<Github size={14}/>].map((icon,i)=>(
                  <a key={i} href={i===1?"https://github.com/nullcove/smart-notes-app":"#"} target={i===1?"_blank":undefined} rel={i===1?"noopener noreferrer":undefined}
                    style={{width:34,height:34,borderRadius:8,background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.07)",display:"flex",alignItems:"center",justifyContent:"center",color:"#475569",textDecoration:"none",transition:"all 0.2s"}}
                    onMouseEnter={e=>{(e.currentTarget as HTMLAnchorElement).style.background="rgba(99,102,241,0.12)";(e.currentTarget as HTMLAnchorElement).style.color="#a5b4fc";(e.currentTarget as HTMLAnchorElement).style.transform="translateY(-2px) rotate(5deg)";}}
                    onMouseLeave={e=>{(e.currentTarget as HTMLAnchorElement).style.background="rgba(255,255,255,0.04)";(e.currentTarget as HTMLAnchorElement).style.color="#475569";(e.currentTarget as HTMLAnchorElement).style.transform="none";}}>
                    {icon}
                  </a>
                ))}
              </div>
            </div>
            <div>
              <div style={{fontSize:11,fontWeight:700,color:"#334155",textTransform:"uppercase",letterSpacing:1,marginBottom:16}}>{t.footerProduct}</div>
              {[[lang==="bn"?"ফিচার":"Features","#features"],[lang==="bn"?"তুলনা":"Compare","#compare"],[lang==="bn"?"প্লাগিন":"Plugins","#plugins"],[lang==="bn"?"লিখুন":"Write",APP_LINK],[lang==="bn"?"সাইন ইন":"Sign In",AUTH_LINK]].map(([label,href])=>(
                <div key={label} style={{marginBottom:10}}>
                  <a href={href} style={{fontSize:13,color:"#334155",textDecoration:"none",transition:"color 0.15s"}}
                    onMouseEnter={e=>((e.currentTarget as HTMLAnchorElement).style.color="#94a3b8")}
                    onMouseLeave={e=>((e.currentTarget as HTMLAnchorElement).style.color="#334155")}>{label}</a>
                </div>
              ))}
            </div>
            <div>
              <div style={{fontSize:11,fontWeight:700,color:"#334155",textTransform:"uppercase",letterSpacing:1,marginBottom:16}}>{t.footerBuilt}</div>
              {["Next.js 15","TypeScript","Google Gemini","Insforge DB","Express API","Tailwind CSS"].map(tech=>(
                <div key={tech} style={{marginBottom:10,fontSize:13,color:"#334155"}}>{tech}</div>
              ))}
            </div>
            <div>
              <div style={{fontSize:11,fontWeight:700,color:"#334155",textTransform:"uppercase",letterSpacing:1,marginBottom:16}}>{t.footerPrivacy}</div>
              {(lang==="bn"?["বিজ্ঞাপন নেই","ট্র্যাকিং নেই","ডেটা বিক্রি নেই","API কী লোকাল","JWT অথ","ওপেন GitHub"]:["No ads","No tracking","No data selling","API key local only","JWT auth","Open GitHub"]).map(item=>(
                <div key={item} style={{marginBottom:10,fontSize:13,color:"#334155",display:"flex",alignItems:"center",gap:6}}>
                  <CheckCircle size={10} color="#34d399"/>{item}
                </div>
              ))}
            </div>
          </div>
          <div style={{borderTop:"1px solid rgba(255,255,255,0.04)",paddingTop:22,display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:10}}>
            <div style={{fontSize:12,color:"#1e293b"}}>{t.footerCopyright}</div>
            <div style={{display:"flex",gap:20}}>
              <a href="#" style={{fontSize:12,color:"#1e293b",textDecoration:"none"}}>{lang==="bn"?"গোপনীয়তা নীতি":"Privacy Policy"}</a>
              <a href="#" style={{fontSize:12,color:"#1e293b",textDecoration:"none"}}>{lang==="bn"?"শর্তাবলী":"Terms"}</a>
              <Link href={APP_LINK} style={{fontSize:12,color:"#6366f1",textDecoration:"none",fontWeight:600}}>{lang==="bn"?"লিখুন →":"Write →"}</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
