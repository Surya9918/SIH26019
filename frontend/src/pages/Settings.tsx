import { useState, useEffect, useRef } from 'react';
import { User, LayoutDashboard, Map as MapIcon, Search, Bell, Accessibility, Check } from 'lucide-react';

type SettingsTab = 'PROFILE' | 'DASHBOARD' | 'MAP' | 'SEARCH' | 'NOTIFICATIONS' | 'ACCESSIBILITY';

export function Settings() {
  const [activeTab, setActiveTab] = useState<SettingsTab>('PROFILE');
  const [savedMessage, setSavedMessage] = useState(false);

  // Settings State
  const [profileName, setProfileName] = useState('Suriya N.');
  const [profileRole, setProfileRole] = useState('Researcher');
  const [profileAvatar, setProfileAvatar] = useState<string | null>(null);
  const [avatarError, setAvatarError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [dashKpis, setDashKpis] = useState(true);
  const [dashActivity, setDashActivity] = useState(true);
  const [dashQuickAccess, setDashQuickAccess] = useState(true);
  const [dashInnovation, setDashInnovation] = useState(true);
  
  const [mapView, setMapView] = useState('Map');
  const [mapLayer, setMapLayer] = useState('Land Use');
  const [mapLabels, setMapLabels] = useState(true);
  const [mapBoundaries, setMapBoundaries] = useState(true);
  
  const [searchScope, setSearchScope] = useState('All');
  const [searchHistory, setSearchHistory] = useState(true);

  const [notifResearch, setNotifResearch] = useState(true);
  const [notifPolicy, setNotifPolicy] = useState(true);
  const [notifDataset, setNotifDataset] = useState(true);
  const [notifGis, setNotifGis] = useState(true);
  const [notifInnovation, setNotifInnovation] = useState(true);

  const [accMotion, setAccMotion] = useState(false);
  const [accContrast, setAccContrast] = useState(false);
  const [accLargerText, setAccLargerText] = useState(false);

  // Load from local storage
  useEffect(() => {
    const saved = localStorage.getItem('bhu_settings');
    if (saved) {
      const p = JSON.parse(saved);
      setProfileName(p.profileName ?? 'Suriya N.');
      setProfileRole(p.profileRole ?? 'Researcher');
      if (p.profileAvatar) setProfileAvatar(p.profileAvatar);
      if (p.profileAvatar) setProfileAvatar(p.profileAvatar);
      setDashKpis(p.dashKpis ?? true);
      setDashActivity(p.dashActivity ?? true);
      setDashQuickAccess(p.dashQuickAccess ?? true);
      setDashInnovation(p.dashInnovation ?? true);
      setMapView(p.mapView ?? 'Map');
      setMapLayer(p.mapLayer ?? 'Land Use');
      setMapLabels(p.mapLabels ?? true);
      setMapBoundaries(p.mapBoundaries ?? true);
      setSearchScope(p.searchScope ?? 'All');
      setSearchHistory(p.searchHistory ?? true);
      setNotifResearch(p.notifResearch ?? true);
      setNotifPolicy(p.notifPolicy ?? true);
      setNotifDataset(p.notifDataset ?? true);
      setNotifGis(p.notifGis ?? true);
      setNotifInnovation(p.notifInnovation ?? true);
      setAccMotion(p.accMotion ?? false);
      setAccContrast(p.accContrast ?? false);
      setAccLargerText(p.accLargerText ?? false);
    }
  }, []);

  const handleSave = () => {
    const prefs = {
      profileName, profileRole, profileAvatar, dashKpis, dashActivity, dashQuickAccess, dashInnovation,
      mapView, mapLayer, mapLabels, mapBoundaries,
      searchScope, searchHistory, notifResearch, notifPolicy, notifDataset, notifGis, notifInnovation,
      accMotion, accContrast, accLargerText
    };
    localStorage.setItem('bhu_settings', JSON.stringify(prefs));
    setSavedMessage(true);
    setTimeout(() => setSavedMessage(false), 3000);
    window.dispatchEvent(new Event('bhu_settings_changed'));
  };

  const handleReset = () => {
    localStorage.removeItem('bhu_settings');
    setProfileName('Suriya N.');
    setProfileRole('Researcher');
    setProfileAvatar(null);
    setDashKpis(true);
    setDashActivity(true);
    setDashQuickAccess(true);
    setDashInnovation(true);
    setMapView('Map');
    setMapLayer('Land Use');
    setMapLabels(true);
    setMapBoundaries(true);
    setSearchScope('All');
    setSearchHistory(true);
    setNotifResearch(true);
    setNotifPolicy(true);
    setNotifDataset(true);
    setNotifGis(true);
    setNotifInnovation(true);
    setAccMotion(false);
    setAccContrast(false);
    setAccLargerText(false);
    setSavedMessage(true);
    window.dispatchEvent(new Event('bhu_settings_changed'));
    setTimeout(() => setSavedMessage(false), 3000);
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setAvatarError("Please select an image file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setAvatarError("Please select an image file smaller than 5 MB.");
      return;
    }

    setAvatarError(null);
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      setProfileAvatar(dataUrl);
      
      // Auto-save just the avatar for immediate feedback without requiring save click
      const current = JSON.parse(localStorage.getItem('bhu_settings') || '{}');
      current.profileAvatar = dataUrl;
      localStorage.setItem('bhu_settings', JSON.stringify(current));
      window.dispatchEvent(new Event('bhu_settings_changed'));
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveAvatar = () => {
    setProfileAvatar(null);
    setAvatarError(null);
    const current = JSON.parse(localStorage.getItem('bhu_settings') || '{}');
    delete current.profileAvatar;
    localStorage.setItem('bhu_settings', JSON.stringify(current));
    window.dispatchEvent(new Event('bhu_settings_changed'));
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const TABS = [
    { id: 'PROFILE', label: 'Profile', icon: User },
    { id: 'DASHBOARD', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'MAP', label: 'Map Preferences', icon: MapIcon },
    { id: 'SEARCH', label: 'Search', icon: Search },
    { id: 'NOTIFICATIONS', label: 'Notifications', icon: Bell },
    { id: 'ACCESSIBILITY', label: 'Accessibility', icon: Accessibility },
  ];

  return (
    <div className="max-w-6xl mx-auto pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Settings</h1>
          <p className="text-slate-500">Manage your platform preferences and personal information.</p>
        </div>
        <div className="flex items-center gap-3">
          {savedMessage && (
            <span className="text-sm font-bold text-emerald-600 flex items-center gap-1 mr-2 animate-in fade-in">
              <Check className="w-4 h-4" /> Saved
            </span>
          )}
          <button 
            onClick={handleReset}
            className="px-4 py-2 text-sm font-bold text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors shadow-sm"
          >
            Reset
          </button>
          <button 
            onClick={handleSave}
            className="px-4 py-2 text-sm font-bold text-white bg-bhu-primary rounded-lg hover:bg-bhu-primary/90 transition-colors shadow-sm"
          >
            Save Changes
          </button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <div className="w-full md:w-64 shrink-0 space-y-1">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as SettingsTab)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                activeTab === tab.id 
                  ? 'bg-white text-bhu-primary shadow-sm border border-slate-100' 
                  : 'text-slate-600 hover:bg-slate-100/50 hover:text-slate-900'
              }`}
            >
              <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? 'text-bhu-primary' : 'text-slate-400'}`} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
          
          {activeTab === 'PROFILE' && (
            <div className="space-y-6">
              <h2 className="text-lg font-black text-slate-900 mb-6">Profile Information</h2>
              <div className="flex items-center gap-6 mb-8 pb-8 border-b border-slate-100">
                <div className="w-20 h-20 rounded-full overflow-hidden border border-slate-200 shrink-0">
                  <img src={profileAvatar || "https://i.pravatar.cc/150?u=a042581f4e29026704d"} alt="Profile" className="w-full h-full object-cover" />
                </div>
                <div>
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => fileInputRef.current?.click()}
                      className="px-4 py-2 text-sm font-bold text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
                    >
                      Change Avatar
                    </button>
                    {profileAvatar && (
                      <button 
                        onClick={handleRemoveAvatar}
                        className="text-sm font-medium text-slate-500 hover:text-bhu-danger transition-colors"
                      >
                        Remove Avatar
                      </button>
                    )}
                  </div>
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    accept="image/*" 
                    onChange={handleAvatarChange}
                    aria-label="Upload new avatar"
                  />
                  {avatarError && (
                    <div className="mt-2 text-xs font-bold text-bhu-danger">{avatarError}</div>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Full Name</label>
                  <input type="text" value={profileName} onChange={e => setProfileName(e.target.value)} className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-bhu-primary/20" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Role</label>
                  <input type="text" value={profileRole} onChange={e => setProfileRole(e.target.value)} className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-bhu-primary/20" />
                </div>
                <div className="space-y-2 col-span-2">
                  <label className="text-sm font-bold text-slate-700">Email</label>
                  <input type="text" defaultValue="suriya.n@research.gov.in" disabled className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-sm text-slate-500 cursor-not-allowed" />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'DASHBOARD' && (
            <div className="space-y-6">
              <h2 className="text-lg font-black text-slate-900 mb-6">Dashboard Preferences</h2>
              <div className="space-y-4">
                <label className="flex items-center justify-between p-4 border border-slate-100 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors">
                  <div>
                    <div className="text-sm font-bold text-slate-900">Show KPI Trends</div>
                    <div className="text-xs text-slate-500">Display mini-charts and percentage changes.</div>
                  </div>
                  <input type="checkbox" checked={dashKpis} onChange={e => setDashKpis(e.target.checked)} className="rounded text-bhu-primary focus:ring-bhu-primary w-5 h-5" />
                </label>
                <label className="flex items-center justify-between p-4 border border-slate-100 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors">
                  <div>
                    <div className="text-sm font-bold text-slate-900">Show Recent Activity</div>
                    <div className="text-xs text-slate-500">Display the activity feed on the dashboard overview.</div>
                  </div>
                  <input type="checkbox" checked={dashActivity} onChange={e => setDashActivity(e.target.checked)} className="rounded text-bhu-primary focus:ring-bhu-primary w-5 h-5" />
                </label>
                <label className="flex items-center justify-between p-4 border border-slate-100 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors">
                  <div>
                    <div className="text-sm font-bold text-slate-900">Show Quick Access</div>
                    <div className="text-xs text-slate-500">Display the Quick Access links.</div>
                  </div>
                  <input type="checkbox" checked={dashQuickAccess} onChange={e => setDashQuickAccess(e.target.checked)} className="rounded text-bhu-primary focus:ring-bhu-primary w-5 h-5" />
                </label>
                <label className="flex items-center justify-between p-4 border border-slate-100 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors">
                  <div>
                    <div className="text-sm font-bold text-slate-900">Show Innovation Panel</div>
                    <div className="text-xs text-slate-500">Display the Hackathons & Innovation panel.</div>
                  </div>
                  <input type="checkbox" checked={dashInnovation} onChange={e => setDashInnovation(e.target.checked)} className="rounded text-bhu-primary focus:ring-bhu-primary w-5 h-5" />
                </label>
              </div>
            </div>
          )}

          {activeTab === 'MAP' && (
            <div className="space-y-8">
              <div>
                <h2 className="text-lg font-black text-slate-900 mb-4">Default Map View</h2>
                <select value={mapView} onChange={e => setMapView(e.target.value)} className="w-full max-w-sm bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-bhu-primary/20">
                  <option value="Map">Standard Map</option>
                  <option value="Satellite">Satellite Imagery</option>
                  <option value="Terrain">Terrain</option>
                </select>
              </div>
              <div>
                <h2 className="text-lg font-black text-slate-900 mb-4">Default Active Layer</h2>
                <select value={mapLayer} onChange={e => setMapLayer(e.target.value)} className="w-full max-w-sm bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-bhu-primary/20">
                  <option value="Land Use">Land Use</option>
                  <option value="Climate Risk">Climate Risk</option>
                  <option value="None">None</option>
                </select>
              </div>
                <label className="flex items-center justify-between max-w-sm p-4 border border-slate-100 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors">
                  <span className="text-sm font-bold text-slate-900">Show state boundaries</span>
                  <input type="checkbox" checked={mapBoundaries} onChange={e => setMapBoundaries(e.target.checked)} className="rounded text-bhu-primary focus:ring-bhu-primary w-5 h-5" />
                </label>
                <label className="flex items-center justify-between max-w-sm p-4 border border-slate-100 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors">
                  <span className="text-sm font-bold text-slate-900">Show place labels</span>
                  <input type="checkbox" checked={mapLabels} onChange={e => setMapLabels(e.target.checked)} className="rounded text-bhu-primary focus:ring-bhu-primary w-5 h-5" />
                </label>
              </div>
          )}

          {activeTab === 'SEARCH' && (
            <div className="space-y-8">
              <div>
                <h2 className="text-lg font-black text-slate-900 mb-4">Default Search Scope</h2>
                <select value={searchScope} onChange={e => setSearchScope(e.target.value)} className="w-full max-w-sm bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-bhu-primary/20">
                  <option value="All">All Categories</option>
                  <option value="Research">Research Only</option>
                  <option value="Datasets">Datasets Only</option>
                  <option value="Policies">Policies Only</option>
                </select>
              </div>
              <div className="space-y-4">
                <label className="flex items-center justify-between max-w-sm p-4 border border-slate-100 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors">
                  <div>
                    <div className="text-sm font-bold text-slate-900">Remember Recent Searches</div>
                    <div className="text-xs text-slate-500">Show recent queries in the search dropdown.</div>
                  </div>
                  <input type="checkbox" checked={searchHistory} onChange={e => setSearchHistory(e.target.checked)} className="rounded text-bhu-primary focus:ring-bhu-primary w-5 h-5" />
                </label>
              </div>
            </div>
          )}

          {activeTab === 'NOTIFICATIONS' && (
            <div className="space-y-6">
              <h2 className="text-lg font-black text-slate-900 mb-6">Notification Preferences</h2>
              <div className="space-y-4">
                <label className="flex items-center justify-between p-4 border border-slate-100 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors">
                  <div>
                    <div className="text-sm font-bold text-slate-900">Research & Policy Updates</div>
                  </div>
                  <input type="checkbox" checked={notifResearch} onChange={e => setNotifResearch(e.target.checked)} className="rounded text-bhu-primary focus:ring-bhu-primary w-5 h-5" />
                </label>
                <label className="flex items-center justify-between p-4 border border-slate-100 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors">
                  <div>
                    <div className="text-sm font-bold text-slate-900">Policy Alerts</div>
                  </div>
                  <input type="checkbox" checked={notifPolicy} onChange={e => setNotifPolicy(e.target.checked)} className="rounded text-bhu-primary focus:ring-bhu-primary w-5 h-5" />
                </label>
                <label className="flex items-center justify-between p-4 border border-slate-100 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors">
                  <div>
                    <div className="text-sm font-bold text-slate-900">Dataset Changes</div>
                  </div>
                  <input type="checkbox" checked={notifDataset} onChange={e => setNotifDataset(e.target.checked)} className="rounded text-bhu-primary focus:ring-bhu-primary w-5 h-5" />
                </label>
                <label className="flex items-center justify-between p-4 border border-slate-100 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors">
                  <div>
                    <div className="text-sm font-bold text-slate-900">GIS Alerts</div>
                  </div>
                  <input type="checkbox" checked={notifGis} onChange={e => setNotifGis(e.target.checked)} className="rounded text-bhu-primary focus:ring-bhu-primary w-5 h-5" />
                </label>
                <label className="flex items-center justify-between p-4 border border-slate-100 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors">
                  <div>
                    <div className="text-sm font-bold text-slate-900">Innovation Updates</div>
                  </div>
                  <input type="checkbox" checked={notifInnovation} onChange={e => setNotifInnovation(e.target.checked)} className="rounded text-bhu-primary focus:ring-bhu-primary w-5 h-5" />
                </label>
              </div>
            </div>
          )}

          {activeTab === 'ACCESSIBILITY' && (
            <div className="space-y-6">
              <h2 className="text-lg font-black text-slate-900 mb-6">Accessibility Settings</h2>
              <div className="space-y-4">
                <label className="flex items-center justify-between p-4 border border-slate-100 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors">
                  <div>
                    <div className="text-sm font-bold text-slate-900">Reduce Motion</div>
                    <div className="text-xs text-slate-500">Minimize animations and transitions across the platform.</div>
                  </div>
                  <input type="checkbox" checked={accMotion} onChange={e => setAccMotion(e.target.checked)} className="rounded text-bhu-primary focus:ring-bhu-primary w-5 h-5" />
                </label>
                <label className="flex items-center justify-between p-4 border border-slate-100 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors">
                  <div>
                    <div className="text-sm font-bold text-slate-900">High Contrast</div>
                    <div className="text-xs text-slate-500">Increase contrast of text and borders for better visibility.</div>
                  </div>
                  <input type="checkbox" checked={accContrast} onChange={e => setAccContrast(e.target.checked)} className="rounded text-bhu-primary focus:ring-bhu-primary w-5 h-5" />
                </label>
                <label className="flex items-center justify-between p-4 border border-slate-100 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors">
                  <div>
                    <div className="text-sm font-bold text-slate-900">Larger Text</div>
                    <div className="text-xs text-slate-500">Increase text sizing across the platform.</div>
                  </div>
                  <input type="checkbox" checked={accLargerText} onChange={e => setAccLargerText(e.target.checked)} className="rounded text-bhu-primary focus:ring-bhu-primary w-5 h-5" />
                </label>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
