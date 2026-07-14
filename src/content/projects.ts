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
    links: { code: 'https://github.com/REPLACE_ME/rasmusos' },
    // image: screenshot of the RasmusOS homepage hero (add rasmusos.png under public's projects dir + restore this field)
  },
  {
    slug: 'portfolio-tracker',
    title: 'Portfolio Tracker',
    summary:
      'A personal investing dashboard that aggregates holdings and visualizes long-term progress toward a 1M DKK portfolio goal.',
    tags: ['TypeScript', 'React', 'Node.js'],
    links: {
      demo: 'https://example.com/portfolio-tracker',
      code: 'https://github.com/REPLACE_ME/portfolio-tracker',
    },
    // image: screenshot of the Portfolio Tracker dashboard showing asset allocation charts (add portfolio-tracker.png under public's projects dir + restore this field)
  },
  {
    slug: 'dojo-scheduler',
    title: 'Dojo Scheduler',
    summary:
      'A lightweight class-scheduling SaaS built for small aikido dojos to manage sessions, attendance, and member rosters.',
    tags: ['Next.js', 'PostgreSQL', 'Tailwind CSS'],
    links: {
      demo: 'https://example.com/dojo-scheduler',
      code: 'https://github.com/REPLACE_ME/dojo-scheduler',
    },
    // image: screenshot of the Dojo Scheduler weekly class calendar (add dojo-scheduler.png under public's projects dir + restore this field)
  },
  {
    slug: 'devnotes-cli',
    title: 'devnotes-cli',
    summary:
      'An open-source command-line journal for capturing daily engineering notes straight from the terminal, synced to a git repo.',
    tags: ['Rust', 'CLI', 'Open Source'],
    links: { code: 'https://github.com/REPLACE_ME/devnotes-cli' },
    // image: terminal screenshot of devnotes-cli in use (add devnotes-cli.png under public's projects dir + restore this field)
  },
];
