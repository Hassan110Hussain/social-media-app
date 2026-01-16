'use client';

import { Moon, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';

type Theme = 'light' | 'dark';

const getPreferredTheme = (): Theme => {
  if (typeof window === 'undefined') return 'light';
  const stored = window.localStorage.getItem('theme') as Theme | null;
  if (stored === 'light' || stored === 'dark') return stored;
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  return prefersDark ? 'dark' : 'light';
};

const ThemeToggle = () => {
  const [theme, setTheme] = useState<Theme>('light');

  useEffect(() => {
    setTheme(getPreferredTheme());
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const root = document.documentElement;
    root.classList.toggle('dark', theme === 'dark');
    root.dataset.theme = theme;
    window.localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const Icon = theme === 'dark' ? Sun : Moon;

  return (
    <button
      type="button"
      aria-label={`Activate ${theme === 'dark' ? 'light' : 'dark'} mode`}
      onClick={toggleTheme}
      className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white/70 px-3 py-2 text-slate-900 shadow-sm transition-all hover:border-blue-400 hover:text-blue-600 dark:border-gray-700 dark:bg-gray-900/70 dark:text-white dark:hover:border-blue-400"
    >
      <Icon className="h-4 w-4" />
    </button>
  );
};

export default ThemeToggle;

