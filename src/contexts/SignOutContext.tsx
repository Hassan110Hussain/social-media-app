'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface SignOutContextType {
  isOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
}

const SignOutContext = createContext<SignOutContextType | undefined>(undefined);

export const useSignOut = () => {
  const context = useContext(SignOutContext);
  if (!context) {
    throw new Error('useSignOut must be used within SignOutProvider');
  }
  return context;
};

export const SignOutProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  return (
    <SignOutContext.Provider value={{ isOpen, openModal, closeModal }}>
      {children}
    </SignOutContext.Provider>
  );
};
