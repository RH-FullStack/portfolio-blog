/**
 * Tests for the related-posts ranking (BLOG-05, D-05/D-06/D-08).
 * Uses minimal inline Post fixtures — only the fields the algorithm reads
 * (slug, date, tags, draft) are set; other Post fields are cast as needed.
 */
import { describe, expect, it } from 'vitest';
import type { Post } from '#site/content';
import { getRelatedPosts } from './related-posts';

function makePost(overrides: Partial<Post> & { slug: string }): Post {
  return {
    title: overrides.slug,
    date: '2026-01-01',
    tags: [],
    excerpt: '',
    draft: false,
    metadata: { readingTime: 1, wordCount: 1 },
    code: '',
    ...overrides,
  } as Post;
}

describe('getRelatedPosts', () => {
  it('excludes the current post itself and any draft posts', () => {
    const current = makePost({ slug: 'current', tags: ['software'] });
    const draft = makePost({ slug: 'draft-post', tags: ['software'], draft: true });
    const other = makePost({ slug: 'other', tags: ['software'] });
    const all = [current, draft, other];

    const result = getRelatedPosts(current, all);

    expect(result.map((p) => p.slug)).not.toContain('current');
    expect(result.map((p) => p.slug)).not.toContain('draft-post');
    expect(result.map((p) => p.slug)).toEqual(['other']);
  });

  it('ranks posts with more shared tags ahead of posts with fewer (D-08)', () => {
    const current = makePost({ slug: 'current', tags: ['software', 'aikido', 'japan'] });
    const oneShared = makePost({ slug: 'one-shared', tags: ['software'], date: '2026-01-01' });
    const twoShared = makePost({ slug: 'two-shared', tags: ['software', 'aikido'], date: '2026-01-01' });
    const all = [current, oneShared, twoShared];

    const result = getRelatedPosts(current, all);

    expect(result.map((p) => p.slug)).toEqual(['two-shared', 'one-shared']);
  });

  it('breaks ties in shared-tag count by recency, newest first (D-08)', () => {
    const current = makePost({ slug: 'current', tags: ['software'] });
    const older = makePost({ slug: 'older', tags: ['software'], date: '2025-01-01' });
    const newer = makePost({ slug: 'newer', tags: ['software'], date: '2026-01-01' });
    const all = [current, older, newer];

    const result = getRelatedPosts(current, all);

    expect(result.map((p) => p.slug)).toEqual(['newer', 'older']);
  });

  it('backfills remaining slots with the most-recent other posts when fewer than limit share a tag (D-06)', () => {
    const current = makePost({ slug: 'current', tags: ['software'] });
    const shared = makePost({ slug: 'shared', tags: ['software'], date: '2026-01-01' });
    const unrelatedOld = makePost({ slug: 'unrelated-old', tags: ['aikido'], date: '2025-01-01' });
    const unrelatedNew = makePost({ slug: 'unrelated-new', tags: ['japan'], date: '2026-02-01' });
    const all = [current, shared, unrelatedOld, unrelatedNew];

    const result = getRelatedPosts(current, all, 3);

    expect(result.map((p) => p.slug)).toEqual(['shared', 'unrelated-new', 'unrelated-old']);
  });

  it('returns at most `limit` posts, defaulting to 3 (D-05)', () => {
    const current = makePost({ slug: 'current', tags: ['software'] });
    const others = ['a', 'b', 'c', 'd', 'e'].map((slug) =>
      makePost({ slug, tags: ['software'], date: '2026-01-01' }),
    );
    const all = [current, ...others];

    const result = getRelatedPosts(current, all);

    expect(result.length).toBe(3);
  });
});
