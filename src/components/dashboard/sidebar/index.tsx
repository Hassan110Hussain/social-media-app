"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import ThemeToggle from '@/components/common/ThemeToggle';
import { useSignOut } from '@/contexts/SignOutContext';

const navItems = [
  { href: '/home', label: 'Home' },
  { href: '/explore', label: 'Explore' },
  { href: '/reels', label: 'Reels' },
  { href: '/saved', label: 'Saved' },
  { href: '/messages', label: 'Messages' },
];

const Sidebar = () => {
  const pathname = usePathname();
  const { openModal } = useSignOut();

  return (
    <aside className="hidden h-screen w-64 flex-col border-r border-slate-200/70 bg-white/90 px-4 py-6 shadow-sm shadow-slate-200 backdrop-blur-lg dark:border-slate-800/70 dark:bg-slate-950/70 dark:shadow-none lg:flex">
      {/* Logo */}
      <div className="mb-6 flex items-center gap-2 px-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-linear-to-tr from-pink-500 via-fuchsia-500 to-amber-400 text-xl font-bold text-white shadow-sm shadow-fuchsia-400/40">
          S
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-bold tracking-tight">SocialBoard</span>
          <span className="text-xs text-slate-400">Inspired by Pinterest</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 overflow-y-auto pb-4">
        {navItems.map((item) => {
          const active = pathname?.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`group flex items-center justify-between rounded-xl px-3 py-2 text-sm font-medium transition ${
                active
                  ? 'bg-slate-900 text-white shadow-sm dark:bg-white dark:text-slate-950'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-900/80 dark:hover:text-white'
              }`}
            >
              <span>{item.label}</span>
              {active && (
                <span className="h-6 w-6 rounded-full bg-linear-to-tr from-pink-500 via-fuchsia-500 to-amber-400 text-center text-xs font-semibold leading-6 text-white shadow-sm shadow-pink-400/40">
                  •
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Profile / footer */}
      <div className="mt-auto space-y-3 border-t border-slate-200/60 pt-4 text-xs text-slate-400 dark:border-slate-800/80 dark:text-slate-500">
        <button
          type="button"
          className="flex w-full items-center justify-between rounded-xl bg-slate-100/80 px-3 py-2 text-xs font-medium text-slate-700 transition hover:bg-slate-200 dark:bg-slate-900/80 dark:text-slate-100 dark:hover:bg-slate-800"
        >
          <span>+ Create board</span>
          <span className="text-lg leading-none">+</span>
        </button>
        
        <div className="flex items-center gap-2">
          <div className="shrink-0">
            <ThemeToggle />
          </div>
          <button
            type="button"
            onClick={openModal}
            className="flex-1 rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            Sign out
          </button>
        </div>
        
        <p className="text-[11px] leading-snug">
          Curate your favorite posts into moodboards, just like Pinterest.
        </p>
      </div>
    </aside>
  );
};

export default Sidebar;

