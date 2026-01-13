'use client';

import { FormEvent, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

type Message = { type: 'success' | 'error'; text: string } | null;

const ResetPassword = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<Message>(null);
  const [isValidToken, setIsValidToken] = useState<boolean | null>(null);

  const resetFeedback = () => setMessage(null);

  useEffect(() => {
    const checkToken = async () => {
      if (typeof window === 'undefined') return;

      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      const accessToken = hashParams.get('access_token');
      const refreshToken = hashParams.get('refresh_token');
      const type = hashParams.get('type');

      if (accessToken && type === 'recovery') {
        const { error: sessionError } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken || '',
        });

        if (sessionError) {
          setIsValidToken(false);
          setMessage({
            type: 'error',
            text: 'Invalid or expired reset token. Please request a new password reset.',
          });
          return;
        }

        setIsValidToken(true);
        window.history.replaceState(null, '', window.location.pathname);
      } else {
        const token = searchParams.get('token');
        const typeParam = searchParams.get('type');
        if (token || (typeParam === 'recovery')) {
          setIsValidToken(true);
        } else {
          setIsValidToken(false);
          setMessage({
            type: 'error',
            text: 'Invalid or missing reset token. Please request a new password reset.',
          });
        }
      }
    };

    checkToken();
  }, [searchParams]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    resetFeedback();

    if (password !== confirmPassword) {
      setMessage({
        type: 'error',
        text: 'Passwords do not match.',
      });
      return;
    }

    if (password.length < 6) {
      setMessage({
        type: 'error',
        text: 'Password must be at least 6 characters long.',
      });
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: password,
      });

      if (error) throw error;

      setMessage({
        type: 'success',
        text: 'Password updated successfully! Redirecting to login...',
      });

      setTimeout(() => {
        router.push('/login');
      }, 2000);
    } catch (error) {
      const err = error as { message?: string };
      setMessage({
        type: 'error',
        text: err.message ?? 'Unable to update password.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isValidToken === null) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <p className="text-gray-300">Verifying reset token...</p>
        </div>
      </div>
    );
  }

  if (isValidToken === false) {
    return (
      <div className="space-y-6">
        <header className="space-y-1">
          <h1 className="text-3xl font-bold text-white">Invalid reset link</h1>
          <p className="text-sm text-gray-300">
            This password reset link is invalid or has expired.
          </p>
        </header>

        <div className="text-center">
          <Link
            href="/forget-password"
            className="inline-block rounded-xl bg-gradient-to-r from-red-500 to-orange-500 px-6 py-3 text-sm font-semibold text-white transition-all hover:shadow-lg hover:shadow-red-500/50 hover:scale-105"
          >
            Request new reset link
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <h1 className="text-3xl font-bold text-white">Reset your password</h1>
        <p className="text-sm text-gray-300">
          Enter your new password below.
        </p>
      </header>

      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block space-y-1.5 text-sm">
          <span className="text-white font-medium">New Password</span>
          <input
            required
            minLength={6}
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="w-full rounded-xl border border-gray-700 bg-gray-900/50 backdrop-blur-sm px-4 py-3 text-white placeholder-gray-500 outline-none focus:border-transparent focus:ring-2 focus:ring-green-500 transition-all"
            placeholder="At least 6 characters"
          />
        </label>

        <label className="block space-y-1.5 text-sm">
          <span className="text-white font-medium">Confirm Password</span>
          <input
            required
            minLength={6}
            type="password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            className="w-full rounded-xl border border-gray-700 bg-gray-900/50 backdrop-blur-sm px-4 py-3 text-white placeholder-gray-500 outline-none focus:border-transparent focus:ring-2 focus:ring-green-500 transition-all"
            placeholder="Confirm your password"
          />
        </label>

        <button
          type="submit"
          className="w-full rounded-xl bg-gradient-to-r from-green-500 via-emerald-500 to-green-600 px-4 py-3 text-sm font-semibold tracking-wide text-white transition-all duration-300 hover:shadow-lg hover:shadow-green-500/50 hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100"
          disabled={isLoading}
        >
          {isLoading ? 'Updating…' : 'Update password'}
        </button>
      </form>

      <div className="text-center text-sm">
        <Link
          href="/login"
          className="text-blue-400 hover:text-blue-300 transition-colors"
        >
          Back to login
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

export default ResetPassword;
