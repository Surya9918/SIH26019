import { Search, Bell, HelpCircle, User } from 'lucide-react';

export function Header() {
  return (
    <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-6 shadow-sm z-10 relative">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 bg-gov-blue text-white rounded font-bold flex items-center justify-center text-sm shadow-inner">
          DoLR
        </div>
        <div>
          <h1 className="text-lg font-bold text-gov-navy leading-tight tracking-tight">National Land Governance Intelligence</h1>
          <p className="text-xs text-gov-muted font-medium">Department of Land Resources</p>
        </div>
      </div>
      
      <div className="flex-1 max-w-2xl mx-12">
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-hover:text-gov-blue transition-colors" />
          <input 
            type="text" 
            placeholder="Search research, datasets, locations, policies... (Cmd + K)"
            className="w-full bg-slate-100 border-transparent focus:bg-white focus:border-gov-blue focus:ring-2 focus:ring-gov-blue/20 rounded-md py-2 pl-10 pr-4 text-sm transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-5 text-slate-500">
        <button className="hover:text-gov-navy transition-colors relative">
          <Bell className="w-5 h-5" />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-gov-saffron rounded-full"></span>
        </button>
        <button className="hover:text-gov-navy transition-colors">
          <HelpCircle className="w-5 h-5" />
        </button>
        <div className="h-6 w-px bg-slate-200"></div>
        <button className="flex items-center gap-2 hover:text-gov-navy transition-colors">
          <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center">
            <User className="w-4 h-4" />
          </div>
          <div className="text-left hidden md:block">
            <div className="text-sm font-semibold text-slate-700 leading-tight">Surya N.</div>
            <div className="text-[10px] uppercase font-bold tracking-wider text-gov-blue">Researcher</div>
          </div>
        </button>
      </div>
    </header>
  );
}
