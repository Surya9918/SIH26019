import { AlertTriangle } from 'lucide-react';

export function ClimateRisk() {
  return (
    <div className="max-w-6xl mx-auto pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Climate Risk</h1>
        <p className="text-slate-500 max-w-3xl leading-relaxed">
          Explore climate vulnerability and risk indicators across regions.
        </p>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col items-center justify-center py-24 text-center">
        <div className="w-16 h-16 bg-slate-50 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center mb-4 text-slate-400">
          <AlertTriangle className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-bold text-slate-700 mb-2">Risk Assessment Module</h3>
        <p className="text-sm text-slate-500 max-w-sm leading-relaxed">
          The climate risk monitoring tools are currently being integrated. Vulnerability metrics will be available here soon.
        </p>
      </div>
    </div>
  );
}
