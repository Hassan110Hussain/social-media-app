'use client';

import Link from 'next/link';
import { MessageCircle, Facebook, Twitter, Instagram, Linkedin, Youtube } from 'lucide-react';

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
    <footer className="bg-black border-t border-gray-800 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 mb-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 via-cyan-500 to-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/50">
                <MessageCircle className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent">SocialHub</span>
            </Link>
            <p className="text-sm text-gray-400 mb-4">
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
                    className={`w-10 h-10 bg-gray-900 rounded-lg flex items-center justify-center hover:bg-gradient-to-br ${social.gradient} transition-all shadow-lg hover:shadow-${social.gradient.split('-')[1]}-500/50`}
                  >
                    <Icon className="w-5 h-5 text-white" />
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Product */}
          <div>
            <h3 className="text-white font-semibold mb-4">Product</h3>
            <ul className="space-y-2">
              {footerLinks.product.map((link, index) => (
                <li key={index}>
                  <Link href={link.href} className="text-sm hover:text-blue-400 transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-white font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              {footerLinks.company.map((link, index) => (
                <li key={index}>
                  <Link href={link.href} className="text-sm hover:text-blue-400 transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-white font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              {footerLinks.resources.map((link, index) => (
                <li key={index}>
                  <Link href={link.href} className="text-sm hover:text-blue-400 transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-white font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              {footerLinks.legal.map((link, index) => (
                <li key={index}>
                  <Link href={link.href} className="text-sm hover:text-blue-400 transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-400">
            © {new Date().getFullYear()} SocialHub. All rights reserved.
          </p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <Link href="/login" className="text-sm hover:text-blue-400 transition-colors">
              Sign In
            </Link>
            <Link href="/sign-up" className="text-sm hover:text-blue-400 transition-colors">
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
