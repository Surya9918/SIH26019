import { useState, useEffect } from 'react';
import { Search, Filter, BookOpen } from 'lucide-react';
import { fetchApi } from '../services/api';

export function Publications() {
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApi<{documents: any[]}>('/documents')
      .then(res => setDocuments((res.documents || []).filter(d => 
        d.category === 'Research Paper' || 
        d.document_type === 'RESEARCH_PAPER' ||
        d.category?.toLowerCase().includes('research')
      )))
      .catch(err => console.error("Error fetching docs", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-6xl mx-auto pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Publications</h1>
        <p className="text-slate-500 max-w-3xl leading-relaxed">
          Browse peer-reviewed research publications, scientific journals, and analytical reports.
        </p>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mb-6">
        <div className="p-4 border-b border-slate-100 flex items-center gap-4 bg-slate-50">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search publications by author, title, or journal..."
              className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-gov-blue/20 outline-none"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors">
            <Filter className="w-4 h-4" /> Filters
          </button>
        </div>

        <div className="divide-y divide-slate-100">
          {loading ? (
            <div className="p-8 text-center text-slate-400 text-sm">Loading publications...</div>
          ) : documents.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-sm">No publications found.</div>
          ) : (
            documents.map(doc => (
              <div key={doc.id} className="p-5 hover:bg-slate-50 transition-colors group cursor-pointer flex gap-4">
                <div className="mt-1">
                  <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-lg flex items-center justify-center">
                    <BookOpen className="w-5 h-5" />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-gov-blue transition-colors mb-1">{doc.title}</h3>
                  <div className="flex items-center gap-4 text-xs text-slate-500 mb-2">
                    <span className="font-semibold text-slate-700">{doc.category || doc.document_type}</span>
                    <span>•</span>
                    <span>{doc.author} ({doc.organization})</span>
                    <span>•</span>
                    <span>{doc.publication_date}</span>
                  </div>
                  <p className="text-sm text-slate-600 line-clamp-2">{doc.content}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
