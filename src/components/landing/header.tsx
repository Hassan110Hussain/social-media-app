'use client';

import { useState } from 'react';
import Link from 'next/link';
import { MessageCircle, Menu, X } from 'lucide-react';
import { ROUTES } from '@/utils/constants';
import ThemeToggle from '../../app/theme-toggle';

const navLinks = [
  { href: '#features', label: 'Features' },
  { href: '#how-it-works', label: 'How it Works' },
  { href: '#support', label: 'Support' },
];

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur-md transition-colors dark:border-gray-800 dark:bg-black/80">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-14 items-center justify-between sm:h-16">
          {/* Logo */}
          <Link href={ROUTES.home} className="flex shrink-0 cursor-pointer items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-linear-to-br from-blue-500 via-cyan-500 to-blue-600 shadow-lg shadow-blue-500/50 sm:h-8 sm:w-8">
              <MessageCircle className="h-4 w-4 text-white sm:h-5 sm:w-5" />
            </div>
            <span className="bg-linear-to-r from-blue-500 via-cyan-500 to-blue-600 bg-clip-text text-lg font-bold text-transparent sm:text-xl">
              SocialHub
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-6 md:flex lg:gap-8" aria-label="Main">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="cursor-pointer text-slate-600 transition-colors hover:text-blue-500 dark:text-gray-300 dark:hover:text-blue-400"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            <ThemeToggle />
            <Link
              href={ROUTES.login}
              className="hidden cursor-pointer rounded-lg border-2 border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-700 transition-all duration-300 hover:border-blue-500 hover:text-blue-500 dark:border-gray-700 dark:text-gray-300 dark:hover:border-blue-500 dark:hover:text-white sm:inline-flex sm:px-4 sm:py-2"
            >
              Sign In
            </Link>
            <Link
              href={ROUTES.signUp}
              className="cursor-pointer rounded-lg bg-linear-to-r from-purple-500 via-pink-500 to-red-500 px-3 py-1.5 text-sm font-semibold text-white transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/50 sm:px-4 sm:py-2"
            >
              Get Started
            </Link>
            {/* Mobile menu button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen((o) => !o)}
              className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white md:hidden"
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-nav"
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        id="mobile-nav"
        className={`overflow-hidden border-t border-slate-200 bg-white/95 backdrop-blur-lg transition-all duration-200 dark:border-gray-800 dark:bg-black/95 md:hidden ${
          mobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
        aria-hidden={!mobileMenuOpen}
      >
        <nav className="flex flex-col gap-0 px-4 py-3" aria-label="Main">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="cursor-pointer rounded-lg px-3 py-2.5 text-slate-600 transition-colors hover:bg-slate-100 hover:text-blue-500 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-blue-400"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href={ROUTES.login}
            onClick={() => setMobileMenuOpen(false)}
            className="mt-2 cursor-pointer rounded-lg border-2 border-slate-200 px-3 py-2.5 text-center text-sm font-medium text-slate-700 transition-colors hover:border-blue-500 hover:text-blue-500 dark:border-gray-700 dark:text-gray-300 dark:hover:border-blue-500 dark:hover:text-white md:hidden"
          >
            Sign In
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
