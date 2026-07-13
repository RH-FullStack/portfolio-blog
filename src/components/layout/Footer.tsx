import Link from 'next/link';
import { Mail } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { GithubIcon, LinkedinIcon } from '@/components/ui/SocialIcons';
import { siteConfig } from '@/lib/site-config';

const ICON_LINK_CLASSES =
  'flex h-11 w-11 items-center justify-center text-ink transition-colors hover:text-vermillion focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-vermillion dark:text-ink-dark dark:hover:text-vermillion-dark dark:focus-visible:outline-vermillion-dark';

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
