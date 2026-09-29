import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowRight,
  FileText,
  Database,
  Activity,
  Box,
  AlertTriangle,
  Lightbulb,
  Search,
  MapPin,
  PlaySquare,
  Zap,
  Globe
} from 'lucide-react';
import { MapContainer, TileLayer, GeoJSON, useMap } from 'react-leaflet';
import L from 'leaflet';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import 'leaflet/dist/leaflet.css';
import indiaGeoJson from '../assets/india_states.json';
import clsx from 'clsx';
import { formatTimeAgo } from '../utils/time';

// Simple SVG sparkline component for visual enhancement
function Sparkline({ color, trend }: { color: string, trend: 'up' | 'down' }) {
  return (
    <svg width="60" height="20" viewBox="0 0 60 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      {trend === 'up' ? (
        <path d="M0 18 L15 12 L30 15 L45 5 L60 2" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      ) : (
        <path d="M0 2 L15 8 L30 5 L45 15 L60 18" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      )}
    </svg>
  );
}

const PALETTES = {
  'Land Use': [
    { type: 'Agriculture', color: '#10B981', fill: 'fill-emerald-500' },
    { type: 'Forest', color: '#047857', fill: 'fill-emerald-700' },
    { type: 'Urban', color: '#F59E0B', fill: 'fill-amber-500' },
    { type: 'Water', color: '#3B82F6', fill: 'fill-blue-500' },
    { type: 'Barren', color: '#94A3B8', fill: 'fill-slate-400' },
  ],
  'Climate Risk': [
    { type: 'Low', color: '#34D399', fill: 'fill-emerald-400' },
    { type: 'Moderate', color: '#FBBF24', fill: 'fill-amber-400' },
    { type: 'High', color: '#F87171', fill: 'fill-red-400' },
    { type: 'Extreme', color: '#B91C1C', fill: 'fill-red-700' },
  ]
};

function hashString(str: string) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash);
}

function MapBoundsFit({ data }: { data: any }) {
  const map = useMap();
  useEffect(() => {
    if (data) {
      const geoJsonLayer = L.geoJSON(data);
      const fit = () => {
        map.fitBounds(geoJsonLayer.getBounds(), { 
          padding: [20, 20],
          maxZoom: 6
        });
      };
      fit();
      window.addEventListener('resize', fit);
      return () => window.removeEventListener('resize', fit);
    }
  }, [data, map]);
  return null;
}

const LAND_USE_DATA = [
  { name: 'Agriculture', value: 46.2, color: '#10B981' }, // bhu-success
  { name: 'Forest', value: 21.3, color: '#008B72' }, // bhu-primary
  { name: 'Built-up (Urban)', value: 8.7, color: '#F59E0B' }, // bhu-warning
  { name: 'Water', value: 4.1, color: '#2563EB' }, // bhu-blue
  { name: 'Barren', value: 19.7, color: '#94A3B8' }, // slate-400
];

