import { Mail } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { siteConfig } from '@/lib/site-config';

/**
 * Contact page (Server Component) — mailto "Email Me" CTA PLUS the
 * plain-text email address always visible alongside it (some OS/browser
 * combos have no configured mail client), plus GitHub/LinkedIn social
 * links. No contact form — zero backend, matches the $0/month budget
 * (CORE-03).
 *
 * GitHub/LinkedIn marks are hand-rolled inline SVGs (not lucide-react):
 * the installed lucide-react@1.x no longer ships brand/logo icons
 * (only generic glyphs like `Github`-shaped `FolderGit`/`Link` remain),
 * so importing `Github`/`Linkedin` from it fails at build time.
 */
function GithubIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className="h-5 w-5">
      <path d="M12 .5C5.73.5.5 5.73.5 12c0 5.08 3.29 9.39 7.86 10.91.57.1.78-.25.78-.55 0-.27-.01-1.16-.02-2.11-3.2.7-3.88-1.36-3.88-1.36-.53-1.34-1.28-1.7-1.28-1.7-1.05-.72.08-.71.08-.71 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.71 1.26 3.37.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11.02 11.02 0 0 1 5.8 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.8 1.19 1.83 1.19 3.09 0 4.42-2.7 5.4-5.26 5.68.41.36.78 1.06.78 2.15 0 1.55-.01 2.8-.01 3.18 0 .3.2.66.79.55A10.52 10.52 0 0 0 23.5 12C23.5 5.73 18.27.5 12 .5z" />
    </svg>
  );
}

function LinkedinIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className="h-5 w-5">
      <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.04-1.85-3.04-1.86 0-2.15 1.45-2.15 2.94v5.67H9.35V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.36-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45z" />
    </svg>
  );
}

export default function Contact() {
  const { email, github, linkedin } = siteConfig.social;

  return (
    <Container className="flex flex-col items-center gap-8 py-16 text-center sm:py-24">
      <div className="flex flex-col items-center gap-4">
        <h1 className="text-heading font-semibold sm:text-display">Get In Touch</h1>
        <p className="max-w-md text-body">
          The fastest way to reach me is email — I read every message, even if a reply
          sometimes takes a few days.
        </p>
      </div>

      <div className="flex flex-col items-center gap-3">
        <Button href={`mailto:${email}`} variant="primary">
          <Mail aria-hidden className="h-4 w-4" />
          Email Me
        </Button>
        {/* Visible plain-text address — never mailto-only (UI-SPEC Copywriting Contract) */}
        <p className="text-label text-ink/70 dark:text-ink-dark/70">{email}</p>
      </div>

      <div className="flex items-center gap-6 pt-4">
        <a
          href={github}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="GitHub profile"
          className="flex min-h-11 min-w-11 items-center justify-center text-ink hover:text-vermillion dark:text-ink-dark dark:hover:text-vermillion-dark"
        >
          <GithubIcon />
        </a>
        <a
          href={linkedin}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="LinkedIn profile"
          className="flex min-h-11 min-w-11 items-center justify-center text-ink hover:text-vermillion dark:text-ink-dark dark:hover:text-vermillion-dark"
        >
          <LinkedinIcon />
        </a>
      </div>
    </Container>
  );
}
