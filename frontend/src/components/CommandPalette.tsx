import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Map, Database, LayoutDashboard, FileText, FlaskConical, Bot } from 'lucide-react';

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
      if (e.key === 'Escape') {
        setOpen(false);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  if (!open) return null;

  const handleSelect = (path: string) => {
    setOpen(false);
    navigate(path);
  };

  const commands = [
    { name: 'Go to Overview', path: '/', icon: LayoutDashboard },
    { name: 'Search Research Repository', path: '/research', icon: FileText },
    { name: 'AI Evidence Orchestrator', path: '/ai', icon: Bot },
    { name: 'GIS Spatial Analysis', path: '/gis', icon: Map },
    { name: 'Policy Lab Scenarios', path: '/policy', icon: FlaskConical },
    { name: 'View Data Catalog', path: '/data', icon: Database },
    { name: 'Automated Reports', path: '/reports', icon: FileText },
  ];

  const filtered = query ? commands.filter(c => c.name.toLowerCase().includes(query.toLowerCase())) : commands;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[10vh] bg-slate-900/50 backdrop-blur-sm" onClick={() => setOpen(false)}>
      <div 
        className="w-full max-w-lg bg-white rounded-xl shadow-2xl overflow-hidden border border-slate-200"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center px-4 border-b border-slate-200">
          <Search className="w-5 h-5 text-slate-400" />
          <input 
            autoFocus
            className="w-full bg-transparent px-4 py-4 text-sm outline-none placeholder:text-slate-400 text-slate-800" 
            placeholder="Type a command or search..." 
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
        </div>
        <div className="max-h-[60vh] overflow-y-auto p-2">
          {filtered.length === 0 ? (
            <div className="p-4 text-center text-sm text-slate-500">No results found.</div>
          ) : (
            filtered.map((cmd, i) => {
              const Icon = cmd.icon;
              return (
                <button
                  key={i}
                  className="w-full flex items-center gap-3 px-3 py-2 text-sm text-slate-700 hover:bg-gov-blue hover:text-white rounded-md transition-colors text-left group"
                  onClick={() => handleSelect(cmd.path)}
                >
                  <Icon className="w-4 h-4 text-slate-400 group-hover:text-white" />
                  {cmd.name}
                </button>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
