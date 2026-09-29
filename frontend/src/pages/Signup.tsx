import { useState } from 'react';
import { Leaf } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const ROLES = [
  "Researcher",
  "Policy Analyst",
  "GIS Analyst",
  "Data Analyst",
  "Government Administrator",
  "Academic / Student"
];

export function Signup() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('');
  const [error, setError] = useState('');

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!role) {
      setError("Please select your role.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    
    // Save to shared frontend profile
    const currentSettings = JSON.parse(localStorage.getItem('bhu_settings') || '{}');
    currentSettings.profileName = name;
    currentSettings.profileRole = role;
    currentSettings.profileEmail = email;
    localStorage.setItem('bhu_settings', JSON.stringify(currentSettings));
    window.dispatchEvent(new Event('bhu_settings_changed'));
    
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 selection:bg-teal-100">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 p-8 sm:p-10">
        
        {/* Branding */}
        <div className="flex items-center gap-3 justify-center mb-8">
          <div className="w-10 h-10 rounded-xl bg-[#008B72] flex items-center justify-center text-white shadow-sm">
            <Leaf className="w-5 h-5" />
          </div>
          <div className="flex flex-col justify-center">
            <h1 className="text-xl font-black text-[#0F172A] leading-none mb-0.5">Bhu-Setu</h1>
            <p className="text-[9px] font-bold text-slate-500 uppercase tracking-[0.15em] leading-none">National Land Governance</p>
          </div>
        </div>

        <h2 className="text-2xl font-black text-[#0F172A] mb-2 text-center">Create an account</h2>
        <p className="text-sm text-slate-500 mb-8 text-center font-medium">Join the national land governance platform</p>

        <form onSubmit={handleSignup} className="space-y-4">
          {error && <div className="text-bhu-danger text-xs font-bold bg-red-50 p-3 rounded-xl border border-red-100">{error}</div>}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">Full Name</label>
            <input 
              type="text" 
              required
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Dr. Ashok Kumar"
              className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:bg-white focus:border-[#008B72] focus:ring-4 focus:ring-[#008B72]/10 outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">Email Address</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="name@domain.gov.in"
              className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:bg-white focus:border-[#008B72] focus:ring-4 focus:ring-[#008B72]/10 outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">Role</label>
            <select
              value={role}
              onChange={e => setRole(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:bg-white focus:border-[#008B72] focus:ring-4 focus:ring-[#008B72]/10 outline-none transition-all cursor-pointer"
            >
              <option value="" disabled>Select your role</option>
              {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">Password</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:bg-white focus:border-[#008B72] focus:ring-4 focus:ring-[#008B72]/10 outline-none transition-all"
            />
          </div>
          
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">Confirm Password</label>
            <input 
              type="password" 
              required
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:bg-white focus:border-[#008B72] focus:ring-4 focus:ring-[#008B72]/10 outline-none transition-all"
            />
          </div>

          <button 
            type="submit" 
            className="w-full bg-[#008B72] text-white font-bold py-3.5 rounded-xl shadow-[0_8px_20px_-6px_rgba(0,139,114,0.4)] hover:shadow-[0_12px_24px_-6px_rgba(0,139,114,0.5)] hover:-translate-y-0.5 transition-all mt-4"
          >
            Create Account
          </button>
        </form>

        <div className="mt-8 text-center text-sm font-medium text-slate-500">
          Already have an account?{' '}
          <Link to="/login" className="font-bold text-[#008B72] hover:text-[#00695C] transition-colors">
            Login here
          </Link>
        </div>
      </div>
    </div>
  );
}
