'use client';

import { HelpCircle, Mail, MessageSquare, BookOpen, Shield, Zap } from 'lucide-react';
import Link from 'next/link';
import { ROUTES } from '@/utils/constants';

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
    <section id="support" className="relative overflow-hidden bg-white py-12 text-slate-900 transition-colors dark:bg-black dark:text-white sm:py-16 lg:py-24">
      {/* Background effects */}
      <div className="absolute top-0 right-0 h-[300px] w-[300px] rounded-full bg-linear-to-br from-blue-500/5 to-purple-500/5 blur-3xl dark:from-blue-500/10 dark:to-purple-500/10 sm:h-[400px] sm:w-[400px]"></div>
      
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 text-center sm:mb-12 lg:mb-16">
          <h2 className="mb-3 text-2xl font-bold sm:mb-4 sm:text-3xl lg:text-4xl">
            We're Here to Help
          </h2>
          <p className="mx-auto max-w-2xl text-base text-slate-600 dark:text-gray-300 sm:text-lg lg:text-xl">
            Get the support you need, whenever you need it. Our team is ready to assist you.
          </p>
        </div>

        <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
          {supportOptions.map((option, index) => {
            const Icon = option.icon;
            return (
              <Link
                key={index}
                href={option.link}
                className="group rounded-2xl border border-slate-200 bg-white/80 p-6 text-left shadow transition-all duration-300 hover:-translate-y-1 hover:border-transparent hover:shadow-xl dark:border-gray-800 dark:bg-gray-900/50"
              >
                <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-linear-to-br ${option.gradient} shadow-lg transition-transform group-hover:scale-110`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="mb-2 text-lg font-semibold transition-all group-hover:bg-linear-to-r group-hover:from-blue-500 group-hover:to-cyan-400 group-hover:bg-clip-text group-hover:text-transparent">
                  {option.title}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed dark:text-gray-400">
                  {option.description}
                </p>
              </Link>
            );
          })}
        </div>

        <div className="relative mt-8 overflow-hidden rounded-2xl bg-linear-to-r from-blue-600 via-purple-600 to-pink-600 p-6 text-center text-white shadow-lg sm:mt-12 sm:rounded-3xl sm:p-8 md:p-12 lg:mt-16">
          <div className="absolute inset-0 bg-black/10 backdrop-blur-sm"></div>
          <div className="relative z-10 space-y-4 sm:space-y-6">
            <h3 className="mb-2 text-xl font-bold sm:mb-4 sm:text-2xl">Still have questions?</h3>
            <p className="mx-auto mb-6 max-w-2xl text-blue-100">
              Don't hesitate to reach out. Our support team is available around the clock to help you.
            </p>
            <Link
              href={ROUTES.login}
              className="inline-flex items-center justify-center rounded-xl bg-white px-6 py-3 font-semibold text-slate-900 transition-colors hover:bg-gray-100"
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
