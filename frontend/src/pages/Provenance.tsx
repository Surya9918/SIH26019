import { useState, useEffect } from 'react';
import { ShieldCheck, CheckCircle, AlertTriangle } from 'lucide-react';

export function Provenance() {
  const [ledger, setLedger] = useState<any[]>([]);
  const [verification, setVerification] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('http://localhost:8000/api/provenance/ledger').then(res => res.json()),
      fetch('http://localhost:8000/api/provenance/verify').then(res => res.json())
    ]).then(([ledgerData, verifyData]) => {
      if (ledgerData.status === 'SUCCESS') setLedger(ledgerData.ledger);
      if (verifyData.status === 'SUCCESS') setVerification(verifyData);
      setLoading(false);
    }).catch(console.error);
  }, []);

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <ShieldCheck className="text-gov-blue" />
            Cryptographic Provenance Ledger
          </h1>
          <p className="text-slate-500 text-sm mt-1">Immutable audit trail of all AI decisions and data transformations</p>
        </div>
        
        {verification && (
          <div className={`px-4 py-2 rounded border flex items-center gap-2 font-semibold text-sm ${verification.is_tamper_free ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'}`}>
            {verification.is_tamper_free ? <CheckCircle className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
            {verification.verification_result}
          </div>
        )}
      </div>
      
      {loading ? (
        <div className="animate-pulse space-y-4">
          {[1,2,3].map(i => <div key={i} className="h-24 bg-slate-100 rounded-lg"></div>)}
        </div>
      ) : (
        <div className="space-y-4 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent">
          {ledger.map((block) => (
            <div key={block.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
              <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-gov-blue text-slate-50 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 text-xs font-bold">
                B{block.block_index}
              </div>
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-4 rounded border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-gov-blue bg-gov-blue/10 px-2 py-0.5 rounded">{block.action_type}</span>
                  <span className="text-xs text-slate-400 font-mono">{new Date(block.timestamp).toLocaleString()}</span>
                </div>
                <div className="text-xs font-mono bg-slate-50 p-2 rounded text-slate-600 break-all mb-2 border border-slate-100">
                  <span className="font-semibold text-slate-400 block mb-1">HASH</span>
                  {block.hash}
                </div>
                <p className="text-sm text-slate-700 font-medium">Actor ID: {block.actor_id}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
