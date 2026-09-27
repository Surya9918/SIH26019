import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Library, 
  Bot, 
  Map, 
  FlaskConical, 
  LineChart, 
  Database, 
  Lightbulb,
  FileText,
  ShieldCheck,
  ChevronDown,
  Users
} from 'lucide-react';
import clsx from 'clsx';
import { useState } from 'react';

const MENU_ITEMS = [
  { path: '/', label: 'Overview', icon: LayoutDashboard },
  { path: '/research', label: 'Research', icon: Library, children: [
    { path: '/research', label: 'Research Repository' },
    { path: '/research/saved', label: 'Saved Research' },
    { path: '/research/publications', label: 'Publications' },
  ]},
  { path: '/ai', label: 'AI Evidence', icon: Bot },
  { path: '/gis', label: 'Geospatial', icon: Map },
  { path: '/policy', label: 'Policy Lab', icon: FlaskConical },
  { path: '/analytics', label: 'Analytics', icon: LineChart },
  { path: '/data', label: 'Data', icon: Database },
  { path: '/workspaces', label: 'Workspaces', icon: Users },
  { path: '/innovation', label: 'Innovation', icon: Lightbulb },
  { path: '/governance', label: 'Governance', icon: ShieldCheck, children: [
    { path: '/governance/provenance', label: 'Provenance' },
    { path: '/governance/audit', label: 'Audit Logs' },
  ]},
  { path: '/reports', label: 'Reports', icon: FileText },
];

function NavItem({ item, isExpanded, onToggle }: any) {
  const Icon = item.icon;
  const hasChildren = item.children && item.children.length > 0;
  
  return (
    <div className="mb-1">
      <NavLink 
        to={hasChildren ? '#' : item.path}
        onClick={(e) => {
          if (hasChildren) {
            e.preventDefault();
            onToggle();
          }
        }}
        className={({ isActive: linkActive }) => clsx(
          "flex items-center justify-between px-3 py-2 rounded-md text-sm font-medium transition-colors",
          (linkActive && !hasChildren) ? "bg-gov-blue/10 text-gov-blue" : "text-slate-600 hover:bg-slate-100 hover:text-gov-navy"
        )}
      >
        <div className="flex items-center gap-3">
          <Icon className="w-4 h-4" />
          {item.label}
        </div>
        {hasChildren && (
          <ChevronDown className={clsx("w-4 h-4 transition-transform", isExpanded ? "rotate-180" : "")} />
        )}
      </NavLink>
      
      {hasChildren && isExpanded && (
        <div className="ml-6 mt-1 flex flex-col gap-1 border-l border-slate-200 pl-2">
          {item.children.map((child: any) => (
            <NavLink
              key={child.path}
              to={child.path}
              className={({ isActive }) => clsx(
                "px-3 py-1.5 rounded-md text-xs font-medium transition-colors",
                isActive ? "text-gov-blue bg-gov-blue/5" : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
              )}
            >
              {child.label}
            </NavLink>
          ))}
        </div>
      )}
    </div>
  );
}

export function Sidebar() {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({
    '/research': false,
    '/governance': false
  });

  return (
    <aside className="w-64 bg-white border-r border-slate-200 h-full flex flex-col">
      <div className="flex-1 overflow-y-auto py-4 px-3">
        {MENU_ITEMS.map((item) => (
          <NavItem 
            key={item.path} 
            item={item} 
            isExpanded={expanded[item.path]}
            onToggle={() => setExpanded(prev => ({ ...prev, [item.path]: !prev[item.path] }))}
          />
        ))}
      </div>
      <div className="p-4 border-t border-slate-200">
        <div className="bg-slate-50 rounded-lg p-3 border border-slate-100">
          <div className="text-xs font-bold text-slate-500 mb-1 uppercase tracking-wider">System Status</div>
          <div className="flex items-center gap-2 text-sm text-gov-green font-medium">
            <span className="w-2 h-2 rounded-full bg-gov-green animate-pulse"></span>
            All systems operational
          </div>
        </div>
      </div>
    </aside>
  );
}
