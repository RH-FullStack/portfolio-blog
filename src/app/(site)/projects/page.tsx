import type { Metadata } from 'next';
import { Card } from '@/components/ui/Card';
import { Container } from '@/components/ui/Container';
import { projects } from '@/content/projects';

export const metadata: Metadata = {
  title: 'Projects',
  description:
    'A curated selection of software projects by Rasmus Hansen — web apps, tools, and experiments built with Next.js and TypeScript, with a focus on craft.',
};

/**
 * Projects index (PROJ-01) — Server Component, static typed data read.
 * Renders the full curated project showcase as a responsive card grid
 * (single column on mobile, multi-column at sm/md+, DSGN-01).
 */
export default function ProjectsPage() {
  return (
    <Container className="py-16 sm:py-24">
      <h1 className="text-heading font-semibold">Projects</h1>
      <p className="mt-4 max-w-2xl text-body">
        A curated selection of things I&apos;ve built — from personal tools to open-source
        experiments.
      </p>
      <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2">
        {projects.map((project) => (
          <Card key={project.slug} project={project} />
        ))}
      </div>
    </Container>
  );
}
