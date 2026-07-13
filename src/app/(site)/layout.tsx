import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

/**
 * Full site shell shared by all chrome-wrapped pages: sticky `Header`
 * (wordmark+monogram home link, desktop nav, theme toggle, mobile nav
 * trigger) and the fuller `Footer` (secondary nav, social icons, copyright,
 * tagline) wrap every page's content.
 */
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
}
