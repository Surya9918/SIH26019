import { useState, useEffect } from 'react';
import { 
  ArrowUpRight, 
  Search, 
  Map as MapIcon, 
  ArrowRight,
  FileText,
  Database,
  Activity,
  Box,
  TrendingUp,
  AlertTriangle,
  Lightbulb,
  Search as SearchIcon,
  MapPin,
  PlaySquare,
  Download,
  ChevronRight
} from 'lucide-react';
import { MapContainer, TileLayer, ZoomControl } from 'react-leaflet';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import 'leaflet/dist/leaflet.css';
import clsx from 'clsx';

function MetricCard({ title, value, icon: Icon, colorClass, shadowClass }: any) {
  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between hover:-translate-y-0.5 transition-transform cursor-pointer relative overflow-hidden group">
      <div>
        <div className="text-2xl font-black text-slate-800 tracking-tight mb-1">{value}</div>
        <h3 className="text-sm font-semibold text-slate-500">{title}</h3>
      </div>
      <div className={clsx("w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-md relative z-10", colorClass, shadowClass)}>
        <Icon className="w-5 h-5" />
      </div>
      {/* Background glow on hover */}
      <div className={clsx("absolute -right-4 -bottom-4 w-24 h-24 rounded-full blur-2xl opacity-0 group-hover:opacity-20 transition-opacity", colorClass)}></div>
    </div>
  );
}

