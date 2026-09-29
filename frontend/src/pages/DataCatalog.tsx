import { useState, useEffect } from 'react';
import { Database, Download, ExternalLink } from 'lucide-react';
import { fetchApi } from '../services/api';

export function DataCatalog() {
  const [datasets, setDatasets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApi<any>('/datasets/')
      .then(data => {
        if (data.status === 'SUCCESS') setDatasets(data.datasets);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <Database className="text-gov-blue" />
          Data Catalog
        </h1>
        <p className="text-slate-500 text-sm mt-1">Official registry of spatial and non-spatial datasets</p>
      </div>
      
      {loading ? (
        <div className="animate-pulse space-y-4">
          {[1,2,3].map(i => <div key={i} className="h-32 bg-slate-100 rounded-lg"></div>)}
        </div>
      ) : (
        <div className="grid gap-4">
          {datasets.map(ds => (
            <div key={ds.id} className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between gap-4">
              <div>
                <h3 className="font-semibold text-lg text-slate-800">{ds.name}</h3>
                <p className="text-sm text-slate-600 mt-1 max-w-3xl">{ds.description}</p>
                <div className="flex items-center gap-4 mt-3 text-xs text-slate-500 font-medium">
                  <span className="bg-slate-100 px-2 py-1 rounded">Source: {ds.source}</span>
                  <span className="bg-slate-100 px-2 py-1 rounded">Format: {ds.format_type}</span>
                  <span className="bg-slate-100 px-2 py-1 rounded">Coverage: {ds.geographic_coverage}</span>
                </div>
              </div>
              <div className="flex md:flex-col gap-2 shrink-0">
                <button onClick={() => alert("Download is currently unavailable. Contact Administrator.")} className="flex items-center justify-center gap-2 bg-gov-blue text-white px-4 py-2 rounded text-sm hover:bg-gov-navy transition-colors">
                  <Download className="w-4 h-4" /> Download
                </button>
                <button onClick={() => alert("API View is currently unavailable.")} className="flex items-center justify-center gap-2 border border-slate-300 text-slate-700 px-4 py-2 rounded text-sm hover:bg-slate-50 transition-colors">
                  <ExternalLink className="w-4 h-4" /> View API
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
