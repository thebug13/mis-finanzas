import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import MobileNav from './MobileNav';
import NotificationBell from './NotificationBell';
import { useAuth } from '../contexts/AuthContext';
import { useMovimientos } from '../contexts/MovimientosContext';
import ThemeToggle from './ThemeToggle';

export default function Layout() {
  const { user } = useAuth();
  const { error } = useMovimientos();

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950">
      <Sidebar />

      <div className="flex flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3 lg:hidden dark:border-slate-700 dark:bg-slate-900">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500 text-white">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="font-bold text-slate-900 dark:text-white">Mis Finanzas</span>
          </div>
          <div className="flex items-center gap-2">
            <NotificationBell />
            <ThemeToggle />
            {user?.photoURL && (
              <img
                src={user.photoURL}
                alt={user.displayName}
                className="h-8 w-8 rounded-full"
                referrerPolicy="no-referrer"
              />
            )}
          </div>
        </header>

        {error && (
          <div className="border-b border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300">
            <strong>Error de base de datos:</strong> {error}
          </div>
        )}

        <main className="flex-1 overflow-y-auto p-4 pb-24 lg:p-8 lg:pb-8">
          <Outlet />
        </main>

        <MobileNav />
      </div>
    </div>
  );
}
