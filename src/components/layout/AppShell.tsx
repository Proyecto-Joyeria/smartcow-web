import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { BottomNav } from './BottomNav';

export function AppShell() {
  return (
    <div className="min-h-screen bg-surface-primary flex flex-col">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <aside className="hidden md:flex">
          <Sidebar />
        </aside>
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
      <nav className="md:hidden">
        <BottomNav />
      </nav>
    </div>
  );
}
