'use client';

import { FormEvent, useCallback, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { ROUTES } from '@/utils/constants';
import type { Message } from '@/types/api';
import ICONS from '@/components/assets/icons';

const oauthProviders = [
  { label: 'Continue with Google', id: 'google' as const },
  { label: 'Continue with GitHub', id: 'github' as const },
];

const providerClasses: Record<
  (typeof oauthProviders)[number]['id'],
  string
> = {
  google:
    'bg-blue-800 text-white border border-[#4285F4] hover:bg-blue-600 dark:bg-blue-800 dark:text-white dark:border-[#4285F4] dark:hover:bg-blue-600',
  github:
    'bg-gray-800 text-white border border-[#24292e] hover:bg-gray-700 dark:bg-gray-800 dark:text-white dark:border-[#24292e] dark:hover:bg-gray-700',
};

const Login = () => {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<Message>(null);

  const resetFeedback = () => setMessage(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    resetFeedback();
    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      if (!data.user) throw new Error('Login failed');

      // Fetch onboarding status
      const { data: profile, error: profileError } = await supabase
        .from('users')
        .select('first_name, last_name, username')
        .eq('id', data.user.id)
        .maybeSingle();

      if (profileError) throw profileError;

      const hasCompletedOnboarding =
        !!profile?.first_name && !!profile?.last_name && !!profile?.username;

      router.push(
        hasCompletedOnboarding
          ? ROUTES.dashboardHome
          : ROUTES.onboarding
      );
    } catch (error) {
      const err = error as { message?: string };
      setMessage({
        type: 'error',
        text: err.message ?? 'Unable to log in.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleOAuth = useCallback(
    async (provider: 'google' | 'github') => {
      resetFeedback();
      setIsLoading(true);

      try {
        const redirectTo =
          typeof window !== 'undefined'
            ? `${window.location.origin}${ROUTES.authCallback}`
            : undefined;

        const { error } = await supabase.auth.signInWithOAuth({
          provider,
          options: { redirectTo },
        });

        if (error) throw error;
      } catch (error) {
        const err = error as { message?: string };
        setMessage({
          type: 'error',
          text: err.message ?? 'OAuth failed.',
        });
        setIsLoading(false);
      }
    },
    []
  );

  return (
    <div className="space-y-6 text-slate-900 transition-colors dark:text-white">
      <header className="space-y-1">
        <h1 className="text-3xl font-bold">Welcome back</h1>
        <p className="text-sm text-slate-500 dark:text-gray-300">
          Login with email or continue with a provider.
        </p>
      </header>

      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block space-y-1.5 text-sm">
          <span className="font-medium text-slate-800 dark:text-white">Email</span>
          <input
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white/70 px-4 py-3 text-slate-900 placeholder-slate-400 outline-none transition-all focus:border-transparent focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-900/50 dark:text-white dark:placeholder-gray-500"
            placeholder="you@example.com"
          />
        </label>

        <label className="block space-y-1.5 text-sm">
          <span className="font-medium text-slate-800 dark:text-white">Password</span>
          <div className="relative">
            <input
              required
              type={showPassword ? 'text' : 'password'}
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white/70 px-4 py-3 pr-11 text-slate-900 placeholder-slate-400 outline-none transition-all focus:border-transparent focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-900/50 dark:text-white dark:placeholder-gray-500"
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowPassword((p) => !p)}
              className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer p-1 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              <img src={showPassword ? ICONS.hide : ICONS.show} alt="" className="h-5 w-5" />
            </button>
          </div>
        </label>

        <div className="flex justify-end">
          <Link
            href={ROUTES.forgetPassword}
            className="cursor-pointer text-sm text-blue-500 transition-colors hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300"
          >
            Forgot password?
          </Link>
        </div>

        <button
          type="submit"
          className="w-full cursor-pointer rounded-xl bg-linear-to-r from-blue-500 via-cyan-500 to-blue-600 px-4 py-3 text-sm font-semibold tracking-wide text-white transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-blue-500/50 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100"
          disabled={isLoading}
        >
          {isLoading ? 'Please wait…' : 'Login'}
        </button>
      </form>

      <div className="space-y-3">
        {oauthProviders.map((provider) => (
          <button
            key={provider.id}
            type="button"
            className={`w-full cursor-pointer rounded-xl px-4 py-3 text-sm font-medium transition-all hover:scale-[1.01] focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-70 ${providerClasses[provider.id]}`}
            onClick={() => handleOAuth(provider.id)}
            disabled={isLoading}
          >
            {provider.label}
          </button>
        ))}
      </div>

      <div className="text-center text-sm">
        <span className="text-slate-600 dark:text-gray-400">Don't have an account? </span>
        <Link
          href={ROUTES.signUp}
          className="cursor-pointer text-blue-500 transition-colors hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300"
        >
          Sign up
        </Link>
      </div>

      {message && (
        <p
          className={`rounded-xl px-4 py-3 text-sm ${
            message.type === 'success'
              ? 'bg-green-500/20 border border-green-500/30 text-green-400'
              : 'bg-red-500/20 border border-red-500/30 text-red-400'
          }`}
        >
          {message.text}
        </p>
      )}
    </div>
  );
};

export default Login;
