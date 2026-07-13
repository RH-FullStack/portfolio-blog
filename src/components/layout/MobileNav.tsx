'use client';

import * as Dialog from '@radix-ui/react-dialog';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { siteConfig } from '@/lib/site-config';

/**
 * Accessible mobile nav overlay (D-11), hamburger trigger visible below `md`.
 *
 * Uses `@radix-ui/react-dialog` for focus trap, Escape-to-close, and
 * focus-return — do NOT hand-roll any of this (DSGN-03, RESEARCH.md Pitfall
 * 2 / Don't Hand-Roll table). The sticky `Header` is `z-40`; overlay/content
 * are `z-50` so the panel always renders above it (Pitfall 2).
 */
export function MobileNav() {
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <button
          type="button"
          aria-label="Open menu"
          className="flex h-11 w-11 items-center justify-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-vermillion md:hidden dark:focus-visible:outline-vermillion-dark"
        >
          <Menu aria-hidden />
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-ink/40 dark:bg-black/60" />
        <Dialog.Content className="fixed inset-y-0 right-0 z-50 flex w-full max-w-xs flex-col gap-8 overflow-y-auto bg-paper p-6 dark:bg-paper-dark">
          <Dialog.Title className="sr-only">Navigation menu</Dialog.Title>
          <div className="flex justify-end">
            <Dialog.Close asChild>
              <button
                type="button"
                aria-label="Close menu"
                className="flex h-11 w-11 items-center justify-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-vermillion dark:focus-visible:outline-vermillion-dark"
              >
                <X aria-hidden />
              </button>
            </Dialog.Close>
          </div>
          <nav aria-label="Primary" className="flex flex-col gap-2">
            {siteConfig.nav.map((item) => (
              <Dialog.Close asChild key={item.href}>
                <Link
                  href={item.href}
                  className="flex min-h-11 items-center text-label text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-vermillion dark:text-ink-dark dark:focus-visible:outline-vermillion-dark"
                >
                  {item.label}
                </Link>
              </Dialog.Close>
            ))}
          </nav>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
