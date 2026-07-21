/**
 * Curated project showcase (PROJ-01) — typed static data, single source of
 * truth for both the `/projects` index and the homepage featured teaser.
 *
 * No parsing library, no MDX, no Velite — plain typed TS imported directly
 * into Server Components (Anti-Pattern: Velite/MDX in Phase 1 is forbidden).
 * All URLs below are developer-authored, hardcoded config values.
 */
export type Project = {
  slug: string;
  title: string;
  summary: string;
  tags: string[];
  links: { demo?: string; code?: string };
  // Optional: real project screenshots are supplied by Rasmus before deploy
  // (see phase 03 pre-deploy checklist). Absent → Card renders a token placeholder.
  image?: { src: string; alt: string };
};

export const projects: Project[] = [
  {
    slug: 'rasmusos',
    title: 'RasmusOS',
    summary:
      'This site — a hand-crafted Next.js portfolio and blog documenting a developer, entrepreneur, and aikidoka journey toward a life split between Denmark and Japan.',
    tags: ['Next.js', 'TypeScript', 'Tailwind CSS'],
    links: { code: 'https://github.com/RH-FullStack/rasmusos' },
    // image: screenshot of the RasmusOS homepage hero (add rasmusos.png under public's projects dir + restore this field)
  },
];
