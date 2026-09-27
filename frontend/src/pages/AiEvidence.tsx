import { useState } from 'react';
import { Bot, Search, ShieldCheck, CornerDownLeft, FileText } from 'lucide-react';
import clsx from 'clsx';
import { fetchApi } from '../services/api';

export function AiEvidence() {
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<any[]>([
    {
      role: 'assistant',
      content: 'Welcome to the National Land Governance Evidence Assistant. Ask research or statutory policy questions regarding land records modernization, agricultural land conversion, LARR compensation thresholds, or SVAMITVA cadastral mapping.',
      evidence: []
    }
  ]);
  const [loading, setLoading] = useState(false);

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
    <div className="max-w-6xl mx-auto h-[calc(100vh-8rem)] flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Evidence Intelligence</h1>
          <p className="text-slate-500 max-w-3xl leading-relaxed">
            Dual BM25 + dense vector retrieval with strict zero-hallucination guardrails and verifiable verbatim citations.
          </p>
        </div>
        <div className="bg-gov-green/10 text-gov-green border border-gov-green/20 px-3 py-1.5 rounded-lg flex items-center gap-2 text-sm font-bold">
          <ShieldCheck className="w-4 h-4" /> ZERO HALLUCINATION GUARDRAILS ACTIVE
        </div>
      </div>

      <div className="flex-1 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex">
        
        {/* Chat Area */}
        <div className="flex-1 flex flex-col border-r border-slate-200">
          <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50">
            {messages.map((m, i) => (
              <div key={i} className={clsx("flex gap-4 max-w-3xl", m.role === 'user' ? "ml-auto" : "")}>
                {m.role === 'assistant' && (
                  <div className="w-8 h-8 rounded bg-gov-blue text-white flex items-center justify-center shrink-0 shadow-sm mt-1">
                    <Bot className="w-5 h-5" />
                  </div>
                )}
                
                <div className={clsx(
                  "p-4 rounded-xl shadow-sm text-sm leading-relaxed",
                  m.role === 'user' ? "bg-gov-blue text-white" : "bg-white border border-slate-200 text-slate-800"
                )}>
                  {m.content}
                </div>
              </div>
            ))}
            
            {loading && (
              <div className="flex gap-4 max-w-3xl">
                <div className="w-8 h-8 rounded bg-gov-blue text-white flex items-center justify-center shrink-0 shadow-sm mt-1 animate-pulse">
                  <Bot className="w-5 h-5" />
                </div>
                <div className="p-4 rounded-xl shadow-sm bg-white border border-slate-200 text-slate-500 flex items-center gap-2 text-sm">
                  <Search className="w-4 h-4 animate-spin" /> Retrieving statutory evidence...
                </div>
              </div>
            )}
          </div>
          
          <div className="p-4 bg-white border-t border-slate-200">
            <form onSubmit={handleSubmit} className="relative flex items-center">
              <input 
                type="text" 
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Ask about agricultural land conversion, LARR, SVAMITVA..."
                className="w-full bg-slate-100 border-transparent focus:bg-white focus:border-gov-blue focus:ring-2 focus:ring-gov-blue/20 rounded-lg py-3 pl-4 pr-12 text-sm transition-all outline-none"
                disabled={loading}
              />
              <button 
                type="submit" 
                disabled={!query.trim() || loading}
                className="absolute right-2 p-1.5 bg-gov-blue text-white rounded-md hover:bg-gov-hover disabled:opacity-50 transition-colors"
              >
                <CornerDownLeft className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>

        {/* Evidence Panel */}
        <div className="w-80 bg-white flex flex-col hidden lg:flex">
          <div className="p-4 border-b border-slate-200 bg-slate-50/50">
            <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
              <FileText className="w-4 h-4 text-gov-blue" /> Supporting Evidence
            </h3>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length > 0 && messages[messages.length - 1].role === 'assistant' && messages[messages.length - 1].evidence?.length > 0 ? (
              messages[messages.length - 1].evidence.map((cit: any, i: number) => (
                <div key={i} className="bg-slate-50 p-3 rounded-lg border border-slate-200 hover:border-gov-blue/30 transition-colors cursor-pointer group">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[10px] font-bold text-gov-blue bg-gov-blue/10 px-1.5 py-0.5 rounded">Source [{i+1}]</span>
                    <span className="text-[10px] font-medium text-slate-400">Score: {cit.score.toFixed(3)}</span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-800 group-hover:text-gov-blue transition-colors leading-tight mb-2">
                    {cit.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 leading-relaxed border-l-2 border-slate-300 pl-2 italic">
                    "{cit.snippet}..."
                  </p>
                </div>
              ))
            ) : (
              <div className="text-center text-slate-400 text-xs mt-10">
                <Search className="w-8 h-8 mx-auto mb-2 opacity-20" />
                No active evidence context. Ask a question to retrieve sources.
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
