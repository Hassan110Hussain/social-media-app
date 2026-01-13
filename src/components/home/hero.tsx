'use client';

import Link from 'next/link';
import { TrendingUp } from 'lucide-react';

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 py-12 pt-24 bg-black overflow-hidden">
      {/* Animated colorful liquid-like blobs */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-gradient-to-br from-red-500 via-orange-500 to-yellow-500 rounded-full mix-blend-screen opacity-20 blur-3xl animate-pulse"></div>
      <div className="absolute top-1/4 right-0 w-[450px] h-[450px] bg-gradient-to-br from-blue-400 via-cyan-400 to-blue-600 rounded-full mix-blend-screen opacity-25 blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      <div className="absolute bottom-0 left-1/3 w-[400px] h-[400px] bg-gradient-to-br from-green-400 via-emerald-500 to-green-600 rounded-full mix-blend-screen opacity-20 blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      <div className="absolute bottom-1/4 right-1/4 w-[350px] h-[350px] bg-gradient-to-br from-purple-500 via-pink-500 to-red-500 rounded-full mix-blend-screen opacity-25 blur-3xl animate-pulse" style={{ animationDelay: '0.5s' }}></div>
      
      <div className="relative w-full max-w-5xl z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Hero content */}
          <div className="space-y-8 text-center lg:text-left">
            <div className="space-y-4">
              <div className="inline-block">
                <span className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-500/30 text-blue-300 rounded-full text-sm font-medium backdrop-blur-sm">
                  <TrendingUp className="w-4 h-4" />
                  Connect & Share
                </span>
              </div>
              <h1 className="text-5xl lg:text-6xl font-bold text-white leading-tight">
                Welcome to Your
                <span className="block bg-gradient-to-r from-blue-400 via-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                  Social World
                </span>
              </h1>
              <p className="text-lg text-gray-300 max-w-xl mx-auto lg:mx-0">
                Join millions of people sharing moments, building connections, and discovering communities that matter to you.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link
                href="/sign-up"
                className="group relative inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-white bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-600 rounded-2xl overflow-hidden shadow-lg shadow-blue-500/50 hover:shadow-xl hover:shadow-blue-500/70 transition-all duration-300 hover:scale-105"
              >
                <span className="relative z-10">Get Started</span>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Link>
              
              <Link
                href="/login"
                className="inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-white border-2 border-gray-700 rounded-2xl hover:border-blue-500 hover:text-blue-400 transition-all duration-300 backdrop-blur-sm bg-black/30"
              >
                Sign In
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 pt-8">
              <div className="space-y-1">
                <div className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">10M+</div>
                <div className="text-sm text-gray-400">Active Users</div>
              </div>
              <div className="space-y-1">
                <div className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">50M+</div>
                <div className="text-sm text-gray-400">Posts Shared</div>
              </div>
              <div className="space-y-1">
                <div className="text-2xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">150+</div>
                <div className="text-sm text-gray-400">Countries</div>
              </div>
            </div>
          </div>

          {/* Right side - Feature cards preview */}
          <div className="relative">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4 pt-12">
                <div className="bg-gray-900/50 backdrop-blur-sm p-6 rounded-3xl border border-gray-800 hover:border-blue-500/50 shadow-lg hover:shadow-xl hover:shadow-blue-500/20 transition-all duration-300 translate-y-8">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-blue-500/50">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-white mb-2">Connect</h3>
                  <p className="text-sm text-gray-400">Build meaningful relationships worldwide</p>
                </div>
                
                <div className="bg-gray-900/50 backdrop-blur-sm p-6 rounded-3xl border border-gray-800 hover:border-purple-500/50 shadow-lg hover:shadow-xl hover:shadow-purple-500/20 transition-all duration-300 translate-y-8">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-purple-500/50">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-white mb-2">Share</h3>
                  <p className="text-sm text-gray-400">Express yourself through photos, videos, and stories</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-gray-900/50 backdrop-blur-sm p-6 rounded-3xl border border-gray-800 hover:border-pink-500/50 shadow-lg hover:shadow-xl hover:shadow-pink-500/20 transition-all duration-300 translate-y-8">
                  <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-red-500 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-pink-500/50">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-white mb-2">Engage</h3>
                  <p className="text-sm text-gray-400">Join conversations and discover trending topics</p>
                </div>
                
                <div className="bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 p-6 rounded-3xl shadow-lg hover:shadow-xl hover:shadow-purple-500/50 transition-all duration-300 text-white translate-y-8">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-4">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold mb-2">Grow</h3>
                  <p className="text-sm text-blue-100">Expand your network and reach new audiences</p>
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
