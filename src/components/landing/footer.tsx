'use client';

import Link from 'next/link';
import { MessageCircle, Facebook, Twitter, Instagram, Linkedin, Youtube } from 'lucide-react';
import { ROUTES } from '@/utils/constants';

const footerLinks = {
  product: [
    { name: 'Features', href: '#features' },
    { name: 'Pricing', href: '#' },
    { name: 'Security', href: '#' },
    { name: 'Changelog', href: '#' },
  ],
  company: [
    { name: 'About Us', href: '#' },
    { name: 'Blog', href: '#' },
    { name: 'Careers', href: '#' },
    { name: 'Contact', href: '#support' },
  ],
  resources: [
    { name: 'Documentation', href: '#' },
    { name: 'Help Center', href: '#' },
    { name: 'Community', href: '#' },
    { name: 'Partners', href: '#' },
  ],
  legal: [
    { name: 'Privacy Policy', href: '#' },
    { name: 'Terms of Service', href: '#' },
    { name: 'Cookie Policy', href: '#' },
    { name: 'Guidelines', href: '#' },
  ],
};

const socialLinks = [
  { icon: Facebook, href: '#', label: 'Facebook', gradient: 'from-blue-600 to-blue-700' },
  { icon: Twitter, href: '#', label: 'Twitter', gradient: 'from-cyan-500 to-blue-500' },
  { icon: Instagram, href: '#', label: 'Instagram', gradient: 'from-pink-500 to-purple-500' },
  { icon: Linkedin, href: '#', label: 'LinkedIn', gradient: 'from-blue-600 to-blue-700' },
  { icon: Youtube, href: '#', label: 'YouTube', gradient: 'from-red-500 to-red-600' },
];

const Footer = () => {
  return (
    <footer className="border-t border-slate-200 bg-white text-slate-600 transition-colors dark:border-gray-800 dark:bg-black dark:text-gray-300">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-6">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href={ROUTES.home} className="mb-4 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-linear-to-br from-blue-500 via-cyan-500 to-blue-600 shadow-lg shadow-blue-500/50">
                <MessageCircle className="h-5 w-5 text-white" />
              </div>
              <span className="bg-linear-to-r from-blue-500 via-cyan-500 to-blue-600 bg-clip-text text-xl font-bold text-transparent">
                SocialHub
              </span>
            </Link>
            <p className="mb-4 text-sm text-slate-500 dark:text-gray-400">
              Connect, share, and grow with millions of users worldwide. Your social world awaits.
            </p>
            <div className="flex gap-4">
              {socialLinks.map((social, index) => {
                const Icon = social.icon;
                return (
                  <Link
                    key={index}
                    href={social.href}
                    aria-label={social.label}
                    className={`flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-slate-600 transition-all hover:bg-linear-to-br ${social.gradient} hover:text-white dark:bg-gray-900`}
                  >
                    <Icon className="h-5 w-5" />
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Product */}
          <div>
            <h3 className="mb-4 font-semibold text-slate-900 dark:text-white">Product</h3>
            <ul className="space-y-2 text-sm">
              {footerLinks.product.map((link, index) => (
                <li key={index}>
                  <Link href={link.href} className="transition-colors hover:text-blue-500 dark:hover:text-blue-400">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="mb-4 font-semibold text-slate-900 dark:text-white">Company</h3>
            <ul className="space-y-2 text-sm">
              {footerLinks.company.map((link, index) => (
                <li key={index}>
                  <Link href={link.href} className="transition-colors hover:text-blue-500 dark:hover:text-blue-400">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="mb-4 font-semibold text-slate-900 dark:text-white">Resources</h3>
            <ul className="space-y-2 text-sm">
              {footerLinks.resources.map((link, index) => (
                <li key={index}>
                  <Link href={link.href} className="transition-colors hover:text-blue-500 dark:hover:text-blue-400">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="mb-4 font-semibold text-slate-900 dark:text-white">Legal</h3>
            <ul className="space-y-2 text-sm">
              {footerLinks.legal.map((link, index) => (
                <li key={index}>
                  <Link href={link.href} className="transition-colors hover:text-blue-500 dark:hover:text-blue-400">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between border-t border-slate-200 pt-8 text-sm text-slate-500 dark:border-gray-800 dark:text-gray-400 md:flex-row">
          <p>
            © {new Date().getFullYear()} SocialHub. All rights reserved.
          </p>
          <div className="mt-4 flex gap-6 md:mt-0">
            <Link href={ROUTES.login} className="transition-colors hover:text-blue-500 dark:hover:text-blue-400">
              Sign In
            </Link>
            <Link href={ROUTES.signUp} className="transition-colors hover:text-blue-500 dark:hover:text-blue-400">
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
