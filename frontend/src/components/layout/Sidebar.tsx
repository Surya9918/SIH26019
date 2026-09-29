import { NavLink, useLocation } from 'react-router-dom';
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
import { useState, useEffect } from 'react';

const MENU_ITEMS = [
  { path: '/dashboard', label: 'Dashboard', icon: Home, isBase: true },
  
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
  const location = useLocation();
  
  const isParentActive = hasChildren && item.children.some((child: any) => location.pathname.startsWith(child.path));
  
  return (
    <div className="mb-1">
      {hasChildren ? (
        <button 
          type="button"
          onClick={(e) => {
            e.preventDefault();
            onToggle();
          }}
          aria-expanded={isExpanded}
          className={clsx(
            "w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-semibold transition-all group",
            isParentActive 
              ? "bg-bhu-light text-bhu-dark shadow-sm" 
              : "text-bhu-secondary-text hover:bg-slate-200/50 hover:text-bhu-primary-text"
          )}
        >
          <div className="flex items-center gap-3">
            <Icon className={clsx(
              "w-4 h-4 transition-colors", 
              isParentActive ? "text-bhu-primary" : "text-bhu-muted-text group-hover:text-bhu-primary-text"
            )} />
            {item.label}
          </div>
          <ChevronDown className={clsx("w-4 h-4 text-bhu-muted-text transition-transform duration-200", isExpanded ? "rotate-180" : "")} />
        </button>
      ) : (
        <NavLink 
          to={item.path}
          className={({ isActive: linkActive }) => clsx(
            "flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-semibold transition-all group",
            linkActive 
              ? "bg-bhu-light text-bhu-dark shadow-sm" 
              : "text-bhu-secondary-text hover:bg-slate-200/50 hover:text-bhu-primary-text"
          )}
        >
          {({ isActive: linkActive }) => (
            <div className="flex items-center gap-3">
              <Icon className={clsx(
                "w-4 h-4 transition-colors", 
                linkActive ? "text-bhu-primary" : "text-bhu-muted-text group-hover:text-bhu-primary-text"
              )} />
              {item.label}
            </div>
          )}
        </NavLink>
      )}
      
      {hasChildren && isExpanded && (
        <div className="ml-3 flex flex-col gap-0.5 border-l-2 border-slate-200 pl-2 py-1 mt-1">
          {item.children.map((child: any) => (
            <NavLink
              key={child.path}
              to={child.path}
              className={({ isActive }) => clsx(
                "px-3 py-2 rounded-lg text-xs font-medium transition-colors",
                isActive 
                  ? "text-bhu-dark bg-bhu-light/50 font-semibold" 
                  : "text-bhu-secondary-text hover:text-bhu-primary-text hover:bg-slate-200/50"
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
  const location = useLocation();
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const currentPath = location.pathname;
    
    setExpanded(prev => {
      const newExpanded = { ...prev };
      let hasChanges = false;
      
      MENU_ITEMS.forEach(item => {
        if (item.children) {
          const isChildActive = item.children.some(child => currentPath.startsWith(child.path));
          if (isChildActive && !prev[item.path]) {
            newExpanded[item.path] = true;
            hasChanges = true;
          }
        }
      });
      
      return hasChanges ? newExpanded : prev;
    });
  }, [location.pathname]);

  return (
    <aside className="w-[260px] bg-bhu-sidebar border-r border-slate-200 flex flex-col z-10 shrink-0">
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
        <div className="h-px bg-slate-200/60 my-4 mx-2"></div>

        {/* Secondary Nav */}
        <div>
          {SECONDARY_ITEMS.map((item) => (
            <NavLink 
              key={item.path}
              to={item.path}
              className={({ isActive }) => clsx(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group mb-1",
                isActive ? "bg-bhu-light text-bhu-dark" : "text-bhu-secondary-text hover:bg-slate-200/50 hover:text-bhu-primary-text"
              )}
            >
              <item.icon className="w-4 h-4 text-bhu-muted-text group-hover:text-bhu-primary-text" />
              {item.label}
            </NavLink>
          ))}
        </div>

      </div>

      {/* Promotional Footer */}
      <div className="p-5 border-t border-slate-200 bg-white">
        <div className="bg-bhu-light rounded-xl p-4 border border-bhu-primary/20 relative overflow-hidden">
          <div className="relative z-10">
            <div className="text-xs font-bold text-bhu-dark leading-tight mb-1">Better Data.</div>
            <div className="text-xs font-bold text-bhu-dark leading-tight mb-1">Smarter Policies.</div>
            <div className="text-xs font-bold text-bhu-dark leading-tight">Sustainable Land.</div>
          </div>
          {/* Decorative shapes */}
          <div className="absolute -bottom-4 -right-4 w-20 h-20 bg-bhu-primary/10 rounded-full blur-xl"></div>
          
          {/* Subtle nature/land icon graphic */}
          <svg className="absolute bottom-1 right-1 w-12 h-12 text-bhu-primary/10" fill="currentColor" viewBox="0 0 24 24">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm-1 2l5 5h-5V4zm-3 8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3zm0 4c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z" />
          </svg>
        </div>
      </div>
    </aside>
  );
}
