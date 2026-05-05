"use client";
import React, { useState, useRef, useEffect } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { X, Mail, Lock, User, ArrowRight, Github, CheckCircle, RefreshCw, AlertCircle } from "lucide-react";
import { useRegisterMutation, useLoginMutation, useVerifyOtpMutation } from "@/api/AuthApi";
import { useRouter } from "next/navigation";

type Tab = "login" | "signup";
type View = "form" | "otp";

interface Props { open: boolean; onOpenChange: (v: boolean) => void; defaultTab?: Tab; }

function OtpInput({ onComplete }: { onComplete: (otp: string) => void }) {
  const [vals, setVals] = useState(["","","","","",""]);
  const refs = useRef<(HTMLInputElement|null)[]>([]);

  const handle = (i: number, v: string) => {
    if (!/^\d?$/.test(v)) return;
    const next = [...vals]; next[i] = v; setVals(next);
    if (v && i < 5) refs.current[i+1]?.focus();
    if (next.every(c => c) && next.join("").length === 6) onComplete(next.join(""));
  };
  const handleKey = (i: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !vals[i] && i > 0) refs.current[i-1]?.focus();
  };
  const handlePaste = (e: React.ClipboardEvent) => {
    const txt = e.clipboardData.getData("text").replace(/\D/g,"").slice(0,6);
    if (txt.length === 6) { setVals(txt.split("")); onComplete(txt); refs.current[5]?.focus(); }
  };

  return (
    <div className="flex gap-3 justify-center my-6">
      {vals.map((v, i) => (
        <input key={i} ref={el => { refs.current[i] = el; }} type="text" inputMode="numeric"
          maxLength={1} value={v}
          className={`otp-box ${v ? "filled" : ""}`}
          onChange={e => handle(i, e.target.value)}
          onKeyDown={e => handleKey(i, e)}
          onPaste={handlePaste}
        />
      ))}
    </div>
  );
}

