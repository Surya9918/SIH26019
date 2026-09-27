import { useState, useEffect } from 'react';
import { Lightbulb, Send, Bot, Award, ChevronRight } from 'lucide-react';
import { fetchApi } from '../services/api';

export function InnovationPortal() {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [initiatives, setInitiatives] = useState<any[]>([]);

  useEffect(() => {
    fetch('http://localhost:8000/api/innovation/initiatives')
      .then(res => res.json())
      .then(data => {
        if (data.status === 'SUCCESS') setInitiatives(data.initiatives);
      })
      .catch(console.error);
  }, []);

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

  const submitProposal = async (id: number) => {
    // In a real app, this would open a modal form.
    alert(`Submitting proposal for Initiative #${id}`);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto flex flex-col md:flex-row gap-8">
      
      {/* Left Column: AI Orchestrator */}
      <div className="flex-1">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Lightbulb className="text-gov-saffron" />
            Innovation Portal
          </h1>
          <p className="text-slate-500 text-sm mt-1">Submit natural language queries to our AI orchestrator or apply for grants and hackathons.</p>
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

      {/* Right Column: Grants & Hackathons */}
      <div className="w-full md:w-96 flex flex-col gap-4">
        <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-2">
          <Award className="w-5 h-5 text-gov-blue" /> Open Initiatives
        </h2>
        {initiatives.length === 0 ? (
          <div className="text-sm text-slate-500 italic">No open initiatives currently available.</div>
        ) : (
          initiatives.map(init => (
            <div key={init.id} className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm flex flex-col">
              <div className="flex justify-between items-start mb-2">
                <span className="bg-gov-blue/10 text-gov-blue text-xs font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                  {init.type}
                </span>
                <span className={`text-xs font-bold px-2 py-0.5 rounded ${init.status === 'OPEN' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'}`}>
                  {init.status}
                </span>
              </div>
              <h3 className="font-semibold text-slate-800 mb-1">{init.title}</h3>
              <p className="text-sm text-slate-600 mb-4 flex-1">{init.description}</p>
              
              <button 
                onClick={() => submitProposal(init.id)}
                className="w-full text-center text-sm font-semibold text-gov-blue border border-gov-blue/30 bg-gov-blue/5 hover:bg-gov-blue hover:text-white py-2 rounded transition-colors"
              >
                Submit Proposal
              </button>
            </div>
          ))
        )}
      </div>

    </div>
  );
}
