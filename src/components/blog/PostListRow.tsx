/**
 * Shared post row (D-01 full index row / D-07 related / D-17 homepage
 * teaser). One component + `compact` variant per CONTEXT.md discretion
 * and RESEARCH.md structure rationale. Server Component — presentational.
 */
import Link from 'next/link';
import { Tag } from '@/components/ui/Tag';
import type { Post } from '#site/content';

const dateFmt = new Intl.DateTimeFormat('en-US', {
  timeZone: 'UTC',
  year: 'numeric',
  month: 'long',
  day: 'numeric',
});

type PostListRowProps = {
  post: Post;
  compact?: boolean;
};

export function PostListRow({ post, compact = false }: PostListRowProps) {
  const { title, date, slug, excerpt, tags, metadata } = post;
  return (
    <div className="border-t border-ink/10 py-6 dark:border-ink-dark/10">
      <Link
        href={`/blog/${slug}`}
        className={`${compact ? 'text-body' : 'text-heading'} font-semibold hover:text-vermillion focus-visible:text-vermillion focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-vermillion dark:hover:text-vermillion-dark dark:focus-visible:text-vermillion-dark dark:focus-visible:outline-vermillion-dark`}
      >
        {title}
      </Link>
      <p className="mt-1 text-label text-ink/70 dark:text-ink-dark/70">
        {dateFmt.format(new Date(date))}
        {!compact && ` · ${metadata.readingTime} min read`}
      </p>
      {!compact && (
        <>
          <p className="mt-2 text-body">{excerpt}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {tags.map((tag) => (
              <Tag key={tag} href={`/blog/tags/${tag}`}>
                {tag}
              </Tag>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
