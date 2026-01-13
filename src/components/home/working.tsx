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
    <section id="how-it-works" className="py-24 bg-black relative overflow-hidden">
      {/* Animated background blobs */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">
            How It Works
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Get started in four simple steps and begin your social journey today.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div
                key={index}
                className="relative bg-gray-900/50 backdrop-blur-sm p-8 rounded-3xl border border-gray-800 hover:border-transparent hover:shadow-xl transition-all duration-300 group"
              >
                <div className={`absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-br ${step.gradient} rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg`}>
                  {step.number}
                </div>
                <div className={`w-16 h-16 bg-gradient-to-br ${step.gradient} rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform`}>
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">
                  {step.title}
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>

        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900/50 backdrop-blur-sm rounded-full border border-gray-800">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-lg shadow-green-500/50"></div>
            <span className="text-sm font-medium text-gray-300">
              Join <span className="font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">10M+</span> active users today
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Working;
