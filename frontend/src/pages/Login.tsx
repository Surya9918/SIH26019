import { Leaf } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export function Login() {
  const navigate = useNavigate();

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

        <form onSubmit={(e) => { e.preventDefault(); navigate('/dashboard'); }} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">Email Address</label>
            <input 
              type="email" 
              required
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
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:bg-white focus:border-[#008B72] focus:ring-4 focus:ring-[#008B72]/10 outline-none transition-all"
            />
          </div>

          <button 
            type="submit" 
            className="w-full bg-[#008B72] text-white font-bold py-3.5 rounded-xl shadow-[0_8px_20px_-6px_rgba(0,139,114,0.4)] hover:shadow-[0_12px_24px_-6px_rgba(0,139,114,0.5)] hover:-translate-y-0.5 transition-all mt-2"
          >
            Login to Dashboard
          </button>
        </form>

        <div className="mt-8 text-center text-sm font-medium text-slate-500">
          Don't have an account?{' '}
          <Link to="/signup" className="font-bold text-[#008B72] hover:text-[#00695C] transition-colors">
            Sign up now
          </Link>
        </div>
      </div>
    </div>
  );
}
