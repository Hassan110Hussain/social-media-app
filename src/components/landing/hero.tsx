'use client';

import Link from 'next/link';
import { TrendingUp } from 'lucide-react';
import { ROUTES } from '@/utils/constants';

const Hero = () => {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-white px-4 py-8 pt-20 text-slate-900 transition-colors dark:bg-black dark:text-white sm:px-6 sm:py-12 sm:pt-24">
      {/* Animated colorful liquid-like blobs */}
      <div className="absolute top-0 left-0 h-[500px] w-[500px] rounded-full bg-linear-to-br from-red-500 via-orange-500 to-yellow-500 opacity-10 blur-3xl mix-blend-screen animate-pulse dark:opacity-20"></div>
      <div
        className="absolute top-1/4 right-0 h-[450px] w-[450px] rounded-full bg-linear-to-br from-blue-400 via-cyan-400 to-blue-600 opacity-15 blur-3xl mix-blend-screen animate-pulse dark:opacity-25"
        style={{ animationDelay: '1s' }}
      ></div>
      <div
        className="absolute bottom-0 left-1/3 h-[400px] w-[400px] rounded-full bg-linear-to-br from-green-400 via-emerald-500 to-green-600 opacity-10 blur-3xl mix-blend-screen animate-pulse dark:opacity-20"
        style={{ animationDelay: '2s' }}
      ></div>
      <div
        className="absolute bottom-1/4 right-1/4 h-[350px] w-[350px] rounded-full bg-linear-to-br from-purple-500 via-pink-500 to-red-500 opacity-15 blur-3xl mix-blend-screen animate-pulse dark:opacity-25"
        style={{ animationDelay: '0.5s' }}
      ></div>
      
      <div className="relative w-full max-w-5xl z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Hero content */}
          <div className="space-y-8 text-center lg:text-left">
            <div className="space-y-4">
              <div className="inline-block">
                <span className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-linear-to-r from-blue-500/10 to-cyan-500/10 px-4 py-2 text-sm font-medium text-blue-600 backdrop-blur-sm dark:text-blue-300">
                  <TrendingUp className="w-4 h-4" />
                  Connect & Share
                </span>
              </div>
              <h1 className="text-3xl font-bold leading-tight sm:text-4xl md:text-5xl lg:text-6xl">
                Welcome to Your
                <span className="block bg-linear-to-r from-blue-500 via-cyan-500 to-pink-500 bg-clip-text text-transparent">
                  Social World
                </span>
              </h1>
              <p className="mx-auto max-w-xl text-base text-slate-600 dark:text-gray-300 sm:text-lg lg:mx-0">
                Join millions of people sharing moments, building connections, and discovering communities that matter to you.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col gap-3 sm:flex-row sm:gap-4 lg:justify-start">
              <Link
                href={ROUTES.signUp}
                className="group relative inline-flex items-center justify-center overflow-hidden rounded-xl bg-linear-to-r from-blue-500 via-cyan-500 to-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/30 transition-all duration-300 hover:scale-105 hover:shadow-blue-500/70 sm:rounded-2xl sm:px-8 sm:py-4 sm:text-base"
              >
                <span className="relative z-10">Get Started</span>
                <div className="absolute inset-0 bg-linear-to-r from-purple-500 via-pink-500 to-red-500 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
              </Link>
              <Link
                href={ROUTES.login}
                className="inline-flex items-center justify-center rounded-xl border-2 border-slate-200 bg-white/70 px-6 py-3 text-sm font-semibold text-slate-800 transition-all duration-300 hover:border-blue-500 hover:text-blue-500 dark:border-gray-700 dark:bg-black/40 dark:text-white dark:hover:text-blue-400 sm:rounded-2xl sm:px-8 sm:py-4 sm:text-base"
              >
                Sign In
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3 pt-6 sm:gap-6 sm:pt-8">
              <div className="space-y-0.5 sm:space-y-1">
                <div className="bg-linear-to-r from-blue-500 to-cyan-500 bg-clip-text text-lg font-bold text-transparent sm:text-2xl">10M+</div>
                <div className="text-xs text-slate-500 dark:text-gray-400 sm:text-sm">Active Users</div>
              </div>
              <div className="space-y-0.5 sm:space-y-1">
                <div className="bg-linear-to-r from-purple-500 to-pink-500 bg-clip-text text-lg font-bold text-transparent sm:text-2xl">50M+</div>
                <div className="text-xs text-slate-500 dark:text-gray-400 sm:text-sm">Posts Shared</div>
              </div>
              <div className="space-y-0.5 sm:space-y-1">
                <div className="bg-linear-to-r from-green-500 to-emerald-500 bg-clip-text text-lg font-bold text-transparent sm:text-2xl">150+</div>
                <div className="text-xs text-slate-500 dark:text-gray-400 sm:text-sm">Countries</div>
              </div>
            </div>
          </div>

          {/* Right side - Feature cards preview */}
          <div className="relative hidden sm:block">
            <div className="grid grid-cols-2 gap-2 lg:gap-4">
              <div className="space-y-2 pt-4 lg:space-y-4 lg:pt-12">
                <div className="translate-y-4 rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-lg shadow-blue-500/10 transition-all duration-300 hover:border-blue-500/50 hover:shadow-blue-500/30 dark:border-gray-800 dark:bg-gray-900/50 dark:shadow-blue-500/20 lg:translate-y-8 lg:rounded-3xl lg:p-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-linear-to-br from-blue-500 to-cyan-500 shadow-lg shadow-blue-500/50">
                    <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <h3 className="mb-2 font-semibold">Connect</h3>
                  <p className="text-sm text-slate-600 dark:text-gray-400">Build meaningful relationships worldwide</p>
                </div>
                
                <div className="translate-y-4 rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-lg shadow-purple-500/10 transition-all duration-300 hover:border-purple-500/50 hover:shadow-purple-500/30 dark:border-gray-800 dark:bg-gray-900/50 dark:shadow-purple-500/20 lg:translate-y-8 lg:rounded-3xl lg:p-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-linear-to-br from-purple-500 to-pink-500 shadow-lg shadow-purple-500/50">
                    <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                    </svg>
                  </div>
                  <h3 className="mb-2 font-semibold">Share</h3>
                  <p className="text-sm text-slate-600 dark:text-gray-400">Express yourself through photos, videos, and stories</p>
                </div>
              </div>

              <div className="space-y-2 lg:space-y-4">
                <div className="translate-y-4 rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-lg shadow-pink-500/10 transition-all duration-300 hover:border-pink-500/50 hover:shadow-pink-500/30 dark:border-gray-800 dark:bg-gray-900/50 dark:shadow-pink-500/20 lg:translate-y-8 lg:rounded-3xl lg:p-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-linear-to-br from-pink-500 to-red-500 shadow-lg shadow-pink-500/50">
                    <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  <h3 className="mb-2 font-semibold">Engage</h3>
                  <p className="text-sm text-slate-600 dark:text-gray-400">Join conversations and discover trending topics</p>
                </div>
                
                <div className="translate-y-4 rounded-2xl bg-linear-to-br from-blue-600 via-purple-600 to-pink-600 p-4 text-white shadow-lg transition-all duration-300 hover:shadow-purple-500/50 lg:translate-y-8 lg:rounded-3xl lg:p-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/30 backdrop-blur-sm">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold mb-2">Grow</h3>
                  <p className="text-sm text-white/80">Expand your network and reach new audiences</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
