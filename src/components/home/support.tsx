'use client';

import { HelpCircle, Mail, MessageSquare, BookOpen, Shield, Zap } from 'lucide-react';
import Link from 'next/link';

const supportOptions = [
  {
    icon: HelpCircle,
    title: 'Help Center',
    description: 'Browse our comprehensive guides and FAQs to find answers to common questions.',
    link: '#',
    gradient: 'from-blue-500 to-cyan-500',
  },
  {
    icon: MessageSquare,
    title: 'Live Chat',
    description: 'Chat with our support team in real-time. We\'re here to help 24/7.',
    link: '#',
    gradient: 'from-purple-500 to-pink-500',
  },
  {
    icon: Mail,
    title: 'Email Support',
    description: 'Send us an email and we\'ll get back to you within 24 hours.',
    link: '#',
    gradient: 'from-green-500 to-emerald-500',
  },
  {
    icon: BookOpen,
    title: 'Documentation',
    description: 'Access detailed documentation and API references for developers.',
    link: '#',
    gradient: 'from-orange-500 to-yellow-500',
  },
  {
    icon: Shield,
    title: 'Privacy & Safety',
    description: 'Learn about our privacy policies and safety features to protect your account.',
    link: '#',
    gradient: 'from-red-500 to-orange-500',
  },
  {
    icon: Zap,
    title: 'Feature Requests',
    description: 'Have an idea? Share it with us and help shape the future of our platform.',
    link: '#',
    gradient: 'from-pink-500 to-rose-500',
  },
];

const Support = () => {
  return (
    <section id="support" className="py-24 bg-black relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-3xl"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">
            We're Here to Help
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Get the support you need, whenever you need it. Our team is ready to assist you.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {supportOptions.map((option, index) => {
            const Icon = option.icon;
            return (
              <Link
                key={index}
                href={option.link}
                className="bg-gray-900/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-800 hover:border-transparent hover:shadow-xl transition-all duration-300 group"
              >
                <div className={`w-12 h-12 bg-gradient-to-br ${option.gradient} rounded-xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:bg-clip-text group-hover:from-blue-400 group-hover:to-cyan-400 transition-all">
                  {option.title}
                </h3>
                <p className="text-sm text-gray-400 leading-relaxed">
                  {option.description}
                </p>
              </Link>
            );
          })}
        </div>

        <div className="mt-16 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-3xl p-8 md:p-12 text-white text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm"></div>
          <div className="relative z-10">
            <h3 className="text-2xl font-bold mb-4">Still have questions?</h3>
            <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
              Don't hesitate to reach out. Our support team is available around the clock to help you.
            </p>
            <Link
              href="/login"
              className="inline-flex items-center justify-center px-6 py-3 bg-white text-black rounded-xl font-semibold hover:bg-gray-100 transition-colors shadow-lg"
            >
              Contact Support
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Support;
