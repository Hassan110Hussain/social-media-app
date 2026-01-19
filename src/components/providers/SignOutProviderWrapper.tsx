'use client';

import { SignOutProvider } from '@/contexts/SignOutContext';
import SignOutModal from '@/components/common/SignOutModal';

export default function SignOutProviderWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SignOutProvider>
      {children}
      <SignOutModal />
    </SignOutProvider>
  );
}
