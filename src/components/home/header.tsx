'use client';

import Link from 'next/link';
import { MessageCircle } from 'lucide-react';

const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 via-cyan-500 to-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/50">
              <MessageCircle className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent">
              SocialHub
            </span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href="#features" className="text-gray-300 hover:text-blue-400 transition-colors">
              Features
            </Link>
            <Link href="#how-it-works" className="text-gray-300 hover:text-blue-400 transition-colors">
              How it Works
            </Link>
            <Link href="#support" className="text-gray-300 hover:text-blue-400 transition-colors">
              Support
            </Link>
          </nav>

          {/* Auth Buttons */}
          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/sign-up"
              className="px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 rounded-lg hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-300"
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
