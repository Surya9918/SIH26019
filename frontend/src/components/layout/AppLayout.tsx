import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { GovBanner } from './GovBanner';
import { CommandPalette } from '../CommandPalette';

export function AppLayout() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <GovBanner />
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
      <CommandPalette />
    </div>
  );
}