export function Overview() {
  const navigate = useNavigate();
  const [stats, setStats] = useState<any>(null);
  const [activeLayer, setActiveLayer] = useState<string | null>(null);
  const [hoveredState, setHoveredState] = useState<any>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [layersOpen, setLayersOpen] = useState(false);
  const [mapView, setMapView] = useState<'map' | 'satellite' | 'terrain'>('satellite');
  
  const handleMapViewChange = (mode: 'map' | 'satellite' | 'terrain') => {
    setMapView(mode);
    if (mode === 'terrain') {
      setActiveLayer(null);
    }
  };

  const [searchQuery, setSearchQuery] = useState('');
  const layersRef = useRef<HTMLDivElement>(null);

  const [dashKpis, setDashKpis] = useState(true);
  const [dashActivity, setDashActivity] = useState(true);
  const [dashQuickAccess, setDashQuickAccess] = useState(true);
  const [dashInnovation, setDashInnovation] = useState(true);

  const [mapLabels, setMapLabels] = useState(true);
  const [mapBoundaries, setMapBoundaries] = useState(true);

  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [profileName, setProfileName] = useState('Suriya');

  useEffect(() => {
    const fetchActivity = () => {
      const saved = localStorage.getItem('bhu_notifications');
      if (saved) {
        setRecentActivity(JSON.parse(saved));
      } else {
        setRecentActivity([]); // Or we could use INITIAL_DATA if we wanted, but empty is honest if none exists. Actually, Notifications uses INITIAL_DATA if none exists. Let's match it to be safe, or just leave it empty. The prompt says "If none exists: show an empty state."
      }
    };
    fetchActivity();
    
    // Listen for cross-tab or same-window storage changes if we dispatch them
    const handleStorageChange = () => fetchActivity();
    window.addEventListener('storage', handleStorageChange);
    // Add custom event just in case
    window.addEventListener('bhu_notifications_changed', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('bhu_notifications_changed', handleStorageChange);
    };
  }, []);

  useEffect(() => {
    const applySettings = () => {
      const settingsStr = localStorage.getItem('bhu_settings');
      if (settingsStr) {
        const p = JSON.parse(settingsStr);
        if (p.profileName) {
          // just take first name for welcome message if there are spaces
          setProfileName(p.profileName.split(' ')[0].toUpperCase());
        }
        setDashKpis(p.dashKpis ?? true);
        setDashActivity(p.dashActivity ?? true);
        setDashQuickAccess(p.dashQuickAccess ?? true);
        setDashInnovation(p.dashInnovation ?? true);
        
        if (p.mapView) setMapView(p.mapView.toLowerCase() as 'map'|'satellite'|'terrain');
        if (p.mapLayer) setActiveLayer(p.mapLayer === 'None' ? null : p.mapLayer);
        setMapLabels(p.mapLabels ?? true);
        setMapBoundaries(p.mapBoundaries ?? true);
      }
    };
    applySettings();
    window.addEventListener('bhu_settings_changed', applySettings);
    return () => window.removeEventListener('bhu_settings_changed', applySettings);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    function handleClickOutside(event: MouseEvent) {
      if (layersRef.current && !layersRef.current.contains(event.target as Node)) {
        setLayersOpen(false);
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setLayersOpen(false);
      }
    }
    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  useEffect(() => {
    fetch('http://localhost:8000/api/admin/stats')
      .then(res => res.json())
      .then(data => {
        if (data.status === 'SUCCESS') setStats(data.statistics);
      })
      .catch(console.error);
  }, []);

  return (
    <div className="max-w-[1600px] mx-auto pb-12 animate-in fade-in duration-500 text-slate-900 space-y-6">
      
      {/* ROW 1: COMMAND CENTER (HERO) */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-10">
        <div className="absolute top-0 right-0 w-2/3 h-full opacity-10 bg-[url('https://images.unsplash.com/photo-1536696579225-b1a77452d3a9?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center [mask-image:linear-gradient(to_left,white,transparent)] pointer-events-none"></div>
        
        <div className="relative z-10 w-full lg:w-3/5">
          <div className="text-[11px] font-bold text-bhu-primary uppercase tracking-widest mb-4 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-bhu-primary"></span>
            WELCOME BACK, {profileName}
          </div>
          <h1 className="text-3xl lg:text-[2.5rem] font-black text-slate-900 tracking-tight leading-[1.1] mb-4">
            National Land Governance Intelligence
          </h1>
          <p className="text-slate-500 text-sm mb-8 leading-relaxed max-w-xl font-medium">
            Explore, analyze, and innovate. Your central command for land research, policy simulation, and geospatial analytics.
          </p>
          
          <form 
            onSubmit={(e) => { e.preventDefault(); if (searchQuery.trim()) navigate(`/research/repository?q=${encodeURIComponent(searchQuery)}`); }}
            className="relative max-w-xl group bg-slate-50 rounded-xl border border-slate-200 flex items-center focus-within:bg-white focus-within:border-bhu-primary/50 focus-within:ring-4 focus-within:ring-bhu-primary/10 transition-all"
          >
            <Search className="absolute left-4 w-5 h-5 text-slate-400 group-focus-within:text-bhu-primary transition-colors" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search research, datasets, policies, maps, and evidence..."
              className="w-full bg-transparent border-none py-4 pl-12 pr-14 text-sm text-slate-900 outline-none rounded-xl"
            />
            <button type="submit" className="absolute right-2 w-10 h-10 bg-bhu-primary text-white rounded-lg flex items-center justify-center hover:bg-bhu-dark transition-colors shadow-sm">
              <ArrowRight className="w-5 h-5" />
            </button>
          </form>
        </div>
        
        {/* Supporting Statistics */}
        <div className="relative z-10 w-full lg:w-2/5 grid grid-cols-2 gap-x-8 gap-y-8 pl-0 lg:pl-10 border-t lg:border-t-0 lg:border-l border-slate-100 pt-8 lg:pt-0">
          {[
            { value: stats ? stats.indexed_documents : '12,482', label: 'Research Publications' },
            { value: stats ? stats.registered_datasets : '8,732', label: 'Datasets' },
            { value: stats ? stats.simulated_scenarios : '1,245', label: 'Policy Documents' },
            { value: '632', label: 'Case Studies' }
          ].map((stat, i) => (
            <div key={i} className="flex flex-col gap-1">
              <div className="text-3xl font-black text-slate-900 tracking-tight">{stat.value}</div>
              <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ROW 2: KPI ROW */}
      {dashKpis && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { icon: FileText, value: stats ? stats.indexed_documents : '2,481', title: 'Verified Research', sub: 'Statutory acts, indexed research', color: 'text-bhu-blue', bg: 'bg-blue-50', spark: '#2563EB' },
          { icon: Database, value: stats ? stats.registered_datasets : '8,732', title: 'Registered Datasets', sub: 'Cadastral layers, satellite data', color: 'text-bhu-primary', bg: 'bg-bhu-light', spark: '#008B72' },
          { icon: Activity, value: stats ? stats.simulated_scenarios : '145', title: 'Policy Scenarios', sub: 'Simulations executed', color: 'text-purple-600', bg: 'bg-purple-50', spark: '#9333EA' },
          { icon: Box, value: '86', title: 'Innovation Blocks', sub: 'SIH-2026 / Innovation challenges', color: 'text-bhu-warning', bg: 'bg-amber-50', spark: '#F59E0B' }
        ].map((kpi, i) => (
          <div key={i} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow group flex flex-col justify-between h-[180px]">
            <div className="flex justify-between items-start mb-6">
              <div className={clsx("w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm border border-slate-100 bg-white", kpi.color)}>
                <kpi.icon className="w-5 h-5" />
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-50 border border-slate-100 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-bhu-success animate-pulse"></span>
                <span className="text-[10px] font-bold text-slate-600">Live</span>
              </div>
            </div>
            <div className="flex justify-between items-end">
              <div>
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">{kpi.title}</h3>
                <div className="text-3xl font-black text-slate-900 mb-1">{kpi.value}</div>
                <p className="text-[11px] font-medium text-slate-500 truncate">{kpi.sub}</p>
              </div>
              <div className="opacity-40 group-hover:opacity-100 transition-opacity pb-1">
                <Sparkline color={kpi.spark} trend="up" />
              </div>
            </div>
          </div>
        ))}
      </div>
      )}

      {/* ROW 3: GIS INTELLIGENCE ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Map Card */}
        <div className="lg:col-span-6 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[500px]">
          <div className="px-6 py-4 flex justify-between items-center border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-bhu-light flex items-center justify-center text-bhu-primary">
                <Globe className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 leading-none mb-1">Geospatial Intelligence Snapshot</h3>
                <p className="text-[11px] font-medium text-slate-500 leading-none">Land use, climate vulnerability and governance</p>
              </div>
            </div>
            <button onClick={() => navigate('/gis/maps')} className="text-[11px] font-bold text-bhu-primary bg-bhu-light hover:bg-bhu-primary/20 px-3 py-1.5 rounded-md transition-colors flex items-center gap-1.5">
              Open GIS Studio <ArrowRight className="w-3 h-3" />
            </button>
          </div>
          <div className="flex-1 relative bg-slate-100">
            {/* GIS Controls Overlay */}
            <div ref={layersRef} className="absolute top-4 left-4 z-[1000]">
              <button 
                onClick={() => setLayersOpen(!layersOpen)}
                aria-expanded={layersOpen}
                aria-haspopup="true"
                className="flex items-center justify-between w-[220px] h-[44px] bg-[#0F172A] border border-white/10 rounded-xl px-4 shadow-md hover:bg-[#1E293B] transition-colors focus:outline-none focus:ring-2 focus:ring-bhu-primary"
              >
                <div className="flex items-center gap-2">
                  <div className="text-bhu-primary text-[10px]">◈</div>
                  <span className="text-[#F8FAFC] text-[11px] font-black uppercase tracking-widest">Map Layers</span>
                </div>
                {layersOpen ? (
                  <div className="text-slate-400 text-[10px]">▲</div>
                ) : (
                  <div className="text-slate-400 text-[10px]">▼</div>
                )}
              </button>

              <div 
                className={`absolute top-full left-0 mt-2 w-[220px] bg-[#0F172A] border border-white/10 rounded-xl p-2.5 shadow-lg transition-all duration-150 origin-top ${
                  layersOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
                }`}
              >
                <div className="flex flex-col gap-1">
                  {[
                    { id: 'Land Use', label: 'Land Use' },
                    { id: 'Climate Risk', label: 'Climate Risk' },
                  ].map(layer => (
                    <button 
                      key={layer.id}
                      onClick={() => setActiveLayer(activeLayer === layer.id ? null : layer.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-bold transition-colors focus:outline-none focus:ring-2 focus:ring-bhu-primary/50 ${
                        activeLayer === layer.id 
                          ? 'bg-bhu-primary/10 text-bhu-primary' 
                          : 'text-[#F8FAFC] hover:bg-white/5'
                      }`}
                    >
                      <div className={`w-3.5 h-3.5 rounded border flex items-center justify-center shrink-0 transition-colors ${
                        activeLayer === layer.id ? 'bg-bhu-primary border-bhu-primary' : 'border-[#94A3B8] bg-transparent'
                      }`}>
                        {activeLayer === layer.id && (
                          <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                      {layer.label}
                    </button>
                  ))}
                  <div className="h-px bg-white/10 my-1.5"></div>
                  {[
                    { label: 'Land Disputes', active: false },
                    { label: 'Infrastructure', active: false },
                    { label: 'Administrative Boundaries', active: false },
                  ].map((l, i) => (
                    <div key={`check-${i}`} className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-bold text-[#94A3B8] cursor-not-allowed opacity-60">
                      <div className="w-3.5 h-3.5 rounded border border-[#94A3B8] bg-transparent shrink-0 flex items-center justify-center"></div>
                      {l.label}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* GIS View Toggle */}
            <div className="absolute bottom-4 left-4 z-[1000] bg-[#0F172A] backdrop-blur rounded-lg shadow-md border border-white/10 flex items-center p-1">
              <button onClick={() => handleMapViewChange('map')} className={clsx("px-3 py-1.5 text-[10px] uppercase tracking-wider font-bold rounded-md transition-colors", mapView === 'map' ? "bg-bhu-primary text-white" : "text-slate-400 hover:text-white")}>Map</button>
              <button onClick={() => handleMapViewChange('satellite')} className={clsx("px-3 py-1.5 text-[10px] uppercase tracking-wider font-bold rounded-md transition-colors", mapView === 'satellite' ? "bg-bhu-primary text-white" : "text-slate-400 hover:text-white")}>Satellite</button>
              <button onClick={() => handleMapViewChange('terrain')} className={clsx("px-3 py-1.5 text-[10px] uppercase tracking-wider font-bold rounded-md transition-colors", mapView === 'terrain' ? "bg-bhu-primary text-white" : "text-slate-400 hover:text-white")}>Terrain</button>
            </div>

            {/* Live Layer Badge */}
            <div className="absolute top-4 right-4 z-[1000] bg-slate-900/90 backdrop-blur text-white px-3 py-1.5 rounded-full shadow-md flex items-center gap-2 text-[10px] font-bold tracking-wide uppercase border border-white/10">
              <span className="w-1.5 h-1.5 rounded-full bg-bhu-success animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]"></span>
              Live GIS
            </div>

            {/* Map Legend Overlay */}
            {activeLayer === 'Land Use' && (
              <div className="absolute bottom-4 right-4 z-[1000] bg-white/95 backdrop-blur rounded-xl shadow-md border border-slate-200/60 p-3 w-40 animate-in fade-in zoom-in duration-200">
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-2">Land Use Classes</div>
                <div className="flex flex-col gap-1.5">
                  {LAND_USE_DATA.slice(0,4).map((l, i) => (
                    <div key={i} className="flex items-center gap-2.5">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: l.color }}></div>
                      <span className="text-[10px] font-semibold text-slate-600 truncate">{l.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {activeLayer === 'Climate Risk' && (
              <div className="absolute bottom-4 right-4 z-[1000] bg-white/95 backdrop-blur rounded-xl shadow-md border border-slate-200/60 p-3 w-40 animate-in fade-in zoom-in duration-200">
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-2">Climate Risk</div>
                <div className="flex flex-col gap-1.5">
                  {[
                    { label: 'Very High', color: '#B91C1C' },
                    { label: 'High', color: '#F87171' },
                    { label: 'Moderate', color: '#FBBF24' },
                    { label: 'Low', color: '#34D399' }
                  ].map((l, i) => (
                    <div key={i} className="flex items-center gap-2.5">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: l.color }}></div>
                      <span className="text-[10px] font-semibold text-slate-600 truncate">{l.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <MapContainer 
              center={[22.5937, 78.9629]} 
              zoom={4.5} 
              zoomSnap={0.1}
              zoomDelta={0.1}
              zoomControl={true}
              className="w-full h-full z-0 [&_.leaflet-control-attribution]:hidden"
              style={{ background: '#0B1015' }}
            >
              <div onMouseLeave={() => setHoveredState(null)} className="absolute inset-0 w-full h-full z-10 pointer-events-none"></div>
              <TileLayer
                key={mapView}
                url={
                  mapView === 'satellite' ? "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" :
                  mapView === 'terrain' ? "https://server.arcgisonline.com/ArcGIS/rest/services/World_Physical_Map/MapServer/tile/{z}/{y}/{x}" :
                  "https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png"
                }
              />
              <MapBoundsFit data={indiaGeoJson} />
              <GeoJSON 
                key={`${activeLayer || 'none'}-${mapView}-${mapBoundaries}`}
                data={indiaGeoJson as any} 
                style={(feature: any) => {
                  const stateName = feature?.properties.NAME_1 || feature?.properties.name || 'Unknown';
                  const hash = hashString(stateName);

                  if (!activeLayer) {
                    if (mapView === 'map') {
                      // MAP mode: Default administrative thematic fills
                      const adminColors = ['#0F172A', '#1E293B', '#334155', '#020617', '#0F172A'];
                      return {
                        color: mapBoundaries ? '#475569' : 'transparent',
                        weight: mapBoundaries ? 1.5 : 0,
                        fillColor: adminColors[hash % adminColors.length],
                        fillOpacity: 0.9
                      };
                    } else {
                      // SATELLITE or TERRAIN mode: Transparent fill, boundaries only
                      return {
                        color: mapBoundaries ? (mapView === 'satellite' ? 'rgba(255,255,255,0.4)' : 'rgba(51, 65, 85, 0.85)') : 'transparent',
                        weight: mapBoundaries ? (mapView === 'satellite' ? 1.5 : 1.2) : 0,
                        fillColor: 'transparent',
                        fillOpacity: 0
                      };
                    }
                  }
                  
                  // When an active GIS layer is enabled
                  const landUseIndex = hash % PALETTES['Land Use'].length;
                  const climateRiskIndex = hash % PALETTES['Climate Risk'].length;
                  const currentData = activeLayer === 'Land Use' ? PALETTES['Land Use'][landUseIndex] : PALETTES['Climate Risk'][climateRiskIndex];
                  
                  return {
                    color: mapBoundaries ? (mapView === 'map' ? 'rgba(255,255,255,0.4)' : (mapView === 'satellite' ? 'rgba(255,255,255,0.7)' : 'rgba(51, 65, 85, 0.85)')) : 'transparent',
                    weight: mapBoundaries ? (mapView === 'terrain' ? 1.2 : 1.5) : 0,
                    fillColor: currentData.color,
                    fillOpacity: mapView === 'map' ? 0.7 : (mapView === 'terrain' ? 0.35 : 0.5)
                  };
                }}
                onEachFeature={(feature, layer) => {
                  layer.on({
                    mouseover: (e) => {
                      const tLayer = e.target;
                      tLayer.setStyle({
                        weight: 2,
                        color: '#00FFC4',
                        fillOpacity: mapView === 'map' && !activeLayer ? 1 : 0.6
                      });
                      tLayer.bringToFront();
                      const stateName = feature.properties.NAME_1 || feature.properties.name || 'Unknown';
                      const hash = hashString(stateName);
                      setHoveredState({
                        name: stateName,
                        data: {
                          'Land Use': PALETTES['Land Use'][hash % PALETTES['Land Use'].length],
                          'Climate Risk': PALETTES['Climate Risk'][hash % PALETTES['Climate Risk'].length]
                        }
                      });
                    },
                    mouseout: (e) => {
                      const tLayer = e.target;
                      const stateName = feature?.properties.NAME_1 || feature?.properties.name || 'Unknown';
                      const hash = hashString(stateName);

                      if (!activeLayer) {
                        if (mapView === 'map') {
                          const adminColors = ['#0F172A', '#1E293B', '#334155', '#020617', '#0F172A'];
                          tLayer.setStyle({
                            color: mapBoundaries ? '#475569' : 'transparent',
                            weight: mapBoundaries ? 1.5 : 0,
                            fillColor: adminColors[hash % adminColors.length],
                            fillOpacity: 0.9
                          });
                        } else {
                          tLayer.setStyle({
                            color: mapBoundaries ? (mapView === 'satellite' ? 'rgba(255,255,255,0.4)' : 'rgba(51, 65, 85, 0.85)') : 'transparent',
                            weight: mapBoundaries ? (mapView === 'satellite' ? 1.5 : 1.2) : 0,
                            fillColor: 'transparent',
                            fillOpacity: 0
                          });
                        }
                      } else {
                        const landUseIndex = hash % PALETTES['Land Use'].length;
                        const climateRiskIndex = hash % PALETTES['Climate Risk'].length;
                        const currentData = activeLayer === 'Land Use' ? PALETTES['Land Use'][landUseIndex] : PALETTES['Climate Risk'][climateRiskIndex];
                        tLayer.setStyle({
                          color: mapBoundaries ? (mapView === 'map' ? 'rgba(255,255,255,0.4)' : (mapView === 'satellite' ? 'rgba(255,255,255,0.7)' : 'rgba(51, 65, 85, 0.85)')) : 'transparent',
                          weight: mapBoundaries ? (mapView === 'terrain' ? 1.2 : 1.5) : 0,
                          fillColor: currentData.color,
                          fillOpacity: mapView === 'map' ? 0.7 : (mapView === 'terrain' ? 0.35 : 0.5)
                        });
                      }
                      setHoveredState(null);
                    }
                  });
                }}
              />
            </MapContainer>

            {/* FLOATING CALLOUTS (Static Absolute positioned) */}
            <div className="absolute top-[8%] right-[2%] z-20 pointer-events-none hidden md:block scale-75 origin-top-right">
              <div className="bg-[#1E293B]/90 backdrop-blur-md border border-white/10 rounded-xl px-4 py-3 shadow-lg relative">
                <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Forest Cover</div>
                <div className="text-xl font-black text-emerald-400 leading-none">21.3%</div>
              </div>
            </div>

            <div className="absolute top-[35%] right-[2%] z-20 pointer-events-none hidden md:block scale-75 origin-top-right">
              <div className="bg-[#1E293B]/90 backdrop-blur-md border border-white/10 rounded-xl px-4 py-3 shadow-lg relative">
                <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Climate Risk</div>
                <div className="text-xl font-black text-amber-400 leading-none">High</div>
              </div>
            </div>
            
            <div className="absolute top-[62%] right-[2%] z-20 pointer-events-none hidden md:block scale-75 origin-top-right">
              <div className="bg-[#1E293B]/90 backdrop-blur-md border border-white/10 rounded-xl px-4 py-3 shadow-lg relative">
                <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Urban Expansion</div>
                <div className="text-xl font-black text-blue-400 leading-none">+2.8%</div>
              </div>
            </div>

            {/* HOVER TOOLTIP */}
            {hoveredState && (
              <div 
                className="fixed z-[9999] pointer-events-none bg-[#0F172A]/95 backdrop-blur-xl border border-teal-500/30 rounded-xl p-3.5 shadow-2xl w-48 transform -translate-x-1/2 -translate-y-[120%] transition-opacity duration-200"
                style={{ left: mousePos.x, top: mousePos.y }}
              >
                <div className="text-[9px] font-bold text-teal-400 uppercase tracking-widest mb-0.5">State Region</div>
                {mapLabels && (
                  <h3 className="text-sm font-black text-white leading-tight mb-3">
                    {hoveredState.name}
                  </h3>
                )}
                
                <div className="space-y-2 bg-white/5 rounded-lg p-2 border border-white/5">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-bold text-slate-400 uppercase">Land Use</span>
                    <span className="text-[10px] font-black" style={{ color: hoveredState.data['Land Use'].color }}>
                      {hoveredState.data['Land Use'].type}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-bold text-slate-400 uppercase">Climate Risk</span>
                    <span className="text-[10px] font-black" style={{ color: hoveredState.data['Climate Risk'].color }}>
                      {hoveredState.data['Climate Risk'].type}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Land Use Chart */}
        <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[500px]">
          <div className="px-6 py-5 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900 leading-none mb-1">Land Use Distribution</h3>
            <p className="text-[11px] font-medium text-slate-500 leading-none">Across India (in %)</p>
          </div>
          <div className="flex-1 p-6 flex flex-col">
            <div className="h-[220px] w-full relative mb-6">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={LAND_USE_DATA}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={95}
                    paddingAngle={3}
                    dataKey="value"
                    stroke="none"
                    cornerRadius={4}
                  >
                    {LAND_USE_DATA.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: any) => [`${value}%`, 'Coverage']}
                    contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize: '12px', fontWeight: 'bold' }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-xl font-black text-slate-900">328.7 M Ha</span>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide text-center leading-tight mt-1">Total Mapped<br/>Land</span>
              </div>
            </div>
            
            <div className="flex-1 flex flex-col gap-3 overflow-y-auto custom-scrollbar pr-2">
              {LAND_USE_DATA.map((item, i) => (
                <div key={i} className="flex items-center justify-between group">
                  <div className="flex items-center gap-2.5">
                    <div className="w-3 h-3 rounded-full shadow-sm" style={{ backgroundColor: item.color }}></div>
                    <span className="text-xs font-semibold text-slate-600">{item.name}</span>
                  </div>
                  <span className="text-xs font-bold text-slate-900">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Climate Risk */}
        <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[500px]">
          <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center">
            <div>
              <h3 className="text-sm font-bold text-slate-900 leading-none mb-1 flex items-center gap-2">
                <AlertTriangle className="w-3.5 h-3.5 text-bhu-danger" /> Climate Risk
              </h3>
              <p className="text-[11px] font-medium text-slate-500 leading-none">Vulnerability zones</p>
            </div>
          </div>
          
          <div className="flex-1 flex flex-col p-6">
            <div className="flex-1 relative flex justify-center items-center py-4">
              <div 
                className="w-full h-full bg-contain bg-center bg-no-repeat opacity-50 drop-shadow-sm" 
                style={{ 
                  backgroundImage: "url('https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/India_location_map.svg/800px-India_location_map.svg.png')",
                  filter: 'grayscale(100%) contrast(1.2)' 
                }}
              ></div>
              
              <div className="absolute inset-0 flex flex-col justify-center px-4 gap-4">
                {[
                  { label: 'Very High Risk', color: 'bg-bhu-danger' },
                  { label: 'High Risk', color: 'bg-bhu-warning' },
                  { label: 'Moderate Risk', color: 'bg-amber-400' },
                  { label: 'Low Risk', color: 'bg-bhu-success' },
                ].map((l, i) => (
                  <div key={i} className="flex items-center gap-3 bg-white/95 backdrop-blur shadow-sm border border-slate-100 px-4 py-2.5 rounded-xl">
                    <div className={clsx("w-2 h-2 rounded-full", l.color)}></div>
                    <span className="text-xs font-bold text-slate-700 uppercase tracking-wide">{l.label}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-red-50/50 border border-red-100 rounded-xl p-4 mt-auto">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-bhu-danger shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-bold text-slate-900 mb-1">12 coastal districts flagged</div>
                  <div className="text-[11px] font-medium text-slate-600 leading-relaxed">High climate vulnerability due to sea level rise and extreme weather events.</div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* ROW 4: SECONDARY ANALYTICS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Key Insights */}
        <div className={clsx("bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col", dashActivity ? "lg:col-span-7" : "lg:col-span-12")}>
          <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-bhu-warning" /> Key Insights
            </h3>
            <button onClick={() => navigate('/data/insights')} className="text-[11px] font-bold text-bhu-blue hover:text-blue-800 flex items-center gap-1">
              View All <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="p-8 text-center bg-slate-50/50 flex flex-col items-center justify-center flex-1 h-full">
            <Lightbulb className="w-10 h-10 text-slate-300 mb-3" />
            <p className="text-sm font-medium text-slate-600 mb-4">No analytical insights available yet.</p>
            <button onClick={() => navigate('/data/insights')} className="text-xs font-bold bg-white text-slate-700 px-4 py-2 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors shadow-sm">
              Explore Analytics
            </button>
          </div>
        </div>

        {/* Recent Activity */}
        {dashActivity && (
          <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col">
          <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Activity className="w-4 h-4 text-slate-400" /> Recent Activity
            </h3>
            <button onClick={() => navigate('/notifications')} className="text-[11px] font-bold text-bhu-blue hover:text-blue-800 flex items-center gap-1">
              View All <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="p-6 flex flex-col flex-1">
            {recentActivity && recentActivity.length > 0 ? (
              <div className="relative border-l-2 border-slate-100 ml-4 space-y-7 pb-2">
                {recentActivity.slice(0, 5).map((act, i) => {
                  let ActIcon = FileText;
                  let actColor = 'text-slate-600';
                  let actBg = 'bg-slate-50';
                  let actBorder = 'border-slate-600';
                  
                  if (act.category === 'RESEARCH') { ActIcon = FileText; actColor = 'text-blue-600'; actBg = 'bg-blue-50'; actBorder = 'border-blue-600'; }
                  if (act.category === 'POLICY') { ActIcon = FileText; actColor = 'text-amber-600'; actBg = 'bg-amber-50'; actBorder = 'border-amber-600'; }
                  if (act.category === 'DATASET') { ActIcon = Database; actColor = 'text-emerald-600'; actBg = 'bg-emerald-50'; actBorder = 'border-emerald-600'; }
                  if (act.category === 'GIS') { ActIcon = Globe; actColor = 'text-purple-600'; actBg = 'bg-purple-50'; actBorder = 'border-purple-600'; }
                  if (act.category === 'INNOVATION') { ActIcon = Box; actColor = 'text-rose-600'; actBg = 'bg-rose-50'; actBorder = 'border-rose-600'; }

                  return (
                    <div key={act.id || i} className="relative pl-6">
                      <div className={clsx("absolute -left-[17px] top-1 w-8 h-8 rounded-full flex items-center justify-center shrink-0 border-2 shadow-sm", actBg, actColor, actBorder)}>
                        <ActIcon className="w-3.5 h-3.5" />
                      </div>
                      <div className="flex flex-col gap-1 pt-0.5">
                        <div className="flex justify-between items-center gap-4">
                          <span className="text-xs font-bold text-slate-900">{act.title}</span>
                          <span className="text-[11px] font-semibold text-slate-400 bg-slate-50 px-2 py-0.5 rounded">
                            {act.timestamp ? formatTimeAgo(act.timestamp) : act.time}
                          </span>
                        </div>
                        <div className="text-[13px] font-medium text-slate-600 line-clamp-1">{act.description}</div>
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{act.category}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center py-8 text-center">
                <Activity className="w-10 h-10 text-slate-300 mb-3" />
                <p className="text-sm font-medium text-slate-600 mb-4">No recent activity available.</p>
                <button onClick={() => navigate('/research')} className="text-xs font-bold bg-white text-slate-700 px-4 py-2 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors shadow-sm">
                  Explore Research
                </button>
              </div>
            )}
          </div>
        </div>
        )}

      </div>

      {/* ROW 5: QUICK ACCESS & CTA */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {dashQuickAccess && (
          <div className={clsx("bg-white rounded-2xl border border-slate-200 shadow-sm p-6 lg:p-8 flex flex-col justify-center", dashInnovation ? "lg:col-span-8" : "lg:col-span-12")}>
          <h3 className="text-sm font-bold text-slate-900 mb-6 flex items-center gap-2">
            <Zap className="w-4 h-4 text-bhu-success" /> Quick Access
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { title: 'Search Research', sub: 'Find papers & policies', icon: Search, color: 'text-bhu-blue', bg: 'bg-blue-50', link: '/research/repository' },
              { title: 'Explore GIS', sub: 'View land use maps', icon: MapPin, color: 'text-bhu-primary', bg: 'bg-bhu-light', link: '/gis/maps' },
              { title: 'Run Simulation', sub: 'Test policy outcomes', icon: PlaySquare, color: 'text-purple-600', bg: 'bg-purple-50', link: '/policy/simulation' },
              { title: 'Access Datasets', sub: 'Download official data', icon: Database, color: 'text-bhu-warning', bg: 'bg-amber-50', link: '/data/datasets' },
            ].map((qa, i) => (
              <button key={i} onClick={() => navigate(qa.link)} className="flex flex-col p-5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-white hover:border-slate-300 hover:shadow-sm transition-all text-left group">
                <div className={clsx("w-10 h-10 rounded-lg flex items-center justify-center mb-4 transition-transform group-hover:scale-105 shadow-sm border border-slate-100", qa.bg, qa.color)}>
                  <qa.icon className="w-5 h-5" />
                </div>
                <div className="text-[13px] font-bold text-slate-900 mb-1">{qa.title}</div>
                <div className="text-[11px] font-medium text-slate-500 line-clamp-1 flex items-center justify-between w-full">
                  {qa.sub}
                  <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-bhu-primary transition-colors" />
                </div>
              </button>
            ))}
          </div>
        </div>
        )}

        {dashInnovation && (
          <div className={clsx("bg-slate-900 rounded-2xl p-8 text-white flex flex-col justify-center relative overflow-hidden group shadow-md border border-slate-800", dashQuickAccess ? "lg:col-span-4" : "lg:col-span-12")}>
          <div 
            className="absolute inset-0 z-0 opacity-20 bg-cover bg-center mix-blend-overlay group-hover:scale-105 transition-transform duration-700"
            style={{ backgroundImage: "url('https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1000&auto=format&fit=crop')" }}
          ></div>
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/80 to-transparent z-10"></div>
          
          <div className="relative z-20 flex-1 flex flex-col justify-end">
            <h3 className="text-[22px] font-black leading-tight mb-2">
              Collaborate.<br/>Innovate.
            </h3>
            <p className="text-slate-300 text-[13px] font-medium mb-6">Build a Sustainable Future.</p>
            
            <button onClick={() => navigate('/innovation')} className="text-xs font-bold bg-white text-slate-900 px-5 py-3 rounded-xl hover:bg-slate-100 transition-colors inline-flex items-center justify-center gap-2 shadow-sm w-max">
              Explore Innovation Hub <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
        )}

      </div>

    </div>
  );
}
