import Image from 'next/image';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { siteConfig } from '@/lib/site-config';

/**
 * Homepage hero (Server Component) — proves the walking skeleton:
 * scaffold -> routing -> self-hosted fonts -> design tokens -> typed data
 * read -> one real client UI interaction (the theme toggle in the layout).
 */
export default function Home() {
  return (
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
  );
}
