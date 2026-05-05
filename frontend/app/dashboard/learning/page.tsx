"use client";
import React, { useState, useRef, useEffect } from "react";
import { Upload, FileText, BookOpen, MessageSquare, Plus, Send, RotateCcw, CheckCircle, XCircle, ArrowLeft, Layers, Target, Award } from "lucide-react";
import { useTheme } from "next-themes";

/* ─── Types ─── */
interface Doc { id: string; name: string; size: string; status: "processing" | "ready"; pages: number; color: string; }
interface Message { role: "user" | "ai"; text: string; }
interface Flashcard { front: string; back: string; }
interface QuizQ { q: string; opts: string[]; ans: number; }

/* ─── Mock data ─── */
const MOCK_DOCS: Doc[] = [
  { id: "1", name: "Machine Learning Fundamentals.pdf", size: "2.4 MB", status: "ready", pages: 48, color: "var(--cyan)" },
  { id: "2", name: "System Design Interview Guide.pdf", size: "5.1 MB", status: "ready", pages: 120, color: "var(--purple)" },
  { id: "3", name: "Data Structures & Algorithms.pdf", size: "3.8 MB", status: "processing", pages: 92, color: "var(--pink)" },
];
const MOCK_CARDS: Flashcard[] = [
  { front: "What is supervised learning?", back: "A type of machine learning where models learn from labeled training data to predict outputs for unseen inputs." },
  { front: "Define overfitting", back: "When a model learns training data too well including noise, performing well on training but poorly on new data." },
  { front: "What is gradient descent?", back: "An optimization algorithm that iteratively adjusts parameters in the direction that minimizes the loss function." },
  { front: "Explain bias-variance tradeoff", back: "The tension between underfitting (high bias) and overfitting (high variance) — both cause poor generalization." },
];
const MOCK_QUIZ: QuizQ[] = [
  { q: "Which algorithm is best for non-linearly separable data?", opts: ["Linear Regression", "SVM with RBF kernel", "Naive Bayes", "K-means"], ans: 1 },
  { q: "What does 'epoch' mean in deep learning?", opts: ["A single gradient step", "One full pass through training data", "A layer in neural network", "A learning rate schedule"], ans: 1 },
  { q: "Which metric is best for imbalanced classification?", opts: ["Accuracy", "MSE", "F1-Score", "R-squared"], ans: 2 },
];
const MOCK_MSGS: Message[] = [
  { role: "ai", text: "Hi! I've analyzed your **Machine Learning Fundamentals** document. I can answer questions, explain concepts, or quiz you. What would you like to explore?" },
];
const AI_RESPONSES: Record<string, string> = {
  default: "Based on your document, this concept involves the core principles of machine learning. The key insight is that models learn patterns from data rather than explicit programming. Would you like me to elaborate on any specific aspect?",
  "neural": "Neural networks are computational models inspired by biological brains. They consist of layers of interconnected nodes (neurons) that transform input data through weighted connections and activation functions to produce outputs.",
  "loss": "The loss function measures how far the model's predictions are from actual values. Common examples include MSE for regression and cross-entropy for classification. Minimizing this guides the training process.",
};

type ActiveTab = "documents" | "chat" | "flashcards" | "quiz";

