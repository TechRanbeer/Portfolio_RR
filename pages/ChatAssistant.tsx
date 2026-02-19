import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, User, Bot, Loader2, Sparkles, Copy, Check, Terminal } from 'lucide-react';
import { geminiService } from '../services/geminiService';
import { Project, Blog, ChatMessage } from '../types';

interface ChatAssistantProps {
  projects: Project[];
  blogs: Blog[];
}

const ChatAssistant: React.FC<ChatAssistantProps> = ({ projects, blogs }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  useEffect(() => {
    if (messages.length === 0) {
      setMessages([{
        role: 'assistant',
        content: "Hi! I'm Ranbeer's AI Assistant. I can tell you about his projects, skills, or even just what he's been learning lately. What can I help you find today?",
        timestamp: Date.now()
      }]);
    }
  }, []);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userMsg: ChatMessage = {
      role: 'user',
      content: input,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    const history = messages.map(m => ({
      role: m.role === 'user' ? 'user' as const : 'model' as const,
      parts: [{ text: m.content }]
    }));

    // FIX: Wrapped in try/catch/finally so isTyping is ALWAYS reset,
    // even when the API call fails. Previously, any error would leave
    // the chat permanently stuck in the loading state.
    try {
      const aiResponse = await geminiService.generatePortfolioResponse(input, history, projects, blogs);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: aiResponse || "I'm having a bit of trouble thinking right now. Could you ask again?",
        timestamp: Date.now()
      }]);
    } catch (err) {
      console.error('Chat error:', err);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: "Something went wrong. Please try again in a moment.",
        timestamp: Date.now()
      }]);
    } finally {
      // This guarantees the spinner always stops, no matter what happens above.
      setIsTyping(false);
    }
  };

  const copyToClipboard = async (text: string, index: number) => {
    // FIX: navigator.clipboard requires HTTPS (secure context).
    // Added fallback for non-secure environments.
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const el = document.createElement('textarea');
      el.value = text;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
    }
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const renderFormattedContent = (content: string) => {
    const parts = content.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i} className="font-bold text-white">{part.slice(2, -2)}</strong>;
      }
      return part;
    });
  };

  const suggestions = [
    "What projects has Ranbeer worked on?",
    "What's Ranbeer's tech stack?",
    "Is Ranbeer available for freelance?",
    "Tell me about the Raspberry Pi 5 NAS"
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-32 pb-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-4xl font-black text-white flex items-center tracking-tighter uppercase"
          >
            <Sparkles className="text-cyan-400 mr-3 animate-pulse" size={32} />
            Ranbeer <span className="text-cyan-400 ml-2">AI</span>
          </motion.h1>
        </div>
      </div>

      <div className="flex flex-col h-[calc(100vh-18rem)] min-h-[500px] bg-slate-900/40 border border-white/5 rounded-[2.5rem] overflow-hidden backdrop-blur-xl shadow-2xl relative">
        <div className="absolute inset-0 pointer-events-none opacity-[0.03] z-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.2)_50%),linear-gradient(90deg,rgba(255,0,0,0.03),rgba(0,255,0,0.01),rgba(0,0,255,0.03))] bg-[length:100%_4px,4px_100%]"></div>

        <div className="px-8 py-4 bg-slate-950/40 border-b border-white/5 flex items-center justify-between relative z-10 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <Terminal size={14} className="text-cyan-500" />
            <span className="font-mono text-[9px] text-slate-500 uppercase tracking-[0.3em]">Neural_Link_Established</span>
          </div>
        </div>

        <div ref={scrollRef} className="flex-grow overflow-y-auto p-6 md:p-10 space-y-10 scroll-smooth relative z-10 no-scrollbar">
          <AnimatePresence mode="popLayout">
            {messages.map((msg, idx) => (
              <motion.div
                key={msg.timestamp + idx}
                initial={{ opacity: 0, y: 20, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ type: "spring", damping: 25, stiffness: 120 }}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex max-w-[90%] md:max-w-[80%] group ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-lg ${
                    msg.role === 'user'
                      ? 'bg-gradient-to-br from-cyan-500 to-blue-600 text-white ml-4'
                      : 'bg-slate-800 text-cyan-400 border border-white/10 mr-4'
                  }`}>
                    {msg.role === 'user' ? <User size={20} /> : <Bot size={20} />}
                  </div>

                  <div className="relative group/content">
                    <div className={`p-6 rounded-[1.8rem] text-sm md:text-base leading-relaxed shadow-xl whitespace-pre-wrap ${
                      msg.role === 'user'
                        ? 'bg-cyan-600/20 text-slate-100 border border-cyan-500/30 rounded-tr-none'
                        : 'bg-slate-800/80 text-slate-200 border border-white/5 rounded-tl-none'
                    }`}>
                      {renderFormattedContent(msg.content)}
                    </div>

                    {msg.role === 'assistant' && (
                      <button
                        onClick={() => copyToClipboard(msg.content, idx)}
                        className="absolute -right-12 top-2 p-2 rounded-xl bg-slate-800/50 border border-white/5 text-slate-400 opacity-0 group-hover/content:opacity-100 transition-all hover:text-cyan-400 hover:bg-slate-700"
                        title="Copy response"
                      >
                        {copiedIndex === idx ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
                      </button>
                    )}

                    <div className={`mt-3 text-[10px] font-bold uppercase tracking-widest text-slate-600 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-start"
            >
              <div className="flex max-w-[85%]">
                <div className="w-10 h-10 rounded-2xl bg-slate-800 text-cyan-400 border border-white/10 flex items-center justify-center shrink-0 mr-4">
                  <Bot size={20} className="animate-pulse" />
                </div>
                <div className="p-5 rounded-[1.5rem] bg-slate-800/40 border border-white/5 rounded-tl-none flex items-center space-x-2">
                  <motion.div animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 0.8, delay: 0 }} className="w-1.5 h-1.5 bg-cyan-500 rounded-full" />
                  <motion.div animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 0.8, delay: 0.2 }} className="w-1.5 h-1.5 bg-cyan-400 rounded-full" />
                  <motion.div animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 0.8, delay: 0.4 }} className="w-1.5 h-1.5 bg-cyan-300 rounded-full" />
                </div>
              </div>
            </motion.div>
          )}
        </div>

        <div className="p-8 border-t border-white/5 bg-slate-950/90 backdrop-blur-2xl relative z-20 shadow-[0_-20px_40px_rgba(0,0,0,0.3)]">
          <div className="relative flex items-center mb-6">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Query the engineering core..."
              className="w-full bg-slate-900/50 border border-white/10 rounded-[1.5rem] px-8 py-5 pr-16 text-slate-200 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/10 transition-all placeholder:text-slate-600 font-medium"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isTyping}
              className="absolute right-3 p-4 bg-cyan-600 text-white rounded-xl hover:bg-cyan-500 disabled:bg-slate-800 disabled:text-slate-700 transition-all shadow-lg hover:scale-105 active:scale-95 group"
            >
              {isTyping ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />}
            </button>
          </div>
          <div className="flex flex-wrap gap-3">
            <span className="text-[10px] text-slate-600 font-black uppercase tracking-[0.2em] self-center mr-2">Quick_Links:</span>
            {suggestions.map(s => (
              <button
                key={s}
                onClick={() => setInput(s)}
                className="text-[10px] font-black uppercase tracking-widest bg-slate-900 border border-white/5 hover:border-cyan-500/30 hover:bg-slate-800 text-slate-500 hover:text-cyan-400 px-4 py-2 rounded-xl transition-all shadow-sm active:scale-95"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatAssistant;