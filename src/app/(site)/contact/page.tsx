import type { Metadata } from 'next';
import { Mail } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { GithubIcon, LinkedinIcon } from '@/components/ui/SocialIcons';
import { siteConfig } from '@/lib/site-config';

export const metadata: Metadata = {
  title: 'Contact',
  description:
    'Get in touch with Rasmus Hansen — email and social links for work, collaboration, or a conversation about code or aikido.',
};

/**
 * Contact page (Server Component) — mailto "Email Me" CTA PLUS the
 * plain-text email address always visible alongside it (some OS/browser
 * combos have no configured mail client), plus GitHub/LinkedIn social
 * links. No contact form — zero backend, matches the $0/month budget
 * (CORE-03).
 */
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
