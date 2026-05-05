"use client";
import React, { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun, Menu, X } from "lucide-react";
import { AuthDialog } from "./auth/AuthDialog";

export function Navbar() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mob, setMob] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [authTab, setAuthTab] = useState<"login"|"signup">("login");

  useEffect(() => {
    setMounted(true);
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const openAuth = (tab: "login"|"signup") => { setAuthTab(tab); setAuthOpen(true); setMob(false); };
  const isDark = !mounted || theme === "dark";
  const links = [{ l:"Features", h:"#features" }, { l:"How It Works", h:"#how-it-works" }, { l:"Pricing", h:"#pricing" }, { l:"Testimonials", h:"#testimonials" }, { l:"Contact", h:"#contact" }];

  const navBg = scrolled ? isDark ? "rgba(5,5,32,0.92)" : "rgba(255,255,255,0.94)" : "transparent";
  const navBorder = scrolled ? isDark ? "1px solid rgba(168,85,247,0.1)" : "1px solid rgba(124,58,237,0.08)" : "1px solid transparent";

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-40 transition-all duration-500" style={{ background:navBg, backdropFilter:scrolled?"blur(24px)":"none", borderBottom:navBorder }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <a href="#" className="flex items-center gap-2 group">
              <div className="w-9 h-9 rounded-xl btn-grad flex items-center justify-center text-white font-bold text-lg transition-transform group-hover:scale-110">e</div>
              <span className="font-display font-bold text-xl" style={{ color:"var(--text)" }}>edu.ai</span>
            </a>

            <div className="hidden lg:flex items-center gap-8">
              {links.map(l => <a key={l.l} href={l.h} className="nav-link text-sm font-medium" style={{ color:"var(--text2)" }}>{l.l}</a>)}
            </div>

            <div className="hidden lg:flex items-center gap-3">
              {mounted && (
                <button onClick={() => setTheme(isDark?"light":"dark")} className="w-9 h-9 rounded-lg flex items-center justify-center transition-all hover:scale-110"
                  style={{ background:isDark?"rgba(255,255,255,0.07)":"rgba(13,13,46,0.07)", color:"var(--text2)" }}>
                  {isDark ? <Sun size={16}/> : <Moon size={16}/>}
                </button>
              )}
              <button onClick={() => openAuth("login")} className="px-4 py-2 rounded-xl text-sm font-medium transition-all hover:scale-105"
                style={{ color:"var(--text)", border:"1px solid var(--border)" }}>Sign In</button>
              <button onClick={() => openAuth("signup")} className="px-5 py-2 rounded-xl text-sm font-semibold text-white btn-grad transition-all hover:scale-105"
                style={{ boxShadow:"0 0 24px rgba(168,85,247,0.35)" }}>Get Started</button>
            </div>

            <div className="flex lg:hidden items-center gap-2">
              {mounted && <button onClick={() => setTheme(isDark?"light":"dark")} className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ color:"var(--text2)" }}>{isDark?<Sun size={16}/>:<Moon size={16}/>}</button>}
              <button onClick={() => setMob(!mob)} className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ color:"var(--text2)" }}>{mob?<X size={20}/>:<Menu size={20}/>}</button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <div className="lg:hidden overflow-hidden transition-all duration-300" style={{ maxHeight:mob?"380px":"0", background: isDark?"rgba(5,5,32,0.98)":"rgba(255,255,255,0.98)", borderTop:mob?`1px solid var(--border)`:"none" }}>
          <div className="px-6 py-4 space-y-3">
            {links.map(l => <a key={l.l} href={l.h} onClick={()=>setMob(false)} className="block py-2 text-sm font-medium" style={{ color:"var(--text2)" }}>{l.l}</a>)}
            <div className="pt-2 flex flex-col gap-3">
              <button onClick={()=>openAuth("login")} className="w-full py-2.5 rounded-xl text-sm font-medium" style={{ color:"var(--text)", border:"1px solid var(--border)" }}>Sign In</button>
              <button onClick={()=>openAuth("signup")} className="w-full py-2.5 rounded-xl text-sm font-semibold text-white btn-grad">Get Started Free</button>
            </div>
          </div>
        </div>
      </nav>
      <AuthDialog open={authOpen} onOpenChange={setAuthOpen} defaultTab={authTab}/>
    </>
  );
}
