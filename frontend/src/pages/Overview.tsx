import { useState, useEffect } from 'react';
import { ArrowUpRight, Activity, FileText, Database, Box } from 'lucide-react';
import { MapContainer, TileLayer, ZoomControl } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import clsx from 'clsx';

function MetricCard({ title, value, trend, trendLabel, icon: Icon, isPositive }: any) {
  return (
    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className="w-10 h-10 rounded-lg bg-gov-blue/10 flex items-center justify-center text-gov-blue">
          <Icon className="w-5 h-5" />
        </div>
        <div className={clsx(
          "flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full",
          isPositive ? "text-gov-green bg-gov-green/10" : "text-gov-red bg-gov-red/10"
        )}>
          <ArrowUpRight className="w-3 h-3" />
          {trend}
        </div>
      </div>
      <h3 className="text-sm font-semibold text-slate-500 mb-1">{title}</h3>
      <div className="text-2xl font-black text-slate-900 mb-1">{value}</div>
      <p className="text-xs text-slate-400 font-medium">{trendLabel}</p>
    </div>
  );
}

export function Overview() {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    fetch('http://localhost:8000/api/admin/stats')
      .then(res => res.json())
      .then(data => {
        if (data.status === 'SUCCESS') setStats(data.statistics);
      })
      .catch(console.error);
  }, []);

  return (
    <div className="max-w-6xl mx-auto pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <span className="bg-gov-saffron/10 text-gov-saffron text-xs font-bold px-2 py-0.5 rounded border border-gov-saffron/20">DEMO ENVIRONMENT</span>
        </div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Land Governance Intelligence</h1>
        <p className="text-slate-500 max-w-3xl leading-relaxed">
          Evidence, geospatial intelligence and policy analytics for land governance. Integrate statutory records, drone cadastre, and multi-spectral satellite remote sensing into a single decision support system.
        </p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <MetricCard 
          title="Verified Research" 
          value={stats ? stats.indexed_documents : "..."} 
          trend="Live" 
          trendLabel="Statutory Acts" 
          icon={FileText} 
          isPositive={true} 
        />
        <MetricCard 
          title="Registered Datasets" 
          value={stats ? stats.registered_datasets : "..."} 
          trend="Live" 
          trendLabel="Cadastral layers added" 
          icon={Database} 
          isPositive={true} 
        />
        <MetricCard 
          title="Policy Scenarios" 
          value={stats ? stats.simulated_scenarios : "..."} 
          trend="Live" 
          trendLabel="Simulations run" 
          icon={Activity} 
          isPositive={true} 
        />
        <MetricCard 
          title="Provenance Blocks" 
          value={stats ? stats.cryptographic_provenance_blocks : "..."} 
          trend="Secure" 
          trendLabel="SHA-256 Merkle Ledger" 
          icon={Box} 
          isPositive={true} 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Intelligence Feed or Chart */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Geospatial Intelligence Snapshot</h3>
            <div className="h-80 bg-slate-100 rounded-lg border border-slate-200 relative overflow-hidden">
              <MapContainer 
                center={[20.5937, 78.9629]} 
                zoom={4} 
                zoomControl={false}
                className="w-full h-full z-0"
              >
                <TileLayer
                  attribution='&copy; OpenStreetMap'
                  url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                />
                <ZoomControl position="bottomright" />
              </MapContainer>
            </div>
          </div>
        </div>

        {/* Right Sidebar - System Activity */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">Intelligence Feed</h3>
            
            <div className="space-y-4">
              {[
                { time: '10 mins ago', title: 'New LULC Dataset Indexed', type: 'DATA', color: 'bg-blue-500' },
                { time: '1 hour ago', title: 'Policy Scenario #842 Generated', type: 'POLICY', color: 'bg-purple-500' },
                { time: '3 hours ago', title: 'Svamitva Cadastral Map Updated', type: 'GIS', color: 'bg-green-500' },
                { time: 'Yesterday', title: 'LARR Act 2013 Added to RAG', type: 'EVIDENCE', color: 'bg-gov-saffron' },
              ].map((item, i) => (
                <div key={i} className="flex gap-3">
                  <div className="mt-1">
                    <div className={`w-2 h-2 rounded-full ${item.color}`}></div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-800">{item.title}</p>
                    <div className="flex gap-2 text-xs text-slate-500 mt-0.5">
                      <span className="font-semibold">{item.type}</span>
                      <span>•</span>
                      <span>{item.time}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