export default function LearningPage() {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState<ActiveTab>("documents");
  const [selectedDoc, setSelectedDoc] = useState<Doc | null>(MOCK_DOCS[0]);
  const [msgs, setMsgs] = useState<Message[]>(MOCK_MSGS);
  const [input, setInput] = useState("");
  const [aiTyping, setAiTyping] = useState(false);
  const [cardIdx, setCardIdx] = useState(0);
  const [cardFlipped, setCardFlipped] = useState(false);
  const [quizIdx, setQuizIdx] = useState(0);
  const [quizAns, setQuizAns] = useState<number | null>(null);
  const [quizScore, setQuizScore] = useState(0);
  const [quizDone, setQuizDone] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [docs, setDocs] = useState<Doc[]>(MOCK_DOCS);
  const chatEnd = useRef<HTMLDivElement>(null);
  const fileInput = useRef<HTMLInputElement>(null);

  useEffect(() => { chatEnd.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs, aiTyping]);

  const sendMsg = async () => {
    if (!input.trim()) return;
    const userMsg = input.trim();
    setInput("");
    setMsgs(m => [...m, { role: "user", text: userMsg }]);
    setAiTyping(true);
    await new Promise(r => setTimeout(r, 1200));
    const key = Object.keys(AI_RESPONSES).find(k => k !== "default" && userMsg.toLowerCase().includes(k));
    setMsgs(m => [...m, { role: "ai", text: AI_RESPONSES[key || "default"] }]);
    setAiTyping(false);
  };

  const handleUpload = (file: File) => {
    setUploading(true);
    setTimeout(() => {
      const colors = ["var(--cyan)", "var(--purple)", "var(--pink)", "var(--emerald)"];
      const newDoc: Doc = { id: Date.now().toString(), name: file.name, size: `${(file.size / 1024 / 1024).toFixed(1)} MB`, status: "processing", pages: Math.floor(Math.random() * 80 + 20), color: colors[Math.floor(Math.random() * 4)] };
      setDocs(d => [...d, newDoc]);
      setUploading(false);
      setTimeout(() => setDocs(d => d.map(doc => doc.id === newDoc.id ? { ...doc, status: "ready" } : doc)), 3000);
    }, 1000);
  };

  const answerQuiz = (idx: number) => {
    if (quizAns !== null) return;
    setQuizAns(idx);
    if (idx === MOCK_QUIZ[quizIdx].ans) setQuizScore(s => s + 1);
    setTimeout(() => {
      if (quizIdx < MOCK_QUIZ.length - 1) { setQuizIdx(i => i + 1); setQuizAns(null); }
      else setQuizDone(true);
    }, 1500);
  };

  const tabs: { id: ActiveTab; label: string; icon: React.ElementType }[] = [
    { id: "documents", label: "Documents", icon: FileText },
    { id: "chat", label: "AI Chat", icon: MessageSquare },
    { id: "flashcards", label: "Flashcards", icon: Layers },
    { id: "quiz", label: "Quiz", icon: Target },
  ];

  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      {/* Header */}
      <div className="sticky top-0 z-30 px-6 py-4 flex items-center justify-between" style={{ background: "rgba(5,5,32,0.9)", backdropFilter: "blur(20px)", borderBottom: "1px solid var(--border)" }}>
        <div className="flex items-center gap-3">
          <a href="/" className="w-8 h-8 rounded-lg flex items-center justify-center transition-all hover:scale-110" style={{ background: "rgba(128,128,200,0.08)", color: "var(--text2)", border: "1px solid var(--border)" }}><ArrowLeft size={16}/></a>
          <div className="w-8 h-8 rounded-xl btn-grad flex items-center justify-center text-white font-bold text-sm">e</div>
          <span className="font-display font-bold text-lg" style={{ color: "var(--text)" }}>Learning Module</span>
          {selectedDoc && <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs" style={{ background: "rgba(128,128,200,0.06)", border: "1px solid var(--border)", color: "var(--text3)" }}><FileText size={11}/>{selectedDoc.name.length > 25 ? selectedDoc.name.slice(0, 25) + "…" : selectedDoc.name}</div>}
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium" style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.2)", color: "#10b981" }}>
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"/>AI Ready
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Tab nav */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-1">
          {tabs.map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id)} className={`tab-btn flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${activeTab === t.id ? "active" : ""}`}
              style={{ color: activeTab === t.id ? "var(--text)" : "var(--text3)", border: activeTab === t.id ? "1px solid var(--border)" : "1px solid transparent", background: activeTab === t.id ? undefined : "transparent" }}>
              <t.icon size={15}/>{t.label}
            </button>
          ))}
        </div>

        {/* ── DOCUMENTS TAB ── */}
        {activeTab === "documents" && (
          <div className="space-y-6">
            {/* Upload zone */}
            <div className="relative rounded-3xl p-10 text-center cursor-pointer transition-all hover:scale-[1.01]"
              style={{ border: "2px dashed var(--border)", background: "rgba(128,128,200,0.03)" }}
              onClick={() => fileInput.current?.click()}
              onDragOver={e => e.preventDefault()}
              onDrop={e => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) handleUpload(f); }}>
              <input ref={fileInput} type="file" className="hidden" accept=".pdf,.docx,.txt" onChange={e => { const f = e.target.files?.[0]; if (f) handleUpload(f); }}/>
              {uploading ? (
                <div className="flex flex-col items-center gap-3">
                  <div className="w-12 h-12 border-2 border-purple-400/30 border-t-purple-400 rounded-full spin"/>
                  <p className="text-sm font-medium" style={{ color: "var(--text2)" }}>Uploading & processing…</p>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-3">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: "rgba(168,85,247,0.1)", border: "1px solid rgba(168,85,247,0.2)" }}><Upload size={26} style={{ color: "var(--purple)" }}/></div>
                  <div><p className="font-semibold mb-1" style={{ color: "var(--text)" }}>Drop files here or click to upload</p><p className="text-sm" style={{ color: "var(--text3)" }}>PDF, DOCX, TXT — up to 50 MB</p></div>
                </div>
              )}
            </div>

            {/* Document cards */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {docs.map(doc => (
                <div key={doc.id} className={`doc-card glass rounded-2xl p-5 cursor-pointer ${selectedDoc?.id === doc.id ? "ring-2" : ""}`}
                  style={{ borderColor: selectedDoc?.id === doc.id ? doc.color : undefined, outline: selectedDoc?.id === doc.id ? `2px solid ${doc.color}` : "none", outlineOffset: "2px" }}
                  onClick={() => { setSelectedDoc(doc); if (doc.status === "ready") setActiveTab("chat"); }}>
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: `color-mix(in srgb, ${doc.color} 12%, transparent)`, border: `1px solid color-mix(in srgb, ${doc.color} 22%, transparent)` }}><FileText size={20} style={{ color: doc.color }}/></div>
                    <div className="px-2 py-1 rounded-lg text-xs font-medium" style={{ background: doc.status === "ready" ? "rgba(16,185,129,0.1)" : "rgba(245,158,11,0.1)", border: doc.status === "ready" ? "1px solid rgba(16,185,129,0.2)" : "1px solid rgba(245,158,11,0.2)", color: doc.status === "ready" ? "#10b981" : "#f59e0b" }}>
                      {doc.status === "ready" ? "Ready" : <span className="flex items-center gap-1"><div className="w-2.5 h-2.5 border border-amber-400/30 border-t-amber-400 rounded-full spin"/>Processing</span>}
                    </div>
                  </div>
                  <h3 className="text-sm font-semibold mb-1 line-clamp-2" style={{ color: "var(--text)" }}>{doc.name}</h3>
                  <div className="flex items-center gap-3 text-xs" style={{ color: "var(--text3)" }}>
                    <span className="flex items-center gap-1"><BookOpen size={11}/>{doc.pages} pages</span>
                    <span>{doc.size}</span>
                  </div>
                  {doc.status === "ready" && (
                    <div className="mt-4 flex gap-2">
                      {[{ l: "Chat", t: "chat" as ActiveTab }, { l: "Quiz", t: "quiz" as ActiveTab }, { l: "Cards", t: "flashcards" as ActiveTab }].map(btn => (
                        <button key={btn.l} onClick={e => { e.stopPropagation(); setSelectedDoc(doc); setActiveTab(btn.t); }} className="flex-1 py-1.5 rounded-lg text-xs font-medium transition-all hover:scale-105"
                          style={{ background: `color-mix(in srgb, ${doc.color} 10%, transparent)`, border: `1px solid color-mix(in srgb, ${doc.color} 20%, transparent)`, color: doc.color }}>{btn.l}</button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              <button className="glass rounded-2xl p-5 flex flex-col items-center justify-center gap-3 min-h-[160px] transition-all hover:scale-[1.02]"
                style={{ border: "1px dashed var(--border)" }} onClick={() => fileInput.current?.click()}>
                <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: "rgba(128,128,200,0.06)", border: "1px solid var(--border)" }}><Plus size={20} style={{ color: "var(--text3)" }}/></div>
                <span className="text-sm" style={{ color: "var(--text3)" }}>Add document</span>
              </button>
            </div>
          </div>
        )}

        {/* ── AI CHAT TAB ── */}
        {activeTab === "chat" && (
          <div className="flex flex-col h-[calc(100vh-260px)] min-h-[500px]">
            <div className="flex-1 overflow-y-auto space-y-5 mb-4 pr-1">
              {msgs.map((m, i) => (
                <div key={i} className={`flex gap-3 ${m.role === "user" ? "flex-row-reverse" : ""}`}>
                  <div className={`w-8 h-8 rounded-xl flex-shrink-0 flex items-center justify-center text-xs font-bold ${m.role === "ai" ? "btn-grad text-white" : ""}`}
                    style={m.role === "user" ? { background: "rgba(128,128,200,0.12)", border: "1px solid var(--border)", color: "var(--text2)" } : {}}>
                    {m.role === "ai" ? "e" : "U"}
                  </div>
                  <div className={`max-w-[75%] px-4 py-3 rounded-2xl text-sm leading-relaxed`}
                    style={{ background: m.role === "ai" ? "var(--card)" : "rgba(168,85,247,0.12)", border: `1px solid ${m.role === "ai" ? "var(--border)" : "rgba(168,85,247,0.22)"}`, color: "var(--text)", borderRadius: m.role === "user" ? "20px 6px 20px 20px" : "6px 20px 20px 20px" }}>
                    {m.text}
                  </div>
                </div>
              ))}
              {aiTyping && (
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-xl btn-grad flex-shrink-0 flex items-center justify-center text-xs font-bold text-white">e</div>
                  <div className="px-4 py-3 rounded-2xl flex items-center gap-1.5" style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: "6px 20px 20px 20px" }}>
                    {[0,1,2].map(i => <div key={i} className="w-2 h-2 rounded-full" style={{ background: "var(--purple)", animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite` }}/>)}
                  </div>
                </div>
              )}
              <div ref={chatEnd}/>
            </div>

            {/* Suggestions */}
            <div className="flex gap-2 mb-3 flex-wrap">
              {["Explain neural networks", "What is loss function?", "Summarize chapter 3"].map(s => (
                <button key={s} onClick={() => { setInput(s); }} className="px-3 py-1.5 rounded-xl text-xs font-medium transition-all hover:scale-105"
                  style={{ background: "rgba(168,85,247,0.08)", border: "1px solid rgba(168,85,247,0.18)", color: "var(--purple)" }}>{s}</button>
              ))}
            </div>

            <div className="flex gap-3">
              <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && !e.shiftKey && sendMsg()}
                placeholder="Ask anything about your document…" className="edu-input flex-1" style={{ borderRadius: "14px" }}/>
              <button onClick={sendMsg} disabled={!input.trim() || aiTyping} className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 btn-grad text-white transition-all hover:scale-110 disabled:opacity-40"><Send size={18}/></button>
            </div>
          </div>
        )}

        {/* ── FLASHCARDS TAB ── */}
        {activeTab === "flashcards" && (
          <div className="max-w-xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <div className="text-sm" style={{ color: "var(--text3)" }}>{cardIdx + 1} / {MOCK_CARDS.length}</div>
              <div className="prog-bar w-40"><div className="prog-fill" style={{ width: `${((cardIdx + 1) / MOCK_CARDS.length) * 100}%` }}/></div>
            </div>

            {/* Card with flip */}
            <div className="relative cursor-pointer mb-6" style={{ perspective: "1000px", height: "260px" }} onClick={() => setCardFlipped(f => !f)}>
              <div className="relative w-full h-full transition-all duration-500" style={{ transformStyle: "preserve-3d", transform: cardFlipped ? "rotateY(180deg)" : "rotateY(0)" }}>
                {/* Front */}
                <div className="absolute inset-0 glass rounded-3xl flex flex-col items-center justify-center p-8 text-center" style={{ backfaceVisibility: "hidden" }}>
                  <div className="px-3 py-1 rounded-full text-xs font-medium mb-4" style={{ background: "rgba(0,212,255,0.1)", border: "1px solid rgba(0,212,255,0.2)", color: "var(--cyan)" }}>Question</div>
                  <p className="text-lg font-semibold leading-relaxed" style={{ color: "var(--text)" }}>{MOCK_CARDS[cardIdx].front}</p>
                  <p className="text-xs mt-4" style={{ color: "var(--text3)" }}>Tap to reveal answer</p>
                </div>
                {/* Back */}
                <div className="absolute inset-0 glass rounded-3xl flex flex-col items-center justify-center p-8 text-center" style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)", background: "rgba(168,85,247,0.06)" }}>
                  <div className="px-3 py-1 rounded-full text-xs font-medium mb-4" style={{ background: "rgba(168,85,247,0.12)", border: "1px solid rgba(168,85,247,0.25)", color: "var(--purple)" }}>Answer</div>
                  <p className="text-base leading-relaxed" style={{ color: "var(--text)" }}>{MOCK_CARDS[cardIdx].back}</p>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={() => { setCardFlipped(false); setCardIdx(i => Math.max(0, i-1)); }} disabled={cardIdx === 0}
                className="flex-1 py-3 rounded-xl text-sm font-medium transition-all hover:scale-105 disabled:opacity-30" style={{ border: "1px solid var(--border)", color: "var(--text2)" }}>← Previous</button>
              <button onClick={() => { setCardFlipped(false); if (cardIdx < MOCK_CARDS.length - 1) setCardIdx(i => i+1); else setCardIdx(0); }}
                className="flex-1 py-3 rounded-xl text-sm font-semibold text-white btn-grad transition-all hover:scale-105">
                {cardIdx < MOCK_CARDS.length - 1 ? "Next →" : "Start Over ↺"}
              </button>
            </div>

            <div className="flex gap-3 mt-4">
              <button className="flex-1 py-2.5 rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition-all hover:scale-105"
                style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.15)", color: "#f87171" }}><XCircle size={14}/>Still learning</button>
              <button className="flex-1 py-2.5 rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition-all hover:scale-105"
                style={{ background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.15)", color: "#10b981" }}><CheckCircle size={14}/>Got it!</button>
            </div>
          </div>
        )}

        {/* ── QUIZ TAB ── */}
        {activeTab === "quiz" && (
          <div className="max-w-xl mx-auto">
            {!quizDone ? (
              <>
                <div className="flex items-center justify-between mb-6">
                  <div className="text-sm font-medium" style={{ color: "var(--text2)" }}>Question {quizIdx + 1} of {MOCK_QUIZ.length}</div>
                  <div className="flex items-center gap-2 text-sm" style={{ color: "var(--cyan)" }}><Target size={14}/>{quizScore} correct</div>
                </div>
                <div className="prog-bar mb-8"><div className="prog-fill" style={{ width: `${((quizIdx) / MOCK_QUIZ.length) * 100}%` }}/></div>

                <div className="glass rounded-2xl p-6 mb-6">
                  <p className="text-lg font-semibold leading-relaxed" style={{ color: "var(--text)" }}>{MOCK_QUIZ[quizIdx].q}</p>
                </div>

                <div className="space-y-3">
                  {MOCK_QUIZ[quizIdx].opts.map((opt, i) => {
                    let bg = "var(--card)"; let border = "var(--border)"; let textColor = "var(--text)";
                    if (quizAns !== null) {
                      if (i === MOCK_QUIZ[quizIdx].ans) { bg = "rgba(16,185,129,0.12)"; border = "rgba(16,185,129,0.35)"; textColor = "#10b981"; }
                      else if (i === quizAns) { bg = "rgba(239,68,68,0.1)"; border = "rgba(239,68,68,0.3)"; textColor = "#f87171"; }
                    }
                    return (
                      <button key={i} onClick={() => answerQuiz(i)} disabled={quizAns !== null}
                        className="w-full text-left px-5 py-4 rounded-2xl text-sm font-medium transition-all hover:scale-[1.01] disabled:cursor-default flex items-center gap-3"
                        style={{ background: bg, border: `1px solid ${border}`, color: textColor }}>
                        <div className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0"
                          style={{ background: "rgba(128,128,200,0.1)", border: "1px solid var(--border)", color: "var(--text3)" }}>
                          {String.fromCharCode(65 + i)}
                        </div>
                        {opt}
                        {quizAns !== null && i === MOCK_QUIZ[quizIdx].ans && <CheckCircle size={16} className="ml-auto text-emerald-400"/>}
                        {quizAns !== null && i === quizAns && i !== MOCK_QUIZ[quizIdx].ans && <XCircle size={16} className="ml-auto text-red-400"/>}
                      </button>
                    );
                  })}
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <div className="w-20 h-20 rounded-3xl btn-grad flex items-center justify-center mx-auto mb-6"><Award size={36} className="text-white"/></div>
                <h3 className="font-display text-3xl font-bold mb-2" style={{ color: "var(--text)" }}>Quiz Complete!</h3>
                <p className="text-lg mb-2" style={{ color: "var(--text2)" }}>You scored <span className="font-bold" style={{ color: "var(--cyan)" }}>{quizScore}/{MOCK_QUIZ.length}</span></p>
                <p className="text-sm mb-8" style={{ color: "var(--text3)" }}>{quizScore === MOCK_QUIZ.length ? "Perfect score! 🎉" : quizScore >= MOCK_QUIZ.length / 2 ? "Good job! Keep practicing." : "Review the material and try again."}</p>
                <button onClick={() => { setQuizIdx(0); setQuizAns(null); setQuizScore(0); setQuizDone(false); }} className="px-8 py-3 rounded-2xl text-sm font-semibold text-white btn-grad flex items-center gap-2 mx-auto transition-all hover:scale-105"><RotateCcw size={16}/>Try Again</button>
              </div>
            )}
          </div>
        )}
      </div>
      <style>{`
        @keyframes bounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-4px)} }
        .line-clamp-2 { display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden; }
      `}</style>
    </div>
  );
}
