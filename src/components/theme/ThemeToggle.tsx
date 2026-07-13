'use client';

import { useTheme } from 'next-themes';
import { useSyncExternalStore } from 'react';
import { Moon, Sun } from 'lucide-react';

const noopSubscribe = () => () => {};

/**
 * True only once the component has hydrated on the client. Implemented via
 * useSyncExternalStore (server snapshot `false`, client snapshot `true`)
 * rather than a `useState` + `useEffect` mount flag, so no setState call
 * happens inside an effect body.
 */
function useMounted() {
  return useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );
}

/**
 * Sun/Moon theme toggle (D-12). Persists via next-themes/localStorage.
 *
 * The `mounted` guard avoids a hydration mismatch: `resolvedTheme` is
 * `undefined` on the server (theme is client-only knowledge), so rendering
 * an icon before mount would pick the wrong one on first paint.
 */
export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useMounted();

  if (!mounted) {
    return <div className="h-11 w-11" aria-hidden />;
  }

  const isDark = resolvedTheme === 'dark';

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      className="flex h-11 w-11 items-center justify-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-vermillion dark:focus-visible:outline-vermillion-dark"
    >
      {isDark ? <Sun aria-hidden /> : <Moon aria-hidden />}
    </button>
  );
}
