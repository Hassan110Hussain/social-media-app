'use client';

import { FormEvent, useCallback, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

type Message = { type: 'success' | 'error'; text: string } | null;

const oauthProviders = [
  { label: 'Continue with Google', id: 'google' as const },
  { label: 'Continue with GitHub', id: 'github' as const },
];

const Login = () => {
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
          ? `${window.location.origin}/auth/callback`
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
    <div className="space-y-6">
      <header className="space-y-1">
        <h1 className="text-3xl font-bold text-white">Welcome back</h1>
        <p className="text-sm text-gray-300">
          Login with your email and password or continue with a provider.
        </p>
      </header>

      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block space-y-1.5 text-sm">
          <span className="text-white font-medium">Email</span>
          <input
            required
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="w-full rounded-xl border border-gray-700 bg-gray-900/50 backdrop-blur-sm px-4 py-3 text-white placeholder-gray-500 outline-none focus:border-transparent focus:ring-2 focus:ring-blue-500 transition-all"
            placeholder="you@example.com"
          />
        </label>

        <label className="block space-y-1.5 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-white font-medium">Password</span>
            <Link
              href="/forget-password"
              className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
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
            className="w-full rounded-xl border border-gray-700 bg-gray-900/50 backdrop-blur-sm px-4 py-3 text-white placeholder-gray-500 outline-none focus:border-transparent focus:ring-2 focus:ring-blue-500 transition-all"
            placeholder="••••••••"
          />
        </label>

        <button
          type="submit"
          className="w-full rounded-xl bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-600 px-4 py-3 text-sm font-semibold tracking-wide text-white transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/50 hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100"
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
            className="w-full rounded-xl border border-gray-700 bg-gray-900/30 backdrop-blur-sm px-4 py-3 text-sm font-medium text-white transition-all hover:border-gray-600 hover:bg-gray-800/50"
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
