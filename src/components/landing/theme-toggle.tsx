'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

const ThemeToggle = () => {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // useEffect only runs on the client, so now we can safely show the UI
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button
        type="button"
        aria-label="Toggle theme"
        className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white/70 px-3 py-2 text-slate-900 shadow-sm transition-all hover:border-blue-400 hover:text-blue-600 dark:border-gray-700 dark:bg-gray-900/70 dark:text-white dark:hover:border-blue-400"
      >
        <Sun className="h-4 w-4" />
      </button>
    );
  }

  const isDark = resolvedTheme === 'dark';
  const Icon = isDark ? Sun : Moon;

  const toggleTheme = () => {
    setTheme(isDark ? 'light' : 'dark');
  };

  return (
    <button
      type="button"
      aria-label={`Activate ${isDark ? 'light' : 'dark'} mode`}
      onClick={toggleTheme}
      className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white/70 px-3 py-2 text-slate-900 shadow-sm transition-all hover:border-blue-400 hover:text-blue-600 dark:border-gray-700 dark:bg-gray-900/70 dark:text-white dark:hover:border-blue-400"
    >
      <Icon className="h-4 w-4" />
    </button>
  );
};

export default ThemeToggle;

