"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X, Sparkles, Send } from "lucide-react";
import { useAIPanelStore } from "@/stores/aiPanelStore";
import { useState, useRef, useEffect } from "react";
import { useAIStream } from "@/hooks/useAIStream";
import { useParams } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const contextConfig = {
  global: {
    label: "General",
    prompt: "Ask me anything about your product decisions or specifications...",
    suggestions: ["Summarize project health", "What decisions are overdue?", "Find spec conflicts"],
  },
  decision: {
    label: "Decision Analysis",
    prompt: "Ask about this decision, options, or trade-offs...",
    suggestions: ["Analyze trade-offs", "Suggest missing options", "Identify hidden risks"],
  },
  spec: {
    label: "Spec Assistant",
    prompt: "Ask me to improve, expand, or validate this spec...",
    suggestions: ["Improve clarity", "Add acceptance criteria", "Check for ambiguity"],
  },
  conflict: {
    label: "Conflict Resolver",
    prompt: "Ask how to resolve this conflict...",
    suggestions: ["Suggest resolution", "Explain the contradiction", "Find root cause"],
  },
};

export function AIPanel() {
  const { isOpen, setOpen, contextType, contextId } = useAIPanelStore();
  const params = useParams();
  const projectId = params?.id as string;
  
  const ctx = contextConfig[contextType as keyof typeof contextConfig] || contextConfig.global;
  const [messages, setMessages] = useState<any[]>([]);
  const [inputValue, setInputValue] = useState("");
  const { content, isStreaming, startStream } = useAIStream();
  const scrollRef = useRef<HTMLDivElement>(null);

  // Sync streaming content into message history
  useEffect(() => {
    if (content) {
      setMessages(prev => {
        const history = [...prev];
        const last = history[history.length - 1];
        if (last?.role === 'assistant') {
          history[history.length - 1] = { ...last, content: content };
          return history;
        } else {
          console.log('[AIPanel] Assistant response started');
          return [...history, { role: 'assistant', content: content }];
        }
      });
    }
  }, [content]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, content]);

  const handleSend = async () => {
    if (!inputValue.trim() || isStreaming) return;
    console.log('[AIPanel] Sending message:', inputValue);
    const userMsg = { role: 'user', content: inputValue };
    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    setInputValue("");
    
    await startStream('/api/ai/chat', { 
      messages: newHistory,
      contextType,
      contextId,
      projectId
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.aside
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: 340, opacity: 1 }}
          exit={{ width: 0, opacity: 0 }}
          transition={{ type: "spring", bounce: 0, duration: 0.3 }}
          style={{
            background: "rgba(255, 255, 255, 0.90)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            borderLeft: "1px solid rgba(124, 108, 242, 0.10)",
            boxShadow: "-4px 0 24px rgba(124, 108, 242, 0.08)",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            flexShrink: 0,
            minWidth: 340,
          }}
          className="hidden md:flex"
        >
          {/* Header */}
          <div style={{ height: 56, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 16px", borderBottom: "1px solid var(--border-subtle)", flexShrink: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ color: "var(--accent)", fontSize: 13 }}>✦</span>
              <span style={{ fontWeight: 600, fontSize: 14, color: "var(--text-primary)" }}>Spectra Assistant</span>
            </div>
            <button onClick={() => setOpen(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
              <X size={16} />
            </button>
          </div>

          <div ref={scrollRef} style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column" }}>
            {messages.length === 0 && (
              <div style={{ padding: "16px" }} className="space-y-4">
                 <div style={{ background: "var(--accent-muted)", border: "1px solid var(--accent-border)", borderRadius: "var(--radius-md)", padding: "12px", display: "flex", gap: 10 }}>
                    <Sparkles size={16} className="text-[--accent] shrink-0 mt-1" />
                    <div>
                      <p style={{ fontSize: 11, fontWeight: 700, color: "var(--accent)", textTransform: "uppercase" }}>{ctx.label} Mode</p>
                      <p style={{ fontSize: 12, color: "var(--text-muted)" }}>Ask for strategic tradeoffs or logic.</p>
                    </div>
                 </div>

                 <div className="space-y-2">
                    <p style={{ fontSize: 10, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase" }}>Suggestions</p>
                    {ctx.suggestions.map(s => (
                      <button key={s} onClick={() => { setInputValue(s); }} style={{ width: '100%', textAlign: 'left', padding: '8px 12px', background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', borderRadius: '6px', fontSize: '12px', color: 'var(--text-secondary)' }} className="hover:bg-[--bg-hover] hover:text-[--text-primary] transition-colors">
                        {s}
                      </button>
                    ))}
                 </div>
              </div>
            )}

            <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {messages.map((m, i) => (
                <div key={i} style={{ alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start', maxWidth: '85%' }}>
                   <div style={{ 
                     padding: '10px 14px', 
                     borderRadius: '14px', 
                     fontSize: '13px', 
                     lineHeight: '1.5',
                     background: m.role === 'user'
                       ? 'linear-gradient(135deg, #7C6CF2, #818CF8)'
                       : 'rgba(255,255,255,0.85)',
                     color: m.role === 'user' ? '#fff' : 'var(--text-primary)',
                     border: m.role === 'user' ? 'none' : '1px solid rgba(124,108,242,0.12)',
                     boxShadow: m.role === 'user'
                       ? '0 4px 12px rgba(124,108,242,0.25)'
                       : '0 2px 8px rgba(0,0,0,0.04)',
                   }} className="prose prose-sm prose-slate dark:prose-invert max-w-none">
                     <ReactMarkdown remarkPlugins={[remarkGfm]}>
                       {m.content}
                     </ReactMarkdown>
                   </div>
                </div>
              ))}
              {isStreaming && content === "" && (
                <div className="text-[10px] text-[--text-muted] pl-2 uppercase font-bold tracking-widest animate-pulse">Thinking...</div>
              )}
            </div>
          </div>

          <div style={{ padding: "16px", borderTop: "1px solid rgba(124,108,242,0.08)", background: "rgba(248,250,255,0.80)", backdropFilter: "blur(8px)" }}>
            <div style={{ position: "relative" }}>
              <input
                type="text"
                value={inputValue}
                onChange={e => setInputValue(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSend()}
                placeholder={ctx.prompt}
                style={{ width: "100%", background: "rgba(255,255,255,0.80)", border: "1px solid rgba(124,108,242,0.15)", borderRadius: 999, padding: "10px 44px 10px 16px", fontSize: 13, color: "var(--text-primary)", outline: "none" }}
              />
              <button
                onClick={handleSend}
                disabled={isStreaming}
                style={{ position: "absolute", right: 6, top: "50%", transform: "translateY(-50%)", width: 32, height: 32, background: "linear-gradient(135deg, #7C6CF2, #818CF8)", color: "#fff", borderRadius: 999, border: "none", cursor: isStreaming ? "not-allowed" : "pointer", boxShadow: "0 2px 8px rgba(124,108,242,0.30)" }}
              >
                <Send size={12} className="mx-auto" />
              </button>
            </div>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
