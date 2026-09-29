import { useState, useRef, useEffect } from 'react';
import { Bot, Search, ShieldCheck, CornerDownLeft, Sparkles, BookOpen } from 'lucide-react';
import clsx from 'clsx';
import { fetchApi } from '../services/api';
import defaultAvatar from '../assets/default-avatar.png';

export function AiEvidence() {
  const [profileAvatar, setProfileAvatar] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<any[]>([
    {
      role: 'assistant',
      content: 'Welcome to the Bhu-Setu Evidence Assistant. Ask research or statutory policy questions regarding land records modernization, agricultural land conversion, LARR compensation thresholds, or SVAMITVA cadastral mapping.',
      evidence: []
    }
  ]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const fetchAvatar = () => {
      const saved = localStorage.getItem('bhu_settings');
      if (saved) {
        const p = JSON.parse(saved);
        setProfileAvatar(p.profileAvatar || null);
      }
    };
    fetchAvatar();
    window.addEventListener('bhu_settings_changed', fetchAvatar);
    return () => window.removeEventListener('bhu_settings_changed', fetchAvatar);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    const userMessage = { role: 'user', content: query };
    setMessages(prev => [...prev, userMessage]);
    setQuery('');
    setLoading(true);

    try {
      const res = await fetchApi<any>('/rag/query', {
        method: 'POST',
        body: JSON.stringify({ query: userMessage.content, llm_mode: "STRICT_EVIDENCE_RAG" })
      });
      
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: res.answer,
        evidence: res.citations || []
      }]);
    } catch (err: any) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `Error: ${err.message}`,
        evidence: []
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto h-[calc(100vh-10rem)] flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-500 pb-4">
      
      {/* Header Area */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-indigo-600" />
            AI Evidence Assistant
          </h1>
          <p className="text-slate-500 text-sm mt-1 max-w-2xl font-medium">
            Search across statutory acts and policy documents using dual BM25 + dense vector retrieval. 
            All responses include verifiable verbatim citations.
          </p>
        </div>
        <div className="bg-emerald-50 text-emerald-700 border border-emerald-200/60 px-3 py-1.5 rounded-lg flex items-center gap-2 text-xs font-bold shadow-sm shrink-0">
          <ShieldCheck className="w-4 h-4" /> ZERO HALLUCINATION GUARDRAILS ACTIVE
        </div>
      </div>

      {/* Main Interface Layout */}
      <div className="flex-1 bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden flex flex-col lg:flex-row">
        
        {/* Chat Area */}
        <div className="flex-1 flex flex-col border-r border-slate-100 relative bg-slate-50/30">
          <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar relative">
            
            {/* Background Decoration */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-indigo-100/50 rounded-full blur-[80px] pointer-events-none"></div>

            <div className="relative z-10 flex flex-col gap-6">
              {messages.map((m, i) => (
                <div key={i} className={clsx("flex gap-4 max-w-3xl", m.role === 'user' ? "ml-auto" : "")}>
                  
                  {m.role === 'assistant' && (
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-700 text-white flex items-center justify-center shrink-0 shadow-md shadow-indigo-200 mt-1">
                      <Bot className="w-4 h-4" />
                    </div>
                  )}
                  
                  <div className={clsx(
                    "p-4 rounded-2xl text-sm leading-relaxed shadow-sm",
                    m.role === 'user' 
                      ? "bg-indigo-600 text-white rounded-tr-sm" 
                      : "bg-white border border-slate-100 text-slate-700 rounded-tl-sm"
                  )}>
                    {m.content}
                  </div>

                  {m.role === 'user' && (
                    <div className="w-8 h-8 rounded-xl bg-slate-200 overflow-hidden shrink-0 shadow-sm mt-1 border border-slate-100">
                      <img src={profileAvatar || defaultAvatar} alt="User" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
              ))}
              
              {loading && (
                <div className="flex gap-4 max-w-3xl">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-400 to-indigo-600 text-white flex items-center justify-center shrink-0 shadow-sm mt-1 animate-pulse">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div className="p-4 rounded-2xl rounded-tl-sm shadow-sm bg-white border border-indigo-100 text-indigo-500 flex items-center gap-3 text-sm font-medium">
                    <Search className="w-4 h-4 animate-spin" /> Scanning statutory evidence & policy repositories...
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>
          
          <div className="p-4 bg-white border-t border-slate-100">
            <form onSubmit={handleSubmit} className="relative flex items-center max-w-4xl mx-auto">
              <input 
                type="text" 
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Ask about agricultural land conversion, LARR, SVAMITVA..."
                className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100/50 rounded-xl py-3.5 pl-4 pr-14 text-sm transition-all outline-none shadow-sm"
                disabled={loading}
              />
              <button 
                type="submit" 
                disabled={!query.trim() || loading}
                className="absolute right-2 p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors shadow-sm"
              >
                <CornerDownLeft className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>

        {/* Evidence Panel */}
        <div className="w-96 bg-slate-50/50 flex flex-col hidden lg:flex border-l border-slate-100">
          <div className="p-5 border-b border-slate-100 bg-white flex items-center justify-between">
            <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-indigo-600" /> Statutory Sources
            </h3>
            <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded">RAG</span>
          </div>
          <div className="flex-1 overflow-y-auto p-5 space-y-4 custom-scrollbar">
            {messages.length > 0 && messages[messages.length - 1].role === 'assistant' && messages[messages.length - 1].evidence?.length > 0 ? (
              messages[messages.length - 1].evidence.map((cit: any, i: number) => (
                <div key={i} className="bg-white p-4 rounded-xl border border-slate-100 hover:border-indigo-200 hover:shadow-md transition-all cursor-pointer group relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-1 rounded">Source [{i+1}]</span>
                    <span className="text-[10px] font-bold text-slate-400">Score: {cit.score.toFixed(3)}</span>
                  </div>
                  
                  <h4 className="text-xs font-bold text-slate-800 group-hover:text-indigo-700 transition-colors leading-snug mb-2">
                    {cit.title}
                  </h4>
                  
                  <div className="bg-slate-50 p-2 rounded text-[11px] text-slate-600 leading-relaxed border-l-2 border-indigo-200 italic">
                    "{cit.snippet}..."
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-slate-400 flex flex-col items-center justify-center h-full opacity-60">
                <Search className="w-10 h-10 mb-3 text-slate-300" />
                <p className="text-sm font-medium">No active evidence context.</p>
                <p className="text-xs mt-1">Ask a question to retrieve sources.</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
