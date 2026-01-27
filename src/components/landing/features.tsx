'use client';

import {
  Users,
  MessageCircle,
  Share2,
  Video,
  Image,
  Bell,
  Shield,
  BarChart3,
  UsersRound,
  Calendar,
  Store,
  Heart,
  Zap,
  Globe,
} from 'lucide-react';

const features = [
  {
    icon: Share2,
    title: 'Posts & Stories',
    description: 'Share your thoughts, photos, and videos with your network. Create engaging stories that disappear after 24 hours.',
    gradient: 'from-blue-500 to-cyan-500',
    shadow: 'shadow-blue-500/50',
  },
  {
    icon: MessageCircle,
    title: 'Real-time Messaging',
    description: 'Chat instantly with friends and groups. Send text, voice messages, photos, and videos seamlessly.',
    gradient: 'from-purple-500 to-pink-500',
    shadow: 'shadow-purple-500/50',
  },
  {
    icon: Video,
    title: 'Live Streaming',
    description: 'Go live and connect with your audience in real-time. Stream events, Q&As, or just hang out.',
    gradient: 'from-pink-500 to-red-500',
    shadow: 'shadow-pink-500/50',
  },
  {
    icon: UsersRound,
    title: 'Groups & Communities',
    description: 'Join or create groups around your interests. Build communities and connect with like-minded people.',
    gradient: 'from-cyan-500 to-blue-600',
    shadow: 'shadow-cyan-500/50',
  },
  {
    icon: Calendar,
    title: 'Events',
    description: 'Discover and create events. Invite friends, track RSVPs, and never miss out on what matters.',
    gradient: 'from-green-500 to-emerald-500',
    shadow: 'shadow-green-500/50',
  },
  {
    icon: Store,
    title: 'Marketplace',
    description: 'Buy and sell items in your community. Browse local listings and find great deals nearby.',
    gradient: 'from-orange-500 to-yellow-500',
    shadow: 'shadow-orange-500/50',
  },
  {
    icon: BarChart3,
    title: 'Analytics Dashboard',
    description: 'Track your content performance with detailed insights. Understand your audience and grow your reach.',
    gradient: 'from-blue-600 to-indigo-600',
    shadow: 'shadow-blue-600/50',
  },
  {
    icon: Shield,
    title: 'Privacy Controls',
    description: 'Full control over your privacy. Customize who sees your content and manage your data securely.',
    gradient: 'from-red-500 to-orange-500',
    shadow: 'shadow-red-500/50',
  },
  {
    icon: Bell,
    title: 'Smart Notifications',
    description: 'Stay updated with intelligent notifications. Customize alerts for what matters most to you.',
    gradient: 'from-yellow-500 to-orange-500',
    shadow: 'shadow-yellow-500/50',
  },
  {
    icon: Heart,
    title: 'Reactions & Comments',
    description: 'Express yourself with reactions, comments, and shares. Engage with content that resonates with you.',
    gradient: 'from-pink-500 to-rose-500',
    shadow: 'shadow-pink-500/50',
  },
  {
    icon: Zap,
    title: 'Fast Performance',
    description: 'Lightning-fast loading times and smooth scrolling. Optimized for the best user experience.',
    gradient: 'from-amber-500 to-yellow-500',
    shadow: 'shadow-amber-500/50',
  },
  {
    icon: Globe,
    title: 'Global Reach',
    description: 'Connect with people worldwide. Break barriers and build friendships across continents.',
    gradient: 'from-cyan-500 to-blue-500',
    shadow: 'shadow-cyan-500/50',
  },
];

const Features = () => {
  return (
    <section id="features" className="relative overflow-hidden bg-white py-12 text-slate-900 transition-colors dark:bg-black dark:text-white sm:py-16 lg:py-24">
      {/* Background blobs */}
      <div className="absolute top-0 right-0 h-[300px] w-[300px] rounded-full bg-linear-to-br from-blue-500/5 to-purple-500/5 blur-3xl dark:from-blue-500/10 dark:to-purple-500/10 sm:h-[400px] sm:w-[400px]"></div>
      <div className="absolute bottom-0 left-0 h-[300px] w-[300px] rounded-full bg-linear-to-br from-green-500/5 to-cyan-500/5 blur-3xl dark:from-green-500/10 dark:to-cyan-500/10 sm:h-[400px] sm:w-[400px]"></div>
      
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 text-center sm:mb-12 lg:mb-16">
          <h2 className="mb-3 text-2xl font-bold sm:mb-4 sm:text-3xl lg:text-4xl">
            Everything You Need to Stay Connected
          </h2>
          <p className="mx-auto max-w-2xl text-base text-slate-600 dark:text-gray-300 sm:text-lg lg:text-xl">
            Powerful features designed to help you share, connect, and grow your social presence.
          </p>
        </div>

        <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="group rounded-2xl border border-slate-200 bg-white/80 p-6 shadow hover:-translate-y-1 hover:border-transparent hover:shadow-xl transition-all duration-300 dark:border-gray-800 dark:bg-gray-900/50"
              >
                <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-linear-to-br ${feature.gradient} shadow-lg ${feature.shadow}`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="mb-2 text-lg font-semibold transition-all group-hover:bg-linear-to-r group-hover:from-blue-500 group-hover:to-cyan-400 group-hover:bg-clip-text group-hover:text-transparent">
                  {feature.title}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed dark:text-gray-400">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Features;
