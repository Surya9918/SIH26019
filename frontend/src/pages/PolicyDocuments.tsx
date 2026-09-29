import { FileText } from 'lucide-react';

export function PolicyDocuments() {
  return (
    <div className="max-w-6xl mx-auto pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Policy Documents</h1>
        <p className="text-slate-500 max-w-3xl leading-relaxed">
          Central repository for land governance acts, policies, notifications and related evidence.
        </p>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col items-center justify-center py-24 text-center">
        <div className="w-16 h-16 bg-slate-50 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center mb-4 text-slate-400">
          <FileText className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-bold text-slate-700 mb-2">Document Repository</h3>
        <p className="text-sm text-slate-500 max-w-sm leading-relaxed">
          The central policy repository is currently being indexed. Governance acts and statutory evidence will be available here soon.
        </p>
      </div>
    </div>
  );
}
