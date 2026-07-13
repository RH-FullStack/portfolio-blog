import Image from 'next/image';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Container } from '@/components/ui/Container';
import { siteConfig } from '@/lib/site-config';
import { projects } from '@/content/projects';

const FEATURED_PROJECTS = projects.slice(0, 3);

/**
 * Homepage (Server Component) — Hero + featured-projects teaser (D-07).
 * Hero proves the walking skeleton: scaffold -> routing -> self-hosted
 * fonts -> design tokens -> typed data read -> one real client UI
 * interaction (the theme toggle in the layout). The teaser below reuses
 * the same typed `projects` data source that feeds the full `/projects`
 * index (PROJ-01) — one source, two views.
 */
export default function Home() {
  return (
    <>
      <Container className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center gap-8 py-16 text-center sm:flex-row sm:gap-12 sm:text-left">
        <Image
          src="/hero.jpg"
          alt={`Portrait of ${siteConfig.name}`}
          width={200}
          height={200}
          priority
          className="h-48 w-48 flex-none rounded-full object-cover sm:h-56 sm:w-56"
        />
        <div className="flex flex-col items-center gap-4 sm:items-start">
          <h1 className="text-display font-semibold">{siteConfig.name}</h1>
          <p className="text-heading font-semibold text-vermillion dark:text-vermillion-dark">
            {siteConfig.tagline}
          </p>
          <p className="max-w-md text-body">{siteConfig.role}</p>
          <Button href="/projects" variant="primary" className="mt-2">
            View My Projects
          </Button>
        </div>
      </Container>

      <Container className="py-16 sm:py-24">
        <h2 className="text-heading font-semibold">Featured Projects</h2>
        <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURED_PROJECTS.map((project) => (
            <Card key={project.slug} project={project} />
          ))}
        </div>
        <div className="mt-12 flex justify-center sm:justify-start">
          <Button href="/projects" variant="secondary">
            View all projects
          </Button>
        </div>
      </Container>
    </>
  );
}
