import { useState } from 'react';
import { FileText, Loader2, Sparkles } from 'lucide-react';
import { fetchApi } from '../services/api';

export function Reports() {
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const generateReport = async () => {
    setLoading(true);
    try {
      const data = await fetchApi<any>('/reports/generate', {
        method: 'POST',
        body: JSON.stringify({
          region: "Telangana (Hyderabad Peri-Urban)",
          topic: "Agricultural Land Conversion & Peri-Urban Sprawl Mitigation"
        })
      });
      if (data.status === 'SUCCESS') setReport(data.report);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <FileText className="text-gov-blue" />
            Automated Policy Reports
          </h1>
          <p className="text-slate-500 text-sm mt-1">Generate AI-authored comprehensive policy briefs based on data evidence.</p>
        </div>
        <button 
          onClick={generateReport}
          disabled={loading}
          className="flex items-center gap-2 bg-gov-blue text-white px-5 py-2 rounded-md hover:bg-gov-navy transition-colors disabled:opacity-50 font-medium text-sm shadow-sm"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
          {loading ? 'Generating...' : 'Generate New Brief'}
        </button>
      </div>

      {report && (
        <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="bg-slate-50 border-b border-slate-200 p-6 text-center">
            <h2 className="text-xl font-bold text-slate-900">{report.title}</h2>
            <p className="text-sm text-slate-500 mt-2">Author: {report.author} | Date: {new Date(report.generated_at).toLocaleDateString()}</p>
          </div>
          <div className="p-6 space-y-6">
            <div>
              <h3 className="font-semibold text-lg text-slate-800 mb-2 border-b pb-1">Executive Summary</h3>
              <p className="text-slate-700 leading-relaxed text-sm">{report.sections.executive_summary}</p>
            </div>
            <div>
              <h3 className="font-semibold text-lg text-slate-800 mb-2 border-b pb-1">Key Findings</h3>
              <ul className="list-disc pl-5 space-y-2 text-sm text-slate-700">
                {report.sections.key_findings.map((f: string, i: number) => <li key={i}>{f}</li>)}
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-lg text-slate-800 mb-2 border-b pb-1">Policy Recommendations</h3>
              <ul className="list-disc pl-5 space-y-2 text-sm text-slate-700">
                {report.sections.policy_recommendations.map((r: string, i: number) => <li key={i}>{r}</li>)}
              </ul>
            </div>
            <div className="bg-slate-50 p-4 rounded border border-slate-100 text-xs font-mono text-slate-500 mt-6 text-center">
              Provenance Block Ref: {report.provenance_block_id}
            </div>
          </div>
        </div>
      )}
      
      {!report && !loading && (
        <div className="text-center py-20 border-2 border-dashed border-slate-200 rounded-lg bg-slate-50">
          <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-slate-600 font-medium">No reports generated yet</h3>
          <p className="text-slate-400 text-sm mt-1">Click the generate button above to create a new AI policy brief.</p>
        </div>
      )}
    </div>
  );
}
