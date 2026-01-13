'use client';

import Link from 'next/link';
import { MessageCircle } from 'lucide-react';
import ThemeToggle from './theme-toggle';

const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur-md transition-colors dark:border-gray-800 dark:bg-black/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-linear-to-br from-blue-500 via-cyan-500 to-blue-600 shadow-lg shadow-blue-500/50">
              <MessageCircle className="h-5 w-5 text-white" />
            </div>
            <span className="bg-linear-to-r from-blue-500 via-cyan-500 to-blue-600 bg-clip-text text-xl font-bold text-transparent">
              SocialHub
            </span>
          </Link>

          {/* Navigation */}
          <nav className="hidden items-center gap-8 md:flex">
            <Link
              href="#features"
              className="text-slate-600 transition-colors hover:text-blue-500 dark:text-gray-300 dark:hover:text-blue-400"
            >
              Features
            </Link>
            <Link
              href="#how-it-works"
              className="text-slate-600 transition-colors hover:text-blue-500 dark:text-gray-300 dark:hover:text-blue-400"
            >
              How it Works
            </Link>
            <Link
              href="#support"
              className="text-slate-600 transition-colors hover:text-blue-500 dark:text-gray-300 dark:hover:text-blue-400"
            >
              Support
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link
              href="/login"
              className="rounded-lg border-2 border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition-all duration-300 hover:border-blue-500 hover:text-blue-500 dark:border-gray-700 dark:text-gray-300 dark:hover:border-blue-500 dark:hover:text-white"
            >
              Sign In
            </Link>
            <Link
              href="/sign-up"
              className="rounded-lg bg-linear-to-r from-purple-500 via-pink-500 to-red-500 px-4 py-2 text-sm font-semibold text-white transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/50"
            >
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
