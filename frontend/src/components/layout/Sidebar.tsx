import { NavLink } from 'react-router-dom';
import { 
  Home, 
  FileText, 
  Globe, 
  Database,
  Users,
  Bell,
  HelpCircle,
  Settings,
  ChevronDown
} from 'lucide-react';
import clsx from 'clsx';
import { useState } from 'react';

const MENU_ITEMS = [
  { path: '/', label: 'Dashboard', icon: Home, isBase: true },
  
  { path: '/research', label: 'Research', icon: FileText, children: [
    { path: '/research/repository', label: 'Research Repository' },
    { path: '/research/saved', label: 'Saved Research' },
    { path: '/research/publications', label: 'Publications' },
  ]},
  
  { path: '/policy', label: 'Policy', icon: FileText, children: [
    { path: '/policy/documents', label: 'Policy Documents' },
    { path: '/policy/simulation', label: 'Policy Simulation' },
  ]},

  { path: '/gis', label: 'Geospatial', icon: Globe, children: [
    { path: '/gis/maps', label: 'Maps & GIS' },
    { path: '/gis/analysis', label: 'Land Use Analysis' },
    { path: '/gis/climate', label: 'Climate Risk' },
  ]},

  { path: '/data', label: 'Data & Analytics', icon: Database, children: [
    { path: '/data/datasets', label: 'Datasets' },
    { path: '/data/insights', label: 'Insights & Reports' },
  ]},

  { path: '/collaboration', label: 'Collaboration', icon: Users, children: [
    { path: '/workspaces', label: 'Workspaces' },
    { path: '/innovation', label: 'Hackathons & Innovation' },
  ]},
];

const SECONDARY_ITEMS = [
  { path: '/notifications', label: 'Notifications', icon: Bell },
  { path: '/help', label: 'Help & Support', icon: HelpCircle },
  { path: '/settings', label: 'Settings', icon: Settings },
];

function NavItem({ item, isExpanded, onToggle }: any) {
  const Icon = item.icon;
  const hasChildren = item.children && item.children.length > 0;
  
  return (
    <div className="mb-1.5">
      <NavLink 
        to={hasChildren ? '#' : item.path}
        onClick={(e) => {
          if (hasChildren) {
            e.preventDefault();
            onToggle();
          }
        }}
        className={({ isActive: linkActive }) => clsx(
          "flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-semibold transition-all group",
          (linkActive && !hasChildren) 
            ? "bg-indigo-50 text-indigo-900 shadow-sm" 
            : "text-slate-600 hover:bg-slate-50 hover:text-indigo-800"
        )}
      >
        <div className="flex items-center gap-3">
          <Icon className={clsx(
            "w-4 h-4 transition-colors", 
            (item.isBase) ? "text-indigo-700" : "text-slate-400 group-hover:text-indigo-500"
          )} />
          {item.label}
        </div>
        {hasChildren && (
          <ChevronDown className={clsx("w-4 h-4 text-slate-400 transition-transform", isExpanded ? "rotate-180" : "")} />
        )}
      </NavLink>
      
      {hasChildren && isExpanded && (
        <div className="ml-3 mt-1 flex flex-col gap-0.5 border-l-2 border-slate-100 pl-3 py-1">
          {item.children.map((child: any) => (
            <NavLink
              key={child.path}
              to={child.path}
              className={({ isActive }) => clsx(
                "px-3 py-2 rounded-lg text-[13px] font-medium transition-colors",
                isActive 
                  ? "text-indigo-700 bg-indigo-50/50 font-semibold" 
                  : "text-slate-500 hover:text-indigo-700 hover:bg-slate-50"
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
    '/research': true,
    '/policy': false,
    '/gis': false,
    '/data': false,
    '/collaboration': false
  });

  return (
    <aside className="w-[260px] bg-white border-r border-slate-100 flex flex-col z-10 shrink-0">
      <div className="flex-1 overflow-y-auto py-6 px-4 flex flex-col gap-1 custom-scrollbar">
        
        {/* Main Nav */}
        <div className="mb-4">
          {MENU_ITEMS.map((item) => (
            <NavItem 
              key={item.path} 
              item={item} 
              isExpanded={expanded[item.path]}
              onToggle={() => setExpanded(prev => ({ ...prev, [item.path]: !prev[item.path] }))}
            />
          ))}
        </div>

        {/* Divider */}
        <div className="h-px bg-slate-100 my-4 mx-2"></div>

        {/* Secondary Nav */}
        <div>
          {SECONDARY_ITEMS.map((item) => (
            <NavLink 
              key={item.path}
              to={item.path}
              className={({ isActive }) => clsx(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group mb-1",
                isActive ? "bg-indigo-50 text-indigo-900" : "text-slate-600 hover:bg-slate-50 hover:text-indigo-800"
              )}
            >
              <item.icon className="w-4 h-4 text-slate-400 group-hover:text-indigo-500" />
              {item.label}
            </NavLink>
          ))}
        </div>

      </div>

      {/* Promotional Footer */}
      <div className="p-5 border-t border-slate-100/50 bg-gradient-to-b from-white to-teal-50/30">
        <div className="bg-teal-50/60 rounded-xl p-4 border border-teal-100/50 relative overflow-hidden">
          <div className="relative z-10">
            <div className="text-xs font-bold text-slate-500 leading-tight mb-1">Better Data.</div>
            <div className="text-xs font-bold text-slate-500 leading-tight mb-1">Smarter Policies.</div>
            <div className="text-xs font-bold text-slate-500 leading-tight">Sustainable Land.</div>
          </div>
          {/* Decorative shapes */}
          <div className="absolute -bottom-4 -right-4 w-20 h-20 bg-teal-200/40 rounded-full blur-xl"></div>
          <div className="absolute -bottom-2 -left-2 w-16 h-16 bg-blue-200/40 rounded-full blur-xl"></div>
          
          {/* Subtle nature/land icon graphic */}
          <svg className="absolute bottom-1 right-1 w-12 h-12 text-teal-600/10" fill="currentColor" viewBox="0 0 24 24">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm-1 2l5 5h-5V4zm-3 8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3zm0 4c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z" />
          </svg>
        </div>
      </div>
    </aside>
  );
}
