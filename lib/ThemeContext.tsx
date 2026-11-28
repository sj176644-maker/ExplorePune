'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { setCookie } from '@/lib/cookies';

export type Theme = 'light' | 'dark';

export interface ThemeTransitionOrigin {
  clientX?: number;
  clientY?: number;
}

interface ThemeContextType {
  theme: Theme;
  isDark: boolean;
  toggleTheme: (origin?: ThemeTransitionOrigin | React.MouseEvent | MouseEvent) => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'light',
  isDark: false,
  toggleTheme: () => {},
  setTheme: () => {},
});

export const THEME_STORAGE_KEY = 'punetrail_theme';

export function isTargetEditable(target: EventTarget | null): boolean {
  if (!target) return false;
  const el = target as unknown as {
    tagName?: string;
    isContentEditable?: boolean;
    closest?: (selector: string) => Element | null;
  };
  const tag = (el.tagName || '').toUpperCase();
  return (
    tag === 'INPUT' ||
    tag === 'TEXTAREA' ||
    tag === 'SELECT' ||
    Boolean(el.isContentEditable) ||
    Boolean(typeof el.closest === 'function' && el.closest('[contenteditable="true"]'))
  );
}

export function shouldTriggerThemeShortcut(e: {
  key: string;
  ctrlKey?: boolean;
  metaKey?: boolean;
  altKey?: boolean;
  shiftKey?: boolean;
  target?: EventTarget | null;
}): boolean {
  if (isTargetEditable(e.target || null)) {
    return false;
  }
  const isPlainT = (e.key === 't' || e.key === 'T') && !e.ctrlKey && !e.metaKey && !e.altKey;
  const isPlainD = (e.key === 'd' || e.key === 'D') && !e.ctrlKey && !e.metaKey && !e.altKey;
  const isAltT = (e.key === 't' || e.key === 'T') && Boolean(e.altKey);
  const isCtrlShiftD = (e.key === 'd' || e.key === 'D') && Boolean(e.ctrlKey || e.metaKey) && Boolean(e.shiftKey);

  return isPlainT || isPlainD || isAltT || isCtrlShiftD;
}

