import Link from 'next/link';
import { Mail } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { siteConfig } from '@/lib/site-config';

const ICON_LINK_CLASSES =
  'flex h-11 w-11 items-center justify-center text-ink transition-colors hover:text-vermillion focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-vermillion dark:text-ink-dark dark:hover:text-vermillion-dark dark:focus-visible:outline-vermillion-dark';

/**
 * lucide-react (1.x) dropped brand/logo glyphs (GitHub, LinkedIn) as a
 * trademark-liability policy change — `Github`/`Linkedin` no longer exist as
 * exports (confirmed against the installed 1.24.0 package). Hand-rolled as
 * small inline SVGs instead (same well-known glyph paths, `fill="currentColor"`
 * so they inherit the icon-link hover/focus color like the lucide `Mail`
 * icon does) — consistent with the project's existing "no heavy UI kit,
 * hand-roll what's simple" philosophy rather than adding a new dependency.
 */
function GithubIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5" aria-hidden="true">
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
  );
}

function LinkedinIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5" aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

/**
 * Fuller footer (D-10): secondary nav + social icons + copyright + tagline,
 * on the secondary surface. Reads exclusively from `siteConfig` — nav and
 * social links are never inline-duplicated (single source of truth).
 *
 * Security (T-02-01): every external social anchor carries
 * `rel="noopener noreferrer"` (reverse-tabnabbing mitigation).
 */
export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      data-themed
      className="border-t border-secondary bg-secondary dark:border-secondary-dark dark:bg-secondary-dark"
    >
      <Container className="flex flex-col gap-8 py-12">
        <nav aria-label="Footer" className="flex flex-wrap justify-center gap-x-6 gap-y-2 sm:justify-start">
          {siteConfig.nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-label text-ink transition-colors hover:text-vermillion focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-vermillion dark:text-ink-dark dark:hover:text-vermillion-dark dark:focus-visible:outline-vermillion-dark"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center justify-center gap-1 sm:justify-start">
          <a
            href={siteConfig.social.github}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className={ICON_LINK_CLASSES}
          >
            <GithubIcon />
          </a>
          <a
            href={siteConfig.social.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className={ICON_LINK_CLASSES}
          >
            <LinkedinIcon />
          </a>
          <a
            href={`mailto:${siteConfig.social.email}`}
            aria-label="Email"
            className={ICON_LINK_CLASSES}
          >
            <Mail aria-hidden className="h-5 w-5" />
          </a>
        </div>

        <div className="flex flex-col items-center gap-1 text-center text-label text-ink/70 sm:items-start sm:text-left dark:text-ink-dark/70">
          <p>{siteConfig.tagline}</p>
          <p>
            &copy; {year} {siteConfig.name}. All rights reserved.
          </p>
        </div>
      </Container>
    </footer>
  );
}
