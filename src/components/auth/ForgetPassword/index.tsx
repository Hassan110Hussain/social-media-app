'use client';

import { FormEvent, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { ROUTES } from '@/utils/constants';

type Message = { type: 'success' | 'error'; text: string } | null;

const ForgetPassword = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<Message>(null);
  const [isEmailSent, setIsEmailSent] = useState(false);

  const resetFeedback = () => setMessage(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    resetFeedback();
    setIsLoading(true);

    try {
      const redirectTo =
        typeof window !== 'undefined'
          ? `${window.location.origin}${ROUTES.resetPassword}`
          : undefined;

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo,
      });

      if (error) throw error;

      setIsEmailSent(true);
      setMessage({
        type: 'success',
        text: 'Password reset email sent! Check your inbox for the reset link.',
      });
    } catch (error) {
      const err = error as { message?: string };
      setMessage({
        type: 'error',
        text: err.message ?? 'Unable to send password reset email.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 text-slate-900 transition-colors dark:text-white">
      <header className="space-y-1">
        <h1 className="text-3xl font-bold">Forgot password?</h1>
        <p className="text-sm text-slate-500 dark:text-gray-300">
          Enter your email address and we'll send you a link to reset your password.
        </p>
      </header>

      {!isEmailSent ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block space-y-1.5 text-sm">
            <span className="font-medium text-slate-800 dark:text-white">Email</span>
            <input
              required
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white/70 px-4 py-3 text-slate-900 placeholder-slate-400 outline-none transition-all focus:border-transparent focus:ring-2 focus:ring-orange-500 dark:border-gray-700 dark:bg-gray-900/50 dark:text-white dark:placeholder-gray-500"
              placeholder="you@example.com"
            />
          </label>

          <button
            type="submit"
            className="w-full rounded-xl bg-linear-to-r from-orange-500 via-yellow-500 to-orange-600 px-4 py-3 text-sm font-semibold tracking-wide text-white transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/50 hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100"
            disabled={isLoading}
          >
            {isLoading ? 'Sending…' : 'Send reset link'}
          </button>
        </form>
      ) : (
        <div className="space-y-4">
          <div className="rounded-xl bg-green-500/20 border border-green-500/30 px-4 py-3 text-sm text-green-400">
            <p className="font-medium">Email sent successfully!</p>
            <p className="mt-1 text-green-300">
              Please check your inbox and click the link to reset your password.
            </p>
          </div>
        </div>
      )}

      <div className="text-center text-sm">
        <Link
          href={ROUTES.login}
          className="text-blue-500 transition-colors hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300"
        >
          Back to login
        </Link>
      </div>

      {message && !isEmailSent && (
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

export default ForgetPassword;
