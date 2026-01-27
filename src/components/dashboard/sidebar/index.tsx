"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import ThemeToggle from '@/app/theme-toggle';
import { useSignOut } from '@/contexts/SignOutContext';
import { navItems } from './navConfig';

const Sidebar = () => {
  const pathname = usePathname();
  const { openModal } = useSignOut();

  return (
    <aside className="hidden h-screen w-20 shrink-0 flex-col overflow-hidden border-r border-slate-200/80 bg-white/95 px-3 py-6 shadow-sm shadow-slate-200 backdrop-blur-lg dark:border-slate-800/70 dark:bg-slate-950/80 dark:shadow-none lg:flex sticky top-0">
      {/* Logo */}
      <div className="mb-8 flex items-center justify-center px-1">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-linear-to-tr from-pink-500 via-fuchsia-500 to-amber-400 text-lg font-bold text-white shadow-sm shadow-fuchsia-400/40">
          S
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 overflow-y-auto pb-4 [&::-webkit-scrollbar]:w-0">
        {navItems.map((item) => {
          const active = pathname?.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex cursor-pointer items-center justify-center gap-3 rounded-2xl px-2 py-2 text-sm font-medium transition ${
                active
                  ? 'bg-slate-900 text-white shadow-sm shadow-slate-800/40 ring-2 ring-slate-900/80 dark:bg-white dark:text-slate-950 dark:ring-white/80'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-900/80 dark:hover:text-white'
              }`}
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-slate-700 shadow-inner shadow-slate-200/60 transition dark:bg-slate-900 dark:text-slate-200">
                {item.icon}
              </span>
              <span className="sr-only">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Profile / footer */}
      <div className="mt-auto space-y-3 border-t border-slate-200/70 pt-3 text-xs text-slate-400 dark:border-slate-800/80 dark:text-slate-500">
        
        <div className="flex flex-col items-center gap-2">
          <div className="shrink-0">
            <ThemeToggle />
          </div>
          <Link
            href="/profile"
            className={`flex cursor-pointer items-center justify-center rounded-xl border border-slate-300 bg-white px-2 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 ${
              pathname?.startsWith('/profile')
                ? 'bg-slate-900 text-white shadow-sm shadow-slate-800/40 ring-2 ring-slate-900/80 dark:bg-white dark:text-slate-950 dark:ring-white/80 border-slate-900 dark:border-white'
                : ''
            }`}
          >
            <span className="sr-only">Profile</span>
            <svg
              className="mx-auto h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.8}
                d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
              />
            </svg>
          </Link>
          <button
            type="button"
            onClick={openModal}
            className="flex-1 cursor-pointer rounded-xl border border-slate-300 bg-white px-2 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            <span className="sr-only">Sign out</span>
            <svg
              className="mx-auto h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.8}
                d="M15 12H3m12 0-3.5-3.5M15 12l-3.5 3.5M18 20h1a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-1"
              />
            </svg>
          </button>
        </div>
        
        <p className="text-center text-[11px] leading-snug text-slate-400 dark:text-slate-500">
          Pins mode
        </p>
      </div>
    </aside>
  );
};

export default Sidebar;

