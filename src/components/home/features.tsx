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
    <section id="features" className="py-24 bg-black relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-to-br from-green-500/10 to-cyan-500/10 rounded-full blur-3xl"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">
            Everything You Need to Stay Connected
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Powerful features designed to help you share, connect, and grow your social presence.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="bg-gray-900/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-800 hover:border-transparent hover:shadow-xl transition-all duration-300 group"
                style={{
                  boxShadow: '0 0 0 0 rgba(0,0,0,0)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = `0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04), 0 0 0 1px rgba(59, 130, 246, 0.1)`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = '0 0 0 0 rgba(0,0,0,0)';
                }}
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 bg-gradient-to-br ${feature.gradient} shadow-lg ${feature.shadow}`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:bg-clip-text group-hover:from-blue-400 group-hover:to-cyan-400 transition-all">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-400 leading-relaxed">
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
