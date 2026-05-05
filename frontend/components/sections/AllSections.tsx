"use client";
import React, { useEffect, useRef, useState } from "react";
import { FileText, Brain, Target, Zap, Search, BarChart3, Upload, Cpu, Trophy, Star, Quote, CheckCircle, Send, Mail, MessageCircle, MapPin, Twitter, Github, Linkedin, ArrowRight } from "lucide-react";
import { AuthDialog } from "@/components/auth/AuthDialog";

/* ============ SCROLL ANIMATION HOOK ============ */
function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const init = async () => {
      const { gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);
      if (!ref.current) return;
      gsap.fromTo(ref.current.querySelectorAll(".reveal"),
        { y:50, opacity:0, scale:0.97 },
        { y:0, opacity:1, scale:1, duration:0.75, ease:"power3.out", stagger:0.1,
          scrollTrigger:{ trigger:ref.current, start:"top 82%" } }
      );
    };
    init();
  }, []);
  return ref;
}

/* ============ SECTION LABEL ============ */
function Label({ color, children }: { color: string; children: React.ReactNode }) {
  return (
    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 text-xs font-medium"
      style={{ background:`color-mix(in srgb, ${color} 10%, transparent)`, border:`1px solid color-mix(in srgb, ${color} 22%, transparent)`, color }}>
      {children}
    </div>
  );
}

