'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { ROUTES } from '@/utils/constants';
import { useSignOut } from '@/contexts/SignOutContext';

const SignOutModal = () => {
  const { isOpen, closeModal } = useSignOut();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        closeModal();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, closeModal]);

  const handleSignOut = async () => {
    setIsLoading(true);
    try {
      await supabase.auth.signOut();
      router.push(ROUTES.login);
      closeModal();
    } catch (error) {
      console.error('Sign out error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onClick={closeModal}
    >
      <div
        className="relative w-full max-w-md rounded-2xl border border-slate-200 bg-white/95 p-6 shadow-xl backdrop-blur dark:border-slate-800 dark:bg-slate-900/95"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="mb-2 text-xl font-bold text-slate-900 dark:text-white">
          Sign out
        </h2>
        <p className="mb-6 text-sm text-slate-600 dark:text-slate-400">
          Are you sure you want to sign out? You'll need to sign in again to access your account.
        </p>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={closeModal}
            disabled={isLoading}
            className="flex-1 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSignOut}
            disabled={isLoading}
            className="flex-1 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 disabled:opacity-50"
          >
            {isLoading ? 'Signing out...' : 'Sign out'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignOutModal;
