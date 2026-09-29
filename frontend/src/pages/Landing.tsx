import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Leaf, 
  ArrowRight, 
  Trophy,
  FileText,
  Database,
  Map as MapIcon,
  Activity,
  Box,
  ShieldCheck,
  Users,
  ChevronDown
} from 'lucide-react';
import { India2DMap } from '../components/India2DMap';

function GlanceDropdown() {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={dropdownRef} className="absolute top-6 right-6 z-20">
      <button 
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 bg-[#0F172A]/90 backdrop-blur-xl border border-white/10 rounded-xl px-4 py-2.5 shadow-xl hover:bg-[#1E293B] transition-colors"
      >
        <div className="w-4 h-4 rounded-[3px] border-2 border-teal-400 rotate-45 transform flex items-center justify-center shrink-0">
          <div className="w-1.5 h-1.5 bg-teal-400 rounded-sm"></div>
        </div>
        <span className="text-white text-xs font-black uppercase tracking-widest">India at a Glance</span>
        <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>

      <div 
        className={`absolute top-full right-0 mt-2 w-72 bg-[#0F172A]/95 backdrop-blur-xl border border-white/10 rounded-xl p-5 shadow-2xl transition-all duration-200 origin-top ${
          open ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
        }`}
      >
        <div className="space-y-4">
          {[
            { icon: MapIcon, label: 'Land Use Mapping', color: 'text-blue-400', bg: 'bg-blue-500/10' },
            { icon: Activity, label: 'Climate Risk Assessment', color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
            { icon: FileText, label: 'Policy Impact Simulation', color: 'text-purple-400', bg: 'bg-purple-500/10' },
            { icon: ShieldCheck, label: 'Evidence-based Governance', color: 'text-amber-400', bg: 'bg-amber-500/10' },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className={`w-9 h-9 rounded-xl ${item.bg} flex items-center justify-center shrink-0`}>
                <item.icon className={`w-4 h-4 ${item.color}`} />
              </div>
              <span className="text-[13px] font-bold text-white/90">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function Landing() {
  const navigate = useNavigate();
  const [authProfile, setAuthProfile] = useState<{name: string, role: string} | null>(null);

  useEffect(() => {
    const checkAuth = () => {
      const saved = localStorage.getItem('bhu_settings');
      if (saved) {
        const p = JSON.parse(saved);
        if (p.profileName) {
          setAuthProfile({ name: p.profileName.split(' ')[0], role: p.profileRole || '' });
        } else {
          setAuthProfile(null);
        }
      } else {
        setAuthProfile(null);
      }
    };
    checkAuth();
    window.addEventListener('bhu_settings_changed', checkAuth);
    return () => window.removeEventListener('bhu_settings_changed', checkAuth);
  }, []);

  const handleSignOut = () => {
    const saved = localStorage.getItem('bhu_settings');
    if (saved) {
      const p = JSON.parse(saved);
      delete p.profileName;
      delete p.profileEmail;
      delete p.profileRole;
      delete p.profileAvatar;
      localStorage.setItem('bhu_settings', JSON.stringify(p));
    }
    window.dispatchEvent(new Event('bhu_settings_changed'));
  };

  return (
    <div className="min-h-screen font-sans selection:bg-teal-100 text-slate-900 overflow-x-hidden">
      {/* BRANDING */}
      <div className="absolute top-[32px] left-[40px] lg:left-[52px] z-50 flex items-center gap-3">
        <div className="w-[44px] h-[44px] rounded-xl bg-[#008B72] flex items-center justify-center text-white shadow-sm shrink-0">
          <Leaf className="w-6 h-6" />
        </div>
        <div className="flex flex-col justify-center">
          <h1 className="text-[24px] font-black text-[#0F172A] leading-none mb-1">Bhu-Setu</h1>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.15em] leading-none">National Land Governance</p>
        </div>
      </div>

      {/* AUTH ACTIONS */}
      <div className="absolute top-[32px] right-[40px] lg:right-[52px] z-50 flex items-center gap-3">
        {authProfile ? (
          <>
            <Link to="/profile" className="text-[13px] font-bold text-[#0F172A] px-4 py-2.5 rounded-lg hover:bg-slate-100 transition-colors">
              {authProfile.name}
            </Link>
            <button 
              onClick={handleSignOut}
              className="text-[13px] font-bold text-slate-500 px-4 py-2.5 rounded-lg hover:bg-slate-100 hover:text-slate-800 transition-colors"
            >
              Sign Out
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="text-[13px] font-bold text-[#0F172A] px-4 py-2.5 rounded-lg hover:bg-slate-100 transition-colors">
              Login
            </Link>
            <Link to="/signup" className="text-[13px] font-bold bg-[#008B72] text-white px-5 py-2.5 rounded-xl shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all flex items-center gap-1.5">
              Sign Up <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </>
        )}
      </div>

      {/* HERO SECTION */}
      <main className="pt-28 lg:pt-32 pb-20 px-6 lg:px-12 max-w-[1600px] mx-auto min-h-screen flex items-center relative">
        {/* Ambient Top Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1000px] h-[400px] bg-teal-50/50 blur-[120px] rounded-full pointer-events-none -z-10"></div>

        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-10 xl:gap-16 w-full justify-between">
          
          {/* Left Content */}
          <div className="flex flex-col z-10 relative lg:w-[43%] xl:w-[40%] shrink-0">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#FFFBEB] border border-[#FDE68A] text-[#D97706] text-[9px] font-black uppercase tracking-[0.15em] w-max mb-6 shadow-sm">
              <Trophy className="w-3.5 h-3.5" />
              SIH 2026 | National Challenge | Land Governance
            </div>
            
            <h1 className="text-[3.5rem] lg:text-[4rem] xl:text-[4.5rem] font-black text-[#0F172A] leading-[1.05] tracking-tight mb-5">
              Smarter Land<br/>
              Insights<br/>
              for a <span className="text-[#008B72]">Stronger</span><br/>
              <span className="text-[#008B72]">India</span>
            </h1>
            
            <p className="text-[16px] lg:text-[18px] text-slate-600 font-medium leading-relaxed max-w-[480px] mb-8">
              Bhu-Setu is a national land governance intelligence platform that integrates geospatial data, research, and policy evidence to enable sustainable, resilient, and data-driven decision making.
            </p>
            
            <div className="flex flex-wrap items-center gap-4 mb-10">
              <Link to="/dashboard" className="text-[15px] font-bold bg-[#008B72] text-white px-8 py-3.5 rounded-full hover:bg-[#00695C] transition-all flex items-center gap-2 shadow-[0_8px_20px_-6px_rgba(0,139,114,0.4)] hover:shadow-[0_12px_24px_-6px_rgba(0,139,114,0.5)] hover:-translate-y-0.5 duration-300">
                Explore Dashboard <ArrowRight className="w-4 h-4" />
              </Link>
              <button 
                onClick={() => document.getElementById('vision')?.scrollIntoView({ behavior: 'smooth' })}
                className="text-[15px] font-bold bg-white text-[#0F172A] border border-slate-200 px-8 py-3.5 rounded-full hover:bg-slate-50 transition-all shadow-sm hover:shadow hover:-translate-y-0.5 duration-300"
              >
                Learn More
              </button>
            </div>

            {/* Inline Stats - Single Row */}
            <div className="flex flex-wrap items-center gap-6 xl:gap-10 w-full mt-2">
              {[
                { icon: FileText, value: '12,482', label: 'Research Publications', color: 'text-blue-600', bg: 'bg-blue-50' },
                { icon: Database, value: '8,732', label: 'Datasets', color: 'text-[#008B72]', bg: 'bg-[#E9F8F4]' },
                { icon: FileText, value: '1,245', label: 'Policy Documents', color: 'text-amber-600', bg: 'bg-amber-50' },
                { icon: Box, value: '632', label: 'Case Studies', color: 'text-red-600', bg: 'bg-red-50' },
              ].map((stat, i) => (
                <div key={i} className="flex flex-col items-start gap-1.5">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${stat.bg} ${stat.color}`}>
                    <stat.icon className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[20px] font-black text-[#0F172A] leading-none mb-1">{stat.value}</div>
                    <div className="text-[10px] font-bold text-slate-500 leading-tight tracking-wide">{stat.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right 2D Visual */}
          <div className="relative h-[650px] lg:h-[750px] w-full lg:w-[57%] xl:w-[60%] rounded-[2.5rem] overflow-hidden bg-gradient-to-br from-[#0F172A] to-[#060B12] shadow-[0_30px_60px_-15px_rgba(0,139,114,0.2)] ring-1 ring-white/5">
            {/* Ambient inner glow */}
            <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] bg-teal-500/10 blur-[100px] pointer-events-none rounded-full"></div>
            
            {/* The 2D Map Component */}
            <div className="absolute inset-0 z-10">
              <India2DMap />
            </div>

            {/* Overlays */}
            <GlanceDropdown />

            <div className="absolute bottom-8 right-8 z-20 bg-[#0F172A]/80 backdrop-blur-xl border border-white/10 rounded-full px-6 py-3 shadow-2xl flex items-center gap-4 pointer-events-none">
              <span className="w-3 h-3 rounded-full bg-[#00FFC4] animate-pulse shadow-[0_0_10px_#00FFC4]"></span>
              <div>
                <div className="text-[13px] font-black text-white leading-tight">Live Geospatial Insights</div>
                <div className="text-[10px] text-white/60 font-semibold tracking-wide">Multi-source satellite and ground data</div>
              </div>
            </div>
          </div>

        </div>
      </main>

      {/* FEATURES ROW */}
      <section className="px-6 lg:px-12 max-w-[1600px] mx-auto pb-28">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { title: 'Geospatial Intelligence', desc: 'Multi-layer land analysis across India', icon: MapIcon, color: 'text-[#008B72]', bg: 'bg-[#E9F8F4]', glow: 'from-teal-100/50', link: '/gis/maps' },
            { title: 'Research & Policy', desc: 'Access research, acts and policy evidence', icon: FileText, color: 'text-blue-600', bg: 'bg-blue-50', glow: 'from-blue-100/50', link: '/research/repository' },
            { title: 'Policy Simulation', desc: 'Model and evaluate policy scenarios', icon: Activity, color: 'text-purple-600', bg: 'bg-purple-50', glow: 'from-purple-100/50', link: '/policy/simulation' },
            { title: 'Open Datasets', desc: 'Explore and download authoritative datasets', icon: Database, color: 'text-[#F59E0B]', bg: 'bg-orange-50', glow: 'from-orange-100/50', link: '/data/datasets' },
          ].map((feat, i) => (
            <div 
              key={i} 
              onClick={() => navigate(feat.link)}
              className="relative bg-white rounded-3xl p-8 shadow-sm hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] border border-slate-100 transition-all duration-300 group cursor-pointer flex flex-col justify-between h-full min-h-[220px] overflow-hidden z-10"
            >
              <div className={`absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t ${feat.glow} to-transparent -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
              
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${feat.bg} ${feat.color} mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <feat.icon className="w-7 h-7" />
              </div>
              <div className="flex items-end justify-between w-full">
                <div className="pr-4">
                  <h3 className="text-[17px] font-black text-[#0F172A] mb-1.5 leading-tight">{feat.title}</h3>
                  <p className="text-[13px] font-medium text-slate-500 leading-snug">{feat.desc}</p>
                </div>
                <div className="w-8 h-8 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center group-hover:bg-white group-hover:shadow-md transition-all shrink-0">
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[#008B72] transition-colors" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* BOTTOM VISION */}
      <section id="vision" className="px-6 lg:px-12 max-w-[1600px] mx-auto pb-32 scroll-mt-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          <div className="lg:col-span-5 flex flex-col justify-center pr-8">
            <div className="text-[11px] font-black text-[#008B72] uppercase tracking-[0.2em] mb-5 flex items-center gap-3">
              <div className="w-8 h-0.5 bg-[#008B72]"></div> OUR VISION
            </div>
            <h2 className="text-4xl lg:text-[2.75rem] font-black text-[#0F172A] leading-[1.1] mb-6">
              Data-Driven Governance<br/>for a Sustainable Tomorrow
            </h2>
            <p className="text-lg text-slate-600 font-medium leading-relaxed mb-10">
              To build a unified, intelligent, and accessible platform that bridges geospatial data, research, and policy — enabling informed decisions for land, environment, and people.
            </p>
            <button 
              onClick={() => document.getElementById('vision')?.scrollIntoView({ behavior: 'smooth' })}
              className="text-[15px] font-bold bg-[#0F172A] text-white px-8 py-4 rounded-full hover:bg-black transition-colors w-max flex items-center gap-2 shadow-lg hover:shadow-xl hover:-translate-y-0.5 duration-300"
            >
              Our Story <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          
          <div className="lg:col-span-7 bg-[#F8FAFC] border border-slate-200/60 p-8 lg:p-12 rounded-[2.5rem] shadow-xl shadow-slate-200/30 relative overflow-hidden">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 relative z-10">
              {[
                { title: 'Sustainable Land Use', desc: 'Balance development and conservation', icon: Leaf, color: 'text-[#008B72]', bg: 'bg-[#E9F8F4]' },
                { title: 'Climate Resilience', desc: 'Identify and mitigate climate risks', icon: ShieldCheck, color: 'text-blue-600', bg: 'bg-blue-50' },
                { title: 'Informed Policy Making', desc: 'Evidence-based decision support', icon: FileText, color: 'text-orange-600', bg: 'bg-orange-50' },
                { title: 'Inclusive Development', desc: 'Support equitable and resilient growth', icon: Users, color: 'text-teal-600', bg: 'bg-teal-50' },
              ].map((v, i) => (
                <div key={i} className="flex items-start gap-5 p-6 bg-white rounded-3xl hover:shadow-lg hover:-translate-y-1 transition-all duration-300 border border-slate-100">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${v.bg} ${v.color}`}>
                    <v.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-[15px] font-black text-[#0F172A] mb-1.5">{v.title}</h4>
                    <p className="text-[13px] font-medium text-slate-500 leading-relaxed">{v.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Decorative background element */}
            <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-gradient-to-br from-teal-50 to-blue-50 rounded-full blur-3xl opacity-80 pointer-events-none"></div>
          </div>
        </div>
      </section>

    </div>
  );
}
