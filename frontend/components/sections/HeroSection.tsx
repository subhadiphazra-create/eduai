"use client";
import React, { useEffect, useRef, useState } from "react";
import { ArrowRight, Play, Sparkles, BookOpen, Brain, Target } from "lucide-react";
import { AuthDialog } from "@/components/auth/AuthDialog";

export function HeroSection() {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const orb1 = useRef<HTMLDivElement>(null); const orb2 = useRef<HTMLDivElement>(null); const orb3 = useRef<HTMLDivElement>(null);
  const [authOpen, setAuthOpen] = useState(false);

  useEffect(() => {
    const init = async () => {
      const { gsap } = await import("gsap");
      const tl = gsap.timeline({ delay: 0.1 });
      tl.fromTo([orb1.current,orb2.current,orb3.current], { scale:0, opacity:0 }, { scale:1, opacity:1, duration:1.5, ease:"power3.out", stagger:0.2 })
        .fromTo(badgeRef.current, { y:-30, opacity:0, scale:0.8 }, { y:0, opacity:1, scale:1, duration:0.7, ease:"back.out(1.7)" }, "-=1.2")
        .fromTo(titleRef.current?.querySelectorAll(".word") ?? [], { y:80, opacity:0, rotationX:-40 }, { y:0, opacity:1, rotationX:0, duration:0.8, ease:"power3.out", stagger:0.09 }, "-=0.5")
        .fromTo(subRef.current, { y:30, opacity:0 }, { y:0, opacity:1, duration:0.7, ease:"power2.out" }, "-=0.4")
        .fromTo(ctaRef.current?.children ?? [], { y:20, opacity:0, scale:0.95 }, { y:0, opacity:1, scale:1, duration:0.6, ease:"back.out(1.4)", stagger:0.1 }, "-=0.3")
        .fromTo(statsRef.current?.children ?? [], { y:20, opacity:0 }, { y:0, opacity:1, duration:0.5, ease:"power2.out", stagger:0.08 }, "-=0.2")
        .fromTo(cardRef.current, { x:70, opacity:0, rotationY:15 }, { x:0, opacity:1, rotationY:0, duration:1, ease:"power3.out" }, "-=0.8");
      gsap.to(orb1.current, { y:-25, x:15, duration:8, ease:"sine.inOut", yoyo:true, repeat:-1 });
      gsap.to(orb2.current, { y:20, x:-12, duration:10, ease:"sine.inOut", yoyo:true, repeat:-1, delay:1 });
      gsap.to(orb3.current, { y:-18, duration:7, ease:"sine.inOut", yoyo:true, repeat:-1, delay:2 });
    };
    init();
  }, []);

  const words = ["Learn","Smarter,","Achieve","More."];
  const accentIdx = [0,2];

  return (
    <>
      <section className="relative min-h-screen flex items-center overflow-hidden" style={{ paddingTop:80 }}>
        <div ref={orb1} className="orb opacity-0" style={{ width:550, height:550, top:"-8%", right:"-8%", background:"radial-gradient(circle,#a855f7,#6366f1,transparent)", opacity:0.14 }}/>
        <div ref={orb2} className="orb opacity-0" style={{ width:450, height:450, bottom:"-8%", left:"-4%", background:"radial-gradient(circle,#00d4ff,#0ea5e9,transparent)", opacity:0.12 }}/>
        <div ref={orb3} className="orb opacity-0" style={{ width:280, height:280, top:"40%", left:"38%", background:"radial-gradient(circle,#ec4899,transparent)", opacity:0.08 }}/>
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage:"linear-gradient(rgba(168,85,247,0.4) 1px,transparent 1px),linear-gradient(90deg,rgba(168,85,247,0.4) 1px,transparent 1px)", backgroundSize:"60px 60px" }}/>

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 w-full py-20">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div ref={badgeRef} className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8 text-xs font-medium" style={{ background:"rgba(168,85,247,0.1)", border:"1px solid rgba(168,85,247,0.22)", color:"var(--text2)", opacity:0 }}>
                <div className="relative w-2 h-2"><div className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-75"/><div className="w-2 h-2 rounded-full bg-emerald-400"/></div>
                <Sparkles size={12} className="text-purple-400"/> Powered by GPT-4o & Claude
              </div>

              <h1 ref={titleRef} className="font-display text-6xl lg:text-7xl xl:text-8xl font-extrabold leading-[0.95] tracking-tight mb-6" style={{ perspective:"1000px" }}>
                {words.map((w,i) => (
                  <React.Fragment key={i}>
                    <span className="word inline-block" style={{ display:"inline-block", opacity:0,
                      background: accentIdx.includes(i) ? "linear-gradient(135deg,var(--cyan),var(--purple))" : "none",
                      WebkitBackgroundClip: accentIdx.includes(i) ? "text" : "unset",
                      WebkitTextFillColor: accentIdx.includes(i) ? "transparent" : "var(--text)",
                      backgroundClip: accentIdx.includes(i) ? "text" : "unset" }}>
                      {w}
                    </span>{i<words.length-1?" ":""}
                  </React.Fragment>
                ))}
              </h1>

              <p ref={subRef} className="text-lg lg:text-xl leading-relaxed mb-10 max-w-xl" style={{ color:"var(--text2)", opacity:0 }}>
                Upload documents, generate AI-powered quizzes, ace mock interviews, and manage your learning — all in one beautifully designed platform.
              </p>

              <div ref={ctaRef} className="flex flex-wrap gap-4 mb-14">
                <button onClick={() => setAuthOpen(true)} className="group flex items-center gap-3 px-7 py-4 rounded-2xl text-base font-semibold text-white btn-grad transition-all hover:scale-105"
                  style={{ boxShadow:"0 0 40px rgba(168,85,247,0.45)", opacity:0 }}>
                  Start Learning Free <ArrowRight size={18} className="transition-transform group-hover:translate-x-1"/>
                </button>
                <button className="group flex items-center gap-3 px-7 py-4 rounded-2xl text-base font-medium transition-all hover:scale-105"
                  style={{ border:"1px solid var(--border)", color:"var(--text2)", background:"rgba(128,128,200,0.04)", opacity:0 }}>
                  <div className="w-8 h-8 rounded-full btn-grad flex items-center justify-center"><Play size={12} fill="white"/></div>
                  Watch Demo
                </button>
              </div>

              <div ref={statsRef} className="flex flex-wrap gap-8">
                {[{v:"50K+",l:"Active Learners",c:"var(--cyan)"},{v:"98%",l:"Success Rate",c:"var(--purple)"},{v:"4.9★",l:"Rating",c:"var(--pink)"},{v:"200+",l:"Universities",c:"var(--emerald)"}].map(s => (
                  <div key={s.l} style={{ opacity:0 }}>
                    <div className="text-2xl font-extrabold font-display" style={{ color:s.c }}>{s.v}</div>
                    <div className="text-xs mt-0.5" style={{ color:"var(--text3)" }}>{s.l}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Dashboard preview card */}
            <div ref={cardRef} className="relative hidden lg:block" style={{ opacity:0 }}>
              <div className="rounded-3xl overflow-hidden glass" style={{ boxShadow:"0 40px 100px rgba(0,0,0,0.4), 0 0 60px rgba(168,85,247,0.08)", transform:"perspective(1000px) rotateY(-5deg) rotateX(3deg)" }}>
                <div className="flex items-center gap-2 px-5 py-4" style={{ borderBottom:"1px solid var(--border)" }}>
                  <div className="w-3 h-3 rounded-full bg-red-500/70"/> <div className="w-3 h-3 rounded-full bg-yellow-500/70"/> <div className="w-3 h-3 rounded-full bg-green-500/70"/>
                  <div className="flex-1 mx-4 h-6 rounded-md flex items-center justify-center text-xs font-mono" style={{ background:"rgba(128,128,200,0.06)", color:"var(--text3)" }}>app.edu.ai/dashboard</div>
                </div>
                <div className="p-5">
                  <div className="grid grid-cols-3 gap-3 mb-4">
                    {[{icon:BookOpen,l:"Documents",v:"24",c:"var(--cyan)"},{icon:Brain,l:"AI Sessions",v:"142",c:"var(--purple)"},{icon:Target,l:"Mock Tests",v:"18",c:"var(--pink)"}].map(item => (
                      <div key={item.l} className="rounded-2xl p-3 text-center" style={{ background:`color-mix(in srgb, ${item.c} 8%, transparent)`, border:`1px solid color-mix(in srgb, ${item.c} 18%, transparent)` }}>
                        <item.icon size={20} style={{ color:item.c, margin:"0 auto 4px" }}/>
                        <div className="text-lg font-bold font-display" style={{ color:"var(--text)" }}>{item.v}</div>
                        <div className="text-xs" style={{ color:"var(--text3)" }}>{item.l}</div>
                      </div>
                    ))}
                  </div>
                  <div className="rounded-2xl p-4 mb-3" style={{ background:"rgba(128,128,200,0.04)", border:"1px solid var(--border)" }}>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-6 h-6 rounded-lg btn-grad flex items-center justify-center text-xs font-bold text-white">e</div>
                      <span className="text-xs font-medium" style={{ color:"var(--text2)" }}>AI Tutor</span>
                      <div className="flex gap-0.5 ml-auto">{[0,1,2].map(i=><div key={i} className="w-1.5 h-1.5 rounded-full" style={{ background:"var(--cyan)", animation:`bounce 1.2s ease-in-out ${i*0.2}s infinite` }}/>)}</div>
                    </div>
                    <p className="text-xs leading-relaxed" style={{ color:"var(--text3)" }}>Analyzed your ML PDF. 3 key concepts to review based on quiz performance...</p>
                  </div>
                  <div className="rounded-2xl p-4" style={{ background:"rgba(128,128,200,0.04)", border:"1px solid var(--border)" }}>
                    <div className="flex justify-between mb-2"><span className="text-xs font-medium" style={{ color:"var(--text)" }}>Weekly Goal</span><span className="text-xs" style={{ color:"var(--cyan)" }}>73%</span></div>
                    <div className="prog-bar"><div className="prog-fill" style={{ width:"73%" }}/></div>
                  </div>
                </div>
              </div>
              <div className="absolute -top-4 -right-4 px-4 py-2 rounded-2xl flex items-center gap-2 text-xs font-medium text-white glass animate-float" style={{ border:"1px solid rgba(16,185,129,0.3)", boxShadow:"0 8px 32px rgba(16,185,129,0.2)" }}>🏆 Streak: 28 days</div>
              <div className="absolute -bottom-4 -left-4 px-4 py-3 rounded-2xl glass animate-float" style={{ animationDelay:"1s", border:"1px solid rgba(168,85,247,0.25)", boxShadow:"0 8px 32px rgba(168,85,247,0.15)" }}>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl btn-grad flex items-center justify-center"><Target size={14} className="text-white"/></div>
                  <div><div className="text-xs font-bold" style={{ color:"var(--text)" }}>Interview Score</div><div className="text-lg font-extrabold font-display" style={{ color:"var(--cyan)" }}>92/100</div></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <style>{`@keyframes bounce{0%,100%{transform:translateY(0)}50%{transform:translateY(-4px)}}`}</style>
      </section>
      <AuthDialog open={authOpen} onOpenChange={setAuthOpen} defaultTab="signup"/>
    </>
  );
}
