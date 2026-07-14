import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Container } from '@/components/ui/Container';
import { Prose } from '@/components/ui/Prose';
import { MDXContent } from '@/components/mdx/MDXContent';
import { PostListRow } from '@/components/blog/PostListRow';
import { getAllPosts, getPostBySlug } from '@/lib/posts';
import { getRelatedPosts } from '@/lib/related-posts';

/**
 * Post page (BLOG-02/03/05, D-05/D-06/D-07) — Server Component, fully
 * statically generated. `generateStaticParams` maps `getAllPosts()`
 * (already draft-filtered in lib/posts.ts, D-11 single-source rule) so
 * draft slugs never get a static path; `dynamicParams = false` means an
 * unknown slug 404s at the CDN edge instead of triggering on-demand
 * rendering (Security Domain T-02-10/T-02-11). Renders the MDX body via
 * Prose + MDXContent, followed by up to 3 related posts (compact rows,
 * D-07). No byline (D-12).
 */
export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {}; // page body's notFound() still handles the 404
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `/blog/${post.slug}` },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const related = getRelatedPosts(post, getAllPosts());

  return (
    <Container className="py-16 sm:py-24">
      <Prose>
        <h1 className="text-heading font-semibold sm:text-display">{post.title}</h1>
        <MDXContent code={post.code} />
      </Prose>
      {related.length > 0 && (
        <div className="mt-16 max-w-2xl">
          <h2 className="text-heading font-semibold">Related Posts</h2>
          <div className="mt-6">
            {related.map((relatedPost) => (
              <PostListRow key={relatedPost.slug} post={relatedPost} compact />
            ))}
          </div>
        </div>
      )}
    </Container>
  );
}
