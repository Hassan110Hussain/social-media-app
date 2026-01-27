'use client';

import { UserPlus, Share2, Heart, TrendingUp } from 'lucide-react';

const steps = [
  {
    number: '01',
    icon: UserPlus,
    title: 'Create Your Account',
    description: 'Sign up in seconds with your email or social account. Set up your profile and start connecting.',
    gradient: 'from-blue-500 to-cyan-500',
  },
  {
    number: '02',
    icon: Share2,
    title: 'Share Your Content',
    description: 'Post photos, videos, stories, and thoughts. Express yourself and let your personality shine.',
    gradient: 'from-purple-500 to-pink-500',
  },
  {
    number: '03',
    icon: Heart,
    title: 'Engage & Connect',
    description: 'Like, comment, and share content. Follow friends, join groups, and discover new communities.',
    gradient: 'from-pink-500 to-red-500',
  },
  {
    number: '04',
    icon: TrendingUp,
    title: 'Grow Your Network',
    description: 'Build meaningful relationships, expand your reach, and become part of a vibrant community.',
    gradient: 'from-green-500 to-emerald-500',
  },
];

const Working = () => {
  return (
    <section id="how-it-works" className="relative overflow-hidden bg-white py-12 text-slate-900 transition-colors dark:bg-black dark:text-white sm:py-16 lg:py-24">
      {/* Animated background blobs */}
      <div className="absolute top-0 left-0 h-[300px] w-[300px] rounded-full bg-linear-to-br from-purple-500/10 to-pink-500/10 blur-3xl animate-pulse dark:from-purple-500/20 dark:to-pink-500/20 sm:h-[400px] sm:w-[400px] lg:h-[500px] lg:w-[500px]"></div>
      <div
        className="absolute bottom-0 right-0 h-[300px] w-[300px] rounded-full bg-linear-to-br from-blue-500/10 to-cyan-500/10 blur-3xl animate-pulse dark:from-blue-500/20 dark:to-cyan-500/20 sm:h-[400px] sm:w-[400px] lg:h-[500px] lg:w-[500px]"
        style={{ animationDelay: '1s' }}
      ></div>
      
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 text-center sm:mb-12 lg:mb-16">
          <h2 className="mb-3 text-2xl font-bold sm:mb-4 sm:text-3xl lg:text-4xl">
            How It Works
          </h2>
          <p className="mx-auto max-w-2xl text-base text-slate-600 dark:text-gray-300 sm:text-lg lg:text-xl">
            Get started in four simple steps and begin your social journey today.
          </p>
        </div>

        <div className="grid gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div
                key={index}
                className="relative rounded-2xl border border-slate-200 bg-white/80 p-5 shadow transition-all duration-300 hover:-translate-y-1 hover:border-transparent hover:shadow-xl dark:border-gray-800 dark:bg-gray-900/50 sm:p-6 lg:rounded-3xl lg:p-8"
              >
                <div className={`absolute -top-4 -left-4 flex h-12 w-12 items-center justify-center rounded-full bg-linear-to-br ${step.gradient} text-lg font-bold text-white shadow-lg`}>
                  {step.number}
                </div>
                <div className={`mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-linear-to-br ${step.gradient} shadow-lg transition-transform group-hover:scale-110`}>
                  <Icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="mb-3 text-xl font-semibold">
                  {step.title}
                </h3>
                <p className="leading-relaxed text-slate-600 dark:text-gray-400">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>

        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-6 py-3 text-sm font-medium text-slate-600 shadow dark:border-gray-800 dark:bg-gray-900/50 dark:text-gray-300">
            <div className="h-2 w-2 animate-pulse rounded-full bg-green-500 shadow-lg shadow-green-500/50"></div>
            <span>
              Join <span className="bg-linear-to-r from-blue-500 to-cyan-500 bg-clip-text font-bold text-transparent">10M+</span> active users today
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Working;