export function AuthDialog({ open, onOpenChange, defaultTab = "login" }: Props) {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>(defaultTab);
  const [view, setView] = useState<View>("form");
  const [email, setEmail] = useState(""); const [password, setPassword] = useState(""); const [name, setName] = useState("");
  const [error, setError] = useState(""); const [otpLoading, setOtpLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState<string|null>(null);

  const [register, { isLoading: regLoading }] = useRegisterMutation();
  const [login, { isLoading: loginLoading }] = useLoginMutation();
  const [verifyOtp] = useVerifyOtpMutation();

  useEffect(() => { setTab(defaultTab); setView("form"); setError(""); }, [defaultTab, open]);

  const isLoading = regLoading || loginLoading;
  const appId = process.env.NEXT_PUBLIC_BASE_APP_ID || "eduai";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setError("");
    if (tab === "signup") {
      const res = await register({ email, password, name, appId }) as any;
      if (res?.error) { setError(res.error?.data?.message || "Registration failed"); return; }
      setView("otp"); // show OTP screen
    } else {
      const res = await login({ email, password, appId }) as any;
      if (res?.error) { setError(res.error?.data?.message || "Invalid credentials"); return; }
      onOpenChange(false); router.push("/dashboard/learning");
    }
  };

  const handleOtpComplete = async (otp: string) => {
    setOtpLoading(true); setError("");
    const res = await verifyOtp({ email, otp, type: "otp-request", appId }) as any;
    setOtpLoading(false);
    if (res?.error) { setError(res.error?.data?.message || "Invalid OTP"); return; }
    onOpenChange(false); router.push("/dashboard/learning");
  };

  const handleOAuth = (p: string) => { setOauthLoading(p); setTimeout(() => { setOauthLoading(null); alert(`${p} OAuth — connect backend redirect`); }, 1200); };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50" style={{ background:"rgba(2,2,15,0.82)", backdropFilter:"blur(8px)" }} />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-full max-w-md outline-none" style={{ animation:"dialogIn 0.3s cubic-bezier(0.16,1,0.3,1)" }}>
          <div className="relative mx-4 overflow-hidden rounded-3xl glass" style={{ border:"1px solid rgba(168,85,247,0.22)", boxShadow:"0 40px 100px rgba(0,0,0,0.7), 0 0 60px rgba(168,85,247,0.12)" }}>
            <div className="absolute -top-16 -right-16 w-48 h-48 orb opacity-10" style={{ background:"radial-gradient(circle, #a855f7, transparent)" }} />
            <div className="absolute -bottom-16 -left-16 w-48 h-48 orb opacity-10" style={{ background:"radial-gradient(circle, #00d4ff, transparent)" }} />
            <div className="relative z-10 p-8">
              <Dialog.Close className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/10 transition-all" style={{ color:"var(--text2)" }}><X size={16}/></Dialog.Close>

              {/* Logo */}
              <div className="flex items-center gap-2 mb-7">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold text-lg btn-grad">e</div>
                <span className="font-display font-bold text-xl" style={{ color:"var(--text)" }}>edu.ai</span>
              </div>

              {view === "form" ? (
                <>
                  {/* Tabs */}
                  <div className="flex mb-7 rounded-xl p-1" style={{ background:"rgba(128,128,200,0.08)" }}>
                    {(["login","signup"] as Tab[]).map(t => (
                      <button key={t} onClick={() => { setTab(t); setError(""); }}
                        className="flex-1 py-2.5 rounded-lg text-sm font-medium transition-all duration-300"
                        style={{ background: tab===t ? "linear-gradient(135deg,rgba(0,212,255,0.15),rgba(168,85,247,0.15))" : "transparent",
                          color: tab===t ? "var(--text)" : "var(--text3)",
                          border: tab===t ? "1px solid rgba(168,85,247,0.25)" : "1px solid transparent" }}>
                        {t === "login" ? "Sign In" : "Sign Up"}
                      </button>
                    ))}
                  </div>

                  {/* OAuth */}
                  <div className="space-y-3 mb-6">
                    {[{name:"Google", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>},
                       {name:"GitHub", icon: <Github size={18}/>}].map(p => (
                      <button key={p.name} onClick={() => handleOAuth(p.name)} disabled={!!oauthLoading}
                        className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl text-sm font-medium transition-all hover:scale-[1.02] active:scale-[0.98]"
                        style={{ background:"rgba(128,128,200,0.06)", border:"1px solid rgba(128,128,200,0.12)", color:"var(--text)" }}>
                        {oauthLoading===p.name ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full spin"/> : p.icon}
                        Continue with {p.name}
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center gap-3 mb-6">
                    <div className="flex-1 h-px" style={{background:"var(--border)"}}/>
                    <span className="text-xs" style={{color:"var(--text3)"}}>or email</span>
                    <div className="flex-1 h-px" style={{background:"var(--border)"}}/>
                  </div>

                  {error && (
                    <div className="mb-4 flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs" style={{ background:"rgba(239,68,68,0.1)", border:"1px solid rgba(239,68,68,0.2)", color:"#f87171" }}>
                      <AlertCircle size={14}/>{error}
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-4">
                    {tab === "signup" && (
                      <div className="relative">
                        <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{color:"var(--text3)"}}/>
                        <input type="text" placeholder="Full name" value={name} onChange={e=>setName(e.target.value)} className="edu-input pl-9" required/>
                      </div>
                    )}
                    <div className="relative">
                      <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{color:"var(--text3)"}}/>
                      <input type="email" placeholder="Email address" value={email} onChange={e=>setEmail(e.target.value)} className="edu-input pl-9" required/>
                    </div>
                    <div className="relative">
                      <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{color:"var(--text3)"}}/>
                      <input type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} className="edu-input pl-9" required/>
                    </div>
                    {tab === "login" && (
                      <div className="text-right">
                        <button type="button" className="text-xs transition-opacity hover:opacity-100" style={{color:"var(--cyan)"}}>Forgot password?</button>
                      </div>
                    )}
                    <button type="submit" disabled={isLoading}
                      className="w-full py-3 rounded-xl flex items-center justify-center gap-2 text-sm font-semibold text-white btn-grad transition-all hover:scale-[1.02]"
                      style={{ opacity: isLoading ? 0.7 : 1 }}>
                      {isLoading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full spin"/> : <>{tab==="login"?"Sign In":"Create Account"}<ArrowRight size={15}/></>}
                    </button>
                  </form>

                  <p className="text-center mt-5 text-xs" style={{color:"var(--text3)"}}>
                    {tab==="login"?"No account? ":"Already have one? "}
                    <button onClick={()=>{setTab(tab==="login"?"signup":"login");setError("");}} className="font-medium" style={{color:"var(--cyan)"}}>
                      {tab==="login"?"Sign up":"Sign in"}
                    </button>
                  </p>
                </>
              ) : (
                /* OTP VIEW */
                <div className="text-center">
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{background:"linear-gradient(135deg,rgba(0,212,255,0.15),rgba(168,85,247,0.15))",border:"1px solid rgba(168,85,247,0.25)"}}>
                    <Mail size={28} style={{color:"var(--cyan)"}}/>
                  </div>
                  <h3 className="font-display text-xl font-bold mb-2" style={{color:"var(--text)"}}>Check your email</h3>
                  <p className="text-sm mb-1" style={{color:"var(--text2)"}}>We sent a 6-digit code to</p>
                  <p className="text-sm font-semibold mb-2" style={{color:"var(--cyan)"}}>{email}</p>

                  {error && (
                    <div className="mb-3 flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs" style={{background:"rgba(239,68,68,0.1)",border:"1px solid rgba(239,68,68,0.2)",color:"#f87171"}}>
                      <AlertCircle size={13}/>{error}
                    </div>
                  )}

                  <OtpInput onComplete={handleOtpComplete}/>

                  {otpLoading && (
                    <div className="flex items-center justify-center gap-2 text-sm mb-4" style={{color:"var(--text2)"}}>
                      <div className="w-4 h-4 border-2 border-purple-400/30 border-t-purple-400 rounded-full spin"/>
                      Verifying...
                    </div>
                  )}

                  <p className="text-xs mb-3" style={{color:"var(--text3)"}}>Didn't receive it?{" "}
                    <button className="font-medium flex items-center gap-1 mx-auto" style={{color:"var(--cyan)"}}>
                      <RefreshCw size={11}/> Resend code
                    </button>
                  </p>
                  <button onClick={()=>{setView("form");setError("");}} className="text-xs" style={{color:"var(--text3)"}}>← Back to sign up</button>
                </div>
              )}
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
