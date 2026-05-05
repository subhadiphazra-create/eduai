"use client";
import React, { useEffect, useRef } from "react";
import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/sections/HeroSection";
import { FeaturesSection, HowItWorksSection, TestimonialsSection, PricingSection, ContactSection, Footer } from "@/components/sections/AllSections";
import { AuthDialog } from "@/components/auth/AuthDialog";

function CustomCursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const mouse = useRef({ x: 0, y: 0 });
  const ringPos = useRef({ x: 0, y: 0 });
  const raf = useRef<number>(0);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY };
      if (dot.current) { dot.current.style.left = `${e.clientX - 4}px`; dot.current.style.top = `${e.clientY - 4}px`; }
    };
    const animate = () => {
      ringPos.current.x += (mouse.current.x - ringPos.current.x) * 0.12;
      ringPos.current.y += (mouse.current.y - ringPos.current.y) * 0.12;
      if (ring.current) { ring.current.style.left = `${ringPos.current.x - 17}px`; ring.current.style.top = `${ringPos.current.y - 17}px`; }
      raf.current = requestAnimationFrame(animate);
    };
    const onEnter = () => { if (ring.current) { ring.current.style.transform = "scale(1.6)"; ring.current.style.borderColor = "rgba(168,85,247,0.7)"; } };
    const onLeave = () => { if (ring.current) { ring.current.style.transform = "scale(1)"; ring.current.style.borderColor = "rgba(168,85,247,0.4)"; } };
    window.addEventListener("mousemove", onMove);
    raf.current = requestAnimationFrame(animate);
    const els = document.querySelectorAll("a, button");
    els.forEach(el => { el.addEventListener("mouseenter", onEnter); el.addEventListener("mouseleave", onLeave); });
    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf.current);
      els.forEach(el => { el.removeEventListener("mouseenter", onEnter); el.removeEventListener("mouseleave", onLeave); });
    };
  }, []);
  return <><div ref={dot} className="cursor-dot"/><div ref={ring} className="cursor-ring"/></>;
}

function StatsBar() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const init = async () => {
      const { gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);
      if (ref.current) gsap.fromTo(Array.from(ref.current.children), { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: "power2.out", stagger: 0.1, scrollTrigger: { trigger: ref.current, start: "top 90%" } });
    };
    init();
  }, []);
  return (
    <div className="relative py-16 overflow-hidden" style={{ borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}>
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        <div ref={ref} className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
          {[{ v: "50,000+", l: "Active learners", c: "var(--cyan)" }, { v: "2.4M+", l: "Documents analyzed", c: "var(--purple)" }, { v: "98.7%", l: "Satisfaction rate", c: "var(--pink)" }, { v: "< 200ms", l: "API response time", c: "var(--emerald)" }].map(s => (
            <div key={s.l} style={{ opacity: 0 }}>
              <div className="text-4xl font-extrabold font-display mb-1" style={{ color: s.c }}>{s.v}</div>
              <div className="text-sm" style={{ color: "var(--text3)" }}>{s.l}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function CTABanner() {
  const ref = useRef<HTMLDivElement>(null);
  const [authOpen, setAuthOpen] = React.useState(false);
  useEffect(() => {
    const init = async () => {
      const { gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);
      gsap.fromTo(ref.current, { y: 60, opacity: 0, scale: 0.97 }, { y: 0, opacity: 1, scale: 1, duration: 1, ease: "power3.out", scrollTrigger: { trigger: ref.current, start: "top 85%" } });
    };
    init();
  }, []);
  return (
    <>
      <section className="relative py-32 overflow-hidden">
        <div ref={ref} className="max-w-4xl mx-auto px-6 lg:px-8" style={{ opacity: 0 }}>
          <div className="relative rounded-3xl p-16 text-center overflow-hidden glass" style={{ border: "1px solid rgba(168,85,247,0.2)", boxShadow: "0 40px 100px rgba(0,0,0,0.2)" }}>
            <div className="absolute inset-0 opacity-25" style={{ background: "radial-gradient(ellipse 80% 60% at 50% 50%, rgba(168,85,247,0.2), transparent)" }}/>
            <div className="absolute top-0 left-0 right-0 h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(0,212,255,0.5), rgba(168,85,247,0.5), transparent)" }}/>
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8 text-xs font-medium" style={{ background: "rgba(168,85,247,0.1)", border: "1px solid rgba(168,85,247,0.22)", color: "var(--purple)" }}>🚀 Join 50,000+ learners already on edu.ai</div>
              <h2 className="font-display text-5xl lg:text-6xl font-extrabold mb-6" style={{ color: "var(--text)" }}>
                Ready to transform<br/><span className="grad-text">how you learn?</span>
              </h2>
              <p className="text-lg mb-10 max-w-xl mx-auto" style={{ color: "var(--text2)" }}>Start free. No credit card required. Your first 50 AI queries are on us.</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button onClick={() => setAuthOpen(true)} className="px-8 py-4 rounded-2xl text-base font-semibold text-white btn-grad transition-all hover:scale-105" style={{ boxShadow: "0 0 40px rgba(168,85,247,0.4)" }}>Start Learning for Free →</button>
                <button className="px-8 py-4 rounded-2xl text-base font-medium transition-all hover:scale-105" style={{ border: "1px solid var(--border)", color: "var(--text2)" }}>Schedule a Demo</button>
              </div>
            </div>
          </div>
        </div>
      </section>
      <AuthDialog open={authOpen} onOpenChange={setAuthOpen} defaultTab="signup"/>
    </>
  );
}

export default function HomePage() {
  return (
    <>
      <CustomCursor/>
      <Navbar/>
      <main>
        <HeroSection/>
        <StatsBar/>
        <FeaturesSection/>
        <HowItWorksSection/>
        <TestimonialsSection/>
        <PricingSection/>
        <CTABanner/>
        <ContactSection/>
      </main>
      <Footer/>
    </>
  );
}
