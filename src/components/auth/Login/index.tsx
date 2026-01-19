'use client';

import { FormEvent, useCallback, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { ROUTES } from '@/utils/constants';

type Message = { type: 'success' | 'error'; text: string } | null;

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

      setMessage({ type: 'success', text: 'Logged in successfully.' });
      console.log('Logged in user:', data.user);

      // Redirect to dashboard home after successful login
      router.push(ROUTES.dashboardHome);
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

  const handleOAuth = useCallback(async (provider: 'google' | 'github') => {
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

      setMessage({
        type: 'success',
        text: 'Redirecting to provider…',
      });
    } catch (error) {
      const err = error as { message?: string };
      setMessage({ type: 'error', text: err.message ?? 'OAuth failed.' });
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <div className="space-y-6 text-slate-900 transition-colors dark:text-white">
      <header className="space-y-1">
        <h1 className="text-3xl font-bold">Welcome back</h1>
        <p className="text-sm text-slate-500 dark:text-gray-300">
          Login with your email and password or continue with a provider.
        </p>
      </header>

      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block space-y-1.5 text-sm">
          <span className="font-medium text-slate-800 dark:text-white">Email</span>
          <input
            required
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white/70 px-4 py-3 text-slate-900 placeholder-slate-400 outline-none transition-all focus:border-transparent focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-900/50 dark:text-white dark:placeholder-gray-500"
            placeholder="you@example.com"
          />
        </label>

        <label className="block space-y-1.5 text-sm">
          <div className="flex items-center justify-between">
            <span className="font-medium text-slate-800 dark:text-white">Password</span>
            <Link
              href={ROUTES.forgetPassword}
              className="text-sm text-blue-500 transition-colors hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300"
            >
              Forgot password?
            </Link>
          </div>
          <input
            required
            minLength={6}
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white/70 px-4 py-3 text-slate-900 placeholder-slate-400 outline-none transition-all focus:border-transparent focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-900/50 dark:text-white dark:placeholder-gray-500"
            placeholder="••••••••"
          />
        </label>

        <button
          type="submit"
          className="w-full rounded-xl bg-linear-to-r from-blue-500 via-cyan-500 to-blue-600 px-4 py-3 text-sm font-semibold tracking-wide text-white transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/50 hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100"
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
            className={`w-full rounded-xl px-4 py-3 text-sm font-medium transition-all hover:scale-[1.01] focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-70 ${providerClasses[provider.id]}`}
            onClick={() => handleOAuth(provider.id)}
            disabled={isLoading}
          >
            {provider.label}
          </button>
        ))}
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
