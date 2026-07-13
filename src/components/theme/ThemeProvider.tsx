'use client';

import { ThemeProvider as NextThemesProvider } from 'next-themes';
import type { ComponentProps } from 'react';

/**
 * Thin client wrapper around next-themes' ThemeProvider.
 *
 * - attribute="class": toggles the `dark` class on <html>, matching the
 *   Tailwind v4 `@custom-variant dark (&:where(.dark, .dark *))` strategy.
 * - defaultTheme="system" + enableSystem: DSGN-02 system-preference default.
 * - The prop that force-disables all CSS transitions during a theme switch is
 *   intentionally left unset — setting it would kill the D-13 cross-fade
 *   defined in globals.css.
 */
export function ThemeProvider({
  children,
  ...props
}: ComponentProps<typeof NextThemesProvider>) {
  return (
    <NextThemesProvider attribute="class" defaultTheme="system" enableSystem {...props}>
      {children}
    </NextThemesProvider>
  );
}
