import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { CommandPalette } from '../CommandPalette';

export function AppLayout() {
  return (
    <div className="flex flex-col min-h-screen text-bhu-primary-text font-sans selection:bg-bhu-light selection:text-bhu-primary">
      <Header />
      <div className="flex flex-1 overflow-hidden h-[calc(100vh-72px)]">
        <Sidebar />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 custom-scrollbar">
          <Outlet />
        </main>
      </div>
      <CommandPalette />
    </div>
  );
}
