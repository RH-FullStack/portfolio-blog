import type { Metadata } from 'next';
import Image from 'next/image';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Container } from '@/components/ui/Container';
import { siteConfig } from '@/lib/site-config';
import { projects } from '@/content/projects';
import { getAllPosts } from '@/lib/posts';
import { PostListRow } from '@/components/blog/PostListRow';

const FEATURED_PROJECTS = projects.slice(0, 3);
const LATEST_POSTS = getAllPosts().slice(0, 3);

export const metadata: Metadata = {
  description:
    "Software developer and aikidoka building toward a life split between Denmark and Japan — explore Rasmus Hansen's projects and writing.",
};

/**
 * Homepage (Server Component) — Hero + featured-projects teaser (D-07) +
 * latest-writing teaser (D-15..D-18).
 * Hero proves the walking skeleton: scaffold -> routing -> self-hosted
 * fonts -> design tokens -> typed data read -> one real client UI
 * interaction (the theme toggle in the layout). The featured-projects
 * teaser reuses the same typed `projects` data source that feeds the full
 * `/projects` index (PROJ-01) — one source, two views. The latest-writing
 * teaser below it reuses `getAllPosts()` (draft-safe, BLOG-01) with the
 * compact `PostListRow` variant — Projects keeps sole ownership of the
 * card treatment; the homepage never stacks two card grids.
 */
export default function Home() {
  return (
    <>
      <section className="relative flex min-h-[calc(100vh-4rem)] items-center overflow-hidden">
        <Image
          src="/Background.jpg"
          alt=""
          fill
          priority
          quality={70}
          sizes="100vw"
          className="object-cover"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-[linear-gradient(180deg,rgba(22,21,15,0.55),rgba(22,21,15,0.78))]"
        />
        <Container className="relative flex flex-col items-center justify-center gap-8 py-16 text-center sm:flex-row sm:gap-12 sm:text-left">
          <Image
            src="/hero.jpg"
            alt={`Portrait of ${siteConfig.name}`}
            width={200}
            height={200}
            className="h-48 w-48 flex-none rounded-full object-cover ring-2 ring-[rgba(245,242,234,0.9)] sm:h-56 sm:w-56"
          />
          <div className="flex flex-col items-center gap-4 sm:items-start">
            <h1 className="text-display font-semibold text-ink-dark">{siteConfig.name}</h1>
            <p className="text-heading font-semibold text-vermillion-dark">
              {siteConfig.tagline}
            </p>
            <p className="max-w-md text-body text-[#d8d4c8]">{siteConfig.role}</p>
            <Button href="/projects" variant="primary" className="mt-2">
              View My Projects
            </Button>
          </div>
        </Container>
      </section>

      <Container className="py-16 sm:py-24">
        <h2 className="text-heading font-semibold">Featured Projects</h2>
        <div
          className={
            FEATURED_PROJECTS.length === 1
              ? 'mt-12 grid grid-cols-1 gap-8 max-w-md'
              : 'mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3'
          }
        >
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

      <Container className="py-16 sm:py-24">
        <h2 className="text-heading font-semibold">Latest Writing</h2>
        <div className="mt-12">
          {LATEST_POSTS.map((post) => (
            <PostListRow key={post.slug} post={post} compact />
          ))}
        </div>
        <div className="mt-12 flex justify-center sm:justify-start">
          <Button href="/blog" variant="secondary">
            View all posts
          </Button>
        </div>
      </Container>
    </>
  );
}
