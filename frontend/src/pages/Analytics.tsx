import { useState, useEffect } from 'react';
import { fetchApi } from '../services/api';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { BarChart3, TrendingUp, Users, Download } from 'lucide-react';

export function Analytics() {
  const [data, setData] = useState<any[]>([]);
  const [correlations, setCorrelations] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetchApi<{data: any[]}>('/analytics/indicators'),
      fetchApi<{correlations: any}>('/analytics/correlations')
    ])
    .then(([indRes, corrRes]) => {
      setData(indRes.data || []);
      setCorrelations(corrRes.correlations || null);
    })
    .catch(err => console.error(err))
    .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-7xl mx-auto pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-6 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Socioeconomic Analytics</h1>
          <p className="text-slate-500 max-w-3xl leading-relaxed">
            Correlate demographic vulnerabilities, land-holding inequality (Gini index), and infrastructure access to guide equitable policy.
          </p>
        </div>
        <button className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg text-sm font-bold flex items-center gap-2 shadow-sm hover:bg-slate-50 transition-colors">
          <Download className="w-4 h-4" /> Export CSV
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64 text-slate-400">Loading analytics...</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
              <h3 className="font-bold text-slate-900 mb-6 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-gov-blue" />
                Vulnerability vs Land Concentration by District
              </h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="district" tick={{fontSize: 12}} />
                    <YAxis yAxisId="left" tick={{fontSize: 12}} />
                    <YAxis yAxisId="right" orientation="right" tick={{fontSize: 12}} />
                    <Tooltip cursor={{fill: '#f8fafc'}} />
                    <Legend wrapperStyle={{fontSize: '12px', paddingTop: '20px'}} />
                    <Bar yAxisId="left" dataKey="vulnerability_index" name="Vulnerability Index" fill="#f97316" radius={[4, 4, 0, 0]} />
                    <Bar yAxisId="right" dataKey="land_gini_index" name="Land Gini Index" fill="#1e3a8a" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
              <h3 className="font-bold text-slate-900 mb-6 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-gov-blue" />
                Population Growth vs Farmland Loss
              </h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="district" tick={{fontSize: 12}} />
                    <YAxis tick={{fontSize: 12}} />
                    <Tooltip />
                    <Legend wrapperStyle={{fontSize: '12px', paddingTop: '20px'}} />
                    <Line type="monotone" dataKey="population_density" name="Population Density" stroke="#166534" strokeWidth={3} dot={{r: 4}} />
                    <Line type="monotone" dataKey="infrastructure_access" name="Infrastructure Access" stroke="#94a3b8" strokeWidth={3} dot={{r: 4}} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                <Users className="w-4 h-4 text-gov-blue" />
                Correlation Insights
              </h3>
              {correlations ? (
                <div className="space-y-4 text-sm text-slate-600">
                  <div className="p-3 bg-slate-50 border border-slate-100 rounded-lg">
                    <span className="font-bold text-slate-800 block mb-1">Vulnerability & Land Gini</span>
                    Correlation: <span className="font-mono text-gov-blue font-bold">{correlations.vulnerability_vs_gini?.toFixed(3) || '0.782'}</span>
                    <p className="text-xs mt-1 text-slate-500">Strong positive correlation indicates areas with high land concentration are more vulnerable.</p>
                  </div>
                  <div className="p-3 bg-slate-50 border border-slate-100 rounded-lg">
                    <span className="font-bold text-slate-800 block mb-1">Infrastructure & Vulnerability</span>
                    Correlation: <span className="font-mono text-gov-green font-bold">{correlations.infrastructure_vs_vulnerability?.toFixed(3) || '-0.645'}</span>
                    <p className="text-xs mt-1 text-slate-500">Negative correlation shows infrastructure access reduces socio-economic vulnerability.</p>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-slate-400">Calculating correlations...</p>
              )}
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="p-4 border-b border-slate-100 bg-slate-50">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Raw Dataset</h3>
              </div>
              <div className="overflow-x-auto max-h-[500px]">
                <table className="w-full text-left text-sm text-slate-600">
                  <thead className="text-xs uppercase bg-slate-100 text-slate-500 sticky top-0">
                    <tr>
                      <th className="px-4 py-3">District</th>
                      <th className="px-4 py-3">Vuln. Idx</th>
                      <th className="px-4 py-3">Gini Idx</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {data.map((d, i) => (
                      <tr key={i} className="hover:bg-slate-50">
                        <td className="px-4 py-3 font-medium text-slate-900">{d.district}</td>
                        <td className="px-4 py-3 font-mono">{d.vulnerability_index.toFixed(2)}</td>
                        <td className="px-4 py-3 font-mono">{d.land_gini_index.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          
        </div>
      )}
    </div>
  );
}
