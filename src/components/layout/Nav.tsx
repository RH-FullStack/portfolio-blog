'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { siteConfig } from '@/lib/site-config';

/**
 * Desktop horizontal nav (D-08) — hidden below `md`, visible at `md`+.
 * Client component: the active-route accent indicator needs `usePathname`,
 * which is only available on the client. Renders `siteConfig.nav` only —
 * never inline-duplicate nav items (single source of truth).
 */
export function Nav() {
  const pathname = usePathname();

  return (
    <nav aria-label="Primary" className="hidden md:flex md:items-center md:gap-6">
      {siteConfig.nav.map((item) => {
        const isActive = pathname === item.href;

        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={isActive ? 'page' : undefined}
            className={`text-label transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-vermillion dark:focus-visible:outline-vermillion-dark ${
              isActive
                ? 'font-semibold text-vermillion dark:text-vermillion-dark'
                : 'text-ink hover:text-vermillion dark:text-ink-dark dark:hover:text-vermillion-dark'
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
