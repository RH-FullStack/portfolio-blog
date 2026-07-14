import Image from 'next/image';
import { Button } from '@/components/ui/Button';
import { Tag } from '@/components/ui/Tag';
import type { Project } from '@/content/projects';

type CardProps = {
  project: Project;
};

/**
 * Project card primitive — renders a single project's title, summary,
 * tech-stack tags, and demo/code links.
 *
 * Demo/code links go through the `Button` primitive, which automatically
 * adds rel="noopener noreferrer" on any external target="_blank" anchor
 * (T-03-01 reverse-tabnabbing mitigation).
 *
 * Hover micro-interaction (subtle scale, D-03) uses Tailwind's `transition`
 * utility, which is already neutralized under prefers-reduced-motion by the
 * global reduced-motion rule in globals.css.
 */
export function Card({ project }: CardProps) {
  const { title, summary, tags, links, image } = project;

  return (
    <div className="flex flex-col overflow-hidden rounded-lg bg-secondary transition-transform duration-200 hover:scale-[1.02] hover:shadow-lg dark:bg-secondary-dark">
      <div className="relative aspect-video w-full">
        {image ? (
          <Image src={image.src} alt={image.alt} fill className="object-cover" />
        ) : (
          // Token-based placeholder: no screenshot yet, so render a paper
          // background + enso monogram instead of firing a broken image request.
          <div
            aria-hidden
            className="flex h-full w-full items-center justify-center bg-paper dark:bg-paper-dark"
          >
            <svg viewBox="0 0 32 32" className="h-12 w-12" aria-hidden="true">
              <path
                d="M16 5a11 11 0 1 1-7.8 3.2"
                fill="none"
                className="stroke-ink dark:stroke-ink-dark"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <path
                d="M16 11v10"
                fill="none"
                className="stroke-vermillion dark:stroke-vermillion-dark"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-3 p-6">
        <h3 className="text-heading font-semibold">{title}</h3>
        <p className="flex-1 text-body">{summary}</p>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <Tag key={tag}>{tag}</Tag>
          ))}
        </div>
        <div className="mt-2 flex flex-wrap gap-3">
          {links.demo && (
            <Button href={links.demo} target="_blank" variant="primary">
              Live Demo
            </Button>
          )}
          {links.code && (
            <Button href={links.code} target="_blank" variant="secondary">
              View Code
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