/* ============ FEATURES ============ */
const feats = [
  { icon:FileText, title:"AI Document Analysis", desc:"Upload PDFs & DOCX. AI reads, summarizes, and answers questions via RAG technology.", color:"var(--cyan)", badge:"RAG" },
  { icon:Brain, title:"Smart Quiz Generator", desc:"Auto-generate MCQs, flashcards, and concept maps from any document using GPT-4o.", color:"var(--purple)", badge:"GPT-4o" },
  { icon:Target, title:"Mock Interview Engine", desc:"Role-specific simulations with real-time AI scoring on accuracy, clarity, and approach.", color:"var(--pink)", badge:"AI Feedback" },
  { icon:Zap, title:"Smart Task Management", desc:"Kanban boards with AI priority scoring, deadline prediction, and smart reminders.", color:"#f59e0b", badge:"Priority AI" },
  { icon:Search, title:"Full-Text Search", desc:"Elasticsearch-powered search across all notes, documents, and tasks. Results in <100ms.", color:"var(--emerald)", badge:"<100ms" },
  { icon:BarChart3, title:"Progress Analytics", desc:"Visual dashboards, streak tracking, and AI-generated skill gap analysis.", color:"#6366f1", badge:"Insights" },
];
export function FeaturesSection() {
  const ref = useReveal();
  return (
    <section id="features" ref={ref} className="relative py-32 overflow-hidden">
      <div className="absolute inset-0 opacity-20" style={{ background:"radial-gradient(ellipse 80% 50% at 50% 50%, rgba(168,85,247,0.07), transparent)" }}/>
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-20 reveal">
          <Label color="var(--purple)"><Zap size={12}/>Everything you need</Label>
          <h2 className="font-display text-5xl lg:text-6xl font-bold mb-5" style={{ color:"var(--text)" }}>Features built for <span className="grad-text">serious learners</span></h2>
          <p className="text-xl max-w-2xl mx-auto" style={{ color:"var(--text2)" }}>Every feature is meticulously crafted to maximize your learning efficiency.</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {feats.map(f => (
            <div key={f.title} className="feat-card reveal group relative rounded-3xl p-7 glass cursor-default">
              <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background:`color-mix(in srgb, ${f.color} 5%, transparent)` }}/>
              <div className="absolute top-5 right-5 px-2.5 py-1 rounded-full text-xs font-medium" style={{ background:`color-mix(in srgb, ${f.color} 12%, transparent)`, color:f.color, border:`1px solid color-mix(in srgb, ${f.color} 22%, transparent)` }}>{f.badge}</div>
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5 transition-transform group-hover:scale-110" style={{ background:`color-mix(in srgb, ${f.color} 12%, transparent)`, border:`1px solid color-mix(in srgb, ${f.color} 22%, transparent)` }}>
                <f.icon size={22} style={{ color:f.color }}/>
              </div>
              <h3 className="font-display text-xl font-bold mb-3" style={{ color:"var(--text)" }}>{f.title}</h3>
              <p className="text-sm leading-relaxed" style={{ color:"var(--text2)" }}>{f.desc}</p>
            </div>
          ))}
        </div>
        <div className="mt-20 overflow-hidden relative">
          <div className="absolute left-0 inset-y-0 w-24 z-10" style={{ background:"linear-gradient(90deg, var(--bg), transparent)" }}/>
          <div className="absolute right-0 inset-y-0 w-24 z-10" style={{ background:"linear-gradient(-90deg, var(--bg), transparent)" }}/>
          <div className="flex marquee-l">
            {Array(2).fill(null).flatMap((_,si) => ["GPT-4o","RAG Technology","pgvector","Elasticsearch","Redis","BullMQ","JWT Auth","OAuth 2.0","WebSockets","AWS S3","Kubernetes","PostgreSQL 16"].map(t => (
              <div key={`${si}-${t}`} className="flex items-center gap-2 px-6 py-3 mx-3 rounded-full whitespace-nowrap flex-shrink-0" style={{ background:"rgba(128,128,200,0.06)", border:"1px solid var(--border)", color:"var(--text3)", fontSize:"13px", fontFamily:"'JetBrains Mono', monospace" }}>
                <div className="w-1.5 h-1.5 rounded-full" style={{ background:"var(--cyan)" }}/>{t}
              </div>
            )))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============ HOW IT WORKS ============ */
const steps = [
  { n:"01", icon:Upload, title:"Upload Materials", desc:"Drop PDFs, DOCX, or TXT. System extracts text, chunks intelligently, and builds vector embeddings in under 2 min.", highlight:"Up to 50MB files", color:"var(--cyan)" },
  { n:"02", icon:Cpu, title:"AI Processes & Learns", desc:"GPT-4o and Claude analyze content, generate summaries, flashcards, quizzes, and concept maps. Ask any question.", highlight:"RAG-powered Q&A", color:"var(--purple)" },
  { n:"03", icon:BarChart3, title:"Track & Optimize", desc:"Analytics track progress, identify weak areas, and adapt your study plan. Spaced repetition ensures long-term retention.", highlight:"SM-2 algorithm", color:"var(--pink)" },
  { n:"04", icon:Trophy, title:"Ace Interviews & Exams", desc:"Mock interview sessions tailored to your target role. AI evaluates answers, gives feedback, and prepares you to perform.", highlight:"Real-time AI scoring", color:"var(--emerald)" },
];
export function HowItWorksSection() {
  const ref = useReveal();
  return (
    <section id="how-it-works" ref={ref} className="relative py-32 overflow-hidden section-alt">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-24 reveal">
          <Label color="var(--cyan)">Simple 4-step process</Label>
          <h2 className="font-display text-5xl lg:text-6xl font-bold mb-5" style={{ color:"var(--text)" }}>How <span className="grad-text">edu.ai</span> works</h2>
        </div>
        <div className="space-y-16">
          {steps.map((s,i) => (
            <div key={s.n} className={`flex flex-col lg:flex-row items-center gap-12 reveal ${i%2===1?"lg:flex-row-reverse":""}`}>
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-4">
                  <span className="font-display text-6xl font-extrabold" style={{ color:s.color, opacity:0.12 }}>{s.n}</span>
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background:`color-mix(in srgb, ${s.color} 12%, transparent)`, border:`1px solid color-mix(in srgb, ${s.color} 22%, transparent)` }}><s.icon size={22} style={{ color:s.color }}/></div>
                </div>
                <h3 className="font-display text-3xl font-bold mb-3" style={{ color:"var(--text)" }}>{s.title}</h3>
                <p className="text-lg leading-relaxed mb-4" style={{ color:"var(--text2)" }}>{s.desc}</p>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium" style={{ background:`color-mix(in srgb, ${s.color} 8%, transparent)`, border:`1px solid color-mix(in srgb, ${s.color} 18%, transparent)`, color:s.color }}>✦ {s.highlight}</div>
              </div>
              <div className="flex-1 w-full max-w-sm">
                <div className="glass rounded-3xl p-8 text-center" style={{ border:`1px solid color-mix(in srgb, ${s.color} 18%, transparent)`, boxShadow:`0 20px 60px rgba(0,0,0,0.15), 0 0 40px color-mix(in srgb, ${s.color} 8%, transparent)` }}>
                  <div className="w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-4" style={{ background:`color-mix(in srgb, ${s.color} 12%, transparent)`, border:`1px solid color-mix(in srgb, ${s.color} 22%, transparent)` }}><s.icon size={40} style={{ color:s.color }}/></div>
                  <h4 className="font-display text-lg font-bold mb-4" style={{ color:"var(--text)" }}>{s.title}</h4>
                  <div className="space-y-2">{[85,72,91].map((p,j)=>(
                    <div key={j} className="flex items-center gap-3">
                      <div className="w-10 text-right text-xs font-mono" style={{ color:"var(--text3)" }}>{p}%</div>
                      <div className="flex-1 prog-bar"><div className="prog-fill" style={{ width:`${p}%` }}/></div>
                    </div>
                  ))}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============ TESTIMONIALS ============ */
const testis = [
  { name:"Aisha Patel", role:"CS Student, IIT Delhi", init:"AP", rating:5, text:"Went from struggling with DSA to landing 2 FAANG internships. The mock interview feedback was brutally detailed and pinpointed exactly my weak spots.", grad:"from-cyan-500 to-blue-600", color:"var(--cyan)" },
  { name:"Marcus Chen", role:"Product Manager, Singapore", init:"MC", rating:5, text:"I upload research papers and have full AI conversations about the content. My comprehension and retention has literally doubled since using edu.ai.", grad:"from-purple-500 to-pink-600", color:"var(--purple)" },
  { name:"Sofia Rodriguez", role:"Medical Student, Barcelona", init:"SR", rating:5, text:"Spaced repetition from my lecture notes is a game changer. Studying 30% less time and retaining so much more. The streak system keeps me motivated.", grad:"from-emerald-500 to-teal-600", color:"var(--emerald)" },
  { name:"James Okoye", role:"Software Engineer, Lagos", init:"JO", rating:5, text:"Used edu.ai for system design interview prep. AI asked follow-up questions just like real interviewers. Got the job at my target company.", grad:"from-amber-500 to-orange-600", color:"#f59e0b" },
  { name:"Yuki Tanaka", role:"Data Scientist, Tokyo", init:"YT", rating:5, text:"The concept maps it generates are incredible. I can visually see how ML concepts relate. Like having a tutor who understands my exact curriculum.", grad:"from-pink-500 to-rose-600", color:"var(--pink)" },
  { name:"Priya Sharma", role:"UX Designer, Mumbai", init:"PS", rating:5, text:"Managing portfolio projects alongside learning new skills was chaotic until edu.ai. AI task prioritization understands my deadlines perfectly.", grad:"from-indigo-500 to-violet-600", color:"#6366f1" },
];
function TestiCard({ t }: { t: typeof testis[0] }) {
  return (
    <div className="testi-card flex-shrink-0 w-80 p-6">
      <div className="flex items-start gap-3 mb-4">
        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-white text-xs font-bold bg-gradient-to-br ${t.grad}`}>{t.init}</div>
        <div><div className="text-sm font-semibold" style={{ color:"var(--text)" }}>{t.name}</div><div className="text-xs" style={{ color:"var(--text3)" }}>{t.role}</div></div>
        <div className="ml-auto flex gap-0.5">{Array(t.rating).fill(0).map((_,i)=><Star key={i} size={11} fill={t.color} style={{ color:t.color }}/>)}</div>
      </div>
      <Quote size={14} className="mb-2 opacity-30" style={{ color:t.color }}/>
      <p className="text-sm leading-relaxed" style={{ color:"var(--text2)" }}>{t.text}</p>
    </div>
  );
}
export function TestimonialsSection() {
  const ref = useReveal();
  return (
    <section id="testimonials" ref={ref} className="relative py-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 mb-16">
        <div className="text-center reveal">
          <Label color="var(--pink)"><Star size={12} fill="currentColor"/>Loved by 50,000+ learners</Label>
          <h2 className="font-display text-5xl lg:text-6xl font-bold mb-5" style={{ color:"var(--text)" }}>Real results from <span className="grad-text">real learners</span></h2>
        </div>
      </div>
      <div className="overflow-hidden relative mb-6">
        <div className="absolute left-0 inset-y-0 w-24 z-10" style={{ background:"linear-gradient(90deg, var(--bg), transparent)" }}/>
        <div className="absolute right-0 inset-y-0 w-24 z-10" style={{ background:"linear-gradient(-90deg, var(--bg), transparent)" }}/>
        <div className="flex gap-6 marquee-l">{[...testis,...testis].map((t,i)=><TestiCard key={`a${i}`} t={t}/>)}</div>
      </div>
      <div className="overflow-hidden relative">
        <div className="absolute left-0 inset-y-0 w-24 z-10" style={{ background:"linear-gradient(90deg, var(--bg), transparent)" }}/>
        <div className="absolute right-0 inset-y-0 w-24 z-10" style={{ background:"linear-gradient(-90deg, var(--bg), transparent)" }}/>
        <div className="flex gap-6 marquee-r">{[...testis,...testis].reverse().map((t,i)=><TestiCard key={`b${i}`} t={t}/>)}</div>
      </div>
    </section>
  );
}

/* ============ PRICING ============ */
const plans = [
  { name:"Free", price:"0", per:"forever", desc:"Perfect for getting started", color:"var(--emerald)", feats:["3 document uploads/month","50 AI queries/month","Basic quiz generation","5 mock interview sessions","Task management (3 projects)","Community support"], cta:"Get Started Free", pop:false },
  { name:"Pro", price:"19", per:"/month", desc:"For serious learners", color:"var(--purple)", feats:["Unlimited document uploads","Unlimited AI queries","Advanced quiz & flashcard AI","Unlimited mock interviews","Unlimited projects & tasks","Progress analytics & insights","Smart study plan generation","Priority support"], cta:"Start Pro Trial", pop:true },
  { name:"Team", price:"49", per:"/month", desc:"For study groups & orgs", color:"var(--cyan)", feats:["Everything in Pro","Up to 10 team members","Shared document library","Team progress dashboards","Collaborative study sessions","Admin controls","API access","Dedicated support"], cta:"Start Team Trial", pop:false },
];
export function PricingSection() {
  const [authOpen, setAuthOpen] = useState(false);
  const ref = useReveal();
  return (
    <>
      <section id="pricing" ref={ref} className="relative py-32 section-alt overflow-hidden">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-20 reveal">
            <Label color="var(--purple)">Transparent pricing</Label>
            <h2 className="font-display text-5xl lg:text-6xl font-bold mb-5" style={{ color:"var(--text)" }}>Invest in your <span className="grad-text">future</span></h2>
            <p className="text-xl" style={{ color:"var(--text2)" }}>Start free. Upgrade when ready. Cancel anytime.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 items-stretch">
            {plans.map(p => (
              <div key={p.name} className="relative reveal">
                {p.pop && <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10 px-4 py-1.5 rounded-full text-xs font-bold text-white" style={{ background:"linear-gradient(135deg,var(--cyan),var(--purple))", boxShadow:"0 0 20px rgba(168,85,247,0.5)" }}>Most Popular</div>}
                <div className={`h-full flex flex-col glass rounded-3xl p-8 ${p.pop?"animated-border relative":""}`} style={{ border:p.pop?"none":`1px solid var(--border)`, boxShadow:p.pop?"0 0 60px rgba(168,85,247,0.12)":"none" }}>
                  <div className="mb-6">
                    <div className="text-sm font-semibold mb-1" style={{ color:p.color }}>{p.name}</div>
                    <div className="flex items-baseline gap-1"><span className="text-4xl font-extrabold font-display" style={{ color:"var(--text)" }}>${p.price}</span><span className="text-sm" style={{ color:"var(--text3)" }}>{p.per}</span></div>
                    <p className="text-sm mt-2" style={{ color:"var(--text3)" }}>{p.desc}</p>
                  </div>
                  <div className="space-y-3 mb-8 flex-1">
                    {p.feats.map(f => <div key={f} className="flex items-center gap-3 text-sm"><CheckCircle size={14} style={{ color:p.color, flexShrink:0 }}/><span style={{ color:"var(--text2)" }}>{f}</span></div>)}
                  </div>
                  <button onClick={() => setAuthOpen(true)} className={`w-full py-3 rounded-2xl text-sm font-semibold flex items-center justify-center gap-2 transition-all hover:scale-[1.03] ${p.pop?"btn-grad text-white":""}`}
                    style={{ color:p.pop?"white":p.color, background:p.pop?undefined:`color-mix(in srgb, ${p.color} 10%, transparent)`, border:p.pop?"none":`1px solid color-mix(in srgb, ${p.color} 22%, transparent)` }}>
                    {p.cta} <ArrowRight size={14}/>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <AuthDialog open={authOpen} onOpenChange={setAuthOpen} defaultTab="signup"/>
    </>
  );
}

/* ============ CONTACT ============ */
export function ContactSection() {
  const ref = useReveal();
  const [form, setForm] = useState({ name:"", email:"", msg:"" });
  const [sent, setSent] = useState(false); const [sending, setSending] = useState(false);
  const submit = (e: React.FormEvent) => {
    e.preventDefault(); setSending(true);
    setTimeout(() => { setSending(false); setSent(true); setForm({ name:"", email:"", msg:"" }); setTimeout(()=>setSent(false),4000); }, 1500);
  };
  return (
    <section id="contact" ref={ref} className="relative py-32 overflow-hidden">
      <div className="max-w-5xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16 reveal">
          <Label color="var(--purple)"><MessageCircle size={12}/>Let's talk</Label>
          <h2 className="font-display text-5xl font-bold mb-4" style={{ color:"var(--text)" }}>Get in <span className="grad-text">touch</span></h2>
          <p className="text-lg" style={{ color:"var(--text2)" }}>Questions, feedback, or partnerships? We reply within 24 hours.</p>
        </div>
        <div className="grid lg:grid-cols-5 gap-12 reveal">
          <div className="lg:col-span-2 space-y-5">
            {[{icon:Mail, l:"Email", v:"hello@edu.ai", c:"var(--cyan)"},{icon:MessageCircle, l:"Discord", v:"discord.gg/eduai", c:"var(--purple)"},{icon:MapPin, l:"Based in", v:"Global — Remote First", c:"var(--pink)"}].map(i=>(
              <div key={i.l} className="flex items-center gap-4 p-4 rounded-2xl glass">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background:`color-mix(in srgb, ${i.c} 10%, transparent)`, border:`1px solid color-mix(in srgb, ${i.c} 20%, transparent)` }}><i.icon size={18} style={{ color:i.c }}/></div>
                <div><div className="text-xs" style={{ color:"var(--text3)" }}>{i.l}</div><div className="text-sm font-medium" style={{ color:"var(--text)" }}>{i.v}</div></div>
              </div>
            ))}
          </div>
          <form onSubmit={submit} className="lg:col-span-3 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <input type="text" placeholder="Your name" value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} className="edu-input" required/>
              <input type="email" placeholder="Email" value={form.email} onChange={e=>setForm(f=>({...f,email:e.target.value}))} className="edu-input" required/>
            </div>
            <textarea placeholder="Your message..." value={form.msg} onChange={e=>setForm(f=>({...f,msg:e.target.value}))} className="edu-input" rows={5} style={{ resize:"none" }} required/>
            <button type="submit" disabled={sending||sent} className="w-full py-3.5 rounded-2xl text-sm font-semibold text-white btn-grad flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
              style={{ background:sent?"rgba(16,185,129,0.7)":undefined, opacity:sending?0.8:1 }}>
              {sending?<div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full spin"/>:sent?<><CheckCircle size={16}/>Sent!</>:<><Send size={16}/>Send Message</>}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

/* ============ FOOTER ============ */
const footLinks = { Product:["Features","Pricing","How It Works","Changelog"], Company:["About","Blog","Careers","Contact"], Resources:["Docs","API Reference","Community","Status"], Legal:["Privacy","Terms","Cookie Policy","Security"] };
export function Footer() {
  return (
    <footer className="relative pt-20 pb-10 overflow-hidden" style={{ borderTop:"1px solid var(--border)" }}>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-px" style={{ background:"linear-gradient(90deg, transparent, rgba(168,85,247,0.5), transparent)" }}/>
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-12 mb-16">
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-4"><div className="w-9 h-9 rounded-xl btn-grad flex items-center justify-center text-white font-bold">e</div><span className="font-display font-bold text-xl" style={{ color:"var(--text)" }}>edu.ai</span></div>
            <p className="text-sm leading-relaxed mb-6 max-w-[220px]" style={{ color:"var(--text3)" }}>AI-powered learning for the next generation. Learn smarter. Achieve more.</p>
            <div className="flex gap-3">
              {[Twitter, Github, Linkedin].map((Icon,i)=>(
                <a key={i} href="#" className="w-9 h-9 rounded-xl flex items-center justify-center transition-all hover:scale-110" style={{ background:"rgba(128,128,200,0.06)", border:"1px solid var(--border)", color:"var(--text3)" }}><Icon size={15}/></a>
              ))}
            </div>
          </div>
          {Object.entries(footLinks).map(([cat, ls])=>(
            <div key={cat}>
              <h4 className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color:"var(--text3)" }}>{cat}</h4>
              <ul className="space-y-2.5">{ls.map(l=><li key={l}><a href="#" className="text-sm transition-colors hover:text-purple-400" style={{ color:"var(--text3)" }}>{l}</a></li>)}</ul>
            </div>
          ))}
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8" style={{ borderTop:"1px solid var(--border)" }}>
          <p className="text-xs" style={{ color:"var(--text3)" }}>© 2025 edu.ai. All rights reserved. Built with ❤️ for learners worldwide.</p>
          <div className="flex items-center gap-2 text-xs font-mono" style={{ color:"var(--text3)" }}><div className="w-1.5 h-1.5 rounded-full bg-emerald-400"/>All systems operational</div>
        </div>
      </div>
    </footer>
  );
}