const LAND_USE_DATA = [
  { name: 'Agriculture', value: 46.2, color: '#10b981' }, // emerald-500
  { name: 'Forest', value: 21.3, color: '#059669' }, // emerald-600
  { name: 'Built-up', value: 8.7, color: '#f59e0b' }, // amber-500
  { name: 'Water', value: 4.1, color: '#3b82f6' }, // blue-500
  { name: 'Barren', value: 19.7, color: '#94a3b8' }, // slate-400
];

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
    <div className="max-w-[1600px] mx-auto pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* HERO SECTION */}
      <div className="bg-gradient-to-r from-slate-100 to-slate-200 rounded-3xl p-8 mb-8 relative overflow-hidden border border-slate-200/60 shadow-sm flex flex-col md:flex-row items-center min-h-[280px]">
        {/* Background Image/Graphic Placeholder */}
        <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-[url('https://images.unsplash.com/photo-1536696579225-b1a77452d3a9?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center opacity-40 mix-blend-overlay [mask-image:linear-gradient(to_right,transparent,black)]"></div>
        
        <div className="relative z-10 w-full md:w-3/5 pr-8">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">WELCOME BACK, SURIYA</div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-4 leading-tight">
            Explore. Analyze. Innovate.
          </h1>
          <p className="text-slate-600 text-lg mb-8 font-medium">
            Your central hub for land research, policy, and geospatial intelligence.
          </p>
          
          <div className="relative max-w-xl group shadow-lg rounded-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-indigo-600" />
            <input 
              type="text" 
              placeholder="Search across datasets, policies, research papers, maps..."
              className="w-full bg-white border-none py-3.5 pl-12 pr-12 rounded-full text-slate-700 shadow-sm outline-none focus:ring-4 focus:ring-indigo-500/20"
            />
            <button className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 bg-indigo-600 text-white rounded-full flex items-center justify-center hover:bg-indigo-700 transition-colors">
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Hero Right - Stats Cards */}
        <div className="relative z-10 w-full md:w-2/5 mt-8 md:mt-0 flex flex-col gap-3">
          <div className="bg-white/80 backdrop-blur-md rounded-xl p-3 flex items-center gap-4 shadow-sm border border-white/50">
            <div className="w-10 h-10 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center font-black">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xl font-black text-slate-800 leading-none">{stats ? stats.indexed_documents : '12,482'}</div>
              <div className="text-xs font-medium text-slate-500">Research Publications</div>
            </div>
          </div>
          <div className="bg-white/80 backdrop-blur-md rounded-xl p-3 flex items-center gap-4 shadow-sm border border-white/50">
            <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center font-black">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xl font-black text-slate-800 leading-none">{stats ? stats.registered_datasets : '8,732'}</div>
              <div className="text-xs font-medium text-slate-500">Datasets</div>
            </div>
          </div>
          <div className="bg-white/80 backdrop-blur-md rounded-xl p-3 flex items-center gap-4 shadow-sm border border-white/50">
            <div className="w-10 h-10 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center font-black">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xl font-black text-slate-800 leading-none">{stats ? stats.simulated_scenarios : '1,245'}</div>
              <div className="text-xs font-medium text-slate-500">Policy Documents</div>
            </div>
          </div>
          <div className="bg-white/80 backdrop-blur-md rounded-xl p-3 flex items-center gap-4 shadow-sm border border-white/50">
            <div className="w-10 h-10 rounded-lg bg-rose-100 text-rose-600 flex items-center justify-center font-black">
              <Box className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xl font-black text-slate-800 leading-none">632</div>
              <div className="text-xs font-medium text-slate-500">Case Studies</div>
            </div>
          </div>
        </div>
      </div>

      {/* 4 HORIZONTAL CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex flex-col justify-between group hover:shadow-md transition-all cursor-pointer">
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 bg-blue-600 text-white rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/30">
              <FileText className="w-5 h-5" />
            </div>
            <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-1 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> Live
            </span>
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-800">Verified Research</h3>
            <p className="text-xs font-medium text-slate-500">Statutory Acts, Indexed</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex flex-col justify-between group hover:shadow-md transition-all cursor-pointer">
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 bg-emerald-600 text-white rounded-xl flex items-center justify-center shadow-lg shadow-emerald-600/30">
              <Database className="w-5 h-5" />
            </div>
            <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-1 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> Live
            </span>
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-800">Registered Datasets</h3>
            <p className="text-xs font-medium text-slate-500">Cadastral layers, satellite data</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex flex-col justify-between group hover:shadow-md transition-all cursor-pointer">
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 bg-violet-600 text-white rounded-xl flex items-center justify-center shadow-lg shadow-violet-600/30">
              <Activity className="w-5 h-5" />
            </div>
            <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-1 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> Live
            </span>
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-800">Policy Scenarios</h3>
            <p className="text-xs font-medium text-slate-500">Simulations executed</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex flex-col justify-between group hover:shadow-md transition-all cursor-pointer">
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 bg-orange-600 text-white rounded-xl flex items-center justify-center shadow-lg shadow-orange-600/30">
              <Box className="w-5 h-5" />
            </div>
            <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-1 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> Live
            </span>
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-800">Innovation Blocks</h3>
            <p className="text-xs font-medium text-slate-500">SIH-2026/Marathon Ledger</p>
          </div>
        </div>
      </div>

      {/* MIDDLE SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 mb-5">
        
        {/* Map Card */}
        <div className="lg:col-span-6 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col h-[400px]">
          <div className="p-4 border-b border-slate-100 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-indigo-50 text-indigo-600 rounded">
                <MapIcon className="w-4 h-4" />
              </div>
              <h3 className="text-base font-bold text-slate-800">Geospatial Intelligence Snapshot</h3>
            </div>
            <button className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1">
              View Map <ArrowRight className="w-3 h-3" />
            </button>
          </div>
          <div className="flex-1 relative bg-slate-900">
            {/* Layers Overlay */}
            <div className="absolute top-4 left-4 z-[1000] bg-white rounded-xl shadow-lg w-48 overflow-hidden flex flex-col">
              <div className="p-3 bg-slate-50 border-b border-slate-100 text-xs font-bold text-slate-800">Layers</div>
              <div className="p-2 flex flex-col gap-1">
                {[
                  { label: 'Land Use', active: true },
                  { label: 'Climate Risk', active: true },
                  { label: 'Land Disputes', active: false },
                  { label: 'Infrastructure', active: false },
                  { label: 'Administrative Boundaries', active: false },
                ].map((l, i) => (
                  <label key={i} className="flex items-center gap-2 px-2 py-1.5 hover:bg-slate-50 rounded cursor-pointer">
                    <input type="checkbox" checked={l.active} readOnly className="w-3 h-3 text-indigo-600 rounded-sm border-slate-300 focus:ring-indigo-500" />
                    <span className="text-xs text-slate-700 font-medium">{l.label}</span>
                  </label>
                ))}
              </div>
              <div className="p-2 border-t border-slate-100">
                <div className="text-[10px] font-bold text-slate-400 uppercase mb-2 ml-1">View</div>
                <div className="flex bg-slate-100 p-1 rounded-lg">
                  <button className="flex-1 py-1 text-xs font-bold bg-white shadow rounded text-indigo-700">Map</button>
                  <button className="flex-1 py-1 text-xs font-bold text-slate-500 hover:text-slate-800">Satellite</button>
                </div>
              </div>
            </div>
            
            {/* Map Legend Overlay */}
            <div className="absolute top-4 right-4 z-[1000] bg-white rounded-xl shadow-lg p-3">
              <div className="flex flex-col gap-2">
                {[
                  { label: 'Urban', color: 'bg-red-500' },
                  { label: 'Agriculture', color: 'bg-emerald-500' },
                  { label: 'Forest', color: 'bg-emerald-700' },
                  { label: 'Water', color: 'bg-blue-500' },
                  { label: 'Barren', color: 'bg-slate-400' },
                ].map((l, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className={clsx("w-2 h-2 rounded-full", l.color)}></div>
                    <span className="text-[10px] font-bold text-slate-600">{l.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <MapContainer 
              center={[22.5937, 78.9629]} 
              zoom={4} 
              zoomControl={false}
              className="w-full h-full z-0"
            >
              <TileLayer
                url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
              />
              <ZoomControl position="bottomright" />
            </MapContainer>
          </div>
        </div>

        {/* Land Use Chart */}
        <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col h-[400px]">
          <div className="p-4 border-b border-slate-100">
            <h3 className="text-base font-bold text-slate-800 leading-tight">Land Use Distribution</h3>
            <p className="text-xs text-slate-500 font-medium">Across India (in %)</p>
          </div>
          <div className="flex-1 p-4 flex flex-col items-center justify-center relative">
            <div className="h-48 w-full relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={LAND_USE_DATA}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                    stroke="none"
                  >
                    {LAND_USE_DATA.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: any) => [`${value}%`, 'Area']}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-xs font-medium text-slate-500">Total Land</span>
                <span className="text-sm font-bold text-slate-800">328.7 M ha</span>
              </div>
            </div>
            
            <div className="w-full mt-4 grid grid-cols-2 gap-x-2 gap-y-3">
              {LAND_USE_DATA.map((item, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }}></div>
                    <span className="text-[11px] font-medium text-slate-600">{item.name}</span>
                  </div>
                  <span className="text-[11px] font-bold text-slate-800">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Climate Risk */}
        <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col h-[400px]">
          <div className="p-4 border-b border-slate-100">
            <h3 className="text-base font-bold text-slate-800 leading-tight">Climate Risk Overview</h3>
            <p className="text-xs text-slate-500 font-medium">High risk zones across India</p>
          </div>
          <div className="flex-1 p-4 relative flex items-center justify-center bg-slate-50">
            {/* Placeholder for India Risk Map graphic to match screenshot */}
            <div className="w-48 h-56 bg-[url('https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/India_location_map.svg/800px-India_location_map.svg.png')] bg-contain bg-center bg-no-repeat opacity-80" style={{ filter: 'hue-rotate(-50deg) saturate(300%)' }}></div>
            
            <div className="absolute right-4 top-4 flex flex-col gap-2">
              {[
                { label: 'Very High', color: 'bg-red-600' },
                { label: 'High', color: 'bg-orange-500' },
                { label: 'Moderate', color: 'bg-amber-400' },
                { label: 'Low', color: 'bg-emerald-500' },
              ].map((l, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className={clsx("w-2 h-2 rounded-full", l.color)}></div>
                  <span className="text-[10px] font-bold text-slate-600">{l.label}</span>
                </div>
              ))}
            </div>
            
            <button className="absolute bottom-4 right-4 text-[10px] font-bold text-indigo-700 bg-white border border-indigo-100 px-3 py-1.5 rounded-full shadow-sm hover:bg-indigo-50 transition-colors flex items-center gap-1">
              Explore in GIS <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>

      </div>

      {/* BOTTOM SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 mb-5">
        
        {/* Key Insights */}
        <div className="lg:col-span-6 bg-white rounded-2xl border border-slate-100 shadow-sm flex flex-col">
          <div className="p-4 border-b border-slate-100 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-amber-500" />
              <h3 className="text-base font-bold text-slate-800">Key Insights</h3>
            </div>
            <button className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1">
              View All <ArrowRight className="w-3 h-3" />
            </button>
          </div>
          <div className="p-4 flex flex-col gap-3">
            {[
              { icon: TrendingUp, color: 'text-indigo-600', bg: 'bg-indigo-50', text: 'Urban expansion is increasing by 2.8% annually in top 10 metro regions.', trend: 'up' },
              { icon: AlertTriangle, color: 'text-orange-600', bg: 'bg-orange-50', text: 'High climate vulnerability in 12 coastal districts needs immediate attention.', trend: 'up' },
              { icon: Activity, color: 'text-emerald-600', bg: 'bg-emerald-50', text: 'Policy simulation shows 15% higher agricultural productivity with proposed reforms.', trend: 'up' },
            ].map((insight, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-xl border border-slate-50 hover:bg-slate-50 transition-colors cursor-pointer">
                <div className={clsx("w-8 h-8 rounded-lg flex items-center justify-center shrink-0", insight.bg, insight.color)}>
                  <insight.icon className="w-4 h-4" />
                </div>
                <p className="text-xs font-medium text-slate-700 flex-1 pt-1.5">{insight.text}</p>
                <div className="text-emerald-500 pt-1.5">
                  <ArrowUpRight className="w-4 h-4" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="lg:col-span-6 bg-white rounded-2xl border border-slate-100 shadow-sm flex flex-col">
          <div className="p-4 border-b border-slate-100 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-slate-500" />
              <h3 className="text-base font-bold text-slate-800">Recent Activity</h3>
            </div>
            <button className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1">
              View All <ArrowRight className="w-3 h-3" />
            </button>
          </div>
          <div className="p-4 flex flex-col gap-4">
            {[
              { type: 'New research paper added', title: '"Climate Resilience in Indian Land Systems"', time: '2h ago', color: 'text-blue-600', bg: 'bg-blue-50', icon: FileText },
              { type: 'Policy document updated', title: '"Land Acquisition Act (Amendment)"', time: '4h ago', color: 'text-amber-600', bg: 'bg-amber-50', icon: FileText },
              { type: 'New dataset available', title: '"Satellite Imagery - 2024"', time: '6h ago', color: 'text-indigo-600', bg: 'bg-indigo-50', icon: Database },
              { type: 'Hackathon registration open', title: '"Land Innovation Challenge 2025"', time: '1d ago', color: 'text-rose-600', bg: 'bg-rose-50', icon: Lightbulb },
            ].map((act, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className={clsx("w-8 h-8 rounded-full flex items-center justify-center shrink-0", act.bg, act.color)}>
                  <act.icon className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <div className="text-[10px] font-bold text-slate-500">{act.type}</div>
                  <div className="text-xs font-semibold text-slate-800">{act.title}</div>
                </div>
                <div className="text-[10px] font-medium text-slate-400">{act.time}</div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* QUICK ACCESS STRIP */}
      <div className="flex flex-col lg:flex-row gap-5 items-stretch">
        
        <div className="lg:w-3/4 bg-white rounded-2xl border border-slate-100 shadow-sm p-4 flex flex-col">
          <div className="flex items-center gap-2 mb-3">
            <SearchIcon className="w-4 h-4 text-slate-500" />
            <h3 className="text-sm font-bold text-slate-800">Quick Access</h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { title: 'Search Research', sub: 'Find papers & studies', icon: SearchIcon, color: 'text-blue-600', bg: 'bg-blue-50' },
              { title: 'Explore GIS Maps', sub: 'View land use & risk', icon: MapPin, color: 'text-emerald-600', bg: 'bg-emerald-50' },
              { title: 'Run Policy Simulation', sub: 'Test policy outcomes', icon: PlaySquare, color: 'text-purple-600', bg: 'bg-purple-50' },
              { title: 'Access Datasets', sub: 'Download & analyze', icon: Download, color: 'text-indigo-600', bg: 'bg-indigo-50' },
            ].map((qa, i) => (
              <button key={i} className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 hover:border-indigo-100 hover:bg-indigo-50/30 transition-colors text-left group">
                <div className={clsx("w-8 h-8 rounded-lg flex items-center justify-center shrink-0", qa.bg, qa.color)}>
                  <qa.icon className="w-4 h-4" />
                </div>
                <div className="flex-1 overflow-hidden">
                  <div className="text-xs font-bold text-slate-800 truncate">{qa.title}</div>
                  <div className="text-[9px] font-medium text-slate-500 truncate">{qa.sub}</div>
                </div>
                <ChevronRight className="w-3 h-3 text-slate-300 group-hover:text-indigo-500" />
              </button>
            ))}
          </div>
        </div>

        {/* Innovation Hub Promo */}
        <div className="lg:w-1/4 bg-gradient-to-br from-teal-700 to-emerald-900 rounded-2xl p-5 text-white flex flex-col justify-center relative overflow-hidden group cursor-pointer shadow-sm">
          <div className="absolute right-0 bottom-0 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
          
          <div className="relative z-10">
            <h3 className="text-lg font-black leading-tight mb-2">
              Collaborate. Innovate.<br/>
              Build a Sustainable Future.
            </h3>
            
            <button className="mt-2 text-xs font-bold bg-white text-teal-900 px-4 py-2 rounded-lg hover:bg-teal-50 transition-colors inline-flex items-center gap-2">
              Explore Innovation Hub <ArrowRight className="w-3 h-3" />
            </button>
          </div>
          
          {/* Decorative Leaf Icon */}
          <div className="absolute -bottom-4 -right-2 text-teal-500/30">
            <svg className="w-24 h-24" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.51c-.32-.73-.83-1.37-1.46-1.87-.19-.15-.42-.25-.66-.28L15 15h-1c-.55 0-1-.45-1-1v-2h-1c-.55 0-1-.45-1-1v-2c0-.55-.45-1-1-1H9.86l.73-.73c.18-.18.42-.27.67-.27H13c1.1 0 2-.9 2-2V4.26c3.12 1.49 5.37 4.54 5.9 8.23z" />
            </svg>
          </div>
        </div>

      </div>

    </div>
  );
}
