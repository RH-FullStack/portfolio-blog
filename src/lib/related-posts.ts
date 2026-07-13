/**
 * Related-posts ranking (BLOG-05, D-05/D-06/D-08). Build-time only:
 * plain array ops over the in-memory posts array — no client cost.
 */
import type { Post } from '#site/content';

export function getRelatedPosts(current: Post, allPosts: Post[], limit = 3): Post[] {
  const others = allPosts.filter((p) => p.slug !== current.slug && !p.draft);
  const scored = others
    .map((post) => ({
      post,
      overlap: post.tags.filter((tag) => current.tags.includes(tag)).length,
    }))
    .sort((a, b) =>
      b.overlap !== a.overlap
        ? b.overlap - a.overlap
        : +new Date(b.post.date) - +new Date(a.post.date),
    );
  const withOverlap = scored.filter((s) => s.overlap > 0).map((s) => s.post);
  if (withOverlap.length >= limit) return withOverlap.slice(0, limit);
  const selectedSlugs = new Set(withOverlap.map((p) => p.slug));
  const backfill = others
    .filter((p) => !selectedSlugs.has(p.slug))
    .sort((a, b) => +new Date(b.date) - +new Date(a.date));
  return [...withOverlap, ...backfill].slice(0, limit);
}
