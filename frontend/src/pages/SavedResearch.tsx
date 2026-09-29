import { Bookmark, Search } from 'lucide-react';

export function SavedResearch() {
  return (
    <div className="max-w-6xl mx-auto pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Saved Research</h1>
        <p className="text-slate-500 max-w-3xl leading-relaxed">
          Your bookmarked research papers, policy documents, and evidence.
        </p>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mb-6">
        <div className="p-4 border-b border-slate-100 flex items-center gap-4 bg-slate-50">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search your saved research..."
              className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-gov-blue/20 outline-none"
            />
          </div>
        </div>
        <div className="p-16 text-center">
          <Bookmark className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-slate-700 mb-2">No Saved Research Yet</h3>
          <p className="text-slate-500 text-sm max-w-md mx-auto">
            You haven't bookmarked any research documents. Browse the repository to find and save important papers and policies.
          </p>
        </div>
      </div>
    </div>
  );
}
