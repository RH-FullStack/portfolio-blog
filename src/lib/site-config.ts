/**
 * Single source of truth for site identity, navigation, and social links.
 *
 * `name` is an explicit placeholder (see PROJECT.md — "RasmusOS" may be
 * replaced later). Nothing else in the codebase should hardcode the brand
 * name, nav shape, or social URLs — always import from here (D-09).
 */
export const siteConfig = {
  name: 'RasmusOS',
  tagline: 'Developer, aikidoka, investor, discgolf pro.',
  role: 'Software developer building his way toward a life split between Denmark and Japan.',
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000',
  nav: [
    { href: '/about', label: 'About' },
    { href: '/projects', label: 'Projects' },
    { href: '/blog', label: 'Blog' },
    { href: '/contact', label: 'Contact' },
  ],
  social: {
    github: 'https://github.com/RH-FullStack',
    linkedin: 'https://linkedin.com/in/rasmus-frydenlund-hansen/',
    email: 'Rasmusfrydenlund@hotmail.com',
  },
} as const;

export type SiteConfig = typeof siteConfig;
