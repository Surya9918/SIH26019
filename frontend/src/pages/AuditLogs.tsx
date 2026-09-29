import { useState, useEffect } from 'react';
import { Activity, AlertTriangle } from 'lucide-react';
import { fetchApi } from '../services/api';

export function AuditLogs() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchApi<any>('/admin/audit-logs')
      .then(res => {
        if (res.status === 'SUCCESS') setLogs(res.logs || []);
      })
      .catch(err => {
        console.error(err);
        if (err.message?.includes('403') || err.message?.includes('401')) {
          setError("Access Denied: You do not have permission to view audit logs.");
        } else {
          setError("Failed to load audit logs.");
        }
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <Activity className="text-gov-blue" />
          System Audit Logs
        </h1>
        <p className="text-slate-500 text-sm mt-1">Real-time monitoring of all platform activities and access</p>
      </div>

      <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="px-6 py-3">Timestamp</th>
                <th className="px-6 py-3">Actor ID</th>
                <th className="px-6 py-3">Action</th>
                <th className="px-6 py-3">Resource Type</th>
                <th className="px-6 py-3">Resource ID</th>
              </tr>
            </thead>
            <tbody>
              {error ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12">
                    <div className="flex flex-col items-center justify-center text-red-600">
                      <AlertTriangle className="w-8 h-8 mb-2" />
                      <span className="font-bold">Access Denied</span>
                      <span className="text-sm">{error}</span>
                    </div>
                  </td>
                </tr>
              ) : loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500">Loading audit trail...</td>
                </tr>
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500">No audit logs found.</td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id} className="border-b border-slate-100 hover:bg-slate-50/50">
                    <td className="px-6 py-3 font-mono text-xs text-slate-500">{new Date(log.timestamp).toLocaleString()}</td>
                    <td className="px-6 py-3 font-medium text-slate-700">{log.actor_id}</td>
                    <td className="px-6 py-3">
                      <span className="bg-gov-blue/10 text-gov-blue px-2 py-1 rounded text-xs font-bold uppercase">{log.action}</span>
                    </td>
                    <td className="px-6 py-3 text-slate-600">{log.resource_type}</td>
                    <td className="px-6 py-3 font-mono text-xs text-slate-500">{log.resource_id}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
