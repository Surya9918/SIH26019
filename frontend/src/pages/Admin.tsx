import { useState, useEffect } from 'react';
import { Settings, Users, Database, FileText, Map, ShieldCheck } from 'lucide-react';

export function Admin() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // We pass admin token or rely on CORS credentials
    // For demo, we just fetch assuming authentication is handled or mock token
    fetch('http://localhost:8000/api/admin/stats', {
      headers: { 'Authorization': 'Bearer test' } // Simplified for demo
    })
      .then(res => res.json())
      .then(data => {
        if (data.status === 'SUCCESS') setStats(data.statistics);
        setLoading(false);
      })
      .catch(console.error);
  }, []);

  const cards = stats ? [
    { label: 'Registered Users', value: stats.registered_users, icon: Users, color: 'text-blue-600', bg: 'bg-blue-100' },
    { label: 'Indexed Documents', value: stats.indexed_documents, icon: FileText, color: 'text-indigo-600', bg: 'bg-indigo-100' },
    { label: 'Registered Datasets', value: stats.registered_datasets, icon: Database, color: 'text-purple-600', bg: 'bg-purple-100' },
    { label: 'Simulated Scenarios', value: stats.simulated_scenarios, icon: Map, color: 'text-green-600', bg: 'bg-green-100' },
    { label: 'Provenance Blocks', value: stats.cryptographic_provenance_blocks, icon: ShieldCheck, color: 'text-amber-600', bg: 'bg-amber-100' },
  ] : [];

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <Settings className="text-slate-600" />
          Platform Administration
        </h1>
        <p className="text-slate-500 text-sm mt-1">System overview and governance metrics</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1,2,3,4,5].map(i => <div key={i} className="h-32 bg-slate-100 animate-pulse rounded-lg"></div>)}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map((card, i) => {
            const Icon = card.icon;
            return (
              <div key={i} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
                <div className={`p-4 rounded-full ${card.bg}`}>
                  <Icon className={`w-8 h-8 ${card.color}`} />
                </div>
                <div>
                  <div className="text-3xl font-bold text-slate-800">{card.value}</div>
                  <div className="text-sm font-medium text-slate-500 uppercase tracking-wider mt-1">{card.label}</div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
