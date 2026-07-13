import { Container } from '@/components/ui/Container';
import { PostListRow } from '@/components/blog/PostListRow';
import { getAllPosts } from '@/lib/posts';

/**
 * Blog index (BLOG-01, D-01) — Server Component, static build-time read.
 * Renders every published post as a plain-list row (title, date, reading
 * time, excerpt, tags) — no Card grid, no images. Handles the zero-post
 * case defensively so the layout never breaks before real content ships.
 */
export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <Container className="py-16 sm:py-24">
      <h1 className="text-heading font-semibold sm:text-display">Blog</h1>
      <p className="mt-4 max-w-2xl text-body">
        Writing on software, aikido, and long-term investing — the compounding threads toward
        Japan.
      </p>
      {posts.length === 0 ? (
        <div className="mt-12">
          <h2 className="text-heading font-semibold">No posts yet</h2>
          <p className="mt-2 text-body">New writing is on the way — check back soon.</p>
        </div>
      ) : (
        <div className="mt-12">
          {posts.map((post) => (
            <PostListRow key={post.slug} post={post} />
          ))}
        </div>
      )}
    </Container>
  );
}
