'use client';

import { Moon, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';

type Theme = 'light' | 'dark';

const ThemeToggle = () => {
  const [theme, setTheme] = useState<Theme>('light');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const storedTheme = localStorage.getItem('theme') as Theme | null;
    if (storedTheme) {
      setTheme(storedTheme);
      document.documentElement.classList.toggle('dark', storedTheme === 'dark');
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setTheme(prefersDark ? 'dark' : 'light');
      document.documentElement.classList.toggle('dark', prefersDark);
    }
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    const nextTheme: Theme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    if (typeof window !== 'undefined') {
      document.documentElement.classList.toggle('dark', nextTheme === 'dark');
      localStorage.setItem('theme', nextTheme);
    }
  };

  if (!mounted) {
    return (
      <button
        type="button"
        aria-label="Toggle theme"
        className="w-10 h-10 rounded-full border border-gray-300 dark:border-gray-700 bg-white/80 dark:bg-gray-900/50 backdrop-blur-sm flex items-center justify-center text-gray-600 dark:text-gray-300"
      >
        <Sun className="w-4 h-4" />
      </button>
    );
  }

  return (
    <button
      type="button"
      aria-label="Toggle theme"
      onClick={toggleTheme}
      className="w-10 h-10 rounded-full border border-gray-300 dark:border-gray-700 bg-white/80 dark:bg-gray-900/50 backdrop-blur-sm flex items-center justify-center text-gray-600 dark:text-gray-300 hover:border-blue-500 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
    >
      {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
    </button>
  );
};

export default ThemeToggle;
