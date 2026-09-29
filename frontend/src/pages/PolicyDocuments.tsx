import { useState, useEffect } from 'react';
import { FileText, Loader2 } from 'lucide-react';
import { fetchApi } from '../services/api';

export function PolicyDocuments() {
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchApi<any>('/documents/?category=Policy')
      .then(res => {
        if (res.status === 'SUCCESS') {
          setDocuments(res.documents || []);
        } else {
          setError('Failed to fetch documents from the server.');
        }
      })
      .catch(err => {
        console.error(err);
        setError(err.message || 'An error occurred while fetching documents.');
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-6xl mx-auto pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Policy Documents</h1>
        <p className="text-slate-500 max-w-3xl leading-relaxed">
          Central repository for land governance acts, policies, notifications and related evidence.
        </p>
      </div>
      
      {loading ? (
        <div className="flex justify-center p-12">
          <Loader2 className="w-8 h-8 animate-spin text-gov-blue" />
        </div>
      ) : error ? (
        <div className="bg-red-50 rounded-xl border border-red-100 p-8 text-center text-red-600">
          <p className="font-bold">{error}</p>
        </div>
      ) : documents.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col items-center justify-center py-24 text-center">
          <div className="w-16 h-16 bg-slate-50 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center mb-4 text-slate-400">
            <FileText className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-700 mb-2">Document Repository Empty</h3>
          <p className="text-sm text-slate-500 max-w-sm leading-relaxed">
            The central policy repository is currently being indexed. Governance acts and statutory evidence will be available here soon.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {documents.map((doc: any) => (
            <div key={doc.id} className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm flex gap-4">
              <div className="w-12 h-12 bg-gov-blue/10 text-gov-blue rounded flex items-center justify-center shrink-0">
                <FileText className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600 mb-2 inline-block">
                    {doc.document_type || 'Policy Document'}
                  </span>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded ${doc.verification_status === 'VERIFIED' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                    {doc.verification_status || 'PENDING'}
                  </span>
                </div>
                <h3 className="font-bold text-slate-800 mb-1">{doc.title}</h3>
                <p className="text-sm text-slate-500 mb-3 line-clamp-2">{doc.description}</p>
                <div className="flex items-center gap-4 text-xs font-medium text-slate-400">
                  <span>Author: {doc.author}</span>
                  <span>Year: {doc.publication_date}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
