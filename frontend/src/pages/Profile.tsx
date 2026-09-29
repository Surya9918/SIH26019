import { User, Mail, Shield, BookOpen, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

export function Profile() {
  const [profileName, setProfileName] = useState('Suriya N.');
  const [profileRole, setProfileRole] = useState('Researcher');
  const [profileAvatar, setProfileAvatar] = useState<string | null>(null);

  useEffect(() => {
    const applySettings = () => {
      const settingsStr = localStorage.getItem('bhu_settings');
      if (settingsStr) {
        const p = JSON.parse(settingsStr);
        setProfileName(p.profileName ?? 'Suriya N.');
        setProfileRole(p.profileRole ?? 'Researcher');
        if (p.profileAvatar) setProfileAvatar(p.profileAvatar);
        else setProfileAvatar(null);
      }
    };
    applySettings();
    window.addEventListener('bhu_settings_changed', applySettings);
    return () => window.removeEventListener('bhu_settings_changed', applySettings);
  }, []);
  return (
    <div className="max-w-6xl mx-auto pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2">My Profile</h1>
        <p className="text-slate-500 max-w-3xl leading-relaxed">
          Manage your account settings, preferences, and personal information.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column - User Info */}
        <div className="md:col-span-1 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col items-center text-center">
            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-slate-50 mb-4 shadow-sm">
              <img src={profileAvatar || "https://i.pravatar.cc/150?u=a042581f4e29026704d"} alt="Profile" className="w-full h-full object-cover" />
            </div>
            <h2 className="text-xl font-bold text-slate-900">{profileName}</h2>
            <p className="text-sm font-medium text-gov-blue mb-4">{profileRole}</p>
            <div className="w-full h-px bg-slate-100 my-4"></div>
            <div className="w-full space-y-3">
              <div className="flex items-center gap-3 text-sm text-slate-600">
                <Mail className="w-4 h-4 text-slate-400" />
                <span>suriya.n@research.gov.in</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-600">
                <Shield className="w-4 h-4 text-slate-400" />
                <span>Level 2 Clearance</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Activity & Preferences */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-5 border-b border-slate-100 bg-slate-50/50">
              <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-gov-blue" />
                Recent Activity
              </h3>
            </div>
            <div className="divide-y divide-slate-100 p-2">
              <div className="p-4 flex items-center gap-4">
                <div className="w-8 h-8 rounded-lg bg-gov-blue/10 text-gov-blue flex items-center justify-center">
                  <BookOpen className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-900">Viewed "Land Use Act 2024"</p>
                  <p className="text-xs text-slate-500">2 hours ago</p>
                </div>
              </div>
              <div className="p-4 flex items-center gap-4">
                <div className="w-8 h-8 rounded-lg bg-gov-saffron/10 text-gov-saffron flex items-center justify-center">
                  <User className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-900">Updated profile information</p>
                  <p className="text-xs text-slate-500">1 day ago</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-800 mb-1 flex items-center gap-2">
                <Settings className="w-4 h-4 text-slate-400" /> Account Preferences
              </h3>
              <p className="text-sm text-slate-500">Manage notifications, display, and security settings.</p>
            </div>
            <Link to="/settings" className="px-4 py-2 bg-slate-100 text-slate-700 text-sm font-bold rounded-lg hover:bg-slate-200 transition-colors">
              Go to Settings
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
