import { useState, useEffect } from 'react';
import { Settings, Users, Database, FileText, Map, ShieldCheck, AlertTriangle } from 'lucide-react';
import { fetchApi } from '../services/api';

export function Admin() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchApi<any>('/admin/stats')
      .then(res => {
        if (res.status === 'SUCCESS') setStats(res.statistics);
      })
      .catch(err => {
        console.error(err);
        if (err.message?.includes('403') || err.message?.includes('401')) {
          setError("Access Denied: You do not have permission to view administrative statistics.");
        } else {
          setError("Failed to load statistics.");
        }
      })
      .finally(() => setLoading(false));
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

      {error ? (
        <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-xl flex items-center gap-4">
          <AlertTriangle className="w-8 h-8" />
          <div>
            <h3 className="font-bold text-lg">Permission Denied</h3>
            <p>{error}</p>
          </div>
        </div>
      ) : loading ? (
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
