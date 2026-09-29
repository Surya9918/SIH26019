import { useState, useEffect } from 'react';
import { Bell, Filter, BookOpen, Map, FileText, Database, Box } from 'lucide-react';

type Category = 'ALL' | 'RESEARCH' | 'POLICY' | 'DATASET' | 'GIS' | 'INNOVATION';

interface Notification {
  id: string;
  category: Category;
  title: string;
  description: string;
  time: string;
  timestamp?: string;
  read: boolean;
}

import { formatTimeAgo } from '../utils/time';

const now = Date.now();
const INITIAL_DATA: Notification[] = [
  { id: '1', category: 'POLICY', title: 'Policy document updated', description: 'The National Land Use Policy 2026 draft has been revised.', time: '10 mins ago', timestamp: new Date(now - 10 * 60 * 1000).toISOString(), read: false },
  { id: '2', category: 'RESEARCH', title: 'New research paper added', description: 'A new paper on climate resilience in coastal areas was published.', time: '2 hours ago', timestamp: new Date(now - 2 * 60 * 60 * 1000).toISOString(), read: false },
  { id: '3', category: 'DATASET', title: 'New dataset available', description: '2026 Q1 Soil Health metrics for Southern states uploaded.', time: '5 hours ago', timestamp: new Date(now - 5 * 60 * 60 * 1000).toISOString(), read: false },
  { id: '4', category: 'GIS', title: 'Map layer update', description: 'High-res satellite imagery for Karnataka region updated.', time: '1 day ago', timestamp: new Date(now - 24 * 60 * 60 * 1000).toISOString(), read: true },
  { id: '5', category: 'INNOVATION', title: 'Hackathon registration open', description: 'Register for the SIH 2026 Land Governance challenge.', time: '2 days ago', timestamp: new Date(now - 48 * 60 * 60 * 1000).toISOString(), read: true },
];

const CATEGORY_ICONS: Record<Exclude<Category, 'ALL'>, any> = {
  RESEARCH: BookOpen,
  POLICY: FileText,
  DATASET: Database,
  GIS: Map,
  INNOVATION: Box
};

const CATEGORY_COLORS: Record<Exclude<Category, 'ALL'>, string> = {
  RESEARCH: 'text-blue-500 bg-blue-50',
  POLICY: 'text-amber-500 bg-amber-50',
  DATASET: 'text-emerald-500 bg-emerald-50',
  GIS: 'text-purple-500 bg-purple-50',
  INNOVATION: 'text-rose-500 bg-rose-50'
};

export function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filter, setFilter] = useState<Category>('ALL');
  const [filterOpen, setFilterOpen] = useState(false);

  const [prefs, setPrefs] = useState({
    notifResearch: true,
    notifPolicy: true,
    notifDataset: true,
    notifGis: true,
    notifInnovation: true
  });

  useEffect(() => {
    const saved = localStorage.getItem('bhu_notifications');
    if (saved) {
      // Migrate old data if necessary
      const parsed = JSON.parse(saved);
      const migrated = parsed.map((n: any) => ({
        ...n,
        timestamp: n.timestamp || new Date().toISOString()
      }));
      setNotifications(migrated);
    } else {
      setNotifications(INITIAL_DATA);
    }
  }, []);

  useEffect(() => {
    const applySettings = () => {
      const settingsStr = localStorage.getItem('bhu_settings');
      if (settingsStr) {
        const p = JSON.parse(settingsStr);
        setPrefs({
          notifResearch: p.notifResearch ?? true,
          notifPolicy: p.notifPolicy ?? true,
          notifDataset: p.notifDataset ?? true,
          notifGis: p.notifGis ?? true,
          notifInnovation: p.notifInnovation ?? true
        });
      }
    };
    applySettings();
    window.addEventListener('bhu_settings_changed', applySettings);
    return () => window.removeEventListener('bhu_settings_changed', applySettings);
  }, []);

  useEffect(() => {
    if (notifications.length > 0) {
      localStorage.setItem('bhu_notifications', JSON.stringify(notifications));
    }
  }, [notifications]);

  const activeNotifications = notifications.filter(n => {
    if (n.category === 'RESEARCH' && !prefs.notifResearch) return false;
    if (n.category === 'POLICY' && !prefs.notifPolicy) return false;
    if (n.category === 'DATASET' && !prefs.notifDataset) return false;
    if (n.category === 'GIS' && !prefs.notifGis) return false;
    if (n.category === 'INNOVATION' && !prefs.notifInnovation) return false;
    return true;
  });

  const unreadCount = activeNotifications.filter(n => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const filtered = filter === 'ALL' ? activeNotifications : activeNotifications.filter(n => n.category === filter);

  return (
    <div className="max-w-4xl mx-auto pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2 flex items-center gap-3">
            Notifications
            {unreadCount > 0 && (
              <span className="text-sm font-bold bg-bhu-primary text-white px-2.5 py-1 rounded-full">
                {unreadCount} new
              </span>
            )}
          </h1>
          <p className="text-slate-500">Stay updated on recent platform activity.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={markAllAsRead}
            disabled={unreadCount === 0}
            className="text-sm font-bold text-bhu-primary hover:text-bhu-primary/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Mark all as read
          </button>
          
          <div className="relative">
            <button 
              onClick={() => setFilterOpen(!filterOpen)}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg shadow-sm hover:bg-slate-50 text-sm font-bold text-slate-700 transition-colors"
            >
              <Filter className="w-4 h-4" />
              {filter === 'ALL' ? 'Filter' : filter}
            </button>
            {filterOpen && (
              <div className="absolute top-full right-0 mt-2 w-48 bg-white border border-slate-200 shadow-xl rounded-xl p-2 z-10">
                {(['ALL', 'RESEARCH', 'POLICY', 'DATASET', 'GIS', 'INNOVATION'] as Category[]).map(cat => (
                  <button
                    key={cat}
                    onClick={() => { setFilter(cat); setFilterOpen(false); }}
                    className={`w-full text-left px-3 py-2 text-sm font-bold rounded-lg mb-1 last:mb-0 transition-colors ${
                      filter === cat ? 'bg-slate-100 text-bhu-primary' : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-12 text-center text-slate-500 font-medium">
            No notifications found for this category.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filtered.map(notif => {
              const Icon = CATEGORY_ICONS[notif.category as Exclude<Category, 'ALL'>] || Bell;
              const colorClass = CATEGORY_COLORS[notif.category as Exclude<Category, 'ALL'>] || 'text-slate-500 bg-slate-50';
              
              return (
                <div 
                  key={notif.id} 
                  onClick={() => markAsRead(notif.id)}
                  className={`p-5 flex gap-4 transition-colors cursor-pointer hover:bg-slate-50 ${!notif.read ? 'bg-blue-50/30' : ''}`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${colorClass}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-4 mb-1">
                      <h3 className={`text-sm font-bold ${!notif.read ? 'text-slate-900' : 'text-slate-700'}`}>
                        {notif.title}
                      </h3>
                      <span className="text-xs font-medium text-slate-400 whitespace-nowrap">
                        {notif.timestamp ? formatTimeAgo(notif.timestamp) : notif.time}
                      </span>
                    </div>
                    <p className={`text-sm ${!notif.read ? 'text-slate-700 font-medium' : 'text-slate-500'}`}>
                      {notif.description}
                    </p>
                    <div className="mt-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      {notif.category}
                    </div>
                  </div>
                  {!notif.read && (
                    <div className="flex items-center justify-center shrink-0 self-center">
                      <div className="w-2.5 h-2.5 bg-bhu-primary rounded-full"></div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
