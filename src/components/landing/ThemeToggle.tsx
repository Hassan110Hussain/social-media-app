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
        className="w-10 h-10 rounded-full border border-gray-300 dark:border-gray-700 bg-white/80 dark:bg-gray-900/50 backdrop-blur-sm flex items-center justify-center text-gray-600 dark:text-gray-300"
      >
        <Sun className="w-4 h-4" />
      </button>
    );
  }

  const isDark = resolvedTheme === 'dark';

  const toggleTheme = () => {
    setTheme(isDark ? 'light' : 'dark');
  };

  return (
    <button
      type="button"
      aria-label="Toggle theme"
      onClick={toggleTheme}
      className="w-10 h-10 rounded-full border border-gray-300 dark:border-gray-700 bg-white/80 dark:bg-gray-900/50 backdrop-blur-sm flex items-center justify-center text-gray-600 dark:text-gray-300 hover:border-blue-500 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
    >
      {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
    </button>
  );
};

export default ThemeToggle;
