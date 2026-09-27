import { useState } from 'react';
import { Lightbulb, Send, Bot } from 'lucide-react';

export function InnovationPortal() {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query) return;
    setLoading(true);
    try {
      const res = await fetch('http://localhost:8000/api/ai/orchestrate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query })
      });
      const data = await res.json();
      setResponse(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <Lightbulb className="text-gov-saffron" />
          Innovation Portal
        </h1>
        <p className="text-slate-500 text-sm mt-1">Submit natural language queries to our AI orchestrator for advanced land governance analysis.</p>
      </div>

      <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm mb-6">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <label className="text-sm font-semibold text-slate-700">What do you want to explore?</label>
          <div className="flex gap-2">
            <input 
              type="text" 
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="e.g., Simulate policy scenario for urban expansion in Rangareddy"
              className="flex-1 bg-slate-50 border border-slate-300 rounded px-4 py-2 text-sm focus:outline-none focus:border-gov-blue focus:ring-1 focus:ring-gov-blue"
            />
            <button 
              type="submit" 
              disabled={loading}
              className="bg-gov-blue text-white px-6 py-2 rounded font-medium flex items-center gap-2 hover:bg-gov-navy transition-colors disabled:opacity-50"
            >
              {loading ? 'Processing...' : 'Submit'} <Send className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>

      {response && (
        <div className="bg-slate-900 text-slate-50 p-6 rounded-lg shadow-lg font-mono text-sm relative overflow-hidden animate-in fade-in zoom-in-95">
          <Bot className="absolute top-4 right-4 w-16 h-16 text-slate-800 opacity-50" />
          <h3 className="text-gov-saffron font-bold mb-4 flex items-center gap-2 border-b border-slate-700 pb-2">
            <Bot className="w-5 h-5" /> Orchestrator Response
          </h3>
          <div className="space-y-3 relative z-10">
            <div><span className="text-slate-400">Status:</span> {response.status}</div>
            <div><span className="text-slate-400">Route Assigned:</span> <span className="bg-slate-800 px-2 py-0.5 rounded text-green-400">{response.data.route}</span></div>
            <div>
              <span className="text-slate-400">Extracted Entities:</span> 
              <pre className="mt-1 bg-slate-800 p-2 rounded text-xs">{JSON.stringify(response.data.extracted_entities, null, 2)}</pre>
            </div>
            <div><span className="text-slate-400">Timestamp:</span> {response.data.timestamp}</div>
            <div className="mt-4 p-3 bg-gov-blue/20 border border-gov-blue/30 rounded text-gov-blue font-medium">
              Action delegated to {response.data.route} subsystem.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
