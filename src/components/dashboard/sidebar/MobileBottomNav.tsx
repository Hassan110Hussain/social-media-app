"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { navItems } from "./navConfig";

// Mobile bar: Home, Explore, Saved, Messages, Notifications, Profile (6 items; Settings via profile/sidebar on lg)
const mobileItems = navItems.filter((i) =>
  ["/home", "/explore", "/saved", "/messages", "/notifications"].includes(i.href)
);

const MobileBottomNav = () => {
  const pathname = usePathname();

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-50 flex items-center justify-around gap-0 border-t border-slate-200/80 bg-white/95 shadow-[0_-4px_20px_-4px_rgba(0,0,0,0.08)] backdrop-blur-lg dark:border-slate-800/70 dark:bg-slate-950/95 dark:shadow-none lg:hidden"
      style={{ paddingBottom: "max(0.5rem, env(safe-area-inset-bottom))" }}
      aria-label="Main navigation"
    >
      {mobileItems.map((item) => {
        const active = pathname?.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex min-w-0 flex-1 flex-col items-center gap-0.5 px-1 py-2.5 text-[10px] font-medium transition sm:px-2 sm:py-3 sm:text-xs ${
              active
                ? "text-slate-900 dark:text-white"
                : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
            }`}
            aria-current={active ? "page" : undefined}
          >
            <span
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl sm:h-9 sm:w-9 ${
                active
                  ? "bg-slate-900 text-white shadow-sm dark:bg-white dark:text-slate-950"
                  : "bg-slate-100 text-slate-600 dark:bg-slate-800/80 dark:text-slate-300"
              }`}
            >
              {item.icon}
            </span>
            <span className="truncate max-w-13 sm:max-w-16">{item.label}</span>
          </Link>
        );
      })}
      <Link
        href="/profile"
        className={`flex min-w-0 flex-1 flex-col items-center gap-0.5 px-1 py-2.5 text-[10px] font-medium transition sm:px-2 sm:py-3 sm:text-xs ${
          pathname?.startsWith("/profile")
            ? "text-slate-900 dark:text-white"
            : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
        }`}
        aria-current={pathname?.startsWith("/profile") ? "page" : undefined}
      >
        <span
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl sm:h-9 sm:w-9 ${
            pathname?.startsWith("/profile")
              ? "bg-slate-900 text-white shadow-sm dark:bg-white dark:text-slate-950"
              : "bg-slate-100 text-slate-600 dark:bg-slate-800/80 dark:text-slate-300"
          }`}
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
          </svg>
        </span>
        <span className="truncate max-w-13 sm:max-w-16">Profile</span>
      </Link>
    </nav>
  );
};

export default MobileBottomNav;