export function applyThemeToDOM(theme: Theme) {
  if (typeof document === 'undefined') return;

  const root = document.documentElement;
  if (theme === 'dark') {
    root.classList.add('dark');
    root.setAttribute('data-theme', 'dark');
  } else {
    root.classList.remove('dark');
    root.setAttribute('data-theme', 'light');
  }

  // Synchronize <meta name="color-scheme">
  const meta = document.querySelector('meta[name="color-scheme"]');
  if (meta) {
    meta.setAttribute('content', theme);
  }
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('light');
  const [mounted, setMounted] = useState(false);

  // Read initial theme from DOM or localStorage on mount
  useEffect(() => {
    try {
      const isDomDark = typeof document !== 'undefined' && (
        document.documentElement.classList.contains('dark') ||
        document.documentElement.getAttribute('data-theme') === 'dark'
      );
      const stored = (localStorage.getItem(THEME_STORAGE_KEY) || localStorage.getItem('theme')) as Theme | null;
      if (stored === 'dark' || (!stored && isDomDark)) {
        setThemeState('dark');
        applyThemeToDOM('dark');
      } else {
        // Strict light mode default for first-time visitors unless stored
        setThemeState('light');
        applyThemeToDOM('light');
      }
    } catch {
      // Fallback if localStorage access is blocked
      setThemeState('light');
      applyThemeToDOM('light');
    }
    setMounted(true);
  }, []);

  const setTheme = useCallback((newTheme: Theme, showToast = true) => {
    setThemeState(newTheme);
    applyThemeToDOM(newTheme);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, newTheme);
      // Also set generic 'theme' key for ecosystem compatibility
      localStorage.setItem('theme', newTheme);
      setCookie(THEME_STORAGE_KEY, newTheme, { maxAge: 31536000, sameSite: 'lax' });
    } catch {}

    // Dispatch custom event for shortcut toast feedback
    if (typeof window !== 'undefined' && showToast) {
      window.dispatchEvent(
        new CustomEvent('punetrail-theme-toggle', {
          detail: { theme: newTheme, shortcut: 'T' },
        })
      );
    }
  }, []);

  const toggleTheme = useCallback((origin?: ThemeTransitionOrigin | React.MouseEvent | MouseEvent) => {
    // Determine click or trigger coordinates for circular clip-path animation
    let clientX: number | undefined;
    let clientY: number | undefined;

    if (origin && 'clientX' in origin && typeof origin.clientX === 'number') {
      clientX = origin.clientX;
      clientY = origin.clientY;
    } else if (typeof window !== 'undefined') {
      const btn = document.querySelector('.theme-toggle-btn');
      if (btn) {
        const rect = btn.getBoundingClientRect();
        clientX = rect.left + rect.width / 2;
        clientY = rect.top + rect.height / 2;
      } else {
        clientX = window.innerWidth / 2;
        clientY = window.innerHeight / 2;
      }
    }

    const currentlyDark = typeof document !== 'undefined'
      ? (document.documentElement.classList.contains('dark') || document.documentElement.getAttribute('data-theme') === 'dark')
      : theme === 'dark';
    const nextTheme: Theme = currentlyDark ? 'light' : 'dark';

    const applyNext = () => {
      setThemeState(nextTheme);
      applyThemeToDOM(nextTheme);
      try {
        localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
        localStorage.setItem('theme', nextTheme);
        setCookie(THEME_STORAGE_KEY, nextTheme, { maxAge: 31536000, sameSite: 'lax' });
      } catch {}

      if (typeof window !== 'undefined') {
        window.dispatchEvent(
          new CustomEvent('punetrail-theme-toggle', {
            detail: { theme: nextTheme, shortcut: 'T', originX: clientX, originY: clientY },
          })
        );
      }
    };

    const isReducedMotion = typeof window !== 'undefined'
      && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const hasViewTransition = typeof document !== 'undefined'
      && typeof (document as any).startViewTransition === 'function'
      && !isReducedMotion;

    if (hasViewTransition && typeof clientX === 'number' && typeof clientY === 'number') {
      const x = clientX;
      const y = clientY;
      const endRadius = Math.hypot(
        Math.max(x, window.innerWidth - x),
        Math.max(y, window.innerHeight - y)
      );

      try {
        const transition = (document as any).startViewTransition(() => {
          applyNext();
        });

        transition.ready.then(() => {
          document.documentElement.animate(
            {
              clipPath: [
                `circle(0px at ${x}px ${y}px)`,
                `circle(${endRadius}px at ${x}px ${y}px)`,
              ],
            },
            {
              duration: 520,
              easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
              pseudoElement: '::view-transition-new(root)',
            }
          );
        }).catch(() => {
          // If transition promise rejects, state is already updated in callback
        });
        return;
      } catch {
        // Fallback to CSS smooth transition
      }
    }

    // Smooth CSS fallback transition for environments without View Transitions
    if (typeof document !== 'undefined') {
      document.documentElement.classList.add('theme-transitioning');
      setTimeout(() => {
        document.documentElement.classList.remove('theme-transitioning');
      }, 420);
    }
    applyNext();
  }, [theme]);

  // Keyboard shortcut listener for toggle key: 'T' or 'D' (or Alt+T, Ctrl+Shift+D)
  useEffect(() => {
    if (!mounted) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (shouldTriggerThemeShortcut(e)) {
        if (e.altKey || e.ctrlKey || e.metaKey) {
          e.preventDefault();
        }
        toggleTheme();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mounted, toggleTheme]);

  // Multi-tab synchronization
  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if ((e.key === THEME_STORAGE_KEY || e.key === 'theme') && e.newValue) {
        if (e.newValue === 'dark' || e.newValue === 'light') {
          setThemeState(e.newValue);
          applyThemeToDOM(e.newValue);
        }
      }
    };

    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  return (
    <ThemeContext.Provider
      value={{
        theme,
        isDark: theme === 'dark',
        toggleTheme,
        setTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
