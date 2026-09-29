import { useState, useEffect, useRef } from 'react';
import { Search, Bell, Leaf, User, Bookmark, Settings as SettingsIcon, LogOut } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import defaultAvatar from '../../assets/default-avatar.png';

export function Header() {
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const [unreadCount, setUnreadCount] = useState(0);
  const [profileName, setProfileName] = useState('Suriya N.');
  const [profileRole, setProfileRole] = useState('Researcher');
  const [profileAvatar, setProfileAvatar] = useState<string | null>(null);
  
  const [searchScope, setSearchScope] = useState('All');
  const [enableHistory, setEnableHistory] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [searchFocused, setSearchFocused] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const applySettings = () => {
      const settingsStr = localStorage.getItem('bhu_settings');
      if (settingsStr) {
        const p = JSON.parse(settingsStr);
        setProfileName(p.profileName ?? 'Suriya N.');
        setProfileRole(p.profileRole ?? 'Researcher');
        setProfileAvatar(p.profileAvatar || null);
        setSearchScope(p.searchScope ?? 'All');
        setEnableHistory(p.searchHistory ?? true);
      }
    };
    applySettings();
    window.addEventListener('bhu_settings_changed', applySettings);
    return () => window.removeEventListener('bhu_settings_changed', applySettings);
  }, []);
  useEffect(() => {
    const saved = localStorage.getItem('bhu_notifications');
    if (saved) {
      setUnreadCount(JSON.parse(saved).filter((n: any) => !n.read).length);
    } else {
      setUnreadCount(3); // default from INITIAL_DATA
    }
    
    // listen for local storage changes from Notifications page
    const handleStorageChange = () => {
      const updated = localStorage.getItem('bhu_notifications');
      if (updated) {
        setUnreadCount(JSON.parse(updated).filter((n: any) => !n.read).length);
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setProfileOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setNotifOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setSearchFocused(false);
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setProfileOpen(false);
        setNotifOpen(false);
        setSearchFocused(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    if (enableHistory) {
      const history = JSON.parse(localStorage.getItem('bhu_recent_searches') || '[]');
      const updated = [searchQuery, ...history.filter((q: string) => q !== searchQuery)].slice(0, 5);
      localStorage.setItem('bhu_recent_searches', JSON.stringify(updated));
      setRecentSearches(updated);
    }
    setSearchFocused(false);
    navigate(`/research/repository?q=${encodeURIComponent(searchQuery)}`);
  };

  useEffect(() => {
    if (enableHistory) {
      const history = JSON.parse(localStorage.getItem('bhu_recent_searches') || '[]');
      setRecentSearches(history);
    } else {
      setRecentSearches([]);
    }
  }, [enableHistory]);



  return (
    <header className="bg-bhu-navbar h-[72px] flex items-center justify-between px-6 border-b border-slate-200 z-20 sticky top-0 shadow-sm">
      {/* Brand / Logo */}
      <Link to="/" className="flex items-center gap-3 min-w-[280px] group cursor-pointer hover:opacity-90 transition-opacity">
        <div className="w-10 h-10 rounded-xl bg-bhu-primary flex items-center justify-center text-white shadow-sm transition-transform group-hover:scale-105">
          <Leaf className="w-6 h-6" />
        </div>
        <div className="flex flex-col justify-center">
          <h1 className="text-xl font-black text-bhu-primary-text leading-none mb-1">Bhu-Setu</h1>
          <p className="text-[11px] font-medium text-bhu-muted-text leading-none tracking-wide">National Land Governance Intelligence</p>
        </div>
      </Link>
      
      {/* Search Bar */}
      <div className="flex-1 max-w-3xl mx-8 relative" ref={searchRef}>
        <form onSubmit={handleSearch} className="relative group flex items-center">
          <Search className="absolute left-4 w-4 h-4 text-bhu-muted-text group-focus-within:text-bhu-primary transition-colors" />
          {searchScope !== 'All' && (
            <div className="absolute left-10 text-[10px] font-bold bg-slate-100 text-bhu-primary px-2 py-0.5 rounded uppercase pointer-events-none">
              {searchScope}
            </div>
          )}
          <input 
            type="text" 
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            onFocus={() => setSearchFocused(true)}
            placeholder={`Search ${searchScope === 'All' ? 'research, datasets, policies, maps, and evidence' : searchScope.toLowerCase()}...`}
            className={`w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-bhu-primary focus:ring-4 focus:ring-bhu-primary/10 rounded-xl py-2.5 ${searchScope !== 'All' ? 'pl-24' : 'pl-11'} pr-20 text-sm text-bhu-primary-text transition-all outline-none`}
          />
          <div className="absolute right-3 flex items-center gap-1 bg-white border border-slate-200 px-2 py-1 rounded text-[10px] font-bold text-bhu-muted-text shadow-sm pointer-events-none">
            <span>Ctrl + K</span>
          </div>
        </form>

        {searchFocused && enableHistory && recentSearches.length > 0 && (
          <div className="absolute top-full left-0 mt-2 w-full bg-white border border-slate-200 rounded-xl shadow-lg z-50 p-2">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3 mb-2 mt-1">Recent Searches</div>
            {recentSearches.map((query, i) => (
              <button 
                key={i} 
                onClick={() => {
                  setSearchQuery(query);
                  setSearchFocused(false);
                  navigate(`/research/repository?q=${encodeURIComponent(query)}`);
                }}
                className="w-full text-left px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-bhu-primary rounded-lg transition-colors flex items-center gap-2"
              >
                <Search className="w-3.5 h-3.5 opacity-50" />
                {query}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Right Icons & Profile */}
      <div className="flex items-center gap-5 shrink-0">
        <div className="relative" ref={notifRef}>
          <button 
            onClick={() => setNotifOpen(!notifOpen)}
            className="relative text-bhu-muted-text hover:text-bhu-primary-text transition-colors p-2 rounded-lg hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-bhu-primary/20"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-bhu-danger border-2 border-white rounded-full"></span>
            )}
          </button>
          
          {notifOpen && (
            <div className="absolute top-full right-0 mt-3 w-80 bg-white border border-slate-200 rounded-[16px] shadow-lg origin-top-right animate-in fade-in zoom-in-95 duration-200">
              <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                <h3 className="text-sm font-black text-slate-800">Notifications</h3>
                {unreadCount > 0 && (
                  <span className="text-xs font-bold bg-bhu-primary/10 text-bhu-primary px-2 py-0.5 rounded-full">
                    {unreadCount} new
                  </span>
                )}
              </div>
              <div className="p-2 max-h-64 overflow-y-auto">
                <div className="text-center text-xs text-slate-500 py-6 font-medium">
                  {unreadCount > 0 ? `You have ${unreadCount} unread notifications.` : 'You are all caught up.'}
                </div>
              </div>
              <div className="p-3 border-t border-slate-100 bg-slate-50 rounded-b-[16px]">
                <Link 
                  to="/notifications" 
                  onClick={() => setNotifOpen(false)}
                  className="block w-full text-center text-sm font-bold text-bhu-primary hover:text-bhu-primary/80 transition-colors"
                >
                  View all notifications
                </Link>
              </div>
            </div>
          )}
        </div>
        
        <div className="h-8 w-[1px] bg-slate-200 mx-2"></div>
        
        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={() => setProfileOpen(!profileOpen)}
            aria-haspopup="menu"
            aria-expanded={profileOpen}
            className="flex items-center gap-3 cursor-pointer group focus:outline-none focus:ring-2 focus:ring-bhu-primary/20 rounded-lg p-1 transition-all hover:bg-slate-50"
          >
            <div className="flex flex-col text-right">
              <span className="text-sm font-bold text-bhu-primary-text leading-tight group-hover:text-bhu-primary transition-colors">{profileName}</span>
              <span className="text-xs text-bhu-secondary-text font-medium">{profileRole}</span>
            </div>
            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-slate-100 bg-slate-50 shadow-sm">
              <img src={profileAvatar || defaultAvatar} alt="Profile" className="w-full h-full object-cover" />
            </div>
          </button>

          {/* Profile Dropdown */}
          <div 
            className={`absolute top-full right-0 mt-3 w-56 bg-white border border-slate-200 rounded-[16px] shadow-lg transition-all duration-200 origin-top-right ${
              profileOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
            }`}
          >
            <div className="p-4 border-b border-slate-100 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full overflow-hidden border border-slate-200 shrink-0">
                <img src={profileAvatar || defaultAvatar} alt="Profile" className="w-full h-full object-cover" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-slate-800 leading-tight">{profileName}</span>
                <span className="text-[11px] font-medium text-slate-500">{profileRole}</span>
              </div>
            </div>
            
            <div className="p-2 space-y-0.5">
              <Link 
                to="/profile" 
                onClick={() => setProfileOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2 text-sm font-medium text-slate-600 rounded-lg hover:bg-slate-50 hover:text-bhu-primary transition-colors"
              >
                <User className="w-4 h-4" /> View Profile
              </Link>
              <Link 
                to="/research/saved" 
                onClick={() => setProfileOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2 text-sm font-medium text-slate-600 rounded-lg hover:bg-slate-50 hover:text-bhu-primary transition-colors"
              >
                <Bookmark className="w-4 h-4" /> Saved Research
              </Link>
              <Link 
                to="/notifications" 
                onClick={() => setProfileOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2 text-sm font-medium text-slate-600 rounded-lg hover:bg-slate-50 hover:text-bhu-primary transition-colors"
              >
                <Bell className="w-4 h-4" /> Notifications
              </Link>
              <Link 
                to="/settings" 
                onClick={() => setProfileOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2 text-sm font-medium text-slate-600 rounded-lg hover:bg-slate-50 hover:text-bhu-primary transition-colors"
              >
                <SettingsIcon className="w-4 h-4" /> Settings
              </Link>
            </div>
            
            <div className="border-t border-slate-100 p-2">
              <button 
                onClick={() => {
                  setProfileOpen(false);
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
                  navigate('/');
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-sm font-bold text-red-600 rounded-lg hover:bg-red-50 transition-colors"
              >
                <LogOut className="w-4 h-4" /> Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
