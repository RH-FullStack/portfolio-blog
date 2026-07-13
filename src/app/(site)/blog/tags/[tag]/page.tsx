import { notFound } from 'next/navigation';
import { Container } from '@/components/ui/Container';
import { PostListRow } from '@/components/blog/PostListRow';
import { getAllTags, getPostsByTag } from '@/lib/posts';

/**
 * Per-tag archive (BLOG-04, D-03) — Server Component, fully statically
 * generated. `generateStaticParams` maps `getAllTags()` (the real,
 * published tag set) and `dynamicParams = false` means any unknown tag
 * 404s at the CDN edge with no server-side rendering for arbitrary input
 * (ASVS V5, T-02-10) — no dynamic fallback branch. There is deliberately
 * no `/blog/tags` overview/index page (D-03).
 */
export function generateStaticParams() {
  return getAllTags().map((tag) => ({ tag }));
}

export const dynamicParams = false;

export default async function TagArchivePage({
  params,
}: {
  params: Promise<{ tag: string }>;
}) {
  const { tag } = await params;
  const posts = getPostsByTag(tag);

  if (posts.length === 0) {
    notFound();
  }

  return (
    <Container className="py-16 sm:py-24">
      <h1 className="text-heading font-semibold sm:text-display">Posts tagged &quot;{tag}&quot;</h1>
      <div className="mt-12">
        {posts.map((post) => (
          <PostListRow key={post.slug} post={post} />
        ))}
      </div>
    </Container>
  );
}
