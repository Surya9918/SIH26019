import { useState } from 'react';
import { Leaf, Loader2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { fetchApi } from '../services/api';
import { useAuth } from '../context/AuthContext';

export function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetchApi<any>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({
          username,
          password
        })
      });

      if (res.status === 'SUCCESS' && res.access_token) {
        login(res.access_token, res.user);
        navigate('/dashboard');
      } else {
        setError(res.message || "Login failed.");
      }
    } catch (err: any) {
      setError(err.message || "Invalid credentials.");
    } finally {
      setLoading(false);
    }
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

        <h2 className="text-2xl font-black text-[#0F172A] mb-2 text-center">Welcome back</h2>
        <p className="text-sm text-slate-500 mb-8 text-center font-medium">Enter your credentials to access your dashboard</p>

        <form onSubmit={handleLogin} className="space-y-5">
          {error && <div className="text-bhu-danger text-xs font-bold bg-red-50 p-3 rounded-xl border border-red-100">{error}</div>}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">Username or Email</label>
            <input 
              type="text" 
              required
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder="name@domain.gov.in"
              className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:bg-white focus:border-[#008B72] focus:ring-4 focus:ring-[#008B72]/10 outline-none transition-all"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide">Password</label>
              <a href="#" className="text-xs font-bold text-[#008B72] hover:text-[#00695C] transition-colors">Forgot password?</a>
            </div>
            <input 
              type="password" 
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:bg-white focus:border-[#008B72] focus:ring-4 focus:ring-[#008B72]/10 outline-none transition-all"
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-[#008B72] text-white font-bold py-3.5 rounded-xl shadow-[0_8px_20px_-6px_rgba(0,139,114,0.4)] hover:shadow-[0_12px_24px_-6px_rgba(0,139,114,0.5)] hover:-translate-y-0.5 transition-all mt-2 disabled:opacity-70 disabled:hover:translate-y-0 flex items-center justify-center gap-2"
          >
            {loading ? <><Loader2 className="w-5 h-5 animate-spin" /> Logging in...</> : "Login to Dashboard"}
          </button>
        </form>

        {/* Quick Demo Credentials */}
        <div className="mt-6 pt-5 border-t border-slate-100">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider text-center mb-2.5">
            Quick Demo Login (1-Click Fill)
          </p>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => { setUsername('admin'); setPassword('AdminPass@2026'); setError(''); }}
              className="px-2 py-1.5 rounded-lg bg-slate-50 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200 border border-slate-200 text-[11px] font-bold text-slate-700 transition-all text-center"
            >
              Admin
            </button>
            <button
              type="button"
              onClick={() => { setUsername('researcher'); setPassword('ResearcherPass@2026'); setError(''); }}
              className="px-2 py-1.5 rounded-lg bg-slate-50 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200 border border-slate-200 text-[11px] font-bold text-slate-700 transition-all text-center"
            >
              Researcher
            </button>
            <button
              type="button"
              onClick={() => { setUsername('analyst'); setPassword('PolicyPass@2026'); setError(''); }}
              className="px-2 py-1.5 rounded-lg bg-slate-50 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200 border border-slate-200 text-[11px] font-bold text-slate-700 transition-all text-center"
            >
              Analyst
            </button>
          </div>
        </div>

        <div className="mt-6 text-center text-sm font-medium text-slate-500">
          Don't have an account?{' '}
          <Link to="/signup" className="font-bold text-[#008B72] hover:text-[#00695C] transition-colors">
            Sign up now
          </Link>
        </div>
      </div>
    </div>
  );
}
