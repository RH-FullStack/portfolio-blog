import Link from 'next/link';
import { ThemeToggle } from '@/components/theme/ThemeToggle';
import { Container } from '@/components/ui/Container';
import { siteConfig } from '@/lib/site-config';

/**
 * Minimal site shell shared by all chrome-wrapped pages: a sticky header
 * whose wordmark doubles as the home link (D-09), plus the theme toggle.
 * Full nav (About/Projects/Blog/Contact) and footer land in plan 01-02.
 */
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <header
        data-themed
        className="sticky top-0 z-40 border-b border-secondary bg-paper/90 backdrop-blur dark:border-secondary-dark dark:bg-paper-dark/90"
      >
        <Container className="flex h-16 items-center justify-between">
          <Link href="/" className="text-label font-semibold">
            {siteConfig.name}
          </Link>
          <ThemeToggle />
        </Container>
      </header>
      <main>{children}</main>
    </>
  );
}
