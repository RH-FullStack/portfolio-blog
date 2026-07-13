import Link from 'next/link';
import { Nav } from '@/components/layout/Nav';
import { MobileNav } from '@/components/layout/MobileNav';
import { ThemeToggle } from '@/components/theme/ThemeToggle';
import { Container } from '@/components/ui/Container';
import { siteConfig } from '@/lib/site-config';

/**
 * Abstract, geometric monogram (D-09) — an open circular brushstroke
 * (enso-inspired, Japanese-minimalist) crossed by a single vermillion accent
 * stroke. Deliberately NOT a literal rendering of "RasmusOS" or any letter
 * of it — the mark must survive a future brand-name swap unmodified.
 */
function Monogram() {
  return (
    <svg viewBox="0 0 32 32" className="h-8 w-8 shrink-0" aria-hidden="true" focusable="false">
      <path
        d="M16 5a11 11 0 1 1-7.8 3.2"
        fill="none"
        className="stroke-ink dark:stroke-ink-dark"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path
        d="M16 11v10"
        fill="none"
        className="stroke-vermillion dark:stroke-vermillion-dark"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

/**
 * Sticky site header (z-40, below the MobileNav overlay's z-50 — Pitfall 2)
 * composing the wordmark+monogram home link (D-09), the desktop `Nav`, the
 * `ThemeToggle`, and the `MobileNav` hamburger trigger.
 */
export function Header() {
  return (
    <header
      data-themed
      className="sticky top-0 z-40 border-b border-secondary bg-paper/90 backdrop-blur dark:border-secondary-dark dark:bg-paper-dark/90"
    >
      <Container className="flex h-16 items-center justify-between gap-4">
        <Link
          href="/"
          className="flex items-center gap-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-vermillion dark:focus-visible:outline-vermillion-dark"
        >
          <Monogram />
          <span className="text-label font-semibold">{siteConfig.name}</span>
        </Link>
        <div className="flex items-center gap-2">
          <Nav />
          <ThemeToggle />
          <MobileNav />
        </div>
      </Container>
    </header>
  );
}
