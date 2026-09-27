import { Search, Bell, Settings, Leaf } from 'lucide-react';

export function Header() {
  return (
    <header className="bg-white h-[72px] flex items-center justify-between px-6 border-b border-slate-100/80 z-20 sticky top-0">
      {/* Brand / Logo */}
      <div className="flex items-center gap-3 min-w-[280px]">
        <div className="w-10 h-10 rounded-xl bg-teal-700 flex items-center justify-center text-white shadow-sm">
          <Leaf className="w-6 h-6" />
        </div>
        <div className="flex flex-col justify-center">
          <h1 className="text-xl font-bold text-slate-800 leading-none mb-1">Bhu-Setu</h1>
          <p className="text-[11px] font-medium text-slate-500 leading-none">National Land Governance Intelligence</p>
        </div>
      </div>
      
      {/* Search Bar */}
      <div className="flex-1 max-w-2xl mx-8">
        <div className="relative group flex items-center">
          <Search className="absolute left-4 w-4 h-4 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
          <input 
            type="text" 
            placeholder="Search for research papers, datasets, policies, maps, or keywords..."
            className="w-full bg-slate-50/80 border border-slate-200/60 focus:bg-white focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100/50 rounded-xl py-2.5 pl-11 pr-16 text-sm text-slate-700 transition-all outline-none"
          />
          <div className="absolute right-3 flex items-center gap-1 bg-white border border-slate-200 px-2 py-1 rounded text-[10px] font-bold text-slate-400">
            <span>Ctrl + K</span>
          </div>
        </div>
      </div>

      {/* Right Icons & Profile */}
      <div className="flex items-center gap-5 shrink-0">
        <button className="relative text-slate-400 hover:text-slate-600 transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-0.5 right-0.5 w-2 h-2 bg-red-500 border-2 border-white rounded-full"></span>
        </button>
        
        <div className="h-8 w-[1px] bg-slate-200 mx-2"></div>
        
        <div className="flex items-center gap-3 cursor-pointer group">
          <div className="w-9 h-9 rounded-full overflow-hidden border border-slate-200 bg-slate-100 shadow-sm">
            <img src="https://i.pravatar.cc/150?u=a042581f4e29026704d" alt="Profile" className="w-full h-full object-cover" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold text-slate-800 leading-tight group-hover:text-indigo-600 transition-colors">Suriya N.</span>
            <span className="text-xs text-slate-500 font-medium">Researcher</span>
          </div>
        </div>
      </div>
    </header>
  );
}
