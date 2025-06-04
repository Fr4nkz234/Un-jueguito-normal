
"use client";

import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const pathname = usePathname();
  // Default to 'dark' to avoid flash of unstyled content if possible,
  // though useEffect will correct it quickly.
  const [currentTheme, setCurrentTheme] = useState('dark'); 

  useEffect(() => {
    // Determine theme based on pathname
    // Login page and root (which redirects to login) get 'dark'
    // All other pages get 'jigsaw-theme'
    if (pathname === '/login' || pathname === '/') {
      setCurrentTheme('dark');
    } else {
      setCurrentTheme('jigsaw-theme');
    }
  }, [pathname]);

  useEffect(() => {
    const htmlElement = document.documentElement;
    // Ensure only one theme class is active
    htmlElement.classList.remove('dark', 'jigsaw-theme');
    if (currentTheme) {
      htmlElement.classList.add(currentTheme);
    }
  }, [currentTheme]);

  return <>{children}</>;
}
