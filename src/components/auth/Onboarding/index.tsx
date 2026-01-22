'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { ROUTES } from '@/utils/constants';
import type { Message } from '@/types/api';

const Onboarding = () => {
  const router = useRouter();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [bio, setBio] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<Message>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage(null);
    setIsLoading(true);

    try {
      const { data: { user }, error } = await supabase.auth.getUser();

      if (error || !user) {
        throw new Error('Not authenticated. Please sign in again.');
      }

      if (!firstName.trim()) throw new Error('First name is required.');
      if (!lastName.trim()) throw new Error('Last name is required.');
      if (!username.trim()) throw new Error('Username is required.');
      if (username.length < 3) throw new Error('Username must be at least 3 characters.');

      // Check username availability
      const { data: existingUser } = await supabase
        .from('users')
        .select('id')
        .eq('username', username.trim())
        .maybeSingle();

      if (existingUser && existingUser.id !== user.id) {
        throw new Error('Username already taken');
      }

      const avatarFromMeta = user.user_metadata?.avatar_url ?? null;

      // Save profile
      const { error: upsertError } = await supabase
        .from('users')
        .upsert(
          {
            id: user.id,
            first_name: firstName.trim(),
            last_name: lastName.trim(),
            username: username.trim(),
            bio: bio.trim() || null,
            date_of_birth: dateOfBirth || null,
            avatar_url: avatarFromMeta,
          },
          { onConflict: 'id' }
        );

      if (upsertError) {
        throw new Error(upsertError.message);
      }

      // Update auth metadata (optional but useful)
      await supabase.auth.updateUser({
        data: {
          name: `${firstName.trim()} ${lastName.trim()}`,
          username: username.trim(),
        },
      });

      setMessage({
        type: 'success',
        text: 'Profile created successfully! Redirecting...',
      });

      setTimeout(() => {
        router.push(ROUTES.dashboardHome);
      }, 1200);

    } catch (err) {
      console.error('Onboarding error:', err);
      setMessage({
        type: 'error',
        text: err instanceof Error ? err.message : 'Onboarding failed',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 text-slate-900 transition-colors dark:text-white">
      <header className="space-y-1">
        <h1 className="text-3xl font-bold">Complete your profile</h1>
        <p className="text-sm text-slate-500 dark:text-gray-300">
          Tell us a bit about yourself to get started.
        </p>
      </header>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <label className="block space-y-1.5 text-sm">
            <span className="font-medium text-slate-800 dark:text-white">
              First Name <span className="text-rose-500">*</span>
            </span>
            <input
              required
              type="text"
              value={firstName}
              onChange={(event) => setFirstName(event.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white/70 px-4 py-3 text-slate-900 placeholder-slate-400 outline-none transition-all focus:border-transparent focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-900/50 dark:text-white dark:placeholder-gray-500"
              placeholder="John"
            />
          </label>

          <label className="block space-y-1.5 text-sm">
            <span className="font-medium text-slate-800 dark:text-white">
              Last Name <span className="text-rose-500">*</span>
            </span>
            <input
              required
              type="text"
              value={lastName}
              onChange={(event) => setLastName(event.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white/70 px-4 py-3 text-slate-900 placeholder-slate-400 outline-none transition-all focus:border-transparent focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-900/50 dark:text-white dark:placeholder-gray-500"
              placeholder="Doe"
            />
          </label>
        </div>

        <label className="block space-y-1.5 text-sm">
          <span className="font-medium text-slate-800 dark:text-white">
            Username <span className="text-rose-500">*</span>
          </span>
          <input
            required
            type="text"
            value={username}
            onChange={(event) => setUsername(event.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
            minLength={3}
            maxLength={20}
            className="w-full rounded-xl border border-slate-200 bg-white/70 px-4 py-3 text-slate-900 placeholder-slate-400 outline-none transition-all focus:border-transparent focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-900/50 dark:text-white dark:placeholder-gray-500"
            placeholder="johndoe"
          />
          <p className="text-xs text-slate-500 dark:text-gray-400">
            Only letters, numbers, and underscores. 3-20 characters.
          </p>
        </label>

        <label className="block space-y-1.5 text-sm">
          <span className="font-medium text-slate-800 dark:text-white">Date of Birth</span>
          <input
            type="date"
            value={dateOfBirth}
            onChange={(event) => setDateOfBirth(event.target.value)}
            max={new Date().toISOString().split('T')[0]}
            className="w-full rounded-xl border border-slate-200 bg-white/70 px-4 py-3 text-slate-900 placeholder-slate-400 outline-none transition-all focus:border-transparent focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-900/50 dark:text-white dark:placeholder-gray-500"
          />
        </label>

        <label className="block space-y-1.5 text-sm">
          <span className="font-medium text-slate-800 dark:text-white">Bio</span>
          <textarea
            value={bio}
            onChange={(event) => setBio(event.target.value)}
            rows={3}
            maxLength={160}
            className="w-full rounded-xl border border-slate-200 bg-white/70 px-4 py-3 text-slate-900 placeholder-slate-400 outline-none transition-all focus:border-transparent focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-900/50 dark:text-white dark:placeholder-gray-500 resize-none"
            placeholder="Tell us about yourself..."
          />
          <p className="text-xs text-slate-500 dark:text-gray-400">
            {bio.length}/160 characters
          </p>
        </label>

        <button
          type="submit"
          className="w-full rounded-xl bg-linear-to-r from-blue-500 via-cyan-500 to-blue-600 px-4 py-3 text-sm font-semibold tracking-wide text-white transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-blue-500/50 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100"
          disabled={isLoading}
        >
          {isLoading ? 'Saving...' : 'Complete Setup'}
        </button>
      </form>

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

export default Onboarding;
