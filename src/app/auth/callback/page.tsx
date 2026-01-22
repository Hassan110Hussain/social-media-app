'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { ROUTES } from '@/utils/constants';

const AuthCallback = () => {
  const router = useRouter();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (error || !session?.user) {
          router.push(ROUTES.login);
          return;
        }

        // Check onboarding status
        const { data: profile, error: profileError } = await supabase
          .from('users')
          .select('first_name, last_name, username')
          .eq('id', session.user.id)
          .maybeSingle();

        if (profileError) {
          console.error('Profile fetch error:', profileError);
          router.push(ROUTES.login);
          return;
        }

        const hasCompletedOnboarding =
          !!profile?.first_name && !!profile?.last_name && !!profile?.username;

          if (!profile) {
            await supabase.from('users').insert({
              id: session.user.id,
            });
            router.push(ROUTES.onboarding);
            return;
          }

        if (!hasCompletedOnboarding) {
          router.push(ROUTES.onboarding);
        } else {
          router.push(ROUTES.dashboardHome);
        }
      } catch (err) {
        console.error('Auth callback error:', err);
        router.push(ROUTES.login);
      }
    };

    handleAuthCallback();
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <p className="text-slate-500 dark:text-gray-300">
        Completing sign in...
      </p>
    </div>
  );
};

export default AuthCallback;
