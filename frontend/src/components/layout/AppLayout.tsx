import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { CommandPalette } from '../CommandPalette';

export function AppLayout() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50/50 text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-900">
      <Header />
      <div className="flex flex-1 overflow-hidden h-[calc(100vh-72px)]">
        <Sidebar />
        <main className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          <Outlet />
        </main>
      </div>
      <CommandPalette />
    </div>
  );
}
